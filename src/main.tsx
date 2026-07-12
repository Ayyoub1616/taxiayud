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
  MapPinned,
  MapPin,
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
  Users,
  WalletCards,
} from "lucide-react";
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
};

type ExactRouteResponse = {
  km: number;
  durationMinutes?: number;
  originLabel?: string;
  destinationLabel?: string;
};

type AddressSuggestion = {
  label: string;
  detail?: string;
  lat?: number;
  lng?: number;
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
    quoteOfficial: "Calculado con tarifa oficial y distancia estimada.",
    bookWithMessage: "Reservar con mensaje",
    seeAvailability: "Ver disponibilidad ahora",
    emptyResult:
      "Pulsa calcular precio para ver un presupuesto orientativo. Si prefieres, puedes consultar por WhatsApp sin calcular.",
    exactRouteFallback:
      "Escribe origen y destino para consultar disponibilidad y presupuesto por WhatsApp.",
    apiPrivateNote:
      "📲 El WhatsApp ya lleva origen, destino, fecha y pasajeros para ayudarte rápido.",
    whatsappQuote: "Presupuesto por WhatsApp",
    reviewsEyebrow: "Reseñas de Google",
    reviewsText:
      "Opiniones públicas del perfil de Google de Taxi Ayud. La reseña más reciente aparece destacada y puedes ver el resto en Google.",
    reviewsWith: "con",
    featuredReview: "Última reseña destacada",
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
    quoteOfficial: "Calculated with official fare and estimated distance.",
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
      "Public reviews from Taxi Ayud's Google profile. The most recent review is highlighted and you can see the rest on Google.",
    reviewsWith: "with",
    featuredReview: "Latest featured review",
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
    quoteOfficial: "Calculé avec le tarif officiel et la distance estimée.",
    bookWithMessage: "Réserver avec message",
    seeAvailability: "Voir disponibilité",
    emptyResult: "Appuyez sur calculer pour voir une estimation ou demandez par WhatsApp.",
    exactRouteFallback: "Indiquez le départ et la destination pour demander disponibilité et estimation par WhatsApp.",
    apiPrivateNote:
      "📲 Le message WhatsApp contient déjà le départ, la destination, la date et les passagers.",
    whatsappQuote: "Estimation WhatsApp",
    reviewsEyebrow: "Avis Google",
    reviewsText: "Avis publics du profil Google de Taxi Ayud. L'avis le plus récent est mis en avant et le reste est disponible sur Google.",
    reviewsWith: "avec",
    featuredReview: "Dernier avis mis en avant",
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
    quoteOfficial: "محسوب بالتعرفة الرسمية والمسافة التقديرية.",
    bookWithMessage: "احجز برسالة",
    seeAvailability: "تحقق من التوفر الآن",
    emptyResult: "اضغط احسب السعر لرؤية تقدير أو اسأل عبر واتساب بدون حساب.",
    exactRouteFallback: "أدخل نقطة الانطلاق والوجهة لطلب التوفر والتقدير عبر واتساب.",
    apiPrivateNote: "📲 رسالة واتساب تتضمن نقطة الانطلاق والوجهة والتاريخ وعدد الركاب للمساعدة بسرعة.",
    whatsappQuote: "تقدير عبر واتساب",
    reviewsEyebrow: "تقييمات Google",
    reviewsText: "تقييمات عامة من ملف Taxi Ayud على Google. أحدث تقييم يظهر أولا ويمكن رؤية الباقي على Google.",
    reviewsWith: "مع",
    featuredReview: "آخر تقييم مميز",
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
    officialFare: "Tarifa oficial",
    googleText: "públiques al perfil d'empresa",
    googleRating: "a Google",
    regionTitle: "Calatayud, pobles de la comarca, balnearis i Saragossa sense complicacions",
    comfort: ["Conducció tranquil·la", "Maleter ampli", "Taxi oficial", "Reserva per WhatsApp"],
    seoTitle: "El taxi de confiança per a Calatayud i la zona",
    seoText:
      "Rutes freqüents amb recollida a estació, hotels, Plaza del Fuerte, pobles de la comarca, Monasterio de Piedra, balnearis, Saragossa i aeroport.",
    calcTitle: "Calcula la ruta i envia el missatge preparat",
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
    sendMyLocation: "Enviar la meva ubicació",
    calculating: "Calculant...",
    routeError:
      "🚕 Ui, aquesta ruta necessita una mirada ràpida. No pateixis: envia-la per WhatsApp i confirmo preu i disponibilitat de seguida.",
    resultDistance: "Distància estimada",
    quoteEstimate: "Pressupost orientatiu",
    bookWithMessage: "Reservar amb missatge",
    seeAvailability: "Veure disponibilitat ara",
    whatsappQuote: "Pressupost per WhatsApp",
    apiPrivateNote:
      "📲 El WhatsApp ja porta origen, destinació, data i passatgers per ajudar-te ràpid.",
    reviewsEyebrow: "Ressenyes de Google",
    reviewsWith: "amb",
    moreReviews: "Veure més ressenyes",
    servicesTitle: "Pobles, balnearis i Saragossa des de Calatayud",
    servicesText:
      "Servei còmode per moure't per la comarca: pobles propers, balnearis, estació, Saragossa, aeroport, cites mèdiques i viatges programats.",
    tariffsEyebrow: "Tarifes",
    tariffsTitle: "Destinacions freqüents",
    closingTitle: "Taxi disponible a Calatayud",
    footerText: "Taxi oficial a Calatayud.",
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
    officialFare: "Offizieller Tarif",
    googleText: "öffentlich im Unternehmensprofil",
    googleRating: "bei Google",
    regionTitle: "Calatayud, Dörfer, Thermalbäder und Zaragoza bequem erreichen",
    comfort: ["Ruhige Fahrt", "Großer Kofferraum", "Offizielles Taxi", "Buchung per WhatsApp"],
    seoTitle: "Ihr zuverlässiges Taxi in Calatayud und Umgebung",
    seoText:
      "Häufige Fahrten ab Bahnhof, Hotels, Plaza del Fuerte, Dörfern der Region, Monasterio de Piedra, Thermalbädern, Zaragoza und Flughafen.",
    calcTitle: "Route berechnen und fertige Nachricht senden",
    schedule: "Planen",
    now: "Jetzt",
    origin: "Abfahrt",
    destination: "Ziel",
    originPlaceholder: "Straße, Hotel, Bahnhof, Ort...",
    destinationPlaceholder: "Straße, Hotel, Stadt, Flughafen...",
    date: "Datum",
    time: "Uhrzeit",
    passengers: "Fahrgäste",
    passengerOptions: ["1 Fahrgast", "2 Fahrgäste", "3 Fahrgäste", "4 Fahrgäste"],
    sendMyLocation: "Meinen Standort senden",
    calculating: "Berechnung...",
    routeError:
      "🚕 Ups, diese Route braucht einen kurzen manuellen Blick. Keine Sorge: per WhatsApp bestätige ich Preis und Verfügbarkeit sofort.",
    resultDistance: "Geschätzte Entfernung",
    quoteEstimate: "Orientierungspreis",
    bookWithMessage: "Mit Nachricht buchen",
    seeAvailability: "Verfügbarkeit prüfen",
    whatsappQuote: "WhatsApp-Angebot",
    apiPrivateNote:
      "📲 Die WhatsApp-Nachricht enthält bereits Abfahrt, Ziel, Datum und Fahrgäste.",
    reviewsEyebrow: "Google-Bewertungen",
    reviewsWith: "mit",
    moreReviews: "Mehr Bewertungen",
    servicesTitle: "Dörfer, Thermalbäder und Zaragoza ab Calatayud",
    servicesText:
      "Komfortabler Service in der Umgebung: nahe Dörfer, Thermalbäder, Bahnhof, Zaragoza, Flughafen, Arzttermine und geplante Fahrten.",
    tariffsEyebrow: "Tarife",
    tariffsTitle: "Häufige Ziele",
    closingTitle: "Taxi verfügbar in Calatayud",
    footerText: "Offizielles Taxi in Calatayud.",
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
    noRoute: "Senza calcolare percorso",
    fastReply: "Risposta rapida",
    taxiNow: "Taxi ora",
    sendWhatsapp: "Invia WhatsApp",
    seeQuote: "Vedi preventivo",
    paymentTitle: "Pagamento flessibile",
    officialFare: "Tariffa ufficiale",
    googleText: "pubbliche sul profilo aziendale",
    googleRating: "su Google",
    regionTitle: "Calatayud, paesi, terme e Saragozza senza complicazioni",
    comfort: ["Guida tranquilla", "Bagagliaio ampio", "Taxi ufficiale", "Prenotazione WhatsApp"],
    seoTitle: "Il taxi di fiducia per Calatayud e dintorni",
    calcTitle: "Calcola il percorso e invia il messaggio pronto",
    schedule: "Programmare",
    now: "Ora",
    origin: "Origine",
    destination: "Destinazione",
    passengers: "Passeggeri",
    passengerOptions: ["1 passeggero", "2 passeggeri", "3 passeggeri", "4 passeggeri"],
    routeError:
      "🚕 Ops, questo percorso ha bisogno di un controllo rapido. Nessun problema: invialo su WhatsApp e confermo prezzo e disponibilità.",
    resultDistance: "Distanza stimata",
    quoteEstimate: "Preventivo orientativo",
    bookWithMessage: "Prenota con messaggio",
    seeAvailability: "Verifica disponibilità",
    whatsappQuote: "Preventivo WhatsApp",
    apiPrivateNote:
      "📲 Il messaggio WhatsApp include già origine, destinazione, data e passeggeri.",
    reviewsEyebrow: "Recensioni Google",
    reviewsWith: "con",
    moreReviews: "Vedi altre recensioni",
    servicesTitle: "Paesi, terme e Saragozza da Calatayud",
    tariffsEyebrow: "Tariffe",
    tariffsTitle: "Destinazioni frequenti",
    closingTitle: "Taxi disponibile a Calatayud",
    footerText: "Taxi ufficiale a Calatayud.",
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
    noRoute: "Sem calcular rota",
    fastReply: "Resposta rápida",
    taxiNow: "Táxi agora",
    sendWhatsapp: "Enviar WhatsApp",
    seeQuote: "Ver orçamento",
    paymentTitle: "Pagamento flexível",
    officialFare: "Tarifa oficial",
    googleText: "públicas no perfil da empresa",
    googleRating: "no Google",
    regionTitle: "Calatayud, aldeias, termas e Zaragoza sem complicações",
    comfort: ["Condução tranquila", "Bagageira ampla", "Táxi oficial", "Reserva por WhatsApp"],
    seoTitle: "O táxi de confiança em Calatayud e arredores",
    calcTitle: "Calcule a rota e envie a mensagem pronta",
    schedule: "Agendar",
    now: "Agora",
    origin: "Origem",
    destination: "Destino",
    passengers: "Passageiros",
    passengerOptions: ["1 passageiro", "2 passageiros", "3 passageiros", "4 passageiros"],
    routeError:
      "🚕 Opa, esta rota precisa de uma confirmação rápida. Não se preocupe: envie por WhatsApp e confirmo preço e disponibilidade.",
    resultDistance: "Distância estimada",
    quoteEstimate: "Orçamento estimado",
    bookWithMessage: "Reservar com mensagem",
    seeAvailability: "Ver disponibilidade",
    whatsappQuote: "Orçamento por WhatsApp",
    apiPrivateNote:
      "📲 A mensagem de WhatsApp já inclui origem, destino, data e passageiros.",
    reviewsEyebrow: "Avaliações Google",
    reviewsWith: "com",
    moreReviews: "Ver mais avaliações",
    servicesTitle: "Aldeias, termas e Zaragoza desde Calatayud",
    tariffsEyebrow: "Tarifas",
    tariffsTitle: "Destinos frequentes",
    closingTitle: "Táxi disponível em Calatayud",
    footerText: "Táxi oficial em Calatayud.",
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
    noRoute: "Geen route nodig",
    fastReply: "Snelle reactie",
    taxiNow: "Taxi nu",
    sendWhatsapp: "WhatsApp sturen",
    seeQuote: "Prijs bekijken",
    paymentTitle: "Flexibel betalen",
    officialFare: "Officieel tarief",
    googleText: "openbaar op het bedrijfsprofiel",
    googleRating: "op Google",
    regionTitle: "Calatayud, dorpen, kuuroorden en Zaragoza zonder gedoe",
    comfort: ["Rustige rit", "Ruime kofferbak", "Officiële taxi", "Boeken via WhatsApp"],
    seoTitle: "De betrouwbare taxi voor Calatayud en omgeving",
    calcTitle: "Bereken de route en stuur een kant-en-klaar bericht",
    schedule: "Plannen",
    now: "Nu",
    origin: "Vertrek",
    destination: "Bestemming",
    passengers: "Passagiers",
    passengerOptions: ["1 passagier", "2 passagiers", "3 passagiers", "4 passagiers"],
    routeError:
      "🚕 Oeps, deze route heeft een snelle check nodig. Geen zorgen: stuur hem via WhatsApp en ik bevestig prijs en beschikbaarheid.",
    resultDistance: "Geschatte afstand",
    quoteEstimate: "Richtprijs",
    bookWithMessage: "Boeken met bericht",
    seeAvailability: "Beschikbaarheid controleren",
    whatsappQuote: "WhatsApp-prijs",
    apiPrivateNote:
      "📲 Het WhatsApp-bericht bevat al vertrek, bestemming, datum en passagiers.",
    reviewsEyebrow: "Google reviews",
    reviewsWith: "met",
    moreReviews: "Meer reviews",
    servicesTitle: "Dorpen, kuuroorden en Zaragoza vanaf Calatayud",
    tariffsEyebrow: "Tarieven",
    tariffsTitle: "Veelgebruikte bestemmingen",
    closingTitle: "Taxi beschikbaar in Calatayud",
    footerText: "Officiële taxi in Calatayud.",
  },
};

const regionHighlights = [
  "Calatayud",
  "Pueblos",
  "Balnearios",
  "Zaragoza",
];

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

const touristSearchPhrases = [
  { language: "Hoteles", query: "Recogida en hoteles de Calatayud y la comarca" },
  { language: "Balnearios", query: "Jaraba, Alhama de Aragón y Paracuellos de Jiloca" },
  { language: "Turismo", query: "Monasterio de Piedra, Nuévalos y rutas cercanas" },
  { language: "Pueblos", query: "Ateca, Maluenda, Ariza, Cetina, Miedes y más" },
  { language: "Tren", query: "Estación de Calatayud y conexión con AVE" },
  { language: "Zaragoza", query: "Aeropuerto, Delicias, hospitales y direcciones concretas" },
];

const SEO_PAGES = seoPagesData as SeoPage[];
const HOME_SEO_PAGE = SEO_PAGES.find((page) => page.path === "/") ?? SEO_PAGES[0];
const DEFAULT_SEO_LINKS = [
  "/taxi-calatayud/",
  "/taxi-estacion-ave-calatayud/",
  "/taxi-monasterio-de-piedra/",
  "/taxi-balnearios-jaraba-alhama/",
  "/taxi-aeropuerto-zaragoza/",
  "/taxi-pueblos-comarca-calatayud/",
  "/contacto/",
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

const localAddressSuggestions = [
  "Calatayud, Zaragoza",
  "Plaza del Fuerte, Calatayud, Zaragoza",
  "Estación de tren de Calatayud, Zaragoza",
  "Hospital Ernest Lluch, Calatayud, Zaragoza",
  "Monasterio de Piedra, Nuévalos, Zaragoza",
  "Nuévalos, Zaragoza",
  "Balneario Sicilia, Jaraba, Zaragoza",
  "Balneario Serón, Jaraba, Zaragoza",
  "Balneario Termas Pallarés, Alhama de Aragón, Zaragoza",
  "Ateca, Zaragoza",
  "Maluenda, Zaragoza",
  "Ariza, Zaragoza",
  "Daroca, Zaragoza",
  "Estación Zaragoza-Delicias, Zaragoza",
  "Aeropuerto de Zaragoza",
  "Zaragoza centro",
  "Madrid",
];

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

function tariffInfo(date: string, hour: string) {
  const night = isNight(hour);
  const holiday = isHoliday(date);
  const premium = night || holiday;
  const reasons = [];

  if (night) reasons.push("horario nocturno");
  if (holiday) reasons.push("domingo o festivo");

  return {
    premium,
    rate: premium ? RATES.nightRate : RATES.dayRate,
    waitRate: premium ? RATES.nightWaitRate : RATES.dayWaitRate,
    label: premium ? "Nocturna / festiva" : "Laborable diurna",
    reason: reasons.length ? reasons.join(" y ") : "día laborable",
  };
}

function priceFromKm(km: number, premium: boolean, waitMinutes = 0) {
  const rate = premium ? RATES.nightRate : RATES.dayRate;
  const waitRate = premium ? RATES.nightWaitRate : RATES.dayWaitRate;
  const waitingPrice = (Math.max(0, waitMinutes) / 60) * waitRate;
  return km * RATES.returnFactor * rate + waitingPrice;
}

function formatKm(value: number) {
  return value.toString().replace(".", ",");
}

function dateLabel(value: string) {
  if (!value) return "Fecha sin indicar";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function detectLanguage(): LangCode {
  if (typeof navigator === "undefined") return "es";
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

function cleanPathname(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return `${pathname.replace(/\/+$/, "")}/`;
}

function activeSeoPage() {
  if (typeof window === "undefined") return null;
  const pathname = cleanPathname(window.location.pathname);
  return SEO_PAGES.find((page) => page.path !== "/" && page.path === pathname) ?? null;
}

function pageFromPath(path: string) {
  return SEO_PAGES.find((page) => page.path === path);
}

function languageNotice(language: LangCode) {
  return `Idioma del cliente / Customer language: ${LANGUAGE_OPTIONS[language].whatsapp}`;
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
  const info = tariffInfo(input.date, input.hour);
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
    dateLabel: dateLabel(input.date),
    hour: input.hour,
    passengers: input.passengers,
    mode: input.mode,
  };
}

function makeReverseResultForKey(key: string, input: ResultInput, destination: string): Result {
  const result = makeResultForKey(key, input);

  return {
    ...result,
    origin: displayName(key),
    destination: destination.trim() || "Calatayud",
    reason: `${result.reason} · ruta habitual`,
  };
}

function makeResultFromExactRoute(
  route: ExactRouteResponse,
  input: ResultInput,
  destination: string,
): Result {
  const info = tariffInfo(input.date, input.hour);
  const waitMinutes = Math.max(0, input.waitMinutes || 0);
  const waitPrice = (waitMinutes / 60) * info.waitRate;
  const km = Math.max(0, Math.round(route.km * 10) / 10);

  return {
    origin: route.originLabel || input.origin.trim() || "origen indicado",
    destination: route.destinationLabel || destination.trim() || "destino indicado",
    destinationKey: "RUTA_EXACTA",
    km,
    waitMinutes,
    waitPrice,
    price: priceFromKm(km, info.premium, waitMinutes),
    tariffLabel: info.label,
    reason: `${info.reason} · ruta calculada`,
    dateLabel: dateLabel(input.date),
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
  let response: Response;

  try {
    response = await fetch("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination, originPoint, destinationPoint }),
    });
  } catch {
    throw new Error("No se pudo conectar con el calculador automático.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.km) {
    throw new Error(data?.message || "No se pudo calcular la ruta exacta.");
  }

  return data as ExactRouteResponse;
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

async function fetchAddressSuggestions(query: string) {
  const response = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
  const data = await response.json().catch(() => null);

  if (!response.ok || !Array.isArray(data?.suggestions)) {
    return [];
  }

  return data.suggestions as AddressSuggestion[];
}

async function fetchGoogleReviews() {
  const response = await fetch("/api/reviews");
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.rating || !data?.count) {
    return null;
  }

  return data as ReviewsData;
}

function localAddressMatches(value: string) {
  const q = normalize(value);
  if (q.length < 2) return [];

  return localAddressSuggestions
    .filter((item) => normalize(item).includes(q) && normalize(item) !== q)
    .slice(0, 5)
    .map((label) => ({ label, detail: "Sugerencia rápida" }));
}

function pickupLocationLine(pickupLocation: PickupLocation) {
  if (!pickupLocation) return "";
  return `Ubicación de recogida: https://maps.google.com/?q=${pickupLocation.lat.toFixed(
    6,
  )},${pickupLocation.lng.toFixed(6)}`;
}

function whatsappDirectUrl(language: LangCode) {
  const linesByLanguage: Partial<Record<LangCode, string[]>> = {
    es: [
      "Hola Taxi Ayud, ¿estás disponible?",
      "Quiero hablar para reservar o consultar un taxi.",
      "Te envío los detalles por aquí.",
      "Gracias.",
    ],
    en: [
      "Hello Taxi Ayud, are you available?",
      "I would like to book or ask about a taxi.",
      "I will send the details here.",
      "Thank you.",
    ],
    fr: [
      "Bonjour Taxi Ayud, êtes-vous disponible ?",
      "Je souhaite réserver ou demander un taxi.",
      "J'envoie les détails ici.",
      "Merci.",
    ],
    ca: [
      "Hola Taxi Ayud, estàs disponible?",
      "Voldria reservar o consultar un taxi.",
      "T'envio els detalls per aquí.",
      "Gràcies.",
    ],
    de: [
      "Hallo Taxi Ayud, sind Sie verfügbar?",
      "Ich möchte ein Taxi buchen oder anfragen.",
      "Ich sende die Details hier.",
      "Danke.",
    ],
    it: [
      "Ciao Taxi Ayud, siete disponibili?",
      "Vorrei prenotare o chiedere informazioni su un taxi.",
      "Invio qui i dettagli.",
      "Grazie.",
    ],
    pt: [
      "Olá Taxi Ayud, está disponível?",
      "Gostaria de reservar ou pedir informação sobre um táxi.",
      "Envio os detalhes por aqui.",
      "Obrigado.",
    ],
    nl: [
      "Hallo Taxi Ayud, bent u beschikbaar?",
      "Ik wil graag een taxi boeken of informatie vragen.",
      "Ik stuur de details hier.",
      "Dank u.",
    ],
    ar: [
      "مرحبا Taxi Ayud، هل أنت متاح؟",
      "أريد الحجز أو الاستفسار عن تاكسي.",
      "سأرسل التفاصيل هنا.",
      "شكرا.",
    ],
  };

  const text = [languageNotice(language), "", ...(linesByLanguage[language] ?? linesByLanguage.en!)].join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function whatsappUrl(options: WhatsAppOptions, language: LangCode) {
  const destination =
    options.result?.destination || options.destination.trim() || "destino por confirmar";
  const origin = options.result?.origin || options.origin.trim() || "origen por confirmar";
  const whatsappCopies = {
    es: {
      hello: "Hola Taxi Ayud, quiero reservar un taxi.",
      now: "Tipo: taxi ahora / disponibilidad inmediata",
      later: `Fecha y hora: ${dateLabel(options.date)} a las ${options.hour}h`,
      origin: "Origen",
      destination: "Destino",
      passengers: "Pasajeros",
      notes: "Notas",
      distance: "Distancia estimada",
      wait: "Espera",
      price: "Precio orientativo",
      fare: "Tarifa",
      askPrice: "Necesito que me confirmes precio y disponibilidad.",
      notCalculated:
        "🚕 La web no ha cerrado el precio exacto, pero no pasa nada: te envío la ruta para que me confirmes precio final y disponibilidad.",
      confirm: "¿Me confirmas disponibilidad?",
      thanks: "Gracias.",
    },
    en: {
      hello: "Hello Taxi Ayud, I would like to book a taxi.",
      now: "Type: taxi now / immediate availability",
      later: `Date and time: ${dateLabel(options.date)} at ${options.hour}`,
      origin: "Origin",
      destination: "Destination",
      passengers: "Passengers",
      notes: "Notes",
      distance: "Estimated distance",
      wait: "Wait",
      price: "Estimated price",
      fare: "Fare",
      askPrice: "Please confirm price and availability.",
      notCalculated:
        "🚕 The website did not finish the exact fare, but no worries: I am sending the route so you can confirm price and availability.",
      confirm: "Can you confirm availability?",
      thanks: "Thank you.",
    },
    fr: {
      hello: "Bonjour Taxi Ayud, je souhaite réserver un taxi.",
      now: "Type : taxi maintenant / disponibilité immédiate",
      later: `Date et heure : ${dateLabel(options.date)} à ${options.hour}`,
      origin: "Départ",
      destination: "Destination",
      passengers: "Passagers",
      notes: "Notes",
      distance: "Distance estimée",
      wait: "Attente",
      price: "Prix estimé",
      fare: "Tarif",
      askPrice: "Merci de confirmer le prix et la disponibilité.",
      notCalculated:
        "🚕 Le site n'a pas finalisé le prix exact, mais pas d'inquiétude : j'envoie l'itinéraire pour confirmer le prix et la disponibilité.",
      confirm: "Pouvez-vous confirmer la disponibilité ?",
      thanks: "Merci.",
    },
    ca: {
      hello: "Hola Taxi Ayud, vull reservar un taxi.",
      now: "Tipus: taxi ara / disponibilitat immediata",
      later: `Data i hora: ${dateLabel(options.date)} a les ${options.hour}h`,
      origin: "Origen",
      destination: "Destinació",
      passengers: "Passatgers",
      notes: "Notes",
      distance: "Distància estimada",
      wait: "Espera",
      price: "Preu orientatiu",
      fare: "Tarifa",
      askPrice: "Si us plau, confirma preu i disponibilitat.",
      notCalculated:
        "🚕 El web no ha tancat el preu exacte, però no passa res: envio la ruta per confirmar preu i disponibilitat.",
      confirm: "Em confirmes disponibilitat?",
      thanks: "Gràcies.",
    },
    de: {
      hello: "Hallo Taxi Ayud, ich möchte ein Taxi buchen.",
      now: "Art: Taxi jetzt / sofortige Verfügbarkeit",
      later: `Datum und Uhrzeit: ${dateLabel(options.date)} um ${options.hour}`,
      origin: "Abfahrt",
      destination: "Ziel",
      passengers: "Fahrgäste",
      notes: "Hinweise",
      distance: "Geschätzte Entfernung",
      wait: "Wartezeit",
      price: "Geschätzter Preis",
      fare: "Tarif",
      askPrice: "Bitte Preis und Verfügbarkeit bestätigen.",
      notCalculated:
        "🚕 Die Website konnte den genauen Preis nicht abschliessen, aber kein Problem: Ich sende die Route zur Bestätigung von Preis und Verfügbarkeit.",
      confirm: "Können Sie die Verfügbarkeit bestätigen?",
      thanks: "Danke.",
    },
    it: {
      hello: "Ciao Taxi Ayud, vorrei prenotare un taxi.",
      now: "Tipo: taxi ora / disponibilità immediata",
      later: `Data e ora: ${dateLabel(options.date)} alle ${options.hour}`,
      origin: "Origine",
      destination: "Destinazione",
      passengers: "Passeggeri",
      notes: "Note",
      distance: "Distanza stimata",
      wait: "Attesa",
      price: "Prezzo stimato",
      fare: "Tariffa",
      askPrice: "Per favore confermate prezzo e disponibilità.",
      notCalculated:
        "🚕 Il sito non ha chiuso il prezzo esatto, ma nessun problema: invio il percorso per confermare prezzo e disponibilità.",
      confirm: "Potete confermare la disponibilità?",
      thanks: "Grazie.",
    },
    pt: {
      hello: "Olá Taxi Ayud, gostaria de reservar um táxi.",
      now: "Tipo: táxi agora / disponibilidade imediata",
      later: `Data e hora: ${dateLabel(options.date)} às ${options.hour}`,
      origin: "Origem",
      destination: "Destino",
      passengers: "Passageiros",
      notes: "Notas",
      distance: "Distância estimada",
      wait: "Espera",
      price: "Preço estimado",
      fare: "Tarifa",
      askPrice: "Por favor confirme preço e disponibilidade.",
      notCalculated:
        "🚕 O site não fechou o preço exato, mas não há problema: envio a rota para confirmar preço e disponibilidade.",
      confirm: "Pode confirmar disponibilidade?",
      thanks: "Obrigado.",
    },
    nl: {
      hello: "Hallo Taxi Ayud, ik wil graag een taxi boeken.",
      now: "Type: taxi nu / direct beschikbaar",
      later: `Datum en tijd: ${dateLabel(options.date)} om ${options.hour}`,
      origin: "Vertrek",
      destination: "Bestemming",
      passengers: "Passagiers",
      notes: "Opmerkingen",
      distance: "Geschatte afstand",
      wait: "Wachttijd",
      price: "Geschatte prijs",
      fare: "Tarief",
      askPrice: "Kunt u prijs en beschikbaarheid bevestigen?",
      notCalculated:
        "🚕 De website kon de exacte prijs niet afronden, maar geen zorgen: ik stuur de route om prijs en beschikbaarheid te bevestigen.",
      confirm: "Kunt u de beschikbaarheid bevestigen?",
      thanks: "Dank u.",
    },
    ar: {
      hello: "مرحبا Taxi Ayud، أريد حجز تاكسي.",
      now: "النوع: تاكسي الآن / توفر فوري",
      later: `التاريخ والوقت: ${dateLabel(options.date)} الساعة ${options.hour}`,
      origin: "نقطة الانطلاق",
      destination: "الوجهة",
      passengers: "الركاب",
      notes: "ملاحظات",
      distance: "المسافة التقديرية",
      wait: "انتظار",
      price: "السعر التقديري",
      fare: "التعرفة",
      askPrice: "يرجى تأكيد السعر والتوفر.",
      notCalculated: "🚕 لم يغلق الموقع السعر الدقيق، لا تقلق: أرسل المسار لتأكيد السعر والتوفر.",
      confirm: "هل يمكنك تأكيد التوفر؟",
      thanks: "شكرا.",
    },
  };
  const whatsappCopy = whatsappCopies[language] ?? whatsappCopies.en;
  const modeLine = options.mode === "now" ? whatsappCopy.now : whatsappCopy.later;
  const locationLine = pickupLocationLine(options.pickupLocation);
  const notesLine = options.notes.trim() ? `${whatsappCopy.notes}: ${options.notes.trim()}` : "";

  const priceLines = options.result
    ? [
        `${whatsappCopy.distance}: ${formatKm(options.result.km)} km`,
        options.result.waitMinutes
          ? `${whatsappCopy.wait}: ${options.result.waitMinutes} min (${euro(options.result.waitPrice)})`
          : "",
        `${whatsappCopy.price}: ${euro(options.result.price)}`,
        `${whatsappCopy.fare}: ${options.result.tariffLabel}`,
      ].filter(Boolean)
    : [
        whatsappCopy.askPrice,
        whatsappCopy.notCalculated,
      ];

  const text = [
    languageNotice(language),
    "",
    whatsappCopy.hello,
    "",
    modeLine,
    `${whatsappCopy.origin}: ${origin}`,
    `${whatsappCopy.destination}: ${destination}`,
    `${whatsappCopy.passengers}: ${options.result?.passengers ?? options.passengers}`,
    locationLine,
    notesLine,
    "",
    ...priceLines,
    "",
    whatsappCopy.confirm,
    whatsappCopy.thanks,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function relatedSeoPages(currentPath: string | null) {
  return DEFAULT_SEO_LINKS
    .map(pageFromPath)
    .filter((page): page is SeoPage => page !== undefined && page.path !== currentPath)
    .slice(0, 6);
}

function SeoIntentSection({
  page,
  directUrl,
}: {
  page: SeoPage;
  directUrl: string;
}) {
  const relatedPages = relatedSeoPages(page.path);

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
              Reservar por WhatsApp
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
          {page.faq.slice(0, 3).map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      ) : null}
      <div className="internal-links" aria-label="Enlaces relacionados">
        {relatedPages.map((relatedPage) => (
          <a href={relatedPage.path} key={relatedPage.path}>
            {relatedPage.navLabel}
          </a>
        ))}
      </div>
    </section>
  );
}

function InternalLinksBand() {
  const pages = relatedSeoPages(null);

  return (
    <section className="internal-link-band" aria-label="Rutas principales de Taxi Ayud" data-animate>
      <p className="eyebrow compact">
        <Route aria-hidden="true" />
        Rutas principales
      </p>
      <div>
        {pages.map((page) => (
          <a href={page.path} key={page.path}>
            {page.navLabel}
          </a>
        ))}
      </div>
    </section>
  );
}

function CookieBanner({
  onAccept,
  onReject,
}: {
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="cookie-banner" role="dialog" aria-label="Aviso de cookies">
      <div>
        <strong>Privacidad y cookies</strong>
        <p>
          Usamos cookies técnicas para que la web funcione. Si aceptas, también podremos
          medir de forma anónima llamadas, WhatsApp y consultas de tarifa para mejorar el servicio.
        </p>
        <a href="#privacidad">Privacidad</a>
        <a href="#cookies">Cookies</a>
      </div>
      <div className="cookie-actions">
        <button type="button" className="btn btn-secondary" onClick={onReject}>
          Solo necesarias
        </button>
        <button type="button" className="btn btn-primary" onClick={onAccept}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

function LegalFooter() {
  return (
    <section className="legal-footer" aria-label="Información legal">
      <details id="aviso-legal">
        <summary>Aviso legal</summary>
        <p>
          Titular: {LEGAL.owner}, DNI/NIF {LEGAL.taxId}, con domicilio en {LEGAL.address}.
          Nombre comercial: {LEGAL.businessName}. Actividad: servicio de taxi y reservas de
          traslados en Calatayud y comarca. Teléfono de contacto: {CONTACT.phoneDisplay}.
        </p>
      </details>
      <details id="privacidad">
        <summary>Protección de datos y privacidad</summary>
        <p>
          Responsable: {LEGAL.owner}. Los datos que envíes por llamada, WhatsApp o formularios
          se usan únicamente para atender tu consulta, preparar la reserva, confirmar
          disponibilidad y gestionar el servicio solicitado. La base legal es tu solicitud o la
          relación precontractual/contractual. No se venden datos ni se publican datos personales.
          Puedes solicitar acceso, rectificación o supresión contactando por teléfono o WhatsApp.
        </p>
      </details>
      <details id="cookies">
        <summary>Política de cookies</summary>
        <p>
          La web utiliza cookies técnicas necesarias para recordar preferencias básicas. La
          medición anónima de la web solo se carga si aceptas las cookies y sirve para conocer
          eventos generales como clics en llamada, WhatsApp o consulta de tarifa, sin registrar
          mensajes, teléfonos ni direcciones personales.
        </p>
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
  const [filter, setFilter] = useState("");
  const [tariffLookupKey, setTariffLookupKey] = useState("ZARAGOZA");
  const [result, setResult] = useState<Result | null>(null);
  const [reviews, setReviews] = useState<ReviewsData>(GOOGLE_REVIEWS);
  const t = COPY[language];
  const currentSeoPage = activeSeoPage();
  const heroSeoPage = currentSeoPage ?? HOME_SEO_PAGE;
  const statsLabels = heroStatLabels[language];
  const touristCopy = touristSearchCopy[language];
  const heroStatsLocalized = [
    { value: "24h", label: statsLabels[0] },
    { value: "N.18", label: statsLabels[1] },
    { value: "+100", label: statsLabels[2] },
  ];

  const suggestions = useMemo(() => {
    const q = normalize(query);
    if (!q) {
      return featuredDestinations.map((key) => [key, TARIFAS[key]] as const);
    }
    return tariffEntries
      .filter(([name]) => !q || normalize(name).includes(q))
      .slice(0, 8);
  }, [query]);

  const filteredTariffs = useMemo(() => {
    const q = normalize(filter);
    return tariffEntries.filter(([name]) => !q || normalize(name).includes(q));
  }, [filter]);

  const lookupTariff = TARIFAS[tariffLookupKey];
  const activeDestination = query.trim() || displayName(selectedKey);
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
    const local = localAddressMatches(query);
    setDestinationSuggestions(local);

    if (query.trim().length < 3) return undefined;

    const timer = window.setTimeout(() => {
      fetchAddressSuggestions(query)
        .then((items) => {
          if (!ignore && items.length) setDestinationSuggestions(items);
        })
        .catch(() => undefined);
    }, 280);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    let ignore = false;

    fetchGoogleReviews()
      .then((data) => {
        if (!ignore && data) {
          setReviews({
            rating: data.rating,
            count: data.count,
            items: data.items?.length ? data.items : GOOGLE_REVIEWS.items,
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
      setSelectedDestinationPoint(item);
      setDestinationSuggestions([]);
    }
    setActiveAddressField(null);
    setResult(null);
    setRouteError("");
  }

  function useLookupDestination(key: string) {
    chooseDestination(key);
    document.getElementById("calculadora")?.scrollIntoView({ behavior: "smooth" });
  }

  async function calculate() {
    const key = destinationKeyFromInput(query);
    const originKey = destinationKeyFromInput(origin);
    const trimmedOrigin = origin.trim();
    const trimmedDestination = query.trim();

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

    if (originKey && TARIFAS[originKey] && isCalatayudOrigin(query)) {
      setSelectedKey(originKey);
      setResult(
        makeReverseResultForKey(originKey, {
          origin: trimmedOrigin,
          date,
          hour,
          passengers,
          waitMinutes,
          mode: bookingMode,
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
        selectedOriginPoint,
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
      setLocationStatus(
        language === "en"
          ? "Your browser cannot send location."
          : language === "fr"
            ? "Votre navigateur ne permet pas d'envoyer la position."
            : language === "ar"
              ? "المتصفح لا يسمح بإرسال الموقع."
              : "Tu navegador no permite enviar ubicación.",
      );
      return;
    }

    setLocationStatus(
      language === "en"
        ? "Requesting location..."
        : language === "fr"
          ? "Demande de position..."
          : language === "ar"
            ? "جار طلب الموقع..."
            : "Pidiendo ubicación...",
    );
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPickupLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setOrigin("Mi ubicación actual");
        setResult(null);
        setLocationStatus(
          language === "en"
            ? "Location ready to send by WhatsApp."
            : language === "fr"
              ? "Position prête à envoyer par WhatsApp."
              : language === "ar"
                ? "الموقع جاهز للإرسال عبر واتساب."
                : "Ubicación lista para enviar por WhatsApp.",
        );
      },
      () => {
        setLocationStatus(
          language === "en"
            ? "Location could not be detected. You can type the address."
            : language === "fr"
              ? "Position impossible à obtenir. Vous pouvez écrire l'adresse."
              : language === "ar"
                ? "تعذر الحصول على الموقع. يمكنك كتابة العنوان."
                : "No se pudo obtener la ubicación. Puedes escribir la dirección.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Taxi Ayud inicio">
          <img src="/assets/logo.webp" alt="" width="520" height="520" />
          <span>
            Taxi <strong>Ayud</strong>
          </span>
        </a>
        <nav className="main-nav" aria-label="Navegacion principal">
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
            aria-label="Idioma"
            value={language}
            onChange={(event) => setLanguage(event.target.value as LangCode)}
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
            <div className="hero-places" aria-label="Zonas de servicio destacadas">
              {regionHighlights.map((place) => (
                <span key={place}>
                  <MapPin aria-hidden="true" />
                  {place}
                </span>
              ))}
            </div>
          </div>

          <aside className="hero-booking-card" aria-label="Reserva rapida">
            <div className="rating-badge">
              <Star aria-hidden="true" />
              <strong>{reviews.rating}</strong>
              <span>Google · {reviews.count}</span>
            </div>
            <h2>{t.bookTitle}</h2>
            <p>{t.bookText}</p>
            <div className="hero-direct-options" aria-label="Opciones de contacto rapido">
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

        <section className="trust-strip" aria-label="Datos principales">
          <div>
            <WalletCards aria-hidden="true" />
            <span>{t.paymentTitle}</span>
            <p>{t.paymentText}</p>
          </div>
          <div>
            <TimerReset aria-hidden="true" />
            <span>{t.officialFare}</span>
            <p>{RATES.officialNotice}</p>
          </div>
          <div>
            <Star aria-hidden="true" />
            <span>{reviews.rating} {t.googleRating}</span>
            <p>{reviews.count} {t.googleText}</p>
          </div>
        </section>

        {currentSeoPage ? <SeoIntentSection page={currentSeoPage} directUrl={directUrl} /> : null}

        <section className="region-band" aria-label="Comarca de Calatayud" data-animate>
          <div className="region-copy">
            <p className="eyebrow compact">
              <MapPin aria-hidden="true" />
              {t.regionEyebrow}
            </p>
            <h2>{t.regionTitle}</h2>
            <p>{t.regionText}</p>
          </div>
          <div className="comfort-strip" aria-label="Comodidad del servicio">
            {[CheckCircle2, Luggage, ShieldCheck, MessageCircle].map((Icon, index) => (
              <div key={t.comfort[index]}>
                <Icon aria-hidden="true" />
                <span>{t.comfort[index]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="local-seo-section" aria-label="Taxi en Calatayud y comarca" data-animate>
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

        <section className="tourist-search-section" aria-label="Taxi para visitantes y alojamientos" data-animate>
          <div className="tourist-search-copy">
            <p className="eyebrow compact">
              <Languages aria-hidden="true" />
              {touristCopy.eyebrow}
            </p>
            <h2>{touristCopy.title}</h2>
            <p>{touristCopy.text}</p>
          </div>
          <div className="tourist-search-grid">
            {touristSearchPhrases.map((item) => (
              <span key={item.language}>
                <strong>{item.language}</strong>
                {item.query}
              </span>
            ))}
          </div>
        </section>

        <InternalLinksBand />

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
              <div className="mode-toggle" role="group" aria-label="Tipo de reserva">
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
                      onFocus={() => setActiveAddressField("origin")}
                      onBlur={() => window.setTimeout(() => setActiveAddressField(null), 120)}
                      onChange={(event) => {
                        setOrigin(event.target.value);
                        setSelectedOriginPoint(null);
                        setResult(null);
                        setRouteError("");
                      }}
                    />
                  </div>
                  {activeAddressField === "origin" && originSuggestions.length ? (
                    <div className="address-suggestions" aria-label="Sugerencias de origen">
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
                      value={query}
                      placeholder={t.destinationPlaceholder}
                      onFocus={() => setActiveAddressField("destination")}
                      onBlur={() => window.setTimeout(() => setActiveAddressField(null), 120)}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setSelectedDestinationPoint(null);
                        setResult(null);
                        setRouteError("");
                      }}
                    />
                  </div>
                  {activeAddressField === "destination" && destinationSuggestions.length ? (
                    <div className="address-suggestions" aria-label="Sugerencias de destino">
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

              <div className="suggestions compact" aria-label="Destinos sugeridos">
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
                  onClick={() => trackEvent("clic_whatsapp", { source: "calculator_now" })}
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

            <aside className="result-panel" id="resultado" aria-live="polite">
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
                      {result.passengers} {t.passengers.toLowerCase()}
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
                      onClick={() => {
                        trackEvent("clic_whatsapp", { source: "calculated_quote" });
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
                      onClick={() => trackEvent("clic_whatsapp", { source: "result_availability" })}
                    >
                      <LocateFixed aria-hidden="true" />
                      {t.seeAvailability}
                    </a>
                  </div>
                  <p className="small-note">
                    {t.quoteEstimate}. {RATES.officialNotice}.
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
                    href={whatsappUrl({
                      result: null,
                      origin,
                      destination: activeDestination,
                      date,
                      hour,
                      passengers,
                      mode: bookingMode,
                      notes,
                      pickupLocation,
                    }, language)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent("clic_whatsapp", { source: "result_without_calculation" })}
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
                  <div aria-label={`${reviewRating} estrellas`}>
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
                      <div aria-label={`${reviewRating} estrellas`}>
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

              <div className="quick-destinations" aria-label="Destinos rápidos">
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
          <span>Efectivo · Tarjeta · Bizum</span>
        </address>
      </footer>

      <LegalFooter />

      {cookieConsent === "pending" ? (
        <CookieBanner
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
