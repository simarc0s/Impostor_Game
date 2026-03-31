# IMPOSTOR — Jogo de Palavras 🎮

Jogo de dedução social online. Um impostor infiltrado, muita suspeita e boas gargalhadas!

## 🚀 Deploy no Vercel (RÁPIDO!)

### 1. Instala Vercel CLI
```bash
npm install -g vercel
```

### 2. Faz login
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

**Pronto!** O jogo está online! 🎉

A Vercel gera um URL tipo: `https://impostor-game-xxx.vercel.app`

### 4. Partilha o link com os colegas!

## 🎮 Como Jogar Localmente

```bash
# Terminal 1: Vercel dev environment
vercel dev
```

Depois abre: `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
imp/
├── public/
│   └── index.html          # Frontend (jogo)
├── api/
│   └── words.js            # Backend (gera palavras)
├── package.json
├── vercel.json
└── README.md
```

---

## 🔧 Como Adicionar Novas Palavras

Edita `api/words.js` e adiciona mais pares em `WORD_PAIRS`:

```javascript
aleatório: [
  { wordReal: 'Palavra1', wordFake: 'Palavra2', hint: 'Dica para o impostor' },
  // Mais...
]
```

---

## 💡 Features

- ✅ Multiplayer local (todas as pessoas na mesma rede podem jogar)
- ✅ Salas com código (ex: AB12)
- ✅ Jogadores virtuais (bots)
- ✅ 8 categorias de palavras
- ✅ Suporta até 12 jogadores
- ✅ Totalmente em português
- ✅ Design dark mode futurista

---

## 📝 Licença

MIT
