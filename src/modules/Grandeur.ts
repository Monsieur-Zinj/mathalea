import Decimal from 'decimal.js'
import { stringNombre, texNombre } from '../lib/outils/texNombre'

/**
 * @class
 * @param {number} mesure
 * @param {string} unite (cm, cm^2, m^3, L, kg)
 * @author Jean-Claude Lhote et Sébastien Lozano
*/
class Grandeur {
  mesureDecimal: Decimal
  unite: string
  puissanceUnite: number
  uniteDeReference: string
  prefixe: string
  puissancePrefixe: number
  constructor (mesure: number | Decimal, unite: string) {
    this.mesureDecimal = mesure instanceof Decimal ? mesure : new Decimal(mesure)
    this.unite = unite
    const uniteParsee = parseUnite(unite)
    this.puissanceUnite = uniteParsee.puissanceUnite
    this.uniteDeReference = uniteParsee.uniteDeReference
    this.prefixe = uniteParsee.prefixe
    this.puissancePrefixe = uniteParsee.puissancePrefixe
  }

  get mesure () {
    return this.mesureDecimal.toNumber()
  }

  set mesure (mesure: number) {
    this.mesureDecimal = new Decimal(mesure)
  }

  /**
     * La conversion se fait entre dérivées de la même unité
     * et entre dérivées de m³ et des dérivées de L
     * et entre dérivées de m² et des ares ou hectares
     * @param {string} uniteConversion (cm, cm^2...)
     * @returns {Longueur}
     * @author Modifiée par Eric Elter
     */
  convertirEn (uniteConversion: string) {
    const uniteConversionParsee = parseUnite(uniteConversion) // Unité de conversion (issue de la saisie)
    if (uniteConversionParsee.puissanceUnite === this.puissanceUnite && uniteConversionParsee.uniteDeReference === this.uniteDeReference) { // Mêmes unités
      return new Grandeur(this.mesureDecimal.times(10 ** ((this.puissancePrefixe - uniteConversionParsee.puissancePrefixe) * this.puissanceUnite)), uniteConversion)
    } else if (uniteConversionParsee.uniteDeReference === 'm^3' && this.uniteDeReference === 'L') { // On met tout en litres.
      return new Grandeur(this.mesureDecimal.times(10 ** ((this.puissancePrefixe - uniteConversionParsee.puissancePrefixe - 3)) * this.puissanceUnite), 'L')
    } else if (uniteConversionParsee.uniteDeReference === 'L' && this.uniteDeReference === 'm^3') { // On met tout en m³.
      return new Grandeur(this.mesureDecimal.times(10 ** (this.puissancePrefixe * this.puissanceUnite + 3)), 'm^3')
    } else if (uniteConversionParsee.uniteDeReference === 'm^2' && this.uniteDeReference === 'a') { // On met tout en m².
      return new Grandeur(this.mesureDecimal.times(10 ** (this.puissancePrefixe + 2)), 'm^2')
    } else if (uniteConversionParsee.uniteDeReference === 'a' && this.uniteDeReference === 'm^2') { // On met tout en a.
      return new Grandeur(this.mesureDecimal.times(10 ** (this.puissancePrefixe * this.puissanceUnite - 2)), 'a')
    } else throw new Error(`Conversion impossible de ${this.unite} en ${uniteConversion}`)
  }

  estEgal (unite2: Grandeur) {
    if (unite2.uniteDeReference !== this.uniteDeReference) return false
    try {
      const u1 = this.convertirEn(this.uniteDeReference)
      const u2 = unite2.convertirEn(this.uniteDeReference)
      if (u1 && u2) {
        return u1.mesure === u2.mesure
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  /**
   * La précision est donnée dans l'unité la plus petite des deux grandeurs
   */
  estUneApproximation (unite2: Grandeur, precision: number) {
    if (unite2.uniteDeReference !== this.uniteDeReference) return false
    try {
      let u1: Grandeur
      let u2: Grandeur
      if (this.puissancePrefixe > unite2.puissancePrefixe) {
        u1 = this.convertirEn(unite2.unite)
        u2 = unite2
      } else {
        u1 = this.convertirEn(this.unite)
        u2 = unite2.convertirEn(this.unite)
      }
      if (u1 !== undefined && u2 !== undefined) {
        return (Math.abs(u1.mesure - u2.mesure) <= precision)
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  /**
   * Retourne une chaîne de caractères de la forme '12,345 cm'
   * @param precision
   * @returns
   */
  toString (precision = 12) {
    const nbChiffrePartieDecimale = String(this.mesure).split('.')[1]?.length
    if (nbChiffrePartieDecimale < precision) precision = nbChiffrePartieDecimale
    return `${stringNombre(this.mesure, precision).replace('.', ',')}\u202f${this.unite}`
  }

  /**
   * Retourne une chaîne de caractères de la forme '12,345~\\text{cm}'
   * @param precision
   * @returns
   */
  toTex (precision = 12) {
    return `${texNombre(this.mesure, precision).replace('.', ',')}~\\text{${this.unite}}`
  }

  get latexUnit () {
    return `\\text{${this.prefixe}${this.uniteDeReference.split('^')[0]}}${this.puissanceUnite === 1 ? '' : `^{${this.puissanceUnite.toString()}}`}`
  }

  /**
     * Crée une grandeur à partir d'un texte '1 cm', '2 m^2', '3~\\text{L}'...
     * @param {sting} text
     * @returns Grandeur
     */
  static fromString (text: string) {
    text = text.replace('\\,', '')
    text = text.replace('~', '')
    text = text.replace(',', '.')
    text = text.replace(' ', '')
    text = text.replace(/\\text{([^}]+)}/g, '$1')
    const mesure = parseFloat(text)
    const unite = text.replace(String(mesure), '')
    const grandeur = new Grandeur(mesure, unite)
    return grandeur
  }
}

export default Grandeur

function parseUnite (unite: string) {
  let puissanceUnite: number
  let avantPuissanceUnite: string
  if (unite === '°') {
    puissanceUnite = 1
    avantPuissanceUnite = '°'
  }
  if (unite === '°C') {
    puissanceUnite = 1
    avantPuissanceUnite = '°C'
  }

  if (unite.indexOf('^') > 0) { // m² ou m³ et ses dérivées
    puissanceUnite = Number(unite.split('^')[1])
    avantPuissanceUnite = unite.split('^')[0]
  } else if (unite.indexOf('ha') === 0) { // hectares
    puissanceUnite = 1
    avantPuissanceUnite = 'ha'
  } else if (unite.indexOf('a') === 0) { // ares
    puissanceUnite = 1
    avantPuissanceUnite = 'a'
  } else if (unite.indexOf('ca') === 0) { // centiares
    puissanceUnite = 1
    avantPuissanceUnite = 'ca'
  } else { // m, g, L et leurs dérivées
    puissanceUnite = 1
    avantPuissanceUnite = unite
  }
  const prefixe = unite === '°C' ? '' : ['t', 'q'].includes(unite) ? unite : avantPuissanceUnite.substring(0, avantPuissanceUnite.length - 1) // Pour prendre en compte la tonne aussi.
  const puissancePrefixe = prefixeToPuissance(prefixe, unite)
  const uniteDeReference = ['t', 'q'].includes(unite) ? 'g' : unite.substring(prefixe.length)
  return { prefixe, uniteDeReference, puissanceUnite, puissancePrefixe }
}

function prefixeToPuissance (prefixe: string, unite: string) {
  let puissancePrefixe: number
  switch (prefixe) {
    case 'm':
      puissancePrefixe = -3
      break
    case 'c':
      puissancePrefixe = -2
      break
    case 'd':
      puissancePrefixe = -1
      break
    case '':
      puissancePrefixe = 0
      break
    case 'da':
      puissancePrefixe = 1
      break
    case 'h':
      puissancePrefixe = 2
      break
    case 'k':
      puissancePrefixe = 3
      break
    case 'q': // quintal
      puissancePrefixe = unite === 'q' ? 5 : NaN
      break
    case 't': // tonne
      puissancePrefixe = unite === 't' ? 6 : NaN
      break
    case 'M':
      puissancePrefixe = 6
      break
    case 'G':
      puissancePrefixe = 9
      break
    case 'T':
      puissancePrefixe = 12
      break
    case '\\mu{}':
      puissancePrefixe = -6
      break
    case 'n':
      puissancePrefixe = -9
      break
    default:
      puissancePrefixe = NaN
  }
  return puissancePrefixe
}
