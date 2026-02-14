'use client';

import { useState } from 'react';

interface KeyAuthProps {
  onKeyValid: (key: string) => Promise<boolean>;
}

export default function KeyAuth({ onKeyValid }: KeyAuthProps) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isValid = await onKeyValid(key);
      if (isValid) {
        setSuccess(true);
        setError('');
        // Mensagem de sucesso será mostrada brevemente antes do redirecionamento
      } else {
        setError('Key inválida. Por favor, verifique e tente novamente.');
        setSuccess(false);
      }
    } catch (err) {
      setError('Erro ao validar key. Tente novamente.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-background-card rounded-lg border border-border-default p-8 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 text-gradient-purple">
            Autenticação
          </h2>
          <p className="text-text-secondary text-sm">
            Insira sua key vitalícia para acessar
          </p>
          <p className="text-text-secondary text-xs mt-1">
            Uma vez validada, sua key será vitalícia e permanente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="key"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Key de Acesso
            </label>
            <input
              id="key"
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Digite sua key aqui"
              className="w-full px-4 py-3 bg-background-secondary border border-border-default rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 transition-colors"
              required
              disabled={loading}
            />
          </div>

          {success && (
            <div className="p-3 bg-green-900/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
              ✅ Key validada com sucesso! Acesso vitalício concedido.
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !key.trim()}
            className="w-full px-6 py-3 bg-purple-primary hover:bg-purple-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Validando...' : 'Acessar'}
          </button>
        </form>
      </div>
    </div>
  );
}
