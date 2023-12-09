import * as pkg from '@cortex-js/compute-engine'
import { all, create, Fraction } from 'mathjs'
import { choice } from '../../lib/outils/arrayOutils.js'
import { lettreMinusculeDepuisChiffre } from '../../lib/outils/outilString.js'
import { context } from '../../modules/context.js'
import { contraindreValeur, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { calculer } from '../../modules/outilsMathjs.js'
import Exercice from '../Exercice.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { tableauColonneLigne } from '../../lib/2d/tableau.js'
import { AddTabDbleEntryMathlive } from '../../lib/interactif/tableaux/AjouteTableauMathlive'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { fraction } from '../../modules/fractions.js'
const { ComputeEngine } = pkg
let engine
if (context.versionMathalea) engine = new ComputeEngine()
export const titre = 'Générateur de Yohaku'
export const interactifReady = true
export const interactifType = 'custom'
const math = create(all)

/**
 * @class
 * @property {'entiers'|'entiers relatifs'|'littéraux'|'fractions positives'|'fractions relatives'|'fractions dénominateurs multiples'|'fractions positives dénominateurs premiers'} type
 * @property {number?} largeur
 * @property {number?} hauteur
 * @property {number?} taille
 * @property {number?} Case
 * @property {number[]|string[]|FractionEtendue[]?} cellules
 * @property {'addition'|'multiplication'} operation = 'addition'
 * @property {number} valeurMax = 50,
 * @property {boolean} solution = false,
 * @property {number[]|string[]|FractionEtendue[]} cellulesPreremplies = []
 */
export class Yohaku {
  constructor ({
    type = 'entiers',
    largeur = 2,
    hauteur = 2,
    taille = 3,
    Case,
    cellules = [],
    resultats = [],
    operation = 'addition',
    valeurMax = 50,
    solution = false,
    cellulesPreremplies = []
  }) {
    this.largeur = largeur
    this.hauteur = hauteur
    this.Case = Case
    this.resultats = resultats
    this.taille = taille || 2
    this.operation = operation || 'addition'
    this.valeurMax = valeurMax || 50
    this.solution = solution
    this.type = type
    this.cellulesPreremplies = cellulesPreremplies
    // Si les cellules ne sont pas données, on en calcule le contenu aléatoirement.
    if (cellules === undefined || cellules.length === 0) {
      cellules = []
      const den = randint(2, this.valeurMax)
      for (let i = 0; i < this.taille ** 2; i++) {
        switch (this.type) {
          case 'entiers' :
            cellules.push(randint(1, this.valeurMax))
            break
          case 'entiers relatifs' :
            cellules.push(randint(-this.valeurMax, this.valeurMax, 0))
            break
          case 'littéraux' :
            cellules.push(calculer(`${randint(1, this.valeurMax)}x + ${randint(1, this.valeurMax)}`, {}).printResult)
            break
          case 'fractions dénominateurs multiples':
            cellules.push(fraction(randint(1, this.valeurMax), den))
            break
          case 'fractions positives dénominateurs premiers':
            cellules.push(fraction(randint(1, this.valeurMax), choice([2, 3, 5, 7])))
            break

          case 'fractions positives' :
            cellules.push(fraction(randint(1, this.valeurMax), randint(2, this.valeurMax)))
            break
          case 'fractions relatives' :
            cellules.push(fraction(randint(-this.valeurMax, this.valeurMax, 0), randint(2, this.valeurMax)))
            break
        }
      }
    } else { // si elles sont définies, on complète éventuellement la grille aléatoirement.
      for (let i = this.cellules.length; i < this.taille ** 2; i++) {
        switch (this.type) {
          case 'entiers' :
            cellules.push(randint(1, this.valeurMax))
            break
          case 'entiers relatifs' :
            cellules.push(randint(-this.valeurMax, this.valeurMax, 0))
            break
          case 'littéraux' :
            cellules.push(calculer(`${randint(1, this.valeurMax)}x + ${randint(1, this.valeurMax)}`, {}).printResult)
            break
          case 'fractions dénominateurs multiples':
            console.log(cellules[i - 1])
            cellules.push(fraction(randint(1, this.valeurMax), cellules[i - 1].d))
            break
          case 'fractions positives dénominateurs premiers':
            cellules.push(fraction(randint(1, this.valeurMax), choice([2, 3, 5, 7])))
            break
          case 'fractions positives' :
            cellules.push(fraction(randint(1, this.valeurMax), randint(2, this.valeurMax)))
            break
          case 'fractions relatives' :
            cellules.push(fraction(randint(-this.valeurMax, this.valeurMax, 0), randint(2, this.valeurMax)))
            break
        }
      }
    }
    this.cellules = cellules
  }

  // méthode qui calcule les résultats si on le veut (sinon on peut les renseigner dans this.resultats manuellement)
  calculeResultats () {
    let valeurs
    for (let i = 0; i < this.taille; i++) {
      valeurs = []
      for (let j = 0; j < this.taille; j++) {
        valeurs.push(this.cellules[i + j * this.taille])
      }
      this.resultats[i] = this.operate(valeurs)
    }
    for (let i = this.taille; i < this.taille * 2; i++) {
      valeurs = []
      for (let j = 0; j < this.taille; j++) {
        valeurs.push(this.cellules[(i - this.taille) * this.taille + j])
      }
      this.resultats[i] = this.operate(valeurs)
    }
  }

  // fonction utilisée par calculeResultats
  operate (valeurs) {
    const valeursConverties = valeurs.map((val) => {
      if (!isNaN(val) && typeof val === 'number' && this.type.includes('entier')) return Number(val)
      if (val instanceof FractionEtendue) return val
      if (val instanceof Fraction) return fraction(val.s * val.n, val.d)
      if (typeof val === 'string') {
        if (val.includes('\\frac')) {
          const fracVal = engine.parse(val.replace('dfrac', 'frac')).numericValue
          if (Array.isArray(fracVal)) return fraction(...fracVal)
          return fraction(fracVal, 1)
        }
        return `${val.replaceAll(/\s/g, '')}`
      }
      return val.valueOf()
    })
    let initialValue
    switch (this.operation) {
      case 'addition':
        if (this.type !== 'littéraux') {
          if (this.type.substring(0, 4) === 'frac') {
            initialValue = new FractionEtendue(0, 1)
            return valeursConverties.reduce((previous, current) => previous.sommeFraction(current), initialValue).texFraction
          } else {
            initialValue = math.number(0)
            return valeursConverties.reduce((previous, current) => math.add(previous, current), initialValue).toString()
          }
        } else {
          initialValue = math.parse('0')
          return valeursConverties.reduce((previous, current) => calculer(`${previous.toString()}+${current.toString()}`, {}).printResult, initialValue).replaceAll(/\s/g, '')
        }
      case 'multiplication':
        if (this.type !== 'littéraux') {
          if (this.type.substring(0, 4) === 'frac') {
            initialValue = new FractionEtendue(1, 1)
            return valeursConverties.reduce((previous, current) => previous.produitFraction(current).simplifie(), initialValue).texFraction
          } else {
            initialValue = math.number(1)
            return valeursConverties.reduce((previous, current) => math.multiply(previous, current), initialValue).toString()
          }
        } else {
          initialValue = math.parse('1')
          return valeursConverties.reduce((previous, current) => calculer(`(${previous.toString()})*(${current.toString()})`, {}).printResult, initialValue).replaceAll(/\s/g, '')
        }
    }
  }

  /**
   * Retourne le tableau
   * @param {boolean} isInteractif
   * @returns {string}
   */
  representation ({ numeroExercice, question, classes = '' }) {
    const tabEnteteColonnes = [this.operation === 'addition' ? '+' : '\\times']
    for (let i = 0; i < this.taille; i++) {
      tabEnteteColonnes.push(this.resultats[i] instanceof FractionEtendue ? this.resultats[i].texFraction : this.resultats[i])
    }
    const tabEnteteLignes = []
    for (let i = this.taille; i < 2 * this.taille; i++) {
      tabEnteteLignes.push(this.resultats[i] instanceof FractionEtendue ? this.resultats[i].texFraction : this.resultats[i])
    }
    const tabLignes = []
    for (let i = 0; i < this.taille ** 2; i++) {
      if (this.solution) {
        tabLignes.push(this.cellules[i] instanceof FractionEtendue ? this.cellules[i].texFraction : this.cellules[i])
      } else {
        if (this.Case == null) {
          tabLignes.push('')
        } else {
          if (i === this.Case) {
            tabLignes.push(this.cellules[i] instanceof FractionEtendue ? this.cellules[i].texFraction : this.cellules[i])
          } else {
            tabLignes.push('')
          }
        }
      }
    }
    if (context.isHtml) {
      const tab = AddTabDbleEntryMathlive.create(numeroExercice, question, AddTabDbleEntryMathlive.convertTclToTableauMathlive(tabEnteteColonnes, tabEnteteLignes, tabLignes), classes)
      return tab.output
    } else {
      return tableauColonneLigne(tabEnteteColonnes, tabEnteteLignes, tabLignes, 2, true)
    }
  }
}

export const uuid = '3a377'
export const ref = 'Yohaku'

export default function FabriqueAYohaku () {
  Exercice.call(this)
  this.nbQuestions = 3
  this.sup = 30
  this.sup2 = 1
  this.sup3 = 3
  this.sup4 = false
  this.type = 'entiers'
  this.yohaku = []
  this.besoinFormulaireNumerique = ['Valeur maximale des données', 999]
  this.besoinFormulaire2Numerique = ['Opération', 2, '1 : Addition\n2 : Multiplication']
  this.besoinFormulaire3Numerique = ['Taille de la grille (nombre de cases horizontales)', 5]
  this.besoinFormulaire4CaseACocher = ['Avec aide', false]
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    const type = this.type
    for (let i = 0, cpt = 0, texte, texteCorr; i < this.nbQuestions && cpt < 50;) {
      const donnees = []
      const taille = contraindreValeur(2, 5, this.sup3, 3)
      const valeurMax = contraindreValeur(taille ** 2 + 1, 999, this.sup, 30)
      const operateur = this.sup2 === 1 ? 'addition' : 'multiplication'
      const Case = this.sup4 ? randint(0, taille ** 2 - 1) : null
      const cellulesPreremplies = []
      if (this.interactif) {
        for (let k = 0; k < taille ** 2; k++) {
          cellulesPreremplies[k] = lettreMinusculeDepuisChiffre(k + 1)
        }
      }
      const largeur = this.type === 'littéraux' ? operateur === 'addition' ? 4 : 5 : 2
      const yohaku = new Yohaku({
        type,
        taille,
        largeur,
        operation: operateur,
        cellules: donnees,
        Case,
        valeurMax,
        cellulesPreremplies
      })
      yohaku.calculeResultats()
      const mot = type === 'littéraux' ? ['expressions', 'contenues'] : ['nombres', 'contenus']
      this.introduction = operateur === 'addition'
        ? `Les ${mot[0]} en bout de ligne ou de colonne sont les sommes des ${mot[0]} ${mot[1]} dans la ligne ou la colonne.`
        : `Les ${mot[0]} en bout de ligne ou de colonne sont les produits des ${mot[0]} ${mot[1]} dans la ligne ou la colonne.`
      this.introduction += `<br>Compléter ${this.nbQuestions === 1 ? 'la' : 'chaque'} grille avec des ${mot[0]} qui conviennent (plusieurs solutions possibles).<br>`
      texte = yohaku.representation({ numeroExercice: this.numeroExercice, question: i })
      texteCorr = 'La grille ci-dessous n\'est donnée qu\'à titre d\'exemple, il y a d\'autres solutions.<br><br>'
      yohaku.solution = true
      texteCorr += yohaku.representation({ numeroExercice: this.numeroExercice, question: i, isInteractif: false })
      const arrayReponses = []
      for (let l = 0; l < taille; l++) {
        for (let c = 0; c < taille; c++) {
          arrayReponses.push([`L${l + 1}C${c + 1}`, yohaku.cellules[l * taille + c]])
        }
      }
      const reponses = Object.fromEntries(arrayReponses)
      setReponse(this, i, reponses, { formatInteractif: 'tableauMathlive' })
      this.yohaku[i] = yohaku
      if (this.questionJamaisPosee(i, ...yohaku.cellules)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.correctionInteractive = i => {
    const taille = parseInt(this.sup3)
    let cell
    const divFeedbacks = []
    const saisies = []
    for (let l = 0; l < taille; l++) {
      divFeedbacks[l] = []
      for (let c = 0; c < taille; c++) {
        cell = document.getElementById(`champTexteEx${this.numeroExercice}Q${i}L${l + 1}C${c + 1}`)
        if (cell != null) {
          divFeedbacks[l][c] = document.querySelector(`#divDuSmileyEx${this.numeroExercice}Q${i}L${l + 1}C${c + 1}`)
          if (this.yohaku[i].type === 'littéraux') { // on ne parse pas si c'est du littéral. On blinde pour les champs vide.
            saisies[l * taille + c] = cell.value.replace(',', '.') ?? '0'
          } else {
            saisies[l * taille + c] = cell.value.replace(',', '.').replace(/\((\+?-?\d+)\)/, '$1') ?? '0'
            // on peut taper des entiers dans les Yohaku fraction, mais ils doivent être modifiés en fraction pour le calcul
            if (!isNaN(saisies[l * taille + c]) && this.yohaku[i].type.includes('frac')) {
              saisies[l * taille + c] = `\\frac{${saisies[l * taille + c]}}{1}`
            }
          }
        } else if (cell == null && l * taille + c !== this.yohaku[i].Case) {
          window.notify(`Pas de cellule L${l + 1}C${c + 1} dans le document`)
        } else {
          saisies[l * taille + c] = this.yohaku[i].cellules[this.yohaku[i].Case]
        }
      }
    }
    let resultat
    if (this.saisieCoherente(saisies, taille, i)) {
      for (let l = 0; l < taille; l++) {
        for (let c = 0; c < taille; c++) {
          if (divFeedbacks[l][c] != null) {
            divFeedbacks[l][c].innerHTML = '😎'
          }
        }
      }
      resultat = 'OK'
    } else {
      for (let l = 0; l < taille; l++) {
        for (let c = 0; c < taille; c++) {
          if (divFeedbacks[l][c] != null) {
            divFeedbacks[l][c].innerHTML = '☹️'
          }
        }
      }
      resultat = 'KO'
    }
    return resultat
  }
  this.saisieCoherente = function (saisies, taille, question) {
    let resultatOK = true
    const test = function (yohaku, i, valeurs, resultatOK) {
      let resultVal = yohaku[question].operate(valeurs)
      let resultatAttendu = yohaku[question].resultats[i]
      console.log(`resultVal: ${resultVal} resultatAttendu : ${resultatAttendu}`)
      if (typeof resultatAttendu === 'string') {
        resultVal = engine.parse(resultVal.replace('dfrac', 'frac'))
        resultatAttendu = engine.parse(resultatAttendu.replace('dfrac', 'frac'))
        if (yohaku.type === 'littéraux') {
          resultatOK = resultatOK && resultVal.isSame(resultatAttendu)
        } else {
          resultatOK = resultatOK && resultVal.isEqual(resultatAttendu)
        }
      } else {
        resultatOK = resultatOK && math.equal(Number(resultVal), Number(resultatAttendu))
      }
      return resultatOK
    }
    for (let i = 0; i < taille; i++) {
      const valeurs = []
      for (let j = 0; j < taille; j++) {
        if (this.yohaku[question].type === 'littéraux') {
          valeurs.push(saisies[i + j * taille] ?? '0')
        } else {
          valeurs.push(saisies[i + j * taille])
        }
      }
      resultatOK = test(this.yohaku, i, valeurs, resultatOK)
    }
    for (let i = taille; i < taille * 2; i++) {
      const valeurs = []
      for (let j = 0; j < taille; j++) {
        if (this.yohaku[question].type === 'littéraux') {
          valeurs.push(saisies[(i - taille) * taille + j] ?? '0')
        } else {
          valeurs.push(saisies[(i - taille) * taille + j])
        }
      }
      resultatOK = test(this.yohaku, i, valeurs, resultatOK)
    }
    return resultatOK
  }
}
