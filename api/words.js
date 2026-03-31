// Pares de palavras relacionadas para o jogo
const WORD_PAIRS = {
  aleatório: [
    { wordReal: 'Guitarra', wordFake: 'Violão', hint: 'Também és um instrumento de cordas, muito usado no Brasil' },
    { wordReal: 'Bicicleta', wordFake: 'Triciclo', hint: 'Também és um meio de transporte com rodas, pedais e corrente' },
    { wordReal: 'Livro', wordFake: 'Revista', hint: 'Também és uma publicação impressa com páginas encadernadas' },
    { wordReal: 'Cão', wordFake: 'Lobo', hint: 'Também és um animal canino selvagem e feroz' },
  ],
  animais: [
    { wordReal: 'Leão', wordFake: 'Tigre', hint: 'Também és um grande felino selvagem, muito feroz' },
    { wordReal: 'Gato', wordFake: 'Gato-montês', hint: 'Também és um felino, menor e mais selvagem' },
    { wordReal: 'Cobra', wordFake: 'Píton', hint: 'Também és uma serpente longa e constritora' },
    { wordReal: 'Elefante', wordFake: 'Rinoceronte', hint: 'Também és um mamífero gigante e forte' },
  ],
  comida: [
    { wordReal: 'Pizza', wordFake: 'Calzone', hint: 'Também és feito de massa, queijo e molho, mas dobrado' },
    { wordReal: 'Hambúrguer', wordFake: 'Cachorro-quente', hint: 'Também és um sanduíche com carne num pão' },
    { wordReal: 'Chocolate', wordFake: 'Trufa', hint: 'Também és feito de cacau, doce e delicioso' },
    { wordReal: 'Pão', wordFake: 'Broa', hint: 'Também és um alimento de massa fermentada cozida' },
  ],
  filmes: [
    { wordReal: 'Titanic', wordFake: 'Pearl Harbor', hint: 'Também és um drama histórico com romance' },
    { wordReal: 'Avatar', wordFake: 'Duna', hint: 'Também és uma ficção científica épica de ficção científica' },
    { wordReal: 'Jaws', wordFake: 'Tubarão Branco', hint: 'Também és um filme de terror com criaturas marinhas' },
    { wordReal: 'Matrix', wordFake: 'Inception', hint: 'Também és ficção científica sobre realidade virtual' },
  ],
  lugares: [
    { wordReal: 'Paris', wordFake: 'Roma', hint: 'Também és uma capital europeia com monumentos históricos' },
    { wordReal: 'Praia', wordFake: 'Baía', hint: 'Também és um local à beira do oceano com areia' },
    { wordReal: 'Floresta', wordFake: 'Selva', hint: 'Também és um ecossistema com muitas árvores' },
    { wordReal: 'Montanha', wordFake: 'Colina', hint: 'Também és uma elevação de terra muito grande' },
  ],
  profissões: [
    { wordReal: 'Médico', wordFake: 'Enfermeiro', hint: 'Também trabalhas na saúde cuidando de pessoas' },
    { wordReal: 'Professor', wordFake: 'Tutor', hint: 'Também és alguém que ensina e transmite conhecimento' },
    { wordReal: 'Polícia', wordFake: 'Guarda', hint: 'Também és alguém que trabalha na segurança e ordem' },
    { wordReal: 'Cozinheiro', wordFake: 'Pasteleiro', hint: 'Também és alguém que prepara comida' },
  ],
  objetos: [
    { wordReal: 'Tesoura', wordFake: 'Faca', hint: 'Também és um utensílio cortante de metal' },
    { wordReal: 'Relógio', wordFake: 'Despertador', hint: 'Também és um objeto que marca tempo' },
    { wordReal: 'Lâmpada', wordFake: 'Vela', hint: 'Também és algo que ilumina um lugar' },
    { wordReal: 'Cadeira', wordFake: 'Banco', hint: 'Também és um móvel para sentar' },
  ],
  desporto: [
    { wordReal: 'Futebol', wordFake: 'Rugby', hint: 'Também és um desporto de equipa com bola' },
    { wordReal: 'Natação', wordFake: 'Mergulho', hint: 'Também és um desporto na água' },
    { wordReal: 'Tênis', wordFake: 'Badminton', hint: 'Também és um desporto com raquete' },
    { wordReal: 'Boxe', wordFake: 'Muay Thai', hint: 'Também és um desporto de combate' },
  ],
};

const VAGUE_HINTS = {
  aleatório: [
    'Esta palavra fica perto da ideia certa, mas por outro caminho.',
    'Pensa numa alternativa comum no mesmo universo.',
    'Nao e oposto, nao e igual: e da mesma familia.'
  ],
  animais: [
    'Move-se no mesmo tipo de habitat em muitos casos.',
    'Partilha alguns comportamentos observaveis.',
    'Pensa em algo do mesmo grupo geral.'
  ],
  comida: [
    'Aparece em contextos de refeicao parecidos.',
    'A sensacao geral pode ser parecida para muita gente.',
    'Costuma viver na mesma conversa de mesa.'
  ],
  filmes: [
    'Evoca uma experiencia de genero semelhante.',
    'Tem atmosfera que pode confundir numa descricao curta.',
    'Cabe no mesmo tipo de recomendacao informal.'
  ],
  lugares: [
    'Tem funcao ou papel parecido em certos roteiros.',
    'Partilha contexto geografico ou cultural amplo.',
    'Muitas pessoas associam ao mesmo tipo de viagem.'
  ],
  profissões: [
    'Atua numa area profissional muito proxima.',
    'Pode aparecer no mesmo ambiente de trabalho.',
    'Muda o detalhe, mantem o contexto.'
  ],
  objetos: [
    'Serve para uso cotidiano em situacao semelhante.',
    'Tem finalidade parecida vista de longe.',
    'Nao e o mesmo objeto, mas cumpre papel proximo.'
  ],
  desporto: [
    'Partilha dinamica geral de jogo ou pratica.',
    'Pode confundir quando descrito em poucas palavras.',
    'Costuma surgir no mesmo tipo de conversa desportiva.'
  ]
};

function randomIndex(max) {
  if (max <= 0) return 0;
  if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
    const arr = new Uint32Array(1);
    globalThis.crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function normalizeCategory(category) {
  if (!category) return 'aleatório';
  if (category === 'aleatorio') return 'aleatório';
  if (category === 'profissoes') return 'profissões';
  return category;
}

function allPairs() {
  return Object.values(WORD_PAIRS).flat();
}

function pickPair(category) {
  const normalized = normalizeCategory(category);
  const pool = normalized === 'aleatório' ? allPairs() : (WORD_PAIRS[normalized] || WORD_PAIRS['aleatório']);
  return pool[randomIndex(pool.length)];
}

function pickVagueHint(category) {
  const normalized = normalizeCategory(category);
  const hints = VAGUE_HINTS[normalized] || VAGUE_HINTS['aleatório'];
  return hints[randomIndex(hints.length)];
}

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'category required' });
  }

  const pair = pickPair(category);
  return res.status(200).json({
    wordReal: pair.wordReal,
    wordFake: pair.wordFake,
    hint: pickVagueHint(category)
  });
}
