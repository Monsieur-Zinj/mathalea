import { propositionsQcm } from '../../../lib/interactif/qcm.js'
import { tableauSignesFonction } from '../../../lib/mathFonctions/etudeFonction.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, rienSi1 } from '../../../lib/outils/ecritures'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'

import Exercice from '../../deprecatedExercice.js'

export const titre = 'Dresser le tableau de signes d’un polynôme du second degré'
export const interactifReady = true
export const interactifType = 'qcm'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '07/10/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 */
export const uuid = '131bd'
export const ref = 'can1L11'
export const refs = {
  'fr-fr': ['can1L11'],
  'fr-ch': []
}
export default function TableauSignesSecondDegre () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 1.3
  this.listePackages = ['tkz-tab']
  this.spacing = 1
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    let texte, texteCorr, a, b, c, tableau1, tableau2, tableau3
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      a = randint(1, 9) * choice([-1, 1])// coefficient a
      b = randint(1, 6) * choice([-1, 1])// racine1
      c = randint(1, 9, [b, -b]) * choice([-1, 1])// racine2
      const fonction1 = x => a * (x - b) * (x - c)
      const fonction2 = x => a * (x + b) * (x + c)
      const fonction3 = x => -a * (x - b) * (x - c)
      tableau1 = tableauSignesFonction(fonction1,
        -10,
        10,
        {
          step: 0.1,
          tolerance: 0.001,
          substituts: [
            { antVal: -10, antTex: '-\\infty' },
            { antVal: 10, antTex: '+\\infty' }
          ]
        })
      tableau2 = tableauSignesFonction(fonction2,
        -10,
        10,
        {
          step: 0.1,
          tolerance: 0.001,
          substituts: [
            { antVal: -10, antTex: '-\\infty' },
            { antVal: 10, antTex: '+\\infty' }
          ]
        })
      tableau3 = tableauSignesFonction(fonction3,
        -10,
        10,
        {
          step: 0.1,
          tolerance: 0.001,
          substituts: [
            { antVal: -10, antTex: '-\\infty' },
            { antVal: 10, antTex: '+\\infty' }
          ]
        })
      if (this.interactif) {
        texte = `Quel est le tableau de signes de la fonction $f$ définie sur  $\\mathbb R$ par :
        $f(x)=${rienSi1(a)}(x${ecritureAlgebrique(-b)})(x${ecritureAlgebrique(-c)}) $ ? `

        this.autoCorrection[i] = {
          enonce: texte,
          options: { vertical: true },
          propositions: [
            {
              texte: tableau1,
              statut: true
            },
            {
              texte: tableau2,
              statut: false
            },
            {
              texte: tableau3,
              statut: false
            }
          ]

        }
        texte += propositionsQcm(this, i).texte
      } else {
        texte = `Dresser le tableau de signes de la fonction $f$ définie sur  $\\mathbb R$ par :
        $f(x)=${rienSi1(a)}(x${ecritureAlgebrique(-b)})(x${ecritureAlgebrique(-c)}) $.`
      }

      texteCorr = `La fonction $f$ est une fonction polynôme du scond degré. <br>
      La forme factorisée donnée par l'énoncé permet d'obtenir rapidement ses racines : $${b}$ et $${c}$.<br>
      Un polynôme du second degré (de la forme $ax^2+bx+c$) est du signe de $a$ sauf entre ses racines. <br>
      Ici ${a > 0 ? `$a=${a}>0$` : `$a=${a}<0$`} , donc le tableau de signes de $f$ sur $\\mathbb{R}$  est :  <br>
      ` + tableau1

      if (this.questionJamaisPosee(i, a, b, c)) {
        // Si la question n'a jamais été posée, on la stocke dans la liste des questions
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.canEnonce = texte
        this.canReponseACompleter = ''
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
