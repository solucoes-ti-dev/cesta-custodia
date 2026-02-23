export type UserRole = 'ADMIN' | 'FISCAL_SEAP' | 'BUYER' | 'OPERATOR'
export type OrderStatus = 'PENDING_SIPEN' | 'PAID' | 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
export type ProductCategory = 'ALIMENTOS' | 'HIGIENE' | 'VESTUARIO_BRANCO' | 'MEDICAMENTOS'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Buyer {
  id: string
  user_id: string
  name: string
  cpf: string
  rg: string | null
  address: string
  phone: string
}

export interface PrisonUnit {
  id: string
  name: string
  unit_group: string
  address: string
}

export interface Inmate {
  id: string
  name: string
  registration: string
  ward: string
  cell: string
  prison_unit_id: string
  prison_unit_name?: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: ProductCategory
  is_active: boolean
  stock_quantity: number
  image_url: string | null
}

export interface Order {
  id: string
  buyer_id: string
  inmate_id: string
  status: OrderStatus
  sipen_protocol: string | null
  total_value: number
  delivery_fee: number
  fuesp_tax: number
  prescription_url: string | null
  created_at: string
  updated_at: string
  buyer_name?: string
  buyer_cpf?: string
  inmate_name?: string
  inmate_registration?: string
  prison_unit_name?: string
  item_count?: number
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
  product_name?: string
  product_category?: ProductCategory
}

export interface AuditLog {
  id: string
  user_id: string | null
  order_id: string | null
  action: string
  details: Record<string, unknown>
  created_at: string
  user_email?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export const SALARIO_MINIMO = 1518.00

export const FRETE_FAIXAS = [
  { limite: 151.80, aliquota: 0.10 },
  { limite: 303.60, aliquota: 0.075 },
  { limite: 759.00, aliquota: 0.05 },
  { limite: Infinity, aliquota: 0.035 },
] as const

export function calcularFrete(valorBruto: number): number {
  for (const faixa of FRETE_FAIXAS) {
    if (valorBruto <= faixa.limite) {
      return Math.round(valorBruto * faixa.aliquota * 100) / 100
    }
  }
  return Math.round(valorBruto * 0.035 * 100) / 100
}

export function calcularFuespTax(valorBruto: number): number {
  return Math.round(valorBruto * 0.05 * 100) / 100
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_SIPEN: 'Aguardando SIPEN',
  PAID: 'Pago',
  PREPARING: 'Em Preparo',
  IN_TRANSIT: 'Em Transito',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ALIMENTOS: 'Alimentos',
  HIGIENE: 'Higiene',
  VESTUARIO_BRANCO: 'Vestuario Branco',
  MEDICAMENTOS: 'Medicamentos',
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}
