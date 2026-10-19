(function () {
  const SAD = window.SAD;
  SAD.tabs = SAD.tabs || {};

  const TYPES = ["Steam", "Official site", "Season link", "Patch notes", "Season details", "Builds", "Guides", "Video", "Twitch", "Other"];
  const TYPE_COLOR = Object.fromEntries(TYPES.map((t, i) => [t, UI.SERIES[i % UI.SERIES.length]]));

  SAD.tabs.games = function (m, el) {
    const U = SAD.util;
    const { fmt, pct, esc } = UI;

    const G = new Map();
    const get = (s) => {
      let g = G.get(s);
      if (!g)
        G.set(
          s,
          (g = { slug: s, pvs: [], subPvs: [], pageLoads: new Set(), landings: [], logo: 0, onsite: [], out: [], outOnPageLoads: new Set() }),
        );
      return g;
    };
    for (const p of m.pvs) {
      const s = m.gamePathOf(p.path);
      if (!s) continue;
      const g = get(s);
      if (SAD.pageType(p.path) === "game") {
        g.pvs.push(p);
        g.pageLoads.add(p.load);
      } else g.subPvs.push(p);
    }
    for (const l of m.loads) {
      const s = m.gamePathOf(l.entry);
      if (s && l.type === "visit") get(s).landings.push(l);
    }
    const unattributed = [];
    for (const e of m.evs) {
      if (e.out) {
        if (!e.out.game) {
          unattributed.push(e);
          continue;
        }
        const g = get(e.out.game);
        g.out.push(e);
        if (m.gamePathOf(e.path) === e.out.game) g.outOnPageLoads.add(e.load);
      } else if (e.game && !SAD.isAuto(e.dp)) {
        const g = get(e.game);
        if (e.action === "logo_click") g.logo++;
        else g.onsite.push(e);
      }
    }

    const rows = [...G.values()]
      .filter((g) => m.slugSet.has(g.slug))
      .map((g) => {
        const t = U.countBy(g.out, (e) => e.out.type);
        return {
          slug: g.slug,
          name: SAD.gameName(g.slug),
          views: g.pvs.length,
          subViews: g.subPvs.length,
          landings: g.landings.length,
          logo: g.logo,
          onsite: g.onsite.length,
          out: g.out.length,
          ctr: g.pageLoads.size >= 20 ? g.outOnPageLoads.size / g.pageLoads.size : null,
          time: SAD.timeOnPage(g.pvs),
          steam: t.get("Steam") || 0,
          official: t.get("Official site") || 0,
          season: (t.get("Season link") || 0) + (t.get("Patch notes") || 0) + (t.get("Season details") || 0),
          builds: (t.get("Builds") || 0) + (t.get("Guides") || 0),
          g,
        };
      });

    el.innerHTML = `
      <div class="insight-grid" id="gm-ins"></div>
      <div class="section">
        <div class="section-title">Games <span class="hint">- outbound clicks are attributed by UTM content slug, then page path, then a co-fired game event (±2s). Outbound CTR = game-page loads that clicked out for that game ÷ game-page loads (≥20 loads). Click a row for details.</span></div>
        <div class="card"><div id="gm-table" class="table-wrap card-scroll tall"></div></div>
      </div>
      <div class="section" id="gm-detail"></div>
      <div class="grid-2 section">
        <div class="card card-scroll"><div class="card-title">Outbound by destination</div><div class="bar-list" id="gm-hosts"></div></div>
        <div class="card card-scroll"><div class="card-title">Outbound by link type</div><div class="bar-list" id="gm-types"></div>
          <div class="card-title" style="margin-top:20px">Unattributed outbound (no game)</div><div class="bar-list" id="gm-unattr"></div></div>
      </div>`;

    let selected = null;
    const maxCtr = Math.max(...rows.map((r) => r.ctr || 0), 0.0001);
    const drawTable = () =>
      UI.table(
        document.getElementById("gm-table"),
        [
          { key: "name", label: "Game" },
          { key: "views", label: "Page views", num: true, fmt },
          { key: "landings", label: "Landings", num: true, fmt, tip: "Visits whose entry page was this game page (search, links, bookmarks)" },
          { key: "logo", label: "Logo clicks", num: true, fmt, tip: "Clicks on the game's logo (dashboard → game page)" },
          { key: "onsite", label: "On-site actions", num: true, fmt, tip: "Other game-specific clicks: tabs, overview, Steam dialog, season details…" },
          { key: "out", label: "Outbound", num: true, fmt },
          { key: "ctr", label: "Outbound CTR", num: true, fmt: (v) => (v === null ? "–" : `${UI.inlineBar(v, maxCtr, UI.C.green)}<span>${UI.pctV(v)}</span></span>`) },
          { key: "time", label: "Time on page", num: true, fmt: UI.dur },
          { key: "steam", label: "Steam", num: true, fmt },
          { key: "official", label: "Official", num: true, fmt },
          { key: "season", label: "Season/patch", num: true, fmt },
          { key: "builds", label: "Builds/guides", num: true, fmt },
        ],
        rows,
        {
          sortKey: "views",
          onRow: (r) => {
            selected = r;
            detail(r);
          },
          selected: (r) => r === selected,
        },
      );
    drawTable();

    function detail(r) {
      const g = r.g;
      const box = document.getElementById("gm-detail");
      box.innerHTML = `
        <div class="section-title">${esc(r.name)} <span class="hint">- /game/${esc(r.slug)} · ${fmt(r.views)} page views${r.subViews ? ` + ${fmt(r.subViews)} on sub-pages` : ""}</span></div>
        <div class="card"><div class="card-title">Daily game-page views</div><canvas id="gm-daily" class="cv"></canvas></div>
        <div class="grid-3" style="margin-top:16px">
          <div class="card card-scroll"><div class="card-title">Outbound by type</div><div class="bar-list" id="gm-d-type"></div>
            <div class="card-title" style="margin-top:20px">Top outbound URLs</div><div class="bar-list" id="gm-d-url"></div></div>
          <div class="card card-scroll"><div class="card-title">On-site actions</div><div class="bar-list" id="gm-d-act"></div></div>
          <div class="card card-scroll"><div class="card-title">How landings arrived</div><div class="bar-list" id="gm-d-ref"></div>
            <div class="card-title" style="margin-top:20px">Viewer countries</div><div class="bar-list" id="gm-d-cty"></div></div>
        </div>`;
      const idx = new Map(m.days.map((d, i) => [d, i]));
      const vals = new Array(m.days.length).fill(0);
      for (const p of g.pvs) {
        const i = idx.get(U.dayKey(p.t));
        if (i !== undefined) vals[i]++;
      }
      UI.columnChart(document.getElementById("gm-daily"), {
        labels: m.days,
        values: vals,
        xFmt: U.dayLabel,
        height: 170,
        tip: (i) => `<strong>${U.dayLabel(m.days[i])}</strong>${fmt(vals[i])} views`,
      });
      UI.bars(
        document.getElementById("gm-d-type"),
        U.sortedEntries(U.countBy(g.out, (e) => e.out.type)).map(([k, v]) => ({ label: k, value: v, color: TYPE_COLOR[k] })),
      );
      UI.bars(
        document.getElementById("gm-d-url"),
        U.sortedEntries(U.countBy(g.out, (e) => e.out.clean.replace(/^https?:\/\/(www\.)?/, "")))
          .slice(0, 10)
          .map(([k, v]) => ({ label: k, value: v, tip: `<strong>${esc(k)}</strong>${fmt(v)} clicks` })),
      );
      UI.bars(
        document.getElementById("gm-d-act"),
        U.sortedEntries(U.countBy(g.onsite, (e) => e.action))
          .concat(r.logo ? [["logo_click", r.logo]] : [])
          .sort((a, b) => b[1] - a[1])
          .map(([k, v]) => ({ label: k, value: v })),
      );
      UI.bars(
        document.getElementById("gm-d-ref"),
        U.sortedEntries(U.countBy(g.landings, (l) => l.first.ref || "Direct / none")).slice(0, 10).map(([k, v]) => ({ label: k, value: v, text: pct(v, g.landings.length, 0) })),
      );
      UI.bars(
        document.getElementById("gm-d-cty"),
        U.sortedEntries(U.countBy(g.pvs, (p) => p.country || "??")).slice(0, 10).map(([k, v]) => ({ label: SAD.countryName(k), value: v, text: pct(v, g.pvs.length, 0) })),
      );
      drawTable();
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    const allOut = m.evs.filter((e) => e.out);
    UI.bars(
      document.getElementById("gm-hosts"),
      U.sortedEntries(U.countBy(allOut, (e) => e.out.host)).slice(0, 25).map(([k, v]) => ({ label: k, value: v, text: pct(v, allOut.length) })),
    );
    UI.bars(
      document.getElementById("gm-types"),
      U.sortedEntries(U.countBy(allOut, (e) => e.out.type)).map(([k, v]) => ({ label: k, value: v, color: TYPE_COLOR[k], text: pct(v, allOut.length) })),
    );
    UI.bars(
      document.getElementById("gm-unattr"),
      U.sortedEntries(U.countBy(unattributed, (e) => e.out.host + (e.out.term ? " · " + e.out.term : ""))).slice(0, 10).map(([k, v]) => ({ label: k, value: v, color: UI.C.text3 })),
    );

    const topOut = rows.slice().sort((a, b) => b.out - a.out)[0];
    const topCtr = rows.filter((r) => r.ctr !== null && r.g.pageLoads.size >= 50).sort((a, b) => b.ctr - a.ctr)[0];
    const topLand = rows.slice().sort((a, b) => b.landings - a.landings)[0];
    const logoVsLand = rows
      .filter((r) => r.views >= 100)
      .map((r) => ({ r, share: r.landings / r.views }))
      .sort((a, b) => b.share - a.share)[0];
    UI.insights(document.getElementById("gm-ins"), [
      topOut && {
        label: "Most outbound traffic sent",
        value: `${esc(topOut.name)} · ${fmt(topOut.out)} clicks`,
        sub: `${pct(topOut.out, allOut.length)} of all outbound clicks. Steam ${fmt(topOut.steam)}, official ${fmt(topOut.official)}, season/patch ${fmt(topOut.season)}.`,
      },
      topCtr && {
        label: "Highest outbound CTR",
        value: `${esc(topCtr.name)} · ${UI.pctV(topCtr.ctr)}`,
        sub: `Of ${fmt(topCtr.g.pageLoads.size)} game-page loads (games with ≥50 loads).`,
      },
      topLand && {
        label: "Top landing game page",
        value: `${esc(topLand.name)} · ${fmt(topLand.landings)} visits`,
        sub: `Visits that entered the site directly on this game page - mostly search. ${logoVsLand ? `${esc(logoVsLand.r.name)} gets the largest share of its views from landings (${pct(logoVsLand.r.landings, logoVsLand.r.views, 0)}).` : ""}`,
      },
      {
        label: "Unattributed outbound",
        value: `${pct(unattributed.length, allOut.length)} of clicks`,
        sub: `${fmt(unattributed.length)} outbound clicks couldn't be tied to a game (site links, support, season links on the dashboard without a co-fired event).`,
      },
    ]);
  };
})();
