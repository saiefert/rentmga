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
    sofa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12V8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5V12"/><path d="M2.5 12h19v4.5a1.5 1.5 0 0 1-1.5 1.5h-16A1.5 1.5 0 0 1 2.5 16.5V12z"/><path d="M5 18v2M19 18v2"/></svg>`,
    house: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/></svg>`,
    apartment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15M10 21v-3h4v3"/></svg>`,
    route: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H13a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h4.5"/></svg>`,
    emoto: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/><path d="M9 17.5h4.5l2.5-6h-4l-1.5 3.5H8"/><path d="M14.5 7h3l1.5 4.5"/><path d="M10.5 4.5L8.5 8h3l-1.5 3" stroke-width="1.8"/></svg>`,
    bike: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="16.5" r="3.2"/><circle cx="18" cy="16.5" r="3.2"/><path d="M6 16.5L10.2 9h4.3l3.5 7.5M10.2 9l1.8 7.5H6M9 6.5h3M14.5 9l1.2-3H18"/></svg>`,
    play: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M6.2 4.4a1 1 0 0 1 1.5-.86l8.6 5.6a1 1 0 0 1 0 1.72l-8.6 5.6A1 1 0 0 1 6.2 15.6V4.4z"/></svg>`,
    stop: `<svg viewBox="0 0 20 20" fill="currentColor"><rect x="5" y="5" width="10" height="10" rx="2"/></svg>`,
  };

  const GROKBOT_PROMPT = `Você é um buscador de casas e apartamentos em Maringá - PR.
Sempre que encontrar imóveis relevantes, retorne APENAS um JSON válido seguindo exatamente o formato abaixo para atualizar o arquivo data/casas.json do site:

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
      "casa": true,
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
      "moveis": true,
      "destaque": false,
      "descricao": "Resumo objetivo do imóvel.",
      "nota_grokbot": "Por que este imóvel vale a pena e pontos de atenção.",
      "tags": ["Quintal gramado", "Rua arborizada"],
      "fotos": ["https://url-direta-da-foto-1.jpg", "https://url-direta-da-foto-2.jpg"],
      "link": "https://url-do-anuncio",
      "portal": "Nome do portal",
      "encontrado_em": "2026-11-22"
    }
  ]
}

Regras:
- "finalidade": "aluguel" ou "compra".
- "casa": true se for casa (térrea, sobrado, condomínio), false se for apartamento (apto, sobreloja, kitnet, studio).
- "moveis": true se tiver móveis (mobiliado/semimobiliado), false se não tiver.
- "fotos": extraia as URLs reais (https://...) das imagens do anúncio (até 6-8 fotos); o site faz fallback automático se algum link falhar.
- "preco", "condominio", "iptu", "area_m2", "terreno_m2": números sem "R$".
- Mantenha o mesmo "id" para o mesmo imóvel entre atualizações (preserva favoritos e anotações).
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
      tipoImovel: "todos", // "todos" | "casa" | "apartamento"
      minQuartos: 0,
      sort: "score",
      moveis: false,
      pets: false,
      quintal: false,
      favoritas: false,
      near: new Set(),
    },
    simulatedRoute: null, // { houseId, anchorId, anchorType, vehicle: "emoto"|"bike", routeData, loading, animating }
    routeCache: new Map(),
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
  let routeSimLayer = null;
  let routeAnimFrame = null;
  let routeAnimMarker = null;
  let routeSimRequestSeq = 0;
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
    navListCount: document.getElementById("navListCount"),
    navSavedDot: document.getElementById("navSavedDot"),
    sortFilter: document.getElementById("sortFilter"),
    sheetSortSelect: document.getElementById("sheetSortSelect"),
    resultsCount: document.getElementById("resultsCount"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
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
    routeSimPanel: document.getElementById("routeSimPanel"),
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
    toast: document.getElementById("toast"),
  };

  function isDesktop() {
    return window.innerWidth >= 820;
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

  function emotoMinutes(meters) {
    // Realistic urban electric scooter / moto elétrica pace in Maringá (~23 km/h avg incl. cycleways & lights)
    return Math.max(1, Math.round(meters / 385));
  }

  function driveMinutes(meters) {
    // Realistic urban Maringá driving pace (~26 km/h avg incl. traffic lights)
    return Math.max(2, Math.round(meters / 430));
  }

  function roadApproxMeters(straightMeters) {
    // Maringá's urban grid factor (~1.22x straight-line distance)
    return Math.round(straightMeters * 1.22);
  }

  function resolveIsCasa(raw) {
    if (typeof raw.casa === "boolean") return raw.casa;
    if (raw.casa !== undefined && raw.casa !== null) {
      const s = normalizeText(raw.casa);
      if (s === "false" || s === "0" || s === "nao") return false;
      if (s === "true" || s === "1" || s === "sim") return true;
    }
    if (typeof raw.apartamento === "boolean") return !raw.apartamento;
    const ref = normalizeText(`${raw.tipo || ""} ${raw.titulo || ""}`);
    if (/\b(apartamento|apto|ap|edificio|kitnet|studio|flat|cobertura|sobreloja|duplex)\b/.test(ref)) {
      return false;
    }
    return true;
  }

  function getImovelMeta(house) {
    return house.casa
      ? { label: "Casa", shortLabel: "Casa", icon: UI_ICONS.house, cls: "casa" }
      : { label: "Apartamento", shortLabel: "Apto", icon: UI_ICONS.apartment, cls: "apto" };
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
    const isApartamento = house.casa === false;
    const isSobrado = !isApartamento && normalizeText(house.tipo).includes("sobrado");
    const bairroLabel = escapeHtml(house.bairro || "Maringá - PR");

    const buildingMarkup = isApartamento
      ? `
          <rect x="148" y="42" width="124" height="114" rx="5" fill="${p.wall}" stroke="#17211d" stroke-opacity="0.16" stroke-width="2"/>
          <rect x="142" y="36" width="136" height="10" rx="3" fill="${p.roof}"/>
          <rect x="164" y="56" width="22" height="16" rx="2.5" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.4"/>
          <rect x="199" y="56" width="22" height="16" rx="2.5" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.4"/>
          <rect x="234" y="56" width="22" height="16" rx="2.5" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.4"/>
          <rect x="164" y="82" width="22" height="16" rx="2.5" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.4"/>
          <rect x="199" y="82" width="22" height="16" rx="2.5" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.4"/>
          <rect x="234" y="82" width="22" height="16" rx="2.5" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.4"/>
          <rect x="164" y="108" width="22" height="16" rx="2.5" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.4"/>
          <rect x="234" y="108" width="22" height="16" rx="2.5" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.4"/>
          <rect x="197" y="120" width="26" height="36" rx="3" fill="${p.accent}"/>
        `
      : isSobrado
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
        `;

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
        ${buildingMarkup}
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
        emotoMin: emotoMinutes(road),
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
      const rawFotos = Array.isArray(raw.fotos)
        ? raw.fotos
        : typeof raw.foto === "string"
        ? [raw.foto]
        : typeof raw.imagem === "string"
        ? [raw.imagem]
        : [];
      const fotosClean = [...new Set(rawFotos.filter((u) => typeof u === "string" && /^https?:\/\//i.test(u.trim())).map((u) => u.trim()))];
      const hasMoveis = raw.moveis !== undefined ? Boolean(raw.moveis) : Boolean(raw.mobiliada);
      const isCasa = resolveIsCasa(raw);

      const house = {
        id,
        titulo: String(raw.titulo || `${isCasa ? "Casa" : "Apartamento"} em ${raw.bairro || "Maringá"}`),
        finalidade: finalidadeNorm,
        tipo: String(raw.tipo || (isCasa ? "Casa" : "Apartamento")),
        casa: isCasa,
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
        moveis: hasMoveis,
        mobiliada: hasMoveis,
        destaque: Boolean(raw.destaque),
        descricao: String(raw.descricao || ""),
        nota_grokbot: String(raw.nota_grokbot || ""),
        tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
        fotos: fotosClean,
        link: typeof raw.link === "string" ? raw.link.trim() : "",
        portal: String(raw.portal || feed.fonte || ""),
        encontrado_em: String(raw.encontrado_em || feed.atualizado_em || ""),
        rawProximidades: Array.isArray(raw.proximidades) ? raw.proximidades : [],
      };
      computeHouseProximities(house);
      return house;
    });

    const updatedLabel = formatDateShort(feed.atualizado_em);
    el.feedStatusText.textContent = `${updatedLabel ? `Atualizado em ${updatedLabel} · ` : ""}${state.houses.length} ${state.houses.length === 1 ? "imóvel" : "imóveis"}`;

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
    routeSimLayer = L.layerGroup().addTo(map);
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
      const imovel = getImovelMeta(house);
      const pinClass = [
        "house-pin",
        house.finalidade === "compra" ? "house-pin--compra" : "house-pin--aluguel",
        `house-pin--${imovel.cls}`,
        isSelected ? "is-selected" : "",
        house.id === state.hoveredHouseId ? "is-hovered" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const icon = L.divIcon({
        className: "house-pin-wrap",
        html: `
          <div class="${pinClass}" data-house-pin="${escapeHtml(house.id)}" title="${escapeHtml(imovel.label)} · ${escapeHtml(house.titulo)}">
            <span class="house-pin__type" aria-label="${escapeHtml(imovel.label)}">${imovel.icon}</span>
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

  // ==================== ROUTE SIMULATION (CICLOVIAS / CALÇADAS / VIAS · MOTO ELÉTRICA & BIKE) ====================

  function polylineLengthMeters(coords) {
    let total = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      total += haversine(coords[i][0], coords[i][1], coords[i + 1][0], coords[i + 1][1]);
    }
    return total;
  }

  function findClosestCicloviaHit(lat, lng) {
    let best = null;
    for (const ciclo of state.cityData?.ciclovias || []) {
      const hit = closestPointOnPolyline(lat, lng, ciclo.coords);
      if (!best || hit.distance < best.distance) {
        best = { ...hit, ciclo };
      }
    }
    return best;
  }

  function classifyRouteStep(step, coords) {
    const mode = normalizeText(step.mode || "");
    const name = normalizeText(step.name || "");

    if (
      mode.includes("pushing") ||
      mode.includes("foot") ||
      /\b(calcada|calcadao|passarela|travessia|escadaria|pedestre|passeio)\b/.test(name)
    ) {
      return { kind: "calcada", cicloviaName: null };
    }

    if (/\b(ciclovia|ciclofaixa|bike)\b/.test(name)) {
      return { kind: "ciclovia", cicloviaName: step.name || "Ciclovia" };
    }

    // Check geometric overlap against Maringá's real ciclovia corridors
    const ciclovias = state.cityData?.ciclovias || [];
    if (ciclovias.length && coords.length >= 2) {
      const sampleCount = Math.min(coords.length, 6);
      let nearHits = 0;
      const hitNames = {};
      for (let s = 0; s < sampleCount; s++) {
        const idx = sampleCount === 1 ? 0 : Math.round((s * (coords.length - 1)) / (sampleCount - 1));
        const pt = coords[idx];
        const hit = findClosestCicloviaHit(pt[0], pt[1]);
        if (hit && hit.distance <= 55) {
          nearHits++;
          hitNames[hit.ciclo.nome] = (hitNames[hit.ciclo.nome] || 0) + 1;
        }
      }
      if (nearHits / sampleCount >= 0.5) {
        const topName = Object.entries(hitNames).sort((a, b) => b[1] - a[1])[0]?.[0] || "Ciclovia";
        return { kind: "ciclovia", cicloviaName: topName };
      }
    }

    // Unnamed short bike connectors (parks, sidewalks, plaza crossings)
    if (!name && (step.distance || 0) > 0 && (step.distance || 0) <= 220) {
      return { kind: "calcada", cicloviaName: null };
    }

    return { kind: "via", cicloviaName: null };
  }

  function computeSimulatedTimes(stats) {
    const totalKm = stats.totalMeters / 1000;
    // Moto elétrica (autopropelido urbano): até 20 km/h em ciclovia, ~27 km/h em vias urbanas, ~11 km/h em calçada/travessia
    const emotoRaw =
      stats.cicloviaMeters / 333 +
      stats.viaMeters / 450 +
      stats.calcadaMeters / 185 +
      totalKm * 0.55;
    // Bike (bicicleta urbana): ~17 km/h em ciclovia, ~13.5 km/h em vias urbanas, ~8.5 km/h em calçada/travessia
    const bikeRaw =
      stats.cicloviaMeters / 285 +
      stats.viaMeters / 225 +
      stats.calcadaMeters / 140 +
      totalKm * 0.7;

    return {
      emotoMin: Math.max(2, Math.round(emotoRaw)),
      bikeMin: Math.max(2, Math.round(bikeRaw)),
      emotoAvgKmh: Math.max(12, Math.min(30, Math.round((totalKm / (Math.max(2, emotoRaw) / 60))))),
      bikeAvgKmh: Math.max(9, Math.min(20, Math.round((totalKm / (Math.max(2, bikeRaw) / 60))))),
    };
  }

  function closestVertexProjectionOnPolyline(lat, lng, coords) {
    let bestDist = Infinity;
    let bestSegIdx = 0;
    let bestPt = coords[0];
    const cosLat = Math.cos((lat * Math.PI) / 180);

    for (let i = 0; i < coords.length - 1; i++) {
      const [aLat, aLng] = coords[i];
      const [bLat, bLng] = coords[i + 1];
      const dx = (bLng - aLng) * cosLat;
      const dy = bLat - aLat;
      const lenSq = dx * dx + dy * dy;
      let t = lenSq > 0 ? (((lng - aLng) * cosLat) * dx + (lat - aLat) * dy) / lenSq : 0;
      t = Math.max(0, Math.min(1, t));
      const pLat = aLat + t * (bLat - aLat);
      const pLng = aLng + t * (bLng - aLng);
      const dist = haversine(lat, lng, pLat, pLng);
      if (dist < bestDist) {
        bestDist = dist;
        bestSegIdx = i;
        bestPt = [pLat, pLng];
      }
    }
    return { distance: bestDist, segIdx: bestSegIdx, pt: bestPt };
  }

  function slicePolylineBetween(coords, startProj, endProj) {
    const out = [startProj.pt];
    if (startProj.segIdx === endProj.segIdx) {
      out.push(endProj.pt);
      return out;
    }
    if (startProj.segIdx < endProj.segIdx) {
      for (let i = startProj.segIdx + 1; i <= endProj.segIdx; i++) out.push(coords[i]);
    } else {
      for (let i = startProj.segIdx; i > endProj.segIdx; i--) out.push(coords[i]);
    }
    out.push(endProj.pt);
    return out;
  }

  function buildManhattanConnector(a, b) {
    const mid = [a[0], b[1]];
    return [a, mid, b];
  }

  function buildLocalCicloviaRoute(house, anchor) {
    const start = [house.lat, house.lng];
    const end = [anchor.lat, anchor.lng];
    const directGrid = buildManhattanConnector(start, end);
    const directDist = polylineLengthMeters(directGrid);

    let bestCandidate = null;
    for (const ciclo of state.cityData?.ciclovias || []) {
      const entry = closestVertexProjectionOnPolyline(start[0], start[1], ciclo.coords);
      const exit = closestVertexProjectionOnPolyline(end[0], end[1], ciclo.coords);
      const cicloPath = slicePolylineBetween(ciclo.coords, entry, exit);
      const cicloDist = polylineLengthMeters(cicloPath);
      if (cicloDist < 160) continue;

      const accessIn = buildManhattanConnector(start, entry.pt);
      const accessOut = buildManhattanConnector(exit.pt, end);
      const total = polylineLengthMeters(accessIn) + cicloDist + polylineLengthMeters(accessOut);

      if (total <= directDist * 1.48 && (!bestCandidate || total < bestCandidate.total)) {
        bestCandidate = { ciclo, accessIn, cicloPath, accessOut, total, cicloDist };
      }
    }

    const segments = [];
    const wayNames = [];

    if (bestCandidate) {
      const inDist = polylineLengthMeters(bestCandidate.accessIn);
      const outDist = polylineLengthMeters(bestCandidate.accessOut);
      if (inDist > 15) {
        segments.push({
          kind: inDist <= 140 ? "calcada" : "via",
          coords: bestCandidate.accessIn,
          distance: inDist,
        });
      }
      segments.push({
        kind: "ciclovia",
        coords: bestCandidate.cicloPath,
        distance: bestCandidate.cicloDist,
      });
      wayNames.push(bestCandidate.ciclo.nome);
      if (outDist > 15) {
        segments.push({
          kind: outDist <= 140 ? "calcada" : "via",
          coords: bestCandidate.accessOut,
          distance: outDist,
        });
      }
    } else {
      segments.push({
        kind: directDist <= 220 ? "calcada" : "via",
        coords: directGrid,
        distance: directDist,
      });
      wayNames.push("Vias urbanas de Maringá");
    }

    const stats = { totalMeters: 0, cicloviaMeters: 0, viaMeters: 0, calcadaMeters: 0 };
    const fullCoords = [];
    for (const seg of segments) {
      stats.totalMeters += seg.distance;
      if (seg.kind === "ciclovia") stats.cicloviaMeters += seg.distance;
      else if (seg.kind === "calcada") stats.calcadaMeters += seg.distance;
      else stats.viaMeters += seg.distance;
      seg.coords.forEach((pt, idx) => {
        if (idx === 0 && fullCoords.length) return;
        fullCoords.push(pt);
      });
    }

    return {
      source: "local",
      sourceLabel: "Estimativa local (ciclovias)",
      segments,
      fullCoords,
      wayNames,
      stats,
      times: computeSimulatedTimes(stats),
    };
  }

  async function fetchCyclingRoute(house, anchor) {
    const cacheKey = `${house.id}::${anchor.id}`;
    if (state.routeCache.has(cacheKey)) return state.routeCache.get(cacheKey);

    const coordsParam = `${house.lng},${house.lat};${anchor.lng},${anchor.lat}`;
    const endpoints = [
      {
        url: `https://routing.openstreetmap.de/routed-bike/route/v1/cycling/${coordsParam}?overview=full&geometries=geojson&steps=true`,
        timeout: 6500,
        label: "Rota bike OSM",
      },
      {
        url: `https://router.project-osrm.org/route/v1/bicycle/${coordsParam}?overview=full&geometries=geojson&steps=true`,
        timeout: 5500,
        label: "Rota OSRM",
      },
    ];

    for (const ep of endpoints) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ep.timeout);
      try {
        const resp = await fetch(ep.url, { signal: ctrl.signal });
        clearTimeout(timer);
        if (!resp.ok) continue;
        const data = await resp.json();
        const route = data?.routes?.[0];
        const steps = route?.legs?.[0]?.steps;
        if (!route || !Array.isArray(steps) || !steps.length) continue;

        const segments = [];
        const fullCoords = [];
        const wayNameSet = [];
        const stats = { totalMeters: 0, cicloviaMeters: 0, viaMeters: 0, calcadaMeters: 0 };

        for (const step of steps) {
          const rawCoords = step.geometry?.coordinates;
          if (!Array.isArray(rawCoords) || rawCoords.length < 2) continue;
          const coords = rawCoords.map(([lng, lat]) => [lat, lng]);
          const dist = Number.isFinite(step.distance) && step.distance > 0 ? step.distance : polylineLengthMeters(coords);
          if (dist < 1) continue;

          const cls = classifyRouteStep(step, coords);
          segments.push({ kind: cls.kind, coords, distance: dist });

          stats.totalMeters += dist;
          if (cls.kind === "ciclovia") stats.cicloviaMeters += dist;
          else if (cls.kind === "calcada") stats.calcadaMeters += dist;
          else stats.viaMeters += dist;

          const label = cls.cicloviaName || (step.name ? step.name.trim() : "");
          if (label && !wayNameSet.includes(label) && dist >= 90) {
            wayNameSet.push(label);
          }

          coords.forEach((pt, idx) => {
            if (idx === 0 && fullCoords.length) return;
            fullCoords.push(pt);
          });
        }

        if (fullCoords.length >= 2 && stats.totalMeters > 0) {
          const result = {
            source: "osm",
            sourceLabel: ep.label,
            segments,
            fullCoords,
            wayNames: wayNameSet.slice(0, 5),
            stats,
            times: computeSimulatedTimes(stats),
          };
          state.routeCache.set(cacheKey, result);
          return result;
        }
      } catch (_) {
        clearTimeout(timer);
      }
    }

    const fallback = buildLocalCicloviaRoute(house, anchor);
    state.routeCache.set(cacheKey, fallback);
    return fallback;
  }

  function stopRouteAnimation() {
    if (routeAnimFrame) {
      cancelAnimationFrame(routeAnimFrame);
      routeAnimFrame = null;
    }
    if (routeAnimMarker && routeSimLayer) {
      routeSimLayer.removeLayer(routeAnimMarker);
      routeAnimMarker = null;
    }
    if (state.simulatedRoute) {
      state.simulatedRoute.animating = false;
    }
  }

  function startRouteAnimation() {
    const sim = state.simulatedRoute;
    if (!sim || !sim.routeData || !map || !routeSimLayer) return;
    const pts = sim.routeData.fullCoords;
    if (!pts || pts.length < 2) return;

    stopRouteAnimation();
    sim.animating = true;

    const cumDist = [0];
    for (let i = 1; i < pts.length; i++) {
      cumDist.push(cumDist[i - 1] + haversine(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]));
    }
    const totalLen = cumDist[cumDist.length - 1] || 1;
    const isEmoto = sim.vehicle === "emoto";
    // Moto elétrica anima proporcionalmente mais rápido que bike
    const durationMs = isEmoto ? 5200 : 8200;

    const riderIcon = L.divIcon({
      className: "route-rider-wrap",
      html: `<div class="route-rider ${isEmoto ? "route-rider--emoto" : ""}">${isEmoto ? UI_ICONS.emoto : UI_ICONS.bike}</div>`,
      iconSize: [0, 0],
    });
    routeAnimMarker = L.marker(pts[0], { icon: riderIcon, interactive: false, zIndexOffset: 900 }).addTo(routeSimLayer);

    const startTime = performance.now();
    const tick = (now) => {
      if (!state.simulatedRoute || !state.simulatedRoute.animating || !routeAnimMarker) return;
      const progress = Math.min(1, (now - startTime) / durationMs);
      const targetDist = progress * totalLen;

      let seg = 0;
      while (seg < cumDist.length - 2 && cumDist[seg + 1] < targetDist) seg++;
      const segLen = Math.max(0.001, cumDist[seg + 1] - cumDist[seg]);
      const t = Math.max(0, Math.min(1, (targetDist - cumDist[seg]) / segLen));
      const lat = pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * t;
      const lng = pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * t;
      routeAnimMarker.setLatLng([lat, lng]);

      if (progress < 1) {
        routeAnimFrame = requestAnimationFrame(tick);
      } else {
        sim.animating = false;
        routeAnimFrame = null;
        renderRouteSimPanel();
      }
    };
    routeAnimFrame = requestAnimationFrame(tick);
    renderRouteSimPanel();
  }

  function drawSimulatedRouteOnMap(house, anchor, routeData) {
    if (!routeSimLayer || !map) return;
    stopRouteAnimation();
    routeSimLayer.clearLayers();

    // Crisp outer casing so route pops on Clean, Streets & Satellite maps
    if (routeData.fullCoords.length >= 2) {
      L.polyline(routeData.fullCoords, {
        color: "#ffffff",
        weight: 9,
        opacity: 0.92,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(routeSimLayer);
    }

    const styles = {
      ciclovia: { color: "#0d9488", weight: 5.5, opacity: 0.96, dashArray: null },
      via: { color: "#2563eb", weight: 4.8, opacity: 0.9, dashArray: null },
      calcada: { color: "#d97706", weight: 4.6, opacity: 0.94, dashArray: "6 7" },
    };

    for (const seg of routeData.segments) {
      const st = styles[seg.kind] || styles.via;
      L.polyline(seg.coords, {
        ...st,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(routeSimLayer);
    }

    // Start & end accent halos
    L.circleMarker([house.lat, house.lng], {
      radius: 7,
      color: "#ffffff",
      weight: 3,
      fillColor: "#1b5e43",
      fillOpacity: 1,
      interactive: false,
    }).addTo(routeSimLayer);

    const anchorColor = anchor.cor || (anchor.tipo === "trabalho" ? "#0369a1" : "#be185d");
    L.circleMarker([anchor.lat, anchor.lng], {
      radius: 9,
      color: "#ffffff",
      weight: 3,
      fillColor: anchorColor,
      fillOpacity: 1,
      interactive: false,
    }).addTo(routeSimLayer);

    const bounds = L.latLngBounds(routeData.fullCoords);
    map.fitBounds(bounds, {
      paddingTopLeft: [46, isDesktop() ? 86 : 130],
      paddingBottomRight: [isDesktop() ? 390 : 46, isDesktop() ? 90 : 255],
      maxZoom: 16,
      animate: true,
    });
  }

  function clearSimulatedRoute() {
    routeSimRequestSeq++;
    stopRouteAnimation();
    state.simulatedRoute = null;
    if (routeSimLayer) routeSimLayer.clearLayers();
    document.body.classList.remove("has-route-sim");
    if (el.routeSimPanel) {
      el.routeSimPanel.hidden = true;
      el.routeSimPanel.innerHTML = "";
    }
  }

  function renderRouteSimPanel() {
    const sim = state.simulatedRoute;
    if (!sim || !el.routeSimPanel) return;

    const house = state.houses.find((h) => h.id === sim.houseId);
    const anchor = state.routineAnchors.find((a) => a.id === sim.anchorId);
    if (!house || !anchor) {
      clearSimulatedRoute();
      return;
    }

    document.body.classList.add("has-route-sim");
    el.routeSimPanel.hidden = false;

    const hasTrabalho = state.routineAnchors.some((a) => a.tipo === "trabalho");
    const hasEscola = state.routineAnchors.some((a) => a.tipo === "escola");

    const switchHtml = `
      <div class="route-sim__switch" role="tablist" aria-label="Destino da rota">
        ${
          hasTrabalho
            ? `<button type="button" class="route-sim__tab ${sim.anchorType === "trabalho" ? "is-active" : ""}" data-sim-switch="trabalho">${UI_ICONS.briefcase} Trabalho</button>`
            : ""
        }
        ${
          hasEscola
            ? `<button type="button" class="route-sim__tab ${sim.anchorType === "escola" ? "is-active" : ""}" data-sim-switch="escola">${UI_ICONS.school} Escola</button>`
            : ""
        }
      </div>
    `;

    if (sim.loading) {
      el.routeSimPanel.innerHTML = `
        <div class="route-sim__head">
          ${switchHtml}
          <button type="button" class="route-sim__close" id="closeRouteSimBtn" aria-label="Fechar simulação">×</button>
        </div>
        <div class="route-sim__loading">
          <span class="route-sim__spinner"></span>
          <span>Calculando rota por ciclovias, calçadas e vias até ${escapeHtml(anchor.nome)}…</span>
        </div>
      `;
      wireRouteSimPanelEvents();
      return;
    }

    const rd = sim.routeData;
    const total = Math.max(1, rd.stats.totalMeters);
    const pctCiclo = Math.round((rd.stats.cicloviaMeters / total) * 100);
    const pctCalcada = Math.round((rd.stats.calcadaMeters / total) * 100);
    const pctVia = Math.max(0, 100 - pctCiclo - pctCalcada);
    const gmapsBikeUrl = `https://www.google.com/maps/dir/?api=1&origin=${house.lat},${house.lng}&destination=${anchor.lat},${anchor.lng}&travelmode=bicycling`;

    el.routeSimPanel.innerHTML = `
      <div class="route-sim__head">
        ${switchHtml}
        <button type="button" class="route-sim__close" id="closeRouteSimBtn" aria-label="Fechar simulação">×</button>
      </div>

      <div class="route-sim__meta">
        <span><strong>${escapeHtml(house.bairro)}</strong> → <strong>${escapeHtml(anchor.nome)}</strong> · ${formatDistance(rd.stats.totalMeters)}</span>
        <span class="route-sim__source ${rd.source === "local" ? "route-sim__source--local" : ""}">${escapeHtml(rd.sourceLabel)}</span>
      </div>

      <div class="route-sim__vehicles">
        <button type="button" class="vehicle-card ${sim.vehicle === "emoto" ? "is-active" : ""}" data-sim-vehicle="emoto">
          <span class="vehicle-card__ico vehicle-card__ico--emoto">${UI_ICONS.emoto}</span>
          <span class="vehicle-card__info">
            <strong>${rd.times.emotoMin} min</strong>
            <span>Moto elétrica</span>
            <small>~${rd.times.emotoAvgKmh} km/h médio</small>
          </span>
        </button>

        <button type="button" class="vehicle-card ${sim.vehicle === "bike" ? "is-active" : ""}" data-sim-vehicle="bike">
          <span class="vehicle-card__ico vehicle-card__ico--bike">${UI_ICONS.bike}</span>
          <span class="vehicle-card__info">
            <strong>${rd.times.bikeMin} min</strong>
            <span>Bike</span>
            <small>~${rd.times.bikeAvgKmh} km/h médio</small>
          </span>
        </button>
      </div>

      <div class="route-sim__bar" aria-label="Composição da rota">
        ${pctCiclo > 0 ? `<div class="route-sim__seg--ciclovia" style="width:${pctCiclo}%" title="Ciclovias: ${pctCiclo}%"></div>` : ""}
        ${pctVia > 0 ? `<div class="route-sim__seg--via" style="width:${pctVia}%" title="Vias urbanas: ${pctVia}%"></div>` : ""}
        ${pctCalcada > 0 ? `<div class="route-sim__seg--calcada" style="width:${pctCalcada}%" title="Calçadas / acessos: ${pctCalcada}%"></div>` : ""}
      </div>

      <div class="route-sim__legend">
        <span class="route-sim__legend-item"><span class="route-sim__dot route-sim__dot--ciclovia"></span>Ciclovia ${formatDistance(rd.stats.cicloviaMeters)} (${pctCiclo}%)</span>
        <span class="route-sim__legend-item"><span class="route-sim__dot route-sim__dot--via"></span>Vias ${formatDistance(rd.stats.viaMeters)} (${pctVia}%)</span>
        ${rd.stats.calcadaMeters >= 20 ? `<span class="route-sim__legend-item"><span class="route-sim__dot route-sim__dot--calcada"></span>Calçada ${formatDistance(rd.stats.calcadaMeters)} (${pctCalcada}%)</span>` : ""}
      </div>

      ${
        rd.wayNames.length
          ? `<div class="route-sim__ways"><strong>Trajeto principal:</strong> ${escapeHtml(rd.wayNames.join(" → "))}</div>`
          : ""
      }

      <div class="route-sim__foot">
        <button type="button" class="btn-primary" id="toggleRouteAnimBtn">
          ${sim.animating ? `${UI_ICONS.stop} Parar` : `${UI_ICONS.play} Animar ${sim.vehicle === "emoto" ? "moto elét." : "bike"}`}
        </button>
        <a class="btn-outline" href="${gmapsBikeUrl}" target="_blank" rel="noopener noreferrer">Maps Bike ${UI_ICONS.external}</a>
      </div>
    `;

    wireRouteSimPanelEvents();
  }

  function wireRouteSimPanelEvents() {
    const closeBtn = document.getElementById("closeRouteSimBtn");
    if (closeBtn) closeBtn.addEventListener("click", clearSimulatedRoute);

    el.routeSimPanel.querySelectorAll("[data-sim-switch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!state.simulatedRoute) return;
        const target = btn.dataset.simSwitch;
        if (target === state.simulatedRoute.anchorType && !state.simulatedRoute.loading) return;
        simulateRouteForHouse(state.simulatedRoute.houseId, target, state.simulatedRoute.vehicle);
      });
    });

    el.routeSimPanel.querySelectorAll("[data-sim-vehicle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!state.simulatedRoute) return;
        state.simulatedRoute.vehicle = btn.dataset.simVehicle;
        startRouteAnimation();
      });
    });

    const animBtn = document.getElementById("toggleRouteAnimBtn");
    if (animBtn) {
      animBtn.addEventListener("click", () => {
        if (!state.simulatedRoute) return;
        if (state.simulatedRoute.animating) {
          stopRouteAnimation();
          renderRouteSimPanel();
        } else {
          startRouteAnimation();
        }
      });
    }
  }

  async function simulateRouteForHouse(houseId, targetType = "trabalho", vehicle = "emoto") {
    const house = state.houses.find((h) => h.id === houseId);
    const anchor =
      state.routineAnchors.find((a) => a.tipo === targetType) ||
      state.routineAnchors[0];
    if (!house || !anchor) {
      showToast("Destino de rotina não encontrado.");
      return;
    }

    const reqId = ++routeSimRequestSeq;
    stopRouteAnimation();

    // Ensure routine anchors & cycleways are visible on the map
    let layersChanged = false;
    if (!state.activeCategories.has("rotina")) {
      state.activeCategories.add("rotina");
      layersChanged = true;
    }
    if (!state.activeCategories.has("ciclovia")) {
      state.activeCategories.add("ciclovia");
      layersChanged = true;
    }
    if (layersChanged) renderPoiCategoryDock();

    if (!isDesktop()) {
      closeDrawer(false);
      switchMobileTab("mapa");
    }

    focusHouseOnMap(house.id, { fly: false, scrollCarousel: true });

    state.simulatedRoute = {
      houseId: house.id,
      anchorId: anchor.id,
      anchorType: anchor.tipo,
      vehicle,
      routeData: null,
      loading: true,
      animating: false,
    };
    renderRouteSimPanel();

    const routeData = await fetchCyclingRoute(house, anchor);
    if (reqId !== routeSimRequestSeq || !state.simulatedRoute) return;

    state.simulatedRoute.routeData = routeData;
    state.simulatedRoute.loading = false;
    drawSimulatedRouteOnMap(house, anchor, routeData);
    renderRouteSimPanel();
    startRouteAnimation();
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
    if (f.tipoImovel !== "todos") n++;
    if (f.minQuartos > 0) n++;
    if (f.moveis) n++;
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
    document.querySelectorAll("[data-imovel]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.imovel === f.tipoImovel);
    });
    document.querySelectorAll("[data-imovel-seg]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.imovelSeg === f.tipoImovel);
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
      if (f.tipoImovel === "casa" && !h.casa) return false;
      if (f.tipoImovel === "apartamento" && h.casa) return false;
      if (f.minQuartos > 0 && h.quartos < f.minQuartos) return false;
      if (f.moveis && !h.moveis) return false;
      if (f.pets && !h.aceita_pets) return false;
      if (f.quintal && !h.quintal) return false;
      if (f.favoritas && !state.prefs.favorites[h.id]) return false;

      for (const cat of f.near) {
        const nearest = h.nearestByCat[cat];
        if (!nearest || nearest.distance > state.radiusMeters) return false;
      }

      if (q) {
        const hay = normalizeText(
          `${h.titulo} ${h.bairro} ${h.endereco} ${h.tipo} ${h.casa ? "casa" : "apartamento apto"} ${h.descricao} ${h.nota_grokbot} ${h.tags.join(" ")} ${h.moveis ? "moveis mobiliado mobiliada" : ""}`
        );
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (f.sort === "moveis") {
        if (a.moveis !== b.moveis) return a.moveis ? -1 : 1;
        return b.overallScore - a.overallScore;
      }
      if (f.sort === "rotina") return a.routineCombinedDist - b.routineCombinedDist;
      if (f.sort === "escola") return a.schoolDist - b.schoolDist;
      if (f.sort === "trabalho") return a.workDist - b.workDist;
      if (f.sort === "preco_asc") return (a.preco || Infinity) - (b.preco || Infinity);
      if (f.sort === "preco_desc") return (b.preco || 0) - (a.preco || 0);
      if (f.sort === "area_desc") return (b.area_m2 || 0) - (a.area_m2 || 0);
      if (f.sort === "recente") return String(b.encontrado_em).localeCompare(String(a.encontrado_em));
      return (
        b.overallScore +
        (b.moveis ? 12 : 0) +
        (b.destaque ? 4 : 0) -
        (a.overallScore + (a.moveis ? 12 : 0) + (a.destaque ? 4 : 0))
      );
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
        if (
          e.target.closest("[data-card-action]") ||
          e.target.closest(".card-go-btn") ||
          e.target.closest("[data-sim-route]")
        ) {
          return;
        }
        openHouseDetails(id, { fly: true });
      });
      card.addEventListener("mouseenter", () => setHoveredHouse(id));
      card.addEventListener("mouseleave", () => setHoveredHouse(null));
    });

    el.listingsContainer.querySelectorAll("[data-sim-route]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        simulateRouteForHouse(btn.dataset.houseId, btn.dataset.simRoute);
      });
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
        if (!house) return;
        const nextIdx = (Number(img.dataset.photoIdx) || 0) + 1;
        if (nextIdx < house.fotos.length) {
          img.dataset.photoIdx = String(nextIdx);
          img.src = house.fotos[nextIdx];
        } else {
          img.outerHTML = buildHouseIllustration(house);
        }
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
      ? `<img src="${escapeHtml(house.fotos[0])}" alt="${escapeHtml(house.titulo)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-photo-idx="0" data-fallback-house="${escapeHtml(house.id)}">`
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

    const imovel = getImovelMeta(house);
    const hasTrabalho = (house.commutes || []).some((c) => c.tipo === "trabalho");
    const hasEscola = (house.commutes || []).some((c) => c.tipo === "escola");

    return `
      <article class="house-card ${isSelected ? "is-selected" : ""}" data-house-id="${escapeHtml(house.id)}" role="listitem">
        <div class="house-card__media">
          ${mediaHtml}
          <div class="house-card__badges">
            <span class="pill-badge pill-badge--${imovel.cls}">${imovel.icon} ${imovel.label}</span>
            <span class="pill-badge pill-badge--${house.finalidade}">${house.finalidade === "compra" ? "Compra" : "Aluguel"}</span>
            ${house.moveis ? '<span class="pill-badge pill-badge--moveis">Com móveis</span>' : ""}
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
          ${
            house.link
              ? `<div class="house-card__footer-cta">
                  <span class="card-details-hint">Ver detalhes e entorno</span>
                  <a class="card-go-btn" href="${escapeHtml(house.link)}" target="_blank" rel="noopener noreferrer">Ir para o imóvel ${UI_ICONS.external}</a>
                </div>`
              : ""
          }
          ${
            hasTrabalho || hasEscola
              ? `<div class="card-route-actions">
                  ${
                    hasTrabalho
                      ? `<button type="button" class="card-route-btn card-route-btn--trabalho" data-sim-route="trabalho" data-house-id="${escapeHtml(house.id)}">${UI_ICONS.route} <span>Rota Trabalho</span></button>`
                      : ""
                  }
                  ${
                    hasEscola
                      ? `<button type="button" class="card-route-btn card-route-btn--escola" data-sim-route="escola" data-house-id="${escapeHtml(house.id)}">${UI_ICONS.route} <span>Rota Escola</span></button>`
                      : ""
                  }
                </div>`
              : ""
          }
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
          ? `<img src="${escapeHtml(h.fotos[0])}" alt="${escapeHtml(h.titulo)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-photo-idx="0" data-fallback-compact="${escapeHtml(h.id)}">`
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

        const imovel = getImovelMeta(h);

        return `
          <div class="peek-card ${isSelected ? "is-selected" : ""}" data-peek-id="${escapeHtml(h.id)}" role="button" tabindex="0">
            <div class="peek-card__thumb">
              ${thumbHtml}
              <span class="peek-card__tag ${h.finalidade === "compra" ? "peek-card__tag--compra" : ""}">${h.finalidade === "compra" ? "Compra" : "Aluguel"}</span>
              ${h.moveis ? '<span class="peek-moveis-badge">Móveis</span>' : ""}
              <span class="peek-type-badge peek-type-badge--${imovel.cls}" title="${imovel.label}">${imovel.icon} ${imovel.shortLabel}</span>
            </div>
            <div class="peek-card__info">
              <div class="peek-card__top">
                <span class="peek-card__price">${formatCompactPrice(h.preco, h.finalidade)}${h.finalidade === "aluguel" ? "<small>/mês</small>" : ""}</span>
                <span class="peek-card__score">${h.overallScore}</span>
              </div>
              <p class="peek-card__title">${escapeHtml(h.titulo)}</p>
              <p class="peek-card__sub">${escapeHtml(h.bairro)}${h.quartos ? ` · ${h.quartos} qtos` : ""}${h.area_m2 ? ` · ${h.area_m2}m²` : ""}</p>
              ${commuteMini ? `<div class="peek-card__commute">${commuteMini}</div>` : ""}
              <div class="peek-card__foot">
                <div class="peek-card__near">${nearTop}</div>
                ${
                  h.link
                    ? `<a class="peek-go-link" href="${escapeHtml(h.link)}" target="_blank" rel="noopener noreferrer" aria-label="Ir para o imóvel">Ir ${UI_ICONS.external}</a>`
                    : ""
                }
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    el.mapCarousel.querySelectorAll(".peek-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".peek-go-link")) return;
        openHouseDetails(card.dataset.peekId, { fly: true });
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openHouseDetails(card.dataset.peekId, { fly: true });
        }
      });
    });

    el.mapCarousel.querySelectorAll("img[data-fallback-compact]").forEach((img) => {
      img.addEventListener("error", () => {
        const house = state.houses.find((h) => h.id === img.dataset.fallbackCompact);
        if (!house) return;
        const nextIdx = (Number(img.dataset.photoIdx) || 0) + 1;
        if (nextIdx < house.fotos.length) {
          img.dataset.photoIdx = String(nextIdx);
          img.src = house.fotos[nextIdx];
        } else {
          img.outerHTML = buildHouseIllustration(house, true);
        }
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
      clearSimulatedRoute();
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
    const currentPhotoIdx = hasPhotos ? ((state.activePhotoIndex % house.fotos.length) + house.fotos.length) % house.fotos.length : 0;
    const photoUrl = hasPhotos ? house.fotos[currentPhotoIdx] : null;
    const heroHtml = photoUrl
      ? `
        <img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(house.titulo)}" id="drawerHeroImg" decoding="async" referrerpolicy="no-referrer" data-photo-idx="${currentPhotoIdx}">
        ${
          house.fotos.length > 1
            ? `<span class="detail-hero__counter">${currentPhotoIdx + 1} / ${house.fotos.length}</span>
              <div class="detail-hero__nav">
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
      house.moveis ? { text: "Com móveis", accent: true } : { text: "Sem móveis", accent: false },
      house.aceita_pets ? { text: "Aceita pets", accent: true } : null,
      house.quintal ? { text: "Com quintal", accent: true } : null,
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

    const imovel = getImovelMeta(house);
    const workCommute = (house.commutes || []).find((c) => c.tipo === "trabalho");
    const schoolCommute = (house.commutes || []).find((c) => c.tipo === "escola");
    const showExtraTipo =
      house.tipo &&
      normalizeText(house.tipo) !== normalizeText(imovel.label);

    const routineCardsHtml = (house.commutes || [])
      .map((c) => {
        const cor = c.cor || (c.tipo === "trabalho" ? "#0369a1" : "#be185d");
        const dirUrl = `https://www.google.com/maps/dir/?api=1&origin=${house.lat},${house.lng}&destination=${c.lat},${c.lng}&travelmode=bicycling`;
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
                <small>⚡ ${c.emotoMin} min · 🚲 ${c.bikeMin} min</small>
              </div>
            </div>
            <div class="routine-card__modes">
              <div class="routine-card__times">
                <span title="Moto elétrica">⚡ ${c.emotoMin} min</span>
                <span title="Bike">🚲 ${c.bikeMin} min</span>
                <span title="Carro">🚗 ${c.driveMin} min</span>
                <span title="A pé">🚶 ${c.walkMin} min</span>
              </div>
              <div class="routine-card__actions">
                <button type="button" class="routine-mini-btn" data-show-anchor="${escapeHtml(c.id)}" data-sim-type="${escapeHtml(c.tipo)}">Simular rota</button>
                <a class="routine-mini-btn" href="${dirUrl}" target="_blank" rel="noopener noreferrer">Maps ↗</a>
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
          <span class="pill-badge pill-badge--${imovel.cls}">${imovel.icon} ${imovel.label}</span>
          <span class="pill-badge pill-badge--${house.finalidade}">${house.finalidade === "compra" ? "Compra" : "Aluguel"}</span>
          ${showExtraTipo ? `<span class="pill-badge">${escapeHtml(house.tipo)}</span>` : ""}
          ${house.moveis ? '<span class="pill-badge pill-badge--moveis">Com móveis</span>' : ""}
          ${house.portal ? `<span class="pill-badge">${escapeHtml(house.portal)}</span>` : ""}
          ${house.approxCoords ? `<span class="pill-badge">Posição aprox. pelo bairro</span>` : ""}
        </div>

        <p class="detail-price">
          ${formatCurrency(house.preco)}${house.finalidade === "aluguel" && house.preco ? `<span style="font-family:var(--font-sans);font-size:14px;font-weight:500;color:var(--ink-subtle)"> /mês</span>` : ""}
        </p>
        ${costParts.length ? `<p class="detail-costs">${escapeHtml(costParts.join(" · "))}</p>` : ""}

        <h2 class="detail-title">${escapeHtml(house.titulo)}</h2>
        <p class="detail-address">${escapeHtml(house.bairro)}${house.endereco ? ` · ${escapeHtml(house.endereco)}` : ""} · Maringá, PR</p>

        ${
          house.link
            ? `<div class="detail-top-cta">
                <a class="btn-primary" href="${escapeHtml(house.link)}" target="_blank" rel="noopener noreferrer">Ir para o imóvel ${UI_ICONS.external}</a>
              </div>`
            : ""
        }

        ${
          workCommute || schoolCommute
            ? `<div class="detail-route-cta">
                ${
                  workCommute
                    ? `<button type="button" class="route-sim-btn route-sim-btn--trabalho" data-drawer-sim-route="trabalho">
                        <span class="route-sim-btn__ico">${UI_ICONS.briefcase}</span>
                        <span class="route-sim-btn__text">
                          <strong>Simular rota Trabalho</strong>
                          <small>⚡ ${workCommute.emotoMin} min · 🚲 ${workCommute.bikeMin} min</small>
                        </span>
                      </button>`
                    : ""
                }
                ${
                  schoolCommute
                    ? `<button type="button" class="route-sim-btn route-sim-btn--escola" data-drawer-sim-route="escola">
                        <span class="route-sim-btn__ico">${UI_ICONS.school}</span>
                        <span class="route-sim-btn__text">
                          <strong>Simular rota Escola</strong>
                          <small>⚡ ${schoolCommute.emotoMin} min · 🚲 ${schoolCommute.bikeMin} min</small>
                        </span>
                      </button>`
                    : ""
                }
              </div>`
            : ""
        }

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
                <div class="grokbot-box__label">✦ Observações e destaques</div>
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
          <a class="btn-outline" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Google Maps</a>
          <a class="btn-outline" href="${streetViewUrl}" target="_blank" rel="noopener noreferrer">Street View</a>
        </div>
      </div>
    `;

    const heroImg = document.getElementById("drawerHeroImg");
    if (heroImg) {
      let failedTries = 0;
      heroImg.addEventListener("error", () => {
        failedTries++;
        if (failedTries < house.fotos.length) {
          state.activePhotoIndex = (state.activePhotoIndex + 1) % house.fotos.length;
          heroImg.src = house.fotos[state.activePhotoIndex];
          const counter = el.drawerBody.querySelector(".detail-hero__counter");
          if (counter) counter.textContent = `${state.activePhotoIndex + 1} / ${house.fotos.length}`;
        } else {
          heroImg.outerHTML = buildHouseIllustration(house);
        }
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

      // Touch swipe left/right on real photo gallery
      const heroBox = el.drawerBody.querySelector(".detail-hero");
      if (heroBox) {
        let startX = 0;
        heroBox.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
        heroBox.addEventListener("touchend", (e) => {
          const dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) > 40) {
            state.activePhotoIndex = dx < 0
              ? (state.activePhotoIndex + 1) % house.fotos.length
              : (state.activePhotoIndex - 1 + house.fotos.length) % house.fotos.length;
            renderDetailDrawer(house);
          }
        }, { passive: true });
      }
    }

    // Wire top "Simular rota Trabalho / Escola" buttons right below "Ir para o imóvel"
    el.drawerBody.querySelectorAll("[data-drawer-sim-route]").forEach((btn) => {
      const targetType = btn.dataset.drawerSimRoute;
      const anchor = (house.commutes || []).find((c) => c.tipo === targetType);
      if (anchor) {
        btn.addEventListener("mouseenter", () => highlightRouteToAnchor(house, anchor));
        btn.addEventListener("mouseleave", () => clearRouteHighlight());
      }
      btn.addEventListener("click", () => {
        simulateRouteForHouse(house.id, targetType);
      });
    });

    // Wire routine anchor cards (Escola & Trabalho)
    el.drawerBody.querySelectorAll("[data-show-anchor]").forEach((btn) => {
      const anchor = (house.commutes || []).find((c) => c.id === btn.dataset.showAnchor);
      if (!anchor) return;
      btn.addEventListener("mouseenter", () => highlightRouteToAnchor(house, anchor));
      btn.addEventListener("mouseleave", () => clearRouteHighlight());
      btn.addEventListener("click", () => {
        simulateRouteForHouse(house.id, anchor.tipo);
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
              <div class="compare-row"><span>Tipo</span><strong>${h.casa ? "Casa" : "Apartamento"}</strong></div>
              <div class="compare-row"><span>Bairro</span><strong>${escapeHtml(h.bairro)}</strong></div>
              <div class="compare-row"><span>Área útil</span><strong>${h.area_m2 ? `${h.area_m2} m²` : "—"}</strong></div>
              <div class="compare-row"><span>Quartos / Vagas</span><strong>${h.quartos || "—"} qtos · ${h.vagas || "—"} vagas</strong></div>
              <div class="compare-row"><span>Móveis</span><strong>${h.moveis ? "Com móveis" : "Sem móveis"}</strong></div>
              <div class="compare-row"><span>Pets / Quintal</span><strong>${h.aceita_pets ? "Sim" : "Não"} · ${h.quintal ? "Quintal" : "—"}</strong></div>
              <div class="compare-row"><span>Nota entorno</span><strong>${h.overallScore}/100</strong></div>
              <div class="compare-row"><span>Escola</span><strong>${formatDistance(h.schoolDist)} (⚡${emotoMinutes(h.schoolDist)}m / 🚲${bikeMinutes(h.schoolDist)}m)</strong></div>
              <div class="compare-row"><span>Trabalho</span><strong>${formatDistance(h.workDist)} (⚡${emotoMinutes(h.workDist)}m / 🚲${bikeMinutes(h.workDist)}m)</strong></div>
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

  function resetAllFilters() {
    state.filters = {
      query: "",
      finalidade: "todas",
      tipoImovel: "todos",
      minQuartos: 0,
      sort: "score",
      moveis: false,
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

    // Tipo de imóvel: Casa vs Apartamento (toggle chips in inline bar & segmented in filter sheet)
    document.querySelectorAll("[data-imovel]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.dataset.imovel;
        state.filters.tipoImovel = state.filters.tipoImovel === val ? "todos" : val;
        applyFiltersAndRender(false);
      });
    });
    document.querySelectorAll("[data-imovel-seg]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filters.tipoImovel = btn.dataset.imovelSeg;
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
        closeModal("compareModal");
        closeModal("filtersModal");
        if (state.simulatedRoute) clearSimulatedRoute();
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
      ingestFeed(state.publishedFeed, false);
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
