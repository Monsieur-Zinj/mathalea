import { choice } from '../../../lib/outils/arrayOutils'
import { choisitLettresDifferentes } from '../../../lib/outils/aleatoires'
import { sp } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import Decimal from 'decimal.js'
import { Arbre } from '../../../modules/arbres.js'

import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive.js'

import { setReponse } from '../../../lib/interactif/gestionInteractif.ts'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Lire une probabilité  à partir d’un arbre'
export const dateDePublication = '03/07/2022'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * On donne un arbre de probabilité et lit une probabilité sur l'arbre
 * @author Gilles Mora

 */
export const uuid = '32394'
export const ref = 'can1P02'
export const refs = {
  'fr-fr': ['can1P02'],
  'fr-ch': []
}
export default function LectureProbabilite () {
  Exercice.call(this)
  this.sup = true
  this.keyboard = ['numbers', 'fullOperations', 'variables', 'trigo', 'advanced']
  this.consigne = ''
  this.nbQuestions = 1
  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 1 // Uniquement pour la sortie LaTeX
  // this.sup = 1; // Niveau de difficulté
  this.tailleDiaporama = 2 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.video = '' // Id YouTube ou url

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    for (let i = 0, cpt = 0, pA, pB, pAC, pBC, omega, texte, texteCorr, choix, nom1, nom2, objets; i < this.nbQuestions && cpt < 50;) {
      objets = []
      // On choisit les probas de l'arbre
      nom1 = choisitLettresDifferentes(1, ['D', 'P'])[0]
      nom2 = choisitLettresDifferentes(1, nom1 + ['D', 'P'])[0]
      pA = (new Decimal(randint(1, 9, 5))).div(10)

      pB = new Decimal(1 - pA)
      pAC = (new Decimal(randint(1, 9) * 10 + randint(1, 9))).div(100)
      pBC = (new Decimal(randint(1, 9) * 10 + randint(1, 9))).div(100)
      while (pAC === pBC || pAC === 1 - pBC) {
        pA = (new Decimal(randint(1, 9, 5))).div(10)

        pB = new Decimal(1 - pA)
        pAC = (new Decimal(randint(1, 9) * 10 + randint(1, 9))).div(100)
        pBC = (new Decimal(randint(1, 9) * 10 + randint(1, 9))).div(100)
      }
      choix = choice([pA, pB, pAC, 1 - pAC, pBC, 1 - pBC])

      // On définit l'arbre complet
      omega = new Arbre({
        racine: true,
        rationnel: false,
        nom: '',
        proba: 1,
        visible: false,
        alter: '',
        enfants: [
          new Arbre(
            {
              rationnel: false,
              nom: `${nom1}`,
              proba: pA,
              enfants: [new Arbre(
                {
                  rationnel: false,
                  nom: `${nom2}`,
                  proba: new Decimal(pAC)
                }),
              new Arbre(
                {
                  rationnel: false,
                  nom: `\\overline{${nom2}}`,
                  proba: new Decimal(1 - pAC)
                })
              ]
            }),
          new Arbre({
            rationnel: false,
            nom: `\\overline{${nom1}}`,
            proba: new Decimal(1 - pA),
            enfants: [new Arbre({
              rationnel: false,
              nom: `${nom2}`,
              proba: new Decimal(pBC)
            }),
            new Arbre({
              rationnel: false,
              nom: `\\overline{${nom2}}`,
              proba: new Decimal(1 - pBC)
            })
            ]
          })
        ]
      })

      omega.setTailles() // On calcule les tailles des arbres.
      objets = omega.represente(0, 7, 0, 1.5, true, 1) // On crée l'arbre complet echelle 1.4 feuilles verticales sens gauche-droite
      texte = 'On donne l\'arbre de probabilités :<br><br>'
      texte += mathalea2d({ xmin: -0.1, xmax: 14, ymin: 0, ymax: 7, style: 'inline', scale: 0.5 }, ...objets)
      texte += '<br>Compléter avec la notation qui convient : '
      if (this.interactif) {
        texte += ajouteChampTexteMathLive(this, i, 'inline largeur25 ' + KeyboardType.clavierProbabilite)
      } else {
        texte += `${sp(7)}$\\ldots\\ldots $`
      }
      texte += ` $= ${texNombre(choix, 2)}$`
      texteCorr = `Les probabilités conditionnelles se lisent sur la deuxième partie de l'arbre.<br>
            `

      if (choix === pA) {
        texteCorr += `$${texNombre(pA, 2)}$ n'est pas une probabilité conditionnelle, 
        $${miseEnEvidence(`P(${nom1})=${texNombre(pA, 2)}`)}$.`
        setReponse(this, i, [`p(${nom1})`, `P(${nom1})`])
      }
      if (choix === pB) {
        texteCorr += `$${texNombre(pA, 2)}$ n'est pas une probabilité conditionnelle, 
        $${miseEnEvidence(`P(\\overline{${nom1}})=${texNombre(pB, 2)}`)}$.`
        setReponse(this, i, [`p(\\overline{${nom1}})`, `P(\\overline{${nom1}})`])
      }
      if (choix === pAC) {
        texteCorr += `$${texNombre(pAC, 2)}$ est une probabilité conditionnelle, 
        $${miseEnEvidence(`P_{${nom1}}(${nom2})=${texNombre(pAC, 2)}`)}$.`
        setReponse(this, i, [`p_${nom1}({${nom2}})`, `P_${nom1}({${nom2}})`]) // Testé et Correct
      }
      if (choix === 1 - pAC) {
        texteCorr += `$${texNombre(1 - pAC, 2)}$ est une probabilité conditionnelle, 
        $${miseEnEvidence(`P_{${nom1}}(\\overline{${nom2}})=${texNombre(1 - pAC, 2)}`)}$.`
        setReponse(this, i, [`p_${nom1}({\\overline{${nom2}}})`, `P_${nom1}({\\overline{${nom2}}})`, `p_${nom1}(\\overline{{${nom2}}})`, `P_${nom1}(\\overline{{${nom2}}})`]) // Testé et Correct
      }
      if (choix === pBC) {
        texteCorr += `$${texNombre(pBC, 2)}$ est une probabilité conditionnelle, 
        $${miseEnEvidence(`P_{\\overline{${nom1}}}(${nom2})=${texNombre(pBC, 2)}`)}$.`
        setReponse(this, i, [`p_{\\overline{${nom1}}}({${nom2}})`, `P_{\\overline{${nom1}}}({${nom2}})`, `p\\overline{_${nom1}}({${nom2}})`, `P\\overline{_${nom1}}({${nom2}})`]) // Testé et Correct
      }
      if (choix === 1 - pBC) {
        texteCorr += `$${texNombre(1 - pBC, 2)}$ est une probabilité conditionnelle, 
        $${miseEnEvidence(`P_{\\overline{${nom1}}}(\\overline{${nom2}})=${texNombre(1 - pBC, 2)}`)}$.`
        setReponse(this, i, [
                    `p_{\\overline{${nom1}}}({\\overline{${nom2}}})`, `P_{\\overline{${nom1}}}({\\overline{${nom2}}})`,
                    `p\\overline{_${nom1}}(\\overline{{${nom2}}})`, `P\\overline{_${nom1}}(\\overline{{${nom2}}})`,
                    `p_{\\overline{${nom1}}}(\\overline{{${nom2}}})`, `P_{\\overline{${nom1}}}(\\overline{{${nom2}}})`,
                    `p\\overline{_${nom1}}({\\overline{${nom2}}})`, `P\\overline{_${nom1}}({\\overline{${nom2}}})`])
      }
      this.canEnonce = `On donne l'arbre de probabilités :<br>
      
      `
      this.canEnonce += mathalea2d({
        xmin: -0.1,
        xmax: 14,
        ymin: 0,
        ymax: 7,
        style: 'inline',
        scale: 0.5
      }, ...objets)
      this.canReponseACompleter = `Compléter avec la notation qui convient.<br>

      $\\ldots= ${texNombre(choix, 2)}$`
      if (this.questionJamaisPosee(i, pA, pAC, pBC)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
