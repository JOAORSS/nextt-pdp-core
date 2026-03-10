import { renderToReadableStream } from 'react-dom/server.edge'
import Reviews from '@/components/Reviews'
import { getDb } from '@/lib/db'

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
    const db = getDb()
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

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 's-maxage=60, stale-while-revalidate',
      ...CORS_HEADERS,
    },
  })
}
