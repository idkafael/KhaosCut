'use client'

import { useEffect, useState } from 'react'

interface IndexContentProps {
  htmlContent: string
}

export default function IndexContent({ htmlContent }: IndexContentProps) {
  const [bodyContent, setBodyContent] = useState<string>('')

  useEffect(() => {
    if (!htmlContent) {
      return
    }

    // Extrair apenas o conteúdo do body, removendo as tags html/head/body
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    
    // Pegar todo o conteúdo do body
    const body = doc.body.innerHTML
    setBodyContent(body)
    
    // Pegar scripts do head que precisam ser executados
    const headScripts = Array.from(doc.head.querySelectorAll('script'))
    
    // Executar scripts do head
    headScripts.forEach(script => {
      if (script.src) {
        const newScript = document.createElement('script')
        newScript.src = script.src
        newScript.async = script.async
        newScript.defer = script.defer
        if (!document.head.querySelector(`script[src="${script.src}"]`)) {
          document.head.appendChild(newScript)
        }
      } else if (script.innerHTML) {
        const newScript = document.createElement('script')
        newScript.innerHTML = script.innerHTML
        if (!document.head.querySelector(`script:not([src])`)) {
          document.head.appendChild(newScript)
        }
      }
    })
  }, [htmlContent])

  if (!htmlContent) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        background: '#fff'
      }}>
        <p style={{
          fontSize: '20px',
          color: 'rgba(0,0,0,.9)',
          marginBottom: '24px',
          fontWeight: 400
        }}>
          Carregando...
        </p>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e6e6e6',
          borderTop: '4px solid #3483fa',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
  )
}

