# Projeto: Cesta de Custódia - Plataforma de E-commerce e Gestão

## 1. Visão Geral

O projeto consiste em uma solução de e-commerce (loja virtual online) para a comercialização e entrega controlada de produtos e objetos às Unidades Prisionais do Estado do Rio de Janeiro. A plataforma permite que familiares, advogados e agentes consulares adquiram cestas de produtos previamente autorizados, garantindo dignidade e transparência no fornecimento de necessidades pessoais aos internos.

## 2. Requisitos Funcionais (RF)

- **RF-01: Catálogo de Produtos Controlado**: Disponibilizar apenas itens permitidos pela Resolução SEAP/RJ vigente, como alimentos, higiene e vestuário (ex: camisetas, lençóis e toalhas na cor branca).

- **RF-02: Identificação de Atores**: Coleta obrigatória de dados do comprador (CPF, RG, endereço) e do detento (Nome, Matrícula, Raio e Cela).

- **RF-03: Integração SIPEN**: Validação obrigatória de autorização de visitantes e advogados via WebService do Sistema de Identificação Penitenciária antes da finalização da compra.

- **RF-04: Venda de Medicamentos**: Integração com o portal do CFM para validação de prescrições eletrônicas assinadas digitalmente.

- **RF-05: Controle de Limites**: Bloqueio automático de pedidos que excedam o limite semanal de vendas por detento definido pela SEAP.

- **RF-06: Cálculo Automatizado de Frete**: Aplicação de alíquotas _ad valorem_ (10%, 7,5%, 5% ou 3,5%) baseadas no valor da venda e no coeficiente de 2 salários mínimos.

- **RF-07: Painel de Controle (Dashboard)**: Interface para fiscais da SEAP acompanharem vendas em tempo real, tabelas de preços e extração de relatórios mensais.

- **RF-08: Canais de Atendimento**: Disponibilização de suporte via telefone 0800 ou polo físico para usuários com dificuldade de acesso digital.

## 3. Requisitos Não Funcionais (RNF)

- **RNF-01: Disponibilidade (SLA)**: Garantia de funcionamento da plataforma de no mínimo 99,5%.

- **RNF-02: Acessibilidade**: Conformidade estrita com o padrão WCAG 2.1 AA.

- **RNF-03: Segurança**: Utilização de HTTPS, mecanismos contra SQL Injection/XSS e sistema antifraude padrão ISO/IEC 27001.

- **RNF-04: Conformidade Legal**: Aderência total à Lei Geral de Proteção de Dados (LGPD) e ao Programa de Integridade (Lei Estadual nº 7.753/17).

- **RNF-05: Monitoramento**: Integração de link de acesso em tempo real às câmeras de monitoramento dos locais de estoque e veículos de transporte para a gestão do contrato.

## 4. Stack Tecnológica

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS e Shadcn/UI.
- **Backend**: NestJS (Node.js) com suporte a WebSockets para o Dashboard.
- **Banco de Dados**: PostgreSQL com Prisma/TypeORM.
- **Infraestrutura**: Docker e Nginx (Proxy Reverso).

## 5. Estrutura do Projeto (Monorepo)

```text
/cesta-custodia

├── /apps
│   ├── /web        # Interface pública para familiares e advogados
│   └── /admin      # Dashboard de gestão e fiscalização para a SEAP
├── /packages
│   ├── /api        # Lógica de negócio e integrações (SIPEN/CFM)
│   ├── /database   # Schemas e migrações do PostgreSQL
│   └── /shared     # Validações e tipagens compartilhadas
├── /docker         # Configurações de containerização
└── /tests          # Testes unitários, integração e E2E (Playwright)
```

## 6. Arquitetura de Dados (Principais Entidades)

- **Users**: Dados de compradores e fiscais, incluindo permissões de acesso.
- **Inmates**: Cadastro de detentos vinculado às unidades prisionais e lotes.
- **Products**: Itens autorizados com controle de categoria e preços regulados pela SEAP.
- **Orders**: Registro de transações com ID de protocolo do SIPEN e cálculo de taxa de entrega.
- **AuditLogs**: Rastro de auditoria para todas as operações críticas e validações de API.

## 7. Fluxos Críticos de Negócio

1. **Validação SIPEN**: No checkout, o sistema consulta o WebService da Montreal; se o visitante não estiver autorizado ou o detento possuir restrições, a venda é bloqueada imediatamente.

2. **Repasse ao Erário**: O sistema deve calcular mensalmente o percentual do lance arrematado sobre o valor bruto das vendas para recolhimento ao Fundo Especial Penitenciário (FUESP).

3. **Auditoria de Preços**: Verificação semestral (ou sob demanda) da compatibilidade dos preços praticados com o mercado externo através de pesquisa de valores médios.

## 8. Garantia de Qualidade

- **Cobertura de Testes**: Implementação de testes unitários para o motor de cálculo de alíquotas e mocks para simulação de falhas de WebService externo.
- **Segurança Estática**: Uso de ferramentas SAST para análise de vulnerabilidades no pipeline de CI/CD.
- **Auditoria de Acessibilidade**: Testes automatizados de contraste e navegação via teclado em todas as interfaces.
