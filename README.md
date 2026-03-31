# IMPOSTOR - Jogo de Palavras

Jogo de deducao social com salas por codigo. Agora as salas sao persistidas em Supabase para permitir criar/entrar entre dispositivos (ex.: host no PC e amigo no telemovel).

## Deploy no Vercel

1. Liga o repositorio no Vercel.
2. Define as variaveis de ambiente no projeto:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
3. Faz deploy.

## Setup do Supabase

1. Cria um projeto no Supabase.
2. No SQL Editor, executa [IMPOSTOR-GAME.sql](IMPOSTOR-GAME.sql).
3. Em Project Settings > API, copia:
   - URL (SUPABASE_URL)
   - service_role key (SUPABASE_SERVICE_ROLE_KEY)
4. Cola estas variaveis no Vercel e (se quiseres testar local) no teu ambiente local.

## Executar localmente

```bash
vercel dev
```

Abre http://localhost:3000

## Estrutura

```text
imp/
  public/
    index.html      # frontend do jogo
  api/
    words.js        # palavras por categoria
    room.js         # criar/entrar/guardar salas (Supabase)
  IMPOSTOR-GAME.sql # schema da tabela rooms
  vercel.json
  package.json
  README.md
```

## Notas

- O ficheiro principal de frontend e [public/index.html](public/index.html).
- Se precisares de mais palavras, edita [api/words.js](api/words.js).

## Licenca

MIT
