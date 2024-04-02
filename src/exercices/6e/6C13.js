import { numAlpha } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import {
  listeQuestionsToContenuSansNumero,
  randint,
  gestionnaireFormulaireTexte
} from '../../modules/outils.js'
import choisirExpressionNumerique from '../5e/_choisirExpressionNumerique.js'
export const titre = 'Traduire des phrases en calculs et réciproquement'
export const dateDeModifImportante = '08/05/2023'
/**
 * Mettre en relation un calcul, une traduction en français, une expression, un résultat, pour les décliner dans différents exercices.
 * Exercice sur le vocabulaire : somme,différence, produit, quotient...
 * @author Jean-Claude Lhote
 * Référence 6C13
 * Relecture : Novembre 2021 par EE
 */
export const uuid = 'ed0ea'
export const ref = '6C13'
export const refs = {
  'fr-fr': ['6C13'],
  'fr-ch': ['9FA2-1']
}
export default function VocabulaireEtOperations () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = ''
  this.nbQuestions = 5
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = 4
  this.sup2 = false
  this.spacing = 2
  this.listeAvecNumerotation = false

  this.nouvelleVersion = function () {
    let decimal
    let expf, expn, expc, resultats
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, max: 3, defaut: 4, melange: 4, nbQuestions: this.nbQuestions })

    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    if (this.sup2) decimal = 10 ** randint(1, 2)
    else decimal = 1

    for (
      let i = 0, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;

    ) {
      resultats = choisirExpressionNumerique(1, decimal)
      expf = resultats[0]
      expn = resultats[1]
      expc = resultats[2]
      texte = ''
      texteCorr = ''
      switch (listeTypeDeQuestions[i]) {
        case 1:
          texte +=
            numAlpha(i) +
            'Traduire la phrase par un calcul (il n\'est pas demandé d\'effectuer ce calcul) : '
          expf = 'l' + expf.substring(1)
          texte += `${expf}.`
          expf = 'L' + expf.substring(1)
          texteCorr += numAlpha(i) + `${expf} s'écrit ${expn}.`
          break
        case 2:
          if (expn.indexOf('ou') > 0) { expn = expn.substring(0, expn.indexOf('ou')) } // on supprime la deuxième expression fractionnaire
          texte +=
            numAlpha(i) + 'Traduire le calcul par une phrase en français : '
          texte += `${expn}.`
          expf = 'l' + expf.substring(1)
          texteCorr += numAlpha(i) + `${expn} est ${expf}.`
          break
        case 3:
          texte +=
            numAlpha(i) +
            'Traduire la phrase par un calcul et effectuer ce calcul : '
          expf = 'l' + expf.substring(1)
          texte += `${expf}.`
          expf = 'L' + expf.substring(1)
          texteCorr += numAlpha(i) + `${expf} s'écrit ${expn}.<br>`
          texteCorr += `${expc}`
          break
      }
      texte += this.nbQuestions - 1 === i ? '<br>' : ''
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireTexte = [
    'Type de questions (nombres séparés par des tirets)',
    '1 : Phrase -> Calcul\n2 : Calcul -> Phrase\n3 : Phrase -> Calcul + résultat\n4 : Mélange'
  ]
  this.besoinFormulaire2CaseACocher = ['Décimaux', false]
}
