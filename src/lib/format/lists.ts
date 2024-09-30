import { getUniqueStringBasedOnTimeStamp } from '../components/time.js'
import { context } from '../../modules/context.js'

// const unorderedListTypes: string[] = ['puces', 'carres', 'qcm', 'fleches']
const orderedListTypes: string[] = [
  'nombres',
  'alpha',
  'Alpha',
  'roman',
  'Roman'
]

const labelsByStyle = new Map([
  ['puces', '$\\bullet$'],
  ['carres', '\\tiny$\\blacksquare$'],
  ['qcm', '$\\square$'],
  ['fleches', '\\tiny$\\blacktriangleright$'],
  ['nombres', '\\arabic*.'],
  ['alpha', '\\alph*.'],
  ['Alpha', '\\Alph*.'],
  ['roman', '\\roman*.'],
  ['Roman', '\\Roman*.']
])

type ListStyle =
  | 'none'
  | 'puces'
  | 'carres'
  | 'qcm'
  | 'fleches'
  | 'nombres'
  | 'alpha'
  | 'Alpha'
  | 'roman'
  | 'Roman'
export type DescriptionItem = {
  /**
   * Entête de la description
   */
  description: string
  /**
   * Texte de la description
   */
  text: string
}

export type List<T> = {
  /**
   * Entrée de la liste ou déclaration d'une autre liste
   */
  items: (string | DescriptionItem | T)[]
  /**
   * Style pour les puces ou les numérotations. Sera ajouté à `class` et traité par `app.css`
   */
  style: ListStyle
  /**
   * Options (optionnelles) de mise en forme pour la liste à ajouter `class`
   */
  classOptions?: string
  /**
   * Texte (optionnel) précédent la liste
   */
  introduction?: string
}

interface NestedList extends List<NestedList> { }

/**
 * Vérifier si le type d'un objet est bien `DescriptionItem`
 * (`typeof` ne fonctionnant pas pour les types maison)
 * @see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 * @param item Objet à controller
 * @returns `true` si l'objet est de type `DescriptionItem`
 */
export function isDescriptionItem (
  item: DescriptionItem | NestedList
): item is DescriptionItem {
  return (item as DescriptionItem).description !== undefined
}

/**
 * Contruit une liste formattée suivant un style à partir d'un tableau de chaînes de caractères comme entrées.
 * @param {NestedList} list Objet décrivant la liste
 * @returns {string} chaîne représentant le code HTML ou LaTeX à afficher suivant la variable `context.isHtml`
 * @author sylvain, Jean-Léon Henry
 */
export function createList (
  list: NestedList,
  shift: string = ''
): string {
  const isOrdered: boolean = orderedListTypes.includes(list.style)
  let lineStart = list.style === 'none' ? '' : '\t\\item '
  let lineEnd = list.style === 'none' ? '\\par' : ''
  const lineBreak: string = '\n'
  const label: string = labelsByStyle.get(list.style) ?? '' // only used in latex output
  let openingTagOrdered = '\\begin{enumerate}'
  let openingTagUnordered = '\\begin{itemize}'
  let closingTagOrdered = '\\end{enumerate}'
  let closingTagUnordered = '\\end{itemize}'
  let openingTagLine: string
  let output = ''

  if (context.isHtml) {
    lineStart = list.style === 'none' ? '<li>' : '\t<li>'
    lineEnd = '</li>'

    let classOptionsFormatted = list.classOptions ?? ''
    if (classOptionsFormatted !== '') {
      classOptionsFormatted = ' ' + classOptionsFormatted
    }
    openingTagOrdered = `<ol class='${list.style}${classOptionsFormatted}'>`
    openingTagUnordered = `<ul class='${list.style}${classOptionsFormatted}'>`
    closingTagOrdered = '</ol>'
    closingTagUnordered = '</ul>'
  }

  const openingTag = isOrdered ? openingTagOrdered : openingTagUnordered
  const closingTag = isOrdered ? closingTagOrdered : closingTagUnordered
  openingTagLine = lineBreak + shift + openingTag
  const closingTagLine = shift + closingTag + lineBreak

  if (!context.isHtml && label.length !== 0) {
    openingTagLine += `[label=${label}]`
  }

  openingTagLine += lineBreak
  output += openingTagLine

  function lineFactory (
    inside: string,
    before: string = shift + lineStart,
    after: string = lineEnd + lineBreak) {
    return before + inside + after
  }

  for (const item of list.items) {
    let liContent = ''
    if (typeof item === 'string') {
      liContent = item
    } else if (isDescriptionItem(item)) {
      if (!context.isHtml) {
        output += lineFactory(item.text, shift + `\t\\item[\\textbf{${item.description}}] `)
        continue
      }
      const span = `<span id="list-item-description-${getUniqueStringBasedOnTimeStamp('i')}">${item.description} </span>`
      liContent = span + item.text
    } else {
      // item is neither a string or a DescriptionItem, it's probably a sublist
      liContent = (item.introduction ?? '') + createList(item, shift + '\t')
    }
    output += lineFactory(liContent)
  }

  output += closingTagLine
  return output
}
