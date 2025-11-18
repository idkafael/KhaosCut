'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function Home() {
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar o HTML original
    fetch('/index-original.html')
      .then(res => res.text())
      .then(html => {
        // Extrair apenas o conteúdo do body, removendo as tags html/head/body
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        
        // Pegar todo o conteúdo do body
        const bodyContent = doc.body.innerHTML
        
        // Pegar scripts do head que precisam ser executados
        const headScripts = Array.from(doc.head.querySelectorAll('script')).map(script => ({
          src: script.src || null,
          innerHTML: script.innerHTML,
          async: script.async,
          defer: script.defer
        }))
        
        setHtmlContent(bodyContent)
        
        // Executar scripts do head
        headScripts.forEach(scriptData => {
          if (scriptData.src) {
            const script = document.createElement('script')
            script.src = scriptData.src
            script.async = scriptData.async
            script.defer = scriptData.defer
            document.head.appendChild(script)
          } else if (scriptData.innerHTML) {
            const script = document.createElement('script')
            script.innerHTML = scriptData.innerHTML
            document.head.appendChild(script)
          }
        })
        
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
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
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  )
}
