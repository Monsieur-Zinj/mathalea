import { choice, combinaisonListes } from '../../lib/outils/arrayOutils.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint, gestionnaireFormulaireTexte } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Développer avec les identités remarquables'
export const dateDeModifImportante = '26/04/2023' // Correction par Rémi Angot avec ajout des réponses pour les case 4 à 8

/**
 * Développer avec les 3 identités remarquables
 * @author Jean-Claude Lhote
 * 2N41-6, ex 2L10
 */
export const uuid = '04b0a'
export const ref = '2N41-6'
export default function DevelopperIdentitesRemarquables2 () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.titre = titre
  this.consigne = 'Développer et réduire les expressions suivantes.'
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = 1
  this.spacingCorr = 1
  this.nbQuestions = 5
  this.sup = 4
  this.sup2 = 4
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.correctionDetailleeDisponible = true
  context.isHtml ? (this.spacingCorr = 3) : (this.spacingCorr = 2)
  if (!context.isHtml) {
    this.correctionDetaillee = false
  }
  this.nouvelleVersion = function () {
    this.sup = parseInt(this.sup)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const listeFractions = [
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [1, 6],
      [5, 6],
      [1, 7],
      [2, 7],
      [3, 7],
      [4, 7],
      [5, 7],
      [6, 7],
      [1, 8],
      [3, 8],
      [5, 8],
      [7, 8],
      [1, 9],
      [2, 9],
      [4, 9],
      [5, 9],
      [7, 9],
      [8, 9],
      [1, 10],
      [3, 10],
      [7, 10],
      [9, 10]
    ]

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      nbQuestions: this.nbQuestions,
      saisie: this.sup2,
      max: 3,
      melange: 4,
      defaut: 1
    })

    // let typesDeQuestionsDisponibles = []
    // if (this.sup === 1) {
    //   typesDeQuestionsDisponibles = [1, 2, 3] // coef de x = 1
    // } else if (this.sup === 2) {
    //   typesDeQuestionsDisponibles = [4, 5, 6] // coef de x > 1
    // } else if (this.sup === 3) {
    //   typesDeQuestionsDisponibles = [7, 8, 9] // coef de x fractionnaire
    // } else {
    //   typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6]
    // } // Tous les cas possibles sauf fractions
    // const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)

    for (let k=0; k< listeTypeDeQuestions.length; k++){
      if (listeTypeDeQuestions[k] === 1) {
        // (a+b)²
        if (this.sup === 1) {
          listeTypeDeQuestions[k] = 1
        } else if (this.sup === 2) {
          listeTypeDeQuestions[k] = 4
        } else if (this.sup === 3) {
          listeTypeDeQuestions[k] = 7
        } else {
          listeTypeDeQuestions[k] = choice([1, 4])
        } // Tous les cas possibles sauf fractions
      } else if (listeTypeDeQuestions[k] === 2) {
        // (a-b)²
        if (this.sup === 1) {
          listeTypeDeQuestions[k] = 2
        } else if (this.sup === 2) {
          listeTypeDeQuestions[k] = 5
        } else if (this.sup === 3) {
          listeTypeDeQuestions[k] = 8
        } else {
          listeTypeDeQuestions[k] = choice([2, 5])
        } // Tous les cas possibles sauf fractions
      } else if (listeTypeDeQuestions[k] === 3) {
        // (a-b)(a+b)
        if (this.sup === 1) {
          listeTypeDeQuestions[k] = 3
        } else if (this.sup === 2) {
          listeTypeDeQuestions[k] = 6
        } else if (this.sup === 3) {
          listeTypeDeQuestions[k] = 9
        } else {
          listeTypeDeQuestions[k] = choice([3, 6])
        } // Tous les cas possibles sauf fractions
      }
     
    }

   
    for (let i = 0, texte, texteCorr, reponse, cpt = 0, a, b, typesDeQuestions, fraction = [], ds, ns; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]      
      b = randint(2, 9)
      a = randint(1, 9, [b])
      fraction = choice(listeFractions)
      ns = fraction[0]
      ds = fraction[1]
      texteCorr = ''
      switch (typesDeQuestions) {
        case 1:
          texte = `$(x+${a})^2$` // (x+a)²
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a+b)^2=a^2+2ab+b^2$, <br> avec $\\color{red} a = x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br>`
            texteCorr += `$\\left(\\color{red}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2=\\color{red}x\\color{black}^2+2 \\times \\color{red}x \\color{black}\\times \\color{green}${a} \\color{black}+ \\color{green}${a}\\color{black}^2$ <br>`
            texteCorr += `$\\phantom{\\left(\\color{red}x\\color{black}+\\color{green}${a}\\color{black}\\right)^2} = x^2+${2 * a}x+${a * a}$`
          } else {
            texteCorr += `$(x+${a})^2=x^2+${2 * a}x+${a * a}$`
          }
          reponse = `x^2+${2 * a}x+${a * a}`
          break
        case 2:
          texte = `$(x-${a})^2$` // (x-a)²
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a-b)^2=a^2-2ab+b^2$, <br> avec $\\color{red} a = x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br>`
          }
          texteCorr += `$(x-${a})^2=x^2-2 \\times ${a} \\times x+${a}^2=x^2-${2 * a}x+${a * a}$`
          reponse = `x^2-${2 * a}x+${a * a}`
          break
        case 3:          
          texte = `$(x-${a})(x+${a})$` // (x-a)(x+a)
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a+b)(a-b)=a^2-b^2$, <br> avec $\\color{red} a = x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br>`
          }
          texteCorr += `$(x-${a})(x+${a})=x^2-${a}^2=x^2-${a * a}$`
          reponse = `x^2-${a * a}`
          break
        case 4:
          texte = `$(${b}x+${a})^2$` // (bx+a)²  b>1
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a+b)^2=a^2+2ab+b^2$, <br> avec $\\color{red} a = ${b}x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br>`
          }
          texteCorr += `$(${b}x+${a})^2=(${b}x)^2+2 \\times ${b}x \\times ${a} + ${a}^2=${b * b}x^2+${2 * b * a}x+${a * a}$`          
          reponse = `${b * b}x^2+${2 * b * a}x+${a * a}`
          break
        case 5:
          texte = `$(${b}x-${a})^2$` // (bx-a)² b>1
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a-b)^2=a^2-2ab+b^2$, <br> avec $\\color{red} a = ${b}x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br>`
          }
          texteCorr += `$(${b}x-${a})^2=(${b}x)^2-2 \\times ${b}x \\times ${a} + ${a}^2=${b * b}x^2-${2 * b * a}x+${a * a}$`          
          reponse = `${b * b}x^2-${2 * b * a}x+${a * a}`
          break
        case 6:
          texte = `$(${b}x-${a})(${b}x+${a})$` // (bx-a)(bx+a) b>1
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a+b)(a-b)=a^2-b^2$, <br> avec $\\color{red} a = ${b}x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br>`
          } 
          texteCorr += `$(${b}x-${a})(${b}x+${a})=(${b}x)^2-${a}^2=${b * b}x^2-${a * a}$`
          reponse = `${b * b}x^2-${a * a}`
          break
        case 7:
          texte = `$\\left(${new FractionEtendue(ns, ds).texFraction}x+${a}\\right)^2$` // (kx+a)² k rationnel
          if (this.correctionDetaillee){
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a+b)^2=a^2+2ab+b^2$, <br> avec $\\color{red} a = ${new FractionEtendue(ns, ds).simplifie().texFraction}x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br>`
          } 
          texteCorr += `$\\left(${new FractionEtendue(ns, ds).texFraction}x+${a}\\right)^2=\\left(${new FractionEtendue(ns, ds).texFraction}x\\right)^2+2 \\times ${new FractionEtendue(ns, ds).texFraction}x \\times ${a} + ${a}^2=${new FractionEtendue(ns * ns, ds * ds).texFraction}x^2+${new FractionEtendue(ns * 2 * a, ds)}x+${a * a}$`
          reponse = `${new FractionEtendue(ns * ns, ds * ds).texFraction}x^2+${new FractionEtendue(ns * 2 * a, ds).texFraction}x+${a * a}`
          break
        case 8:
          texte = `$\\left(${new FractionEtendue(ns, ds).texFraction}x-${a}\\right)^2$` // (kx-a)² k rationnel
          if (this.correctionDetaillee){
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a-b)^2=a^2-2ab+b^2$, <br> avec $\\color{red} a = ${new FractionEtendue(ns, ds).texFraction}x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br>`
          }
          texteCorr += `$\\left(${new FractionEtendue(ns, ds).texFraction}x-${a}\\right)^2=\\left(${new FractionEtendue(ns, ds).texFraction}x\\right)^2-2 \\times ${new FractionEtendue(ns, ds).texFraction}x \\times ${a} + ${a}^2=${new FractionEtendue(ns * ns, ds * ds).texFraction}x^2-${new FractionEtendue(ns * 2 * a, ds).simplifie().texFraction}x+${a * a}$`
          reponse = `${new FractionEtendue(ns * ns, ds * ds).texFraction}x^2-${new FractionEtendue(ns * 2 * a, ds).simplifie().texFraction}x+${a * a}`
          break
        case 9:
          //  (bx-a)(bx+a) avec a entier et b rationnel simple
          texte = `$\\left(${new FractionEtendue(ns, ds).texFraction}x-${a}\\right)\\left(${new FractionEtendue(ns, ds).texFraction}x+${a}\\right)$` // b>1
          if (this.correctionDetaillee) {
            texteCorr += `On développe l'expression en utilisant l'identité remarquable $(a+b)(a-b)=a^2-b^2$, <br> avec $\\color{red} a = ${new FractionEtendue(ns, ds).texFraction}x\\color{black}$ et $\\color{green} b = ${a} \\color{black} $ : <br>`
          }
          texteCorr += `$\\left(${new FractionEtendue(ns, ds).texFraction}x-${a}\\right)\\left(${new FractionEtendue(ns, ds).texFraction}x+${a}\\right)=\\left(${new FractionEtendue(ns, ds).texFraction}x\\right)^2-${a}^2=${new FractionEtendue(ns * ns, ds * ds).texFraction}x^2-${a * a}$`
          reponse = `${new FractionEtendue(ns * ns, ds * ds).texFraction}x^2-${a * a}`
          break
      }
      texte += ajouteChampTexteMathLive(this, i)
      setReponse(this, i, reponse)
      if (this.questionJamaisPosee(i, typesDeQuestions, a)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, '1 : Coefficient de x égal à 1\n 2 : Coefficient de x supérieur à 1\n 3 : Coefficient de x rationnel\n 4 : Mélange des cas 1 et 2']

  this.besoinFormulaire2Texte = [
    'Type de questions', [
      '1 : (a+b)²',
      '2 : (a-b)²',
      '3 : (a+b)(a-b)',
      '4 : Mélange'
    ].join('\n')
  ]
}
