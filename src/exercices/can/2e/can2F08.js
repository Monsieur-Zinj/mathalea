import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'

import { tableauDeVariation } from '../../../lib/mathFonctions/etudeFonction.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { sp } from '../../../lib/outils/outilString.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { setReponse } from '../../../lib/interactif/gestionInteractif.js'

export const titre = 'Encadrer en utilisant un tableau de variations'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '22/12/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '24/10/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 */
export const uuid = 'e0405'
export const ref = 'can2F08'
export const refs = {
  'fr-fr': ['can2F08'],
  'fr-ch': []
}
export default function EncadrerTableau () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.formatChampTexte = 'largeur15 inline'
  this.tailleDiaporama = 2
  this.listePackages = ['tkz-tab']
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    let question1, correction1, ligne1
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const x1 = randint(-20, 10)
      const x2 = randint(x1 + 1, 15)
      const x3 = randint(x2 + 1, 20)
      const x4 = randint(x3 + 1, 25)
      const y1 = randint(-10, 10)
      const y2 = randint(y1 - 10, y1 - 1)
      const y3 = randint(y2 + 1, y2 + 10, y1)
      const y4 = randint(y3 - 10, y3 - 1, y2)
      const M = Math.max(y1, y3)
      const m = Math.min(y2, y4)
      const choix = randint(1, 2)
      if (choix === 1) {
        ligne1 = ['Var', 10, `+/$${y1}$`, 10, `-/$${y2}$`, 10, `+/$${y3}$`, 10, `-/$${y4}$`, 10]
      } else {
        ligne1 = ['Var', 10, `-/$${-y1}$`, 10, `+/$${-y2}$`, 10, `-/$${-y3}$`, 10, `+/$${-y4}$`, 10]
      }
      // xmin détermine la marge à gauche, ymin la hauteur réservée pour le tableau, xmax la largeur réservée pour le tableau et ymax la marge au dessus du tableau
      question1 = `Voici le tableau de variations d'une fonction $f$ définie sur $[${x1};${x4}]$ :<br>`

      this.canEnonce = `Voici le tableau de variations d'une fonction $f$ définie sur $[${x1};${x4}]$ :
      
    ` + tableauDeVariation({
          tabInit: [
            [
              // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
              ['$x$', 2, 10], ['$f(x)$', 4, 30]
            ],
            // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
            [`$${x1}$`, 10, `$${x2}$`, 10, `$${x3}$`, 10, `$${x4}$`, 10]
          ],
          // tabLines ci-dessous contient les autres lignes du tableau.
          tabLines: [ligne1],
          colorBackground: '',
          espcl: 3, // taille en cm entre deux antécédents
          deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
          lgt: 3, // taille de la première colonne en cm
          scale: 0.35
        })
      question1 += tableauDeVariation({
        tabInit: [
          [
            // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
            ['$x$', 2, 10], ['$f(x)$', 4, 30]
          ],
          // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
          [`$${x1}$`, 10, `$${x2}$`, 10, `$${x3}$`, 10, `$${x4}$`, 10]
        ],
        // tabLines ci-dessous contient les autres lignes du tableau.
        tabLines: [ligne1],
        colorBackground: '',
        espcl: 3, // taille en cm entre deux antécédents
        deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
        lgt: 3, // taille de la première colonne en cm
        scale: 0.35
      })
      if (choice([true, false])) {
        question1 += `  <br>
      Encadrer le plus précisément possible $f(x)$ lorsque $x\\in[${x1}\\,;\\,${x3}]$.`
        if (this.interactif) {
          question1 += '<br>' + ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline') + '$\\leqslant f(x)\\leqslant$ ' + ajouteChampTexteMathLive(this, 2 * i + 1, 'inline largeur25 nospacebefore')
        }
        this.canEnonce += `<br>
        Encadrer le plus précisément possible $f(x)$  lorsque  $x\\in[${x1};${x3}]$.`
        this.canReponseACompleter = '$\\ldots \\leqslant f(x)\\leqslant \\ldots$'
        if (choix === 1) {
          if (M === y1) {
            correction1 = `Sur $[${x1}\\,;\\,${x3}]$, le minimum de $f$ est $${y2}$ et le maximum est
          $${y1}$. <br>
          Ainsi, pour $x\\in[${x1}\\,;\\,${x3}]$, ${sp(3)} $${miseEnEvidence(y2)}\\leqslant f(x)\\leqslant ${miseEnEvidence(y1)}$.<br>`
            setReponse(this, 2 * i, y2)
            setReponse(this, 2 * i + 1, y1)
          } else {
            correction1 = `Sur $[${x1}\\,;\\,${x3}]$, le minimum de $f$ est $${y2}$ et le maximum est
          $${y3}$. <br>
          Ainsi, pour $x\\in[${x1}\\,;\\,${x3}]$, ${sp(3)} $${miseEnEvidence(y2)}\\leqslant f(x)\\leqslant ${miseEnEvidence(y3)}$.<br>`
            setReponse(this, 2 * i, y2)
            setReponse(this, 2 * i + 1, y3)
          }
        } else {
          if (M === y1) {
            correction1 = `Sur $[${x1}\\,;\\,${x3}]$, le minimum de $f$ est $${-y1}$ et le maximum est
          $${-y2}$. <br>
          Ainsi, pour $x\\in[${x1}\\,;\\,${x3}]$, ${sp(3)} $${miseEnEvidence(-y1)}\\leqslant f(x)\\leqslant ${miseEnEvidence(-y2)}$. `
            setReponse(this, 2 * i, -y1)
            setReponse(this, 2 * i + 1, -y2)
          } else {
            correction1 = `Sur $[${x1}\\,;\\,${x3}]$, le minimum de $f$ est $${-y3}$ et le maximum est
          $${-y2}$. <br>
          Ainsi, pour $x\\in[${x1}\\,;\\,${x3}]$, ${sp(3)} $${miseEnEvidence(-y3)}\\leqslant f(x)\\leqslant ${miseEnEvidence(-y2)}$.  `
            setReponse(this, 2 * i, -y3)
            setReponse(this, 2 * i + 1, -y2)
          }
        }
      } else {
        question1 += `<br>Encadrer le plus précisément possible $f(x)$ lorsque $x\\in[${x2}\\,;\\,${x4}]$.`
        if (this.interactif) {
          question1 += '<br>' + ajouteChampTexteMathLive(this, 2 * i, 'largeur15 inline') + '$\\leqslant f(x)\\leqslant$ ' + ajouteChampTexteMathLive(this, 2 * i + 1, 'inline largeur25 nospacebefore')
        }
        this.canEnonce += `<br>Encadrer le plus précisément possible $f(x)$ lorsque $x\\in[${x2}\\,;\\,${x4}]$.`
        this.canReponseACompleter = '$\\ldots \\leqslant f(x)\\leqslant \\ldots$'
        if (choix === 1) {
          if (m === y2) {
            correction1 = `Sur $[${x2}\\,;\\,${x4}]$, le minimum de $f$ est $${y2}$ et le maximum est
          $${y3}$. <br>
          Ainsi, pour $x\\in[${x2}\\,;\\,${x4}]$, ${sp(3)} $${miseEnEvidence(y2)}\\leqslant f(x)\\leqslant ${miseEnEvidence(y3)}$.`
            setReponse(this, 2 * i, y2)
            setReponse(this, 2 * i + 1, y3)
          } else {
            correction1 = `Sur $[${x2}\\,;\\,${x4}]$, le minimum de $f$ est $${y4}$ et le maximum est
          $${y3}$. <br>
          Ainsi, pour $x\\in[${x2}\\,;\\,${x4}]$, ${sp(3)} $${miseEnEvidence(y4)}\\leqslant f(x)\\leqslant ${miseEnEvidence(y3)}$.  `
            setReponse(this, 2 * i, y4)
            setReponse(this, 2 * i + 1, y3)
          }
        } else {
          if (m === y2) {
            correction1 = `Sur $[${x2}\\,;\\,${x4}]$, le minimum de $f$ est $${-y3}$ et le maximum est
          $${-y2}$. <br>
          Ainsi, pour $x\\in[${x2}\\,;\\,${x4}]$, ${sp(3)} $${miseEnEvidence(-y3)}\\leqslant f(x)\\leqslant ${miseEnEvidence(-y2)}$. `
            setReponse(this, 2 * i, -y3)
            setReponse(this, 2 * i + 1, -y2)
          } else {
            correction1 = `Sur $[${x2}\\,;\\,${x4}]$, le minimum de $f$ est $${-y3}$ et le maximum est
          $${-y4}$. <br>
          Ainsi, pour $x\\in[${x2}\\,;\\,${x4}]$, ${sp(3)} $${miseEnEvidence(-y3)}\\leqslant f(x)\\leqslant ${miseEnEvidence(-y4)}$.  `
            setReponse(this, 2 * i, -y3)
            setReponse(this, 2 * i + 1, -y4)
          }
        }
      }
      if (this.questionJamaisPosee(i, x1, x2, x3, x4)) {
        this.listeQuestions.push(question1)
        this.listeCorrections.push(correction1)
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
