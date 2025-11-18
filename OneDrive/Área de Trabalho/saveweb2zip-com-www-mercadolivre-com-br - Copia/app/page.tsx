import { readFile } from 'fs/promises'
import { join } from 'path'
import IndexContent from './index-content'

export default async function Home() {
  let htmlContent = ''
  
  try {
    const filePath = join(process.cwd(), 'public', 'index-original.html')
    htmlContent = await readFile(filePath, 'utf-8')
  } catch (error: any) {
    console.error('Error reading HTML file:', error?.message || error)
    // Fallback: retornar HTML vazio para mostrar mensagem de erro
  }

  return <IndexContent htmlContent={htmlContent} />
}
