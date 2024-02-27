import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { texNombre } from '../../lib/outils/texNombre'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { consecutifsCompare, numberCompare } from '../../lib/interactif/comparaisonFonctions'
import { context } from '../../modules/context'

export const titre = 'Encadrer une fraction décimale entre deux nombres entiers'
export const uuid = '3bdcd'
export const ref = '6N20-3'
export const refs = {
  'fr-fr': ['6N20-3'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '14/12/2023'

/**
 * @author Rémi Angot
*/

export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.consigne = 'Compléter avec deux nombres entiers consécutifs.'
    this.nbQuestions = 4
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    type TypeQuestionsDisponibles = 'dixieme'|'centieme'|'millieme'
    const typeQuestionsDisponibles = ['dixieme', 'centieme', 'millieme']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions) as TypeQuestionsDisponibles[]
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let den = 1
      let num = 1
      let texteEgaliteUnite: string
      let texteCorr = ''
      switch (listeTypeQuestions[i]) {
        case 'dixieme':
          den = 10
          texteEgaliteUnite = 'dix dixièmes'
          break
        case 'centieme':
          den = 100
          texteEgaliteUnite = 'cent centièmes'
          break
        case 'millieme':
          den = 1000
          texteEgaliteUnite = 'mille millièmes'
          break
      }
      do {
        num = randint(0, den * 10)
      } while (num % den === 0)
      let texte = remplisLesBlancs(this, i, `%{champ1}~~ < ~~\\dfrac{${texNombre(num, 1)}}{${texNombre(den, 1)}}~~ < ~~%{champ2}`, 'inline clavierDeBaseAvecFraction fillInTheBlank')
      const a = Math.floor(num / den)
      const b = a + 1
      texteCorr = ` $\\dfrac{${texNombre(a * den, 1)}}{${texNombre(den, 1)}} < \\dfrac{${texNombre(num, 1)}}{${texNombre(den, 1)}} < \\dfrac{${texNombre(b * den, 1)}}{${texNombre(den, 1)}}\\quad$ `
      texteCorr += ` donc $\\quad${a} < \\dfrac{${texNombre(num, 1)}}{${texNombre(den, 1)}} < ${b}$.<br><br>`
      if (a === 0) {
        texteCorr += `Remarque : on sait que $0 = \\dfrac{0}{${texNombre(den, 1)}}\\quad$ et $\\quad\\dfrac{${texNombre(den, 1)}}{${texNombre(den, 1)}} = ${b}$.`
      } else {
        texteCorr += `Remarque : il faut ${texteEgaliteUnite} pour faire une unité donc $\\dfrac{${texNombre(a * den, 1)}}{${texNombre(den, 1)}} = ${a}$ et $\\dfrac{${texNombre(b * den, 1)}}{${texNombre(den, 1)}} = ${b}$.`
      }
      handleAnswers(this, i, {
        bareme: (listePoints: number[]) => [Math.min(listePoints[0], listePoints[1]), 1],
        feedback: (saisies: {champ1: string, champ2: string}) => {
          const rep1 = saisies.champ1
          const rep2 = saisies.champ2
          // on teste consecutifsCompare pour le feedback seulement, comme c'est un fillInTheBlank, la comparaison se fait sur les valeurs exactes des bornes entières.
          // consecutifsCompare peut être utilisée pour évaluer des saisies complètes d'encadrements avec les signes < ou >
          const { feedback } = consecutifsCompare(`${rep1}<${(num / den).toFixed(4)}<${rep2}`, { entierInf: a, entierSup: b, valeurInter: (a + b) / 2 })
          return feedback
        },
        champ1: { value: String(a), compare: numberCompare },
        champ2: { value: String(b), compare: numberCompare }
      }, { formatInteractif: 'fillInTheBlank' })
      if (this.questionJamaisPosee(i, num, den)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
