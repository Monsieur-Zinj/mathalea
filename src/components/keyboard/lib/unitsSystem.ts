import type { Prefix, UnitCategory } from '../types/units'

export const prefixes = {
  24: {
    symbol: 'Y',
    name: 'yotta'
  },
  21: {
    symbol: 'Z',
    name: 'zetta'
  },
  18: {
    symbol: 'E',
    name: 'exa'
  },
  15: {
    symbol: 'P',
    name: 'peta'
  },
  12: {
    symbol: 'T',
    name: 'tera'
  },
  9: {
    symbol: 'G',
    name: 'giga'
  },
  6: {
    symbol: 'M',
    name: 'méga'
  },
  3: {
    symbol: 'k',
    name: 'kilo'
  },
  2: {
    symbol: 'h',
    name: 'hecto'
  },
  1: {
    symbol: 'da',
    name: 'déca'
  },
  0: {
    symbol: '',

    name: ''

  },
  '-1': {
    symbol: 'd',
    name: 'déci'
  },
  '-2': {
    symbol: 'c',
    name: 'centi'
  },
  '-3': {
    symbol: 'm',
    name: 'milli'
  },
  '-6': {
    symbol: 'μ',
    name: 'micro'
  },
  '-9': {
    symbol: 'n',
    name: 'nano'
  },
  '-12': {
    symbol: 'p',
    name: 'pico'
  },
  '-15': {
    symbol: 'f',
    name: 'femto'
  },
  '-18': {
    symbol: 'a',
    name: 'atto'
  },
  '-21': {
    symbol: 'z',
    name: 'zepto'
  },
  '-24': {
    symbol: 'y',
    name: 'yocto'
  }
}

export const units = {
  length: {
    symbol: 'm',
    name: 'mètre'
  },
  content: {
    symbol: 'L',
    name: 'litre'
  },
  mass: {
    symbol: 'g',
    name: 'gramme'
  },
  power: {
    symbol: 'W',
    name: 'watt'
  },
  current: {
    symbol: 'A',
    name: 'ampère'
  },
  frequency: {
    symbol: 'Hz',
    name: 'hertz'
  },
  energy: {
    symbol: 'J',
    name: 'joule'
  },
  resistance: {
    symbol: 'Ω',
    name: 'ohm'
  },
  potential: {
    symbol: 'V',
    name: 'volt'
  },
  pressure: {
    symbol: 'Pa',
    name: 'pascal'
  },
  area: {
    symbol: 'a',
    name: 'are'
  }
}

export class Unit {
  prefix: Prefix
  category: UnitCategory
  exp: 1 | 2 | 3
  name: string
  symbol: string
  insert: string
  private superscript = [
    {
      name: '',
      symbol: '',
      latexInsert: ''
    },
    {
      name: ' carré',
      symbol: '²',
      latexInsert: '^2'
    },
    {
      name: ' cube',
      symbol: '³',
      latexInsert: '^3'
    }
  ]

  constructor (pre: Prefix, cat: UnitCategory, e: 1 | 2 | 3 = 1) {
    this.prefix = pre
    this.category = cat
    this.exp = e
    this.name = [prefixes[this.prefix].name, units[this.category].name, this.superscript[this.exp - 1].name].join('')
    this.symbol = [prefixes[this.prefix].symbol, units[this.category].symbol, this.superscript[this.exp - 1].symbol].join('')
    const symbol = [prefixes[this.prefix].symbol, units[this.category].symbol].join('')
    const pow = this.superscript[this.exp - 1].latexInsert
    this.insert = `$$\\operatorname{ ${symbol}}${pow}$$`
  }
}

export class UnitSystem {
  units: Unit[]
  private exp: number

  constructor (prefixList: Prefix[], cat: UnitCategory, e: 1 | 2 | 3 = 1) {
    this.units = prefixList.map(p => new Unit(p, cat, e))
    this.exp = e
  }
}

export const lengthUnits: UnitSystem = new UnitSystem([3, 2, 1, 0, '-1', '-2', '-3'], 'length')
export const areaMetricUnits: UnitSystem = new UnitSystem([3, 2, 1, 0, '-1', '-2', '-3'], 'length', 2)
export const areaOtherUnits: UnitSystem = new UnitSystem([2, 0, '-2'], 'area')
export const volumeMetricUnits: UnitSystem = new UnitSystem([3, 2, 1, 0, '-1', '-2', '-3'], 'length', 3)
export const volumeOtherUnits: UnitSystem = new UnitSystem([2, 1, 0, '-1', '-2', '-3'], 'content')
export const massUnits: UnitSystem = new UnitSystem([3, 2, 1, 0, '-1', '-2', '-3'], 'mass')
