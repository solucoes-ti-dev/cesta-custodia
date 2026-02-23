'use client'

import { useState } from 'react'
import { Search, CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-store'
import { formatCurrency } from '@/lib/types'
import type { Inmate } from '@/lib/types'
import { toast } from 'sonner'

export function CheckoutDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { items, subtotal, deliveryFee, fuespTax, total, hasMedicamentos, clearCart } = useCart()
  const [step, setStep] = useState<'search' | 'confirm' | 'success'>('search')
  const [registration, setRegistration] = useState('')
  const [inmate, setInmate] = useState<Inmate | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sipenProtocol, setSipenProtocol] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [buyerCpf, setBuyerCpf] = useState('')

  async function searchInmate() {
    if (!registration.trim()) return
    setLoading(true)
    setError('')
    setInmate(null)

    try {
      const res = await fetch(`/api/inmates/search?registration=${encodeURIComponent(registration.trim())}`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erro ao buscar interno')
        return
      }
      const data = await res.json()
      setInmate(data)
      setStep('confirm')
    } catch {
      setError('Erro de conexao. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function submitOrder() {
    if (!inmate || !buyerName.trim() || !buyerCpf.trim()) {
      toast.error('Preencha todos os campos obrigatorios')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: 'b0000000-0000-0000-0000-000000000001',
          inmate_id: inmate.id,
          items: items.map((item) => ({
            product_id: item.product.id,
            price: Number(item.product.price),
            quantity: item.quantity,
          })),
        }),
      })

      if (!res.ok) {
        throw new Error('Erro ao criar pedido')
      }

      const data = await res.json()
      setSipenProtocol(data.sipen_protocol)
      setStep('success')
      clearCart()
      toast.success('Pedido realizado com sucesso!')
    } catch {
      toast.error('Erro ao processar pedido. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    onOpenChange(false)
    setTimeout(() => {
      setStep('search')
      setRegistration('')
      setInmate(null)
      setError('')
      setSipenProtocol('')
      setBuyerName('')
      setBuyerCpf('')
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 'search' && 'Identificar Interno'}
            {step === 'confirm' && 'Confirmar Pedido'}
            {step === 'success' && 'Pedido Confirmado'}
          </DialogTitle>
          <DialogDescription>
            {step === 'search' && 'Informe a matricula SIPEN do interno destinatario.'}
            {step === 'confirm' && 'Revise os dados antes de confirmar.'}
            {step === 'success' && 'Seu pedido foi registrado e validado pelo SIPEN.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'search' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registration">Matricula SIPEN</Label>
              <div className="flex gap-2">
                <Input
                  id="registration"
                  placeholder="Ex: MAT-2024-0001"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchInmate()}
                />
                <Button onClick={searchInmate} disabled={loading} className="gap-1">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Buscar
                </Button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Matriculas disponiveis para teste: MAT-2024-0001, MAT-2024-0002, MAT-2024-0003
            </p>
          </div>
        )}

        {step === 'confirm' && inmate && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Dados do Interno</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Nome:</span>
                  <p className="font-medium text-foreground">{inmate.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Matricula:</span>
                  <p className="font-medium text-foreground">{inmate.registration}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Unidade:</span>
                  <p className="font-medium text-foreground">{inmate.prison_unit_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Localizacao:</span>
                  <p className="font-medium text-foreground">{inmate.ward} / {inmate.cell}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Dados do Comprador</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="buyerName">Nome Completo</Label>
                  <Input id="buyerName" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Seu nome completo" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buyerCpf">CPF</Label>
                  <Input id="buyerCpf" value={buyerCpf} onChange={(e) => setBuyerCpf(e.target.value)} placeholder="000.000.000-00" />
                </div>
              </div>
            </div>

            {hasMedicamentos && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">Prescricao Medica Obrigatoria</p>
                  <p className="text-xs text-muted-foreground">
                    Seu pedido contem medicamentos. A prescricao eletronica do CFM sera validada apos o envio.
                  </p>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                <span className="text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete ad valorem</span>
                <span className="text-foreground">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxa FUESP</span>
                <span className="text-foreground">{formatCurrency(fuespTax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('search')}>
                Voltar
              </Button>
              <Button className="flex-1" onClick={submitOrder} disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirmar Pedido
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-foreground">Pedido registrado com sucesso!</p>
              <p className="text-xs text-muted-foreground">Protocolo SIPEN:</p>
              <p className="font-mono text-sm font-bold text-primary">{sipenProtocol}</p>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Guarde este protocolo para acompanhamento. O pedido sera preparado apos confirmacao do pagamento.
            </p>
            <Button onClick={handleClose} className="mt-2">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
