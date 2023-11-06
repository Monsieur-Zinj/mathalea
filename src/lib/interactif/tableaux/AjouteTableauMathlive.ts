import { notify } from '../../../main'
import './tableauMathlive.scss'
import type Exercice from '../../../exercices/ExerciceTs'

export interface Icell {
texte: string
latex: boolean
gras: boolean
color: string
}

export type FlecheCote = false | string
export type FlecheSens = 'bas' | 'haut'
export type Fleche = [number, number, string, number] | [number, number, string]
export type Raws = Array<string[]>

export interface Itableau {
nbColonnes: number
ligne1: Icell[]
ligne2: Icell[]
flecheHaut?: Fleche[] // [[1, 2, '\\times 6,4', 3], [2, 3, '\\div 6']]
flecheBas?: Fleche[]
flecheDroite?: FlecheCote // à remplacer par un string
flecheDroiteSens?: FlecheSens
flecheGauche?: FlecheCote
flecheGaucheSens?: FlecheSens
}

export interface ItabDbleEntry {
  raws: Array<string[]>
  headingCols: string[]
  headingLines: string[]
}

export class AddTabPropMathlive {
  id!: string // ce sera nécessaire pour retrouver le tableau s'il y en a plusieurs dans la page.
  numeroExercice: number
  numeroQuestion: number
  output!: string
  nbColonnes: number
  ligne1!: Icell[]
  ligne2!: Icell[]
  flecheHaut: Fleche[] // [[1, 2, '\\times 6,4', 3], [2, 3, '\\div 6']]
  flecheBas: Fleche[]
  flecheDroite: FlecheCote // à remplacer par un string
  flecheDroiteSens: FlecheSens
  flecheGauche: FlecheCote
  flecheGaucheSens: FlecheSens
  classes?: string

  private constructor (exercice: Exercice, question: number, tableau: Itableau, classes: string) {
    this.nbColonnes = tableau.nbColonnes ?? 1
    this.flecheHaut = tableau.flecheHaut ?? []
    this.flecheBas = tableau.flecheBas ?? []
    this.flecheDroite = tableau.flecheDroite ?? false
    this.flecheDroiteSens = tableau.flecheDroiteSens ?? 'bas'
    this.flecheGauche = tableau.flecheGauche ?? false
    this.flecheGaucheSens = tableau.flecheGaucheSens ?? 'haut'
    this.numeroExercice = exercice.numeroExercice ?? 0
    this.numeroQuestion = question
    this.id = `tabMLEx${this.numeroExercice}Q${this.numeroQuestion}`
    this.classes = classes
  }

  static create (exercice: Exercice, question: number, tableau: Itableau, classes: string) {
    /**
     * @param {HTMLTableRowElement} line L'élément HTML <tr> qui reçoit les cellules
     * @param {Icell[]} content la liste des cellules au format Icell
     * @param {number} index le numéro de la ligne pour fabriquer l'identifiant de cellule
     * @param {string} classes une liste de className dans un string séparés par des espaces
     */
    const fillLine = function (line: HTMLElement, content: Icell[], index: number, classes: string): void {
      for (let i = 0; i < content.length; i++) {
        const cell = document.createElement('td')
        let element: HTMLElement
        const param = content[i]
        if (param.texte === '') {
          element = document.createElement('math-field')
          cell.appendChild(element)
          const classString = `"tableauMathlive ${classes}"`
          element.outerHTML = `<math-field id="L${index}C${i + 1}" class=${classString} virtual-keyboard-mode=manual></math-field>`
          const divDuSmiley = document.createElement('div')
          divDuSmiley.id = `divDuSmileyL${index}C${i + 1}`
          cell.appendChild(divDuSmiley)
        } else {
          if (param.latex) {
            // J'aimerais pouvoir utiliser mathlive mais ça semble poser des soucis, je remplace par katex...
            //  element = document.createElement('math-field')
            // element.innerHTML = `<math-field read-only style="display:inline-block" id="L${index}C${i + 1}">${param.texte}</math-field>`
            element = document.createElement('span')
            cell.appendChild(element)
            element.outerHTML = `<span id="L${index}C${i + 1}">$${param.texte}$</span>`
          } else {
            element = document.createElement('span')
            cell.appendChild(element)
            element.outerHTML = `<span id="L${index}C${i + 1}">${param.texte}</span>`
          }
        }

        line.appendChild(cell)
      }
    }

    if (!Array.isArray(tableau.ligne1) || !Array.isArray(tableau.ligne1)) {
      notify('ajouteTableauMathlive : vérifiez vos paramètres !', { ligne1: tableau.ligne1, ligne2: tableau.ligne2, nbColonnes: tableau.nbColonnes })
    }
    const tableauMathlive: AddTabPropMathlive = new AddTabPropMathlive(exercice, question, tableau, classes)
    const table = document.createElement('table')
    table.className = 'tableauMathlive'
    table.id = `tabMathliveEx${exercice.numeroExercice}Q${question}`
    const firstLine = document.createElement('tr')
    fillLine(firstLine, tableau.ligne1, 1, classes)
    table.appendChild(firstLine)
    // tableau de proportionnalité conforme à ceux définis dans src/lib/2d/tableau.js
    const secondLine = document.createElement('tr')
    fillLine(secondLine, tableau.ligne2, 2, classes)
    table.appendChild(secondLine)
    // pour l'instant je retourne l'objet complet avec le HTML de la table dans sa propriété output,
    // mais il sera peut-être possible de ne retourner que le HTML comme pour ajouteChampTexteMathlive...
    tableauMathlive.output = table.outerHTML
    return tableauMathlive
  }
}

export class AddTabDbleEntryMathlive {
  id!: string // ce sera nécessaire pour retrouver le tableau s'il y en a plusieurs dans la page.
  numeroExercice: number
  numeroQuestion: number
  output!: string
  raws!: Raws
  headingCols: string[]
  headingLines: string[]
  private constructor (exercice: Exercice, question: number, tableau: ItabDbleEntry) {
    this.headingCols = tableau.headingCols
    this.headingLines = tableau.headingLines
    this.numeroExercice = exercice.numeroExercice ?? 0
    this.numeroQuestion = question
    this.id = `tabMLEx${this.numeroExercice}Q${this.numeroQuestion}`
    this.raws = tableau.raws
  }

  static create (exercice: Exercice, question: number, tableau: ItabDbleEntry) {
    // tableau doit contenir headingCols et headingLines, qui peuvent être vides, mais doivent être fournis.
    if (!Array.isArray(tableau.headingCols) || !Array.isArray(tableau.headingLines)) {
      notify('ajouteTableauMathlive : vérifiez vos paramètres !', { headingCols: tableau.headingCols, headingLines: tableau.headingLines })
    }
    const tableauMathlive: AddTabDbleEntryMathlive = new AddTabDbleEntryMathlive(exercice, question, tableau)
    const table = document.createElement('table')
    const firstLine = document.createElement('tr')
    table.appendChild(firstLine)
    if (tableau.headingCols != null) {
      for (let i = 0; i < tableau.headingCols.length; i++) {
        const head = document.createElement('th')
        head.textContent = tableau.headingCols[i]
        firstLine.appendChild(head)
      }
    }
    // lignes suivantes
    for (let j = 0; j < tableau.raws.length; j++) {
      const newLine = document.createElement('tr')
      table.appendChild(newLine)
      if (tableau.headingLines != null) {
        const head = document.createElement('th')
        head.textContent = tableau.headingLines[j]
        newLine.appendChild(head)
      }
      const raw = tableau.raws[j]
      if (Array.isArray(raw) && raw.length > 0) {
        for (let i = 0; i < raw.length; i++) {
          const cell: HTMLTableCellElement = document.createElement('td')
          cell.textContent = raw[i]
          cell.id = `L${tableau.headingCols != null ? 2 + j : 1 + j}C${tableau.headingLines != null ? 2 + i : 1 + i}`
          newLine.appendChild(cell)
        }
      }
    }
    // pour l'instant je retourne l'objet complet avec le HTML de la table dans sa propriété output,
    // mais il sera peut-être possible de ne retourner que le HTML comme pour ajouteChampTexteMathlive...
    tableauMathlive.output = table.outerHTML
    return tableauMathlive
  }

  static convertTclToTableauMathlive (tabEntetesColonnes: string[], tabEntetesLignes: string[], tabLignes: string[]) {
    const headingCols = tabEntetesColonnes
    const headingLines = tabEntetesLignes
    const raws: Array<string[]> = []
    for (let i = 0; i < headingLines.length; i++) {
      const raw: string[] = []
      for (let j = 0; j < headingCols.length; j++) {
        raw.push(tabLignes[i * headingCols.length + j])
      }
      raws.push(raw)
    }
    return { headingLines, headingCols, raws }
  }
}
