'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'validated_key_vitalicia';
const STORAGE_TIMESTAMP = 'key_validated_at';

export function useKeyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há uma key vitalícia válida no localStorage
    // Keys são vitalícias - uma vez validadas, permanecem válidas para sempre
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey) {
      // Key vitalícia encontrada - autenticar automaticamente
      setIsAuthenticated(true);
    }
  }, []);

  const validateKey = async (key: string): Promise<boolean> => {
    try {
      // Validar key no servidor apenas uma vez
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });

      const data = await response.json();

      if (data.valid) {
        // Key válida - salvar como vitalícia no localStorage
        // Uma vez validada, nunca expira
        localStorage.setItem(STORAGE_KEY, key);
        localStorage.setItem(STORAGE_TIMESTAMP, new Date().toISOString());
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro ao validar key:', error);
      return false;
    }
  };

  const logout = () => {
    // Remover key vitalícia do localStorage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    validateKey,
    logout,
  };
}
