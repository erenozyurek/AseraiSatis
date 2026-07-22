import { fallbackModules } from './packageModules.js'

/* Satın alınabilir / paket kapsamındaki modüller. DB yüklenene kadar yedek veri. */
export const addonModules = fallbackModules

export const getModule = (id) => addonModules.find((m) => m.id === id)
