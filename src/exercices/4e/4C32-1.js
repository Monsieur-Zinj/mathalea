import { choice } from '../../lib/outils/arrayOutils.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint, calcul } from '../../modules/outils.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { rangeMinMax } from '../../lib/outils/nombres.js'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures.js'
export const titre = 'Donner le résultat de nombres écrits avec des puissances de 10 en notation scientifique'
export const dateDeModifImportante = '08/09/2023'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifType = 'qcm'
export const interactifReady = true

/**
 * Un nombre est donné par le produit d'un décimal par une puissance de dix, il faut l'écrire en notation scientifique
 * @author Jean-Claude Lhote
 */
export const uuid = '762fe'
export const ref = '4C32-1'
export default function CalculsAvecPuissancesDeDix () {
  Exercice.call(this)
  this.sup = 1
  this.nbQuestions = 5
  this.classe = 4

  this.nouvelleVersion = function () {
    this.autoCorrection = []
    if (this.interactif) {
      this.consigne = this.nbQuestions === 1 ? 'Choisir la notation scientifique associée au nombre suivant.' : 'Choisir la notation scientifique associée à chacun des nombres suivants.'
    } else {
      this.consigne = this.nbQuestions === 1 ? 'Donner la notation scientifique du nombre suivant.' : 'Donner la notation scientifique des nombres suivants.'
    }
    // let typeDeQuestionsDisponibles
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    for (let i = 0, texte, texteCorr, mantisse1, exp1, decalage, mantisse, exp, decimalstring, scientifiquestring, cpt = 0;
      i < this.nbQuestions && cpt < 50;) {
      switch (this.sup - 1) {
        case 0:
          decalage = randint(-1, 1, 0)
          mantisse = randint(1, 9)
          exp = this.classe === 4
            ? randint(decalage - 3, decalage + 3, [decalage, 0])
            : choice(rangeMinMax(decalage - 4, decalage + 8), rangeMinMax(decalage - 2, decalage + 2))
          break
        case 1:
          decalage = randint(-2, 2, 0)
          mantisse = calcul(randint(11, 99) / 10)
          exp = this.classe === 4
            ? randint(decalage - 3, decalage + 3, [decalage, 0])
            : choice(rangeMinMax(decalage - 9, decalage + 9), rangeMinMax(decalage - 3, decalage + 3))
          break
        case 2:
          decalage = randint(-3, 3, 0)
          if (randint(0, 1) === 1) mantisse = calcul(randint(111, 999) / 100)
          else mantisse = calcul((randint(1, 9) * 100 + randint(1, 9)) / 100)
          exp = this.classe === 4
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
      mantisse1 = calcul(mantisse * 10 ** decalage)
      exp1 = exp - decalage

      decimalstring = `${texNombre(mantisse1)} \\times 10^{${exp1}}`
      scientifiquestring = `${texNombre(mantisse)} \\times 10^{${exp}}`

      texte = `$${decimalstring}$`
      texteCorr = this.classe === 4
        ? `$${decimalstring} = ${texNombre(mantisse1)} \\times ${texNombre(10 ** exp1)} = ${texNombre(mantisse1 * 10 ** exp1)} = ${miseEnEvidence(scientifiquestring)}$`
        : `$${texNombre(mantisse1)} \\times 10^{${exp1}} = ${miseEnEvidence(`${texNombre(mantisse)}\\times 10^{${decalage}}`, 'blue')}\\times  10^{${exp1}} = ${texNombre(mantisse)} \\times 10^{${miseEnEvidence(decalage + '+' + ecritureParentheseSiNegatif(exp1), 'blue')}}=${miseEnEvidence(scientifiquestring)}$`
      this.autoCorrection[i] = {}
      this.autoCorrection[i].enonce = `${texte}\n`
      this.autoCorrection[i].options = {
        ordered: false,
        lastChoice: 5
      }
      this.autoCorrection[i].propositions = [
        {
          texte: `$${scientifiquestring}$`,
          statut: true
        },
        {
          texte: `$${texNombre(mantisse * choice([1, 10, 0.1]))} \\times 10^{${exp - 1}}$`,
          statut: false
        },
        {
          texte: `$${texNombre(mantisse * choice([1, 0.01, 0.1]))} \\times 10^{${exp + 1}}$`,
          statut: false
        },
        {
          texte: `$${texNombre(mantisse * 10)} \\times 10^{${exp + randint(0, 1)}}$`,
          statut: false
        },
        {
          texte: `$${texNombre(mantisse * 0.1)} \\times 10^{${exp + randint(0, 1)}}$`,
          statut: false
        },
        {
          texte: `$${texNombre(mantisse)} \\times 10^{${-exp}}$`,
          statut: false
        }
      ]

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
}
