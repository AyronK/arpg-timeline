(function () {
  const SAD = window.SAD;
  SAD.tabs = SAD.tabs || {};

  const SEARCH = /^(google|bing\.com|duckduckgo\.com|yandex|ya\.ru|yahoo\.com|search\.brave\.com|ecosia\.org|qwant\.com|coccoc\.com|kagi\.com|android-app|baidu|naver)/;
  const AI = /(chatgpt|gemini|perplexity|claude|copilot)/;
  const SOCIAL = /(reddit|youtube|twitch|facebook|discord|twitter|x\.com|vk\.|steamcommunity|d2jsp|t\.co)/;

  SAD.tabs.audience = function (m, el) {
    const U = SAD.util;
    const { fmt, pct, esc } = UI;
    const visits = m.loads.filter((l) => l.type === "visit");
    const V = visits.length;

    el.innerHTML = `
      <div class="insight-grid" id="au-ins"></div>
      <div class="grid-2 section">
        <div class="card card-scroll"><div class="card-title">Visits by referrer</div><div class="bar-list" id="au-ref"></div></div>
        <div class="card">
          <div class="card-title">Visits by channel</div><div id="au-chan"></div>
          <div class="card-title" style="margin-top:22px">UTM sources</div><div class="bar-list" id="au-utm"></div>
          <div class="card-title" style="margin-top:22px">Embeds on other sites <span class="muted" style="text-transform:none;letter-spacing:0">- iframe loads, excluded from visits</span></div><div id="au-embed"></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Countries <span class="hint">- by visits; engagement columns use all page loads from that country</span></div>
        <div class="card"><div id="au-cty" class="table-wrap card-scroll tall"></div></div>
      </div>
      <div class="engage-row section">
        <div class="donut-card"><div class="card-title" style="align-self:flex-start">Device</div><canvas id="au-dev"></canvas><div class="donut-legend" id="au-dev-l"></div></div>
        <div class="card card-scroll"><div class="card-title">Browser language</div><div class="bar-list" id="au-lang"></div></div>
        <div class="card card-scroll"><div class="card-title">Operating system</div><div class="bar-list" id="au-os"></div>
          <div class="card-title" style="margin-top:20px">Browser</div><div class="bar-list" id="au-br"></div></div>
      </div>
      <div class="section">
        <div class="card"><div class="card-title">Viewport width (px) - all page loads</div><canvas id="au-vw" class="cv"></canvas></div>
      </div>`;

    const refName = (r) => r || "Direct / none";
    const refs = U.sortedEntries(U.countBy(visits, (l) => refName(l.first.ref)));
    UI.bars(
      document.getElementById("au-ref"),
      refs.slice(0, 25).map(([k, v]) => ({ label: k, value: v, text: pct(v, V), tip: `<strong>${esc(k)}</strong>${fmt(v)} visits` })),
    );

    const channel = (l) => {
      const r = l.first.ref,
        u = l.first.utm;
      if (u && AI.test(u)) return "AI assistants";
      if (u) return "Tagged (UTM)";
      if (!r) return "Direct / none";
      if (AI.test(r)) return "AI assistants";
      if (SEARCH.test(r)) return "Search";
      if (SOCIAL.test(r)) return "Social & communities";
      return "Other sites";
    };
    const chans = U.sortedEntries(U.countBy(visits, channel));
    UI.stack(
      document.getElementById("au-chan"),
      chans.map(([k, v], i) => ({ label: k, value: v, color: UI.SERIES[i % UI.SERIES.length] })),
    );
    UI.bars(
      document.getElementById("au-utm"),
      U.sortedEntries(U.countBy(m.loads.filter((l) => l.first.utm), (l) => l.first.utm)).map(([k, v]) => ({ label: k, value: v, text: fmt(v) })),
    );

    // embeds: host from referrer of embed pageviews or embed_view metadata
    const emb = new Map();
    for (const l of m.embedLoads) {
      const host = (l.evs.find((e) => e.mHost) || {}).mHost || l.first.ref || "unknown";
      const widget = l.entry.replace(/^\/embed\//, "");
      const k = host + "|" + widget;
      emb.set(k, (emb.get(k) || 0) + 1);
    }
    const embEl = document.getElementById("au-embed");
    const embRows = U.sortedEntries(emb);
    embEl.innerHTML = embRows.length
      ? `<table><thead><tr><th>Host</th><th>Widget</th><th class="num">Loads</th></tr></thead><tbody>${embRows
          .map(([k, v]) => {
            const [h, w] = k.split("|");
            return `<tr><td>${esc(h)}</td><td class="mono">${esc(w)}</td><td class="num mono">${fmt(v)}</td></tr>`;
          })
          .join("")}</tbody></table>`
      : `<div class="empty">No embed loads</div>`;

    // countries
    const byC = new Map();
    for (const l of m.loads) {
      const c = l.first.country || "??";
      let a = byC.get(c);
      if (!a) byC.set(c, (a = []));
      a.push(l);
    }
    const crow = [...byC.entries()]
      .map(([c, ls]) => {
        const v = ls.filter((l) => l.type === "visit").length;
        const langs = U.sortedEntries(U.countBy(ls, (l) => l.first.lang || undefined));
        const en = ls.filter((l) => l.first.lang === "en").length;
        return {
          cc: c,
          name: SAD.countryName(c),
          visits: v,
          share: v / V,
          mobile: ls.filter((l) => l.first.device === "mobile").length / ls.length,
          inter: ls.filter((l) => l.interactive).length / ls.length,
          time: SAD.timeOnPage(ls.flatMap((l) => l.pvs)),
          reload: ls.filter((l) => l.type === "reload").length / ls.length,
          lang: langs[0] ? langs[0][0] : "",
          en: en / ls.length,
        };
      })
      .filter((r) => r.visits >= 10);
    const maxShare = Math.max(...crow.map((r) => r.share), 0.01);
    UI.table(
      document.getElementById("au-cty"),
      [
        { key: "name", label: "Country" },
        { key: "visits", label: "Visits", num: true, fmt },
        { key: "share", label: "Share", num: true, fmt: (v) => `${UI.inlineBar(v, maxShare)}<span>${UI.pctV(v)}</span></span>` },
        { key: "mobile", label: "Mobile", num: true, fmt: (v) => UI.pctV(v, 0) },
        { key: "inter", label: "Interaction", num: true, fmt: (v) => UI.pctV(v, 0) },
        { key: "reload", label: "Reloads", num: true, fmt: (v) => UI.pctV(v, 0), tip: "Share of page loads that are reloads - a habit signal" },
        { key: "time", label: "Time on page", num: true, fmt: UI.dur },
        { key: "lang", label: "Top language", fmt: (v) => esc(SAD.langName(v)) },
        { key: "en", label: "English UI", num: true, fmt: (v) => UI.pctV(v, 0), tip: "Share of loads whose browser language is English" },
      ],
      crow,
      { sortKey: "visits" },
    );

    // device
    const dev = U.sortedEntries(U.countBy(m.loads, (l) => l.first.device || "unknown"));
    UI.donut(
      document.getElementById("au-dev"),
      document.getElementById("au-dev-l"),
      dev.map(([k, v], i) => ({ label: k, value: v, color: UI.SERIES[i % UI.SERIES.length] })),
      [pct(dev[0] ? dev[0][1] : 0, m.loads.length, 0), dev[0] ? dev[0][0] : ""],
    );
    const L = m.loads.length;
    const listBars = (id, fn, nameFn = (k) => k, n = 15) =>
      UI.bars(
        document.getElementById(id),
        U.sortedEntries(U.countBy(m.loads, fn))
          .slice(0, n)
          .map(([k, v]) => ({ label: nameFn(k), value: v, text: pct(v, L) })),
      );
    listBars("au-lang", (l) => l.first.lang || "unknown", (k) => (k === "unknown" ? k : `${SAD.langName(k)} (${k})`), 20);
    listBars("au-os", (l) => l.first.os || "unknown");
    listBars("au-br", (l) => l.first.browser || "unknown", undefined, 10);

    const VB = [0, 400, 600, 800, 1024, 1280, 1440, 1600, 1920, 2200, 2560, 3000, Infinity];
    const vbl = VB.slice(0, -1).map((a, i) => (VB[i + 1] === Infinity ? `${a}+` : `${a}–${VB[i + 1]}`));
    const vv = VB.slice(0, -1).map((a, i) => m.loads.filter((l) => l.first.vw >= a && l.first.vw < VB[i + 1] && l.first.vw > 0).length);
    UI.columnChart(document.getElementById("au-vw"), {
      labels: vbl,
      values: vv,
      height: 180,
      tip: (i) => `<strong>${vbl[i]} px</strong>${fmt(vv[i])} loads (${pct(vv[i], L)})`,
    });

    // insights
    const chanMap = new Map(chans);
    const search = chanMap.get("Search") || 0;
    const google = refs.find(([k]) => k === "google");
    const nonEn = m.loads.filter((l) => l.first.lang && l.first.lang !== "en").length;
    const topC = crow.slice().sort((a, b) => b.visits - a.visits);
    const habit = crow.filter((r) => r.visits >= 200).sort((a, b) => b.reload - a.reload)[0];
    UI.insights(document.getElementById("au-ins"), [
      {
        label: "Acquisition",
        value: `${pct(chanMap.get("Direct / none") || 0, V, 0)} direct · ${pct(search, V, 0)} search`,
        sub: `Google alone brings ${pct(google ? google[1] : 0, V)} of visits. Social & communities: ${pct(chanMap.get("Social & communities") || 0, V)}.`,
      },
      {
        label: "Top countries",
        value: topC
          .slice(0, 3)
          .map((r) => esc(r.cc))
          .join(" · "),
        sub: topC
          .slice(0, 6)
          .map((r) => `${esc(r.name)} ${UI.pctV(r.share, 0)}`)
          .join(", "),
      },
      {
        label: "Non-English browsers",
        value: `${pct(nonEn, L, 0)} of loads`,
        sub: `Localization candidates: ${U.sortedEntries(U.countBy(m.loads.filter((l) => l.first.lang && l.first.lang !== "en"), (l) => l.first.lang))
          .slice(0, 4)
          .map(([k, v]) => `${esc(SAD.langName(k))} ${pct(v, L, 0)}`)
          .join(", ")}.`,
      },
      habit && {
        label: "Most habitual country",
        value: `${esc(habit.name)} · ${UI.pctV(habit.reload, 0)} reloads`,
        sub: `Highest share of reload loads among countries with ≥200 visits - people keeping the tab open.`,
      },
    ]);
  };
})();
