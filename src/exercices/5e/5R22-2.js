import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureNombreRelatif } from '../../lib/outils/ecritures.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { context } from '../../modules/context.js'
import { sp } from '../../lib/outils/outilString.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

export const titre = 'Écrire sous la forme d\'une expression algébrique sans parenthèses puis calculer'

/**
* Simplifier l'écriture d'une somme de 2 relatifs et calculer
*
* On peut paramétrer les distances à zéro qui sont par défaut inférieures à 20
* @author Rémi Angot
* Rendu les différentes situations équiprobables le 16/10/2021 par Guillaume Valmont
*/
export const uuid = '070b4'
export const ref = '5R22-2'
export default function ExerciceSimplificationSommeAlgebrique (max = 20) {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = max
  this.consigne = 'Écrire sous la forme d\'une expression algébrique sans parenthèses puis calculer.'
  this.nbCols = 3
  this.nbColsCorr = 2
  this.nbQuestions = 9 // pour équilibrer les colonnes

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let liste = [[-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1]]
    liste = combinaisonListes(liste, this.nbQuestions)
    for (let i = 0, a, b, s, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) { // On limite le nombre d'essais pour chercher des valeurs nouvelles
      a = randint(1, this.sup) * liste[i][0]
      b = randint(1, this.sup) * liste[i][1]
      s = liste[i][2] // + ou -
      texte = context.isAmc ? 'Calculer : ' : ''
      if (s === 1) {
        texte += '$ ' + ecritureNombreRelatif(a) + ' + ' + ecritureNombreRelatif(b) + '$'
        texteCorr = '$ ' + ecritureNombreRelatif(a) + ' + ' + ecritureNombreRelatif(b) + ' = ' + a + ecritureAlgebrique(s * b) + ' = ' + miseEnEvidence(a + b) + ' $'
        setReponse(this, i, a + b)
      } else {
        texte += '$ ' + ecritureNombreRelatif(a) + ' - ' + ecritureNombreRelatif(b) + '$'
        texteCorr = '$ ' + ecritureNombreRelatif(a) + ' - ' + ecritureNombreRelatif(b) + ' = ' + a + ecritureAlgebrique(s * b) + ' = ' + miseEnEvidence(a - b) + ' $'
        setReponse(this, i, a - b)
      }
      texte += ajouteChampTexteMathLive(this, i, 'inline nospacebefore largeur01', { texteAvant: `$${sp()}=$` })
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Valeur maximale', 99999]
}
