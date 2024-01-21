import { context } from '../../modules/context.js'
import { sp } from '../outils/outilString.js'

const buildDataKeyboardString = (style) => {
  // traductions des types de claviers en successions de blocs
  const translate = {
    clavierHms: ['numbers', 'hms'],
    lycee: ['numbers', 'fullOperations', 'variables', 'advanced'],
    grecTrigo: ['numbers', 'fullOperations', 'greek', 'trigo'],
    college6eme: ['numbersOperations'],
    clavierDeBase: ['numbersOperations'],
    alphanumericAvecEspace: ['alphanumeric'],
    alphanumeric: ['alphanumeric'],
    longueur: ['numbers', 'lengths'],
    aire: ['numbers', 'areas'],
    volume: ['numbers', 'volumes', 'capacities'],
    masse: ['numbers', 'masses']
  }
  // traitement
  if (style === '') {
    // clavier basique
    return ['numbers', 'basicOperations', 'variables'].join(' ')
  } else {
    const blocks = []
    const styleValues = style.split(' ')
    for (const value of styleValues) {
      if (Object.keys(translate).includes(value)) {
        blocks.push(translate[value])
      } else if (value.startsWith('unit') || value.startsWith('Unit')) {
        // extraire les informations entre les [...] pour avoir les unités
        const unitValuesMatches = value.match(/(?<=\[)[^\][]*(?=])/g)
        const unitValues = unitValuesMatches
          .join(',')
          .split(',')
          .map((s) => s.toLowerCase().replace(/[s]$/, '')) // tout en minuscule et virer les 's' à la fin
        for (const v of unitValues) {
          // si on peut traduire les valeurs, on les inclut dans la liste
          if (Object.keys(translate).includes(v)) {
            blocks.push(translate[v])
          }
        }
      }
    }
    if (blocks.length !== 0) {
      return blocks
        .reduce((prev, current) => [...prev, ...current], []) // on fusionne éventuels
        .reduce((prev, current) => { // éliminer les doublons
          if (prev.indexOf(current) < 0) {
            prev.push(current)
          }
          return prev
        }, [])
        .join(' ')
    } else {
      return ['numbers', 'basicOperations', 'variables'].join(' ')
    }
  }
}

export function ajouteChampTexteMathLive (
  exercice,
  i,
  style = '',
  { texteApres = '', texteAvant = '', tailleExtensible = false } = {}
) {
  const dataKeyboard = buildDataKeyboardString(style)
  // console.log(dataKeyboard)
  const buttonKeyboard = `<button class="keyboardMathalea" id="champTexteEx${exercice.numeroExercice}Q${i}-button">⌨️</button>`
  if (context.isHtml && exercice.interactif) {
    if (style === 'none') return ''
    if (style === '') {
      return `<label>${texteAvant}</label><math-field virtual-keyboard-mode=manual id="champTexteEx${
        exercice.numeroExercice
      }Q${i}" data-keyboard="${dataKeyboard}"></math-field>${
        texteApres ? '<span>' + texteApres + '</span>' : ''
      }<span id="resultatCheckEx${
        exercice.numeroExercice
      }Q${i}"></span>${buttonKeyboard}`
    } else if (tailleExtensible) {
      return `<label>${sp()}${texteAvant}${sp()}</label><table style="text-align:center;font-size: small;font-family:Arial,Times,serif;display:inline;height:1px;"><tr><td style="position: relative; top: 27px; left: 0px;padding:0px 0px 5px;margin:0px"><math-field virtual-keyboard-mode=manual id="champTexteEx${
        exercice.numeroExercice
      }Q${i}" data-keyboard="${dataKeyboard}"></math-field>${
        texteApres ? '<span>' + texteApres + '</span>' : ''
      } </td></tr></table><span id="resultatCheckEx${
        exercice.numeroExercice
      }Q${i}"></span>${buttonKeyboard}`
    } else {
      return `<label>${texteAvant}</label><math-field virtual-keyboard-mode=manual class="${style}" id="champTexteEx${
        exercice.numeroExercice
      }Q${i}" data-keyboard="${dataKeyboard}"></math-field>${
        texteApres ? '<span>' + texteApres + '</span>' : ''
      } <span id="resultatCheckEx${
        exercice.numeroExercice
      }Q${i}"></span>${buttonKeyboard}`
    }
  } else {
    return ''
  }
}

export function remplisLesBlancs (
  exercice,
  question,
  content,
  classes,
  blanc = '\\ldots'
) {
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
