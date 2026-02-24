// app/(auth)/login/page.tsx
import { ShieldCheck, User, Scale, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-lg">
        <div className="text-center">
          <img src="/logo-solu-web.png" alt="Logo" className="mx-auto h-12 mb-4" />
          <h2 className="text-2xl font-bold tracking-tight">Cesta de Custódia</h2>
          <p className="text-sm text-muted-foreground">Portal de Acesso ao Familiar e Representante</p>
        </div>

        <Tabs defaultValue="visitante" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visitante">Familiar</TabsTrigger>
            <TabsTrigger value="advogado">Advogado</TabsTrigger>
            <TabsTrigger value="consular">Consular</TabsTrigger>
          </TabsList>

          <TabsContent value="visitante" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">CPF</label>
              <Input placeholder="000.000.000-00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" />
            </div>
          </TabsContent>

          {/* Campos adicionais para Advogados e Agentes conforme item 3.4.2 [cite: 475] */}
          <TabsContent value="advogado" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Inscrição OAB</label>
              <Input placeholder="Número da OAB" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" />
            </div>
          </TabsContent>
          
          <TabsContent value="consular" className="space-y-4 pt-4">
             <div className="space-y-2">
              <label className="text-sm font-medium">Matrícula Funcional</label>
              <Input placeholder="Número da Matrícula" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input type="password" />
            </div>
          </TabsContent>
        </Tabs>
        <div className="pt-4">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Entrar no Sistema
          </Button>
          <div className="mt-4 text-center text-sm text-muted-foreground">
          Ainda não tem uma conta? <a href="#" className="text-primary hover:underline">Cadastre-se aqui</a>
          </div> 
        </div>
        
        <div className="text-center text-xs text-muted-foreground mt-4">
          Conformidade LGPD | HTTPS Obrigatório [cite: 482, 483]
        </div>
      </div>
    </div>
  )
}