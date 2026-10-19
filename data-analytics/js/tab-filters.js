(function () {
  const SAD = window.SAD;
  SAD.tabs = SAD.tabs || {};

  SAD.tabs.filters = function (m, el) {
    const U = SAD.util;
    const { fmt, pct, esc } = UI;
    const box = document.getElementById("fo-new");
    const loadsWith = (dp) => new Set(m.evs.filter((e) => e.dp === dp).map((e) => e.load));
    const shown = loadsWith("onboarding_shown");
    const S = shown.size;
    const steps = [
      ["onboarding_dismissed", "Dismissed"],
      ["onboarding_featured", "Kept featured"],
      ["onboarding_all_games", "Chose all games"],
      ["onboarding_customize_opened", "Opened customize"],
      ["onboarding_customize_applied", "Applied customization"],
    ].map(([dp, label]) => {
      const ls = loadsWith(dp);
      return { dp, label, n: [...ls].filter((l) => shown.has(l)).length, total: ls.size };
    });
    const answered = new Set(
      m.evs.filter((e) => e.dp.startsWith("onboarding_") && e.dp !== "onboarding_shown" && shown.has(e.load)).map((e) => e.load),
    ).size;
    const after = (ls) => [...ls].filter((l) => l.evs.some((e) => !SAD.isAuto(e.dp) && !e.dp.startsWith("onboarding_"))).length;
    const dismissed = new Set([...loadsWith("onboarding_dismissed")].filter((l) => shown.has(l)));
    const engagedAfter = after(shown);

    const hm = m.evs.filter((e) => e.dp === "hidden_marker_opened");
    const filtersOpened = loadsWith("filters_opened").size;

    box.innerHTML = `
      <div class="insight-grid" id="fo-ins"></div>
      <div class="grid-2 section">
        <div class="card">
          <div class="card-title">Onboarding outcome <span class="muted" style="text-transform:none;letter-spacing:0">- % of ${fmt(S)} loads that showed it</span></div>
          <div class="bar-list" id="fo-funnel"></div>
          <div class="card-title" style="margin-top:22px">Shown by device</div>
          <div class="bar-list" id="fo-dev"></div>
        </div>
        <div class="card">
          <div class="card-title">Hidden-game markers opened, by entry point</div>
          <div class="bar-list" id="fo-hm-entry"></div>
          <div class="card-title" style="margin-top:22px">…by game</div>
          <div class="bar-list" id="fo-hm-game"></div>
          <div class="card-title" style="margin-top:22px">Hidden games count when opened</div>
          <canvas id="fo-hm-count" class="cv"></canvas>
        </div>
      </div>
      <div class="section-title" style="margin-top:8px">Filter customization <span class="hint">- ported from the filter analytics dashboard; one filter_customization event per browser (first visit to featured)</span></div>`;

    UI.bars(
      document.getElementById("fo-funnel"),
      [{ label: "No choice recorded", n: S - answered }, ...steps].map((s) => ({
        label: s.label,
        value: s.n,
        text: pct(s.n, S),
        color: s.label === "No choice recorded" ? UI.C.text3 : UI.C.accent,
        tip: `<strong>${esc(s.label)}</strong>${fmt(s.n)} of ${fmt(S)} loads${s.total && s.total !== s.n ? `<br>${fmt(s.total)} loads overall (incl. without a recorded 'shown')` : ""}`,
      })),
      { max: S },
    );
    UI.bars(
      document.getElementById("fo-dev"),
      U.sortedEntries(U.countBy([...shown], (l) => l.first.device || "unknown")).map(([k, v]) => {
        const ls = [...shown].filter((l) => (l.first.device || "unknown") === k);
        const d = ls.filter((l) => dismissed.has(l)).length;
        return { label: k, value: v, text: fmt(v), tip: `<strong>${esc(k)}</strong>${fmt(v)} shown · ${pct(d, v)} dismissed` };
      }),
    );

    UI.bars(
      document.getElementById("fo-hm-entry"),
      U.sortedEntries(U.countBy(hm, (e) => e.mEntry || "(none)")).map(([k, v]) => ({ label: k, value: v, text: pct(v, hm.length, 0) })),
    );
    UI.bars(
      document.getElementById("fo-hm-game"),
      U.sortedEntries(U.countBy(hm, (e) => e.mGame || "(none)"))
        .slice(0, 10)
        .map(([k, v]) => ({ label: k === "(none)" ? k : SAD.gameName(k), value: v })),
    );
    const cnt = U.countBy(hm.filter((e) => e.mCount !== ""), (e) => +e.mCount);
    const ks = [...cnt.keys()].sort((a, b) => a - b);
    if (ks.length)
      UI.columnChart(document.getElementById("fo-hm-count"), {
        labels: ks.map(String),
        values: ks.map((k) => cnt.get(k)),
        height: 140,
        tip: (i) => `<strong>${ks[i]} hidden games</strong>${fmt(cnt.get(ks[i]))} opens`,
      });

    const applied = steps.find((s) => s.dp === "onboarding_customize_applied");
    const opened = steps.find((s) => s.dp === "onboarding_customize_opened");
    UI.insights(document.getElementById("fo-ins"), [
      {
        label: "Onboarding answered",
        value: `${pct(answered, S, 0)} respond`,
        sub: `${pct(dismissed.size, S, 0)} just dismiss it, ${pct(answered - dismissed.size, S, 0)} pick an option. Only ${pct(applied.n, S)} end up applying a custom set (${fmt(applied.n)} of ${fmt(opened.n)} who opened customize).`,
      },
      {
        label: "After onboarding",
        value: `${pct(engagedAfter, S, 0)} keep interacting`,
        sub: `Loads that showed onboarding and then fired another non-automatic event.`,
      },
      {
        label: "Filters panel",
        value: `${fmt(filtersOpened)} loads opened it`,
        sub: `${pct(filtersOpened, m.loads.filter((l) => l.pageTypes.has("dashboard")).length, 2)} of dashboard loads.`,
      },
      hm.length && {
        label: "Hidden markers",
        value: `${fmt(hm.length)} opens`,
        sub: `Top entry: ${esc(U.sortedEntries(U.countBy(hm, (e) => e.mEntry || "(none)"))[0][0])}. Disabled ${fmt(m.evs.filter((e) => e.dp === "hidden_markers_disabled").length)}×.`,
      },
    ]);

    SAD.legacyFilters.render(m);
  };
})();
