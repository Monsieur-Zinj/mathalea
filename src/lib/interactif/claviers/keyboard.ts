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
  clavierDeBaseAvecFraction = 'clavierDeBaseAvecFraction',
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
          const unitValuesMatches = value.match(/(?<=\[)[^\][]*(?=])/g)
          const unitValues = unitValuesMatches?.join(',').split(',').map((s) => s.toLowerCase().replace(/[s]$/, '')) || []// tout en minuscule et virer les 's' à la fin
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
