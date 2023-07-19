import Decimal from 'decimal.js'
import { evaluate, format } from 'mathjs'
import { context } from '../../modules/context.js'
import {
  tropDeChiffres
} from '../../modules/outils.js'
import { miseEnEvidence } from '../embellissements.js'
import { extraireRacineCarree } from './calculs.js'
import { nombreDeChiffresDansLaPartieDecimale } from './nombres.js'
import { sp } from './outilString.js'
const math = { format, evaluate }
/**
 *
 * @param {Entier} n
 * retourne le code Latex de la racine carrée de n réduite
 * @author Jean-CLaude Lhote
 */
export function texRacineCarree (n) {
  const result = extraireRacineCarree(n)
  if (result[1] === 1) return `${result[0]}`
  else if (result[0] === 1) return `\\sqrt{${result[1]}}`
  else return `${result[0]}\\sqrt{${result[1]}}`
}

/**
 * Utilise la class Decimal pour s'assurer qu'il n'y a pas d'erreur dans les calculs avec des décimaux
 * Le 2e argument facultatif permet de préciser l'arrondi souhaité
 * @author Rémi Angot
 */
export function nombreDecimal (expression, arrondir = false) {
  if (!arrondir) {
    return stringNombre(new Decimal(expression), 15)
  } else {
    return stringNombre(new Decimal(expression), arrondir)
  }
}

/**
 * renvoie le résultat de l'expression en couleur (vert=positif, rouge=négatif, noir=nul)
 * @param {string} expression l'expression à calculer
 */
export function texNombreCoul (nombre, positif = 'green', negatif = 'red', nul = 'black') {
  if (nombre > 0) return miseEnEvidence(texNombre(nombre), positif)
  else if (nombre < 0) return miseEnEvidence(texNombre(nombre), negatif)
  else return miseEnEvidence(texNombre(0), nul)
}

/**
 * @author Frédéric Piou
 * @param {number} nb
 * @returns retourne un nombre au format français
 */
export function numberFormat (nb) {
  return Intl.NumberFormat('fr-FR', { maximumFractionDigits: 20 }).format(nb).toString().replace(/\s+/g, '\\thickspace ')
}

/**
 * La chaîne de caractères en sortie doit être interprétée par KateX et doit donc être placée entre des $ $
 * Renvoie "Trop de chiffres" s'il y a plus de 15 chiffres significatifs (et donc un risque d'erreur d'approximation)
 * S'utilise indifféremment avec des nombres (nb) au format natif (entier, flottant) ou au format Decimal (nécessite la librairie decimal.js)
 * Avec comme avantage immédiat pour le format Decimal : precision est illimité.
 * Sinon, renvoie un nombre dans le format français (avec une virgule et des espaces pour séparer les classes dans la partie entière et la partie décimale)
 * @author Guillaume Valmont
 * @param {number} nb nombre qu'on veut afficher
 * @param {number} precision nombre de décimales demandé
 * @param {boolean} completerZeros si true, le nombre de décimale en precision est imposé (ajout de zéros inutiles éventuels)
 * @param {boolean} aussiCompleterEntiers si true ajoute des zéros inutiles aux entiers si compléterZeros est true aussi
 * @returns string avec le nombre dans le format français à mettre entre des $ $
 */
export function texNombre (nb, precision = 8, completerZeros = false, aussiCompleterEntiers = false) {
  const result = afficherNombre(nb, precision, 'texNombre', completerZeros, aussiCompleterEntiers)
  return result.replace(',', '{,}').replace(/\s+/g, '\\,')
}

/**
 * Renvoie un nombre dans le format français (séparateur de classes) pour la partie entière comme pour la partie décimale
 * @author Rémi Angot
 */
export function texNombre2 (nb) {
  let nombre = math.format(nb, { notation: 'auto', lowerExp: -12, upperExp: 12, precision: 12 }).replace('.', ',')
  const rangVirgule = nombre.indexOf(',')
  let partieEntiere = ''
  if (rangVirgule !== -1) {
    partieEntiere = nombre.substring(0, rangVirgule)
  } else {
    partieEntiere = nombre
  }
  let partieDecimale = ''
  if (rangVirgule !== -1) {
    partieDecimale = nombre.substring(rangVirgule + 1)
  }

  for (let i = partieEntiere.length - 3; i > 0; i -= 3) {
    partieEntiere = partieEntiere.substring(0, i) + '\\,' + partieEntiere.substring(i)
  }
  for (let i = 3; i < partieDecimale.length; i += 5) {
    partieDecimale = partieDecimale.substring(0, i) + '\\,' + partieDecimale.substring(i)
    i += 12
  }
  if (partieDecimale === '') {
    nombre = partieEntiere
  } else {
    nombre = partieEntiere + '{,}' + partieDecimale
  }
  return nombre
}

/**
 * Renvoie un nombre dans le format français (séparateur de classes) pour la partie entière comme pour la partie décimale
 * Avec espace géré par nbsp en HTML pour pouvoir l'inclure dans une phrase formatée en français et pas seulement un calcul.
 * Modif EE pour la gestion de l'espace dans un texte non mathématique
 * @author Eric Elter d'après la fonction de Rémi Angot
 * Rajout Octobre 2021 pour 6C14
 */
export function texNombre3 (nb) {
  let nombre = math.format(nb, { notation: 'auto', lowerExp: -12, upperExp: 12, precision: 12 }).replace('.', ',')
  const rangVirgule = nombre.indexOf(',')
  let partieEntiere = ''
  if (rangVirgule !== -1) {
    partieEntiere = nombre.substring(0, rangVirgule)
  } else {
    partieEntiere = nombre
  }
  let partieDecimale = ''
  if (rangVirgule !== -1) {
    partieDecimale = nombre.substring(rangVirgule + 1)
  }

  for (let i = partieEntiere.length - 3; i > 0; i -= 3) {
    partieEntiere = partieEntiere.substring(0, i) + sp() + partieEntiere.substring(i)
  }
  for (let i = 3; i <= partieDecimale.length; i += 3) {
    partieDecimale = partieDecimale.substring(0, i) + sp() + partieDecimale.substring(i)
    i += 12
  }
  if (partieDecimale === '') {
    nombre = partieEntiere
  } else {
    nombre = partieEntiere + ',' + partieDecimale
  }
  return nombre
}

/**
 * Renvoie un nombre dans le format français (séparateur de classes)
 * Fonctionne sans le mode maths contrairement à texNombre()
 * insereEspaceDansNombre fonctionne peut-être mieux
 * @author Rémi Angot
 */
export function nombreAvecEspace (nb) {
  if (isNaN(nb)) {
    window.notify('nombreAvecEspace : argument NaN ou undefined', { nb })
    return 'NaN'
  }
  // Ecrit \nombre{nb} pour tous les nombres supérieurs à 1 000 (pour la gestion des espaces)
  if (context.isHtml) {
    return Intl.NumberFormat('fr-FR', { maximumFractionDigits: 20 }).format(nb).toString().replace(/\s+/g, ' ')
  } else {
    let result
    if (nb > 999 || nombreDeChiffresDansLaPartieDecimale(nb) > 3) {
      result = '\\numprint{' + nb.toString().replace('.', ',') + '}'
    } else {
      result = Number(nb).toString().replace('.', '{,}')
    }
    return result
  }
}

/**
 *
 * @param {number} mantisse
 * @param {integer} exp
 * @returns {string} Écriture décimale avec espaces
 */
export function scientifiqueToDecimal (mantisse, exp) {
  if (exp < -6) Decimal.set({ toExpNeg: exp - 1 })
  else if (exp > 20) Decimal.set({ toExpPos: exp + 1 })
  return texNombre(new Decimal(mantisse).mul(Decimal.pow(10, exp)), 10)
}

/**
 * Destinée à être utilisée hors des $ $
 * Signale une erreur en console s'il y a plus de 15 chiffres significatifs (et donc qu'il y a un risque d'erreur d'approximation)
 * Sinon, renvoie le nombre à afficher dans le format français (avec virgule et des espaces pour séparer les classes dans la partie entière et la partie décimale)
 * @author Jean-Claude Lhote
 * @author Guillaume Valmont
 * @param {number} nb nombre qu'on veut afficher
 * @param {number} precision nombre de décimales demandé
 * @param {boolean} completerZeros si true, le nombre de décimale en precision est imposé (ajout de zéros inutiles éventuels)
 * @param {boolean} aussiCompleterEntiers si true ajoute des zéros inutiles aux entiers si compléterZeros est true aussi
 * @returns string avec le nombre dans le format français à placer hors des $ $
 */
export function stringNombre (nb, precision = 8, completerZeros = false, aussiCompleterEntiers = false) {
  return afficherNombre(nb, precision, 'stringNombre', completerZeros, aussiCompleterEntiers)
}

/**
 * Fonction auxiliaire aux fonctions stringNombre et texNombre
 * Vérifie le nombre de chiffres significatifs en fonction du nombre de chiffres de la partie entière de nb et du nombre de décimales demandées par le paramètre precision
 * S'il y a plus de 15 chiffres significatifs, envoie un message à bugsnag et renvoie un nombre avec 15 chiffres significatifs
 * Sinon, renvoie un nombre avec le nombre de décimales demandé
 * @author Guillaume Valmont
 * @param {number} nb nombre qu'on veut afficher
 * @param {number} precision nombre de décimales demandé
 * @param {string} fonction nom de la fonction qui appelle afficherNombre (texNombre ou stringNombre) -> sert pour le message envoyé à bugsnag
 * @param {boolean} completerZeros si true, le nombre de décimale en precision est imposé (ajout de zéros inutiles éventuels)
 * @param {boolean} aussiCompleterEntiers true si on veut ajouter des zéros inutiles aux entiers
 */
function afficherNombre (nb, precision, fonction, completerZeros = false, aussiCompleterEntiers) {
  /**
   * Fonction auxiliaire de stringNombre pour une meilleure lisibilité
   * Elle renvoie un nombre dans le format français (avec virgule et des espaces pour séparer les classes dans la partie entière et la partie décimale)
   * @author Rémi Angot
   * @author Guillaume Valmont
   * @param {number} nb nombre à afficher
   * @param {number} precision nombre de décimales demandé
   * @returns string avec le nombre dans le format français
   */
  function insereEspacesNombre (nb, nbChiffresPartieEntiere, precision, fonction) {
    let signe
    let nombre
    const maximumSignificantDigits = nbChiffresPartieEntiere + precision
    if (nb instanceof Decimal) {
      signe = nb.isNeg()
      if (nb.abs().gte(1)) {
        if (completerZeros) {
          nombre = nb.toFixed(precision).replace('.', ',')
        } else {
          nombre = nb.toDP(precision).toString().replace('.', ',')
        }
      } else {
        if (completerZeros) {
          nombre = nb.toFixed(precision).replace('.', ',')
        } else {
          nombre = nb.toDP(precision).toString().replace('.', ',')
        }
      }
    } else { // nb est un number
      signe = nb < 0
      // let nombre = math.format(nb, { notation: 'fixed', lowerExp: -precision, upperExp: precision, precision: precision }).replace('.', ',')
      if (Math.abs(nb) < 1) { // si il est < 1, on n'a pas à se préoccuper de savoir si il est entier pour aussiCompleterEntiers
        if (completerZeros) {
          nombre = Intl.NumberFormat('fr-FR', {
            maximumFractionDigits: precision,
            minimumFractionDigits: precision
          }).format(nb)
        } else {
          nombre = Intl.NumberFormat('fr-FR', { maximumFractionDigits: precision }).format(nb)
        }
      } else {
        if (completerZeros && ((aussiCompleterEntiers && Number.isInteger(nb)) || (!Number.isInteger(nb)))) {
          nombre = Intl.NumberFormat('fr-FR', {
            maximumSignificantDigits,
            minimumSignificantDigits: maximumSignificantDigits
          }).format(nb)
        } else {
          nombre = Intl.NumberFormat('fr-FR', { maximumSignificantDigits }).format(nb)
        }
      }
    }
    const rangVirgule = nombre.indexOf(',')
    let partieEntiere = ''
    if (rangVirgule !== -1) {
      partieEntiere = nombre.substring(0, rangVirgule)
    } else {
      partieEntiere = nombre
    }
    let partieDecimale = ''
    if (rangVirgule !== -1) {
      partieDecimale = nombre.substring(rangVirgule + 1)
    }
    // La partie entière est déjà formatée par le Intl.NumberFormat('fr-FR', { maximumSignificantDigits }).format(nb)
    // Dans le cas d'un Number, mais pas d'un Decimal
    if (nb instanceof Decimal) {
      if (signe) partieEntiere = partieEntiere.substring(1)
      for (let i = partieEntiere.length - 3; i > 0; i -= 3) {
        partieEntiere = partieEntiere.substring(0, i) + ' ' + partieEntiere.substring(i)
      }
      if (signe) partieEntiere = '-' + partieEntiere
    }
    for (let i = 3; i < partieDecimale.length; i += (fonction === 'texNombre' ? 5 : 4)) { // des paquets de 3 nombres + 1 espace
      partieDecimale = partieDecimale.substring(0, i) + (fonction === 'texNombre' ? '\\,' : ' ') + partieDecimale.substring(i)
    }
    if (partieDecimale === '') {
      nombre = partieEntiere
    } else {
      nombre = partieEntiere + ',' + partieDecimale
    }
    return nombre
  } // fin insereEspacesNombre()

  // si nb n'est pas un nombre, on le retourne tel quel, on ne fait rien.
  if (isNaN(nb) && !(nb instanceof Decimal)) {
    window.notify('AfficherNombre : Le nombre n\'en est pas un', { nb, precision, fonction })
    return ''
  }
  if (nb instanceof Decimal) {
    if (nb.isZero()) return '0'
  } else if (Number(nb) === 0) return '0'
  let nbChiffresPartieEntiere
  if (nb instanceof Decimal) {
    if (nb.abs().lt(1)) {
      nbChiffresPartieEntiere = 0
    } else {
      nbChiffresPartieEntiere = nb.abs().toFixed(0).length
    }
    if (nb.isInteger() && !aussiCompleterEntiers) precision = 0
    else if (typeof precision !== 'number') { // Si precision n'est pas un nombre, on le remplace par la valeur max acceptable
      precision = 15 - nbChiffresPartieEntiere
    } else if (precision < 0) {
      precision = 0
    }
  } else { // nb est un number
    if (Math.abs(nb) < 1) {
      nbChiffresPartieEntiere = 0
    } else {
      // attention 9.7 donner 10 avec Math.abs(9.7).toFixed(0)
      nbChiffresPartieEntiere = Math.floor(Math.abs(nb)).toFixed(0).length
    }
    if (Number.isInteger(nb) && !completerZeros) {
      precision = 0
    } else {
      if (typeof precision !== 'number') { // Si precision n'est pas un nombre, on le remplace par la valeur max acceptable
        precision = 15 - nbChiffresPartieEntiere
      } else if (precision < 0) {
        precision = 0
      }
    }
  }

  const maximumSignificantDigits = nbChiffresPartieEntiere + precision

  if ((maximumSignificantDigits > 15) && (!(nb instanceof Decimal))) { // au delà de 15 chiffres significatifs, on risque des erreurs d'arrondi
    window.notify(fonction + ` : ${tropDeChiffres}`, { nb, precision })
    return insereEspacesNombre(nb, nbChiffresPartieEntiere, precision, fonction)
  } else {
    return insereEspacesNombre(nb, nbChiffresPartieEntiere, precision, fonction)
  }
}

/**
 * Pour bien afficher les centimes avec 2 chiffres après la virgule
 * @author Rémi Angot
 */
export function texPrix (nb) {
  if (nb instanceof Decimal) {
    if (nb.isInteger()) return texNombre(nb, 0)
    else return texNombre(nb, 2, true)
  }
  const nombre = Number(nb)
  if (nombre.toString() === nombre.toFixed(0)) {
    return texNombre(nb, 0)
  } else {
    return texNombre(nb, 2, true)
  }
}

/**
 * Pour afficher les masses avec 3 chiffres après la virgule
 * @author Mireille Gain
 */
export function texMasse (nb) {
  if (nb instanceof Decimal) {
    if (nb.isInteger()) return texNombre(nb, 0)
    else return texNombre(nb, 3, true)
  }
  const nombre = Number(nb)
  if (nombre.toString() === nombre.toFixed(0)) {
    return texNombre(nb, 0)
  } else {
    return texNombre(nb, 3, true)
  }
}

/**
 * Fonction qui renvoie un tableau contenant la mantisse et l'exposant de l'écriture scientique d'un nombre donné en paramètres sous sa forme décimale.
 * @param nbDecimal
 *
 * @example
 * // Renvoie [4.1276,1]
 * range(decimalToScientifique,[41.276])
 * // Renvoie [3.48,-2]
 * range(decimalToScientifique,[0.0348])
 * // Renvoie [-2.315,3]
 * range(decimalToScientifique,[-2315])
 *
 * @author Eric Elter
 */
export function decimalToScientifique (nbDecimal) {
  let exposant = 0
  let mantisseNb = new Decimal(nbDecimal)
  if (mantisseNb.abs().gte(10)) {
    while (exposant < 50 && mantisseNb.abs().gt(10)) {
      mantisseNb = mantisseNb.div(10)
      exposant++
    }
    return [mantisseNb.toNumber(), exposant]
  } else if (mantisseNb.abs().lt(1)) {
    while (exposant < 50 && mantisseNb.abs().lt(1)) {
      mantisseNb = mantisseNb.mul(10)
      exposant++
    }
    return [mantisseNb.toNumber(), -1 * exposant]
  } else return [nbDecimal, 0]
}

export function dataTaille (taille) {
  if (context.vue !== 'diap' || taille === 1) {
    return ''
  } else if (taille !== 1) {
    return `data-taille = "${taille}"`
  }
}
