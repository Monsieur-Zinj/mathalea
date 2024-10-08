import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique } from '../../lib/outils/ecritures'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { context } from '../../modules/context.js'

export const titre = 'Additionner deux entiers relatifs dans un tableau à double entrée'
export const amcReady = true
export const amcType = 'AMCOpen'

/**
* Additionner deux entiers relatifs dans un tableau à double entrée
* @author Rémi Angot
*/
export const uuid = '41254'
export const ref = '5R20-5'
export const refs = {
  'fr-fr': ['5R20-5'],
  'fr-ch': ['9NO9-10']
}
export default function ExerciceTableauAdditionsRelatifs () {
  Exercice.call(this)
  this.consigne = 'Calculer.'
  this.spacing = 1
  this.nbQuestions = 1
  this.nbQuestionsModifiable = false

  this.nouvelleVersion = function () {
    const listeSignes1 = combinaisonListes([-1, 1], 4)
    let a1 = randint(2, 9)
    let a2 = randint(2, 9, a1)
    let a3 = randint(2, 9, [a1, a2])
    let a4 = randint(2, 9, [a1, a2, a3])
    let b1 = randint(2, 9)
    let b2 = randint(2, 9, b1)
    let b3 = randint(2, 9, [b1, b2])
    let b4 = randint(2, 9, [b1, b2, b3])
    a1 *= listeSignes1[0]
    a2 *= listeSignes1[1]
    a3 *= listeSignes1[2]
    a4 *= listeSignes1[3]
    b1 *= listeSignes1[0]
    b2 *= listeSignes1[1]
    b3 *= listeSignes1[2]
    b4 *= listeSignes1[3]

    const texte = `$\\def\\arraystretch{1.5}\\begin{array}{|c|c|c|c|c|}
    \\hline
    + & ${ecritureAlgebrique(a1)} & ${ecritureAlgebrique(a2)} & ${ecritureAlgebrique(a3)} & ${ecritureAlgebrique(a4)} \\\\
    \\hline
    ${ecritureAlgebrique(b1)} &  &  & &  \\\\
    \\hline
    ${ecritureAlgebrique(b2)} & & & & \\\\
    \\hline
    ${ecritureAlgebrique(b3)} & & & & \\\\
    \\hline
    ${ecritureAlgebrique(b4)} & & & & \\\\
    \\hline
    \\end{array}$`

    const texteCorr = `$\\def\\arraystretch{1.5}\\begin{array}{|c|c|c|c|c|}
    \\hline
    + & ${ecritureAlgebrique(a1)} & ${ecritureAlgebrique(a2)} & ${ecritureAlgebrique(a3)} & ${ecritureAlgebrique(a4)} \\\\
    \\hline
    ${ecritureAlgebrique(b1)} & ${ecritureAlgebrique(a1 + b1)} & ${ecritureAlgebrique(a2 + b1)} & ${ecritureAlgebrique(a3 + b1)} & ${ecritureAlgebrique(a4 + b1)} \\\\
    \\hline
    ${ecritureAlgebrique(b2)} & ${ecritureAlgebrique(a1 + b2)} & ${ecritureAlgebrique(a2 + b2)} & ${ecritureAlgebrique(a3 + b2)} & ${ecritureAlgebrique(a4 + b2)} \\\\
    \\hline
    ${ecritureAlgebrique(b3)} & ${ecritureAlgebrique(a1 + b3)} & ${ecritureAlgebrique(a2 + b3)} & ${ecritureAlgebrique(a3 + b3)} & ${ecritureAlgebrique(a4 + b3)} \\\\
    \\hline
    ${ecritureAlgebrique(b4)} & ${ecritureAlgebrique(a1 + b4)} & ${ecritureAlgebrique(a2 + b4)} & ${ecritureAlgebrique(a3 + b4)} & ${ecritureAlgebrique(a4 + b4)} \\\\
    \\hline
\\end{array}$`
    this.listeQuestions.push(texte)
    this.listeCorrections.push(texteCorr)

    if (context.isAmc) {
      this.autoCorrection[0] = {
        enonce: this.question,
        propositions: [
          {
            texte: '',
            statut: 1, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
            sanscadre: true // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
          }
        ]
      }
    }
    listeQuestionsToContenu(this)
  }
}
