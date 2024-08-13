import { context } from '../../modules/context.js'
import { sp } from '../outils/outilString.js'
import { buildDataKeyboardFromStyle } from './claviers/keyboard'

const buildDataKeyboardString = (style = '') => {
  const blocks = buildDataKeyboardFromStyle(style)
  return blocks.join(' ')
}

/**
 * Retourne le code html d'un div prévu pour le feedback toute forme d'interactivité.
 * @param {Exercice} exercice
 * @param {number} question
 * @param {string} style
 */
export function ajouteFeedback (exercice, question, style = 'style="display: block"') {
  if (!context.isHtml) return ''
  const exo = exercice.numeroExercice
  if (exercice == null || typeof exo !== 'number' || typeof question !== 'number') return ''
  return `<div class ="ml-2 py-2 italic text-coopmaths-warn-darkest dark:text-coopmathsdark-warn-darkest" id="feedbackEx${exo}Q${question}" ${style !== '' ? style : ''}></div>`
}

export function ajouteChampTexteMathLive (exercice, i, style = '', {
  texteApres = '',
  texteAvant = '',
  blocCenter = false,
  tailleExtensible = false,
  espace = false
} = {}) {
  if (texteApres !== '') texteApres = sp() + texteApres
  if (context.isHtml && exercice.interactif) {
    if (typeof style !== 'string') {
      window.notify(`style doit être une chaîne de caractères. Exercice ${exercice.id} ${exercice.uuid}`)
      style = ''
    }
    if (style.includes('blocCenter')) blocCenter = true
    const dataKeyboard = buildDataKeyboardString(style)
    let html = ''
    if (style === 'none') return ''
    if (style === '') {
      html = `<label>${texteAvant}</label><math-field data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''} virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? '<span>' + texteApres + '</span>' : ''}<span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    } else if (tailleExtensible) {
      html = `<label>${sp()}${texteAvant}${sp()}</label><table style="text-align:center;font-family:Arial,Times,serif;display:inline;height:1px;"><tr><td style="position: relative; display: inline;padding:0 0;margin:0"><math-field data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''}  class="${style}" virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? '<span>' + texteApres + '</span>' : ''} </td></tr></table><span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    } else if (blocCenter) {
      html = `<div style='display: flex;justify-content: center; margin:5px;'><label>${texteAvant}</label><math-field data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''} virtual-keyboard-mode=manual class="${style}" id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? '<span>' + texteApres + '</span>' : ''} <span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span><div>`
    } else html = `<label>${texteAvant}</label><math-field data-keyboard="${dataKeyboard}" ${espace ? 'data-space="true"' : ''} virtual-keyboard-mode=manual class="${style}" id="champTexteEx${exercice.numeroExercice}Q${i}"></math-field>${texteApres ? '<span>' + texteApres + '</span>' : ''} <span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>`
    // html += `<div id="feedbackEx${exercice.numeroExercice}Q${i}"></div>`
    return html
  } else {
    return ''
  }
}

export function remplisLesBlancs (exercice, question, content, classes = '', blanc = '\\ldots') {
  let mfeValue = ''
  while (content) {
    const chunks = /^(.*?)%\{([^}]+)}(.*?)$/.exec(content)
    if (chunks) {
      const [, start, n, end] = chunks
      const name = n
      if (name == null) throw Error(`Définition de ${name} manquante`)
      mfeValue += start
      if (exercice.interactif) {
        mfeValue += `\\placeholder[${name}]{}`
      } else {
        mfeValue += blanc
      }
      content = end ?? ''
    } else {
      mfeValue += content
      content = ''
    }
  }
  if (exercice.interactif && context.isHtml) {
    const dataKeyboard = buildDataKeyboardString(classes)
    let classe = ''
    if (classes !== '') {
      if (classes === 'fillInTheBlank' || classes === 'fillInTheBlanks') classe = 'fillInTheBlanks'
      else classe = ['fillInTheBlanks', ...classes.split(' ').filter(el => el !== 'fillInTheBlank' && el !== 'fillInTheBlanks')].join(' ')
    } else {
      classe = 'fillInTheBlanks'
    }
    return `<math-field data-keyboard="${dataKeyboard}" virtual-keyboard-mode=manual readonly class="${classe}" id="champTexteEx${exercice.numeroExercice}Q${question}">${mfeValue}</math-field><span id="resultatCheckEx${exercice.numeroExercice}Q${question}"></span>`
    // on enlève ce divFeedback automatique, c'est l'exercice qui doit l'ajouter.
    // <div id="feedbackEx${exercice.numeroExercice}Q${question}"></div>`
  } else {
    return `$${mfeValue}$`
  }
}
