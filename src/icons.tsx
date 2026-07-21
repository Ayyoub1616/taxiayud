import React from "react";

type IconNode = ReadonlyArray<readonly [string, Record<string, string>]>;
type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  absoluteStrokeWidth?: boolean;
};

function createIcon(name: string, iconNode: IconNode) {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(function TaxiAyudIcon(
    { size = 24, color = "currentColor", strokeWidth = 2, absoluteStrokeWidth, children, ...props },
    ref,
  ) {
    const finalStrokeWidth = absoluteStrokeWidth && Number(size) ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={finalStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {iconNode.map(([tag, attrs], index) => React.createElement(tag, { ...attrs, key: attrs.key ?? index }))}
        {children}
      </svg>
    );
  });

  Icon.displayName = name;
  return Icon;
}

const ArrowRightNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
] as const;

const BadgeCheckNode = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      key: "3c2336",
    },
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
] as const;

const BriefcaseBusinessNode = [
  ["path", { d: "M12 12h.01", key: "1mp3jc" }],
  ["path", { d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2", key: "1ksdt3" }],
  ["path", { d: "M22 13a18.15 18.15 0 0 1-20 0", key: "12hx5q" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }],
] as const;

const CalendarDaysNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }],
] as const;

const CarFrontNode = [
  ["path", { d: "m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8", key: "1imjwt" }],
  ["path", { d: "M7 14h.01", key: "1qa3f1" }],
  ["path", { d: "M17 14h.01", key: "7oqj8z" }],
  ["rect", { width: "18", height: "8", x: "3", y: "10", rx: "2", key: "a7itu8" }],
  ["path", { d: "M5 18v2", key: "ppbyun" }],
  ["path", { d: "M19 18v2", key: "gy7782" }],
] as const;

const CheckCircle2Node = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
] as const;

const Clock3Node = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }],
] as const;

const CreditCardNode = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }],
] as const;

const HeartPulseNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky",
    },
  ],
  ["path", { d: "M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27", key: "1uw2ng" }],
] as const;

const LanguagesNode = [
  ["path", { d: "m5 8 6 6", key: "1wu5hv" }],
  ["path", { d: "m4 14 6-6 2-3", key: "1k1g8d" }],
  ["path", { d: "M2 5h12", key: "or177f" }],
  ["path", { d: "M7 2h1", key: "1t2jsx" }],
  ["path", { d: "m22 22-5-10-5 10", key: "don7ne" }],
  ["path", { d: "M14 18h6", key: "1m8k6r" }],
] as const;

const LocateFixedNode = [
  ["line", { x1: "2", x2: "5", y1: "12", y2: "12", key: "bvdh0s" }],
  ["line", { x1: "19", x2: "22", y1: "12", y2: "12", key: "1tbv5k" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "5", key: "11lu5j" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }],
  ["circle", { cx: "12", cy: "12", r: "7", key: "fim9np" }],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
] as const;

const LuggageNode = [
  ["path", { d: "M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2", key: "1m57jg" }],
  ["path", { d: "M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14", key: "1l99gc" }],
  ["path", { d: "M10 20h4", key: "ni2waw" }],
  ["circle", { cx: "16", cy: "20", r: "2", key: "1vifvg" }],
  ["circle", { cx: "8", cy: "20", r: "2", key: "ckkr5m" }],
] as const;

const MapPinNode = [
  ["path", { d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0", key: "1r0f0z" }],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
] as const;

const MapPinnedNode = [
  ["path", { d: "M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0", key: "11u0oz" }],
  ["circle", { cx: "12", cy: "8", r: "2", key: "1822b1" }],
  ["path", { d: "M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712", key: "q8zwxj" }],
] as const;

const MessageCircleNode = [["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]] as const;

const MessageSquareTextNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  ["path", { d: "M13 8H7", key: "14i4kc" }],
  ["path", { d: "M17 12H7", key: "16if0g" }],
] as const;

const NavigationNode = [["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]] as const;

const PhoneNode = [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5",
    },
  ],
] as const;

const PlaneNode = [
  [
    "path",
    {
      d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
      key: "1v9wt8",
    },
  ],
] as const;

const RouteNode = [
  ["circle", { cx: "6", cy: "19", r: "3", key: "1kj8tv" }],
  ["path", { d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15", key: "1d8sl" }],
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
] as const;

const SearchNode = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }],
] as const;

const SendNode = [
  ["path", { d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z", key: "1ffxy3" }],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }],
] as const;

const ShieldCheckNode = [
  ["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z", key: "oel41y" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
] as const;

const SparklesNode = [
  ["path", { d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z", key: "4pj2yx" }],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }],
] as const;

const StarNode = [
  ["path", { d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z", key: "r04s7s" }],
] as const;

const TimerResetNode = [
  ["path", { d: "M10 2h4", key: "n1abiw" }],
  ["path", { d: "M12 14v-4", key: "1evpnu" }],
  ["path", { d: "M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6", key: "1ts96g" }],
  ["path", { d: "M9 17H4v5", key: "8t5av" }],
] as const;

const TrainFrontNode = [
  ["path", { d: "M8 3.1V7a4 4 0 0 0 8 0V3.1", key: "1v71zp" }],
  ["path", { d: "m9 15-1-1", key: "1yrq24" }],
  ["path", { d: "m15 15 1-1", key: "1t0d6s" }],
  ["path", { d: "M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z", key: "1p0hjs" }],
  ["path", { d: "m8 19-2 3", key: "13i0xs" }],
  ["path", { d: "m16 19 2 3", key: "xo31yx" }],
] as const;

const TriangleAlertNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq",
    },
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }],
] as const;

const UsersNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }],
] as const;

const WalletCardsNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2", key: "4125el" }],
  ["path", { d: "M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21", key: "1dpki6" }],
] as const;

export const ArrowRight = createIcon("ArrowRight", ArrowRightNode);
export const BadgeCheck = createIcon("BadgeCheck", BadgeCheckNode);
export const BriefcaseBusiness = createIcon("BriefcaseBusiness", BriefcaseBusinessNode);
export const CalendarDays = createIcon("CalendarDays", CalendarDaysNode);
export const CarFront = createIcon("CarFront", CarFrontNode);
export const CheckCircle2 = createIcon("CheckCircle2", CheckCircle2Node);
export const Clock3 = createIcon("Clock3", Clock3Node);
export const CreditCard = createIcon("CreditCard", CreditCardNode);
export const HeartPulse = createIcon("HeartPulse", HeartPulseNode);
export const Languages = createIcon("Languages", LanguagesNode);
export const LocateFixed = createIcon("LocateFixed", LocateFixedNode);
export const Luggage = createIcon("Luggage", LuggageNode);
export const MapPin = createIcon("MapPin", MapPinNode);
export const MapPinned = createIcon("MapPinned", MapPinnedNode);
export const MessageCircle = createIcon("MessageCircle", MessageCircleNode);
export const MessageSquareText = createIcon("MessageSquareText", MessageSquareTextNode);
export const Navigation = createIcon("Navigation", NavigationNode);
export const Phone = createIcon("Phone", PhoneNode);
export const Plane = createIcon("Plane", PlaneNode);
export const Route = createIcon("Route", RouteNode);
export const Search = createIcon("Search", SearchNode);
export const Send = createIcon("Send", SendNode);
export const ShieldCheck = createIcon("ShieldCheck", ShieldCheckNode);
export const Sparkles = createIcon("Sparkles", SparklesNode);
export const Star = createIcon("Star", StarNode);
export const TimerReset = createIcon("TimerReset", TimerResetNode);
export const TrainFront = createIcon("TrainFront", TrainFrontNode);
export const TriangleAlert = createIcon("TriangleAlert", TriangleAlertNode);
export const Users = createIcon("Users", UsersNode);
export const WalletCards = createIcon("WalletCards", WalletCardsNode);
