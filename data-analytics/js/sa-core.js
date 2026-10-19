// Parsing + data model for Simple Analytics raw exports. See ../SIMPLE_ANALYTICS.md for definitions.
(function (root) {
  const SAD = (root.SAD = root.SAD || {});

  // RFC4180-ish CSV parser (quoted fields, escaped quotes, newlines in quotes)
  function parseCSV(text) {
    const rows = [];
    const n = text.length;
    let row = [],
      f = "",
      q = false,
      i = 0;
    while (i < n) {
      const c = text.charCodeAt(i);
      if (q) {
        if (c === 34) {
          if (text.charCodeAt(i + 1) === 34) {
            f += '"';
            i += 2;
          } else {
            q = false;
            i++;
          }
          continue;
        }
        const j = text.indexOf('"', i);
        if (j === -1) {
          f += text.slice(i);
          i = n;
        } else {
          f += text.slice(i, j);
          i = j;
        }
        continue;
      }
      if (c === 34) {
        q = true;
        i++;
      } else if (c === 44) {
        row.push(f);
        f = "";
        i++;
      } else if (c === 10 || c === 13) {
        row.push(f);
        f = "";
        rows.push(row);
        row = [];
        if (c === 13 && text.charCodeAt(i + 1) === 10) i++;
        i++;
      } else {
        let j = i;
        while (j < n) {
          const d = text.charCodeAt(j);
          if (d === 44 || d === 10 || d === 13 || d === 34) break;
          j++;
        }
        f += text.slice(i, j);
        i = j;
      }
    }
    if (f !== "" || row.length) {
      row.push(f);
      rows.push(row);
    }
    return rows;
  }

  const COLS = {
    iso: "added_iso",
    unix: "added_unix",
    dp: "datapoint",
    sid: "session_id",
    uuid: "uuid",
    path: "path",
    uniq: "is_unique",
    ref: "referrer_hostname",
    refFull: "document_referrer",
    dur: "duration_seconds",
    scroll: "scrolled_percentage",
    country: "country_code",
    lang: "lang_language",
    device: "device_type",
    os: "os_name",
    browser: "browser_name",
    vw: "viewport_width",
    utm: "utm_source",
    url: "metadata.url_text",
    mGame: "metadata.game_text",
    mHost: "metadata.hostname_text",
    mEntry: "metadata.entry_text",
    mCount: "metadata.count_int",
    mVisible: "metadata.visible_text",
    mHidden: "metadata.hidden_text",
    mDefault: "metadata.isDefault_bool",
    mApp: "metadata.app_text",
  };

  function toRecords(table) {
    const h = table[0].map((s) => s.trim());
    const I = {};
    for (const k in COLS) I[k] = h.indexOf(COLS[k]);
    const out = [];
    for (let r = 1; r < table.length; r++) {
      const row = table[r];
      if (row.length < 2) continue;
      const g = (k) => (I[k] < 0 ? "" : (row[I[k]] || "").trim());
      const t = Date.parse(g("iso")) || +g("unix") * 1000;
      const dur = g("dur"),
        sc = g("scroll");
      out.push({
        t,
        dp: g("dp"),
        sid: g("sid") || g("uuid"),
        path: g("path") || "/",
        uniq: g("uniq") === "true",
        ref: g("ref"),
        refFull: g("refFull"),
        dur: dur === "" ? null : +dur,
        scroll: sc === "" ? null : +sc,
        country: g("country"),
        lang: g("lang"),
        device: g("device"),
        os: g("os"),
        browser: g("browser"),
        vw: +g("vw") || 0,
        utm: g("utm"),
        url: g("url"),
        mGame: g("mGame"),
        mHost: g("mHost"),
        mEntry: g("mEntry"),
        mCount: g("mCount"),
        mVisible: g("mVisible"),
        mHidden: g("mHidden"),
        mDefault: g("mDefault"),
        mApp: g("mApp"),
      });
    }
    out.sort((a, b) => a.t - b.t);
    return out;
  }

  // ---------- generic helpers ----------
  const median = (a) => {
    if (!a.length) return null;
    const s = a.slice().sort((x, y) => x - y),
      m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  const countBy = (arr, fn) => {
    const m = new Map();
    for (const x of arr) {
      const k = fn(x);
      if (k === undefined) continue;
      m.set(k, (m.get(k) || 0) + 1);
    }
    return m;
  };
  const sortedEntries = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]);
  const pad2 = (n) => String(n).padStart(2, "0");
  const dayKey = (t) => {
    const d = new Date(t);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  };
  const dayLabel = (k) =>
    new Date(k + "T12:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  SAD.util = { median, countBy, sortedEntries, dayKey, dayLabel };

  const NAMES = {
    "path-of-exile": "Path of Exile",
    "path-of-exile2": "Path of Exile 2",
    pd2: "Project Diablo 2",
    nrftw: "No Rest for the Wicked",
    "torchlite-infinite": "Torchlight Infinite",
    "diablo-ii-resurrected": "Diablo II: Resurrected",
    "diablo-iii": "Diablo III",
    "diablo-iv": "Diablo IV",
    "diablo-v": "Diablo V",
    "diablo-2-evolution": "Diablo 2 Evolution",
    "blizzless-d2r": "Blizzless D2R",
    "median-xl": "Median XL",
    "zizaran-s-path-of-exile-gauntlet": "Zizaran's PoE Gauntlet",
    "grim-dawn-community-league": "Grim Dawn Community League",
  };
  SAD.gameName = (s) =>
    NAMES[s] ||
    (s || "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  let regionNames = null;
  try {
    regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  } catch (e) {}
  SAD.countryName = (cc) => {
    if (!cc || cc === "??") return "Unknown";
    try {
      return regionNames ? regionNames.of(cc.toUpperCase()) : cc;
    } catch (e) {
      return cc;
    }
  };
  let langNames = null;
  try {
    langNames = new Intl.DisplayNames(["en"], { type: "language" });
  } catch (e) {}
  SAD.langName = (l) => {
    if (!l) return "Unknown";
    try {
      return langNames ? langNames.of(l) : l;
    } catch (e) {
      return l;
    }
  };

  // ---------- event taxonomy ----------
  const isAuto = (dp) =>
    dp === "filter_customization" ||
    dp === "onboarding_shown" ||
    dp.endsWith("_embed_view");
  SAD.isAuto = isAuto;

  function pageType(path) {
    if (path === "/" || path.startsWith("/dashboard")) return "dashboard";
    if (/^\/game\/[^/]+\/?$/.test(path)) return "game";
    if (path.startsWith("/embed")) return "embed";
    if (/news|article/.test(path)) return "news";
    if (path.startsWith("/calendar")) return "calendar";
    return "other";
  }
  SAD.pageType = pageType;
  SAD.PAGE_TYPE_NAMES = {
    dashboard: "dashboards",
    game: "game pages",
    news: "news/articles",
    calendar: "calendar pages",
    other: "other pages",
  };

  // Ordered: first match wins
  const FEATURES = [
    { id: "outbound", label: "Any outbound link", test: (d) => d.startsWith("outbound_"), meta: true },
    { id: "support", label: "Support (Patreon / BMC)", test: (d) => /^(patreon|bmc|support_click|supporters)/.test(d) },
    { id: "calendar", label: "Calendar subscribe", test: (d) => /calendar/i.test(d) },
    { id: "share", label: "Share", test: (d, a) => /^(share_menu|native_share|Share_)/.test(d) || a === "hub_share_click" },
    { id: "dash_views", label: "Dashboard view switch", test: (d) => /^dashboard_(featured|all|early_access|non_seasonal|community|selector)_click$/.test(d) || d === "dashboard_selector_click" },
    { id: "filters", label: "Filters panel", test: (d) => /^(filters_|preset_chip)/.test(d) },
    { id: "hidden", label: "Hidden-game markers", test: (d) => /^(hidden_|cant_find_catalog)/.test(d) },
    { id: "onboarding", label: "Onboarding choices", test: (d) => d.startsWith("onboarding_") },
    { id: "timeline", label: "Timeline expand/collapse", test: (d) => d === "timeline_expand_collapse_click" },
    { id: "logo", label: "Game logo → game page", test: (d, a) => a === "logo_click" },
    { id: "overview", label: "View game overview", test: (d, a) => a === "view_overview_click" },
    { id: "season_details", label: "Season details", test: (d, a) => /^(current|next)_season_details_click$/.test(a) },
    { id: "hub_tabs", label: "Game page tabs", test: (d, a) => a.startsWith("hub_tab_") },
    { id: "rhythm", label: "Season rhythm / recent seasons", test: (d, a) => /^(rhythm_|recent_full_timeline)/.test(a) },
    { id: "official", label: "Official website link", test: (d, a) => a === "official_website_click" },
    { id: "steam", label: "Steam links", test: (d, a) => /^steam_(page|dialog)_click$/.test(a) },
    { id: "builds", label: "Builds & guides", test: (d, a) => /^(builds|guides)/.test(a) },
    { id: "patch", label: "Patch notes & season links", test: (d) => /_(patch_notes|season_link)_click$/.test(d) },
    { id: "news", label: "News & articles", test: (d, a) => /^(dashboard_news|dashboard_article_rail|news_click|game_article|article_card|related_article|game_articles_see_all)/.test(d) || /^(latest_|news_)/.test(a) },
    { id: "twitch", label: "Twitch links", test: (d, a) => /twitch/.test(a) },
    { id: "embed_docs", label: "Embed / OBS / API docs", test: (d, a) => /(html_docs|obs_docs|copy_obs)/.test(a) || d === "api_docs_click" },
    { id: "discord", label: "Discord bot & server", test: (d) => d.startsWith("discord") },
    { id: "partners", label: "Partner promos (Proton)", test: (d) => /^(proton|partner_promos)/.test(d) },
    { id: "community_label", label: "Community label info", test: (d) => d === "community_label_disclaimer_click" },
    { id: "nav", label: "Menus & site navigation", test: (d) => /^(menu_toggle|game_menu|back_to_homepage|resources_click|faq_click|github_click|contact_click|email_contact|community_launchers|ai_usage)/.test(d) },
  ];
  SAD.FEATURES = FEATURES;

  const CAMPAIGN = {
    "official-website": "Official site",
    "steam-store": "Steam",
    builds: "Builds",
    guides: "Guides",
    "patch-notes": "Patch notes",
    "season-details": "Season details",
    "season-link": "Season link",
    "twitch-category": "Twitch",
  };

  // ---------- model ----------
  SAD.build = function (text) {
    const recs = toRecords(parseCSV(text));

    const slugSet = new Set();
    for (const r of recs)
      if (r.dp === "filter_customization")
        for (const s of (r.mVisible + "," + r.mHidden).split(","))
          if (s.trim()) slugSet.add(s.trim());
    if (!slugSet.size) {
      const gp = countBy(recs, (r) => (r.dp === "pageview" ? (r.path.match(/^\/game\/([^/]+)/) || [])[1] : undefined));
      gp.forEach((v, k) => v >= 5 && slugSet.add(k));
    }
    const prefixes = [...slugSet]
      .map((s) => [s.replace(/-/g, "_"), s])
      .sort((a, b) => b[0].length - a[0].length);
    const splitCache = new Map();
    function split(dp) {
      let v = splitCache.get(dp);
      if (v) return v;
      v = { game: null, action: dp };
      for (const [u, s] of prefixes)
        if (dp.startsWith(u + "_")) {
          v = { game: s, action: dp.slice(u.length + 1) };
          break;
        }
      splitCache.set(dp, v);
      return v;
    }
    const featCache = new Map();
    function featureOf(dp, action) {
      if (dp === "pageview" || isAuto(dp)) return null;
      let f = featCache.get(dp);
      if (f !== undefined) return f;
      const hit = FEATURES.find((x) => x.test(dp, action));
      f = hit ? hit.id : "unparsed";
      featCache.set(dp, f);
      return f;
    }

    const loadMap = new Map();
    for (const r of recs) {
      let l = loadMap.get(r.sid);
      if (!l) loadMap.set(r.sid, (l = { sid: r.sid, pvs: [], evs: [] }));
      if (r.dp === "pageview") l.pvs.push(r);
      else {
        const s = split(r.dp);
        r.game = s.game;
        r.action = s.action;
        r.feature = featureOf(r.dp, s.action);
        l.evs.push(r);
      }
      r.load = l;
    }

    const gamePathOf = (p) => {
      const m = p.match(/^\/game\/([^/]+)/);
      return m && slugSet.has(m[1]) ? m[1] : null;
    };

    for (const r of recs) {
      if (!r.dp.startsWith("outbound_")) continue;
      let u = null;
      try {
        u = new URL(r.url);
      } catch (e) {}
      const p = u ? u.searchParams : new URLSearchParams();
      const content = p.get("utm_content") || "",
        campaign = p.get("utm_campaign") || "";
      const host = u ? u.hostname.replace(/^www\./, "") : r.dp.slice(9).replace(/_/g, ".");
      const type =
        content === "season_link"
          ? "Season link"
          : CAMPAIGN[campaign] ||
            (/youtube|youtu\.be/.test(host)
              ? "Video"
              : /steampowered|steamcommunity/.test(host)
                ? "Steam"
                : "Other");
      let game = slugSet.has(content) ? content : gamePathOf(r.path);
      if (!game) {
        const near = r.load.evs.find(
          (e) => e !== r && e.game && !e.dp.startsWith("outbound_") && Math.abs(e.t - r.t) <= 2000,
        );
        if (near) game = near.game;
      }
      r.out = {
        host,
        type,
        game,
        clean: u ? u.origin + u.pathname : r.url,
        term: p.get("utm_term") || "",
      };
    }

    const loads = [],
      embedLoads = [];
    for (const l of loadMap.values()) {
      const first = l.pvs[0] || l.evs[0];
      l.t = first.t;
      l.entry = first.path;
      l.first = first;
      l.embed = l.entry.startsWith("/embed");
      l.type = !l.pvs.length
        ? "event-only"
        : l.pvs[0].uniq
          ? "visit"
          : l.pvs[0].ref === "arpg-timeline.com"
            ? "internal"
            : "reload";
      l.interactive = l.evs.some((e) => !isAuto(e.dp));
      l.pageTypes = new Set([...l.pvs, ...l.evs].map((r) => pageType(r.path)));
      l.features = new Set(l.evs.map((e) => e.feature).filter(Boolean));
      (l.embed ? embedLoads : loads).push(l);
    }
    loads.sort((a, b) => a.t - b.t);

    const pvs = [],
      evs = [];
    for (const l of loads) {
      for (const p of l.pvs) pvs.push(p);
      for (const e of l.evs) evs.push(e);
    }
    pvs.sort((a, b) => a.t - b.t);
    evs.sort((a, b) => a.t - b.t);

    // Continuous local-day axis
    const days = [];
    if (recs.length) {
      const d = new Date(recs[0].t);
      d.setHours(12, 0, 0, 0);
      const end = dayKey(recs[recs.length - 1].t);
      for (let k = dayKey(d.getTime()); ; d.setDate(d.getDate() + 1), k = dayKey(d.getTime())) {
        days.push(k);
        if (k >= end || days.length > 400) break;
      }
    }

    return {
      recs,
      pvs,
      evs,
      loads,
      embedLoads,
      slugs: [...slugSet].sort(),
      slugSet,
      days,
      gamePathOf,
      range: recs.length ? [recs[0].t, recs[recs.length - 1].t] : [0, 0],
    };
  };

  // ---------- shared derived metrics ----------
  SAD.timeOnPage = (pvs) => median(pvs.filter((p) => p.dur !== null && p.dur >= 5).map((p) => p.dur));
  SAD.bounceRate = (pvs) => {
    const w = pvs.filter((p) => p.dur !== null);
    return w.length ? w.filter((p) => p.dur < 5).length / w.length : null;
  };
  SAD.medianScroll = (pvs) => median(pvs.filter((p) => p.scroll !== null).map((p) => p.scroll));

  // Daily game-page spikes: day count >= 3x that game's daily median and >= minAbs
  SAD.spikes = function (m, minAbs = 25, ratio = 3) {
    const idx = new Map(m.days.map((d, i) => [d, i]));
    const per = new Map();
    for (const p of m.pvs) {
      const g = m.gamePathOf(p.path);
      if (!g) continue;
      let a = per.get(g);
      if (!a) per.set(g, (a = new Array(m.days.length).fill(0)));
      const i = idx.get(dayKey(p.t));
      if (i !== undefined) a[i]++;
    }
    const out = [];
    per.forEach((arr, g) => {
      const med = Math.max(1, median(arr));
      arr.forEach((v, i) => {
        if (v >= minAbs && v >= ratio * med) out.push({ i, day: m.days[i], game: g, count: v, ratio: v / med });
      });
    });
    // merge consecutive spike days of one game into an episode, annotated at its peak
    const episodes = [];
    out.sort((a, b) => (a.game === b.game ? a.i - b.i : a.game < b.game ? -1 : 1));
    for (const s of out) {
      const last = episodes[episodes.length - 1];
      if (last && last.game === s.game && s.i - last.endI <= 1) {
        last.endI = s.i;
        last.total += s.count;
        if (s.count > last.peak.count) last.peak = s;
      } else episodes.push({ game: s.game, startI: s.i, endI: s.i, total: s.count, peak: s });
    }
    episodes.sort((a, b) => a.peak.i - b.peak.i);
    return { episodes, daily: per };
  };
})(typeof window !== "undefined" ? window : globalThis);
