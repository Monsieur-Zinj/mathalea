import { isArray, isInteger } from 'mathjs'
import { context } from '../../modules/context.js'
import { choice } from './arrayOutils'
import FractionEtendue from '../../modules/FractionEtendue'

/**
 * Met en couleur et en gras
 *
 * Met en couleur et gras un texte. JCL dit : "S'utilise entre $ car utilise des commandes qui fonctionnent en math inline"
 * @param {string|number} texte à mettre en couleur
 * @param {string} couleur en anglais ou code couleur hexadécimal par défaut c'est le orange de CoopMaths
 * @author Rémi Angot
 */
export function miseEnEvidence (texte: string | FractionEtendue, couleur: string = '#f15929') {
  if (texte instanceof FractionEtendue) texte = texte.texFraction
  if (isArray(couleur)) couleur = couleur[0]
  if (context.isHtml) {
    return `{\\color{${couleur}}\\boldsymbol{${texte}}}`
  } else {
    if (couleur[0] === '#') {
      return `{\\color[HTML]{${couleur.replace('#', '')}}\\boldsymbol{${texte}}}`
    } else if (couleur === 'green') {
      return `{\\color[HTML]{008002}\\boldsymbol{${texte}}}`
    } else {
      return `{\\color{${couleur.replace('#', '')}}\\boldsymbol{${texte}}}`
    }
  }
}

/**
 * Met en couleur
 * Met en couleur un texte. JCL dit : "S'utilise entre $ car utilise des commandes qui fonctionnent en math inline"
 * @param {string} texte à mettre en couleur
 * @param {string} couleur en anglais ou code couleur hexadécimal par défaut c'est le orange de CoopMaths
 * @author Guillaume Valmont d'après MiseEnEvidence() de Rémi Angot
 */
export function miseEnCouleur (texte: string, couleur: string = '#f15929') {
  if (isArray(couleur)) couleur = couleur[0]
  if (context.isHtml) {
    return `{\\color{${couleur}} ${texte}}`
  } else {
    if (couleur[0] === '#') {
      return `{\\color[HTML]{${couleur.replace('#', '')}} ${texte}}`
    } else if (couleur === 'green') {
      return `{\\color[HTML]{008002} ${texte}}`
    } else {
      return `{\\color{${couleur}} ${texte}}`
    }
  }
}

/**
 * Met en couleur un texte
 * @param {string} texte à mettre en couleur
 * @param {string} couleur en anglais ou code couleur hexadécimal par défaut c'est le orange de CoopMaths
 * @author Rémi Angot
 */
export function texteEnCouleur (texte: string, couleur = '#f15929') {
  if (isArray(couleur)) couleur = couleur[0]
  if (context.isHtml) {
    return `<span style="color:${couleur};">${texte}</span>`
  } else {
    if (couleur[0] === '#') {
      return `{\\color[HTML]{${couleur.replace('#', '')}}${texte}}`
    } else if (couleur === 'green') {
      return `{\\color[HTML]{008002} ${texte}}`
    } else {
      return `{\\color{${couleur.replace('#', '')}}${texte}}`
    }
  }
}

/**
 * Met en couleur et gras un texte. JCL dit : "Ne fonctionne qu'en dehors de $....$". Utiliser miseEnEvidence si $....$.
 * @param {string} texte à mettre en couleur
 * @param {string} couleur en anglais ou code couleur hexadécimal par défaut c'est le orange de CoopMaths
 * @author Rémi Angot
 */
export function texteEnCouleurEtGras (texte: string, couleur = '#f15929') {
  if (isArray(couleur)) couleur = couleur[0]
  if (context.isHtml) {
    return `<span style="color:${couleur};font-weight: bold;">${texte}</span>`
  } else {
    if (couleur[0] === '#') {
      return `{\\bfseries \\color[HTML]{${couleur.replace('#', '')}}${texte}}`
    } else if (couleur === 'green') {
      return `{\\bfseries \\color[HTML]{008002} ${texte}}`
    } else {
      return `{\\bfseries \\color{${couleur.replace('#', '')}}${texte}}`
    }
  }
}

/**
 * couleurAleatoire() renvoie le code d'une couleur au hasard
 *
 * @author Rémi Angot
 */
export function couleurAleatoire () {
  return choice(['white', 'black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow'])
}

/**
 * couleurTab() renvoie :
 * soit le code d'une couleur au hasard, ainsi que sa traduction française au masculin et au féminin,
 * soit le code d'une couleur imposée, ainsi que sa traduction française au masculin et au féminin.
 * @example couleurTab() peut renvoyer ['black','noir','noire'].
 * @example couleurTab(0) renverra de façon certaine ['black','noir','noire'].
 * @author Eric Elter
 */
export function couleurTab (choixCouleur = 999) {
  const panelCouleurs = [
    ['black', 'noir', 'noire'],
    ['red', 'rouge', 'rouge'],
    ['green', 'vert', 'verte'],
    ['blue', 'bleu', 'bleue'],
    ['HotPink', 'rose', 'rose'],
    ['Sienna', 'marron', 'marron'],
    ['darkgray', 'gris', 'grise'],
    ['DarkOrange', 'orange', 'orange']
  ]
  return (choixCouleur === 999 || choixCouleur >= panelCouleurs.length || !isInteger(choixCouleur)) ? choice(panelCouleurs) : panelCouleurs[choixCouleur]
}

export function arcenciel (i: number, fondblanc = true) {
  let couleurs
  if (fondblanc) couleurs = ['violet', 'purple', 'blue', 'green', 'lime', '#f15929', 'red']
  else couleurs = ['violet', 'indigo', 'blue', 'green', 'yellow', '#f15929', 'red']
  return couleurs[i % 7]
}

export function texcolors (i: number, fondblanc = true) {
  const couleurs = ['black', 'blue', 'brown', 'green', 'cyan', 'darkgray', 'pink', 'orange', 'red', 'magenta', 'purple', 'violet', 'white', 'yellow']
  if (fondblanc && (i % couleurs.length) >= (couleurs.length - 2)) i += 2
  return couleurs[i % couleurs.length]
}

/**
 * Met gras un texte
 * @param {string} texte à mettre en gras
 * @author Rémi Angot
 */
export function texteGras (texte: string) {
  if (context.isHtml) {
    return `<b>${texte}</b>`
  } else {
    return `\\textbf{${texte}}`
  }
}

export function blocCode (texte: string) {
  if (context.isHtml) {
    return `<pre style="background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; padding: 10px; font-family: Courier New, monospace; white-space: pre-wrap;">
    ${texte}</pre>`
  }
  return `\\fbox{
    \\parbox{0.5\\linewidth}{
    \\setlength{\\parskip}{.5cm}
    \\texttt{${texte}
    }
    }\\newline`
}

export function texteCode (texte: string) {
  if (context.isHtml) {
    return `<span style="background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; font-family: Courier New, monospace; white-space: pre-wrap;">${texte}</span>`
  }
  return `\\colorbox{lightgray}{\\texttt{${texte}}}`
}
