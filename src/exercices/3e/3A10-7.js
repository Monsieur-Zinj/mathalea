import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { labyrinthe } from '../../modules/Labyrinthe.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { orangeMathalea } from 'apigeom/src/elements/defaultValues'

export const dateDePublication = '12/10/2022'
export const dateDeModifImportante = '29/10/2024'
export const titre = 'Explorer un labyrinthe de nombres premiers'
export const interactifReady = true
export const interactifType = 'mathLive'

/** Explorer un labyrinthe de nombres premiers
 * @author Eric Elter // Sur la base d'autres labyrinthes déjà créés
 */
export const uuid = '9552d'
export const ref = '3A10-7'
export const refs = {
  'fr-fr': ['3A10-7'],
  'fr-ch': ['9NO4-15']
}
export default function ExerciceLabyrinthePremiers3e () {
  Exercice.call(this)
  this.nbQuestions = 3
  this.nbCols = 1
  this.nbColsCorr = 1
  this.pasDeVersionLatex = false
  this.pas_de_version_HMTL = false
  this.sup = 3
  this.sup2 = 6
  this.sup3 = 1
  this.sup4 = 1

  this.nouvelleVersion = function () {
    const tailleChiffre = 1.5
    let nbPremiers = []
    let nbMax
    switch (this.sup) {
      case 3 :
        nbPremiers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199]
        nbMax = 199
        break
      case 2 :
        nbPremiers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
        nbMax = 99
        break
      case 1 :
        nbPremiers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
        nbMax = 29
        break
    }
    this.listeCorrections = []
    this.listeQuestions = []
    this.autoCorrection = []
    let texte, texteCorr
    let laby = []
    let monChemin

    for (let q = 0; q < this.nbQuestions;) {
      const nbL = this.sup3 === 1 ? randint(2, 8) : Math.max(2, this.sup3)
      const nbC = this.sup4 === 1 ? randint(3, 11 - nbL) : Math.max(3, this.sup4)
      laby = labyrinthe({ nbLignes: nbL, nbColonnes: nbC })
      laby.niveau = this.sup2
      monChemin = laby.choisitChemin(laby.niveau) // On choisit un chemin
      laby.murs2d = laby.construitMurs(monChemin) // On construit le labyrinthe
      laby.chemin2d = laby.traceChemin(monChemin, orangeMathalea) // On trace le chemin solution

      texte = 'Trouver la sortie en ne passant que par les cases contenant un nombre premier.<br>'
      texteCorr = `Voici le chemin en couleur ($${miseEnEvidence(laby.chemin2d.length - 1)}$ nombres rencontrés avant la sortie) et la sortie est le numéro $${miseEnEvidence(nbL - monChemin[monChemin.length - 1][1])}$.<br>`
      // Zone de construction du tableau de nombres : S'ils sont sur monChemin et seulement si, ils doivent vérifier la consigne

      const bonnesReponses = combinaisonListes(nbPremiers, nbC * nbL)
      let mauvaisesReponses = Array.from({ length: nbMax - 1 }, (_, i) => i + 2).filter((number) => !nbPremiers.includes(number))
      mauvaisesReponses = combinaisonListes(mauvaisesReponses, nbC * nbL)
      // Le tableau de nombre étant fait, on place les objets nombres.
      laby.nombres2d = laby.placeNombres(monChemin, bonnesReponses, mauvaisesReponses, tailleChiffre)
      const params = { xmin: -4, ymin: 0, xmax: 5 + 3 * nbC, ymax: 2 + 3 * nbL, pixelsParCm: 20, scale: 0.7 }
      texte += mathalea2d(params, laby.murs2d, laby.nombres2d)
      texte += ajouteChampTexteMathLive(this, 2 * q, KeyboardType.clavierNumbers, { texteAvant: 'Indiquer le numéro de la bonne sortie :' })
      handleAnswers(this, 2 * q, { reponse: { value: `${nbL - monChemin[monChemin.length - 1][1]}`, compare: fonctionComparaison } })
      texte += ajouteChampTexteMathLive(this, 2 * q + 1, KeyboardType.clavierNumbers, { texteAvant: '<br>Combien de nombres rencontrés avant la sortie ?' })
      handleAnswers(this, 2 * q + 1, { reponse: { value: `${laby.chemin2d.length - 1}`, compare: fonctionComparaison } })
      texteCorr += mathalea2d(params, laby.murs2d, laby.nombres2d, laby.chemin2d)

      if (this.questionJamaisPosee(q, bonnesReponses[0], mauvaisesReponses[0])) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        q++
      }
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Liste des nombres premiers ', 3, '1 : Inférieurs à 30\n2 : Inférieurs à 100\n3 : Inférieurs à 200']
  this.besoinFormulaire2Numerique = ['Niveau de rapidité', 6, '1 : Escargot\n2 : Tortue\n3 : Lièvre\n4 : Antilope\n5 : Guépard\n6 : Au hasard']
  this.besoinFormulaire3Numerique = ['Nombre de lignes du labyrinthe (entre 2 et 8 ou bien 1 si vous laissez le hasard décider)', 8]
  this.besoinFormulaire4Numerique = ['Nombre de colonnes du labyrinthe (entre 2 et 8 ou bien 1 si vous laissez le hasard décider)', 8]
} // Fin de l'exercice.
