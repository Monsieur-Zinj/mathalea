import Exercice from '../../Exercice'
import { randint, listeQuestionsToContenu } from '../../../modules/outils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import Decimal from 'decimal.js'
import { abs } from '../../../lib/outils/nombres'
export const titre = 'Calculer avec des puissances de 10'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '15/10/2024'
/*!
 * @author Gilles Mora
 */
export const uuid = 'b9584'
export const ref = 'can3C17'
export const refs = {
  'fr-fr': ['can3C17'],
  'fr-ch': []
}
export default class calculsAvecPuissance10 extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.spacing = 1.5
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let a
      let reponse
      const exp = randint(-4, 4, 0)
      const expABS = abs(exp)
      switch (randint(1, 3)) { // 1,2, 3
        case 1:
          a = choice([new Decimal(randint(2, 99)), new Decimal(randint(1, 99)).div(10), new Decimal(randint(101, 9999)).div(100)])
          reponse = texNombre(exp, 0)
          texte = 'Compléter.<br>'
          if (this.interactif) {
            handleAnswers(this, i,
              {
                champ1: { value: reponse }
              }
            )
            texte += remplisLesBlancs(this, i, `${texNombre(a, 4)} \\times 10^{%{champ1}} =${texNombre(Decimal.pow(10, exp).mul(a), 6)}`, KeyboardType.clavierNumbers)
          } else { texte += `$${texNombre(a, 4)} \\times 10^{\\ldots} =${texNombre(Decimal.pow(10, exp).mul(a), 6)}$` }
          texteCorr = `Le résultat obtenu est $${texNombre(Decimal.pow(10, expABS), 0)}$ fois plus ${exp > 0 ? 'grand' : 'petit'}.<br>
          ${exp > 0 ? `Comme $${texNombre(Decimal.pow(10, exp), 0)}=10^{${texNombre(exp, 0)}}$` : `Comme $\\dfrac{1}{${texNombre(Decimal.pow(10, exp), 5)}}=${texNombre(Decimal.pow(10, exp), 5)}=10^{${texNombre(exp, 0)}}$`}, 
          alors l'égalité est : $${texNombre(a, 4)} \\times 10^{${miseEnEvidence(texNombre(exp, 0))}} =${texNombre(Decimal.pow(10, exp).mul(a), 6)}$.`

          this.canEnonce = 'Compléter.'
          this.canReponseACompleter = `$${texNombre(a, 0)} \\times 10^{\\ldots} =${texNombre(Decimal.pow(10, exp).mul(a), 5)}$`
          this.listeCanEnonces.push(this.canEnonce)
          this.listeCanReponsesACompleter.push(this.canReponseACompleter)
          break

        case 2:
          a = choice([new Decimal(randint(2, 99)), new Decimal(randint(1, 99)).div(10), new Decimal(randint(101, 9999)).div(100)])
          reponse = texNombre(Decimal.pow(10, exp).mul(a), 6)
          texte = 'Calculer sous forme décimale.<br>'
          if (this.interactif) {
            handleAnswers(this, i,
              {
                champ1: { value: reponse }
              }
            )
            texte += remplisLesBlancs(this, i, `${texNombre(a, 4)} \\times 10^{${texNombre(exp, 0)}} =%{champ1}`, KeyboardType.clavierNumbers)
          } else { texte += `$${texNombre(a, 4)} \\times 10^{${texNombre(exp, 0)}} =\\ldots$` }
          texteCorr = `Comme $10^{${texNombre(exp, 0)}}=${texNombre(Decimal.pow(10, exp), 6)}$ alors, en multipliant par $10^{${texNombre(exp, 0)}}$, on 
          obtient un nombre $${texNombre(Decimal.pow(10, expABS), 0)}$ fois plus ${exp > 0 ? 'grand' : 'petit'}.<br>
         Ainsi, l'égalité est : $${texNombre(a, 4)} \\times 10^{${texNombre(exp, 0)}} =${miseEnEvidence(texNombre(Decimal.pow(10, exp).mul(a), 6))}$`

          this.canEnonce = 'Compléter avec la valeur décimale.'
          this.canReponseACompleter = `$${texNombre(a, 4)} \\times 10^{${texNombre(exp, 0)}} =\\ldots$`
          this.listeCanEnonces.push(this.canEnonce)
          this.listeCanReponsesACompleter.push(this.canReponseACompleter)
          break

        case 3:
          a = choice([new Decimal(randint(2, 99)), new Decimal(randint(1, 99)).div(10), new Decimal(randint(101, 9999)).div(100)])
          reponse = texNombre(a, 4)
          texte = 'Compléter.<br>'
          if (this.interactif) {
            handleAnswers(this, i,
              {
                champ1: { value: reponse }
              }
            )
            texte += remplisLesBlancs(this, i, `%{champ1} \\times 10^{${texNombre(exp, 0)}} =${texNombre(Decimal.pow(10, exp).mul(a), 6)}`, KeyboardType.clavierNumbers)
          } else { texte += `$\\ldots \\times 10^{${texNombre(exp, 0)}} =${texNombre(Decimal.pow(10, exp).mul(a), 5)}$` }
          texteCorr = `Comme $10^{${texNombre(exp, 0)}}=${texNombre(Decimal.pow(10, exp), 5)}$ alors, en multipliant par $10^{${texNombre(exp, 0)}}$, on 
          obtient un nombre $${texNombre(Decimal.pow(10, expABS), 0)}$ fois plus ${exp > 0 ? 'grand' : 'petit'}.<br>
          Le nombre cherché est donc $${texNombre(Decimal.pow(10, expABS), 0)}$ fois plus ${exp > 0 ? 'petit' : 'grand'}.<br>
          Ainsi, l'égalité est : $${miseEnEvidence(texNombre(a, 4))} \\times 10^{${texNombre(exp, 0)}} =${texNombre(Decimal.pow(10, exp).mul(a), 6)}$`

          this.canEnonce = 'Compléter.'
          this.canReponseACompleter = `$\\ldots \\times 10^{${texNombre(exp, 0)}} =${texNombre(Decimal.pow(10, exp).mul(a), 6)}$`
          this.listeCanEnonces.push(this.canEnonce)
          this.listeCanReponsesACompleter.push(this.canReponseACompleter)
          break
      }
      if (this.questionJamaisPosee(i, exp, texte)) {
        this.listeCorrections.push(texteCorr)
        this.listeQuestions.push(texte)

        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
