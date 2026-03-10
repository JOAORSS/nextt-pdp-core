import { renderToReadableStream } from 'react-dom/server.edge'
import { createClient } from '@libsql/client/http'
import Reviews from '@/components/Reviews'

export const runtime = 'edge'

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

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

  let reviews = []
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      args: [productId],
    })

    reviews = result.rows.map((row) => ({
      id: row.id as number,
      autor: row.autor as string,
      rating: row.rating as number,
      texto: row.texto as string,
    }))
  } catch (error) {
    console.error(error)
    return new Response('Erro interno', {
      status: 500,
      headers: CORS_HEADERS,
    })
  }

  const stream = await renderToReadableStream(<Reviews items={reviews} />)
  await stream.allReady

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      ...CORS_HEADERS,
    },
  })
}
