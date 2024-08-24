import { context } from '../../modules/context.js'
import { modalImage, modalTexteLong } from '../outils/modales.js'

export function katexPopupTest (texte, titrePopup, textePopup) {
  let contenu = ''
  if (context.isHtml) {
    contenu = '<div class="ui right label katexPopup">' + texte + '</div>'
    contenu += '<div class="ui special popup" >'
    if (titrePopup !== '') {
      contenu += '<div class="header">' + titrePopup + '</div>'
    }
    contenu += '<div>' + textePopup + '</div>'
    contenu += '</div>'
    return contenu
  } else {
    return `\\textbf{${texte}} \\footnote{\\textbf{${titrePopup}} ${textePopup}}`
  }
}

/**
 * Crée un popup html avec une icône info ou un bouton modal suivant le type donné :0=Latex inline compatible, 1=bouton modal texte long, 2=bouton modal image.
 * ATTENTION la variable texte doit exactement correspondre au nom de l'image sans l'extension  et etre au format png
 * @param {number} numero
 * @param {number} type
 * @param {string} titrePopup = Le titre du texte dévoilé par le bouton
 * @param {string} texte = Ce qu'il y a sur le bouton qui doit exactement etre le nom de l'image sans l'extension
 * @param {string} textePopup = Le texte dévoilé par le bouton ou l'url de l'image.
 * @author Jean-claude Lhote & Rémi Angot & Sebastien Lozano
 **/

export function katexPopup2 (numero, type, texte, titrePopup, textePopup) {
  // ToDo : gérer les popup avec la version 3
  // Pour l'instant, ils sont supprimés
  switch (type) {
    case 0:
      return katexPopupTest(texte, titrePopup, textePopup)
    case 1:
      if (context.isHtml) {
        return modalTexteLong(numero, `${titrePopup}`, `${textePopup}`, `${texte}`, 'info circle')
      } else {
        return `\\textbf{${texte}} \\footnote{\\textbf{${titrePopup}} ${textePopup}}`
      }
    case 2:
      if (context.isHtml) {
        return modalImage(numero, textePopup, `${titrePopup}`, `${texte}`)
      } else {
        return `\\href{https://coopmaths.fr/images/${texte}.png}{\\textcolor{blue}{\\underline{${texte}}} } \\footnote{\\textbf{${texte}} ${textePopup}}`
      }
  }
}

/**
 * Renvoie un encart sur fond d'alert semantic ui en HTML ou dans un cadre bclogo en LaTeX avec le texte
 * @param {string} texte
 * @param {string} couleur
 * @param {string} titre
 * @author Sébastien Lozano
 */
export function warnMessage (texte, couleur, titre) {
  const timeStamp = Date.now()
  if (typeof (titre) === 'undefined') {
    titre = ''
  }
  if (context.isHtml) {
    return `
      <div id="warnMessage-${timeStamp}">
        <div id="title-warnMessage-${timeStamp}">
        ${titre}
        </div>
        ${texte}
      </div>
      `
  } else {
    // return texCadreParOrange(texte);
    return `
    \\begin{bclogo}[couleurBarre=` + couleur + ',couleurBord=' + couleur + ',epBord=2,couleur=gray!10,logo=\\bclampe,arrondi=0.1]{\\bf ' + titre + `}
      ` + texte + `
    \\end{bclogo}
    `
  }
}

/**
 * @returns un encart sur fond d'alert semantic ui en HTML ou dans un cadre bclogo en LaTeX avec le texte + icone info
 * @param {object}
 * @author Sébastien Lozano
 */

export function infoMessage ({ titre, texte, couleur }) {
  // ;
  const timeStamp = Date.now()
  if (context.isHtml) {
    return `
      <div id="infoMessage-${timeStamp}">
        <div id="title-infoMessage-${timeStamp}">
        ${titre}
        </div>
        ${texte}
      </div>
      `
  } else {
    return `
    \\begin{bclogo}[couleurBarre=` + couleur + ',couleurBord=' + couleur + ',epBord=2,couleur=gray!10,logo=\\bcinfo,arrondi=0.1]{\\bf ' + titre + `}
      ` + texte + `
    \\end{bclogo}
    `
  }
}

/**
 * @returns un encart sur fond d'alert semantic ui en HTML ou dans un cadre bclogo en LaTeX avec le texte + icone lampe
 * @param {object}
 * @author Sébastien Lozano
 */

export function lampeMessage ({ titre, texte, couleur }) {
  const timeStamp = Date.now()
  if (context.isHtml) {
    return `
      <div id="lampeMessage-${timeStamp}">
        <div id="title-lampeMessage-${timeStamp}">
        ${titre}
        </div>
        ${texte}
      </div>
      `
  } else if (context.isAmc) {
    return `
    {\\bf ${titre}} : ${texte}
    `
  } else {
    return `
    \\begin{bclogo}[couleurBarre=` + couleur + ',couleurBord=' + couleur + ',epBord=2,couleur=gray!10,logo=\\bclampe,arrondi=0.1]{\\bf ' + titre + `}
      ` + texte + `
    \\end{bclogo}
    `
  }
}
