import { droiteGraduee } from '../../lib/2d/reperes.js'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenuSansNumero } from '../../modules/outils.js'

export const titre = 'Tracer des droites graduées'
export const ref = 'P003'
export const refs = {
  'fr-fr': ['P003'],
  'fr-ch': []
}
export const uuid = 'ad5f5'

/**
 * Pour imprimer des repères vierges pour les élèves.
 * @author Jean-Claude Lhote
 * référence : P003
 * publié le ?/2/2020
 * Réécrit le 14/08/2021 avec mathalea2d
 */
export default function FeuilleDAxesGradues () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 1
  this.nbQuestionsModifiable = true
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 3
  this.sup = 10
  this.consigneModifiable = false
  this.nbQuestions = 4
  // this.nbQuestionsModifiable = false
  this.nbColsModifiable = false
  this.nbColsCorrModifiable = false
  this.spacingModifiable = false
  this.spacingCorrModifiable = false
  this.listePackages = ['tkz-euclide']
  this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    const pas = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 10, defaut: 10, melange: 11, nbQuestions: this.nbQuestions, shuffle: false })
    this.listeQuestions = []
    this.listeCorrections = []
    this.contenu = '' // Liste de questions
    this.contenuCorrection = '' // Liste de questions corrigées

    for (let i = 0, texte; i < this.nbQuestions; i++) {
      texte = mathalea2d({ xmin: -0.5, ymin: -1, xmax: 20, ymax: 1 },
        droiteGraduee({
          Unite: 4,
          Min: 0,
          Max: 4.7,
          x: 0,
          y: 0,
          thickSecDist: 1 / pas[i],
          thickSec: true,
          labelsPrincipaux: false,
          thickDistance: 1
        }))
      this.listeQuestions.push(texte)
    }
    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireTexte = ['Nombres de parts', '1: unité\n2: demis\n3: tiers\n4: quarts\n5: cinquièmes\n6: sixièmes\n7: septièmes\n8: huitièmes\n9: neuvièmes\n10: dixièmes\n11: mélange']
}
