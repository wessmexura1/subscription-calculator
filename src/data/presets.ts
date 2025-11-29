import { ServicePreset } from '../types';

// Пресеты популярных сервисов
export const SERVICE_PRESETS: ServicePreset[] = [
  // Видео
  {
    name: 'Netflix',
    category: 'video',
    defaultPrice: 999,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/netflix.svg',
    availablePlans: ['individual', 'family'],
    planPrices: { individual: 999, family: 1499 }
  },
  {
    name: 'YouTube Premium',
    category: 'video',
    defaultPrice: 299,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg',
    availablePlans: ['individual', 'family', 'student'],
    planPrices: { individual: 299, family: 549, student: 169 }
  },
  {
    name: 'Disney+',
    category: 'video',
    defaultPrice: 899,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/disneyplus.svg',
    availablePlans: ['individual', 'family'],
    planPrices: { individual: 899, family: 1299 }
  },
  {
    name: 'Кинопоиск',
    category: 'video',
    defaultPrice: 299,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/kinopoisk.svg',
    availablePlans: ['individual', 'family'],
    planPrices: { individual: 299, family: 549 }
  },
  {
    name: 'Иви',
    category: 'video',
    defaultPrice: 399,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: '',
    availablePlans: ['individual', 'family']
  },
  {
    name: 'Okko',
    category: 'video',
    defaultPrice: 399,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: '',
    availablePlans: ['individual', 'family']
  },
  
  // Музыка
  {
    name: 'Spotify',
    category: 'music',
    defaultPrice: 299,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spotify.svg',
    availablePlans: ['individual', 'family', 'student'],
    planPrices: { individual: 299, family: 449, student: 149 }
  },
  {
    name: 'Apple Music',
    category: 'music',
    defaultPrice: 299,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applemusic.svg',
    availablePlans: ['individual', 'family', 'student'],
    planPrices: { individual: 299, family: 449, student: 149 }
  },
  {
    name: 'Яндекс Музыка',
    category: 'music',
    defaultPrice: 299,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: '',
    availablePlans: ['individual', 'family'],
    planPrices: { individual: 299, family: 449 }
  },
  {
    name: 'VK Музыка',
    category: 'music',
    defaultPrice: 199,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/vk.svg',
    availablePlans: ['individual', 'family']
  },
  
  // Игры
  {
    name: 'Xbox Game Pass',
    category: 'games',
    defaultPrice: 999,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/xbox.svg',
    availablePlans: ['individual'],
    planPrices: { individual: 999 }
  },
  {
    name: 'PlayStation Plus',
    category: 'games',
    defaultPrice: 4799,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'yearly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/playstation.svg',
    availablePlans: ['individual']
  },
  {
    name: 'EA Play',
    category: 'games',
    defaultPrice: 499,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ea.svg',
    availablePlans: ['individual']
  },
  {
    name: 'Nintendo Switch Online',
    category: 'games',
    defaultPrice: 1499,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'yearly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nintendoswitch.svg',
    availablePlans: ['individual', 'family']
  },
  
  // Софт
  {
    name: 'Adobe Creative Cloud',
    category: 'software',
    defaultPrice: 3999,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/adobe.svg',
    availablePlans: ['individual', 'business', 'student'],
    planPrices: { individual: 3999, business: 4999, student: 1999 }
  },
  {
    name: 'GitHub Copilot',
    category: 'software',
    defaultPrice: 10,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg',
    availablePlans: ['individual', 'business'],
    planPrices: { individual: 10, business: 19 }
  },
  {
    name: 'Notion',
    category: 'software',
    defaultPrice: 10,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/notion.svg',
    availablePlans: ['individual', 'business'],
    planPrices: { individual: 10, business: 15 }
  },
  {
    name: 'Figma',
    category: 'software',
    defaultPrice: 15,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/figma.svg',
    availablePlans: ['individual', 'business'],
    planPrices: { individual: 15, business: 45 }
  },
  {
    name: 'Microsoft 365',
    category: 'software',
    defaultPrice: 3499,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'yearly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoft.svg',
    availablePlans: ['individual', 'family'],
    planPrices: { individual: 3499, family: 4999 }
  },
  {
    name: 'JetBrains All Products',
    category: 'software',
    defaultPrice: 289,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'yearly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/jetbrains.svg',
    availablePlans: ['individual', 'business']
  },
  {
    name: 'ChatGPT Plus',
    category: 'software',
    defaultPrice: 20,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg',
    availablePlans: ['individual']
  },
  
  // Облака
  {
    name: 'iCloud+',
    category: 'cloud',
    defaultPrice: 99,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/icloud.svg',
    availablePlans: ['individual', 'family']
  },
  {
    name: 'Google One',
    category: 'cloud',
    defaultPrice: 139,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg',
    availablePlans: ['individual', 'family']
  },
  {
    name: 'Dropbox',
    category: 'cloud',
    defaultPrice: 11.99,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/dropbox.svg',
    availablePlans: ['individual', 'family', 'business']
  },
  {
    name: 'Яндекс Диск',
    category: 'cloud',
    defaultPrice: 99,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: '',
    availablePlans: ['individual']
  },
  
  // VPN
  {
    name: 'NordVPN',
    category: 'vpn',
    defaultPrice: 4.99,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/nordvpn.svg',
    availablePlans: ['individual']
  },
  {
    name: 'ExpressVPN',
    category: 'vpn',
    defaultPrice: 12.95,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/expressvpn.svg',
    availablePlans: ['individual']
  },
  {
    name: 'Surfshark',
    category: 'vpn',
    defaultPrice: 2.49,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: '',
    availablePlans: ['individual']
  },
  
  // Обучение
  {
    name: 'Coursera Plus',
    category: 'education',
    defaultPrice: 59,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/coursera.svg',
    availablePlans: ['individual']
  },
  {
    name: 'Skillbox',
    category: 'education',
    defaultPrice: 4500,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: '',
    availablePlans: ['individual']
  },
  {
    name: 'Udemy',
    category: 'education',
    defaultPrice: 20,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/udemy.svg',
    availablePlans: ['individual', 'business']
  },
  {
    name: 'Duolingo Plus',
    category: 'education',
    defaultPrice: 6.99,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/duolingo.svg',
    availablePlans: ['individual', 'family']
  },
  
  // Фитнес
  {
    name: 'World Class',
    category: 'fitness',
    defaultPrice: 12000,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: '',
    availablePlans: ['individual']
  },
  {
    name: 'DDX Fitness',
    category: 'fitness',
    defaultPrice: 2990,
    defaultCurrency: 'RUB',
    defaultBillingPeriod: 'monthly',
    logoUrl: '',
    availablePlans: ['individual']
  },
  {
    name: 'Strava Premium',
    category: 'fitness',
    defaultPrice: 5,
    defaultCurrency: 'USD',
    defaultBillingPeriod: 'monthly',
    logoUrl: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/strava.svg',
    availablePlans: ['individual']
  }
];

// Получить пресет по имени
export const getPresetByName = (name: string): ServicePreset | undefined => {
  return SERVICE_PRESETS.find(p => p.name.toLowerCase() === name.toLowerCase());
};

// Получить пресеты по категории
export const getPresetsByCategory = (category: string): ServicePreset[] => {
  return SERVICE_PRESETS.filter(p => p.category === category);
};

