import { texMulticols } from '../../lib/format/miseEnPage.js'
import { texParagraphe } from '../outils.js'

/**
 * Utilise liste_questions et liste_corrections pour remplir contenu et contenuCorrection
 *
 * Uniquement en version LaTeX
 * La liste des questions devient une liste HTML ou LaTeX avec html_ligne() ou tex_paragraphe()
 * @param {Exercice} exercice
 * @author Rémi Angot
 */
export function listeQuestionsToContenuSansNumeroEtSansConsigne (exercice) {
  if (document.getElementById('supprimer_reference').checked === true) {
    exercice.contenu = texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
  } else {
    exercice.contenu = `\n\\marginpar{\\footnotesize ${exercice.id}` + texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
  }
  // exercice.contenuCorrection = texConsigne(exercice.consigneCorrection) + texMulticols(texEnumerateSansNumero(exercice.listeCorrections,exercice.spacingCorr),exercice.nbColsCorr)
  exercice.contenuCorrection = texMulticols(texParagraphe(exercice.listeCorrections, exercice.spacingCorr), exercice.nbColsCorr)
}
