// Graphique en ligne minimal (SVG), sans dépendance.
import { esc, fmtDateShort } from './ui.js';

export function lineChart(points, { unit = 'lb', height = 180, label = '' } = {}) {
  if (!points.length) return '<p class="muted small">Pas encore de données.</p>';
  const W = 340, H = height, L = 38, R = 12, T = 14, B = 26;
  const ys = points.map(p => p.y);
  let min = Math.min(...ys), max = Math.max(...ys);
  if (min === max) { min -= 5; max += 5; }
  const pad = (max - min) * 0.12; min = Math.max(0, min - pad); max += pad;
  const n = points.length;
  const x = i => L + (n === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (n - 1));
  const y = v => T + (1 - (v - min) / (max - min)) * (H - T - B);
  const ticks = 4;
  let grid = '';
  for (let k = 0; k <= ticks; k++) {
    const v = min + ((max - min) * k) / ticks;
    grid += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="ch-grid"/><text x="${L - 6}" y="${y(v) + 3}" class="ch-tick" text-anchor="end">${Math.round(v)}</text>`;
  }
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.y).toFixed(1)}`).join('');
  const area = `${path}L${x(n - 1).toFixed(1)},${H - B}L${x(0).toFixed(1)},${H - B}Z`;
  const dots = points.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.y)}" r="${n > 25 ? 2 : 3.5}" class="ch-dot"><title>${esc(fmtDateShort(p.x))} : ${Math.round(p.y * 10) / 10} ${unit}</title></circle>`).join('');
  const lab = [0, n - 1].filter((v, i, a) => a.indexOf(v) === i)
    .map(i => `<text x="${x(i)}" y="${H - 8}" class="ch-tick" text-anchor="${i === 0 && n > 1 ? 'start' : i === n - 1 && n > 1 ? 'end' : 'middle'}">${esc(fmtDateShort(points[i].x))}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${grid}<path d="${area}" class="ch-area"/><path d="${path}" class="ch-line"/>${dots}${lab}</svg>`;
}

export function sparkline(values, w = 90, h = 28) {
  if (values.length < 2) return '';
  const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${((i * (w - 4)) / (values.length - 1) + 2).toFixed(1)},${(h - 3 - ((v - min) / span) * (h - 6)).toFixed(1)}`).join('');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><path d="${d}"/></svg>`;
}
