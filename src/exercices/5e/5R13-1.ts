import Exercice from '../Exercice'
import { choice, combinaisonListes, shuffle } from '../../lib/outils/arrayOutils'
import { listeQuestionsToContenu, randint } from '../../modules/outils'
import Decimal from 'decimal.js'
import { texNombre } from '../../lib/outils/texNombre'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
export const titre = 'Ranger des nombres relatifs'

export const dateDePublication = '22/9/2024'
export const interactifReady = true
export const interactifType = 'mathlive'
export const uuid = 'c7c3d'
export const refs = {
  'fr-fr': ['5R13-1'],
  'fr-ch': ['']
}
/**
 * Ranger des nombres relatifs
 * @author Rémi Angot
 * Référence 5R13-1
*/
export default class RelatifsOrdre extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 3
  }

  nouvelleVersion () {
    const typeQuestionsDisponibles = ['croissant', 'décroissant'] as ['croissant', 'décroissant']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const a = new Decimal(randint(10, 99)).div(-10)
      const b = a.add(new Decimal(randint(1, 9)).div(100))
      const c = a.add(new Decimal(randint(-9, 1)).div(100))
      const d = a.add(new Decimal(randint(1, 9)).div(10))
      const e = a.add(new Decimal(randint(-9, -1)).div(10))
      const f = a.add(new Decimal(choice([-1, 1])).mul(randint(10, 19)).div(10))
      let numbers = shuffle([a, b, c, d, e, f])
      const n = randint(2, 3)
      for (let i = 0; i < n; i++) {
        numbers[i] = numbers[i].mul(-1)
      }
      numbers = shuffle(numbers)

      const ordre = listeTypeQuestions[i]
      const orderedNumbers = ordre === 'croissant' ? numbers.slice().sort((a, b) => a.cmp(b)) : numbers.slice().sort((a, b) => b.cmp(a))

      let texte = `Ranger les nombres suivants dans l'ordre ${ordre} : `
      texte += `<br><br> $${numbers.map(num => `${texNombre(num)}`).join('\\quad ; \\quad')}$.`

      if (this.interactif) {
        const symbole = ordre === 'croissant' ? '<' : '>'
        texte += '<br><br>' + remplisLesBlancs(this,
          i,
        `%{champ1}\\quad${symbole}\\quad%{champ2}\\quad${symbole}\\quad%{champ3}\\quad${symbole}\\quad%{champ4}\\quad${symbole}\\quad%{champ5}\\quad${symbole}\\quad%{champ6}`,
        ` ${KeyboardType.clavierNumbers}`,
        '\\ldots\\ldots'
        )
        handleAnswers(this, i,
          {
            // @ts-expect-error problème typage handleAnswers
            champ1: { value: orderedNumbers[0] },
            // @ts-expect-error problème typage handleAnswers
            champ2: { value: orderedNumbers[1] },
            // @ts-expect-error problème typage handleAnswers
            champ3: { value: orderedNumbers[2] },
            // @ts-expect-error problème typage handleAnswers
            champ4: { value: orderedNumbers[3] },
            // @ts-expect-error problème typage handleAnswers
            champ5: { value: orderedNumbers[4] },
            // @ts-expect-error problème typage handleAnswers
            champ6: { value: orderedNumbers[5] }
          }
        )
      }
      let texteCorr = ''
      switch (listeTypeQuestions[i]) {
        case 'croissant':
          texteCorr = `$${orderedNumbers.map(num => `${texNombre(num)}`).join('\\quad < \\quad')}$.`
          break
        case 'décroissant':
          texteCorr = `$${orderedNumbers.map(num => `${texNombre(num)}`).join('\\quad > \\quad')}$.`
          break
      }
      if (this.questionJamaisPosee(i, JSON.stringify(numbers))) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
