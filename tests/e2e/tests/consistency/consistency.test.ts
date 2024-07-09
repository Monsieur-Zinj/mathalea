import { runTest } from '../../helpers/run'
import type { BrowserContext, Locator, Page } from 'playwright'
import { clean } from '../../helpers/text'
import prefs from '../../helpers/prefs'

type ExerciseType = 'classique' | 'simple'
type LatexModel = 'Coopmaths' | 'Classique' | 'ProfMaquette' | 'ProfMaquetteQrcode' | 'Can'
type AMCModel = 'AMCcodeGrid'

type State = {
  url: string
  view: string
  numbers: string[]
  exerciseType: ExerciseType
}
const states: State[] = []

async function test (page: Page) {
  const browser = prefs.browserInstance
  if (browser === null) throw Error('can\'t test a null browser')
  const [context] = browser.contexts()
  const questionsNb = 20
  const hostname = local ? `http://localhost:${process.env.CI ? '80' : '5173'}/alea/` : 'https://coopmaths.fr/alea/'
  const classicExerciseUrl = hostname + '?uuid=0e6bd&id=6C10-1&n=10&d=10&s=2-3-4-5-6-7-8-9-10&s2=1&s3=true&uuid=0e6bd&id=6C10-1&n=10&d=10&s=2-3-4-5-6-7-8-9-10&s2=1&s3=true'
  await testUrl(classicExerciseUrl, page, context, questionsNb, 'classique')
  const simpleExerciseUrl = hostname + '?uuid=4ba86&id=canc3C04&n=10&d=10&cd=1&uuid=4ba86&id=canc3C04&n=10&d=10&cd=1'
  await testUrl(simpleExerciseUrl, page, context, questionsNb, 'simple')
  checkConsistency()
  return true
}

async function testUrl (url: string, page: Page, context: BrowserContext, questionsNb: number, exerciseType: ExerciseType) {
  await page.goto(url)
  await page.waitForLoadState('networkidle')
  await pushState(page, 'start', exerciseType)
  await checkSlideshow(page, questionsNb, exerciseType)
  await pushState(page, 'start', exerciseType)
  await checkStudent(page, context, exerciseType)
  await pushState(page, 'start', exerciseType)
  await checkLatex(page, 'LaTeX', 'Coopmaths', exerciseType, questionsNb)
  await checkLatex(page, 'LaTeX', 'Classique', exerciseType, questionsNb)
  await checkLatex(page, 'LaTeX', 'ProfMaquette', exerciseType, questionsNb)
  await checkLatex(page, 'LaTeX', 'ProfMaquetteQrcode', exerciseType, questionsNb)
  await checkLatex(page, 'LaTeX', 'Can', exerciseType, questionsNb)
  await pushState(page, 'start', exerciseType)
  await checkLatex(page, 'AMC', 'AMCcodeGrid', exerciseType, questionsNb)
  await pushState(page, 'start', exerciseType)
}

async function pushState (page: Page, view: string, exerciseType: ExerciseType) {
  const url = page.url()
  await page.waitForSelector('.katex')
  const locators = await page.locator('.katex').all()
  const numbers = await getNumbers(locators)
  if (view === 'eleve:Une page par exercice' || view === 'eleve:Course aux nombres' || view === 'eleve:Une page par question') {
    // Bizarrement, les nombres se répètent 3 fois à partir du deuxième exercice dans ces vues au lieu de 2 partout ailleurs
    // À modifier lorsque ce problème de duplication sera réglé
    const duplicationBeginningIndex = view === 'eleve:Une page par exercice' ? numbers.length / 2 : 1
    for (let i = 0; i < numbers.length; i++) {
      if (i >= duplicationBeginningIndex) {
        numbers[i] = numbers[i].slice(0, Math.round(numbers[i].length * 2 / 3))
      }
    }
  }
  if (view === 'eleve:Course aux nombres') {
    numbers.pop()
  }
  states.push({
    url,
    view,
    numbers,
    exerciseType
  })
}

async function getNumbers (locators: Locator[]) {
  const numbers: string[] = []
  for (const locator of locators) {
    const innerText = await locator.innerText()
    const number = clean(innerText, ['cr']).replace(/\D/g, '')
    numbers.push(number)
  }
  return numbers
}

async function checkSlideshow (page: Page, questionsNb: number, exerciseType: ExerciseType) {
  await page.locator('div[data-tip="Diaporama"]').click()
  await checkSlideshowPlay(page, questionsNb, exerciseType)
  await checkSlideshowPreview(page, exerciseType)
  await page.locator('.bx-x').first().click()
}

async function checkSlideshowPlay (page: Page, questionsNb: number, exerciseType: ExerciseType) {
  await page.locator('#diaporama-play-button').click()
  const numbers: string[] = []
  for (let i = 0; i < questionsNb; i++) {
    numbers.push(await getSlideshowNumbers(page))
    await page.locator('.bx-skip-next').click()
  }
  states.push({
    url: page.url(),
    view: 'diaporama',
    numbers,
    exerciseType
  })
}

async function getSlideshowNumbers (page: Page) {
  await page.waitForSelector('#question0')
  const locator = page.locator('#question0')
  const innerText = await locator.innerText()
  const number = clean(innerText, ['cr']).replace(/\D/g, '')
  return number
}

async function checkSlideshowPreview (page: Page, exerciseType: ExerciseType) {
  await page.locator('.bx-detail').click()
  await pushState(page, 'apercu', exerciseType)
  await page.locator('.bx-arrow-back').click()
}

async function checkStudent (page: Page, context: BrowserContext, exerciseType: ExerciseType) {
  await page.locator('.bx-link').click()
  await checkStudentVariation('Tous les exercices sur une page', page, context, exerciseType)
  await checkStudentVariation('Une page par exercice', page, context, exerciseType)
  await checkStudentVariation('Toutes les questions sur une page', page, context, exerciseType)
  await checkStudentVariation('Une page par question', page, context, exerciseType)
  await checkStudentVariation('Course aux nombres', page, context, exerciseType)
  await page.locator('.bx-x').first().click()
}

async function checkStudentVariation (variation: string, page: Page, context: BrowserContext, exerciseType: ExerciseType) {
  await page.click(`text=${variation}`)
  page.click('text=Visualiser') // Si on await ici, on risque de manquer le context.waitForEvent('page') qui suit
  const newPage = await context.waitForEvent('page')
  await newPage.waitForLoadState('networkidle')

  if (variation === 'Course aux nombres') {
    await newPage.click('text=Démarrer')
    await newPage.waitForTimeout(6000)
  }
  await pushState(newPage, `eleve:${variation}`, exerciseType)
  await newPage.close()
}

async function checkLatex (page: Page, view: 'LaTeX' | 'AMC', model: LatexModel | AMCModel, exerciseType: ExerciseType, questionsNb: number) {
  const url = page.url()
  await page.locator(`button[data-tip="${view}"]`).click()
  await page.click(`input[type="radio"][value="${model}"]`)
  await waitForLatex(page, model)
  const latex = await getLatex(page)
  const numbers = getLatexNumbers(latex, view, model, questionsNb)
  states.push({
    url,
    view: view + ':' + model,
    numbers,
    exerciseType
  })
  await page.locator('.bx-x').first().click()
}

async function waitForLatex (page: Page, model: LatexModel | AMCModel) {
  switch (model) {
    case 'Coopmaths':
      await page.waitForFunction(() => {
        const preElement = document.querySelector('pre')
        if (preElement && preElement.textContent) {
          return preElement.textContent.includes('\\begin{EXO}{')
        }
        return false
      })
      break
    case 'Classique':
      await page.waitForFunction(() => {
        const preElement = document.querySelector('pre')
        if (preElement && preElement.textContent) {
          return preElement.textContent.includes('\\begin{EXO}{')
        }
        return false
      })
      break
    case 'ProfMaquette':
      await page.waitForFunction(() => {
        const preElement = document.querySelector('pre')
        if (preElement && preElement.textContent) {
          return preElement.textContent.includes('\\begin{Maquette}[Fiche]{Niveau= ,Classe= ,Date=   ,Theme=Exercices}')
        }
        return false
      })
      break

    default:
      break
  }
}

async function getLatex (page: Page) {
  const questionSelector = 'pre.w-full'
  const locator = page.locator(questionSelector)
  return await locator.innerText()
}

function getLatexNumbers (latex: string, view: 'LaTeX' | 'AMC', model: LatexModel | AMCModel, questionsNb: number) {
  const lineRegex: RegExp = view === 'LaTeX' ? model === 'Can' ? /\\thenbEx[^\r\n]*/g : /\\item[^\r\n]*/g : /\$ [^\r\n]*/g
  const rawLines: string[] = latex.match(lineRegex) || []
  if (model === 'Can') {
    const rawNumbers = rawLines.map(line => line.replace(/\D/g, ''))
    const cleanNumbers = rawNumbers.map(number => number.slice(1))
    return cleanNumbers.map(number => number + number)
  } else {
    const numbersQuestionsAnswers = rawLines.map(line => line.replace(/\D/g, '') + line.replace(/\D/g, ''))
    return removeAnswers(numbersQuestionsAnswers, view, model, rawLines.length, questionsNb)
  }
}

function removeAnswers (calculationsQuestionsAnswers: string[], view: 'LaTeX' | 'AMC', model: LatexModel | AMCModel, linesNumber: number, questionsNb: number) {
  if (view === 'LaTeX') {
    if (model === 'ProfMaquette' || model === 'ProfMaquetteQrcode') {
      const firstExercise = calculationsQuestionsAnswers.slice(0, questionsNb / 2)
      const secondExercise = calculationsQuestionsAnswers.slice(questionsNb, questionsNb + questionsNb / 2)
      return [...firstExercise, ...secondExercise]
    } else {
      return calculationsQuestionsAnswers.slice(0, linesNumber / 2) // Supprime la deuxième moitié qui correspond aux réponses
    }
  } else {
    return calculationsQuestionsAnswers.filter((_, index) => index % 2 === 0) // Supprime une ligne sur deux qui correspond aux réponses
  }
}

function checkConsistency () {
  const differenceIndexes = getDifferencesIndexes()
  for (let i = 1; i < states.length; i++) {
    if (differenceIndexes.includes(i)) {
      console.log(`Il y a une différence entre la vue ${states[i - 1].view} et la vue ${states[i].view} pour les exercices de type ${states[i].exerciseType}`)
    } else {
      console.log(`Les questions n'ont pas changé entre la vue ${states[i - 1].view} et la vue ${states[i].view} pour les exercices de type ${states[i].exerciseType}`)
    }
  }
  if (differenceIndexes.length > 0) {
    const messages: string[] = []
    for (const differenceIndex of differenceIndexes) {
      messages.push(`Il y a une différence entre la vue ${states[differenceIndex - 1].view} et la vue ${states[differenceIndex].view} pour les exercices de type ${states[differenceIndex].exerciseType}`)
    }
    console.log(states)
    throw Error(messages.join('\n'))
  }
}

function getDifferencesIndexes () {
  const differenceIndexes: number[] = []
  for (let i = 1; i < states.length; i++) {
    for (let j = 0; j < states[i].numbers.length; j++) {
      if (
        states[i].exerciseType === states[i - 1].exerciseType &&
          states[i].numbers[j] !== states[i - 1].numbers[j] &&
          !(states[i].exerciseType === 'simple' && (states[i].view === 'AMC:AMCcodeGrid' || states[i - 1].view === 'AMC:AMCcodeGrid')) // Les exercices simples n'ont pas de sortie AMC
      ) {
        differenceIndexes.push(i)
        break
      }
    }
  }
  return differenceIndexes
}

const local = true
if (process.env.CI) {
  // utiliser pour les tests d'intégration
  prefs.headless = true
  runTest(test, import.meta.url, { pauseOnError: false })
} else {
  runTest(test, import.meta.url, { pauseOnError: true })
}
