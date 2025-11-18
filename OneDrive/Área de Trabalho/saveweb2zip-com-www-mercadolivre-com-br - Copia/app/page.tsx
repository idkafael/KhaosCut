import { readFile } from 'fs/promises'
import { join } from 'path'
import IndexContent from './index-content'

export default async function Home() {
  let htmlContent = ''
  
  try {
    const filePath = join(process.cwd(), 'public', 'index-original.html')
    htmlContent = await readFile(filePath, 'utf-8')
  } catch (error) {
    console.error('Error reading HTML file:', error)
  }

  return <IndexContent htmlContent={htmlContent} />
}
