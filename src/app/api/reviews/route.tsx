import { renderToReadableStream } from 'react-dom/server.edge'
import Reviews, { ReviewType } from '@/components/Reviews'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.CLIENT_DOMAIN || '*',
  'Access-Control-Allow-Methods': 'GET',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('product')

  if (!productId) {
    return new Response('Parâmetro product é obrigatório', {
      status: 400,
      headers: CORS_HEADERS,
    })
  }

  const reviews = [] as ReviewType[]

  const stream = await renderToReadableStream(<Reviews items={reviews} />)

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 's-maxage=60, stale-while-revalidate',
      ...CORS_HEADERS,
    },
  })
}
