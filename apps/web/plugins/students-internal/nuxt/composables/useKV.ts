import { useUiPrefs } from './useUiPrefs'
export function useKV(ns: string = 'ui') {
  const prefs = useUiPrefs()
  return {
    get: (k: string, fb?: any) => prefs.getSync(`${ns}:${k}`, fb),
    set: (k: string, v: any) => prefs.set(`${ns}:${k}`, v),
    all: () => prefs.getSync(ns, {}),
    setAll: (obj: Record<string, any>) => prefs.setAll(obj),
  }
}
