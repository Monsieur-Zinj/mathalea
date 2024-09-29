import { choice, shuffle2tableaux } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import {
  contraindreValeur,
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
  randint
} from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'

import Decimal from 'decimal.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = 'Recomposer un entier'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDePublication = '14/08/2022'
export const dateDeModificationImportante = '24/08/2024'
export const glossaire = [
  ['unité', 'unités'],
  ['dizaine', 'dizaines'],
  ['centaine', 'centaines'],
  ['mille', 'mille'],
  ['dizaine de mille', 'dizaines de mille'],
  ['centaine de mille', 'centaines de mille'],
  ['million', 'millions'],
  ['dizaine de millions', 'dizaines de millions'],
  ['centaine de millions', 'centaines de millions'],
  ['milliard', 'milliards'],
  ['dizaine de milliards', 'dizaines de milliards'],
  ['centaine de milliards', 'centaines de milliards']
]

/*!
 * @author Jean-Claude Lhote
 * Référence c3N10-1
 */
export const uuid = 'c96de'
export const ref = 'c3N10-1'
export const refs = {
  'fr-fr': ['c3N10-1'],
  'fr-ch': ['9NO1-8']
}
export default function RecomposerEntierC3 () {
  Exercice.call(this)
  this.nbQuestions = 4
  this.sup = false // false pour des puissances de 10 en chiffres, true pour lettres
  this.sup2 = 7 // nombre de chiffres maximum du nombre à décomposer
  this.sup3 = '5'
  this.sup4 = '4'
  this.sup5 = false
  this.nombreDeChiffresMin = 4
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup3,
      max: 4,
      defaut: 5,
      melange: 5,
      nbQuestions: this.nbQuestions
    })
    // Pour activer le mélange
    const desordonne = this.sup5
    const enLettre = this.sup
    const presenceZeros = gestionnaireFormulaireTexte({
      saisie: this.sup4,
      min: 1,
      max: 3,
      defaut: 4,
      melange: 4,
      nbQuestions: this.nbQuestions
    })
    // ça c'est pour éviter de ne pas pouvoir fabriquer les nombres.
    const nombreDeChiffresMin = this.nombreDeChiffresMin
    const nombreDeChiffresMax = contraindreValeur(
      nombreDeChiffresMin,
      11,
      this.sup2,
      6
    )
    this.nombreDeChamps = []
    this.premierChamp = []
    this.morceaux = []
    this.exposantMorceaux = []
    for (
      let i = 0, cpt = 0, texte, texteCorr, indexChamp = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      texte = ''
      texteCorr = ''
      const nbChiffres = randint(nombreDeChiffresMin, nombreDeChiffresMax)
      let nombreStr = ''
      let nombre

      this.morceaux[i] = []
      this.exposantMorceaux[i] = []
      const presenceDeZeros = Number(presenceZeros[i])

      switch (listeTypeDeQuestions[i]) {
        case 1: // décomposition chiffre par chiffre dans l'ordre
          for (let k = 0; k < nbChiffres; k++) {
            nombreStr += randint(1, 9).toString()
          }
          if (presenceDeZeros > 1) {
            const arrayFromNbr = Array.from(nombreStr)
            const indexOfZero = randint(1, arrayFromNbr.length - 2)
            arrayFromNbr[indexOfZero] = 0
            if (presenceDeZeros === 3) arrayFromNbr[indexOfZero + 1] = 0
            nombreStr = arrayFromNbr.join('')
          }
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre, 0)}$ en complétant avec les nombres (à un seul chiffre) qui conviennent.<br>`
          texte += `$${texNombre(nombre, 0)}=`
          texteCorr += `$${texNombre(nombre, 0)}=`
          this.premierChamp[i] = indexChamp
          for (let k = 0; k < nbChiffres; k++) {
            this.morceaux[i][k] = nombreStr[k]
            this.exposantMorceaux[i][k] = nbChiffres - 1 - k
          }
          if (desordonne) {
            shuffle2tableaux(this.morceaux[i], this.exposantMorceaux[i])
          }

          for (let k = 0; k < this.morceaux[i].length; k++) {
            if (this.morceaux[i][k] !== '0') {
              if (this.interactif) {
                texte += enLettre
                  ? `${ajouteChampTexteMathLive(this, indexChamp, 'largeur01 ' + KeyboardType.clavierDeBase)}~${glossaire[this.exposantMorceaux[i][k]][this.morceaux[i][k] > 1 ? 1 : 0]}+`
                  : `($${ajouteChampTexteMathLive(this, indexChamp, 'largeur01 ' + KeyboardType.clavierDeBase)}$\\times${texNombre(10 ** this.exposantMorceaux[i][k], 0)})+`
                setReponse(this, indexChamp, this.morceaux[i][k])
                indexChamp++
              } else {
                texte += `${
                  enLettre
                    ? `\\ldots~\\text{${glossaire[this.exposantMorceaux[i][k]][this.morceaux[i][k] > 1 ? 1 : 0]}}+`
                    : `(\\ldots\\times ${texNombre(10 ** this.exposantMorceaux[i][k], 0)})+`
                }`
              }
              texteCorr += enLettre
                ? `${this.morceaux[i][k]}~\\text{${glossaire[this.exposantMorceaux[i][k]][this.morceaux[i][k] > 1 ? 1 : 0]}}+`
                : `(${this.morceaux[i][k]}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], 0)})+`
            }
          }
          texte = `${texte.substring(0, texte.length - 1)}$`
          texteCorr = `${texteCorr.substring(0, texteCorr.length - 1)}$`
          this.nombreDeChamps[i] = indexChamp - this.premierChamp[i]

          break
        case 2: // décomposer en complétant les puissances de 10
          for (let k = 0; k < nbChiffres; k++) {
            nombreStr += randint(1, 9, nombreStr).toString()
          }
          if (presenceDeZeros > 1) {
            const arrayFromNbr = Array.from(nombreStr)
            const indexOfZero = randint(1, arrayFromNbr.length - 2)
            arrayFromNbr[indexOfZero] = 0
            if (presenceDeZeros === 3) arrayFromNbr[indexOfZero + 1] = 0
            nombreStr = arrayFromNbr.join('')
          }
          nombre = new Decimal(nombreStr)
          texte += `Décomposer le nombre $${texNombre(nombre, 0)}$ en complétant avec les ${enLettre ? 'adjectifs numéraux' : 'valeurs'} qui conviennent ${enLettre ? 'unité, dizaine(s), centaine(s)...' : `($1, 10, 100,${texNombre(1000, 3)},...$)`}.<br>`
          texte += `$${texNombre(nombre, 0)}=`
          texteCorr = `$${texNombre(nombre, 0)}=`
          this.premierChamp[i] = indexChamp
          for (let k = 0; k < nbChiffres; k++) {
            // on prépare la correction pour l'exo non interactif
            this.morceaux[i][k] = nombreStr[k]
            this.exposantMorceaux[i][k] = nbChiffres - 1 - k
          }
          if (desordonne) {
            shuffle2tableaux(this.morceaux[i], this.exposantMorceaux[i])
          }
          for (let k = 0; k < this.morceaux[i].length; k++) {
            if (this.interactif) {
              if (this.morceaux[i][k] !== '0') {
                texte += `(${this.morceaux[i][k]}\\times $${ajouteChampTexteMathLive(this, indexChamp, 'largeur01 ' + `${this.sup ? KeyboardType.numeration : KeyboardType.clavierDeBase}`)}$)+`

                setReponse(
                  this,
                  indexChamp,
                  enLettre
                    ? glossaire[this.exposantMorceaux[i][k]][
                      this.morceaux[i][k] > 1 ? 1 : 0
                    ]
                    : 10 ** this.exposantMorceaux[i][k]
                )
                indexChamp++
              }
            } else {
              if (this.morceaux[i][k] !== '0') {
                texte += `(${this.morceaux[i][k]}\\times \\ldots)+`
              }
            }
            if (this.morceaux[i][k] !== '0') {
              texteCorr += enLettre
                ? `${this.morceaux[i][k]}~\\text{${glossaire[this.exposantMorceaux[i][k]][this.morceaux[i][k] > 1 ? 1 : 0]}}+`
                : `(${this.morceaux[i][k]}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], 0)})+`
            }
          }
          texte = `${texte.substring(0, texte.length - 1)}$`
          texteCorr = `${texteCorr.substring(0, texteCorr.length - 1)}$`
          this.nombreDeChamps[i] = indexChamp - this.premierChamp[i]
          break
        case 3: // trouver le nombre sans groupement
          for (let k = 0; k < nbChiffres; k++) {
            nombreStr += randint(1, 9).toString()
          }
          if (presenceDeZeros > 1) {
            const arrayFromNbr = Array.from(nombreStr)
            const indexOfZero = randint(1, arrayFromNbr.length - 2)
            arrayFromNbr[indexOfZero] = 0
            if (presenceDeZeros === 3) arrayFromNbr[indexOfZero + 1] = 0
            nombreStr = arrayFromNbr.join('')
          }
          nombre = new Decimal(nombreStr)
          texte +=
            "Donner le nombre correspondant au premier membre de l'égalité.<br>$"
          this.premierChamp[i] = indexChamp
          for (let k = 0; k < nbChiffres; k++) {
            this.morceaux[i][k] = nombreStr[k]
            this.exposantMorceaux[i][k] = nbChiffres - 1 - k
          }
          texteCorr = '$'
          if (desordonne) {
            shuffle2tableaux(this.morceaux[i], this.exposantMorceaux[i])
          }
          for (let k = 0; k < this.morceaux[i].length; k++) {
            if (this.morceaux[i][k] !== '0') {
              texte += enLettre
                ? `${this.morceaux[i][k]}~\\text{${glossaire[this.exposantMorceaux[i][k]][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}}+`
                : `(${this.morceaux[i][k]}~\\times ${texNombre(10 ** this.exposantMorceaux[i][k], 0)})+`
              texteCorr += enLettre
                ? `${this.morceaux[i][k]}~\\text{${glossaire[this.exposantMorceaux[i][k]][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}}+`
                : `(${this.morceaux[i][k]}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], 0)})+`
            }
          }
          texte = `${texte.substring(0, texte.length - 1)}`
          texteCorr = texteCorr.substring(0, texteCorr.length - 1)
          texteCorr += `=${texNombre(nombre, 0)}$`
          if (!this.interactif) {
            texte += '= \\ldots\\ldots\\ldots$'
          } else {
            setReponse(this, indexChamp, nombre)
            texte += `=$${ajouteChampTexteMathLive(this, indexChamp, 'largeur01 ' + `${enLettre ? KeyboardType.numeration : KeyboardType.clavierDeBase}`)}`
            indexChamp++
          }
          this.nombreDeChamps[i] = indexChamp - this.premierChamp[i]

          break
        case 4: // trouver le nombre avec groupement
          for (let k = 0; k < nbChiffres; k++) {
            nombreStr += randint(1, 9).toString()
          }
          if (presenceDeZeros > 1) {
            const arrayFromNbr = Array.from(nombreStr)
            const indexOfZero = randint(1, arrayFromNbr.length - 2)
            arrayFromNbr[indexOfZero] = 0
            if (presenceDeZeros === 3) arrayFromNbr[indexOfZero + 1] = 0
            nombreStr = arrayFromNbr.join('')
          }
          nombre = new Decimal(nombreStr)
          texte +=
            "Donner le nombre correspondant au premier membre de l'égalité.<br>$"
          texteCorr = '$'
          this.premierChamp[i] = indexChamp
          for (let k = 0, j, index = 0; index < nbChiffres; k++) {
            // on prépare la correction pour l'exo non interactif
            let testeur = 0
            do {
              testeur++
              j = choice([2, 2, 3]) // statistiquement 2 fois plus de groupements de 2 chiffres que de 3 chiffres (mais c'est sans compter les 0)
              this.morceaux[i][k] = nombreStr
                .substring(index, Math.min(index + j, nbChiffres))
                .replace(/^0+/g, '')
              this.exposantMorceaux[i][k] =
                nbChiffres - Math.min(index + j, nbChiffres)
            } while (this.morceaux[i][k] === '' && testeur < 100)
            if (this.morceaux[i][k] === '') break
            index += j
          }
          if (this.morceaux[i][this.morceaux[i].length - 1] === '') this.morceaux[i].pop()
          if (desordonne) {
            shuffle2tableaux(this.morceaux[i], this.exposantMorceaux[i])
          }
          for (let k = 0; k < this.morceaux[i].length; k++) {
            if (this.morceaux[i][k] !== '0') {
              texte += enLettre
                ? `${this.morceaux[i][k]}~\\text{${glossaire[this.exposantMorceaux[i][k]][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}}+`
                : `(${this.morceaux[i][k]}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], 0)})+`
              texteCorr += enLettre
                ? `${this.morceaux[i][k]}~\\text{${glossaire[this.exposantMorceaux[i][k]][Number(this.morceaux[i][k]) > 1 ? 1 : 0]}}+`
                : `(${this.morceaux[i][k]}\\times ${texNombre(10 ** this.exposantMorceaux[i][k], 0)})+`
            }
          }
          texte = `${texte.substring(0, texte.length - 1)}`
          texteCorr = texteCorr.substring(0, texteCorr.length - 1)
          if (!this.interactif) {
            texte += ' = \\ldots\\ldots\\ldots$'
          } else {
            setReponse(this, indexChamp, nombre)
            texte += `=$${ajouteChampTexteMathLive(this, indexChamp, 'largeur01 ' + `${this.sup ? KeyboardType.numeration : KeyboardType.clavierDeBase}`)}`
            indexChamp++
          }
          texteCorr += `=${texNombre(nombre, 0)}$`
          this.nombreDeChamps[i] = indexChamp - this.premierChamp[i]
          break
      }
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: '$texte<br>',
          propositions: [
            {
              texte: texteCorr,
              statut: 1, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
              sanscadre: true
            }
          ]
        }
      }

      texte += context.isHtml
        ? `<div id=divDuSmiley${this.numeroExercice}Q${i} style= "display: inline-block"></div>`
        : ''
      if (this.questionJamaisPosee(i, nombreStr)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireCaseACocher = [
    'Puissance de 10 en chiffres/lettres',
    false
  ]
  this.besoinFormulaire2Numerique = [
    'Nombre de chiffres maximum des nombres à décomposer',
    9
  ]
  this.besoinFormulaire3Texte = [
    'Types de question séparés par des tirets',
    '1 : Décomposer (donner les chiffres)\n2 : Décomposer (compléter avec 10, 100...)\n3 : Composer (sans groupement)\n4 : Composer avec groupement\n5 : Mélange'
  ]
  this.besoinFormulaire4Texte = [
    'Présence de zéro(s) ',
    'Nombres séparés par des tirets\n1 : Sans zéro\n2 : Avec un zéro\n3 : Avec deux zéros consécutifs\n4 : Mélange'
  ]
  this.besoinFormulaire5CaseACocher = ['Décomposition désordonnée', false]
  this.correctionInteractive = (i) => {
    const champsTexte = []
    const saisies = []
    if (this.premierChamp[i] === undefined) return 'OK'
    const divFeedback = document.querySelector(
      `#divDuSmiley${this.numeroExercice}Q${i}`
    )
    let resultatOK = true
    for (let k = 0; k < this.nombreDeChamps[i]; k++) {
      champsTexte[k] = document.getElementById(
        `champTexteEx${this.numeroExercice}Q${k + this.premierChamp[i]}`
      )
      saisies[k] = champsTexte[k].value
        .replace(',', '.')
        .replace(/\((\+?-?\d+)\)/, '$1')
      resultatOK =
        resultatOK &&
        Number.parseInt(saisies[k]) ===
          Number.parseInt(
            this.autoCorrection[this.premierChamp[i] + k].reponse.valeur.reponse
              .value
          )
    }
    if (resultatOK) {
      divFeedback.innerHTML += '😎'
      return 'OK'
    }
    divFeedback.innerHTML += '☹️'
    return 'KO'
  }
}
