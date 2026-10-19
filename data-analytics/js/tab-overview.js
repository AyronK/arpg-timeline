(function () {
  const SAD = window.SAD;
  SAD.tabs = SAD.tabs || {};

  SAD.tabs.overview = function (m, el) {
    const U = SAD.util;
    const { fmt, pct, esc } = UI;
    const N = m.days.length;
    const idx = new Map(m.days.map((d, i) => [d, i]));
    const dVisits = new Array(N).fill(0),
      dPv = new Array(N).fill(0),
      dReload = new Array(N).fill(0);
    for (const l of m.loads) {
      const i = idx.get(U.dayKey(l.t));
      if (i === undefined) continue;
      if (l.type === "visit") dVisits[i]++;
      else if (l.type === "reload") dReload[i]++;
    }
    for (const p of m.pvs) {
      const i = idx.get(U.dayKey(p.t));
      if (i !== undefined) dPv[i]++;
    }
    const visits = dVisits.reduce((a, b) => a + b, 0);
    const interactive = m.loads.filter((l) => l.interactive).length;
    const singlePage = m.loads.filter((l) => l.pvs.length <= 1).length;
    const reloads = m.loads.filter((l) => l.type === "reload").length;
    const medVisits = U.median(dVisits.slice(1, -1).length ? dVisits.slice(1, -1) : dVisits);
    const sp = SAD.spikes(m);
    const markers = sp.episodes
      .filter((e) => e.peak.count >= 40)
      .map((e) => ({ i: e.peak.i, label: `${SAD.gameName(e.game)} ${e.peak.ratio.toFixed(0)}×` }));

    el.innerHTML = `
      <div class="kpi-row" id="ov-kpis"></div>
      <div class="insight-grid" id="ov-ins"></div>
      <div class="section">
        <div class="section-title">Daily traffic <span class="hint">- local days; dashed markers = game-page spikes (≥3× that game's daily median, peak ≥40 views). First and last day may be partial.</span></div>
        <div class="card"><canvas id="ov-daily" class="cv"></canvas><div id="ov-daily-legend"></div></div>
      </div>
      <div class="grid-2 section">
        <div class="card">
          <div class="card-title">Launch / spike episodes</div>
          <div id="ov-spikes" class="card-scroll"></div>
        </div>
        <div class="card">
          <div class="card-title">Pageviews by page type</div>
          <div class="bar-list" id="ov-types"></div>
          <div class="card-title" style="margin-top:20px">Top pages</div>
          <div class="bar-list" id="ov-pages"></div>
        </div>
      </div>`;

    UI.kpis(document.getElementById("ov-kpis"), [
      { label: "Pageviews", value: fmt(m.pvs.length), sub: `${fmt(m.pvs.length / N)} / day · embeds excluded`, tip: "<strong>Pageviews</strong>Every page shown, including in-app navigation, reloads and back/forward. Widget iframes embedded on other sites (/embed/*) are excluded." },
      { label: "Visits", value: fmt(visits), sub: `${fmt(visits / N)} / day`, tip: "<strong>Visits</strong>Unique pageviews - what Simple Analytics calls 'visitors'. A pageview is unique when it arrives directly or from another site. SA can't recognise people, so one person returning tomorrow counts again." },
      { label: "Page loads", value: fmt(m.loads.length), sub: `${(m.pvs.length / m.loads.length).toFixed(2)} pages / load`, tip: "<strong>Page loads</strong>One SA session_id = one browser document load. In-app navigation stays in the same load; a reload, new tab or new visit starts a new one. Includes visits, reloads and internal new-tab loads." },
      { label: "Interaction rate", value: pct(interactive, m.loads.length), sub: "loads with a non-automatic event", tip: "<strong>Interaction rate</strong>Page loads where the visitor triggered at least one custom event (click, filter, link…). Automatic events don't count: filter_customization, onboarding_shown and embed views." },
      { label: "Time on page", value: UI.dur(SAD.timeOnPage(m.pvs)), sub: "median, ≥5s only (SA rule)", tip: "<strong>Time on page</strong>Median duration per pageview, following SA: pageviews under 5s are excluded (treated as bounces). Median, because tabs left open for hours would wreck an average. ~40% of pageviews have no duration recorded." },
      { label: "Bounce rate", value: UI.pctV(SAD.bounceRate(m.pvs)), sub: "pageviews < 5s", tip: "<strong>Bounce rate</strong>Share of pageviews (with a recorded duration) that lasted under 5 seconds - SA's bounce definition. It's per pageview, not per visit." },
    ]);

    // median per weekday so launch days don't dominate
    const wd = [[], [], [], [], [], [], []];
    m.days.forEach((d, i) => {
      if (i === 0 || i === N - 1) return;
      wd[new Date(d + "T12:00:00").getDay()].push(dVisits[i]);
    });
    const wdAvg = wd.map((a) => U.median(a));
    const wdNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const valid = wdAvg.map((v, k) => [k, v]).filter(([, v]) => v !== null);
    const best = valid.sort((a, b) => b[1] - a[1])[0],
      worst = valid[valid.length - 1];
    const topEp = sp.episodes.slice().sort((a, b) => b.peak.ratio - a.peak.ratio)[0];
    const peakDay = dVisits.indexOf(Math.max(...dVisits));
    const peakEp = sp.episodes.find((e) => e.startI <= peakDay && e.endI >= peakDay);

    UI.insights(document.getElementById("ov-ins"), [
      {
        label: "Busiest day",
        value: `${U.dayLabel(m.days[peakDay])}: ${fmt(dVisits[peakDay])} visits`,
        sub: `${(dVisits[peakDay] / medVisits).toFixed(1)}× the median day (${fmt(medVisits)}).${peakEp ? ` Coincides with a ${esc(SAD.gameName(peakEp.game))} game-page spike.` : ""}`,
      },
      topEp && {
        label: "Biggest game spike",
        value: `${esc(SAD.gameName(topEp.game))} ${topEp.peak.ratio.toFixed(0)}×`,
        sub: `${fmt(topEp.peak.count)} game-page views on ${U.dayLabel(topEp.peak.day)} vs its normal day. ${fmt(topEp.total)} views across the ${topEp.endI - topEp.startI + 1}-day episode.`,
      },
      best && {
        label: "Weekly rhythm",
        value: `${wdNames[best[0]]} peaks`,
        sub: `Median ${fmt(best[1])} visits vs ${fmt(worst[1])} on ${wdNames[worst[0]]} (${((best[1] / worst[1] - 1) * 100).toFixed(0)}% higher). Full days only.`,
      },
      {
        label: "Return habit",
        value: `${pct(reloads, m.loads.length, 0)} of loads are reloads`,
        sub: `Non-unique first pageview with no internal referrer - people refreshing an open tab or coming back via history. ${pct(singlePage, m.loads.length, 0)} of loads view a single page.`,
      },
    ]);

    const series = [
      { name: "Pageviews", color: UI.SERIES[0], values: dPv, area: true },
      { name: "Visits", color: UI.SERIES[1], values: dVisits },
      { name: "Reload loads", color: UI.SERIES[2], values: dReload },
    ];
    UI.lineChart(document.getElementById("ov-daily"), {
      labels: m.days,
      xFmt: U.dayLabel,
      tipTitle: (i) => new Date(m.days[i] + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
      series,
      markers,
      height: 280,
      tipExtra: (i) => {
        const eps = sp.episodes.filter((e) => e.startI <= i && e.endI >= i);
        return eps.length
          ? "<br>" + eps.map((e) => `⚑ ${esc(SAD.gameName(e.game))}: ${fmt(sp.daily.get(e.game)[i])} game-page views`).join("<br>")
          : "";
      },
    });
    document.getElementById("ov-daily-legend").innerHTML = UI.legend(series);

    const medVisitsAll = medVisits || 1;
    UI.table(
      document.getElementById("ov-spikes"),
      [
        { key: "game", label: "Game", fmt: (v) => esc(SAD.gameName(v)) },
        { key: "peakI", label: "Peak day", fmt: (v, r) => U.dayLabel(m.days[v]) + (r.len > 1 ? ` <span class="muted">(${r.len}d)</span>` : "") },
        { key: "peak", label: "Peak views", num: true, fmt },
        { key: "ratio", label: "× median", num: true, fmt: (v) => v.toFixed(1) + "×" },
        { key: "siteLift", label: "Site visits", num: true, fmt: (v) => v.toFixed(1) + "×", tip: "Site visits on the peak day vs the median day" },
      ],
      sp.episodes.map((e) => ({
        game: e.game,
        peakI: e.peak.i,
        len: e.endI - e.startI + 1,
        peak: e.peak.count,
        ratio: e.peak.ratio,
        siteLift: dVisits[e.peak.i] / medVisitsAll,
      })),
      { sortKey: "peakI", dir: 1 },
    );

    const types = U.sortedEntries(U.countBy(m.pvs, (p) => SAD.pageType(p.path)));
    UI.bars(
      document.getElementById("ov-types"),
      types.map(([k, v]) => ({ label: SAD.PAGE_TYPE_NAMES[k] || k, value: v, text: pct(v, m.pvs.length) })),
    );
    const pages = U.sortedEntries(U.countBy(m.pvs, (p) => p.path)).slice(0, 12);
    UI.bars(
      document.getElementById("ov-pages"),
      pages.map(([k, v]) => ({ label: k, value: v, text: fmt(v), tip: `<strong>${esc(k)}</strong>${fmt(v)} pageviews (${pct(v, m.pvs.length)})` })),
    );
  };
})();
