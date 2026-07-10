import React, { useMemo, useState } from "react";
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
  SERVICES,
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

const heroStats = [
  { value: "24h", label: "reservas" },
  { value: "N.18", label: "licencia" },
  { value: "+100", label: "destinos" },
];

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

async function fetchExactRoute(origin: string, destination: string) {
  const response = await fetch("/api/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ origin, destination }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.km) {
    throw new Error(data?.message || "No se pudo calcular la ruta exacta.");
  }

  return data as ExactRouteResponse;
}

function pickupLocationLine(pickupLocation: PickupLocation) {
  if (!pickupLocation) return "";
  return `Ubicación de recogida: https://maps.google.com/?q=${pickupLocation.lat.toFixed(
    6,
  )},${pickupLocation.lng.toFixed(6)}`;
}

function whatsappDirectUrl() {
  const text = [
    "Hola Taxi Ayud, ¿estás disponible?",
    "Quiero hablar para reservar o consultar un taxi.",
    "Te envío los detalles por aquí.",
    "Gracias.",
  ].join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function whatsappUrl(options: WhatsAppOptions) {
  const destination =
    options.result?.destination || options.destination.trim() || "destino por confirmar";
  const origin = options.result?.origin || options.origin.trim() || "origen por confirmar";
  const modeLine =
    options.mode === "now"
      ? "Tipo: taxi ahora / disponibilidad inmediata"
      : `Fecha y hora: ${dateLabel(options.date)} a las ${options.hour}h`;
  const locationLine = pickupLocationLine(options.pickupLocation);
  const notesLine = options.notes.trim() ? `Notas: ${options.notes.trim()}` : "";

  const priceLines = options.result
    ? [
        `Distancia estimada: ${formatKm(options.result.km)} km`,
        options.result.waitMinutes
          ? `Espera: ${options.result.waitMinutes} min (${euro(options.result.waitPrice)})`
          : "",
        `Precio orientativo: ${euro(options.result.price)}`,
        `Tarifa: ${options.result.tariffLabel}`,
      ].filter(Boolean)
    : [
        "Necesito que me confirmes precio y disponibilidad.",
        "La ruta no está calculada automáticamente en la web.",
      ];

  const text = [
    "Hola Taxi Ayud, quiero reservar un taxi.",
    "",
    modeLine,
    `Origen: ${origin}`,
    `Destino: ${destination}`,
    `Pasajeros: ${options.result?.passengers ?? options.passengers}`,
    locationLine,
    notesLine,
    "",
    ...priceLines,
    "",
    "¿Me confirmas disponibilidad?",
    "Gracias.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function App() {
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
  const [filter, setFilter] = useState("");
  const [tariffLookupKey, setTariffLookupKey] = useState("ZARAGOZA");
  const [result, setResult] = useState<Result | null>(null);

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
  const directUrl = whatsappDirectUrl();
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
  });
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
  });

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
      return;
    }

    if (!trimmedOrigin || !trimmedDestination) {
      setResult(null);
      setRouteError("Indica origen y destino para calcular una ruta exacta.");
      return;
    }

    setRouteLoading(true);
    try {
      const route = await fetchExactRoute(trimmedOrigin, trimmedDestination);
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
    } catch (error) {
      setResult(null);
      setRouteError(
        error instanceof Error
          ? error.message
          : "No se pudo calcular la ruta exacta. Puedes consultar por WhatsApp.",
      );
    } finally {
      setRouteLoading(false);
    }
  }

  function requestPickupLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Tu navegador no permite enviar ubicación.");
      return;
    }

    setLocationStatus("Pidiendo ubicación...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPickupLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setOrigin("Mi ubicación actual");
        setResult(null);
        setLocationStatus("Ubicación lista para enviar por WhatsApp.");
      },
      () => {
        setLocationStatus("No se pudo obtener la ubicación. Puedes escribir la dirección.");
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
          <a href={directUrl} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="#calculadora">Calcular</a>
          <a href="#resenas">Reseñas</a>
          <a href="#servicios">Servicios</a>
          <a href="#tarifas">Tarifas</a>
        </nav>
        <a className="header-call" href={CONTACT.phoneHref}>
          <Phone aria-hidden="true" />
          {CONTACT.phoneDisplay}
        </a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-media" aria-hidden="true" />
          <div className="hero-content">
            <p className="eyebrow">
              <BadgeCheck aria-hidden="true" />
              Taxi oficial en Calatayud · Licencia 18
            </p>
            <h1>Taxi Ayud</h1>
            <p className="hero-subtitle">
              Traslados desde Calatayud a Monasterio de Piedra, balnearios,
              Zaragoza, aeropuerto, tren y pueblos de la comarca. Contacto
              directo por WhatsApp o presupuesto orientativo si quieres calcular.
            </p>
            <div className="hero-actions">
              <a className="btn btn-whatsapp" href={directUrl} target="_blank" rel="noreferrer">
                <Send aria-hidden="true" />
                WhatsApp directo
              </a>
              <a className="btn btn-primary" href="#calculadora">
                <Route aria-hidden="true" />
                Calcular precio
              </a>
              <a className="btn btn-secondary" href={CONTACT.phoneHref}>
                <Phone aria-hidden="true" />
                Llamar
              </a>
            </div>
            <dl className="hero-stats">
              {heroStats.map((item) => (
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
              <strong>{GOOGLE_REVIEWS.rating}</strong>
              <span>Google · {GOOGLE_REVIEWS.count}</span>
            </div>
            <h2>Reserva directa, sin formularios largos</h2>
            <p>
              Manda un mensaje directo si solo quieres hablar, consultar
              disponibilidad o pedir taxi ahora. La calculadora queda abajo para
              presupuestos orientativos.
            </p>
            <div className="hero-direct-options" aria-label="Opciones de contacto rapido">
              <span>
                <MessageCircle aria-hidden="true" />
                Sin calcular ruta
              </span>
              <span>
                <Clock3 aria-hidden="true" />
                Respuesta rápida
              </span>
              <span>
                <LocateFixed aria-hidden="true" />
                Taxi ahora
              </span>
            </div>
            <div className="hero-card-actions">
              <a className="btn btn-whatsapp" href={directUrl} target="_blank" rel="noreferrer">
                <Send aria-hidden="true" />
                Enviar WhatsApp
              </a>
              <a className="btn btn-secondary" href="#calculadora">
                <Route aria-hidden="true" />
                Ver presupuesto
              </a>
            </div>
          </aside>
        </section>

        <section className="trust-strip" aria-label="Datos principales">
          <div>
            <WalletCards aria-hidden="true" />
            <span>Pago flexible</span>
            <p>Efectivo · Tarjeta · Bizum · Apple Pay · Google Pay</p>
          </div>
          <div>
            <TimerReset aria-hidden="true" />
            <span>Tarifa oficial</span>
            <p>{RATES.officialNotice}</p>
          </div>
          <div>
            <Star aria-hidden="true" />
            <span>{GOOGLE_REVIEWS.rating} en Google</span>
            <p>{GOOGLE_REVIEWS.count} públicas en el perfil de empresa</p>
          </div>
        </section>

        <section className="region-band" aria-label="Comarca de Calatayud">
          <div className="region-copy">
            <p className="eyebrow compact">
              <MapPin aria-hidden="true" />
              Comarca de Calatayud
            </p>
            <h2>Calatayud, Monasterio de Piedra y balnearios sin complicarte</h2>
            <p>
              Viajes tranquilos por la comarca, recogida puntual y coche cómodo
              para moverte con maletas, familia o visitas turísticas.
            </p>
          </div>
          <div className="comfort-strip" aria-label="Comodidad del servicio">
            <div>
              <CheckCircle2 aria-hidden="true" />
              <span>Conducción tranquila</span>
            </div>
            <div>
              <Luggage aria-hidden="true" />
              <span>Maletero amplio</span>
            </div>
            <div>
              <ShieldCheck aria-hidden="true" />
              <span>Taxi oficial</span>
            </div>
            <div>
              <MessageCircle aria-hidden="true" />
              <span>Reserva por WhatsApp</span>
            </div>
          </div>
        </section>

        <section className="section calc-section" id="calculadora">
          <div className="section-heading">
            <p className="eyebrow compact">
              <Route aria-hidden="true" />
              Reserva y presupuesto
            </p>
            <h2>Calcula la ruta y envía el mensaje listo</h2>
            <p>
              La web calcula destinos habituales desde Calatayud con tarifa
              oficial. Para direcciones exactas fuera de la tabla, se envía la
              consulta por WhatsApp.
            </p>
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
                  Programar
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
                  Ahora
                </button>
              </div>

              <div className="route-inputs">
                <label>
                  <span className="field-label">Origen</span>
                  <div className="search-field">
                    <MapPinned aria-hidden="true" />
                    <input
                      value={origin}
                      placeholder="Calatayud, hotel, estación..."
                      onChange={(event) => {
                        setOrigin(event.target.value);
                        setResult(null);
                        setRouteError("");
                      }}
                    />
                  </div>
                </label>
                <label>
                  <span className="field-label">Destino</span>
                  <div className="search-field">
                    <Search aria-hidden="true" />
                    <input
                      id="destination-search"
                      value={query}
                      list="destination-options"
                      placeholder="Zaragoza, Monasterio, Jaraba..."
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setResult(null);
                        setRouteError("");
                      }}
                    />
                  </div>
                </label>
                <datalist id="destination-options">
                  {tariffEntries.map(([key]) => (
                    <option value={displayName(key)} key={key} />
                  ))}
                </datalist>
              </div>

              <div className="suggestions compact" aria-label="Destinos sugeridos">
                {suggestions.slice(0, 6).map(([key, tariff]) => (
                  <button
                    key={key}
                    type="button"
                    className={selectedKey === key ? "active" : ""}
                    onClick={() => chooseDestination(key)}
                  >
                    <span>{displayName(key)}</span>
                    <small>{formatKm(tariff.km)} km</small>
                  </button>
                ))}
              </div>

              <div className="form-grid">
                {bookingMode === "later" ? (
                  <>
                    <label>
                      <span className="field-label">Fecha</span>
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
                      <span className="field-label">Hora</span>
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
                    <span>Se enviará como disponibilidad inmediata.</span>
                  </div>
                )}
                <label>
                  <span className="field-label">Pasajeros</span>
                  <select
                    value={passengers}
                    onChange={(event) => {
                      setPassengers(Number(event.target.value));
                      setResult(null);
                      setRouteError("");
                    }}
                  >
                    <option value={1}>1 pasajero</option>
                    <option value={2}>2 pasajeros</option>
                    <option value={3}>3 pasajeros</option>
                    <option value={4}>4 pasajeros</option>
                  </select>
                </label>
                <label>
                  <span className="field-label">Espera opcional</span>
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
                <span className="field-label">Notas</span>
                <input
                  value={notes}
                  placeholder="Tren, maletas, hotel, vuelta..."
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>

              <div className="location-row">
                <button className="btn btn-secondary" type="button" onClick={requestPickupLocation}>
                  <LocateFixed aria-hidden="true" />
                  Enviar mi ubicación
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
                  {routeLoading ? "Calculando..." : "Calcular precio"}
                </button>
                <a className="btn btn-whatsapp" href={instantUrl} target="_blank" rel="noreferrer">
                  <Send aria-hidden="true" />
                  Taxi ahora
                </a>
              </div>
              {!canAutoCalculate ? (
                <p className="api-note">
                  Para calcular cualquier dirección exacta automáticamente hace
                  falta configurar OpenRouteService en Vercel.
                </p>
              ) : null}
            </div>

            <aside className="result-panel" aria-live="polite">
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
                      Distancia estimada {formatKm(result.km)} km
                    </li>
                    <li>
                      <CalendarDays aria-hidden="true" />
                      {result.mode === "now"
                        ? "Disponibilidad inmediata"
                        : `${result.dateLabel} · ${result.hour}h`}{" "}
                      · {result.reason}
                    </li>
                    <li>
                      <Users aria-hidden="true" />
                      {result.passengers} pasajero{result.passengers > 1 ? "s" : ""}
                    </li>
                    {result.waitMinutes ? (
                      <li>
                        <TimerReset aria-hidden="true" />
                        Espera {result.waitMinutes} min · {euro(result.waitPrice)}
                      </li>
                    ) : null}
                  </ul>
                  <div className="price-note-box">
                    <span>Presupuesto orientativo</span>
                    <strong>Calculado con tarifa oficial y distancia estimada.</strong>
                  </div>
                  <div className="result-actions">
                    <a
                      className="btn btn-whatsapp"
                      href={quoteUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle aria-hidden="true" />
                      Reservar con mensaje
                    </a>
                    <a className="btn btn-secondary" href={instantUrl} target="_blank" rel="noreferrer">
                      <LocateFixed aria-hidden="true" />
                      Ver disponibilidad ahora
                    </a>
                  </div>
                  <p className="small-note">
                    Precio orientativo. El importe final lo marca el taxímetro
                    homologado. {RATES.officialNotice}.
                  </p>
                </>
              ) : (
                <>
                  <div className="result-kicker">
                    <MessageSquareText aria-hidden="true" />
                    Presupuesto por WhatsApp
                  </div>
                  <p className="result-route">
                    {origin || "Origen"} <ArrowRight aria-hidden="true" />{" "}
                    {activeDestination || "Destino"}
                  </p>
                  <p className="empty-result">
                    {routeError ||
                    (canAutoCalculate
                      ? "Pulsa calcular precio para ver un presupuesto orientativo. Si prefieres, puedes consultar por WhatsApp sin calcular."
                      : "Para rutas exactas, la web quedará lista al configurar OpenRouteService en Vercel. Mientras tanto puedes consultar por WhatsApp.")}
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
                    })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Send aria-hidden="true" />
                    Consultar por WhatsApp
                  </a>
                  <p className="small-note">
                    Alternativa preparada: OpenRouteService con clave privada
                    en Vercel, sin exponerla en el navegador.
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
              Reseñas de Google
            </p>
            <h2>{GOOGLE_REVIEWS.rating} con {GOOGLE_REVIEWS.count}</h2>
            <p>
              Opiniones públicas vistas en el perfil de Google de Taxi Ayud.
              Una capa rápida de confianza antes de llamar o reservar.
            </p>
            <a
              className="btn btn-secondary"
              href={CONTACT.googleProfile}
              target="_blank"
              rel="noreferrer"
            >
              <Star aria-hidden="true" />
              Ver perfil de Google
            </a>
          </div>
          <div className="review-cards">
            {GOOGLE_REVIEWS.items.map((review) => (
              <article className="review-card" key={review.author}>
                <div aria-label="5 estrellas">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star aria-hidden="true" key={index} />
                  ))}
                </div>
                <p>"{review.text}"</p>
                <span>{review.author}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section service-section" id="servicios">
          <div className="section-heading">
            <p className="eyebrow compact">
              <CarFront aria-hidden="true" />
              Servicios
            </p>
            <h2>Viajes habituales en Calatayud y comarca</h2>
            <p>
              Un taxi para trayectos cortos, rutas turísticas, aeropuertos,
              estaciones, citas médicas y desplazamientos de empresa.
            </p>
          </div>
          <div className="service-grid">
            {SERVICES.slice(0, 4).map((service, index) => {
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
            <summary>Ver más servicios</summary>
            <div className="service-grid compact">
              {SERVICES.slice(4).map((service, index) => {
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
              Vehículo
            </p>
            <h2>Peugeot 408 Fastback</h2>
            <p>
              Un coche blanco, moderno, silencioso y amplio para traslados
              cómodos en carretera. Buen acceso, climatización, espacio para
              maletas y licencia oficial para viajar con tranquilidad.
            </p>
            <div className="spec-grid">
              <div>
                <Luggage aria-hidden="true" />
                <span>Maletero amplio</span>
              </div>
              <div>
                <CheckCircle2 aria-hidden="true" />
                <span>Hasta 4 pasajeros</span>
              </div>
              <div>
                <ShieldCheck aria-hidden="true" />
                <span>Seguro de pasajeros</span>
              </div>
              <div>
                <CreditCard aria-hidden="true" />
                <span>Pago fácil</span>
              </div>
              <div>
                <Sparkles aria-hidden="true" />
                <span>Interior cuidado</span>
              </div>
              <div>
                <Clock3 aria-hidden="true" />
                <span>Recogida puntual</span>
              </div>
            </div>
          </div>
          <div className="vehicle-gallery">
            <img src="/assets/vehicle-white.webp" alt="Taxi Ayud Peugeot 408 blanco" />
            <img src="/assets/interior.webp" alt="Interior confortable del taxi" />
          </div>
        </section>

        <section className="section tariffs-section" id="tarifas">
          <div className="section-heading">
            <p className="eyebrow compact">
              <Search aria-hidden="true" />
              Tabla de tarifas
            </p>
            <h2>Destinos frecuentes</h2>
            <p>
              Busca un municipio o ciudad para revisar kilómetros y precios
              orientativos. Las reservas se confirman por teléfono o WhatsApp.
            </p>
          </div>

          <div className="tariff-lookup">
            <div className="lookup-panel">
              <label className="field-label" htmlFor="tariff-destination">
                Elige destino
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
                Tarifa orientativa
              </p>
              <h3>{displayName(tariffLookupKey)}</h3>
              <p className="lookup-price">{euro(priceFromKm(lookupTariff.km, false))}</p>
              <div className="lookup-metrics">
                <div>
                  <span>Km ida</span>
                  <strong>{formatKm(lookupTariff.km)} km</strong>
                </div>
                <div>
                  <span>Diurna</span>
                  <strong>{euro(priceFromKm(lookupTariff.km, false))}</strong>
                </div>
                <div>
                  <span>Nocturna / festiva</span>
                  <strong>{euro(priceFromKm(lookupTariff.km, true))}</strong>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary lookup-action"
                onClick={() => useLookupDestination(tariffLookupKey)}
              >
                <Route aria-hidden="true" />
                Calcular este destino
              </button>
            </aside>
          </div>

          <details className="full-table-disclosure">
            <summary>Ver tabla completa de destinos</summary>
            <div className="table-tools">
              <div className="search-field">
                <Search aria-hidden="true" />
                <input
                  value={filter}
                  placeholder="Filtrar tabla"
                  onChange={(event) => setFilter(event.target.value)}
                />
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Destino</th>
                    <th>Km ida</th>
                    <th>Diurna</th>
                    <th>Nocturna / festiva</th>
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
              Reserva directa
            </p>
            <h2>Taxi disponible en Calatayud</h2>
            <p>
              Para horarios exactos, viajes de madrugada, trayectos largos o
              recogidas especiales, confirma disponibilidad directamente.
            </p>
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
            Taxi oficial en Calatayud. {CONTACT.license}.
          </p>
        </div>
        <ul>
          <li>Monasterio de Piedra</li>
          <li>Balnearios</li>
          <li>Zaragoza y aeropuerto</li>
          <li>Pueblos de la comarca</li>
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
        aria-label="Reservar por WhatsApp"
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
