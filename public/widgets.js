// ═══════════════════════════════════════════════════════════════
//  SeWalk AI — Widget Engine v1.0
//  ADD <script src="widgets.js"></script> to index.html
//  BEFORE the closing </body> tag, AFTER app.js
// ═══════════════════════════════════════════════════════════════

// ── Widget intent detection ───────────────────────────────────
const WIDGET_PATTERNS = {
  clock: [
    /what('?s| is) the (time|clock)/i,
    /current time/i,
    /show (me )?(the |a )?(clock|time)/i,
    /time (right )?now/i,
    /\bwhat time\b/i,
  ],
  calculator: [
    /calculate\s+(.+)/i,
    /what('?s| is)\s+[\d\s\+\-\*\/\^\(\)\.]+[=\?]/i,
    /\b(\d+[\s]*[\+\-\*\/\^][\s]*\d+)\b/,
    /solve\s+(.+)/i,
    /\bmath\b.*\d/i,
    /\d+\s*(plus|minus|times|divided by|multiplied by)\s*\d+/i,
  ],
  weather: [
    /weather\s+(in|at|for)\s+(.+)/i,
    /what('?s| is) (the )?weather (in|at|for) (.+)/i,
    /temperature\s+(in|at)\s+(.+)/i,
    /how('?s| is) (the )?weather\s*(in|at)?\s*(.+)?/i,
    /is it (hot|cold|raining|sunny|cloudy)\s*(in\s+.+)?/i,
    /(today|tomorrow)'?s weather/i,
  ],
  web_search: [
    /search (for|the web for|online for|internet for)\s+(.+)/i,
    /what('?s| is) (happening|going on|trending)/i,
    /latest (news|updates|results) (about|on|for)\s+(.+)/i,
    /find (me )?(info|information|news|results) (on|about)\s+(.+)/i,
    /look up\s+(.+)/i,
    /google\s+(.+)/i,
    /search\s+(.+)\s+(on (the )?web|online|internet)/i,
    /what('?s| is) new (with|in|about)\s+(.+)/i,
    /latest on\s+(.+)/i,
    /news (about|on)\s+(.+)/i,
  ],
  youtube: [
    /youtube\s+(.+)/i,
    /show (me )?(youtube|yt) (videos?|results?) (for|about|on)\s+(.+)/i,
    /find (me )?(videos?|yt|youtube) (on|about|for)\s+(.+)/i,
    /watch\s+(.+)\s+on youtube/i,
    /suggest (me )?(some )?(youtube |yt )?(videos?|channels?) (on|about|for)\s+(.+)/i,
    /(recommend|suggest) (videos?|channels?)\s*(on|about|for)?\s+(.+)/i,
    /yt videos? (on|about|for)\s+(.+)/i,
  ],
  graph: [
    /graph (of|for)\s+(.+)/i,
    /plot\s+(.+)/i,
    /show (me )?(a |the )?graph\s+(.+)/i,
    /draw (a |the )?graph\s+(.+)/i,
    /visualize\s+(.+)/i,
  ],
};

// ── Extract query from user message ──────────────────────────
function extractQuery(msg, type) {
  const m = msg.toLowerCase().trim();

  if (type === 'weather') {
    const patterns = [
      /weather\s+(?:in|at|for)\s+(.+)/i,
      /(?:what(?:'s| is) (?:the )?weather (?:in|at|for)) (.+)/i,
      /temperature\s+(?:in|at)\s+(.+)/i,
      /(?:how(?:'s| is) (?:the )?weather\s*(?:in|at)?\s*)(.+)/i,
    ];
    for (const p of patterns) {
      const match = msg.match(p);
      if (match) return match[1].replace(/[?!.]$/, '').trim();
    }
    return null;
  }

  if (type === 'web_search') {
    const patterns = [
      /search\s+(?:for|the web for|online for|internet for)\s+(.+)/i,
      /latest\s+(?:news|updates|results)\s+(?:about|on|for)\s+(.+)/i,
      /find\s+(?:me\s+)?(?:info|information|news|results)\s+(?:on|about)\s+(.+)/i,
      /look up\s+(.+)/i,
      /google\s+(.+)/i,
      /news\s+(?:about|on)\s+(.+)/i,
      /latest\s+on\s+(.+)/i,
      /what(?:'s| is)\s+(?:happening|going on|trending)\s+(?:with|in|about)\s+(.+)/i,
      /search\s+(.+)\s+(?:on (?:the )?web|online|internet)/i,
      /what(?:'s| is)\s+new\s+(?:with|in|about)\s+(.+)/i,
    ];
    for (const p of patterns) {
      const match = msg.match(p);
      if (match) return match[1].replace(/[?!.]$/, '').trim();
    }
    // Fallback: use the whole message as query
    return msg.replace(/[?!.]$/, '').trim();
  }

  if (type === 'youtube') {
    const patterns = [
      /youtube\s+(.+)/i,
      /show\s+(?:me\s+)?(?:youtube|yt)\s+(?:videos?|results?)\s+(?:for|about|on)\s+(.+)/i,
      /find\s+(?:me\s+)?(?:videos?|yt|youtube)\s+(?:on|about|for)\s+(.+)/i,
      /watch\s+(.+)\s+on youtube/i,
      /suggest\s+(?:me\s+)?(?:some\s+)?(?:youtube\s+|yt\s+)?(?:videos?|channels?)\s+(?:on|about|for)\s+(.+)/i,
      /(?:recommend|suggest)\s+(?:videos?|channels?)\s*(?:on|about|for)?\s+(.+)/i,
      /yt\s+videos?\s+(?:on|about|for)\s+(.+)/i,
    ];
    for (const p of patterns) {
      const match = msg.match(p);
      if (match) return match[1].replace(/[?!.]$/, '').trim();
    }
    return msg.replace(/[?!.]$/, '').trim();
  }

  if (type === 'graph') {
    const patterns = [
      /graph\s+(?:of|for)\s+(.+)/i,
      /plot\s+(.+)/i,
      /show\s+(?:me\s+)?(?:a\s+|the\s+)?graph\s+(.+)/i,
      /draw\s+(?:a\s+|the\s+)?graph\s+(.+)/i,
      /visualize\s+(.+)/i,
    ];
    for (const p of patterns) {
      const match = msg.match(p);
      if (match) return match[1].replace(/[?!.]$/, '').trim();
    }
    return msg;
  }

  if (type === 'calculator') {
    // Extract math expression
    const calcMatch = msg.match(/calculate\s+(.+)/i) ||
                      msg.match(/solve\s+(.+)/i) ||
                      msg.match(/([\d\s\+\-\*\/\^\(\)\.]+)/);
    if (calcMatch) return calcMatch[1].trim();
    return msg;
  }

  return msg;
}

// ── Detect widget type from user message ──────────────────────
function detectWidget(msg) {
  for (const [type, patterns] of Object.entries(WIDGET_PATTERNS)) {
    if (patterns.some(p => p.test(msg))) return type;
  }
  return null;
}

// ── Weather icon mapper ───────────────────────────────────────
function getWeatherEmoji(condition) {
  const map = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
    Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️',
    Haze: '🌫️', Smoke: '💨', Dust: '💨', Tornado: '🌪️',
  };
  return map[condition] || '🌡️';
}

// ─────────────────────────────────────────────────────────────
//  WIDGET RENDERERS
// ─────────────────────────────────────────────────────────────

// ── 1. CLOCK WIDGET ───────────────────────────────────────────
function renderClockWidget() {
  const id = 'clock-' + Date.now();
  const div = document.createElement('div');
  div.className = 'sw-widget sw-widget-clock';
  div.innerHTML = `
    <div class="sw-widget-header">🕐 Live Clock</div>
    <div class="sw-clock-display" id="${id}-time">--:--:--</div>
    <div class="sw-clock-date" id="${id}-date">Loading...</div>
    <div class="sw-clock-tz" id="${id}-tz"></div>
  `;

  function tick() {
    const now = new Date();
    const timeEl = document.getElementById(`${id}-time`);
    const dateEl = document.getElementById(`${id}-date`);
    const tzEl   = document.getElementById(`${id}-tz`);
    if (!timeEl) return; // widget was removed
    timeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    tzEl.textContent   = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  tick();
  const interval = setInterval(tick, 1000);
  // Clean up interval when widget is removed from DOM
  const observer = new MutationObserver(() => {
    if (!document.contains(div)) { clearInterval(interval); observer.disconnect(); }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return div;
}

// ── 2. CALCULATOR WIDGET ──────────────────────────────────────
function renderCalculatorWidget(expression) {
  let result = '?';
  let error = false;
  try {
    // Safe math eval — only allow numbers and operators
    const cleaned = expression
      .replace(/x/gi, '*').replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/\^/g, '**').replace(/[^\d\s\+\-\*\/\.\(\)\%]/g, '');
    if (!cleaned.trim()) throw new Error('Empty expression');
    result = Function('"use strict"; return (' + cleaned + ')')();
    if (!isFinite(result)) throw new Error('Invalid result');
    result = parseFloat(result.toFixed(10)).toString();
  } catch {
    error = true;
    result = 'Could not compute';
  }

  const div = document.createElement('div');
  div.className = 'sw-widget sw-widget-calculator';
  div.innerHTML = `
    <div class="sw-widget-header">🧮 Calculator</div>
    <div class="sw-calc-expression">${expression}</div>
    <div class="sw-calc-equals">=</div>
    <div class="sw-calc-result ${error ? 'sw-calc-error' : ''}">${result}</div>
  `;
  return div;
}

// ── 3. WEATHER WIDGET ─────────────────────────────────────────
function renderWeatherWidget(data) {
  const emoji = getWeatherEmoji(data.condition);
  const div = document.createElement('div');
  div.className = 'sw-widget sw-widget-weather';
  div.innerHTML = `
    <div class="sw-widget-header">🌡️ Weather · ${data.city}, ${data.country}</div>
    <div class="sw-weather-main">
      <div class="sw-weather-icon">${emoji}</div>
      <div class="sw-weather-temp">${data.temp}°C</div>
      <div class="sw-weather-desc">${data.description}</div>
    </div>
    <div class="sw-weather-grid">
      <div class="sw-weather-stat">
        <span class="sw-wstat-label">Feels like</span>
        <span class="sw-wstat-val">${data.feels_like}°C</span>
      </div>
      <div class="sw-weather-stat">
        <span class="sw-wstat-label">Humidity</span>
        <span class="sw-wstat-val">${data.humidity}%</span>
      </div>
      <div class="sw-weather-stat">
        <span class="sw-wstat-label">Wind</span>
        <span class="sw-wstat-val">${data.wind_speed} km/h</span>
      </div>
      ${data.visibility !== null ? `
      <div class="sw-weather-stat">
        <span class="sw-wstat-label">Visibility</span>
        <span class="sw-wstat-val">${data.visibility} km</span>
      </div>` : ''}
      <div class="sw-weather-stat">
        <span class="sw-wstat-label">Pressure</span>
        <span class="sw-wstat-val">${data.pressure} hPa</span>
      </div>
    </div>
  `;
  return div;
}

// ── 4. WEB SEARCH WIDGET ──────────────────────────────────────
function renderWebSearchWidget(data) {
  const div = document.createElement('div');
  div.className = 'sw-widget sw-widget-search';

  const answerBoxHTML = data.answerBox ? `
    <div class="sw-search-answer-box">
      <span class="sw-answer-label">✦ Quick Answer</span>
      <div class="sw-answer-text">${data.answerBox}</div>
    </div>` : '';

  const resultsHTML = data.organic.map(r => `
    <a class="sw-search-result" href="${r.link}" target="_blank" rel="noopener noreferrer">
      <div class="sw-sr-source">${r.source}</div>
      <div class="sw-sr-title">${r.title}</div>
      <div class="sw-sr-snippet">${r.snippet}</div>
    </a>
  `).join('');

  div.innerHTML = `
    <div class="sw-widget-header">🌐 Web Search · "${data.query}"</div>
    ${answerBoxHTML}
    <div class="sw-search-results">${resultsHTML}</div>
  `;
  return div;
}

// ── 5. YOUTUBE WIDGET ─────────────────────────────────────────
function renderYouTubeWidget(data) {
  const div = document.createElement('div');
  div.className = 'sw-widget sw-widget-youtube';

  const videosHTML = data.videos.map(v => `
    <a class="sw-yt-card" href="https://youtube.com/watch?v=${v.videoId}" target="_blank" rel="noopener noreferrer">
      <div class="sw-yt-thumb">
        <img src="${v.thumbnail}" alt="${v.title}" loading="lazy"/>
        <div class="sw-yt-play">▶</div>
      </div>
      <div class="sw-yt-info">
        <div class="sw-yt-title">${v.title}</div>
        <div class="sw-yt-channel">${v.channel}</div>
      </div>
    </a>
  `).join('');

  div.innerHTML = `
    <div class="sw-widget-header">▶ YouTube · "${data.query}"</div>
    <div class="sw-yt-grid">${videosHTML}</div>
  `;
  return div;
}

// ── 6. GRAPH WIDGET ───────────────────────────────────────────
function renderGraphWidget(expression) {
  const id = 'graph-' + Date.now();
  const div = document.createElement('div');
  div.className = 'sw-widget sw-widget-graph';
  div.innerHTML = `
    <div class="sw-widget-header">📈 Graph · ${expression}</div>
    <canvas id="${id}" width="340" height="200" style="width:100%;border-radius:8px;"></canvas>
  `;

  // Draw after DOM insertion
  setTimeout(() => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const PAD = 30;

    // Clean background
    ctx.fillStyle = 'rgba(201,168,76,0.04)';
    ctx.fillRect(0, 0, W, H);

    // Parse expression — support y = f(x) or just f(x)
    let expr = expression.replace(/y\s*=\s*/i, '').trim();
    expr = expr.replace(/\^/g, '**').replace(/sin/g,'Math.sin')
               .replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan')
               .replace(/sqrt/g,'Math.sqrt').replace(/abs/g,'Math.abs')
               .replace(/log/g,'Math.log').replace(/exp/g,'Math.exp')
               .replace(/pi/gi,'Math.PI').replace(/e(?![a-zA-Z])/g,'Math.E');

    // Compute points
    const STEPS = 200;
    const xMin = -10, xMax = 10;
    const points = [];
    let yMin = Infinity, yMax = -Infinity;

    for (let i = 0; i <= STEPS; i++) {
      const x = xMin + (xMax - xMin) * (i / STEPS);
      try {
        const y = Function('"use strict"; const x=' + x + '; return ' + expr)();
        if (isFinite(y)) {
          points.push({ x, y });
          if (y < yMin) yMin = y;
          if (y > yMax) yMax = y;
        } else {
          points.push(null);
        }
      } catch {
        points.push(null);
      }
    }

    if (yMin === yMax) { yMin -= 1; yMax += 1; }
    const yPad = (yMax - yMin) * 0.1;
    yMin -= yPad; yMax += yPad;

    // Map to canvas coords
    function toCanvas(x, y) {
      const cx = PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD);
      const cy = H - PAD - ((y - yMin) / (yMax - yMin)) * (H - 2 * PAD);
      return { cx, cy };
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) {
      const { cx } = toCanvas(gx, 0);
      ctx.beginPath(); ctx.moveTo(cx, PAD); ctx.lineTo(cx, H - PAD); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(201,168,76,0.4)';
    ctx.lineWidth = 1.5;
    const { cx: x0 } = toCanvas(0, 0);
    const { cy: y0 } = toCanvas(0, 0);
    // X axis
    ctx.beginPath(); ctx.moveTo(PAD, y0); ctx.lineTo(W - PAD, y0); ctx.stroke();
    // Y axis
    ctx.beginPath(); ctx.moveTo(x0, PAD); ctx.lineTo(x0, H - PAD); ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(201,168,76,0.5)';
    ctx.font = '10px DM Sans, sans-serif';
    ctx.fillText(xMin, PAD, y0 + 14);
    ctx.fillText(xMax, W - PAD - 16, y0 + 14);
    ctx.fillText(Math.round(yMax), x0 + 4, PAD + 12);
    ctx.fillText(Math.round(yMin), x0 + 4, H - PAD - 4);

    // Plot the curve
    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(201,168,76,0.4)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      if (!pt) { started = false; continue; }
      const { cx, cy } = toCanvas(pt.x, pt.y);
      if (!started) { ctx.moveTo(cx, cy); started = true; }
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, 50);

  return div;
}

// ─────────────────────────────────────────────────────────────
//  WIDGET CSS (injected once)
// ─────────────────────────────────────────────────────────────
(function injectWidgetCSS() {
  if (document.getElementById('sw-widget-styles')) return;
  const style = document.createElement('style');
  style.id = 'sw-widget-styles';
  style.textContent = `
    /* ── Base Widget ── */
    .sw-widget {
      background: rgba(201,168,76,0.05);
      border: 1px solid rgba(201,168,76,0.18);
      border-radius: 16px;
      padding: 16px;
      margin: 8px 0 4px;
      font-family: 'DM Sans', sans-serif;
      max-width: 420px;
      animation: swWidgetIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
    }
    @keyframes swWidgetIn {
      from { transform: translateY(8px) scale(0.97); opacity: 0; }
      to   { transform: translateY(0)   scale(1);    opacity: 1; }
    }
    .sw-widget-header {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--accent);
      margin-bottom: 12px; opacity: 0.8;
    }

    /* ── Clock ── */
    .sw-widget-clock { text-align: center; }
    .sw-clock-display {
      font-family: 'Syne', sans-serif; font-size: 2.4rem; font-weight: 800;
      color: var(--accent); letter-spacing: 4px; margin: 4px 0;
    }
    .sw-clock-date { font-size: 0.78rem; color: var(--muted); }
    .sw-clock-tz   { font-size: 0.68rem; color: var(--muted); margin-top: 4px; opacity: 0.6; }

    /* ── Calculator ── */
    .sw-widget-calculator { text-align: center; }
    .sw-calc-expression {
      font-size: 0.95rem; color: var(--muted); opacity: 0.7;
      word-break: break-all;
    }
    .sw-calc-equals { font-size: 1.2rem; color: var(--muted); margin: 4px 0; opacity: 0.4; }
    .sw-calc-result {
      font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800;
      color: var(--accent);
    }
    .sw-calc-error { color: #f87171; font-size: 1rem; font-weight: 600; }

    /* ── Weather ── */
    .sw-weather-main {
      display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
    }
    .sw-weather-icon { font-size: 2.8rem; }
    .sw-weather-temp {
      font-family: 'Syne', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--accent);
    }
    .sw-weather-desc {
      font-size: 0.82rem; color: var(--muted); text-transform: capitalize; margin-top: 2px;
    }
    .sw-weather-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .sw-weather-stat {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px; padding: 8px 12px;
      display: flex; flex-direction: column; gap: 2px;
    }
    .sw-wstat-label { font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .sw-wstat-val   { font-size: 0.9rem; font-weight: 700; color: var(--text); }

    /* ── Web Search ── */
    .sw-search-answer-box {
      background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2);
      border-radius: 10px; padding: 10px 12px; margin-bottom: 10px;
    }
    .sw-answer-label { font-size: 0.65rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; }
    .sw-answer-text  { font-size: 0.85rem; margin-top: 4px; line-height: 1.5; }
    .sw-search-results { display: flex; flex-direction: column; gap: 8px; }
    .sw-search-result {
      display: block; text-decoration: none;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px; padding: 10px 12px;
      transition: all 0.18s ease;
    }
    .sw-search-result:hover {
      background: rgba(201,168,76,0.07); border-color: rgba(201,168,76,0.25);
      transform: translateY(-1px);
    }
    .sw-sr-source  { font-size: 0.65rem; color: var(--accent); opacity: 0.7; margin-bottom: 3px; }
    .sw-sr-title   { font-size: 0.82rem; font-weight: 600; color: var(--text); margin-bottom: 4px; line-height: 1.3; }
    .sw-sr-snippet { font-size: 0.73rem; color: var(--muted); line-height: 1.45; }

    /* ── YouTube ── */
    .sw-yt-grid { display: flex; flex-direction: column; gap: 8px; }
    .sw-yt-card {
      display: flex; gap: 10px; text-decoration: none;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px; overflow: hidden; transition: all 0.18s ease;
    }
    .sw-yt-card:hover {
      background: rgba(255,0,0,0.05); border-color: rgba(255,80,80,0.25);
      transform: translateY(-1px);
    }
    .sw-yt-thumb {
      position: relative; width: 110px; min-width: 110px; height: 62px;
      background: #111; overflow: hidden; flex-shrink: 0;
    }
    .sw-yt-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .sw-yt-play {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.35); color: white; font-size: 1.2rem;
      opacity: 0; transition: opacity 0.2s;
    }
    .sw-yt-card:hover .sw-yt-play { opacity: 1; }
    .sw-yt-info { padding: 8px; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
    .sw-yt-title   { font-size: 0.78rem; font-weight: 600; color: var(--text); line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
    .sw-yt-channel { font-size: 0.68rem; color: var(--muted); margin-top: 4px; }

    /* ── Graph ── */
    .sw-widget-graph canvas { display: block; }

    /* ── Commentary below widget ── */
    .sw-commentary {
      font-size: 0.82rem; color: var(--muted); margin-top: 8px; line-height: 1.5;
      padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05);
    }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────────────────────────
//  MAIN WIDGET HANDLER
//  Intercepts sendMsg, detects widget intent, renders widget
// ─────────────────────────────────────────────────────────────
(function installWidgetEngine() {

  // Helper: insert widget + commentary into a chat message element
  function insertWidgetIntoMsg(el, widgetEl, commentary, modeLabel) {
    el.innerHTML = '';
    const senderRow = document.createElement('div');
    senderRow.className = 'sender-row';
    const sender = document.createElement('div');
    sender.className = 'sender';
    sender.textContent = modeLabel;
    senderRow.appendChild(sender);
    el.appendChild(senderRow);
    el.appendChild(widgetEl);
    if (commentary) {
      const commentEl = document.createElement('div');
      commentEl.className = 'sw-commentary';
      commentEl.textContent = commentary;
      el.appendChild(commentEl);
    }
  }

  // Override window.sendMsg
  const _prevSendMsg = window.sendMsg;

  window.sendMsg = async function() {
    const input = document.getElementById('userInput');
    if (!input) return _prevSendMsg();
    const val = input.value.trim();
    if (!val) return _prevSendMsg();

    const widgetType = detectWidget(val);

    // ── CLOCK — instant, no API needed ───────────────────
    if (widgetType === 'clock') {
      const modeLabel = document.querySelector('.mode-btn.active .label')?.textContent || 'SeWalk AI';
      const msgs = document.getElementById('messages');

      // User message
      const userDiv = document.createElement('div');
      userDiv.className = 'msg user';
      userDiv.innerHTML = `<div class="sender-row"><div class="sender">You</div></div>${val}`;
      msgs.appendChild(userDiv);
      msgs.scrollTop = msgs.scrollHeight;
      input.value = '';

      // Clock widget
      const aiDiv = document.createElement('div');
      aiDiv.className = 'msg ai';
      msgs.appendChild(aiDiv);
      const clockEl = renderClockWidget();
      const commentEl = document.createElement('div');
      commentEl.className = 'sw-commentary';
      commentEl.textContent = "Here's your live clock — it updates every second in real time.";
      aiDiv.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div>`;
      aiDiv.appendChild(clockEl);
      aiDiv.appendChild(commentEl);
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── CALCULATOR — instant, no API needed ──────────────
    if (widgetType === 'calculator') {
      const modeLabel = document.querySelector('.mode-btn.active .label')?.textContent || 'SeWalk AI';
      const msgs = document.getElementById('messages');
      const expression = extractQuery(val, 'calculator') || val;

      const userDiv = document.createElement('div');
      userDiv.className = 'msg user';
      userDiv.innerHTML = `<div class="sender-row"><div class="sender">You</div></div>${val}`;
      msgs.appendChild(userDiv);
      msgs.scrollTop = msgs.scrollHeight;
      input.value = '';

      // Compute result for commentary
      let numericResult = null;
      try {
        const cleaned = expression.replace(/x/gi,'*').replace(/×/g,'*').replace(/÷/g,'/')
          .replace(/\^/g,'**').replace(/[^\d\s\+\-\*\/\.\(\)\%]/g,'');
        numericResult = Function('"use strict"; return (' + cleaned + ')')();
      } catch {}

      const aiDiv = document.createElement('div');
      aiDiv.className = 'msg ai';
      msgs.appendChild(aiDiv);
      const calcEl = renderCalculatorWidget(expression);
      insertWidgetIntoMsg(aiDiv, calcEl,
        numericResult !== null ? `${expression} = ${numericResult}. Calculated instantly.` : null,
        modeLabel);
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── GRAPH — instant, no API needed ───────────────────
    if (widgetType === 'graph') {
      const modeLabel = document.querySelector('.mode-btn.active .label')?.textContent || 'SeWalk AI';
      const msgs = document.getElementById('messages');
      const expr = extractQuery(val, 'graph') || val;

      const userDiv = document.createElement('div');
      userDiv.className = 'msg user';
      userDiv.innerHTML = `<div class="sender-row"><div class="sender">You</div></div>${val}`;
      msgs.appendChild(userDiv);
      msgs.scrollTop = msgs.scrollHeight;
      input.value = '';

      const aiDiv = document.createElement('div');
      aiDiv.className = 'msg ai';
      msgs.appendChild(aiDiv);
      const graphEl = renderGraphWidget(expr);
      insertWidgetIntoMsg(aiDiv, graphEl,
        `Here's the graph of ${expr}. The x-axis ranges from -10 to 10.`,
        modeLabel);
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── WEATHER — needs API ───────────────────────────────
    if (widgetType === 'weather') {
      const city = extractQuery(val, 'weather');
      if (!city) return _prevSendMsg(); // let AI handle vague weather questions

      const modeLabel = document.querySelector('.mode-btn.active .label')?.textContent || 'SeWalk AI';
      const msgs = document.getElementById('messages');

      const userDiv = document.createElement('div');
      userDiv.className = 'msg user';
      userDiv.innerHTML = `<div class="sender-row"><div class="sender">You</div></div><span style="opacity:0.5;font-size:0.8rem;">🌡️</span> ${val}`;
      msgs.appendChild(userDiv);
      msgs.scrollTop = msgs.scrollHeight;
      input.value = '';

      const typingId = 'typing-' + Date.now();
      const typingDiv = document.createElement('div');
      typingDiv.className = 'msg ai'; typingDiv.id = typingId;
      typingDiv.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div><span style="opacity:0.45">🌡️ Checking weather…</span>`;
      msgs.appendChild(typingDiv);
      msgs.scrollTop = msgs.scrollHeight;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'weather', city }),
        });
        const data = await res.json();
        const el = document.getElementById(typingId);
        if (!el) return;

        if (data.widgetType === 'weather') {
          insertWidgetIntoMsg(el, renderWeatherWidget(data.widgetData), data.commentary, modeLabel);
        } else {
          const reply = data.content?.[0]?.text || 'Could not fetch weather.';
          el.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div>`;
          el.appendChild(renderContent(reply));
        }
      } catch (err) {
        const el = document.getElementById(typingId);
        if (el) el.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div><span style="color:#f87171;">⚠️ ${err.message}</span>`;
      }
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── WEB SEARCH — needs API ────────────────────────────
    if (widgetType === 'web_search') {
      const query = extractQuery(val, 'web_search') || val;
      const modeLabel = document.querySelector('.mode-btn.active .label')?.textContent || 'SeWalk AI';
      const msgs = document.getElementById('messages');

      const userDiv = document.createElement('div');
      userDiv.className = 'msg user';
      userDiv.innerHTML = `<div class="sender-row"><div class="sender">You</div></div><span style="opacity:0.5;font-size:0.8rem;">🌐</span> ${val}`;
      msgs.appendChild(userDiv);
      msgs.scrollTop = msgs.scrollHeight;
      input.value = '';

      const typingId = 'typing-' + Date.now();
      const typingDiv = document.createElement('div');
      typingDiv.className = 'msg ai'; typingDiv.id = typingId;
      typingDiv.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div><span style="opacity:0.45">🌐 Searching the web…</span>`;
      msgs.appendChild(typingDiv);
      msgs.scrollTop = msgs.scrollHeight;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'web_search', query }),
        });
        const data = await res.json();
        const el = document.getElementById(typingId);
        if (!el) return;

        if (data.widgetType === 'web_search') {
          insertWidgetIntoMsg(el, renderWebSearchWidget(data.widgetData), data.commentary, modeLabel);
        } else {
          const reply = data.content?.[0]?.text || 'No results found.';
          el.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div>`;
          el.appendChild(renderContent(reply));
        }
      } catch (err) {
        const el = document.getElementById(typingId);
        if (el) el.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div><span style="color:#f87171;">⚠️ ${err.message}</span>`;
      }
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── YOUTUBE — needs API ───────────────────────────────
    if (widgetType === 'youtube') {
      const query = extractQuery(val, 'youtube') || val;
      const modeLabel = document.querySelector('.mode-btn.active .label')?.textContent || 'SeWalk AI';
      const msgs = document.getElementById('messages');

      const userDiv = document.createElement('div');
      userDiv.className = 'msg user';
      userDiv.innerHTML = `<div class="sender-row"><div class="sender">You</div></div><span style="opacity:0.5;font-size:0.8rem;">▶</span> ${val}`;
      msgs.appendChild(userDiv);
      msgs.scrollTop = msgs.scrollHeight;
      input.value = '';

      const typingId = 'typing-' + Date.now();
      const typingDiv = document.createElement('div');
      typingDiv.className = 'msg ai'; typingDiv.id = typingId;
      typingDiv.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div><span style="opacity:0.45">▶ Searching YouTube…</span>`;
      msgs.appendChild(typingDiv);
      msgs.scrollTop = msgs.scrollHeight;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'youtube', query }),
        });
        const data = await res.json();
        const el = document.getElementById(typingId);
        if (!el) return;

        if (data.widgetType === 'youtube') {
          insertWidgetIntoMsg(el, renderYouTubeWidget(data.widgetData), data.commentary, modeLabel);
        } else {
          const reply = data.content?.[0]?.text || 'No videos found.';
          el.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div>`;
          el.appendChild(renderContent(reply));
        }
      } catch (err) {
        const el = document.getElementById(typingId);
        if (el) el.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div><span style="color:#f87171;">⚠️ ${err.message}</span>`;
      }
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── Default: pass through to original sendMsg ─────────
    return _prevSendMsg();
  };
})();

// ═══════════════════════════════════════════════════════════════
//  SeWalk AI — Widget Engine v2.0 Extensions
//  Stock/Crypto · Map · Memory Panel · Unit Converter
//  Widget Tray · Guest Lockdown
// ═══════════════════════════════════════════════════════════════

// ── Add new patterns ──────────────────────────────────────────
WIDGET_PATTERNS.crypto = [
  /price of (.+)/i,
  /(bitcoin|btc|ethereum|eth|crypto|coin) price/i,
  /how much is (bitcoin|eth|bnb|sol|xrp|doge|ada|avax)/i,
  /\b(btc|eth|bnb|sol|xrp|doge|ada|avax|usdt|matic)\b.*price/i,
  /crypto (price|market|today)/i,
  /top crypto/i,
  /(bitcoin|ethereum|solana|dogecoin|ripple|cardano|avalanche|polygon) (today|now|live)/i,
];
WIDGET_PATTERNS.map = [
  /show (me )?(a |the )?map of (.+)/i,
  /map of (.+)/i,
  /where is (.+) on (the )?map/i,
  /location of (.+)/i,
  /find (.+) on map/i,
];
WIDGET_PATTERNS.memory = [
  /show (my |all )?(memories|memory panel|saved memory)/i,
  /what (do you |have you )?remember(ed)? about me/i,
  /\bmy memory\b/i,
  /show memory/i,
  /memory panel/i,
];
WIDGET_PATTERNS.converter = [
  /convert (.+) to (.+)/i,
  /how many (.+) in (.+)/i,
  /\d+\s*(km|miles?|kg|lbs?|celsius|fahrenheit|meters?|feet|inches?|cm|liters?|gallons?)\s*(to|in)\s*(km|miles?|kg|lbs?|celsius|fahrenheit|meters?|feet|inches?|cm|liters?|gallons?)/i,
];

// ── Crypto coin ID map ────────────────────────────────────────
const CRYPTO_IDS = {
  bitcoin:'bitcoin', btc:'bitcoin',
  ethereum:'ethereum', eth:'ethereum',
  bnb:'binancecoin', solana:'solana', sol:'solana',
  xrp:'ripple', dogecoin:'dogecoin', doge:'dogecoin',
  cardano:'cardano', ada:'cardano',
  avalanche:'avalanche-2', avax:'avalanche-2',
  polygon:'matic-network', matic:'matic-network',
  usdt:'tether', usdc:'usd-coin',
};

function extractCryptoId(msg) {
  const lower = msg.toLowerCase();
  for (const [key, id] of Object.entries(CRYPTO_IDS)) {
    if (lower.includes(key)) return id;
  }
  return 'bitcoin';
}

// ── Unit converter ────────────────────────────────────────────
const UNIT_CONV = {
  km_to_miles: v => v*0.621371,    miles_to_km: v => v*1.60934,
  meters_to_feet: v => v*3.28084,  feet_to_meters: v => v*0.3048,
  cm_to_inches: v => v*0.393701,   inches_to_cm: v => v*2.54,
  kg_to_lbs: v => v*2.20462,       lbs_to_kg: v => v*0.453592,
  celsius_to_fahrenheit: v => (v*9/5)+32,
  fahrenheit_to_celsius: v => (v-32)*5/9,
  liters_to_gallons: v => v*0.264172,
  gallons_to_liters: v => v*3.78541,
};
const UNIT_ALIAS = {
  km:'km',kilometer:'km',kilometers:'km',
  mile:'miles',miles:'miles',
  meter:'meters',meters:'meters',
  feet:'feet',foot:'feet',ft:'feet',
  cm:'cm',centimeter:'cm',centimeters:'cm',
  inch:'inches',inches:'inches',
  kg:'kg',kilogram:'kg',kilograms:'kg',
  lb:'lbs',lbs:'lbs',pound:'lbs',pounds:'lbs',
  celsius:'celsius',fahrenheit:'fahrenheit',
  liter:'liters',liters:'liters',
  gallon:'gallons',gallons:'gallons',
};

function parseConversion(msg) {
  const match = msg.match(/(\d+\.?\d*)\s*([a-z]+)\s+(?:to|in)\s+([a-z]+)/i);
  if (!match) return null;
  const val = parseFloat(match[1]);
  const from = UNIT_ALIAS[match[2].toLowerCase()];
  const to   = UNIT_ALIAS[match[3].toLowerCase()];
  if (!from || !to) return null;
  const fn = UNIT_CONV[`${from}_to_${to}`];
  if (!fn) return null;
  return { val, from, to, result: parseFloat(fn(val).toFixed(4)) };
}

// ─────────────────────────────────────────────────────────────
//  NEW RENDERERS
// ─────────────────────────────────────────────────────────────

function renderCryptoWidget(d) {
  const isUp = d.change24h >= 0;
  const cc = isUp ? '#34d399' : '#f87171';
  const arrow = isUp ? '▲' : '▼';
  const div = document.createElement('div');
  div.className = 'sw-widget sw-widget-crypto';
  div.innerHTML = `
    <div class="sw-widget-header">💰 ${d.name} · Live Price</div>
    <div class="sw-crypto-main">
      <div class="sw-crypto-symbol">${d.symbol.toUpperCase()}</div>
      <div class="sw-crypto-price">$${d.price.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
      <div class="sw-crypto-change" style="color:${cc}">${arrow} ${Math.abs(d.change24h).toFixed(2)}% (24h)</div>
    </div>
    <div class="sw-weather-grid">
      <div class="sw-weather-stat"><span class="sw-wstat-label">Market Cap</span><span class="sw-wstat-val">$${(d.marketCap/1e9).toFixed(2)}B</span></div>
      <div class="sw-weather-stat"><span class="sw-wstat-label">24h High</span><span class="sw-wstat-val">$${d.high24h.toLocaleString()}</span></div>
      <div class="sw-weather-stat"><span class="sw-wstat-label">24h Low</span><span class="sw-wstat-val">$${d.low24h.toLocaleString()}</span></div>
      <div class="sw-weather-stat"><span class="sw-wstat-label">Volume (24h)</span><span class="sw-wstat-val">$${(d.volume24h/1e9).toFixed(2)}B</span></div>
    </div>
    <div class="sw-crypto-footer">Powered by CoinGecko · Live data</div>`;
  return div;
}

function renderMapWidget(location) {
  const encoded = encodeURIComponent(location);
  const div = document.createElement('div');
  div.className = 'sw-widget sw-widget-map';
  div.innerHTML = `
    <div class="sw-widget-header">🗺️ Map · ${location}</div>
    <div class="sw-map-container">
      <iframe src="https://www.openstreetmap.org/export/embed.html?layer=mapnik&query=${encoded}"
        style="width:100%;height:240px;border:none;border-radius:10px;" loading="lazy" title="Map of ${location}"></iframe>
      <a class="sw-map-link" href="https://www.openstreetmap.org/search?query=${encoded}" target="_blank" rel="noopener">Open full map ↗</a>
    </div>`;
  return div;
}

function renderMemoryWidget() {
  const memory      = localStorage.getItem('sewalk-custom-memory') || '';
  const displayName = localStorage.getItem('sewalk-display-name') || '';
  const tone        = localStorage.getItem('sewalk-ps-tone') || 'default';
  const lang        = localStorage.getItem('sewalk-ps-lang') || 'Auto';
  const length      = localStorage.getItem('sewalk-ps-length') || 'balanced';
  const items = [];
  if (displayName) items.push({ icon:'👤', label:'Your name', val:displayName });
  if (memory)      items.push({ icon:'🧠', label:'Custom memory', val:memory });
  items.push({ icon:'🎨', label:'AI Tone', val:tone });
  items.push({ icon:'🌐', label:'Language', val:lang });
  items.push({ icon:'📏', label:'Response length', val:length });
  const div = document.createElement('div');
  div.className = 'sw-widget sw-widget-memory';
  div.innerHTML = `
    <div class="sw-widget-header">🧠 Memory Panel · What I Know About You</div>
    <div class="sw-memory-list">
      ${items.map(i=>`<div class="sw-memory-item"><span class="sw-mem-icon">${i.icon}</span><div class="sw-mem-body"><div class="sw-mem-label">${i.label}</div><div class="sw-mem-val">${i.val}</div></div></div>`).join('')}
    </div>
    <button class="sw-memory-edit-btn" onclick="openSettings()">Edit in Settings ✦</button>`;
  return div;
}

function renderConverterWidget(c) {
  const div = document.createElement('div');
  div.className = 'sw-widget sw-widget-calculator';
  div.innerHTML = `
    <div class="sw-widget-header">🔄 Unit Converter</div>
    <div class="sw-calc-expression">${c.val} ${c.from}</div>
    <div class="sw-calc-equals">=</div>
    <div class="sw-calc-result">${c.result} ${c.to}</div>`;
  return div;
}

// ─────────────────────────────────────────────────────────────
//  V2 CSS
// ─────────────────────────────────────────────────────────────
(function injectV2CSS() {
  if (document.getElementById('sw-v2-styles')) return;
  const s = document.createElement('style');
  s.id = 'sw-v2-styles';
  s.textContent = `
    .sw-crypto-main{display:flex;flex-direction:column;align-items:center;margin-bottom:14px;gap:4px;}
    .sw-crypto-symbol{font-size:.75rem;font-weight:700;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;}
    .sw-crypto-price{font-family:'Syne',sans-serif;font-size:2.2rem;font-weight:800;color:var(--accent);}
    .sw-crypto-change{font-size:.85rem;font-weight:700;}
    .sw-crypto-footer{font-size:.62rem;color:var(--muted);text-align:center;margin-top:10px;opacity:.5;}
    .sw-map-container{border-radius:10px;overflow:hidden;}
    .sw-map-link{display:block;text-align:center;padding:8px;font-size:.72rem;color:var(--accent);text-decoration:none;background:rgba(201,168,76,.06);margin-top:6px;border-radius:8px;transition:background .2s;}
    .sw-map-link:hover{background:rgba(201,168,76,.12);}
    .sw-memory-list{display:flex;flex-direction:column;gap:8px;}
    .sw-memory-item{display:flex;align-items:flex-start;gap:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:10px 12px;}
    .sw-mem-icon{font-size:1.1rem;flex-shrink:0;}
    .sw-mem-label{font-size:.65rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;}
    .sw-mem-val{font-size:.82rem;font-weight:600;color:var(--text);margin-top:2px;}
    .sw-memory-edit-btn{width:100%;margin-top:12px;padding:9px;border-radius:10px;border:1px solid rgba(201,168,76,.3);background:rgba(201,168,76,.08);color:var(--accent);font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:700;cursor:pointer;transition:all .2s;}
    .sw-memory-edit-btn:hover{background:rgba(201,168,76,.15);}

    /* Widget Tray */
    .sw-tray-btn{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.25);border-radius:10px;color:var(--accent);width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.1rem;transition:all .2s;flex-shrink:0;}
    .sw-tray-btn:hover{background:rgba(201,168,76,.2);}
    .sw-tray-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);z-index:600;align-items:flex-end;justify-content:center;}
    .sw-tray-overlay.open{display:flex;}
    .sw-tray-panel{background:#0d0b00;border:1px solid rgba(201,168,76,.2);border-radius:20px 20px 0 0;padding:24px 20px 30px;width:100%;max-width:480px;animation:trayUp .28s cubic-bezier(.34,1.2,.64,1) both;}
    @keyframes trayUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    .sw-tray-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;color:var(--accent);margin-bottom:18px;text-align:center;}
    .sw-tray-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;}
    .sw-tray-item{display:flex;flex-direction:column;align-items:center;gap:6px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:14px 6px;cursor:pointer;transition:all .18s;text-align:center;}
    .sw-tray-item:hover{background:rgba(201,168,76,.1);border-color:rgba(201,168,76,.3);transform:translateY(-2px);}
    .sw-tray-item-icon{font-size:1.5rem;}
    .sw-tray-item-label{font-size:.6rem;color:var(--muted);font-weight:600;letter-spacing:.03em;}
    .sw-tray-close{width:100%;margin-top:16px;padding:11px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:var(--muted);font-family:'DM Sans',sans-serif;font-size:.82rem;cursor:pointer;transition:all .2s;}
    .sw-tray-close:hover{background:rgba(255,255,255,.08);color:var(--text);}

    /* Guest lock */
    .sw-guest-lock{background:rgba(201,168,76,.05);border:1px solid rgba(201,168,76,.2);border-radius:14px;padding:24px 20px;text-align:center;margin:8px 0;animation:swWidgetIn .3s cubic-bezier(.34,1.2,.64,1) both;}
    .sw-guest-lock-icon{font-size:2rem;margin-bottom:10px;}
    .sw-guest-lock-title{font-weight:800;font-size:.95rem;color:var(--accent);margin-bottom:6px;}
    .sw-guest-lock-desc{font-size:.76rem;color:var(--muted);margin-bottom:16px;line-height:1.6;}
    .sw-guest-lock-btn{background:linear-gradient(135deg,#c9a84c,#f5e17a);border:none;border-radius:99px;color:#0a0800;font-weight:800;font-size:.8rem;padding:10px 26px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:opacity .2s;}
    .sw-guest-lock-btn:hover{opacity:.9;}
  `;
  document.head.appendChild(s);
})();

// ─────────────────────────────────────────────────────────────
//  WIDGET TRAY
// ─────────────────────────────────────────────────────────────
function openWidgetTray() {
  if (typeof currentUser !== 'undefined' && !currentUser) {
    showToast('🔒 Sign in to use the Widget Tray!');
    openAuthModal();
    return;
  }
  document.getElementById('swTrayOverlay')?.classList.add('open');
}
function closeWidgetTray() { document.getElementById('swTrayOverlay')?.classList.remove('open'); }

function promptTray(prefix) {
  const inp = document.getElementById('userInput');
  if (inp) { inp.value = prefix; inp.focus(); closeWidgetTray(); }
}

(function buildTray() {
  const ITEMS = [
    { icon:'🕐', label:'Clock',     action:()=>{ closeWidgetTray(); const i=document.getElementById('userInput'); i.value='what is the time'; window.sendMsg(); }},
    { icon:'🧮', label:'Calculator',action:()=>promptTray('calculate ')},
    { icon:'📈', label:'Graph',     action:()=>promptTray('graph of y = ')},
    { icon:'🌡️', label:'Weather',   action:()=>promptTray('weather in ')},
    { icon:'🌐', label:'Search',    action:()=>promptTray('search ')},
    { icon:'▶',  label:'YouTube',   action:()=>promptTray('youtube videos on ')},
    { icon:'💰', label:'Crypto',    action:()=>{ closeWidgetTray(); const i=document.getElementById('userInput'); i.value='bitcoin price'; window.sendMsg(); }},
    { icon:'🗺️', label:'Map',       action:()=>promptTray('map of ')},
    { icon:'🧠', label:'Memory',    action:()=>{ closeWidgetTray(); const i=document.getElementById('userInput'); i.value='show my memory'; window.sendMsg(); }},
    { icon:'🔄', label:'Convert',   action:()=>promptTray('convert ')},
  ];

  function init() {
    // Build overlay
    const overlay = document.createElement('div');
    overlay.className = 'sw-tray-overlay';
    overlay.id = 'swTrayOverlay';
    overlay.onclick = e => { if (e.target === overlay) closeWidgetTray(); };
    overlay.innerHTML = `
      <div class="sw-tray-panel">
        <div class="sw-tray-title">✦ Widget Tray</div>
        <div class="sw-tray-grid">
          ${ITEMS.map((item,i)=>`<div class="sw-tray-item" id="swti-${i}"><div class="sw-tray-item-icon">${item.icon}</div><div class="sw-tray-item-label">${item.label}</div></div>`).join('')}
        </div>
        <button class="sw-tray-close" onclick="closeWidgetTray()">Close</button>
      </div>`;
    document.body.appendChild(overlay);
    ITEMS.forEach((item,i) => document.getElementById(`swti-${i}`)?.addEventListener('click', item.action));

    // Inject tray button into input row
    const inputRow = document.querySelector('.input-row');
    if (!inputRow) return;
    const trayBtn = document.createElement('button');
    trayBtn.className = 'sw-tray-btn';
    trayBtn.title = 'Widget Tray';
    trayBtn.innerHTML = '⊞';
    trayBtn.onclick = openWidgetTray;
    const sendBtn = inputRow.querySelector('.send-btn');
    if (sendBtn) inputRow.insertBefore(trayBtn, sendBtn);
    else inputRow.appendChild(trayBtn);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// ─────────────────────────────────────────────────────────────
//  GUEST LOCK HELPER
// ─────────────────────────────────────────────────────────────
function isGuest() {
  return typeof currentUser === 'undefined' || !currentUser;
}

function renderGuestLock(featureName) {
  const div = document.createElement('div');
  div.className = 'sw-guest-lock';
  div.innerHTML = `
    <div class="sw-guest-lock-icon">🔒</div>
    <div class="sw-guest-lock-title">${featureName} is for signed-in users</div>
    <div class="sw-guest-lock-desc">Sign in for free to unlock all widgets, personas, file uploads and unlimited chats.</div>
    <button class="sw-guest-lock-btn" onclick="openAuthModal()">Sign In — It's Free ✦</button>`;
  return div;
}

// ─────────────────────────────────────────────────────────────
//  V2 SEND MSG — crypto, map, memory, converter + guest lock
// ─────────────────────────────────────────────────────────────
(function installV2Engine() {
  const _prev = window.sendMsg;

  window.sendMsg = async function() {
    const input = document.getElementById('userInput');
    if (!input) return _prev();
    const val = input.value.trim();
    if (!val) return _prev();

    const modeLabel = document.querySelector('.mode-btn.active .label')?.textContent || 'SeWalk AI';
    const msgs = document.getElementById('messages');

    // Helper
    function userMsg(text, icon) {
      const d = document.createElement('div');
      d.className = 'msg user';
      d.innerHTML = `<div class="sender-row"><div class="sender">You</div></div>${icon ? `<span style="opacity:.5;font-size:.8rem;">${icon}</span> ` : ''}${text}`;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }
    function typingMsg(id, label, text) {
      const d = document.createElement('div');
      d.className = 'msg ai'; d.id = id;
      d.innerHTML = `<div class="sender-row"><div class="sender">${label}</div></div><span style="opacity:.45">${text}</span>`;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    const widgetType = detectWidget(val);

    // ── GUEST LOCK — block all widgets ────────────────────
    if (widgetType && isGuest()) {
      userMsg(val);
      input.value = '';
      const aiDiv = document.createElement('div');
      aiDiv.className = 'msg ai';
      aiDiv.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div>`;
      aiDiv.appendChild(renderGuestLock('This widget'));
      msgs.appendChild(aiDiv);
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── CRYPTO ────────────────────────────────────────────
    if (widgetType === 'crypto') {
      const coinId = extractCryptoId(val);
      userMsg(val, '💰'); input.value = '';
      const tid = 'typing-' + Date.now();
      typingMsg(tid, modeLabel, '💰 Fetching live price…');
      try {
        const res  = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`);
        const data = await res.json();
        const el = document.getElementById(tid);
        if (!el) return;
        if (data.market_data) {
          const cd = {
            name:data.name, symbol:data.symbol,
            price:data.market_data.current_price.usd,
            change24h:data.market_data.price_change_percentage_24h,
            marketCap:data.market_data.market_cap.usd,
            high24h:data.market_data.high_24h.usd,
            low24h:data.market_data.low_24h.usd,
            volume24h:data.market_data.total_volume.usd,
          };
          const comment = `${cd.name} is trading at $${cd.price.toLocaleString('en-US',{minimumFractionDigits:2})}. ${cd.change24h>=0?'Up':'Down'} ${Math.abs(cd.change24h).toFixed(2)}% in the last 24 hours.`;
          insertWidgetIntoMsg(el, renderCryptoWidget(cd), comment, modeLabel);
        } else {
          el.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div><span style="color:#f87171;">⚠️ Could not fetch price data.</span>`;
        }
      } catch(err) {
        const el = document.getElementById(tid);
        if (el) el.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div><span style="color:#f87171;">⚠️ ${err.message}</span>`;
      }
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── MAP ───────────────────────────────────────────────
    if (widgetType === 'map') {
      const locMatch = val.match(/(?:map of|show.*?map of|where is|location of|find)\s+(.+)/i);
      const location = locMatch ? locMatch[1].replace(/[?!.]$/,'').trim() : val;
      userMsg(val, '🗺️'); input.value = '';
      const aiDiv = document.createElement('div');
      aiDiv.className = 'msg ai';
      msgs.appendChild(aiDiv);
      insertWidgetIntoMsg(aiDiv, renderMapWidget(location), `Here's the map of ${location}. Tap "Open full map" to explore further.`, modeLabel);
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── MEMORY PANEL ──────────────────────────────────────
    if (widgetType === 'memory') {
      userMsg(val); input.value = '';
      const aiDiv = document.createElement('div');
      aiDiv.className = 'msg ai';
      msgs.appendChild(aiDiv);
      insertWidgetIntoMsg(aiDiv, renderMemoryWidget(), `Here's everything I currently remember about you. Update it anytime in Settings.`, modeLabel);
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── UNIT CONVERTER ────────────────────────────────────
    if (widgetType === 'converter') {
      const conv = parseConversion(val);
      userMsg(val); input.value = '';
      const aiDiv = document.createElement('div');
      aiDiv.className = 'msg ai';
      msgs.appendChild(aiDiv);
      if (conv) {
        insertWidgetIntoMsg(aiDiv, renderConverterWidget(conv), `${conv.val} ${conv.from} = ${conv.result} ${conv.to}.`, modeLabel);
      } else {
        aiDiv.innerHTML = `<div class="sender-row"><div class="sender">${modeLabel}</div></div><span style="color:#f87171;">⚠️ Try: "convert 5 km to miles"</span>`;
      }
      msgs.scrollTop = msgs.scrollHeight;
      return;
    }

    // ── Default ───────────────────────────────────────────
    return _prev();
  };
})();
