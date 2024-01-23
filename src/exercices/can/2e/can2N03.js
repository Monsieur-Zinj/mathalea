import { choice } from '../../../lib/outils/arrayOutils'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const titre = 'Déterminer l\'intersection de deux intervalles'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '26/10/2023'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can2N03
*/
export const uuid = 'e356a'
export const ref = 'can2N03'
export default function IntersectionIntervalles () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.spacing = 1
  this.formatChampTexte = 'largeur15 inline lycee'
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.nouvelleVersion = function () {
    const cours = 'L’intersection de deux intervalles $I$ et $J$ est l’ensemble qui contient les nombres appartenant à $I$ et à $J$.<br>'
    switch (choice([1, 1, 2, 3, 4, 5, 6, 7, 8, 9])) { // 1,1,2,3,4,5,6,7,8
      case 1 ://  [a;b] inter [c;d] avec c<b resultat [c;b]
        {
          const a = randint(-30, -20)
          const b = randint(-10, 5)
          const c = a + randint(1, 9)
          const d = randint(7, 15)
          const choix = choice([true, false])
          const crochet1 = choice([']', '['])
          const crochet2 = choice([']', '['])
          const crochet3 = choice([']', '['])
          const crochet4 = choice([']', '['])
          this.reponse = `${crochet3}${c};${b}${crochet2}`
          this.question = `Donner une écriture simplifiée de
        ${choix ? `$${crochet1} ${a}\\,;\\,${b}${crochet2}\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$.` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,${b}${crochet2}$.`}`
          this.correction = `${cours}` + `Ainsi, ${choix ? `$${crochet1} ${a}\\,;\\,${b}${crochet2}\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,${b}${crochet2}$`} $= ${miseEnEvidence(`${crochet3}${c}\\,;\\,${b}${crochet2}`)}$.<br>
        Les nombres de l'intervalle $${crochet3}${c}\\,;\\,${b}${crochet2}$ appartiennent à l'intervalle $${crochet1} ${a}\\,;\\,${b}${crochet2}$ et à l'intervalle $${crochet3}${c}\\,;\\,${d}${crochet4}$.`
        }
        break

      case 2 ://  [a;b] inter [c;d] avec c>b resultat vide
        {
          const a = randint(-30, -20)
          const b = randint(-10, 5)
          const c = b + randint(1, 3)
          const d = randint(10, 15)
          const choix = choice([true, false])
          const crochet1 = choice([']', '['])
          const crochet2 = choice([']', '['])
          const crochet3 = choice([']', '['])
          const crochet4 = choice([']', '['])
          this.formatInteractif = 'texte'
          this.reponse = '\\emptyset'
          this.question = `Donner une écriture simplifiée de
          ${choix ? `$${crochet1} ${a}\\,;\\,${b}${crochet2}\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$.` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,${b}${crochet2}$.`}`
          this.correction = `${cours}` + `Comme $${c}>${b}$, l'intersection est vide (il n'y a pas de nombres à la fois dans $I$ et dans $J$).`
          this.correction += `<br> ${choix ? `$${crochet1} ${a}\\,;\\,${b}${crochet2}\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,${b}${crochet2}$`} $= ${miseEnEvidence('\\emptyset')}$.`
        }
        break

      case 3://  [a;b] inter [c;d] avec [c;d] inclus dans [a;b] donc résulttat [c;d]
        {
          const a = randint(-10, -6)
          const b = randint(1, 5)
          const c = a + randint(1, 3)
          const d = b - randint(1, 3)
          const choix = choice([true, false])
          const crochet1 = choice([']', '['])
          const crochet2 = choice([']', '['])
          const crochet3 = choice([']', '['])
          const crochet4 = choice([']', '['])
          this.reponse = `${crochet3}${c};${d}${crochet4}`
          this.question = `Donner une écriture simplifiée de
        ${choix ? `$${crochet1} ${a}\\,;\\,${b}${crochet2}\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$.` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,${b}${crochet2}$.`}`
          this.correction = `${cours}` + `Ainsi, ${choix ? `$${crochet1} ${a}\\,;\\,${b}${crochet2}\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,${b}${crochet2}$`} $= ${miseEnEvidence(`${crochet3}${c}\\,;\\,${d}${crochet4}`)}$.<br>
        Les nombres de l'intervalle $${crochet3}${c}\\,;\\,${d}${crochet4}$ appartiennent à l'intervalle $${crochet1} ${a}\\,;\\,${b}${crochet2}$ et à l'intervalle $${crochet3}${c}\\,;\\,${d}${crochet4}$.`
        }
        break

      case 4 ://  [a;+infini] inter [c;d] avec a>c donc résultat [a;c]
        {
          const a = randint(-5, 10)
          const c = a - randint(1, 5)
          const d = a + randint(1, 5)
          const crochet1 = choice([']', '['])
          const crochet3 = choice([']', '['])
          const crochet4 = choice([']', '['])
          const choix = choice([true, false])
          this.reponse = `${crochet1}${a};${d}${crochet4}`
          this.question = `Donner une écriture simplifiée de
            ${choix ? `$${crochet1} ${a}\\,;\\,+\\infty[\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$.` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,+\\infty[$.`}`
          this.correction = `${cours}` + `Ainsi, ${choix ? `$${crochet1} ${a}\\,;\\,+\\infty[\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,+\\infty[$`} $= ${miseEnEvidence(`${crochet1}${a}\\,;\\,${d}${crochet4}`)}$.<br>
            Les nombres de l'intervalle $${crochet1}${a}\\,;\\,${d}${crochet4}$ appartiennent à l'intervalle $${crochet1} ${a}\\,;\\,+\\infty[$ et à l'intervalle $${crochet3}${c}\\,;\\,${d}${crochet4}$.`
        }
        break

      case 5 ://  [a;+infini[ inter [c;d] avec a<c donc resultat [c;d]
        {
          const a = randint(-5, 10)
          const c = a + randint(1, 5)
          const d = c + randint(1, 5)
          const crochet1 = choice([']', '['])
          const crochet3 = choice([']', '['])
          const crochet4 = choice([']', '['])
          const choix = choice([true, false])
          this.reponse = `${crochet3}${c};${d}${crochet4}`
          this.question = `Donner une écriture simplifiée de
              ${choix ? `$${crochet1} ${a}\\,;\\,+\\infty[\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$.` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,+\\infty[$.`}`
          this.correction = `${cours}` + `Ainsi, ${choix ? `$${crochet1} ${a}\\,;\\,+\\infty[\\,\\cap \\,${crochet3}${c}\\,;\\,${d}${crochet4}$` : `$${crochet3}${c}\\,;\\,${d}${crochet4}\\,\\cap \\,${crochet1} ${a}\\,;\\,+\\infty[$`} $= ${miseEnEvidence(`${crochet3}${c}\\,;\\,${d}${crochet4}`)}$.<br>
              Les nombres de l'intervalle $${crochet3}${c}\\,;\\,${d}${crochet4}$ appartiennent à l'intervalle $${crochet1} ${a}\\,;\\,+\\infty[$ et à l'intervalle $${crochet3}${c}\\,;\\,${d}${crochet4}$.`
        }
        break

      case 6 ://  [a;+infini[ inter [c;+infini[ avec a<c donc resultat [c;+infini[]
        {
          const a = randint(-5, 10)
          const c = a + randint(1, 5)
          const crochet1 = choice([']', '['])
          const crochet3 = choice([']', '['])
          const choix = choice([true, false])
          this.reponse = `${crochet3}${c};+\\infty[`
          this.question = `Donner une écriture simplifiée de
                ${choix ? `$${crochet1} ${a}\\,;\\,+\\infty[\\,\\cap \\,${crochet3}${c}\\,;\\,+\\infty[$.` : `$${crochet3}${c}\\,;\\,+\\infty[\\,\\cap \\,${crochet1} ${a}\\,;\\,+\\infty[$.`}`
          this.correction = `${cours}` + `Ainsi,  ${choix ? `$${crochet1} ${a}\\,;\\,+\\infty[\\,\\cap \\,${crochet3}${c}\\,;\\,+\\infty[$` : `$${crochet3}${c}\\,;\\,+\\infty[\\,\\cap \\,${crochet1} ${a}\\,;\\,+\\infty[$`} $= ${miseEnEvidence(`${crochet3}${c}\\,;\\,+\\infty[`)}$.<br>
                Les nombres de l'intervalle $${crochet3}${c}\\,;\\,+\\infty[$ appartiennent à l'intervalle $${crochet1} ${a}\\,;\\,+\\infty[$ et à l'intervalle $${crochet3}${c}\\,;\\,+\\infty[$.`
        }
        break

      case 7 ://  ]-infini;b] inter [c;+infini[ avec b>c donc resultat [c;b]
        {
          const b = randint(-10, 10)
          const c = b - randint(1, 5)
          const crochet2 = choice([']', '['])
          const crochet3 = choice([']', '['])
          const choix = choice([true, false])
          this.reponse = `${crochet3}${c};${b}${crochet2}`
          this.question = `Donner une écriture simplifiée de
                  ${choix ? `$]-\\infty \\,; \\,${b}${crochet2}\\cap ${crochet3}${c}\\,;\\,+\\infty[$.` : `$${crochet3}${c}\\,;\\,+\\infty[\\cap ]-\\infty \\,; \\,${b}${crochet2}$.`}`
          this.correction = `${cours}` + `Ainsi, 
                  ${choix ? `$]-\\infty \\,; \\,${b}${crochet2}\\cap ${crochet3}${c}\\,;\\,+\\infty[$` : `$${crochet3}${c}\\,;\\,+\\infty[\\cap ]-\\infty \\,; \\,${b}${crochet2}$`}  $= ${miseEnEvidence(`${crochet3}${c}\\,;\\,${b}${crochet2}`)}$.<br>
                  Les nombres de l'intervalle $${crochet3}${c}\\,;\\,${b}${crochet2}$ appartiennent à l'intervalle $]-\\infty \\,; \\,${b}${crochet2}$ et à l'intervalle $${crochet3}${c}\\,;\\,+\\infty[$.`
        }
        break

      case 8 ://  ]-infini;b] inter [c;d] avec c>b donc resultat vide
        {
          const b = randint(-10, 10)
          const c = b + randint(1, 5)
          const crochet2 = choice([']', '['])
          const crochet3 = choice([']', '['])
          const choix = choice([true, false])
          this.formatInteractif = 'texte'
          this.reponse = '\\emptyset'
          this.question = `Donner une écriture simplifiée de
                    ${choix ? `$]-\\infty \\,; \\,${b}${crochet2}\\cap ${crochet3}${c}\\,;\\,+\\infty[$.` : `$${crochet3}${c}\\,;\\,+\\infty[\\cap ]-\\infty \\,; \\,${b}${crochet2}$.`}`
          this.correction = `${cours}` + `Comme $${c}>${b}$, l'intersection est vide (il n'y a pas de nombres à la fois dans $I$ et dans $J$).`
          this.correction += `<br> ${choix ? `$]-\\infty \\,; \\,${b}${crochet2}\\cap ${crochet3}${c}\\,;\\,+\\infty[$` : `$${crochet3}${c}\\,;\\,+\\infty[\\cap ]-\\infty \\,; \\,${b}${crochet2}$`} $= ${miseEnEvidence('\\emptyset')}$.`
        }
        break

      case 9 ://  ]-infini;b] inter ]-infini;c] avec b<c donc resultat]-infini;b]
        {
          const b = randint(-5, 10)
          const c = b + randint(1, 5)
          const crochet2 = choice([']', '['])
          const crochet3 = choice([']', '['])
          const choix = choice([true, false])
          this.reponse = `]-\\infty;${b}${crochet2}`
          this.question = `Donner une écriture simplifiée de
                      ${choix ? `$]-\\infty\\,;\\, ${b}${crochet2}\\,\\cap \\,]-\\infty\\,;\\,${c}${crochet3}$.` : `$]-\\infty\\,;\\,${c}${crochet3}\\,\\cap \\,]-\\infty\\,;\\, ${b}${crochet2}$.`}`
          this.correction = `${cours}` + `Ainsi,  ${choix ? `$]-\\infty\\,;\\, ${b}${crochet2}\\,\\cap \\,]-\\infty\\,;\\,${c}${crochet3}$` : `$]-\\infty\\,;\\,${c}${crochet3}\\,\\cap \\,]-\\infty\\,;\\, ${b}${crochet2}$`} $= ${miseEnEvidence(`]-\\infty\\,;\\,${b}${crochet2}`)}$.<br>
                      Les nombres de l'intervalle $]-\\infty\\,;\\,${b}${crochet2}$ appartiennent à l'intervalle $]-\\infty\\,;\\, ${b}${crochet2}$ et à l'intervalle $]-\\infty\\,;\\,${c}${crochet3}$.`
        }
        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
