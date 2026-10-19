// Port of dashboard.html (filter analytics). Code kept as-is; wrapped so its globals don't clash.
(function () {
  const SAD = window.SAD;
  SAD.legacyFilters = (function () {
      const $ = (id) => document.getElementById(id);
      const fmt = (n) => Number(n).toLocaleString();
      const slug = (s) =>
        (s || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const pctOf = (n, d) => (d > 0 ? ((n / d) * 100).toFixed(1) + "%" : "0%");
      const pctNum = (n, d) => (d > 0 ? (n / d) * 100 : 0);
      const splitG = (s) =>
        (s || "")
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean);
      const C = {
        accent: "#3b82f6",
        green: "#22c55e",
        red: "#ef4444",
        purple: "#8b5cf6",
        text: "#e8e8e4",
        text2: "#a8a8a2",
        text3: "#66665e",
        surface: "#1c1c1b",
        surface2: "#252524",
      };

      const tip = $("tooltip");
      function showTip(e, html) {
        tip.innerHTML = html;
        tip.style.display = "block";
        moveTip(e);
      }
      function moveTip(e) {
        let x = e.clientX + 14,
          y = e.clientY - 10;
        if (x + 310 > window.innerWidth) x = e.clientX - 320;
        tip.style.left = x + "px";
        tip.style.top = y + "px";
      }
      function hideTip() {
        tip.style.display = "none";
      }

      // Heatmap color scale (dark bg: near-black -> dark blue -> bright blue -> light blue)
      function heatCol(t) {
        if (t <= 0) return "#252524";
        const stops = [
          [37, 37, 36],
          [20, 50, 100],
          [37, 99, 235],
          [96, 165, 250],
          [219, 234, 254],
        ];
        const idx = Math.min(
          stops.length - 2,
          Math.floor(t * (stops.length - 1)),
        );
        const f = t * (stops.length - 1) - idx,
          a = stops[idx],
          b = stops[idx + 1];
        return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
      }

      // Analysis
      function analyze(rows) {
        const defRows = rows.filter(
          (r) => r["metadata.isDefault_bool"] === "true",
        );
        const actRows = rows.filter(
          (r) => r["metadata.isDefault_bool"] !== "true",
        );
        const total = rows.reduce((s, r) => s + parseInt(r.count || 0), 0);
        const defEvt = defRows.reduce((s, r) => s + parseInt(r.count || 0), 0);
        const actEvt = actRows.reduce((s, r) => s + parseInt(r.count || 0), 0);

        const allG = new Set();
        actRows.forEach((r) => {
          splitG(r["metadata.visible_text"]).forEach((g) => allG.add(g));
          splitG(r["metadata.hidden_text"]).forEach((g) => allG.add(g));
        });

        const defRow = [...defRows].sort(
          (a, b) => parseInt(b.count) - parseInt(a.count),
        )[0];
        const defVis = new Set(splitG(defRow?.["metadata.visible_text"]));

        const gameVis = {},
          gameHid = {};
        allG.forEach((g) => {
          gameVis[g] = 0;
          gameHid[g] = 0;
        });
        actRows.forEach((r) => {
          const cnt = parseInt(r.count || 0);
          splitG(r["metadata.visible_text"]).forEach((g) => {
            if (g in gameVis) gameVis[g] += cnt;
          });
          splitG(r["metadata.hidden_text"]).forEach((g) => {
            if (g in gameHid) gameHid[g] += cnt;
          });
        });

        const gameList = [...allG]
          .filter((g) => (gameVis[g] || 0) + (gameHid[g] || 0) > 0)
          .sort();
        const gameSet = new Set(gameList);

        const coVis = {},
          coHid = {};
        gameList.forEach((a) => {
          coVis[a] = {};
          coHid[a] = {};
        });
        actRows.forEach((r) => {
          const cnt = parseInt(r.count || 0);
          const vis = splitG(r["metadata.visible_text"]).filter((g) =>
            gameSet.has(g),
          );
          const hid = splitG(r["metadata.hidden_text"]).filter((g) =>
            gameSet.has(g),
          );
          for (let i = 0; i < vis.length; i++)
            for (let j = i + 1; j < vis.length; j++) {
              coVis[vis[i]][vis[j]] = (coVis[vis[i]][vis[j]] || 0) + cnt;
              coVis[vis[j]][vis[i]] = (coVis[vis[j]][vis[i]] || 0) + cnt;
            }
          for (let i = 0; i < hid.length; i++)
            for (let j = i + 1; j < hid.length; j++) {
              coHid[hid[i]][hid[j]] = (coHid[hid[i]][hid[j]] || 0) + cnt;
              coHid[hid[j]][hid[i]] = (coHid[hid[j]][hid[i]] || 0) + cnt;
            }
        });

        const dropout = {};
        actRows.forEach((r) => {
          const cnt = parseInt(r.count || 0);
          const vis = new Set(splitG(r["metadata.visible_text"]));
          defVis.forEach((g) => {
            if (!vis.has(g)) dropout[g] = (dropout[g] || 0) + cnt;
          });
        });

        const addin = {};
        actRows.forEach((r) => {
          const cnt = parseInt(r.count || 0);
          splitG(r["metadata.visible_text"]).forEach((g) => {
            if (gameSet.has(g) && !defVis.has(g))
              addin[g] = (addin[g] || 0) + cnt;
          });
        });

        const comboCounts = {};
        actRows.forEach((r) => {
          const cnt = parseInt(r.count || 0);
          const vk = splitG(r["metadata.visible_text"]).sort().join("|");
          if (vk) comboCounts[vk] = (comboCounts[vk] || 0) + cnt;
        });

        const sizeDist = {};
        actRows.forEach((r) => {
          const cnt = parseInt(r.count || 0);
          const n = splitG(r["metadata.visible_text"]).length;
          if (n > 0) sizeDist[n] = (sizeDist[n] || 0) + cnt;
        });

        return {
          total,
          defEvt,
          actEvt,
          uniqueConfigs: Object.keys(comboCounts).length,
          gameList,
          gameVis,
          gameHid,
          coVis,
          coHid,
          dropout,
          addin,
          comboCounts,
          sizeDist,
          defVis,
        };
      }

      // KPIs
      function renderKPIs(d) {
        const ep = pctNum(d.actEvt, d.total).toFixed(1);
        $("kpi-row").innerHTML = [
          {
            label: "Total filter events",
            val: fmt(d.total),
            sub: "all recorded customizations",
          },
          {
            label: "Active customizations",
            val: fmt(d.actEvt),
            sub: `${ep}% of all events`,
          },
          {
            label: "Default (no change)",
            val: fmt(d.defEvt),
            sub: `${(100 - parseFloat(ep)).toFixed(1)}% - no interaction`,
          },
          {
            label: "Unique configurations",
            val: fmt(d.uniqueConfigs),
            sub: "distinct active filter states",
          },
          {
            label: "Games tracked",
            val: fmt(d.gameList.length),
            sub: "with at least one occurrence",
          },
        ]
          .map(
            (k) =>
              `<div class="kpi"><div class="kpi-label">${k.label}</div><div class="kpi-value">${k.val}</div><div class="kpi-sub">${k.sub}</div></div>`,
          )
          .join("");
      }

      // Donut
      function renderDonut(d) {
        const cv = $("donut-canvas"),
          ctx = cv.getContext("2d");
        const slices = [
          { label: "Active customizations", val: d.actEvt, color: C.accent },
          { label: "Default (unchanged)", val: d.defEvt, color: "#3a3a38" },
        ];
        ctx.clearRect(0, 0, 130, 130);
        let s = -Math.PI / 2;
        slices.forEach((sl) => {
          const a = (sl.val / d.total) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(65, 65);
          ctx.arc(65, 65, 54, s, s + a);
          ctx.closePath();
          ctx.fillStyle = sl.color;
          ctx.fill();
          s += a;
        });
        ctx.beginPath();
        ctx.arc(65, 65, 34, 0, Math.PI * 2);
        ctx.fillStyle = C.surface;
        ctx.fill();
        ctx.fillStyle = C.text;
        ctx.font = "bold 15px Inter,sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(pctNum(d.actEvt, d.total).toFixed(0) + "%", 65, 68);
        ctx.fillStyle = C.text3;
        ctx.font = "10px Inter,sans-serif";
        ctx.fillText("active", 65, 80);
        $("donut-legend").innerHTML = slices
          .map(
            (sl) =>
              `<div class="legend-row"><div class="legend-label"><span class="legend-dot" style="background:${sl.color}"></span>${sl.label}</div><div class="legend-val">${fmt(sl.val)}</div></div>`,
          )
          .join("");
      }

      // Insights
      function renderInsights(d) {
        const { actEvt, total, gameVis, gameHid, sizeDist, defVis, defEvt } = d;
        const ep = pctNum(actEvt, total).toFixed(1);
        const topVis = Object.entries(gameVis)
          .filter(([, v]) => v > 0)
          .sort((a, b) => b[1] - a[1])[0];
        const topHid = Object.entries(gameHid)
          .filter(([, v]) => v > 0)
          .sort((a, b) => b[1] - a[1])[0];
        const topSize = Object.entries(sizeDist).sort((a, b) => b[1] - a[1])[0];
        const mkCard = (label, value, sub) =>
          `<div class="insight-card"><div class="insight-label">${label}</div><div class="insight-value">${value}</div><div class="insight-sub">${sub}</div></div>`;
        $("ins1").innerHTML =
          mkCard(
            "Engagement rate",
            `${ep}% customize filters`,
            `${fmt(actEvt)} active vs ${fmt(defEvt)} unchanged. ${parseFloat(ep) > 50 ? "Majority" : "Minority"} of visitors interact with filters.`,
          ) +
          mkCard(
            "Most included game",
            slug(topVis?.[0] || ""),
            `Kept visible in ${pctOf(topVis?.[1] || 0, actEvt)} of active events (${fmt(topVis?.[1] || 0)}).`,
          );
        $("ins2").innerHTML =
          mkCard(
            "Most excluded game",
            slug(topHid?.[0] || ""),
            `Hidden in ${pctOf(topHid?.[1] || 0, actEvt)} of active events. May not belong in the default list.`,
          ) +
          mkCard(
            "Typical filter size",
            `${topSize?.[0] || 0} games visible`,
            `Most common selection count (${pctOf(topSize?.[1] || 0, actEvt)}). Default shows ${defVis.size} games.`,
          );
      }

      // Bars
      function renderBars(d, tab) {
        const { gameVis, gameHid, actEvt, gameList } = d;
        let entries, lT, rT, lC, rC;
        if (tab === "visible") {
          entries = gameList
            .map((g) => [g, gameVis[g] || 0])
            .filter(([, v]) => v > 0)
            .sort((a, b) => b[1] - a[1]);
          lT = "Most included games";
          rT = "Least included games";
          lC = C.accent;
          rC = "#4a6fa5";
        } else if (tab === "hidden") {
          entries = gameList
            .map((g) => [g, gameHid[g] || 0])
            .filter(([, v]) => v > 0)
            .sort((a, b) => b[1] - a[1]);
          lT = "Most excluded games";
          rT = "Least excluded games";
          lC = C.red;
          rC = "#7a3535";
        } else {
          entries = gameList
            .map((g) => [g, (gameVis[g] || 0) - (gameHid[g] || 0)])
            .sort((a, b) => b[1] - a[1]);
          lT = "Most preferred (visible - hidden)";
          rT = "Least preferred";
          lC = C.green;
          rC = C.red;
        }
        const top = entries.slice(0, 15);
        const bot = [...entries]
          .reverse()
          .filter(([, v]) => (tab === "delta" ? true : v > 0))
          .slice(0, 15);
        $("btl").textContent = lT;
        $("btr").textContent = rT;
        const maxL = Math.max(...top.map(([, v]) => Math.abs(v)), 1);
        const maxR = Math.max(...bot.map(([, v]) => Math.abs(v)), 1);
        const mkRows = (items, maxV, color) =>
          items
            .map(
              ([g, v]) =>
                `<div class="bar-row"><div class="bar-label" title="${slug(g)}">${slug(g)}</div><div class="bar-track"><div class="bar-fill" style="width:${((Math.abs(v) / maxV) * 100).toFixed(1)}%;background:${tab === "delta" ? (v >= 0 ? C.green : C.red) : color}"></div></div><div class="bar-pct">${pctOf(Math.abs(v), actEvt)}</div></div>`,
            )
            .join("");
        $("bl").innerHTML = mkRows(top, maxL, lC);
        $("br").innerHTML = mkRows(bot, maxR, rC);
      }

      // Heatmap
      function renderHeatmap(d) {
        const { gameList, coVis } = d;
        const active = gameList.filter((g) =>
          Object.values(coVis[g] || {}).some((v) => v > 0),
        );
        const n = active.length;
        if (!n) return;

        // Dynamically measure label width
        const tmpCv = document.createElement("canvas");
        const tmpCtx = tmpCv.getContext("2d");
        tmpCtx.font = "11px IBM Plex Mono,monospace";
        const LABEL = Math.min(
          220,
          Math.ceil(
            Math.max(...active.map((g) => tmpCtx.measureText(slug(g)).width)) +
              16,
          ),
        );

        const avail = Math.min(window.innerWidth - 80, 1200);
        const CELL = Math.max(
          14,
          Math.min(24, Math.floor((avail - LABEL) / n)),
        );
        const FONT = Math.min(11, CELL - 1);
        const W = LABEL + n * CELL,
          H = LABEL + n * CELL;
        const cv = $("heatmap-canvas");
        cv.width = W;
        cv.height = H;
        cv.style.width = W + "px";
        cv.style.height = H + "px";
        const ctx = cv.getContext("2d");
        ctx.fillStyle = C.surface;
        ctx.fillRect(0, 0, W, H);

        let maxVal = 0;
        active.forEach((a) =>
          active.forEach((b) => {
            if (a !== b) maxVal = Math.max(maxVal, coVis[a]?.[b] || 0);
          }),
        );

        active.forEach((a, i) =>
          active.forEach((b, j) => {
            const v = a === b ? 0 : coVis[a]?.[b] || 0;
            ctx.fillStyle =
              a === b ? C.surface2 : heatCol(maxVal > 0 ? v / maxVal : 0);
            ctx.fillRect(
              LABEL + j * CELL,
              LABEL + i * CELL,
              CELL - 1,
              CELL - 1,
            );
          }),
        );

        ctx.font = `${FONT}px IBM Plex Mono,monospace`;
        ctx.fillStyle = C.text2;
        ctx.textBaseline = "middle";
        ctx.textAlign = "right";
        active.forEach((g, i) =>
          ctx.fillText(slug(g), LABEL - 4, LABEL + i * CELL + CELL / 2),
        );

        ctx.save();
        ctx.textAlign = "left";
        active.forEach((g, j) => {
          ctx.save();
          ctx.translate(LABEL + j * CELL + CELL / 2, LABEL - 4);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(slug(g), 0, 0);
          ctx.restore();
        });
        ctx.restore();

        // Scale
        const sc = $("scale-canvas"),
          sctx = sc.getContext("2d");
        const grad = sctx.createLinearGradient(0, 0, 100, 0);
        for (let i = 0; i <= 10; i++)
          grad.addColorStop(i / 10, heatCol(i / 10));
        sctx.fillStyle = grad;
        sctx.fillRect(0, 0, 100, 8);

        cv.onmousemove = (e) => {
          const r = cv.getBoundingClientRect(),
            sx = cv.width / r.width,
            sy = cv.height / r.height;
          const row = Math.floor(((e.clientY - r.top) * sy - LABEL) / CELL);
          const col = Math.floor(((e.clientX - r.left) * sx - LABEL) / CELL);
          if (row >= 0 && row < n && col >= 0 && col < n) {
            const a = active[row],
              b = active[col];
            if (a === b) showTip(e, `<strong>${slug(a)}</strong><br>Diagonal`);
            else {
              const v = coVis[a]?.[b] || 0;
              showTip(
                e,
                `<strong>${slug(a)}</strong><br><strong>${slug(b)}</strong><br>Co-selected: ${fmt(v)} events (${maxVal > 0 ? ((v / maxVal) * 100).toFixed(0) : 0}% of max)`,
              );
            }
            moveTip(e);
          } else hideTip();
        };
        cv.onmouseleave = hideTip;
      }

      // Graph - pre-computed layout (runs offline, no animation loop)
      const gState = { nodes: [], edges: [], zoom: 1, panX: 0, panY: 0 };
      function renderGraph(d, mode, thresh) {
        const { gameList, coVis, coHid, gameVis, gameHid } = d;

        const cv = $("graph-canvas");
        const W = cv.parentElement.clientWidth || 900;
        const H = 480;
        cv.setAttribute("width", W);
        cv.setAttribute("height", H);
        const ctx = cv.getContext("2d");

        const maxVco = Math.max(
          ...gameList.flatMap((a) => gameList.map((b) => coVis[a]?.[b] || 0)),
          1,
        );
        const maxHco = Math.max(
          ...gameList.flatMap((a) => gameList.map((b) => coHid[a]?.[b] || 0)),
          1,
        );

        const edges = [];
        gameList.forEach((a, i) =>
          gameList.forEach((b, j) => {
            if (j <= i) return;
            let wv = 0,
              wh = 0;
            if (mode === "visible" || mode === "both")
              wv = (coVis[a]?.[b] || 0) / maxVco;
            if (mode === "hidden" || mode === "both")
              wh = (coHid[a]?.[b] || 0) / maxHco;
            const w = Math.max(wv, wh);
            if (w * 100 >= thresh)
              edges.push({
                a,
                b,
                wv,
                wh,
                weight: w,
                type: wv > 0 && wh > 0 ? "both" : wv > 0 ? "vis" : "hid",
              });
          }),
        );

        const connected = new Set(edges.flatMap((e) => [e.a, e.b]));
        const activeG = [...connected];
        const maxVis = Math.max(...activeG.map((g) => gameVis[g] || 0), 1);

        // Initialise positions: reuse existing if same node, else evenly on circle
        const existMap = {};
        gState.nodes.forEach((n) => (existMap[n.id] = n));
        const cx = W / 2,
          cy = H / 2,
          initR = Math.min(W, H) * 0.35;
        const nodes = activeG.map((g, i) => ({
          id: g,
          x: existMap[g]
            ? existMap[g].x
            : cx + initR * Math.cos((2 * Math.PI * i) / activeG.length),
          y: existMap[g]
            ? existMap[g].y
            : cy + initR * Math.sin((2 * Math.PI * i) / activeG.length),
          vx: 0,
          vy: 0,
          r: 5 + ((gameVis[g] || 0) / maxVis) * 10,
        }));
        const nMap = {};
        nodes.forEach((n) => (nMap[n.id] = n));

        // Run simulation synchronously for N iterations until energy is low
        const ITERS = 400;
        const REPULSION = 3500;
        const IDEAL_DIST = 120;
        for (let iter = 0; iter < ITERS; iter++) {
          const cooling = 1 - iter / ITERS; // 1 -> 0
          const damp = 0.4 + 0.5 * (1 - cooling); // 0.4 -> 0.9

          // Repulsion between all pairs
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const a = nodes[i],
                b = nodes[j];
              const dx = a.x - b.x,
                dy = a.y - b.y;
              const dist2 = Math.max(1, dx * dx + dy * dy);
              const dist = Math.sqrt(dist2);
              const f = (REPULSION / dist2) * cooling;
              a.vx += (dx / dist) * f;
              a.vy += (dy / dist) * f;
              b.vx -= (dx / dist) * f;
              b.vy -= (dy / dist) * f;
            }
          }
          // Spring attraction along edges
          edges.forEach((e) => {
            const a = nMap[e.a],
              b = nMap[e.b];
            if (!a || !b) return;
            const dx = b.x - a.x,
              dy = b.y - a.y,
              dist = Math.max(1, Math.hypot(dx, dy));
            const ideal = IDEAL_DIST * (1 - e.weight * 0.5);
            const f = (dist - ideal) * 0.06;
            a.vx += (dx / dist) * f;
            a.vy += (dy / dist) * f;
            b.vx -= (dx / dist) * f;
            b.vy -= (dy / dist) * f;
          });
          // Gentle centre gravity
          nodes.forEach((n) => {
            n.vx += (cx - n.x) * 0.004 * cooling;
            n.vy += (cy - n.y) * 0.004 * cooling;
            n.vx *= damp;
            n.vy *= damp;
            n.x += n.vx;
            n.y += n.vy;
            n.x = Math.max(n.r + 6, Math.min(W - n.r - 6, n.x));
            n.y = Math.max(n.r + 6, Math.min(H - n.r - 6, n.y));
          });
        }

        gState.nodes = nodes;
        gState.edges = edges;

        // --- Static draw function (called once + on zoom/pan/drag) ---
        function draw() {
          ctx.clearRect(0, 0, W, H);
          ctx.fillStyle = C.surface;
          ctx.fillRect(0, 0, W, H);
          ctx.save();
          ctx.translate(gState.panX, gState.panY);
          ctx.scale(gState.zoom, gState.zoom);
          edges.forEach((e) => {
            const a = nMap[e.a],
              b = nMap[e.b];
            if (!a || !b) return;
            ctx.globalAlpha = 0.15 + e.weight * 0.55;
            ctx.strokeStyle =
              e.type === "hid"
                ? C.red
                : e.type === "both"
                  ? C.purple
                  : C.accent;
            ctx.lineWidth = Math.max(0.5, (0.5 + e.weight * 2.5) / gState.zoom);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          });
          ctx.globalAlpha = 1;
          nodes.forEach((n) => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = C.surface2;
            ctx.fill();
            ctx.strokeStyle = C.accent;
            ctx.lineWidth = 1.5 / gState.zoom;
            ctx.stroke();
            const fs = Math.max(8, Math.min(11, n.r + 2));
            ctx.font = `500 ${fs}px Inter,sans-serif`;
            ctx.fillStyle = C.text;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(slug(n.id).split(" ").slice(0, 3).join(" "), n.x, n.y);
          });
          ctx.restore();
        }

        draw();

        // Interaction
        let dragNode = null,
          isPanning = false,
          lastMx = 0,
          lastMy = 0;
        cv.onmousedown = (e) => {
          const r = cv.getBoundingClientRect();
          const mx = (e.clientX - r.left - gState.panX) / gState.zoom;
          const my = (e.clientY - r.top - gState.panY) / gState.zoom;
          dragNode =
            nodes.find((n) => Math.hypot(n.x - mx, n.y - my) < n.r + 6) || null;
          if (!dragNode) {
            isPanning = true;
            lastMx = e.clientX;
            lastMy = e.clientY;
          }
        };
        cv.onmousemove = (e) => {
          const r = cv.getBoundingClientRect();
          let dirty = false;
          if (dragNode) {
            dragNode.x = (e.clientX - r.left - gState.panX) / gState.zoom;
            dragNode.y = (e.clientY - r.top - gState.panY) / gState.zoom;
            dirty = true;
          } else if (isPanning) {
            gState.panX += e.clientX - lastMx;
            gState.panY += e.clientY - lastMy;
            lastMx = e.clientX;
            lastMy = e.clientY;
            dirty = true;
          }
          if (dirty) draw();
          const mx = (e.clientX - r.left - gState.panX) / gState.zoom;
          const my = (e.clientY - r.top - gState.panY) / gState.zoom;
          const hit = nodes.find(
            (n) => Math.hypot(n.x - mx, n.y - my) < n.r + 5,
          );
          if (hit)
            showTip(
              e,
              `<strong>${slug(hit.id)}</strong><br>Included: ${fmt(gameVis[hit.id] || 0)} events (${pctOf(gameVis[hit.id] || 0, d.actEvt)})<br>Excluded: ${fmt(gameHid[hit.id] || 0)} events`,
            );
          else hideTip();
          moveTip(e);
        };
        cv.onmouseup = () => {
          dragNode = null;
          isPanning = false;
        };
        cv.onmouseleave = () => {
          dragNode = null;
          isPanning = false;
          hideTip();
        };
        cv.onwheel = (e) => {
          e.preventDefault();
          const r = cv.getBoundingClientRect(),
            mx = e.clientX - r.left,
            my = e.clientY - r.top;
          const factor = e.deltaY > 0 ? 0.88 : 1.14;
          const nz = Math.max(0.2, Math.min(6, gState.zoom * factor));
          gState.panX = mx - (mx - gState.panX) * (nz / gState.zoom);
          gState.panY = my - (my - gState.panY) * (nz / gState.zoom);
          gState.zoom = nz;
          draw();
        };
      }

      // Combos
      function renderCombos(d) {
        $("top-combos").innerHTML = Object.entries(d.comboCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([key, cnt], i) => {
            const games = key.split("|").filter(Boolean);
            return `<div class="combo-item"><div class="combo-rank">#${i + 1}</div><div class="combo-games">${games.map((g) => `<span class="game-chip">${slug(g)}</span>`).join("")}</div><div class="combo-count">${fmt(cnt)}</div></div>`;
          })
          .join("");
      }

      // Size dist
      function renderSizeDist(d) {
        const cv = $("dist-canvas");
        const W = cv.offsetWidth;
        if (!W) return;
        const H = 220;
        cv.width = W;
        cv.height = H;
        const ctx = cv.getContext("2d");
        ctx.clearRect(0, 0, W, H);
        const entries = Object.entries(d.sizeDist)
          .map(([k, v]) => [+k, v])
          .sort((a, b) => a[0] - b[0]);
        if (!entries.length) return;
        const maxV = Math.max(...entries.map((e) => e[1]));
        const pad = { t: 12, r: 12, b: 48, l: 50 },
          cW = W - pad.l - pad.r,
          cH = H - pad.t - pad.b;
        const bw = Math.max(6, Math.floor(cW / entries.length) - 3);
        ctx.strokeStyle = C.surface2;
        ctx.lineWidth = 1;
        [0, 0.25, 0.5, 0.75, 1].forEach((f) => {
          const y = pad.t + cH - f * cH;
          ctx.beginPath();
          ctx.moveTo(pad.l, y);
          ctx.lineTo(W - pad.r, y);
          ctx.stroke();
          ctx.fillStyle = C.text3;
          ctx.font = "10px IBM Plex Mono,monospace";
          ctx.textAlign = "right";
          ctx.fillText(Math.round(maxV * f).toLocaleString(), pad.l - 4, y + 3);
        });
        entries.forEach(([k, v], i) => {
          const bh = (v / maxV) * cH;
          const x =
            pad.l + (i / entries.length) * cW + (cW / entries.length - bw) / 2;
          const y = pad.t + cH - bh;
          ctx.fillStyle = C.accent + "cc";
          ctx.fillRect(x, y, bw, bh);
          ctx.save();
          ctx.fillStyle = C.text2;
          ctx.font = "10px IBM Plex Mono,monospace";
          ctx.translate(x + bw / 2, H - pad.b + 8);
          ctx.rotate(-Math.PI / 3);
          ctx.textAlign = "right";
          ctx.fillText(String(k), 0, 0);
          ctx.restore();
        });
        ctx.fillStyle = C.text3;
        ctx.font = "11px Inter,sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Number of games kept visible", W / 2, H - 2);
      }

      // Dropout / addin
      function renderDropout(d, type) {
        const entries =
          type === "out"
            ? Object.entries(d.dropout)
                .filter(([, v]) => v > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 15)
            : Object.entries(d.addin)
                .filter(([, v]) => v > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 15);
        const maxV = Math.max(...entries.map((e) => e[1]), 1);
        const color = type === "out" ? C.red : C.green;
        $("dropout-bars").innerHTML = entries.length
          ? entries
              .map(
                ([g, v]) =>
                  `<div class="bar-row"><div class="bar-label" title="${slug(g)}">${slug(g)}</div><div class="bar-track"><div class="bar-fill" style="width:${((v / maxV) * 100).toFixed(1)}%;background:${color}cc"></div></div><div class="bar-pct">${pctOf(v, d.actEvt)}</div></div>`,
              )
              .join("")
          : `<div style="color:var(--text3);font-size:12px;padding:8px 0">No data for this view</div>`;
      }

      // Config diversity - log scale
      function renderComboDist(d) {
        const cv = $("combo-dist-canvas");
        const W = cv.offsetWidth;
        if (!W) return;
        const H = 180;
        cv.width = W;
        cv.height = H;
        const ctx = cv.getContext("2d");
        ctx.clearRect(0, 0, W, H);
        const entries = Object.entries(d.comboCounts).sort(
          (a, b) => b[1] - a[1],
        );
        if (!entries.length) return;
        const maxV = entries[0][1];
        const logMax = Math.log10(maxV + 1);
        const pad = { t: 16, r: 16, b: 28, l: 52 },
          cW = W - pad.l - pad.r,
          cH = H - pad.t - pad.b;
        const bw = Math.max(1, Math.floor(cW / entries.length) - 1);

        ctx.strokeStyle = C.surface2;
        ctx.lineWidth = 1;
        [1, 10, 100, 1000, 10000].forEach((v) => {
          if (v > maxV * 1.5) return;
          const logV = Math.log10(v + 1) / logMax;
          const y = pad.t + cH * (1 - logV);
          ctx.beginPath();
          ctx.moveTo(pad.l, y);
          ctx.lineTo(W - pad.r, y);
          ctx.stroke();
          ctx.fillStyle = C.text3;
          ctx.font = "10px IBM Plex Mono,monospace";
          ctx.textAlign = "right";
          ctx.fillText(
            v >= 1000 ? `${v / 1000}k` : String(v),
            pad.l - 4,
            y + 3,
          );
        });

        entries.forEach(([, v], i) => {
          const logV = Math.log10(v + 1) / logMax;
          const bh = logV * cH;
          const x = pad.l + (i / entries.length) * cW;
          const alpha = Math.max(0.3, 0.9 - (i / entries.length) * 0.5);
          ctx.fillStyle =
            C.accent +
            Math.round(alpha * 255)
              .toString(16)
              .padStart(2, "0");
          ctx.fillRect(x, pad.t + cH - bh, Math.max(1, bw), bh);
        });

        ctx.fillStyle = C.text3;
        ctx.font = "11px Inter,sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          `${entries.length} unique configurations - sorted by popularity (log scale Y)`,
          W / 2,
          H - 4,
        );
      }

      // Table
      function renderTable(d) {
        const { gameList, gameVis, gameHid, actEvt } = d;
        const rows = gameList
          .filter((g) => (gameVis[g] || 0) + (gameHid[g] || 0) > 0)
          .map((g) => {
            const vis = gameVis[g] || 0,
              hid = gameHid[g] || 0;
            return {
              g,
              vis,
              hid,
              net: vis - hid,
              vp: pctNum(vis, actEvt),
              hp: pctNum(hid, actEvt),
            };
          })
          .sort((a, b) => b.net - a.net);
        $("stats-tbody").innerHTML = rows
          .map(
            (r, i) => `
    <tr>
      <td class="mono" style="color:var(--text3)">${i + 1}</td>
      <td>${slug(r.g)}</td>
      <td><div class="pct-cell"><div class="pct-bar-inline"><div class="pct-bar-fill" style="width:${Math.min(100, r.vp).toFixed(1)}%;background:${C.accent}"></div></div><span class="mono">${r.vp.toFixed(1)}%</span></div></td>
      <td><div class="pct-cell"><div class="pct-bar-inline"><div class="pct-bar-fill" style="width:${Math.min(100, r.hp).toFixed(1)}%;background:${C.red}"></div></div><span class="mono">${r.hp.toFixed(1)}%</span></div></td>
      <td class="mono" style="color:var(--text2)">${fmt(r.vis)}</td>
      <td class="mono" style="color:var(--text2)">${fmt(r.hid)}</td>
      <td class="mono ${r.net >= 0 ? "net-pos" : "net-neg"}">${r.net >= 0 ? "+" : ""}${fmt(r.net)}</td>
    </tr>`,
          )
          .join("");
        $("net-q").onmouseenter = (e) =>
          showTip(
            e,
            "<strong>Net score = Visible minus Hidden events</strong><br>Positive: users prefer to keep this game visible.<br>Negative: more users hide it than show it.",
          );
        $("net-q").onmousemove = moveTip;
        $("net-q").onmouseleave = hideTip;
      }

    // Adapted from dashboard.html loadData: raw export rows -> count = 1 per filter_customization event
    function render(m) {
      const rows = m.evs
        .filter((e) => e.dp === "filter_customization")
        .map((e) => ({
          count: "1",
          "metadata.isDefault_bool": e.mDefault,
          "metadata.visible_text": e.mVisible,
          "metadata.hidden_text": e.mHidden,
        }));
      if (!rows.length) return;
      const d = analyze(rows);
      renderKPIs(d);
      renderDonut(d);
      renderInsights(d);
      renderBars(d, "visible");
      renderCombos(d);
      renderDropout(d, "out");
      renderTable(d);
      document.querySelectorAll("#pop-tabs .tab-btn").forEach((btn) => {
        btn.onclick = () => {
          document.querySelectorAll("#pop-tabs .tab-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          renderBars(d, btn.dataset.tab);
        };
      });
      document.querySelectorAll("#dropout-tabs .tab-btn").forEach((btn) => {
        btn.onclick = () => {
          document.querySelectorAll("#dropout-tabs .tab-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          renderDropout(d, btn.dataset.dtype);
        };
      });
      renderSizeDist(d);
      renderComboDist(d);
      renderHeatmap(d);
      gState.zoom = 1;
      gState.panX = 0;
      gState.panY = 0;
      gState.nodes = [];
      $("thresh-label").textContent = $("edge-thresh").value + "%";
      renderGraph(d, $("graph-mode").value, parseInt($("edge-thresh").value));
      const rerender = () => {
        gState.zoom = 1;
        gState.panX = 0;
        gState.panY = 0;
        renderGraph(d, $("graph-mode").value, parseInt($("edge-thresh").value));
      };
      $("graph-mode").onchange = rerender;
      $("edge-thresh").oninput = () => ($("thresh-label").textContent = $("edge-thresh").value + "%");
      $("edge-thresh").onchange = rerender;
    }
    return { render };
  })();
})();
