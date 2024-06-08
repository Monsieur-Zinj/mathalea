import {
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu
} from '../../modules/outils.js'
import FonctionsAffines from './3F20-1.js'
import FonctionsLineaires from './3F20.js'
import Exercice from '../deprecatedExercice.js'

export const titre = 'Fonctions affines et/ou linéaires'
export const interactifType = 'mathLive'
export const interactifReady = true
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDePublication = '21/05/2023'
export const ref = '3F20-2'
export const refs = {
  'fr-fr': ['3F20-2'],
  'fr-ch': ['10FA5-14', '11FA8-8']
}
export const uuid = '17c65'
/**
 * Questions sur les fonctions affines ou linéaires
 * @author Jean-Claude Lhote
 */
export default function FonctionsAffinesOuLineaires () {
  Exercice.call(this)
  this.lycee = false
  const fonctionsLineaires = new FonctionsLineaires()
  const fonctionsAffines = new FonctionsAffines()
  this.lycee = true // mettre à true dans 2F10-8.js
  this.comment = 'L\'exercice propose de panacher les questions de 3F20 et 3F20-1.'
  this.sup = 1 // coefficient entier relatif
  this.nbQuestions = 8
  this.sup2 = '11'
  this.spacingCorr = 3
  this.sup3 = '9'
  this.sup4 = '3'
  this.besoinFormulaireNumerique = ['Coefficient : ', 3, '1: Coefficient entier\n2: Coefficient rationnel\n3: Mélange']
  this.besoinFormulaire2Texte = ['Type de questions pour fonctions affines', 'Nombres séparés par des tirets\n1: Image par expression\n2: Image par valeurs\n3: Image par graphique\n4: Antécédent par expression\n5: Antécédent par valeurs\n6: Antécédent par graphique\n7: Expression par valeurs\n8: Expression par graphique\n9: Expression par graphique fonctions affines uniquement (formule des accroissements)\n10: Expression par valeurs fonctions affines uniquement (formule des accroissements)\n11: Mélange']
  this.besoinFormulaire3Texte = ['Type de questions pour fonctions linéaires', 'Nombres séparés par des tirets\n1: Image par expression\n2: Image par valeurs\n3: Image par graphique\n4: Antécédent par expression\n5: Antécédent par valeurs\n6: Antécédent par graphique\n7: Expression par valeurs\n8: Expression par graphique\n9: Mélange']

  this.besoinFormulaire4Texte = ['Type de fonctions', 'Nombres séparés par des tirets\n1: Linéaire\n2: Affine\n3: Mélange']
  this.nouvelleVersion = function () {
    fonctionsAffines.interactif = this.interactif
    fonctionsAffines.nbQuestions = this.nbQuestions
    fonctionsAffines.lycee = this.lycee
    fonctionsAffines.sup = this.sup
    fonctionsAffines.sup2 = this.sup2
    fonctionsAffines.numeroExercice = this.numeroExercice // indispensable pour l'interactif
    fonctionsAffines.nouvelleVersion()
    fonctionsLineaires.interactif = this.interactif
    fonctionsLineaires.nbQuestions = this.nbQuestions
    fonctionsLineaires.lycee = this.lycee
    fonctionsLineaires.sup = this.sup
    fonctionsLineaires.sup2 = this.sup3
    fonctionsLineaires.numeroExercice = this.numeroExercice // indispensable pour l'interactif
    fonctionsLineaires.nouvelleVersion()

    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const choixFonction = gestionnaireFormulaireTexte({ saisie: this.sup4, min: 1, max: 2, defaut: 3, melange: 3, listeOfCase: ['linéaire', 'affine'], nbQuestions: this.nbQuestions })
    for (let i = 0; i < this.nbQuestions; i++) {
      if (choixFonction[i] === 'affine') {
        // On récupère tout ce qui fait la question, sa correction et l'interactif...
        this.listeQuestions.push(fonctionsAffines.listeQuestions[i])
        this.listeCorrections.push(fonctionsAffines.listeCorrections[i])
        this.autoCorrection.push(fonctionsAffines.autoCorrection[i])
      } else {
        this.listeQuestions.push(fonctionsLineaires.listeQuestions[i])
        this.listeCorrections.push(fonctionsLineaires.listeCorrections[i])
        this.autoCorrection.push(fonctionsLineaires.autoCorrection[i])
      }
    }
    listeQuestionsToContenu(this)
  }
}
