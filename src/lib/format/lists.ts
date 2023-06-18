import { context } from '../../modules/context.js'
const unorderedListTypes: string[] = ['puces', 'carres', 'qcm', 'fleches']
const orderedListTypes: string[] = ['nombres', 'alpha', 'Alpha', 'roman', 'Roman']
type ListStyle = 'none'|'puces'|'carres'|'qcm'|'fleches'|'nombres'|'alpha'|'Alpha'|'roman'|'Roman'
type List<T> = {
  /**
   * Entrée de la liste ou déclaration d'une autre liste
   */
  items: (string|T)[],
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
export function createList (list: NestedList) :HTMLUListElement|HTMLOListElement|string {
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
      if (typeof item === 'string') { li.appendChild(document.createTextNode(item)) } else {
        if (item.introduction) {
          li.appendChild(document.createTextNode(item.introduction))
        }
        li.appendChild(createList(item))
      }
      theList.appendChild(li)
    }

    // theList = theList.outerHTML
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
    if (unorderedListTypes.includes(list.style)) {
      openingTag = '\n\\begin{itemize}'
      if (label.length !== 0) {
        openingTag += '[label=' + label + ']' + lineEnd
      }
      closingTag = '\\end{itemize}' + lineEnd
    } else if (orderedListTypes.includes(list.style)) {
      openingTag = '\n\\begin{enumerate}'
      if (label.length !== 0) {
        openingTag += '[label=' + label + ']' + lineEnd
      }
      closingTag = '\\end{enumerate}' + lineEnd
    }
    theList += openingTag
    for (const item of list.items) {
      if (typeof item === 'string') { theList += lineStart + item + lineEnd } else {
        if (item.introduction) {
          theList += lineStart + item.introduction + lineEnd
          theList += createList(item)
        }
      }
    }
    theList += closingTag
  }
  return theList
}
