import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { labyrinthe } from '../../modules/Labyrinthe.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint, gestionnaireFormulaireTexte } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const dateDePublication = '7/12/2020'
export const dateDeModifImportante = '29/10/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Parcourir un labyrinthe de multiples basé sur les critères de divisibilité'

/**
 * @author Jean-Claude Lhote (remaniée par EE pour la prise en compte du nb de lignes et de colonnes du labyrinthe)
 * Sortir du labyrinthe en utilisant les critères de divisibilité.
 */
export const uuid = 'a3870'
export const ref = '5A11-1'
export const refs = {
  'fr-fr': ['5A11-1'],
  'fr-ch': ['9NO4-11']
}
export default function ExerciceLabyrintheDivisibilite1 () {
  Exercice.call(this)
  this.niveau = '5e'
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = '2-5-10'
  this.sup3 = 1
  this.sup4 = 1
  this.sup2 = this.niveau === 'CM' ? 3 : 4
  // this.consigne=`Trouver la sortie en ne passant que par les cases contenant un nombre divisible par $${parseInt(this.sup)}$.`
  this.nouvelleVersion = function () {
    const tailleChiffre = 0.8

    this.listeCorrections = []
    this.listeQuestions = []
    this.autoCorrection = []
    let texte, texteCorr
    let laby = []
    let monChemin

    const tables = gestionnaireFormulaireTexte({
      min: 2,
      max: 20,
      defaut: choice([2, 5, 10]),
      nbQuestions: this.nbQuestions,
      saisie: this.sup,
      shuffle: false
    })

    for (let q = 0; q < this.nbQuestions;) {
      const nbL = this.sup3 === 1 ? randint(2, 8) : Math.max(2, this.sup3)
      const nbC = this.sup4 === 1 ? randint(3, 11 - nbL) : Math.max(3, this.sup4)
      laby = labyrinthe({ nbLignes: nbL, nbColonnes: nbC, scaleFigure: 0.7 })
      laby.niveau = this.sup2 // Le niveau (de 1 à 6 = mélange) définit le nombre d'étapes
      monChemin = laby.choisitChemin(laby.niveau) // On choisit un chemin
      laby.murs2d = laby.construitMurs(monChemin) // On construit le labyrinthe
      laby.chemin2d = laby.traceChemin(monChemin) // On trace le chemin solution
      texte = `Trouver la sortie en ne passant que par les cases contenant un nombre divisible par ${tables[q]}.<br>`
      // Zone de construction du tableau de nombres : S'ils sont sur monChemin et seulement si, ils doivent vérifier la consigne
      let listeMultiples = []
      const listeNonMultiples = []
      for (let i = 200; i <= 12000; i += randint(1, 100)) {
        listeMultiples.push(tables[q] * i)
      }
      for (let i = 1; i <= nbC * nbL; i++) {
        listeNonMultiples.push(randint(200, 5000) * tables[q] + randint(1, tables[q] - 1))
      }
      listeMultiples = combinaisonListes(listeMultiples, 12)
      // Le tableau de nombre étant fait, on place les objets nombres.
      laby.nombres2d = laby.placeNombres(monChemin, listeMultiples, listeNonMultiples, tailleChiffre)
      const params = { xmin: -4, ymin: 0, xmax: 5 + 3 * nbC, ymax: 2 + 3 * nbL, pixelsParCm: 20, scale: 0.7 }
      texte += mathalea2d(params, laby.murs2d, laby.nombres2d)
      texte += ajouteChampTexteMathLive(this, 2 * q, KeyboardType.clavierNumbers, { texteAvant: 'Indiquer le numéro de la bonne sortie :' })
      handleAnswers(this, 2 * q, { reponse: { value: `${nbL - monChemin[monChemin.length - 1][1]}`, compare: fonctionComparaison } })
      texte += ajouteChampTexteMathLive(this, 2 * q + 1, KeyboardType.clavierNumbers, { texteAvant: '<br>Combien de nombres rencontrés avant la sortie ?' })
      handleAnswers(this, 2 * q + 1, { reponse: { value: `${laby.chemin2d.length - 1}`, compare: fonctionComparaison } })
      texteCorr = `Voici le chemin en couleur ($${miseEnEvidence(laby.chemin2d.length - 1)}$ nombres rencontrés avant la sortie) et la sortie est le numéro $${miseEnEvidence(nbL - monChemin[monChemin.length - 1][1])}$.<br>`
      texteCorr += mathalea2d(params, laby.murs2d, laby.nombres2d, laby.chemin2d)
      if (this.questionJamaisPosee(q, listeMultiples[0], listeNonMultiples[0])) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        q++
      }
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Critères de divisibilité pour chaque question', 'Nombres séparés par des tirets']
  this.besoinFormulaire2Numerique = ['Niveau de rapidité', 6, '1 : Escargot\n2 : Tortue\n3 : Lièvre\n4 : Antilope\n5 : Guépard\n6 : Au hasard']
  this.besoinFormulaire3Numerique = ['Nombre de lignes du labyrinthe (entre 2 et 8 ou bien 1 si vous laissez le hasard décider)', 8]
  this.besoinFormulaire4Numerique = ['Nombre de colonnes du labyrinthe (entre 2 et 8 ou bien 1 si vous laissez le hasard décider)', 8]
} // Fin de l'exercice.
