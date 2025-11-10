// composables/useCurrency.ts
export function useCurrency(locale='en-US', currency='EUR'){
  const fmt = new Intl.NumberFormat(locale, { style:'currency', currency })
  function money(n:number){ return fmt.format(n) }
  return { money }
}
