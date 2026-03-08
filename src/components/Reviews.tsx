type Review = {
  id: number
  autor: string
  rating: number
  texto: string
}

type Props = {
  items: Review[]
  productId: string
}

export default function Reviews({ items, productId }: Props) {
  if (items.length === 0) {
    return (
      <div style={{ padding: '16px', color: '#888' }}>
        Nenhuma avaliação ainda para este produto.
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px' }}>
      <h3 style={{ marginBottom: '12px' }}>
        Avaliações ({items.length})
      </h3>
      {items.map((review) => (
        <div key={review.id} style={{
          borderBottom: '1px solid #eee',
          padding: '12px 0'
        }}>
          <strong>{review.autor}</strong>
          <span style={{ marginLeft: '8px', color: '#f5a623' }}>
            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
          </span>
          <p style={{ margin: '4px 0 0', color: '#444' }}>
            {review.texto}
          </p>
        </div>
      ))}
    </div>
  )
}