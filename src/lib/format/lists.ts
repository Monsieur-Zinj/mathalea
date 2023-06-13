import { context } from '../../modules/context.js'
const unorderedListTypes: string = ['puces', 'carres', 'qcm', 'fleches']
const orderedListTypes: string = ['nombres', 'alpha', 'Alpha', 'roman', 'Roman']
/**
 * Contruit une liste formattée suivant un style à partir d'un tableau de chaînes de caractères comme entrées.
 * @param {string[]} items taleau des entrées de la liste
 * @param {string} style type de liste (au choix entre `none`, `puces`, `carres`, `qcm`, `fleches`, `nombres`, `alpha`, `Alpha`, `roman`, `Roman`)
 * @param {string} classOptions addenda à la définition de la classe
 * @returns {string} chaîne représentant le code HTML ou LaTeX à afficher suivant la variable `context.isHtml`
 * @author sylvain
 */
export function createList (items: string[], style: 'none'|'puces'|'carres'|'qcm'|'fleches'|'nombres'|'alpha'|'Alpha'|'roman'|'Roman', classOptions:string = '') :string {
  let theList: HTMLUListElement|HTMLOListElement|string
  if (context.isHtml) {
    switch (style) {
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
    theList.setAttribute('class', style + ' ' + classOptions)
    let li: HTMLLIElement
    for (const item of items) {
      li = document.createElement('li')
      li.appendChild(document.createTextNode(item))
      theList.appendChild(li)
    }
    theList = theList.outerHTML
  } else {
    theList = ''
    let label: string
    let openingTag:string
    let closingTag:string
    switch (style) {
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
    const lineStart:string = style === 'none' ? '' : '\t\\item '
    const lineEnd: string = style === 'none' ? '\\par\n' : '\n'
    if (unorderedListTypes.includes(style)) {
      openingTag = '\n\\begin{itemize}'
      if (label.length !== 0) {
        openingTag += '[label=' + label + ']' + lineEnd
      }
      closingTag = '\\end{itemize}' + lineEnd
    } else if (orderedListTypes.includes(style)) {
      openingTag = '\n\\begin{enumerate}'
      if (label.length !== 0) {
        openingTag += '[label=' + label + ']' + lineEnd
      }
      closingTag = '\\end{enumerate}' + lineEnd
    }
    theList += openingTag
    for (const item of items) {
      theList += lineStart + item + lineEnd
    }
    theList += closingTag
  }
  return theList
}
