import { getUniqueStringBasedOnTimeStamp } from '../../components/utils/time.js'
import { context } from '../../modules/context.js'
const unorderedListTypes: string[] = ['puces', 'carres', 'qcm', 'fleches']
const orderedListTypes: string[] = ['nombres', 'alpha', 'Alpha', 'roman', 'Roman']
type ListStyle = 'none'|'puces'|'carres'|'qcm'|'fleches'|'nombres'|'alpha'|'Alpha'|'roman'|'Roman'
export type DescriptionItem = {
  /**
   * Entête de la description
   */
  description: string,
  /**
   * Texte de la description
   */
  text: string
}
/**
 * Vérifier si le type d'un objet est bien `DescriptionItem`
 * (`typeof` ne fonctionnant pas pour les types maison)
 * @see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 * @param item Objet à controller
 * @returns `true` sir l'objet est de type `DescriptionItem`
 */
export function isDescriptionItem (item: DescriptionItem): item is DescriptionItem {
  return (item as DescriptionItem).description !== undefined
}
export type List<T> = {
  /**
   * Entrée de la liste ou déclaration d'une autre liste
   */
  items: (string|DescriptionItem|T)[],
  /**
   * Style pour les puces ou les numérotations. Sera ajouté à `class` et traité par `app.css`
   */
  style: ListStyle,
  /**
   * Options (optionnelles) de mise en forme pour la liste à ajouter `class`
   */
  classOptions?: string,
  /**
   * Texte (optionnel) précédent la liste
   */
  introduction?: string,
}
interface NestedList extends List<NestedList>{}

/**
 * Contruit une liste formattée suivant un style à partir d'un tableau de chaînes de caractères comme entrées.
 * @param {NestedList} list Objet décrivant la liste
 * @returns {HTMLUListElement|HTMLOListElement|string} chaîne représentant le code HTML ou LaTeX à afficher suivant la variable `context.isHtml`
 * @author sylvain
 */
export function createList (list: NestedList, shift: string = '') :HTMLUListElement|HTMLOListElement|string {
  let theList: HTMLUListElement|HTMLOListElement|string
  if (context.isHtml) {
    switch (list.style) {
      case 'none':
      case 'puces':
      case 'carres':
      case 'qcm' :
      case 'fleches' :
        theList = document.createElement('ul')
        break
      case 'nombres':
      case 'alpha':
      case 'Alpha':
      case 'roman':
      case 'Roman':
        theList = document.createElement('ol')
        break
      default:
        theList = document.createElement('ul')
        break
    }
    theList.setAttribute('class', list.style + ' ' + list.classOptions)

    for (const item of list.items) {
      const li: HTMLLIElement = document.createElement('li')
      if (typeof item === 'string') {
        li.appendChild(document.createTextNode(item))
      } else if (isDescriptionItem(item)) {
        const span = document.createElement('span')
        span.setAttribute('id', 'list-item-description-' + getUniqueStringBasedOnTimeStamp('i'))
        const description = document.createTextNode(item.description)
        const text = document.createTextNode(item.text)
        span.appendChild(description)
        li.appendChild(span)
        li.appendChild(text)
      } else {
        if (item.introduction) {
          li.appendChild(document.createTextNode(item.introduction))
        }
        li.appendChild(createList(item) as HTMLUListElement|HTMLOListElement)
      }
      theList.appendChild(li)
    }
  } else {
    theList = ''
    let label: string
    let openingTag:string
    let closingTag:string
    switch (list.style) {
      case 'none':
        label = ''
        openingTag = ''
        closingTag = ''
        break
      case 'puces':
        label = '$\\bullet$'
        break
      case 'carres':
        label = '\\tiny$\\blacksquare$'
        break
      case 'qcm':
        label = '$\\square$'
        break
      case 'fleches':
        label = '\\tiny$\\blacktriangleright$'
        break

      case 'nombres':
        label = '\\arabic*.'
        break
      case 'alpha':
        label = '\\alph*.'
        break
      case 'Alpha':
        label = '\\Alph*.'
        break
      case 'roman':
        label = '\\roman*.'
        break
      case 'Roman':
        label = '\\Roman*.'
        break
    }
    const lineStart:string = list.style === 'none' ? '' : '\t\\item '
    const lineEnd: string = list.style === 'none' ? '\\par\n' : '\n'
    const lineBreak : string = shift.length === 0 ? '\n' : ''
    if (unorderedListTypes.includes(list.style)) {
      openingTag = lineBreak + shift + '\\begin{itemize}'
      if (label.length !== 0) {
        openingTag += '[label=' + label + ']' + lineEnd
      }
      closingTag = shift + '\\end{itemize}' + lineEnd
    } else if (orderedListTypes.includes(list.style)) {
      openingTag = lineBreak + shift + '\\begin{enumerate}'
      if (label.length !== 0) {
        openingTag += '[label=' + label + ']' + lineEnd
      }
      closingTag = shift + '\\end{enumerate}' + lineEnd
    }
    theList += openingTag
    for (const item of list.items) {
      if (typeof item === 'string') {
        theList += shift + lineStart + item + lineEnd
      } else if (isDescriptionItem(item)) {
        theList += shift + '\\textbf{' + item.description + '}' + lineStart + item.text + lineEnd
      } else {
        if (item.introduction) {
          theList += shift + lineStart + item.introduction + lineEnd
          theList += createList(item, shift + '\t')
        } else {
          theList += shift + lineStart
          theList += '\n' + createList(item, shift + '\t')
        }
      }
    }
    theList += closingTag
  }
  return theList
}
