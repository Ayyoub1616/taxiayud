import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
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
  RATES,
  TARIFAS,
} from "./data";
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
  url?: string;
};

type ReviewsData = {
  rating: string;
  count: string;
  items: ReviewItem[];
  source?: string;
};

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

type LangCode = "es" | "en" | "fr" | "ar";

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

const LANGUAGE_OPTIONS: Record<LangCode, { label: string; short: string; whatsapp: string; dir: "ltr" | "rtl" }> = {
  es: { label: "Español", short: "ES", whatsapp: "Español", dir: "ltr" },
  en: { label: "English", short: "EN", whatsapp: "English", dir: "ltr" },
  fr: { label: "Français", short: "FR", whatsapp: "Français", dir: "ltr" },
  ar: { label: "العربية", short: "AR", whatsapp: "Arabic / العربية", dir: "rtl" },
};

const COPY: Record<LangCode, Copy> = {
  es: {
    nav: ["WhatsApp", "Calcular", "Reseñas", "Servicios", "Tarifas"],
    directWhatsapp: "WhatsApp directo",
    calculatePrice: "Calcular precio",
    call: "Llamar",
    heroEyebrow: "Taxi oficial en Calatayud · Licencia 18",
    heroSubtitle:
      "Traslados premium desde Calatayud a Monasterio de Piedra, balnearios, Zaragoza, aeropuerto, El Pilar, estación y pueblos de la comarca.",
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
    regionTitle: "Calatayud, Monasterio de Piedra, El Pilar y balnearios sin complicarte",
    regionText:
      "Servicio puntual, cómodo y discreto para moverte por Calatayud, Zaragoza y toda la comarca con maletas, familia o visitas turísticas.",
    comfort: ["Conducción tranquila", "Maletero amplio", "Taxi oficial", "Reserva por WhatsApp"],
    seoEyebrow: "Taxi local premium",
    seoTitle: "El taxi de confianza para Calatayud y la zona",
    seoText:
      "Rutas frecuentes con recogida en estación, hoteles, Plaza del Fuerte, Monasterio de Piedra, balnearios, Zaragoza, El Pilar y aeropuerto.",
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
        title: "Zaragoza, El Pilar y aeropuerto",
        text: "Viajes a Delicias, Aeropuerto de Zaragoza, hospitales y centro.",
      },
      {
        title: "Balnearios y comarca",
        text: "Jaraba, Alhama de Aragón, Paracuellos, Ateca, Maluenda y pueblos.",
      },
    ],
    calcEyebrow: "Reserva y presupuesto",
    calcTitle: "Calcula la ruta y envía el mensaje listo",
    calcText:
      "La web calcula destinos habituales desde Calatayud con tarifa oficial y rutas exactas con autocompletado cuando OpenRouteService está configurado.",
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
    routeError: "No se pudo calcular la ruta exacta. Puedes consultar por WhatsApp.",
    resultDistance: "Distancia estimada",
    quoteEstimate: "Presupuesto orientativo",
    quoteOfficial: "Calculado con tarifa oficial y distancia estimada.",
    bookWithMessage: "Reservar con mensaje",
    seeAvailability: "Ver disponibilidad ahora",
    emptyResult:
      "Pulsa calcular precio para ver un presupuesto orientativo. Si prefieres, puedes consultar por WhatsApp sin calcular.",
    exactRouteFallback:
      "Para rutas exactas, la web quedará lista al configurar OpenRouteService en Vercel. Mientras tanto puedes consultar por WhatsApp.",
    apiPrivateNote:
      "Alternativa preparada: OpenRouteService con clave privada en Vercel, sin exponerla en el navegador.",
    whatsappQuote: "Presupuesto por WhatsApp",
    reviewsEyebrow: "Reseñas de Google",
    reviewsText:
      "Opiniones públicas del perfil de Google de Taxi Ayud. La última reseña aparece destacada y el resto queda ordenado debajo.",
    reviewsWith: "con",
    featuredReview: "Última reseña destacada",
    moreReviews: "Ver más reseñas",
    viewGoogle: "Ver perfil de Google",
    servicesEyebrow: "Servicios",
    servicesTitle: "Viajes habituales en Calatayud y comarca",
    servicesText:
      "Un taxi para trayectos cortos, rutas turísticas, aeropuertos, estaciones, citas médicas y desplazamientos de empresa.",
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
      "Premium transfers from Calatayud to Monasterio de Piedra, spas, Zaragoza, airport, El Pilar, train stations and local villages.",
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
    regionTitle: "Calatayud, Monasterio de Piedra, El Pilar and spas made easy",
    regionText:
      "A punctual, comfortable and discreet service for Calatayud, Zaragoza and the surrounding area with luggage, family or tourism plans.",
    comfort: ["Smooth driving", "Large boot", "Official taxi", "WhatsApp booking"],
    seoEyebrow: "Premium local taxi",
    seoTitle: "The trusted taxi for Calatayud and the area",
    seoText:
      "Frequent pick-ups at the station, hotels, Plaza del Fuerte, Monasterio de Piedra, spas, Zaragoza, El Pilar and the airport.",
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
        title: "Zaragoza, El Pilar and airport",
        text: "Trips to Delicias, Zaragoza Airport, hospitals and city centre.",
      },
      {
        title: "Spas and local villages",
        text: "Jaraba, Alhama de Aragon, Paracuellos, Ateca, Maluenda and nearby towns.",
      },
    ],
    calcEyebrow: "Booking and quote",
    calcTitle: "Calculate the route and send a ready message",
    calcText:
      "The site calculates common destinations from Calatayud with official fares and exact routes with autocomplete when OpenRouteService is configured.",
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
    routeError: "The exact route could not be calculated. You can ask by WhatsApp.",
    resultDistance: "Estimated distance",
    quoteEstimate: "Estimated quote",
    quoteOfficial: "Calculated with official fare and estimated distance.",
    bookWithMessage: "Book with message",
    seeAvailability: "Check availability now",
    emptyResult:
      "Tap calculate fare to see an estimated quote. You can also ask by WhatsApp without calculating.",
    exactRouteFallback:
      "Exact routes will work when OpenRouteService is configured in Vercel. For now you can ask by WhatsApp.",
    apiPrivateNote:
      "Ready option: OpenRouteService with a private key in Vercel, never exposed in the browser.",
    whatsappQuote: "WhatsApp quote",
    reviewsEyebrow: "Google reviews",
    reviewsText:
      "Public reviews from Taxi Ayud's Google profile. The latest review is highlighted and the rest are available below.",
    reviewsWith: "with",
    featuredReview: "Latest featured review",
    moreReviews: "See more reviews",
    viewGoogle: "View Google profile",
    servicesEyebrow: "Services",
    servicesTitle: "Regular journeys in Calatayud and the area",
    servicesText:
      "Taxi service for short trips, tourism routes, airports, train stations, medical appointments and business transfers.",
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
      "Transferts premium depuis Calatayud vers le Monasterio de Piedra, les thermes, Saragosse, l'aéroport, El Pilar, la gare et les villages.",
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
    regionTitle: "Calatayud, Monasterio de Piedra, El Pilar et thermes sans complication",
    regionText:
      "Service ponctuel, confortable et discret pour Calatayud, Saragosse et toute la région avec bagages, famille ou visites.",
    comfort: ["Conduite tranquille", "Grand coffre", "Taxi officiel", "Réservation WhatsApp"],
    seoEyebrow: "Taxi local premium",
    seoTitle: "Le taxi de confiance pour Calatayud et la région",
    seoText:
      "Trajets fréquents depuis la gare, hôtels, Plaza del Fuerte, Monasterio de Piedra, thermes, Saragosse, El Pilar et l'aéroport.",
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
        title: "Saragosse, El Pilar et aéroport",
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
      "Le site calcule les destinations habituelles depuis Calatayud avec tarif officiel et les routes exactes avec autocomplétion si OpenRouteService est configuré.",
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
    routeError: "L'itinéraire exact n'a pas pu être calculé. Vous pouvez demander par WhatsApp.",
    resultDistance: "Distance estimée",
    quoteEstimate: "Estimation",
    quoteOfficial: "Calculé avec le tarif officiel et la distance estimée.",
    bookWithMessage: "Réserver avec message",
    seeAvailability: "Voir disponibilité",
    emptyResult: "Appuyez sur calculer pour voir une estimation ou demandez par WhatsApp.",
    exactRouteFallback: "Les itinéraires exacts fonctionneront avec OpenRouteService configuré dans Vercel.",
    apiPrivateNote:
      "Option prête : OpenRouteService avec clé privée dans Vercel, sans l'exposer dans le navigateur.",
    whatsappQuote: "Estimation WhatsApp",
    reviewsEyebrow: "Avis Google",
    reviewsText: "Avis publics du profil Google de Taxi Ayud. Le dernier avis est mis en avant.",
    reviewsWith: "avec",
    featuredReview: "Dernier avis mis en avant",
    moreReviews: "Voir plus d'avis",
    viewGoogle: "Voir le profil Google",
    servicesEyebrow: "Services",
    servicesTitle: "Trajets habituels à Calatayud et dans la région",
    servicesText: "Taxi pour courts trajets, tourisme, aéroports, gares, rendez-vous médicaux et entreprises.",
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
      "تنقلات مريحة من كالاتايود إلى دير الحجر، المنتجعات، سرقسطة، المطار، إل بيلار، المحطة وقرى المنطقة.",
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
    regionTitle: "كالاتايود، دير الحجر، إل بيلار والمنتجعات بسهولة",
    regionText: "خدمة دقيقة ومريحة للتنقل في كالاتايود وسرقسطة والمنطقة مع حقائب أو عائلة أو سياحة.",
    comfort: ["قيادة هادئة", "صندوق واسع", "تاكسي رسمي", "حجز واتساب"],
    seoEyebrow: "تاكسي محلي مميز",
    seoTitle: "تاكسي موثوق في كالاتايود والمنطقة",
    seoText: "رحلات متكررة من المحطة، الفنادق، Plaza del Fuerte، دير الحجر، المنتجعات، سرقسطة، إل بيلار والمطار.",
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
        title: "سرقسطة، إل بيلار والمطار",
        text: "رحلات إلى Delicias ومطار سرقسطة والمستشفيات والمركز.",
      },
      {
        title: "المنتجعات وقرى المنطقة",
        text: "Jaraba وAlhama de Aragon وParacuellos وAteca وMaluenda والقرى القريبة.",
      },
    ],
    calcEyebrow: "حجز وتقدير",
    calcTitle: "احسب المسار وأرسل رسالة جاهزة",
    calcText: "تحسب الصفحة الوجهات الشائعة من كالاتايود بالتعرفة الرسمية والمسارات الدقيقة عند تفعيل OpenRouteService.",
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
    routeError: "تعذر حساب المسار بدقة. يمكنك الاستفسار عبر واتساب.",
    resultDistance: "المسافة التقديرية",
    quoteEstimate: "تقدير السعر",
    quoteOfficial: "محسوب بالتعرفة الرسمية والمسافة التقديرية.",
    bookWithMessage: "احجز برسالة",
    seeAvailability: "تحقق من التوفر الآن",
    emptyResult: "اضغط احسب السعر لرؤية تقدير أو اسأل عبر واتساب بدون حساب.",
    exactRouteFallback: "المسارات الدقيقة تعمل بعد تفعيل OpenRouteService في Vercel.",
    apiPrivateNote: "الخيار جاهز: OpenRouteService بمفتاح خاص في Vercel دون ظهوره في المتصفح.",
    whatsappQuote: "تقدير عبر واتساب",
    reviewsEyebrow: "تقييمات Google",
    reviewsText: "تقييمات عامة من ملف Taxi Ayud على Google. آخر تقييم يظهر أولا.",
    reviewsWith: "مع",
    featuredReview: "آخر تقييم مميز",
    moreReviews: "عرض المزيد من التقييمات",
    viewGoogle: "عرض ملف Google",
    servicesEyebrow: "الخدمات",
    servicesTitle: "رحلات شائعة في كالاتايود والمنطقة",
    servicesText: "تاكسي للرحلات القصيرة، السياحة، المطارات، المحطات، المواعيد الطبية والتنقلات المهنية.",
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
};

const regionHighlights = [
  "Calatayud",
  "Monasterio de Piedra",
  "Balnearios",
  "Comarca",
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
  "Calatayud",
  "Plaza del Fuerte, Calatayud",
  "Estación de tren de Calatayud",
  "Hospital Ernest Lluch, Calatayud",
  "Monasterio de Piedra, Nuévalos",
  "Balneario Sicilia, Jaraba",
  "Balneario Serón, Jaraba",
  "Balneario Termas Pallarés, Alhama de Aragón",
  "Estación Zaragoza-Delicias",
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
  if (language.startsWith("fr")) return "fr";
  if (language.startsWith("ar")) return "ar";
  return "en";
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
  const response = await fetch("/api/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origin, destination, originPoint, destinationPoint }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.km) {
    throw new Error(data?.message || "No se pudo calcular la ruta exacta.");
  }

  return data as ExactRouteResponse;
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
  const linesByLanguage: Record<LangCode, string[]> = {
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
    ar: [
      "مرحبا Taxi Ayud، هل أنت متاح؟",
      "أريد الحجز أو الاستفسار عن تاكسي.",
      "سأرسل التفاصيل هنا.",
      "شكرا.",
    ],
  };

  const text = [languageNotice(language), "", ...linesByLanguage[language]].join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function whatsappUrl(options: WhatsAppOptions, language: LangCode) {
  const destination =
    options.result?.destination || options.destination.trim() || "destino por confirmar";
  const origin = options.result?.origin || options.origin.trim() || "origen por confirmar";
  const whatsappCopy = {
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
      notCalculated: "La ruta no está calculada automáticamente en la web.",
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
      notCalculated: "The route was not automatically calculated on the website.",
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
      notCalculated: "L'itinéraire n'a pas été calculé automatiquement sur le site.",
      confirm: "Pouvez-vous confirmer la disponibilité ?",
      thanks: "Merci.",
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
      notCalculated: "لم يتم حساب المسار تلقائيا في الموقع.",
      confirm: "هل يمكنك تأكيد التوفر؟",
      thanks: "شكرا.",
    },
  }[language];
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

function App() {
  const [language, setLanguage] = useState<LangCode>(() => detectLanguage());
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
  const heroStatsLocalized = [
    { value: "24h", label: language === "es" ? "reservas" : language === "fr" ? "réservations" : language === "ar" ? "حجز" : "bookings" },
    { value: "N.18", label: language === "es" ? "licencia" : language === "fr" ? "licence" : language === "ar" ? "رخصة" : "licence" },
    { value: "+100", label: language === "es" ? "destinos" : language === "fr" ? "destinations" : language === "ar" ? "وجهات" : "destinations" },
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
    document.documentElement.lang = language;
    document.documentElement.dir = LANGUAGE_OPTIONS[language].dir;
    try {
      window.localStorage.setItem("taxiayud-language", language);
    } catch {
      // Ignore storage errors in private browsing.
    }
  }, [language]);

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
    const trimmedOrigin = origin.trim();
    const trimmedDestination = query.trim();

    setRouteError("");

    if (key && TARIFAS[key] && isCalatayudOrigin(origin)) {
      setSelectedKey(key);
      setQuery(displayName(key));
      setResult(resultForKey(key));
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
      setRouteError(
        error instanceof Error
          ? error.message
          : t.routeError,
      );
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
        <a className="brand" href="#inicio" aria-label="Taxi Ayud inicio">
          <img src="/assets/logo.webp" alt="" />
          <span>
            Taxi <strong>Ayud</strong>
          </span>
        </a>
        <nav className="main-nav" aria-label="Navegacion principal">
          <a href={directUrl} target="_blank" rel="noreferrer">{t.nav[0]}</a>
          <a href="#calculadora">{t.nav[1]}</a>
          <a href="#resenas">{t.nav[2]}</a>
          <a href="#servicios">{t.nav[3]}</a>
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
        <a className="header-call" href={CONTACT.phoneHref}>
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
              {t.heroEyebrow}
            </p>
            <h1>Taxi Ayud</h1>
            <p className="hero-subtitle">{t.heroSubtitle}</p>
            <div className="hero-actions">
              <a className="btn btn-whatsapp" href={directUrl} target="_blank" rel="noreferrer">
                <Send aria-hidden="true" />
                {t.directWhatsapp}
              </a>
              <a className="btn btn-primary" href="#calculadora">
                <Route aria-hidden="true" />
                {t.calculatePrice}
              </a>
              <a className="btn btn-secondary" href={CONTACT.phoneHref}>
                <Phone aria-hidden="true" />
                {t.call}
              </a>
            </div>
            <figure className="mobile-hero-car" aria-label="Peugeot 408 Hybrid Taxi Ayud">
              <img src="/assets/peugeot-408-hybrid.webp" alt="Taxi Ayud Peugeot 408 Hybrid blanco" />
            </figure>
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
              <a className="btn btn-whatsapp" href={directUrl} target="_blank" rel="noreferrer">
                <Send aria-hidden="true" />
                {t.sendWhatsapp}
              </a>
              <a className="btn btn-secondary" href="#calculadora">
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

        <section className="region-band" aria-label="Comarca de Calatayud">
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

        <section className="local-seo-section" aria-label="Taxi en Calatayud y comarca">
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

        <section className="section calc-section" id="calculadora">
          <div className="section-heading">
            <p className="eyebrow compact">
              <Route aria-hidden="true" />
              {t.calcEyebrow}
            </p>
            <h2>{t.calcTitle}</h2>
            <p>{t.calcText}</p>
          </div>

          <div className="calc-layout">
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
                <a className="btn btn-whatsapp" href={instantUrl} target="_blank" rel="noreferrer">
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
                    >
                      <MessageCircle aria-hidden="true" />
                      {t.bookWithMessage}
                    </a>
                    <a className="btn btn-secondary" href={instantUrl} target="_blank" rel="noreferrer">
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

        <section className="section reviews-section" id="resenas">
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
            >
              <Star aria-hidden="true" />
              {t.viewGoogle}
            </a>
          </div>
          <div className="reviews-stack">
            {reviews.items.slice(0, 1).map((review) => {
              const reviewRating = Math.max(1, Math.min(5, Math.round(review.rating || 5)));

              return (
                <article className="review-card featured-review" key={`${review.author}-${review.text}`}>
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
                    <article className="review-card" key={`${review.author}-${review.text}`}>
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
                <article className="service-card" key={service.title}>
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
                  <article className="service-card" key={service.title}>
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

        <section className="section vehicle-section" id="vehiculo">
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

          <div className="tariff-lookup">
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
                onClick={() => useLookupDestination(tariffLookupKey)}
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

        <section className="closing-band">
          <img src="/assets/taxi-light.webp" alt="" />
          <div>
            <p className="eyebrow compact">
              <Phone aria-hidden="true" />
              {t.closingEyebrow}
            </p>
            <h2>{t.closingTitle}</h2>
            <p>{t.closingText}</p>
          </div>
          <div className="closing-actions">
            <a className="btn btn-primary" href={CONTACT.phoneHref}>
              <Phone aria-hidden="true" />
              {CONTACT.phoneDisplay}
            </a>
            <a
              className="btn btn-whatsapp"
              href={directUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <img src="/assets/logo.webp" alt="" />
          <p>
            <strong>Taxi Ayud</strong>
            <br />
            {t.footerText} {CONTACT.license}.
          </p>
        </div>
        <ul>
          {t.footerLinks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <address>
          <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
          <span>{CONTACT.place}</span>
          <span>Efectivo · Tarjeta · Bizum</span>
        </address>
      </footer>

      <a
        className="floating-whatsapp"
        href={directUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={t.floatingWhatsapp}
      >
        <MessageCircle aria-hidden="true" />
      </a>
    </>
  );
}

function CalculatorIcon() {
  return <Route aria-hidden="true" />;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
