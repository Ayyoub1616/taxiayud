import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  CreditCard,
  HeartPulse,
  Luggage,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Plane,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Users,
  WalletCards,
} from "lucide-react";
import {
  CONTACT,
  DISPLAY_NAMES,
  FIXED_HOLIDAYS_MMDD,
  HOLIDAYS_2026,
  RATES,
  SERVICES,
  TARIFAS,
} from "./data";
import "./styles.css";

type Result = {
  destination: string;
  km: number;
  price: number;
  tariffLabel: string;
  reason: string;
  dateLabel: string;
  hour: string;
  passengers: number;
};

const heroStats = [
  { value: "24h", label: "reservas" },
  { value: "N.18", label: "licencia" },
  { value: "+100", label: "destinos" },
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
    label: premium ? "Nocturna / festiva" : "Laborable diurna",
    reason: reasons.length ? reasons.join(" y ") : "día laborable",
  };
}

function priceFromKm(km: number, premium: boolean) {
  const rate = premium ? RATES.nightRate : RATES.dayRate;
  return km * RATES.returnFactor * rate + RATES.baseFare;
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

function whatsappUrl(result: Result | null, selected: string, passengers: number) {
  const destination = result ? result.destination : selected || "destino por confirmar";
  const text = result
    ? `Hola Taxi Ayud, quiero reservar un viaje:

Origen: Calatayud
Destino: ${result.destination}
Fecha: ${result.dateLabel} a las ${result.hour}h
Pasajeros: ${result.passengers}
Distancia estimada: ${result.km.toString().replace(".", ",")} km
Precio estimado: ${euro(result.price)}
Tarifa aplicada: ${result.tariffLabel}

¿Tienes disponibilidad?`
    : `Hola Taxi Ayud, quiero consultar disponibilidad para un viaje:

Origen: Calatayud
Destino: ${destination}
Pasajeros: ${passengers}

¿Me puedes confirmar precio y horario?`;

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function App() {
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState("MONASTERIO DE PIEDRA");
  const [date, setDate] = useState(todayValue());
  const [hour, setHour] = useState(currentHour());
  const [passengers, setPassengers] = useState(1);
  const [filter, setFilter] = useState("");
  const [result, setResult] = useState<Result | null>(() => {
    const destination = "MONASTERIO DE PIEDRA";
    const tariff = TARIFAS[destination];
    const info = tariffInfo(todayValue(), currentHour());
    return {
      destination: displayName(destination),
      km: tariff.km,
      price: priceFromKm(tariff.km, info.premium),
      tariffLabel: info.label,
      reason: info.reason,
      dateLabel: dateLabel(todayValue()),
      hour: currentHour(),
      passengers: 1,
    };
  });

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

  const selectedTariff = TARIFAS[selectedKey];

  function resultForKey(key: string): Result {
    const tariff = TARIFAS[key];
    const info = tariffInfo(date, hour);

    return {
      destination: displayName(key),
      km: tariff.km,
      price: priceFromKm(tariff.km, info.premium),
      tariffLabel: info.label,
      reason: info.reason,
      dateLabel: dateLabel(date),
      hour,
      passengers,
    };
  }

  function chooseDestination(key: string) {
    setSelectedKey(key);
    setQuery(displayName(key));
    setResult(resultForKey(key));
  }

  function calculate() {
    const key =
      (TARIFAS[selectedKey] && selectedKey) ||
      tariffEntries.find(([name]) => normalize(name) === normalize(query))?.[0];

    if (!key || !TARIFAS[key]) {
      setResult(null);
      return;
    }

    setResult(resultForKey(key));
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
          <a href="#calculadora">Calculadora</a>
          <a href="#servicios">Servicios</a>
          <a href="#tarifas">Tarifas</a>
          <a href="#vehiculo">Vehículo</a>
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
              Traslados a Monasterio de Piedra, balnearios, Zaragoza, aeropuerto,
              tren y pueblos de la comarca. Reserva rápido por teléfono o
              WhatsApp.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={CONTACT.phoneHref}>
                <Phone aria-hidden="true" />
                Llamar ahora
              </a>
              <a
                className="btn btn-whatsapp"
                href={whatsappUrl(result, selectedKey, passengers)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle aria-hidden="true" />
                WhatsApp
              </a>
              <a className="btn btn-secondary" href="#calculadora">
                <Route aria-hidden="true" />
                Ver tarifa
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
          </div>
        </section>

        <section className="payment-strip" aria-label="Metodos de pago">
          <div>
            <WalletCards aria-hidden="true" />
            <span>Pago flexible</span>
          </div>
          <p>Efectivo · Tarjeta · Bizum · Apple Pay · Google Pay</p>
        </section>

        <section className="section calc-section" id="calculadora">
          <div className="section-heading">
            <p className="eyebrow compact">
              <Route aria-hidden="true" />
              Calculadora de viaje
            </p>
            <h2>Precio orientativo antes de reservar</h2>
            <p>
              Elige un destino frecuente desde Calatayud. La estimación aplica
              kilometraje de ida y retorno del vehículo, más bajada de bandera.
            </p>
          </div>

          <div className="calc-layout">
            <div className="calculator-panel">
              <label className="field-label" htmlFor="destination-search">
                Destino
              </label>
              <div className="search-field">
                <Search aria-hidden="true" />
                <input
                  id="destination-search"
                  value={query}
                  placeholder="Buscar destino, pueblo o ciudad"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="suggestions" aria-label="Destinos sugeridos">
                {suggestions.map(([key, tariff]) => (
                  <button
                    key={key}
                    type="button"
                    className={selectedKey === key ? "active" : ""}
                    onClick={() => chooseDestination(key)}
                  >
                    <span>{displayName(key)}</span>
                    <small>{tariff.km.toString().replace(".", ",")} km</small>
                  </button>
                ))}
              </div>

              <div className="form-grid">
                <label>
                  <span className="field-label">Fecha</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </label>
                <label>
                  <span className="field-label">Hora</span>
                  <input
                    type="time"
                    value={hour}
                    onChange={(event) => setHour(event.target.value)}
                  />
                </label>
                <label>
                  <span className="field-label">Pasajeros</span>
                  <select
                    value={passengers}
                    onChange={(event) => setPassengers(Number(event.target.value))}
                  >
                    <option value={1}>1 pasajero</option>
                    <option value={2}>2 pasajeros</option>
                    <option value={3}>3 pasajeros</option>
                    <option value={4}>4 pasajeros</option>
                  </select>
                </label>
              </div>

              <button className="btn btn-primary calc-button" onClick={calculate}>
                <CalculatorIcon />
                Calcular precio
              </button>
            </div>

            <aside className="result-panel" aria-live="polite">
              {result && selectedTariff ? (
                <>
                  <div className="result-kicker">
                    <Clock3 aria-hidden="true" />
                    {result.tariffLabel}
                  </div>
                  <p className="result-destination">{result.destination}</p>
                  <p className="result-price">{euro(result.price)}</p>
                  <ul className="result-list">
                    <li>
                      <MapPin aria-hidden="true" />
                      {result.km.toString().replace(".", ",")} km desde Calatayud
                    </li>
                    <li>
                      <CalendarDays aria-hidden="true" />
                      {result.dateLabel} · {result.hour}h · {result.reason}
                    </li>
                    <li>
                      <Users aria-hidden="true" />
                      {result.passengers} pasajero{result.passengers > 1 ? "s" : ""}
                    </li>
                  </ul>
                  <div className="result-actions">
                    <a
                      className="btn btn-whatsapp"
                      href={whatsappUrl(result, selectedKey, passengers)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle aria-hidden="true" />
                      Reservar por WhatsApp
                    </a>
                    <a className="btn btn-secondary" href={CONTACT.phoneHref}>
                      <Phone aria-hidden="true" />
                      Llamar
                    </a>
                  </div>
                  <p className="small-note">
                    Precio orientativo. El importe final lo marca el taxímetro
                    homologado.
                  </p>
                </>
              ) : (
                <>
                  <p className="result-destination">Destino no encontrado</p>
                  <p className="empty-result">
                    Escribe otro destino o consulta directamente por WhatsApp.
                  </p>
                  <a
                    className="btn btn-whatsapp"
                    href={whatsappUrl(null, query, passengers)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle aria-hidden="true" />
                    Consultar
                  </a>
                </>
              )}
            </aside>
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
            {SERVICES.map((service, index) => {
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
        </section>

        <section className="section vehicle-section" id="vehiculo">
          <div className="vehicle-copy">
            <p className="eyebrow compact">
              <ShieldCheck aria-hidden="true" />
              Vehículo
            </p>
            <h2>Peugeot 408 Fastback</h2>
            <p>
              Un coche moderno, silencioso y amplio para traslados cómodos en
              carretera. Espacio para maletas, buen acceso y licencia oficial
              para viajar con tranquilidad.
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
                <span>Pago con tarjeta</span>
              </div>
            </div>
          </div>
          <div className="vehicle-gallery">
            <img src="/assets/vehicle.webp" alt="Taxi Ayud Peugeot 408" />
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
                    <td>{tariff.km.toString().replace(".", ",")} km</td>
                    <td>{euro(priceFromKm(tariff.km, false))}</td>
                    <td>{euro(priceFromKm(tariff.km, true))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              href={whatsappUrl(result, selectedKey, passengers)}
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
        href={whatsappUrl(result, selectedKey, passengers)}
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
