import { choice, creerCouples } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint, gestionnaireFormulaireTexte } from '../../modules/outils.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import Decimal from 'decimal.js'

export const amcReady = true
export const interactifReady = true
export const interactifType = 'qcm'
export const amcType = 'qcmMono'

export const titre = 'Utiliser tables de multiplication pour effectuer produits avec décimaux'

/**
 * Multiplier deux nombres décimaux
 * @author Rémi Angot
 * Référence 6C10-3
 */
export const uuid = 'a5c5a'
export const ref = '6C10-3'
export const refs = {
  'fr-fr': ['6C10-3'],
  'fr-ch': ['9NO8-7']
}
export default function ExerciceTablesMultiplicationsEtDecimaux (
  tablesParDefaut = '2-3-4-5-6-7-8-9'
) {
  // Multiplier deux nombres
  Exercice.call(this)
  this.sup = tablesParDefaut
  this.titre = titre
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.tailleDiaporama = 3
  this.nbQuestions = 10

  this.nouvelleVersion = function () {
    this.autoCorrection = []
    /* if (!this.sup) {
      // Si aucune table n'est saisie
      this.sup = '2-3-4-5-6-7-8-9'
    }
    let tables = []
    if (typeof this.sup === 'number') {
      // Si c'est un nombre c'est qu'il y a qu'une seule table
      tables[0] = this.sup
    } else {
      tables = this.sup.split('-') // Sinon on crée un tableau à partir des valeurs séparées par des ;
      for (let i = 0; i < tables.length; i++) {
        tables[i] = contraindreValeur(2, 9, parseInt(tables[i]))
      }
    }
*/
    /*
    if (!this.sup) { // Si aucune liste n'est saisie
      tables[0] = rangeMinMax(2, 9)
    } else {
      if (typeof (this.sup) === 'number') { // Si c'est un nombre c'est que le nombre a été saisi dans la barre d'adresses
        tables = [contraindreValeur(2, 9, this.sup, randint(2, 9))]
      } else {
        tables = this.sup.split('-')// Sinon on créé un tableau à partir des valeurs séparées par des -
        for (let i = 0; i < tables.length; i++) { // on a un tableau avec des strings : ['1', '1', '2']
          tables[i] = contraindreValeur(2, 9, parseInt(tables[i]), 9) // parseInt en fait un tableau d'entiers
        }
      }
    }
*/
    const tables = gestionnaireFormulaireTexte({
      min: 2,
      max: 9,
      defaut: randint(2, 9),
      nbQuestions: this.nbQuestions,
      saisie: this.sup
    })

    const couples = creerCouples(
      tables,
      [2, 3, 4, 5, 6, 7, 8, 9, 10],
      this.nbQuestions
    ) // Liste tous les couples possibles (2,3)≠(3,2)
    for (let i = 0, a, b, k1, k2, couple, texte, texteCorr; i < this.nbQuestions; i++) {
      this.autoCorrection[i] = {}
      a = new Decimal(couples[i][0])
      b = new Decimal(couples[i][1])
      couple = choice([[1, 10], [1, 100], [1, 1000], [10, 100], [10, 1000], [100, 100], [100, 1000]])
      k1 = couple[0]
      k2 = couple[1]
      a = a.div(k1)
      b = b.div(k2)
      if (a.equals(1)) {
        a = new Decimal(1).div(100)
      }
      if (b.equals(1)) {
        b = new Decimal(1).div(10)
      }
      texte =
        '$ ' + texNombre(a) + ' \\times ' + texNombre(b) + ' =  $'
      texteCorr =
        '$ ' +
        texNombre(a) +
        ' \\times ' +
        texNombre(b) +
        ' = ' +
        texNombre(a.times(b)) +
        ' $'
      /**********************************/
      // QCM
      /**********************************/
      this.autoCorrection[i].enonce = `${texte}\n`
      this.autoCorrection[i].propositions = [
        {
          texte: `$${texNombre(a.times(b))}$`,
          statut: true,
          feedback: 'Correct !'
        },
        {
          texte: `$${texNombre(a.times(b).div(10))}$`,
          statut: false,
          feedback: 'Compte le nombre de zéros dans chaque facteur'
        },
        {
          texte: `$${texNombre(a.times(b).times(10))}$`,
          statut: false,
          feedback: 'Compte le nombre de zéros dans chaque facteur'
        },
        {
          texte: `$${texNombre(a.times(b).div(100))}$`,
          statut: false,
          feedback: 'Compte le nombre de zéros dans chaque facteur'
        },
        {
          texte: `$${texNombre(a.times(b).times(100))}$`,
          statut: false,
          feedback: 'Compte le nombre de zéros dans chaque facteur'
        }
      ]
      this.autoCorrection[i].options = {
        ordered: false
      }
      const props = propositionsQcm(this, i)
      if (this.interactif) {
        texte += props.texte
      }
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = [
    'Choix des tables (entre 2 et 9)',
    'Nombres séparés par des tirets'
  ] // Texte, tooltip
}
