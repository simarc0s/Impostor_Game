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

  const pairs = WORD_PAIRS[category] || WORD_PAIRS['aleatório'];
  
  // Seleciona um par aleatório
  const randomPair = pairs[Math.floor(Math.random() * pairs.length)];

  return res.status(200).json(randomPair);
}
