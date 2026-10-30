# Suez Academy

Site de formação técnica e eventos da Suez Inovações. Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS v4, GSAP e three.js.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção (faz também a verificação de tipos)
```

## Onde mexer

- **Conteúdo** (trilhas, módulos, paragens do túnel, templates, contactos, redes sociais): `src/content/academy.ts`.
- **Cores e tipografia**: tokens no topo de `src/app/globals.css` (tema escuro tipo IDE, azul Suez + cores de sintaxe).

## Peças principais

- `components/home/HeroScene.tsx`: roseta do logo em 3D + glifos de código a voar + grelha.
- `components/home/Terminal.tsx`: terminal interactivo do hero (`help`, `ls`, `cd devops`, `inscrever`…).
- `components/tunnel/Tunnel.tsx`: túnel 3D em `/aprender`, controlado pelo scroll; os painéis são desenhados em canvas.
- `components/site/Bit.tsx`: o Bit, mascote. Qualquer secção com `data-bit="…"` faz o Bit comentar; ou `say()` em `lib/bit.ts`.
- `components/templates/TemplateCard.tsx`: cartões com mock em CSS que viram em 3D para mostrar a árvore de ficheiros.

Sem backend: o formulário de inscrição abre o WhatsApp ou o email com a mensagem já escrita.
Tudo respeita `prefers-reduced-motion` (o túnel passa a lista, o 3D fica parado).
