import Exercice from '../Exercice.js'
import { mathalea2d, colorToLatexOrHTML } from '../../modules/2dGeneralites.js'
import { ecritureAlgebrique, listeQuestionsToContenu, randint, rienSi1, texNombre, stringNombre, sp, choice, numAlpha } from '../../modules/outils.js'
import { repere, cercle, point, segment, milieu, texteParPoint, droite } from '../../modules/2d.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
export const titre = "Lire graphiquement les caractéristiques de la courbe représentative d'une fonction affine"
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '08/05/2023'

/**
 * Lire la pente et l'ordonnée à l'origine d'une droite pour en déduire la forme algébrique de la fonction affine
 * @author Rémi Angot (modifié par EE pour l'ajout de paramètres)
 * Référence
*/
export const uuid = '056fa'
export const ref = '3F21-3'
export default function PenteEtOrdonneeOrigineDroite () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.consigne = ''
  this.nbQuestions = 2
  this.nbCols = 2 // Uniquement pour la sortie LaTeX
  this.nbColsCorr = 2 // Uniquement pour la sortie LaTeX
  this.tailleDiaporama = 3 // Pour les exercices chronométrés. 50 par défaut pour les exercices avec du texte
  this.sup = 3
  this.sup2 = 3
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const num = randint(1, 5)
      const den = randint(1, 2)
      const a = (this.sup === 3 ? choice([-1, 1]) : (this.sup === 2 ? -1 : 1)) * num / den
      const b = (this.sup2 === 3 ? choice([-1, 1]) : (this.sup2 === 2 ? -1 : 1)) * randint(1, 4)
      let xMin
      context.isHtml ? xMin = -10 : xMin = -8
      const xMax = -xMin
      const yMin = xMin
      const yMax = -yMin

      const r = repere({ xMin, yMin, xMax, yMax })
      const f = x => a * x + b

      const d = droite(a, -1, b)
      d.color = colorToLatexOrHTML('blue')
      d.epaisseur = 2
      const c = cercle(point(0, b), 0.8, '#f15929')
      c.epaisseur = 2
      let x0 = -7
      while (!Number.isInteger(f(x0)) || f(x0) <= yMin || f(x0) >= yMax || x0 === -2 || x0 === -1 || x0 === 0) {
        x0 += 1
      }
      const A = point(x0, f(x0))
      const B = point(x0 + 1, f(x0))
      const C = point(x0 + 1, f(x0 + 1))
      const s1 = segment(A, B, '#f15929')
      const s2 = segment(B, C, '#f15929')
      const M1 = milieu(A, B)
      const M2 = milieu(B, C)
      const t1 = texteParPoint('$1$', point(M1.x, M1.y + (a > 0 ? -0.4 : 0.4)))
      const t2 = texteParPoint(`$${texNombre(a)}$`, point(M2.x + 0.6, M2.y))
      t1.color = colorToLatexOrHTML('#f15929')
      t2.color = colorToLatexOrHTML('#f15929')

      s1.epaisseur = 3
      s1.pointilles = 5
      s2.epaisseur = 3
      s2.pointilles = 5

      const nomFonction = choice(['f', 'g', 'h', 'f_1', 'f_2', 'f_3'])

      const introduction = `On a représenté ci-dessous une fonction affine $${nomFonction}$.<br><br>` + mathalea2d({ xmin: xMin, xmax: xMax, ymin: yMin, ymax: yMax }, r, d)
      const consigneCorrection = mathalea2d({ xmin: xMin, xmax: xMax, ymin: yMin, ymax: yMax }, r, d, c, s1, s2, t1, t2)
      let question1 = numAlpha(0) + `Quelle est l'ordonnée à l'origine de la fonction $${nomFonction}$ ?`
      question1 += ajouteChampTexteMathLive(this, 3 * i , 'largeur15 inline ')
      let question2 = numAlpha(1) + `Quel est le coefficient directeur de $${nomFonction}$ ?`
      question2 += ajouteChampTexteMathLive(this, 3 * i + 1, 'largeur15 inline ')
      let question3 = numAlpha(2) + `En déduire l'expression algébrique de $${nomFonction}$.`
      question3 += ajouteChampTexteMathLive(this, 3 * i + 2, 'largeur15 inline nospacebefore', { texte: `$${sp(10)}${nomFonction} : x \\mapsto $` })

      setReponse(this, 3 * i, b)
      setReponse(this, 3 * i + 1, [a, `\\frac{${num}}{${den}}`])
      setReponse(this, 3 * i + 2, `${stringNombre(a)}x+${b}`)
      if (den === 2) setReponse(this, 2, [`${stringNombre(a)}x+${b}`, `\\frac{${num}}{2}\\times x + ${b}`])

      let correction1 = consigneCorrection + '<br>'
      correction1 += numAlpha(0) + `La droite coupe l'axe des ordonnées au point de coordonnées $(0;${b})$. L'ordonnée de $${nomFonction}$ à l'origine est donc $${b}$.`
      // let correction2 = numAlpha(1) + `À chaque fois que l'on avance de 1 carreau, on ${a > 0 ? 'monte' : 'descend'} de $${texNombre(Math.abs(a))}$ ${Math.abs(a) >= 2 ? 'carreaux' : 'carreau'},`
      let correction2 = numAlpha(1) + `À chaque fois que l'on avance de 1 unité d'abscisses, on ${a > 0 ? 'monte' : 'descend'} de $${texNombre(Math.abs(a))}$ unité${Math.abs(a) >= 2 ? 's' : ''} d'ordonnées. `
      correction2 += `Le coefficient directeur de $${nomFonction}$ est donc $${texNombre(a)}$.`
      let correction3 = numAlpha(2) + `$${nomFonction}$ étant une fonction affine, on a $${nomFonction} : x \\mapsto ax + b$ avec $a$ son coefficient directeur (ou pente) et $b$ son ordonnée à l'origine.`
      correction3 += `<br>Finalement, $${nomFonction} : x \\mapsto ${rienSi1(a).toString().replace('.', ',')}x ${ecritureAlgebrique(b)}$.`
      texte = introduction + '<br>' + question1 + '<br>' + question2 + '<br>' + question3
      texteCorr = correction1 + '<br>' + correction2 + '<br>' + correction3

      if (this.questionJamaisPosee(i, a, b, num, den)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Signe du coefficient directeur ', 3, '1 : Positif\n 2 : Négatif\n 3: Peu importe']
  this.besoinFormulaire2Numerique = ['Signe de l\'ordonnée à l\'origine ', 3, '1 : Positif\n 2 : Négatif\n 3: Peu importe']
}
