import { randint } from '../../modules/outils'
import { calculer } from '../../modules/outilsMathjs'
import { fraction } from '../../modules/fractions'
import { choice } from './arrayOutils'
import { context } from '../../modules/context'
import { AddTabDbleEntryMathlive } from '../interactif/tableaux/AjouteTableauMathlive'
import { tableauColonneLigne } from '../2d/tableau'
import { ComputeEngine } from '@cortex-js/compute-engine'

const engine = new ComputeEngine()

/**
 * @class
 * @property {'entiers'|'entiers relatifs'|'littéraux'|'fractions positives'|'fractions relatives'|'fractions dénominateurs multiples'|'fractions positives dénominateurs premiers'} type
 * @property {number?} largeur
 * @property {number?} hauteur
 * @property {number?} taille
 * @property {number?} Case
 * @property {string[]} cellules
 * @property {'addition'|'multiplication'} operation = 'addition'
 * @property {number} valeurMax = 50,
 * @property {boolean} solution = false,
 * @author Jean-Claude Lhote
 */
export class Yohaku {
  type: string
  largeur:number
  hauteur:number
  taille:number
  Case:number|undefined
  cellules: string[]
  cellulesPreremplies: string[]
  resultats:string[]
  operation:'addition'|'multiplication'
  solution: boolean
  constructor ({ type, largeur, hauteur, taille, Case, cellules, operation, valeurMax, solution }:
                   {type: string, largeur: number, hauteur: number, taille: number, Case: number |undefined, cellules: string[], resultats: string[], operation: 'addition'|'multiplication', valeurMax: number, solution: boolean} = {
    type: 'entiers',
    largeur: 2,
    hauteur: 2,
    taille: 2,
    Case: undefined,
    resultats: [],
    operation: 'addition',
    valeurMax: 50,
    solution: false,
    cellules: []
  }) {
    this.largeur = largeur
    this.hauteur = hauteur
    this.Case = Case
    this.resultats = []
    this.taille = taille
    this.operation = operation
    this.solution = solution
    this.type = type
    this.cellules = cellules ?? []
    this.cellulesPreremplies = []
    if (this.cellules.length === 0) {
      const den = randint(2, valeurMax)
      for (let i = 0; i < this.taille ** 2; i++) {
        switch (this.type) {
          case 'entiers' :
            this.cellules.push(String(randint(1, valeurMax) ?? 2))
            break
          case 'entiers relatifs' :
            this.cellules.push(String(randint(-valeurMax, valeurMax, 0)))
            break
          case 'littéraux' :
            this.cellules.push(calculer(`${randint(1, valeurMax)}x + ${randint(1, valeurMax)}`, {}).printResult)
            break
          case 'fractions dénominateurs multiples':
            this.cellules.push(fraction(randint(1, valeurMax), den).texFraction.replace('dfrac', 'frac'))
            break
          case 'fractions positives dénominateurs premiers':
            this.cellules.push(fraction(randint(1, valeurMax), choice([2, 3, 5, 7])).texFraction.replace('dfrac', 'frac'))
            break

          case 'fractions positives' :
            this.cellules.push(fraction(randint(1, valeurMax), randint(2, valeurMax)).texFraction.replace('dfrac', 'frac'))
            break
          case 'fractions relatives' :
            this.cellules.push(fraction(randint(-valeurMax, valeurMax, 0), randint(2, valeurMax)).texFraction.replace('dfrac', 'frac'))
            break
        }
      }
    } else { // si elles sont définies, on complète éventuellement la grille aléatoirement.
      this.cellulesPreremplies = [...cellules]
      for (let i = this.cellules.length; i < this.taille ** 2; i++) {
        if (cellules[i] === '') {
          switch (this.type) {
            case 'entiers' :
              this.cellules.push(String(randint(1, valeurMax)))
              break
            case 'entiers relatifs' :
              this.cellules.push(String(randint(-valeurMax, valeurMax, 0)))
              break
            case 'littéraux' :
              this.cellules.push(calculer(`${randint(1, valeurMax)}x + ${randint(1, valeurMax)}`, {}).printResult)
              break
            case 'fractions dénominateurs multiples':{
              const cellulePrecedente = engine.parse(this.cellules[i - 1])
              if (Array.isArray(cellulePrecedente.numericValue)) {
                const [, den] = cellulePrecedente.numericValue
                this.cellules.push(fraction(randint(1, valeurMax), Number(den) ?? 1).texFraction.replace('dfrac', 'frac'))
              }
            }
              break
            case 'fractions positives dénominateurs premiers':
              this.cellules.push(fraction(randint(1, valeurMax), choice([2, 3, 5, 7])).texFraction.replace('dfrac', 'frac'))
              break
            case 'fractions positives' :
              this.cellules.push(fraction(randint(1, valeurMax), randint(2, valeurMax)).texFraction.replace('dfrac', 'frac'))
              break
            case 'fractions relatives' :
              this.cellules.push(fraction(randint(-valeurMax, valeurMax, 0), randint(2, valeurMax)).texFraction.replace('dfrac', 'frac'))
              break
          }
        }
      }
    }
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
  operate (valeurs: Array<string>) {
    let initialValue: string
    switch (this.operation) {
      case 'addition':
        initialValue = '0'
        return engine.parse(valeurs.reduce((previous, current) => `${previous}+${current}`, initialValue)).simplify().latex
      case 'multiplication':
        initialValue = '1'
        return engine.parse(valeurs.reduce((previous, current) => `(${previous})\\times (${current})`, initialValue)).simplify().latex
    }
  }

  /**
     * Retourne le tableau
     * @param {boolean} isInteractif
     * @returns {string}
     */
  representation ({ numeroExercice, question, isInteractif, classes = '' }:{numeroExercice: number, question: number, isInteractif: boolean, classes: string}) {
    const tabEnteteColonnes = [this.operation === 'addition' ? '+' : '\\times']
    for (let i = 0; i < this.taille; i++) {
      const resultat = this.resultats[i]
      tabEnteteColonnes.push(resultat)
    }
    const tabEnteteLignes: string[] = []
    for (let i = this.taille; i < 2 * this.taille; i++) {
      const resultat = this.resultats[i]
      tabEnteteLignes.push(resultat)
    }
    const tabLignes: string[] = []
    for (let i = 0; i < this.taille ** 2; i++) {
      if (this.solution) {
        const cellule = this.cellules[i]
        tabLignes.push(cellule)
      } else {
        if (this.Case == null) {
          if (this.cellulesPreremplies[i] !== '') {
            tabLignes.push(this.cellulesPreremplies[i])
          } else {
            tabLignes.push('')
          }
        } else {
          if (i === this.Case) {
            const cellule = this.cellules[i]
            tabLignes.push(cellule)
          } else {
            if (this.cellulesPreremplies[i] !== '') {
              tabLignes.push(this.cellulesPreremplies[i])
            } else {
              tabLignes.push('')
            }
          }
        }
      }
    }
    if (context.isHtml && isInteractif) {
      const tab = AddTabDbleEntryMathlive.create(numeroExercice, question, AddTabDbleEntryMathlive.convertTclToTableauMathlive(tabEnteteColonnes, tabEnteteLignes, tabLignes), classes)
      console.log(tab.output)
      return tab.output
    } else {
      return tableauColonneLigne(tabEnteteColonnes, tabEnteteLignes, tabLignes, 2, true)
    }
  }
}
