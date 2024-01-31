import loadjs from 'loadjs'
import { context } from './context.js'
import { UserFriendlyError } from './messages.js'
import {
  CLAVIER_HMS,
  raccourcisHMS
} from '../lib/interactif/claviers/clavierHms.js'
import {
  CLAVIER_LYCEE,
  raccourcisLycee
} from '../lib/interactif/claviers/lycee.js'
import {
  CLAVIER_COLLEGE,
  raccourcisCollege
} from '../lib/interactif/claviers/college.js'
import {
  CLAVIER_COLLEGE6EME,
  raccourcis6eme
} from '../lib/interactif/claviers/college6eme.js'
import {
  CLAVIER_GRECTRIGO,
  raccourcisTrigo
} from '../lib/interactif/claviers/trigo.js'
import {
  clavierUNITES,
  raccourcisUnites
} from '../lib/interactif/claviers/claviersUnites.js'
import {
  CLAVIER_ENSEMBLE,
  raccourcisEnsemble
} from '../lib/interactif/claviers/ensemble.js'
import { keyboardState } from '../components/keyboard/stores/keyboardStore'
import { get } from 'svelte/store'
/**
 * Nos applis prédéterminées avec la liste des fichiers à charger
 * @type {Object}
 */
const apps = {
  giac: '/assets/externalJs/giacsimple.js',
  mathgraph: 'https://www.mathgraph32.org/js/mtgLoad/mtgLoad.min.js',
  prism: ['/assets/externalJs/prism.js', '/assets/externalJs/prism.css'],
  scratchblocks: 'assets/externalJs/scratchblocks-v3.5-min.js',
  slick: [
    '/assets/externalJs/semantic-ui/semantic.min.css',
    '/assets/externalJs/semantic-ui/semantic.min.js',
    '/assets/externalJs/semantic-ui/components/state.min.js'
  ]
}

/**
 * Charge une appli listée dans apps (pour mutualiser l'appel de loadjs)
 * @private
 * @param {string} name
 * @return {Promise<undefined, Error>} promesse de chargement
 */
async function load (name) {
  // on est dans une fct async, si l'une de ces deux lignes plantent ça va retourner une promesse rejetée avec l'erreur
  if (!apps[name]) throw UserFriendlyError(`application ${name} inconnue`)
  // cf https://github.com/muicss/loadjs
  try {
    if (!loadjs.isDefined(name)) { await loadjs(apps[name], name, { returnPromise: true }) }
  } catch (error) {
    console.error(error)
    throw new UserFriendlyError(`Le chargement de ${name} a échoué`)
  }
  // loadjs.ready veut une callback, on emballe ça dans une promesse
  return new Promise((resolve, reject) => {
    loadjs.ready(name, {
      success: resolve,
      // si le chargement précédent a réussi on voit pas trop comment on pourrait arriver là, mais ça reste plus prudent de gérer l'erreur éventuelle
      error: () =>
        reject(new UserFriendlyError(`Le chargement de ${name} a échoué`))
    })
  })
}

/**
 * Attend que xcas soit chargé (max 60s), car giacsimple lance le chargement du wasm|js suivant les cas
 * @return {Promise<undefined,Error>} rejette en cas de timeout
 */
function waitForGiac () {
  /* global Module */
  if (typeof Module !== 'object' || typeof Module.ready !== 'boolean') {
    return Promise.reject(
      Error('Le loader giac n’a pas été correctement appelé')
    )
  }
  const timeout = 60 // en s
  const tsStart = Date.now()
  return new Promise((resolve, reject) => {
    const monInterval = setInterval(() => {
      const delay = Math.round((Date.now() - tsStart) / 1000)
      if (Module.ready === true) {
        clearInterval(monInterval)
        resolve()
      } else if (delay > timeout) {
        clearInterval(monInterval)
        reject(
          UserFriendlyError(`xcas n’est toujours pas chargé après ${delay}s`)
        )
      }
    }, 500)
  })
}

/**
 * Charge giac
 * @return {Promise} qui peut échouer…
 */
export async function loadGiac () {
  await load('giac')
  // attention, le load précédent résoud la promesse lorsque giacsimple est chargé,
  // mais lui va charger le webAssembly ou js ensuite, d'où le besoin de waitForGiac
  await waitForGiac()
}

/**
 * Charge une animation iep dans un élément
 * @param {HTMLElement} elt
 * @param {string} xml Le script xml de l'animation ou son url absolue
 * @return {Promise<iepApp>} L'appli iep
 */
export async function loadIep (elt, xml) {
  try {
    const { default: iepLoadPromise } = await import('instrumenpoche')
    const iepApp = await iepLoadPromise(elt, xml, {
      zoom: true,
      autostart: false
    })
    return iepApp
  } catch (error) {
    console.error(error)
    throw UserFriendlyError('Le chargement d’instrumenpoche a échoué')
  }
}

/**
 * Charge mathgraph dans l'élément fourni
 * @param {HTMLElement} elt
 * @param {Object} svgOptions Options du svg créé (taille et id, cf {@link https://www.mathgraph32.org/documentation/loading/global.html#mtgLoad})
 * @param {Object} mtgOptions Options pour l'appli (boutons, menus, etc., cf {@link https://www.mathgraph32.org/documentation/loading/global.html#MtgOptions}
 * @return {Promise<MtgApp>} l'appli mathgraph {@link https://www.mathgraph32.org/documentation/loading/MtgApp.html}
 */
export async function loadMG32 (elt, svgOptions, mtgOptions) {
  try {
    if (typeof window.mtgLoad !== 'function') await load('mathgraph')
    if (typeof window.mtgLoad !== 'function') { throw Error('mtgLoad n’existe pas') }
    // cf https://www.mathgraph32.org/documentation/loading/global.html#mtgLoad
    // la syntaxe qui retourne une promesse fonctionne avec un import seulement (il faudrait mettre mathgraph dans nos dépendances et l'importer)
    // avec le chargement du js via un tag script il faut fournir une callback
    return new Promise((resolve, reject) => {
      window.mtgLoad(elt, svgOptions, mtgOptions, (error, mtgApp) => {
        if (error) return reject(error)
        if (mtgApp) return resolve(mtgApp)
        reject(Error('mtgLoad ne retourne ni erreur ni application'))
      })
    })
  } catch (error) {
    console.error(error)
    throw new UserFriendlyError('Erreur de chargement de Mathgraph')
  }
}

/**
 * Charge prism
 * @return {Promise<undefined>}
 */
export function loadPrism () {
  return load('prism')
}

/**
 * Charge scratchblocks
 * @return {Promise} qui peut échouer…
 */
export function loadScratchblocks () {
  return load('scratchblocks')
}

/**
 * Charge MathLive et personnalise les réglages
 * MathLive est chargé dès qu'un tag math-field est créé
 */
export async function loadMathLive () {
  const champs = document.getElementsByTagName('math-field')
  if (champs.length > 0) {
    handleKeyboardMathalea()
    await import('mathlive')
    window.mathVirtualKeyboard.targetOrigin = '*'
    window.mathVirtualKeyboard.alphabeticLayout = 'azerty'
    for (const mf of champs) {
      let clavier = []
      let raccourcis = {}
      mf.mathVirtualKeyboardPolicy = 'manual'
      /*
      if (isInIframe && !isInCapytale) {
        mf.mathVirtualKeyboardPolicy = 'sandboxed'
      }
      */
      // Suppression du menu secondaire
      mf.menuItems = []
      mf.virtualKeyboardTargetOrigin = '*'
      // mf.addEventListener('focusout', () => window.mathVirtualKeyboard.hide())
      // Gestion des claviers personnalisés
      if (mf.classList.contains('clavierHms')) {
        clavier.push(CLAVIER_HMS)
        raccourcis = { ...raccourcisHMS, ...raccourcis }
      }
      if (mf.classList.contains('lycee')) {
        clavier.push(CLAVIER_LYCEE)
        raccourcis = { ...raccourcisLycee, ...raccourcis }
      }
      if (mf.classList.contains('college6eme')) {
        clavier.push(CLAVIER_COLLEGE6EME)
        raccourcis = { ...raccourcis6eme, ...raccourcis }
      }
      if (mf.classList.contains('grecTrigo')) {
        clavier.push(CLAVIER_GRECTRIGO)
        raccourcis = { ...raccourcisTrigo, ...raccourcis }
      }
      if (mf.classList.contains('ensemble')) {
        clavier.push(CLAVIER_ENSEMBLE)
        raccourcis = { ...raccourcisEnsemble, ...raccourcis }
      }
      if (mf.classList.contains('alphanumeric')) {
        clavier.push('alphabetic')
      }
      if (mf.classList.contains('alphanumericAvecEspace')) {
        clavier.push('alphabetic')
        mf.mathModeSpace = '\\:' // Permet d'accepter la saisie d'espaces
        mf.defaultMode = 'text' // Permet d'avoir toujours du texte (peu importe ce qui est saisi)
        // mf.smartMode = true // Permet d'avoir du texte quand il reconnait qu'il y en a : Commande dangereuse car à la fin, on obtient du mode text mélangé à du mode math
      }
      if (mf.classList.contains('clavierDeBase')) {
        clavier.push(CLAVIER_COLLEGE)
        raccourcis = { ...raccourcis }
      }

      if (mf.className.includes('nite') || mf.className.includes('nité')) {
        // Gestion du clavier Unites
        const listeParamClavier = mf.classList
        let index = 0
        while (
          !listeParamClavier[index].includes('nites') &&
          !listeParamClavier[index].includes('nités')
        ) {
          index++
        }
        // récupère tous les mots de listeParamClavier[index]
        const contenuUnites = listeParamClavier[index].match(/[a-zA-Z]+/g)
        // vire le mot 'unités'
        contenuUnites.shift()

        clavier.push(...clavierUNITES(contenuUnites))
        raccourcis = { ...raccourcisUnites, ...raccourcis }
      }
      if (clavier.length === 0) {
        //    mf.addEventListener('focusin', () => { window.mathVirtualKeyboard.layouts = 'default' }) // EE : Laisser ce commentaire pour connaitre le nom du clavier par défaut
        clavier = CLAVIER_COLLEGE
        raccourcis = { ...raccourcisCollege, ...raccourcis }
      } else if (clavier.length === 1) {
        clavier = clavier[0]
      }
      // mf.addEventListener('focusin', () => {
      //   window.mathVirtualKeyboard.layouts = clavier
      // })
      mf.inlineShortcuts = raccourcis

      let style = 'font-size: 20px;'
      if (mf.classList.contains('tableauMathlive')) continue
      if (mf.classList.contains('inline')) {
        if (mf.classList.contains('nospacebefore')) {
          style += 'margin-left:5px;'
        } else {
          style += 'margin-left: 25px;'
        }
        style +=
          ' display: inline-block; vertical-align: middle; padding-left: 5px; padding-right: 5px; border-radius: 4px; border: 1px solid rgba(0, 0, 0, .3);  '
        if (
          !mf.classList.contains('largeur01') &&
          !mf.classList.contains('largeur10') &&
          !mf.classList.contains('largeur25') &&
          !mf.classList.contains('largeur50') &&
          !mf.classList.contains('largeur75')
        ) {
          style += ' width: 25%;'
        }
      } else {
        style +=
          ' margin-top: 10px; padding: 10px; border: 1px solid rgba(0, 0, 0, .3); border-radius: 4px;'
      }
      if (mf.classList.contains('largeur10')) {
        style += ' width: 10%;'
      } else if (mf.classList.contains('largeur25')) {
        style += ' width: 25%;'
      } else if (mf.classList.contains('largeur50')) {
        style += ' width: 50%;'
      } else if (mf.classList.contains('largeur75')) {
        style += ' width: 75%;'
      }
      if (mf.classList.contains('largeur01')) {
        style += ' min-width: 80px'
      } else {
        style += ' min-width: 200px'
      }
      mf.setAttribute('style', style)
      if (mf.classList.contains('fillInTheBlanks')) {
        mf.style.border = 'none'
        mf.style.boxShadow = 'none'
        mf.style.fontSize = '1em'
        mf.classList.remove('invisible')
      }
      mf.style.fontSize = '1em'
      mf.classList.add('ml-1')
      mf.addEventListener('focus', handleFocusMathField)
      mf.addEventListener('focusout', handleFocusOutMathField)
    }
  }
  // On envoie la hauteur de l'iFrame après le chargement des champs MathLive
  if (context.vue === 'exMoodle') {
    const hauteurExercice =
      window.document.querySelector('section').scrollHeight
    window.parent.postMessage(
      {
        hauteurExercice,
        iMoodle: parseInt(
          new URLSearchParams(window.location.search).get('iMoodle')
        )
      },
      '*'
    )
    const domExerciceInteractifReady = new window.Event(
      'domExerciceInteractifReady',
      { bubbles: true }
    )
    document.dispatchEvent(domExerciceInteractifReady)
  }
}

function handleKeyboardMathalea () {
  const keyboardButtons = document.querySelectorAll('button.keyboardMathalea')
  for (const button of keyboardButtons) {
    button.addEventListener('click', handleClickOnKeyboardToggle)
    button.addEventListener('mousedown', preventDefaultAndStopPropagation)
  }
}

function preventDefaultAndStopPropagation (event) {
  event.preventDefault()
  event.stopPropagation()
}

function handleClickOnKeyboardToggle (event) {
  event.preventDefault()
  event.stopPropagation()
  const idToggle = event.currentTarget.id.replace('-button', '')
  keyboardState.update((value) => {
    if (value.idMathField === idToggle) {
      return {
        isVisible: false,
        idMathField: '',
        alphanumericLayout: value.alphanumericLayout,
        blocks: value.blocks
      }
    }
    const mf = document.querySelector('#' + idToggle)
    if (mf != null) mf.focus()
    // console.log('mf.dataset.keyboard: ' + mf.dataset.keyboard)
    return {
      isVisible: true,
      idMathField: idToggle,
      alphanumericLayout: value.alphanumericLayout,
      blocks: mf.dataset.keyboard.split(' ')
    }
  })
}

function handleFocusMathField (event) {
  const mf = event.target
  keyboardState.update((value) => {
    return {
      isVisible: value.isVisible,
      isInLine: value.isInLine,
      idMathField: event.target.id,
      alphanumericLayout: value.alphanumericLayout,
      blocks: mf.dataset.keyboard.split(' ')
    }
  })
}

function handleFocusOutMathField () {
  // Si le focus est sur un autre élément que mathfield, on cache le clavier
  // On utilise setTimeout pour être sûr que le focus soit bien sur le nouvel élément
  // car au focusout, le focus est sur body
  setTimeout(() => {
    if (document.activeElement.tagName !== 'MATH-FIELD') {
      const currentIsInLine = get(keyboardState).isInLine
      keyboardState.update(() => {
        return {
          isVisible: false,
          isInLine: currentIsInLine,
          idMathField: '',
          alphanumericLayout: '',
          blocks: ''
        }
      })
    }
  }, 0)
}
