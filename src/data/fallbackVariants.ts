import { Variant } from '../types';

export const FALLBACK_VARIANTS: Variant[] = [
  {
    id: 1,
    title: "ЦООМО №1",
    themeColor: "emerald",
    language: "ru",
    isPractice: false,
    isNew: false,
    tags: ["Математика I", "Математика II", "Аналогии и дополнения", "Чтение и понимание", "Практическая грамматика"],
    status: "available",
    availableSections: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    title: "ЦООМО №2",
    themeColor: "emerald",
    language: "ru",
    isPractice: false,
    isNew: false,
    tags: ["Математика I", "Математика II"],
    status: "available",
    availableSections: [1, 2],
  },
  {
    id: 3,
    title: "ЦООМО №3",
    themeColor: "emerald",
    language: "ru",
    isPractice: false,
    isNew: false,
    tags: ["Математика I", "Математика II"],
    status: "available",
    availableSections: [1, 2],
  },
  {
    id: 12,
    title: "ЦООМО №12",
    themeColor: "emerald",
    language: "ru",
    isPractice: false,
    isNew: true,
    tags: ["Математика I", "Математика II"],
    status: "new",
    availableSections: [1, 2],
  },
];

