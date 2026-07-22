import React, { useEffect, useMemo, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  CreditCard,
  HeartPulse,
  Languages,
  LocateFixed,
  Luggage,
  MapPin,
  MapPinned,
  MessageCircle,
  MessageSquareText,
  Navigation,
  Phone,
  Plane,
  Route,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  TrainFront,
  TriangleAlert,
  Users,
  WalletCards,
} from "./icons";
import {
  CONTACT,
  DISPLAY_NAMES,
  FIXED_HOLIDAYS_MMDD,
  GOOGLE_REVIEWS,
  HOLIDAYS_2026,
  LEGAL,
  RATES,
  TARIFAS,
} from "./data";
import { initAnalytics, trackEvent } from "./analytics";
import seoPagesData from "./seoPages.json";
import "./styles.css";

type Result = {
  origin: string;
  destination: string;
  destinationKey: string;
  km: number;
  waitMinutes: number;
  waitPrice: number;
  price: number;
  tariffLabel: string;
  reason: string;
  dateLabel: string;
  hour: string;
  passengers: number;
  mode: BookingMode;
};

type BookingMode = "later" | "now";

type PickupLocation = {
  lat: number;
  lng: number;
} | null;

type ResultInput = {
  origin: string;
  date: string;
  hour: string;
  passengers: number;
  waitMinutes: number;
  mode: BookingMode;
  language?: LangCode;
};

type ExactRouteResponse = {
  km: number;
  billableKm?: number;
  durationMinutes?: number;
  originLabel?: string;
  destinationLabel?: string;
  originPoint?: RoutePoint;
  destinationPoint?: RoutePoint;
  baseAdjusted?: boolean;
  approximate?: boolean;
  provider?: string;
};

type AddressSuggestion = {
  label: string;
  detail?: string;
  lat?: number;
  lng?: number;
};

type KnownRoutePoint = AddressSuggestion & {
  keys: string[];
};

type RoutePoint = {
  label: string;
  lat: number;
  lng: number;
};

type ReviewItem = {
  author: string;
  text: string;
  rating?: number;
  time?: string;
  publishTime?: string;
  url?: string;
};

type ReviewsData = {
  rating: string;
  count: string;
  items: ReviewItem[];
  source?: string;
};

declare global {
  interface Window {
    __taxiAyudRoot?: Root;
  }
}

type WhatsAppOptions = {
  result: Result | null;
  origin: string;
  destination: string;
  date: string;
  hour: string;
  passengers: number;
  mode: BookingMode;
  notes: string;
  pickupLocation: PickupLocation;
};

type LangCode = "es" | "en" | "fr" | "ca" | "de" | "it" | "pt" | "nl" | "ar";

type GlobalCopy = {
  reserveWhatsapp: string;
  officialNotice: string;
  paymentShort: string;
  cookie: {
    aria: string;
    title: string;
    text: string;
    privacy: string;
    cookies: string;
    necessary: string;
    accept: string;
  };
  legal: {
    aria: string;
    legalTitle: string;
    legalText: string;
    privacyTitle: string;
    privacyText: string;
    cookiesTitle: string;
    cookiesText: string;
  };
  route: {
    dayLabel: string;
    premiumLabel: string;
    businessDay: string;
    night: string;
    holiday: string;
    calculated: string;
    estimated: string;
    habitual: string;
    dateEmpty: string;
    originFallback: string;
    destinationFallback: string;
  };
  location: {
    current: string;
    currentDetail: string;
    roadFallbackOrigin: string;
    roadNotes: string;
    unsupported: string;
    requesting: string;
    ready: string;
    failed: string;
  };
  media: {
    roadPhotoAlt: string;
    roadPhotoCaption: string;
  };
  aria: {
    brandHome: string;
    mainNav: string;
    language: string;
    relatedLinks: string;
    internalRoutes: string;
    languageVersions: string;
    serviceHighlights: string;
    bookingCard: string;
    quickContact: string;
    trustData: string;
    region: string;
    comfort: string;
    localSeo: string;
    tourist: string;
    bookingType: string;
    originSuggestions: string;
    destinationSuggestions: string;
    suggestedDestinations: string;
    reviewSignals: string;
    quickDestinations: string;
    mobileActions: string;
    roadMobile: string;
  };
  starsLabel: (rating: number) => string;
};

type Copy = {
  nav: string[];
  directWhatsapp: string;
  calculatePrice: string;
  call: string;
  heroEyebrow: string;
  heroSubtitle: string;
  bookTitle: string;
  bookText: string;
  noRoute: string;
  fastReply: string;
  taxiNow: string;
  sendWhatsapp: string;
  seeQuote: string;
  paymentTitle: string;
  paymentText: string;
  officialFare: string;
  googleText: string;
  googleRating: string;
  regionEyebrow: string;
  regionTitle: string;
  regionText: string;
  comfort: string[];
  seoEyebrow: string;
  seoTitle: string;
  seoText: string;
  seoRoutes: { title: string; text: string }[];
  calcEyebrow: string;
  calcTitle: string;
  calcText: string;
  schedule: string;
  now: string;
  origin: string;
  destination: string;
  originPlaceholder: string;
  destinationPlaceholder: string;
  habitualDestination: string;
  date: string;
  time: string;
  passengers: string;
  passengerOptions: string[];
  optionalWait: string;
  notes: string;
  notesPlaceholder: string;
  sendMyLocation: string;
  immediate: string;
  calculating: string;
  locationHint: string;
  routeMissing: string;
  routeError: string;
  resultDistance: string;
  quoteEstimate: string;
  quoteOfficial: string;
  bookWithMessage: string;
  seeAvailability: string;
  emptyResult: string;
  exactRouteFallback: string;
  apiPrivateNote: string;
  whatsappQuote: string;
  reviewsEyebrow: string;
  reviewsText: string;
  reviewsWith: string;
  featuredReview: string;
  moreReviews: string;
  viewGoogle: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesText: string;
  serviceItems: { title: string; text: string; detail: string }[];
  moreServices: string;
  vehicleEyebrow: string;
  vehicleText: string;
  vehicleSpecs: string[];
  tariffsEyebrow: string;
  tariffsTitle: string;
  tariffsText: string;
  chooseDestination: string;
  estimatedFare: string;
  oneWayKm: string;
  dayFare: string;
  nightFare: string;
  calcDestination: string;
  fullTable: string;
  filterTable: string;
  closingEyebrow: string;
  closingTitle: string;
  closingText: string;
  footerText: string;
  footerLinks: string[];
  floatingWhatsapp: string;
};

type SeoPage = {
  path: string;
  title: string;
  description: string;
  breadcrumb: string;
  navLabel: string;
  eyebrow: string;
  h1: string;
  intro: string;
  h2: string;
  body: string;
  sections: { heading: string; text: string }[];
  faq: { question: string; answer: string }[];
};

const LANGUAGE_OPTIONS: Record<LangCode, { label: string; short: string; whatsapp: string; dir: "ltr" | "rtl" }> = {
  es: { label: "Español", short: "ES", whatsapp: "Español", dir: "ltr" },
  en: { label: "English", short: "EN", whatsapp: "English", dir: "ltr" },
  fr: { label: "Français", short: "FR", whatsapp: "Français", dir: "ltr" },
  ca: { label: "Català", short: "CA", whatsapp: "Català", dir: "ltr" },
  de: { label: "Deutsch", short: "DE", whatsapp: "Deutsch", dir: "ltr" },
  it: { label: "Italiano", short: "IT", whatsapp: "Italiano", dir: "ltr" },
  pt: { label: "Português", short: "PT", whatsapp: "Português", dir: "ltr" },
  nl: { label: "Nederlands", short: "NL", whatsapp: "Nederlands", dir: "ltr" },
  ar: { label: "العربية", short: "AR", whatsapp: "Arabic / العربية", dir: "rtl" },
};

const HTML_LANG: Record<LangCode, string> = {
  es: "es-ES",
  en: "en",
  fr: "fr",
  ca: "ca-ES",
  de: "de",
  it: "it",
  pt: "pt",
  nl: "nl",
  ar: "ar",
};

const REVIEW_SIGNALS: Record<LangCode, string[]> = {
  es: ["Puntualidad", "Coche limpio", "Trato amable"],
  en: ["Punctual", "Clean car", "Kind service"],
  fr: ["Ponctuel", "Taxi propre", "Service aimable"],
  ca: ["Puntualitat", "Cotxe net", "Tracte amable"],
  de: ["Pünktlich", "Sauberes Auto", "Freundlich"],
  it: ["Puntuale", "Auto pulita", "Servizio gentile"],
  pt: ["Pontual", "Carro limpo", "Atendimento amable"],
  nl: ["Stipt", "Schone auto", "Vriendelijk"],
  ar: ["دقيق", "سيارة نظيفة", "خدمة لطيفة"],
};

const BASE_COPY = {
  es: {
    nav: ["WhatsApp", "Calcular", "Reseñas", "Servicios", "Tarifas"],
    directWhatsapp: "WhatsApp directo",
    calculatePrice: "Calcular precio",
    call: "Llamar",
    heroEyebrow: "Taxi oficial en Calatayud · Licencia 18",
    heroSubtitle:
      "Taxi desde Calatayud para pueblos de la comarca, balnearios, Monasterio de Piedra, Zaragoza, aeropuerto y estación.",
    bookTitle: "Reserva directa, sin formularios largos",
    bookText:
      "Manda un mensaje directo si solo quieres hablar, consultar disponibilidad o pedir taxi ahora. La calculadora queda abajo para presupuestos orientativos.",
    noRoute: "Sin calcular ruta",
    fastReply: "Respuesta rápida",
    taxiNow: "Taxi ahora",
    sendWhatsapp: "Enviar WhatsApp",
    seeQuote: "Ver presupuesto",
    paymentTitle: "Pago flexible",
    paymentText: "Efectivo · Tarjeta · Bizum · Apple Pay · Google Pay",
    officialFare: "Tarifa oficial",
    googleText: "públicas en el perfil de empresa",
    googleRating: "en Google",
    regionEyebrow: "Comarca de Calatayud",
    regionTitle: "Calatayud, pueblos de la comarca, balnearios y Zaragoza sin complicarte",
    regionText:
      "Servicio puntual, cómodo y discreto para moverte por Calatayud, Zaragoza y toda la comarca con maletas, familia o visitas turísticas.",
    comfort: ["Conducción tranquila", "Maletero amplio", "Taxi oficial", "Reserva por WhatsApp"],
    seoEyebrow: "Taxi local premium",
    seoTitle: "El taxi de confianza para Calatayud y la zona",
    seoText:
      "Rutas frecuentes con recogida en estación, hoteles, Plaza del Fuerte, pueblos de la comarca, Monasterio de Piedra, balnearios, Zaragoza y aeropuerto.",
    seoRoutes: [
      {
        title: "Taxi Calatayud estación AVE",
        text: "Recogidas puntuales en estación, hoteles y Plaza del Fuerte.",
      },
      {
        title: "Monasterio de Piedra y Nuévalos",
        text: "Traslado directo desde Calatayud con opción de vuelta programada.",
      },
      {
        title: "Zaragoza, aeropuerto y Delicias",
        text: "Viajes a Zaragoza-Delicias, Aeropuerto de Zaragoza, hospitales y centro.",
      },
      {
        title: "Balnearios y comarca",
        text: "Jaraba, Alhama de Aragón, Paracuellos, Ateca, Maluenda y pueblos.",
      },
    ],
    calcEyebrow: "Reserva y presupuesto",
    calcTitle: "Calcula la ruta y envía el mensaje listo",
    calcText:
      "Introduce origen, destino, fecha y pasajeros para preparar un presupuesto orientativo y enviar la reserva por WhatsApp.",
    schedule: "Programar",
    now: "Ahora",
    origin: "Origen",
    destination: "Destino",
    originPlaceholder: "Calle, hotel, estación, municipio...",
    destinationPlaceholder: "Calle, hotel, ciudad, aeropuerto...",
    habitualDestination: "Destino habitual",
    date: "Fecha",
    time: "Hora",
    passengers: "Pasajeros",
    passengerOptions: ["1 pasajero", "2 pasajeros", "3 pasajeros", "4 pasajeros"],
    optionalWait: "Espera opcional",
    notes: "Notas",
    notesPlaceholder: "Tren, maletas, hotel, vuelta...",
    sendMyLocation: "Enviar mi ubicación",
    immediate: "Se enviará como disponibilidad inmediata.",
    calculating: "Calculando...",
    locationHint:
      "Escribe una calle, hotel, estación o municipio. Si eliges una sugerencia, el cálculo será más preciso.",
    routeMissing: "Indica origen y destino para calcular una ruta exacta.",
    routeError:
      "🚕 Ups, esta ruta necesita una mirada rápida. No te preocupes: escríbeme por WhatsApp y te confirmo precio y disponibilidad enseguida.",
    resultDistance: "Distancia estimada",
    quoteEstimate: "Presupuesto orientativo",
    quoteOfficial:
      "Precio orientativo sujeto a confirmación directa según disponibilidad, ruta final, horario, espera y suplementos oficiales.",
    bookWithMessage: "Reservar con mensaje",
    seeAvailability: "Ver disponibilidad ahora",
    emptyResult:
      "Pulsa calcular precio para ver un presupuesto orientativo. La reserva y el importe final se confirman siempre por WhatsApp o llamada.",
    exactRouteFallback:
      "Escribe origen y destino para consultar disponibilidad y presupuesto por WhatsApp.",
    apiPrivateNote:
      "📲 El WhatsApp prepara los datos básicos para responder rápido. El precio final, disponibilidad y punto exacto se confirman directamente.",
    whatsappQuote: "Presupuesto por WhatsApp",
    reviewsEyebrow: "Reseñas de Google",
    reviewsText:
      "Destacamos la experiencia de Raquel en Google: puntualidad, taxi limpio y trato cercano. El resto de opiniones queda disponible en Google.",
    reviewsWith: "con",
    featuredReview: "Reseña principal",
    moreReviews: "Ver más reseñas",
    viewGoogle: "Ver más reseñas en Google",
    servicesEyebrow: "Servicios",
    servicesTitle: "Pueblos, balnearios y Zaragoza desde Calatayud",
    servicesText:
      "Servicio cómodo para moverte por la comarca: pueblos cercanos, balnearios, estación, Zaragoza, aeropuerto, citas médicas y viajes programados.",
    serviceItems: [
      {
        title: "Monasterio de Piedra",
        text: "Traslado directo desde Calatayud al parque natural, con recogida programada para la vuelta.",
        detail: "Ideal para visitantes que llegan en tren o se alojan en Calatayud y quieren aprovechar el día sin aparcar ni depender de horarios.",
      },
      {
        title: "Balnearios termales",
        text: "Alhama de Aragón, Jaraba, Paracuellos de Jiloca y complejos termales de la comarca.",
        detail: "Recogidas en domicilio, estación u hotel. Servicio cómodo para estancias de descanso, tratamientos y escapadas.",
      },
      {
        title: "Zaragoza y aeropuerto",
        text: "Estación Delicias, Aeropuerto de Zaragoza, hospitales, centro y cualquier punto de la ciudad.",
        detail: "Viaje puerta a puerta para trenes, vuelos, citas médicas, gestiones o compras sin transbordos.",
      },
      {
        title: "Estaciones y tren",
        text: "Conexiones con la estación de Calatayud, Delicias y otros puntos de recogida.",
        detail: "Reserva con hora cerrada para llegar tranquilo, incluso en trayectos de madrugada o festivos.",
      },
      {
        title: "Rutas turísticas",
        text: "Arte mudéjar, Augusta Bilbilis, bodegas D.O. Calatayud y recorridos por la comarca.",
        detail: "Disponibilidad por horas para hacer varias paradas y adaptar el itinerario a tu ritmo.",
      },
      {
        title: "Traslados médicos",
        text: "Centros de salud, clínicas y hospitales de Calatayud y Zaragoza.",
        detail: "Servicio discreto y puntual, con posibilidad de coordinar la vuelta después de la cita.",
      },
      {
        title: "Empresas y eventos",
        text: "Reuniones, hoteles, proveedores, bodas, comuniones y celebraciones.",
        detail: "Reservas programadas para clientes, trabajadores o invitados con hasta 4 pasajeros.",
      },
      {
        title: "Pueblos de la comarca",
        text: "Ateca, Maluenda, Ariza, Daroca, Cetina, Miedes y muchos otros destinos.",
        detail: "Consulta el destino en la calculadora o en la tabla para ver un precio orientativo.",
      },
      {
        title: "Recogida por avería en carretera",
        text: "Taxi para pasajeros que se han quedado tirados cerca de Calatayud, A-2, N-II o carreteras de la comarca.",
        detail: "Servicio de taxi para llevarte a un lugar seguro, taller, hotel, estación o destino indicado. No es servicio de grúa ni asistencia mecánica.",
      },
    ],
    moreServices: "Ver más servicios",
    vehicleEyebrow: "Vehículo",
    vehicleText:
      "Un Peugeot 408 blanco, hybrid, moderno, silencioso y amplio para traslados cómodos en carretera. Buen acceso, climatización, espacio para maletas y licencia oficial.",
    vehicleSpecs: ["Maletero amplio", "Hasta 4 pasajeros", "Seguro de pasajeros", "Pago fácil", "Interior cuidado", "Recogida puntual"],
    tariffsEyebrow: "Tabla de tarifas",
    tariffsTitle: "Destinos frecuentes",
    tariffsText:
      "Busca un municipio o ciudad para revisar kilómetros y precios orientativos. Las reservas se confirman por teléfono o WhatsApp.",
    chooseDestination: "Elige destino",
    estimatedFare: "Tarifa orientativa",
    oneWayKm: "Km ida",
    dayFare: "Diurna",
    nightFare: "Nocturna / festiva",
    calcDestination: "Calcular este destino",
    fullTable: "Ver tabla completa de destinos",
    filterTable: "Filtrar tabla",
    closingEyebrow: "Reserva directa",
    closingTitle: "Taxi disponible en Calatayud",
    closingText:
      "Para horarios exactos, viajes de madrugada, trayectos largos o recogidas especiales, confirma disponibilidad directamente.",
    footerText: "Taxi oficial en Calatayud.",
    footerLinks: ["Monasterio de Piedra", "Balnearios", "Zaragoza y aeropuerto", "Pueblos de la comarca"],
    floatingWhatsapp: "Reservar por WhatsApp",
  },
  en: {
    nav: ["WhatsApp", "Calculate", "Reviews", "Services", "Fares"],
    directWhatsapp: "Direct WhatsApp",
    calculatePrice: "Calculate fare",
    call: "Call",
    heroEyebrow: "Official taxi in Calatayud · Licence 18",
    heroSubtitle:
      "Taxi from Calatayud to local villages, spas, Monasterio de Piedra, Zaragoza, the airport and train stations.",
    bookTitle: "Book directly, no long forms",
    bookText:
      "Send a direct message to check availability or request a taxi now. Use the fare calculator below when you want an estimated quote.",
    noRoute: "No route needed",
    fastReply: "Fast reply",
    taxiNow: "Taxi now",
    sendWhatsapp: "Send WhatsApp",
    seeQuote: "See quote",
    paymentTitle: "Flexible payment",
    paymentText: "Cash · Card · Bizum · Apple Pay · Google Pay",
    officialFare: "Official fare",
    googleText: "public on the business profile",
    googleRating: "on Google",
    regionEyebrow: "Calatayud area",
    regionTitle: "Calatayud, local villages, spas and Zaragoza made easy",
    regionText:
      "A punctual, comfortable and discreet service for Calatayud, Zaragoza and the surrounding area with luggage, family or tourism plans.",
    comfort: ["Smooth driving", "Large boot", "Official taxi", "WhatsApp booking"],
    seoEyebrow: "Premium local taxi",
    seoTitle: "The trusted taxi for Calatayud and the area",
    seoText:
      "Frequent pick-ups at the station, hotels, Plaza del Fuerte, local villages, Monasterio de Piedra, spas, Zaragoza and the airport.",
    seoRoutes: [
      {
        title: "Calatayud train station taxi",
        text: "Punctual pick-ups at the station, hotels and Plaza del Fuerte.",
      },
      {
        title: "Monasterio de Piedra and Nuevalos",
        text: "Direct transfer from Calatayud with optional scheduled return.",
      },
      {
        title: "Zaragoza, airport and Delicias",
        text: "Trips to Zaragoza-Delicias, Zaragoza Airport, hospitals and city centre.",
      },
      {
        title: "Spas and local villages",
        text: "Jaraba, Alhama de Aragon, Paracuellos, Ateca, Maluenda and nearby towns.",
      },
    ],
    calcEyebrow: "Booking and quote",
    calcTitle: "Calculate the route and send a ready message",
    calcText:
      "Enter origin, destination, date and passengers to prepare an estimated quote and send the booking by WhatsApp.",
    schedule: "Schedule",
    now: "Now",
    origin: "Origin",
    destination: "Destination",
    originPlaceholder: "Street, hotel, station, town...",
    destinationPlaceholder: "Street, hotel, city, airport...",
    habitualDestination: "Common destination",
    date: "Date",
    time: "Time",
    passengers: "Passengers",
    passengerOptions: ["1 passenger", "2 passengers", "3 passengers", "4 passengers"],
    optionalWait: "Optional wait",
    notes: "Notes",
    notesPlaceholder: "Train, luggage, hotel, return...",
    sendMyLocation: "Send my location",
    immediate: "This will be sent as immediate availability.",
    calculating: "Calculating...",
    locationHint: "Enter a street, hotel, station or town. Choosing a suggestion improves accuracy.",
    routeMissing: "Enter origin and destination to calculate an exact route.",
    routeError:
      "🚕 Oops, this route needs a quick manual check. No worries: send it by WhatsApp and I will confirm price and availability right away.",
    resultDistance: "Estimated distance",
    quoteEstimate: "Estimated quote",
    quoteOfficial:
      "Indicative price subject to direct confirmation depending on availability, final route, time, waiting time and official supplements.",
    bookWithMessage: "Book with message",
    seeAvailability: "Check availability now",
    emptyResult:
      "Tap calculate fare to see an estimated quote. You can also ask by WhatsApp without calculating.",
    exactRouteFallback:
      "Enter origin and destination to ask for availability and an estimated quote by WhatsApp.",
    apiPrivateNote:
      "📲 The WhatsApp message already includes origin, destination, date and passengers so we can help quickly.",
    whatsappQuote: "WhatsApp quote",
    reviewsEyebrow: "Google reviews",
    reviewsText:
      "Raquel's Google review is highlighted for punctuality, a clean taxi and kind service. The rest of the reviews are available on Google.",
    reviewsWith: "with",
    featuredReview: "Main review",
    moreReviews: "See more reviews",
    viewGoogle: "See more reviews on Google",
    servicesEyebrow: "Services",
    servicesTitle: "Local villages, spas and Zaragoza from Calatayud",
    servicesText:
      "Comfortable service around the area: nearby villages, spas, train station, Zaragoza, airport, medical appointments and scheduled journeys.",
    serviceItems: [
      {
        title: "Monasterio de Piedra",
        text: "Direct transfer from Calatayud to the natural park, with scheduled return pick-up if needed.",
        detail: "Ideal for visitors arriving by train or staying in Calatayud who want an easy day out.",
      },
      {
        title: "Thermal spas",
        text: "Alhama de Aragon, Jaraba, Paracuellos de Jiloca and local spa resorts.",
        detail: "Pick-up from home, station or hotel for relaxing stays, treatments and short breaks.",
      },
      {
        title: "Zaragoza and airport",
        text: "Delicias station, Zaragoza Airport, hospitals, city centre and any point in the city.",
        detail: "Door-to-door journeys for trains, flights, medical visits, shopping or appointments.",
      },
      {
        title: "Stations and trains",
        text: "Connections with Calatayud station, Delicias and other pick-up points.",
        detail: "Book a fixed time to travel calmly, including early morning or holiday journeys.",
      },
      {
        title: "Tourism routes",
        text: "Mudejar art, Augusta Bilbilis, Calatayud wine routes and local villages.",
        detail: "Hourly availability for several stops and an itinerary adapted to your pace.",
      },
      {
        title: "Medical transfers",
        text: "Health centres, clinics and hospitals in Calatayud and Zaragoza.",
        detail: "Discreet and punctual service, with return pick-up coordination after the appointment.",
      },
      {
        title: "Business and events",
        text: "Meetings, hotels, suppliers, weddings, communions and celebrations.",
        detail: "Scheduled bookings for clients, employees or guests with up to 4 passengers.",
      },
      {
        title: "Local villages",
        text: "Ateca, Maluenda, Ariza, Daroca, Cetina, Miedes and many more destinations.",
        detail: "Check the calculator or fare table for an estimated price.",
      },
      {
        title: "Road breakdown passenger pick-up",
        text: "Taxi for passengers stranded near Calatayud, the A-2, N-II or nearby roads.",
        detail: "Passenger taxi to a safe place, garage, hotel, station or chosen destination. This is not a tow truck or mechanical assistance service.",
      },
    ],
    moreServices: "See more services",
    vehicleEyebrow: "Vehicle",
    vehicleText:
      "A white Peugeot 408 hybrid: modern, quiet and spacious for comfortable road transfers, with air conditioning, luggage space and official licence.",
    vehicleSpecs: ["Large boot", "Up to 4 passengers", "Passenger insurance", "Easy payment", "Clean interior", "Punctual pick-up"],
    tariffsEyebrow: "Fare table",
    tariffsTitle: "Frequent destinations",
    tariffsText:
      "Search a town or city to check kilometres and estimated prices. Bookings are confirmed by phone or WhatsApp.",
    chooseDestination: "Choose destination",
    estimatedFare: "Estimated fare",
    oneWayKm: "One-way km",
    dayFare: "Day fare",
    nightFare: "Night / holiday",
    calcDestination: "Calculate this destination",
    fullTable: "See full destination table",
    filterTable: "Filter table",
    closingEyebrow: "Direct booking",
    closingTitle: "Taxi available in Calatayud",
    closingText: "For exact times, night journeys, long trips or special pick-ups, confirm availability directly.",
    footerText: "Official taxi in Calatayud.",
    footerLinks: ["Monasterio de Piedra", "Spas", "Zaragoza and airport", "Local villages"],
    floatingWhatsapp: "Book by WhatsApp",
  },
  fr: {
    nav: ["WhatsApp", "Calculer", "Avis", "Services", "Tarifs"],
    directWhatsapp: "WhatsApp direct",
    calculatePrice: "Calculer le prix",
    call: "Appeler",
    heroEyebrow: "Taxi officiel à Calatayud · Licence 18",
    heroSubtitle:
      "Taxi depuis Calatayud vers les villages de la région, les thermes, le Monasterio de Piedra, Saragosse, l'aéroport et la gare.",
    bookTitle: "Réservation directe, sans long formulaire",
    bookText:
      "Envoyez un message direct pour vérifier la disponibilité ou demander un taxi maintenant. Le calculateur donne une estimation.",
    noRoute: "Sans calculer",
    fastReply: "Réponse rapide",
    taxiNow: "Taxi maintenant",
    sendWhatsapp: "Envoyer WhatsApp",
    seeQuote: "Voir estimation",
    paymentTitle: "Paiement flexible",
    paymentText: "Espèces · Carte · Bizum · Apple Pay · Google Pay",
    officialFare: "Tarif officiel",
    googleText: "publiques sur le profil de l'entreprise",
    googleRating: "sur Google",
    regionEyebrow: "Région de Calatayud",
    regionTitle: "Calatayud, villages de la région, thermes et Saragosse sans complication",
    regionText:
      "Service ponctuel, confortable et discret pour Calatayud, Saragosse et toute la région avec bagages, famille ou visites.",
    comfort: ["Conduite tranquille", "Grand coffre", "Taxi officiel", "Réservation WhatsApp"],
    seoEyebrow: "Taxi local premium",
    seoTitle: "Le taxi de confiance pour Calatayud et la région",
    seoText:
      "Trajets fréquents depuis la gare, hôtels, Plaza del Fuerte, villages de la région, Monasterio de Piedra, thermes, Saragosse et l'aéroport.",
    seoRoutes: [
      {
        title: "Taxi gare de Calatayud",
        text: "Prises en charge ponctuelles à la gare, hôtels et Plaza del Fuerte.",
      },
      {
        title: "Monasterio de Piedra et Nuevalos",
        text: "Transfert direct depuis Calatayud avec retour programmé possible.",
      },
      {
        title: "Saragosse, aéroport et Delicias",
        text: "Trajets vers Delicias, l'aéroport, les hôpitaux et le centre.",
      },
      {
        title: "Thermes et villages",
        text: "Jaraba, Alhama de Aragon, Paracuellos, Ateca, Maluenda et alentours.",
      },
    ],
    calcEyebrow: "Réservation et estimation",
    calcTitle: "Calculez l'itinéraire et envoyez le message prêt",
    calcText:
      "Indiquez le départ, la destination, la date et les passagers pour préparer une estimation et envoyer la réservation par WhatsApp.",
    schedule: "Programmer",
    now: "Maintenant",
    origin: "Départ",
    destination: "Destination",
    originPlaceholder: "Rue, hôtel, gare, commune...",
    destinationPlaceholder: "Rue, hôtel, ville, aéroport...",
    habitualDestination: "Destination habituelle",
    date: "Date",
    time: "Heure",
    passengers: "Passagers",
    passengerOptions: ["1 passager", "2 passagers", "3 passagers", "4 passagers"],
    optionalWait: "Attente optionnelle",
    notes: "Notes",
    notesPlaceholder: "Train, bagages, hôtel, retour...",
    sendMyLocation: "Envoyer ma position",
    immediate: "Sera envoyé comme disponibilité immédiate.",
    calculating: "Calcul...",
    locationHint: "Saisissez une rue, un hôtel, une gare ou une commune. Une suggestion améliore la précision.",
    routeMissing: "Indiquez le départ et la destination pour calculer l'itinéraire.",
    routeError:
      "🚕 Oups, cet itinéraire demande une vérification rapide. Pas d'inquiétude : envoyez-le par WhatsApp et je confirme le prix et la disponibilité.",
    resultDistance: "Distance estimée",
    quoteEstimate: "Estimation",
    quoteOfficial:
      "Prix indicatif soumis à confirmation directe selon disponibilité, itinéraire final, horaire, attente et suppléments officiels.",
    bookWithMessage: "Réserver avec message",
    seeAvailability: "Voir disponibilité",
    emptyResult: "Appuyez sur calculer pour voir une estimation ou demandez par WhatsApp.",
    exactRouteFallback: "Indiquez le départ et la destination pour demander disponibilité et estimation par WhatsApp.",
    apiPrivateNote:
      "📲 Le message WhatsApp contient déjà le départ, la destination, la date et les passagers.",
    whatsappQuote: "Estimation WhatsApp",
    reviewsEyebrow: "Avis Google",
    reviewsText: "L'avis de Raquel sur Google est mis en avant pour la ponctualité, le taxi propre et le service aimable. Le reste est disponible sur Google.",
    reviewsWith: "avec",
    featuredReview: "Avis principal",
    moreReviews: "Voir plus d'avis",
    viewGoogle: "Voir plus d'avis sur Google",
    servicesEyebrow: "Services",
    servicesTitle: "Villages, thermes et Saragosse depuis Calatayud",
    servicesText: "Service confortable dans la région : villages proches, thermes, gare, Saragosse, aéroport, rendez-vous médicaux et trajets programmés.",
    serviceItems: [
      {
        title: "Monasterio de Piedra",
        text: "Transfert direct depuis Calatayud vers le parc naturel, avec retour programmé si besoin.",
        detail: "Idéal pour les visiteurs arrivant en train ou séjournant à Calatayud.",
      },
      {
        title: "Thermes",
        text: "Alhama de Aragon, Jaraba, Paracuellos de Jiloca et complexes thermaux.",
        detail: "Prise en charge à domicile, à la gare ou à l'hôtel pour séjours et soins.",
      },
      {
        title: "Saragosse et aéroport",
        text: "Gare Delicias, aéroport de Saragosse, hôpitaux, centre et toute adresse en ville.",
        detail: "Trajet porte à porte pour trains, vols, rendez-vous médicaux ou achats.",
      },
      {
        title: "Gares et trains",
        text: "Connexions avec la gare de Calatayud, Delicias et autres points de prise en charge.",
        detail: "Réservation à heure fixe, même tôt le matin ou les jours fériés.",
      },
      {
        title: "Routes touristiques",
        text: "Art mudéjar, Augusta Bilbilis, vins D.O. Calatayud et villages de la région.",
        detail: "Disponibilité à l'heure pour plusieurs arrêts et un itinéraire sur mesure.",
      },
      {
        title: "Transferts médicaux",
        text: "Centres de santé, cliniques et hôpitaux de Calatayud et Saragosse.",
        detail: "Service discret et ponctuel avec retour coordonné après le rendez-vous.",
      },
      {
        title: "Entreprises et événements",
        text: "Réunions, hôtels, fournisseurs, mariages, communions et célébrations.",
        detail: "Réservations programmées pour clients, salariés ou invités jusqu'à 4 passagers.",
      },
      {
        title: "Villages de la région",
        text: "Ateca, Maluenda, Ariza, Daroca, Cetina, Miedes et beaucoup d'autres destinations.",
        detail: "Consultez le calculateur ou le tableau pour un prix estimé.",
      },
    ],
    moreServices: "Voir plus de services",
    vehicleEyebrow: "Véhicule",
    vehicleText:
      "Peugeot 408 hybrid blanc, moderne, silencieux et spacieux pour des transferts confortables avec climatisation, coffre et licence officielle.",
    vehicleSpecs: ["Grand coffre", "Jusqu'à 4 passagers", "Assurance passagers", "Paiement facile", "Intérieur soigné", "Prise en charge ponctuelle"],
    tariffsEyebrow: "Tarifs",
    tariffsTitle: "Destinations fréquentes",
    tariffsText: "Recherchez une ville pour consulter les kilomètres et les prix estimés.",
    chooseDestination: "Choisir destination",
    estimatedFare: "Tarif estimé",
    oneWayKm: "Km aller",
    dayFare: "Jour",
    nightFare: "Nuit / férié",
    calcDestination: "Calculer cette destination",
    fullTable: "Voir la table complète",
    filterTable: "Filtrer la table",
    closingEyebrow: "Réservation directe",
    closingTitle: "Taxi disponible à Calatayud",
    closingText: "Pour horaires exacts, nuits, longs trajets ou prises en charge spéciales, confirmez directement.",
    footerText: "Taxi officiel à Calatayud.",
    footerLinks: ["Monasterio de Piedra", "Thermes", "Saragosse et aéroport", "Villages de la région"],
    floatingWhatsapp: "Réserver par WhatsApp",
  },
  ar: {
    nav: ["واتساب", "احسب", "التقييمات", "الخدمات", "الأسعار"],
    directWhatsapp: "واتساب مباشر",
    calculatePrice: "احسب السعر",
    call: "اتصال",
    heroEyebrow: "تاكسي رسمي في كالاتايود · رخصة 18",
    heroSubtitle:
      "تاكسي من كالاتايود إلى قرى المنطقة، المنتجعات، دير الحجر، سرقسطة، المطار والمحطة.",
    bookTitle: "حجز مباشر بدون نماذج طويلة",
    bookText: "أرسل رسالة مباشرة للاستفسار عن التوفر أو طلب تاكسي الآن. يمكن استخدام الحاسبة لتقدير السعر.",
    noRoute: "بدون حساب المسار",
    fastReply: "رد سريع",
    taxiNow: "تاكسي الآن",
    sendWhatsapp: "إرسال واتساب",
    seeQuote: "عرض التقدير",
    paymentTitle: "دفع مرن",
    paymentText: "نقدا · بطاقة · Bizum · Apple Pay · Google Pay",
    officialFare: "تعرفة رسمية",
    googleText: "منشورة في ملف Google التجاري",
    googleRating: "على Google",
    regionEyebrow: "منطقة كالاتايود",
    regionTitle: "كالاتايود، قرى المنطقة، المنتجعات وسرقسطة بسهولة",
    regionText: "خدمة دقيقة ومريحة للتنقل في كالاتايود وسرقسطة والمنطقة مع حقائب أو عائلة أو سياحة.",
    comfort: ["قيادة هادئة", "صندوق واسع", "تاكسي رسمي", "حجز واتساب"],
    seoEyebrow: "تاكسي محلي مميز",
    seoTitle: "تاكسي موثوق في كالاتايود والمنطقة",
    seoText: "رحلات متكررة من المحطة، الفنادق، Plaza del Fuerte، قرى المنطقة، دير الحجر، المنتجعات، سرقسطة والمطار.",
    seoRoutes: [
      {
        title: "تاكسي محطة كالاتايود",
        text: "استقبال دقيق من المحطة والفنادق وPlaza del Fuerte.",
      },
      {
        title: "دير الحجر ونويفالوس",
        text: "تنقل مباشر من كالاتايود مع إمكانية حجز العودة.",
      },
      {
        title: "سرقسطة، المطار وDelicias",
        text: "رحلات إلى Delicias ومطار سرقسطة والمستشفيات والمركز.",
      },
      {
        title: "المنتجعات وقرى المنطقة",
        text: "Jaraba وAlhama de Aragon وParacuellos وAteca وMaluenda والقرى القريبة.",
      },
    ],
    calcEyebrow: "حجز وتقدير",
    calcTitle: "احسب المسار وأرسل رسالة جاهزة",
    calcText: "أدخل نقطة الانطلاق والوجهة والتاريخ وعدد الركاب لإعداد تقدير وإرسال الحجز عبر واتساب.",
    schedule: "حجز لاحق",
    now: "الآن",
    origin: "نقطة الانطلاق",
    destination: "الوجهة",
    originPlaceholder: "شارع، فندق، محطة، بلدة...",
    destinationPlaceholder: "شارع، فندق، مدينة، مطار...",
    habitualDestination: "وجهة شائعة",
    date: "التاريخ",
    time: "الوقت",
    passengers: "الركاب",
    passengerOptions: ["راكب واحد", "راكبان", "3 ركاب", "4 ركاب"],
    optionalWait: "انتظار اختياري",
    notes: "ملاحظات",
    notesPlaceholder: "قطار، حقائب، فندق، عودة...",
    sendMyLocation: "إرسال موقعي",
    immediate: "سيتم إرسالها كطلب فوري.",
    calculating: "جار الحساب...",
    locationHint: "اكتب شارعا أو فندقا أو محطة أو بلدة. اختيار اقتراح يحسن الدقة.",
    routeMissing: "أدخل نقطة الانطلاق والوجهة لحساب المسار.",
    routeError: "🚕 لا تقلق، هذا المسار يحتاج تأكيدا سريعا. أرسله عبر واتساب وسأؤكد لك السعر والتوفر.",
    resultDistance: "المسافة التقديرية",
    quoteEstimate: "تقدير السعر",
    quoteOfficial: "السعر تقديري ويخضع للتأكيد المباشر حسب التوفر والمسار النهائي والوقت والانتظار والرسوم الرسمية.",
    bookWithMessage: "احجز برسالة",
    seeAvailability: "تحقق من التوفر الآن",
    emptyResult: "اضغط احسب السعر لرؤية تقدير أو اسأل عبر واتساب بدون حساب.",
    exactRouteFallback: "أدخل نقطة الانطلاق والوجهة لطلب التوفر والتقدير عبر واتساب.",
    apiPrivateNote: "📲 رسالة واتساب تتضمن نقطة الانطلاق والوجهة والتاريخ وعدد الركاب للمساعدة بسرعة.",
    whatsappQuote: "تقدير عبر واتساب",
    reviewsEyebrow: "تقييمات Google",
    reviewsText: "نبرز تقييم Raquel على Google بسبب الالتزام بالمواعيد ونظافة سيارة الأجرة والخدمة اللطيفة. يمكن رؤية باقي التقييمات على Google.",
    reviewsWith: "مع",
    featuredReview: "التقييم الرئيسي",
    moreReviews: "عرض المزيد من التقييمات",
    viewGoogle: "عرض المزيد من تقييمات Google",
    servicesEyebrow: "الخدمات",
    servicesTitle: "قرى المنطقة والمنتجعات وسرقسطة من كالاتايود",
    servicesText: "خدمة مريحة للتنقل في المنطقة: القرى القريبة، المنتجعات، المحطة، سرقسطة، المطار، المواعيد الطبية والحجوزات المبرمجة.",
    serviceItems: [
      {
        title: "دير الحجر",
        text: "تنقل مباشر من كالاتايود إلى المنتزه الطبيعي مع إمكانية حجز العودة.",
        detail: "مناسب للزوار القادمين بالقطار أو المقيمين في كالاتايود لقضاء يوم مريح.",
      },
      {
        title: "المنتجعات الحرارية",
        text: "Alhama de Aragon وJaraba وParacuellos de Jiloca ومنتجعات المنطقة.",
        detail: "استقبال من المنزل أو المحطة أو الفندق للراحة والعلاج والرحلات القصيرة.",
      },
      {
        title: "سرقسطة والمطار",
        text: "محطة Delicias ومطار سرقسطة والمستشفيات والمركز وأي نقطة في المدينة.",
        detail: "رحلات من الباب إلى الباب للقطارات والرحلات والمواعيد الطبية.",
      },
      {
        title: "المحطات والقطارات",
        text: "اتصالات مع محطة كالاتايود وDelicias ونقاط استقبال أخرى.",
        detail: "حجز بوقت محدد للسفر بهدوء حتى في الصباح الباكر أو العطل.",
      },
      {
        title: "مسارات سياحية",
        text: "الفن المدجن، Augusta Bilbilis، طرق النبيذ وقرى المنطقة.",
        detail: "إمكانية الحجز بالساعة مع عدة توقفات ومسار مناسب لوقتك.",
      },
      {
        title: "تنقلات طبية",
        text: "المراكز الصحية والعيادات والمستشفيات في كالاتايود وسرقسطة.",
        detail: "خدمة دقيقة وهادئة مع إمكانية تنسيق العودة بعد الموعد.",
      },
      {
        title: "الشركات والمناسبات",
        text: "اجتماعات، فنادق، موردون، حفلات زفاف واحتفالات.",
        detail: "حجوزات مبرمجة للعملاء أو الموظفين أو الضيوف حتى 4 ركاب.",
      },
      {
        title: "قرى المنطقة",
        text: "Ateca وMaluenda وAriza وDaroca وCetina وMiedes ووجهات أخرى.",
        detail: "راجع الحاسبة أو جدول الأسعار للحصول على سعر تقديري.",
      },
    ],
    moreServices: "عرض خدمات أكثر",
    vehicleEyebrow: "السيارة",
    vehicleText: "Peugeot 408 Hybrid أبيض، حديث وهادئ وواسع لتنقلات مريحة مع تكييف ومساحة للحقائب ورخصة رسمية.",
    vehicleSpecs: ["صندوق واسع", "حتى 4 ركاب", "تأمين الركاب", "دفع سهل", "داخلية نظيفة", "وصول دقيق"],
    tariffsEyebrow: "جدول الأسعار",
    tariffsTitle: "وجهات متكررة",
    tariffsText: "ابحث عن بلدة أو مدينة لمراجعة الكيلومترات والأسعار التقديرية.",
    chooseDestination: "اختر الوجهة",
    estimatedFare: "السعر التقديري",
    oneWayKm: "كم ذهاب",
    dayFare: "نهاري",
    nightFare: "ليلي / عطلة",
    calcDestination: "احسب هذه الوجهة",
    fullTable: "عرض الجدول الكامل",
    filterTable: "تصفية الجدول",
    closingEyebrow: "حجز مباشر",
    closingTitle: "تاكسي متاح في كالاتايود",
    closingText: "للمواعيد الدقيقة أو الرحلات الليلية أو الطويلة أو نقاط الالتقاط الخاصة، أكد التوفر مباشرة.",
    footerText: "تاكسي رسمي في كالاتايود.",
    footerLinks: ["دير الحجر", "المنتجعات", "سرقسطة والمطار", "قرى المنطقة"],
    floatingWhatsapp: "الحجز عبر واتساب",
  },
} satisfies Record<"es" | "en" | "fr" | "ar", Copy>;

const COPY: Record<LangCode, Copy> = {
  es: BASE_COPY.es,
  en: BASE_COPY.en,
  fr: BASE_COPY.fr,
  ar: BASE_COPY.ar,
  ca: {
    ...BASE_COPY.es,
    nav: ["WhatsApp", "Calcular", "Ressenyes", "Serveis", "Tarifes"],
    directWhatsapp: "WhatsApp directe",
    calculatePrice: "Calcular preu",
    call: "Trucar",
    heroEyebrow: "Taxi oficial a Calatayud · Llicència 18",
    heroSubtitle:
      "Taxi des de Calatayud per a pobles de la comarca, balnearis, Monasterio de Piedra, Saragossa, aeroport i estació.",
    bookTitle: "Reserva directa, sense formularis llargs",
    bookText:
      "Envia un missatge directe per consultar disponibilitat o demanar taxi ara. La calculadora queda a sota per a pressupostos orientatius.",
    noRoute: "Sense calcular ruta",
    fastReply: "Resposta ràpida",
    taxiNow: "Taxi ara",
    sendWhatsapp: "Enviar WhatsApp",
    seeQuote: "Veure pressupost",
    paymentTitle: "Pagament flexible",
    paymentText: "Efectiu · Targeta · Bizum · Apple Pay · Google Pay",
    officialFare: "Tarifa oficial",
    googleText: "públiques al perfil d'empresa",
    googleRating: "a Google",
    regionEyebrow: "Comarca de Calatayud",
    regionTitle: "Calatayud, pobles de la comarca, balnearis i Saragossa sense complicacions",
    regionText:
      "Servei puntual, còmode i discret per moure't per Calatayud, Saragossa i tota la comarca amb maletes, família o visites turístiques.",
    comfort: ["Conducció tranquil·la", "Maleter ampli", "Taxi oficial", "Reserva per WhatsApp"],
    seoEyebrow: "Taxi local premium",
    seoTitle: "El taxi de confiança per a Calatayud i la zona",
    seoText:
      "Rutes freqüents amb recollida a estació, hotels, Plaza del Fuerte, pobles de la comarca, Monasterio de Piedra, balnearis, Saragossa i aeroport.",
    seoRoutes: [
      {
        title: "Taxi estació AVE Calatayud",
        text: "Recollides puntuals a l'estació, hotels i Plaza del Fuerte.",
      },
      {
        title: "Monasterio de Piedra i Nuévalos",
        text: "Trasllat directe des de Calatayud amb tornada programada opcional.",
      },
      {
        title: "Saragossa, aeroport i Delicias",
        text: "Viatges a Saragossa-Delicias, Aeroport de Saragossa, hospitals i centre.",
      },
      {
        title: "Balnearis i comarca",
        text: "Jaraba, Alhama de Aragón, Paracuellos, Ateca, Maluenda i pobles propers.",
      },
    ],
    calcEyebrow: "Reserva i pressupost",
    calcTitle: "Calcula la ruta i envia el missatge preparat",
    calcText:
      "Introdueix origen, destinació, data i passatgers per preparar un pressupost orientatiu i enviar la reserva per WhatsApp.",
    schedule: "Programar",
    now: "Ara",
    origin: "Origen",
    destination: "Destinació",
    originPlaceholder: "Carrer, hotel, estació, municipi...",
    destinationPlaceholder: "Carrer, hotel, ciutat, aeroport...",
    habitualDestination: "Destinació habitual",
    date: "Data",
    time: "Hora",
    passengers: "Passatgers",
    passengerOptions: ["1 passatger", "2 passatgers", "3 passatgers", "4 passatgers"],
    optionalWait: "Espera opcional",
    notes: "Notes",
    notesPlaceholder: "Tren, maletes, hotel, tornada...",
    sendMyLocation: "Enviar la meva ubicació",
    immediate: "S'enviarà com a disponibilitat immediata.",
    calculating: "Calculant...",
    locationHint:
      "Escriu un carrer, hotel, estació o municipi. Si tries una suggerència, el càlcul serà més precís.",
    routeMissing: "Indica origen i destinació per calcular una ruta exacta.",
    routeError:
      "🚕 Ui, aquesta ruta necessita una mirada ràpida. No pateixis: envia-la per WhatsApp i confirmo preu i disponibilitat de seguida.",
    resultDistance: "Distància estimada",
    quoteEstimate: "Pressupost orientatiu",
    quoteOfficial:
      "Preu orientatiu subjecte a confirmació directa segons disponibilitat, ruta final, horari, espera i suplements oficials.",
    bookWithMessage: "Reservar amb missatge",
    seeAvailability: "Veure disponibilitat ara",
    emptyResult:
      "Prem calcular preu per veure un pressupost orientatiu. La reserva i l'import final es confirmen sempre per WhatsApp o trucada.",
    exactRouteFallback:
      "Escriu origen i destinació per consultar disponibilitat i pressupost per WhatsApp.",
    whatsappQuote: "Pressupost per WhatsApp",
    apiPrivateNote:
      "📲 El WhatsApp prepara les dades bàsiques per respondre ràpid. El preu final, disponibilitat i punt exacte es confirmen directament.",
    reviewsEyebrow: "Ressenyes de Google",
    reviewsText:
      "Destaquem l'experiència de Raquel a Google: puntualitat, taxi net i tracte proper. La resta d'opinions queda disponible a Google.",
    reviewsWith: "amb",
    featuredReview: "Ressenya principal",
    moreReviews: "Veure més ressenyes",
    viewGoogle: "Veure més ressenyes a Google",
    servicesEyebrow: "Serveis",
    servicesTitle: "Pobles, balnearis i Saragossa des de Calatayud",
    servicesText:
      "Servei còmode per moure't per la comarca: pobles propers, balnearis, estació, Saragossa, aeroport, cites mèdiques i viatges programats.",
    serviceItems: [
      {
        title: "Monasterio de Piedra",
        text: "Trasllat directe des de Calatayud al parc natural, amb recollida programada per a la tornada.",
        detail: "Ideal per a visitants que arriben en tren o s'allotgen a Calatayud i volen aprofitar el dia sense aparcar.",
      },
      {
        title: "Balnearis termals",
        text: "Alhama de Aragón, Jaraba, Paracuellos de Jiloca i complexos termals de la comarca.",
        detail: "Recollides a domicili, estació o hotel per a estades de descans, tractaments i escapades.",
      },
      {
        title: "Saragossa i aeroport",
        text: "Estació Delicias, Aeroport de Saragossa, hospitals, centre i qualsevol punt de la ciutat.",
        detail: "Viatge porta a porta per a trens, vols, cites mèdiques, gestions o compres sense transbordaments.",
      },
      {
        title: "Estacions i tren",
        text: "Connexions amb l'estació de Calatayud, Delicias i altres punts de recollida.",
        detail: "Reserva amb hora tancada per arribar tranquil, fins i tot de matinada o en festius.",
      },
      {
        title: "Rutes turístiques",
        text: "Art mudèjar, Augusta Bilbilis, bodegues D.O. Calatayud i recorreguts per la comarca.",
        detail: "Disponibilitat per hores per fer diverses parades i adaptar l'itinerari al teu ritme.",
      },
      {
        title: "Trasllats mèdics",
        text: "Centres de salut, clíniques i hospitals de Calatayud i Saragossa.",
        detail: "Servei discret i puntual, amb possibilitat de coordinar la tornada després de la cita.",
      },
      {
        title: "Empreses i esdeveniments",
        text: "Reunions, hotels, proveïdors, casaments, comunions i celebracions.",
        detail: "Reserves programades per a clients, treballadors o convidats amb fins a 4 passatgers.",
      },
      {
        title: "Pobles de la comarca",
        text: "Ateca, Maluenda, Ariza, Daroca, Cetina, Miedes i molts altres destins.",
        detail: "Consulta el destí a la calculadora o a la taula per veure un preu orientatiu.",
      },
      {
        title: "Recollida per avaria en carretera",
        text: "Taxi per a passatgers que s'han quedat tirats prop de Calatayud, A-2, N-II o carreteres de la comarca.",
        detail: "Servei de taxi per portar-te a un punt segur, taller, hotel, estació o destinació indicada. No és servei de grua.",
      },
    ],
    tariffsEyebrow: "Tarifes",
    tariffsTitle: "Destinacions freqüents",
    tariffsText:
      "Busca un municipi o ciutat per revisar quilòmetres i preus orientatius. Les reserves es confirmen per telèfon o WhatsApp.",
    chooseDestination: "Tria destinació",
    estimatedFare: "Tarifa orientativa",
    oneWayKm: "Km anada",
    dayFare: "Diürna",
    nightFare: "Nocturna / festiva",
    calcDestination: "Calcular aquest destí",
    fullTable: "Veure taula completa de destins",
    filterTable: "Filtrar taula",
    closingEyebrow: "Reserva directa",
    closingTitle: "Taxi disponible a Calatayud",
    closingText:
      "Per a horaris exactes, viatges de matinada, trajectes llargs o recollides especials, confirma disponibilitat directament.",
    footerText: "Taxi oficial a Calatayud.",
    footerLinks: ["Monasterio de Piedra", "Balnearis", "Saragossa i aeroport", "Pobles de la comarca"],
    floatingWhatsapp: "Reservar per WhatsApp",
  },
  de: {
    ...BASE_COPY.en,
    nav: ["WhatsApp", "Berechnen", "Bewertungen", "Service", "Tarife"],
    directWhatsapp: "Direkt per WhatsApp",
    calculatePrice: "Preis berechnen",
    call: "Anrufen",
    heroEyebrow: "Offizielles Taxi in Calatayud · Lizenz 18",
    heroSubtitle:
      "Taxi ab Calatayud zu Dörfern der Region, Thermalbädern, Monasterio de Piedra, Zaragoza, Flughafen und Bahnhof.",
    bookTitle: "Direkt buchen, ohne lange Formulare",
    bookText:
      "Senden Sie direkt eine Nachricht, um Verfügbarkeit zu prüfen oder jetzt ein Taxi anzufragen. Der Rechner gibt eine Orientierung.",
    noRoute: "Ohne Routenberechnung",
    fastReply: "Schnelle Antwort",
    taxiNow: "Taxi jetzt",
    sendWhatsapp: "WhatsApp senden",
    seeQuote: "Preis ansehen",
    paymentTitle: "Flexible Zahlung",
    paymentText: "Bar · Karte · Bizum · Apple Pay · Google Pay",
    officialFare: "Offizieller Tarif",
    googleText: "öffentlich im Unternehmensprofil",
    googleRating: "bei Google",
    regionEyebrow: "Region Calatayud",
    regionTitle: "Calatayud, Dörfer, Thermalbäder und Zaragoza bequem erreichen",
    regionText:
      "Pünktlicher, komfortabler und diskreter Service für Calatayud, Zaragoza und die ganze Region mit Gepäck, Familie oder Ausflügen.",
    comfort: ["Ruhige Fahrt", "Großer Kofferraum", "Offizielles Taxi", "Buchung per WhatsApp"],
    seoEyebrow: "Premium-Taxi vor Ort",
    seoTitle: "Ihr zuverlässiges Taxi in Calatayud und Umgebung",
    seoText:
      "Häufige Fahrten ab Bahnhof, Hotels, Plaza del Fuerte, Dörfern der Region, Monasterio de Piedra, Thermalbädern, Zaragoza und Flughafen.",
    seoRoutes: [
      {
        title: "Taxi Bahnhof Calatayud",
        text: "Pünktliche Abholung am Bahnhof, an Hotels und an der Plaza del Fuerte.",
      },
      {
        title: "Monasterio de Piedra und Nuévalos",
        text: "Direkter Transfer ab Calatayud mit optional geplanter Rückfahrt.",
      },
      {
        title: "Zaragoza, Flughafen und Delicias",
        text: "Fahrten nach Zaragoza-Delicias, zum Flughafen Zaragoza, zu Krankenhäusern und ins Zentrum.",
      },
      {
        title: "Thermalbäder und Umgebung",
        text: "Jaraba, Alhama de Aragón, Paracuellos, Ateca, Maluenda und nahe Orte.",
      },
    ],
    calcEyebrow: "Buchung und Preis",
    calcTitle: "Route berechnen und fertige Nachricht senden",
    calcText:
      "Geben Sie Start, Ziel, Datum und Fahrgäste ein, um einen Orientierungspreis vorzubereiten und per WhatsApp zu senden.",
    schedule: "Planen",
    now: "Jetzt",
    origin: "Abfahrt",
    destination: "Ziel",
    originPlaceholder: "Straße, Hotel, Bahnhof, Ort...",
    destinationPlaceholder: "Straße, Hotel, Stadt, Flughafen...",
    habitualDestination: "Häufiges Ziel",
    date: "Datum",
    time: "Uhrzeit",
    passengers: "Fahrgäste",
    passengerOptions: ["1 Fahrgast", "2 Fahrgäste", "3 Fahrgäste", "4 Fahrgäste"],
    optionalWait: "Optionale Wartezeit",
    notes: "Hinweise",
    notesPlaceholder: "Zug, Gepäck, Hotel, Rückfahrt...",
    sendMyLocation: "Meinen Standort senden",
    immediate: "Wird als sofortige Verfügbarkeit gesendet.",
    calculating: "Berechnung...",
    locationHint:
      "Geben Sie Straße, Hotel, Bahnhof oder Ort ein. Eine ausgewählte Vorschlagadresse verbessert die Genauigkeit.",
    routeMissing: "Geben Sie Start und Ziel ein, um eine genaue Route zu berechnen.",
    routeError:
      "🚕 Ups, diese Route braucht einen kurzen manuellen Blick. Keine Sorge: per WhatsApp bestätige ich Preis und Verfügbarkeit sofort.",
    resultDistance: "Geschätzte Entfernung",
    quoteEstimate: "Orientierungspreis",
    quoteOfficial:
      "Orientierungspreis vorbehaltlich direkter Bestätigung je nach Verfügbarkeit, endgültiger Route, Uhrzeit, Wartezeit und offiziellen Zuschlägen.",
    bookWithMessage: "Mit Nachricht buchen",
    seeAvailability: "Verfügbarkeit prüfen",
    emptyResult:
      "Tippen Sie auf Preis berechnen, um eine Orientierung zu erhalten. Buchung und Endpreis werden immer per WhatsApp oder Anruf bestätigt.",
    exactRouteFallback:
      "Geben Sie Abfahrt und Ziel ein, um Verfügbarkeit und Orientierungspreis per WhatsApp anzufragen.",
    whatsappQuote: "WhatsApp-Angebot",
    apiPrivateNote:
      "📲 Die WhatsApp-Nachricht bereitet die Basisdaten vor. Endpreis, Verfügbarkeit und genauer Abholpunkt werden direkt bestätigt.",
    reviewsEyebrow: "Google-Bewertungen",
    reviewsText:
      "Raquels Google-Bewertung wird wegen Pünktlichkeit, sauberem Taxi und freundlichem Service hervorgehoben. Weitere Bewertungen sind auf Google verfügbar.",
    reviewsWith: "mit",
    featuredReview: "Hauptbewertung",
    moreReviews: "Mehr Bewertungen",
    viewGoogle: "Weitere Bewertungen auf Google ansehen",
    servicesEyebrow: "Services",
    servicesTitle: "Dörfer, Thermalbäder und Zaragoza ab Calatayud",
    servicesText:
      "Komfortabler Service in der Umgebung: nahe Dörfer, Thermalbäder, Bahnhof, Zaragoza, Flughafen, Arzttermine und geplante Fahrten.",
    serviceItems: [
      {
        title: "Monasterio de Piedra",
        text: "Direkter Transfer von Calatayud zum Naturpark, mit geplanter Rückabholung bei Bedarf.",
        detail: "Ideal für Besucher, die mit dem Zug ankommen oder in Calatayud übernachten und den Tag entspannt nutzen möchten.",
      },
      {
        title: "Thermalbäder",
        text: "Alhama de Aragón, Jaraba, Paracuellos de Jiloca und Thermalresorts der Region.",
        detail: "Abholung zu Hause, am Bahnhof oder Hotel für Erholung, Behandlungen und Kurzaufenthalte.",
      },
      {
        title: "Zaragoza und Flughafen",
        text: "Bahnhof Delicias, Flughafen Zaragoza, Krankenhäuser, Zentrum und jede Adresse in der Stadt.",
        detail: "Tür-zu-Tür-Fahrten für Züge, Flüge, Arzttermine, Erledigungen oder Einkäufe.",
      },
      {
        title: "Bahnhöfe und Züge",
        text: "Verbindungen zum Bahnhof Calatayud, Delicias und anderen Abholpunkten.",
        detail: "Feste Uhrzeit buchen und ruhig ankommen, auch früh morgens oder an Feiertagen.",
      },
      {
        title: "Touristische Routen",
        text: "Mudéjar-Kunst, Augusta Bilbilis, Weinrouten D.O. Calatayud und Dörfer der Region.",
        detail: "Stundenweise Verfügbarkeit für mehrere Stopps und eine Route in Ihrem Tempo.",
      },
      {
        title: "Medizinische Fahrten",
        text: "Gesundheitszentren, Kliniken und Krankenhäuser in Calatayud und Zaragoza.",
        detail: "Diskreter und pünktlicher Service, mit Rückfahrtkoordination nach dem Termin.",
      },
      {
        title: "Unternehmen und Events",
        text: "Meetings, Hotels, Lieferanten, Hochzeiten, Kommunionen und Feiern.",
        detail: "Geplante Buchungen für Kunden, Mitarbeiter oder Gäste mit bis zu 4 Fahrgästen.",
      },
      {
        title: "Dörfer der Region",
        text: "Ateca, Maluenda, Ariza, Daroca, Cetina, Miedes und viele weitere Ziele.",
        detail: "Nutzen Sie den Rechner oder die Tariftabelle für einen Orientierungspreis.",
      },
      {
        title: "Abholung bei Panne",
        text: "Taxi für Fahrgäste, die nahe Calatayud, A-2, N-II oder Straßen der Region liegen geblieben sind.",
        detail: "Taxi zu einem sicheren Ort, Werkstatt, Hotel, Bahnhof oder Wunschziel. Kein Abschlepp- oder Pannendienst.",
      },
    ],
    moreServices: "Weitere Services anzeigen",
    vehicleEyebrow: "Fahrzeug",
    vehicleText:
      "Ein weißer Peugeot 408 Hybrid: modern, leise und geräumig für komfortable Transfers, mit Klimaanlage, Gepäckraum und offizieller Lizenz.",
    vehicleSpecs: ["Großer Kofferraum", "Bis zu 4 Fahrgäste", "Fahrgastversicherung", "Einfache Zahlung", "Gepflegter Innenraum", "Pünktliche Abholung"],
    tariffsEyebrow: "Tarife",
    tariffsTitle: "Häufige Ziele",
    tariffsText:
      "Suchen Sie einen Ort oder eine Stadt, um Kilometer und Orientierungspreise zu prüfen. Buchungen werden per Telefon oder WhatsApp bestätigt.",
    chooseDestination: "Ziel auswählen",
    estimatedFare: "Orientierungstarif",
    oneWayKm: "Km einfache Strecke",
    dayFare: "Tag",
    nightFare: "Nacht / Feiertag",
    calcDestination: "Dieses Ziel berechnen",
    fullTable: "Komplette Zieltabelle ansehen",
    filterTable: "Tabelle filtern",
    closingEyebrow: "Direkt buchen",
    closingTitle: "Taxi verfügbar in Calatayud",
    closingText:
      "Für genaue Uhrzeiten, Nachtfahrten, lange Strecken oder besondere Abholungen bestätigen Sie die Verfügbarkeit direkt.",
    footerText: "Offizielles Taxi in Calatayud.",
    footerLinks: ["Monasterio de Piedra", "Thermalbäder", "Zaragoza und Flughafen", "Dörfer der Region"],
    floatingWhatsapp: "Per WhatsApp buchen",
  },
  it: {
    ...BASE_COPY.en,
    nav: ["WhatsApp", "Calcola", "Recensioni", "Servizi", "Tariffe"],
    directWhatsapp: "WhatsApp diretto",
    calculatePrice: "Calcola prezzo",
    call: "Chiama",
    heroEyebrow: "Taxi ufficiale a Calatayud · Licenza 18",
    heroSubtitle:
      "Taxi da Calatayud verso paesi della comarca, terme, Monasterio de Piedra, Saragozza, aeroporto e stazione.",
    bookTitle: "Prenotazione diretta, senza moduli lunghi",
    bookText:
      "Invia un messaggio diretto per verificare disponibilità o chiedere un taxi subito. Il calcolatore sotto prepara un preventivo orientativo.",
    noRoute: "Senza calcolare percorso",
    fastReply: "Risposta rapida",
    taxiNow: "Taxi ora",
    sendWhatsapp: "Invia WhatsApp",
    seeQuote: "Vedi preventivo",
    paymentTitle: "Pagamento flessibile",
    paymentText: "Contanti · Carta · Bizum · Apple Pay · Google Pay",
    officialFare: "Tariffa ufficiale",
    googleText: "pubbliche sul profilo aziendale",
    googleRating: "su Google",
    regionEyebrow: "Zona di Calatayud",
    regionTitle: "Calatayud, paesi, terme e Saragozza senza complicazioni",
    regionText:
      "Servizio puntuale, comodo e discreto per muoversi a Calatayud, Saragozza e nella comarca con bagagli, famiglia o visite turistiche.",
    comfort: ["Guida tranquilla", "Bagagliaio ampio", "Taxi ufficiale", "Prenotazione WhatsApp"],
    seoEyebrow: "Taxi locale premium",
    seoTitle: "Il taxi di fiducia per Calatayud e dintorni",
    seoText:
      "Corse frequenti con partenza da stazione, hotel, Plaza del Fuerte, paesi della comarca, Monasterio de Piedra, terme, Saragozza e aeroporto.",
    seoRoutes: [
      {
        title: "Taxi stazione Calatayud",
        text: "Ritiri puntuali in stazione, hotel e Plaza del Fuerte.",
      },
      {
        title: "Monasterio de Piedra e Nuévalos",
        text: "Trasferimento diretto da Calatayud con ritorno programmato opzionale.",
      },
      {
        title: "Saragozza, aeroporto e Delicias",
        text: "Viaggi verso Zaragoza-Delicias, Aeroporto di Saragozza, ospedali e centro.",
      },
      {
        title: "Terme e comarca",
        text: "Jaraba, Alhama de Aragón, Paracuellos, Ateca, Maluenda e paesi vicini.",
      },
    ],
    calcEyebrow: "Prenotazione e preventivo",
    calcTitle: "Calcola il percorso e invia il messaggio pronto",
    calcText:
      "Inserisci origine, destinazione, data e passeggeri per preparare un preventivo orientativo e inviare la prenotazione su WhatsApp.",
    schedule: "Programmare",
    now: "Ora",
    origin: "Origine",
    destination: "Destinazione",
    originPlaceholder: "Via, hotel, stazione, comune...",
    destinationPlaceholder: "Via, hotel, città, aeroporto...",
    habitualDestination: "Destinazione abituale",
    date: "Data",
    time: "Ora",
    passengers: "Passeggeri",
    passengerOptions: ["1 passeggero", "2 passeggeri", "3 passeggeri", "4 passeggeri"],
    optionalWait: "Attesa opzionale",
    notes: "Note",
    notesPlaceholder: "Treno, bagagli, hotel, ritorno...",
    sendMyLocation: "Invia la mia posizione",
    immediate: "Sarà inviato come disponibilità immediata.",
    calculating: "Calcolo...",
    locationHint:
      "Scrivi una via, hotel, stazione o comune. Se scegli un suggerimento, il calcolo sarà più preciso.",
    routeMissing: "Indica origine e destinazione per calcolare un percorso esatto.",
    routeError:
      "🚕 Ops, questo percorso ha bisogno di un controllo rapido. Nessun problema: invialo su WhatsApp e confermo prezzo e disponibilità.",
    resultDistance: "Distanza stimata",
    quoteEstimate: "Preventivo orientativo",
    quoteOfficial:
      "Prezzo indicativo soggetto a conferma diretta in base a disponibilità, percorso finale, orario, attesa e supplementi ufficiali.",
    bookWithMessage: "Prenota con messaggio",
    seeAvailability: "Verifica disponibilità",
    emptyResult:
      "Tocca calcola prezzo per vedere un preventivo orientativo. Prenotazione e importo finale si confermano sempre via WhatsApp o chiamata.",
    exactRouteFallback:
      "Inserisci origine e destinazione per chiedere disponibilità e preventivo via WhatsApp.",
    whatsappQuote: "Preventivo WhatsApp",
    apiPrivateNote:
      "📲 Il messaggio WhatsApp prepara i dati base. Prezzo finale, disponibilità e punto esatto si confermano direttamente.",
    reviewsEyebrow: "Recensioni Google",
    reviewsText:
      "Mettiamo in evidenza la recensione di Raquel su Google: puntualità, taxi pulito e servizio gentile. Le altre recensioni sono disponibili su Google.",
    reviewsWith: "con",
    featuredReview: "Recensione principale",
    moreReviews: "Vedi altre recensioni",
    viewGoogle: "Vedi altre recensioni su Google",
    servicesEyebrow: "Servizi",
    servicesTitle: "Paesi, terme e Saragozza da Calatayud",
    servicesText:
      "Servizio comodo nella zona: paesi vicini, terme, stazione, Saragozza, aeroporto, visite mediche e viaggi programmati.",
    serviceItems: [
      {
        title: "Monasterio de Piedra",
        text: "Trasferimento diretto da Calatayud al parco naturale, con ritorno programmato se necessario.",
        detail: "Ideale per visitatori che arrivano in treno o soggiornano a Calatayud e vogliono godersi la giornata senza parcheggio.",
      },
      {
        title: "Terme",
        text: "Alhama de Aragón, Jaraba, Paracuellos de Jiloca e complessi termali della comarca.",
        detail: "Ritiro a domicilio, stazione o hotel per soggiorni di riposo, trattamenti e fughe brevi.",
      },
      {
        title: "Saragozza e aeroporto",
        text: "Stazione Delicias, Aeroporto di Saragozza, ospedali, centro e qualsiasi punto della città.",
        detail: "Viaggio porta a porta per treni, voli, visite mediche, commissioni o acquisti.",
      },
      {
        title: "Stazioni e treni",
        text: "Collegamenti con la stazione di Calatayud, Delicias e altri punti di ritiro.",
        detail: "Prenota un orario preciso per viaggiare tranquillo, anche di notte o nei festivi.",
      },
      {
        title: "Percorsi turistici",
        text: "Arte mudéjar, Augusta Bilbilis, vini D.O. Calatayud e paesi della comarca.",
        detail: "Disponibilità a ore per fare più fermate e adattare l'itinerario al tuo ritmo.",
      },
      {
        title: "Trasferimenti medici",
        text: "Centri sanitari, cliniche e ospedali di Calatayud e Saragozza.",
        detail: "Servizio discreto e puntuale, con possibilità di coordinare il ritorno dopo la visita.",
      },
      {
        title: "Aziende ed eventi",
        text: "Riunioni, hotel, fornitori, matrimoni, comunioni e celebrazioni.",
        detail: "Prenotazioni programmate per clienti, lavoratori o invitati fino a 4 passeggeri.",
      },
      {
        title: "Paesi della comarca",
        text: "Ateca, Maluenda, Ariza, Daroca, Cetina, Miedes e molti altri luoghi.",
        detail: "Consulta il calcolatore o la tabella tariffe per un prezzo orientativo.",
      },
      {
        title: "Ritiro per guasto su strada",
        text: "Taxi per passeggeri rimasti bloccati vicino a Calatayud, A-2, N-II o strade della comarca.",
        detail: "Taxi verso un punto sicuro, officina, hotel, stazione o destinazione indicata. Non è carro attrezzi né assistenza meccanica.",
      },
    ],
    moreServices: "Vedi altri servizi",
    vehicleEyebrow: "Veicolo",
    vehicleText:
      "Peugeot 408 Hybrid bianco, moderno, silenzioso e spazioso per trasferimenti comodi, con climatizzazione, spazio bagagli e licenza ufficiale.",
    vehicleSpecs: ["Bagagliaio ampio", "Fino a 4 passeggeri", "Assicurazione passeggeri", "Pagamento facile", "Interni curati", "Ritiro puntuale"],
    tariffsEyebrow: "Tariffe",
    tariffsTitle: "Destinazioni frequenti",
    tariffsText:
      "Cerca un comune o una città per vedere chilometri e prezzi orientativi. Le prenotazioni si confermano per telefono o WhatsApp.",
    chooseDestination: "Scegli destinazione",
    estimatedFare: "Tariffa orientativa",
    oneWayKm: "Km andata",
    dayFare: "Diurna",
    nightFare: "Notturna / festiva",
    calcDestination: "Calcola questa destinazione",
    fullTable: "Vedi tabella completa",
    filterTable: "Filtra tabella",
    closingEyebrow: "Prenotazione diretta",
    closingTitle: "Taxi disponibile a Calatayud",
    closingText:
      "Per orari esatti, viaggi notturni, tratte lunghe o ritiri speciali, conferma direttamente la disponibilità.",
    footerText: "Taxi ufficiale a Calatayud.",
    footerLinks: ["Monasterio de Piedra", "Terme", "Saragozza e aeroporto", "Paesi della comarca"],
    floatingWhatsapp: "Prenota su WhatsApp",
  },
  pt: {
    ...BASE_COPY.en,
    nav: ["WhatsApp", "Calcular", "Avaliações", "Serviços", "Tarifas"],
    directWhatsapp: "WhatsApp direto",
    calculatePrice: "Calcular preço",
    call: "Ligar",
    heroEyebrow: "Táxi oficial em Calatayud · Licença 18",
    heroSubtitle:
      "Táxi desde Calatayud para aldeias da comarca, termas, Monasterio de Piedra, Zaragoza, aeroporto e estação.",
    bookTitle: "Reserva direta, sem formulários longos",
    bookText:
      "Envie uma mensagem direta para consultar disponibilidade ou pedir táxi agora. A calculadora abaixo prepara um orçamento indicativo.",
    noRoute: "Sem calcular rota",
    fastReply: "Resposta rápida",
    taxiNow: "Táxi agora",
    sendWhatsapp: "Enviar WhatsApp",
    seeQuote: "Ver orçamento",
    paymentTitle: "Pagamento flexível",
    paymentText: "Dinheiro · Cartão · Bizum · Apple Pay · Google Pay",
    officialFare: "Tarifa oficial",
    googleText: "públicas no perfil da empresa",
    googleRating: "no Google",
    regionEyebrow: "Comarca de Calatayud",
    regionTitle: "Calatayud, aldeias, termas e Zaragoza sem complicações",
    regionText:
      "Serviço pontual, cómodo e discreto para circular por Calatayud, Zaragoza e toda a comarca com bagagem, família ou visitas turísticas.",
    comfort: ["Condução tranquila", "Bagageira ampla", "Táxi oficial", "Reserva por WhatsApp"],
    seoEyebrow: "Táxi local premium",
    seoTitle: "O táxi de confiança em Calatayud e arredores",
    seoText:
      "Percursos frequentes com recolha na estação, hotéis, Plaza del Fuerte, aldeias da comarca, Monasterio de Piedra, termas, Zaragoza e aeroporto.",
    seoRoutes: [
      {
        title: "Táxi estação Calatayud",
        text: "Recolhas pontuais na estação, hotéis e Plaza del Fuerte.",
      },
      {
        title: "Monasterio de Piedra e Nuévalos",
        text: "Transfer direto desde Calatayud com regresso programado opcional.",
      },
      {
        title: "Zaragoza, aeroporto e Delicias",
        text: "Viagens para Zaragoza-Delicias, Aeroporto de Zaragoza, hospitais e centro.",
      },
      {
        title: "Termas e comarca",
        text: "Jaraba, Alhama de Aragón, Paracuellos, Ateca, Maluenda e aldeias próximas.",
      },
    ],
    calcEyebrow: "Reserva e orçamento",
    calcTitle: "Calcule a rota e envie a mensagem pronta",
    calcText:
      "Introduza origem, destino, data e passageiros para preparar um orçamento indicativo e enviar a reserva por WhatsApp.",
    schedule: "Agendar",
    now: "Agora",
    origin: "Origem",
    destination: "Destino",
    originPlaceholder: "Rua, hotel, estação, município...",
    destinationPlaceholder: "Rua, hotel, cidade, aeroporto...",
    habitualDestination: "Destino habitual",
    date: "Data",
    time: "Hora",
    passengers: "Passageiros",
    passengerOptions: ["1 passageiro", "2 passageiros", "3 passageiros", "4 passageiros"],
    optionalWait: "Espera opcional",
    notes: "Notas",
    notesPlaceholder: "Comboio, bagagem, hotel, regresso...",
    sendMyLocation: "Enviar a minha localização",
    immediate: "Será enviado como disponibilidade imediata.",
    calculating: "A calcular...",
    locationHint:
      "Escreva uma rua, hotel, estação ou município. Se escolher uma sugestão, o cálculo será mais preciso.",
    routeMissing: "Indique origem e destino para calcular uma rota exata.",
    routeError:
      "🚕 Opa, esta rota precisa de uma confirmação rápida. Não se preocupe: envie por WhatsApp e confirmo preço e disponibilidade.",
    resultDistance: "Distância estimada",
    quoteEstimate: "Orçamento estimado",
    quoteOfficial:
      "Preço indicativo sujeito a confirmação direta conforme disponibilidade, rota final, horário, espera e suplementos oficiais.",
    bookWithMessage: "Reservar com mensagem",
    seeAvailability: "Ver disponibilidade",
    emptyResult:
      "Toque em calcular preço para ver um orçamento estimado. A reserva e o valor final são sempre confirmados por WhatsApp ou chamada.",
    exactRouteFallback:
      "Insira origem e destino para consultar disponibilidade e orçamento por WhatsApp.",
    whatsappQuote: "Orçamento por WhatsApp",
    apiPrivateNote:
      "📲 A mensagem de WhatsApp prepara os dados básicos. Preço final, disponibilidade e ponto exato são confirmados diretamente.",
    reviewsEyebrow: "Avaliações Google",
    reviewsText:
      "Destacamos a avaliação da Raquel no Google: pontualidade, táxi limpo e atendimento próximo. As restantes avaliações estão disponíveis no Google.",
    reviewsWith: "com",
    featuredReview: "Avaliação principal",
    moreReviews: "Ver mais avaliações",
    viewGoogle: "Ver mais avaliações no Google",
    servicesEyebrow: "Serviços",
    servicesTitle: "Aldeias, termas e Zaragoza desde Calatayud",
    servicesText:
      "Serviço cómodo pela zona: aldeias próximas, termas, estação, Zaragoza, aeroporto, consultas médicas e viagens programadas.",
    serviceItems: [
      {
        title: "Monasterio de Piedra",
        text: "Transfer direto desde Calatayud para o parque natural, com recolha de regresso programada se necessário.",
        detail: "Ideal para visitantes que chegam de comboio ou ficam alojados em Calatayud e querem aproveitar o dia sem estacionar.",
      },
      {
        title: "Termas",
        text: "Alhama de Aragón, Jaraba, Paracuellos de Jiloca e complexos termais da comarca.",
        detail: "Recolhas em casa, estação ou hotel para estadias de descanso, tratamentos e escapadas.",
      },
      {
        title: "Zaragoza e aeroporto",
        text: "Estação Delicias, Aeroporto de Zaragoza, hospitais, centro e qualquer ponto da cidade.",
        detail: "Viagem porta a porta para comboios, voos, consultas médicas, compras ou gestões.",
      },
      {
        title: "Estações e comboios",
        text: "Ligações com a estação de Calatayud, Delicias e outros pontos de recolha.",
        detail: "Reserva com hora marcada para chegar tranquilo, inclusive de madrugada ou em feriados.",
      },
      {
        title: "Rotas turísticas",
        text: "Arte mudéjar, Augusta Bilbilis, vinhos D.O. Calatayud e aldeias da comarca.",
        detail: "Disponibilidade por horas para várias paragens e itinerário adaptado ao seu ritmo.",
      },
      {
        title: "Transferes médicos",
        text: "Centros de saúde, clínicas e hospitais de Calatayud e Zaragoza.",
        detail: "Serviço discreto e pontual, com possibilidade de coordenar o regresso depois da consulta.",
      },
      {
        title: "Empresas e eventos",
        text: "Reuniões, hotéis, fornecedores, casamentos, comunhões e celebrações.",
        detail: "Reservas programadas para clientes, trabalhadores ou convidados até 4 passageiros.",
      },
      {
        title: "Aldeias da comarca",
        text: "Ateca, Maluenda, Ariza, Daroca, Cetina, Miedes e muitos outros destinos.",
        detail: "Consulte a calculadora ou a tabela de tarifas para ver um preço indicativo.",
      },
      {
        title: "Recolha por avaria na estrada",
        text: "Táxi para passageiros que ficaram parados perto de Calatayud, A-2, N-II ou estradas da comarca.",
        detail: "Serviço de táxi para um local seguro, oficina, hotel, estação ou destino indicado. Não é reboque nem assistência mecânica.",
      },
    ],
    moreServices: "Ver mais serviços",
    vehicleEyebrow: "Veículo",
    vehicleText:
      "Peugeot 408 Hybrid branco, moderno, silencioso e espaçoso para transferes confortáveis, com climatização, espaço para bagagem e licença oficial.",
    vehicleSpecs: ["Bagageira ampla", "Até 4 passageiros", "Seguro de passageiros", "Pagamento fácil", "Interior cuidado", "Recolha pontual"],
    tariffsEyebrow: "Tarifas",
    tariffsTitle: "Destinos frequentes",
    tariffsText:
      "Pesquise um município ou cidade para ver quilómetros e preços indicativos. As reservas confirmam-se por telefone ou WhatsApp.",
    chooseDestination: "Escolher destino",
    estimatedFare: "Tarifa indicativa",
    oneWayKm: "Km ida",
    dayFare: "Diurna",
    nightFare: "Noturna / feriado",
    calcDestination: "Calcular este destino",
    fullTable: "Ver tabela completa de destinos",
    filterTable: "Filtrar tabela",
    closingEyebrow: "Reserva direta",
    closingTitle: "Táxi disponível em Calatayud",
    closingText:
      "Para horários exatos, viagens de madrugada, trajetos longos ou recolhas especiais, confirme disponibilidade diretamente.",
    footerText: "Táxi oficial em Calatayud.",
    footerLinks: ["Monasterio de Piedra", "Termas", "Zaragoza e aeroporto", "Aldeias da comarca"],
    floatingWhatsapp: "Reservar por WhatsApp",
  },
  nl: {
    ...BASE_COPY.en,
    nav: ["WhatsApp", "Berekenen", "Reviews", "Diensten", "Tarieven"],
    directWhatsapp: "Direct WhatsApp",
    calculatePrice: "Prijs berekenen",
    call: "Bellen",
    heroEyebrow: "Officiële taxi in Calatayud · Licentie 18",
    heroSubtitle:
      "Taxi vanaf Calatayud naar dorpen in de regio, kuuroorden, Monasterio de Piedra, Zaragoza, luchthaven en station.",
    bookTitle: "Direct boeken, zonder lange formulieren",
    bookText:
      "Stuur direct een bericht om beschikbaarheid te vragen of nu een taxi aan te vragen. De calculator hieronder maakt een richtprijs.",
    noRoute: "Geen route nodig",
    fastReply: "Snelle reactie",
    taxiNow: "Taxi nu",
    sendWhatsapp: "WhatsApp sturen",
    seeQuote: "Prijs bekijken",
    paymentTitle: "Flexibel betalen",
    paymentText: "Contant · Kaart · Bizum · Apple Pay · Google Pay",
    officialFare: "Officieel tarief",
    googleText: "openbaar op het bedrijfsprofiel",
    googleRating: "op Google",
    regionEyebrow: "Regio Calatayud",
    regionTitle: "Calatayud, dorpen, kuuroorden en Zaragoza zonder gedoe",
    regionText:
      "Punctuele, comfortabele en discrete service voor Calatayud, Zaragoza en de hele regio met bagage, familie of toeristische plannen.",
    comfort: ["Rustige rit", "Ruime kofferbak", "Officiële taxi", "Boeken via WhatsApp"],
    seoEyebrow: "Premium lokale taxi",
    seoTitle: "De betrouwbare taxi voor Calatayud en omgeving",
    seoText:
      "Veelgebruikte ritten met ophaling bij station, hotels, Plaza del Fuerte, dorpen in de regio, Monasterio de Piedra, kuuroorden, Zaragoza en luchthaven.",
    seoRoutes: [
      {
        title: "Taxi station Calatayud",
        text: "Punctuele ophaling bij station, hotels en Plaza del Fuerte.",
      },
      {
        title: "Monasterio de Piedra en Nuévalos",
        text: "Directe transfer vanaf Calatayud met optionele geplande terugrit.",
      },
      {
        title: "Zaragoza, luchthaven en Delicias",
        text: "Ritten naar Zaragoza-Delicias, luchthaven Zaragoza, ziekenhuizen en centrum.",
      },
      {
        title: "Kuuroorden en regio",
        text: "Jaraba, Alhama de Aragón, Paracuellos, Ateca, Maluenda en nabijgelegen dorpen.",
      },
    ],
    calcEyebrow: "Boeking en prijs",
    calcTitle: "Bereken de route en stuur een kant-en-klaar bericht",
    calcText:
      "Voer vertrek, bestemming, datum en passagiers in om een richtprijs te maken en de boeking via WhatsApp te sturen.",
    schedule: "Plannen",
    now: "Nu",
    origin: "Vertrek",
    destination: "Bestemming",
    originPlaceholder: "Straat, hotel, station, gemeente...",
    destinationPlaceholder: "Straat, hotel, stad, luchthaven...",
    habitualDestination: "Veelgebruikte bestemming",
    date: "Datum",
    time: "Tijd",
    passengers: "Passagiers",
    passengerOptions: ["1 passagier", "2 passagiers", "3 passagiers", "4 passagiers"],
    optionalWait: "Optionele wachttijd",
    notes: "Opmerkingen",
    notesPlaceholder: "Trein, bagage, hotel, terugrit...",
    sendMyLocation: "Mijn locatie sturen",
    immediate: "Dit wordt als directe beschikbaarheid verzonden.",
    calculating: "Berekenen...",
    locationHint:
      "Typ een straat, hotel, station of plaats. Een gekozen suggestie maakt de berekening nauwkeuriger.",
    routeMissing: "Vul vertrek en bestemming in om een exacte route te berekenen.",
    routeError:
      "🚕 Oeps, deze route heeft een snelle check nodig. Geen zorgen: stuur hem via WhatsApp en ik bevestig prijs en beschikbaarheid.",
    resultDistance: "Geschatte afstand",
    quoteEstimate: "Richtprijs",
    quoteOfficial:
      "Richtprijs onder voorbehoud van directe bevestiging, afhankelijk van beschikbaarheid, definitieve route, tijd, wachttijd en officiële toeslagen.",
    bookWithMessage: "Boeken met bericht",
    seeAvailability: "Beschikbaarheid controleren",
    emptyResult:
      "Tik op prijs berekenen voor een richtprijs. Boeking en definitieve prijs worden altijd via WhatsApp of telefoon bevestigd.",
    exactRouteFallback:
      "Vul vertrek en bestemming in om beschikbaarheid en richtprijs via WhatsApp te vragen.",
    whatsappQuote: "WhatsApp-prijs",
    apiPrivateNote:
      "📲 Het WhatsApp-bericht bereidt de basisgegevens voor. Definitieve prijs, beschikbaarheid en exact ophaalpunt worden rechtstreeks bevestigd.",
    reviewsEyebrow: "Google reviews",
    reviewsText:
      "Raquels Google-review wordt uitgelicht vanwege punctualiteit, een schone taxi en vriendelijke service. De overige reviews staan op Google.",
    reviewsWith: "met",
    featuredReview: "Belangrijkste review",
    moreReviews: "Meer reviews",
    viewGoogle: "Meer reviews op Google bekijken",
    servicesEyebrow: "Diensten",
    servicesTitle: "Dorpen, kuuroorden en Zaragoza vanaf Calatayud",
    servicesText:
      "Comfortabele service in de omgeving: nabijgelegen dorpen, kuuroorden, station, Zaragoza, luchthaven, medische afspraken en geplande ritten.",
    serviceItems: [
      {
        title: "Monasterio de Piedra",
        text: "Directe transfer vanaf Calatayud naar het natuurpark, met geplande terugrit indien nodig.",
        detail: "Ideaal voor bezoekers die met de trein aankomen of in Calatayud verblijven en de dag zonder parkeren willen benutten.",
      },
      {
        title: "Kuuroorden",
        text: "Alhama de Aragón, Jaraba, Paracuellos de Jiloca en thermale resorts in de regio.",
        detail: "Ophaling thuis, bij station of hotel voor ontspanning, behandelingen en korte verblijven.",
      },
      {
        title: "Zaragoza en luchthaven",
        text: "Station Delicias, luchthaven Zaragoza, ziekenhuizen, centrum en elk adres in de stad.",
        detail: "Deur-tot-deur ritten voor treinen, vluchten, medische bezoeken, afspraken of boodschappen.",
      },
      {
        title: "Stations en treinen",
        text: "Verbindingen met station Calatayud, Delicias en andere ophaalpunten.",
        detail: "Boek een vaste tijd om rustig te reizen, ook vroeg in de ochtend of op feestdagen.",
      },
      {
        title: "Toeristische routes",
        text: "Mudéjar-kunst, Augusta Bilbilis, D.O. Calatayud-wijnroutes en dorpen in de regio.",
        detail: "Beschikbaarheid per uur voor meerdere stops en een route op uw tempo.",
      },
      {
        title: "Medische transfers",
        text: "Gezondheidscentra, klinieken en ziekenhuizen in Calatayud en Zaragoza.",
        detail: "Discrete en punctuele service, met mogelijkheid om de terugrit na de afspraak te plannen.",
      },
      {
        title: "Bedrijven en events",
        text: "Vergaderingen, hotels, leveranciers, bruiloften, communies en vieringen.",
        detail: "Geplande boekingen voor klanten, medewerkers of gasten tot 4 passagiers.",
      },
      {
        title: "Dorpen in de regio",
        text: "Ateca, Maluenda, Ariza, Daroca, Cetina, Miedes en veel meer bestemmingen.",
        detail: "Gebruik de calculator of tarieftabel voor een richtprijs.",
      },
      {
        title: "Ophaling bij pech onderweg",
        text: "Taxi voor passagiers die gestrand zijn bij Calatayud, A-2, N-II of wegen in de regio.",
        detail: "Taxi naar een veilige plek, garage, hotel, station of gekozen bestemming. Geen sleepdienst of mechanische hulp.",
      },
    ],
    moreServices: "Meer diensten bekijken",
    vehicleEyebrow: "Voertuig",
    vehicleText:
      "Witte Peugeot 408 Hybrid, modern, stil en ruim voor comfortabele transfers, met airco, bagageruimte en officiële vergunning.",
    vehicleSpecs: ["Ruime kofferbak", "Tot 4 passagiers", "Passagiersverzekering", "Makkelijk betalen", "Verzorgd interieur", "Punctuele ophaling"],
    tariffsEyebrow: "Tarieven",
    tariffsTitle: "Veelgebruikte bestemmingen",
    tariffsText:
      "Zoek een plaats of stad om kilometers en richtprijzen te bekijken. Boekingen worden bevestigd per telefoon of WhatsApp.",
    chooseDestination: "Bestemming kiezen",
    estimatedFare: "Richttarief",
    oneWayKm: "Km enkele reis",
    dayFare: "Dag",
    nightFare: "Nacht / feestdag",
    calcDestination: "Deze bestemming berekenen",
    fullTable: "Volledige bestemmingstabel bekijken",
    filterTable: "Tabel filteren",
    closingEyebrow: "Direct boeken",
    closingTitle: "Taxi beschikbaar in Calatayud",
    closingText:
      "Voor exacte tijden, nachtritten, lange ritten of speciale ophalingen kunt u de beschikbaarheid direct bevestigen.",
    footerText: "Officiële taxi in Calatayud.",
    footerLinks: ["Monasterio de Piedra", "Kuuroorden", "Zaragoza en luchthaven", "Dorpen in de regio"],
    floatingWhatsapp: "Boeken via WhatsApp",
  },
};

const regionHighlights: Record<LangCode, string[]> = {
  es: ["Calatayud", "Pueblos", "Balnearios", "Zaragoza"],
  en: ["Calatayud", "Villages", "Spas", "Zaragoza"],
  fr: ["Calatayud", "Villages", "Thermes", "Saragosse"],
  ca: ["Calatayud", "Pobles", "Balnearis", "Saragossa"],
  de: ["Calatayud", "Dörfer", "Thermalbäder", "Zaragoza"],
  it: ["Calatayud", "Paesi", "Terme", "Saragozza"],
  pt: ["Calatayud", "Aldeias", "Termas", "Zaragoza"],
  nl: ["Calatayud", "Dorpen", "Kuuroorden", "Zaragoza"],
  ar: ["كالاتايود", "القرى", "المنتجعات", "سرقسطة"],
};

const heroStatLabels: Record<LangCode, [string, string, string]> = {
  es: ["reservas", "licencia", "destinos"],
  en: ["bookings", "licence", "destinations"],
  fr: ["réservations", "licence", "destinations"],
  ca: ["reserves", "llicència", "destins"],
  de: ["Buchungen", "Lizenz", "Ziele"],
  it: ["prenotazioni", "licenza", "destinazioni"],
  pt: ["reservas", "licença", "destinos"],
  nl: ["boekingen", "licentie", "bestemmingen"],
  ar: ["حجز", "رخصة", "وجهات"],
};

const touristSearchCopy: Record<LangCode, { eyebrow: string; title: string; text: string }> = {
  es: {
    eyebrow: "Visitantes y alojamientos",
    title: "Taxi para hoteles, balnearios y pueblos de la comarca",
    text: "Si estás en un hotel, casa rural, balneario, Monasterio de Piedra o pueblo cercano, puedes pedir recogida con dirección o ubicación.",
  },
  en: {
    eyebrow: "Visitors and accommodation",
    title: "Taxi for hotels, spas and villages around Calatayud",
    text: "If you are at a hotel, rural house, spa, Monasterio de Piedra or nearby village, you can request pick-up with address or location.",
  },
  fr: {
    eyebrow: "Visiteurs et hébergements",
    title: "Taxi pour hôtels, thermes et villages autour de Calatayud",
    text: "Si vous êtes dans un hôtel, gîte, thermes, Monasterio de Piedra ou village proche, demandez une prise en charge avec adresse ou position.",
  },
  ca: {
    eyebrow: "Visitants i allotjaments",
    title: "Taxi per a hotels, balnearis i pobles prop de Calatayud",
    text: "Si ets en un hotel, casa rural, balneari, Monasterio de Piedra o poble proper, pots demanar recollida amb adreça o ubicació.",
  },
  de: {
    eyebrow: "Besucher und Unterkünfte",
    title: "Taxi für Hotels, Thermalbäder und Dörfer bei Calatayud",
    text: "Wenn Sie in einem Hotel, Ferienhaus, Thermalbad, Monasterio de Piedra oder nahen Ort sind, senden Sie Adresse oder Standort.",
  },
  it: {
    eyebrow: "Visitatori e alloggi",
    title: "Taxi per hotel, terme e paesi vicino a Calatayud",
    text: "Se siete in hotel, casa rurale, terme, Monasterio de Piedra o paese vicino, potete inviare indirizzo o posizione.",
  },
  pt: {
    eyebrow: "Visitantes e alojamentos",
    title: "Táxi para hotéis, termas e aldeias perto de Calatayud",
    text: "Se está num hotel, casa rural, termas, Monasterio de Piedra ou aldeia próxima, envie morada ou localização.",
  },
  nl: {
    eyebrow: "Bezoekers en verblijf",
    title: "Taxi voor hotels, kuuroorden en dorpen rond Calatayud",
    text: "Bent u in een hotel, vakantiehuis, kuuroord, Monasterio de Piedra of nabij dorp, stuur dan adres of locatie.",
  },
  ar: {
    eyebrow: "الزوار والإقامة",
    title: "تاكسي للفنادق والمنتجعات والقرى قرب كالاتايود",
    text: "إذا كنت في فندق أو بيت ريفي أو منتجع أو دير الحجر أو قرية قريبة، أرسل العنوان أو الموقع.",
  },
};

const touristSearchPhrases: Record<LangCode, Array<{ language: string; query: string }>> = {
  es: [
    { language: "Cerca", query: "Taxi cerca de mi en Calatayud con recogida por ubicación" },
    { language: "Desde", query: "Taxi desde Calatayud a pueblos, estación, balnearios y Zaragoza" },
    { language: "Autovía", query: "Taxi por avería en A-2, N-II o carretera cerca de Calatayud" },
    { language: "Hoteles", query: "Recogida en hoteles de Calatayud y la comarca" },
    { language: "Balnearios", query: "Jaraba, Alhama de Aragón y Paracuellos de Jiloca" },
    { language: "Turismo", query: "Monasterio de Piedra, Nuévalos y rutas cercanas" },
    { language: "Tren", query: "Estación de Calatayud y conexión con AVE" },
    { language: "Fiestas", query: "Taxi San Roque Calatayud y fiestas de pueblos de la comarca" },
    { language: "WhatsApp", query: "Teléfono taxi Calatayud y reserva directa" },
  ],
  en: [
    { language: "Near me", query: "Taxi near me in Calatayud with location pick-up" },
    { language: "From", query: "Taxi from Calatayud to villages, station, spas and Zaragoza" },
    { language: "Motorway", query: "Taxi after breakdown on A-2, N-II or roads near Calatayud" },
    { language: "Hotels", query: "Pick-up at hotels in Calatayud and the surrounding area" },
    { language: "Spas", query: "Jaraba, Alhama de Aragon and Paracuellos de Jiloca" },
    { language: "Tourism", query: "Monasterio de Piedra, Nuevalos and nearby routes" },
    { language: "Train", query: "Calatayud train station and AVE connection" },
    { language: "Festivals", query: "Taxi for San Roque Calatayud and local village festivals" },
    { language: "WhatsApp", query: "Calatayud taxi phone and direct booking" },
  ],
  fr: [
    { language: "Proche", query: "Taxi près de moi à Calatayud avec prise en charge par position" },
    { language: "Depuis", query: "Taxi depuis Calatayud vers villages, gare, thermes et Saragosse" },
    { language: "Autoroute", query: "Taxi après panne sur A-2, N-II ou routes près de Calatayud" },
    { language: "Hôtels", query: "Prise en charge dans les hôtels de Calatayud et de la région" },
    { language: "Thermes", query: "Jaraba, Alhama de Aragon et Paracuellos de Jiloca" },
    { language: "Tourisme", query: "Monasterio de Piedra, Nuevalos et itinéraires proches" },
    { language: "Train", query: "Gare de Calatayud et connexion AVE" },
    { language: "Fêtes", query: "Taxi San Roque Calatayud et fêtes des villages proches" },
    { language: "WhatsApp", query: "Téléphone taxi Calatayud et réservation directe" },
  ],
  ca: [
    { language: "A prop", query: "Taxi a prop meu a Calatayud amb recollida per ubicació" },
    { language: "Des de", query: "Taxi des de Calatayud a pobles, estació, balnearis i Saragossa" },
    { language: "Autovia", query: "Taxi per avaria a l'A-2, N-II o carretera prop de Calatayud" },
    { language: "Hotels", query: "Recollida en hotels de Calatayud i la comarca" },
    { language: "Balnearis", query: "Jaraba, Alhama de Aragón i Paracuellos de Jiloca" },
    { language: "Turisme", query: "Monasterio de Piedra, Nuévalos i rutes properes" },
    { language: "Tren", query: "Estació de Calatayud i connexió amb AVE" },
    { language: "Festes", query: "Taxi San Roque Calatayud i festes de pobles de la comarca" },
    { language: "WhatsApp", query: "Telèfon taxi Calatayud i reserva directa" },
  ],
  de: [
    { language: "In der Nähe", query: "Taxi in meiner Nähe in Calatayud mit Standortabholung" },
    { language: "Ab", query: "Taxi ab Calatayud zu Dörfern, Bahnhof, Thermalbädern und Zaragoza" },
    { language: "Autobahn", query: "Taxi nach Panne auf A-2, N-II oder Straßen bei Calatayud" },
    { language: "Hotels", query: "Abholung an Hotels in Calatayud und Umgebung" },
    { language: "Thermalbäder", query: "Jaraba, Alhama de Aragon und Paracuellos de Jiloca" },
    { language: "Tourismus", query: "Monasterio de Piedra, Nuevalos und nahe Routen" },
    { language: "Zug", query: "Bahnhof Calatayud und AVE-Verbindung" },
    { language: "Feste", query: "Taxi für San Roque Calatayud und Dorffeste der Region" },
    { language: "WhatsApp", query: "Taxi-Telefon Calatayud und Direktbuchung" },
  ],
  it: [
    { language: "Vicino", query: "Taxi vicino a me a Calatayud con ritiro tramite posizione" },
    { language: "Da", query: "Taxi da Calatayud a paesi, stazione, terme e Saragozza" },
    { language: "Autostrada", query: "Taxi per guasto su A-2, N-II o strada vicino a Calatayud" },
    { language: "Hotel", query: "Ritiro negli hotel di Calatayud e della comarca" },
    { language: "Terme", query: "Jaraba, Alhama de Aragon e Paracuellos de Jiloca" },
    { language: "Turismo", query: "Monasterio de Piedra, Nuevalos e percorsi vicini" },
    { language: "Treno", query: "Stazione di Calatayud e collegamento AVE" },
    { language: "Feste", query: "Taxi San Roque Calatayud e feste dei paesi della comarca" },
    { language: "WhatsApp", query: "Telefono taxi Calatayud e prenotazione diretta" },
  ],
  pt: [
    { language: "Perto", query: "Táxi perto de mim em Calatayud com recolha por localização" },
    { language: "Desde", query: "Táxi desde Calatayud para aldeias, estação, termas e Zaragoza" },
    { language: "Autoestrada", query: "Táxi por avaria na A-2, N-II ou estrada perto de Calatayud" },
    { language: "Hotéis", query: "Recolha em hotéis de Calatayud e da comarca" },
    { language: "Termas", query: "Jaraba, Alhama de Aragon e Paracuellos de Jiloca" },
    { language: "Turismo", query: "Monasterio de Piedra, Nuevalos e rotas próximas" },
    { language: "Comboio", query: "Estação de Calatayud e ligação AVE" },
    { language: "Festas", query: "Táxi San Roque Calatayud e festas das aldeias da comarca" },
    { language: "WhatsApp", query: "Telefone táxi Calatayud e reserva direta" },
  ],
  nl: [
    { language: "Dichtbij", query: "Taxi in de buurt in Calatayud met ophalen via locatie" },
    { language: "Vanaf", query: "Taxi vanaf Calatayud naar dorpen, station, kuuroorden en Zaragoza" },
    { language: "Snelweg", query: "Taxi bij pech op A-2, N-II of weg bij Calatayud" },
    { language: "Hotels", query: "Ophalen bij hotels in Calatayud en de regio" },
    { language: "Kuuroorden", query: "Jaraba, Alhama de Aragon en Paracuellos de Jiloca" },
    { language: "Toerisme", query: "Monasterio de Piedra, Nuevalos en nabijgelegen routes" },
    { language: "Trein", query: "Station Calatayud en AVE-verbinding" },
    { language: "Feesten", query: "Taxi San Roque Calatayud en dorpsfeesten in de regio" },
    { language: "WhatsApp", query: "Taxi telefoon Calatayud en direct boeken" },
  ],
  ar: [
    { language: "قريب", query: "تاكسي قريب مني في كالاتايود مع استلام بالموقع" },
    { language: "من", query: "تاكسي من كالاتايود إلى القرى والمحطة والمنتجعات وسرقسطة" },
    { language: "طريق سريع", query: "تاكسي بعد عطل على A-2 أو N-II قرب كالاتايود" },
    { language: "فنادق", query: "استلام من فنادق كالاتايود والمنطقة" },
    { language: "منتجعات", query: "Jaraba وAlhama de Aragon وParacuellos de Jiloca" },
    { language: "سياحة", query: "Monasterio de Piedra وNuevalos والطرق القريبة" },
    { language: "قطار", query: "محطة كالاتايود واتصال AVE" },
    { language: "مهرجانات", query: "تاكسي San Roque Calatayud ومهرجانات قرى المنطقة" },
    { language: "واتساب", query: "هاتف تاكسي كالاتايود وحجز مباشر" },
  ],
};

const UI_COPY: Record<
  LangCode,
  {
    roadHeroOption: string;
    roadEyebrow: string;
    roadTitle: string;
    roadText: string;
    roadLocationButton: string;
    roadWhatsapp: string;
    roadPresetAria: string;
    roadDisclaimer: string;
    roadPanelAria: string;
    roadSteps: Array<{ title: string; text: string }>;
    roadQuickTitle: string;
    roadQuickText: string;
    roadQuickButton: string;
    internalRoutes: string;
    otherLanguages: string;
  }
> = {
  es: {
    roadHeroOption: "Avería en carretera",
    roadEyebrow: "Recogida urgente en carretera",
    roadTitle: "Taxi si te has quedado tirado cerca de Calatayud",
    roadText:
      "Si tienes una avería o incidencia en la A-2, N-II, N-234 o carreteras de la comarca, puedo ayudarte con recogida de pasajeros para llevarte a Calatayud, taller, hotel, estación o un destino seguro. Si el coche necesita grúa o asistencia, contacta también con tu aseguradora.",
    roadLocationButton: "Preparar recogida con ubicación",
    roadWhatsapp: "WhatsApp urgente",
    roadPresetAria: "Puntos habituales de carretera",
    roadDisclaimer:
      "Servicio de taxi para pasajeros. No es grúa ni asistencia mecánica. Si hay peligro, emergencia médica o riesgo en la vía, llama primero al 112. Si procede, avisa a tu aseguradora o asistencia en carretera antes de moverte.",
    roadPanelAria: "Cómo pedir taxi desde carretera",
    roadSteps: [
      { title: "Ponte a salvo si puedes", text: "No cruces la vía ni te pongas en riesgo. Si hay peligro, accidente o emergencia, llama al 112 antes de pedir taxi." },
      { title: "Avisa si necesitas grúa", text: "Si el vehículo no puede continuar, contacta con tu aseguradora o asistencia en carretera." },
      { title: "Mantén el teléfono disponible", text: "Envía ubicación, carretera, sentido o km aproximado y mantén el móvil con sonido para confirmar dónde estás." },
    ],
    roadQuickTitle: "Avería o incidencia en carretera",
    roadQuickText: "El WhatsApp prepara ubicación y pasajeros. Mantén el teléfono disponible para confirmar el punto exacto por llamada.",
    roadQuickButton: "Preparar",
    internalRoutes: "Rutas principales",
    otherLanguages: "Taxi Ayud en otros idiomas",
  },
  en: {
    roadHeroOption: "Road breakdown",
    roadEyebrow: "Urgent road pick-up",
    roadTitle: "Taxi if you are stranded near Calatayud",
    roadText:
      "If you have a breakdown or road incident on the A-2, N-II, N-234 or nearby roads, I can pick up passengers and take you to Calatayud, a garage, hotel, station or a safe destination. If the vehicle needs towing or assistance, contact your insurance or roadside assistance too.",
    roadLocationButton: "Prepare pick-up with location",
    roadWhatsapp: "Urgent WhatsApp",
    roadPresetAria: "Common road pick-up points",
    roadDisclaimer:
      "Passenger taxi service only. This is not a tow truck or mechanical assistance. If there is danger, a medical emergency or road risk, call 112 first. If needed, contact your insurance or roadside assistance before moving.",
    roadPanelAria: "How to request a taxi from the road",
    roadSteps: [
      { title: "Get to safety if you can", text: "Do not cross the road or put yourself at risk. If there is danger, an accident or an emergency, call 112 before requesting a taxi." },
      { title: "Contact assistance if needed", text: "If the vehicle cannot continue, contact your insurer or roadside assistance." },
      { title: "Keep your phone available", text: "Send location, road, direction or approximate km and keep your phone on sound to confirm where you are." },
    ],
    roadQuickTitle: "Breakdown or road incident",
    roadQuickText: "WhatsApp prepares location and passengers. Keep your phone available to confirm the exact point by call.",
    roadQuickButton: "Prepare",
    internalRoutes: "Main routes",
    otherLanguages: "Taxi Ayud in other languages",
  },
  fr: {
    roadHeroOption: "Panne sur route",
    roadEyebrow: "Prise en charge urgente sur route",
    roadTitle: "Taxi si vous êtes bloqué près de Calatayud",
    roadText:
      "En cas de panne ou d'incident sur l'A-2, N-II, N-234 ou routes proches, je peux prendre en charge les passagers vers Calatayud, garage, hôtel, gare ou destination sûre. Si le véhicule nécessite une dépanneuse ou assistance, contactez aussi votre assurance.",
    roadLocationButton: "Préparer avec position",
    roadWhatsapp: "WhatsApp urgent",
    roadPresetAria: "Points routiers habituels",
    roadDisclaimer:
      "Service de taxi pour passagers. Ce n'est pas une dépanneuse ni une assistance mécanique. En cas de danger, urgence médicale ou risque sur la route, appelez d'abord le 112. Si besoin, contactez votre assurance ou assistance routière avant de vous déplacer.",
    roadPanelAria: "Comment demander un taxi depuis la route",
    roadSteps: [
      { title: "Mettez-vous en sécurité si possible", text: "Ne traversez pas la route et ne prenez pas de risque. En cas de danger, accident ou urgence, appelez le 112 avant le taxi." },
      { title: "Prévenez l'assistance si besoin", text: "Si le véhicule ne peut pas continuer, contactez votre assurance ou assistance routière." },
      { title: "Gardez le téléphone disponible", text: "Envoyez position, route, sens ou km approximatif et gardez le téléphone avec son pour confirmer où vous êtes." },
    ],
    roadQuickTitle: "Panne ou incident sur route",
    roadQuickText: "Le WhatsApp prépare position et passagers. Gardez le téléphone disponible pour confirmer le point exact par appel.",
    roadQuickButton: "Préparer",
    internalRoutes: "Routes principales",
    otherLanguages: "Taxi Ayud en plusieurs langues",
  },
  ca: {
    roadHeroOption: "Avaria en carretera",
    roadEyebrow: "Recollida urgent en carretera",
    roadTitle: "Taxi si t'has quedat tirat prop de Calatayud",
    roadText:
      "Si tens una avaria o incidència a l'A-2, N-II, N-234 o carreteres properes, puc recollir passatgers i portar-los a Calatayud, taller, hotel, estació o destinació segura. Si el vehicle necessita grua o assistència, avisa també l'asseguradora.",
    roadLocationButton: "Preparar recollida amb ubicació",
    roadWhatsapp: "WhatsApp urgent",
    roadPresetAria: "Punts habituals de carretera",
    roadDisclaimer:
      "Servei de taxi per a passatgers. No és grua ni assistència mecànica. Si hi ha perill, emergència mèdica o risc a la via, truca primer al 112. Si cal, avisa l'asseguradora o assistència en carretera abans de moure't.",
    roadPanelAria: "Com demanar taxi des de carretera",
    roadSteps: [
      { title: "Posa't a salvo si pots", text: "No creuis la via ni et posis en risc. Si hi ha perill, accident o emergència, truca al 112 abans de demanar taxi." },
      { title: "Avisa si necessites grua", text: "Si el vehicle no pot continuar, contacta amb l'asseguradora o assistència en carretera." },
      { title: "Mantén el telèfon disponible", text: "Envia ubicació, carretera, sentit o km aproximat i mantén el mòbil amb so per confirmar on ets." },
    ],
    roadQuickTitle: "Avaria o incidència en carretera",
    roadQuickText: "El WhatsApp prepara ubicació i passatgers. Mantén el telèfon disponible per confirmar el punt exacte per trucada.",
    roadQuickButton: "Preparar",
    internalRoutes: "Rutes principals",
    otherLanguages: "Taxi Ayud en altres idiomes",
  },
  de: {
    roadHeroOption: "Panne auf der Straße",
    roadEyebrow: "Dringende Abholung auf der Straße",
    roadTitle: "Taxi, wenn Sie bei Calatayud liegen geblieben sind",
    roadText:
      "Bei Panne oder Vorfall auf A-2, N-II, N-234 oder nahen Straßen kann ich Fahrgäste nach Calatayud, Werkstatt, Hotel, Bahnhof oder zu einem sicheren Ziel bringen. Wenn das Fahrzeug Abschleppen oder Pannenhilfe braucht, kontaktieren Sie auch Ihre Versicherung oder Hilfeleistung.",
    roadLocationButton: "Abholung mit Standort vorbereiten",
    roadWhatsapp: "Dringend per WhatsApp",
    roadPresetAria: "Häufige Straßen-Abholpunkte",
    roadDisclaimer:
      "Nur Taxi für Fahrgäste. Kein Abschleppdienst und keine Pannenhilfe. Bei Gefahr, medizinischem Notfall oder Risiko auf der Straße zuerst 112 anrufen. Falls nötig, kontaktieren Sie Versicherung oder Pannenhilfe vor dem Weiterfahren.",
    roadPanelAria: "Taxi von der Straße anfragen",
    roadSteps: [
      { title: "Wenn möglich in Sicherheit gehen", text: "Überqueren Sie nicht die Fahrbahn und gehen Sie kein Risiko ein. Bei Gefahr, Unfall oder Notfall zuerst 112 anrufen." },
      { title: "Hilfe informieren, falls nötig", text: "Wenn das Fahrzeug nicht weiterfahren kann, Versicherung oder Pannenhilfe kontaktieren." },
      { title: "Telefon erreichbar halten", text: "Standort, Straße, Fahrtrichtung oder ungefähren km senden und das Telefon laut lassen, um den genauen Ort zu bestätigen." },
    ],
    roadQuickTitle: "Panne oder Straßenereignis",
    roadQuickText: "WhatsApp bereitet Standort und Fahrgäste vor. Telefon erreichbar halten, damit der genaue Punkt per Anruf bestätigt werden kann.",
    roadQuickButton: "Vorbereiten",
    internalRoutes: "Wichtige Routen",
    otherLanguages: "Taxi Ayud in anderen Sprachen",
  },
  it: {
    roadHeroOption: "Guasto su strada",
    roadEyebrow: "Ritiro urgente su strada",
    roadTitle: "Taxi se sei rimasto bloccato vicino a Calatayud",
    roadText:
      "In caso di guasto o incidente su A-2, N-II, N-234 o strade vicine, posso ritirare i passeggeri verso Calatayud, officina, hotel, stazione o destinazione sicura. Se il veicolo richiede carro attrezzi o assistenza, contatta anche assicurazione o assistenza stradale.",
    roadLocationButton: "Prepara ritiro con posizione",
    roadWhatsapp: "WhatsApp urgente",
    roadPresetAria: "Punti stradali abituali",
    roadDisclaimer:
      "Servizio taxi per passeggeri. Non è carro attrezzi né assistenza meccanica. In caso di pericolo, emergenza medica o rischio sulla strada chiama prima il 112. Se serve, contatta assicurazione o assistenza stradale prima di muoverti.",
    roadPanelAria: "Come chiedere taxi dalla strada",
    roadSteps: [
      { title: "Mettiti al sicuro se puoi", text: "Non attraversare la strada e non esporti a rischi. In caso di pericolo, incidente o emergenza, chiama il 112 prima del taxi." },
      { title: "Avvisa l'assistenza se serve", text: "Se il veicolo non può continuare, contatta assicurazione o assistenza stradale." },
      { title: "Tieni il telefono disponibile", text: "Invia posizione, strada, direzione o km approssimativo e tieni il telefono con suoneria per confermare dove sei." },
    ],
    roadQuickTitle: "Guasto o incidente su strada",
    roadQuickText: "WhatsApp prepara posizione e passeggeri. Tieni il telefono disponibile per confermare il punto esatto con una chiamata.",
    roadQuickButton: "Preparare",
    internalRoutes: "Rotte principali",
    otherLanguages: "Taxi Ayud in altre lingue",
  },
  pt: {
    roadHeroOption: "Avaria na estrada",
    roadEyebrow: "Recolha urgente na estrada",
    roadTitle: "Táxi se ficou parado perto de Calatayud",
    roadText:
      "Se tiver avaria ou incidente na A-2, N-II, N-234 ou estradas próximas, posso recolher passageiros para Calatayud, oficina, hotel, estação ou destino seguro. Se o veículo precisar de reboque ou assistência, contacte também o seguro ou assistência rodoviária.",
    roadLocationButton: "Preparar recolha com localização",
    roadWhatsapp: "WhatsApp urgente",
    roadPresetAria: "Pontos habituais de estrada",
    roadDisclaimer:
      "Serviço de táxi para passageiros. Não é reboque nem assistência mecânica. Em caso de perigo, emergência médica ou risco na estrada, ligue primeiro 112. Se necessário, contacte o seguro ou assistência rodoviária antes de se mover.",
    roadPanelAria: "Como pedir táxi desde a estrada",
    roadSteps: [
      { title: "Fique em segurança se puder", text: "Não atravesse a via nem se coloque em risco. Em caso de perigo, acidente ou emergência, ligue 112 antes do táxi." },
      { title: "Avise a assistência se necessário", text: "Se o veículo não puder continuar, contacte o seguro ou assistência rodoviária." },
      { title: "Mantenha o telefone disponível", text: "Envie localização, estrada, sentido ou km aproximado e mantenha o telefone com som para confirmar onde está." },
    ],
    roadQuickTitle: "Avaria ou incidente na estrada",
    roadQuickText: "O WhatsApp prepara localização e passageiros. Mantenha o telefone disponível para confirmar o ponto exato por chamada.",
    roadQuickButton: "Preparar",
    internalRoutes: "Rotas principais",
    otherLanguages: "Taxi Ayud noutros idiomas",
  },
  nl: {
    roadHeroOption: "Pech onderweg",
    roadEyebrow: "Dringend ophalen langs de weg",
    roadTitle: "Taxi als u gestrand bent bij Calatayud",
    roadText:
      "Bij pech of een incident op de A-2, N-II, N-234 of nabijgelegen wegen kan ik passagiers ophalen naar Calatayud, garage, hotel, station of een veilige bestemming. Als het voertuig sleepdienst of pechhulp nodig heeft, neem ook contact op met verzekering of pechhulp.",
    roadLocationButton: "Ophalen met locatie voorbereiden",
    roadWhatsapp: "Dringend WhatsApp",
    roadPresetAria: "Veelgebruikte ophaalpunten langs de weg",
    roadDisclaimer:
      "Alleen taxiservice voor passagiers. Geen sleepwagen of mechanische hulp. Bij gevaar, medische nood of risico op de weg eerst 112 bellen. Neem indien nodig contact op met verzekering of pechhulp voordat u zich verplaatst.",
    roadPanelAria: "Taxi vanaf de weg aanvragen",
    roadSteps: [
      { title: "Ga naar veiligheid als dat kan", text: "Steek de weg niet over en neem geen risico. Bij gevaar, ongeval of nood eerst 112 bellen voordat u een taxi vraagt." },
      { title: "Bel hulp indien nodig", text: "Als het voertuig niet verder kan, neem contact op met verzekering of pechhulp." },
      { title: "Houd de telefoon beschikbaar", text: "Stuur locatie, weg, rijrichting of geschatte km en houd uw telefoon met geluid aan om te bevestigen waar u bent." },
    ],
    roadQuickTitle: "Pech of incident onderweg",
    roadQuickText: "WhatsApp bereidt locatie en passagiers voor. Houd uw telefoon beschikbaar om het exacte punt telefonisch te bevestigen.",
    roadQuickButton: "Voorbereiden",
    internalRoutes: "Belangrijke routes",
    otherLanguages: "Taxi Ayud in andere talen",
  },
  ar: {
    roadHeroOption: "عطل على الطريق",
    roadEyebrow: "استلام عاجل على الطريق",
    roadTitle: "تاكسي إذا تعطلت قرب كالاتايود",
    roadText:
      "إذا حدث عطل أو مشكلة على A-2 أو N-II أو N-234 أو الطرق القريبة، يمكن نقل الركاب إلى كالاتايود أو ورشة أو فندق أو محطة أو وجهة آمنة. إذا كانت السيارة تحتاج إلى سحب أو مساعدة طريق، تواصل أيضا مع التأمين أو خدمة المساعدة.",
    roadLocationButton: "تجهيز الاستلام مع الموقع",
    roadWhatsapp: "واتساب عاجل",
    roadPresetAria: "نقاط استلام شائعة على الطريق",
    roadDisclaimer:
      "خدمة تاكسي للركاب فقط. ليست شاحنة سحب ولا مساعدة ميكانيكية. إذا كان هناك خطر أو طارئ طبي أو خطر على الطريق، اتصل أولا ب 112. إذا لزم الأمر، تواصل مع التأمين أو مساعدة الطريق قبل التحرك.",
    roadPanelAria: "كيفية طلب تاكسي من الطريق",
    roadSteps: [
      { title: "ابق آمنا إذا استطعت", text: "لا تعبر الطريق ولا تعرض نفسك للخطر. إذا كان هناك خطر أو حادث أو طارئ، اتصل ب 112 قبل طلب التاكسي." },
      { title: "أبلغ المساعدة إذا لزم", text: "إذا كانت السيارة لا تستطيع المتابعة، تواصل مع التأمين أو مساعدة الطريق." },
      { title: "أبق الهاتف متاحا", text: "أرسل الموقع والطريق والاتجاه أو الكيلومتر التقريبي، وأبق الهاتف بصوت عال لتأكيد مكانك." },
    ],
    roadQuickTitle: "عطل أو مشكلة على الطريق",
    roadQuickText: "واتساب يجهز الموقع وعدد الركاب. أبق الهاتف متاحا لتأكيد النقطة الدقيقة عبر مكالمة.",
    roadQuickButton: "تجهيز",
    internalRoutes: "الطرق الرئيسية",
    otherLanguages: "Taxi Ayud بلغات أخرى",
  },
};

const ROAD_WHATSAPP_NOTICE: Record<
  LangCode,
  {
    aria: string;
    title: string;
    text: string;
    points: string[];
    cancel: string;
    continue: string;
  }
> = {
  es: {
    aria: "Aviso antes de abrir WhatsApp por avería en carretera",
    title: "Antes de abrir WhatsApp",
    text:
      "Si estás en carretera, primero ponte a salvo. Después abre WhatsApp y envía los datos para confirmar recogida, disponibilidad y precio orientativo.",
    points: [
      "Si hay peligro, accidente o emergencia, llama primero al 112.",
      "Mantén el teléfono disponible: puede hacer falta llamarte para localizarte bien.",
      "Indica carretera, sentido, kilómetro aproximado, salida cercana o una referencia visible.",
      "Si el vehículo necesita grúa, avisa también a tu aseguradora o asistencia en carretera.",
    ],
    cancel: "Volver",
    continue: "Abrir WhatsApp",
  },
  en: {
    aria: "Notice before opening WhatsApp for a roadside incident",
    title: "Before opening WhatsApp",
    text:
      "If you are on the road, get to safety first. Then open WhatsApp and send the details so pick-up, availability and an indicative price can be confirmed.",
    points: [
      "If there is danger, an accident or an emergency, call 112 first.",
      "Keep your phone available: a call may be needed to locate you accurately.",
      "Send the road, direction, approximate km, nearby exit or visible reference.",
      "If the vehicle needs towing, also contact your insurer or roadside assistance.",
    ],
    cancel: "Back",
    continue: "Open WhatsApp",
  },
  fr: {
    aria: "Avis avant d'ouvrir WhatsApp pour une panne sur route",
    title: "Avant d'ouvrir WhatsApp",
    text:
      "Si vous êtes sur la route, mettez-vous d'abord en sécurité. Ensuite ouvrez WhatsApp et envoyez les informations pour confirmer la prise en charge, la disponibilité et un prix indicatif.",
    points: [
      "En cas de danger, accident ou urgence, appelez d'abord le 112.",
      "Gardez le téléphone disponible : un appel peut être nécessaire pour vous localiser précisément.",
      "Indiquez route, sens, km approximatif, sortie proche ou repère visible.",
      "Si le véhicule nécessite une dépanneuse, contactez aussi votre assurance ou assistance routière.",
    ],
    cancel: "Retour",
    continue: "Ouvrir WhatsApp",
  },
  ca: {
    aria: "Avís abans d'obrir WhatsApp per avaria en carretera",
    title: "Abans d'obrir WhatsApp",
    text:
      "Si ets a la carretera, primer posa't a salvo. Després obre WhatsApp i envia les dades per confirmar recollida, disponibilitat i preu orientatiu.",
    points: [
      "Si hi ha perill, accident o emergència, truca primer al 112.",
      "Mantén el telèfon disponible: pot caldre trucar-te per localitzar-te bé.",
      "Indica carretera, sentit, km aproximat, sortida propera o una referència visible.",
      "Si el vehicle necessita grua, avisa també l'asseguradora o assistència en carretera.",
    ],
    cancel: "Tornar",
    continue: "Obrir WhatsApp",
  },
  de: {
    aria: "Hinweis vor WhatsApp bei Panne auf der Straße",
    title: "Vor dem Öffnen von WhatsApp",
    text:
      "Wenn Sie auf der Straße sind, bringen Sie sich zuerst in Sicherheit. Öffnen Sie danach WhatsApp und senden Sie die Angaben, damit Abholung, Verfügbarkeit und Orientierungspreis bestätigt werden können.",
    points: [
      "Bei Gefahr, Unfall oder Notfall zuerst 112 anrufen.",
      "Telefon erreichbar halten: Ein Anruf kann nötig sein, um Sie genau zu finden.",
      "Straße, Fahrtrichtung, ungefähren km, nahe Ausfahrt oder sichtbare Referenz senden.",
      "Wenn das Fahrzeug Abschleppen braucht, kontaktieren Sie auch Versicherung oder Pannenhilfe.",
    ],
    cancel: "Zurück",
    continue: "WhatsApp öffnen",
  },
  it: {
    aria: "Avviso prima di aprire WhatsApp per guasto su strada",
    title: "Prima di aprire WhatsApp",
    text:
      "Se sei su strada, mettiti prima al sicuro. Poi apri WhatsApp e invia i dati per confermare ritiro, disponibilità e prezzo indicativo.",
    points: [
      "In caso di pericolo, incidente o emergenza, chiama prima il 112.",
      "Tieni il telefono disponibile: può servire una chiamata per localizzarti bene.",
      "Indica strada, direzione, km approssimativo, uscita vicina o riferimento visibile.",
      "Se il veicolo necessita carro attrezzi, contatta anche assicurazione o assistenza stradale.",
    ],
    cancel: "Indietro",
    continue: "Apri WhatsApp",
  },
  pt: {
    aria: "Aviso antes de abrir WhatsApp por avaria na estrada",
    title: "Antes de abrir WhatsApp",
    text:
      "Se estiver na estrada, coloque-se primeiro em segurança. Depois abra WhatsApp e envie os dados para confirmar recolha, disponibilidade e preço indicativo.",
    points: [
      "Se houver perigo, acidente ou emergência, ligue primeiro 112.",
      "Mantenha o telefone disponível: pode ser necessário telefonar para localizar bem.",
      "Indique estrada, sentido, km aproximado, saída próxima ou referência visível.",
      "Se o veículo precisar de reboque, contacte também o seguro ou assistência rodoviária.",
    ],
    cancel: "Voltar",
    continue: "Abrir WhatsApp",
  },
  nl: {
    aria: "Melding voordat WhatsApp opent bij pech onderweg",
    title: "Voordat WhatsApp opent",
    text:
      "Bent u langs de weg, breng uzelf dan eerst in veiligheid. Open daarna WhatsApp en stuur de gegevens om ophalen, beschikbaarheid en richtprijs te bevestigen.",
    points: [
      "Bij gevaar, ongeval of noodsituatie eerst 112 bellen.",
      "Houd uw telefoon beschikbaar: bellen kan nodig zijn om u goed te lokaliseren.",
      "Stuur weg, rijrichting, geschatte km, nabijgelegen afrit of zichtbaar herkenningspunt.",
      "Als het voertuig sleepdienst nodig heeft, neem ook contact op met verzekering of pechhulp.",
    ],
    cancel: "Terug",
    continue: "WhatsApp openen",
  },
  ar: {
    aria: "تنبيه قبل فتح واتساب بسبب عطل على الطريق",
    title: "قبل فتح واتساب",
    text:
      "إذا كنت على الطريق، ابق أولا في مكان آمن. بعد ذلك افتح واتساب وأرسل التفاصيل لتأكيد الاستلام والتوفر والسعر التقريبي.",
    points: [
      "إذا كان هناك خطر أو حادث أو حالة طارئة، اتصل أولا ب 112.",
      "أبق الهاتف متاحا: قد نحتاج إلى الاتصال بك لتحديد مكانك بدقة.",
      "أرسل الطريق والاتجاه والكيلومتر التقريبي أو أقرب مخرج أو علامة واضحة.",
      "إذا كانت السيارة تحتاج إلى سحب، تواصل أيضا مع التأمين أو خدمة المساعدة على الطريق.",
    ],
    cancel: "رجوع",
    continue: "فتح واتساب",
  },
};

const GLOBAL_COPY: Record<LangCode, GlobalCopy> = {
  es: {
    reserveWhatsapp: "Reservar por WhatsApp",
    officialNotice: "Tarifas interurbanas oficiales 2026 · B.O.A. n.º 238 del 10-12-2025",
    paymentShort: "Efectivo · Tarjeta · Bizum · Apple Pay · Google Pay",
    cookie: {
      aria: "Aviso de cookies",
      title: "Privacidad y cookies",
      text:
        "Usamos cookies técnicas para que la web funcione. Si aceptas, también podremos medir de forma anónima llamadas, WhatsApp y consultas de tarifa para mejorar el servicio.",
      privacy: "Privacidad",
      cookies: "Cookies",
      necessary: "Solo necesarias",
      accept: "Aceptar",
    },
    legal: {
      aria: "Información legal",
      legalTitle: "Aviso legal",
      legalText:
        `Titular: ${LEGAL.owner}, DNI/NIF ${LEGAL.taxId}, con domicilio en ${LEGAL.address}. Nombre comercial: ${LEGAL.businessName}. Actividad: servicio de taxi y reservas de traslados en Calatayud y comarca. Teléfono de contacto: ${CONTACT.phoneDisplay}.`,
      privacyTitle: "Protección de datos y privacidad",
      privacyText:
        "Los datos que envíes por llamada, WhatsApp o formularios se usan únicamente para atender tu consulta, preparar la reserva, confirmar disponibilidad y gestionar el servicio solicitado. No se venden datos ni se publican datos personales. Puedes solicitar acceso, rectificación o supresión contactando por teléfono o WhatsApp.",
      cookiesTitle: "Política de cookies",
      cookiesText:
        "La web utiliza cookies técnicas necesarias para recordar preferencias básicas. La medición anónima solo se carga si aceptas las cookies y sirve para conocer clics generales en llamada, WhatsApp o consulta de tarifa, sin registrar mensajes, teléfonos ni direcciones personales.",
    },
    route: {
      dayLabel: "Laborable diurna",
      premiumLabel: "Nocturna / festiva",
      businessDay: "día laborable",
      night: "horario nocturno",
      holiday: "domingo o festivo",
      calculated: "ruta calculada",
      estimated: "ruta estimada",
      habitual: "ruta habitual",
      dateEmpty: "Fecha sin indicar",
      originFallback: "origen indicado",
      destinationFallback: "destino indicado",
    },
    location: {
      current: "Mi ubicación actual",
      currentDetail: "Ubicación compartida desde el navegador",
      roadFallbackOrigin: "A-2 / carretera cerca de Calatayud",
      roadNotes: "Avería o incidencia en carretera. Solicito recogida de pasajeros.",
      unsupported: "Tu navegador no permite enviar ubicación.",
      requesting: "Pidiendo ubicación...",
      ready: "Ubicación lista para enviar por WhatsApp.",
      failed: "No se pudo obtener la ubicación. Puedes escribir la dirección.",
    },
    media: {
      roadPhotoAlt: "Taxi Ayud recogiendo pasajeros por avería en la A-2 cerca de Calatayud",
      roadPhotoCaption: "Recogida real en carretera: taxi para pasajeros con avería o incidencia en la A-2 y comarca.",
    },
    aria: {
      brandHome: "Taxi Ayud inicio",
      mainNav: "Navegación principal",
      language: "Idioma",
      relatedLinks: "Enlaces relacionados",
      internalRoutes: "Rutas principales de Taxi Ayud",
      languageVersions: "Versiones por idioma",
      serviceHighlights: "Zonas de servicio destacadas",
      bookingCard: "Reserva rápida",
      quickContact: "Opciones de contacto rápido",
      trustData: "Datos principales",
      region: "Comarca de Calatayud",
      comfort: "Comodidad del servicio",
      localSeo: "Taxi en Calatayud y comarca",
      tourist: "Taxi para visitantes y alojamientos",
      bookingType: "Tipo de reserva",
      originSuggestions: "Sugerencias de origen",
      destinationSuggestions: "Sugerencias de destino",
      suggestedDestinations: "Destinos sugeridos",
      reviewSignals: "Puntos destacados de las reseñas",
      quickDestinations: "Destinos rápidos",
      mobileActions: "Acciones rápidas",
      roadMobile: "Pedir taxi por avería o incidencia en carretera",
    },
    starsLabel: (rating) => `${rating} estrellas`,
  },
  en: {
    reserveWhatsapp: "Book by WhatsApp",
    officialNotice: "Official intercity taxi fares 2026 · B.O.A. no. 238, 10-12-2025",
    paymentShort: "Cash · Card · Bizum · Apple Pay · Google Pay",
    cookie: {
      aria: "Cookie notice",
      title: "Privacy and cookies",
      text:
        "We use technical cookies so the website works. If you accept, we may also measure calls, WhatsApp clicks and fare requests anonymously to improve the service.",
      privacy: "Privacy",
      cookies: "Cookies",
      necessary: "Necessary only",
      accept: "Accept",
    },
    legal: {
      aria: "Legal information",
      legalTitle: "Legal notice",
      legalText:
        `Owner: ${LEGAL.owner}, tax ID ${LEGAL.taxId}, based in ${LEGAL.address}. Trading name: ${LEGAL.businessName}. Activity: taxi service and transfer bookings in Calatayud and the surrounding area. Contact phone: ${CONTACT.phoneDisplay}.`,
      privacyTitle: "Data protection and privacy",
      privacyText:
        "The data you send by phone, WhatsApp or forms is used only to answer your request, prepare the booking, confirm availability and manage the requested service. Data is not sold or published. You can request access, correction or deletion by phone or WhatsApp.",
      cookiesTitle: "Cookie policy",
      cookiesText:
        "The website uses necessary technical cookies to remember basic preferences. Anonymous measurement only loads if you accept cookies and is used to understand general call, WhatsApp and fare-query clicks, without recording messages, phone numbers or personal addresses.",
    },
    route: {
      dayLabel: "Weekday daytime",
      premiumLabel: "Night / holiday",
      businessDay: "weekday",
      night: "night time",
      holiday: "Sunday or public holiday",
      calculated: "calculated route",
      estimated: "estimated route",
      habitual: "common route",
      dateEmpty: "Date not set",
      originFallback: "selected origin",
      destinationFallback: "selected destination",
    },
    location: {
      current: "My current location",
      currentDetail: "Location shared from the browser",
      roadFallbackOrigin: "A-2 / road near Calatayud",
      roadNotes: "Road breakdown or incident. Passenger pick-up needed.",
      unsupported: "Your browser cannot send location.",
      requesting: "Requesting location...",
      ready: "Location ready to send by WhatsApp.",
      failed: "Location could not be detected. You can type the address.",
    },
    media: {
      roadPhotoAlt: "Taxi Ayud passenger pick-up after an A-2 road breakdown near Calatayud",
      roadPhotoCaption: "Real road pick-up: passenger taxi for A-2 breakdowns or incidents near Calatayud.",
    },
    aria: {
      brandHome: "Taxi Ayud home",
      mainNav: "Main navigation",
      language: "Language",
      relatedLinks: "Related links",
      internalRoutes: "Taxi Ayud main routes",
      languageVersions: "Language versions",
      serviceHighlights: "Featured service areas",
      bookingCard: "Quick booking",
      quickContact: "Quick contact options",
      trustData: "Main details",
      region: "Calatayud area",
      comfort: "Service comfort",
      localSeo: "Taxi in Calatayud and area",
      tourist: "Taxi for visitors and accommodation",
      bookingType: "Booking type",
      originSuggestions: "Origin suggestions",
      destinationSuggestions: "Destination suggestions",
      suggestedDestinations: "Suggested destinations",
      reviewSignals: "Review highlights",
      quickDestinations: "Quick destinations",
      mobileActions: "Quick actions",
      roadMobile: "Request a taxi for a road breakdown or incident",
    },
    starsLabel: (rating) => `${rating} stars`,
  },
  fr: {
    reserveWhatsapp: "Réserver par WhatsApp",
    officialNotice: "Tarifs interurbains officiels 2026 · B.O.A. n.º 238 du 10-12-2025",
    paymentShort: "Espèces · Carte · Bizum · Apple Pay · Google Pay",
    cookie: {
      aria: "Avis sur les cookies",
      title: "Confidentialité et cookies",
      text:
        "Nous utilisons des cookies techniques pour le fonctionnement du site. Si vous acceptez, nous pouvons aussi mesurer anonymement les appels, WhatsApp et demandes de tarif afin d'améliorer le service.",
      privacy: "Confidentialité",
      cookies: "Cookies",
      necessary: "Nécessaires seulement",
      accept: "Accepter",
    },
    legal: {
      aria: "Informations légales",
      legalTitle: "Mentions légales",
      legalText:
        `Titulaire : ${LEGAL.owner}, DNI/NIF ${LEGAL.taxId}, domicile à ${LEGAL.address}. Nom commercial : ${LEGAL.businessName}. Activité : service de taxi et réservations de transferts à Calatayud et dans la région. Téléphone : ${CONTACT.phoneDisplay}.`,
      privacyTitle: "Protection des données et confidentialité",
      privacyText:
        "Les données envoyées par appel, WhatsApp ou formulaire servent uniquement à répondre à votre demande, préparer la réservation, confirmer la disponibilité et gérer le service demandé. Les données ne sont ni vendues ni publiées. Vous pouvez demander l'accès, la rectification ou la suppression par téléphone ou WhatsApp.",
      cookiesTitle: "Politique de cookies",
      cookiesText:
        "Le site utilise des cookies techniques nécessaires pour mémoriser des préférences de base. La mesure anonyme ne se charge que si vous acceptez les cookies et sert à connaître les clics généraux d'appel, WhatsApp ou consultation de tarif, sans enregistrer messages, téléphones ni adresses personnelles.",
    },
    route: {
      dayLabel: "Jour ouvrable",
      premiumLabel: "Nuit / férié",
      businessDay: "jour ouvrable",
      night: "horaire de nuit",
      holiday: "dimanche ou jour férié",
      calculated: "itinéraire calculé",
      estimated: "itinéraire estimé",
      habitual: "itinéraire habituel",
      dateEmpty: "Date non indiquée",
      originFallback: "départ indiqué",
      destinationFallback: "destination indiquée",
    },
    location: {
      current: "Ma position actuelle",
      currentDetail: "Position partagée depuis le navigateur",
      roadFallbackOrigin: "A-2 / route près de Calatayud",
      roadNotes: "Panne ou incident sur route. Prise en charge de passagers demandée.",
      unsupported: "Votre navigateur ne permet pas d'envoyer la position.",
      requesting: "Demande de position...",
      ready: "Position prête à envoyer par WhatsApp.",
      failed: "Position impossible à obtenir. Vous pouvez écrire l'adresse.",
    },
    media: {
      roadPhotoAlt: "Taxi Ayud prenant en charge des passagers après une panne sur l'A-2 près de Calatayud",
      roadPhotoCaption: "Prise en charge réelle sur route : taxi passagers pour panne ou incident sur l'A-2 et la région.",
    },
    aria: {
      brandHome: "Accueil Taxi Ayud",
      mainNav: "Navigation principale",
      language: "Langue",
      relatedLinks: "Liens associés",
      internalRoutes: "Routes principales de Taxi Ayud",
      languageVersions: "Versions par langue",
      serviceHighlights: "Zones de service mises en avant",
      bookingCard: "Réservation rapide",
      quickContact: "Options de contact rapide",
      trustData: "Informations principales",
      region: "Région de Calatayud",
      comfort: "Confort du service",
      localSeo: "Taxi à Calatayud et région",
      tourist: "Taxi pour visiteurs et hébergements",
      bookingType: "Type de réservation",
      originSuggestions: "Suggestions de départ",
      destinationSuggestions: "Suggestions de destination",
      suggestedDestinations: "Destinations suggérées",
      reviewSignals: "Points forts des avis",
      quickDestinations: "Destinations rapides",
      mobileActions: "Actions rapides",
      roadMobile: "Demander un taxi pour panne ou incident sur route",
    },
    starsLabel: (rating) => `${rating} étoiles`,
  },
  ca: {
    reserveWhatsapp: "Reservar per WhatsApp",
    officialNotice: "Tarifes interurbanes oficials 2026 · B.O.A. núm. 238 del 10-12-2025",
    paymentShort: "Efectiu · Targeta · Bizum · Apple Pay · Google Pay",
    cookie: {
      aria: "Avís de cookies",
      title: "Privacitat i cookies",
      text:
        "Fem servir cookies tècniques perquè la web funcioni. Si acceptes, també podrem mesurar de forma anònima trucades, WhatsApp i consultes de tarifa per millorar el servei.",
      privacy: "Privacitat",
      cookies: "Cookies",
      necessary: "Només necessàries",
      accept: "Acceptar",
    },
    legal: {
      aria: "Informació legal",
      legalTitle: "Avís legal",
      legalText:
        `Titular: ${LEGAL.owner}, DNI/NIF ${LEGAL.taxId}, amb domicili a ${LEGAL.address}. Nom comercial: ${LEGAL.businessName}. Activitat: servei de taxi i reserves de trasllats a Calatayud i comarca. Telèfon de contacte: ${CONTACT.phoneDisplay}.`,
      privacyTitle: "Protecció de dades i privacitat",
      privacyText:
        "Les dades que enviïs per trucada, WhatsApp o formularis s'utilitzen només per atendre la consulta, preparar la reserva, confirmar disponibilitat i gestionar el servei sol·licitat. No es venen dades ni es publiquen dades personals. Pots sol·licitar accés, rectificació o supressió per telèfon o WhatsApp.",
      cookiesTitle: "Política de cookies",
      cookiesText:
        "La web utilitza cookies tècniques necessàries per recordar preferències bàsiques. El mesurament anònim només es carrega si acceptes les cookies i serveix per conèixer clics generals de trucada, WhatsApp o consulta de tarifa, sense registrar missatges, telèfons ni adreces personals.",
    },
    route: {
      dayLabel: "Laborable diürna",
      premiumLabel: "Nocturna / festiva",
      businessDay: "dia laborable",
      night: "horari nocturn",
      holiday: "diumenge o festiu",
      calculated: "ruta calculada",
      estimated: "ruta estimada",
      habitual: "ruta habitual",
      dateEmpty: "Data sense indicar",
      originFallback: "origen indicat",
      destinationFallback: "destinació indicada",
    },
    location: {
      current: "La meva ubicació actual",
      currentDetail: "Ubicació compartida des del navegador",
      roadFallbackOrigin: "A-2 / carretera prop de Calatayud",
      roadNotes: "Avaria o incidència en carretera. Sol·licito recollida de passatgers.",
      unsupported: "El navegador no permet enviar ubicació.",
      requesting: "Demanant ubicació...",
      ready: "Ubicació preparada per enviar per WhatsApp.",
      failed: "No s'ha pogut obtenir la ubicació. Pots escriure l'adreça.",
    },
    media: {
      roadPhotoAlt: "Taxi Ayud recollint passatgers per avaria a l'A-2 prop de Calatayud",
      roadPhotoCaption: "Recollida real en carretera: taxi per a passatgers amb avaria o incidència a l'A-2 i comarca.",
    },
    aria: {
      brandHome: "Inici Taxi Ayud",
      mainNav: "Navegació principal",
      language: "Idioma",
      relatedLinks: "Enllaços relacionats",
      internalRoutes: "Rutes principals de Taxi Ayud",
      languageVersions: "Versions per idioma",
      serviceHighlights: "Zones de servei destacades",
      bookingCard: "Reserva ràpida",
      quickContact: "Opcions de contacte ràpid",
      trustData: "Dades principals",
      region: "Comarca de Calatayud",
      comfort: "Comoditat del servei",
      localSeo: "Taxi a Calatayud i comarca",
      tourist: "Taxi per a visitants i allotjaments",
      bookingType: "Tipus de reserva",
      originSuggestions: "Suggeriments d'origen",
      destinationSuggestions: "Suggeriments de destinació",
      suggestedDestinations: "Destinacions suggerides",
      reviewSignals: "Punts destacats de les ressenyes",
      quickDestinations: "Destinacions ràpides",
      mobileActions: "Accions ràpides",
      roadMobile: "Demanar taxi per avaria o incidència en carretera",
    },
    starsLabel: (rating) => `${rating} estrelles`,
  },
  de: {
    reserveWhatsapp: "Per WhatsApp buchen",
    officialNotice: "Offizielle Überlandtarife 2026 · B.O.A. Nr. 238 vom 10.12.2025",
    paymentShort: "Bar · Karte · Bizum · Apple Pay · Google Pay",
    cookie: {
      aria: "Cookie-Hinweis",
      title: "Datenschutz und Cookies",
      text:
        "Wir verwenden technische Cookies, damit die Website funktioniert. Wenn Sie zustimmen, können wir Anrufe, WhatsApp-Klicks und Tarifabfragen anonym messen, um den Service zu verbessern.",
      privacy: "Datenschutz",
      cookies: "Cookies",
      necessary: "Nur notwendige",
      accept: "Akzeptieren",
    },
    legal: {
      aria: "Rechtliche Informationen",
      legalTitle: "Impressum",
      legalText:
        `Inhaber: ${LEGAL.owner}, DNI/NIF ${LEGAL.taxId}, Sitz in ${LEGAL.address}. Handelsname: ${LEGAL.businessName}. Tätigkeit: Taxi-Service und Transferbuchungen in Calatayud und Umgebung. Telefon: ${CONTACT.phoneDisplay}.`,
      privacyTitle: "Datenschutz",
      privacyText:
        "Daten, die Sie per Anruf, WhatsApp oder Formular senden, werden nur genutzt, um Ihre Anfrage zu beantworten, die Buchung vorzubereiten, Verfügbarkeit zu bestätigen und den gewünschten Service zu verwalten. Daten werden nicht verkauft oder veröffentlicht. Zugang, Berichtigung oder Löschung können per Telefon oder WhatsApp angefragt werden.",
      cookiesTitle: "Cookie-Richtlinie",
      cookiesText:
        "Die Website nutzt notwendige technische Cookies für grundlegende Präferenzen. Anonyme Messung wird nur geladen, wenn Sie Cookies akzeptieren, und erfasst allgemeine Klicks auf Anruf, WhatsApp oder Tarifabfrage, ohne Nachrichten, Telefonnummern oder persönliche Adressen zu speichern.",
    },
    route: {
      dayLabel: "Werktag tagsüber",
      premiumLabel: "Nacht / Feiertag",
      businessDay: "Werktag",
      night: "Nachtzeit",
      holiday: "Sonntag oder Feiertag",
      calculated: "berechnete Route",
      estimated: "geschätzte Route",
      habitual: "übliche Route",
      dateEmpty: "Datum nicht angegeben",
      originFallback: "angegebener Start",
      destinationFallback: "angegebenes Ziel",
    },
    location: {
      current: "Mein aktueller Standort",
      currentDetail: "Standort aus dem Browser geteilt",
      roadFallbackOrigin: "A-2 / Straße bei Calatayud",
      roadNotes: "Panne oder Vorfall auf der Straße. Abholung von Fahrgästen benötigt.",
      unsupported: "Ihr Browser kann keinen Standort senden.",
      requesting: "Standort wird angefragt...",
      ready: "Standort bereit zum Senden per WhatsApp.",
      failed: "Standort konnte nicht erkannt werden. Sie können die Adresse eingeben.",
    },
    media: {
      roadPhotoAlt: "Taxi Ayud holt Fahrgäste nach einer Panne auf der A-2 bei Calatayud ab",
      roadPhotoCaption: "Echte Abholung auf der Straße: Taxi für Fahrgäste bei Panne oder Vorfall auf der A-2 und in der Region.",
    },
    aria: {
      brandHome: "Taxi Ayud Startseite",
      mainNav: "Hauptnavigation",
      language: "Sprache",
      relatedLinks: "Verwandte Links",
      internalRoutes: "Wichtige Routen von Taxi Ayud",
      languageVersions: "Sprachversionen",
      serviceHighlights: "Hervorgehobene Servicegebiete",
      bookingCard: "Schnellbuchung",
      quickContact: "Schnelle Kontaktoptionen",
      trustData: "Wichtige Angaben",
      region: "Region Calatayud",
      comfort: "Servicekomfort",
      localSeo: "Taxi in Calatayud und Umgebung",
      tourist: "Taxi für Besucher und Unterkünfte",
      bookingType: "Buchungsart",
      originSuggestions: "Vorschläge für Start",
      destinationSuggestions: "Vorschläge für Ziel",
      suggestedDestinations: "Vorgeschlagene Ziele",
      reviewSignals: "Bewertungshighlights",
      quickDestinations: "Schnelle Ziele",
      mobileActions: "Schnellaktionen",
      roadMobile: "Taxi bei Panne oder Vorfall auf der Straße anfragen",
    },
    starsLabel: (rating) => `${rating} Sterne`,
  },
  it: {
    reserveWhatsapp: "Prenota su WhatsApp",
    officialNotice: "Tariffe interurbane ufficiali 2026 · B.O.A. n. 238 del 10-12-2025",
    paymentShort: "Contanti · Carta · Bizum · Apple Pay · Google Pay",
    cookie: {
      aria: "Avviso cookie",
      title: "Privacy e cookie",
      text:
        "Usiamo cookie tecnici per il funzionamento del sito. Se accetti, possiamo anche misurare in forma anonima chiamate, WhatsApp e richieste tariffa per migliorare il servizio.",
      privacy: "Privacy",
      cookies: "Cookie",
      necessary: "Solo necessari",
      accept: "Accetta",
    },
    legal: {
      aria: "Informazioni legali",
      legalTitle: "Avviso legale",
      legalText:
        `Titolare: ${LEGAL.owner}, DNI/NIF ${LEGAL.taxId}, domicilio a ${LEGAL.address}. Nome commerciale: ${LEGAL.businessName}. Attività: servizio taxi e prenotazioni trasferimenti a Calatayud e comarca. Telefono: ${CONTACT.phoneDisplay}.`,
      privacyTitle: "Protezione dati e privacy",
      privacyText:
        "I dati inviati tramite chiamata, WhatsApp o moduli sono usati solo per rispondere alla richiesta, preparare la prenotazione, confermare disponibilità e gestire il servizio. I dati non vengono venduti né pubblicati. Puoi richiedere accesso, rettifica o cancellazione per telefono o WhatsApp.",
      cookiesTitle: "Politica cookie",
      cookiesText:
        "Il sito usa cookie tecnici necessari per ricordare preferenze di base. La misurazione anonima si carica solo se accetti i cookie e serve a conoscere clic generali su chiamata, WhatsApp o consulta tariffa, senza registrare messaggi, telefoni o indirizzi personali.",
    },
    route: {
      dayLabel: "Feriale diurna",
      premiumLabel: "Notturna / festiva",
      businessDay: "giorno feriale",
      night: "orario notturno",
      holiday: "domenica o festivo",
      calculated: "percorso calcolato",
      estimated: "percorso stimato",
      habitual: "percorso abituale",
      dateEmpty: "Data non indicata",
      originFallback: "origine indicata",
      destinationFallback: "destinazione indicata",
    },
    location: {
      current: "La mia posizione attuale",
      currentDetail: "Posizione condivisa dal browser",
      roadFallbackOrigin: "A-2 / strada vicino a Calatayud",
      roadNotes: "Guasto o incidente su strada. Richiedo ritiro passeggeri.",
      unsupported: "Il browser non può inviare la posizione.",
      requesting: "Richiesta posizione...",
      ready: "Posizione pronta da inviare su WhatsApp.",
      failed: "Non è stato possibile ottenere la posizione. Puoi scrivere l'indirizzo.",
    },
    media: {
      roadPhotoAlt: "Taxi Ayud ritira passeggeri per guasto sull'A-2 vicino a Calatayud",
      roadPhotoCaption: "Ritiro reale su strada: taxi per passeggeri in caso di guasto o incidente sull'A-2 e nella zona.",
    },
    aria: {
      brandHome: "Home Taxi Ayud",
      mainNav: "Navigazione principale",
      language: "Lingua",
      relatedLinks: "Link correlati",
      internalRoutes: "Rotte principali di Taxi Ayud",
      languageVersions: "Versioni per lingua",
      serviceHighlights: "Zone di servizio in evidenza",
      bookingCard: "Prenotazione rapida",
      quickContact: "Opzioni di contatto rapido",
      trustData: "Dati principali",
      region: "Comarca di Calatayud",
      comfort: "Comfort del servizio",
      localSeo: "Taxi a Calatayud e comarca",
      tourist: "Taxi per visitatori e alloggi",
      bookingType: "Tipo di prenotazione",
      originSuggestions: "Suggerimenti origine",
      destinationSuggestions: "Suggerimenti destinazione",
      suggestedDestinations: "Destinazioni suggerite",
      reviewSignals: "Punti forti delle recensioni",
      quickDestinations: "Destinazioni rapide",
      mobileActions: "Azioni rapide",
      roadMobile: "Richiedere taxi per guasto o incidente su strada",
    },
    starsLabel: (rating) => `${rating} stelle`,
  },
  pt: {
    reserveWhatsapp: "Reservar por WhatsApp",
    officialNotice: "Tarifas interurbanas oficiais 2026 · B.O.A. n.º 238 de 10-12-2025",
    paymentShort: "Dinheiro · Cartão · Bizum · Apple Pay · Google Pay",
    cookie: {
      aria: "Aviso de cookies",
      title: "Privacidade e cookies",
      text:
        "Usamos cookies técnicos para o funcionamento do site. Se aceitar, também poderemos medir anonimamente chamadas, WhatsApp e consultas de tarifa para melhorar o serviço.",
      privacy: "Privacidade",
      cookies: "Cookies",
      necessary: "Só necessários",
      accept: "Aceitar",
    },
    legal: {
      aria: "Informação legal",
      legalTitle: "Aviso legal",
      legalText:
        `Titular: ${LEGAL.owner}, DNI/NIF ${LEGAL.taxId}, domicílio em ${LEGAL.address}. Nome comercial: ${LEGAL.businessName}. Atividade: serviço de táxi e reservas de transferes em Calatayud e comarca. Telefone: ${CONTACT.phoneDisplay}.`,
      privacyTitle: "Proteção de dados e privacidade",
      privacyText:
        "Os dados enviados por chamada, WhatsApp ou formulários são usados apenas para responder ao pedido, preparar a reserva, confirmar disponibilidade e gerir o serviço solicitado. Os dados não são vendidos nem publicados. Pode solicitar acesso, retificação ou eliminação por telefone ou WhatsApp.",
      cookiesTitle: "Política de cookies",
      cookiesText:
        "O site utiliza cookies técnicos necessários para recordar preferências básicas. A medição anónima só é carregada se aceitar cookies e serve para conhecer cliques gerais em chamada, WhatsApp ou consulta de tarifa, sem registar mensagens, telefones ou moradas pessoais.",
    },
    route: {
      dayLabel: "Dia útil diurno",
      premiumLabel: "Noite / feriado",
      businessDay: "dia útil",
      night: "horário noturno",
      holiday: "domingo ou feriado",
      calculated: "rota calculada",
      estimated: "rota estimada",
      habitual: "rota habitual",
      dateEmpty: "Data não indicada",
      originFallback: "origem indicada",
      destinationFallback: "destino indicado",
    },
    location: {
      current: "A minha localização atual",
      currentDetail: "Localização partilhada pelo navegador",
      roadFallbackOrigin: "A-2 / estrada perto de Calatayud",
      roadNotes: "Avaria ou incidente na estrada. Solicito recolha de passageiros.",
      unsupported: "O navegador não permite enviar localização.",
      requesting: "A pedir localização...",
      ready: "Localização pronta para enviar por WhatsApp.",
      failed: "Não foi possível obter a localização. Pode escrever a morada.",
    },
    media: {
      roadPhotoAlt: "Taxi Ayud recolhe passageiros por avaria na A-2 perto de Calatayud",
      roadPhotoCaption: "Recolha real na estrada: táxi para passageiros em caso de avaria ou incidente na A-2 e comarca.",
    },
    aria: {
      brandHome: "Início Taxi Ayud",
      mainNav: "Navegação principal",
      language: "Idioma",
      relatedLinks: "Links relacionados",
      internalRoutes: "Rotas principais de Taxi Ayud",
      languageVersions: "Versões por idioma",
      serviceHighlights: "Zonas de serviço destacadas",
      bookingCard: "Reserva rápida",
      quickContact: "Opções de contacto rápido",
      trustData: "Dados principais",
      region: "Comarca de Calatayud",
      comfort: "Conforto do serviço",
      localSeo: "Táxi em Calatayud e comarca",
      tourist: "Táxi para visitantes e alojamentos",
      bookingType: "Tipo de reserva",
      originSuggestions: "Sugestões de origem",
      destinationSuggestions: "Sugestões de destino",
      suggestedDestinations: "Destinos sugeridos",
      reviewSignals: "Destaques das avaliações",
      quickDestinations: "Destinos rápidos",
      mobileActions: "Ações rápidas",
      roadMobile: "Pedir táxi por avaria ou incidente na estrada",
    },
    starsLabel: (rating) => `${rating} estrelas`,
  },
  nl: {
    reserveWhatsapp: "Boeken via WhatsApp",
    officialNotice: "Officiële interlokale tarieven 2026 · B.O.A. nr. 238 van 10-12-2025",
    paymentShort: "Contant · Kaart · Bizum · Apple Pay · Google Pay",
    cookie: {
      aria: "Cookiebericht",
      title: "Privacy en cookies",
      text:
        "We gebruiken technische cookies zodat de website werkt. Als u accepteert, kunnen we ook anoniem oproepen, WhatsApp-klikken en tariefaanvragen meten om de service te verbeteren.",
      privacy: "Privacy",
      cookies: "Cookies",
      necessary: "Alleen noodzakelijke",
      accept: "Accepteren",
    },
    legal: {
      aria: "Juridische informatie",
      legalTitle: "Juridische kennisgeving",
      legalText:
        `Eigenaar: ${LEGAL.owner}, DNI/NIF ${LEGAL.taxId}, gevestigd in ${LEGAL.address}. Handelsnaam: ${LEGAL.businessName}. Activiteit: taxiservice en transferreserveringen in Calatayud en omgeving. Telefoon: ${CONTACT.phoneDisplay}.`,
      privacyTitle: "Gegevensbescherming en privacy",
      privacyText:
        "Gegevens die u per telefoon, WhatsApp of formulier stuurt, worden alleen gebruikt om uw verzoek te beantwoorden, de boeking voor te bereiden, beschikbaarheid te bevestigen en de gevraagde service te beheren. Gegevens worden niet verkocht of gepubliceerd. U kunt toegang, correctie of verwijdering aanvragen via telefoon of WhatsApp.",
      cookiesTitle: "Cookiebeleid",
      cookiesText:
        "De website gebruikt noodzakelijke technische cookies om basisvoorkeuren te onthouden. Anonieme meting wordt alleen geladen als u cookies accepteert en dient om algemene klikken op bellen, WhatsApp of tariefaanvragen te begrijpen, zonder berichten, telefoonnummers of persoonlijke adressen op te slaan.",
    },
    route: {
      dayLabel: "Werkdag overdag",
      premiumLabel: "Nacht / feestdag",
      businessDay: "werkdag",
      night: "nachturen",
      holiday: "zondag of feestdag",
      calculated: "berekende route",
      estimated: "geschatte route",
      habitual: "gebruikelijke route",
      dateEmpty: "Datum niet opgegeven",
      originFallback: "opgegeven vertrekpunt",
      destinationFallback: "opgegeven bestemming",
    },
    location: {
      current: "Mijn huidige locatie",
      currentDetail: "Locatie gedeeld vanuit de browser",
      roadFallbackOrigin: "A-2 / weg bij Calatayud",
      roadNotes: "Pech of incident onderweg. Passagiersvervoer nodig.",
      unsupported: "Uw browser kan geen locatie verzenden.",
      requesting: "Locatie aanvragen...",
      ready: "Locatie klaar om via WhatsApp te verzenden.",
      failed: "Locatie kon niet worden gedetecteerd. U kunt het adres typen.",
    },
    media: {
      roadPhotoAlt: "Taxi Ayud haalt passagiers op na pech op de A-2 bij Calatayud",
      roadPhotoCaption: "Echte ophaalservice langs de weg: taxi voor passagiers bij pech of incident op de A-2 en in de regio.",
    },
    aria: {
      brandHome: "Taxi Ayud startpagina",
      mainNav: "Hoofdnavigatie",
      language: "Taal",
      relatedLinks: "Gerelateerde links",
      internalRoutes: "Belangrijkste routes van Taxi Ayud",
      languageVersions: "Taalversies",
      serviceHighlights: "Uitgelichte servicegebieden",
      bookingCard: "Snel boeken",
      quickContact: "Snelle contactopties",
      trustData: "Belangrijkste gegevens",
      region: "Regio Calatayud",
      comfort: "Servicecomfort",
      localSeo: "Taxi in Calatayud en omgeving",
      tourist: "Taxi voor bezoekers en accommodaties",
      bookingType: "Boekingstype",
      originSuggestions: "Suggesties vertrekpunt",
      destinationSuggestions: "Suggesties bestemming",
      suggestedDestinations: "Voorgestelde bestemmingen",
      reviewSignals: "Hoogtepunten uit beoordelingen",
      quickDestinations: "Snelle bestemmingen",
      mobileActions: "Snelle acties",
      roadMobile: "Taxi aanvragen voor pech of incident onderweg",
    },
    starsLabel: (rating) => `${rating} sterren`,
  },
  ar: {
    reserveWhatsapp: "الحجز عبر واتساب",
    officialNotice: "تعرفات بين المدن الرسمية 2026 · B.O.A. رقم 238 بتاريخ 10-12-2025",
    paymentShort: "نقدا · بطاقة · Bizum · Apple Pay · Google Pay",
    cookie: {
      aria: "إشعار ملفات تعريف الارتباط",
      title: "الخصوصية وملفات الارتباط",
      text:
        "نستخدم ملفات ارتباط تقنية حتى يعمل الموقع. إذا وافقت، يمكننا أيضا قياس المكالمات ونقرات واتساب وطلبات السعر بشكل مجهول لتحسين الخدمة.",
      privacy: "الخصوصية",
      cookies: "ملفات الارتباط",
      necessary: "الضرورية فقط",
      accept: "موافق",
    },
    legal: {
      aria: "معلومات قانونية",
      legalTitle: "إشعار قانوني",
      legalText:
        `المالك: ${LEGAL.owner}، رقم DNI/NIF ${LEGAL.taxId}، العنوان ${LEGAL.address}. الاسم التجاري: ${LEGAL.businessName}. النشاط: خدمة تاكسي وحجوزات تنقلات في كالاتايود والمنطقة. الهاتف: ${CONTACT.phoneDisplay}.`,
      privacyTitle: "حماية البيانات والخصوصية",
      privacyText:
        "تستخدم البيانات التي ترسلها عبر الاتصال أو واتساب أو النماذج فقط للرد على طلبك، إعداد الحجز، تأكيد التوفر وإدارة الخدمة المطلوبة. لا يتم بيع البيانات أو نشرها. يمكنك طلب الوصول أو التصحيح أو الحذف عبر الهاتف أو واتساب.",
      cookiesTitle: "سياسة ملفات الارتباط",
      cookiesText:
        "يستخدم الموقع ملفات ارتباط تقنية ضرورية لتذكر التفضيلات الأساسية. لا يتم تحميل القياس المجهول إلا إذا وافقت على ملفات الارتباط، ويستخدم لمعرفة النقرات العامة على الاتصال وواتساب وطلب السعر، دون تسجيل الرسائل أو الهواتف أو العناوين الشخصية.",
    },
    route: {
      dayLabel: "يوم عمل نهاري",
      premiumLabel: "ليلي / عطلة",
      businessDay: "يوم عمل",
      night: "وقت ليلي",
      holiday: "الأحد أو عطلة رسمية",
      calculated: "مسار محسوب",
      estimated: "مسار تقديري",
      habitual: "مسار معتاد",
      dateEmpty: "التاريخ غير محدد",
      originFallback: "نقطة الانطلاق المحددة",
      destinationFallback: "الوجهة المحددة",
    },
    location: {
      current: "موقعي الحالي",
      currentDetail: "موقع تمت مشاركته من المتصفح",
      roadFallbackOrigin: "A-2 / طريق قرب كالاتايود",
      roadNotes: "عطل أو مشكلة على الطريق. أحتاج إلى نقل ركاب.",
      unsupported: "المتصفح لا يسمح بإرسال الموقع.",
      requesting: "جار طلب الموقع...",
      ready: "الموقع جاهز للإرسال عبر واتساب.",
      failed: "تعذر الحصول على الموقع. يمكنك كتابة العنوان.",
    },
    media: {
      roadPhotoAlt: "Taxi Ayud ينقل الركاب بعد عطل على طريق A-2 قرب كالاتايود",
      roadPhotoCaption: "استلام حقيقي على الطريق: تاكسي للركاب عند حدوث عطل أو مشكلة على A-2 وفي منطقة كالاتايود.",
    },
    aria: {
      brandHome: "الرئيسية Taxi Ayud",
      mainNav: "التنقل الرئيسي",
      language: "اللغة",
      relatedLinks: "روابط ذات صلة",
      internalRoutes: "الطرق الرئيسية Taxi Ayud",
      languageVersions: "إصدارات اللغة",
      serviceHighlights: "مناطق الخدمة المميزة",
      bookingCard: "حجز سريع",
      quickContact: "خيارات اتصال سريعة",
      trustData: "البيانات الرئيسية",
      region: "منطقة كالاتايود",
      comfort: "راحة الخدمة",
      localSeo: "تاكسي في كالاتايود والمنطقة",
      tourist: "تاكسي للزوار والإقامات",
      bookingType: "نوع الحجز",
      originSuggestions: "اقتراحات الانطلاق",
      destinationSuggestions: "اقتراحات الوجهة",
      suggestedDestinations: "وجهات مقترحة",
      reviewSignals: "أبرز التقييمات",
      quickDestinations: "وجهات سريعة",
      mobileActions: "إجراءات سريعة",
      roadMobile: "طلب تاكسي بسبب عطل أو مشكلة على الطريق",
    },
    starsLabel: (rating) => `${rating} نجوم`,
  },
};

const SEO_PAGES = seoPagesData as SeoPage[];
const HOME_SEO_PAGE = SEO_PAGES.find((page) => page.path === "/") ?? SEO_PAGES[0];
const DEFAULT_SEO_LINKS = [
  "/taxi-calatayud/",
  "/taxi-cerca-de-mi-calatayud/",
  "/taxi-autovia-calatayud/",
  "/taxi-a2-calatayud/",
  "/taxi-desde-calatayud/",
  "/taxi-24-horas-calatayud/",
  "/taxi-estacion-ave-calatayud/",
  "/taxi-fiestas-calatayud/",
  "/taxi-san-roque-calatayud/",
  "/taxi-fiestas-pueblos-comarca-calatayud/",
  "/taxi-monasterio-de-piedra/",
  "/taxi-nuevalos-monasterio-piedra/",
  "/taxi-balnearios-jaraba-alhama/",
  "/taxi-jaraba/",
  "/taxi-alhama-de-aragon/",
  "/taxi-aeropuerto-zaragoza/",
  "/taxi-pueblos-comarca-calatayud/",
  "/taxi-hoteles-calatayud/",
  "/taxi-ariza/",
  "/taxi-ateca/",
  "/contacto/",
  "/telefono-taxi-calatayud/",
  "/preguntas-frecuentes/",
];

const serviceIcons = [
  Navigation,
  Sparkles,
  Plane,
  TrainFront,
  Route,
  HeartPulse,
  BriefcaseBusiness,
  MapPin,
  TriangleAlert,
];

const featuredDestinations = [
  "MONASTERIO DE PIEDRA",
  "ALHAMA DE ARAGON",
  "JARABA",
  "ZARAGOZA",
  "MADRID",
  "ATECA",
  "DAROCA",
  "PARACUELLOS DE JILOCA",
  "MALUENDA",
].filter((item) => TARIFAS[item]);

const localizedTaxiPages: Array<{ path: string; lang: LangCode; label: string }> = [
  { path: "/taxi-calatayud/", lang: "es", label: "Español" },
  { path: "/en/taxi-calatayud/", lang: "en", label: "English" },
  { path: "/fr/taxi-calatayud/", lang: "fr", label: "Français" },
  { path: "/ca/taxi-calatayud/", lang: "ca", label: "Català" },
  { path: "/de/taxi-calatayud/", lang: "de", label: "Deutsch" },
  { path: "/it/taxi-calatayud/", lang: "it", label: "Italiano" },
  { path: "/pt/taxi-calatayud/", lang: "pt", label: "Português" },
  { path: "/nl/taxi-calatayud/", lang: "nl", label: "Nederlands" },
  { path: "/ar/taxi-calatayud/", lang: "ar", label: "العربية" },
];

const roadDestinationPlaceholders: Record<LangCode, string> = {
  es: "Destino por confirmar: taller, hotel, estación o ciudad",
  en: "Destination to confirm: garage, hotel, station or city",
  fr: "Destination à confirmer : garage, hôtel, gare ou ville",
  ca: "Destinació per confirmar: taller, hotel, estació o ciutat",
  de: "Ziel noch zu bestätigen: Werkstatt, Hotel, Bahnhof oder Stadt",
  it: "Destinazione da confermare: officina, hotel, stazione o città",
  pt: "Destino a confirmar: oficina, hotel, estação ou cidade",
  nl: "Bestemming te bevestigen: garage, hotel, station of stad",
  ar: "الوجهة للتأكيد: ورشة، فندق، محطة أو مدينة",
};

const festivalCopy: Record<
  LangCode,
  {
    eyebrow: string;
    title: string;
    text: string;
    tags: string[];
    primary: string;
    secondary: string;
  }
> = {
  es: {
    eyebrow: "Fiestas y eventos en Calatayud",
    title: "Taxi para San Roque Calatayud 2026",
    text:
      "Del 13 al 16 de agosto de 2026 Calatayud celebra San Roque. Si vienes de fuera, llegas en tren, sales de un hotel o vas a pueblos y balnearios, reserva taxi con antelación para evitar esperas en horas punta.",
    tags: ["San Roque 13-16 agosto", "Estación y hoteles", "Pueblos y balnearios"],
    primary: "Reservar para fiestas",
    secondary: "Calcular traslado",
  },
  en: {
    eyebrow: "Festivals and events in Calatayud",
    title: "Taxi for San Roque Calatayud 2026",
    text:
      "From 13 to 16 August 2026, Calatayud celebrates San Roque. If you are visiting, arriving by train, staying at a hotel or travelling to villages and spas, book your taxi in advance to avoid peak-time waits.",
    tags: ["San Roque 13-16 August", "Station and hotels", "Villages and spas"],
    primary: "Book for festivals",
    secondary: "Calculate transfer",
  },
  fr: {
    eyebrow: "Fêtes et événements à Calatayud",
    title: "Taxi pour San Roque Calatayud 2026",
    text:
      "Du 13 au 16 août 2026, Calatayud célèbre San Roque. Si vous venez de l'extérieur, arrivez en train, séjournez à l'hôtel ou partez vers les villages et balnéaires, réservez le taxi à l'avance pour éviter l'attente.",
    tags: ["San Roque 13-16 août", "Gare et hôtels", "Villages et balnéaires"],
    primary: "Réserver pour les fêtes",
    secondary: "Calculer le trajet",
  },
  ca: {
    eyebrow: "Festes i esdeveniments a Calatayud",
    title: "Taxi per a San Roque Calatayud 2026",
    text:
      "Del 13 al 16 d'agost de 2026 Calatayud celebra San Roque. Si vens de fora, arribes amb tren, surts d'un hotel o vas a pobles i balnearis, reserva taxi amb antelació per evitar esperes.",
    tags: ["San Roque 13-16 agost", "Estació i hotels", "Pobles i balnearis"],
    primary: "Reservar per festes",
    secondary: "Calcular trasllat",
  },
  de: {
    eyebrow: "Feste und Veranstaltungen in Calatayud",
    title: "Taxi für San Roque Calatayud 2026",
    text:
      "Vom 13. bis 16. August 2026 feiert Calatayud San Roque. Wenn Sie zu Besuch sind, mit dem Zug ankommen, im Hotel wohnen oder in Dörfer und Thermalorte fahren, buchen Sie das Taxi frühzeitig.",
    tags: ["San Roque 13.-16. August", "Bahnhof und Hotels", "Dörfer und Thermalorte"],
    primary: "Für Feste buchen",
    secondary: "Transfer berechnen",
  },
  it: {
    eyebrow: "Feste ed eventi a Calatayud",
    title: "Taxi per San Roque Calatayud 2026",
    text:
      "Dal 13 al 16 agosto 2026 Calatayud celebra San Roque. Se arrivi da fuori, in treno, da un hotel o devi andare verso paesi e terme, prenota il taxi in anticipo per evitare attese.",
    tags: ["San Roque 13-16 agosto", "Stazione e hotel", "Paesi e terme"],
    primary: "Prenota per le feste",
    secondary: "Calcola transfer",
  },
  pt: {
    eyebrow: "Festas e eventos em Calatayud",
    title: "Táxi para San Roque Calatayud 2026",
    text:
      "De 13 a 16 de agosto de 2026, Calatayud celebra San Roque. Se vem de fora, chega de comboio, sai de um hotel ou vai para aldeias e termas, reserve táxi com antecedência para evitar esperas.",
    tags: ["San Roque 13-16 agosto", "Estação e hotéis", "Aldeias e termas"],
    primary: "Reservar para festas",
    secondary: "Calcular transfer",
  },
  nl: {
    eyebrow: "Feesten en evenementen in Calatayud",
    title: "Taxi voor San Roque Calatayud 2026",
    text:
      "Van 13 tot 16 augustus 2026 viert Calatayud San Roque. Komt u van buitenaf, met de trein, vanuit een hotel of reist u naar dorpen en kuuroorden, boek dan vooraf om wachttijden te vermijden.",
    tags: ["San Roque 13-16 augustus", "Station en hotels", "Dorpen en kuuroorden"],
    primary: "Boeken voor feesten",
    secondary: "Transfer berekenen",
  },
  ar: {
    eyebrow: "المهرجانات والفعاليات في كالاتايود",
    title: "تاكسي San Roque Calatayud 2026",
    text:
      "من 13 إلى 16 أغسطس 2026 تحتفل كالاتايود بسان روكي. إذا كنت زائرا أو تصل بالقطار أو من فندق أو تريد الذهاب إلى القرى والمنتجعات، احجز التاكسي مسبقا لتجنب الانتظار.",
    tags: ["San Roque 13-16 أغسطس", "المحطة والفنادق", "القرى والمنتجعات"],
    primary: "الحجز لفترة المهرجان",
    secondary: "حساب الرحلة",
  },
};

const roadPickupPresets: AddressSuggestion[] = [
  {
    label: "E.S. Valdeherrera, Autovía A-2 km 231, Calatayud, Zaragoza, España",
    detail: "A-2 · Referencia cercana para localizar",
    lat: 41.3253,
    lng: -1.6678,
  },
  {
    label: "Ateca salida 218, Autovía A-2, Zaragoza, España",
    detail: "A-2 · Ateca",
    lat: 41.3301,
    lng: -1.7939,
  },
  {
    label: "Ariza, Autovía A-2 km 197, Zaragoza, España",
    detail: "A-2 · Ariza",
    lat: 41.3131,
    lng: -2.0536,
  },
  {
    label: "N-234 cerca de Calatayud, Zaragoza, España",
    detail: "Carretera · Calatayud",
    lat: 41.3377,
    lng: -1.642,
  },
];

const NOMINATIM_CLIENT_BASE_URL = "https://nominatim.openstreetmap.org";
const OSRM_CLIENT_BASE_URL = "https://router.project-osrm.org";

const knownRoutePoints: KnownRoutePoint[] = [
  {
    keys: ["CALATAYUD", "CALATAYUD ZARAGOZA"],
    label: "Calatayud, Zaragoza, España",
    detail: "Municipio · Calatayud · Zaragoza",
    lat: 41.3535,
    lng: -1.6434,
  },
  {
    keys: ["PLAZA DEL FUERTE", "PL DEL FUERTE"],
    label: "Plaza del Fuerte, Calatayud, Zaragoza, España",
    detail: "Punto habitual · Centro de Calatayud",
    lat: 41.3529,
    lng: -1.6431,
  },
  {
    keys: ["ESTACION DE TREN DE CALATAYUD", "RENFE CALATAYUD", "ESTACION CALATAYUD"],
    label: "Estación de tren de Calatayud, Zaragoza, España",
    detail: "Estación AVE · Calatayud",
    lat: 41.3521,
    lng: -1.6395,
  },
  {
    keys: ["HOSPITAL ERNEST LLUCH", "HOSPITAL CALATAYUD"],
    label: "Hospital Ernest Lluch, Calatayud, Zaragoza, España",
    detail: "Hospital · Calatayud",
    lat: 41.3396,
    lng: -1.6515,
  },
  {
    keys: ["MONASTERIO DE PIEDRA", "MONASTERIO PIEDRA"],
    label: "Monasterio de Piedra, Nuévalos, Zaragoza, España",
    detail: "Turismo · Nuévalos",
    lat: 41.1904,
    lng: -1.7822,
  },
  {
    keys: ["NUEVALOS", "NUÉVALOS"],
    label: "Nuévalos, Zaragoza, España",
    detail: "Municipio · Comarca de Calatayud",
    lat: 41.2114,
    lng: -1.7891,
  },
  {
    keys: ["ALHAMA DE ARAGON", "ALHAMA DE ARAGÓN", "BALNEARIO ALHAMA", "TERMAS PALLARES"],
    label: "Alhama de Aragón, Zaragoza, España",
    detail: "Balnearios · Comarca de Calatayud",
    lat: 41.2962,
    lng: -1.8945,
  },
  {
    keys: ["JARABA", "BALNEARIO SICILIA", "BALNEARIO SERON", "BALNEARIO SERÓN"],
    label: "Jaraba, Zaragoza, España",
    detail: "Balnearios · Comarca de Calatayud",
    lat: 41.1906,
    lng: -1.8843,
  },
  {
    keys: ["PARACUELLOS DE JILOCA"],
    label: "Paracuellos de Jiloca, Zaragoza, España",
    detail: "Balnearios · Cerca de Calatayud",
    lat: 41.3137,
    lng: -1.6413,
  },
  {
    keys: ["ATECA"],
    label: "Ateca, Zaragoza, España",
    detail: "Municipio · Comarca de Calatayud",
    lat: 41.3301,
    lng: -1.7939,
  },
  {
    keys: ["MALUENDA"],
    label: "Maluenda, Zaragoza, España",
    detail: "Municipio · Comarca de Calatayud",
    lat: 41.2878,
    lng: -1.6167,
  },
  {
    keys: ["ARIZA"],
    label: "Ariza, Zaragoza, España",
    detail: "Municipio · Comarca de Calatayud",
    lat: 41.3131,
    lng: -2.0536,
  },
  {
    keys: [
      "A2",
      "A-2",
      "A 2",
      "AUTOVIA A2",
      "AUTOVÍA A2",
      "A2 CALATAYUD",
      "A 2 CALATAYUD",
      "AUTOVIA A2 CALATAYUD",
      "AUTOVÍA A2 CALATAYUD",
    ],
    label: "Autovía A-2 cerca de Calatayud, Zaragoza, España",
    detail: "Carretera · Indica km, sentido o referencia visible",
    lat: 41.3253,
    lng: -1.6678,
  },
  {
    keys: ["VALDEHERRERA", "A2 KM 231", "A-2 KM 231"],
    label: "E.S. Valdeherrera, Autovía A-2 km 231, Calatayud, Zaragoza, España",
    detail: "Referencia · A-2 · Calatayud",
    lat: 41.3253,
    lng: -1.6678,
  },
  {
    keys: ["ATECA A2", "ATECA A-2", "SALIDA 218", "LA RUBIA"],
    label: "Ateca salida 218, Autovía A-2, Zaragoza, España",
    detail: "Salida A-2 · Ateca",
    lat: 41.3301,
    lng: -1.7939,
  },
  {
    keys: ["ARIZA A2", "ARIZA A-2", "A2 KM 197", "A-2 KM 197"],
    label: "Ariza, Autovía A-2 km 197, Zaragoza, España",
    detail: "A-2 · Ariza",
    lat: 41.3131,
    lng: -2.0536,
  },
  {
    keys: ["N234 CALATAYUD", "N 234 CALATAYUD", "N-234 CALATAYUD"],
    label: "N-234 cerca de Calatayud, Zaragoza, España",
    detail: "Carretera · Calatayud",
    lat: 41.3377,
    lng: -1.642,
  },
  {
    keys: ["DAROCA"],
    label: "Daroca, Zaragoza, España",
    detail: "Municipio · Zaragoza",
    lat: 41.1146,
    lng: -1.4143,
  },
  {
    keys: ["SORIA"],
    label: "Soria, Soria, España",
    detail: "Ciudad · Castilla y León",
    lat: 41.7666,
    lng: -2.479,
  },
  {
    keys: ["ALMAZAN", "ALMAZÁN"],
    label: "Almazán, Soria, España",
    detail: "Municipio · Soria",
    lat: 41.4865,
    lng: -2.5306,
  },
  {
    keys: ["MEDINACELI"],
    label: "Medinaceli, Soria, España",
    detail: "Municipio · Soria",
    lat: 41.1722,
    lng: -2.4347,
  },
  {
    keys: ["ARCOS DE JALON", "ARCOS DE JALÓN"],
    label: "Arcos de Jalón, Soria, España",
    detail: "Municipio · Soria",
    lat: 41.2153,
    lng: -2.2745,
  },
  {
    keys: ["AGREDA", "ÁGREDA"],
    label: "Ágreda, Soria, España",
    detail: "Municipio · Soria",
    lat: 41.8553,
    lng: -1.9227,
  },
  {
    keys: ["ZARAGOZA", "ZARAGOZA CENTRO"],
    label: "Zaragoza, Zaragoza, España",
    detail: "Ciudad · Zaragoza",
    lat: 41.6488,
    lng: -0.8891,
  },
  {
    keys: ["ESTACION ZARAGOZA DELICIAS", "ZARAGOZA DELICIAS", "DELICIAS ZARAGOZA"],
    label: "Estación Zaragoza-Delicias, Zaragoza, España",
    detail: "Estación · Zaragoza",
    lat: 41.6582,
    lng: -0.9118,
  },
  {
    keys: ["AEROPUERTO DE ZARAGOZA", "AEROPUERTO ZARAGOZA"],
    label: "Aeropuerto de Zaragoza, Zaragoza, España",
    detail: "Aeropuerto · Zaragoza",
    lat: 41.6662,
    lng: -1.0415,
  },
  {
    keys: ["MADRID"],
    label: "Madrid, Madrid, España",
    detail: "Ciudad · Madrid",
    lat: 40.4168,
    lng: -3.7038,
  },
];

const CALATAYUD_SERVICE_BASE: RoutePoint = {
  label: "Calatayud, Zaragoza, España",
  lat: 41.3535,
  lng: -1.6434,
};
const CALATAYUD_BASE_RADIUS_KM = 3.5;

const exactRoutePointKeys = new Set([
  "A2",
  "A-2",
  "A 2",
  "AUTOVIA A2",
  "AUTOVÍA A2",
]);

const tariffEntries = Object.entries(TARIFAS).sort(([a], [b]) =>
  a.localeCompare(b, "es"),
);

const destinationAliases = new Map(
  [
    ["AEROPUERTO DE ZARAGOZA", "ZARAGOZA"],
    ["ESTACION DELICIAS", "ZARAGOZA"],
    ["ESTACIÓN DELICIAS", "ZARAGOZA"],
    ["ZARAGOZA DELICIAS", "ZARAGOZA"],
    ["MONASTERIO", "MONASTERIO DE PIEDRA"],
    ["NUEVALOS MONASTERIO", "MONASTERIO DE PIEDRA"],
    ["BALNEARIO ALHAMA", "ALHAMA DE ARAGON"],
    ["BALNEARIO JARABA", "JARABA"],
  ].map(([alias, key]) => [normalize(alias), key]),
);

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .toUpperCase()
    .trim();
}

function isRoadDestinationDraft(value: string) {
  const q = normalize(value);
  return (
    q === "PUNTO SEGURO O DESTINO POR CONFIRMAR" ||
    q === "DESTINO POR CONFIRMAR" ||
    (q.includes("PUNTO SEGURO") && q.includes("DESTINO")) ||
    (q.includes("DESTINO") && q.includes("CONFIRMAR"))
  );
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\p{L}/gu, (char) => char.toUpperCase())
    .replace(/\b(De|Del|La|Las|Los|Y)\b/g, (word) => word.toLowerCase());
}

function displayName(key: string) {
  return DISPLAY_NAMES[key] ?? titleCase(key);
}

function euro(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}

function roundKm(value: number) {
  return Math.max(0, Math.round(value * 10) / 10);
}

function localDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isHoliday(value: string) {
  if (!value) return false;
  const date = localDate(value);
  return (
    date.getDay() === 0 ||
    HOLIDAYS_2026.has(value) ||
    FIXED_HOLIDAYS_MMDD.has(value.slice(5))
  );
}

function isNight(hourValue: string) {
  if (!hourValue) return false;
  const hour = Number(hourValue.split(":")[0]);
  return hour >= 22 || hour < 6;
}

function tariffInfo(date: string, hour: string, language: LangCode = "es") {
  const night = isNight(hour);
  const holiday = isHoliday(date);
  const premium = night || holiday;
  const copy = GLOBAL_COPY[language].route;
  const reasons = [];

  if (night) reasons.push(copy.night);
  if (holiday) reasons.push(copy.holiday);

  return {
    premium,
    rate: premium ? RATES.nightRate : RATES.dayRate,
    waitRate: premium ? RATES.nightWaitRate : RATES.dayWaitRate,
    label: premium ? copy.premiumLabel : copy.dayLabel,
    reason: reasons.length ? reasons.join(" · ") : copy.businessDay,
  };
}

function priceFromKm(km: number, premium: boolean, waitMinutes = 0) {
  return priceFromServiceKm(km * RATES.returnFactor, premium, waitMinutes);
}

function priceFromServiceKm(km: number, premium: boolean, waitMinutes = 0) {
  const rate = premium ? RATES.nightRate : RATES.dayRate;
  const waitRate = premium ? RATES.nightWaitRate : RATES.dayWaitRate;
  const waitingPrice = (Math.max(0, waitMinutes) / 60) * waitRate;
  return km * rate + waitingPrice;
}

function formatKm(value: number) {
  return value.toString().replace(".", ",");
}

function withSpain(value: string) {
  const clean = value.trim();
  if (!clean) return "";
  return /spain|españa/i.test(clean) ? clean : `${clean}, España`;
}

function displayRouteLabel(label: string) {
  const ignoredParts = new Set(["ARAGON", "COMUNIDAD DE CALATAYUD"]);
  const cleanParts: string[] = [];
  const seen = new Set<string>();

  String(label || "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/^\d{5}$/.test(part))
    .filter((part) => !ignoredParts.has(normalize(part)))
    .forEach((part) => {
      const key = normalize(part);
      if (seen.has(key)) return;
      seen.add(key);
      cleanParts.push(part);
    });

  return cleanParts
    .join(", ")
    .replace(/,\s*Aragón,\s*España$/i, ", Zaragoza, España")
    .replace(/^Calatayud,\s*España$/i, "Calatayud, Zaragoza, España")
    .replace(/^Calatayud,\s*Aragón/i, "Calatayud, Zaragoza");
}

function dateLabel(value: string, language: LangCode = "es") {
  if (!value) return GLOBAL_COPY[language].route.dateEmpty;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function detectLanguage(): LangCode {
  if (typeof navigator === "undefined") return "es";
  const pathLanguage = languageFromPathname(window.location.pathname);
  if (pathLanguage) return pathLanguage;

  try {
    const saved = window.localStorage.getItem("taxiayud-language");
    if (saved && saved in LANGUAGE_OPTIONS) return saved as LangCode;
  } catch {
    // Ignore storage errors in private browsing.
  }

  const preferred = navigator.languages?.[0] || navigator.language || "es";
  const language = preferred.toLowerCase();

  if (language.startsWith("es")) return "es";
  if (language.startsWith("ca")) return "ca";
  if (language.startsWith("fr")) return "fr";
  if (language.startsWith("de")) return "de";
  if (language.startsWith("it")) return "it";
  if (language.startsWith("pt")) return "pt";
  if (language.startsWith("nl")) return "nl";
  if (language.startsWith("ar")) return "ar";
  return "en";
}

function languageFromPathname(pathname: string): LangCode | null {
  const match = pathname.match(/^\/(en|fr|ca|de|it|pt|nl|ar)(?:\/|$)/);
  return match?.[1] && match[1] in LANGUAGE_OPTIONS ? (match[1] as LangCode) : null;
}

function cleanPathname(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return `${pathname.replace(/\/+$/, "")}/`;
}

function activeSeoPage() {
  if (typeof window === "undefined") return null;
  const pathname = cleanPathname(window.location.pathname);
  return SEO_PAGES.find((page) => page.path !== "/" && page.path === pathname) ?? null;
}

function localizedTaxiPathForLanguage(language: LangCode) {
  return localizedTaxiPages.find((page) => page.lang === language)?.path;
}

function isLocalizedTaxiPath(pathname: string) {
  const clean = cleanPathname(pathname);
  return localizedTaxiPages.some((page) => page.path === clean);
}

function pageFromPath(path: string) {
  return SEO_PAGES.find((page) => page.path === path);
}

function languageNotice(language: LangCode) {
  return `🌐 Idioma del cliente / Customer language: ${LANGUAGE_OPTIONS[language].whatsapp}`;
}

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

function currentHour() {
  return new Date().toTimeString().slice(0, 5);
}

function isCalatayudOrigin(value: string) {
  const normalized = normalize(value);
  return (
    !normalized ||
    normalized.includes("CALATAYUD") ||
    normalized.includes("PL DEL FUERTE") ||
    normalized.includes("PLAZA DEL FUERTE")
  );
}

function destinationKeyFromInput(value: string) {
  const normalized = normalize(value);
  if (!normalized) return null;

  const alias = destinationAliases.get(normalized);
  if (alias) return alias;

  const exact = tariffEntries.find(
    ([key]) => normalize(key) === normalized || normalize(displayName(key)) === normalized,
  );
  if (exact) return exact[0];

  const labelMatch = tariffEntries.find(([key]) => {
    const keyName = normalize(key);
    const display = normalize(displayName(key));

    return (
      normalized.startsWith(`${keyName} `) ||
      normalized.startsWith(`${display} `) ||
      normalized.includes(` ${keyName} `) ||
      normalized.includes(` ${display} `) ||
      normalized.endsWith(` ${keyName}`) ||
      normalized.endsWith(` ${display}`)
    );
  });
  if (labelMatch) return labelMatch[0];

  return (
    tariffEntries.find(
      ([key]) =>
        normalize(key).includes(normalized) || normalize(displayName(key)).includes(normalized),
    )?.[0] ?? null
  );
}

function makeResultForKey(key: string, input: ResultInput): Result {
  const tariff = TARIFAS[key];
  const language = input.language ?? "es";
  const info = tariffInfo(input.date, input.hour, language);
  const waitMinutes = Math.max(0, input.waitMinutes || 0);
  const waitPrice = (waitMinutes / 60) * info.waitRate;

  return {
    origin: input.origin.trim() || "Calatayud",
    destination: displayName(key),
    destinationKey: key,
    km: tariff.km,
    waitMinutes,
    waitPrice,
    price: priceFromKm(tariff.km, info.premium, waitMinutes),
    tariffLabel: info.label,
    reason: info.reason,
    dateLabel: dateLabel(input.date, language),
    hour: input.hour,
    passengers: input.passengers,
    mode: input.mode,
  };
}

function makeReverseResultForKey(key: string, input: ResultInput, destination: string): Result {
  const result = makeResultForKey(key, input);
  const language = input.language ?? "es";

  return {
    ...result,
    origin: displayName(key),
    destination: destination.trim() || "Calatayud",
    reason: `${result.reason} · ${GLOBAL_COPY[language].route.habitual}`,
  };
}

function makeResultFromExactRoute(
  route: ExactRouteResponse,
  input: ResultInput,
  destination: string,
): Result {
  const language = input.language ?? "es";
  const routeCopy = GLOBAL_COPY[language].route;
  const info = tariffInfo(input.date, input.hour, language);
  const waitMinutes = Math.max(0, input.waitMinutes || 0);
  const waitPrice = (waitMinutes / 60) * info.waitRate;
  const km = roundKm(route.km);
  const needsBaseCalculation =
    Boolean(route.baseAdjusted) ||
    shouldCalculateFromCalatayudBase(
      route.originPoint,
      route.destinationPoint,
      route.originLabel || input.origin,
      route.destinationLabel || destination,
    );
  let serviceKm = route.billableKm ? roundKm(route.billableKm) : 0;

  if (needsBaseCalculation && (!serviceKm || serviceKm < km)) {
    try {
      if (route.originPoint && route.destinationPoint) {
        serviceKm = estimateDrivingRouteThrough([
          CALATAYUD_SERVICE_BASE,
          route.originPoint,
          route.destinationPoint,
          CALATAYUD_SERVICE_BASE,
        ]).km;
      }
    } catch {
      serviceKm = 0;
    }
  }

  const routeReason = route.approximate ? routeCopy.estimated : routeCopy.calculated;
  const price =
    needsBaseCalculation && serviceKm
      ? priceFromServiceKm(Math.max(km, serviceKm), info.premium, waitMinutes)
      : priceFromKm(km, info.premium, waitMinutes);

  return {
    origin: route.originLabel || input.origin.trim() || routeCopy.originFallback,
    destination: route.destinationLabel || destination.trim() || routeCopy.destinationFallback,
    destinationKey: "RUTA_EXACTA",
    km,
    waitMinutes,
    waitPrice,
    price,
    tariffLabel: info.label,
    reason: `${info.reason} · ${routeReason}`,
    dateLabel: dateLabel(input.date, language),
    hour: input.hour,
    passengers: input.passengers,
    mode: input.mode,
  };
}

async function fetchExactRoute(
  origin: string,
  destination: string,
  originPoint?: AddressSuggestion | null,
  destinationPoint?: AddressSuggestion | null,
) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ origin, destination, originPoint, destinationPoint }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.km) {
      throw new Error(data?.message || "No se pudo calcular la ruta exacta.");
    }

    return data as ExactRouteResponse;
  } catch {
    return fetchBrowserExactRoute(origin, destination, originPoint, destinationPoint);
  } finally {
    window.clearTimeout(timeout);
  }
}

function friendlyRouteError(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;

  if (
    /load failed|failed to fetch|networkerror|calculador automatico|localizar|encontr[oó]|direccion|dirección|ruta|mapas|suficientemente clara|distancia/i.test(
      error.message,
    )
  ) {
    return fallback;
  }

  return error.message || fallback;
}

function compactClientDetail(item: Record<string, unknown>) {
  const address = (item.address || {}) as Record<string, string | undefined>;
  const province =
    address.state_district ||
    address.province ||
    (String(address.state || "").toLowerCase() === "aragón" ? "Zaragoza" : address.state) ||
    address.county;
  const town =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.locality;
  const parts = [
    item.type,
    [address.road, address.house_number].filter(Boolean).join(" "),
    address.postcode,
    town,
    province,
  ]
    .filter(Boolean)
    .filter((part) => !["ARAGON", "COMUNIDAD DE CALATAYUD"].includes(normalize(String(part))))
    .map((part) => String(part));

  return [...new Set(parts)].join(" · ");
}

function uniqueAddressSuggestions(items: AddressSuggestion[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = normalize(item.label);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function knownRoutePoint(value: string): RoutePoint | null {
  const q = normalize(value);
  if (!q) return null;

  const point = knownRoutePoints.find((item) => {
    const label = normalize(item.label);

    return (
      label === q ||
      label.includes(q) ||
      item.keys.some((key) => {
        const normalizedKey = normalize(key);
        if (exactRoutePointKeys.has(normalizedKey)) return q === normalizedKey;
        return q === normalizedKey || q.includes(normalizedKey);
      })
    );
  });

  return point && Number.isFinite(point.lat) && Number.isFinite(point.lng)
    ? { label: point.label, lat: Number(point.lat), lng: Number(point.lng) }
    : null;
}

function pointFromSuggestion(suggestion: AddressSuggestion | null | undefined, fallback: string) {
  const lat = Number(suggestion?.lat);
  const lng = Number(suggestion?.lng);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return {
      label: suggestion?.label || fallback,
      lat,
      lng,
    };
  }

  return knownRoutePoint(fallback);
}

async function fetchClientJson(url: string, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error("El servicio de mapas no respondió correctamente.");
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

function haversineKm(origin: RoutePoint, destination: RoutePoint) {
  const earthRadiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latDelta = toRadians(destination.lat - origin.lat);
  const lngDelta = toRadians(destination.lng - origin.lng);
  const originLat = toRadians(origin.lat);
  const destinationLat = toRadians(destination.lat);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(originLat) * Math.cos(destinationLat) * Math.sin(lngDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isCalatayudServicePoint(point: RoutePoint | null | undefined, label = "") {
  const normalizedLabel = normalize(`${label} ${point?.label ?? ""}`);

  if (
    normalizedLabel.includes("CALATAYUD") ||
    normalizedLabel.includes("PL DEL FUERTE") ||
    normalizedLabel.includes("PLAZA DEL FUERTE")
  ) {
    return true;
  }

  if (!point) return false;

  const lat = Number(point.lat);
  const lng = Number(point.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;

  return haversineKm(CALATAYUD_SERVICE_BASE, { label: point.label, lat, lng }) <= CALATAYUD_BASE_RADIUS_KM;
}

function shouldCalculateFromCalatayudBase(
  originPoint: RoutePoint | null | undefined,
  destinationPoint: RoutePoint | null | undefined,
  originLabel = "",
  destinationLabel = "",
) {
  return (
    !isCalatayudServicePoint(originPoint, originLabel) &&
    !isCalatayudServicePoint(destinationPoint, destinationLabel)
  );
}

function estimateDrivingRoute(origin: RoutePoint, destination: RoutePoint): ExactRouteResponse {
  const directKm = haversineKm(origin, destination);

  if (!Number.isFinite(directKm) || directKm <= 0) {
    throw new Error("No se pudo estimar la distancia entre las direcciones.");
  }

  const correction = directKm < 12 ? 1.35 : directKm < 60 ? 1.27 : 1.23;
  const minimumBuffer = directKm < 12 ? 1.8 : 4;
  const km = Math.round(Math.max(directKm * correction, directKm + minimumBuffer) * 10) / 10;

  return {
    km,
    durationMinutes: Math.round((km / 68) * 60),
    originLabel: origin.label,
    destinationLabel: destination.label,
    approximate: true,
    provider: "estimated-distance",
  };
}

function estimateDrivingRouteThrough(points: RoutePoint[]): ExactRouteResponse {
  const km = points.slice(1).reduce((total, point, index) => {
    return total + estimateDrivingRoute(points[index], point).km;
  }, 0);
  const rounded = roundKm(km);

  return {
    km: rounded,
    durationMinutes: Math.round((rounded / 68) * 60),
    approximate: true,
    provider: "estimated-service-distance",
  };
}

async function geocodeInBrowser(value: string, suggestion?: AddressSuggestion | null) {
  const directPoint = pointFromSuggestion(suggestion, value);
  if (directPoint) return directPoint;

  const params = new URLSearchParams({
    q: withSpain(value),
    format: "jsonv2",
    limit: "5",
    countrycodes: "es",
    addressdetails: "1",
    "accept-language": "es",
  });
  const data = await fetchClientJson(`${NOMINATIM_CLIENT_BASE_URL}/search?${params}`);
  const item = (Array.isArray(data) ? data : []).find((entry) => entry?.lat && entry?.lon);

  if (!item) {
    throw new Error("No se encontró una dirección suficientemente clara.");
  }

  return {
    label: displayRouteLabel(item.display_name || value),
    lat: Number(item.lat),
    lng: Number(item.lon),
  };
}

async function fetchOsrmDrivingRoute(points: RoutePoint[]): Promise<ExactRouteResponse> {
  const coordinates = points.map((point) => `${point.lng},${point.lat}`).join(";");
  const params = new URLSearchParams({
    overview: "false",
    alternatives: "false",
    steps: "false",
  });
  const data = await fetchClientJson(`${OSRM_CLIENT_BASE_URL}/route/v1/driving/${coordinates}?${params}`);
  const route = data?.routes?.[0];

  if (!route?.distance) {
    throw new Error("La ruta no devolvió distancia.");
  }

  return {
    km: roundKm(Number(route.distance) / 1000),
    durationMinutes: route.duration ? Math.round(Number(route.duration) / 60) : undefined,
    provider: "openstreetmap-osrm",
  };
}

async function fetchBrowserExactRoute(
  origin: string,
  destination: string,
  originPoint?: AddressSuggestion | null,
  destinationPoint?: AddressSuggestion | null,
): Promise<ExactRouteResponse> {
  const [resolvedOrigin, resolvedDestination] = await Promise.all([
    geocodeInBrowser(origin, originPoint),
    geocodeInBrowser(destination, destinationPoint),
  ]);
  const baseAdjusted = shouldCalculateFromCalatayudBase(
    resolvedOrigin,
    resolvedDestination,
    origin,
    destination,
  );
  let serviceRoute: ExactRouteResponse | null = null;
  let serviceRouteApproximate = false;

  try {
    const route = await fetchOsrmDrivingRoute([resolvedOrigin, resolvedDestination]);

    if (baseAdjusted) {
      try {
        serviceRoute = await fetchOsrmDrivingRoute([
          CALATAYUD_SERVICE_BASE,
          resolvedOrigin,
          resolvedDestination,
          CALATAYUD_SERVICE_BASE,
        ]);
      } catch {
        serviceRoute = estimateDrivingRouteThrough([
          CALATAYUD_SERVICE_BASE,
          resolvedOrigin,
          resolvedDestination,
          CALATAYUD_SERVICE_BASE,
        ]);
        serviceRouteApproximate = true;
      }
    }

    return {
      ...route,
      originLabel: resolvedOrigin.label,
      destinationLabel: resolvedDestination.label,
      originPoint: resolvedOrigin,
      destinationPoint: resolvedDestination,
      billableKm: serviceRoute?.km,
      baseAdjusted,
      approximate: route.approximate || serviceRouteApproximate || undefined,
    };
  } catch {
    const route = estimateDrivingRoute(resolvedOrigin, resolvedDestination);

    if (baseAdjusted) {
      serviceRoute = estimateDrivingRouteThrough([
        CALATAYUD_SERVICE_BASE,
        resolvedOrigin,
        resolvedDestination,
        CALATAYUD_SERVICE_BASE,
      ]);
    }

    return {
      ...route,
      originLabel: resolvedOrigin.label,
      destinationLabel: resolvedDestination.label,
      originPoint: resolvedOrigin,
      destinationPoint: resolvedDestination,
      billableKm: serviceRoute?.km,
      baseAdjusted,
    };
  }
}

async function fetchBrowserAddressSuggestions(query: string) {
  const local = localAddressMatches(query);
  const params = new URLSearchParams({
    q: withSpain(query),
    format: "jsonv2",
    limit: "8",
    countrycodes: "es",
    addressdetails: "1",
    "accept-language": "es",
  });

  try {
    const data = await fetchClientJson(`${NOMINATIM_CLIENT_BASE_URL}/search?${params}`, 6500);
    const remote = (Array.isArray(data) ? data : [])
      .filter((item) => item?.lat && item?.lon)
      .map((item) => ({
        label: displayRouteLabel(item.display_name || query),
        detail: compactClientDetail(item),
        lat: Number(item.lat),
        lng: Number(item.lon),
      }))
      .slice(0, 6);

    return uniqueAddressSuggestions([...local, ...remote]).slice(0, 6);
  } catch {
    return local;
  }
}

async function fetchAddressSuggestions(query: string) {
  const local = localAddressMatches(query);

  try {
    const response = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
    const data = await response.json().catch(() => null);

    if (response.ok && Array.isArray(data?.suggestions) && data.suggestions.length) {
      return uniqueAddressSuggestions([...local, ...data.suggestions]).slice(0, 6);
    }
  } catch {
    // Browser fallback keeps local preview useful when Vercel functions are not running.
  }

  return fetchBrowserAddressSuggestions(query);
}

async function fetchGoogleReviews() {
  const response = await fetch("/api/reviews");
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.rating || !data?.count) {
    return null;
  }

  return data as ReviewsData;
}

function pinnedReviewItems(items: ReviewItem[] = GOOGLE_REVIEWS.items) {
  const featured = GOOGLE_REVIEWS.items[0];
  const seen = new Set([normalize(`${featured.author} ${featured.text}`)]);
  const rest = items.filter((review) => {
    const key = normalize(`${review.author} ${review.text}`);
    const sameAuthor = normalize(review.author) === normalize(featured.author);
    const sameText = normalize(review.text).startsWith(normalize(featured.text).slice(0, 34));

    if (sameAuthor || sameText || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return [featured, ...rest].slice(0, 10);
}

function localAddressMatches(value: string) {
  const q = normalize(value);
  if (q.length < 2) return [];

  return knownRoutePoints
    .filter((item) => {
      const searchable = normalize([item.label, item.detail, ...item.keys].filter(Boolean).join(" "));
      return searchable.includes(q) && normalize(item.label) !== q;
    })
    .slice(0, 5)
    .map(({ keys: _keys, ...suggestion }) => suggestion);
}

function pickupLocationLine(pickupLocation: PickupLocation, language: LangCode = "es") {
  if (!pickupLocation) return "";
  const labels: Partial<Record<LangCode, string>> = {
    es: "Ubicación exacta de recogida",
    en: "Exact pick-up location",
    fr: "Position exacte de prise en charge",
    ca: "Ubicació exacta de recollida",
    de: "Genauer Abholstandort",
    it: "Posizione esatta di ritiro",
    pt: "Localização exata de recolha",
    nl: "Exacte ophaallocatie",
    ar: "موقع الاستلام الدقيق",
  };
  return `📍 ${labels[language] ?? labels.es}: https://maps.google.com/?q=${pickupLocation.lat.toFixed(
    6,
  )},${pickupLocation.lng.toFixed(6)}`;
}

function pickupLocationSuggestion(
  pickupLocation: PickupLocation,
  language: LangCode = "es",
): AddressSuggestion | null {
  if (!pickupLocation) return null;
  const copy = GLOBAL_COPY[language].location;

  return {
    label: copy.current,
    detail: copy.currentDetail,
    lat: pickupLocation.lat,
    lng: pickupLocation.lng,
  };
}

function whatsappDirectUrl(language: LangCode) {
  const linesByLanguage: Partial<Record<LangCode, string[]>> = {
    es: [
      "👋 Hola Taxi Ayud, ¿estás disponible?",
      "🚕 Quiero reservar un taxi o consultar disponibilidad.",
      "📲 Te paso por aquí los detalles: recogida, hora y destino.",
      "🙏 Gracias.",
    ],
    en: [
      "👋 Hello Taxi Ayud, are you available?",
      "🚕 I would like to book a taxi or check availability.",
      "📲 I will send the pick-up, time and destination details here.",
      "🙏 Thank you.",
    ],
    fr: [
      "👋 Bonjour Taxi Ayud, êtes-vous disponible ?",
      "🚕 Je souhaite réserver un taxi ou vérifier la disponibilité.",
      "📲 J'envoie ici le lieu de prise en charge, l'heure et la destination.",
      "🙏 Merci.",
    ],
    ca: [
      "👋 Hola Taxi Ayud, estàs disponible?",
      "🚕 Voldria reservar un taxi o consultar disponibilitat.",
      "📲 T'envio per aquí la recollida, l'hora i la destinació.",
      "🙏 Gràcies.",
    ],
    de: [
      "👋 Hallo Taxi Ayud, sind Sie verfügbar?",
      "🚕 Ich möchte ein Taxi buchen oder die Verfügbarkeit prüfen.",
      "📲 Ich sende Abholung, Uhrzeit und Ziel hier.",
      "🙏 Danke.",
    ],
    it: [
      "👋 Ciao Taxi Ayud, siete disponibili?",
      "🚕 Vorrei prenotare un taxi o verificare la disponibilità.",
      "📲 Invio qui ritiro, orario e destinazione.",
      "🙏 Grazie.",
    ],
    pt: [
      "👋 Olá Taxi Ayud, está disponível?",
      "🚕 Gostaria de reservar um táxi ou confirmar disponibilidade.",
      "📲 Envio aqui a recolha, hora e destino.",
      "🙏 Obrigado.",
    ],
    nl: [
      "👋 Hallo Taxi Ayud, bent u beschikbaar?",
      "🚕 Ik wil graag een taxi boeken of beschikbaarheid vragen.",
      "📲 Ik stuur ophaalpunt, tijd en bestemming hier.",
      "🙏 Dank u.",
    ],
    ar: [
      "👋 مرحبا Taxi Ayud، هل أنت متاح؟",
      "🚕 أريد حجز تاكسي أو الاستفسار عن التوفر.",
      "📲 سأرسل هنا مكان الاستلام والوقت والوجهة.",
      "🙏 شكرا.",
    ],
  };

  const text = [languageNotice(language), "", ...(linesByLanguage[language] ?? linesByLanguage.en!)].join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function roadAssistanceWhatsappUrl({
  language,
  passengers,
  pickupLocation,
}: {
  language: LangCode;
  passengers: number;
  pickupLocation: PickupLocation;
}) {
  const fallbackLocationLines: Partial<Record<LangCode, string>> = {
    es: "📍 Ubicación: la envío desde WhatsApp o comparto mi ubicación al momento.",
    en: "📍 Location: I will share it from WhatsApp or send my current location now.",
    fr: "📍 Position : je l'envoie depuis WhatsApp ou je partage ma position maintenant.",
    ca: "📍 Ubicació: l'envio des de WhatsApp o comparteixo la ubicació ara.",
    de: "📍 Standort: Ich sende ihn über WhatsApp oder teile jetzt meinen aktuellen Standort.",
    it: "📍 Posizione: la invio da WhatsApp o condivido ora la mia posizione.",
    pt: "📍 Localização: envio pelo WhatsApp ou partilho agora a localização atual.",
    nl: "📍 Locatie: ik deel deze via WhatsApp of stuur nu mijn huidige locatie.",
    ar: "📍 الموقع: سأرسله عبر واتساب أو أشارك موقعي الحالي الآن.",
  };
  const fallbackLocationLine = fallbackLocationLines[language] ?? fallbackLocationLines.es!;
  const locationLine = pickupLocation ? pickupLocationLine(pickupLocation, language) : fallbackLocationLine;
  const linesByLanguage: Partial<Record<LangCode, string[]>> = {
    es: [
      "👋 Hola Taxi Ayud, necesito un taxi para pasajeros por una incidencia en carretera.",
      locationLine,
      `👥 Pasajeros: ${passengers}`,
      "🏁 Destino: Calatayud, taller, hotel, estación o destino por confirmar.",
      "📌 Referencia: carretera, sentido, km aproximado, salida cercana o punto visible.",
      "✅ ¿Me confirmas disponibilidad y precio orientativo?",
      "🙏 Gracias.",
    ],
    en: [
      "👋 Hello Taxi Ayud, I need a passenger taxi due to a roadside incident.",
      locationLine,
      `👥 Passengers: ${passengers}`,
      "🏁 Destination: Calatayud, garage, hotel, station or destination to confirm.",
      "📌 Reference: road, direction, approximate km, nearby exit or visible point.",
      "✅ Can you confirm availability and an indicative price?",
      "🙏 Thank you.",
    ],
    fr: [
      "👋 Bonjour Taxi Ayud, j'ai besoin d'un taxi passagers pour un incident sur route.",
      locationLine,
      `👥 Passagers : ${passengers}`,
      "🏁 Destination : Calatayud, garage, hôtel, gare ou destination à confirmer.",
      "📌 Référence : route, sens, km approximatif, sortie proche ou repère visible.",
      "✅ Pouvez-vous confirmer disponibilité et prix indicatif ?",
      "🙏 Merci.",
    ],
    ca: [
      "👋 Hola Taxi Ayud, necessito un taxi per a passatgers per una incidència en carretera.",
      locationLine,
      `👥 Passatgers: ${passengers}`,
      "🏁 Destinació: Calatayud, taller, hotel, estació o destinació per confirmar.",
      "📌 Referència: carretera, sentit, km aproximat, sortida propera o punt visible.",
      "✅ Em confirmes disponibilitat i preu orientatiu?",
      "🙏 Gràcies.",
    ],
    de: [
      "👋 Hallo Taxi Ayud, ich brauche ein Taxi für Fahrgäste wegen eines Vorfalls auf der Straße.",
      locationLine,
      `👥 Fahrgäste: ${passengers}`,
      "🏁 Ziel: Calatayud, Werkstatt, Hotel, Bahnhof oder noch zu bestätigen.",
      "📌 Referenz: Straße, Fahrtrichtung, ungefährer km, nahe Ausfahrt oder sichtbarer Punkt.",
      "✅ Können Sie Verfügbarkeit und Orientierungspreis bestätigen?",
      "🙏 Danke.",
    ],
    it: [
      "👋 Ciao Taxi Ayud, ho bisogno di un taxi per passeggeri per un incidente su strada.",
      locationLine,
      `👥 Passeggeri: ${passengers}`,
      "🏁 Destinazione: Calatayud, officina, hotel, stazione o destinazione da confermare.",
      "📌 Riferimento: strada, direzione, km approssimativo, uscita vicina o punto visibile.",
      "✅ Potete confermare disponibilità e prezzo indicativo?",
      "🙏 Grazie.",
    ],
    pt: [
      "👋 Olá Taxi Ayud, preciso de um táxi para passageiros por uma incidência na estrada.",
      locationLine,
      `👥 Passageiros: ${passengers}`,
      "🏁 Destino: Calatayud, oficina, hotel, estação ou destino a confirmar.",
      "📌 Referência: estrada, sentido, km aproximado, saída próxima ou ponto visível.",
      "✅ Pode confirmar disponibilidade e preço indicativo?",
      "🙏 Obrigado.",
    ],
    nl: [
      "👋 Hallo Taxi Ayud, ik heb een taxi voor passagiers nodig wegens een incident onderweg.",
      locationLine,
      `👥 Passagiers: ${passengers}`,
      "🏁 Bestemming: Calatayud, garage, hotel, station of nog te bevestigen.",
      "📌 Referentie: weg, rijrichting, geschatte km, nabijgelegen afrit of zichtbaar punt.",
      "✅ Kunt u beschikbaarheid en richtprijs bevestigen?",
      "🙏 Dank u.",
    ],
    ar: [
      "👋 مرحبا Taxi Ayud، أحتاج إلى تاكسي للركاب بسبب مشكلة على الطريق.",
      locationLine,
      `👥 عدد الركاب: ${passengers}`,
      "🏁 الوجهة: كالاتايود، ورشة، فندق، محطة أو وجهة للتأكيد.",
      "📌 مرجع الموقع: الطريق والاتجاه والكيلومتر التقريبي أو أقرب مخرج أو علامة واضحة.",
      "✅ هل يمكنك تأكيد التوفر والسعر التقريبي؟",
      "🙏 شكرا.",
    ],
  };
  const text = [
    languageNotice(language),
    "",
    ...(linesByLanguage[language] ?? linesByLanguage.es!),
  ].join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function isRoadAssistanceNote(value: string) {
  const normalized = normalize(value);
  if (!normalized) return false;

  return Object.values(GLOBAL_COPY).some(({ location }) => {
    const note = normalize(location.roadNotes);
    return Boolean(note) && (normalized === note || normalized.includes(note) || note.includes(normalized));
  });
}

function cleanWhatsappNotes(notes: string, language: LangCode) {
  const trimmed = notes.trim();
  if (!trimmed) return "";
  return isRoadAssistanceNote(trimmed) ? GLOBAL_COPY[language].location.roadNotes : trimmed;
}

function whatsappUrl(options: WhatsAppOptions, language: LangCode) {
  const globalCopy = GLOBAL_COPY[language];
  const destination =
    options.result?.destination || options.destination.trim() || globalCopy.route.destinationFallback;
  const origin = options.result?.origin || options.origin.trim() || globalCopy.route.originFallback;
  const whatsappCopies = {
    es: {
      hello: "Hola Taxi Ayud, quiero reservar un taxi.",
      now: "Tipo: taxi ahora / disponibilidad inmediata",
      later: `Fecha y hora: ${dateLabel(options.date, language)} a las ${options.hour}h`,
      origin: "Origen",
      destination: "Destino",
      passengers: "Pasajeros",
      notes: "Notas",
      distance: "Distancia estimada",
      wait: "Espera",
      price: "Precio orientativo",
      fare: "Tarifa",
      priceNotice:
        "💶 Precio orientativo sujeto a confirmación directa según disponibilidad, ruta final, horario, espera y suplementos oficiales.",
      askPrice: "📩 Solicito disponibilidad y presupuesto orientativo para este trayecto.",
      notCalculated:
        "🚕 Te envío los datos para que Taxi Ayud confirme disponibilidad, precio orientativo y detalles del servicio.",
      confirm: "¿Me confirmas disponibilidad?",
      thanks: "Gracias.",
    },
    en: {
      hello: "Hello Taxi Ayud, I would like to book a taxi.",
      now: "Type: taxi now / immediate availability",
      later: `Date and time: ${dateLabel(options.date, language)} at ${options.hour}`,
      origin: "Origin",
      destination: "Destination",
      passengers: "Passengers",
      notes: "Notes",
      distance: "Estimated distance",
      wait: "Wait",
      price: "Estimated price",
      fare: "Fare",
      priceNotice:
        "💶 Indicative price subject to direct confirmation depending on availability, final route, time, waiting time and official supplements.",
      askPrice: "📩 I would like availability and an indicative quote for this trip.",
      notCalculated:
        "🚕 I am sending the trip details so Taxi Ayud can confirm availability, indicative price and service details.",
      confirm: "Can you confirm availability?",
      thanks: "Thank you.",
    },
    fr: {
      hello: "Bonjour Taxi Ayud, je souhaite réserver un taxi.",
      now: "Type : taxi maintenant / disponibilité immédiate",
      later: `Date et heure : ${dateLabel(options.date, language)} à ${options.hour}`,
      origin: "Départ",
      destination: "Destination",
      passengers: "Passagers",
      notes: "Notes",
      distance: "Distance estimée",
      wait: "Attente",
      price: "Prix estimé",
      fare: "Tarif",
      priceNotice:
        "💶 Prix indicatif soumis à confirmation directe selon disponibilité, itinéraire final, horaire, attente et suppléments officiels.",
      askPrice: "📩 Je souhaite disponibilité et devis indicatif pour ce trajet.",
      notCalculated:
        "🚕 J'envoie les détails du trajet pour que Taxi Ayud confirme disponibilité, prix indicatif et détails du service.",
      confirm: "Pouvez-vous confirmer la disponibilité ?",
      thanks: "Merci.",
    },
    ca: {
      hello: "Hola Taxi Ayud, vull reservar un taxi.",
      now: "Tipus: taxi ara / disponibilitat immediata",
      later: `Data i hora: ${dateLabel(options.date, language)} a les ${options.hour}h`,
      origin: "Origen",
      destination: "Destinació",
      passengers: "Passatgers",
      notes: "Notes",
      distance: "Distància estimada",
      wait: "Espera",
      price: "Preu orientatiu",
      fare: "Tarifa",
      priceNotice:
        "💶 Preu orientatiu subjecte a confirmació directa segons disponibilitat, ruta final, horari, espera i suplements oficials.",
      askPrice: "📩 Sol·licito disponibilitat i pressupost orientatiu per a aquest trajecte.",
      notCalculated:
        "🚕 Envio les dades del trajecte perquè Taxi Ayud confirmi disponibilitat, preu orientatiu i detalls del servei.",
      confirm: "Em confirmes disponibilitat?",
      thanks: "Gràcies.",
    },
    de: {
      hello: "Hallo Taxi Ayud, ich möchte ein Taxi buchen.",
      now: "Art: Taxi jetzt / sofortige Verfügbarkeit",
      later: `Datum und Uhrzeit: ${dateLabel(options.date, language)} um ${options.hour}`,
      origin: "Abfahrt",
      destination: "Ziel",
      passengers: "Fahrgäste",
      notes: "Hinweise",
      distance: "Geschätzte Entfernung",
      wait: "Wartezeit",
      price: "Geschätzter Preis",
      fare: "Tarif",
      priceNotice:
        "💶 Orientierungspreis vorbehaltlich direkter Bestätigung je nach Verfügbarkeit, endgültiger Route, Uhrzeit, Wartezeit und offiziellen Zuschlägen.",
      askPrice: "📩 Ich möchte Verfügbarkeit und einen Orientierungspreis für diese Fahrt.",
      notCalculated:
        "🚕 Ich sende die Fahrtdaten, damit Taxi Ayud Verfügbarkeit, Orientierungspreis und Servicedetails bestätigen kann.",
      confirm: "Können Sie die Verfügbarkeit bestätigen?",
      thanks: "Danke.",
    },
    it: {
      hello: "Ciao Taxi Ayud, vorrei prenotare un taxi.",
      now: "Tipo: taxi ora / disponibilità immediata",
      later: `Data e ora: ${dateLabel(options.date, language)} alle ${options.hour}`,
      origin: "Origine",
      destination: "Destinazione",
      passengers: "Passeggeri",
      notes: "Note",
      distance: "Distanza stimata",
      wait: "Attesa",
      price: "Prezzo stimato",
      fare: "Tariffa",
      priceNotice:
        "💶 Prezzo indicativo soggetto a conferma diretta in base a disponibilità, percorso finale, orario, attesa e supplementi ufficiali.",
      askPrice: "📩 Vorrei disponibilità e preventivo indicativo per questo viaggio.",
      notCalculated:
        "🚕 Invio i dati del viaggio così Taxi Ayud può confermare disponibilità, prezzo indicativo e dettagli del servizio.",
      confirm: "Potete confermare la disponibilità?",
      thanks: "Grazie.",
    },
    pt: {
      hello: "Olá Taxi Ayud, gostaria de reservar um táxi.",
      now: "Tipo: táxi agora / disponibilidade imediata",
      later: `Data e hora: ${dateLabel(options.date, language)} às ${options.hour}`,
      origin: "Origem",
      destination: "Destino",
      passengers: "Passageiros",
      notes: "Notas",
      distance: "Distância estimada",
      wait: "Espera",
      price: "Preço estimado",
      fare: "Tarifa",
      priceNotice:
        "💶 Preço indicativo sujeito a confirmação direta conforme disponibilidade, rota final, horário, espera e suplementos oficiais.",
      askPrice: "📩 Solicito disponibilidade e orçamento indicativo para esta viagem.",
      notCalculated:
        "🚕 Envio os dados da viagem para que Taxi Ayud confirme disponibilidade, preço indicativo e detalhes do serviço.",
      confirm: "Pode confirmar disponibilidade?",
      thanks: "Obrigado.",
    },
    nl: {
      hello: "Hallo Taxi Ayud, ik wil graag een taxi boeken.",
      now: "Type: taxi nu / direct beschikbaar",
      later: `Datum en tijd: ${dateLabel(options.date, language)} om ${options.hour}`,
      origin: "Vertrek",
      destination: "Bestemming",
      passengers: "Passagiers",
      notes: "Opmerkingen",
      distance: "Geschatte afstand",
      wait: "Wachttijd",
      price: "Geschatte prijs",
      fare: "Tarief",
      priceNotice:
        "💶 Richtprijs onder voorbehoud van directe bevestiging, afhankelijk van beschikbaarheid, definitieve route, tijd, wachttijd en officiële toeslagen.",
      askPrice: "📩 Ik wil graag beschikbaarheid en een richtprijs voor deze rit.",
      notCalculated:
        "🚕 Ik stuur de ritgegevens zodat Taxi Ayud beschikbaarheid, richtprijs en servicedetails kan bevestigen.",
      confirm: "Kunt u de beschikbaarheid bevestigen?",
      thanks: "Dank u.",
    },
    ar: {
      hello: "مرحبا Taxi Ayud، أريد حجز تاكسي.",
      now: "النوع: تاكسي الآن / توفر فوري",
      later: `التاريخ والوقت: ${dateLabel(options.date, language)} الساعة ${options.hour}`,
      origin: "نقطة الانطلاق",
      destination: "الوجهة",
      passengers: "الركاب",
      notes: "ملاحظات",
      distance: "المسافة التقديرية",
      wait: "انتظار",
      price: "السعر التقديري",
      fare: "التعرفة",
      priceNotice: "💶 السعر تقديري ويخضع للتأكيد المباشر حسب التوفر والمسار النهائي والوقت والانتظار والرسوم الرسمية.",
      askPrice: "📩 أريد معرفة التوفر والسعر التقريبي لهذه الرحلة.",
      notCalculated: "🚕 أرسل تفاصيل الرحلة حتى يؤكد Taxi Ayud التوفر والسعر التقديري وتفاصيل الخدمة.",
      confirm: "هل يمكنك تأكيد التوفر؟",
      thanks: "شكرا.",
    },
  };
  const whatsappCopy = whatsappCopies[language] ?? whatsappCopies.en;
  const modeLine = options.mode === "now" ? whatsappCopy.now : whatsappCopy.later;
  const locationLine = pickupLocationLine(options.pickupLocation, language);
  const cleanNotes = cleanWhatsappNotes(options.notes, language);
  const notesLine = cleanNotes ? `📝 ${whatsappCopy.notes}: ${cleanNotes}` : "";

  const priceLines = options.result
    ? [
        `🛣️ ${whatsappCopy.distance}: ${formatKm(options.result.km)} km`,
        options.result.waitMinutes
          ? `⏱️ ${whatsappCopy.wait}: ${options.result.waitMinutes} min (${euro(options.result.waitPrice)})`
          : "",
        `💶 ${whatsappCopy.price}: ${euro(options.result.price)}`,
        `📋 ${whatsappCopy.fare}: ${options.result.tariffLabel}`,
        whatsappCopy.priceNotice,
      ].filter(Boolean)
    : [
        whatsappCopy.askPrice,
      ];

  const text = [
    languageNotice(language),
    "",
    `👋 ${whatsappCopy.hello}`,
    "",
    `🕒 ${modeLine}`,
    `📍 ${whatsappCopy.origin}: ${origin}`,
    `🏁 ${whatsappCopy.destination}: ${destination}`,
    `👥 ${whatsappCopy.passengers}: ${options.result?.passengers ?? options.passengers}`,
    locationLine,
    notesLine,
    "",
    ...priceLines,
    "",
    `✅ ${whatsappCopy.confirm}`,
    `🙏 ${whatsappCopy.thanks}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function relatedSeoPages(currentPath: string | null) {
  return DEFAULT_SEO_LINKS
    .map(pageFromPath)
    .filter((page): page is SeoPage => page !== undefined && page.path !== currentPath)
    .slice(0, 12);
}

function SeoIntentSection({
  page,
  directUrl,
  language,
}: {
  page: SeoPage;
  directUrl: string;
  language: LangCode;
}) {
  const relatedPages = relatedSeoPages(page.path);
  const global = GLOBAL_COPY[language];

  return (
    <section className="intent-section" aria-label={page.h1} data-animate>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Taxi Ayud</a>
        <ArrowRight aria-hidden="true" />
        <span>{page.breadcrumb}</span>
      </nav>
      <div className="intent-layout">
        <div className="intent-copy">
          <p className="eyebrow compact">
            <MapPinned aria-hidden="true" />
            {page.eyebrow}
          </p>
          <h2>{page.h2}</h2>
          <p>{page.body}</p>
          <div className="intent-actions">
            <a
              className="btn btn-whatsapp"
              href={directUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("clic_whatsapp", { source: "seo_page" })}
            >
              <Send aria-hidden="true" />
              {global.reserveWhatsapp}
            </a>
            <a
              className="btn btn-secondary"
              href={CONTACT.phoneHref}
              onClick={() => trackEvent("clic_llamada", { source: "seo_page" })}
            >
              <Phone aria-hidden="true" />
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="intent-cards">
          {page.sections.map((section) => (
            <article key={section.heading}>
              <CheckCircle2 aria-hidden="true" />
              <h3>{section.heading}</h3>
              <p>{section.text}</p>
            </article>
          ))}
        </div>
      </div>
      {page.faq.length ? (
        <div className="intent-faq">
          {page.faq.slice(0, 5).map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      ) : null}
      <div className="internal-links" aria-label={global.aria.relatedLinks}>
        {relatedPages.map((relatedPage) => (
          <a href={relatedPage.path} key={relatedPage.path}>
            {relatedPage.navLabel}
          </a>
        ))}
      </div>
    </section>
  );
}

function InternalLinksBand({ language }: { language: LangCode }) {
  const pages = relatedSeoPages(null);
  const ui = UI_COPY[language];
  const global = GLOBAL_COPY[language];

  return (
    <section className="internal-link-band" aria-label={global.aria.internalRoutes} data-animate>
      <p className="eyebrow compact">
        <Route aria-hidden="true" />
        {ui.internalRoutes}
      </p>
      <div>
        {pages.map((page) => (
          <a href={page.path} key={page.path}>
            {page.navLabel}
          </a>
        ))}
      </div>
      <p className="language-link-heading">{ui.otherLanguages}</p>
      <div className="language-link-row" aria-label={global.aria.languageVersions}>
        {localizedTaxiPages.map((page) => (
          <a href={page.path} hrefLang={HTML_LANG[page.lang]} key={page.path}>
            {page.label}
          </a>
        ))}
      </div>
    </section>
  );
}

function RoadWhatsappNotice({
  language,
  onCancel,
  onConfirm,
}: {
  language: LangCode;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const copy = ROAD_WHATSAPP_NOTICE[language];

  return (
    <div className="road-whatsapp-backdrop" role="presentation">
      <section className="road-whatsapp-modal" role="dialog" aria-modal="true" aria-label={copy.aria}>
        <div className="road-modal-heading">
          <span className="road-modal-icon" aria-hidden="true">
            <TriangleAlert />
          </span>
          <div>
            <h2>{copy.title}</h2>
            <p>{copy.text}</p>
          </div>
        </div>
        <ul>
          {copy.points.map((point) => (
            <li key={point}>
              <CheckCircle2 aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="road-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {copy.cancel}
          </button>
          <button type="button" className="btn btn-whatsapp" onClick={onConfirm}>
            <MessageCircle aria-hidden="true" />
            {copy.continue}
          </button>
        </div>
      </section>
    </div>
  );
}

function CookieBanner({
  language,
  onAccept,
  onReject,
}: {
  language: LangCode;
  onAccept: () => void;
  onReject: () => void;
}) {
  const global = GLOBAL_COPY[language];

  return (
    <div className="cookie-banner" role="dialog" aria-label={global.cookie.aria}>
      <div>
        <strong>{global.cookie.title}</strong>
        <p>{global.cookie.text}</p>
        <a href="#privacidad">{global.cookie.privacy}</a>
        <a href="#cookies">{global.cookie.cookies}</a>
      </div>
      <div className="cookie-actions">
        <button type="button" className="btn btn-secondary" onClick={onReject}>
          {global.cookie.necessary}
        </button>
        <button type="button" className="btn btn-primary" onClick={onAccept}>
          {global.cookie.accept}
        </button>
      </div>
    </div>
  );
}

function PaymentLogos({ language }: { language: LangCode }) {
  const [cash, card, bizum = "Bizum", applePay = "Apple Pay", googlePay = "Google Pay"] =
    COPY[language].paymentText.split(" · ");

  return (
    <span className="payment-logos" role="img" aria-label={COPY[language].paymentText}>
      <span className="payment-logo payment-logo-cash" title={cash} aria-hidden="true">
        €
      </span>
      <span className="payment-logo payment-logo-card" title={card} aria-hidden="true">
        <CreditCard aria-hidden="true" />
      </span>
      <span className="payment-logo payment-logo-bizum" title={bizum} aria-hidden="true">
        B
      </span>
      <span className="payment-logo payment-logo-apple" title={applePay} aria-hidden="true">
        
      </span>
      <span className="payment-logo payment-logo-google" title={googlePay} aria-hidden="true">
        G
      </span>
    </span>
  );
}

function LegalFooter({ language }: { language: LangCode }) {
  const global = GLOBAL_COPY[language];

  return (
    <section className="legal-footer" aria-label={global.legal.aria}>
      <details id="aviso-legal">
        <summary>{global.legal.legalTitle}</summary>
        <p>{global.legal.legalText}</p>
      </details>
      <details id="privacidad">
        <summary>{global.legal.privacyTitle}</summary>
        <p>{global.legal.privacyText}</p>
      </details>
      <details id="cookies">
        <summary>{global.legal.cookiesTitle}</summary>
        <p>{global.legal.cookiesText}</p>
      </details>
    </section>
  );
}

function App() {
  const [language, setLanguage] = useState<LangCode>(() => detectLanguage());
  const [cookieConsent, setCookieConsent] = useState<"accepted" | "necessary" | "pending">(() => {
    if (typeof window === "undefined") return "pending";
    const saved = window.localStorage.getItem("taxiayud-cookie-consent");
    return saved === "accepted" || saved === "necessary" ? saved : "pending";
  });
  const [origin, setOrigin] = useState("Calatayud");
  const [query, setQuery] = useState("Monasterio de Piedra");
  const [selectedKey, setSelectedKey] = useState("MONASTERIO DE PIEDRA");
  const [date, setDate] = useState(todayValue());
  const [hour, setHour] = useState(currentHour());
  const [passengers, setPassengers] = useState(1);
  const [bookingMode, setBookingMode] = useState<BookingMode>("later");
  const [waitMinutes, setWaitMinutes] = useState(0);
  const [notes, setNotes] = useState("");
  const [pickupLocation, setPickupLocation] = useState<PickupLocation>(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [activeAddressField, setActiveAddressField] = useState<
    "origin" | "destination" | null
  >(null);
  const [originSuggestions, setOriginSuggestions] = useState<AddressSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedOriginPoint, setSelectedOriginPoint] = useState<AddressSuggestion | null>(null);
  const [selectedDestinationPoint, setSelectedDestinationPoint] =
    useState<AddressSuggestion | null>(null);
  const [pendingRoadWhatsappUrl, setPendingRoadWhatsappUrl] = useState("");
  const [filter, setFilter] = useState("");
  const [tariffLookupKey, setTariffLookupKey] = useState("ZARAGOZA");
  const [result, setResult] = useState<Result | null>(null);
  const [reviews, setReviews] = useState<ReviewsData>(GOOGLE_REVIEWS);
  const t = COPY[language];
  const ui = UI_COPY[language];
  const global = GLOBAL_COPY[language];
  const currentSeoPage = activeSeoPage();
  const heroSeoPage = currentSeoPage ?? HOME_SEO_PAGE;
  const statsLabels = heroStatLabels[language];
  const touristCopy = touristSearchCopy[language];
  const festival = festivalCopy[language];
  const destinationSearchValue = isRoadDestinationDraft(query) ? "" : query;
  const isRoadPickupContext = isRoadAssistanceNote(notes);
  const destinationPlaceholder = isRoadPickupContext
    ? roadDestinationPlaceholders[language]
    : t.destinationPlaceholder;
  const heroStatsLocalized = [
    { value: "24h", label: statsLabels[0] },
    { value: "N.18", label: statsLabels[1] },
    { value: "+100", label: statsLabels[2] },
  ];

  const suggestions = useMemo(() => {
    const q = normalize(destinationSearchValue);
    if (!q) {
      return featuredDestinations.map((key) => [key, TARIFAS[key]] as const);
    }
    return tariffEntries
      .filter(([name]) => !q || normalize(name).includes(q))
      .slice(0, 8);
  }, [destinationSearchValue]);

  const filteredTariffs = useMemo(() => {
    const q = normalize(filter);
    return tariffEntries.filter(([name]) => !q || normalize(name).includes(q));
  }, [filter]);

  const lookupTariff = TARIFAS[tariffLookupKey];
  const activeDestination = destinationSearchValue.trim() || (selectedKey ? displayName(selectedKey) : "");
  const canAutoCalculate =
    Boolean(destinationKeyFromInput(activeDestination)) && isCalatayudOrigin(origin);
  const directUrl = whatsappDirectUrl(language);
  const quoteUrl = whatsappUrl({
    result,
    origin,
    destination: activeDestination,
    date,
    hour,
    passengers,
    mode: bookingMode,
    notes,
    pickupLocation,
  }, language);
  const instantUrl = whatsappUrl({
    result: null,
    origin,
    destination: activeDestination,
    date,
    hour,
    passengers,
    mode: "now",
    notes,
    pickupLocation,
  }, language);
  const roadUrl = roadAssistanceWhatsappUrl({
    language,
    passengers,
    pickupLocation,
  });
  const emptyResultWhatsappUrl = whatsappUrl({
    result: null,
    origin,
    destination: activeDestination,
    date,
    hour,
    passengers,
    mode: bookingMode,
    notes,
    pickupLocation,
  }, language);

  useEffect(() => {
    const page = currentSeoPage ?? HOME_SEO_PAGE;
    const absoluteUrl = `https://www.taxiayud.es${page.path === "/" ? "/" : page.path}`;
    document.title = page.title;

    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = page.description;

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = absoluteUrl;

    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');

    if (ogTitle) ogTitle.content = page.title;
    if (ogDescription) ogDescription.content = page.description;
    if (ogUrl) ogUrl.content = absoluteUrl;
    if (twitterTitle) twitterTitle.content = page.title;
    if (twitterDescription) twitterDescription.content = page.description;
  }, [currentSeoPage]);

  useEffect(() => {
    if (cookieConsent === "accepted") initAnalytics();
  }, [cookieConsent]);

  function saveCookieConsent(value: "accepted" | "necessary") {
    try {
      window.localStorage.setItem("taxiayud-cookie-consent", value);
    } catch {
      // Ignore storage errors in private browsing.
    }
    setCookieConsent(value);
    if (value === "accepted") initAnalytics();
  }

  function changeLanguage(nextLanguage: LangCode) {
    setLanguage(nextLanguage);

    if (!isLocalizedTaxiPath(window.location.pathname)) return;

    const targetPath = localizedTaxiPathForLanguage(nextLanguage);
    if (targetPath && targetPath !== cleanPathname(window.location.pathname)) {
      window.history.pushState({}, "", targetPath);
    }
  }

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language];
    document.documentElement.dir = LANGUAGE_OPTIONS[language].dir;
    try {
      window.localStorage.setItem("taxiayud-language", language);
    } catch {
      // Ignore storage errors in private browsing.
    }
  }, [language]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    document.body.classList.add("motion-ready");
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-animate]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    items.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 35, 220)}ms`);
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
      document.body.classList.remove("motion-ready");
    };
  }, [language, reviews.items.length]);

  useEffect(() => {
    let ignore = false;
    const local = localAddressMatches(origin);
    setOriginSuggestions(local);

    if (origin.trim().length < 3) return undefined;

    const timer = window.setTimeout(() => {
      fetchAddressSuggestions(origin)
        .then((items) => {
          if (!ignore && items.length) setOriginSuggestions(items);
        })
        .catch(() => undefined);
    }, 280);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [origin]);

  useEffect(() => {
    let ignore = false;
    const local = localAddressMatches(destinationSearchValue);
    setDestinationSuggestions(local);

    if (destinationSearchValue.trim().length < 3) return undefined;

    const timer = window.setTimeout(() => {
      fetchAddressSuggestions(destinationSearchValue)
        .then((items) => {
          if (!ignore && items.length) setDestinationSuggestions(items);
        })
        .catch(() => undefined);
    }, 280);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [destinationSearchValue]);

  useEffect(() => {
    let ignore = false;

    fetchGoogleReviews()
      .then((data) => {
        if (!ignore && data) {
          setReviews({
            rating: data.rating,
            count: data.count,
            items: pinnedReviewItems(data.items?.length ? data.items : GOOGLE_REVIEWS.items),
            source: data.source,
          });
        }
      })
      .catch(() => undefined);

    return () => {
      ignore = true;
    };
  }, []);

  function scrollToResult() {
    window.setTimeout(() => {
      document.getElementById("resultado")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  function resultForKey(key: string): Result {
    return makeResultForKey(key, {
      origin,
      date,
      hour,
      passengers,
      waitMinutes,
      mode: bookingMode,
      language,
    });
  }

  function chooseDestination(key: string) {
    setSelectedKey(key);
    setQuery(displayName(key));
    setSelectedDestinationPoint(null);
    setResult(null);
    setRouteError("");
  }

  function chooseAddress(field: "origin" | "destination", item: AddressSuggestion) {
    if (field === "origin") {
      setOrigin(item.label);
      setSelectedOriginPoint(item);
      setOriginSuggestions([]);
    } else {
      setQuery(item.label);
      setSelectedKey("");
      setSelectedDestinationPoint(item);
      setDestinationSuggestions([]);
    }
    setActiveAddressField(null);
    setResult(null);
    setRouteError("");
  }

  function closeAddressSuggestionsSoon() {
    window.setTimeout(() => {
      const activeName = document.activeElement?.getAttribute("name");
      if (activeName === "origin" || activeName === "destination") return;
      setActiveAddressField(null);
    }, 120);
  }

  function passengerSummary(count: number) {
    return t.passengerOptions[count - 1] ?? `${count} ${t.passengers.toLowerCase()}`;
  }

  function selectSearchField(event: React.FocusEvent<HTMLInputElement>) {
    const input = event.currentTarget;

    window.setTimeout(() => {
      input.select();
    }, 0);
  }

  function useLookupDestination(key: string) {
    chooseDestination(key);
    document.getElementById("calculadora")?.scrollIntoView({ behavior: "smooth" });
  }

  function prepareRoadPickup() {
    setBookingMode("now");
    setOrigin(pickupLocation ? global.location.current : global.location.roadFallbackOrigin);
    setQuery("");
    setSelectedKey("");
    setSelectedOriginPoint(null);
    setSelectedDestinationPoint(null);
    setDestinationSuggestions([]);
    setNotes(global.location.roadNotes);
    setResult(null);
    setRouteError("");
    trackEvent("clic_reserva", { source: "road_pickup" });
    document.getElementById("calculadora")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function prepareRoadPreset(preset: AddressSuggestion) {
    setBookingMode("now");
    setOrigin(preset.label);
    setSelectedOriginPoint(preset);
    setQuery("Calatayud");
    setSelectedDestinationPoint({
      label: "Calatayud, Zaragoza, España",
      detail: "Municipio · Calatayud · Zaragoza",
      lat: 41.3535,
      lng: -1.6434,
    });
    setNotes(global.location.roadNotes);
    setResult(null);
    setRouteError("");
    trackEvent("clic_reserva", { source: "road_preset" });
    document.getElementById("calculadora")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function requestRoadPickupLocation() {
    prepareRoadPickup();
    requestPickupLocation();
  }

  function showRoadWhatsappNotice(
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
    source: string,
  ) {
    event.preventDefault();
    trackEvent("clic_whatsapp", { source });
    setPendingRoadWhatsappUrl(url);
  }

  function handleRouteWhatsapp(
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
    source: string,
  ) {
    if (isRoadPickupContext) {
      showRoadWhatsappNotice(event, url, source);
      return;
    }

    trackEvent("clic_whatsapp", { source });
  }

  function confirmRoadWhatsapp() {
    const url = pendingRoadWhatsappUrl;
    setPendingRoadWhatsappUrl("");
    if (url) window.location.href = url;
  }

  async function calculate() {
    const key = destinationKeyFromInput(destinationSearchValue);
    const originKey = destinationKeyFromInput(origin);
    const trimmedOrigin = origin.trim();
    const trimmedDestination = destinationSearchValue.trim();
    const normalizedOrigin = normalize(trimmedOrigin);
    const normalizedCurrentLocation = normalize(global.location.current);
    const sharedOriginPoint =
      pickupLocation &&
      (normalizedOrigin.includes("MI UBICACION ACTUAL") ||
        normalizedOrigin === normalizedCurrentLocation)
        ? pickupLocationSuggestion(pickupLocation, language)
        : null;
    const routeOriginPoint = selectedOriginPoint ?? sharedOriginPoint;

    trackEvent("consulta_tarifa", {
      mode: key && TARIFAS[key] && isCalatayudOrigin(origin) ? "destino_habitual" : "ruta_exacta",
    });
    setRouteError("");

    if (key && TARIFAS[key] && isCalatayudOrigin(origin)) {
      setSelectedKey(key);
      setQuery(displayName(key));
      setResult(resultForKey(key));
      scrollToResult();
      return;
    }

    if (originKey && TARIFAS[originKey] && isCalatayudOrigin(destinationSearchValue)) {
      setSelectedKey(originKey);
      setResult(
        makeReverseResultForKey(originKey, {
          origin: trimmedOrigin,
          date,
          hour,
          passengers,
          waitMinutes,
          mode: bookingMode,
          language,
        }, trimmedDestination || "Calatayud"),
      );
      scrollToResult();
      return;
    }

    if (!trimmedOrigin || !trimmedDestination) {
      setResult(null);
      setRouteError(t.routeMissing);
      scrollToResult();
      return;
    }

    setRouteLoading(true);
    try {
      const route = await fetchExactRoute(
        trimmedOrigin,
        trimmedDestination,
        routeOriginPoint,
        selectedDestinationPoint,
      );
      setResult(
        makeResultFromExactRoute(route, {
          origin: trimmedOrigin,
          date,
          hour,
          passengers,
          waitMinutes,
          mode: bookingMode,
          language,
        }, trimmedDestination),
      );
      scrollToResult();
    } catch (error) {
      setResult(null);
      setRouteError(friendlyRouteError(error, t.routeError));
      scrollToResult();
    } finally {
      setRouteLoading(false);
    }
  }

  function requestPickupLocation() {
    if (!navigator.geolocation) {
      setLocationStatus(global.location.unsupported);
      return;
    }

    setLocationStatus(global.location.requesting);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPickupLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setOrigin(global.location.current);
        setResult(null);
        setLocationStatus(global.location.ready);
      },
      () => {
        setLocationStatus(global.location.failed);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label={global.aria.brandHome}>
          <img src="/assets/logo.webp" alt="" width="520" height="520" />
          <span>
            Taxi <strong>Ayud</strong>
          </span>
        </a>
        <nav className="main-nav" aria-label={global.aria.mainNav}>
          <a
            href={directUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("clic_whatsapp", { source: "header" })}
          >
            {t.nav[0]}
          </a>
          <a href="#calculadora">{t.nav[1]}</a>
          <a href="#resenas">{t.nav[2]}</a>
          <a href="/servicios/">{t.nav[3]}</a>
          <a href="#tarifas">{t.nav[4]}</a>
        </nav>
        <div className="language-switcher">
          <Languages aria-hidden="true" />
          <select
            aria-label={global.aria.language}
            value={language}
            onChange={(event) => changeLanguage(event.target.value as LangCode)}
          >
            {Object.entries(LANGUAGE_OPTIONS).map(([key, option]) => (
              <option value={key} key={key}>
                {option.short}
              </option>
            ))}
          </select>
        </div>
        <a
          className="header-call"
          href={CONTACT.phoneHref}
          onClick={() => trackEvent("clic_llamada", { source: "header" })}
        >
          <Phone aria-hidden="true" />
          {CONTACT.phoneDisplay}
        </a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-media" aria-hidden="true" />
          <div className="hero-car-layer" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">
              <BadgeCheck aria-hidden="true" />
              {currentSeoPage?.eyebrow ?? t.heroEyebrow}
            </p>
            <h1>{heroSeoPage.h1}</h1>
            <p className="hero-subtitle">{currentSeoPage?.intro ?? t.heroSubtitle}</p>
            <div className="hero-actions">
              <a
                className="btn btn-whatsapp"
                href={directUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("clic_whatsapp", { source: "hero" })}
              >
                <Send aria-hidden="true" />
                {t.directWhatsapp}
              </a>
              <a
                className="btn btn-primary"
                href="#calculadora"
                onClick={() => trackEvent("clic_reserva", { source: "hero_calculator" })}
              >
                <Route aria-hidden="true" />
                {t.calculatePrice}
              </a>
              <a
                className="btn btn-secondary"
                href={CONTACT.phoneHref}
                onClick={() => trackEvent("clic_llamada", { source: "hero" })}
              >
                <Phone aria-hidden="true" />
                {t.call}
              </a>
            </div>
            <dl className="hero-stats">
              {heroStatsLocalized.map((item) => (
                <div key={item.label}>
                  <dt>{item.value}</dt>
                  <dd>{item.label}</dd>
                </div>
              ))}
            </dl>
            <div className="hero-places" aria-label={global.aria.serviceHighlights}>
              {regionHighlights[language].map((place) => (
                <span key={place}>
                  <MapPin aria-hidden="true" />
                  {place}
                </span>
              ))}
            </div>
          </div>

          <aside className="hero-booking-card" aria-label={global.aria.bookingCard}>
            <div className="rating-badge">
              <Star aria-hidden="true" />
              <strong>{reviews.rating}</strong>
              <span>Google · {reviews.count}</span>
            </div>
            <h2>{t.bookTitle}</h2>
            <p>{t.bookText}</p>
            <div className="hero-direct-options" aria-label={global.aria.quickContact}>
              <span>
                <MessageCircle aria-hidden="true" />
                {t.noRoute}
              </span>
              <span>
                <Clock3 aria-hidden="true" />
                {t.fastReply}
              </span>
              <span>
                <LocateFixed aria-hidden="true" />
                {t.taxiNow}
              </span>
              <span>
                <TriangleAlert aria-hidden="true" />
                {ui.roadHeroOption}
              </span>
            </div>
            <div className="hero-card-actions">
              <a
                className="btn btn-whatsapp"
                href={directUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("clic_whatsapp", { source: "hero_card" })}
              >
                <Send aria-hidden="true" />
                {t.sendWhatsapp}
              </a>
              <a
                className="btn btn-secondary"
                href="#calculadora"
                onClick={() => trackEvent("clic_reserva", { source: "hero_card_calculator" })}
              >
                <Route aria-hidden="true" />
                {t.seeQuote}
              </a>
            </div>
          </aside>
        </section>

        <section className="trust-strip" aria-label={global.aria.trustData}>
          <div>
            <WalletCards aria-hidden="true" />
            <span>{t.paymentTitle}</span>
            <PaymentLogos language={language} />
          </div>
          <div>
            <TimerReset aria-hidden="true" />
            <span>{t.officialFare}</span>
            <p>{global.officialNotice}</p>
          </div>
          <div>
            <Star aria-hidden="true" />
            <span>{reviews.rating} {t.googleRating}</span>
            <p>{reviews.count} {t.googleText}</p>
          </div>
        </section>

        {currentSeoPage ? (
          <SeoIntentSection page={currentSeoPage} directUrl={directUrl} language={language} />
        ) : null}

        <section className="region-band" aria-label={global.aria.region} data-animate>
          <div className="region-copy">
            <p className="eyebrow compact">
              <MapPin aria-hidden="true" />
              {t.regionEyebrow}
            </p>
            <h2>{t.regionTitle}</h2>
            <p>{t.regionText}</p>
          </div>
          <div className="comfort-strip" aria-label={global.aria.comfort}>
            {[CheckCircle2, Luggage, ShieldCheck, MessageCircle].map((Icon, index) => (
              <div key={t.comfort[index]}>
                <Icon aria-hidden="true" />
                <span>{t.comfort[index]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="local-seo-section" aria-label={global.aria.localSeo} data-animate>
          <div>
            <p className="eyebrow compact">
              <MapPinned aria-hidden="true" />
              {t.seoEyebrow}
            </p>
            <h2>{t.seoTitle}</h2>
            <p>{t.seoText}</p>
          </div>
          <div className="local-route-grid">
            {t.seoRoutes.map((route) => (
              <article key={route.title}>
                <MapPin aria-hidden="true" />
                <h3>{route.title}</h3>
                <p>{route.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tourist-search-section" aria-label={global.aria.tourist} data-animate>
          <div className="tourist-search-copy">
            <p className="eyebrow compact">
              <Languages aria-hidden="true" />
              {touristCopy.eyebrow}
            </p>
            <h2>{touristCopy.title}</h2>
            <p>{touristCopy.text}</p>
          </div>
          <div className="tourist-search-grid">
            {touristSearchPhrases[language].map((item) => (
              <span key={item.language}>
                <strong>{item.language}</strong>
                {item.query}
              </span>
            ))}
          </div>
        </section>

        <section className="festival-section" id="taxi-fiestas-calatayud" data-animate>
          <div className="festival-copy">
            <p className="eyebrow compact">
              <CalendarDays aria-hidden="true" />
              {festival.eyebrow}
            </p>
            <h2>{festival.title}</h2>
            <p>{festival.text}</p>
            <div className="festival-tags">
              {festival.tags.map((tag) => (
                <span key={tag}>
                  <CheckCircle2 aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="festival-actions">
            <a
              className="btn btn-whatsapp"
              href={directUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("clic_whatsapp", { source: "festival_san_roque" })}
            >
              <MessageCircle aria-hidden="true" />
              {festival.primary}
            </a>
            <a
              className="btn btn-secondary"
              href="#calculadora"
              onClick={() => trackEvent("clic_reserva", { source: "festival_calculator" })}
            >
              <Route aria-hidden="true" />
              {festival.secondary}
            </a>
          </div>
        </section>

        <InternalLinksBand language={language} />

        <section className="road-assist-section" id="taxi-averia-calatayud" aria-label={ui.roadTitle} data-animate>
          <div className="road-assist-copy">
            <p className="eyebrow compact">
              <TriangleAlert aria-hidden="true" />
              {ui.roadEyebrow}
            </p>
            <h2>{ui.roadTitle}</h2>
            <p>{ui.roadText}</p>
            <div className="road-actions">
              <button type="button" className="btn btn-primary" onClick={requestRoadPickupLocation}>
                <LocateFixed aria-hidden="true" />
                {ui.roadLocationButton}
              </button>
              <a
                className="btn btn-whatsapp"
                href={roadUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => showRoadWhatsappNotice(event, roadUrl, "road_assist")}
              >
                <MessageCircle aria-hidden="true" />
                {ui.roadWhatsapp}
              </a>
            </div>
            <div className="road-preset-grid" aria-label={ui.roadPresetAria}>
              {roadPickupPresets.map((preset) => (
                <button type="button" key={preset.label} onClick={() => prepareRoadPreset(preset)}>
                  <MapPin aria-hidden="true" />
                  <span>{preset.label.replace(", Zaragoza, España", "")}</span>
                </button>
              ))}
            </div>
            <p className="road-disclaimer">
              {ui.roadDisclaimer}
            </p>
          </div>
          <div className="road-visual-column">
            <figure className="road-photo-card">
              <img
                src="/assets/roadside-pickup-taxi.webp"
                alt={global.media.roadPhotoAlt}
                width="738"
                height="415"
                loading="lazy"
                decoding="async"
              />
              <figcaption>{global.media.roadPhotoCaption}</figcaption>
            </figure>
            <div className="road-assist-panel" aria-label={ui.roadPanelAria}>
              {ui.roadSteps.map((step, index) => (
                <div className="road-step" key={step.title}>
                  <span>{index + 1}</span>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section calc-section" id="calculadora">
          <div className="section-heading">
            <p className="eyebrow compact">
              <Route aria-hidden="true" />
              {t.calcEyebrow}
            </p>
            <h2>{t.calcTitle}</h2>
            <p>{t.calcText}</p>
          </div>

          <div className="calc-layout" data-animate>
            <div className="calculator-panel">
              <div className="mode-toggle" role="group" aria-label={global.aria.bookingType}>
                <button
                  type="button"
                  className={bookingMode === "later" ? "active" : ""}
                  onClick={() => {
                    setBookingMode("later");
                    setResult(null);
                  }}
                >
                  <CalendarDays aria-hidden="true" />
                  {t.schedule}
                </button>
                <button
                  type="button"
                  className={bookingMode === "now" ? "active" : ""}
                  onClick={() => {
                    setBookingMode("now");
                    setResult(null);
                  }}
                >
                  <LocateFixed aria-hidden="true" />
                  {t.now}
                </button>
              </div>

              <div className="route-inputs">
                <label>
                  <span className="field-label">{t.origin}</span>
                  <div className="search-field">
                    <MapPinned aria-hidden="true" />
                    <input
                      name="origin"
                      autoComplete="street-address"
                      aria-autocomplete="list"
                      aria-expanded={activeAddressField === "origin" && originSuggestions.length > 0}
                      value={origin}
                      placeholder={t.originPlaceholder}
                      onFocus={(event) => {
                        setActiveAddressField("origin");
                        setDestinationSuggestions([]);
                        selectSearchField(event);
                      }}
                      onBlur={closeAddressSuggestionsSoon}
                      onChange={(event) => {
                        setOrigin(event.target.value);
                        setSelectedOriginPoint(null);
                        setResult(null);
                        setRouteError("");
                      }}
                    />
                  </div>
                  {activeAddressField === "origin" && originSuggestions.length ? (
                    <div className="address-suggestions" aria-label={global.aria.originSuggestions}>
                      {originSuggestions.map((item) => (
                        <button
                          type="button"
                          key={item.label}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            chooseAddress("origin", item);
                          }}
                        >
                          <span>{item.label}</span>
                          {item.detail ? <small>{item.detail}</small> : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </label>
                <label>
                  <span className="field-label">{t.destination}</span>
                  <div className="search-field">
                    <Search aria-hidden="true" />
                    <input
                      id="destination-search"
                      name="destination"
                      autoComplete="street-address"
                      aria-autocomplete="list"
                      aria-expanded={
                        activeAddressField === "destination" && destinationSuggestions.length > 0
                      }
                      value={destinationSearchValue}
                      placeholder={destinationPlaceholder}
                      onFocus={(event) => {
                        setActiveAddressField("destination");
                        setOriginSuggestions([]);
                        if (isRoadDestinationDraft(query)) {
                          setQuery("");
                          setSelectedKey("");
                          setSelectedDestinationPoint(null);
                          setDestinationSuggestions([]);
                        }
                        selectSearchField(event);
                      }}
                      onBlur={closeAddressSuggestionsSoon}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setSelectedKey("");
                        setSelectedDestinationPoint(null);
                        setResult(null);
                        setRouteError("");
                      }}
                    />
                  </div>
                  {activeAddressField === "destination" && destinationSuggestions.length ? (
                    <div className="address-suggestions" aria-label={global.aria.destinationSuggestions}>
                      {destinationSuggestions.map((item) => (
                        <button
                          type="button"
                          key={item.label}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            chooseAddress("destination", item);
                          }}
                        >
                          <span>{item.label}</span>
                          {item.detail ? <small>{item.detail}</small> : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </label>
              </div>

              <div className="suggestions compact" aria-label={global.aria.suggestedDestinations}>
                {suggestions.slice(0, 6).map(([key]) => (
                  <button
                    key={key}
                    type="button"
                    className={selectedKey === key ? "active" : ""}
                    onClick={() => chooseDestination(key)}
                  >
                    <span>{displayName(key)}</span>
                    <small>{t.habitualDestination}</small>
                  </button>
                ))}
              </div>

              <div className="form-grid">
                {bookingMode === "later" ? (
                  <>
                    <label>
                      <span className="field-label">{t.date}</span>
                      <input
                        type="date"
                        value={date}
                        onChange={(event) => {
                          setDate(event.target.value);
                          setResult(null);
                          setRouteError("");
                        }}
                      />
                    </label>
                    <label>
                      <span className="field-label">{t.time}</span>
                      <input
                        type="time"
                        value={hour}
                        onChange={(event) => {
                          setHour(event.target.value);
                          setResult(null);
                          setRouteError("");
                        }}
                      />
                    </label>
                  </>
                ) : (
                  <div className="instant-note">
                    <LocateFixed aria-hidden="true" />
                    <span>{t.immediate}</span>
                  </div>
                )}
                <label>
                  <span className="field-label">{t.passengers}</span>
                  <select
                    value={passengers}
                    onChange={(event) => {
                      setPassengers(Number(event.target.value));
                      setResult(null);
                      setRouteError("");
                    }}
                  >
                    {t.passengerOptions.map((label, index) => (
                      <option value={index + 1} key={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="field-label">{t.optionalWait}</span>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    value={waitMinutes}
                    onChange={(event) => {
                      setWaitMinutes(Number(event.target.value));
                      setResult(null);
                      setRouteError("");
                    }}
                    placeholder="0 min"
                  />
                </label>
              </div>

              <label className="notes-field">
                <span className="field-label">{t.notes}</span>
                <input
                  value={notes}
                  placeholder={t.notesPlaceholder}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>

              <div className="location-row">
                <button className="btn btn-secondary" type="button" onClick={requestPickupLocation}>
                  <LocateFixed aria-hidden="true" />
                  {t.sendMyLocation}
                </button>
                {locationStatus ? <span>{locationStatus}</span> : null}
              </div>

              <div className="road-quick-card">
                <TriangleAlert aria-hidden="true" />
                <div>
                  <strong>{ui.roadQuickTitle}</strong>
                  <p>{ui.roadQuickText}</p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={prepareRoadPickup}>
                  {ui.roadQuickButton}
                </button>
              </div>

              <div className="calc-actions">
                <button
                  className="btn btn-primary calc-button"
                  disabled={routeLoading}
                  onClick={calculate}
                >
                  <CalculatorIcon />
                  {routeLoading ? t.calculating : t.calculatePrice}
                </button>
                <a
                  className="btn btn-whatsapp"
                  href={instantUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => handleRouteWhatsapp(event, instantUrl, "calculator_now")}
                >
                  <Send aria-hidden="true" />
                  {t.taxiNow}
                </a>
              </div>
              {!canAutoCalculate ? (
                <p className="api-note">
                  {t.locationHint}
                </p>
              ) : null}
            </div>

            <aside
              className="result-panel"
              id="resultado"
              aria-live="polite"
              aria-busy={routeLoading}
              role={routeError ? "alert" : "status"}
            >
              {result ? (
                <>
                  <div className="result-kicker">
                    <Clock3 aria-hidden="true" />
                    {result.tariffLabel}
                  </div>
                  <p className="result-route">
                    {result.origin} <ArrowRight aria-hidden="true" /> {result.destination}
                  </p>
                  <p className="result-price">{euro(result.price)}</p>
                  <ul className="result-list">
                    <li>
                      <MapPin aria-hidden="true" />
                      {t.resultDistance} {formatKm(result.km)} km
                    </li>
                    <li>
                      <CalendarDays aria-hidden="true" />
                      {result.mode === "now"
                        ? t.now
                        : `${result.dateLabel} · ${result.hour}h`}{" "}
                      · {result.reason}
                    </li>
                    <li>
                      <Users aria-hidden="true" />
                      {passengerSummary(result.passengers)}
                    </li>
                    {result.waitMinutes ? (
                      <li>
                        <TimerReset aria-hidden="true" />
                        {t.optionalWait} {result.waitMinutes} min · {euro(result.waitPrice)}
                      </li>
                    ) : null}
                  </ul>
                  <div className="price-note-box">
                    <span>{t.quoteEstimate}</span>
                    <strong>{t.quoteOfficial}</strong>
                  </div>
                  <div className="result-actions">
                    <a
                      className="btn btn-whatsapp"
                      href={quoteUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => {
                        handleRouteWhatsapp(event, quoteUrl, "calculated_quote");
                        trackEvent("clic_reserva", { source: "calculated_quote" });
                        trackEvent("formulario_enviado", { source: "calculated_quote" });
                      }}
                    >
                      <MessageCircle aria-hidden="true" />
                      {t.bookWithMessage}
                    </a>
                    <a
                      className="btn btn-secondary"
                      href={instantUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => handleRouteWhatsapp(event, instantUrl, "result_availability")}
                    >
                      <LocateFixed aria-hidden="true" />
                      {t.seeAvailability}
                    </a>
                  </div>
                  <p className="small-note">
                    {result.reason.includes(global.route.estimated) ? `${t.quoteEstimate}. ` : ""}
                    {global.officialNotice}.
                  </p>
                </>
              ) : (
                <>
                  <div className="result-kicker">
                    <MessageSquareText aria-hidden="true" />
                    {t.whatsappQuote}
                  </div>
                  <p className="result-route">
                    {origin || t.origin} <ArrowRight aria-hidden="true" />{" "}
                    {activeDestination || t.destination}
                  </p>
                  <p className="empty-result">
                    {routeError ||
                    (canAutoCalculate
                      ? t.emptyResult
                      : t.exactRouteFallback)}
                  </p>
                  <a
                    className="btn btn-whatsapp"
                    href={emptyResultWhatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) =>
                      handleRouteWhatsapp(event, emptyResultWhatsappUrl, "result_without_calculation")
                    }
                  >
                    <Send aria-hidden="true" />
                    {t.sendWhatsapp}
                  </a>
                  <p className="small-note">
                    {t.apiPrivateNote}
                  </p>
                </>
              )}
            </aside>
          </div>
        </section>

        <section className="section reviews-section" id="resenas" data-animate>
          <div className="reviews-summary">
            <p className="eyebrow compact">
              <Star aria-hidden="true" />
              {t.reviewsEyebrow}
            </p>
            <h2>{reviews.rating} {t.reviewsWith} {reviews.count}</h2>
            <p>{t.reviewsText}</p>
            <div className="review-signals" aria-label={global.aria.reviewSignals}>
              {REVIEW_SIGNALS[language].map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </div>
            <a
              className="btn btn-secondary"
              href={CONTACT.googleProfile}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("clic_reserva", { source: "google_reviews" })}
            >
              <Star aria-hidden="true" />
              {t.viewGoogle}
            </a>
          </div>
          <div className="reviews-stack">
            {reviews.items.slice(0, 1).map((review) => {
              const reviewRating = Math.max(1, Math.min(5, Math.round(review.rating || 5)));

              return (
                <article className="review-card featured-review" key={`${review.author}-${review.text}`} data-animate>
                  <span className="review-label">{t.featuredReview}</span>
                  <div aria-label={global.starsLabel(reviewRating)}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        aria-hidden="true"
                        className={index < reviewRating ? "filled" : "empty"}
                        key={index}
                      />
                    ))}
                  </div>
                  <p>"{review.text}"</p>
                  <span>
                    {review.author}
                    {review.time ? ` · ${review.time}` : ""}
                  </span>
                </article>
              );
            })}
            <details className="more-reviews" open={false}>
              <summary>{t.moreReviews}</summary>
              <div className="review-cards">
                {reviews.items.slice(1).map((review) => {
                  const reviewRating = Math.max(1, Math.min(5, Math.round(review.rating || 5)));

                  return (
                    <article className="review-card" key={`${review.author}-${review.text}`} data-animate>
                      <div aria-label={global.starsLabel(reviewRating)}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            aria-hidden="true"
                            className={index < reviewRating ? "filled" : "empty"}
                            key={index}
                          />
                        ))}
                      </div>
                      <p>"{review.text}"</p>
                      <span>
                        {review.author}
                        {review.time ? ` · ${review.time}` : ""}
                      </span>
                    </article>
                  );
                })}
              </div>
              <a
                className="btn btn-secondary google-more-link"
                href={CONTACT.googleProfile}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("clic_reserva", { source: "google_reviews_details" })}
              >
                <Star aria-hidden="true" />
                {t.viewGoogle}
              </a>
            </details>
          </div>
        </section>

        <section className="section service-section" id="servicios">
          <div className="section-heading">
            <p className="eyebrow compact">
              <CarFront aria-hidden="true" />
              {t.servicesEyebrow}
            </p>
            <h2>{t.servicesTitle}</h2>
            <p>{t.servicesText}</p>
          </div>
          <div className="service-grid">
            {t.serviceItems.slice(0, 4).map((service, index) => {
              const Icon = serviceIcons[index] ?? Navigation;
              return (
                <article className="service-card" key={service.title} data-animate>
                  <Icon aria-hidden="true" />
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <small>{service.detail}</small>
                </article>
              );
            })}
          </div>
          <details className="more-services">
            <summary>{t.moreServices}</summary>
            <div className="service-grid compact">
              {t.serviceItems.slice(4).map((service, index) => {
                const Icon = serviceIcons[index + 4] ?? Navigation;
                return (
                  <article className="service-card" key={service.title} data-animate>
                    <Icon aria-hidden="true" />
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <small>{service.detail}</small>
                  </article>
                );
              })}
            </div>
          </details>
        </section>

        <section className="section vehicle-section" id="vehiculo" data-animate>
          <div className="vehicle-copy">
            <p className="eyebrow compact">
              <ShieldCheck aria-hidden="true" />
              {t.vehicleEyebrow}
            </p>
            <h2>Peugeot 408 Hybrid</h2>
            <p>{t.vehicleText}</p>
            <div className="spec-grid">
              {[Luggage, CheckCircle2, ShieldCheck, CreditCard, Sparkles, Clock3].map((Icon, index) => (
                <div key={t.vehicleSpecs[index]}>
                  <Icon aria-hidden="true" />
                  <span>{t.vehicleSpecs[index]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="vehicle-gallery">
            <img
              src="/assets/peugeot-408-hybrid.webp"
              alt="Taxi Ayud Peugeot 408 Hybrid blanco"
              width="1600"
              height="1067"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        <section className="section tariffs-section" id="tarifas">
          <div className="section-heading">
            <p className="eyebrow compact">
              <Search aria-hidden="true" />
              {t.tariffsEyebrow}
            </p>
            <h2>{t.tariffsTitle}</h2>
            <p>{t.tariffsText}</p>
          </div>

          <div className="tariff-lookup" data-animate>
            <div className="lookup-panel">
              <label className="field-label" htmlFor="tariff-destination">
                {t.chooseDestination}
              </label>
              <select
                id="tariff-destination"
                value={tariffLookupKey}
                onChange={(event) => setTariffLookupKey(event.target.value)}
              >
                {tariffEntries.map(([key]) => (
                  <option value={key} key={key}>
                    {displayName(key)}
                  </option>
                ))}
              </select>

              <div className="quick-destinations" aria-label={global.aria.quickDestinations}>
                {featuredDestinations.slice(0, 6).map((key) => (
                  <button
                    type="button"
                    key={key}
                    className={tariffLookupKey === key ? "active" : ""}
                    onClick={() => setTariffLookupKey(key)}
                  >
                    {displayName(key)}
                  </button>
                ))}
              </div>
            </div>

            <aside className="lookup-result">
              <p className="result-kicker">
                <Route aria-hidden="true" />
                {t.estimatedFare}
              </p>
              <h3>{displayName(tariffLookupKey)}</h3>
              <p className="lookup-price">{euro(priceFromKm(lookupTariff.km, false))}</p>
              <div className="lookup-metrics">
                <div>
                  <span>{t.oneWayKm}</span>
                  <strong>{formatKm(lookupTariff.km)} km</strong>
                </div>
                <div>
                  <span>{t.dayFare}</span>
                  <strong>{euro(priceFromKm(lookupTariff.km, false))}</strong>
                </div>
                <div>
                  <span>{t.nightFare}</span>
                  <strong>{euro(priceFromKm(lookupTariff.km, true))}</strong>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary lookup-action"
                onClick={() => {
                  trackEvent("consulta_tarifa", { mode: "tabla_destinos" });
                  useLookupDestination(tariffLookupKey);
                }}
              >
                <Route aria-hidden="true" />
                {t.calcDestination}
              </button>
            </aside>
          </div>

          <details className="full-table-disclosure">
            <summary>{t.fullTable}</summary>
            <div className="table-tools">
              <div className="search-field">
                <Search aria-hidden="true" />
                <input
                  value={filter}
                  placeholder={t.filterTable}
                  onChange={(event) => setFilter(event.target.value)}
                />
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t.destination}</th>
                    <th>{t.oneWayKm}</th>
                    <th>{t.dayFare}</th>
                    <th>{t.nightFare}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTariffs.map(([key, tariff]) => (
                    <tr key={key}>
                      <td>{displayName(key)}</td>
                      <td>{formatKm(tariff.km)} km</td>
                      <td>{euro(priceFromKm(tariff.km, false))}</td>
                      <td>{euro(priceFromKm(tariff.km, true))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        <section className="closing-band" data-animate>
          <img
            src="/assets/taxi-light.webp"
            alt=""
            width="1200"
            height="835"
            loading="lazy"
            decoding="async"
          />
          <div>
            <p className="eyebrow compact">
              <Phone aria-hidden="true" />
              {t.closingEyebrow}
            </p>
            <h2>{t.closingTitle}</h2>
            <p>{t.closingText}</p>
          </div>
          <div className="closing-actions">
            <a
              className="btn btn-primary"
              href={CONTACT.phoneHref}
              onClick={() => trackEvent("clic_llamada", { source: "closing" })}
            >
              <Phone aria-hidden="true" />
              {CONTACT.phoneDisplay}
            </a>
            <a
              className="btn btn-whatsapp"
              href={directUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("clic_whatsapp", { source: "closing" })}
            >
              <MessageCircle aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <img src="/assets/logo.webp" alt="" width="520" height="520" loading="lazy" decoding="async" />
          <p>
            <strong>Taxi Ayud</strong>
            <br />
            {t.footerText} {CONTACT.license}.
          </p>
        </div>
        <ul>
          {DEFAULT_SEO_LINKS.slice(1, 5).map((path) => pageFromPath(path)).filter(Boolean).map((page) => (
            <li key={page!.path}>
              <a href={page!.path}>{page!.navLabel}</a>
            </li>
          ))}
        </ul>
        <address>
          <a
            href={CONTACT.phoneHref}
            onClick={() => trackEvent("clic_llamada", { source: "footer" })}
          >
            {CONTACT.phoneDisplay}
          </a>
          <span>{CONTACT.place}</span>
          <span>{global.paymentShort}</span>
        </address>
      </footer>

      <LegalFooter language={language} />

      {pendingRoadWhatsappUrl ? (
        <RoadWhatsappNotice
          language={language}
          onCancel={() => setPendingRoadWhatsappUrl("")}
          onConfirm={confirmRoadWhatsapp}
        />
      ) : null}

      {cookieConsent === "pending" ? (
        <CookieBanner
          language={language}
          onAccept={() => saveCookieConsent("accepted")}
          onReject={() => saveCookieConsent("necessary")}
        />
      ) : null}

      <a
        className="floating-whatsapp"
        href={directUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={t.floatingWhatsapp}
        onClick={() => trackEvent("clic_whatsapp", { source: "floating" })}
      >
        <MessageCircle aria-hidden="true" />
      </a>

      <nav className="mobile-action-bar" aria-label={global.aria.mobileActions}>
        <a
          href={directUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("clic_whatsapp", { source: "mobile_bar" })}
        >
          <MessageCircle aria-hidden="true" />
          WhatsApp
        </a>
        <a
          href={CONTACT.phoneHref}
          onClick={() => trackEvent("clic_llamada", { source: "mobile_bar" })}
        >
          <Phone aria-hidden="true" />
          {t.call}
        </a>
        <a href="#calculadora" onClick={() => trackEvent("clic_reserva", { source: "mobile_bar_calc" })}>
          <Route aria-hidden="true" />
          {t.nav[1]}
        </a>
        <button
          type="button"
          aria-label={global.aria.roadMobile}
          onClick={requestRoadPickupLocation}
        >
          <TriangleAlert aria-hidden="true" />
          {ui.roadHeroOption}
        </button>
      </nav>
    </>
  );
}

function CalculatorIcon() {
  return <Route aria-hidden="true" />;
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el contenedor principal de Taxi Ayud.");
}

const root = window.__taxiAyudRoot ?? createRoot(rootElement);
window.__taxiAyudRoot = root;

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
