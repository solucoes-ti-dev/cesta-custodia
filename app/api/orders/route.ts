import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { calcularFrete, calcularFuespTax } from '@/lib/types'

export async function GET() {
  const orders = await sql`
    SELECT o.*, 
      b.name as buyer_name, b.cpf as buyer_cpf,
      i.name as inmate_name, i.registration as inmate_registration,
      pu.name as prison_unit_name,
      (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
    FROM orders o
    JOIN buyers b ON o.buyer_id = b.id
    JOIN inmates i ON o.inmate_id = i.id
    JOIN prison_units pu ON i.prison_unit_id = pu.id
    ORDER BY o.created_at DESC
  `

  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { buyer_id, inmate_id, items, prescription_url } = body

  if (!buyer_id || !inmate_id || !items || items.length === 0) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  // Calculate totals
  let totalValue = 0
  for (const item of items) {
    totalValue += item.price * item.quantity
  }

  const deliveryFee = calcularFrete(totalValue)
  const fuespTax = calcularFuespTax(totalValue)

  // Simulate SIPEN validation
  const sipenProtocol = `SIPEN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`

  // Create order
  const orderResult = await sql`
    INSERT INTO orders (buyer_id, inmate_id, status, sipen_protocol, total_value, delivery_fee, fuesp_tax, prescription_url)
    VALUES (${buyer_id}, ${inmate_id}, 'PAID', ${sipenProtocol}, ${totalValue}, ${deliveryFee}, ${fuespTax}, ${prescription_url || null})
    RETURNING id
  `

  const orderId = orderResult[0].id

  // Insert order items
  for (const item of items) {
    await sql`
      INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
      VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price})
    `
  }

  // Audit log
  await sql`
    INSERT INTO audit_logs (user_id, order_id, action, details)
    VALUES (${null}, ${orderId}, 'PEDIDO_CRIADO', ${JSON.stringify({ sipen_protocol: sipenProtocol, total_value: totalValue })})
  `

  await sql`
    INSERT INTO audit_logs (user_id, order_id, action, details)
    VALUES (${null}, ${orderId}, 'VALIDACAO_SIPEN', ${JSON.stringify({ protocol: sipenProtocol, result: 'APROVADO' })})
  `

  return NextResponse.json({ id: orderId, sipen_protocol: sipenProtocol }, { status: 201 })
}
