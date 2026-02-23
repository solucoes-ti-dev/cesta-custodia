import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const logs = await sql`
    SELECT al.*, u.email as user_email
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT 100
  `

  return NextResponse.json(logs)
}
