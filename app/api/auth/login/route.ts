// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
  const { type, identifier, password } = await request.json()

  try {
    // 1. Procurar o utilizador no banco de dados local
    // Nota: Em produção, utilize hashing (como bcrypt) para as senhas
    const [user] = await sql`
      SELECT * FROM users 
      WHERE identifier = ${identifier} 
      AND type = ${type} 
      AND password = ${password}
      LIMIT 1
    `

    if (!user) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    // 2. Validação Específica para Visitantes/Advogados (Requisito SEAP)
    // É obrigatório validar a autorização ativa no SIPEN antes de permitir o acesso
    if (type === 'visitante' || type === 'advogado') {
      const isAuthorized = await checkSipenAuthorization(identifier, type)
      if (!isAuthorized) {
        return NextResponse.json({ 
          error: 'Acesso negado: Vínculo não autorizado ou vencido no SIPEN' 
        }, { status: 403 })
      }
    }

    // 3. Gerar Sessão/Token (Pode usar JWT ou similar)
    return NextResponse.json({ 
      user: { id: user.id, name: user.name, type: user.type } 
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// Função placeholder para a integração WebService exigida no edital [cite: 492, 930]
async function checkSipenAuthorization(id: string, type: string) {
  // Aqui será implementada a chamada ao WebService da Montreal/SIPEN
  // Por agora, retorna true para permitir o desenvolvimento da POC
  return true 
}