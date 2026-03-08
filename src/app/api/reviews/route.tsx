import { renderToString } from 'react-dom/server'
import Reviews from '@/components/Reviews'
import { getDb } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('product')

  // valida o parâmetro
  if (!productId) {
    return new Response('Parâmetro product é obrigatório', { status: 400 })
  }

  try {
    const db = getDb()
    const result = await db.execute({
      sql: 'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      args: [productId],
    })

    const reviews = result.rows.map((row) => ({
      id: row.id as number,
      autor: row.autor as string,
      rating: row.rating as number,
      texto: row.texto as string,
    }))

    const html = renderToString(<Reviews items={reviews} productId={productId} />)

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': process.env.CLIENT_DOMAIN || '*',
        'Cache-Control': 's-maxage=60, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error(error)
    return new Response('Erro interno', { status: 500 })
  }
}