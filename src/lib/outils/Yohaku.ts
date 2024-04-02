import { randint } from '../../modules/outils'
import { fraction } from '../../modules/fractions'
import { choice } from './arrayOutils'
import { context } from '../../modules/context'
import { AddTabDbleEntryMathlive } from '../interactif/tableaux/AjouteTableauMathlive'
import { tableauColonneLigne } from '../2d/tableau'
import { ComputeEngine } from '@cortex-js/compute-engine'
import { reduireAxPlusB } from './ecritures'
import { KeyboardType } from '../interactif/claviers/keyboard'
import FractionEtendue from '../../modules/FractionEtendue'

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
  cellulesEE: FractionEtendue[]
  sommesCellules: FractionEtendue[]
  cellulesPreremplies: string[]
  resultats:string[]
  operation:'addition'|'multiplication'
  solution: boolean
  clavier: KeyboardType
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
    this.cellulesEE = []
    this.sommesCellules = []
    this.clavier = KeyboardType.clavierDeBase
    if (this.cellules.length === 0) {
      const den = randint(2, valeurMax)
      for (let i = 0; i < this.taille ** 2; i++) {
        switch (this.type) {
          case 'entiers' :
            this.cellules.push(String(randint(1, valeurMax) ?? 2))
            this.clavier = KeyboardType.clavierDeBase
            break
          case 'entiers relatifs' :
            this.cellules.push(String(randint(-valeurMax, valeurMax, 0)))
            this.clavier = KeyboardType.clavierDeBase
            break
          case 'littéraux' :
            this.cellules.push(reduireAxPlusB(randint(1, valeurMax), randint(1, valeurMax), 'x'))
            this.clavier = KeyboardType.clavierDeBaseAvecVariable
            break
          case 'fractions dénominateurs multiples': { // EE : Modif pour 4C21-2 afin que les sommes des lignes ne soient pas identiques aux sommes des colonnes
            let testFraction = new FractionEtendue(randint(1, valeurMax), den)
            let sommeFractions:FractionEtendue
            if (i + 1 >= this.taille) {
              if ((i + 1) % this.taille === 1) {
                sommeFractions = new FractionEtendue(0, 1)
                for (let ee = 0; ee < this.taille; ee++) {
                  sommeFractions = sommeFractions.sommeFraction(this.cellulesEE[ee + this.taille * Math.floor(ee / this.taille)])
                }
                this.sommesCellules.push(sommeFractions)
              }
              if (i >= this.taille * (this.taille - 1)) {
                let fractionsEgales :boolean
                do {
                  fractionsEgales = false
                  testFraction = new FractionEtendue(randint(1, valeurMax), den)
                  sommeFractions = new FractionEtendue(0, 1)
                  for (let ee = 0; ee < this.taille - 1; ee++) {
                    sommeFractions = sommeFractions.sommeFraction(this.cellulesEE[i % this.taille + this.taille * ee])
                  }
                  sommeFractions = sommeFractions.sommeFraction(testFraction)
                  for (let ee = 0; ee < this.sommesCellules.length; ee++) {
                    fractionsEgales = fractionsEgales || this.sommesCellules[ee].isEqual(sommeFractions)
                  }
                } while (fractionsEgales)
                this.sommesCellules.push(sommeFractions)
              }
            }
            this.cellulesEE.push(testFraction)
            this.cellules.push(testFraction.texFSD.replace('dfrac', 'frac'))
            this.clavier = KeyboardType.clavierDeBaseAvecFraction
            break
          }
          case 'fractions positives dénominateurs premiers':
            this.cellules.push(fraction(randint(1, valeurMax), Number(choice([2, 3, 5, 7]))).texFraction.replace('dfrac', 'frac'))
            this.clavier = KeyboardType.clavierDeBaseAvecFraction
            break

          case 'fractions positives' :
            this.cellules.push(fraction(randint(1, valeurMax), randint(2, valeurMax)).texFraction.replace('dfrac', 'frac'))
            this.clavier = KeyboardType.clavierDeBaseAvecFraction
            break
          case 'fractions relatives' :
            this.cellules.push(fraction(randint(-valeurMax, valeurMax, 0), randint(2, valeurMax)).texFraction.replace('dfrac', 'frac'))
            this.clavier = KeyboardType.clavierDeBaseAvecFraction
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
              this.clavier = KeyboardType.clavierDeBase
              break
            case 'entiers relatifs' :
              this.cellules.push(String(randint(-valeurMax, valeurMax, 0)))
              this.clavier = KeyboardType.clavierDeBase
              break
            case 'littéraux' :
              this.cellules.push(reduireAxPlusB(randint(1, valeurMax), randint(1, valeurMax), 'x'))
              this.clavier = KeyboardType.clavierDeBaseAvecVariable
              break
            case 'fractions dénominateurs multiples':{
              const cellulePrecedente = engine.parse(this.cellules[i - 1])
              if (Array.isArray(cellulePrecedente.numericValue)) {
                const [, den] = cellulePrecedente.numericValue
                this.cellules.push(fraction(randint(1, valeurMax), Number(den) ?? 1).texFraction.replace('dfrac', 'frac'))
              }
              this.clavier = KeyboardType.clavierDeBaseAvecFraction
            }
              break
            case 'fractions positives dénominateurs premiers':
              this.cellules.push(new FractionEtendue(randint(1, valeurMax), Number(choice([2, 3, 5, 7]))).texFraction.replace('dfrac', 'frac'))
              this.clavier = KeyboardType.clavierDeBaseAvecFraction
              break
            case 'fractions positives' :
              this.cellules.push(fraction(randint(1, valeurMax), randint(2, valeurMax)).texFraction.replace('dfrac', 'frac'))
              this.clavier = KeyboardType.clavierDeBaseAvecFraction
              break
            case 'fractions relatives' :
              this.cellules.push(fraction(randint(-valeurMax, valeurMax, 0), randint(2, valeurMax)).texFraction.replace('dfrac', 'frac'))
              this.clavier = KeyboardType.clavierDeBaseAvecFraction
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
    const couleur = context.isHtml ? '' : '\\cellcolor{lightgray}'
    for (let i = 0; i < this.taille; i++) {
      tabEnteteColonnes.push(`\\text{Colonne ${i + 1}}`)
    }
    tabEnteteColonnes.push(`\\text{${this.operation === 'addition' ? 'Sommes' : 'Produits'}}`)
    const laCase = this.Case == null ? null : (this.Case % this.taille) + (Math.floor(this.Case / this.taille) * (this.taille + 1))

    const tabEnteteLignes: string[] = []
    for (let i = 0; i < this.taille; i++) {
      tabEnteteLignes.push(`\\text{Ligne ${i + 1}}`)
    }
    tabEnteteLignes.push(`\\text{${this.operation === 'addition' ? 'Sommes' : 'Produits'}}`)

    const tabLignes: string[] = []
    let j = 0
    let k = 0
    for (let i = 0; i < (this.taille + 1) ** 2; i++) {
      if (this.solution) {
        if (i % (this.taille + 1) < this.taille) {
          if (i < (this.taille + 1) * (this.taille)) {
            const cellule = this.cellules[k]
            tabLignes.push(cellule)
            k++
          } else {
            if (j < this.taille * 2) {
              tabLignes.push(`${couleur}${this.resultats[(j + this.taille) % (this.taille * 2)]}`)
              j++
            }
          }
        } else {
          if (j < this.taille * 2) {
            tabLignes.push(`${couleur}${this.resultats[(j + this.taille) % (this.taille * 2)]}`)
            j++
          }
        }
      } else {
        if (this.Case == null) {
          if (this.cellulesPreremplies[k] != null) {
            if (i % (this.taille + 1) < this.taille) {
              if (i < (this.taille + 1) * (this.taille)) {
                tabLignes.push(this.cellulesPreremplies[k])
                k++
              } else {
                if (j < this.taille * 2) {
                  tabLignes.push(`${couleur}${this.resultats[(j + this.taille) % (this.taille * 2)]}`)
                  j++
                }
              }
            } else {
              if (j < this.taille * 2) {
                tabLignes.push(`${couleur}${this.resultats[(j + this.taille) % (this.taille * 2)]}`)
                j++
              }
            }
          } else {
            if (i % (this.taille + 1) < this.taille) {
              if (i < (this.taille + 1) * (this.taille)) {
                tabLignes.push('')
              } else {
                if (j < this.taille * 2) {
                  tabLignes.push(`${couleur}${this.resultats[(j + this.taille) % (this.taille * 2)]}`)
                  j++
                }
              }
            } else {
              if (j < this.taille * 2) {
                tabLignes.push(`${couleur}${this.resultats[(j + this.taille) % (this.taille * 2)]}`)
                j++
              }
            }
          }
        } else {
          if (i % (this.taille + 1) < this.taille) {
            if (i === laCase) {
              const cellule = this.cellules[k]
              k++
              tabLignes.push(cellule)
            } else {
              if (i < (this.taille + 1) * (this.taille)) {
                if (this.cellulesPreremplies[k] != null) {
                  tabLignes.push(this.cellulesPreremplies[k])
                  k++
                } else {
                  tabLignes.push('')
                }
              } else {
                if (j < this.taille * 2) {
                  tabLignes.push(`${couleur}${this.resultats[(j + this.taille) % (this.taille * 2)]}`)
                  j++
                }
              }
            }
          } else {
            if (j < this.taille * 2) {
              tabLignes.push(`${couleur}${this.resultats[(j + this.taille) % (this.taille * 2)]}`)
              j++
            }
          }
        }
      }
    }
    tabLignes.push(`${context.isHtml ? '' : couleur}///////`)
    if (context.isHtml && isInteractif) {
      const tab = AddTabDbleEntryMathlive.create(numeroExercice, question, AddTabDbleEntryMathlive.convertTclToTableauMathlive(tabEnteteColonnes, tabEnteteLignes, tabLignes), classes + ' ' + this.clavier, isInteractif, {})
      return tab.output
    } else {
      return tableauColonneLigne(tabEnteteColonnes, tabEnteteLignes, tabLignes, 2, true, numeroExercice, question)
    }
  }
}
