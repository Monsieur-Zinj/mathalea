import { texMulticols } from '../../lib/outils/miseEnPage.js'
import { context } from '../context.js'
import { htmlLigne, texParagraphe } from '../outils.js'

/**
 * À documenter
 * @param {Exercice} exercice
 */
export function listeDeChosesAImprimer (exercice) {
  if (context.isHtml) {
    exercice.contenu = htmlLigne(exercice.listeQuestions, exercice.spacing)
    exercice.contenuCorrection = ''
  } else {
    // let vspace = ''
    // if (exercice.vspace) {
    //   vspace = `\\vspace{${exercice.vspace} cm}\n`
    // }
    if (document.getElementById('supprimer_reference').checked === true) {
      exercice.contenu = texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
    } else {
      exercice.contenu = `\n\\marginpar{\\footnotesize ${exercice.id}}` + texMulticols(texParagraphe(exercice.listeQuestions, exercice.spacing), exercice.nbCols)
    }
    exercice.contenuCorrection = ''
  }
}
