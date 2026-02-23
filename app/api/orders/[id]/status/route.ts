import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { status } = await request.json()

  const validStatuses = ['PENDING_SIPEN', 'PAID', 'PREPARING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Status invalido' }, { status: 400 })
  }

  const currentOrder = await sql`SELECT status FROM orders WHERE id = ${id}`
  if (currentOrder.length === 0) {
    return NextResponse.json({ error: 'Pedido nao encontrado' }, { status: 404 })
  }

  await sql`UPDATE orders SET status = ${status}, updated_at = now() WHERE id = ${id}`

  await sql`
    INSERT INTO audit_logs (order_id, action, details)
    VALUES (${id}, 'STATUS_ALTERADO', ${JSON.stringify({ from: currentOrder[0].status, to: status })})
  `

  return NextResponse.json({ success: true })
}
