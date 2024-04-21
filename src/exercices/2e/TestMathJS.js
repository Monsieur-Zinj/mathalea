import { calculer } from '../modules/outilsMathjs'

// Ensemble des paramètres de l'exercice
export const uuid = 
export const ref = 'TestMathJS'
// Construction de l'exercice
exo = calculer('(5*x-3)^2', { name: 'A' })
exo.texte = `Développer puis réduire l'expression suivante : $${exercice.name}=${exercice.printExpression}$`
exo.texteCorr = this.correctionDetaillee ? exercice.texteCorr : `$${exercice.name}=${exercice.printResult}$`

// Placer l'énoncé et la correction pour le traitement par Mathalea
this.listeQuestions.push(exo.texte)
this.listeCorrections.push(exo.texteCorr)