import { context } from '../../modules/context.js'
import { sp } from '../outils/outilString.js'

export function ajouteChampTexteMathLive (exercice, i, style = '', {
  texteApres = '',
  texte = '',
  tailleExtensible = false
} = {}) {
  if (context.isHtml && exercice.interactif) {
    if (style === '') {
      return `<label>${texte}</label><math-field virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? '<span>' + texteApres + '</span>' : ''}<span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    } else if (tailleExtensible) {
      return `<label>${sp()}${texte}${sp()}</label><table style="text-align:center;font-size: small;font-family:Arial,Times,serif;display:inline;height:1px;"><tr><td style="position: relative; top: 27px; left: 0px;padding:0px 0px 5px;margin:0px"><math-field virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? '<span>' + texteApres + '</span>' : ''} </td></tr></table><span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    } else return `<label>${texte}</label><math-field virtual-keyboard-mode=manual class="${style}" id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? '<span>' + texteApres + '</span>' : ''} <span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
  } else {
    return ''
  }
}

/** Crée une fraction avec 1 ou 2 champs de réponse et autant de feedbacks.
 * Si seul le numérateur ou le dénominateur sont utilisés pour la fraction, l'autre est précisé.
 * numerateur = false signifie qu'il y a un champ de saisie pour le numérateur.
 * denominateur = 100 signifie que le dénominateur est déjà renseigné à 100.
 * Dans ce cas, on utilise le format Interactif correspondant : 'Num' ou 'Den'
 * Si les deux champs sont à saisir, on utilise deux réponses de formatInteractif 'calcul'.
 */
export function ajouteChampFractionMathLive (exercice, i, numerateur = false, denominateur = 100, style = '', {
  texte = '',
  texteApres = ''
} = {}) {
  let code = ''
  if (context.isHtml && exercice.interactif) {
    code += `<label>${texte}</label>
             <table style="border-collapse:collapse;text-align:center;font-size: small;font-family:Arial,Times,serif;display:inline;"><tr>
             <td style="${!numerateur ? style : ''} ;padding:0px 0px 5px;margin:0px;border-bottom:1px solid #000;">`
    if (!numerateur) {
      code += `<math-field virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>
              </td><td><span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
      i++
    } else {
      code += `${numerateur} `
    }
    code += `</td></tr><tr>
             <td width=50px style="padding:0px;margin:0px;">`
    if (!denominateur) {
      code += `<math-field virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>
              </td><td><span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    } else {
      code += `${denominateur}`
    }
    code += `</td></tr></table> ${texteApres ? '<span>' + texteApres + '</span>' : ''}`
    return code
  } else {
    return ''
  }
}
