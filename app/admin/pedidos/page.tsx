'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Filter, Eye, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { AdminShell } from '@/components/admin-shell'
import {
  formatCurrency,
  formatDate,
  ORDER_STATUS_LABELS,
  type Order,
  type OrderStatus,
  type OrderItem,
} from '@/lib/types'
import { toast } from 'sonner'

const STATUS_COLORS: Record<string, string> = {
  PENDING_SIPEN: 'bg-chart-3/15 text-chart-3 border-chart-3/30',
  PAID: 'bg-chart-1/15 text-chart-1 border-chart-1/30',
  PREPARING: 'bg-chart-4/15 text-chart-4 border-chart-4/30',
  IN_TRANSIT: 'bg-chart-2/15 text-chart-2 border-chart-2/30',
  DELIVERED: 'bg-accent/15 text-accent border-accent/30',
  CANCELLED: 'bg-destructive/15 text-destructive border-destructive/30',
}

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING_SIPEN',
  'PAID',
  'PREPARING',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED',
]

export default function PedidosPage() {
  const { data: orders, isLoading, mutate } = useSWR<Order[]>('/api/orders')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const filteredOrders =
    filterStatus === 'ALL'
      ? orders
      : orders?.filter((o) => o.status === filterStatus)

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingStatus(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      toast.success('Status atualizado com sucesso')
      mutate()
    } catch {
      toast.error('Erro ao atualizar status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Pedidos</h1>
            <p className="text-sm text-muted-foreground">
              Gerenciamento e acompanhamento de todos os pedidos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {ORDER_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => mutate()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredOrders && filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Protocolo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Comprador</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Interno</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Unidade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Valor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Data</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/20">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-primary">
                            {order.sipen_protocol || 'Pendente'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{order.buyer_name}</p>
                            <p className="text-[10px] text-muted-foreground">{order.buyer_cpf}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{order.inmate_name}</p>
                            <p className="font-mono text-[10px] text-muted-foreground">{order.inmate_registration}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{order.prison_unit_name}</td>
                        <td className="px-4 py-3 font-mono font-medium text-foreground">
                          {formatCurrency(Number(order.total_value))}
                        </td>
                        <td className="px-4 py-3">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                            disabled={updatingStatus === order.id}
                          >
                            <SelectTrigger className="h-7 w-36 text-[10px]">
                              <Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[order.status] || ''}`}>
                                {ORDER_STATUS_LABELS[order.status]}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">
                                  {ORDER_STATUS_LABELS[s]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(order.created_at)}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setSelectedOrder(order)
                              setDetailOpen(true)
                            }}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">Nenhum pedido encontrado.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido</DialogTitle>
              <DialogDescription>
                {selectedOrder?.sipen_protocol || 'Protocolo pendente'}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Comprador</span>
                    <p className="font-medium text-foreground">{selectedOrder.buyer_name}</p>
                    <p className="text-xs text-muted-foreground">{selectedOrder.buyer_cpf}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Interno</span>
                    <p className="font-medium text-foreground">{selectedOrder.inmate_name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{selectedOrder.inmate_registration}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Unidade Prisional</span>
                    <p className="font-medium text-foreground">{selectedOrder.prison_unit_name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[selectedOrder.status] || ''}`}>
                      {ORDER_STATUS_LABELS[selectedOrder.status]}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono text-foreground">{formatCurrency(Number(selectedOrder.total_value))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete Ad Valorem</span>
                    <span className="font-mono text-foreground">{formatCurrency(Number(selectedOrder.delivery_fee))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa FUESP</span>
                    <span className="font-mono text-foreground">{formatCurrency(Number(selectedOrder.fuesp_tax))}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="font-mono text-foreground">
                      {formatCurrency(
                        Number(selectedOrder.total_value) +
                          Number(selectedOrder.delivery_fee) +
                          Number(selectedOrder.fuesp_tax)
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Criado em {formatDate(selectedOrder.created_at)}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminShell>
  )
}
