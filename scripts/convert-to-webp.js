import sharp from 'sharp'
import { readdirSync, existsSync } from 'fs'
import { join, extname, basename } from 'path'

const imgDir = './public/img'
const files = readdirSync(imgDir)

let converted = 0
let skipped = 0

for (const file of files) {
  const ext = extname(file).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) { skipped++; continue }

  const input  = join(imgDir, file)
  const output = join(imgDir, basename(file, ext) + '.webp')

  if (existsSync(output)) { console.log(`⏭  already exists: ${file}`); skipped++; continue }

  await sharp(input).webp({ quality: 82 }).toFile(output)
  console.log(`✓  ${file} → ${basename(file, ext)}.webp`)
  converted++
}

console.log(`\nDone: ${converted} converted, ${skipped} skipped.`)
