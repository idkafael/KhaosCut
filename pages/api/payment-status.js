// API Route para consultar status de pagamento (atualizado pelo webhook)
// Este endpoint é consultado pelo frontend em vez de fazer polling na API PushinPay
// FALLBACK: Se não encontrar no cache do webhook, consulta a API PushinPay diretamente

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { transactionId } = req.query;

  if (!transactionId) {
    return res.status(400).json({ 
      error: 'transactionId é obrigatório',
      message: 'Forneça o transactionId como query parameter: ?transactionId=xxx'
    });
  }

  try {
    // Inicializar cache se não existir
    if (typeof global.paymentStatus === 'undefined') {
      global.paymentStatus = {};
    }

    // PRIMEIRO: Verificar se o status está no cache (atualizado pelo webhook)
    const cachedStatus = global.paymentStatus[transactionId];

    if (cachedStatus && cachedStatus.confirmed) {
      console.log(`✅ Status confirmado encontrado no cache (webhook) para ${transactionId}:`, cachedStatus.status);
      
      return res.status(200).json({
        success: true,
        source: 'webhook',
        ...cachedStatus
      });
    }

    // SEGUNDO: Se não estiver no cache confirmado, consultar API PushinPay como fallback
    console.log(`🔍 Cache não tem confirmação para ${transactionId} - consultando API PushinPay como fallback...`);
    
    const apiToken = process.env.PUSHINPAY_TOKEN;
    if (!apiToken) {
      console.warn('⚠️ PUSHINPAY_TOKEN não configurado - retornando pending');
      return res.status(200).json({
        success: true,
        source: 'fallback',
        status: 'pending',
        confirmed: false,
        message: 'Aguardando confirmação'
      });
    }

    // Tentar consultar a API PushinPay
    const apiBaseUrl = 'https://api.pushinpay.com.br/api';
    const endpointsPossiveis = [
      { path: `/transaction/${transactionId}`, method: 'GET' },
      { path: `/pix/transaction/${transactionId}`, method: 'GET' },
      { path: `/pix/${transactionId}`, method: 'GET' }
    ];

    for (const endpointConfig of endpointsPossiveis) {
      try {
        const url = `${apiBaseUrl}${endpointConfig.path}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos por endpoint

        const response = await fetch(url, {
          method: endpointConfig.method,
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Accept': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.status === 200) {
          const statusData = await response.json();
          
          // Extrair status
          let status = (statusData.status || statusData.payment_status || 'pending')?.toLowerCase();
          const hasPaidAt = statusData.paid_at || statusData.payment_date;
          
          // Se tiver paid_at, considerar como pago
          if (hasPaidAt && (status === 'pending' || status === 'created')) {
            status = 'paid';
          }

          const isPaid = status === 'paid' || status === 'approved' || status === 'confirmed' || status === 'pago' || hasPaidAt;

          console.log(`📊 Status da API PushinPay para ${transactionId}:`, status, isPaid ? '(PAGO!)' : '(pendente)');

          // Salvar no cache para próximas consultas
          if (isPaid) {
            global.paymentStatus[transactionId] = {
              status: 'paid',
              confirmed: true,
              confirmedAt: new Date().toISOString(),
              amount: statusData.value || statusData.amount,
              paidAt: hasPaidAt,
              source: 'api-fallback',
              originalStatus: status
            };
          }

          return res.status(200).json({
            success: true,
            source: 'api-fallback',
            status: isPaid ? 'paid' : status,
            confirmed: isPaid,
            amount: statusData.value || statusData.amount,
            paidAt: hasPaidAt,
            data: statusData
          });
        }
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          console.log(`⚠️ Erro ao consultar ${endpointConfig.path}:`, fetchError.message);
        }
        continue;
      }
    }

    // Se nenhum endpoint funcionou, retornar pending
    console.log(`⏳ Nenhum endpoint da API funcionou para ${transactionId} - retornando pending`);
    
    return res.status(200).json({
      success: true,
      source: 'fallback',
      status: 'pending',
      confirmed: false,
      message: 'Aguardando confirmação via webhook ou API'
    });

  } catch (error) {
    console.error('❌ Erro ao consultar status:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao consultar status de pagamento'
    });
  }
}

