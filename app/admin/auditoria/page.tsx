'use client'

import useSWR from 'swr'
import { ScrollText, RefreshCw, FileCheck, AlertTriangle, Settings, ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminShell } from '@/components/admin-shell'
import { formatDate } from '@/lib/types'
import type { AuditLog } from '@/lib/types'

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  PEDIDO_CRIADO: { icon: ShoppingCart, color: 'bg-accent/15 text-accent border-accent/30', label: 'Pedido Criado' },
  VALIDACAO_SIPEN: { icon: FileCheck, color: 'bg-chart-1/15 text-chart-1 border-chart-1/30', label: 'Validacao SIPEN' },
  STATUS_ALTERADO: { icon: Settings, color: 'bg-chart-4/15 text-chart-4 border-chart-4/30', label: 'Status Alterado' },
  ALTERACAO_PRECO: { icon: AlertTriangle, color: 'bg-chart-3/15 text-chart-3 border-chart-3/30', label: 'Alteracao Preco' },
}

export default function AuditoriaPage() {
  const { data: logs, isLoading, mutate } = useSWR<AuditLog[]>('/api/admin/audit')

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Auditoria</h1>
            <p className="text-sm text-muted-foreground">
              Registro imutavel de todas as acoes criticas do sistema.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => mutate()} className="gap-1">
            <RefreshCw className="h-3.5 w-3.5" />
            Atualizar
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="divide-y divide-border">
                {logs.map((log) => {
                  const config = ACTION_CONFIG[log.action] || {
                    icon: ScrollText,
                    color: 'bg-muted text-muted-foreground border-border',
                    label: log.action,
                  }
                  const Icon = config.icon

                  return (
                    <div key={log.id} className="flex gap-4 p-4 hover:bg-secondary/20">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={`text-[10px] ${config.color}`}>
                            {config.label}
                          </Badge>
                          {log.user_email && (
                            <span className="text-xs text-muted-foreground">por {log.user_email}</span>
                          )}
                        </div>
                        <div className="rounded-md bg-secondary/50 p-2 font-mono text-xs text-muted-foreground">
                          {JSON.stringify(log.details, null, 2)}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span>{formatDate(log.created_at)}</span>
                          {log.order_id && (
                            <span className="font-mono">Pedido: {log.order_id.slice(0, 8)}...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <ScrollText className="h-10 w-10 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">Nenhum registro de auditoria encontrado.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
