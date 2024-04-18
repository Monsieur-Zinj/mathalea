import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import { context } from '../../modules/context'
import { propositionsQcm } from '../../lib/interactif/qcm'

export const titre = 'Compléter une phrase par la définition ou une propriété d\'un parallélogramme'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMono'
export const dateDePublication = '05/04/2021'
export const dateDeModifImportante = '08/05/2022'

/**
 * On doit compléter des propriétés des parallélogrammes
 * @author Rémi Angot
 * Ajout de la possibilité de choisir le nombre de questions par Guillaume Valmont le 08/05/2022
*/
export const uuid = 'af2c2'
export const ref = '5G40-1'
export const refs = {
  'fr-fr': ['5G40-1'],
  'fr-ch': ['9ES2-1']
}
export default function ProprietesDesParallelogrammes () {
  Exercice.call(this)
  this.sup = 3
  this.nbQuestions = 3
  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 2 // Uniquement pour la sortie LaTeX
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    this.consigne = "À l'aide de la définition ou d'une propriété d'un parallélogramme, "
    this.consigne += this.nbQuestions === 1
      ? 'compléter la phrase suivante'
      : 'compléter les phrases suivantes'
    this.consigne += this.interactif || context.isAmc ? ' en choisissant ce qui convient.' : '.'

    const typeQuestionsDisponibles = this.sup === 1 ? [1, 2, 3, 4] : [5, 6, 7, 8, 9]

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      this.introduction = 'Dans cet exercice, on supposera que tous les quadrilatères sont non croisés.'

      switch (listeTypeQuestions[i]) {
        case 1:
          texte = 'Si un quadrilatère est un parallélogramme, alors ses côtés…'
          texteCorr = `Si un quadrilatère est un parallélogramme, alors ses côtés ${texteEnCouleurEtGras('opposés sont parallèles et de même longueur')}.`
          break
        case 2:
          texte = 'Si un quadrilatère est un parallélogramme, alors ses diagonales…'
          texteCorr = `Si un quadrilatère est un parallélogramme, alors ses diagonales ${texteEnCouleurEtGras('se coupent en leur milieu')}.`
          break
        case 3:
          texte = 'Si un quadrilatère est un parallélogramme, alors ses angles…'
          texteCorr = `Si un quadrilatère est un parallélogramme, alors ses angles ${texteEnCouleurEtGras('opposés sont égaux et la somme de deux angles consécutifs est égale à 180°')}.`
          break
        case 4:
          texte = this.interactif || context.isAmc ? 'Si un quadrilatère est un parallélogramme, alors …' : 'Si un quadrilatère est un parallélogramme, alors … symétrie …'
          texteCorr = `Si un quadrilatère est un parallélogramme, alors ${texteEnCouleurEtGras("il a un centre de symétrie qui est le point d'intersection de ses diagonales")}.`
          break
        case 5:
          texte = "Si un quadrilatère a ses diagonales …, alors c'est un parallélogramme."
          texteCorr = `Si un quadrilatère a ses diagonales ${texteEnCouleurEtGras('qui se coupent en leur milieu')}, alors c'est un parallélogramme.`
          break
        case 6:
          texte = "Si un quadrilatère a … parallèles, alors c'est un parallélogramme."
          texteCorr = `Si un quadrilatère a ${texteEnCouleurEtGras('ses côtés opposés')} parallèles, alors c'est un parallélogramme.`
          break
        case 7:
          texte = "Si un quadrilatère a … longueur, alors c'est un parallélogramme."
          texteCorr = `Si un quadrilatère a ${texteEnCouleurEtGras('ses côtés opposés de même')} longueur, alors c'est un parallélogramme.`
          break
        case 8:
          texte = "Si un quadrilatère a deux côtés …, alors c'est un parallélogramme."
          texteCorr = `Si un quadrilatère a deux côtés ${texteEnCouleurEtGras('opposés parallèles et de même longueur')}, alors c'est un parallélogramme.`
          break
        case 9:
          texte = this.interactif || context.isAmc ? "Si un quadrilatère a …, alors c'est un parallélogramme." : "Si un quadrilatère a … angles …, alors c'est un parallélogramme."
          texteCorr = `Si un quadrilatère a ${texteEnCouleurEtGras('ses angles opposés égaux')}, alors c'est un parallélogramme.`
          break
      }
      if (this.interactif || context.isAmc) {
        this.autoCorrection[i] = {}
        this.autoCorrection[i].options = { ordered: false }
        this.autoCorrection[i].enonce = `${texte}\n`
        if (listeTypeQuestions[i] < 5) {
          this.autoCorrection[i].propositions = [
            {
              texte: 'opposés sont parallèles',
              statut: listeTypeQuestions[i] === 1
            },
            {
              texte: 'opposés sont de même longueur',
              statut: listeTypeQuestions[i] === 1
            },
            {
              texte: 'se coupent en leur milieu',
              statut: listeTypeQuestions[i] === 2
            },
            {
              texte: 'opposés sont égaux',
              statut: listeTypeQuestions[i] === 3
            },
            {
              texte: listeTypeQuestions[i] === 4 ? 'il a un centre de symétrie qui est le point d\'intersection de ses diagonales' : ' sont le point d\'intersection de ses diagonales',
              statut: listeTypeQuestions[i] === 4
            }
          ]
        } else {
          this.autoCorrection[i].propositions = [
            {
              texte: 'qui se coupent en leur milieu',
              statut: listeTypeQuestions[i] === 5
            },
            {
              texte: 'ses côtés opposés',
              statut: listeTypeQuestions[i] === 6
            },
            {
              texte: 'ses côtés opposés de même',
              statut: listeTypeQuestions[i] === 7
            },
            {
              texte: 'opposés parallèles et de même longueur',
              statut: listeTypeQuestions[i] === 8
            },
            {
              texte: 'ses angles opposés égaux',
              statut: listeTypeQuestions[i] === 9
            }
          ]
          texte += propositionsQcm(this, i).texte
        }
      }

      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, "1 : Propriétés du parallélogramme (max. 4 questions)\n2 : Propriétés pour montrer qu'un quadrilatère est un parallélogramme (max. 5 questions)\n3 : Mélange (max. 9 questions)"]
}
