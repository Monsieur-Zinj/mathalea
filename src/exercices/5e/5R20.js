import { choice } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureNombreRelatif, ecritureNombreRelatifc } from '../../lib/outils/ecritures'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { context } from '../../modules/context.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { numberCompare } from '../../lib/interactif/comparisonFunctions'

export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = ['qcm', 'mathLive']

export const titre = 'Addition de deux entiers relatifs'

/**
 * Additionner deux relatifs inférieurs à la valeur maximale en paramètre qui est par défaut à 20.
 *
 * Paramètre supplémentaire ; utilisation des écritures simplifiées
 * @author Rémi Angot
 * 5R20
 */
export const uuid = 'cbc26'
export const refs = {
  'fr-fr': ['5R20'],
  'fr-ch': ['9NO9-6']
}
export default function ExerciceAdditionsRelatifs (max = 20) {
  Exercice.call(this)
  this.sup = max
  this.sup2 = false // écriture simplifiée
  this.consigne = 'Calculer.'
  this.spacing = 0.5
  this.modeQcm = false
  this.sup3 = false
  this.nbCols = 3
  this.nbColsCorr = 3

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.interactifType = this.sup3 ? 'qcm' : 'mathLive'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    for (let i = 0, a, b, k, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) { // On limite le nombre d'essais pour chercher des valeurs nouvelles
      a = randint(1, this.sup)
      b = randint(1, this.sup)
      k = choice([[-1, -1], [-1, 1], [1, -1]]) // Les deux nombres relatifs ne peuvent pas être tous les deux positifs
      a = a * k[0]
      b = b * k[1]
      if (this.sup2) {
        texte = `$ ${texNombre(a)}${ecritureAlgebrique(b)} =$`
        texteCorr = `$ ${a}${ecritureAlgebrique(b)} = ${a + b} $`
      } else {
        texte = '$ ' + ecritureNombreRelatif(a) + ' + ' + ecritureNombreRelatif(b) + ' =$'
        texteCorr = '$ ' + ecritureNombreRelatifc(a) + ' + ' + ecritureNombreRelatifc(b) + ' = ' + ecritureNombreRelatifc(a + b) + ' $'
      }
      this.autoCorrection[i] = {}
      this.autoCorrection[i].options = {}
      this.autoCorrection[i].enonce = `${texte}\n`
      this.autoCorrection[i].propositions = [
        {
          texte: `$${a + b}$`,
          statut: true
        },
        {
          texte: `$${a - b}$`,
          statut: false
        },
        {
          texte: `$${-a + b}$`,
          statut: false
        },
        {
          texte: `$${-a - b}$`,
          statut: false
        }
      ]
      if (this.sup3) {
        const qcm = propositionsQcm(this, i)
        texte += qcm.texte
        if (!this.interactif) {
          texteCorr += qcm.texteCorr
        }
      } else {
        texte += ajouteChampTexteMathLive(this, i)
        texte += ajouteFeedback(this, i)
        handleAnswers(this, i, { reponse: { value: (a + b).toString(), compare: numberCompare } })
      }
      if (this.listeQuestions.indexOf(texte) === -1) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Valeur maximale', 99999]
  this.besoinFormulaire2CaseACocher = ['Avec des écritures simplifiées']
  if (context.isHtml) this.besoinFormulaire3CaseACocher = ['QCM']
}
