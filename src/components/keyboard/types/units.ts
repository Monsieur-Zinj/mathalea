import type { prefixes, units } from '../lib/unitsSystem'

export type Prefix = keyof typeof prefixes
export type UnitCategory = keyof typeof units
