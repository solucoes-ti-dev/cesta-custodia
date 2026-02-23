import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const registration = searchParams.get('registration')

  if (!registration) {
    return NextResponse.json({ error: 'Matricula obrigatoria' }, { status: 400 })
  }

  const inmates = await sql`
    SELECT i.*, pu.name as prison_unit_name 
    FROM inmates i
    JOIN prison_units pu ON i.prison_unit_id = pu.id
    WHERE i.registration = ${registration}
  `

  if (inmates.length === 0) {
    return NextResponse.json({ error: 'Interno nao encontrado' }, { status: 404 })
  }

  return NextResponse.json(inmates[0])
}
