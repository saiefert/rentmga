/* Maringá Casas — Mobile-First Native-Feel Map App + Grokbot JSON Feed */
(() => {
  "use strict";

  const STORAGE_KEYS = {
    prefs: "maringa_casas_user_prefs_v1",
    previewJson: "maringa_casas_preview_json_v1",
  };

  const RADIUS_STEPS = [500, 1000, 1500];
  const BASEMAP_STEPS = [
    { id: "clean", label: "Clean" },
    { id: "streets", label: "Ruas" },
    { id: "satellite", label: "Satélite" },
  ];

  // Category catalog with crisp custom SVG icons & harmonious colors
  const CATEGORIES = {
    rotina: {
      id: "rotina",
      label: "Escola & Trabalho",
      plural: "Rotina (Escola e Trabalho)",
      color: "#be185d",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.4l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.5z"/></svg>`,
    },
    pet: {
      id: "pet",
      label: "Área pet",
      plural: "Áreas para pets",
      color: "#d97724",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="7.5" cy="9.5" r="2.1"/><circle cx="12" cy="7.2" r="2.2"/><circle cx="16.5" cy="9.5" r="2.1"/><circle cx="18.7" cy="13.7" r="1.8"/><path d="M12 11.4c-2.6 0-5.1 2.2-5.1 4.9 0 1.7 1.3 2.7 2.8 2.7 1 0 1.6-.3 2.3-.3s1.3.3 2.3.3c1.5 0 2.8-1 2.8-2.7 0-2.7-2.5-4.9-5.1-4.9z"/></svg>`,
    },
    ciclovia: {
      id: "ciclovia",
      label: "Ciclovias",
      plural: "Ciclovias",
      color: "#0d9488",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="16.5" r="3.5"/><circle cx="18" cy="16.5" r="3.5"/><path d="M6 16.5L10.2 9h4.3l3.5 7.5M10.2 9l1.8 7.5H6M9 6.5h3M14.5 9l1.2-3H18"/></svg>`,
    },
    academia: {
      id: "academia",
      label: "Academias",
      plural: "Academias",
      color: "#4f46e5",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8v8M18 8v8M3.5 10v4M20.5 10v4M6 12h12"/></svg>`,
    },
    parque: {
      id: "parque",
      label: "Parques",
      plural: "Parques e bosques",
      color: "#16a34a",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3L6.2 11.5h3.1L5.5 17.5h5.2V21h2.6v-3.5h5.2l-3.8-6h3.1L12 3z"/></svg>`,
    },
    mercado: {
      id: "mercado",
      label: "Mercados",
      plural: "Mercados",
      color: "#2563eb",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16l-1.5 9.5a2 2 0 0 1-2 1.5h-9a2 2 0 0 1-2-1.5L4 9z"/><path d="M8.5 9L11 4.5M15.5 9L13 4.5"/></svg>`,
    },
    cafe: {
      id: "cafe",
      label: "Cafés",
      plural: "Cafés e padarias",
      color: "#9a522a",
      defaultOn: false,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z"/><path d="M16 10.5h2a2.5 2.5 0 0 1 0 5h-2M7 5.5v1.5M11 4.5v2.5"/></svg>`,
    },
    saude: {
      id: "saude",
      label: "Saúde",
      plural: "Saúde e vet",
      color: "#dc2626",
      defaultOn: false,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6V4z"/></svg>`,
    },
    educacao: {
      id: "educacao",
      label: "Educação",
      plural: "Escolas e UEM",
      color: "#7c3aed",
      defaultOn: false,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5z"/><path d="M6.5 11.5v4.5c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.5"/></svg>`,
    },
  };

  const UI_ICONS = {
    heart: `<svg viewBox="0 0 20 20" fill="none"><path d="M10 16.5C10 16.5 3.5 12.2 3.5 7.4C3.5 5.2 5.2 3.5 7.3 3.5C8.6 3.5 9.6 4.2 10 5.1C10.4 4.2 11.4 3.5 12.7 3.5C14.8 3.5 16.5 5.2 16.5 7.4C16.5 12.2 10 16.5 10 16.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
    compare: `<svg viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4" width="6" height="12" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="11.5" y="4" width="6" height="12" rx="1.5" stroke="currentColor" stroke-width="1.7"/></svg>`,
    pin: `<svg viewBox="0 0 20 20" fill="none"><path d="M10 17.5s5.5-4.7 5.5-9.2a5.5 5.5 0 1 0-11 0c0 4.5 5.5 9.2 5.5 9.2z" stroke="currentColor" stroke-width="1.7"/><circle cx="10" cy="8.3" r="2" stroke="currentColor" stroke-width="1.6"/></svg>`,
    bed: `<svg viewBox="0 0 20 20" fill="none"><path d="M3 14.5V6.5M3 11.5h14v3M17 11.5V9a2 2 0 0 0-2-2H8.5v4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="8.8" r="1.2" fill="currentColor"/></svg>`,
    bath: `<svg viewBox="0 0 20 20" fill="none"><path d="M4 10.5h12v1.5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-1.5zM5.5 10.5V6a2 2 0 0 1 2-2h.5a1.5 1.5 0 0 1 1.5 1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    car: `<svg viewBox="0 0 20 20" fill="none"><path d="M3.5 12.5l1.3-4.1A2 2 0 0 1 6.7 7h6.6a2 2 0 0 1 1.9 1.4l1.3 4.1v2.5h-1.8v-1.2H5.3V15H3.5v-2.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="6.5" cy="11.8" r="1" fill="currentColor"/><circle cx="13.5" cy="11.8" r="1" fill="currentColor"/></svg>`,
    area: `<svg viewBox="0 0 20 20" fill="none"><rect x="3.5" y="3.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M7 13l6-6M10.5 7H13v2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    external: `<svg viewBox="0 0 20 20" fill="none"><path d="M11 4h5v5M16 4l-7 7M8.5 5.5H5.5a1.5 1.5 0 0 0-1.5 1.5v7.5A1.5 1.5 0 0 0 5.5 16H13a1.5 1.5 0 0 0 1.5-1.5v-3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    school: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5z"/><path d="M6.5 11.5v4.5c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.5"/><path d="M20.5 10.5v5"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7"/><path d="M3 12.5h18"/></svg>`,
  };

  const GROKBOT_PROMPT = `Você é um buscador de casas em Maringá - PR.
Sempre que encontrar casas relevantes, retorne APENAS um JSON válido seguindo exatamente o formato abaixo para atualizar o arquivo data/casas.json do site:

{
  "atualizado_em": "2026-11-22T15:00:00-03:00",
  "fonte": "Grokbot",
  "cidade": "Maringá - PR",
  "observacao": "Resumo breve desta rodada de busca",
  "casas": [
    {
      "id": "casa-zona02-01",
      "titulo": "Casa térrea arborizada com quintal",
      "finalidade": "aluguel",
      "tipo": "Casa térrea",
      "preco": 3400,
      "condominio": null,
      "iptu": 160,
      "bairro": "Zona 02",
      "endereco": "Rua aproximada ou ponto de referência",
      "lat": -23.4319,
      "lng": -51.9318,
      "quartos": 3,
      "suites": 1,
      "banheiros": 2,
      "vagas": 2,
      "area_m2": 150,
      "terreno_m2": 300,
      "aceita_pets": true,
      "quintal": true,
      "mobiliada": false,
      "destaque": false,
      "descricao": "Resumo objetivo do imóvel.",
      "nota_grokbot": "Por que esta casa vale a pena e pontos de atenção.",
      "tags": ["Quintal gramado", "Rua arborizada"],
      "fotos": [],
      "link": "https://url-do-anuncio",
      "portal": "Nome do portal",
      "encontrado_em": "2026-11-22"
    }
  ]
}

Regras:
- "finalidade": "aluguel" ou "compra".
- "preco", "condominio", "iptu", "area_m2", "terreno_m2": números sem "R$".
- Mantenha o mesmo "id" para a mesma casa entre atualizações (preserva favoritos e anotações).
- Se não tiver "lat" e "lng" exatas, preencha "bairro" corretamente (ex: "Zona 02", "Zona 07", "Eurogarden") que o site posiciona no mapa automaticamente.
- As distâncias até áreas pet, ciclovias, academias, parques e mercados são calculadas automaticamente pelo site.`;

  const STATUS_OPTIONS = [
    { id: "", label: "Em análise" },
    { id: "visitar", label: "Quero visitar" },
    { id: "visitada", label: "Visitada" },
    { id: "descartada", label: "Descartada" },
  ];

  // App state
  const state = {
    activeTab: "mapa", // mobile tab: "mapa" | "lista" | "salvas"
    savedFilter: "all", // "all" | "fav" | "visitar" | "visitada"
    cityData: null,
    publishedFeed: null,
    activeFeed: null,
    isPreview: false,
    houses: [],
    filteredHouses: [],
    allPois: [],
    routineAnchors: [],
    liveOsmPoisByHouse: {},
    selectedHouseId: null,
    drawerOpen: false,
    hoveredHouseId: null,
    compareIds: [],
    activePhotoIndex: 0,
    radiusMeters: 1000,
    basemap: "clean",
    activeCategories: new Set(
      Object.values(CATEGORIES)
        .filter((c) => c.defaultOn)
        .map((c) => c.id)
    ),
    filters: {
      query: "",
      finalidade: "todas",
      minQuartos: 0,
      sort: "score",
      pets: false,
      quintal: false,
      favoritas: false,
      near: new Set(),
    },
    prefs: loadPrefs(),
  };

  // Leaflet references
  let map = null;
  let baseLayers = {};
  let currentBaseLayer = null;
  let cicloviaLayer = null;
  let rotinaLayer = null;
  let poiLayer = null;
  let houseLayer = null;
  let selectionLayer = null;
  let routeHighlightLayer = null;
  const houseMarkers = new Map();
  const poiMarkers = new Map();
  const anchorMarkers = new Map();

  // DOM Elements
  const el = {
    searchInput: document.getElementById("searchInput"),
    clearSearchBtn: document.getElementById("clearSearchBtn"),
    openFiltersBtn: document.getElementById("openFiltersBtn"),
    filterCountBadge: document.getElementById("filterCountBadge"),
    feedStatus: document.getElementById("feedStatus"),
    feedStatusText: document.getElementById("feedStatusText"),
    compareOpenBtn: document.getElementById("compareOpenBtn"),
    compareCount: document.getElementById("compareCount"),
    mobileCompareBtn: document.getElementById("mobileCompareBtn"),
    mobileCompareCount: document.getElementById("mobileCompareCount"),
    jsonModalBtn: document.getElementById("jsonModalBtn"),
    navJsonBtn: document.getElementById("navJsonBtn"),
    navListCount: document.getElementById("navListCount"),
    navSavedDot: document.getElementById("navSavedDot"),
    sortFilter: document.getElementById("sortFilter"),
    sheetSortSelect: document.getElementById("sheetSortSelect"),
    resultsCount: document.getElementById("resultsCount"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    previewBanner: document.getElementById("previewBanner"),
    exitPreviewBtn: document.getElementById("exitPreviewBtn"),
    savedSubtitle: document.getElementById("savedSubtitle"),
    listingsContainer: document.getElementById("listingsContainer"),
    emptyState: document.getElementById("emptyState"),
    emptyTitle: document.getElementById("emptyTitle"),
    emptyDesc: document.getElementById("emptyDesc"),
    emptyResetBtn: document.getElementById("emptyResetBtn"),
    drawerBackdrop: document.getElementById("drawerBackdrop"),
    detailDrawer: document.getElementById("detailDrawer"),
    drawerGrab: document.getElementById("drawerGrab"),
    closeDrawerBtn: document.getElementById("closeDrawerBtn"),
    drawerPeekMapBtn: document.getElementById("drawerPeekMapBtn"),
    drawerCompareBtn: document.getElementById("drawerCompareBtn"),
    drawerFavBtn: document.getElementById("drawerFavBtn"),
    drawerBody: document.getElementById("drawerBody"),
    poiCategoryBar: document.getElementById("poiCategoryBar"),
    mapCarousel: document.getElementById("mapCarousel"),
    mapCarouselWrap: document.getElementById("mapCarouselWrap"),
    cycleRadiusBtn: document.getElementById("cycleRadiusBtn"),
    cycleRadiusLabel: document.getElementById("cycleRadiusLabel"),
    cycleBasemapBtn: document.getElementById("cycleBasemapBtn"),
    cycleBasemapLabel: document.getElementById("cycleBasemapLabel"),
    fitBoundsBtn: document.getElementById("fitBoundsBtn"),
    fitBoundsMobileBtn: document.getElementById("fitBoundsMobileBtn"),
    mapHint: document.getElementById("mapHint"),
    filtersModal: document.getElementById("filtersModal"),
    sheetClearFiltersBtn: document.getElementById("sheetClearFiltersBtn"),
    sheetApplyFiltersBtn: document.getElementById("sheetApplyFiltersBtn"),
    compareModal: document.getElementById("compareModal"),
    compareBody: document.getElementById("compareBody"),
    jsonModal: document.getElementById("jsonModal"),
    jsonInput: document.getElementById("jsonInput"),
    jsonError: document.getElementById("jsonError"),
    applyJsonBtn: document.getElementById("applyJsonBtn"),
    downloadJsonBtn: document.getElementById("downloadJsonBtn"),
    loadSampleIntoEditorBtn: document.getElementById("loadSampleIntoEditorBtn"),
    resetJsonBtn: document.getElementById("resetJsonBtn"),
    currentJsonView: document.getElementById("currentJsonView"),
    copyCurrentJsonBtn: document.getElementById("copyCurrentJsonBtn"),
    grokbotPromptView: document.getElementById("grokbotPromptView"),
    copyPromptBtn: document.getElementById("copyPromptBtn"),
    toast: document.getElementById("toast"),
  };

  function isDesktop() {
    return window.innerWidth >= 960;
  }

  // ==================== UTILITIES ====================

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.prefs);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          favorites: parsed.favorites || {},
          status: parsed.status || {},
          notes: parsed.notes || {},
        };
      }
    } catch (_) {}
    return { favorites: {}, status: {}, notes: {} };
  }

  function savePrefs() {
    try {
      localStorage.setItem(STORAGE_KEYS.prefs, JSON.stringify(state.prefs));
    } catch (_) {}
    updateSavedIndicators();
  }

  function updateSavedIndicators() {
    const savedCount = state.houses.filter(
      (h) => state.prefs.favorites[h.id] || state.prefs.status[h.id] || state.prefs.notes[h.id]
    ).length;
    el.navSavedDot.hidden = savedCount === 0;
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(str) {
    return String(str ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function parseNumber(val) {
    if (typeof val === "number" && Number.isFinite(val)) return val;
    if (typeof val === "string") {
      const cleaned = val
        .replace(/[^\d,.-]/g, "")
        .replace(/\.(?=\d{3}(\D|$))/g, "")
        .replace(",", ".");
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  }

  function formatCurrency(val) {
    const n = parseNumber(val);
    if (!n) return "Sob consulta";
    return n.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  }

  function formatCompactPrice(val, finalidade) {
    const n = parseNumber(val);
    if (!n) return "Consultar";
    if (n >= 1000000) {
      const m = (n / 1000000).toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
      return `R$ ${m} mi`;
    }
    if (finalidade === "compra" || n >= 20000) {
      return `R$ ${Math.round(n / 1000)} mil`;
    }
    return `R$ ${n.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
  }

  function formatDistance(meters) {
    if (!Number.isFinite(meters)) return "—";
    if (meters < 1000) return `${Math.round(meters / 10) * 10 || 10} m`;
    return `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
  }

  function walkMinutes(meters) {
    return Math.max(1, Math.round(meters / 78));
  }

  function bikeMinutes(meters) {
    return Math.max(1, Math.round(meters / 235));
  }

  function driveMinutes(meters) {
    // Realistic urban Maringá driving pace (~26 km/h avg incl. traffic lights)
    return Math.max(2, Math.round(meters / 430));
  }

  function roadApproxMeters(straightMeters) {
    // Maringá's urban grid factor (~1.22x straight-line distance)
    return Math.round(straightMeters * 1.22);
  }

  function getAnchorIcon(anchor) {
    return anchor.tipo === "trabalho" ? UI_ICONS.briefcase : UI_ICONS.school;
  }

  function formatDateShort(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function closestPointOnPolyline(lat, lng, coords) {
    let bestDist = Infinity;
    let bestPt = coords[0];
    const cosLat = Math.cos((lat * Math.PI) / 180);

    for (let i = 0; i < coords.length - 1; i++) {
      const [aLat, aLng] = coords[i];
      const [bLat, bLng] = coords[i + 1];
      const ax = aLng * cosLat;
      const ay = aLat;
      const bx = bLng * cosLat;
      const by = bLat;
      const px = lng * cosLat;
      const py = lat;

      const dx = bx - ax;
      const dy = by - ay;
      const lenSq = dx * dx + dy * dy;
      let t = lenSq > 0 ? ((px - ax) * dx + (py - ay) * dy) / lenSq : 0;
      t = Math.max(0, Math.min(1, t));

      const projLat = aLat + t * (bLat - aLat);
      const projLng = aLng + t * (bLng - aLng);
      const dist = haversine(lat, lng, projLat, projLng);
      if (dist < bestDist) {
        bestDist = dist;
        bestPt = [projLat, projLng];
      }
    }
    return { distance: bestDist, lat: bestPt[0], lng: bestPt[1] };
  }

  let toastTimer = null;
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.toast.hidden = true;
    }, 2600);
  }

  function buildHouseIllustration(house, compact = false) {
    const palettes = [
      { sky: "#e6f1eb", hill: "#c6dfd1", wall: "#ffffff", roof: "#1b5e43", accent: "#d46a34", tree: "#2c7a57" },
      { sky: "#f3ece4", hill: "#dfd3c5", wall: "#ffffff", roof: "#3b5249", accent: "#d97724", tree: "#4c7c63" },
      { sky: "#e8eff5", hill: "#cad9e5", wall: "#ffffff", roof: "#244761", accent: "#d46a34", tree: "#2f7556" },
      { sky: "#edf2e7", hill: "#d1dfc4", wall: "#ffffff", roof: "#4a5d3b", accent: "#c76c3a", tree: "#3b7644" },
    ];
    const p = palettes[hashString(house.id || house.titulo) % palettes.length];
    const isSobrado = normalizeText(house.tipo).includes("sobrado");
    const bairroLabel = escapeHtml(house.bairro || "Maringá - PR");

    return `
      <svg class="house-card__placeholder" viewBox="0 0 420 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustração de ${escapeHtml(house.titulo)}">
        <rect width="420" height="200" fill="${p.sky}"/>
        <circle cx="348" cy="46" r="24" fill="#fff" opacity="0.7"/>
        <path d="M0 162 Q105 130 220 152 T420 144 L420 200 L0 200 Z" fill="${p.hill}"/>
        <g opacity="0.92">
          <rect x="64" y="122" width="6" height="32" rx="3" fill="#6b5848"/>
          <circle cx="67" cy="108" r="22" fill="${p.tree}"/>
          <circle cx="54" cy="116" r="14" fill="${p.tree}" opacity="0.85"/>
          <rect x="332" y="124" width="6" height="30" rx="3" fill="#6b5848"/>
          <circle cx="335" cy="111" r="20" fill="${p.tree}"/>
          <circle cx="350" cy="119" r="13" fill="${p.tree}" opacity="0.8"/>
        </g>
        ${
          isSobrado
            ? `
          <rect x="136" y="74" width="148" height="82" rx="4" fill="${p.wall}" stroke="#17211d" stroke-opacity="0.14" stroke-width="2"/>
          <rect x="128" y="66" width="164" height="12" rx="3" fill="${p.roof}"/>
          <rect x="150" y="90" width="42" height="22" rx="3" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.5"/>
          <rect x="228" y="90" width="42" height="22" rx="3" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.5"/>
          <rect x="197" y="122" width="26" height="34" rx="3" fill="${p.accent}"/>
          <rect x="150" y="124" width="34" height="20" rx="3" fill="${p.sky}"/>
          <rect x="236" y="124" width="34" height="20" rx="3" fill="${p.sky}"/>
        `
            : `
          <polygon points="122,102 210,56 298,102" fill="${p.roof}"/>
          <rect x="136" y="100" width="148" height="56" rx="3" fill="${p.wall}" stroke="#17211d" stroke-opacity="0.14" stroke-width="2"/>
          <rect x="196" y="120" width="28" height="36" rx="3" fill="${p.accent}"/>
          <rect x="152" y="116" width="30" height="22" rx="3" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.5"/>
          <rect x="238" y="116" width="30" height="22" rx="3" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.5"/>
        `
        }
        ${compact ? "" : `<text x="210" y="183" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#17211d" opacity="0.52">${bairroLabel} · Maringá</text>`}
      </svg>
    `;
  }

  // ==================== DATA NORMALIZATION & PROXIMITY ENGINE ====================

  function resolveHouseCoords(raw, index) {
    let lat = Number(raw.lat);
    let lng = Number(raw.lng);
    let approx = false;

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) {
      approx = true;
      const bairros = state.cityData?.bairros || {};
      const key = normalizeText(raw.bairro || "");
      let match = bairros[key];
      if (!match) {
        const foundKey = Object.keys(bairros).find((k) => key.includes(k) || k.includes(key));
        if (foundKey) match = bairros[foundKey];
      }
      const base = match || state.cityData?.centro || { lat: -23.4252, lng: -51.9336 };
      const seed = hashString(`${raw.id || raw.titulo || index}`);
      const angle = (seed % 360) * (Math.PI / 180);
      const dist = 0.0014 + (seed % 7) * 0.00035;
      lat = Number((base.lat + Math.sin(angle) * dist).toFixed(5));
      lng = Number((base.lng + Math.cos(angle) * dist).toFixed(5));
    }
    return { lat, lng, approx };
  }

  function computeHouseProximities(house) {
    const items = [];

    for (const poi of state.allPois) {
      const dist = haversine(house.lat, house.lng, poi.lat, poi.lng);
      items.push({
        id: poi.id,
        nome: poi.nome,
        categoria: poi.categoria,
        lat: poi.lat,
        lng: poi.lng,
        detalhe: poi.detalhe || "",
        distance: dist,
        source: poi.source || "maringa",
      });
    }

    for (const ciclo of state.cityData?.ciclovias || []) {
      const nearest = closestPointOnPolyline(house.lat, house.lng, ciclo.coords);
      items.push({
        id: ciclo.id,
        nome: ciclo.nome,
        categoria: "ciclovia",
        lat: nearest.lat,
        lng: nearest.lng,
        detalhe: ciclo.detalhe || `Extensão aprox. ${ciclo.extensao_km || ""} km`,
        distance: nearest.distance,
        source: "ciclovia",
      });
    }

    if (Array.isArray(house.rawProximidades)) {
      house.rawProximidades.forEach((p, idx) => {
        const cat = CATEGORIES[p.categoria] ? p.categoria : "parque";
        const hasCoords = Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng));
        const dist = Number.isFinite(Number(p.distancia_m))
          ? Number(p.distancia_m)
          : hasCoords
          ? haversine(house.lat, house.lng, Number(p.lat), Number(p.lng))
          : 350;
        items.push({
          id: `custom-${house.id}-${idx}`,
          nome: p.nome || "Ponto próximo",
          categoria: cat,
          lat: hasCoords ? Number(p.lat) : house.lat,
          lng: hasCoords ? Number(p.lng) : house.lng,
          detalhe: p.detalhe || "Informado pelo Grokbot",
          distance: dist,
          source: "grokbot",
        });
      });
    }

    const liveOsm = state.liveOsmPoisByHouse[house.id] || [];
    for (const p of liveOsm) {
      const dist = haversine(house.lat, house.lng, p.lat, p.lng);
      items.push({ ...p, distance: dist, source: "osm" });
    }

    items.sort((a, b) => a.distance - b.distance);

    const nearestByCat = {};
    for (const item of items) {
      if (!nearestByCat[item.categoria]) nearestByCat[item.categoria] = item;
    }

    const scoreFromDist = (d, ideal = 250, max = 1600) => {
      if (!Number.isFinite(d)) return 30;
      if (d <= ideal) return 98;
      if (d >= max) return 28;
      return Math.round(98 - ((d - ideal) / (max - ideal)) * 70);
    };

    const petBase = scoreFromDist(nearestByCat.pet?.distance, 300, 1500);
    const scores = {
      pet: Math.min(100, Math.round(petBase + (house.aceita_pets ? 6 : -18) + (house.quintal ? 5 : 0))),
      ciclovia: scoreFromDist(nearestByCat.ciclovia?.distance, 200, 1400),
      academia: scoreFromDist(nearestByCat.academia?.distance, 350, 1600),
      parque: scoreFromDist(nearestByCat.parque?.distance, 350, 1700),
      conveniencia: Math.round(
        (scoreFromDist(nearestByCat.mercado?.distance, 400, 1700) +
          scoreFromDist(nearestByCat.cafe?.distance, 400, 1700) +
          scoreFromDist(nearestByCat.saude?.distance, 500, 2000)) /
          3
      ),
    };

    house.nearby = items;
    house.nearestByCat = nearestByCat;
    house.scores = scores;
    house.overallScore = Math.round(
      scores.pet * 0.24 +
        scores.ciclovia * 0.22 +
        scores.academia * 0.18 +
        scores.parque * 0.2 +
        scores.conveniencia * 0.16
    );

    // Commute distances to routine anchors (Escola & Trabalho)
    house.commutes = state.routineAnchors.map((anchor) => {
      const straight = haversine(house.lat, house.lng, anchor.lat, anchor.lng);
      const road = roadApproxMeters(straight);
      return {
        ...anchor,
        straightMeters: straight,
        roadMeters: road,
        driveMin: driveMinutes(road),
        bikeMin: bikeMinutes(road),
        walkMin: walkMinutes(road),
      };
    });
    const school = house.commutes.find((c) => c.tipo === "escola");
    const work = house.commutes.find((c) => c.tipo === "trabalho");
    house.schoolDist = school ? school.roadMeters : Infinity;
    house.workDist = work ? work.roadMeters : Infinity;
    house.routineCombinedDist = (school ? school.roadMeters : 0) + (work ? work.roadMeters : 0);
  }

  function ingestFeed(feed, isPreview = false) {
    if (!feed || !Array.isArray(feed.casas)) {
      throw new Error('O JSON precisa conter um array "casas": [ ... ].');
    }

    state.activeFeed = feed;
    state.isPreview = isPreview;

    // Routine anchors: defaults from maringa-pois.json (Escola & Trabalho), optionally overridable via JSON
    const defaultAnchors = Array.isArray(state.cityData?.rotina) ? state.cityData.rotina : [];
    const customAnchors = Array.isArray(feed.rotina) && feed.rotina.length ? feed.rotina : defaultAnchors;
    state.routineAnchors = customAnchors.filter(
      (a) => a && a.nome && Number.isFinite(Number(a.lat)) && Number.isFinite(Number(a.lng))
    );

    const basePois = (state.cityData?.pois || []).map((p) => ({ ...p, source: "maringa" }));
    const extraPois = Array.isArray(feed.pontos_extras)
      ? feed.pontos_extras
          .filter((p) => p && p.nome && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng)))
          .map((p, idx) => ({
            id: p.id || `extra-${idx}`,
            nome: p.nome,
            categoria: CATEGORIES[p.categoria] ? p.categoria : "parque",
            lat: Number(p.lat),
            lng: Number(p.lng),
            detalhe: p.detalhe || "Adicionado via JSON",
            source: "extra",
          }))
      : [];

    state.allPois = [...basePois, ...extraPois];

    state.houses = feed.casas.map((raw, i) => {
      const finalidadeNorm =
        normalizeText(raw.finalidade).includes("comp") || normalizeText(raw.finalidade).includes("vend")
          ? "compra"
          : "aluguel";
      const coords = resolveHouseCoords(raw, i);
      const id = String(raw.id || `casa-${i + 1}-${hashString(raw.titulo || String(i))}`);
      const house = {
        id,
        titulo: String(raw.titulo || `Casa em ${raw.bairro || "Maringá"}`),
        finalidade: finalidadeNorm,
        tipo: String(raw.tipo || "Casa"),
        preco: parseNumber(raw.preco),
        condominio: raw.condominio != null ? parseNumber(raw.condominio) : null,
        iptu: raw.iptu != null ? parseNumber(raw.iptu) : null,
        bairro: String(raw.bairro || "Maringá"),
        endereco: String(raw.endereco || ""),
        lat: coords.lat,
        lng: coords.lng,
        approxCoords: coords.approx,
        quartos: Number(raw.quartos) || 0,
        suites: Number(raw.suites) || 0,
        banheiros: Number(raw.banheiros) || 0,
        vagas: Number(raw.vagas) || 0,
        area_m2: parseNumber(raw.area_m2),
        terreno_m2: parseNumber(raw.terreno_m2),
        aceita_pets: raw.aceita_pets !== false,
        quintal: Boolean(raw.quintal),
        mobiliada: Boolean(raw.mobiliada),
        destaque: Boolean(raw.destaque),
        descricao: String(raw.descricao || ""),
        nota_grokbot: String(raw.nota_grokbot || ""),
        tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
        fotos: Array.isArray(raw.fotos) ? raw.fotos.filter((u) => typeof u === "string" && u.trim()) : [],
        link: typeof raw.link === "string" ? raw.link.trim() : "",
        portal: String(raw.portal || feed.fonte || ""),
        encontrado_em: String(raw.encontrado_em || feed.atualizado_em || ""),
        rawProximidades: Array.isArray(raw.proximidades) ? raw.proximidades : [],
      };
      computeHouseProximities(house);
      return house;
    });

    const updatedLabel = formatDateShort(feed.atualizado_em);
    const sourceLabel = feed.fonte || "JSON";
    el.feedStatus.classList.toggle("is-preview", isPreview);
    el.feedStatusText.textContent = isPreview
      ? `Prévia local · ${state.houses.length} casas`
      : `${sourceLabel}${updatedLabel ? ` · ${updatedLabel}` : ""} · ${state.houses.length} casas`;

    el.previewBanner.hidden = !isPreview;
    el.resetJsonBtn.hidden = !isPreview;
    el.currentJsonView.textContent = JSON.stringify(feed, null, 2);

    updateSavedIndicators();

    if (state.selectedHouseId && !state.houses.some((h) => h.id === state.selectedHouseId)) {
      closeDrawer(true);
    }

    renderPoiLayers();
    applyFiltersAndRender(true);
  }

  // ==================== MAP INITIALIZATION & LAYERS ====================

  function initMap() {
    const center = state.cityData?.centro || { lat: -23.4252, lng: -51.9336 };

    map = L.map("map", {
      center: [center.lat, center.lng],
      zoom: 13,
      zoomControl: false,
      preferCanvas: true,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    baseLayers = {
      clean: L.layerGroup([
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
          attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
          maxZoom: 19,
          maxNativeZoom: 16,
        }),
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
          maxZoom: 19,
          maxNativeZoom: 16,
        }),
      ]),
      streets: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }),
      satellite: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri",
          maxZoom: 19,
        }
      ),
    };

    currentBaseLayer = baseLayers.clean.addTo(map);

    cicloviaLayer = L.layerGroup().addTo(map);
    selectionLayer = L.layerGroup().addTo(map);
    routeHighlightLayer = L.layerGroup().addTo(map);
    poiLayer = L.layerGroup().addTo(map);
    rotinaLayer = L.layerGroup().addTo(map);
    houseLayer = L.layerGroup().addTo(map);

    map.on("click", () => {
      clearRouteHighlight();
    });
  }

  function setBasemap(name) {
    if (!baseLayers[name] || name === state.basemap) return;
    state.basemap = name;
    if (currentBaseLayer) map.removeLayer(currentBaseLayer);
    currentBaseLayer = baseLayers[name].addTo(map);

    const meta = BASEMAP_STEPS.find((b) => b.id === name);
    if (meta) el.cycleBasemapLabel.textContent = meta.label;
    document.querySelectorAll("[data-basemap]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.basemap === name);
    });
  }

  function setRadius(meters) {
    state.radiusMeters = meters;
    el.cycleRadiusLabel.textContent = meters < 1000 ? `${meters}m` : `${(meters / 1000).toString().replace(".", ",")}km`;
    document.querySelectorAll("[data-radius]").forEach((b) => {
      b.classList.toggle("is-active", Number(b.dataset.radius) === meters);
    });

    if (state.filters.near.size > 0) applyFiltersAndRender(false);
    renderPoiLayers();
    if (state.selectedHouseId) {
      const house = state.houses.find((h) => h.id === state.selectedHouseId);
      if (house) {
        renderSelectionOverlay(house);
        if (state.drawerOpen) renderDetailDrawer(house);
      }
    }
  }

  function renderPoiCategoryDock() {
    el.poiCategoryBar.innerHTML = Object.values(CATEGORIES)
      .map((cat) => {
        const isOn = state.activeCategories.has(cat.id);
        return `
          <button type="button" class="cat-toggle ${isOn ? "is-on" : ""}" data-cat="${cat.id}" aria-pressed="${isOn}">
            <span class="cat-toggle__dot" style="background:${cat.color}">${cat.icon}</span>
            <span>${cat.label}</span>
          </button>
        `;
      })
      .join("");

    el.poiCategoryBar.querySelectorAll(".cat-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const catId = btn.dataset.cat;
        if (state.activeCategories.has(catId)) state.activeCategories.delete(catId);
        else state.activeCategories.add(catId);

        const on = state.activeCategories.has(catId);
        btn.classList.toggle("is-on", on);
        btn.setAttribute("aria-pressed", String(on));
        renderPoiLayers();
        if (state.selectedHouseId) {
          const house = state.houses.find((h) => h.id === state.selectedHouseId);
          if (house) renderSelectionOverlay(house);
        }
      });
    });
  }

  function createPoiPopupHtml(poi, house) {
    const cat = CATEGORIES[poi.categoria] || CATEGORIES.parque;
    let distHtml = "";
    if (house) {
      const d = Number.isFinite(poi.distance)
        ? poi.distance
        : haversine(house.lat, house.lng, poi.lat, poi.lng);
      distHtml = `<div class="poi-popup__dist">${formatDistance(d)} da casa · ${walkMinutes(d)} min a pé · ${bikeMinutes(d)} min de bike</div>`;
    }
    return `
      <div class="poi-popup">
        <div class="poi-popup__cat" style="color:${cat.color}">
          <span style="width:14px;height:14px;display:inline-grid;place-items:center">${cat.icon}</span>
          <span>${cat.label}</span>
        </div>
        <h4 class="poi-popup__title">${escapeHtml(poi.nome)}</h4>
        ${poi.detalhe ? `<p class="poi-popup__desc">${escapeHtml(poi.detalhe)}</p>` : ""}
        ${distHtml}
      </div>
    `;
  }

  function renderPoiLayers() {
    if (!map) return;
    cicloviaLayer.clearLayers();
    poiLayer.clearLayers();
    rotinaLayer.clearLayers();
    poiMarkers.clear();
    anchorMarkers.clear();

    const selectedHouse = state.selectedHouseId
      ? state.houses.find((h) => h.id === state.selectedHouseId)
      : null;

    // 0. Routine Anchors (Escola & Trabalho)
    if (state.activeCategories.has("rotina")) {
      for (const anchor of state.routineAnchors) {
        const cor = anchor.cor || (anchor.tipo === "trabalho" ? "#0369a1" : "#be185d");
        const icon = L.divIcon({
          className: "anchor-pin-wrap",
          html: `
            <div class="anchor-pin" style="--anchor-color:${cor}">
              <span class="anchor-pin__ico">${getAnchorIcon(anchor)}</span>
              <span>${escapeHtml(anchor.nome)}</span>
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker([anchor.lat, anchor.lng], {
          icon,
          zIndexOffset: 520,
        }).addTo(rotinaLayer);

        marker.bindPopup(() => {
          let distBlock = "";
          if (selectedHouse) {
            const road = roadApproxMeters(haversine(selectedHouse.lat, selectedHouse.lng, anchor.lat, anchor.lng));
            const dirUrl = `https://www.google.com/maps/dir/?api=1&origin=${selectedHouse.lat},${selectedHouse.lng}&destination=${anchor.lat},${anchor.lng}`;
            distBlock = `
              <div class="poi-popup__dist">
                Da casa selecionada: ~${formatDistance(road)}<br>
                🚗 ${driveMinutes(road)} min · 🚲 ${bikeMinutes(road)} min · 🚶 ${walkMinutes(road)} min
                <div style="margin-top:6px"><a href="${dirUrl}" target="_blank" rel="noopener noreferrer" style="color:${cor};font-weight:700">Ver rota no Google Maps ↗</a></div>
              </div>
            `;
          }
          return `
            <div class="poi-popup">
              <div class="poi-popup__cat" style="color:${cor}">
                <span style="width:14px;height:14px;display:inline-grid;place-items:center">${getAnchorIcon(anchor)}</span>
                <span>Ponto fixo da rotina</span>
              </div>
              <h4 class="poi-popup__title">${escapeHtml(anchor.nome)}</h4>
              <p class="poi-popup__desc"><strong>${escapeHtml(anchor.subtitulo || "")}</strong><br>${escapeHtml(anchor.endereco || anchor.detalhe || "")}</p>
              ${distBlock}
            </div>
          `;
        });

        marker.on("mouseover", () => {
          if (selectedHouse) highlightRouteToAnchor(selectedHouse, anchor);
        });
        marker.on("mouseout", () => clearRouteHighlight());

        anchorMarkers.set(anchor.id, { marker, anchor });
      }
    }

    if (state.activeCategories.has("ciclovia")) {
      for (const ciclo of state.cityData?.ciclovias || []) {
        L.polyline(ciclo.coords, {
          color: "#0d9488",
          weight: 8,
          opacity: 0.16,
          lineCap: "round",
          interactive: false,
        }).addTo(cicloviaLayer);

        const line = L.polyline(ciclo.coords, {
          color: "#0d9488",
          weight: 3.4,
          opacity: 0.88,
          dashArray: "8 6",
          lineCap: "round",
        }).addTo(cicloviaLayer);

        let distInfo = "";
        if (selectedHouse) {
          const nearest = closestPointOnPolyline(selectedHouse.lat, selectedHouse.lng, ciclo.coords);
          distInfo = `<div class="poi-popup__dist">${formatDistance(nearest.distance)} da casa · ${bikeMinutes(nearest.distance)} min de bike</div>`;
        }
        line.bindPopup(`
          <div class="poi-popup">
            <div class="poi-popup__cat" style="color:#0d9488">
              <span style="width:14px;height:14px;display:inline-grid;place-items:center">${CATEGORIES.ciclovia.icon}</span>
              <span>Ciclovia · ${ciclo.extensao_km || ""} km</span>
            </div>
            <h4 class="poi-popup__title">${escapeHtml(ciclo.nome)}</h4>
            <p class="poi-popup__desc">${escapeHtml(ciclo.detalhe || "")}</p>
            ${distInfo}
          </div>
        `);
      }
    }

    const poisToRender = [...state.allPois];
    if (selectedHouse && state.liveOsmPoisByHouse[selectedHouse.id]) {
      poisToRender.push(...state.liveOsmPoisByHouse[selectedHouse.id]);
    }

    for (const poi of poisToRender) {
      if (!state.activeCategories.has(poi.categoria)) continue;
      const cat = CATEGORIES[poi.categoria];
      if (!cat) continue;

      let stateClass = "";
      if (selectedHouse) {
        const d = haversine(selectedHouse.lat, selectedHouse.lng, poi.lat, poi.lng);
        stateClass = d <= state.radiusMeters ? "is-inside" : "is-dimmed";
      }

      const icon = L.divIcon({
        className: "poi-pin-wrap",
        html: `<div class="poi-pin ${stateClass}" style="background:${cat.color}" title="${escapeHtml(poi.nome)}">${cat.icon}</div>`,
        iconSize: [0, 0],
      });

      const marker = L.marker([poi.lat, poi.lng], {
        icon,
        zIndexOffset: stateClass === "is-inside" ? 260 : 80,
      }).addTo(poiLayer);

      marker.bindPopup(() => createPoiPopupHtml(poi, selectedHouse));
      marker.on("mouseover", () => {
        if (selectedHouse) highlightRouteToPoi(selectedHouse, poi);
      });
      marker.on("mouseout", () => clearRouteHighlight());

      poiMarkers.set(poi.id, { marker, poi });
    }
  }

  function renderHouseMarkers() {
    if (!map) return;
    houseLayer.clearLayers();
    houseMarkers.clear();

    for (const house of state.filteredHouses) {
      const isSelected = house.id === state.selectedHouseId;
      const isFav = Boolean(state.prefs.favorites[house.id]);
      const pinClass = [
        "house-pin",
        house.finalidade === "compra" ? "house-pin--compra" : "house-pin--aluguel",
        isSelected ? "is-selected" : "",
        house.id === state.hoveredHouseId ? "is-hovered" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const icon = L.divIcon({
        className: "house-pin-wrap",
        html: `
          <div class="${pinClass}" data-house-pin="${escapeHtml(house.id)}">
            <span class="house-pin__dot"></span>
            <span>${escapeHtml(formatCompactPrice(house.preco, house.finalidade))}</span>
            ${isFav ? '<span class="house-pin__heart" aria-label="Favorita">♥</span>' : ""}
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([house.lat, house.lng], {
        icon,
        zIndexOffset: isSelected ? 600 : 350,
      }).addTo(houseLayer);

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        if (!isDesktop() && state.activeTab === "mapa" && state.selectedHouseId !== house.id) {
          // Mobile: first tap focuses pin + radius + scrolls carousel card into view; tapping active pin or card opens details!
          focusHouseOnMap(house.id, { fly: true, scrollCarousel: true });
        } else {
          openHouseDetails(house.id, { fly: true });
        }
      });
      marker.on("mouseover", () => setHoveredHouse(house.id));
      marker.on("mouseout", () => setHoveredHouse(null));

      houseMarkers.set(house.id, marker);
    }
  }

  function renderSelectionOverlay(house) {
    selectionLayer.clearLayers();
    clearRouteHighlight();
    if (!house || !map) return;

    L.circle([house.lat, house.lng], {
      radius: state.radiusMeters,
      color: "#1b5e43",
      weight: 1.8,
      dashArray: "6 6",
      fillColor: "#1b5e43",
      fillOpacity: 0.065,
      interactive: false,
    }).addTo(selectionLayer);

    if (state.radiusMeters >= 1000) {
      L.circle([house.lat, house.lng], {
        radius: 400,
        color: "#1b5e43",
        weight: 1,
        opacity: 0.3,
        dashArray: "3 5",
        fill: false,
        interactive: false,
      }).addTo(selectionLayer);
    }

    const drawnCats = new Set();
    for (const item of house.nearby) {
      if (item.distance > state.radiusMeters) break;
      if (!state.activeCategories.has(item.categoria)) continue;
      if (drawnCats.has(item.categoria)) continue;
      drawnCats.add(item.categoria);

      const cat = CATEGORIES[item.categoria];
      L.polyline(
        [
          [house.lat, house.lng],
          [item.lat, item.lng],
        ],
        {
          color: cat.color,
          weight: 2,
          opacity: 0.55,
          dashArray: "4 6",
          interactive: false,
        }
      ).addTo(selectionLayer);
    }

    // Commute connectors to Escola & Trabalho when Rotina layer is active
    if (state.activeCategories.has("rotina") && Array.isArray(house.commutes)) {
      for (const c of house.commutes) {
        const cor = c.cor || (c.tipo === "trabalho" ? "#0369a1" : "#be185d");
        L.polyline(
          [
            [house.lat, house.lng],
            [c.lat, c.lng],
          ],
          {
            color: cor,
            weight: 2.6,
            opacity: 0.72,
            dashArray: "7 6",
            interactive: false,
          }
        ).addTo(selectionLayer);

        const midLat = (house.lat + c.lat) / 2;
        const midLng = (house.lng + c.lng) / 2;
        const shortName = c.tipo === "trabalho" ? "Trabalho" : "Escola";
        L.marker([midLat, midLng], {
          interactive: false,
          zIndexOffset: 540,
          icon: L.divIcon({
            className: "dist-tag-wrap",
            html: `<span class="dist-tag" style="background:${cor}">${shortName}: ${formatDistance(c.roadMeters)} · ${c.driveMin} min</span>`,
            iconSize: [0, 0],
          }),
        }).addTo(selectionLayer);
      }
    }
  }

  function highlightRouteToAnchor(house, anchor) {
    clearRouteHighlight();
    if (!house || !anchor || !map) return;
    const cor = anchor.cor || (anchor.tipo === "trabalho" ? "#0369a1" : "#be185d");
    const road = roadApproxMeters(haversine(house.lat, house.lng, anchor.lat, anchor.lng));

    L.polyline(
      [
        [house.lat, house.lng],
        [anchor.lat, anchor.lng],
      ],
      {
        color: cor,
        weight: 4,
        opacity: 0.96,
        dashArray: "8 5",
        interactive: false,
      }
    ).addTo(routeHighlightLayer);

    const midLat = (house.lat + anchor.lat) / 2;
    const midLng = (house.lng + anchor.lng) / 2;
    L.marker([midLat, midLng], {
      interactive: false,
      zIndexOffset: 760,
      icon: L.divIcon({
        className: "dist-tag-wrap",
        html: `<span class="dist-tag" style="background:${cor}">${escapeHtml(anchor.nome)} · ~${formatDistance(road)} · ${driveMinutes(road)} min carro</span>`,
        iconSize: [0, 0],
      }),
    }).addTo(routeHighlightLayer);
  }

  function highlightRouteToPoi(house, poi) {
    clearRouteHighlight();
    if (!house || !poi || !map) return;
    const cat = CATEGORIES[poi.categoria] || CATEGORIES.parque;
    const dist = Number.isFinite(poi.distance)
      ? poi.distance
      : haversine(house.lat, house.lng, poi.lat, poi.lng);

    L.polyline(
      [
        [house.lat, house.lng],
        [poi.lat, poi.lng],
      ],
      {
        color: cat.color,
        weight: 3.4,
        opacity: 0.95,
        dashArray: "6 6",
        interactive: false,
      }
    ).addTo(routeHighlightLayer);

    const midLat = (house.lat + poi.lat) / 2;
    const midLng = (house.lng + poi.lng) / 2;
    const labelText =
      poi.categoria === "ciclovia"
        ? `${formatDistance(dist)} · ${bikeMinutes(dist)} min bike`
        : `${formatDistance(dist)} · ${walkMinutes(dist)} min a pé`;

    L.marker([midLat, midLng], {
      interactive: false,
      zIndexOffset: 700,
      icon: L.divIcon({
        className: "dist-tag-wrap",
        html: `<span class="dist-tag" style="background:${cat.color}">${escapeHtml(labelText)}</span>`,
        iconSize: [0, 0],
      }),
    }).addTo(routeHighlightLayer);

    const entry = poiMarkers.get(poi.id);
    if (entry) {
      const domEl = entry.marker.getElement()?.querySelector(".poi-pin");
      if (domEl) domEl.classList.add("is-highlighted");
    }
  }

  function clearRouteHighlight() {
    if (routeHighlightLayer) routeHighlightLayer.clearLayers();
    document.querySelectorAll(".poi-pin.is-highlighted").forEach((n) => n.classList.remove("is-highlighted"));
  }

  function fitMapToHouses() {
    if (!map) return;
    if (state.filteredHouses.length === 0) {
      const c = state.cityData?.centro || { lat: -23.4252, lng: -51.9336 };
      map.flyTo([c.lat, c.lng], 13, { duration: 0.5 });
      return;
    }
    if (state.filteredHouses.length === 1) {
      const h = state.filteredHouses[0];
      map.flyTo([h.lat, h.lng], 15, { duration: 0.5 });
      return;
    }
    const bounds = L.latLngBounds(state.filteredHouses.map((h) => [h.lat, h.lng]));
    const padBottom = isDesktop() ? 70 : 155;
    const padTop = isDesktop() ? 70 : 130;
    map.fitBounds(bounds, {
      paddingTopLeft: [36, padTop],
      paddingBottomRight: [56, padBottom],
      maxZoom: 15,
      animate: true,
    });
  }

  // ==================== FILTERING, LISTINGS & MOBILE MAP CAROUSEL ====================

  function countActiveFilters() {
    const f = state.filters;
    let n = 0;
    if (f.finalidade !== "todas") n++;
    if (f.minQuartos > 0) n++;
    if (f.pets) n++;
    if (f.quintal) n++;
    if (f.favoritas) n++;
    n += f.near.size;
    return n;
  }

  function syncFilterControlsUI() {
    const f = state.filters;
    const activeCount = countActiveFilters();
    el.filterCountBadge.textContent = String(activeCount);
    el.filterCountBadge.hidden = activeCount === 0;
    el.openFiltersBtn.classList.toggle("has-active", activeCount > 0);

    document.querySelectorAll("[data-finalidade]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.finalidade === f.finalidade);
    });
    document.querySelectorAll("[data-quartos]").forEach((b) => {
      b.classList.toggle("is-active", Number(b.dataset.quartos) === f.minQuartos);
    });
    document.querySelectorAll("[data-toggle]").forEach((b) => {
      b.classList.toggle("is-active", Boolean(f[b.dataset.toggle]));
    });
    document.querySelectorAll("[data-near]").forEach((b) => {
      b.classList.toggle("is-active", f.near.has(b.dataset.near));
    });
    el.sortFilter.value = f.sort;
    el.sheetSortSelect.value = f.sort;
  }

  function getHousesForCurrentList() {
    if (!isDesktop() && state.activeTab === "salvas") {
      return state.houses.filter((h) => {
        const isFav = Boolean(state.prefs.favorites[h.id]);
        const st = state.prefs.status[h.id] || "";
        const hasNote = Boolean(state.prefs.notes[h.id]);
        if (state.savedFilter === "fav") return isFav;
        if (state.savedFilter === "visitar") return st === "visitar";
        if (state.savedFilter === "visitada") return st === "visitada";
        return isFav || Boolean(st) || hasNote;
      });
    }
    return state.filteredHouses;
  }

  function applyFiltersAndRender(shouldFitBounds = false) {
    const f = state.filters;
    const q = normalizeText(f.query);

    let list = state.houses.filter((h) => {
      if (f.finalidade !== "todas" && h.finalidade !== f.finalidade) return false;
      if (f.minQuartos > 0 && h.quartos < f.minQuartos) return false;
      if (f.pets && !h.aceita_pets) return false;
      if (f.quintal && !h.quintal) return false;
      if (f.favoritas && !state.prefs.favorites[h.id]) return false;

      for (const cat of f.near) {
        const nearest = h.nearestByCat[cat];
        if (!nearest || nearest.distance > state.radiusMeters) return false;
      }

      if (q) {
        const hay = normalizeText(
          `${h.titulo} ${h.bairro} ${h.endereco} ${h.tipo} ${h.descricao} ${h.nota_grokbot} ${h.tags.join(" ")}`
        );
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (f.sort === "rotina") return a.routineCombinedDist - b.routineCombinedDist;
      if (f.sort === "escola") return a.schoolDist - b.schoolDist;
      if (f.sort === "trabalho") return a.workDist - b.workDist;
      if (f.sort === "preco_asc") return (a.preco || Infinity) - (b.preco || Infinity);
      if (f.sort === "preco_desc") return (b.preco || 0) - (a.preco || 0);
      if (f.sort === "area_desc") return (b.area_m2 || 0) - (a.area_m2 || 0);
      if (f.sort === "recente") return String(b.encontrado_em).localeCompare(String(a.encontrado_em));
      return b.overallScore + (b.destaque ? 4 : 0) - (a.overallScore + (a.destaque ? 4 : 0));
    });

    state.filteredHouses = list;
    syncFilterControlsUI();

    el.navListCount.textContent = String(list.length);
    el.sheetApplyFiltersBtn.textContent =
      list.length === 1 ? "Ver 1 casa" : `Ver ${list.length} casas`;
    el.resultsCount.textContent =
      list.length === state.houses.length
        ? `${list.length} ${list.length === 1 ? "casa" : "casas"} em Maringá`
        : `Mostrando ${list.length} de ${state.houses.length} casas`;
    el.resetFiltersBtn.hidden = countActiveFilters() === 0 && !f.query;

    renderListings();
    renderMapCarousel();
    renderHouseMarkers();
    if (shouldFitBounds) fitMapToHouses();
  }

  function renderListings() {
    const list = getHousesForCurrentList();
    const isSavedView = !isDesktop() && state.activeTab === "salvas";

    if (isSavedView) {
      el.savedSubtitle.textContent = `${list.length} ${list.length === 1 ? "casa salva" : "casas salvas"} neste aparelho`;
    }

    if (list.length === 0) {
      el.listingsContainer.innerHTML = "";
      el.emptyState.hidden = false;
      if (isSavedView) {
        el.emptyTitle.textContent = "Nenhuma casa salva ainda";
        el.emptyDesc.textContent = "Toque no coração ou adicione uma anotação em qualquer casa no mapa para acompanhá-la aqui.";
        el.emptyResetBtn.textContent = "Explorar no mapa";
      } else {
        el.emptyTitle.textContent = "Nenhuma casa com esses filtros";
        el.emptyDesc.textContent = "Tente remover um filtro de proximidade ou ampliar a busca em Maringá.";
        el.emptyResetBtn.textContent = "Mostrar todas as casas";
      }
      return;
    }

    el.emptyState.hidden = true;
    el.listingsContainer.innerHTML = list.map(renderHouseCard).join("");

    el.listingsContainer.querySelectorAll(".house-card").forEach((card) => {
      const id = card.dataset.houseId;
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-card-action]")) return;
        openHouseDetails(id, { fly: true });
      });
      card.addEventListener("mouseenter", () => setHoveredHouse(id));
      card.addEventListener("mouseleave", () => setHoveredHouse(null));
    });

    el.listingsContainer.querySelectorAll("[data-card-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.houseId;
        const action = btn.dataset.cardAction;
        if (action === "fav") toggleFavorite(id);
        if (action === "compare") toggleCompare(id);
      });
    });

    el.listingsContainer.querySelectorAll("img[data-fallback-house]").forEach((img) => {
      img.addEventListener("error", () => {
        const house = state.houses.find((h) => h.id === img.dataset.fallbackHouse);
        if (house) img.outerHTML = buildHouseIllustration(house);
      });
    });
  }

  function renderHouseCard(house) {
    const isFav = Boolean(state.prefs.favorites[house.id]);
    const isCmp = state.compareIds.includes(house.id);
    const isSelected = house.id === state.selectedHouseId;
    const statusId = state.prefs.status[house.id] || "";
    const statusObj = STATUS_OPTIONS.find((s) => s.id === statusId && s.id);

    const mediaHtml = house.fotos.length
      ? `<img src="${escapeHtml(house.fotos[0])}" alt="${escapeHtml(house.titulo)}" loading="lazy" data-fallback-house="${escapeHtml(house.id)}">`
      : buildHouseIllustration(house);

    const highlightCats = ["pet", "ciclovia", "academia", "parque"]
      .map((cid) => house.nearestByCat[cid])
      .filter(Boolean)
      .slice(0, 3);

    const nearbyPills = highlightCats
      .map((item) => {
        const cat = CATEGORIES[item.categoria];
        return `
          <span class="near-pill" title="${escapeHtml(item.nome)}">
            <span class="near-pill__dot" style="background:${cat.color}">${cat.icon}</span>
            <span>${formatDistance(item.distance)}</span>
          </span>
        `;
      })
      .join("");

    const specs = [
      house.quartos ? `<span class="spec">${UI_ICONS.bed} ${house.quartos} qto${house.quartos > 1 ? "s" : ""}</span>` : "",
      house.banheiros ? `<span class="spec">${UI_ICONS.bath} ${house.banheiros}</span>` : "",
      house.vagas ? `<span class="spec">${UI_ICONS.car} ${house.vagas}</span>` : "",
      house.area_m2 ? `<span class="spec">${UI_ICONS.area} ${house.area_m2} m²</span>` : "",
    ]
      .filter(Boolean)
      .join("");

    const commuteStrip = (house.commutes || [])
      .map(
        (c) => `
          <div class="commute-chip" title="${escapeHtml(c.nome)} — ${escapeHtml(c.subtitulo || "")}">
            <span class="commute-chip__ico" style="background:${c.cor || "#be185d"}">${getAnchorIcon(c)}</span>
            <div class="commute-chip__text">
              <span>${c.tipo === "trabalho" ? "Trabalho" : "Escola"}</span>
              <strong>~${formatDistance(c.roadMeters)} · ${c.driveMin} min</strong>
            </div>
          </div>
        `
      )
      .join("");

    return `
      <article class="house-card ${isSelected ? "is-selected" : ""}" data-house-id="${escapeHtml(house.id)}" role="listitem">
        <div class="house-card__media">
          ${mediaHtml}
          <div class="house-card__badges">
            <span class="pill-badge pill-badge--${house.finalidade}">${house.finalidade === "compra" ? "Compra" : "Aluguel"}</span>
            ${house.destaque ? '<span class="pill-badge pill-badge--destaque">Destaque</span>' : ""}
            ${statusObj ? `<span class="pill-badge pill-badge--status">${escapeHtml(statusObj.label)}</span>` : ""}
          </div>
          <div class="house-card__top-actions">
            <button type="button" class="card-action-btn ${isCmp ? "is-cmp" : ""}" data-card-action="compare" data-house-id="${escapeHtml(house.id)}" title="Comparar" aria-label="Comparar">
              ${UI_ICONS.compare}
            </button>
            <button type="button" class="card-action-btn ${isFav ? "is-fav" : ""}" data-card-action="fav" data-house-id="${escapeHtml(house.id)}" title="Favoritar" aria-label="Favoritar">
              ${UI_ICONS.heart}
            </button>
          </div>
        </div>

        <div class="house-card__body">
          <div class="house-card__price-row">
            <div class="house-card__price">
              ${formatCurrency(house.preco)}
              ${house.finalidade === "aluguel" && house.preco ? "<small>/mês</small>" : ""}
            </div>
            <span class="house-card__score">Entorno ${house.overallScore}</span>
          </div>

          <h3 class="house-card__title">${escapeHtml(house.titulo)}</h3>
          <p class="house-card__loc">${UI_ICONS.pin} <span>${escapeHtml(house.bairro)}${house.endereco ? ` · ${escapeHtml(house.endereco)}` : ""}</span></p>

          ${specs ? `<div class="house-card__specs">${specs}</div>` : ""}
          ${commuteStrip ? `<div class="house-card__commute">${commuteStrip}</div>` : ""}
          ${nearbyPills ? `<div class="house-card__nearby">${nearbyPills}</div>` : ""}
          ${house.nota_grokbot ? `<p class="house-card__bot">${escapeHtml(house.nota_grokbot)}</p>` : ""}
        </div>
      </article>
    `;
  }

  // Mobile swipeable horizontal peek-cards floating over the map
  function renderMapCarousel() {
    if (state.filteredHouses.length === 0) {
      el.mapCarouselWrap.hidden = true;
      el.mapCarousel.innerHTML = "";
      return;
    }

    el.mapCarouselWrap.hidden = false;
    el.mapCarousel.innerHTML = state.filteredHouses
      .map((h) => {
        const isSelected = h.id === state.selectedHouseId;
        const thumbHtml = h.fotos.length
          ? `<img src="${escapeHtml(h.fotos[0])}" alt="${escapeHtml(h.titulo)}" loading="lazy" data-fallback-compact="${escapeHtml(h.id)}">`
          : buildHouseIllustration(h, true);

        const nearTop = ["pet", "ciclovia", "academia"]
          .map((c) => h.nearestByCat[c])
          .filter(Boolean)
          .slice(0, 3)
          .map((item) => {
            const cat = CATEGORIES[item.categoria];
            return `
              <span class="peek-near">
                <span class="peek-near__dot" style="background:${cat.color}">${cat.icon}</span>
                <span>${formatDistance(item.distance)}</span>
              </span>
            `;
          })
          .join("");

        const commuteMini = (h.commutes || [])
          .map(
            (c) => `
              <span class="peek-commute">
                <span class="peek-commute__dot" style="background:${c.cor || "#be185d"}"></span>
                <span>${c.tipo === "trabalho" ? "Trabalho" : "Escola"} ${formatDistance(c.roadMeters)}</span>
              </span>
            `
          )
          .join("");

        return `
          <button type="button" class="peek-card ${isSelected ? "is-selected" : ""}" data-peek-id="${escapeHtml(h.id)}">
            <div class="peek-card__thumb">
              ${thumbHtml}
              <span class="peek-card__tag ${h.finalidade === "compra" ? "peek-card__tag--compra" : ""}">${h.finalidade === "compra" ? "Compra" : "Aluguel"}</span>
            </div>
            <div class="peek-card__info">
              <div class="peek-card__top">
                <span class="peek-card__price">${formatCompactPrice(h.preco, h.finalidade)}${h.finalidade === "aluguel" ? "<small>/mês</small>" : ""}</span>
                <span class="peek-card__score">${h.overallScore}</span>
              </div>
              <p class="peek-card__title">${escapeHtml(h.titulo)}</p>
              <p class="peek-card__sub">${escapeHtml(h.bairro)}${h.quartos ? ` · ${h.quartos} qtos` : ""}${h.area_m2 ? ` · ${h.area_m2}m²` : ""}</p>
              ${commuteMini ? `<div class="peek-card__commute">${commuteMini}</div>` : ""}
              <div class="peek-card__near">${nearTop}</div>
            </div>
          </button>
        `;
      })
      .join("");

    el.mapCarousel.querySelectorAll(".peek-card").forEach((card) => {
      card.addEventListener("click", () => {
        openHouseDetails(card.dataset.peekId, { fly: true });
      });
    });

    el.mapCarousel.querySelectorAll("img[data-fallback-compact]").forEach((img) => {
      img.addEventListener("error", () => {
        const house = state.houses.find((h) => h.id === img.dataset.fallbackCompact);
        if (house) img.outerHTML = buildHouseIllustration(house, true);
      });
    });
  }

  // Auto-sync map focus when user swipes horizontally through the mobile map carousel!
  let carouselScrollTimer = null;
  function handleCarouselScroll() {
    if (isDesktop() || state.activeTab !== "mapa") return;
    clearTimeout(carouselScrollTimer);
    carouselScrollTimer = setTimeout(() => {
      const cards = [...el.mapCarousel.querySelectorAll(".peek-card")];
      if (!cards.length) return;
      const center = el.mapCarousel.scrollLeft + el.mapCarousel.clientWidth / 2;
      let closestCard = cards[0];
      let minDelta = Infinity;
      for (const c of cards) {
        const cardCenter = c.offsetLeft + c.offsetWidth / 2;
        const delta = Math.abs(center - cardCenter);
        if (delta < minDelta) {
          minDelta = delta;
          closestCard = c;
        }
      }
      const id = closestCard.dataset.peekId;
      if (id && id !== state.selectedHouseId) {
        focusHouseOnMap(id, { fly: true, scrollCarousel: false });
      }
    }, 110);
  }

  function setHoveredHouse(houseId) {
    if (state.hoveredHouseId === houseId) return;
    const prev = state.hoveredHouseId;
    state.hoveredHouseId = houseId;

    if (prev) {
      const prevPin = document.querySelector(`[data-house-pin="${CSS.escape(prev)}"]`);
      if (prevPin) prevPin.classList.remove("is-hovered");
      const prevCard = document.querySelector(`.house-card[data-house-id="${CSS.escape(prev)}"]`);
      if (prevCard) prevCard.classList.remove("is-hovered");
    }
    if (houseId) {
      const pin = document.querySelector(`[data-house-pin="${CSS.escape(houseId)}"]`);
      if (pin) pin.classList.add("is-hovered");
      const card = document.querySelector(`.house-card[data-house-id="${CSS.escape(houseId)}"]`);
      if (card) card.classList.add("is-hovered");
    }
  }

  // Focus a house on the map (radius + POIs + carousel highlight) without necessarily opening the full detail sheet
  function focusHouseOnMap(houseId, { fly = true, scrollCarousel = true } = {}) {
    const house = state.houses.find((h) => h.id === houseId);
    if (!house) return;

    state.selectedHouseId = houseId;
    el.mapHint.classList.add("is-hidden");

    renderHouseMarkers();
    renderPoiLayers();
    renderSelectionOverlay(house);

    el.mapCarousel.querySelectorAll(".peek-card").forEach((c) => {
      c.classList.toggle("is-selected", c.dataset.peekId === houseId);
    });

    if (scrollCarousel && !isDesktop()) {
      const card = el.mapCarousel.querySelector(`.peek-card[data-peek-id="${CSS.escape(houseId)}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    if (fly && map) {
      const zoom = state.radiusMeters <= 500 ? 16 : state.radiusMeters <= 1000 ? 15 : 14;
      // Offset slightly upward on mobile so the house sits comfortably above the carousel
      map.flyTo([house.lat - (isDesktop() ? 0 : 0.0012), house.lng], Math.max(map.getZoom(), zoom), {
        duration: 0.55,
      });
    }
  }

  // ==================== HOUSE DETAIL SHEET / DRAWER ====================

  function openHouseDetails(houseId, { fly = true } = {}) {
    const house = state.houses.find((h) => h.id === houseId);
    if (!house) return;

    state.activePhotoIndex = 0;
    state.drawerOpen = true;
    focusHouseOnMap(houseId, { fly, scrollCarousel: true });

    renderDetailDrawer(house);
    el.detailDrawer.classList.add("is-open");
    el.detailDrawer.setAttribute("aria-hidden", "false");
    el.drawerBackdrop.hidden = isDesktop();
  }

  function closeDrawer(clearSelection = false) {
    state.drawerOpen = false;
    el.detailDrawer.classList.remove("is-open");
    el.detailDrawer.setAttribute("aria-hidden", "true");
    el.drawerBackdrop.hidden = true;

    if (clearSelection) {
      state.selectedHouseId = null;
      el.mapHint.classList.remove("is-hidden");
      if (selectionLayer) selectionLayer.clearLayers();
      clearRouteHighlight();
      renderHouseMarkers();
      renderPoiLayers();
      document.querySelectorAll(".house-card.is-selected, .peek-card.is-selected").forEach((c) => {
        c.classList.remove("is-selected");
      });
    }
  }

  function renderDetailDrawer(house) {
    const isFav = Boolean(state.prefs.favorites[house.id]);
    const isCmp = state.compareIds.includes(house.id);
    const currentStatus = state.prefs.status[house.id] || "";
    const currentNote = state.prefs.notes[house.id] || "";

    el.drawerFavBtn.classList.toggle("is-active", isFav);
    el.drawerCompareBtn.classList.toggle("is-compare-active", isCmp);

    const hasPhotos = house.fotos.length > 0;
    const photoUrl = hasPhotos ? house.fotos[state.activePhotoIndex % house.fotos.length] : null;
    const heroHtml = photoUrl
      ? `
        <img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(house.titulo)}" id="drawerHeroImg">
        ${
          house.fotos.length > 1
            ? `<div class="detail-hero__nav">
                <button type="button" id="prevPhotoBtn" aria-label="Foto anterior">‹</button>
                <button type="button" id="nextPhotoBtn" aria-label="Próxima foto">›</button>
              </div>`
            : ""
        }
      `
      : buildHouseIllustration(house);

    const costParts = [];
    if (house.condominio) costParts.push(`Condomínio ${formatCurrency(house.condominio)}`);
    if (house.iptu) costParts.push(`IPTU ${formatCurrency(house.iptu)}/mês`);
    if (house.preco && house.area_m2) {
      costParts.push(`${formatCurrency(Math.round(house.preco / house.area_m2))}/m²`);
    }

    const featureTags = [
      house.aceita_pets ? { text: "Aceita pets", accent: true } : null,
      house.quintal ? { text: "Com quintal", accent: true } : null,
      house.mobiliada ? { text: "Mobiliada", accent: false } : null,
      house.terreno_m2 ? { text: `Terreno ${house.terreno_m2} m²`, accent: false } : null,
      ...house.tags.map((t) => ({ text: t, accent: false })),
    ].filter(Boolean);

    const lifeMeta = [
      { key: "pet", label: "Vida pet", color: CATEGORIES.pet.color },
      { key: "ciclovia", label: "Ciclovias", color: CATEGORIES.ciclovia.color },
      { key: "academia", label: "Academias", color: CATEGORIES.academia.color },
      { key: "parque", label: "Áreas verdes", color: CATEGORIES.parque.color },
      { key: "conveniencia", label: "Conveniência", color: CATEGORIES.mercado.color },
    ];

    const lifeBarsHtml = lifeMeta
      .map(
        (m) => `
      <div class="life-row">
        <span class="life-row__label">
          <span style="width:8px;height:8px;border-radius:50%;background:${m.color};flex:none"></span>
          ${m.label}
        </span>
        <div class="life-row__bar">
          <div class="life-row__fill" style="width:${house.scores[m.key]}%;background:${m.color}"></div>
        </div>
        <span class="life-row__val">${house.scores[m.key]}</span>
      </div>
    `
      )
      .join("");

    const insideRadius = house.nearby.filter((item) => item.distance <= state.radiusMeters);
    const nearbyDisplay = insideRadius.length >= 4 ? insideRadius.slice(0, 14) : house.nearby.slice(0, 8);

    const nearbyHtml = nearbyDisplay
      .map((item) => {
        const cat = CATEGORIES[item.categoria] || CATEGORIES.parque;
        const timeStr =
          item.categoria === "ciclovia"
            ? `${bikeMinutes(item.distance)} min bike`
            : `${walkMinutes(item.distance)} min a pé`;
        return `
          <button type="button" class="nearby-item" data-nearby-id="${escapeHtml(item.id)}">
            <span class="nearby-item__ico" style="background:${cat.color}">${cat.icon}</span>
            <span class="nearby-item__info">
              <span class="nearby-item__name">${escapeHtml(item.nome)}</span>
              <span class="nearby-item__sub">${escapeHtml(cat.label)}${item.source === "osm" ? " · OpenStreetMap" : item.source === "grokbot" ? " · Grokbot" : ""}</span>
            </span>
            <span class="nearby-item__dist">
              <strong>${formatDistance(item.distance)}</strong>
              <small>${timeStr}</small>
            </span>
          </button>
        `;
      })
      .join("");

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${house.lat},${house.lng}`;
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${house.lat},${house.lng}`;
    const osmLoaded = Boolean(state.liveOsmPoisByHouse[house.id]);

    const routineCardsHtml = (house.commutes || [])
      .map((c) => {
        const cor = c.cor || (c.tipo === "trabalho" ? "#0369a1" : "#be185d");
        const dirUrl = `https://www.google.com/maps/dir/?api=1&origin=${house.lat},${house.lng}&destination=${c.lat},${c.lng}`;
        return `
          <div class="routine-card" data-routine-id="${escapeHtml(c.id)}">
            <div class="routine-card__top">
              <span class="routine-card__ico" style="background:${cor}">${getAnchorIcon(c)}</span>
              <div class="routine-card__title">
                <strong>${escapeHtml(c.nome)}</strong>
                <small>${escapeHtml(c.subtitulo || c.endereco || "")}</small>
              </div>
              <div class="routine-card__dist">
                <strong>~${formatDistance(c.roadMeters)}</strong>
                <small>${c.driveMin} min carro</small>
              </div>
            </div>
            <div class="routine-card__modes">
              <div class="routine-card__times">
                <span>🚗 ${c.driveMin} min</span>
                <span>🚲 ${c.bikeMin} min</span>
                <span>🚶 ${c.walkMin} min</span>
              </div>
              <div class="routine-card__actions">
                <button type="button" class="routine-mini-btn" data-show-anchor="${escapeHtml(c.id)}">Ver no mapa</button>
                <a class="routine-mini-btn" href="${dirUrl}" target="_blank" rel="noopener noreferrer">Rota Maps ↗</a>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    el.drawerBody.innerHTML = `
      <div class="detail-hero">${heroHtml}</div>

      <div class="detail-section">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:wrap">
          <span class="pill-badge pill-badge--${house.finalidade}">${house.finalidade === "compra" ? "Compra" : "Aluguel"}</span>
          <span class="pill-badge">${escapeHtml(house.tipo)}</span>
          ${house.portal ? `<span class="pill-badge">${escapeHtml(house.portal)}</span>` : ""}
          ${house.approxCoords ? `<span class="pill-badge">Posição aprox. pelo bairro</span>` : ""}
        </div>

        <p class="detail-price">
          ${formatCurrency(house.preco)}${house.finalidade === "aluguel" && house.preco ? `<span style="font-family:var(--font-sans);font-size:14px;font-weight:500;color:var(--ink-subtle)"> /mês</span>` : ""}
        </p>
        ${costParts.length ? `<p class="detail-costs">${escapeHtml(costParts.join(" · "))}</p>` : ""}

        <h2 class="detail-title">${escapeHtml(house.titulo)}</h2>
        <p class="detail-address">${escapeHtml(house.bairro)}${house.endereco ? ` · ${escapeHtml(house.endereco)}` : ""} · Maringá, PR</p>

        <div class="detail-specs-grid">
          <div class="spec-box"><strong>${house.quartos || "—"}</strong><span>Quartos${house.suites ? ` (${house.suites}s)` : ""}</span></div>
          <div class="spec-box"><strong>${house.banheiros || "—"}</strong><span>Banheiros</span></div>
          <div class="spec-box"><strong>${house.vagas || "—"}</strong><span>Vagas</span></div>
          <div class="spec-box"><strong>${house.area_m2 ? `${house.area_m2}m²` : "—"}</strong><span>Área útil</span></div>
        </div>

        ${
          featureTags.length
            ? `<div class="detail-tags">${featureTags
                .map((t) => `<span class="detail-tag ${t.accent ? "detail-tag--accent" : ""}">${escapeHtml(t.text)}</span>`)
                .join("")}</div>`
            : ""
        }

        ${house.descricao ? `<p style="margin:14px 0 0;color:var(--ink-muted);font-size:13.5px;line-height:1.6">${escapeHtml(house.descricao)}</p>` : ""}

        ${
          house.nota_grokbot
            ? `<div class="grokbot-box">
                <div class="grokbot-box__label">✦ Análise do Grokbot</div>
                <p>${escapeHtml(house.nota_grokbot)}</p>
              </div>`
            : ""
        }
      </div>

      ${
        routineCardsHtml
          ? `<div class="detail-section">
              <div class="detail-section__head">
                <h3>Distância na rotina diária</h3>
                <small style="color:var(--ink-subtle);font-size:11.5px">Estimativa urbana</small>
              </div>
              <div class="routine-grid">${routineCardsHtml}</div>
            </div>`
          : ""
      }

      <div class="detail-section">
        <div class="detail-section__head">
          <h3>O que tem por perto (${formatDistance(state.radiusMeters)})</h3>
          <span class="house-card__score">Nota ${house.overallScore}/100</span>
        </div>

        <div class="lifestyle-bars">${lifeBarsHtml}</div>

        <div class="nearby-list">${nearbyHtml}</div>

        <button type="button" class="btn-outline osm-scan-btn" id="osmScanBtn" ${osmLoaded ? "disabled" : ""}>
          ${osmLoaded ? "✓ Lugares extras do OpenStreetMap carregados" : "Explorar mais lugares ao vivo (OpenStreetMap)"}
        </button>
      </div>

      <div class="detail-section">
        <div class="detail-section__head">
          <h3>Minhas anotações</h3>
          <small style="color:var(--ink-subtle);font-size:11.5px">Salvo no aparelho</small>
        </div>
        <div class="status-pills">
          ${STATUS_OPTIONS.map(
            (opt) =>
              `<button type="button" class="status-pill ${currentStatus === opt.id ? "is-active" : ""}" data-status-val="${opt.id}">${opt.label}</button>`
          ).join("")}
        </div>
        <textarea class="notes-area" id="drawerNotesInput" placeholder="Ex: Sol da manhã na sala, rua silenciosa, perguntar sobre pets grandes…">${escapeHtml(currentNote)}</textarea>
      </div>

      <div class="detail-section">
        <div class="detail-cta-row">
          ${
            house.link
              ? `<a class="btn-primary" href="${escapeHtml(house.link)}" target="_blank" rel="noopener noreferrer">Abrir anúncio original ${UI_ICONS.external}</a>`
              : ""
          }
          <a class="btn-outline" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Google Maps</a>
          <a class="btn-outline" href="${streetViewUrl}" target="_blank" rel="noopener noreferrer">Street View</a>
        </div>
      </div>
    `;

    const heroImg = document.getElementById("drawerHeroImg");
    if (heroImg) {
      heroImg.addEventListener("error", () => {
        heroImg.outerHTML = buildHouseIllustration(house);
      });
    }
    const prevBtn = document.getElementById("prevPhotoBtn");
    const nextBtn = document.getElementById("nextPhotoBtn");
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        state.activePhotoIndex = (state.activePhotoIndex - 1 + house.fotos.length) % house.fotos.length;
        renderDetailDrawer(house);
      });
      nextBtn.addEventListener("click", () => {
        state.activePhotoIndex = (state.activePhotoIndex + 1) % house.fotos.length;
        renderDetailDrawer(house);
      });
    }

    // Wire routine anchor cards (Escola & Trabalho)
    el.drawerBody.querySelectorAll("[data-show-anchor]").forEach((btn) => {
      const anchor = (house.commutes || []).find((c) => c.id === btn.dataset.showAnchor);
      if (!anchor) return;
      btn.addEventListener("mouseenter", () => highlightRouteToAnchor(house, anchor));
      btn.addEventListener("mouseleave", () => clearRouteHighlight());
      btn.addEventListener("click", () => {
        if (!state.activeCategories.has("rotina")) {
          state.activeCategories.add("rotina");
          renderPoiCategoryDock();
          renderPoiLayers();
        }
        if (!isDesktop()) {
          closeDrawer(false);
          switchMobileTab("mapa");
        }
        highlightRouteToAnchor(house, anchor);
        const bounds = L.latLngBounds([
          [house.lat, house.lng],
          [anchor.lat, anchor.lng],
        ]);
        map.fitBounds(bounds, {
          paddingTopLeft: [50, isDesktop() ? 80 : 140],
          paddingBottomRight: [50, isDesktop() ? 80 : 165],
          maxZoom: 16,
          animate: true,
        });
        const entry = anchorMarkers.get(anchor.id);
        if (entry) setTimeout(() => entry.marker.openPopup(), 450);
      });
    });

    el.drawerBody.querySelectorAll(".nearby-item").forEach((btn) => {
      const item = house.nearby.find((n) => n.id === btn.dataset.nearbyId);
      if (!item) return;

      btn.addEventListener("mouseenter", () => highlightRouteToPoi(house, item));
      btn.addEventListener("mouseleave", () => clearRouteHighlight());
      btn.addEventListener("click", () => {
        if (!state.activeCategories.has(item.categoria)) {
          state.activeCategories.add(item.categoria);
          renderPoiCategoryDock();
          renderPoiLayers();
        }
        if (!isDesktop()) {
          closeDrawer(false);
          switchMobileTab("mapa");
        }
        highlightRouteToPoi(house, item);
        map.flyTo([(house.lat + item.lat) / 2, (house.lng + item.lng) / 2], 16, { duration: 0.5 });
        const markerEntry = poiMarkers.get(item.id);
        if (markerEntry) setTimeout(() => markerEntry.marker.openPopup(), 450);
      });
    });

    const osmBtn = document.getElementById("osmScanBtn");
    if (osmBtn && !osmLoaded) {
      osmBtn.addEventListener("click", () => fetchLiveOsmPois(house, osmBtn));
    }

    el.drawerBody.querySelectorAll("[data-status-val]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.dataset.statusVal;
        if (val) state.prefs.status[house.id] = val;
        else delete state.prefs.status[house.id];
        savePrefs();
        el.drawerBody.querySelectorAll("[data-status-val]").forEach((b) => {
          b.classList.toggle("is-active", b.dataset.statusVal === val);
        });
        renderListings();
      });
    });

    const notesInput = document.getElementById("drawerNotesInput");
    if (notesInput) {
      notesInput.addEventListener("input", () => {
        const text = notesInput.value.trim();
        if (text) state.prefs.notes[house.id] = notesInput.value;
        else delete state.prefs.notes[house.id];
        savePrefs();
      });
    }
  }

  async function fetchLiveOsmPois(house, button) {
    button.disabled = true;
    button.textContent = "Consultando OpenStreetMap…";

    const r = Math.min(state.radiusMeters, 1200);
    const query = `
      [out:json][timeout:12];
      (
        node["leisure"~"dog_park|park|fitness_centre"](around:${r},${house.lat},${house.lng});
        node["shop"~"pet|supermarket|bakery"](around:${r},${house.lat},${house.lng});
        node["amenity"~"veterinary|cafe|pharmacy"](around:${r},${house.lat},${house.lng});
      );
      out body 35;
    `;

    try {
      const resp = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
      });
      if (!resp.ok) throw new Error("Indisponível");
      const data = await resp.json();

      const mapped = [];
      for (const elNode of data.elements || []) {
        const t = elNode.tags || {};
        if (!t.name) continue;
        let categoria = null;
        if (t.leisure === "dog_park" || t.shop === "pet") categoria = "pet";
        else if (t.leisure === "fitness_centre") categoria = "academia";
        else if (t.leisure === "park") categoria = "parque";
        else if (t.shop === "supermarket") categoria = "mercado";
        else if (t.amenity === "cafe" || t.shop === "bakery") categoria = "cafe";
        else if (t.amenity === "veterinary" || t.amenity === "pharmacy") categoria = "saude";
        if (!categoria) continue;

        mapped.push({
          id: `osm-${elNode.id}`,
          nome: t.name,
          categoria,
          lat: elNode.lat,
          lng: elNode.lon,
          detalhe: "Descoberto ao vivo via OpenStreetMap",
          source: "osm",
        });
      }

      state.liveOsmPoisByHouse[house.id] = mapped;
      computeHouseProximities(house);
      renderPoiLayers();
      renderSelectionOverlay(house);
      renderDetailDrawer(house);
      showToast(mapped.length ? `${mapped.length} lugares extras encontrados!` : "Nenhum lugar extra encontrado nesse raio.");
    } catch (_) {
      button.disabled = false;
      button.textContent = "Explorar mais lugares ao vivo (OpenStreetMap)";
      showToast("OpenStreetMap indisponível agora. O mapa local continua ativo.");
    }
  }

  // ==================== FAVORITES, COMPARE & TABS ====================

  function toggleFavorite(houseId) {
    if (state.prefs.favorites[houseId]) delete state.prefs.favorites[houseId];
    else state.prefs.favorites[houseId] = true;
    savePrefs();

    if (state.selectedHouseId === houseId) {
      el.drawerFavBtn.classList.toggle("is-active", Boolean(state.prefs.favorites[houseId]));
    }
    applyFiltersAndRender(false);
    showToast(state.prefs.favorites[houseId] ? "Salva em Favoritas" : "Removida das favoritas");
  }

  function toggleCompare(houseId) {
    const idx = state.compareIds.indexOf(houseId);
    if (idx >= 0) {
      state.compareIds.splice(idx, 1);
    } else {
      if (state.compareIds.length >= 3) {
        showToast("Compare até 3 casas por vez.");
        return;
      }
      state.compareIds.push(houseId);
      showToast(
        state.compareIds.length >= 2
          ? `${state.compareIds.length} casas selecionadas para comparar!`
          : "Adicionada. Escolha mais 1 casa para comparar."
      );
    }

    const cnt = String(state.compareIds.length);
    el.compareCount.textContent = cnt;
    el.mobileCompareCount.textContent = cnt;
    el.compareOpenBtn.hidden = state.compareIds.length < 2;
    el.mobileCompareBtn.hidden = state.compareIds.length < 2;

    if (state.selectedHouseId === houseId) {
      el.drawerCompareBtn.classList.toggle("is-compare-active", state.compareIds.includes(houseId));
    }
    renderListings();
  }

  function openCompareModal() {
    const houses = state.compareIds
      .map((id) => state.houses.find((h) => h.id === id))
      .filter(Boolean);
    if (houses.length < 2) return;

    el.compareBody.innerHTML = `
      <div class="compare-grid">
        ${houses
          .map(
            (h) => `
          <div class="compare-col">
            <div class="compare-col__head">
              <h3>${escapeHtml(h.titulo)}</h3>
              <button type="button" class="icon-btn" data-remove-cmp="${escapeHtml(h.id)}" aria-label="Remover">×</button>
            </div>
            <div class="compare-col__price">
              ${formatCurrency(h.preco)}${h.finalidade === "aluguel" ? "<small style='font-size:12px;font-weight:500'>/mês</small>" : ""}
            </div>
            <div class="compare-rows">
              <div class="compare-row"><span>Bairro</span><strong>${escapeHtml(h.bairro)}</strong></div>
              <div class="compare-row"><span>Área útil</span><strong>${h.area_m2 ? `${h.area_m2} m²` : "—"}</strong></div>
              <div class="compare-row"><span>Quartos / Vagas</span><strong>${h.quartos || "—"} qtos · ${h.vagas || "—"} vagas</strong></div>
              <div class="compare-row"><span>Pets / Quintal</span><strong>${h.aceita_pets ? "Sim" : "Não"} · ${h.quintal ? "Quintal" : "—"}</strong></div>
              <div class="compare-row"><span>Nota entorno</span><strong>${h.overallScore}/100</strong></div>
              <div class="compare-row"><span>Escola</span><strong>${formatDistance(h.schoolDist)} (${driveMinutes(h.schoolDist)} min)</strong></div>
              <div class="compare-row"><span>Trabalho</span><strong>${formatDistance(h.workDist)} (${driveMinutes(h.workDist)} min)</strong></div>
              <div class="compare-row"><span>Área pet</span><strong>${formatDistance(h.nearestByCat.pet?.distance)}</strong></div>
              <div class="compare-row"><span>Ciclovia</span><strong>${formatDistance(h.nearestByCat.ciclovia?.distance)}</strong></div>
              <div class="compare-row"><span>Academia</span><strong>${formatDistance(h.nearestByCat.academia?.distance)}</strong></div>
              <div class="compare-row"><span>Parque</span><strong>${formatDistance(h.nearestByCat.parque?.distance)}</strong></div>
              <div class="compare-row"><span>Mercado</span><strong>${formatDistance(h.nearestByCat.mercado?.distance)}</strong></div>
            </div>
            <button type="button" class="btn-outline btn-sm" data-focus-house="${escapeHtml(h.id)}">Ver no mapa</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    el.compareBody.querySelectorAll("[data-remove-cmp]").forEach((btn) => {
      btn.addEventListener("click", () => {
        toggleCompare(btn.dataset.removeCmp);
        if (state.compareIds.length < 2) closeModal("compareModal");
        else openCompareModal();
      });
    });
    el.compareBody.querySelectorAll("[data-focus-house]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeModal("compareModal");
        switchMobileTab("mapa");
        openHouseDetails(btn.dataset.focusHouse, { fly: true });
      });
    });
    openModal("compareModal");
  }

  function switchMobileTab(tab) {
    state.activeTab = tab;
    document.body.dataset.tab = tab;
    document.querySelectorAll("[data-nav-tab]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.navTab === tab);
    });
    if (tab === "mapa" && map) {
      setTimeout(() => map.invalidateSize(), 180);
    } else {
      renderListings();
    }
  }

  // ==================== MODALS & GROKBOT JSON ====================

  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.hidden = false;
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.hidden = true;
  }

  function openJsonModal() {
    el.jsonError.hidden = true;
    if (!el.jsonInput.value.trim() && state.activeFeed) {
      el.jsonInput.value = JSON.stringify(state.activeFeed, null, 2);
    }
    openModal("jsonModal");
  }

  function applyPastedJson() {
    el.jsonError.hidden = true;
    const raw = el.jsonInput.value.trim();
    if (!raw) {
      el.jsonError.textContent = "Cole um JSON válido antes de visualizar.";
      el.jsonError.hidden = false;
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const feed = Array.isArray(parsed)
        ? { atualizado_em: new Date().toISOString(), fonte: "Grokbot", cidade: "Maringá - PR", casas: parsed }
        : parsed;

      ingestFeed(feed, true);
      try {
        localStorage.setItem(STORAGE_KEYS.previewJson, JSON.stringify(feed));
      } catch (_) {}
      closeModal("jsonModal");
      switchMobileTab("mapa");
      showToast(`JSON aplicado! ${state.houses.length} casas no mapa.`);
    } catch (err) {
      el.jsonError.textContent = `Erro no JSON: ${err.message}`;
      el.jsonError.hidden = false;
    }
  }

  function downloadCurrentEditorJson() {
    const raw = el.jsonInput.value.trim();
    let dataToDownload = state.activeFeed;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        dataToDownload = Array.isArray(parsed)
          ? { atualizado_em: new Date().toISOString(), fonte: "Grokbot", cidade: "Maringá - PR", casas: parsed }
          : parsed;
      } catch (err) {
        el.jsonError.textContent = `Corrija o JSON antes de baixar: ${err.message}`;
        el.jsonError.hidden = false;
        return;
      }
    }
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "casas.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("casas.json baixado! Suba em data/casas.json no GitHub.");
  }

  function exitPreviewMode() {
    try {
      localStorage.removeItem(STORAGE_KEYS.previewJson);
    } catch (_) {}
    if (state.publishedFeed) {
      ingestFeed(state.publishedFeed, false);
      showToast("Voltando para o JSON publicado.");
    }
  }

  function resetAllFilters() {
    state.filters = {
      query: "",
      finalidade: "todas",
      minQuartos: 0,
      sort: "score",
      pets: false,
      quintal: false,
      favoritas: false,
      near: new Set(),
    };
    el.searchInput.value = "";
    el.clearSearchBtn.hidden = true;
    applyFiltersAndRender(true);
  }

  // ==================== EVENT WIRING ====================

  function bindEvents() {
    document.querySelectorAll("[data-ico]").forEach((span) => {
      const k = span.dataset.ico;
      if (CATEGORIES[k]) span.innerHTML = CATEGORIES[k].icon;
      else if (UI_ICONS[k]) span.innerHTML = UI_ICONS[k];
    });

    // Mobile bottom tabs
    document.querySelectorAll("[data-nav-tab]").forEach((btn) => {
      btn.addEventListener("click", () => switchMobileTab(btn.dataset.navTab));
    });
    el.navJsonBtn.addEventListener("click", openJsonModal);

    // Mobile saved sub-pills
    document.querySelectorAll("[data-saved-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.savedFilter = btn.dataset.savedFilter;
        document.querySelectorAll("[data-saved-filter]").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
        });
        renderListings();
      });
    });

    // Search
    el.searchInput.addEventListener("input", () => {
      state.filters.query = el.searchInput.value;
      el.clearSearchBtn.hidden = !state.filters.query;
      applyFiltersAndRender(false);
    });
    el.clearSearchBtn.addEventListener("click", () => {
      el.searchInput.value = "";
      state.filters.query = "";
      el.clearSearchBtn.hidden = true;
      applyFiltersAndRender(false);
    });

    // Filters bottom sheet
    el.openFiltersBtn.addEventListener("click", () => openModal("filtersModal"));
    el.sheetApplyFiltersBtn.addEventListener("click", () => closeModal("filtersModal"));
    el.sheetClearFiltersBtn.addEventListener("click", () => {
      resetAllFilters();
      showToast("Filtros limpos.");
    });

    // Finalidade (synced between inline bar & filter sheet)
    document.querySelectorAll("[data-finalidade]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filters.finalidade = btn.dataset.finalidade;
        applyFiltersAndRender(false);
      });
    });

    // Quartos pills in filter sheet
    document.querySelectorAll("[data-quartos]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filters.minQuartos = Number(btn.dataset.quartos) || 0;
        applyFiltersAndRender(false);
      });
    });

    // Sort selects
    el.sortFilter.addEventListener("change", () => {
      state.filters.sort = el.sortFilter.value;
      applyFiltersAndRender(false);
    });
    el.sheetSortSelect.addEventListener("change", () => {
      state.filters.sort = el.sheetSortSelect.value;
      applyFiltersAndRender(false);
    });

    // Toggle chips (pets, quintal, favoritas)
    document.querySelectorAll("[data-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.toggle;
        state.filters[key] = !state.filters[key];
        applyFiltersAndRender(false);
      });
    });

    // Near chips
    document.querySelectorAll("[data-near]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.near;
        if (state.filters.near.has(cat)) state.filters.near.delete(cat);
        else state.filters.near.add(cat);
        applyFiltersAndRender(false);
      });
    });

    el.resetFiltersBtn.addEventListener("click", resetAllFilters);
    el.emptyResetBtn.addEventListener("click", () => {
      if (!isDesktop() && state.activeTab === "salvas") {
        switchMobileTab("mapa");
      } else {
        resetAllFilters();
      }
    });

    // Carousel swipe listener
    el.mapCarousel.addEventListener("scroll", handleCarouselScroll, { passive: true });

    // Mobile map FABs
    el.cycleRadiusBtn.addEventListener("click", () => {
      const idx = RADIUS_STEPS.indexOf(state.radiusMeters);
      const next = RADIUS_STEPS[(idx + 1) % RADIUS_STEPS.length];
      setRadius(next);
      showToast(`Raio de proximidade: ${formatDistance(next)}`);
    });
    el.cycleBasemapBtn.addEventListener("click", () => {
      const idx = BASEMAP_STEPS.findIndex((b) => b.id === state.basemap);
      const next = BASEMAP_STEPS[(idx + 1) % BASEMAP_STEPS.length];
      setBasemap(next.id);
      showToast(`Mapa: ${next.label}`);
    });
    el.fitBoundsMobileBtn.addEventListener("click", () => fitMapToHouses());
    el.fitBoundsBtn.addEventListener("click", () => fitMapToHouses());

    // Desktop radius & basemap controls
    document.querySelectorAll("[data-radius]").forEach((btn) => {
      btn.addEventListener("click", () => setRadius(Number(btn.dataset.radius) || 1000));
    });
    document.querySelectorAll("[data-basemap]").forEach((btn) => {
      btn.addEventListener("click", () => setBasemap(btn.dataset.basemap));
    });

    // Detail drawer controls + swipe down on grab handle to close
    el.closeDrawerBtn.addEventListener("click", () => closeDrawer(isDesktop()));
    el.drawerBackdrop.addEventListener("click", () => closeDrawer(false));
    el.drawerPeekMapBtn.addEventListener("click", () => {
      closeDrawer(false);
      switchMobileTab("mapa");
    });
    el.drawerFavBtn.addEventListener("click", () => {
      if (state.selectedHouseId) toggleFavorite(state.selectedHouseId);
    });
    el.drawerCompareBtn.addEventListener("click", () => {
      if (state.selectedHouseId) toggleCompare(state.selectedHouseId);
    });

    // Touch swipe-down gesture on mobile detail sheet grab handle
    let touchStartY = 0;
    el.drawerGrab.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    el.drawerGrab.addEventListener("touchend", (e) => {
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (deltaY > 40) closeDrawer(false);
    }, { passive: true });

    // Compare modals
    el.compareOpenBtn.addEventListener("click", openCompareModal);
    el.mobileCompareBtn.addEventListener("click", openCompareModal);

    // JSON Grokbot modal
    el.grokbotPromptView.textContent = GROKBOT_PROMPT;
    el.jsonModalBtn.addEventListener("click", openJsonModal);
    el.applyJsonBtn.addEventListener("click", applyPastedJson);
    el.downloadJsonBtn.addEventListener("click", downloadCurrentEditorJson);
    el.loadSampleIntoEditorBtn.addEventListener("click", () => {
      if (state.activeFeed) {
        el.jsonInput.value = JSON.stringify(state.activeFeed, null, 2);
        el.jsonError.hidden = true;
      }
    });
    el.resetJsonBtn.addEventListener("click", () => {
      exitPreviewMode();
      closeModal("jsonModal");
    });
    el.exitPreviewBtn.addEventListener("click", exitPreviewMode);

    el.copyCurrentJsonBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(state.activeFeed, null, 2));
        showToast("JSON copiado!");
      } catch (_) {
        showToast("Selecione e copie o texto acima.");
      }
    });
    el.copyPromptBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(GROKBOT_PROMPT);
        showToast("Prompt do Grokbot copiado!");
      } catch (_) {
        showToast("Selecione e copie o prompt acima.");
      }
    });

    // Modal tabs & close
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        document.querySelectorAll(".tab-btn").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });
        document.querySelectorAll(".tab-panel").forEach((p) => {
          p.classList.toggle("is-active", p.dataset.panel === target);
        });
      });
    });

    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
    });
    document.querySelectorAll(".modal-backdrop").forEach((bg) => {
      bg.addEventListener("click", (e) => {
        if (e.target === bg) bg.hidden = true;
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal("jsonModal");
        closeModal("compareModal");
        closeModal("filtersModal");
        if (state.drawerOpen) closeDrawer(isDesktop());
      }
    });

    window.addEventListener("resize", () => {
      if (map) map.invalidateSize();
      if (state.drawerOpen) el.drawerBackdrop.hidden = isDesktop();
    });
  }

  // ==================== BOOTSTRAP ====================

  async function init() {
    bindEvents();
    renderPoiCategoryDock();

    try {
      const params = new URLSearchParams(window.location.search);
      const externalJsonUrl = params.get("json");
      const casasUrl = externalJsonUrl || "./data/casas.json";

      const [cityResp, casasResp] = await Promise.all([
        fetch("./data/maringa-pois.json", { cache: "no-cache" }),
        fetch(casasUrl, { cache: "no-cache" }),
      ]);

      if (!cityResp.ok) throw new Error("Não foi possível carregar data/maringa-pois.json");
      if (!casasResp.ok) throw new Error(`Não foi possível carregar ${casasUrl}`);

      state.cityData = await cityResp.json();
      state.publishedFeed = await casasResp.json();

      initMap();

      let restoredPreview = null;
      if (!externalJsonUrl) {
        try {
          const saved = localStorage.getItem(STORAGE_KEYS.previewJson);
          if (saved) restoredPreview = JSON.parse(saved);
        } catch (_) {}
      }

      if (restoredPreview && Array.isArray(restoredPreview.casas)) {
        ingestFeed(restoredPreview, true);
      } else {
        ingestFeed(state.publishedFeed, false);
      }
    } catch (err) {
      console.error(err);
      el.feedStatusText.textContent = "Erro ao carregar JSON";
      el.resultsCount.textContent = "Abra via servidor HTTP (python -m http.server)";
      el.listingsContainer.innerHTML = `
        <div class="empty-state">
          <h3>Não foi possível carregar data/casas.json</h3>
          <p>${escapeHtml(err.message)}. Para testar localmente, rode <code>python -m http.server</code> na pasta do site (ou publique no GitHub Pages).</p>
        </div>
      `;
    }
  }

  init();
})();
