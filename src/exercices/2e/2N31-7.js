import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint, calculANePlusJamaisUtiliser } from '../../modules/outils.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { rangeMinMax } from '../../lib/outils/nombres'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
export const titre = 'Trouver l\'exposant manquant dans des nombres écrits avec des puissances de 10'
export const dateDePublication = '08/09/2023'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifType = 'qcm'
export const interactifReady = true

/**
 * On donne la notation scientifique d'un nombre et on doit trouver l'exposant manquant de 10 dans le membre de gauche.
 * @author Jean-Claude Lhote (adapté par Eric Elter)
 */
export const uuid = 'f49ff'
export const ref = '2N31-7'
export const refs = {
  'fr-fr': ['2N31-7'],
  'fr-ch': ['10NO2-15']
}
export default function CalculsAvecPuissancesDeDixBis () {
  Exercice.call(this)
  this.sup = 1
  this.nbQuestions = 5

  this.nouvelleVersion = function () {
    this.autoCorrection = []
    if (this.interactif) {
      this.consigne = this.nbQuestions === 1 ? 'Choisir l\'exposant manquant dans l\'égalité suivante.' : 'Choisir l\'exposant manquant dans les égalités suivantes.'
    } else {
      this.consigne = this.nbQuestions === 1 ? 'Trouver l\'exposant manquant dans l\'égalité suivante.' : 'Trouver l\'exposant manquant dans les égalités suivantes.'
    }

    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    for (let i = 0, texte, texteCorr, mantisse1, exp1, decalage, mantisse, exp, scientifiquestring, cpt = 0;
      i < this.nbQuestions && cpt < 50;) {
      switch (this.sup - 1) {
        case 0:
          decalage = randint(-1, 1, 0)
          mantisse = randint(1, 9)
          exp = (!this.sup2)
            ? randint(decalage - 3, decalage + 3, [decalage, 0])
            : choice(rangeMinMax(decalage - 4, decalage + 8), rangeMinMax(decalage - 2, decalage + 2))
          break
        case 1:
          decalage = randint(-2, 2, 0)
          mantisse = calculANePlusJamaisUtiliser(randint(11, 99) / 10)
          exp = (!this.sup2)
            ? randint(decalage - 3, decalage + 3, [decalage, 0])
            : choice(rangeMinMax(decalage - 9, decalage + 9), rangeMinMax(decalage - 3, decalage + 3))
          break
        case 2:
          decalage = randint(-3, 3, 0)
          if (randint(0, 1) === 1) mantisse = calculANePlusJamaisUtiliser(randint(111, 999) / 100)
          else mantisse = calculANePlusJamaisUtiliser((randint(1, 9) * 100 + randint(1, 9)) / 100)
          exp = (!this.sup2)
            ? randint(decalage - 3, decalage + 3, [decalage, 0])
            : choice(rangeMinMax(decalage - 10, decalage + 10), rangeMinMax(decalage - 4, decalage + 4))
          break
/*        case 3:
          decalage = randint(-4, 4, 0)
          if (randint(0, 1) === 1) mantisse = calcul((randint(1, 9) * 1000 + randint(1, 19) * 5) / 1000)
          else mantisse = calcul(randint(1111, 9999) / 1000)
          exp = randint(3, 7, abs(decalage)) * choice([-1, 1])
          break */
      }
      // nombre = calcul(mantisse * 10 ** exp)
      mantisse1 = calculANePlusJamaisUtiliser(mantisse * 10 ** decalage)
      exp1 = exp - decalage

      // decimalstring = `${texNombre(mantisse1)} \\times 10^{${exp1}}`
      scientifiquestring = `${texNombre(mantisse)} \\times 10^{${exp}}`

      texteCorr = `$${scientifiquestring}=${miseEnEvidence(texNombre(mantisse1) + `\\times 10^{${-decalage}}`, 'blue')}\\times  10^{${exp}}=${texNombre(mantisse1)} \\times 10^{${miseEnEvidence(-decalage + '+' + ecritureParentheseSiNegatif(exp), 'blue')}}= ${mantisse1} \\times 10^{${miseEnEvidence(exp1)}}$`
      texte = `$${scientifiquestring}=${texNombre(mantisse1)}\\times 10^{${miseEnEvidence('....', 'black')}}$`
      this.autoCorrection[i] = {}
      this.autoCorrection[i].enonce = `${texte}\n`
      this.autoCorrection[i].propositions = [
        {
          texte: `$${exp1}$`,
          statut: true
        },
        {
          texte: `$${exp1 - 1}$`,
          statut: false
        },
        {
          texte: `$${exp1 + 1}$`,
          statut: false
        },
        {
          texte: `$${-exp1}$`,
          statut: false
        }
      ]
      this.autoCorrection[i].options = {
        ordered: false,
        lastChoice: 5
      }

      if (this.interactif) {
        texte += propositionsQcm(this, i).texte
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, '1 : Facile\n2 : Moyen\n3 : Difficile']
  this.besoinFormulaire2CaseACocher = ['Avec des exposants élevés', false]
}
