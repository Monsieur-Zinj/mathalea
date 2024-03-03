import type { MathfieldElement } from 'mathlive'
import type { BlockForKeyboard } from '../../../components/keyboard/types/keyboardContent'

export enum KeyboardType {
  // eslint-disable-next-line no-unused-vars
  clavierHms = 'clavierHms',
  // eslint-disable-next-line no-unused-vars
  lycee = 'lycee',
  // eslint-disable-next-line no-unused-vars
  grecTrigo = 'grecTrigo',
  // eslint-disable-next-line no-unused-vars
  college6eme = 'college6eme',
  // eslint-disable-next-line no-unused-vars
  clavierDeBase = 'clavierDeBase',
  // eslint-disable-next-line no-unused-vars
  clavierDeBaseAvecX = 'clavierDeBaseAvecX',
  // eslint-disable-next-line no-unused-vars
  clavierDeBaseAvecFraction = 'clavierDeBaseAvecFraction',
  // eslint-disable-next-line no-unused-vars
  clavierDeBaseAvecFractionPuissanceCrochets = 'clavierDeBaseAvecFractionPuissanceCrochets',
  // eslint-disable-next-line no-unused-vars
  clavierDeBaseAvecEgal = 'clavierDeBaseAvecEgal',
  // eslint-disable-next-line no-unused-vars
  clavierDeBaseAvecVariable = 'clavierDeBaseAvecVariable',
  // eslint-disable-next-line no-unused-vars
  clavierFullOperations = 'clavierFullOperations',
  // eslint-disable-next-line no-unused-vars
  alphanumericAvecEspace = 'alphanumericAvecEspace',
  // eslint-disable-next-line no-unused-vars
  alphanumeric = 'alphanumeric',
  // eslint-disable-next-line no-unused-vars
  longueur = 'longueur',
  // eslint-disable-next-line no-unused-vars
  aire = 'aire',
  // eslint-disable-next-line no-unused-vars
  volume = 'volume',
  // eslint-disable-next-line no-unused-vars
  masse = 'masse',
}

export const convertToKeyboardTypeEnum = (str: string): KeyboardType | undefined => {
  const type = KeyboardType[str as keyof typeof KeyboardType]
  return type
}

export const convertKeyboardTypeToBlocks = (type : KeyboardType): BlockForKeyboard[] => {
  switch (type) {
    case KeyboardType.clavierDeBase:
      return ['numbersOperations']
    case KeyboardType.clavierDeBaseAvecX:
      return ['numbersOperationsX']
    case KeyboardType.grecTrigo:
      return ['numbers', 'fullOperations', 'greek', 'trigo']
    case KeyboardType.clavierHms:
      return ['numbers', 'hms']
    case KeyboardType.lycee:
      return ['numbers', 'fullOperations', 'variables', 'advanced']
    case KeyboardType.college6eme:
      return ['numbersOperations']
    case KeyboardType.clavierDeBaseAvecFraction:
      return ['numbers', 'basicOperations']
    case KeyboardType.clavierDeBaseAvecFractionPuissanceCrochets:
      return ['numbers', 'basicOperationsPlus']
    case KeyboardType.clavierDeBaseAvecEgal:
      return ['numbers2', 'basicOperations']
    case KeyboardType.clavierDeBaseAvecVariable:
      return ['numbers', 'basicOperations', 'variables']
    case KeyboardType.clavierFullOperations:
      return ['numbers', 'fullOperations']
    case KeyboardType.alphanumeric:
      return ['alphanumeric']
    case KeyboardType.alphanumericAvecEspace:
      return ['alphanumeric']
    case KeyboardType.longueur:
      return ['numbers', 'lengths']
    case KeyboardType.aire:
      return ['numbers', 'areas']
    case KeyboardType.volume:
      return ['numbers', 'volumes', 'capacities']
    case KeyboardType.masse :
      return ['numbers', 'masses']
    default:
      throw new Error("This error shouldn't occur. Clavier type: '" + type + "'")
  }
}

export const buildDataKeyboardFromStyle = (style : string) : BlockForKeyboard[] => {
  // traitement
  if (style === '') {
    // clavier basique
    return ['numbers', 'fullOperations', 'variables']
  } else {
    const blocks : BlockForKeyboard[] = []
    const styleValues = style?.split(' ')
    for (const value of styleValues) {
      const type = convertToKeyboardTypeEnum(value)
      if (type !== undefined) {
        blocks.push(...convertKeyboardTypeToBlocks(type))
      } else {
        // peut-être des unités... du style unites[longueurs,aires]
        if (value.startsWith('unit') || value.startsWith('Unit')) {
          // extraire les informations entre les [...] pour avoir les unités
          const unitValuesMatches = value.match(/\[(.*?)\]/g)
          const unitValues = unitValuesMatches?.map(e => e.slice(1, -1)).join(',').split(',').map((s) => s.toLowerCase().replace(/[s]$/, '')) || []// tout en minuscule et virer les 's' à la fin
          for (const v of unitValues) {
            const type = convertToKeyboardTypeEnum(v)
            if (type !== undefined) {
              blocks.push(...convertKeyboardTypeToBlocks(type))
            }
          }
        }
      }
    }
    if (blocks.length !== 0) {
      const blks = blocks.filter((element, index, array) => {
        return array.indexOf(element) === index
      })
      return blks
    } else {
      return ['numbers', 'fullOperations', 'variables']
    }
  }
}

type Shortcut = {
  mode: 'math' | 'text';
  value: string;
}

type ShortcutsByKeyboards = {
  [keyboard: string]: {
    [key: string]: Shortcut | string;
  };
};

export function getKeyboardShortcusts (mf: MathfieldElement): void {
  let keyboardShortcuts = { ...shortcutsByKeyboards.default }
  const keyboards = mf.dataset?.keyboard?.split(' ')
  if (keyboards == null) return
  for (const keyboard of keyboards) {
    if (keyboard in shortcutsByKeyboards) {
      keyboardShortcuts = { ...keyboardShortcuts, ...shortcutsByKeyboards[keyboard] }
    }
    if (['lengths', 'volumes', 'capacities', 'masses', 'areas'].includes(keyboard as KeyboardType)) {
      keyboardShortcuts = { ...keyboardShortcuts, ...shortcutsByKeyboards.unit }
    }
  }
  mf.inlineShortcuts = keyboardShortcuts
}

const shortcutsByKeyboards = {
  default: {
    D: { mode: 'math', value: 'd' },
    '*': { mode: 'math', value: '\\times' },
    '.': { mode: 'math', value: '{,}' },
    ',': { mode: 'math', value: '{,}' },
    '%': { mode: 'math', value: '\\%' },
    '²': { mode: 'math', value: '^2' },
    '³': { mode: 'math', value: '^3' },
    pi: { mode: 'math', value: '\\pi' },
    ang: { mode: 'math', value: '\\widehat{#@}' },
    rac: { mode: 'math', value: '\\sqrt{#@}' },
    frac: { mode: 'math', value: '\\frac{#@}{#1}' },
    '/': { mode: 'math', value: '\\frac{#@}{#1}' },
    '<': '<',
    '>': '>',
    '>=': '\\geq',
    '<=': '\\leq',
    '(': '\\lparen',
    ')': '\\rparen',

    alpha: { mode: 'math', value: '\\alpha' },
    beta: { mode: 'math', value: '\\beta' },
    gamma: { mode: 'math', value: '\\gamma' },
    delta: { mode: 'math', value: '\\delta' },
    epsilon: { mode: 'math', value: '\\epsilon' },
    theta: { mode: 'math', value: '\\theta' },
    omega: { mode: 'math', value: '\\omega' },
    lambda: { mode: 'math', value: '\\lambda' },
    cos: { mode: 'math', value: 'cos(#0)' },
    sin: { mode: 'math', value: 'sin(#0)' },
    tan: { mode: 'math', value: 'tan(#0)' },
    '{': { mode: 'math', value: '\\{#0\\}' },
    '[': { mode: 'math', value: '$[$' },
    singleton: { mode: 'math', value: '\\{#0\\}' },
    inf: { mode: 'math', value: '\\infty' },
    union: { mode: 'math', value: '\\cup' },
    inter: { mode: 'math', value: '\\cap' },
    sauf: { mode: 'math', value: '\\backslash\\{#0\\}' },
    integ: { mode: 'math', value: '\\int_#0^#1' },
    lim: { mode: 'math', value: '\\lim_{#0\\to\\ #1}}' },
    som: { mode: 'math', value: '\\sum_#0^#1' },
    Un: { mode: 'math', value: 'U_n' },
    ln: { mode: 'math', value: '\\ln(#0)' },
    exp: { mode: 'math', value: 'e^#0' }, //
    parmi: { mode: 'math', value: '\\tbinom{#0}{#1}' },
    pasachantb: { mode: 'math', value: 'P_{#0}({#1})' },
    barre: { mode: 'math', value: '\\overline{#@}' },
    vec: { mode: 'math', value: '\\overrightarrow{#@}' },
    pow: { mode: 'math', value: '#@^{#1}' },
    gdC: { mode: 'math', value: '\\mathbb{C}' },
    gdR: { mode: 'math', value: '\\mathbb{R}' },
    gdQ: { mode: 'math', value: '\\mathbb{Q}' },
    gdZ: { mode: 'math', value: '\\mathbb{Z}' },
    gdN: { mode: 'math', value: '\\mathbb{N}' }
  },

  hms: {
    D: { mode: 'math', value: 'd' },
    h: { mode: 'text', value: '{\\:\\text{h}\\:}' },
    H: { mode: 'text', value: '{\\:\\text{h}\\:}' },
    min: { mode: 'text', value: '{\\:\\text{min}\\:}' },
    MIN: { mode: 'text', value: '{\\:\\text{min}\\:}' },
    s: { mode: 'text', value: '{\\:\\text{s}\\:}' },
    S: { mode: 'text', value: '{\\:\\text{s}\\:}' },
    '*': { mode: 'math', value: '\\times' },
    '.': { mode: 'math', value: ',' }
  },

  unit: {
    mg: { mode: 'math', value: '\\operatorname{mg}' },
    cg: { mode: 'math', value: '\\operatorname{cg}' },
    dg: { mode: 'math', value: '\\operatorname{dg}' },
    g: { mode: 'math', value: '\\operatorname{g}' },
    dag: { mode: 'math', value: '\\operatorname{dag}' },
    hg: { mode: 'math', value: '\\operatorname{hg}' },
    kg: { mode: 'math', value: '\\operatorname{kg}' },
    mL: { mode: 'math', value: '\\operatorname{mL}' },
    cL: { mode: 'math', value: '\\operatorname{cL}' },
    dL: { mode: 'math', value: '\\operatorname{dL}' },
    L: { mode: 'math', value: '\\operatorname{L}' },
    daL: { mode: 'math', value: '\\operatorname{daL}' },
    hL: { mode: 'math', value: '\\operatorname{hL}' },
    mm: { mode: 'math', value: '\\operatorname{mm}' },
    cm: { mode: 'math', value: '\\operatorname{cm}' },
    dm: { mode: 'math', value: '\\operatorname{dm}' },
    m: { mode: 'math', value: '\\operatorname{m}' },
    dam: { mode: 'math', value: '\\operatorname{dam}' },
    hm: { mode: 'math', value: '\\operatorname{hm}' },
    km: { mode: 'math', value: '\\operatorname{km}' },
    mm2: { mode: 'math', value: '\\operatorname{mm}^2' },
    cm2: { mode: 'math', value: '\\operatorname{cm}^2' },
    dm2: { mode: 'math', value: '\\operatorname{dm}^2' },
    m2: { mode: 'math', value: '\\operatorname{m}^2' },
    dam2: { mode: 'math', value: '\\operatorname{dam}^2' },
    hm2: { mode: 'math', value: '\\operatorname{hm}^2' },
    km2: { mode: 'math', value: '\\operatorname{km}^2' },
    mm3: { mode: 'math', value: '\\operatorname{mm}^3' },
    cm3: { mode: 'math', value: '\\operatorname{cm}^3' },
    dm3: { mode: 'math', value: '\\operatorname{dm}^3' },
    m3: { mode: 'math', value: '\\operatorname{m}^3' },
    dam3: { mode: 'math', value: '\\operatorname{dam}^3' },
    hm3: { mode: 'math', value: '\\operatorname{hm}^3' },
    km3: { mode: 'math', value: '\\operatorname{km}^3' },
    a: { mode: 'math', value: '\\operatorname{a}' },
    ha: { mode: 'math', value: '\\operatorname{ha}' },
    '*': { mode: 'math', value: '\\times' },
    '.': { mode: 'math', value: ',' }
  }
} as ShortcutsByKeyboards
