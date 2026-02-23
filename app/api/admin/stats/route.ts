import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const [totalOrders] = await sql`SELECT COUNT(*) as count FROM orders`
  const [totalRevenue] = await sql`SELECT COALESCE(SUM(total_value), 0) as total FROM orders WHERE status != 'CANCELLED'`
  const [totalDeliveryFees] = await sql`SELECT COALESCE(SUM(delivery_fee), 0) as total FROM orders WHERE status != 'CANCELLED'`
  const [totalFuespTax] = await sql`SELECT COALESCE(SUM(fuesp_tax), 0) as total FROM orders WHERE status != 'CANCELLED'`
  const [pendingOrders] = await sql`SELECT COUNT(*) as count FROM orders WHERE status IN ('PENDING_SIPEN', 'PAID', 'PREPARING')`
  const [deliveredOrders] = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'DELIVERED'`
  const [totalProducts] = await sql`SELECT COUNT(*) as count FROM products WHERE is_active = true`
  const [totalInmates] = await sql`SELECT COUNT(*) as count FROM inmates`

  const statusBreakdown = await sql`
    SELECT status, COUNT(*) as count 
    FROM orders 
    GROUP BY status
  `

  const categoryBreakdown = await sql`
    SELECT p.category, COUNT(DISTINCT oi.order_id) as order_count, SUM(oi.quantity * oi.price_at_purchase) as revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY p.category
  `

  const recentOrders = await sql`
    SELECT o.id, o.status, o.total_value, o.created_at,
      b.name as buyer_name, i.name as inmate_name
    FROM orders o
    JOIN buyers b ON o.buyer_id = b.id
    JOIN inmates i ON o.inmate_id = i.id
    ORDER BY o.created_at DESC
    LIMIT 5
  `

  return NextResponse.json({
    total_orders: Number(totalOrders.count),
    total_revenue: Number(totalRevenue.total),
    total_delivery_fees: Number(totalDeliveryFees.total),
    total_fuesp_tax: Number(totalFuespTax.total),
    pending_orders: Number(pendingOrders.count),
    delivered_orders: Number(deliveredOrders.count),
    total_products: Number(totalProducts.count),
    total_inmates: Number(totalInmates.count),
    status_breakdown: statusBreakdown,
    category_breakdown: categoryBreakdown,
    recent_orders: recentOrders,
  })
}
