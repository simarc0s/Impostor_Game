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
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error || data.details)) || `Supabase HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

function sanitizeName(name) {
  return String(name || '').trim().slice(0, 18);
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

      const rows = await supabase(`rooms?code=eq.${encodeURIComponent(code)}&select=code,state`);
      const roomRow = rows?.[0];
      if (!roomRow) {
        return send(res, 404, { error: 'Sala nao encontrada.' });
      }

      return send(res, 200, { code, room: roomRow.state });
    }

    if (req.method !== 'POST') {
      return send(res, 405, { error: 'Metodo nao permitido.' });
    }

    const { action, code, room, name } = req.body || {};

    if (action === 'create') {
      const roomCode = String(code || '').toUpperCase().trim();
      if (!roomCode || roomCode.length !== 4 || !room) {
        return send(res, 400, { error: 'Dados invalidos para criar sala.' });
      }

      const exists = await supabase(`rooms?code=eq.${encodeURIComponent(roomCode)}&select=code`);
      if (exists?.length) {
        return send(res, 409, { error: 'Sala ja existe.' });
      }

      await supabase('rooms', {
        method: 'POST',
        body: JSON.stringify([{ code: roomCode, state: room }])
      });

      return send(res, 200, { code: roomCode, room });
    }

    if (action === 'join') {
      const roomCode = String(code || '').toUpperCase().trim();
      const playerName = sanitizeName(name);

      if (!roomCode || roomCode.length !== 4) {
        return send(res, 400, { error: 'Codigo invalido (4 caracteres).' });
      }
      if (!playerName) {
        return send(res, 400, { error: 'Insere o teu nome.' });
      }

      const rows = await supabase(`rooms?code=eq.${encodeURIComponent(roomCode)}&select=code,state`);
      const row = rows?.[0];
      if (!row) {
        return send(res, 404, { error: 'Sala nao encontrada. Verifica o codigo.' });
      }

      const game = row.state;
      if (game.phase !== 'lobby') {
        return send(res, 409, { error: 'O jogo ja comecou!' });
      }
      if (game.players.length >= game.maxP) {
        return send(res, 409, { error: 'Sala cheia!' });
      }
      if (game.players.find((p) => p.name.toLowerCase() === playerName.toLowerCase())) {
        return send(res, 409, { error: 'Esse nome ja esta em uso nesta sala.' });
      }

      const emojiPool = ['🦊','🐺','🦅','🐉','🦁','🐯','🦈','🐻','🦝','🦋','🐙','🦄','🦩','🐸','🐨'];
      game.players.push({
        name: playerName,
        emoji: emojiPool[game.players.length % emojiPool.length],
        isBot: false
      });

      await supabase(`rooms?code=eq.${encodeURIComponent(roomCode)}`, {
        method: 'PATCH',
        body: JSON.stringify({ state: game })
      });

      return send(res, 200, { code: roomCode, room: game });
    }

    if (action === 'save') {
      const roomCode = String(code || '').toUpperCase().trim();
      if (!roomCode || roomCode.length !== 4 || !room) {
        return send(res, 400, { error: 'Dados invalidos para guardar sala.' });
      }

      await supabase(`rooms?code=eq.${encodeURIComponent(roomCode)}`, {
        method: 'PATCH',
        body: JSON.stringify({ state: room })
      });

      return send(res, 200, { ok: true });
    }

    return send(res, 400, { error: 'Acao invalida.' });
  } catch (error) {
    console.error('room api error', error);
    return send(res, 500, { error: error.message || 'Erro interno.' });
  }
}
