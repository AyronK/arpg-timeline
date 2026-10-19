(function () {
  const SAD = window.SAD;
  SAD.tabs = SAD.tabs || {};

  const group = (path) => {
    const mm = path.match(/^(\/game\/[^/]+)\/news\//);
    if (mm) return mm[1] + "/news/…";
    if (/^\/news\/.+/.test(path)) return "/news/…";
    return path.length > 1 ? path.replace(/\/$/, "") : path;
  };

  SAD.tabs.engagement = function (m, el) {
    const U = SAD.util;
    const { fmt, pct, esc } = UI;
    const loads = m.loads.filter((l) => l.pvs.length);
    const byType = U.countBy(loads, (l) => l.type);
    const visitsHome = loads.filter((l) => l.type === "visit" && l.entry === "/").length;
    const fc = m.evs.filter((e) => e.dp === "filter_customization").length;
    const interactive = loads.filter((l) => l.interactive).length;

    el.innerHTML = `
      <div class="kpi-row" id="en-kpis"></div>
      <div class="insight-grid" id="en-ins"></div>
      <div class="grid-2 section">
        <div class="card">
          <div class="card-title">How page loads start</div>
          <div id="en-types"></div>
          <div class="card-title" style="margin-top:22px">Interaction rate by segment</div>
          <div class="bar-list" id="en-seg"></div>
        </div>
        <div class="card">
          <div class="card-title">New-browser proxy per day <span class="muted" style="text-transform:none;letter-spacing:0">- first-ever filter_customization ÷ visits landing on /</span></div>
          <canvas id="en-newb" class="cv"></canvas>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Entry pages <span class="hint">- where page loads start and what happens next (≥20 loads). Time, scroll and bounce refer to the entry pageview.</span></div>
        <div class="card"><div id="en-entry" class="table-wrap card-scroll tall"></div></div>
      </div>
      <div class="grid-2 section">
        <div class="card"><div class="card-title">Visits by weekday × hour (your local time)</div><canvas id="en-heat" class="cv"></canvas></div>
        <div class="card"><div class="card-title">Time on page distribution</div><canvas id="en-dur" class="cv"></canvas>
          <div class="card-title" style="margin-top:18px">Pages per load</div><canvas id="en-ppl" class="cv"></canvas></div>
      </div>
      <div class="grid-2 section">
        <div class="card card-scroll"><div class="card-title">Next page - in-app navigation (from → to)</div><div class="bar-list wide" id="en-flow"></div></div>
        <div class="card card-scroll"><div class="card-title">Unknown /game/ paths (likely 404s)</div><div class="bar-list wide" id="en-404"></div></div>
      </div>`;

    UI.kpis(document.getElementById("en-kpis"), [
      { label: "Pages / load", value: (m.pvs.length / loads.length).toFixed(2), sub: `${pct(loads.filter((l) => l.pvs.length === 1).length, loads.length)} single-page`, tip: "<strong>Pages per load</strong>Average pageviews within one page load (session_id). In-app navigation adds pages; a reload or new tab starts a new load." },
      { label: "Interaction rate", value: pct(interactive, loads.length), sub: "loads with a non-automatic event", tip: "<strong>Interaction rate</strong>Page loads where the visitor triggered at least one custom event (click, filter, link…). Automatic events don't count: filter_customization, onboarding_shown and embed views." },
      { label: "Time on page", value: UI.dur(SAD.timeOnPage(m.pvs)), sub: "median of pageviews ≥5s", tip: "<strong>Time on page</strong>Median duration per pageview, following SA: pageviews under 5s are excluded (treated as bounces). Median, because tabs left open for hours would wreck an average. ~40% of pageviews have no duration recorded." },
      { label: "Scroll depth", value: (SAD.medianScroll(m.pvs) ?? "–") + "%", sub: "median per pageview", tip: "<strong>Scroll depth</strong>Median of how far down the page visitors scrolled, per pageview (SA reports it in 5% steps). Pageviews without a recorded value are ignored." },
      { label: "Reload loads", value: pct(byType.get("reload") || 0, loads.length), sub: "refresh / back-forward", tip: "<strong>Reload loads</strong>Page loads whose first pageview is not unique and has no internal referrer - a refresh or browser back/forward. A signal of people keeping the tab open or coming back to it." },
      { label: "New browsers", value: pct(fc, visitsHome, 0), sub: "proxy · of visits landing on /", tip: "<strong>New browsers (proxy)</strong>filter_customization fires once per browser ever (localStorage), on the featured dashboard. Divided by visits whose entry page is /. The rest are roughly returning browsers. Cleared storage or private windows count as new." },
    ]);

    UI.stack(document.getElementById("en-types"), [
      { label: "Visit (unique entry)", value: byType.get("visit") || 0, color: UI.SERIES[0], tip: "Direct or external referrer - counted by SA as a visitor" },
      { label: "Reload / history", value: byType.get("reload") || 0, color: UI.SERIES[1], tip: "Non-unique first pageview without internal referrer" },
      { label: "Internal new load", value: byType.get("internal") || 0, color: UI.SERIES[2], tip: "Full load from an arpg-timeline.com link (e.g. new tab)" },
    ]);

    const seg = (name, ls) => ({ label: name, value: ls.length ? ls.filter((l) => l.interactive).length / ls.length : 0, text: pct(ls.filter((l) => l.interactive).length, ls.length), tip: `<strong>${esc(name)}</strong>${fmt(ls.length)} loads` });
    UI.bars(
      document.getElementById("en-seg"),
      [
        seg("Desktop", loads.filter((l) => l.first.device === "desktop")),
        seg("Mobile", loads.filter((l) => l.first.device === "mobile")),
        seg("Visits", loads.filter((l) => l.type === "visit")),
        seg("Reloads", loads.filter((l) => l.type === "reload")),
        seg("Entry: dashboards", loads.filter((l) => SAD.pageType(l.entry) === "dashboard")),
        seg("Entry: game pages", loads.filter((l) => SAD.pageType(l.entry) === "game")),
        seg("Entry: news", loads.filter((l) => SAD.pageType(l.entry) === "news")),
      ],
      { max: 1 },
    );

    // new-browser proxy per day
    const idx = new Map(m.days.map((d, i) => [d, i]));
    const fcD = new Array(m.days.length).fill(0),
      vhD = new Array(m.days.length).fill(0);
    for (const e of m.evs) if (e.dp === "filter_customization") fcD[idx.get(U.dayKey(e.t))]++;
    for (const l of loads) if (l.type === "visit" && l.entry === "/") vhD[idx.get(U.dayKey(l.t))]++;
    const share = fcD.map((v, i) => (vhD[i] >= 20 ? Math.min(1, v / vhD[i]) : null));
    UI.lineChart(document.getElementById("en-newb"), {
      labels: m.days,
      xFmt: U.dayLabel,
      series: [{ name: "New-browser share", color: UI.SERIES[0], values: share, area: true }],
      yMax: 1,
      yFmt: (v) => Math.round(v * 100) + "%",
      height: 230,
      tipExtra: (i) => `<br>${fmt(fcD[i])} new of ${fmt(vhD[i])} home visits`,
    });

    // entry pages
    const eg = new Map();
    for (const l of loads) {
      const k = group(l.entry);
      let a = eg.get(k);
      if (!a) eg.set(k, (a = []));
      a.push(l);
    }
    const entryRows = [...eg.entries()]
      .filter(([, ls]) => ls.length >= 20)
      .map(([k, ls]) => {
        const first = ls.map((l) => l.pvs[0]);
        return {
          path: k,
          loads: ls.length,
          visit: ls.filter((l) => l.type === "visit").length / ls.length,
          ppl: ls.reduce((s, l) => s + l.pvs.length, 0) / ls.length,
          inter: ls.filter((l) => l.interactive).length / ls.length,
          time: SAD.timeOnPage(first),
          scroll: SAD.medianScroll(first),
          bounce: SAD.bounceRate(first),
          mobile: ls.filter((l) => l.first.device === "mobile").length / ls.length,
        };
      });
    const maxInter = Math.max(...entryRows.map((r) => r.inter), 0.01);
    UI.table(
      document.getElementById("en-entry"),
      [
        { key: "path", label: "Entry page", fmt: (v) => `<span class="mono">${esc(v)}</span>` },
        { key: "loads", label: "Loads", num: true, fmt },
        { key: "visit", label: "Unique", num: true, fmt: (v) => UI.pctV(v, 0), tip: "Share of loads that are visits (vs reloads / internal)" },
        { key: "ppl", label: "Pages / load", num: true, fmt: (v) => v.toFixed(2) },
        { key: "inter", label: "Interaction", num: true, fmt: (v) => `${UI.inlineBar(v, maxInter)}<span>${UI.pctV(v)}</span></span>` },
        { key: "time", label: "Time", num: true, fmt: UI.dur },
        { key: "scroll", label: "Scroll", num: true, fmt: (v) => (v === null ? "–" : v + "%") },
        { key: "bounce", label: "Bounce", num: true, fmt: (v) => UI.pctV(v, 0) },
        { key: "mobile", label: "Mobile", num: true, fmt: (v) => UI.pctV(v, 0) },
      ],
      entryRows,
      { sortKey: "loads" },
    );

    // weekday x hour heatmap (Mon first)
    const H = Array.from({ length: 7 }, () => new Array(24).fill(0));
    for (const l of loads) {
      if (l.type !== "visit") continue;
      const d = new Date(l.t);
      H[(d.getDay() + 6) % 7][d.getHours()]++;
    }
    const wdN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    UI.heatmap(document.getElementById("en-heat"), {
      rows: wdN,
      cols: Array.from({ length: 24 }, (_, h) => String(h)),
      colStep: 3,
      values: H,
      tip: (i, j) => `<strong>${wdN[i]} ${String(j).padStart(2, "0")}:00–${String(j).padStart(2, "0")}:59</strong>${fmt(H[i][j])} visits`,
    });

    // duration histogram
    const B = [
      ["<5s", 0, 5],
      ["5–15s", 5, 15],
      ["15–30s", 15, 30],
      ["30–60s", 30, 60],
      ["1–3m", 60, 180],
      ["3–10m", 180, 600],
      ["10–30m", 600, 1800],
      ["30m–2h", 1800, 7200],
      [">2h", 7200, Infinity],
    ];
    const withDur = m.pvs.filter((p) => p.dur !== null);
    const dv = B.map(([, a, b]) => withDur.filter((p) => p.dur >= a && p.dur < b).length);
    UI.columnChart(document.getElementById("en-dur"), {
      labels: B.map((b) => b[0]),
      values: dv,
      colors: B.map((b, i) => (i === 0 ? UI.C.text3 : UI.C.accent)),
      height: 170,
      tip: (i) => `<strong>${B[i][0]}</strong>${fmt(dv[i])} pageviews (${pct(dv[i], withDur.length)})${i === 0 ? "<br>Counted as bounce, excluded from time on page" : ""}`,
    });
    const pp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => loads.filter((l) => (k === 10 ? l.pvs.length >= 10 : l.pvs.length === k)).length);
    UI.columnChart(document.getElementById("en-ppl"), {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
      values: pp,
      height: 150,
      tip: (i) => `<strong>${i === 9 ? "10+" : i + 1} page${i ? "s" : ""}</strong>${fmt(pp[i])} loads (${pct(pp[i], loads.length)})`,
    });

    // flows
    const flows = new Map();
    for (const l of loads)
      for (let i = 1; i < l.pvs.length; i++) {
        const a = group(l.pvs[i - 1].path),
          b = group(l.pvs[i].path);
        if (a === b) continue;
        const k = a + " → " + b;
        flows.set(k, (flows.get(k) || 0) + 1);
      }
    UI.bars(
      document.getElementById("en-flow"),
      U.sortedEntries(flows).slice(0, 25).map(([k, v]) => ({ label: k, value: v, tip: `<strong>${esc(k)}</strong>${fmt(v)} transitions` })),
    );

    const bad = m.pvs.filter((p) => /^\/game\/[^/]+/.test(p.path) && !m.gamePathOf(p.path));
    UI.bars(
      document.getElementById("en-404"),
      U.sortedEntries(U.countBy(bad, (p) => p.path)).slice(0, 25).map(([k, v]) => {
        const refs = U.sortedEntries(U.countBy(bad.filter((p) => p.path === k), (p) => p.ref || "direct")).slice(0, 3);
        return { label: k, value: v, color: UI.C.red, tip: `<strong>${esc(k)}</strong>${fmt(v)} views<br>from: ${refs.map(([r, n]) => `${esc(r)} (${n})`).join(", ")}` };
      }),
    );

    // insights
    const best = entryRows.filter((r) => r.loads >= 100).sort((a, b) => b.inter - a.inter)[0];
    const worst = entryRows.filter((r) => r.loads >= 100).sort((a, b) => a.inter - b.inter)[0];
    let pk = [0, 0, 0];
    H.forEach((row, i) => row.forEach((v, j) => v > pk[0] && (pk = [v, i, j])));
    const longTabs = withDur.filter((p) => p.dur >= 1800).length;
    const mob = loads.filter((l) => l.first.device === "mobile"),
      desk = loads.filter((l) => l.first.device === "desktop");
    UI.insights(document.getElementById("en-ins"), [
      best && {
        label: "Most engaging entry",
        value: `${esc(best.path)} · ${UI.pctV(best.inter, 0)}`,
        sub: `of its ${fmt(best.loads)} loads interact. Least engaging (≥100 loads): ${esc(worst.path)} at ${UI.pctV(worst.inter, 0)}.`,
      },
      {
        label: "Peak hour (your time)",
        value: `${wdN[pk[1]]} ${String(pk[2]).padStart(2, "0")}:00`,
        sub: `${fmt(pk[0])} visits in that slot across the export.`,
      },
      {
        label: "Open-tab behaviour",
        value: `${pct(longTabs, withDur.length)} of pageviews ≥ 30 min`,
        sub: `Dashboard left open as a tab. Means would be meaningless - all times here are medians (SA convention).`,
      },
      {
        label: "Mobile vs desktop",
        value: `${pct(mob.filter((l) => l.interactive).length, mob.length, 0)} vs ${pct(desk.filter((l) => l.interactive).length, desk.length, 0)} interact`,
        sub: `Median time on page: mobile ${UI.dur(SAD.timeOnPage(mob.flatMap((l) => l.pvs)))}, desktop ${UI.dur(SAD.timeOnPage(desk.flatMap((l) => l.pvs)))}.`,
      },
    ]);
  };
})();
