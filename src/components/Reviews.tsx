export interface ReviewType {
  id: number
  autor: string
  rating: number
  texto: string
}

type Props = {
  items: ReviewType[]
}

export default function Reviews({ items }: Props) {
  if (!items.length) {
    return <p style={{ color: '#888' }}>Nenhuma avaliação ainda.</p>
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h3>Avaliações ({items.length})</h3>
      {items.map((review) => (
        <div key={review.id} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
          <strong>{review.autor}</strong>
          <span style={{ marginLeft: 8, color: '#f5a623' }}>
            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
          </span>
          <p style={{ margin: '4px 0 0', color: '#444' }}>{review.texto}</p>
        </div>
      ))}
    </div>
  )
}