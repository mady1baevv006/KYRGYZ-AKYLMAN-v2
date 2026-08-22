import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'public/avatars');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function wrapSvg(bgGrad, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    ${bgGrad}
    <clipPath id="circleClip">
      <circle cx="60" cy="60" r="54"/>
    </clipPath>
  </defs>
  <circle cx="60" cy="60" r="56" fill="url(#bgGrad)" stroke="#ffffff" stroke-width="3"/>
  <g clip-path="url(#circleClip)">
    ${content}
  </g>
</svg>`;
}

const avatars = [
  {
    id: 'sea_lion',
    file: 'sea_lion.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#0d9488"/></linearGradient>`,
    body: `
      <!-- Sea Lion -->
      <ellipse cx="60" cy="72" rx="36" ry="32" fill="#78716c"/>
      <ellipse cx="60" cy="78" rx="22" ry="20" fill="#e7e5e4"/>
      <circle cx="60" cy="52" r="26" fill="#a8a29e"/>
      <circle cx="42" cy="46" r="6" fill="#78716c"/>
      <circle cx="78" cy="46" r="6" fill="#78716c"/>
      <ellipse cx="60" cy="60" rx="16" ry="12" fill="#f5f5f4"/>
      <polygon points="56,54 64,54 60,60" fill="#292524"/>
      <circle cx="50" cy="48" r="4" fill="#1c1917"/>
      <circle cx="70" cy="48" r="4" fill="#1c1917"/>
      <circle cx="48" cy="46" r="1.5" fill="#ffffff"/>
      <circle cx="68" cy="46" r="1.5" fill="#ffffff"/>
      <path d="M54 63 Q60 68 66 63" stroke="#292524" stroke-width="2" fill="none" stroke-linecap="round"/>
      <line x1="42" y1="59" x2="30" y2="57" stroke="#44403c" stroke-width="1.5"/>
      <line x1="42" y1="62" x2="32" y2="64" stroke="#44403c" stroke-width="1.5"/>
      <line x1="78" y1="59" x2="90" y2="57" stroke="#44403c" stroke-width="1.5"/>
      <line x1="78" y1="62" x2="88" y2="64" stroke="#44403c" stroke-width="1.5"/>
    `
  },
  {
    id: 'penguin',
    file: 'penguin.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0f766e"/></linearGradient>`,
    body: `
      <!-- Yellow-eyed Penguin -->
      <ellipse cx="60" cy="74" rx="34" ry="34" fill="#1e293b"/>
      <ellipse cx="60" cy="78" rx="22" ry="26" fill="#f8fafc"/>
      <circle cx="60" cy="46" r="24" fill="#0f172a"/>
      <!-- Yellow band around eyes -->
      <path d="M38 42 Q60 34 82 42 Q78 54 60 52 Q42 54 38 42 Z" fill="#facc15"/>
      <!-- Eyes -->
      <circle cx="48" cy="44" r="5" fill="#ffffff"/>
      <circle cx="72" cy="44" r="5" fill="#ffffff"/>
      <circle cx="48" cy="44" r="3" fill="#ca8a04"/>
      <circle cx="72" cy="44" r="3" fill="#ca8a04"/>
      <circle cx="48" cy="44" r="1.5" fill="#000000"/>
      <circle cx="72" cy="44" r="1.5" fill="#000000"/>
      <!-- Beak -->
      <polygon points="54,49 66,49 60,62" fill="#f97316"/>
    `
  },
  {
    id: 'wildlife',
    file: 'wildlife.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#15803d"/><stop offset="100%" stop-color="#047857"/></linearGradient>`,
    body: `
      <!-- Galapagos Iguana -->
      <path d="M36 28 L40 38 L48 24 L52 36 L60 22 L68 36 L72 24 L80 38 L84 28" stroke="#14532d" stroke-width="4" fill="none" stroke-linejoin="round"/>
      <ellipse cx="60" cy="64" rx="30" ry="28" fill="#4d7c0f"/>
      <ellipse cx="60" cy="74" rx="20" ry="20" fill="#84cc16"/>
      <circle cx="46" cy="56" r="6" fill="#fef08a"/>
      <circle cx="74" cy="56" r="6" fill="#fef08a"/>
      <circle cx="47" cy="56" r="3" fill="#1e293b"/>
      <circle cx="73" cy="56" r="3" fill="#1e293b"/>
      <circle cx="53" cy="66" r="2" fill="#14532d"/>
      <circle cx="67" cy="66" r="2" fill="#14532d"/>
      <path d="M48 76 Q60 84 72 76" stroke="#14532d" stroke-width="3" fill="none" stroke-linecap="round"/>
    `
  },
  {
    id: 'bird',
    file: 'bird.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#0284c7"/></linearGradient>`,
    body: `
      <!-- Blue-footed Booby -->
      <ellipse cx="60" cy="72" rx="32" ry="30" fill="#64748b"/>
      <ellipse cx="60" cy="76" rx="20" ry="22" fill="#f8fafc"/>
      <!-- Blue feet -->
      <ellipse cx="46" cy="98" rx="12" ry="6" fill="#06b6d4"/>
      <ellipse cx="74" cy="98" rx="12" ry="6" fill="#06b6d4"/>
      <circle cx="60" cy="46" r="22" fill="#e2e8f0"/>
      <circle cx="50" cy="44" r="5" fill="#fef08a"/>
      <circle cx="70" cy="44" r="5" fill="#fef08a"/>
      <circle cx="50" cy="44" r="2.5" fill="#0f172a"/>
      <circle cx="70" cy="44" r="2.5" fill="#0f172a"/>
      <polygon points="54,48 66,48 60,68" fill="#64748b"/>
    `
  },
  {
    id: 'bobcat',
    file: 'bobcat.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#b45309"/></linearGradient>`,
    body: `
      <!-- Bobcat -->
      <polygon points="34,22 46,44 26,46" fill="#b45309"/>
      <polygon points="86,22 74,44 94,46" fill="#b45309"/>
      <line x1="34" y1="22" x2="30" y2="12" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
      <line x1="86" y1="22" x2="90" y2="12" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="60" cy="62" rx="34" ry="28" fill="#d97706"/>
      <!-- Whiskers & ruff -->
      <polygon points="26,62 16,68 28,74" fill="#fed7aa"/>
      <polygon points="94,62 104,68 92,74" fill="#fed7aa"/>
      <!-- Muzzle -->
      <ellipse cx="60" cy="68" rx="16" ry="12" fill="#ffedd5"/>
      <polygon points="56,62 64,62 60,67" fill="#78350f"/>
      <!-- Eyes -->
      <ellipse cx="46" cy="54" rx="6" ry="5" fill="#fef08a"/>
      <ellipse cx="74" cy="54" rx="6" ry="5" fill="#fef08a"/>
      <ellipse cx="46" cy="54" rx="2" ry="4" fill="#1c1917"/>
      <ellipse cx="74" cy="54" rx="2" ry="4" fill="#1c1917"/>
      <path d="M54 70 Q60 74 66 70" stroke="#78350f" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'boa_constrictor',
    file: 'boa_constrictor.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#16a34a"/><stop offset="100%" stop-color="#15803d"/></linearGradient>`,
    body: `
      <!-- Boa Constrictor -->
      <path d="M20 90 Q40 60 60 85 T100 80" stroke="#854d0e" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M20 90 Q40 60 60 85 T100 80" stroke="#ca8a04" stroke-width="14" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="50" rx="26" ry="22" fill="#a16207"/>
      <ellipse cx="60" cy="50" rx="22" ry="18" fill="#ca8a04"/>
      <!-- Diamonds pattern -->
      <polygon points="60,36 66,44 60,52 54,44" fill="#713f12"/>
      <circle cx="48" cy="46" r="5" fill="#fef08a"/>
      <circle cx="72" cy="46" r="5" fill="#fef08a"/>
      <ellipse cx="48" cy="46" rx="1.5" ry="4" fill="#000"/>
      <ellipse cx="72" cy="46" rx="1.5" ry="4" fill="#000"/>
      <!-- Tongue -->
      <path d="M60 68 L60 80 L54 86 M60 80 L66 86" stroke="#dc2626" stroke-width="2" fill="none" stroke-linecap="round"/>
    `
  },
  {
    id: 'blue_whale',
    file: 'blue_whale.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient>`,
    body: `
      <!-- Blue Whale -->
      <!-- Spout -->
      <path d="M50 34 Q50 16 40 18 M50 28 Q60 14 70 20" stroke="#bae6fd" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="66" rx="44" ry="28" fill="#1e40af"/>
      <path d="M24 72 Q60 94 96 72" fill="#93c5fd"/>
      <line x1="40" y1="74" x2="40" y2="82" stroke="#60a5fa" stroke-width="2"/>
      <line x1="50" y1="76" x2="50" y2="86" stroke="#60a5fa" stroke-width="2"/>
      <line x1="60" y1="77" x2="60" y2="87" stroke="#60a5fa" stroke-width="2"/>
      <line x1="70" y1="76" x2="70" y2="86" stroke="#60a5fa" stroke-width="2"/>
      <line x1="80" y1="74" x2="80" y2="82" stroke="#60a5fa" stroke-width="2"/>
      <circle cx="38" cy="58" r="4" fill="#0f172a"/>
      <circle cx="37" cy="56" r="1.5" fill="#fff"/>
      <path d="M34 66 Q48 72 58 66" stroke="#1e3a8a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `
  },
  {
    id: 'sea_turtle',
    file: 'sea_turtle.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#0f766e"/></linearGradient>`,
    body: `
      <!-- Sea Turtle -->
      <!-- Flippers -->
      <ellipse cx="28" cy="46" rx="16" ry="8" transform="rotate(-30 28 46)" fill="#059669"/>
      <ellipse cx="92" cy="46" rx="16" ry="8" transform="rotate(30 92 46)" fill="#059669"/>
      <ellipse cx="36" cy="84" rx="10" ry="6" transform="rotate(30 36 84)" fill="#059669"/>
      <ellipse cx="84" cy="84" rx="10" ry="6" transform="rotate(-30 84 84)" fill="#059669"/>
      <!-- Shell -->
      <ellipse cx="60" cy="62" rx="30" ry="26" fill="#047857"/>
      <polygon points="60,44 72,52 72,68 60,76 48,68 48,52" fill="#10b981" stroke="#065f46" stroke-width="2"/>
      <!-- Head -->
      <ellipse cx="60" cy="34" rx="12" ry="14" fill="#34d399"/>
      <circle cx="54" cy="30" r="2.5" fill="#064e3b"/>
      <circle cx="66" cy="30" r="2.5" fill="#064e3b"/>
    `
  },
  {
    id: 'narwhal',
    file: 'narwhal.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient>`,
    body: `
      <!-- Narwhal -->
      <!-- Tusk -->
      <polygon points="58,10 62,10 60,42" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
      <line x1="58" y1="20" x2="62" y2="22" stroke="#ca8a04" stroke-width="1.5"/>
      <line x1="58" y1="28" x2="62" y2="30" stroke="#ca8a04" stroke-width="1.5"/>
      <line x1="58" y1="36" x2="62" y2="38" stroke="#ca8a04" stroke-width="1.5"/>
      <ellipse cx="60" cy="68" rx="36" ry="28" fill="#475569"/>
      <ellipse cx="60" cy="74" rx="24" ry="20" fill="#cbd5e1"/>
      <!-- Spots -->
      <circle cx="46" cy="56" r="2" fill="#334155"/>
      <circle cx="74" cy="56" r="2" fill="#334155"/>
      <circle cx="60" cy="52" r="2" fill="#334155"/>
      <circle cx="48" cy="62" r="4" fill="#0f172a"/>
      <circle cx="72" cy="62" r="4" fill="#0f172a"/>
      <circle cx="46" cy="60" r="1.5" fill="#fff"/>
      <circle cx="70" cy="60" r="1.5" fill="#fff"/>
      <path d="M54 74 Q60 80 66 74" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/>
    `
  },
  {
    id: 'vaquita',
    file: 'vaquita.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient>`,
    body: `
      <!-- Vaquita -->
      <ellipse cx="60" cy="66" rx="38" ry="30" fill="#64748b"/>
      <ellipse cx="60" cy="74" rx="26" ry="20" fill="#f1f5f9"/>
      <!-- Dorsal fin -->
      <path d="M60 36 Q60 22 72 26 Q64 36 60 38" fill="#475569"/>
      <!-- Eye patches (vaquita iconic dark rings) -->
      <ellipse cx="46" cy="58" rx="8" ry="7" fill="#0f172a"/>
      <ellipse cx="74" cy="58" rx="8" ry="7" fill="#0f172a"/>
      <circle cx="46" cy="58" r="4" fill="#ffffff"/>
      <circle cx="74" cy="58" r="4" fill="#ffffff"/>
      <circle cx="46" cy="58" r="2.5" fill="#000000"/>
      <circle cx="74" cy="58" r="2.5" fill="#000000"/>
      <!-- Dark lips -->
      <path d="M50 72 Q60 80 70 72" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    `
  },
  {
    id: 'tarsier',
    file: 'tarsier.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#854d0e"/><stop offset="100%" stop-color="#713f12"/></linearGradient>`,
    body: `
      <!-- Tarsier -->
      <!-- Large ears -->
      <ellipse cx="26" cy="44" rx="14" ry="18" fill="#a8a29e"/>
      <ellipse cx="26" cy="44" rx="9" ry="13" fill="#fbcfe8"/>
      <ellipse cx="94" cy="44" rx="14" ry="18" fill="#a8a29e"/>
      <ellipse cx="94" cy="44" rx="9" ry="13" fill="#fbcfe8"/>
      <ellipse cx="60" cy="62" rx="32" ry="28" fill="#78716c"/>
      <!-- Giant eyes -->
      <circle cx="44" cy="52" r="14" fill="#ca8a04"/>
      <circle cx="76" cy="52" r="14" fill="#ca8a04"/>
      <circle cx="44" cy="52" r="9" fill="#000000"/>
      <circle cx="76" cy="52" r="9" fill="#000000"/>
      <circle cx="41" cy="48" r="3" fill="#ffffff"/>
      <circle cx="73" cy="48" r="3" fill="#ffffff"/>
      <!-- Tiny nose and mouth -->
      <circle cx="60" cy="68" r="3" fill="#44403c"/>
      <path d="M56 74 Q60 77 64 74" stroke="#44403c" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'asian_tapir',
    file: 'asian_tapir.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>`,
    body: `
      <!-- Asian Tapir (Black & White saddle) -->
      <ellipse cx="60" cy="70" rx="36" ry="28" fill="#ffffff"/>
      <path d="M24 70 Q40 50 60 70 L60 98 Q30 98 24 70 Z" fill="#1e293b"/>
      <circle cx="50" cy="48" r="22" fill="#1e293b"/>
      <!-- White-tipped ears -->
      <polygon points="34,26 44,40 30,42" fill="#1e293b"/>
      <circle cx="34" cy="26" r="3" fill="#ffffff"/>
      <!-- Snout / proboscis -->
      <path d="M46 54 Q36 60 38 68 Q44 72 52 64" fill="#0f172a"/>
      <circle cx="48" cy="46" r="3.5" fill="#ffffff"/>
      <circle cx="48" cy="46" r="2" fill="#000000"/>
    `
  },
  {
    id: 'fauna',
    file: 'fauna.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ea580c"/><stop offset="100%" stop-color="#c2410c"/></linearGradient>`,
    body: `
      <!-- Fox / Fauna -->
      <polygon points="32,24 46,46 22,46" fill="#c2410c"/>
      <polygon points="34,28 42,44 26,44" fill="#ffffff"/>
      <polygon points="88,24 74,46 98,46" fill="#c2410c"/>
      <polygon points="86,28 78,44 94,44" fill="#ffffff"/>
      <ellipse cx="60" cy="62" rx="34" ry="28" fill="#ea580c"/>
      <!-- White cheeks -->
      <path d="M30 64 Q60 84 90 64 Q60 92 30 64 Z" fill="#ffffff"/>
      <polygon points="56,66 64,66 60,72" fill="#1e293b"/>
      <!-- Eyes -->
      <ellipse cx="44" cy="52" rx="5" ry="4" fill="#1e293b"/>
      <ellipse cx="76" cy="52" rx="5" ry="4" fill="#1e293b"/>
      <circle cx="43" cy="51" r="1.5" fill="#ffffff"/>
      <circle cx="75" cy="51" r="1.5" fill="#ffffff"/>
    `
  },
  {
    id: 'arabian_oryx',
    file: 'arabian_oryx.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/></linearGradient>`,
    body: `
      <!-- Arabian Oryx -->
      <!-- Long horns -->
      <line x1="52" y1="46" x2="40" y2="10" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
      <line x1="68" y1="46" x2="80" y2="10" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="60" cy="64" rx="28" ry="24" fill="#ffffff"/>
      <!-- Face markings -->
      <polygon points="60,46 66,66 54,66" fill="#451a03"/>
      <circle cx="44" cy="58" r="4" fill="#451a03"/>
      <circle cx="76" cy="58" r="4" fill="#451a03"/>
      <circle cx="44" cy="58" r="2" fill="#ffffff"/>
      <circle cx="76" cy="58" r="2" fill="#ffffff"/>
      <!-- Nose -->
      <ellipse cx="60" cy="74" rx="6" ry="4" fill="#1e293b"/>
    `
  },
  {
    id: 'bird_toucan',
    file: 'bird_toucan.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient>`,
    body: `
      <!-- Toucan Bird -->
      <ellipse cx="50" cy="64" rx="30" ry="28" fill="#0f172a"/>
      <circle cx="46" cy="48" r="20" fill="#0f172a"/>
      <circle cx="44" cy="48" r="14" fill="#ffffff"/>
      <circle cx="44" cy="48" r="7" fill="#38bdf8"/>
      <circle cx="44" cy="48" r="4" fill="#000000"/>
      <!-- Huge bill -->
      <path d="M56 42 Q96 40 106 58 Q88 74 56 62 Z" fill="#f59e0b"/>
      <path d="M86 48 Q104 54 106 58 Q96 68 86 62 Z" fill="#ef4444"/>
      <line x1="56" y1="52" x2="102" y2="56" stroke="#1e293b" stroke-width="2"/>
    `
  },
  {
    id: 'jaguar',
    file: 'jaguar.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#eab308"/><stop offset="100%" stop-color="#ca8a04"/></linearGradient>`,
    body: `
      <!-- Jaguar -->
      <circle cx="34" cy="38" r="10" fill="#ca8a04"/>
      <circle cx="86" cy="38" r="10" fill="#ca8a04"/>
      <circle cx="34" cy="38" r="6" fill="#fef08a"/>
      <circle cx="86" cy="38" r="6" fill="#fef08a"/>
      <ellipse cx="60" cy="62" rx="34" ry="28" fill="#eab308"/>
      <!-- Rosette spots -->
      <circle cx="36" cy="56" r="3" stroke="#451a03" stroke-width="2" fill="none"/>
      <circle cx="84" cy="56" r="3" stroke="#451a03" stroke-width="2" fill="none"/>
      <circle cx="60" cy="42" r="3" stroke="#451a03" stroke-width="2" fill="none"/>
      <!-- Eyes & muzzle -->
      <ellipse cx="46" cy="52" rx="5" ry="4" fill="#15803d"/>
      <ellipse cx="74" cy="52" rx="5" ry="4" fill="#15803d"/>
      <ellipse cx="60" cy="68" rx="14" ry="10" fill="#fef08a"/>
      <polygon points="56,64 64,64 60,68" fill="#451a03"/>
      <path d="M54 70 Q60 74 66 70" stroke="#451a03" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'panda',
    file: 'panda.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#059669"/></linearGradient>`,
    body: `
      <!-- Giant Panda -->
      <circle cx="32" cy="34" r="12" fill="#0f172a"/>
      <circle cx="88" cy="34" r="12" fill="#0f172a"/>
      <ellipse cx="60" cy="62" rx="36" ry="30" fill="#ffffff"/>
      <!-- Eye patches -->
      <ellipse cx="44" cy="54" rx="9" ry="11" transform="rotate(-15 44 54)" fill="#0f172a"/>
      <ellipse cx="76" cy="54" rx="9" ry="11" transform="rotate(15 76 54)" fill="#0f172a"/>
      <circle cx="44" cy="54" r="3.5" fill="#ffffff"/>
      <circle cx="76" cy="54" r="3.5" fill="#ffffff"/>
      <circle cx="44" cy="54" r="2" fill="#000000"/>
      <circle cx="76" cy="54" r="2" fill="#000000"/>
      <!-- Nose and mouth -->
      <polygon points="56,66 64,66 60,71" fill="#0f172a"/>
      <path d="M54 74 Q60 78 66 74" stroke="#0f172a" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'animals_lion',
    file: 'animals_lion.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#ea580c"/></linearGradient>`,
    body: `
      <!-- Lion -->
      <!-- Mane -->
      <circle cx="60" cy="60" r="44" fill="#9a3412"/>
      <circle cx="60" cy="60" r="40" fill="#c2410c"/>
      <circle cx="34" cy="38" r="8" fill="#fde047"/>
      <circle cx="86" cy="38" r="8" fill="#fde047"/>
      <ellipse cx="60" cy="62" rx="30" ry="26" fill="#fde047"/>
      <!-- Eyes & Muzzle -->
      <ellipse cx="48" cy="54" rx="5" ry="4" fill="#713f12"/>
      <ellipse cx="72" cy="54" rx="5" ry="4" fill="#713f12"/>
      <ellipse cx="60" cy="68" rx="14" ry="10" fill="#fef08a"/>
      <polygon points="56,62 64,62 60,67" fill="#9a3412"/>
      <path d="M54 70 Q60 74 66 70" stroke="#9a3412" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'orangutan',
    file: 'orangutan.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ea580c"/><stop offset="100%" stop-color="#9a3412"/></linearGradient>`,
    body: `
      <!-- Orangutan -->
      <ellipse cx="60" cy="60" rx="44" ry="38" fill="#c2410c"/>
      <!-- Cheek pads -->
      <ellipse cx="32" cy="60" rx="12" ry="18" fill="#7c2d12"/>
      <ellipse cx="88" cy="60" rx="12" ry="18" fill="#7c2d12"/>
      <!-- Face -->
      <ellipse cx="60" cy="60" rx="26" ry="24" fill="#431407"/>
      <circle cx="48" cy="52" r="4" fill="#fdba74"/>
      <circle cx="72" cy="52" r="4" fill="#fdba74"/>
      <circle cx="48" cy="52" r="2" fill="#000000"/>
      <circle cx="72" cy="52" r="2" fill="#000000"/>
      <ellipse cx="60" cy="64" rx="6" ry="3" fill="#7c2d12"/>
      <path d="M52 74 Q60 80 68 74" stroke="#fdba74" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `
  },
  {
    id: 'gazelle',
    file: 'gazelle.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/></linearGradient>`,
    body: `
      <!-- Gazelle -->
      <!-- Curved Horns -->
      <path d="M50 42 Q40 20 46 12" stroke="#451a03" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M70 42 Q80 20 74 12" stroke="#451a03" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Ears -->
      <polygon points="34,36 46,44 32,50" fill="#d97706"/>
      <polygon points="86,36 74,44 88,50" fill="#d97706"/>
      <ellipse cx="60" cy="60" rx="26" ry="24" fill="#f59e0b"/>
      <ellipse cx="60" cy="68" rx="16" ry="14" fill="#fffbeb"/>
      <circle cx="44" cy="52" r="5" fill="#451a03"/>
      <circle cx="76" cy="52" r="5" fill="#451a03"/>
      <circle cx="43" cy="50" r="1.5" fill="#ffffff"/>
      <circle cx="75" cy="50" r="1.5" fill="#ffffff"/>
      <ellipse cx="60" cy="74" rx="4" ry="2.5" fill="#451a03"/>
    `
  },
  {
    id: 'wolf',
    file: 'wolf.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#334155"/></linearGradient>`,
    body: `
      <!-- Wolf -->
      <polygon points="32,20 48,42 24,44" fill="#334155"/>
      <polygon points="34,26 44,40 28,42" fill="#cbd5e1"/>
      <polygon points="88,20 72,42 96,44" fill="#334155"/>
      <polygon points="86,26 76,40 92,42" fill="#cbd5e1"/>
      <ellipse cx="60" cy="62" rx="34" ry="28" fill="#475569"/>
      <polygon points="60,48 42,76 78,76" fill="#e2e8f0"/>
      <!-- Amber eyes -->
      <ellipse cx="44" cy="50" rx="5" ry="4" fill="#eab308"/>
      <ellipse cx="76" cy="50" rx="5" ry="4" fill="#eab308"/>
      <ellipse cx="44" cy="50" rx="2" ry="3" fill="#000000"/>
      <ellipse cx="76" cy="50" rx="2" ry="3" fill="#000000"/>
      <polygon points="56,70 64,70 60,76" fill="#0f172a"/>
    `
  },
  {
    id: 'red_panda',
    file: 'red_panda.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#c2410c"/></linearGradient>`,
    body: `
      <!-- Red Panda -->
      <polygon points="30,22 46,42 22,44" fill="#fff"/>
      <polygon points="34,28 44,40 28,42" fill="#ea580c"/>
      <polygon points="90,22 74,42 98,44" fill="#fff"/>
      <polygon points="86,28 76,40 92,42" fill="#ea580c"/>
      <ellipse cx="60" cy="62" rx="34" ry="28" fill="#ea580c"/>
      <!-- White markings -->
      <circle cx="40" cy="44" r="4" fill="#fff"/>
      <circle cx="80" cy="44" r="4" fill="#fff"/>
      <ellipse cx="36" cy="64" rx="8" ry="6" fill="#fff"/>
      <ellipse cx="84" cy="64" rx="8" ry="6" fill="#fff"/>
      <ellipse cx="60" cy="66" rx="12" ry="8" fill="#fff"/>
      <polygon points="56,62 64,62 60,66" fill="#431407"/>
      <circle cx="46" cy="54" r="4" fill="#431407"/>
      <circle cx="74" cy="54" r="4" fill="#431407"/>
    `
  },
  {
    id: 'ferret',
    file: 'ferret.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a8a29e"/><stop offset="100%" stop-color="#78716c"/></linearGradient>`,
    body: `
      <!-- Black-footed Ferret -->
      <circle cx="34" cy="38" r="8" fill="#d6d3d1"/>
      <circle cx="86" cy="38" r="8" fill="#d6d3d1"/>
      <ellipse cx="60" cy="62" rx="30" ry="26" fill="#f5f5f4"/>
      <!-- Black Bandit Mask -->
      <ellipse cx="60" cy="54" rx="24" ry="10" fill="#1c1917"/>
      <circle cx="46" cy="54" r="4" fill="#ffffff"/>
      <circle cx="74" cy="54" r="4" fill="#ffffff"/>
      <circle cx="46" cy="54" r="2.5" fill="#000000"/>
      <circle cx="74" cy="54" r="2.5" fill="#000000"/>
      <!-- Pink nose -->
      <ellipse cx="60" cy="68" rx="4" ry="3" fill="#f472b6"/>
      <path d="M56 74 Q60 77 64 74" stroke="#44403c" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'rhinoceros',
    file: 'rhinoceros.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#475569"/></linearGradient>`,
    body: `
      <!-- Rhinoceros -->
      <polygon points="34,30 44,44 30,46" fill="#475569"/>
      <polygon points="86,30 76,44 90,46" fill="#475569"/>
      <ellipse cx="60" cy="64" rx="34" ry="28" fill="#64748b"/>
      <!-- Horn -->
      <polygon points="56,36 64,36 60,18" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
      <polygon points="58,48 62,48 60,38" fill="#94a3b8"/>
      <circle cx="40" cy="54" r="4" fill="#0f172a"/>
      <circle cx="80" cy="54" r="4" fill="#0f172a"/>
      <circle cx="39" cy="53" r="1.5" fill="#ffffff"/>
      <circle cx="79" cy="53" r="1.5" fill="#ffffff"/>
      <!-- Snout -->
      <ellipse cx="60" cy="74" rx="16" ry="10" fill="#475569"/>
      <circle cx="52" cy="74" r="2.5" fill="#1e293b"/>
      <circle cx="68" cy="74" r="2.5" fill="#1e293b"/>
    `
  },
  {
    id: 'snow_leopard',
    file: 'snow_leopard.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#64748b"/></linearGradient>`,
    body: `
      <!-- Snow Leopard / Ирбис -->
      <circle cx="34" cy="36" r="10" fill="#cbd5e1"/>
      <circle cx="86" cy="36" r="10" fill="#cbd5e1"/>
      <circle cx="34" cy="36" r="6" fill="#94a3b8"/>
      <circle cx="86" cy="36" r="6" fill="#94a3b8"/>
      <ellipse cx="60" cy="62" rx="34" ry="28" fill="#f1f5f9"/>
      <!-- Rosettes -->
      <circle cx="36" cy="56" r="3" stroke="#475569" stroke-width="2" fill="none"/>
      <circle cx="84" cy="56" r="3" stroke="#475569" stroke-width="2" fill="none"/>
      <circle cx="60" cy="42" r="3" stroke="#475569" stroke-width="2" fill="none"/>
      <!-- Pale green eyes -->
      <ellipse cx="46" cy="52" rx="5" ry="4" fill="#86efac"/>
      <ellipse cx="74" cy="52" rx="5" ry="4" fill="#86efac"/>
      <ellipse cx="46" cy="52" rx="2" ry="3.5" fill="#0f172a"/>
      <ellipse cx="74" cy="52" rx="2" ry="3.5" fill="#0f172a"/>
      <!-- Nose -->
      <polygon points="56,64 64,64 60,68" fill="#f472b6"/>
      <path d="M54 72 Q60 76 66 72" stroke="#475569" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'shark',
    file: 'shark.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient>`,
    body: `
      <!-- Great White Shark -->
      <!-- Fin -->
      <polygon points="60,18 72,36 54,36" fill="#334155"/>
      <ellipse cx="60" cy="64" rx="38" ry="28" fill="#475569"/>
      <path d="M22 64 Q60 92 98 64 Z" fill="#f8fafc"/>
      <!-- Eyes -->
      <circle cx="42" cy="54" r="4" fill="#000000"/>
      <circle cx="41" cy="53" r="1.5" fill="#ffffff"/>
      <!-- Sharp teeth mouth -->
      <path d="M40 70 Q60 84 80 70" fill="#991b1b"/>
      <polygon points="46,71 49,76 52,71" fill="#fff"/>
      <polygon points="54,72 57,78 60,72" fill="#fff"/>
      <polygon points="62,72 65,78 68,72" fill="#fff"/>
      <polygon points="70,71 73,76 76,71" fill="#fff"/>
    `
  },
  {
    id: 'sloth',
    file: 'sloth.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a16207"/><stop offset="100%" stop-color="#713f12"/></linearGradient>`,
    body: `
      <!-- Sloth -->
      <ellipse cx="60" cy="62" rx="36" ry="30" fill="#78716c"/>
      <ellipse cx="60" cy="62" rx="26" ry="22" fill="#f5f5f4"/>
      <!-- Eye stripe patches -->
      <ellipse cx="44" cy="56" rx="8" ry="5" transform="rotate(-15 44 56)" fill="#44403c"/>
      <ellipse cx="76" cy="56" rx="8" ry="5" transform="rotate(15 76 56)" fill="#44403c"/>
      <circle cx="44" cy="56" r="3" fill="#1c1917"/>
      <circle cx="76" cy="56" r="3" fill="#1c1917"/>
      <circle cx="43" cy="55" r="1" fill="#ffffff"/>
      <circle cx="75" cy="55" r="1" fill="#ffffff"/>
      <!-- Nose & smiling mouth -->
      <ellipse cx="60" cy="66" rx="6" ry="4" fill="#1c1917"/>
      <path d="M52 74 Q60 80 68 74" stroke="#1c1917" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `
  },
  {
    id: 'bear',
    file: 'bear.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#92400e"/><stop offset="100%" stop-color="#78350f"/></linearGradient>`,
    body: `
      <!-- Brown Bear -->
      <circle cx="34" cy="34" r="10" fill="#78350f"/>
      <circle cx="86" cy="34" r="10" fill="#78350f"/>
      <circle cx="34" cy="34" r="6" fill="#fcd34d"/>
      <circle cx="86" cy="34" r="6" fill="#fcd34d"/>
      <ellipse cx="60" cy="62" rx="36" ry="30" fill="#92400e"/>
      <!-- Muzzle -->
      <ellipse cx="60" cy="68" rx="16" ry="13" fill="#fef3c7"/>
      <polygon points="55,62 65,62 60,68" fill="#451a03"/>
      <circle cx="46" cy="52" r="4" fill="#451a03"/>
      <circle cx="74" cy="52" r="4" fill="#451a03"/>
      <circle cx="45" cy="51" r="1.5" fill="#ffffff"/>
      <circle cx="73" cy="51" r="1.5" fill="#ffffff"/>
      <path d="M54 72 Q60 76 66 72" stroke="#451a03" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'polar_bear',
    file: 'polar_bear.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient>`,
    body: `
      <!-- Polar Bear -->
      <circle cx="34" cy="34" r="10" fill="#f1f5f9"/>
      <circle cx="86" cy="34" r="10" fill="#f1f5f9"/>
      <circle cx="34" cy="34" r="6" fill="#cbd5e1"/>
      <circle cx="86" cy="34" r="6" fill="#cbd5e1"/>
      <ellipse cx="60" cy="62" rx="36" ry="30" fill="#ffffff"/>
      <!-- Muzzle -->
      <ellipse cx="60" cy="68" rx="15" ry="12" fill="#f1f5f9"/>
      <polygon points="55,62 65,62 60,68" fill="#0f172a"/>
      <circle cx="46" cy="52" r="4" fill="#0f172a"/>
      <circle cx="74" cy="52" r="4" fill="#0f172a"/>
      <circle cx="45" cy="51" r="1.5" fill="#ffffff"/>
      <circle cx="73" cy="51" r="1.5" fill="#ffffff"/>
      <path d="M54 72 Q60 76 66 72" stroke="#0f172a" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'bird_owl',
    file: 'bird_owl.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#6d28d9"/></linearGradient>`,
    body: `
      <!-- Owl Bird -->
      <!-- Ear tufts -->
      <polygon points="34,22 46,42 26,42" fill="#6d28d9"/>
      <polygon points="86,22 74,42 94,42" fill="#6d28d9"/>
      <ellipse cx="60" cy="64" rx="34" ry="30" fill="#7c3aed"/>
      <ellipse cx="60" cy="74" rx="20" ry="18" fill="#f5f3ff"/>
      <!-- Big eyes -->
      <circle cx="44" cy="52" r="12" fill="#fef08a"/>
      <circle cx="76" cy="52" r="12" fill="#fef08a"/>
      <circle cx="44" cy="52" r="6" fill="#0f172a"/>
      <circle cx="76" cy="52" r="6" fill="#0f172a"/>
      <circle cx="42" cy="50" r="2" fill="#ffffff"/>
      <circle cx="74" cy="50" r="2" fill="#ffffff"/>
      <!-- Beak -->
      <polygon points="56,56 64,56 60,68" fill="#f97316"/>
    `
  },
  {
    id: 'brown_pelican',
    file: 'brown_pelican.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#0284c7"/></linearGradient>`,
    body: `
      <!-- Brown Pelican -->
      <ellipse cx="50" cy="64" rx="30" ry="28" fill="#78716c"/>
      <circle cx="44" cy="46" r="18" fill="#f5f5f4"/>
      <!-- Yellow crest -->
      <path d="M36 32 Q44 24 48 34" stroke="#eab308" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="40" cy="44" r="3.5" fill="#1c1917"/>
      <circle cx="39" cy="43" r="1.5" fill="#ffffff"/>
      <!-- Pelican pouch beak -->
      <polygon points="46,46 96,52 64,60" fill="#eab308"/>
      <path d="M48 58 Q72 82 96 52 Z" fill="#d97706"/>
    `
  },
  {
    id: 'fauna_koala',
    file: 'fauna_koala.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#0d9488"/></linearGradient>`,
    body: `
      <!-- Koala -->
      <circle cx="28" cy="38" r="14" fill="#94a3b8"/>
      <circle cx="28" cy="38" r="9" fill="#f1f5f9"/>
      <circle cx="92" cy="38" r="14" fill="#94a3b8"/>
      <circle cx="92" cy="38" r="9" fill="#f1f5f9"/>
      <ellipse cx="60" cy="62" rx="32" ry="28" fill="#94a3b8"/>
      <!-- Big oval black nose -->
      <ellipse cx="60" cy="64" rx="10" ry="14" fill="#0f172a"/>
      <circle cx="44" cy="52" r="3.5" fill="#0f172a"/>
      <circle cx="76" cy="52" r="3.5" fill="#0f172a"/>
      <circle cx="43" cy="51" r="1.5" fill="#ffffff"/>
      <circle cx="75" cy="51" r="1.5" fill="#ffffff"/>
    `
  },
  {
    id: 'macaw',
    file: 'macaw.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#b91c1c"/></linearGradient>`,
    body: `
      <!-- Scarlet Macaw -->
      <ellipse cx="50" cy="64" rx="30" ry="30" fill="#dc2626"/>
      <!-- Wing colors -->
      <path d="M22 64 Q44 94 66 64" fill="#f59e0b"/>
      <path d="M26 72 Q44 98 62 72" fill="#2563eb"/>
      <circle cx="46" cy="46" r="18" fill="#dc2626"/>
      <!-- White eye patch -->
      <ellipse cx="46" cy="46" rx="10" ry="9" fill="#ffffff"/>
      <circle cx="46" cy="46" r="4" fill="#000000"/>
      <circle cx="44" cy="44" r="1.5" fill="#ffffff"/>
      <!-- Curved hook beak -->
      <path d="M52 42 Q78 46 68 64 Q56 56 52 50 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
      <path d="M52 50 Q64 56 60 62 Z" fill="#1e293b"/>
    `
  },
  {
    id: 'condor',
    file: 'condor.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>`,
    body: `
      <!-- California Condor -->
      <ellipse cx="60" cy="74" rx="34" ry="28" fill="#0f172a"/>
      <!-- White neck ruff -->
      <ellipse cx="60" cy="58" rx="20" ry="8" fill="#ffffff"/>
      <!-- Red/pink bare head -->
      <ellipse cx="60" cy="44" rx="14" ry="16" fill="#f43f5e"/>
      <circle cx="54" cy="42" r="3" fill="#dc2626"/>
      <circle cx="66" cy="42" r="3" fill="#dc2626"/>
      <circle cx="54" cy="42" r="1.5" fill="#000000"/>
      <circle cx="66" cy="42" r="1.5" fill="#000000"/>
      <!-- Hooked beak -->
      <path d="M56 46 Q68 46 64 60 Q58 54 56 50 Z" fill="#fef08a"/>
    `
  },
  {
    id: 'monal',
    file: 'monal.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#4f46e5"/></linearGradient>`,
    body: `
      <!-- Himalayan Monal (Rainbow pheasant) -->
      <!-- Spoon-tipped crest -->
      <line x1="60" y1="36" x2="50" y2="16" stroke="#059669" stroke-width="2"/>
      <circle cx="50" cy="16" r="4" fill="#10b981"/>
      <line x1="60" y1="36" x2="60" y2="14" stroke="#0284c7" stroke-width="2"/>
      <circle cx="60" cy="14" r="4" fill="#38bdf8"/>
      <line x1="60" y1="36" x2="70" y2="16" stroke="#d97706" stroke-width="2"/>
      <circle cx="70" cy="16" r="4" fill="#f59e0b"/>
      <ellipse cx="60" cy="66" rx="32" ry="28" fill="#1e1b4b"/>
      <!-- Metallic sheen neck -->
      <path d="M38 52 Q60 38 82 52 Q76 74 60 70 Q44 74 38 52 Z" fill="#059669"/>
      <!-- Blue eye ring -->
      <circle cx="48" cy="48" r="7" fill="#38bdf8"/>
      <circle cx="72" cy="48" r="7" fill="#38bdf8"/>
      <circle cx="48" cy="48" r="3" fill="#000000"/>
      <circle cx="72" cy="48" r="3" fill="#000000"/>
      <polygon points="56,52 64,52 60,62" fill="#e2e8f0"/>
    `
  },
  {
    id: 'cassowary',
    file: 'cassowary.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient>`,
    body: `
      <!-- Cassowary -->
      <!-- Helmet / Casque -->
      <path d="M54 36 Q60 12 74 24 Q68 38 56 40 Z" fill="#ca8a04" stroke="#713f12" stroke-width="2"/>
      <ellipse cx="60" cy="74" rx="34" ry="26" fill="#0f172a"/>
      <!-- Electric blue neck -->
      <ellipse cx="60" cy="54" rx="18" ry="18" fill="#0284c7"/>
      <!-- Red wattles -->
      <path d="M58 64 Q54 84 58 88 Q62 84 62 64 Z" fill="#dc2626"/>
      <circle cx="50" cy="46" r="4" fill="#facc15"/>
      <circle cx="70" cy="46" r="4" fill="#facc15"/>
      <circle cx="50" cy="46" r="2" fill="#000000"/>
      <circle cx="70" cy="46" r="2" fill="#000000"/>
      <polygon points="56,48 64,48 60,60" fill="#334155"/>
    `
  },
  {
    id: 'camel',
    file: 'camel.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#b45309"/></linearGradient>`,
    body: `
      <!-- Bactrian Camel -->
      <circle cx="34" cy="38" r="6" fill="#b45309"/>
      <circle cx="86" cy="38" r="6" fill="#b45309"/>
      <!-- Fluffy head top -->
      <circle cx="60" cy="40" r="18" fill="#92400e"/>
      <ellipse cx="60" cy="62" rx="26" ry="24" fill="#d97706"/>
      <!-- Long eyelashes eyes -->
      <ellipse cx="46" cy="50" rx="5" ry="3.5" fill="#451a03"/>
      <ellipse cx="74" cy="50" rx="5" ry="3.5" fill="#451a03"/>
      <line x1="42" y1="48" x2="38" y2="44" stroke="#451a03" stroke-width="1.5"/>
      <line x1="78" y1="48" x2="82" y2="44" stroke="#451a03" stroke-width="1.5"/>
      <!-- Muzzle -->
      <ellipse cx="60" cy="68" rx="14" ry="10" fill="#fde68a"/>
      <ellipse cx="54" cy="66" rx="2.5" ry="1.5" fill="#451a03"/>
      <ellipse cx="66" cy="66" rx="2.5" ry="1.5" fill="#451a03"/>
      <path d="M54 72 Q60 76 66 72" stroke="#451a03" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'bison',
    file: 'bison.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#78350f"/><stop offset="100%" stop-color="#451a03"/></linearGradient>`,
    body: `
      <!-- Bison -->
      <!-- Curved Horns -->
      <path d="M40 42 Q28 32 36 20" stroke="#1c1917" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M80 42 Q92 32 84 20" stroke="#1c1917" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- Massive woolly head -->
      <ellipse cx="60" cy="56" rx="36" ry="30" fill="#451a03"/>
      <!-- Beard -->
      <polygon points="46,78 74,78 60,96" fill="#1c1917"/>
      <circle cx="44" cy="50" r="4" fill="#000000"/>
      <circle cx="76" cy="50" r="4" fill="#000000"/>
      <circle cx="43" cy="49" r="1.5" fill="#ffffff"/>
      <circle cx="75" cy="49" r="1.5" fill="#ffffff"/>
      <!-- Snout -->
      <ellipse cx="60" cy="68" rx="14" ry="9" fill="#1c1917"/>
      <ellipse cx="54" cy="68" rx="2.5" ry="1.5" fill="#78716c"/>
      <ellipse cx="66" cy="68" rx="2.5" ry="1.5" fill="#78716c"/>
    `
  },
  {
    id: 'elk',
    file: 'elk.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#047857"/></linearGradient>`,
    body: `
      <!-- Elk / Deer with magnificent antlers -->
      <!-- Antlers -->
      <path d="M46 36 Q30 20 24 8 M32 22 L24 26 M38 14 L46 10" stroke="#78350f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M74 36 Q90 20 96 8 M88 22 L96 26 M82 14 L74 10" stroke="#78350f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Ears -->
      <polygon points="32,40 44,48 30,54" fill="#92400e"/>
      <polygon points="88,40 76,48 90,54" fill="#92400e"/>
      <ellipse cx="60" cy="64" rx="26" ry="24" fill="#b45309"/>
      <ellipse cx="60" cy="72" rx="14" ry="12" fill="#fed7aa"/>
      <circle cx="46" cy="54" r="4.5" fill="#1c1917"/>
      <circle cx="74" cy="54" r="4.5" fill="#1c1917"/>
      <circle cx="45" cy="52" r="1.5" fill="#ffffff"/>
      <circle cx="73" cy="52" r="1.5" fill="#ffffff"/>
      <polygon points="56,70 64,70 60,74" fill="#1c1917"/>
    `
  },
  {
    id: 'chinchilla',
    file: 'chinchilla.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#64748b"/></linearGradient>`,
    body: `
      <!-- Chinchilla -->
      <!-- Big round ears -->
      <circle cx="32" cy="34" r="14" fill="#cbd5e1"/>
      <circle cx="32" cy="34" r="9" fill="#fbcfe8"/>
      <circle cx="88" cy="34" r="14" fill="#cbd5e1"/>
      <circle cx="88" cy="34" r="9" fill="#fbcfe8"/>
      <!-- Chubby cheeks -->
      <ellipse cx="60" cy="64" rx="36" ry="28" fill="#94a3b8"/>
      <ellipse cx="60" cy="72" rx="22" ry="18" fill="#f1f5f9"/>
      <!-- Big shiny eyes -->
      <circle cx="44" cy="56" r="6" fill="#0f172a"/>
      <circle cx="76" cy="56" r="6" fill="#0f172a"/>
      <circle cx="42" cy="54" r="2" fill="#ffffff"/>
      <circle cx="74" cy="54" r="2" fill="#ffffff"/>
      <!-- Cute nose -->
      <ellipse cx="60" cy="66" rx="3" ry="2" fill="#f472b6"/>
      <!-- Long whiskers -->
      <line x1="42" y1="66" x2="20" y2="64" stroke="#475569" stroke-width="1.5"/>
      <line x1="42" y1="68" x2="22" y2="72" stroke="#475569" stroke-width="1.5"/>
      <line x1="78" y1="66" x2="100" y2="64" stroke="#475569" stroke-width="1.5"/>
      <line x1="78" y1="68" x2="98" y2="72" stroke="#475569" stroke-width="1.5"/>
    `
  },
  {
    id: 'fauna_meerkat',
    file: 'fauna_meerkat.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/></linearGradient>`,
    body: `
      <!-- Meerkat / Fauna -->
      <circle cx="36" cy="40" r="6" fill="#451a03"/>
      <circle cx="84" cy="40" r="6" fill="#451a03"/>
      <ellipse cx="60" cy="62" rx="28" ry="26" fill="#d97706"/>
      <!-- Dark eye patches -->
      <ellipse cx="46" cy="52" rx="8" ry="6" fill="#451a03"/>
      <ellipse cx="74" cy="52" rx="8" ry="6" fill="#451a03"/>
      <circle cx="46" cy="52" r="3.5" fill="#fef08a"/>
      <circle cx="74" cy="52" r="3.5" fill="#fef08a"/>
      <circle cx="46" cy="52" r="2" fill="#000000"/>
      <circle cx="74" cy="52" r="2" fill="#000000"/>
      <!-- Nose & muzzle -->
      <ellipse cx="60" cy="66" rx="10" ry="8" fill="#fef3c7"/>
      <polygon points="57,62 63,62 60,66" fill="#1c1917"/>
    `
  },
  {
    id: 'tiger',
    file: 'tiger.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ea580c"/><stop offset="100%" stop-color="#c2410c"/></linearGradient>`,
    body: `
      <!-- Siberian Tiger -->
      <circle cx="34" cy="34" r="9" fill="#c2410c"/>
      <circle cx="86" cy="34" r="9" fill="#c2410c"/>
      <circle cx="34" cy="34" r="5" fill="#fff"/>
      <circle cx="86" cy="34" r="5" fill="#fff"/>
      <ellipse cx="60" cy="62" rx="34" ry="28" fill="#ea580c"/>
      <!-- Stripes -->
      <polygon points="60,34 56,44 64,44" fill="#1c1917"/>
      <polygon points="34,50 44,52 38,56" fill="#1c1917"/>
      <polygon points="86,50 76,52 82,56" fill="#1c1917"/>
      <!-- Eyes & Muzzle -->
      <ellipse cx="46" cy="52" rx="5" ry="4" fill="#facc15"/>
      <ellipse cx="74" cy="52" rx="5" ry="4" fill="#facc15"/>
      <ellipse cx="46" cy="52" rx="2" ry="3.5" fill="#1c1917"/>
      <ellipse cx="74" cy="52" rx="2" ry="3.5" fill="#1c1917"/>
      <ellipse cx="60" cy="68" rx="14" ry="10" fill="#fff"/>
      <polygon points="56,64 64,64 60,68" fill="#f472b6"/>
      <path d="M54 70 Q60 74 66 70" stroke="#1c1917" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'white_tiger',
    file: 'white_tiger.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient>`,
    body: `
      <!-- White Bengal Tiger with Ice Blue Eyes -->
      <circle cx="34" cy="34" r="9" fill="#e2e8f0"/>
      <circle cx="86" cy="34" r="9" fill="#e2e8f0"/>
      <circle cx="34" cy="34" r="5" fill="#cbd5e1"/>
      <circle cx="86" cy="34" r="5" fill="#cbd5e1"/>
      <ellipse cx="60" cy="62" rx="34" ry="28" fill="#ffffff"/>
      <!-- Dark Grey Stripes -->
      <polygon points="60,34 56,44 64,44" fill="#334155"/>
      <polygon points="34,50 44,52 38,56" fill="#334155"/>
      <polygon points="86,50 76,52 82,56" fill="#334155"/>
      <!-- Ice Blue Eyes -->
      <ellipse cx="46" cy="52" rx="5" ry="4" fill="#38bdf8"/>
      <ellipse cx="74" cy="52" rx="5" ry="4" fill="#38bdf8"/>
      <ellipse cx="46" cy="52" rx="2" ry="3.5" fill="#0f172a"/>
      <ellipse cx="74" cy="52" rx="2" ry="3.5" fill="#0f172a"/>
      <ellipse cx="60" cy="68" rx="14" ry="10" fill="#f8fafc"/>
      <polygon points="56,64 64,64 60,68" fill="#f472b6"/>
      <path d="M54 70 Q60 74 66 70" stroke="#334155" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'cheetah',
    file: 'cheetah.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/></linearGradient>`,
    body: `
      <!-- Cheetah with Tear Tracks -->
      <circle cx="36" cy="36" r="8" fill="#d97706"/>
      <circle cx="84" cy="36" r="8" fill="#d97706"/>
      <ellipse cx="60" cy="62" rx="30" ry="26" fill="#f59e0b"/>
      <!-- Solid spots -->
      <circle cx="40" cy="44" r="2" fill="#1c1917"/>
      <circle cx="80" cy="44" r="2" fill="#1c1917"/>
      <circle cx="60" cy="40" r="2" fill="#1c1917"/>
      <!-- Eyes & Tear Tracks -->
      <ellipse cx="46" cy="52" rx="4.5" ry="4" fill="#ca8a04"/>
      <ellipse cx="74" cy="52" rx="4.5" ry="4" fill="#ca8a04"/>
      <circle cx="46" cy="52" r="2" fill="#000000"/>
      <circle cx="74" cy="52" r="2" fill="#000000"/>
      <!-- Iconic black tear stripes -->
      <path d="M44 54 Q42 66 52 70" stroke="#1c1917" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M76 54 Q78 66 68 70" stroke="#1c1917" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="68" rx="10" ry="8" fill="#fef3c7"/>
      <polygon points="57,64 63,64 60,68" fill="#1c1917"/>
    `
  },
  {
    id: 'chimpanzee',
    file: 'chimpanzee.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>`,
    body: `
      <!-- Chimpanzee -->
      <circle cx="26" cy="50" r="12" fill="#fdba74"/>
      <circle cx="94" cy="50" r="12" fill="#fdba74"/>
      <ellipse cx="60" cy="58" rx="34" ry="30" fill="#0f172a"/>
      <!-- Face -->
      <ellipse cx="60" cy="56" rx="24" ry="20" fill="#fed7aa"/>
      <circle cx="48" cy="48" r="4" fill="#451a03"/>
      <circle cx="72" cy="48" r="4" fill="#451a03"/>
      <circle cx="48" cy="48" r="2" fill="#000000"/>
      <circle cx="72" cy="48" r="2" fill="#000000"/>
      <!-- Muzzle & smile -->
      <ellipse cx="60" cy="68" rx="16" ry="12" fill="#fdba74"/>
      <circle cx="56" cy="62" r="1.5" fill="#451a03"/>
      <circle cx="64" cy="62" r="1.5" fill="#451a03"/>
      <path d="M50 72 Q60 80 70 72" stroke="#451a03" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'wildlife_kangaroo',
    file: 'wildlife_kangaroo.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#b45309"/></linearGradient>`,
    body: `
      <!-- Kangaroo -->
      <polygon points="36,20 48,40 32,44" fill="#b45309"/>
      <polygon points="84,20 72,40 88,44" fill="#b45309"/>
      <ellipse cx="60" cy="62" rx="28" ry="26" fill="#d97706"/>
      <ellipse cx="60" cy="70" rx="16" ry="14" fill="#fde68a"/>
      <circle cx="46" cy="52" r="4.5" fill="#1c1917"/>
      <circle cx="74" cy="52" r="4.5" fill="#1c1917"/>
      <circle cx="45" cy="51" r="1.5" fill="#ffffff"/>
      <circle cx="73" cy="51" r="1.5" fill="#ffffff"/>
      <!-- Snout -->
      <ellipse cx="60" cy="68" rx="8" ry="6" fill="#1c1917"/>
    `
  },
  {
    id: 'dugong',
    file: 'dugong.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#0e7490"/></linearGradient>`,
    body: `
      <!-- Dugong / Sea Cow -->
      <ellipse cx="60" cy="64" rx="40" ry="30" fill="#64748b"/>
      <ellipse cx="60" cy="74" rx="28" ry="20" fill="#94a3b8"/>
      <!-- Flippers -->
      <ellipse cx="24" cy="70" rx="10" ry="16" transform="rotate(30 24 70)" fill="#475569"/>
      <ellipse cx="96" cy="70" rx="10" ry="16" transform="rotate(-30 96 70)" fill="#475569"/>
      <!-- Tiny friendly eyes -->
      <circle cx="42" cy="52" r="3.5" fill="#0f172a"/>
      <circle cx="78" cy="52" r="3.5" fill="#0f172a"/>
      <circle cx="41" cy="51" r="1.5" fill="#ffffff"/>
      <circle cx="77" cy="51" r="1.5" fill="#ffffff"/>
      <!-- Broad horseshoe snout -->
      <ellipse cx="60" cy="68" rx="18" ry="12" fill="#cbd5e1"/>
      <circle cx="52" cy="66" r="2" fill="#334155"/>
      <circle cx="68" cy="66" r="2" fill="#334155"/>
      <path d="M54 74 Q60 78 66 74" stroke="#334155" stroke-width="2" fill="none"/>
    `
  },
  {
    id: 'dart_frog',
    file: 'dart_frog.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#facc15"/><stop offset="100%" stop-color="#eab308"/></linearGradient>`,
    body: `
      <!-- Golden Poison Dart Frog -->
      <!-- Frog Legs -->
      <ellipse cx="26" cy="76" rx="12" ry="16" fill="#1e293b"/>
      <ellipse cx="94" cy="76" rx="12" ry="16" fill="#1e293b"/>
      <ellipse cx="60" cy="64" rx="32" ry="26" fill="#facc15"/>
      <!-- Bulging Eyes -->
      <circle cx="38" cy="42" r="12" fill="#0f172a"/>
      <circle cx="82" cy="42" r="12" fill="#0f172a"/>
      <circle cx="38" cy="42" r="4" fill="#ffffff"/>
      <circle cx="82" cy="42" r="4" fill="#ffffff"/>
      <!-- Contrast spots -->
      <circle cx="60" cy="48" r="3" fill="#1e293b"/>
      <circle cx="46" cy="64" r="4" fill="#1e293b"/>
      <circle cx="74" cy="64" r="4" fill="#1e293b"/>
      <path d="M46 74 Q60 84 74 74" stroke="#713f12" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    `
  },
  {
    id: 'babirusa',
    file: 'babirusa.svg',
    bg: `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#78716c"/><stop offset="100%" stop-color="#57534e"/></linearGradient>`,
    body: `
      <!-- Babirusa with curved upward tusks -->
      <!-- Upward curving tusks -->
      <path d="M48 54 Q40 30 52 18" stroke="#fef08a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M72 54 Q80 30 68 18" stroke="#fef08a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <!-- Lower tusks -->
      <path d="M42 66 Q32 50 38 42" stroke="#fef08a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M78 66 Q88 50 82 42" stroke="#fef08a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Small ears -->
      <circle cx="32" cy="38" r="6" fill="#44403c"/>
      <circle cx="88" cy="38" r="6" fill="#44403c"/>
      <ellipse cx="60" cy="62" rx="30" ry="26" fill="#78716c"/>
      <circle cx="46" cy="52" r="3.5" fill="#1c1917"/>
      <circle cx="74" cy="52" r="3.5" fill="#1c1917"/>
      <!-- Snout disc -->
      <ellipse cx="60" cy="68" rx="10" ry="8" fill="#a8a29e"/>
      <circle cx="56" cy="68" r="2" fill="#1c1917"/>
      <circle cx="64" cy="68" r="2" fill="#1c1917"/>
    `
  }
];

avatars.forEach(av => {
  const svg = wrapSvg(av.bg, av.body);
  const filePath = path.join(outDir, av.file);
  fs.writeFileSync(filePath, svg, 'utf-8');
});

console.log(`Generated ${avatars.length} avatar SVGs in ${outDir}`);
