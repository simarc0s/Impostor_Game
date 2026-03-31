function send(res, status, data) {
  res.status(status).json(data);
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function validateEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Faltam variaveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  }
  return { url, key };
}

async function supabase(path, options = {}) {
  const { url, key } = validateEnv();
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {})
    }
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error || data.details)) || `Supabase HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

function sanitizeName(name) {
  return String(name || '').trim().slice(0, 18);
}

function sanitizeId(id) {
  return String(id || '').trim().slice(0, 60);
}

function ensureHost(room, actorId) {
  if (!actorId || room.hostId !== actorId) {
    throw new Error('So o host pode executar esta acao.');
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getPlayerById(room, playerId) {
  return room.players.find((p) => p.id === playerId);
}

function buildResult(room) {
  const counts = {};
  const votes = room.votes || {};
  Object.values(votes).forEach((targetId) => {
    counts[targetId] = (counts[targetId] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const tie = sorted.length > 1 && top && sorted[1][1] === top[1];
  const eliminatedId = tie || !top ? null : top[0];
  const impostorCaught = eliminatedId ? room.impostors.includes(eliminatedId) : false;

  return { counts, eliminatedId, impostorCaught, totalVotes: Object.keys(votes).length };
}

async function getRoomByCode(roomCode) {
  const rows = await supabase(`rooms?code=eq.${encodeURIComponent(roomCode)}&select=code,state`);
  const row = rows?.[0];
  if (!row) {
    return null;
  }
  return row.state;
}

async function saveRoomByCode(roomCode, room) {
  await supabase(`rooms?code=eq.${encodeURIComponent(roomCode)}`, {
    method: 'PATCH',
    body: JSON.stringify({ state: room })
  });
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const code = String(req.query.code || '').toUpperCase().trim();
      if (!code || code.length !== 4) {
        return send(res, 400, { error: 'Codigo invalido.' });
      }

      const room = await getRoomByCode(code);
      if (!room) {
        return send(res, 404, { error: 'Sala nao encontrada.' });
      }

      return send(res, 200, { code, room });
    }

    if (req.method !== 'POST') {
      return send(res, 405, { error: 'Metodo nao permitido.' });
    }

    const body = req.body || {};
    const action = body.action;
    const roomCode = String(body.code || '').toUpperCase().trim();

    if (!roomCode || roomCode.length !== 4) {
      return send(res, 400, { error: 'Codigo invalido (4 caracteres).' });
    }

    if (action === 'create') {
      const room = body.room;
      if (!room) {
        return send(res, 400, { error: 'Dados invalidos para criar sala.' });
      }

      const exists = await supabase(`rooms?code=eq.${encodeURIComponent(roomCode)}&select=code`);
      if (exists?.length) {
        return send(res, 409, { error: 'Sala ja existe.' });
      }

      room.phase = 'lobby';
      room.votes = {};
      room.result = null;
      room.revealReady = {};

      await supabase('rooms', {
        method: 'POST',
        body: JSON.stringify([{ code: roomCode, state: room }])
      });

      return send(res, 200, { code: roomCode, room });
    }

    const room = await getRoomByCode(roomCode);
    if (!room) {
      return send(res, 404, { error: 'Sala nao encontrada. Verifica o codigo.' });
    }

    if (action === 'join') {
      const playerName = sanitizeName(body.name);
      const playerId = sanitizeId(body.playerId);

      if (!playerName || !playerId) {
        return send(res, 400, { error: 'Nome ou identificador invalido.' });
      }
      if (room.phase !== 'lobby') {
        return send(res, 409, { error: 'O jogo ja comecou!' });
      }
      if (room.players.length >= room.maxP) {
        return send(res, 409, { error: 'Sala cheia!' });
      }

      const sameName = room.players.find((p) => p.name.toLowerCase() === playerName.toLowerCase());
      if (sameName && sameName.id !== playerId) {
        return send(res, 409, { error: 'Esse nome ja esta em uso nesta sala.' });
      }

      const alreadyIn = room.players.find((p) => p.id === playerId);
      if (!alreadyIn) {
        const emojiPool = ['🦊', '🐺', '🦅', '🐉', '🦁', '🐯', '🦈', '🐻', '🦝', '🦋', '🐙', '🦄', '🦩', '🐸', '🐨'];
        room.players.push({
          id: playerId,
          name: playerName,
          emoji: emojiPool[room.players.length % emojiPool.length],
          isBot: false
        });
      }

      await saveRoomByCode(roomCode, room);
      return send(res, 200, { code: roomCode, room });
    }

    if (action === 'add_bot') {
      const actorId = sanitizeId(body.actorId);
      ensureHost(room, actorId);

      if (room.phase !== 'lobby') {
        return send(res, 409, { error: 'So podes adicionar bots no lobby.' });
      }
      if (room.players.length >= room.maxP) {
        return send(res, 409, { error: 'Sala cheia!' });
      }

      const names = ['Alex', 'Bruno', 'Carla', 'Diogo', 'Eva', 'Fabio', 'Gabi', 'Hugo', 'Iris', 'Jorge', 'Katia', 'Luis'];
      const used = new Set(room.players.map((p) => p.name));
      const free = names.filter((n) => !used.has(n));
      if (!free.length) {
        return send(res, 409, { error: 'Sem nomes de bot disponiveis.' });
      }

      const botName = free[Math.floor(Math.random() * free.length)];
      const emojiPool = ['🦊', '🐺', '🦅', '🐉', '🦁', '🐯', '🦈', '🐻', '🦝', '🦋', '🐙', '🦄', '🦩', '🐸', '🐨'];

      room.players.push({
        id: `bot_${Math.random().toString(36).slice(2, 10)}`,
        name: botName,
        emoji: emojiPool[room.players.length % emojiPool.length],
        isBot: true
      });

      await saveRoomByCode(roomCode, room);
      return send(res, 200, { code: roomCode, room });
    }

    if (action === 'start') {
      const actorId = sanitizeId(body.actorId);
      ensureHost(room, actorId);

      if (room.players.length < 3) {
        return send(res, 409, { error: 'Minimo de 3 jogadores.' });
      }
      if (!body.words || !body.words.wordReal) {
        return send(res, 400, { error: 'Palavras invalidas para iniciar.' });
      }

      room.wordReal = body.words.wordReal;
      room.wordFake = body.words.wordFake;

      const ids = room.players.map((p) => p.id);
      const shuffled = shuffle([...ids]);
      room.impostors = shuffled.slice(0, room.maxI);

      room.assigns = {};
      room.revealReady = {};
      room.players.forEach((p) => {
        room.assigns[p.id] = room.impostors.includes(p.id) ? room.wordFake : room.wordReal;
        room.revealReady[p.id] = !!p.isBot;
      });

      room.votes = {};
      room.result = null;
      room.phase = 'reveal';

      await saveRoomByCode(roomCode, room);
      return send(res, 200, { code: roomCode, room });
    }

    if (action === 'reveal_ready') {
      const actorId = sanitizeId(body.actorId);
      const player = getPlayerById(room, actorId);

      if (!player || player.isBot) {
        return send(res, 400, { error: 'Jogador invalido para confirmar palavra.' });
      }
      if (room.phase !== 'reveal') {
        return send(res, 409, { error: 'Fase de revelacao ja terminou.' });
      }

      room.revealReady = room.revealReady || {};
      room.revealReady[actorId] = true;

      const everyoneReady = room.players.every((p) => !!room.revealReady[p.id]);
      if (everyoneReady) {
        room.phase = 'discussion';
      }

      await saveRoomByCode(roomCode, room);
      return send(res, 200, { code: roomCode, room });
    }

    if (action === 'open_vote') {
      const actorId = sanitizeId(body.actorId);
      ensureHost(room, actorId);

      if (room.phase !== 'discussion') {
        return send(res, 409, { error: 'A votacao so abre depois da discussao.' });
      }

      room.phase = 'vote';
      room.votes = {};

      await saveRoomByCode(roomCode, room);
      return send(res, 200, { code: roomCode, room });
    }

    if (action === 'cast_vote') {
      const actorId = sanitizeId(body.actorId);
      const targetId = sanitizeId(body.targetId);
      const voter = getPlayerById(room, actorId);
      const target = getPlayerById(room, targetId);

      if (!voter || voter.isBot) {
        return send(res, 400, { error: 'Votante invalido.' });
      }
      if (!target) {
        return send(res, 400, { error: 'Alvo de voto invalido.' });
      }
      if (room.phase !== 'vote') {
        return send(res, 409, { error: 'A sala nao esta em votacao.' });
      }

      room.votes = room.votes || {};
      room.votes[actorId] = targetId;

      const humanPlayers = room.players.filter((p) => !p.isBot).map((p) => p.id);
      const allVoted = humanPlayers.every((pid) => !!room.votes[pid]);
      if (allVoted) {
        room.result = buildResult(room);
        room.phase = 'result';
      }

      await saveRoomByCode(roomCode, room);
      return send(res, 200, { code: roomCode, room });
    }

    if (action === 'play_again') {
      const actorId = sanitizeId(body.actorId);
      ensureHost(room, actorId);

      room.phase = 'lobby';
      room.wordReal = null;
      room.wordFake = null;
      room.impostors = [];
      room.assigns = {};
      room.revealReady = {};
      room.votes = {};
      room.result = null;

      await saveRoomByCode(roomCode, room);
      return send(res, 200, { code: roomCode, room });
    }

    return send(res, 400, { error: 'Acao invalida.' });
  } catch (error) {
    console.error('room api error', error);
    return send(res, 500, { error: error.message || 'Erro interno.' });
  }
}
