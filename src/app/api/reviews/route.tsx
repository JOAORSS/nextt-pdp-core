import {getDb} from '@/lib/db'

// /api/reviews
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

    const html = renderReviews(reviews, productId);

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

type Review = {
  id: number
  autor: string
  rating: number
  texto: string
}

function renderReviews(items: Review[], productId: string): string {
  if (items.length === 0) {
    return `<div style="padding:16px;color:#888">Nenhuma avaliação ainda para este produto.</div>`
  }

  const reviewsHtml = items.map((review) => `
    <div style="border-bottom:1px solid #eee;padding:12px 0">
      <strong>${review.autor}</strong>
      <span style="margin-left:8px;color:#f5a623">
        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
      </span>
      <p style="margin:4px 0 0;color:#444">${review.texto}</p>
    </div>
  `).join('')

  return `
    <div style="font-family:sans-serif;padding:16px">
      <h3 style="margin-bottom:12px">Avaliações (${items.length})</h3>
      ${reviewsHtml}
    </div>
  `
}