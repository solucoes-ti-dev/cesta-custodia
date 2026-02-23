import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let products
  if (category && category !== 'ALL') {
    products = await sql`
      SELECT * FROM products 
      WHERE is_active = true AND category = ${category}
      ORDER BY category, name
    `
  } else {
    products = await sql`
      SELECT * FROM products 
      WHERE is_active = true
      ORDER BY category, name
    `
  }

  return NextResponse.json(products)
}
