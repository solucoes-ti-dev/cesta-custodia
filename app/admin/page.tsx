'use client'

import useSWR from 'swr'
import {
  DollarSign,
  Package,
  Truck,
  Building2,
  ClipboardList,
  Users,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminShell } from '@/components/admin-shell'
import {
  formatCurrency,
  formatDate,
  ORDER_STATUS_LABELS,
  CATEGORY_LABELS,
} from '@/lib/types'
import type { OrderStatus } from '@/lib/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const STATUS_COLORS: Record<string, string> = {
  PENDING_SIPEN: 'bg-chart-3/15 text-chart-3 border-chart-3/30',
  PAID: 'bg-chart-1/15 text-chart-1 border-chart-1/30',
  PREPARING: 'bg-chart-4/15 text-chart-4 border-chart-4/30',
  IN_TRANSIT: 'bg-chart-2/15 text-chart-2 border-chart-2/30',
  DELIVERED: 'bg-accent/15 text-accent border-accent/30',
  CANCELLED: 'bg-destructive/15 text-destructive border-destructive/30',
}

const PIE_COLORS = [
  'oklch(0.38 0.12 250)',
  'oklch(0.55 0.15 160)',
  'oklch(0.60 0.18 45)',
  'oklch(0.70 0.12 200)',
]

interface AdminStats {
  total_orders: number
  total_revenue: number
  total_delivery_fees: number
  total_fuesp_tax: number
  pending_orders: number
  delivered_orders: number
  total_products: number
  total_inmates: number
  status_breakdown: { status: string; count: string }[]
  category_breakdown: { category: string; order_count: string; revenue: string }[]
  recent_orders: {
    id: string
    status: OrderStatus
    total_value: string
    created_at: string
    buyer_name: string
    inmate_name: string
  }[]
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useSWR<AdminStats>('/api/admin/stats')

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visao geral do sistema de cestas de custodia.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Receita Total</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(stats.total_revenue)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <ClipboardList className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total de Pedidos</p>
                    <p className="text-xl font-bold text-foreground">{stats.total_orders}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-3/10">
                    <Truck className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Taxas de Frete</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(stats.total_delivery_fees)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-5/10">
                    <Building2 className="h-5 w-5 text-chart-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Repasse FUESP</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(stats.total_fuesp_tax)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Status Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Pedidos por Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.status_breakdown.map((s) => ({
                          name: ORDER_STATUS_LABELS[s.status as OrderStatus] || s.status,
                          quantidade: Number(s.count),
                        }))}
                        margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                        <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'oklch(1 0 0)',
                            border: '1px solid oklch(0.90 0.01 240)',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="quantidade" fill="oklch(0.38 0.12 250)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Revenue */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Receita por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.category_breakdown.map((c) => ({
                            name: CATEGORY_LABELS[c.category as keyof typeof CATEGORY_LABELS] || c.category,
                            value: Number(c.revenue),
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {stats.category_breakdown.map((_, index) => (
                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: 'oklch(1 0 0)',
                            border: '1px solid oklch(0.90 0.01 240)',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4" />
                  Pedidos Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Comprador</th>
                        <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Interno</th>
                        <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Valor</th>
                        <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                        <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent_orders.map((order) => (
                        <tr key={order.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 font-medium text-foreground">{order.buyer_name}</td>
                          <td className="py-3 text-muted-foreground">{order.inmate_name}</td>
                          <td className="py-3 font-mono text-foreground">{formatCurrency(Number(order.total_value))}</td>
                          <td className="py-3">
                            <Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[order.status] || ''}`}>
                              {ORDER_STATUS_LABELS[order.status]}
                            </Badge>
                          </td>
                          <td className="py-3 text-xs text-muted-foreground">{formatDate(order.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <Package className="h-8 w-8 text-muted-foreground/40" />
                  <div>
                    <p className="text-xs text-muted-foreground">Produtos Ativos</p>
                    <p className="text-lg font-bold text-foreground">{stats.total_products}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <Users className="h-8 w-8 text-muted-foreground/40" />
                  <div>
                    <p className="text-xs text-muted-foreground">Internos Cadastrados</p>
                    <p className="text-lg font-bold text-foreground">{stats.total_inmates}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pedidos Pendentes</p>
                    <p className="text-lg font-bold text-foreground">{stats.pending_orders}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </AdminShell>
  )
}
