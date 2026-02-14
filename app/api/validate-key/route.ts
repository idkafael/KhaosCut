import { NextRequest, NextResponse } from 'next/server';
import { validateKey } from '@/lib/keyValidator';

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Key inválida' },
        { status: 400 }
      );
    }

    // Verificar se está em produção
    // Em produção: remover key após uso (uma key = um usuário)
    // Em desenvolvimento: manter keys para reutilização
    const isProduction = process.env.NODE_ENV === 'production';
    const removeAfterUse = isProduction;

    // Validar key (em produção, a key será removida automaticamente se válida)
    const isValid = await validateKey(key, removeAfterUse);

    if (isValid) {
      // Key válida - será salva como vitalícia no cliente
      // Em produção, a key já foi removida do arquivo (uso único garantido)
      return NextResponse.json({ 
        valid: true, 
        message: isProduction 
          ? 'Key válida - acesso vitalício concedido (uso único)' 
          : 'Key válida - acesso vitalício concedido',
        removed: removeAfterUse, // Informar se foi removida
        isProduction: isProduction
      });
    } else {
      // Key inválida ou já foi usada (em produção)
      return NextResponse.json(
        { 
          valid: false, 
          message: isProduction 
            ? 'Key inválida, não encontrada ou já foi utilizada (uso único)' 
            : 'Key inválida ou não encontrada' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erro ao validar key:', error);
    return NextResponse.json(
      { valid: false, message: 'Erro ao validar key' },
      { status: 500 }
    );
  }
}
