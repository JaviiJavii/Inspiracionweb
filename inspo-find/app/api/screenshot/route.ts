import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  const src = req.nextUrl.searchParams.get('src') || 'microlink'

  if (!url) return NextResponse.json({ error: 'URL requerida' }, { status: 400 })

  let screenshotUrl = ''

  if (src === 'microlink') {
    screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
  } else if (src === 'thumbio') {
    screenshotUrl = `https://image.thum.io/get/width/600/crop/400/${encodeURIComponent(url)}`
  }

  try {
    const response = await fetch(screenshotUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InspoFind/1.0)' },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) throw new Error('Screenshot failed')

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Screenshot no disponible' }, { status: 422 })
  }
}
