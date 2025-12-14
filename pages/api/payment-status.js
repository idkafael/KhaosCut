// API Route para consultar status de pagamento (atualizado pelo webhook)
// Este endpoint é consultado pelo frontend em vez de fazer polling na API PushinPay

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

    // Verificar se o status está no cache (atualizado pelo webhook)
    const cachedStatus = global.paymentStatus[transactionId];

    if (cachedStatus) {
      console.log(`📊 Status encontrado no cache para ${transactionId}:`, cachedStatus.status);
      
      return res.status(200).json({
        success: true,
        source: 'webhook',
        ...cachedStatus
      });
    }

    // Se não estiver no cache, retornar pending
    // Isso significa que o webhook ainda não foi recebido
    console.log(`⏳ Status não encontrado no cache para ${transactionId} - aguardando webhook...`);
    
    return res.status(200).json({
      success: true,
      source: 'cache',
      status: 'pending',
      confirmed: false,
      message: 'Aguardando confirmação via webhook'
    });

  } catch (error) {
    console.error('❌ Erro ao consultar status:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao consultar status de pagamento'
    });
  }
}

