import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Écrire une racine carrée sous la forme $\\;a\\sqrt{b}$'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '26/04/2023' // Ajout de l'interactivité par Rémi Angot

/**
 * 2N32-3, ex 2N11
 * @author Stéphane Guyon
 */
export const uuid = 'd9495'
export const ref = '2N32-3'
export default function ExtraireUnCarreParfaitDUneRacineCarree () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = 'Écrire une racine carrée sous la forme $a\\sqrt{b}$'
  this.nbQuestions = 4
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = 2 //

  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.consigne = (this.sup === 2) ? `Écrire le${this.nbQuestions > 1 ? 's' : ''} nombre${this.nbQuestions > 1 ? 's' : ''} proposé${this.nbQuestions > 1 ? 's' : ''} sous la forme $a\\sqrt{b}$ où $a$ est un entier et $b$ le plus petit entier possible.` : ''
    this.listeQuestions = []
    this.listeCorrections = []
    let a, b, c, d, texte, texteCorr, reponse
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      a = randint(2, 11)
      b = a * a
      c = randint(2, 7, [4])
      d = c * b
      if (this.sup === 1) {
        texte = `Écrire $\\sqrt{${d}}$ sous la forme $a\\sqrt{${c}}$ où $a$ est un entier.`
      }
      texteCorr = `On cherche le plus grand carré parfait diviseur de ${d}, c'est ${b}.<br>`
      texteCorr += `On a donc la décomposition : $${d}=${c}\\times${b}=${c}\\times${a}^{2}$,<br>`
      texteCorr += `qui permet d'écrire que : $\\sqrt{${d}}=\\sqrt{${a}^{2}\\times${c}}=\\color{red} {${a}\\times\\sqrt{${c}}}$`
      if (this.sup === 2) {
        texte = `$\\sqrt{${d}}$`
      }
      texteCorr = `On cherche le plus grand carré parfait diviseur de ${d}, c'est ${b}.<br>`
      texteCorr += `On a donc la décomposition : $${d}=${c}\\times${b}=${c}\\times${a}^{2}$,<br>`
      texteCorr += `qui permet d'écrire que : $\\sqrt{${d}}=\\sqrt{${a}^{2}\\times${c}}=\\color{red} {${a}\\times\\sqrt{${c}}}$`
      reponse = [`${a}\\times\\sqrt{${c}}`, `${a}\\sqrt{${c}}`, `\\sqrt{${c}}\\times${a}`, `${a}\\times\\sqrt${c}`, `${a}\\sqrt${c}`, `\\sqrt${c}\\times${a}`]
      // Pb MathLive 01/11/23 : ligne 48, supprimer 3 dernières réponses
      setReponse(this, i, reponse, { formatInteractif: 'texte' })
      texte += ajouteChampTexteMathLive(this, i, 'largeur15 inline', { texte: `<br><br>$\\sqrt{${d}}=$` })
      if (this.listeQuestions.indexOf(texte) === -1) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, '1 : En donnant la racine carrée unité\n2 : Sans indication']
}
