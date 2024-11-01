import Exercice from '../../Exercice'
import { randint, listeQuestionsToContenu } from '../../../modules/outils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { choice } from '../../../lib/outils/arrayOutils'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Compléter une égalité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '31/10/2024'
/*!
 * @author Gilles Mora
 */
export const uuid = 'ab2fc'
export const ref = 'can6C49'
export const refs = {
  'fr-fr': ['can6C49'],
  'fr-ch': []
}
export default class egaliteCompleter extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.spacing = 1.5
    this.formatInteractif = 'fillInTheBlank'
    this.compare = fonctionComparaison
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
      let a, b, c, choix
      let reponse
      const exp = randint(-4, 4, 0)
      switch (randint(1, 2)) { // 1,2, 3
        case 1:
          a = randint(5, 10)
          b = randint(2, 10)
          c = randint(1, 6)
          choix = choice([true, false])
          reponse = texNombre(a + b + c, 0)
          texte = 'Compléter l\'égalité.<br>'
          handleAnswers(this, i, { champ1: { value: reponse } })
          texte += remplisLesBlancs(this, i, `${choix ? `${a}+${b}= %{champ1} -${c}` : `%{champ1} -${c}=${a}+${b} `}`, 'fillInTheBlank', '\\ldots')
          texteCorr = `Le nombre cherché vérifie  l'égalité : 
           ${choix ? `$${a + b}= \\ldots -${c}$` : `$\\ldots -${c}=${a + b}$ `}.<br>
           On cherche donc le nombre qui, diminué de $${c}$ est égal à  $${a + b}$. <br>
           Ce nombre est $${miseEnEvidence(reponse)}$. <br>
           On a bien : $${choix ? `${a}+${b}= ${miseEnEvidence(reponse)} -${c}` : `${miseEnEvidence(reponse)} -${c}=${a}+${b} `}$.`
          this.canEnonce = 'Compléter l\'égalité.'
          this.canReponseACompleter = `${choix ? `$${a}+${b}= \\ldots -${c}$` : `$\\ldots -${c}=${a}+${b}$ `}`
          this.listeCanEnonces.push(this.canEnonce)
          this.listeCanReponsesACompleter.push(this.canReponseACompleter)
          break

        case 2:
          a = randint(5, 10)
          b = randint(2, 10)
          c = randint(1, 6, [a, b])
          choix = choice([true, false])
          reponse = texNombre(a + b - c, 0)
          texte = 'Compléter l\'égalité.<br>'
          handleAnswers(this, i, { champ1: { value: reponse } })
          texte += remplisLesBlancs(this, i, `${choix ? `${a}+${b}= %{champ1} +${c}` : `%{champ1} +${c}=${a}+${b} `}`, 'fillInTheBlank', '\\ldots')
          texteCorr = `Le nombre cherché vérifie  l'égalité : 
             ${choix ? `$${a + b}= \\ldots +${c}$` : `$\\ldots +${c}=${a + b}$ `}.<br>
             On cherche donc le nombre qui, augmenté de $${c}$ est égal à  $${a + b}$. <br>
             Ce nombre est $${miseEnEvidence(reponse)}$. <br>
             On a bien : $${choix ? `${a}+${b}= ${miseEnEvidence(reponse)} +${c}` : `${miseEnEvidence(reponse)} +${c}=${a}+${b} `}$.`
          this.canEnonce = 'Compléter l\'égalité.'
          this.canReponseACompleter = `${choix ? `$${a}+${b}= \\ldots +${c}$` : `$\\ldots +${c}=${a}+${b}$ `}`
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
