import {
  choice,
  enleveElement,
  shuffle
} from '../../lib/outils/arrayOutils.js'
import Exercice from '../ExerciceTs'
import {
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
  randint
} from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { ComputeEngine } from '@cortex-js/compute-engine'
import type { MathfieldElement } from 'mathlive'

export const titre = "Décomposer une fraction (partie entière + fraction inférieure à 1) puis donner l'écriture décimale"
export const interactifReady = true
export const interactifType = 'custom'
export const dateDeModifImportante = '18/11/2023' // passage de l'interactif en fill in the blank

/**
 * Décomposer une fraction (partie entière + fraction inférieure à 1) puis donner l'écriture décimale.
 * @author Rémi Angot
 * 6N20-2
 */
export const uuid = 'ab44e'
export const ref = '6N20-2'

const ce = new ComputeEngine()

class ExerciceFractionsDifferentesEcritures extends Exercice {
  reponsesAttendues: {
    n: number;
    num: number;
    den: number;
    ecritureDecimale: number;
  }[] = []

  constructor () {
    super()
    this.consigne =
      "Écrire sous la forme de la somme d'un nombre entier et d'une fraction inférieure à 1 puis donner l'écriture décimale."
    this.spacing = 2
    this.spacingCorr = 2
    this.sup = false
    this.sup2 = '11'
    this.besoinFormulaireCaseACocher = [
      'Exercice à la carte (à paramétrer dans le formulaire suivant)',
      false
    ]
    this.besoinFormulaire2Texte = [
      'Dénominateurs à choisir',
      'Nombres séparés par des tirets\n2: demis\n4: quarts\n5: cinquièmes\n8: huitièmes\n10: dixièmes\n11: Mélange'
    ]
    this.exoCustomResultat = true // Permet de mettre chaque question sur 2 points
  }

  nouvelleVersion (): void {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const listeDenominateurs = gestionnaireFormulaireTexte({
      saisie: this.sup2 as string,
      min: 2,
      max: 10,
      defaut: 11,
      melange: 11,
      nbQuestions: this.nbQuestions,
      exclus: [3, 6, 7, 9]
    })
    let fractions = []
    let fractions1: [number, number, string][] = []
    let aleaMax: number
    if (!this.sup) {
      fractions = [
        [1, 2, ',5'],
        [1, 4, ',25'],
        [3, 4, ',75'],
        [1, 5, ',2'],
        [2, 5, ',4'],
        [3, 5, ',6'],
        [4, 5, ',8'],
        [1, 8, ',125'],
        [3, 8, ',375'],
        [1, 10, ',1'],
        [3, 10, ',3'],
        [7, 10, ',7'],
        [9, 10, ',9']
      ] // Fractions irréductibles avec une écriture décimale exacte
      fractions1 = [
        [1, 2, ',5'],
        [1, 4, ',25'],
        [3, 4, ',75'],
        [1, 8, ',125']
      ]
      fractions1.push(
        choice([
          [1, 10, ',1'],
          [2, 10, ',2'],
          [3, 10, ',3'],
          [7, 10, ',7'],
          [9, 10, ',9']
        ])
      )
      fractions1.push(
        choice([
          [1, 5, ',2'],
          [2, 5, ',4'],
          [3, 5, ',6'],
          [4, 5, ',8']
        ])
      ) // liste_fractions pour les 6 premières questions
    } else {
      const denominateursDifferents = new Set(listeDenominateurs)
      const nbDenominateursDifferents = denominateursDifferents.size
      aleaMax = Math.ceil(this.nbQuestions / nbDenominateursDifferents)
      for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 200;) {
        const b = listeDenominateurs[i]
        const num = randint(1, b - 1)
        let partieDecimale = ((num * 1000) / b).toString() // avec les 8e on a 3 chiffres, avec les 4 2...
        partieDecimale = ',' + (partieDecimale.match(/[1-9]+/g)?.[0] ?? '')
        if (
          fractions.filter((element) => element[0] === num && element[1] === b)
            .length === 0
        ) {
          // la fraction n'a pas encore été construite
          fractions.push([num, b, partieDecimale])
          i++
        } else {
          cpt++
        }
      }
      shuffle(fractions)
    }
    for (
      let i = 0, cpt = 0, fraction, a, ed, b, c, n, texte, texteCorr;
      i < this.nbQuestions && cpt < 100;

    ) {
      if (!this.sup) {
        if (i < 6) {
          fraction = choice(fractions1)
          enleveElement(fractions1, fraction)
        } else {
          fraction = choice(fractions)
        }
        //
        c = fraction[0]
        b = fraction[1]
        n = randint(1, 4)
        a = n * b + c
        ed = n + fraction[2]
      } else {
        c = fractions[i][0]
        b = fractions[i][1]
        n = randint(1, aleaMax)
        a = n * b + c
        ed = n.toString() + fractions[i][2]
      }
      const frac = new FractionEtendue(a, b)
      const partieFrac = new FractionEtendue(c, b)
      // enleveElement(fractions, fraction) // Il n'y aura pas 2 fois la même partie décimale
      texte =
        '$ ' +
        frac.texFraction +
        ' = \\phantom{0000} + ' +
        '\\dfrac{\\phantom{00000000}}{}' +
        ' =  $'
      texteCorr =
        '$ ' +
        frac.texFraction +
        ' = ' +
        n +
        '+' +
        partieFrac.texFraction +
        ' = ' +
        ed +
        ' $'
      this.reponsesAttendues[i] = { n, num: c, den: b, ecritureDecimale: ed }

      if (this.interactif) {
        texte = `<math-field class="fillInTheBlanks" readonly style="font-size:2em" id="champTexteEx${this.numeroExercice}Q${i}">
        ${frac.texFraction} =~\\placeholder[n]{} + \\dfrac{\\placeholder[num]{}}{\\placeholder[den]{}} =~\\placeholder[ecritureDecimale]{}
      </math-field><span class="ml-2" id="feedbackEx${this.numeroExercice}Q${i}"></span>`
      }
      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque question.
  }

  correctionInteractive = (i?: number) => {
    if (i === undefined) return ''
    if (this.answers === undefined) this.answers = {}
    const result: ('OK' | 'KO')[] = []
    const { n, num, den, ecritureDecimale } = this.reponsesAttendues[i]
    const mf = document.querySelector(
      `#champTexteEx${this.numeroExercice}Q${i}`
    ) as MathfieldElement
    this.answers[`Ex${this.numeroExercice}Q${i}`] = mf.getValue()
    const divFeedback = document.querySelector(
      `#feedbackEx${this.numeroExercice}Q${i}`
    ) as HTMLDivElement
    const test1 = ce.parse(mf.getPromptValue('n')).isSame(ce.parse(`${n}`))
    const numSaisi = mf.getPromptValue('num')
    const denSaisi = mf.getPromptValue('den')
    const test2 = ce
      .parse(`\\dfrac{${numSaisi}}{${denSaisi}}`)
      .isSame(ce.parse(`\\dfrac{${num}}{${den}}`))
    const test3 = ce
      .parse(mf.getPromptValue('ecritureDecimale'))
      .isSame(ce.parse(`${ecritureDecimale}`))
    if (test1 && test2 && test3) {
      divFeedback.innerHTML = '😎'
    } else {
      divFeedback.innerHTML = '☹️'
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
    if (test1 && test2) result.push('OK')
    else result.push('KO')
    if (test3) result.push('OK')
    else result.push('KO')
    return result
  }
}

export default ExerciceFractionsDifferentesEcritures
