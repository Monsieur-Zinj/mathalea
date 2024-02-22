// import './tableauMathlive.scss'
import { notify } from '../../../bugsnag'

export interface Icell {
texte: string
latex: boolean
gras: boolean
color: string
  style?: Record<string, string>
}

export type FlecheCote = false | string
export type FlecheSens = 'bas' | 'haut'
export type Fleche = [number, number, string, number] | [number, number, string]
export type Raws = Array<Icell[]>
type ObjetParams = Record<string, string>

// Le TabPropMathlive ne gère pas les flèches... alors, je ne sais pas pourquoi j'ai mis toutes ces propriétés faculatives... Pour l'avenir ?
// Si quelqu'un sait faire, qu'il ne se gêne pas !
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
  raws: Array<Icell[]>
  headingCols: Icell[]
  headingLines: Icell[]
}

/**
 * Ajoute une cellule et ce qu'il faut dedans
 * @param {boolean} isInteractif
 * @param line
 * @param icell
 * @param indexCol
 * @param indexLine
 * @param tag
 * @param classes
 * @param NoEx
 * @param NoQ
 */
function appendCell ({ isInteractif, line, icell, indexCol, indexLine, tag, classes, NoEx, NoQ, style }: {isInteractif: boolean, line: HTMLElement, icell: Icell, indexCol:number, indexLine:number, tag:'th'|'td', classes:string, NoEx: number, NoQ: number, style: string}) {
  const cell = document.createElement(tag)
  let element: HTMLElement
  if (icell.texte === '') {
    if (isInteractif) {
      element = document.createElement('math-field')
      element.classList.add('tableauMathlive')
      for (const classe of classes.split(' ')) {
        if (classe === 'clavierDeBase') element.setAttribute('data-keyboard', 'numbersOperations')
        else if (classe === 'clavierDeBaseAvecFraction') element.setAttribute('data-keyboard', 'numbers basicOperations')
        else if (classe === 'clavierAvecVariable') element.setAttribute('data-keyboard', 'numbers basicOperations variables')
        else if (classe !== '') element.classList.add(classe)
      }
      element.id = `champTexteEx${NoEx}Q${NoQ}L${indexLine}C${indexCol}`
      element.setAttribute('virtual-keyboard-mode', 'manual')
      cell.appendChild(element)
      const spanResultat = document.createElement('span')
      spanResultat.id = `resultatCheckEx${NoEx}Q${NoQ}L${indexLine}C${indexCol}`
      cell.appendChild(spanResultat)
    } else {
      element = document.createElement('span')
      element.classList.add('tableauMathlive')
      for (const classe of classes.split(' ')) {
        if (classe !== '') element.classList.add(classe)
      }
      element.id = `cell${NoEx}Q${NoQ}L${indexLine}C${indexCol}`
      cell.appendChild(element)
    }
  } else {
    if (icell.latex) {
    // J'aimerais pouvoir utiliser mathlive mais ça semble poser des soucis, je remplace par katex...
    //  element = document.createElement('math-field')
    // element.innerHTML = `<math-field read-only style="display:inline-block" id="L${indexLine}C${i + 1}">${icell.texte}</math-field>`
      element = document.createElement('span')
      cell.appendChild(element)
      element.outerHTML = `<span id="spanEx${NoEx}Q${NoQ}L${indexLine}C${indexCol}">$${icell.texte}$</span>`
    } else {
      element = document.createElement('span')
      cell.appendChild(element)
      element.outerHTML = `<span id="spanEx${NoEx}Q${NoQ}L${indexLine}C${indexCol}">${icell.texte}</span>`
    }
  }
  if (style != null) {
    cell.style.backgroundColor = style
  }
  line.appendChild(cell)
}

/**
 * @param {HTMLTableRowElement} line L'élément HTML <tr> qui reçoit les cellules
 * @param {Icell[]} content la liste des cellules au format Icell
 * @param {number} index le numéro de la ligne pour fabriquer l'identifiant de cellule
 * @param {'td'|'th'} tag le tag (td pour des cellules à l'intérieur th pour des cellules d'entête)
 * @param {string} classes une liste de className dans un string séparés par des espaces
 */
const fillLine = function ({ isInteractif, line, content, index, tag, classes, NoEx, NoQ, style }:{isInteractif: boolean, line: HTMLElement, content: Icell[], index: number, tag: 'td'|'th', classes: string, NoEx: number, NoQ: number, style: ObjetParams}): void {
  for (let i = 0; i < content.length; i++) {
    appendCell({ isInteractif, line, icell: content[i], indexCol: i, indexLine: index, tag, classes, NoEx, NoQ, style: style[`L${index}C${i}`] })
  }
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
  isInteractif: boolean

  private constructor (numeroExercice: number, question: number, tableau: Itableau, classes: string, isInteractif: boolean) {
    this.nbColonnes = tableau.nbColonnes ?? 1
    this.flecheHaut = tableau.flecheHaut ?? []
    this.flecheBas = tableau.flecheBas ?? []
    this.flecheDroite = tableau.flecheDroite ?? false
    this.flecheDroiteSens = tableau.flecheDroiteSens ?? 'bas'
    this.flecheGauche = tableau.flecheGauche ?? false
    this.flecheGaucheSens = tableau.flecheGaucheSens ?? 'haut'
    this.numeroExercice = numeroExercice ?? 0
    this.numeroQuestion = question
    this.id = `tabMLEx${this.numeroExercice}Q${this.numeroQuestion}`
    this.classes = classes
    this.isInteractif = isInteractif
  }

  static create (numeroExercice: number, question: number, tableau: Itableau, classes: string, isInteractif: boolean, style: ObjetParams) {
    if (!Array.isArray(tableau.ligne1) || !Array.isArray(tableau.ligne1)) {
      notify('ajouteTableauMathlive : vérifiez vos paramètres !', { ligne1: tableau.ligne1, ligne2: tableau.ligne2, nbColonnes: tableau.nbColonnes })
    }
    if (style == null) style = {}
    // ça, c'est pour ne pas modifier les lignes du tableau passé en argument
    const NoEx = numeroExercice ?? 0
    const NoQ = question
    const ligne1 = [...tableau.ligne1]
    const ligne2 = [...tableau.ligne2]
    const tableauMathlive: AddTabPropMathlive = new AddTabPropMathlive(numeroExercice, question, tableau, classes, isInteractif)
    const table = document.createElement('table')
    table.className = 'tableauMathlive'
    table.id = `tabMathliveEx${NoEx}Q${question}`
    const firstLine = document.createElement('tr')
    const entete1 = ligne1.shift()
    if (entete1) appendCell({ isInteractif, line: firstLine, icell: entete1, indexCol: 0, indexLine: 0, tag: 'th', classes, NoEx, NoQ, style: style[`L${0}C${0}`] })
    for (let i = 0; i < ligne1.length; i++) {
      appendCell({ isInteractif, line: firstLine, icell: ligne1[i], indexCol: i + 1, indexLine: 0, tag: 'td', classes, NoEx, NoQ, style: style[`L${0}C${i + 1}`] })
    }
    table.appendChild(firstLine)
    // tableau de proportionnalité conforme à ceux définis dans src/lib/2d/tableau.js
    const secondLine = document.createElement('tr')
    const entete2 = ligne2.shift()
    if (entete2) appendCell({ isInteractif, line: secondLine, icell: entete2, indexCol: 0, indexLine: 1, tag: 'th', classes, NoEx, NoQ, style: style[`L${1}C${0}`] })
    for (let i = 0; i < ligne2.length; i++) {
      appendCell({ isInteractif, line: secondLine, icell: ligne2[i], indexCol: i + 1, indexLine: 1, tag: 'td', classes, NoEx, NoQ, style: style[`L${1}C${i + 1}`] })
    }
    table.appendChild(secondLine)
    const spanCheckOuterHTML = `<span id="resultatCheckEx${numeroExercice}Q${question}"></span>`
    // pour l'instant je retourne l'objet complet avec le HTML de la table dans sa propriété output,
    // mais il sera peut-être possible de ne retourner que le HTML comme pour ajouteChampTexteMathlive...
    tableauMathlive.output = table.outerHTML + spanCheckOuterHTML
    return tableauMathlive
  }

  /**
   * Les listes de tableauColonneLigne sont des listes de strings.
   * Celles des tableaux Mathlive, doivent être des Icell[] (interface exportée par ce fichier).
   * Cette fonction prends les différentes listes de tableauColonneLigne en argument et retourne un tableau pour AddTabDblEntry
   * @param tabEntetesColonnes
   * @param tabEntetesLignes
   * @param tabLignes
   */
  static convertTableauToTableauMathlive (lgn1: string[], lgn2: string[], gras: boolean = false, color: string = 'black'): Itableau {
    const nbColonnes = Math.max(lgn1.length, lgn2.length)
    const ligne1: Icell[] = []
    const ligne2: Icell[] = []
    for (const str of lgn1) {
      ligne1.push({ texte: str, latex: true, gras, color })
    }
    for (const str of lgn2) {
      ligne2.push({ texte: str, latex: true, gras, color })
    }
    return { ligne1, ligne2, nbColonnes }
  }
}

export class AddTabDbleEntryMathlive {
  id!: string // ce sera nécessaire pour retrouver le tableau s'il y en a plusieurs dans la page.
  numeroExercice: number
  numeroQuestion: number
  output!: string
  raws!: Raws
  headingCols: Icell[]
  headingLines: Icell[]
  classes: string
  isInteractif: boolean
  private constructor (numeroExercice: number, question: number, tableau: ItabDbleEntry, classes: string, isInteractif: boolean) {
    if (numeroExercice == null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.notify('AddTabDbleEntryMathlive a besoin absolument d\'un numero d\'exercice')
    }
    this.headingCols = tableau.headingCols
    this.headingLines = tableau.headingLines
    this.numeroExercice = numeroExercice ?? 0
    this.numeroQuestion = question
    this.id = `tabMLEx${this.numeroExercice}Q${this.numeroQuestion}`
    this.raws = tableau.raws
    this.classes = classes
    this.isInteractif = isInteractif
  }

  static create (numeroExercice: number, question: number, tableau: ItabDbleEntry, classes: string, isInteractif: boolean, style: ObjetParams) {
    // tableau doit contenir headingCols et headingLines, qui peuvent être vides, mais doivent être fournis.
    if (!Array.isArray(tableau.headingCols) || !Array.isArray(tableau.headingLines)) {
      notify('ajouteTableauMathlive : vérifiez vos paramètres !', { headingCols: tableau.headingCols, headingLines: tableau.headingLines })
    }
    if (style == null) style = {}
    const tableauMathlive: AddTabDbleEntryMathlive = new AddTabDbleEntryMathlive(numeroExercice, question, tableau, classes, isInteractif)
    const table = document.createElement('table')
    const NoEx = numeroExercice ?? 0
    const NoQ = question
    table.className = 'tableauMathlive'
    table.id = `tabMathliveEx${numeroExercice}Q${question}`
    const firstLine = document.createElement('tr')
    table.appendChild(firstLine)
    if (tableau.headingCols != null) {
      fillLine({ isInteractif, line: firstLine, content: tableau.headingCols, index: 0, tag: 'th', classes, NoEx, NoQ, style })
    }
    // lignes suivantes
    for (let j = 0; j < tableau.raws.length; j++) {
      const newLine = document.createElement('tr')
      table.appendChild(newLine)
      if (tableau.headingLines != null) {
        appendCell({ isInteractif, line: newLine, icell: tableau.headingLines[j], indexCol: 0, indexLine: tableau.headingCols != null ? 1 + j : j, tag: 'th', classes, NoEx, NoQ, style: style[`L${tableau.headingCols != null ? 1 + j : j}C${0}`] })
        /*
        const head = document.createElement('th')
        head.textContent = `$${tableau.headingLines[j]}$`
        newLine.appendChild(head)
        */
      }
      const raw = tableau.raws[j]
      if (Array.isArray(raw) && raw.length > 0) {
        for (let i = 0; i < raw.length; i++) {
          appendCell({ isInteractif, line: newLine, icell: raw[i], indexCol: tableau.headingLines != null ? i + 1 : i, indexLine: tableau.headingCols != null ? 1 + j : j, tag: 'td', classes, NoEx, NoQ, style: style[`L${tableau.headingCols != null ? 1 + j : j}C${tableau.headingLines != null ? i + 1 : i}`] })
        }
      }
    }
    const spanCheckOuterHTML = `<span id="feedbackEx${numeroExercice}Q${question}"></span>`
    // pour l'instant je retourne l'objet complet avec le HTML de la table dans sa propriété output,
    // mais il sera peut-être possible de ne retourner que le HTML comme pour ajouteChampTexteMathlive...
    tableauMathlive.output = table.outerHTML + spanCheckOuterHTML
    return tableauMathlive
  }

  /**
   * Les listes de tableauColonneLigne sont des listes de strings.
   * Celles des tableaux Mathlive, doivent être des Icell[] (interface exportée par ce fichier).
   * Cette fonction prends les différentes listes de tableauColonneLigne en argument et retourne un tableau pour AddTabDblEntry
   * @param tabEntetesColonnes
   * @param tabEntetesLignes
   * @param tabLignes
   */
  static convertTclToTableauMathlive (tabEntetesColonnes: string[], tabEntetesLignes: string[], tabLignes: string[], gras: boolean = true, color: string = 'black') {
    const headingCols: Icell[] = []
    for (const str of tabEntetesColonnes) {
      headingCols.push({ texte: str, latex: true, gras, color })
    }
    const headingLines: Icell[] = []
    for (const str of tabEntetesLignes) {
      headingLines.push({ texte: str, latex: true, gras, color })
    }
    const raws: Array<Icell[]> = []
    const haveHeadC = headingCols.length > 0
    const haveHeadL = headingLines.length > 0
    if (!haveHeadL || !haveHeadC) throw Error('Un tableau à double entrée doit avoir des entête de colonne et des entête de ligne')
    // on boucle sur les lignes mais il peut ne pas y avoir de headingLines ! On doit alors diviser le nombre de cellules par le nombre de colonnes à remplir.
    const nbCols = haveHeadL ? headingCols.length - 1 : headingCols.length
    const nbLines = headingLines.length
    for (let i = 0; i < nbLines; i++) {
      const raw: Icell[] = []
      for (let j = 0; j < nbCols; j++) {
        raw.push({ texte: tabLignes[i * nbCols + j], latex: true, gras, color })
      }
      raws.push(raw)
    }
    return { headingLines, headingCols, raws }
  }
}
