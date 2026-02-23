'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MarketplaceHeader } from '@/components/marketplace-header'
import { ProductCard } from '@/components/product-card'
import { CartSidebar } from '@/components/cart-sidebar'
import { CheckoutDialog } from '@/components/checkout-dialog'
import type { Product, ProductCategory } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/types'

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'ALIMENTOS', label: 'Alimentos' },
  { value: 'HIGIENE', label: 'Higiene' },
  { value: 'VESTUARIO', label: 'Vestuario' },
  { value: 'MEDICAMENTOS', label: 'Medicamentos' },
]

export default function CatalogoPage() {
  const [category, setCategory] = useState('ALL')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const { data: products, isLoading } = useSWR<Product[]>(
    `/api/products?category=${category}`
  )

  function handleCheckout() {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader onCartClick={() => setCartOpen(true)} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6 md:p-8">
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Catalogo de Itens Autorizados
          </h1>
          <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Selecione os itens que deseja enviar para o interno. Todos os produtos seguem as normas
            da Resolucao SEAP/RJ e possuem precos regulados.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={category === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat.value)}
              className="text-xs"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-lg border border-border p-4">
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}

        {/* Info section */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Frete Ad Valorem</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              A taxa de entrega e calculada automaticamente com base no valor da compra,
              seguindo as faixas do salario minimo vigente (R$ 1.518,00).
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Validacao SIPEN</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Todo pedido passa por validacao sincrona no WebService SIPEN/Montreal
              para verificar o vinculo entre visitante e interno.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Medicamentos</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              A compra de medicamentos requer prescricao eletronica validada
              pelo portal do Conselho Federal de Medicina (CFM).
            </p>
          </div>
        </div>
      </main>

      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} onCheckout={handleCheckout} />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  )
}
