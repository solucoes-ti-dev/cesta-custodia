import type { Metadata } from 'next'
import { SWRProvider } from '@/lib/swr-provider'

export const metadata: Metadata = {
  title: 'Painel SEAP',
  description: 'Dashboard administrativo da SEAP para monitoramento de pedidos e auditoria.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SWRProvider>{children}</SWRProvider>
}
