import { enleveElementDouble, shuffle2tableaux } from '../../lib/outils/arrayOutils'
import { sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import { contraindreValeur, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'

import Decimal from 'decimal.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { calculCompare } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Recomposer un décimal ou un entier'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDePublication = '14/08/2022'
export const dateDeModifImportante = '09/10/2023'

function remplaceParZero (chaine, place) {
  if (place > chaine.length) return chaine // On ne peut pas remplacer en dehors de la chaine !
  if (place === 0) return chaine // on ne veut pas remplacer le premier chiffre
  try {
    const debut = chaine.substring(0, place - 1)
    const fin = chaine.substring(place)
    return debut + '0' + fin
  } catch (error) {
    console.error(`Problème dans remplaceParZero avec le nombre : ${chaine} et la position : ${place})`)
  }
}

/*!
 * @author Jean-Claude Lhote
 */
export const uuid = 'f899b'
export const ref = '6N10-7'
export const refs = {
  'fr-fr': ['6N10-7'],
  'fr-ch': ['9NO1-9']
}
export default function RecomposerEntierC3 () {
  Exercice.call(this)
  this.nbQuestions = 4
  this.sup = 5 // nombre de chiffres minimum du nombre à décomposer
  this.sup2 = 7 // nombre de chiffres maximum du nombre à décomposer
  this.sup3 = '1' // 5 initialement à remettre, le 1 c'est pour tester.
  this.sup4 = 4

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      max: 14,
      defaut: 15,
      melange: 15,
      nbQuestions: this.nbQuestions,
      saisie: this.sup3,
      shuffle: false
    })
    /**
     * Une fonction pour ajouter tous les nombres passés en argument.
     * @param args
     * @returns {*}
     */
    const somme = function (listeNombres) {
      return listeNombres.reduce((prev, current) => prev + current)
    }
    const nombreDeChiffresDec = gestionnaireFormulaireTexte({
      min: 0,
      max: 3,
      defaut: 4,
      melange: 4,
      nbQuestions: this.nbQuestions,
      saisie: String(this.sup4),
      shuffle: false
    })

    this.nombreDeChamps = []

    this.premierChamp = []
    this.morceaux = []
    this.exposantMorceaux = []
    const glossaire = [['millième', 'millièmes'], ['centième', 'centièmes'], ['dixième', 'dixièmes'], ['unité', 'unités'], ['dizaine', 'dizaines'], ['centaine', 'centaines'], ['mille', 'mille'], ['dizaine de mille', 'dizaines de mille'], ['centaine de mille', 'centaines de mille'], ['million', 'millions'], ['dizaine de millions', 'dizaines de millions']]
    for (let i = 0, cpt = 0, ee, nbChiffres, nombreDeChiffresMin, nombreDeChiffresMax, texte, texteCorr; i < this.nbQuestions && cpt < 50;) {
      texte = ''
      texteCorr = ''
      let nombreStr = ''
      let nombre
      let blanc = '\\ldots'
      this.morceaux[i] = []
      this.exposantMorceaux[i] = []
      nombreDeChiffresMin = contraindreValeur(nombreDeChiffresDec[i] + 3, 6, this.sup, 5)
      nombreDeChiffresMax = contraindreValeur(nombreDeChiffresMin, 7, this.sup2, nombreDeChiffresMin + 1)
      nbChiffres = randint(nombreDeChiffresMin, nombreDeChiffresMax)
      let formule = ''
      const listeReponses = []
      const completeLesPuissances = function (k, i, morceaux, exposantMorceaux) {
        formule += `(${morceaux[i][k]}\\times %{champ${k + 1}})+`
        const nameProperty = `champ${k + 1}`
        listeReponses.push([nameProperty, { value: String(10 ** exposantMorceaux[i][k]), compare: calculCompare }])
      }
      const completeLesMantisses = function (k, i, morceaux, exposantMorceaux, nombreDeChiffresDec) {
        formule += `(%{champ${k + 1}}\\times${texNombre(10 ** exposantMorceaux[i][k], nombreDeChiffresDec)})+`
        const nameProperty = `champ${k + 1}`
        listeReponses.push([nameProperty, { value: morceaux[i][k], compare: calculCompare }])
      }
      const chiffreDes = function (k, i, morceaux, exposantMorceaux) {
        formule += `\\quad%{champ${k + 1}}\\quad\\text{${glossaire[exposantMorceaux[i][k] + 3][Number(morceaux[i][k]) > 1 ? 1 : 0]}}\\quad+`
        const nameProperty = `champ${k + 1}`
        listeReponses.push([nameProperty, { value: morceaux[i][k], compare: calculCompare }])
      }
      const trouveLeNombre = function (nombre, nombreDeChiffresDec) {
        formule = ': %{champ1}+' // Le '+' c'est parce qu'il y en a dans toutes les autres formules et que le dernier caractère est supprimé
        listeReponses.push(['champ1', { value: nombre.div(10 ** nombreDeChiffresDec).toString(), compare: calculCompare }])
      }
      const morcelleNombre = function (i, nombreStr, melange, morceaux, exposantMorceaux) {
        for (let k = 0; k < nbChiffres; k++) {
          morceaux[i][k] = nombreStr[k]
          exposantMorceaux[i][k] = nbChiffres - 1 - k - nombreDeChiffresDec[i]
        }
        if (melange) shuffle2tableaux(morceaux[i], exposantMorceaux[i])
      }
      const trouveEntierAlea = function (sansZero) {
        let str = ''
        for (let k = 0; k < nbChiffres; k++) {
          if (sansZero || (!sansZero && k === 0)) {
            str += randint(1, 9, str === '' ? [] : Array.from(str).map(el => Number(el))).toString() // On veut des chiffres tous différents sinon ça pose un problème pour l'interactif
            // En effet, chaque chiffre ayant une place définie par rapport à son placeholder, avec des doublons, on aurait des fausses mauvaises réponses.
          } else {
            str += randint(0, 9, Array.from(str).map(el => Number(el))).toString() // On veut des chiffres tous différents sinon ça pose un problème pour l'interactif
            // En effet, chaque chiffre ayant une place définie par rapport à son placeholder, avec des doublons, on aurait des fausses mauvaises réponses.
          }
        }
        if (!sansZero && str.indexOf('0') === -1) {
          str = remplaceParZero(str, randint(2, Math.min(2, str.length - 1)))
        }
        return str
      }
      switch (listeTypeDeQuestions[i]) {
        case 1: // décomposition chiffre par chiffre dans l'ordre sans zéro
          nombreStr = trouveEntierAlea(true)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les nombres (à un seul chiffre) qui conviennent.<br>`
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr = `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          morcelleNombre(i, nombreStr, false, this.morceaux, this.exposantMorceaux)
          for (let k = 0; k < this.morceaux[i].length; k++) {
            completeLesMantisses(k, i, this.morceaux, this.exposantMorceaux, nombreDeChiffresDec[i])
            texteCorr += `(${miseEnEvidence(this.morceaux[i][k])}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], nombreDeChiffresDec[i])})+`
          }
          break
        case 2: // décomposition chiffre par chiffre avec désordre sans zéros
          nombreStr = trouveEntierAlea(true)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les nombres (à un seul chiffre) qui conviennent.<br>`
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr = `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          morcelleNombre(i, nombreStr, true, this.morceaux, this.exposantMorceaux)
          for (let k = 0; k < this.morceaux[i].length; k++) {
            completeLesMantisses(k, i, this.morceaux, this.exposantMorceaux, nombreDeChiffresDec[i])
            texteCorr += `(${miseEnEvidence(this.morceaux[i][k])}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], nombreDeChiffresDec[i])})+`
          }
          break
        case 3: // décomposer en complétant les puissances de 10 sans désordre et sans zéros
          nombreStr = trouveEntierAlea(true)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les valeurs qui conviennent ($1, 10, 100` + (nombreDeChiffresDec[i] === 0 ? `,${texNombre(1000)},...$).<br>` : `,... $ ou bien $${texNombre(0.1)}, ${texNombre(0.01)},...$).<br>`)
          // texte += this.interactif ? texteGras('Si besoin, penser à mettre les espaces nécessaires.<br>') : ''
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr = `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          morcelleNombre(i, nombreStr, false, this.morceaux, this.exposantMorceaux)
          for (let k = 0; k < this.morceaux[i].length; k++) {
            completeLesPuissances(k, i, this.morceaux, this.exposantMorceaux, nombreDeChiffresDec[i])
            texteCorr += `(${this.morceaux[i][k]}\\times ${miseEnEvidence(texNombre(10 ** this.exposantMorceaux[i][k], nombreDeChiffresDec[i]))})+`
          }
          blanc = '\\ldots\\ldots\\ldots'
          break
        case 4: // décomposer en complétant les puissances de 10 avec désordre et sans zéros
          nombreStr = trouveEntierAlea(true)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les valeurs qui conviennent ($1, 10, 100` + (nombreDeChiffresDec[i] === 0 ? `,${texNombre(1000)},...$).<br>` : `,... $ ou bien $${texNombre(0.1)}, ${texNombre(0.01)},...$).<br>`)
          // texte += this.interactif ? texteGras('Si besoin, penser à mettre les espaces nécessaires.<br>') : ''
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr = `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          morcelleNombre(i, nombreStr, true, this.morceaux, this.exposantMorceaux)
          for (let k = 0; k < this.morceaux[i].length; k++) {
            completeLesPuissances(k, i, this.morceaux, this.exposantMorceaux, nombreDeChiffresDec[i])
            texteCorr += `(${this.morceaux[i][k]}\\times ${miseEnEvidence(texNombre(10 ** this.exposantMorceaux[i][k], nombreDeChiffresDec[i]))})+`
          }
          blanc = '\\ldots\\ldots\\ldots'
          break
        case 5: // décomposition chiffre par chiffre en ordre avec zéros possibles
          nombreStr = trouveEntierAlea(false)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les nombres (à un seul chiffre) qui conviennent.<br>`
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          morcelleNombre(i, nombreStr, false, this.morceaux, this.exposantMorceaux)
          for (let k = 0; k < this.morceaux[i].length; k++) {
            if (this.morceaux[i][k] !== '0') {
              completeLesMantisses(k, i, this.morceaux, this.exposantMorceaux, nombreDeChiffresDec[i])
              texteCorr += `(${miseEnEvidence(this.morceaux[i][k])}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], nombreDeChiffresDec[i])})+`
            }
          }
          break
        case 6: // décomposition chiffre par chiffre avec désordre avec zéros possibles
          nombreStr = trouveEntierAlea(false)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les nombres (à un seul chiffre) qui conviennent.<br>`
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr = `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          morcelleNombre(i, nombreStr, true, this.morceaux, this.exposantMorceaux)
          for (let k = 0; k < this.morceaux[i].length; k++) {
            if (this.morceaux[i][k] !== '0') {
              completeLesMantisses(k, i, this.morceaux, this.exposantMorceaux, nombreDeChiffresDec[i])
              texteCorr += `(${miseEnEvidence(this.morceaux[i][k])}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], nombreDeChiffresDec[i])})+`
            }
          }
          break
        case 7: // décomposer en complétant les puissances de 10 sans désordre et avec zéros possibles
          nombreStr = trouveEntierAlea(false)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les valeurs qui conviennent ($1, 10, 100` + (nombreDeChiffresDec[i] === 0 ? `,${texNombre(1000)},...$).<br>` : `,... $ ou bien $${texNombre(0.1)}, ${texNombre(0.01)},...$).<br>`)
          // texte += this.interactif ? texteGras('Si besoin, penser à mettre les espaces nécessaires.<br>') : ''
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr = `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          morcelleNombre(i, nombreStr, false, this.morceaux, this.exposantMorceaux)
          for (let k = 0; k < this.morceaux[i].length; k++) {
            if (this.morceaux[i][k] !== '0') {
              completeLesPuissances(k, i, this.morceaux, this.exposantMorceaux, nombreDeChiffresDec[i])
              texteCorr += `(${this.morceaux[i][k]}\\times ${miseEnEvidence(texNombre(10 ** this.exposantMorceaux[i][k], nombreDeChiffresDec[i]))})+`
            }
          }
          blanc = '\\ldots\\ldots\\ldots'
          break
        case 8: // décomposer en complétant les puissances de 10 avec désordre et avec zéros possibles
          nombreStr = trouveEntierAlea(false)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les valeurs qui conviennent ($1, 10, 100` + (nombreDeChiffresDec[i] === 0 ? `,${texNombre(1000)},...$).<br>` : `,... $ ou bien $${texNombre(0.1)}, ${texNombre(0.01)},...$).<br>`)
          // texte += this.interactif ? texteGras('Si besoin, penser à mettre les espaces nécessaires.<br>') : ''
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr = `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          morcelleNombre(i, nombreStr, true, this.morceaux, this.exposantMorceaux)
          for (let k = 0; k < this.morceaux[i].length; k++) {
            if (this.morceaux[i][k] !== '0') {
              completeLesPuissances(k, i, this.morceaux, this.exposantMorceaux, nombreDeChiffresDec[i])
              texteCorr += `(${this.morceaux[i][k]}\\times ${miseEnEvidence(texNombre(10 ** this.exposantMorceaux[i][k], nombreDeChiffresDec[i]))})+`
            }
          }
          blanc = '\\ldots\\ldots\\ldots'
          break

        case 9: // trouver le nombre sans groupement  en ordre sans zéros
          nombreStr = trouveEntierAlea(true)
          nombre = new Decimal(nombreStr)
          texte += 'Donner le nombre correspondant à <br>$'
          morcelleNombre(i, nombreStr, false, this.morceaux, this.exposantMorceaux)
          texteCorr = '$'
          for (let k = 0; k < this.morceaux[i].length - 1; k++) {
            if (this.morceaux[i][k] !== '0') {
              texte += `${this.morceaux[i][k]}$ ${glossaire[this.exposantMorceaux[i][k] + 3][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}$${sp(2)}+${sp(2)}`
              texteCorr += `${this.morceaux[i][k]}$ ${glossaire[this.exposantMorceaux[i][k] + 3][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}$${sp(2)}+${sp(2)}`
            }
          }
          ee = this.morceaux[i].length - 1
          texte += `${this.morceaux[i][ee]}$ ${glossaire[this.exposantMorceaux[i][ee] + 3][Number(this.morceaux[i][ee]) > 1 ? 1 : 0]}${sp(2)}`
          texteCorr += `${this.morceaux[i][ee]}$ ${glossaire[this.exposantMorceaux[i][ee] + 3][Number(this.morceaux[i][ee]) > 1 ? 1 : 0]}${sp(2)}`
          texteCorr += `$=${miseEnEvidence(texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i]))} `
          trouveLeNombre(nombre, nombreDeChiffresDec[i])
          break
        case 10: // trouver le nombre avec groupement en ordre sans zéros
          nombreStr = trouveEntierAlea(true)
          nombre = new Decimal(nombreStr)
          texte += 'Donner le nombre correspondant à <br>$'
          texteCorr = '$'
          for (let k = 0, j, index = 0; index < nbChiffres; k++) { // on prépare la correction pour l'exo non interactif
            let testeur = 0
            do {
              j = randint(1, 3)
              testeur++
              this.morceaux[i][k] = nombreStr.substring(index, Math.min(index + j, nbChiffres)).replace(/^0+/g, '')
              this.exposantMorceaux[i][k] = nbChiffres - Math.min(index + j, nbChiffres) - nombreDeChiffresDec[i]
            } while (this.morceaux[i][k] === '' && testeur < 100)
            if (testeur === 100) {
              window.notify('boucle sans fin detectée case 10 6N10-7', { nombreStr })
            }
            index += j
          }
          for (let k = 0; k < this.morceaux[i].length - 1; k++) {
            if (this.morceaux[i][k] !== '0') {
              texte += `${this.morceaux[i][k]}$ ${glossaire[this.exposantMorceaux[i][k] + 3][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}$${sp(2)}+${sp(2)}`
              texteCorr += `${this.morceaux[i][k]}$ ${glossaire[this.exposantMorceaux[i][k] + 3][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}$${sp(2)}+${sp(2)}`
            }
          }
          ee = this.morceaux[i].length - 1
          texte += `${this.morceaux[i][ee]}$ ${glossaire[this.exposantMorceaux[i][ee] + 3][Number(this.morceaux[i][ee]) > 1 ? 1 : 0]}${sp(2)}`
          texteCorr += `${this.morceaux[i][ee]}$ ${glossaire[this.exposantMorceaux[i][ee] + 3][Number(this.morceaux[i][ee]) > 1 ? 1 : 0]}${sp(2)}`
          trouveLeNombre(nombre, nombreDeChiffresDec[i])
          texteCorr += `$=${miseEnEvidence(texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i]))} `
          break
        case 11: // trouver le nombre avec groupement en ordre avec zéros
          nombreStr = trouveEntierAlea(false)
          nombre = new Decimal(nombreStr)
          texte += 'Donner le nombre correspondant à <br>$'
          texteCorr = '$'
          for (let k = 0, j, index = 0; index < nbChiffres; k++) { // on prépare la correction pour l'exo non interactif
            let testeur = 0
            do {
              j = randint(1, 3)
              testeur++
              this.morceaux[i][k] = nombreStr.substring(index, Math.min(index + j, nbChiffres)).replace(/^0+/g, '')
              this.exposantMorceaux[i][k] = nbChiffres - Math.min(index + j, nbChiffres) - nombreDeChiffresDec[i]
            } while (this.morceaux[i][k] === '' && testeur < 100)
            if (testeur === 100) {
              window.notify('boucle sans fin detectée case 11 6N10-7', { nombreStr })
            }
            index += j
          }
          for (let k = 0; k < this.morceaux[i].length - 1; k++) {
            if (this.morceaux[i][k] !== '0') {
              texte += `${this.morceaux[i][k]}$ ${glossaire[this.exposantMorceaux[i][k] + 3][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}$${sp(2)}+${sp(2)}`
              texteCorr += `${this.morceaux[i][k]}$ ${glossaire[this.exposantMorceaux[i][k] + 3][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}$${sp(2)}+${sp(2)}`
            }
          }
          ee = this.morceaux[i].length - 1
          texte += `${this.morceaux[i][ee]}$ ${glossaire[this.exposantMorceaux[i][ee] + 3][Number(this.morceaux[i][ee]) > 1 ? 1 : 0]}${sp(2)}`
          texteCorr += `${this.morceaux[i][ee]}$ ${glossaire[this.exposantMorceaux[i][ee] + 3][Number(this.morceaux[i][ee]) > 1 ? 1 : 0]}${sp(2)}`
          trouveLeNombre(nombre, nombreDeChiffresDec[i])
          texteCorr += `$=${miseEnEvidence(texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i]))} `
          break

        case 12: // décomposer chiffre par chiffre avec désordre avec zéros avec les noms des classes
          nombreStr = trouveEntierAlea(false)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les nombres (à un seul chiffre) qui conviennent.<br>`
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr = `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          morcelleNombre(i, nombreStr, true, this.morceaux, this.exposantMorceaux)
          enleveElementDouble(this.morceaux[i], this.exposantMorceaux[i], '0')
          for (let k = 0; k < this.morceaux[i].length; k++) {
            chiffreDes(k, i, this.morceaux, this.exposantMorceaux)
            texteCorr += `${sp(2)}${miseEnEvidence(this.morceaux[i][k])}$ ${glossaire[this.exposantMorceaux[i][k] + 3][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}$${sp(2)}+`
          }
          break
        case 13: { // décomposer avec les puissances de 10 en désordre présence de deux zéros consécutifs
          nombreStr = trouveEntierAlea(true)
          const place = randint(2, nbChiffres - 1)
          nombreStr = remplaceParZero(nombreStr, place)
          nombreStr = remplaceParZero(nombreStr, place + 1)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les valeurs qui conviennent ($1, 10, 100` + (nombreDeChiffresDec[i] === 0 ? `,${texNombre(1000)},...$).<br>` : `,... $ ou bien $${texNombre(0.1)}, ${texNombre(0.01)},...$).<br>`)
          //  texte += this.interactif ? texteGras('Si besoin, penser à mettre les espaces nécessaires.<br>') : ''
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr = `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          morcelleNombre(i, nombreStr, true, this.morceaux, this.exposantMorceaux)
          for (let k = 0; k < this.morceaux[i].length; k++) {
            if (this.morceaux[i][k] !== '0') {
              completeLesPuissances(k, i, this.morceaux, this.exposantMorceaux, nombreDeChiffresDec[i])
              texteCorr += `(${miseEnEvidence(this.morceaux[i][k])}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], nombreDeChiffresDec[i])})+`
            }
          }
        }
          blanc = '\\ldots\\ldots\\ldots'
          break
        case 14: { // décomposer avec les puissances de 10 avec groupement et désordre et présence de deux zéros consécutifs
          nombreStr = trouveEntierAlea(true)
          const place = randint(2, nbChiffres - 2)
          nombreStr = remplaceParZero(nombreStr, place)
          nombreStr = remplaceParZero(nombreStr, place + 1)
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}$ en complétant avec les valeurs qui conviennent ($1, 10, 100` + (nombreDeChiffresDec[i] === 0 ? `,${texNombre(1000)},...$).<br>` : `,... $ ou bien $${texNombre(0.1, 1)}, ${texNombre(0.01, 2)},...$).<br>`)
          // texte += this.interactif ? texteGras('Si besoin, penser à mettre les espaces nécessaires.<br>') : ''
          texte += `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=$`
          texteCorr = `$${texNombre(nombre.div(10 ** nombreDeChiffresDec[i]), nombreDeChiffresDec[i])}=`
          for (let k = 0, j, index = 0; index < nbChiffres; k++) { // on prépare la correction pour l'exo non interactif
            let testeur = 0
            do {
              testeur++
              j = randint(1, 3)
              this.morceaux[i][k] = nombreStr.substring(index, Math.min(index + j, nbChiffres)).replace(/^0+/g, '')
            } while (this.morceaux[i][k] === '' && testeur < 100)
            if (testeur === 100) {
              window.notify('boucle sans fin detectée case 14 6N10-7', { nombreStr })
            }
            this.exposantMorceaux[i][k] = nbChiffres - Math.min(index + j, nbChiffres) - nombreDeChiffresDec[i]
            index += j
          }
          shuffle2tableaux(this.morceaux[i], this.exposantMorceaux[i])
          for (let k = 0; k < this.morceaux[i].length; k++) {
            if (this.morceaux[i][k] !== '0') {
              completeLesPuissances(k, i, this.morceaux, this.exposantMorceaux, nombreDeChiffresDec[i])
              texteCorr += `(${this.morceaux[i][k]}\\times ${miseEnEvidence(texNombre(10 ** this.exposantMorceaux[i][k], nombreDeChiffresDec[i]))})+`
            }
          }
        }
          blanc = '\\ldots\\ldots\\ldots'
          break
      }
      // if (this.interactif) {
      texte += remplisLesBlancs(this, i, formule.substring(0, formule.length - 1), 'inline college6eme largeur01 nospacebefore', blanc)
      // bareme est une fonction qui retourne [nbBonnesReponses, nbReponses]
      handleAnswers(this, i, Object.assign({ bareme: (listePoints) => [Math.floor(somme(listePoints) / listePoints.length), 1] }, Object.fromEntries(listeReponses)), { formatInteractif: 'fillInTheBlank' })
      //   }
      texte = texte.substring(0, texte.length - 1) + '$'
      texteCorr = texteCorr.substring(0, texteCorr.length - 1) + '$'

      texte += this.interactif ? '<br>' : ''

      if (context.isAmc) {
        this.autoCorrection[i] =
                    {
                      enonce: texte + '<br>',
                      propositions: [
                        {
                          texte: texteCorr,
                          statut: 1, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                          sanscadre: true
                        }
                      ]
                    }
      }

      texte += (context.isHtml && this.interactif) ? `<span id=resultatCheckEx${this.numeroExercice}Q${i}></span>` : ''

      if (this.questionJamaisPosee(i, nombre)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Nombre de chiffres minimum des nombres à décomposer', 6]
  this.besoinFormulaire2Numerique = ['Nombre de chiffres maximum des nombres à décomposer', 7]
  this.besoinFormulaire3Texte = ['Type de questions', 'Nombres séparés par des tirets\n1 : Chiffrée en ordre sans zéro\n2 : Chiffrée en désordre sans zéro\n3 : Puissances de dix en ordre sans zéro\n4 : Puissances de dix en désordre sans zéro\n5 : Chiffrée en ordre avec zéros possibles\n6 : Chiffrée en désordre avec zéros possibles\n7 : Puissances de dix en ordre avec zéros possibles\n8 : Puissances de dix en désordre avec zéros possibles\n9 : Trouver le nombre en ordre sans zéro\n10 : Trouver le nombre en désordre avec zéro avec groupement\n11 : Trouver le nombre en désordre sans zéro avec groupement\n12 : Trouver le nombre en ordre avec zéros possibles avec groupement\n13 : Trouver le nombre en désordre avec zéros possibles\n14 : Puissances de dix en désordre deux zéros consécutifs sans groupement\n15 : Mélange']
  this.besoinFormulaire4Texte = ['Nombre de chiffres de la partie décimale', '0 : Aucun chiffre dans la partie décimale\n1 : Un seul chiffre dans la partie décimale\n2 : Que deux chiffres dans la partie décimale\n3 : Que trois chiffres dans la partie décimale\n4 : Mélange']
  this.correctionInteractive = (i) => {
    const champsTexte = []
    const saisies = []
    if (this.premierChamp[i] === undefined) return 'OK'
    const spanResultat = document.querySelector(`#resultatCheckEx${this.numeroExercice}Q${i}`)
    let resultatOK = true
    for (let k = 0; k < this.nombreDeChamps[i]; k++) {
      champsTexte[k] = document.getElementById(`champTexteEx${this.numeroExercice}Q${k + this.premierChamp[i]}`)
      saisies[k] = champsTexte[k].value.replace(',', '.').replace(/\((\+?-?\d+)\)/, '$1')
      resultatOK = resultatOK && parseInt(saisies[k]) === parseInt(this.autoCorrection[this.premierChamp[i] + k].reponse.valeur.reponse.value)
    }
    if (resultatOK) {
      spanResultat.innerHTML += '😎'
      return 'OK'
    } else {
      spanResultat.innerHTML += '☹️'
      return 'KO'
    }
  }
}
