const memory:any = globalThis.__byway_store || { courses: {} }
globalThis.__byway_store = memory
export function getStore(){ return memory }
