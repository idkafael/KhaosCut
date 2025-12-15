// Webhook para receber notificações da PushinPay
// Este endpoint é chamado automaticamente pela PushinPay quando o status do pagamento muda

export default async function handler(req, res) {
  // Apenas permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const payload = req.body;
    
    console.log('📥 Webhook PushinPay recebido:', JSON.stringify(payload, null, 2));

    // Validar se o payload contém dados da transação
    if (!payload || !payload.id) {
      console.warn('⚠️ Webhook recebido sem ID de transação');
      return res.status(400).json({ error: 'Payload inválido' });
    }

    const transactionId = payload.id;
    const status = payload.status?.toLowerCase() || 'unknown';
    const value = payload.value || payload.amount;

    console.log(`📊 Webhook - Transação ${transactionId}: Status = ${status}, Valor = ${value}`);

    // Verificar se o pagamento foi confirmado
    const isPagamentoConfirmado = status === 'paid' || status === 'approved' || status === 'confirmed';

    if (isPagamentoConfirmado) {
      console.log('✅✅✅ PAGAMENTO CONFIRMADO VIA WEBHOOK!');
      console.log(`💰 Transação: ${transactionId}, Valor: ${value}`);

      // Enviar notificação via Telegram (se configurado)
      try {
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;

        if (telegramToken && telegramChatId) {
          const valorEmReais = (value / 100).toFixed(2);
          const mensagem = `🎉 *Pagamento Confirmado!*\n\n` +
            `💰 Valor: R$ ${valorEmReais}\n` +
            `🆔 ID: ${transactionId}\n` +
            `✅ Status: ${status}\n` +
            `⏰ ${new Date().toLocaleString('pt-BR')}`;

          await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: mensagem,
              parse_mode: 'Markdown'
            })
          });

          console.log('✅ Notificação enviada para Telegram');
        }
      } catch (telegramError) {
        console.warn('⚠️ Erro ao enviar notificação Telegram:', telegramError);
        // Não falhar o webhook se o Telegram falhar
      }

      // Aqui você pode adicionar outras ações:
      // - Salvar no banco de dados
      // - Enviar email
      // - Atualizar status no sistema
      // - etc.
    } else if (status === 'canceled' || status === 'cancelled') {
      console.log(`❌ Pagamento cancelado: ${transactionId}`);
    } else {
      console.log(`⏳ Status intermediário: ${status} para transação ${transactionId}`);
    }

    // Sempre retornar 200 para a PushinPay
    // Isso confirma que recebemos a notificação
    return res.status(200).json({ 
      success: true,
      message: 'Webhook recebido com sucesso',
      transactionId: transactionId,
      status: status
    });

  } catch (error) {
    console.error('❌ Erro ao processar webhook PushinPay:', error);
    
    // Mesmo em caso de erro, retornar 200 para a PushinPay
    // para evitar que ela tente reenviar múltiplas vezes
    return res.status(200).json({ 
      success: false,
      error: 'Erro ao processar webhook',
      message: error.message 
    });
  }
}

