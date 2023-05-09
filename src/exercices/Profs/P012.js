import Exercice from '../Exercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'

import { fraction } from '../../modules/fractions.js'
import {
  combinaisonListesSansChangerOrdre,
  contraindreValeur,
  gestionnaireFormulaireTexte
} from '../../modules/outils.js'

export const titre = 'Faire des camemberts pour travailler les fractions'

/**
 * Fonction permettant aux enseignants de proposer rapidement des diques partagés en parts
 * ref P012
 * @author Jean-Claude Lhote
 */
export default function Camemberts () {
  Exercice.call(this)
  this.nb_cols = 1
  this.nbQuestions = 3
  this.nb_questions_modifiable = false
  this.sup = '2-3-4-5' // nombre de parts
  this.sup2 = '5' // nombre de disques par ligne
  this.titre = titre

  this.nouvelleVersion = function () {
    if (this.sup === '') {
      this.sup = '2-3-4-5'
    }
    const nbParts = gestionnaireFormulaireTexte({ saisie: this.sup, min: 2, max: 12, defaut: 6, nbQuestions: this.nbQuestions })
    const nbDisques = gestionnaireFormulaireTexte({ saisie: this.sup2, min: 1, max: 5, defaut: 2, nbQuestions: this.nbQuestions })
    this.contenu = ''

    const secteurs = combinaisonListesSansChangerOrdre(nbParts, this.nbQuestions)
    const unites = combinaisonListesSansChangerOrdre(nbDisques, this.nbQuestions)
    let f
    const fenetre = { xmin: -2.5, xmax: 35, ymin: -2.5, ymax: 2.5, pixelsParCm: 20, scale: 0.5 }
    for (let i = 0; i < this.nbQuestions; i++) {
      f = fraction(parseInt(secteurs[i]) * parseInt(unites[i]), parseInt(secteurs[i])).representation(0, 0, 2, 0, 'gateau', 'white')
      this.contenu += mathalea2d(fenetre, f)
      if (context.isHtml) {
        this.contenu += '<br>'
      } else {
        this.contenu += '\\\\'
      }
    }
  }
  this.besoinFormulaireTexte = ['Nombre de parts séparés par des tirets (de 2 à 12)']
  this.besoinFormulaire2Texte = ['Nombre de disques par ligne séparés par des tirets (de 1 à 5)']
}
