// Shared rendering helpers: KPIs, insight cards, bar lists, sortable tables, canvas charts, tooltip.
(function () {
  const UI = (window.UI = {});

  UI.C = {
    accent: "#3b82f6",
    green: "#22c55e",
    red: "#ef4444",
    purple: "#8b5cf6",
    text: "#e8e8e4",
    text2: "#a8a8a2",
    text3: "#66665e",
    surface: "#1c1c1b",
    surface2: "#252524",
    border: "#2e2e2c",
  };
  // Validated categorical order (dataviz reference palette, dark steps)
  UI.SERIES = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"];

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  UI.esc = esc;
  UI.fmt = (n) => (n === null || n === undefined || Number.isNaN(n) ? "–" : Math.round(n).toLocaleString());
  UI.pct = (n, d, dp = 1) => (d > 0 ? ((n / d) * 100).toFixed(dp) + "%" : "–");
  UI.pctV = (v, dp = 1) => (v === null || v === undefined ? "–" : (v * 100).toFixed(dp) + "%");
  UI.dur = (s) => {
    if (s === null || s === undefined) return "–";
    if (s < 60) return Math.round(s) + "s";
    if (s < 3600) return Math.floor(s / 60) + "m " + String(Math.round(s % 60)).padStart(2, "0") + "s";
    return (s / 3600).toFixed(1) + "h";
  };

  // ---------- tooltip ----------
  const tip = () => document.getElementById("tooltip");
  UI.showTip = (e, html) => {
    const t = tip();
    t.innerHTML = html;
    t.style.display = "block";
    UI.moveTip(e);
  };
  UI.moveTip = (e) => {
    const t = tip();
    let x = e.clientX + 14,
      y = e.clientY - 10;
    if (x + 310 > window.innerWidth) x = e.clientX - 320;
    t.style.left = x + "px";
    t.style.top = y + "px";
  };
  UI.hideTip = () => (tip().style.display = "none");
  // Delegated hover for any element with data-tip
  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest && e.target.closest("[data-tip]");
    if (el) UI.showTip(e, el.getAttribute("data-tip"));
  });
  document.addEventListener("mousemove", (e) => {
    if (e.target.closest && e.target.closest("[data-tip]")) UI.moveTip(e);
  });
  document.addEventListener("mouseout", (e) => {
    const el = e.target.closest && e.target.closest("[data-tip]");
    if (el && !el.contains(e.relatedTarget)) UI.hideTip();
  });

  // ---------- HTML blocks ----------
  UI.kpis = (el, items) => {
    el.innerHTML = items
      .map(
        (k) =>
          `<div class="kpi"${k.tip ? ` data-tip="${esc(k.tip)}"` : ""}><div class="kpi-label">${esc(k.label)}</div><div class="kpi-value">${k.value}</div><div class="kpi-sub">${k.sub || ""}</div></div>`,
      )
      .join("");
  };

  UI.insights = (el, cards) => {
    el.innerHTML = cards
      .filter(Boolean)
      .map(
        (c) =>
          `<div class="insight-card"><div class="insight-label">${esc(c.label)}</div><div class="insight-value">${c.value}</div><div class="insight-sub">${c.sub || ""}</div></div>`,
      )
      .join("");
  };

  // items: [{label, value, text?, tip?, color?}]
  UI.bars = (el, items, opts = {}) => {
    if (!items.length) {
      el.innerHTML = `<div class="empty">No data</div>`;
      return;
    }
    const max = opts.max || Math.max(...items.map((i) => i.value), 1);
    el.innerHTML = items
      .map(
        (i) =>
          `<div class="bar-row"${i.tip ? ` data-tip="${esc(i.tip)}"` : ""}><div class="bar-label" title="${esc(i.label)}">${esc(i.label)}</div><div class="bar-track"><div class="bar-fill" style="width:${((i.value / max) * 100).toFixed(1)}%;background:${i.color || opts.color || UI.C.accent}"></div></div><div class="bar-pct">${i.text ?? UI.fmt(i.value)}</div></div>`,
      )
      .join("");
  };

  // segments: [{label, value, color}]
  UI.stack = (el, segs) => {
    const total = segs.reduce((s, x) => s + x.value, 0) || 1;
    el.innerHTML =
      `<div class="stack">${segs
        .map(
          (s) =>
            `<div class="stack-seg" style="flex:${s.value};background:${s.color}" data-tip="<strong>${esc(s.label)}</strong>${UI.fmt(s.value)} (${UI.pct(s.value, total)})${s.tip ? "<br>" + esc(s.tip) : ""}"></div>`,
        )
        .join("")}</div><div class="legend-inline">${segs
        .map(
          (s) =>
            `<span><i style="background:${s.color}"></i>${esc(s.label)} <b>${UI.pct(s.value, total)}</b></span>`,
        )
        .join("")}</div>`;
  };

  // cols: [{key, label, num?, fmt?(v,row), tip?}]; rows: objects
  UI.table = (el, cols, rows, opts = {}) => {
    let sortKey = opts.sortKey || cols[0].key,
      dir = opts.dir || -1;
    function draw() {
      const sorted = rows.slice().sort((a, b) => {
        const x = a[sortKey],
          y = b[sortKey];
        if (x === y) return 0;
        if (x === null || x === undefined) return 1;
        if (y === null || y === undefined) return -1;
        return (x > y ? 1 : -1) * dir;
      });
      el.innerHTML = `<table><thead><tr>${cols
        .map(
          (c) =>
            `<th data-k="${c.key}" class="${c.num ? "num" : ""} sortable${c.key === sortKey ? " sorted" : ""}"${c.tip ? ` data-tip="${esc(c.tip)}"` : ""}>${esc(c.label)}${c.key === sortKey ? (dir < 0 ? " ↓" : " ↑") : ""}</th>`,
        )
        .join("")}</tr></thead><tbody>${sorted
        .slice(0, opts.limit || 500)
        .map(
          (r, i) =>
            `<tr data-i="${rows.indexOf(r)}"${opts.onRow ? ' class="clickable"' : ""}${opts.selected && opts.selected(r) ? ' data-sel="1"' : ""}>${cols
              .map((c) => `<td class="${c.num ? "num mono" : ""}">${c.fmt ? c.fmt(r[c.key], r) : esc(r[c.key])}</td>`)
              .join("")}</tr>`,
        )
        .join("")}</tbody></table>`;
      el.querySelectorAll("th.sortable").forEach(
        (th) =>
          (th.onclick = () => {
            const k = th.dataset.k;
            dir = k === sortKey ? -dir : -1;
            sortKey = k;
            draw();
          }),
      );
      if (opts.onRow)
        el.querySelectorAll("tbody tr").forEach((tr) => (tr.onclick = () => opts.onRow(rows[+tr.dataset.i])));
    }
    draw();
  };

  UI.inlineBar = (v, max, color) =>
    `<span class="pct-cell"><span class="pct-bar-inline"><span class="pct-bar-fill" style="width:${max ? Math.min(100, (v / max) * 100).toFixed(1) : 0}%;background:${color || UI.C.accent}"></span></span>`;

  // ---------- canvas helpers ----------
  function setup(cv, h) {
    const w = cv.clientWidth || cv.parentElement.clientWidth || 600;
    const dpr = window.devicePixelRatio || 1;
    cv.style.height = h + "px";
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }
  UI.setupCanvas = setup;

  function niceMax(v) {
    if (v <= 0) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p;
    return 10 * p;
  }
  const shortNum = (v) => (v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k" : String(Math.round(v * 100) / 100));

  // Line chart, one y-axis. series: [{name, color, values, area?}], markers: [{i, label}]
  UI.lineChart = (cv, cfg) => {
    const H = cfg.height || 240;
    const { ctx, w } = setup(cv, H);
    const n = cfg.labels.length;
    const pad = { t: cfg.markers && cfg.markers.length ? 34 : 14, r: 16, b: 26, l: 44 };
    const cw = w - pad.l - pad.r,
      ch = H - pad.t - pad.b;
    const maxV = niceMax(cfg.yMax || Math.max(1, ...cfg.series.flatMap((s) => s.values.filter((v) => v !== null))));
    const X = (i) => pad.l + (n <= 1 ? cw / 2 : (i / (n - 1)) * cw);
    const Y = (v) => pad.t + ch - (v / maxV) * ch;
    const yf = cfg.yFmt || shortNum;

    function draw(hi) {
      ctx.clearRect(0, 0, w, H);
      ctx.font = "10px IBM Plex Mono,monospace";
      ctx.textBaseline = "middle";
      for (let k = 0; k <= 4; k++) {
        const v = (maxV * k) / 4,
          y = Y(v);
        ctx.strokeStyle = UI.C.surface2;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(w - pad.r, y);
        ctx.stroke();
        ctx.fillStyle = UI.C.text3;
        ctx.textAlign = "right";
        ctx.fillText(yf(v), pad.l - 6, y);
      }
      const step = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(cw / 70))));
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      for (let i = 0; i < n; i += step) ctx.fillText(cfg.xFmt ? cfg.xFmt(cfg.labels[i]) : cfg.labels[i], X(i), H - pad.b + 8);

      // markers
      let lastX = -999,
        lane = 0;
      (cfg.markers || []).forEach((mk) => {
        const x = X(mk.i);
        lane = x - lastX < 110 ? (lane + 1) % 2 : 0;
        lastX = x;
        ctx.strokeStyle = UI.C.text3;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, pad.t - 4);
        ctx.lineTo(x, pad.t + ch);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = UI.C.text2;
        ctx.font = "10px Inter,sans-serif";
        ctx.textAlign = x > w - 90 ? "right" : x < 90 ? "left" : "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(mk.label, x, 12 + lane * 12);
      });

      cfg.series.forEach((s) => {
        const pts = s.values.map((v, i) => (v === null ? null : [X(i), Y(v)]));
        if (s.area) {
          ctx.beginPath();
          let started = false;
          pts.forEach((p) => {
            if (!p) return;
            started ? ctx.lineTo(p[0], p[1]) : (ctx.moveTo(p[0], p[1]), (started = true));
          });
          const lastP = pts.filter(Boolean).pop(),
            firstP = pts.find(Boolean);
          if (lastP) {
            ctx.lineTo(lastP[0], pad.t + ch);
            ctx.lineTo(firstP[0], pad.t + ch);
            ctx.closePath();
            ctx.fillStyle = s.color + "22";
            ctx.fill();
          }
        }
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.setLineDash(s.dash ? [4, 4] : []);
        ctx.beginPath();
        let started = false;
        pts.forEach((p) => {
          if (!p) {
            started = false;
            return;
          }
          started ? ctx.lineTo(p[0], p[1]) : (ctx.moveTo(p[0], p[1]), (started = true));
        });
        ctx.stroke();
        ctx.setLineDash([]);
      });

      if (hi !== null && hi !== undefined) {
        ctx.strokeStyle = UI.C.text3;
        ctx.beginPath();
        ctx.moveTo(X(hi), pad.t);
        ctx.lineTo(X(hi), pad.t + ch);
        ctx.stroke();
        cfg.series.forEach((s) => {
          const v = s.values[hi];
          if (v === null) return;
          ctx.beginPath();
          ctx.arc(X(hi), Y(v), 4, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.fill();
          ctx.strokeStyle = UI.C.surface;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }
    }
    draw(null);
    cv.onmousemove = (e) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const i = Math.max(0, Math.min(n - 1, Math.round(((x - pad.l) / cw) * (n - 1))));
      draw(i);
      const rows = cfg.series
        .map((s) => `<span style="color:${s.color}">●</span> ${esc(s.name)}: <b>${s.values[i] === null ? "–" : yf(s.values[i])}</b>`)
        .join("<br>");
      UI.showTip(e, `<strong>${esc(cfg.tipTitle ? cfg.tipTitle(i) : cfg.labels[i])}</strong>${rows}${cfg.tipExtra ? cfg.tipExtra(i) : ""}`);
    };
    cv.onmouseleave = () => {
      draw(null);
      UI.hideTip();
    };
  };

  // Vertical bars. cfg: {labels, values, color?, colors?, height?, tip(i), xFmt?}
  UI.columnChart = (cv, cfg) => {
    const H = cfg.height || 200;
    const { ctx, w } = setup(cv, H);
    const n = cfg.values.length;
    const pad = { t: 12, r: 12, b: cfg.rotate ? 52 : 26, l: 44 };
    const cw = w - pad.l - pad.r,
      ch = H - pad.t - pad.b;
    const maxV = niceMax(Math.max(1, ...cfg.values));
    const slot = cw / n,
      bw = Math.max(2, Math.min(48, slot - 2));
    function draw(hi) {
      ctx.clearRect(0, 0, w, H);
      ctx.font = "10px IBM Plex Mono,monospace";
      for (let k = 0; k <= 4; k++) {
        const v = (maxV * k) / 4,
          y = pad.t + ch - (v / maxV) * ch;
        ctx.strokeStyle = UI.C.surface2;
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(w - pad.r, y);
        ctx.stroke();
        ctx.fillStyle = UI.C.text3;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(cfg.yFmt ? cfg.yFmt(v) : shortNum(v), pad.l - 6, y);
      }
      const lstep = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(cw / (cfg.rotate ? 16 : 48)))));
      cfg.values.forEach((v, i) => {
        const bh = (v / maxV) * ch,
          x = pad.l + i * slot + (slot - bw) / 2,
          y = pad.t + ch - bh;
        ctx.fillStyle = (cfg.colors ? cfg.colors[i] : cfg.color || UI.C.accent) + (hi === null || hi === i ? "" : "88");
        const r = Math.min(4, bw / 2, bh);
        ctx.beginPath();
        ctx.moveTo(x, pad.t + ch);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.lineTo(x + bw - r, y);
        ctx.quadraticCurveTo(x + bw, y, x + bw, y + r);
        ctx.lineTo(x + bw, pad.t + ch);
        ctx.fill();
        if (i % lstep === 0) {
          ctx.fillStyle = UI.C.text2;
          ctx.font = "10px IBM Plex Mono,monospace";
          const lbl = cfg.xFmt ? cfg.xFmt(cfg.labels[i]) : cfg.labels[i];
          if (cfg.rotate) {
            ctx.save();
            ctx.translate(x + bw / 2, pad.t + ch + 8);
            ctx.rotate(-Math.PI / 3);
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(lbl, 0, 0);
            ctx.restore();
          } else {
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(lbl, x + bw / 2, pad.t + ch + 8);
          }
        }
      });
    }
    draw(null);
    cv.onmousemove = (e) => {
      const r = cv.getBoundingClientRect();
      const i = Math.floor((e.clientX - r.left - pad.l) / slot);
      if (i < 0 || i >= n) {
        draw(null);
        UI.hideTip();
        return;
      }
      draw(i);
      UI.showTip(e, cfg.tip ? cfg.tip(i) : `<strong>${esc(cfg.labels[i])}</strong>${UI.fmt(cfg.values[i])}`);
    };
    cv.onmouseleave = () => {
      draw(null);
      UI.hideTip();
    };
  };

  // Sequential blue ramp (same as filter dashboard)
  UI.heatCol = (t) => {
    if (t <= 0) return "#252524";
    const stops = [
      [37, 37, 36],
      [20, 50, 100],
      [37, 99, 235],
      [96, 165, 250],
      [219, 234, 254],
    ];
    const idx = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)));
    const f = t * (stops.length - 1) - idx,
      a = stops[idx],
      b = stops[idx + 1];
    return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
  };

  // Grid heatmap. cfg: {rows, cols, values[r][c], tip(r,c)}
  UI.heatmap = (cv, cfg) => {
    const LABEL = cfg.labelW || 40,
      TOP = 18;
    const w0 = cv.clientWidth || 600;
    const cell = Math.max(10, Math.floor((w0 - LABEL) / cfg.cols.length));
    const H = TOP + cfg.rows.length * cell;
    const { ctx, w } = setup(cv, H);
    const max = Math.max(1, ...cfg.values.flat());
    ctx.font = "10px IBM Plex Mono,monospace";
    ctx.fillStyle = UI.C.text3;
    ctx.textBaseline = "middle";
    cfg.cols.forEach((c, j) => {
      if (j % (cfg.colStep || 1) === 0) {
        ctx.textAlign = "center";
        ctx.fillText(c, LABEL + j * cell + cell / 2, TOP / 2);
      }
    });
    cfg.rows.forEach((rw, i) => {
      ctx.textAlign = "right";
      ctx.fillStyle = UI.C.text2;
      ctx.fillText(rw, LABEL - 6, TOP + i * cell + cell / 2);
      cfg.cols.forEach((c, j) => {
        ctx.fillStyle = UI.heatCol(cfg.values[i][j] / max);
        ctx.fillRect(LABEL + j * cell, TOP + i * cell, cell - 2, cell - 2);
      });
    });
    cv.onmousemove = (e) => {
      const r = cv.getBoundingClientRect();
      const j = Math.floor((e.clientX - r.left - LABEL) / cell),
        i = Math.floor((e.clientY - r.top - TOP) / cell);
      if (i >= 0 && i < cfg.rows.length && j >= 0 && j < cfg.cols.length) UI.showTip(e, cfg.tip(i, j));
      else UI.hideTip();
    };
    cv.onmouseleave = UI.hideTip;
    return { w };
  };

  // Donut with HTML legend. slices: [{label, value, color}]
  UI.donut = (cv, legendEl, slices, centerLabel) => {
    const S = 130,
      dpr = window.devicePixelRatio || 1;
    cv.width = S * dpr;
    cv.height = S * dpr;
    cv.style.width = S + "px";
    cv.style.height = S + "px";
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const total = slices.reduce((s, x) => s + x.value, 0) || 1;
    let a0 = -Math.PI / 2;
    slices.forEach((s) => {
      const a = (s.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(65, 65, 56, a0, a0 + a);
      ctx.arc(65, 65, 36, a0 + a, a0, true);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.strokeStyle = UI.C.surface;
      ctx.lineWidth = 2;
      ctx.stroke();
      a0 += a;
    });
    if (centerLabel) {
      ctx.fillStyle = UI.C.text;
      ctx.font = "600 15px Inter,sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(centerLabel[0], 65, 61);
      ctx.fillStyle = UI.C.text3;
      ctx.font = "10px Inter,sans-serif";
      ctx.fillText(centerLabel[1], 65, 77);
    }
    legendEl.innerHTML = slices
      .map(
        (s) =>
          `<div class="legend-row"><div class="legend-label"><span class="legend-dot" style="background:${s.color}"></span>${esc(s.label)}</div><div class="legend-val">${UI.fmt(s.value)} <span class="muted">${UI.pct(s.value, total, 0)}</span></div></div>`,
      )
      .join("");
  };

  UI.legend = (series) =>
    `<div class="legend-inline">${series.map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join("")}</div>`;
})();
