# README - Front-end

Repositório original: `https://github.com/Danilloxkl/Front_end_do_BRUNO_JOGUE_CELESTE`

Front-end em React + Vite para autenticação e gerenciamento de hábitos. A aplicação conversa com a API do projeto para login, cadastro, listagem e manutenção dos registros.

## Tecnologias

- React
- Vite
- React Router
- Axios
- PrimeReact

## Requisitos

- Node.js 20 ou superior
- npm
- Back-end do projeto rodando

## Como rodar

1. Entre na pasta do front:

```bash
cd Front_end_do_BRUNO_JOGUE_CELESTE/frontEnd
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do front (`frontEnd/.env`) com a URL da API:

```env
VITE_API_URL=http://localhost:3000
```

4. Inicie o projeto:

```bash
npm run dev
```

Por padrão, o Vite sobe em `http://localhost:5173`.

## Dotenv

O Vite só expõe para o front variáveis que começam com `VITE_`, então o nome precisa ser exatamente este:

```env
VITE_API_URL=http://localhost:3000
```

### Regras importantes

- o arquivo deve ficar em `Front_end_do_BRUNO_JOGUE_CELESTE/frontEnd/.env`
- o prefixo `VITE_` é obrigatório
- o `.env` já está ignorado no `.gitignore`
- depois de alterar o `.env`, reinicie o `npm run dev`

## Como integrar com o back-end

Este front usa `src/api/http.js` para centralizar a URL da API:

```js
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

Então a integração fica assim:

1. Suba o back-end em `http://localhost:3000`
2. No front, configure `VITE_API_URL=http://localhost:3000`
3. No back, configure `CORS_ORIGIN=http://localhost:5173`
4. Rode o front com `npm run dev`

## Fluxos já integrados

Com o back atual, estas partes do front podem funcionar:

- cadastro de usuário
- login
- armazenamento do token no `localStorage`
- envio automático do token no header `Authorization`
- listagem de hábitos
- visualização de detalhe
- criação, edição e remoção de registros
- resumo em `/habit-records/stats/summary`

## Observação importante sobre a área de admin

Existe uma tela `Admin`, mas hoje ela chama rotas como:

- `GET /admin/habits`
- `POST /admin/habits`
- `PUT /admin/habits/:id`
- `DELETE /admin/habits/:id`

Essas rotas não existem no back enviado junto com este projeto. No back atual, as rotas administrativas são outras, como:

- `GET /habit-records/admin/all`
- `DELETE /habit-records/admin/:id`
- `GET /users`

Então, para a tela de admin funcionar, será preciso alinhar o arquivo `src/api/adminApi.js` com as rotas reais do back.

O painel usa estas rotas reais do back:

- `GET /habit-records/admin/all`
- `DELETE /habit-records/admin/:id`
- `GET /users`
- `PATCH /users/:id`
- `DELETE /users/:id`

Ao subir o back, existe um admin padrão para acessar `/admin`:

```text
email: admin@gmail.com
senha: 123456
```

## Scripts

- `npm run dev`: inicia o Vite em desenvolvimento
- `npm run build`: gera a versão de produção
- `npm run preview`: sobe a build localmente
- `npm run lint`: executa o ESLint
