/**
 * All of the academy's content lives here, not in components.
 * Edit this file to change tracks, tunnel stages, templates or contact data.
 */

export const contact = {
  phone: "+244 924 117 200",
  phoneHref: "tel:+244924117200",
  whatsapp: "https://wa.me/244924117200",
  email: "geral@suez.co.ao",
  address: ["Belas Business Park", "Edifício Kwanza Sul, 4.º andar, sala 402", "Luanda, Angola"],
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.965621411419!2d13.188096!3d-8.922554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f596be74f105%3A0xcc3391228f12c89d!2sEdif%C3%ADcio%20Cuanza%20Sul!5e0!3m2!1spt-PT!2sao!4v1744800000000",
};

export const socials = [
  { id: "facebook", label: "Facebook", href: "https://web.facebook.com/SuezAcademy" },
  { id: "whatsapp", label: "WhatsApp", href: contact.whatsapp },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/suezinovacoes" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/linkedin.com-in-suezinovacao/" },
] as const;

export const sisterSites = [
  { label: "Suez Inovações", href: "https://www.suez.co.ao/" },
  { label: "Briefing", href: "https://www.briefing.suez.co.ao/" },
];

export const nav = [
  { href: "/formacoes", label: "Formações" },
  { href: "/aprender", label: "O que vais aprender" },
  { href: "/templates", label: "Templates" },
  { href: "/contactos", label: "Contactos" },
];

/** Syntax colour of each track: one of the code tokens defined in globals.css. */
export type Tone = "fn" | "kw" | "str" | "num" | "type" | "accent";

export type Track = {
  slug: string;
  code: string;
  title: string;
  short: string;
  description: string;
  tone: Tone;
  glyph: string;
  file: string;
  snippet: string[];
  modules: { title: string; topics: string[] }[];
  outcomes: string[];
  stack: string[];
  project: string;
};

export const tracks: Track[] = [
  {
    slug: "engenharia-de-software",
    code: "01",
    title: "Engenharia de Software e Práticas Modernas",
    short: "Full-stack prático com Node.js/React e C#/.NET/Angular, com Clean Code.",
    description:
      "Formação e aceleração em desenvolvimento full-stack prático. Foco em stacks modernas, como Node.js/React e C#/.NET/Angular, Clean Code, testes e trabalho em equipa com Git.",
    tone: "fn",
    glyph: "</>",
    file: "app.tsx",
    snippet: [
      "export async function GET() {",
      "  const alunos = await db.aluno.findMany();",
      "  return Response.json(alunos);",
      "}",
    ],
    modules: [
      { title: "Fundamentos", topics: ["Lógica e algoritmos", "Git e GitHub", "HTML, CSS e acessibilidade"] },
      { title: "JavaScript e TypeScript", topics: ["ES moderno", "Tipos e interfaces", "Assincronismo e APIs"] },
      { title: "Front-end", topics: ["React e Next.js", "Angular", "Estado, formulários e testes de UI"] },
      { title: "Back-end", topics: ["Node.js (Fastify / NestJS)", "C# e ASP.NET Core", "REST, autenticação e validação"] },
      { title: "Dados", topics: ["PostgreSQL e SQL", "MongoDB e Redis", "ORMs e migrações"] },
      { title: "Qualidade", topics: ["Clean Code e SOLID", "Testes automatizados", "Code review em squad"] },
    ],
    outcomes: [
      "Construir uma aplicação web completa, do ecrã à base de dados",
      "Trabalhar com Git como numa equipa profissional",
      "Escrever código legível, testado e pronto para produção",
    ],
    stack: ["TypeScript", "React", "Next.js", "Node.js", "C#", ".NET", "Angular", "PostgreSQL"],
    project: "Uma plataforma full-stack publicada na internet, construída em squad, com repositório e deploy.",
  },
  {
    slug: "devops-e-cloud",
    code: "02",
    title: "DevOps e Cloud Computing",
    short: "Pipelines CI/CD na prática, nos provedores de nuvem líderes: Microsoft Azure, AWS e outros.",
    description:
      "Prática e implementação de pipelines CI/CD, com foco nos provedores de nuvem líderes, como Microsoft Azure e AWS. Do primeiro container ao deploy automático.",
    tone: "str",
    glyph: "∞",
    file: "deploy.yml",
    snippet: [
      "on: push",
      "jobs:",
      "  deploy:",
      "    runs-on: ubuntu-latest",
      "    steps: [build, test, ship]",
    ],
    modules: [
      { title: "Linux para DevOps", topics: ["Terminal e Bash", "Permissões e processos", "SSH e servidores"] },
      { title: "Containers", topics: ["Docker e imagens", "Docker Compose", "Introdução a Kubernetes"] },
      { title: "CI/CD", topics: ["GitHub Actions", "Azure DevOps Pipelines", "Estratégias de deploy"] },
      { title: "Cloud", topics: ["Microsoft Azure", "AWS: EC2, S3, RDS", "Redes e custos na nuvem"] },
      { title: "Infra como código", topics: ["Terraform", "Ambientes dev / staging / prod", "Segredos e configuração"] },
      { title: "Operação", topics: ["Logs e monitorização", "Alertas", "Recuperação de falhas"] },
    ],
    outcomes: [
      "Colocar uma aplicação em produção com um pipeline automático",
      "Gerir infraestrutura em Azure e AWS com código",
      "Diagnosticar e corrigir falhas num ambiente real",
    ],
    stack: ["Linux", "Docker", "GitHub Actions", "Azure", "AWS", "Terraform", "Kubernetes"],
    project: "Um pipeline CI/CD completo que testa, constrói e publica uma aplicação na nuvem a cada push.",
  },
  {
    slug: "redes-e-infraestrutura",
    code: "03",
    title: "Redes, Infraestrutura e Cibersegurança",
    short: "Administração de redes corporativas e laboratórios focados em certificações como a Cisco.",
    description:
      "Administração de redes corporativas, com laboratórios focados em certificações de alto valor prático, como as da Cisco.",
    tone: "num",
    glyph: "⌁",
    file: "router.cfg",
    snippet: [
      "interface Gi0/1",
      " ip address 10.0.0.1 255.255.255.0",
      " no shutdown",
      "router ospf 1",
    ],
    modules: [
      { title: "Fundamentos", topics: ["Modelos OSI e TCP/IP", "Endereçamento IP e subnetting", "Cablagem e equipamentos"] },
      { title: "Switching", topics: ["VLANs e trunking", "STP", "Segurança de portas"] },
      { title: "Routing", topics: ["Rotas estáticas", "OSPF", "NAT e DHCP"] },
      { title: "Servidores", topics: ["Windows Server", "Active Directory", "DNS e serviços de rede"] },
      { title: "Laboratórios", topics: ["Cisco Packet Tracer", "GNS3", "Equipamento real"] },
      { title: "Certificação", topics: ["Preparação CCNA", "Simulados", "Troubleshooting"] },
    ],
    outcomes: [
      "Desenhar e configurar a rede de uma empresa",
      "Resolver problemas de conectividade com método",
      "Chegar preparado ao exame de certificação",
    ],
    stack: ["Cisco IOS", "Packet Tracer", "GNS3", "Windows Server", "Active Directory"],
    project: "A rede completa de uma empresa fictícia, com várias filiais, VLANs, routing e serviços.",
  },
  {
    slug: "ciberseguranca-pratica",
    code: "04",
    title: "Cibersegurança Prática: Defensiva e Ofensiva",
    short: "Diagnóstico de vulnerabilidades, segurança em redes locais e conformidade para a banca e as telecomunicações.",
    description:
      "Diagnóstico de vulnerabilidades, segurança em redes locais e conformidade com as regulações de proteção de dados para a banca e as telecomunicações.",
    tone: "kw",
    glyph: "#",
    file: "scan.sh",
    snippet: [
      "$ nmap -sV 192.168.1.0/24",
      "22/tcp   open  ssh",
      "443/tcp  open  https",
      "# relatório gerado ✓",
    ],
    modules: [
      { title: "Fundamentos", topics: ["Ameaças e vetores de ataque", "Criptografia aplicada", "Kali Linux"] },
      { title: "Ofensiva (ética)", topics: ["Reconhecimento", "Análise de vulnerabilidades", "Pentest em laboratório"] },
      { title: "Defensiva", topics: ["Hardening de sistemas", "Firewalls e segmentação", "Segurança em redes locais"] },
      { title: "Web", topics: ["OWASP Top 10", "Testes de aplicações", "Correção com a equipa de dev"] },
      { title: "Resposta", topics: ["Logs e SIEM", "Resposta a incidentes", "Relatórios técnicos"] },
      { title: "Conformidade", topics: ["Proteção de dados pessoais", "Requisitos da banca", "Requisitos das telecomunicações"] },
    ],
    outcomes: [
      "Encontrar e documentar vulnerabilidades num ambiente controlado",
      "Proteger uma rede local e os seus servidores",
      "Falar de risco e conformidade com a direção de uma empresa",
    ],
    stack: ["Kali Linux", "Nmap", "Burp Suite", "Wireshark", "OWASP", "SIEM"],
    project: "A auditoria de segurança de um ambiente de laboratório, com relatório e plano de correção.",
  },
  {
    slug: "product-management",
    code: "05",
    title: "Product Management e Design Thinking",
    short: "Transformar ideias em produtos tecnológicos viáveis para África, especialmente para o utilizador angolano.",
    description:
      "Transformação de ideias em produtos tecnológicos viáveis, focados nas soluções emergentes para África, especialmente para o utilizador angolano.",
    tone: "type",
    glyph: "◇",
    file: "produto.md",
    snippet: [
      "## Problema",
      "- filas longas no banco",
      "## Hipótese",
      "- app para marcar senha ✓",
    ],
    modules: [
      { title: "Design Thinking", topics: ["Empatia e entrevistas", "Definição do problema", "Ideação"] },
      { title: "O utilizador angolano", topics: ["Contexto e conectividade", "Pagamentos e confiança", "Pesquisa no terreno"] },
      { title: "Produto", topics: ["Proposta de valor", "MVP", "Priorização"] },
      { title: "Prototipagem", topics: ["Figma", "Testes de usabilidade", "Iteração"] },
      { title: "Métricas", topics: ["KPIs e OKRs", "Roadmap", "Decisões com dados"] },
      { title: "Lançamento", topics: ["Go-to-market", "Pitch", "Trabalhar com engenharia"] },
    ],
    outcomes: [
      "Validar uma ideia antes de escrever código",
      "Desenhar um protótipo testado com utilizadores reais",
      "Defender um produto perante investidores ou a direção",
    ],
    stack: ["Figma", "Miro", "Notion", "Jira", "Analytics"],
    project: "Um produto validado do problema ao protótipo, apresentado num demo day.",
  },
  {
    slug: "carreira-e-soft-skills",
    code: "06",
    title: "Aceleração de Carreira & Soft Skills",
    short: "Metodologias ágeis e gestão de projectos: Scrum e Kanban na prática, em squads simuladas.",
    description:
      "Metodologias ágeis e gestão de projectos. Scrum e Kanban aplicados na prática, através da simulação de squads de desenvolvimento.",
    tone: "accent",
    glyph: "↗",
    file: "sprint.ts",
    snippet: [
      "const sprint = new Sprint({ dias: 14 });",
      "sprint.planear(backlog.top(8));",
      "sprint.daily(); // 15 min",
      "sprint.retro();",
    ],
    modules: [
      { title: "Agile", topics: ["Manifesto ágil", "Valores e princípios", "Quando usar o quê"] },
      { title: "Scrum", topics: ["Papéis e cerimónias", "Backlog e estimativas", "Sprint review e retro"] },
      { title: "Kanban", topics: ["Quadros e fluxo", "Limites de WIP", "Métricas de fluxo"] },
      { title: "Squads simuladas", topics: ["Uma squad, um produto", "Rotação de papéis", "Entregas semanais"] },
      { title: "Comunicação", topics: ["Apresentações técnicas", "Feedback", "Trabalho remoto"] },
      { title: "Carreira", topics: ["CV e LinkedIn", "Portfólio no GitHub", "Entrevistas técnicas"] },
    ],
    outcomes: [
      "Trabalhar numa squad ágil desde o primeiro dia de emprego",
      "Gerir um projecto com Scrum ou Kanban",
      "Apresentar-se com um portfólio e um perfil fortes",
    ],
    stack: ["Scrum", "Kanban", "Jira", "Trello", "GitHub", "LinkedIn"],
    project: "Várias sprints numa squad simulada, com entregas, retrospectivas e um portfólio no fim.",
  },
];

export const trackBySlug = (slug: string) => tracks.find((t) => t.slug === slug);

/** What a visual inside a tunnel panel shows. */
export type PanelKind = "code" | "terminal" | "pipeline" | "network" | "kanban" | "chart" | "ui" | "shield";

export type Stage = {
  id: string;
  track: string;
  label: string;
  title: string;
  text: string;
  kind: PanelKind;
  lines: string[];
};

/** The tunnel at /aprender, in the order the visitor flies through it. */
export const stages: Stage[] = [
  {
    id: "git",
    track: "engenharia-de-software",
    label: "commit 01",
    title: "Git e trabalho em equipa",
    text: "O primeiro commit, os ramos e os pull requests: é assim que as equipas profissionais trabalham.",
    kind: "terminal",
    lines: ["$ git init", "$ git checkout -b feature/login", "$ git commit -m \"primeiro commit\"", "$ git push origin feature/login"],
  },
  {
    id: "web",
    track: "engenharia-de-software",
    label: "commit 02",
    title: "HTML, CSS e interfaces",
    text: "Ecrãs claros, rápidos e acessíveis, que funcionam no telemóvel de qualquer angolano.",
    kind: "ui",
    lines: ["<button class=\"btn\">", "  Inscreve-te", "</button>"],
  },
  {
    id: "ts",
    track: "engenharia-de-software",
    label: "commit 03",
    title: "JavaScript e TypeScript",
    text: "A linguagem da web, com tipos que apanham os erros antes de chegarem ao utilizador.",
    kind: "code",
    lines: ["type Aluno = {", "  nome: string;", "  trilha: Trilha;", "};", "const ola = (a: Aluno) =>", "  `Bem-vindo, ${a.nome}`;"],
  },
  {
    id: "react",
    track: "engenharia-de-software",
    label: "commit 04",
    title: "React, Next.js e Angular",
    text: "Componentes reutilizáveis e aplicações completas, como as que a Suez entrega aos clientes.",
    kind: "code",
    lines: ["export function Card({ titulo }) {", "  const [on, setOn] = useState(false);", "  return <article>{titulo}</article>;", "}"],
  },
  {
    id: "api",
    track: "engenharia-de-software",
    label: "commit 05",
    title: "APIs com Node.js e .NET",
    text: "O lado do servidor: rotas, autenticação, validação e regras de negócio.",
    kind: "code",
    lines: ["app.MapPost(\"/inscricoes\",", "  async (Inscricao i, Db db) => {", "    db.Add(i);", "    await db.SaveChangesAsync();", "  });"],
  },
  {
    id: "sql",
    track: "engenharia-de-software",
    label: "commit 06",
    title: "Bases de dados",
    text: "Modelar os dados, consultá-los depressa e mantê-los consistentes.",
    kind: "chart",
    lines: ["SELECT trilha, COUNT(*)", "FROM alunos", "GROUP BY trilha;"],
  },
  {
    id: "docker",
    track: "devops-e-cloud",
    label: "commit 07",
    title: "Docker e containers",
    text: "A aplicação empacotada uma vez, a correr igual em qualquer máquina.",
    kind: "terminal",
    lines: ["$ docker build -t academy .", "$ docker compose up -d", "✔ api     running", "✔ db      running"],
  },
  {
    id: "cicd",
    track: "devops-e-cloud",
    label: "commit 08",
    title: "Pipelines CI/CD",
    text: "Cada push testado, construído e publicado sem mãos humanas.",
    kind: "pipeline",
    lines: ["build", "test", "scan", "deploy"],
  },
  {
    id: "cloud",
    track: "devops-e-cloud",
    label: "commit 09",
    title: "Azure e AWS",
    text: "Servidores, bases de dados e redes na nuvem, geridos com Terraform.",
    kind: "code",
    lines: ["resource \"azurerm_app\" \"api\" {", "  name     = \"academy-api\"", "  location = \"southafricanorth\"", "}"],
  },
  {
    id: "network",
    track: "redes-e-infraestrutura",
    label: "commit 10",
    title: "Redes corporativas",
    text: "VLANs, routing e laboratórios Cisco, com equipamento como o das empresas.",
    kind: "network",
    lines: ["R1", "SW1", "SW2", "PC", "SRV", "AP"],
  },
  {
    id: "security",
    track: "ciberseguranca-pratica",
    label: "commit 11",
    title: "Cibersegurança ofensiva e defensiva",
    text: "Pensar como um atacante para proteger como um profissional.",
    kind: "shield",
    lines: ["$ nmap -sV alvo.lab", "[!] 3 vulnerabilidades", "[✓] firewall aplicada", "[✓] relatório enviado"],
  },
  {
    id: "product",
    track: "product-management",
    label: "commit 12",
    title: "Produto e Design Thinking",
    text: "Do problema real do utilizador angolano a um produto que as pessoas querem usar.",
    kind: "ui",
    lines: ["Problema", "Hipótese", "MVP", "Validar"],
  },
  {
    id: "scrum",
    track: "carreira-e-soft-skills",
    label: "commit 13",
    title: "Scrum e Kanban em squad",
    text: "Sprints, dailies e retrospectivas numa squad simulada, como numa empresa de verdade.",
    kind: "kanban",
    lines: ["A fazer", "Em curso", "Revisão", "Feito"],
  },
  {
    id: "deploy",
    track: "carreira-e-soft-skills",
    label: "merge → main",
    title: "Portfólio e carreira",
    text: "Sais com projectos publicados, um GitHub forte e preparação para entrevistas.",
    kind: "terminal",
    lines: ["$ git merge carreira", "✔ portfólio publicado", "✔ entrevista marcada", "→ bem-vindo à indústria"],
  },
];

export type TemplateKind =
  | "landing"
  | "dashboard"
  | "mobile"
  | "shop"
  | "api"
  | "pipeline"
  | "terraform"
  | "topology"
  | "kanban"
  | "canvas"
  | "audit";

export type Template = {
  id: string;
  name: string;
  track: string;
  kind: TemplateKind;
  description: string;
  stack: string[];
  tree: string[];
};

/** Starter projects students fork in class. */
export const templates: Template[] = [
  {
    id: "landing-saas",
    name: "Landing page SaaS",
    track: "engenharia-de-software",
    kind: "landing",
    description: "Página de produto responsiva, com secções, formulário e animações.",
    stack: ["Next.js", "Tailwind"],
    tree: ["app/", "  page.tsx", "  layout.tsx", "components/", "  Hero.tsx", "  Pricing.tsx"],
  },
  {
    id: "admin-dashboard",
    name: "Dashboard de gestão",
    track: "engenharia-de-software",
    kind: "dashboard",
    description: "Painel com autenticação, tabelas, gráficos e permissões por perfil.",
    stack: ["React", "Node.js", "PostgreSQL"],
    tree: ["web/", "  pages/", "  charts/", "api/", "  auth/", "  routes/"],
  },
  {
    id: "mobile-banking",
    name: "App bancária móvel",
    track: "engenharia-de-software",
    kind: "mobile",
    description: "Saldo, transferências e histórico, pensada para o cliente angolano.",
    stack: ["React Native", "TypeScript"],
    tree: ["src/", "  screens/", "    Saldo.tsx", "    Transferir.tsx", "  services/", "  theme.ts"],
  },
  {
    id: "ecommerce",
    name: "Loja online",
    track: "engenharia-de-software",
    kind: "shop",
    description: "Catálogo, carrinho e checkout, com painel do vendedor.",
    stack: ["Angular", "C#", ".NET"],
    tree: ["client/", "  catalogo/", "  carrinho/", "Server/", "  Controllers/", "  Models/"],
  },
  {
    id: "rest-api",
    name: "API REST com testes",
    track: "engenharia-de-software",
    kind: "api",
    description: "API com autenticação JWT, validação, documentação e testes automatizados.",
    stack: ["NestJS", "Jest", "Swagger"],
    tree: ["src/", "  modules/", "  auth/", "  main.ts", "test/", "  app.e2e-spec.ts"],
  },
  {
    id: "github-actions",
    name: "Pipeline CI/CD",
    track: "devops-e-cloud",
    kind: "pipeline",
    description: "Build, testes, análise e deploy automático em cada push.",
    stack: ["GitHub Actions", "Docker"],
    tree: [".github/", "  workflows/", "    ci.yml", "    deploy.yml", "Dockerfile", "compose.yml"],
  },
  {
    id: "terraform-azure",
    name: "Infra Azure / AWS",
    track: "devops-e-cloud",
    kind: "terraform",
    description: "Ambientes dev, staging e produção descritos em código.",
    stack: ["Terraform", "Azure", "AWS"],
    tree: ["envs/", "  dev/", "  prod/", "modules/", "  network/", "  app/"],
  },
  {
    id: "cisco-lab",
    name: "Laboratório de rede Cisco",
    track: "redes-e-infraestrutura",
    kind: "topology",
    description: "Topologia de empresa com filiais, VLANs, OSPF e serviços.",
    stack: ["Packet Tracer", "Cisco IOS"],
    tree: ["lab/", "  sede.pkt", "  filial-1.pkt", "configs/", "  R1.cfg", "  SW1.cfg"],
  },
  {
    id: "audit-report",
    name: "Relatório de auditoria",
    track: "ciberseguranca-pratica",
    kind: "audit",
    description: "Estrutura de relatório de vulnerabilidades, com risco e plano de correção.",
    stack: ["Nmap", "OWASP"],
    tree: ["auditoria/", "  01-ambito.md", "  02-achados.md", "  03-risco.md", "  04-plano.md"],
  },
  {
    id: "product-canvas",
    name: "Canvas de produto",
    track: "product-management",
    kind: "canvas",
    description: "Problema, utilizador, proposta de valor e métricas numa só página.",
    stack: ["Figma", "Miro"],
    tree: ["produto/", "  problema.md", "  persona.fig", "  mvp.fig", "  metricas.md"],
  },
  {
    id: "sprint-board",
    name: "Quadro de sprint",
    track: "carreira-e-soft-skills",
    kind: "kanban",
    description: "Backlog, quadro Kanban e modelo de retrospectiva para a squad.",
    stack: ["Jira", "Trello"],
    tree: ["squad/", "  backlog.csv", "  sprint-01/", "  retro.md", "  definicao-de-feito.md"],
  },
];

/** How a cohort works, drawn as a git graph on the home page. */
export const method = [
  { hash: "a1f9c3e", title: "Escolhes a trilha", text: "Seis especialidades, do código à rede, da nuvem ao produto." },
  { hash: "b72d04a", title: "Aprendes a fazer", text: "Pouca teoria, muitos laboratórios. Cada aula termina com algo a funcionar." },
  { hash: "c3e8f17", title: "Entras numa squad", text: "Simulamos uma equipa de desenvolvimento real, com Scrum, sprints e code review." },
  { hash: "d40b9e2", title: "Constróis um projecto", text: "Usas os nossos templates como ponto de partida e entregas um projecto teu." },
  { hash: "e5a1c6d", title: "Fazes merge na carreira", text: "Portfólio publicado, preparação para certificação e para entrevistas." },
];

export const stackTicker = [
  "TypeScript", "React", "Next.js", "Node.js", "C#", ".NET", "Angular", "PostgreSQL", "Docker", "Kubernetes",
  "GitHub Actions", "Azure", "AWS", "Terraform", "Linux", "Cisco", "Kali Linux", "Wireshark", "Scrum", "Kanban", "Figma",
];
