import { shuffle } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { ComputeEngine } from '@cortex-js/compute-engine'
import type { MathfieldElement } from 'mathlive'
import figureApigeom from '../../lib/figureApigeom'
import Figure from 'apigeom'
import RectangleFractionDiagram from 'apigeom/src/elements/diagrams/RectangleFractionDiagram'
import minus from 'apigeom/src/assets/svg/minus.svg'
import plus from 'apigeom/src/assets/svg/plus.svg'
import erase from 'apigeom/src/assets/svg/erase.svg'
import { ajouteFeedback, remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { generateCleaner } from '../../lib/interactif/comparisonFunctions'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = "Décomposer une fraction (partie entière + fraction inférieure à 1) puis donner l'écriture décimale"
export const interactifReady = true
export const interactifType = 'custom'
export const dateDeModifImportante = '24/01/2024' // Brouillon interactif

/**
 * Décomposer une fraction (partie entière + fraction inférieure à 1) puis donner l'écriture décimale.
 * @author Rémi Angot
 */
export const uuid = 'ab44e'
export const ref = '6N20-2'
export const refs = {
  'fr-fr': ['6N20-2'],
  'fr-ch': ['9NO11-2']
}

const ce = new ComputeEngine()

export default class ExerciceFractionsDifferentesEcritures extends Exercice {
  reponsesAttendues: {
    entier: number;
    numPartieDecimale: number;
    den: number;
    ecritureDecimale: string;
  }[] = []

  constructor () {
    super()
    this.consigne =
      "Écrire sous la forme de la somme d'un nombre entier et d'une fraction inférieure à 1 puis donner l'écriture décimale."
    this.spacing = 2
    this.spacingCorr = 2
    this.sup = '2-4-4-5-5-5-8-8-10-10-10-10'
    this.sup2 = true

    this.besoinFormulaireTexte = [
      'Dénominateurs à choisir',
      'Nombres séparés par des tirets\n2: demis\n4: quarts\n5: cinquièmes\n8: huitièmes\n10: dixièmes\n11: Mélange'
    ]
    this.exoCustomResultat = true // Permet de mettre chaque question sur 2 points
    this.besoinFormulaire2CaseACocher = ['Brouillon interactif']
  }

  nouvelleVersion (): void {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const listeDenominateurs = gestionnaireFormulaireTexte({
      saisie: this.sup as string,
      min: 2,
      max: 10,
      defaut: 11,
      melange: 11,
      nbQuestions: this.nbQuestions,
      exclus: [3, 6, 7, 9]
    }) as number[]

    if (this.sup2) {
      const figure = getDynamicFractionDiagram()
      this.introduction = figureApigeom({ exercice: this, idApigeom: `apiGeomEx${this.numeroExercice}`, figure })
      figure.isDynamic = true
      figure.divButtons.style.display = 'grid'
      if (figure.ui) figure.ui.send('FILL')
    } else {
      this.introduction = ''
    }

    const fractions : [number, number, string][] = []
    const nbDenominateursDifferents : number = new Set(listeDenominateurs).size
    const aleaMax = Math.ceil(this.nbQuestions / nbDenominateursDifferents)
    const fractionsUsed: { [id: number]: number [] } = {}
    for (let i = 0; i < this.nbQuestions; i++) {
      const b: number = listeDenominateurs[i]
      if (!fractionsUsed[b]) fractionsUsed[b] = shuffle(Array.from({ length: b - 1 }, (_, i) => i + 1)) // tous les numérateurs possibles...
      const num: number = fractionsUsed[b].pop() ?? 1 // choisi un numérateur au hasard
      let partieDecimale: string = ((num * 1000) / b).toString() // avec les 8e on a 3 chiffres, avec les 4 2...
      partieDecimale = ',' + (partieDecimale.match(/[1-9]+/g)?.[0] ?? '')
      fractions.push([num, b, partieDecimale])
    }
    shuffle(fractions)
    for (let i = 0, cpt = 0, num : number, ecriDec : string, den : number, numPartieFrac : number, entier : number, texte : string, texteCorr : string; i < this.nbQuestions && cpt < 100; cpt++) {
      numPartieFrac = fractions[i][0]
      den = fractions[i][1]
      entier = randint(1, aleaMax)
      num = entier * den + numPartieFrac
      ecriDec = entier.toString() + fractions[i][2]
      const frac = new FractionEtendue(num, den)
      const partieFrac = new FractionEtendue(numPartieFrac, den)

      texte =
        '$ ' +
        frac.texFraction +
        ' = \\phantom{00}\\text{........}\\phantom{00} + ' +
        '\\dfrac{\\phantom{00}\\text{........}\\phantom{00}}{\\phantom{00}\\text{........}\\phantom{00}}' +
        ' =  $'
      texteCorr =
        '$ ' +
        frac.texFraction +
        ' = ' +
        entier +
        '+' +
        partieFrac.texFraction +
        ' = ' +
        ecriDec +
        ' $'
      this.reponsesAttendues[i] = { entier, numPartieDecimale: numPartieFrac, den, ecritureDecimale: ecriDec.replace(',', '.') }

      if (this.interactif) {
        texte = remplisLesBlancs(this, i, `${frac.texFraction} =~\\placeholder[n]{} + \\dfrac{\\placeholder[num]{}}{\\placeholder[den]{}} =~\\placeholder[ecritureDecimale]{}`, KeyboardType.clavierNumbers)
        texte += ajouteFeedback(this, i)
      }
      if (this.questionJamaisPosee(i, num, den)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque question.
  }

  correctionInteractive = (i?: number) => {
    if (i === undefined) return ''
    if (this.answers === undefined) this.answers = {}
    const result: ('OK' | 'KO')[] = []
    const mf = document.querySelector(
      `#champTexteEx${this.numeroExercice}Q${i}`
    ) as MathfieldElement
    if (mf === null) return ''
    const { entier, numPartieDecimale, den, ecritureDecimale } = this.reponsesAttendues[i]
    this.answers[`Ex${this.numeroExercice}Q${i}`] = mf.getValue()
    const spanResultat = document.querySelector(
      `#resultatCheckEx${this.numeroExercice}Q${i}`
    ) as HTMLDivElement
    const clean = generateCleaner(['virgules'])
    const nSaisi = Number(clean(mf.getPromptValue('n')))
    const test1 = nSaisi === entier
    const numSaisi = Number(clean(mf.getPromptValue('num')))
    const denSaisi = Number(clean(mf.getPromptValue('den')))
    const valeurDecimale = clean(mf.getPromptValue('ecritureDecimale'))
    const test2 = (denSaisi !== 0) && Number.isInteger(denSaisi) && Number.isInteger(numSaisi) && new FractionEtendue(numPartieDecimale, den).isEqual(new FractionEtendue(numSaisi, denSaisi))
    const test3 = ce
      .parse(valeurDecimale)
      .isEqual(ce.parse(`${clean(ecritureDecimale)}`))
    let feedback: string
    if (test1 && test2 && test3) {
      spanResultat.innerHTML = '😎'
    } else {
      spanResultat.innerHTML = '☹️'
    }
    if (!test1) {
      mf.setPromptState('n', 'incorrect', true)
    } else {
      mf.setPromptState('n', 'correct', true)
    }
    if (!test2) {
      mf.setPromptState('num', 'incorrect', true)
      mf.setPromptState('den', 'incorrect', true)
    } else {
      mf.setPromptState('num', 'correct', true)
      mf.setPromptState('den', 'correct', true)
    }
    if (!test3) {
      mf.setPromptState('ecritureDecimale', 'incorrect', true)
    } else {
      mf.setPromptState('ecritureDecimale', 'correct', true)
    }
    if (test1 && test2) {
      feedback = 'Décomposition correcte, '
      result.push('OK')
    } else {
      feedback = 'Décomposition fausse, '
      result.push('KO')
    }
    if (test3) {
      feedback += 'valeur décimale exacte.'
      result.push('OK')
    } else {
      feedback += 'valeur décimale fausse.'
      result.push('KO')
    }
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${i}`)
    if (divFeedback) divFeedback.innerHTML = feedback
    return result
  }
}

export function getDynamicFractionDiagram () {
  const figure = new Figure({ xMin: -0.5, yMin: -2, width: 800, height: 120 })
  figure.divUserMessage.style.display = 'none'
  figure.options.automaticUserMessage = false
  figure.options.color = 'blue'
  // figure.options.limitNumberOfElement.set('Point', 0)

  const d = new RectangleFractionDiagram(figure, { denominator: 2, numberOfRectangles: 5 })

  function decreaseDenominator (): void {
    if (d.denominator === 2) return
    const num = d.numerator
    d.denominator--
    d.redraw()
    d.numerator = num
    text.text = `L'unité est partagée en ${d.denominator} parts égales.`
  }

  function increaseNumerator (): void {
    const num = d.numerator
    d.denominator++
    d.redraw()
    d.numerator = num
    text.text = `L'unité est partagée en ${d.denominator} parts égales.`
  }

  function clearFill (): void {
    d.numerator = 0
  }
  figure.setToolbar({ position: 'top', tools: ['FILL'] })
  const p = document.createElement('p')
  p.innerHTML = 'Brouillon non évalué'
  p.classList.add('italic', 'font-black', 'text-coopmaths-struct', 'ml-10', 'my-auto')
  figure.addCustomButton({ action: decreaseDenominator, tooltip: 'Diminuer le nombre de parts', url: minus })
  figure.addCustomButton({ action: increaseNumerator, tooltip: 'Augmenter le nombre de parts', url: plus })
  figure.addCustomButton({ action: clearFill, tooltip: 'Réinitialiser le coloriage', url: erase })
  figure.divButtons.appendChild(p)
  figure.container.classList.add('border-2', 'border-coopmaths-struct', 'p-2', 'rounded-md')
  const text = figure.create('TextByPosition', { text: `L'unité est partagée en ${d.denominator} parts égales.`, x: 0, y: -1.5, anchor: 'bottomLeft', isChild: true })
  return figure
}
