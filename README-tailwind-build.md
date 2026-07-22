# Build de Produção do Tailwind CSS

## Por que fazer isso?

O site hoje carrega o Tailwind via CDN (`<script src="https://cdn.tailwindcss.com">`).
Isso é ótimo para prototipar rápido, mas a própria documentação do Tailwind
desaconselha usar o CDN em produção: ele compila as classes no navegador do
visitante em tempo real, o que deixa o carregamento mais pesado e emite um
aviso no console. O build local gera um CSS enxuto, só com as classes que o
site realmente usa.

## Dois bugs corrigidos de graça neste processo

Sem querer, o CDN "engolia" duas classes que o HTML já usava mas que nunca
foram configuradas em lugar nenhum — então elas nunca funcionaram de verdade:

- `xs:inline` (barra de acessibilidade) - o Tailwind não tem esse breakpoint
  por padrão.
- `font-serif-premium` (logo e alguns títulos) - nunca existiu essa fonte;
  o texto sempre caiu na fonte padrão.

Coloquei os dois no `tailwind.config.js`. Troque `"Playfair Display"` pela
fonte que você realmente pretendia usar (ou mantenha, é uma serifada elegante
e gratuita no Google Fonts - se for usá-la, adicione o link no `<head>`:
`<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">`).

## Arquivos criados

- `package.json` - dependência do Tailwind (fixada na v3.4, a versão estável
  e compatível com `tailwind.config.js` clássico; a v4 mudou bastante a forma
  de configurar e vale migrar depois, com calma).
- `tailwind.config.js` - configuração (breakpoint `xs`, fonte `serif-premium`).
- `tailwind-input.css` - arquivo de entrada do build (só as diretivas do
  Tailwind).
- `custom.css` - suas regras escritas à mão (acessibilidade, scrollbar), agora
  sem duplicação. Esse arquivo **não passa pelo build** - é CSS puro, carregado
  direto pelo navegador, sem depender de nada do Node/Tailwind.
- `vercel.json` - diz à Vercel para rodar o build antes de publicar.

O `npm run build` gera um arquivo novo, `tailwind-generated.css`, com só as
classes utilitárias do Tailwind realmente usadas no site. O `index.html` já
foi atualizado para carregar os dois arquivos, nessa ordem:

```html
<link rel="stylesheet" href="tailwind-generated.css">
<link rel="stylesheet" href="custom.css">
```

O antigo `style.css` (o arquivo com a duplicação, de antes dessa migração)
não é mais referenciado pelo HTML - pode apagá-lo do projeto quando terminar
os testes.

> **Por que dois arquivos em vez de um só?** Cheguei a testar usar `@import`
> para juntar tudo num arquivo único, mas o CLI puro do Tailwind não garante
> que esse import seja processado (precisaria de um `postcss.config.js` com
> `postcss-import` configurado à parte, mais uma camada de coisa pra
> configurar). Como o objetivo aqui é simplicidade e confiabilidade, ficou
> melhor manter os dois arquivos separados - zero risco de o build "esquecer"
> silenciosamente as suas regras de acessibilidade.

## Rodando localmente

```bash
# 1. Instalar o Node.js (se ainda não tiver) - https://nodejs.org
# 2. Na pasta do projeto, instalar as dependências
npm install

# 3. Gerar o tailwind-generated.css de produção
npm run build

# (opcional) manter recompilando enquanto você edita o HTML
npm run watch
```

Depois de rodar `npm run build` e conferir que o site continua com a mesma
aparência (agora usando `tailwind-generated.css` + `custom.css`), **remova a
linha do CDN** no `index.html`:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

## Publicando na Vercel

Se o projeto for importado direto do GitHub na Vercel:

1. Em **Project Settings → Build & Development Settings**, confirme:
   - Build Command: `npm run build` (o `vercel.json` já define isso)
   - Output Directory: `.` (raiz do projeto)
2. Faça o commit de todos os arquivos novos (`package.json`,
   `tailwind.config.js`, `tailwind-input.css`, `custom.css`, `vercel.json`)
   junto com o `index.html` atualizado. Não precisa commitar
   `tailwind-generated.css` (ele é gerado a cada build), mas commitar
   também não tem problema.
3. A cada novo deploy, a Vercel vai instalar as dependências e rodar o build
   automaticamente antes de publicar.

## Checklist final

- [ ] `npm install` e `npm run build` rodados sem erro localmente
- [ ] Site conferido no navegador com `tailwind-generated.css` + `custom.css`
      (visual igual ao de antes)
- [ ] Linha do CDN removida do `index.html`
- [ ] `style.css` antigo apagado do projeto
- [ ] Commit + push para o GitHub
- [ ] Deploy na Vercel testado em produção
