'use server'
import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'

function bufferToBase64(buffer) {
    return `data:image/png;base64,${buffer.toString('base64')}`
}

async function getFileBufferLocal(filepath) {
    const realFilepath = path.join(process.cwd(), 'public', filepath)
    return fs.readFile(realFilepath)
}

export async function getPlaceholderImage(filepath) {
    try {
        const originalBuffer = await getFileBufferLocal(filepath)
        const resizedBuffer = await sharp(originalBuffer)
            .resize({ width: 20, height: 20, fit: 'inside' })
            .toBuffer()
        return {
            src: filepath,
            placeholder: bufferToBase64(resizedBuffer),
        }
    } catch {
        return {
            src: filepath,
            placeholder:
                'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsa2yqBwAFCAICLICSyQAAAABJRU5ErkJggg==',
        }
    }
}
