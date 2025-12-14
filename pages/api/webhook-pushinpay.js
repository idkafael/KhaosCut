// API Route para receber webhooks da PushinPay
// Documentação: https://app.theneo.io/pushinpay/pix

export default async function handler(req, res) {
  // Apenas permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Validar header x-pushinpay-token (segurança)
    const webhookToken = req.headers['x-pushinpay-token'];
    const expectedToken = process.env.PUSHINPAY_WEBHOOK_TOKEN;
    
    if (expectedToken && webhookToken !== expectedToken) {
      console.error('❌ Webhook token inválido:', {
        recebido: webhookToken ? 'presente' : 'ausente',
        esperado: expectedToken ? 'configurado' : 'não configurado'
      });
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    const webhookData = req.body;
    
    console.log('📥 Webhook recebido da PushinPay:', JSON.stringify(webhookData, null, 2));
    console.log('🔍 Headers recebidos:', {
      'x-pushinpay-token': webhookToken ? 'presente' : 'ausente',
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent']
    });
    
    // Extrair dados do webhook
    // A estrutura pode variar - ajuste conforme a documentação da PushinPay
    const transactionId = webhookData.id || webhookData.transaction_id || webhookData.transactionId;
    const status = webhookData.status || webhookData.payment_status;
    const amount = webhookData.value || webhookData.amount;
    const paidAt = webhookData.paid_at || webhookData.payment_date;
    
    if (!transactionId) {
      console.error('❌ Webhook sem transaction ID');
      console.error('❌ Dados recebidos:', JSON.stringify(webhookData, null, 2));
      return res.status(400).json({ error: 'Transaction ID não encontrado' });
    }
    
    console.log('🔍 Processando webhook:', {
      transactionId,
      status,
      amount,
      paidAt
    });
    
    // Verificar se o pagamento foi confirmado
    const statusLower = (status || '').toLowerCase();
    const isPagamentoConfirmado = 
      statusLower === 'paid' || 
      statusLower === 'approved' || 
      statusLower === 'confirmed' ||
      statusLower === 'pago' ||
      !!paidAt; // Se tiver paid_at, considerar como pago

    // Inicializar cache de status de pagamento (em memória)
    if (typeof global.paymentStatus === 'undefined') {
      global.paymentStatus = {};
    }

    // SEMPRE salvar qualquer status recebido do webhook
    const statusToSave = {
      status: isPagamentoConfirmado ? 'paid' : statusLower,
      confirmed: isPagamentoConfirmado,
      updatedAt: new Date().toISOString(),
      amount: amount || webhookData.value,
      paidAt: paidAt || webhookData.paid_at || webhookData.payment_date,
      originalStatus: status,
      webhookData: webhookData // Manter dados completos para debug
    };

    if (isPagamentoConfirmado) {
      statusToSave.confirmedAt = new Date().toISOString();
      console.log('✅✅✅ PAGAMENTO CONFIRMADO VIA WEBHOOK!');
      console.log('📊 Detalhes:', {
        transactionId,
        status,
        statusLower,
        amount,
        paidAt,
        isPagamentoConfirmado
      });
    } else if (statusLower === 'canceled' || statusLower === 'cancelled') {
      console.log('❌ Pagamento cancelado via webhook:', transactionId);
      statusToSave.status = 'canceled';
    } else {
      console.log('⏳ Status do pagamento recebido via webhook:', status, statusLower);
    }

    // Salvar no cache
    global.paymentStatus[transactionId] = statusToSave;
    
    console.log('💾 Status salvo no cache:', transactionId);
    console.log('💾 Dados salvos:', JSON.stringify(statusToSave, null, 2));
    console.log('💾 Cache completo (chaves):', Object.keys(global.paymentStatus));
    
    // Sempre retornar 200 para a PushinPay
    // Mesmo se houver erro, retornar 200 para evitar retentativas desnecessárias
    return res.status(200).json({ 
      success: true,
      message: 'Webhook processado com sucesso',
      transactionId,
      status
    });
    
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    console.error('❌ Stack trace:', error.stack);
    
    // Retornar 200 mesmo em caso de erro para evitar retentativas
    // Ou retornar 500 se quiser que a PushinPay tente novamente
    return res.status(200).json({ 
      success: false,
      error: error.message 
    });
  }
}



