// Pares de palavras relacionadas para o jogo
const WORD_PAIRS = {
  aleatório: [
    { wordReal: 'Presidente', wordFake: 'Príncipe' },
    { wordReal: 'Microscópio', wordFake: 'Telescópio' },
    { wordReal: 'Algebra', wordFake: 'Geometria' },
    { wordReal: 'Pulmão', wordFake: 'Coração' },
    { wordReal: 'Semáforo', wordFake: 'Placa' },
    { wordReal: 'Urso', wordFake: 'Lobo' },
    { wordReal: 'Pasta', wordFake: 'Arroz' },
    { wordReal: 'Helicóptero', wordFake: 'Avião' },
  ],
  animais: [
    { wordReal: 'Águia', wordFake: 'Falcão' },
    { wordReal: 'Baleia', wordFake: 'Golfinho' },
    { wordReal: 'Zebra', wordFake: 'Girafa' },
    { wordReal: 'Lagartixa', wordFake: 'Cobra' },
    { wordReal: 'Pinguim', wordFake: 'Foca' },
    { wordReal: 'Chimpanzé', wordFake: 'Gorila' },
    { wordReal: 'Coruja', wordFake: 'Mocho' },
    { wordReal: 'Tubarão', wordFake: 'Raia' },
  ],
  comida: [
    { wordReal: 'Sushi', wordFake: 'Tempura' },
    { wordReal: 'Bolonhesa', wordFake: 'Carbonara' },
    { wordReal: 'Croissant', wordFake: 'Pão de Queijo' },
    { wordReal: 'Gelado', wordFake: 'Sorbet' },
    { wordReal: 'Churrasco', wordFake: 'Espetada' },
    { wordReal: 'Paella', wordFake: 'Risoto' },
    { wordReal: 'Bife', wordFake: 'Costeleta' },
    { wordReal: 'Queijo', wordFake: 'Manteiga' },
  ],
  filmes: [
    { wordReal: 'Gladiador', wordFake: 'Centurião' },
    { wordReal: 'Homem-Aranha', wordFake: 'Homem-Formiga' },
    { wordReal: 'Rocky', wordFake: 'Rambo' },
    { wordReal: 'ET', wordFake: 'ALF' },
    { wordReal: 'Shrek', wordFake: 'Fiona' },
    { wordReal: 'Planeta dos Macacos', wordFake: 'Planeta Vermelho' },
    { wordReal: 'Jogo da Imitação', wordFake: 'O Código Enigma' },
    { wordReal: 'Interestelar', wordFake: 'Gravidade' },
  ],
  lugares: [
    { wordReal: 'Egito', wordFake: 'Sudão' },
    { wordReal: 'Suíça', wordFake: 'Áustria' },
    { wordReal: 'Amsterdão', wordFake: 'Roterdão' },
    { wordReal: 'Deserto', wordFake: 'Savana' },
    { wordReal: 'Caverna', wordFake: 'Mina' },
    { wordReal: 'Vulcão', wordFake: 'Cratera' },
    { wordReal: 'Islândia', wordFake: 'Groenlândia' },
    { wordReal: 'Colosseu', wordFake: 'Anfiteatro' },
  ],
  profissões: [
    { wordReal: 'Engenheiro', wordFake: 'Arquiteto' },
    { wordReal: 'Eletricista', wordFake: 'Encanador' },
    { wordReal: 'Repórter', wordFake: 'Entrevistador' },
    { wordReal: 'Psicólogo', wordFake: 'Psiquiatra' },
    { wordReal: 'Guarda Costeira', wordFake: 'Militar' },
    { wordReal: 'Historiador', wordFake: 'Arqueólogo' },
    { wordReal: 'Botanista', wordFake: 'Biólogo' },
    { wordReal: 'Fotógrafo', wordFake: 'Cinegrafista' },
  ],
  objetos: [
    { wordReal: 'Bússola', wordFake: 'Mapa' },
    { wordReal: 'Martelo', wordFake: 'Machado' },
    { wordReal: 'Espada', wordFake: 'Lança' },
    { wordReal: 'Âncora', wordFake: 'Corrente' },
    { wordReal: 'Chave', wordFake: 'Cadeado' },
    { wordReal: 'Telescópio', wordFake: 'Periscópio' },
    { wordReal: 'Termómetro', wordFake: 'Barômetro' },
    { wordReal: 'Moeda', wordFake: 'Medalha' },
  ],
  desporto: [
    { wordReal: 'Voleibol', wordFake: 'Basquetebol' },
    { wordReal: 'Hóquei', wordFake: 'Polo' },
    { wordReal: 'Esgrima', wordFake: 'Capoeira' },
    { wordReal: 'Tiro com Arco', wordFake: 'Dardos' },
    { wordReal: 'Esqui', wordFake: 'Snowboard' },
    { wordReal: 'Surfe', wordFake: 'Wakeboard' },
    { wordReal: 'Escalada', wordFake: 'Rapel' },
    { wordReal: 'Badminton', wordFake: 'Ténis de Mesa' },
  ],
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
    wordFake: pair.wordFake
  });
}
