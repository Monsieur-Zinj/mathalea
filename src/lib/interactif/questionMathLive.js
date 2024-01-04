import { context } from '../../modules/context.js'
import { sp } from '../outils/outilString.js'

export function ajouteChampTexteMathLive (exercice, i, style = '', {
  texteApres = '',
  texteAvant = '',
  tailleExtensible = false
} = {}) {
  const buttonKeyboard = `<button class="keyboardMathalea" id="champTexteEx${exercice.numeroExercice}Q${i}-button">⌨️</button>`
  if (context.isHtml && exercice.interactif) {
    if (style === 'none') return ''
    if (style === '') {
      return `<label>${texteAvant}</label><math-field virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}" data-keyboard="${exercice.keyboard.join(' ')}"></math-field>${texteApres ? '<span>' + texteApres + '</span>' : ''}<span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>${buttonKeyboard}`
    } else if (tailleExtensible) {
      return `<label>${sp()}${texteAvant}${sp()}</label><table style="text-align:center;font-size: small;font-family:Arial,Times,serif;display:inline;height:1px;"><tr><td style="position: relative; top: 27px; left: 0px;padding:0px 0px 5px;margin:0px"><math-field virtual-keyboard-mode=manual id="champTexteEx${exercice.numeroExercice}Q${i}" data-keyboard="${exercice.keyboard.join(' ')}"></math-field>${texteApres ? '<span>' + texteApres + '</span>' : ''} </td></tr></table><span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>${buttonKeyboard}`
    } else return `<label>${texteAvant}</label><math-field virtual-keyboard-mode=manual class="${style}" id="champTexteEx${exercice.numeroExercice}Q${i}" data-keyboard="${exercice.keyboard.join(' ')}"></math-field>${texteApres ? '<span>' + texteApres + '</span>' : ''} <span id="resultatCheckEx${exercice.numeroExercice}Q${i}"></span>${buttonKeyboard}`
  } else {
    return ''
  }
}

export function remplisLesBlancs (exercice, question, content, classes, blanc = '\\ldots') {
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
  if (exercice.interactif) {
    let classe = ''
    if (classes) {
      classe = ['fillInTheBlanks', ...classes.split(' ')].join(' ')
    } else {
      classe = 'fillInTheBlanks'
    }
    return `<math-field readonly style="font-size:2em" class="${classe}" id="champTexteEx${exercice.numeroExercice}Q${question}">${mfeValue}</math-field><span id="resultatCheckEx${exercice.numeroExercice}Q${question}"></span><div id="feedbackEx${exercice.numeroExercice}Q${question}"></div>`
  } else {
    return `$${mfeValue}$`
  }
}
