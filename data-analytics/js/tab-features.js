(function () {
  const SAD = window.SAD;
  SAD.tabs = SAD.tabs || {};

  // Collapse dynamic event names into a readable sub-event key
  function subKey(e) {
    if (e.game) return e.action;
    let mm;
    if ((mm = e.dp.match(/^Calendar_([A-Za-z]+)_/))) return `Calendar_${mm[1]}_…`;
    if ((mm = e.dp.match(/^Share_([A-Za-z]+)_/))) return `Share_${mm[1]}_…`;
    if (/_patch_notes_click$/.test(e.dp)) return "…_patch_notes_click";
    if (/_season_link_click$/.test(e.dp)) return "…_season_link_click";
    if (e.dp.startsWith("outbound_")) return e.out ? e.out.type : "outbound";
    return e.dp;
  }

  SAD.tabs.features = function (m, el) {
    const U = SAD.util;
    const { fmt, pct, esc } = UI;
    const byFeat = new Map();
    for (const e of m.evs) {
      if (!e.feature) continue;
      let a = byFeat.get(e.feature);
      if (!a) byFeat.set(e.feature, (a = []));
      a.push(e);
    }
    const loadsDesk = m.loads.filter((l) => l.first.device === "desktop");
    const loadsMob = m.loads.filter((l) => l.first.device === "mobile");
    const defs = [...SAD.FEATURES, { id: "unparsed", label: "Unparsed events" }];

    const rows = defs
      .filter((f) => byFeat.has(f.id))
      .map((f) => {
        const evs = byFeat.get(f.id);
        const types = U.countBy(evs, (e) => SAD.pageType(e.path));
        const elig = new Set([...types].filter(([t, v]) => t !== "embed" && v / evs.length >= 0.1).map(([t]) => t));
        const isElig = (l) => [...elig].some((t) => l.pageTypes.has(t));
        const rate = (ls) => {
          const d = ls.filter(isElig);
          const u = d.filter((l) => l.features.has(f.id)).length;
          return { d: d.length, u, r: d.length ? u / d.length : null };
        };
        const all = rate(m.loads),
          dk = rate(loadsDesk),
          mb = rate(loadsMob);
        return {
          id: f.id,
          label: f.label,
          meta: f.meta,
          where: [...elig].map((t) => SAD.PAGE_TYPE_NAMES[t] || t).join(", "),
          eligible: all.d,
          used: all.u,
          rate: all.r,
          desk: dk.r,
          mob: mb.r,
          events: evs.length,
          perLoad: all.u ? evs.length / all.u : null,
          evs,
        };
      });

    el.innerHTML = `
      <div class="insight-grid" id="ft-ins"></div>
      <div class="section">
        <div class="section-title">Feature usage <span class="hint">- usage rate = page loads that used the feature ÷ page loads that showed a page type where the feature fires (types with ≥10% of its events). Click a row for details.</span></div>
        <div class="card"><div id="ft-table" class="table-wrap"></div></div>
      </div>
      <div class="section" id="ft-detail"></div>`;

    const max = Math.max(...rows.filter((r) => !r.meta).map((r) => r.rate || 0), 0.0001);
    let selected = null;
    const drawTable = () =>
      UI.table(
        document.getElementById("ft-table"),
        [
          { key: "label", label: "Feature", fmt: (v, r) => esc(v) + (r.meta ? ' <span class="muted">(co-fires with others)</span>' : "") },
          { key: "where", label: "Available on", fmt: (v) => `<span class="muted">${esc(v)}</span>` },
          { key: "eligible", label: "Eligible loads", num: true, fmt },
          { key: "used", label: "Loads using", num: true, fmt },
          { key: "rate", label: "Usage rate", num: true, fmt: (v) => `${UI.inlineBar(v || 0, max)}<span>${UI.pctV(v, 2)}</span></span>` },
          { key: "desk", label: "Desktop", num: true, fmt: (v) => UI.pctV(v, 2) },
          { key: "mob", label: "Mobile", num: true, fmt: (v) => UI.pctV(v, 2) },
          { key: "events", label: "Events", num: true, fmt },
          { key: "perLoad", label: "Events / user load", num: true, fmt: (v) => (v ? v.toFixed(1) : "–") },
        ],
        rows,
        {
          sortKey: "rate",
          onRow: (r) => {
            selected = r;
            detail(r);
          },
          selected: (r) => r === selected,
        },
      );
    drawTable();

    function detail(r) {
      const box = document.getElementById("ft-detail");
      box.innerHTML = `
        <div class="section-title">${esc(r.label)} <span class="hint">- ${fmt(r.events)} events in ${fmt(r.used)} loads</span></div>
        <div class="grid-2">
          <div class="card card-scroll"><div class="card-title">Events</div><div class="bar-list" id="ft-sub"></div></div>
          <div class="card card-scroll"><div class="card-title">By game</div><div class="bar-list" id="ft-game"></div></div>
        </div>
        <div class="card" style="margin-top:16px"><div class="card-title">Loads using it per day</div><canvas id="ft-daily" class="cv"></canvas></div>`;
      const sub = U.sortedEntries(U.countBy(r.evs, subKey)).slice(0, 25);
      UI.bars(document.getElementById("ft-sub"), sub.map(([k, v]) => ({ label: k, value: v, tip: `<strong>${esc(k)}</strong>${fmt(v)} events` })));
      const games = U.sortedEntries(U.countBy(r.evs, (e) => (e.out ? e.out.game : e.game) || "(not game-specific)")).slice(0, 25);
      UI.bars(
        document.getElementById("ft-game"),
        games.map(([k, v]) => ({ label: k.startsWith("(") ? k : SAD.gameName(k), value: v, color: k.startsWith("(") ? UI.C.text3 : UI.C.accent })),
      );
      const idx = new Map(m.days.map((d, i) => [d, i]));
      const vals = new Array(m.days.length).fill(0);
      const seen = new Set();
      for (const e of r.evs) {
        const k = e.load.sid + U.dayKey(e.t);
        if (seen.has(k)) continue;
        seen.add(k);
        const i = idx.get(U.dayKey(e.t));
        if (i !== undefined) vals[i]++;
      }
      UI.columnChart(document.getElementById("ft-daily"), {
        labels: m.days,
        values: vals,
        xFmt: U.dayLabel,
        height: 160,
        tip: (i) => `<strong>${U.dayLabel(m.days[i])}</strong>${fmt(vals[i])} loads`,
      });
      drawTable();
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    const real = rows.filter((r) => !r.meta && r.id !== "unparsed" && r.eligible >= 200);
    const byRate = real.slice().sort((a, b) => b.rate - a.rate);
    const low = byRate.filter((r) => r.rate < 0.005);
    const mobGap = real
      .filter((r) => r.desk && r.mob !== null && r.used >= 30)
      .map((r) => ({ r, ratio: (r.mob || 0) / r.desk }))
      .sort((a, b) => a.ratio - b.ratio)[0];
    const out = rows.find((r) => r.id === "outbound");
    const unp = rows.find((r) => r.id === "unparsed");
    UI.insights(document.getElementById("ft-ins"), [
      byRate[0] && {
        label: "Most used",
        value: `${esc(byRate[0].label)} · ${UI.pctV(byRate[0].rate)}`,
        sub: `Then ${byRate
          .slice(1, 3)
          .map((r) => `${esc(r.label)} (${UI.pctV(r.rate)})`)
          .join(", ")}.`,
      },
      low.length && {
        label: "Rarely used (<0.5%)",
        value: `${low.length} features`,
        sub: low.map((r) => `${esc(r.label)} ${UI.pctV(r.rate, 2)}`).join(" · "),
      },
      mobGap && {
        label: "Biggest mobile gap",
        value: `${esc(mobGap.r.label)}`,
        sub: `Used in ${UI.pctV(mobGap.r.mob, 2)} of mobile loads vs ${UI.pctV(mobGap.r.desk, 2)} on desktop (${(mobGap.ratio * 100).toFixed(0)}% of desktop rate).`,
      },
      out && {
        label: "Leaves to another site",
        value: `${UI.pctV(out.rate)} of loads`,
        sub: `${fmt(out.events)} outbound clicks${unp ? ` · ${fmt(unp.events)} events didn't match any feature rule (see "Unparsed")` : ""}.`,
      },
    ]);
  };
})();
