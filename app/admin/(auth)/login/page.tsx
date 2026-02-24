// app/(auth)/login/page.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-lg">
        <div className="text-center">
          <img src="/logo-solu-web.png" alt="Logo" className="mx-auto h-12 mb-4" />
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Portal de Acesso ao Dashboard Administrativo</p>
        </div>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">E-mail</label>
              <Input placeholder="seu.email@exemplo.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" />
            </div>
          </div>
        <div className="pt-4">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Entrar
          </Button>
        </div>
      </div>
    </div>
  )
}