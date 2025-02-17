import { choice } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureNombreRelatif, ecritureNombreRelatifc, ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { sp } from '../../lib/outils/outilString.js'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = 'qcm'

export const titre = 'Addition à trou de deux entiers relatifs'

/**
* Compléter une addition à trou entre 2 nombres relatifs.
*
* * On peut paramétrer la distance à zéro maximale des deux termes (par défaut égale à 20)
* * On peut choisir d'avoir une écriture simplifiée  (par défaut ce n'est pas le cas)
* @author Rémi Angot
* 5R20-2
*/
export const uuid = 'ce842'
export const ref = '5R20-2'
export const refs = {
  'fr-fr': ['5R20-2'],
  'fr-ch': ['9NO9-7']
}
export default function ExerciceAdditionsRelatifsATrou (max = 20) {
  Exercice.call(this)
  this.sup = max
  this.sup2 = false // écriture simplifiée
  this.titre = titre
  this.amcReady = amcReady
  this.amcType = amcType
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.consigne = 'Compléter :'
  this.spacing = 0.5
  this.nbCols = 3
  this.nbColsCorr = 3

  this.nouvelleVersion = function (numeroExercice) {
    this.sup = parseInt(this.sup)
    this.numeroExercice = numeroExercice
    for (let i = 0, a, b, k, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) { // On limite le nombre d'essais pour chercher des valeurs nouvelles
      a = randint(1, this.sup)
      b = randint(1, this.sup)
      k = choice([[-1, -1], [-1, 1], [1, -1]]) // Les deux nombres relatifs ne peuvent pas être tous les deux positifs
      a = a * k[0]
      b = b * k[1]
      let termes
      const rang1 = randint(0, 1)
      const rang2 = 1 - rang1
      if (this.sup2) {
        termes = [rang1 === 0 ? a : ecritureAlgebrique(a), (rang2 === 1 ? '+' : '') + '\\ldots\\ldots\\ldots', rang1 === 0 ? a : ecritureAlgebrique(a), rang2 === 1 ? '+' + miseEnEvidence(ecritureParentheseSiNegatif(b)) : miseEnEvidence(b)]
        texte = '$ ' + termes[rang1] + termes[rang2] + ' = ' + (a + b) + ' $'
        texteCorr = '$ ' + termes[rang1 + 2] + termes[rang2 + 2] + ' = ' + (a + b) + ' $'
        if (rang2 === 1 && b < 0) texteCorr += '<br>$ ' + termes[rang1 + 2] + sp(1) + miseEnEvidence(b) + ' = ' + (a + b) + ' $'
      } else {
        termes = [ecritureNombreRelatif(a), '\\ldots\\ldots\\ldots', ecritureNombreRelatifc(a), ecritureNombreRelatifc(b)]
        texte = '$ ' + termes[rang1] + ' + ' + termes[rang2] + ' = ' + ecritureNombreRelatif(a + b) + ' $'
        texteCorr = '$ ' + termes[rang1 + 2] + ' + ' + termes[rang2 + 2] + ' = ' + ecritureNombreRelatifc(a + b) + ' $'
      }
      this.autoCorrection[i] = {}
      this.autoCorrection[i].enonce = `${texte}\n`
      this.autoCorrection[i].propositions = [
        {
          texte: `$${b}$`,
          statut: true
        },
        {
          texte: `$${a + b + a}$`,
          statut: false
        },
        {
          texte: `$${-2 * a - b}$`,
          statut: false
        },
        {
          texte: `$${-b}$`,
          statut: false
        }
      ]
      const props = propositionsQcm(this, i)
      if (this.interactif) {
        texte += props.texte
      }
      if (this.questionJamaisPosee(i, a, b)) { // Si la question n'a jamais été posée, on en créé une autre
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
}
