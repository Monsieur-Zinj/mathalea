import { derivative, fraction, parse, simplify } from 'mathjs'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { Polynome } from '../../lib/mathFonctions/Polynome.js'
import { ecritureAlgebrique } from '../../lib/outils/ecritures'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { prettyTex } from './1AN14-4.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.ts'
import { functionCompare } from '../../lib/interactif/comparisonFunctions'

const math = { simplify, parse, derivative, fraction }
export const titre = 'Dérivée d\'un quotient'
export const dateDePublication = '22/01/2022'
export const dateDeModificationImportante = '07/05/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Calculer la dérivée d'un quotient
 * @author Jean-Léon Henry
 * Finalisé par Jean-Claude Lhote
 * Référence 1AN14-5
 */

export const uuid = 'b32f2'
export const ref = '1AN14-5'
export const refs = {
  'fr-fr': ['1AN14-5'],
  'fr-ch': []
}
export default function DeriveeQuotient () {
  Exercice.call(this)
  this.titre = titre
  // this.consigne = "Pour chacune des fonctions suivantes, dire sur quel ensemble elle est dérivable, puis déterminer l'expression de sa fonction dérivée."
  this.consigne = 'Pour chacune des fonctions suivantes, déterminer l\'expression de sa fonction dérivée.'
  this.nbQuestions = 5
  // Sortie LaTeX
  this.nbCols = 2 // Nombre de colonnes
  this.nbColsCorr = 2 // Nombre de colonnes dans la correction
  this.sup = '1'
  this.sup2 = true
  // On modifie les règles de simplifications par défaut de math.js pour éviter 10x+10 = 10(x+1) et -4x=(-4x)
  const reglesDeSimplifications = math.simplify.rules.slice()
  reglesDeSimplifications.splice(reglesDeSimplifications.findIndex(rule => rule.l === 'n1*n2 + n2'), 1)
  reglesDeSimplifications.splice(reglesDeSimplifications.findIndex(rule => rule.l === 'n1*n3 + n2*n3'), 1)
  reglesDeSimplifications.push({ l: '-(n1*v)', r: '-n1*v' })
  reglesDeSimplifications.push('-(n1/n2) -> -n1/n2')

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.liste_valeurs = [] // Les questions sont différentes du fait du nom de la fonction, donc on stocke les valeurs
    if (this.sup2) {
      this.interactifReady = false
    } else {
      this.interactifReady = true
    }
    // Types d'énoncés
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      nbQuestions: this.nbQuestions,
      listeOfCase: [
        'poly1a/poly1',
        'mon/poly1',
        'poly/poly1',
        'mon/poly2centre'
      ],
      min: 1,
      max: 4,
      melange: 5,
      defaut: 1
    })
    for (let i = 0, texte, texteCorr, expression, nameF, maReponse, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // On créé les coefficients d'un monome x^m qu'ont va générer
      const coeffs = new Array(randint(2, 9)) // Au moins 2 coeffs, i.e. deg >= 1
      coeffs.fill(0)
      coeffs.push(1) // on ajoute un coeff donc deg >= 2
      // On génère des fonctions qui pourrait servir
      const dictFonctions = {
        exp: 'e^x',
        mon: new Polynome({ coeffs }),
        poly1: new Polynome({ rand: true, deg: 1 }),
        poly1a: new Polynome({ rand: true, deg: 1 }),
        poly2centre: new Polynome({ rand: true, coeffs: [[10, true], 0, [10, true]] }),
        poly: new Polynome({ rand: true, deg: 2 }),
        monome2: new Polynome({ rand: true, coeffs: [0, 0, [10, true]] }),
        racine: 'sqrt(x)'
      }
      const listeTypeFonctions = listeTypeDeQuestions[i].split('/')
      const typeNum = listeTypeFonctions[0]
      const typeDen = listeTypeFonctions[1]
      // Extraction des fonctions
      const fNum = dictFonctions[typeNum]
      const fDen = dictFonctions[typeDen]
      const termeNum = ['pol', 'mon'].includes(typeNum.substr(0, 3)) ? fNum.toMathExpr() : fNum
      const termeDen = ['pol', 'mon'].includes(typeDen.substr(0, 3)) ? fDen.toMathExpr() : fDen
      expression = `(${termeNum})/(${termeDen})`

      // Énoncé
      nameF = ['f', 'g', 'h', 'l', 'm', 'p', 'r', 's', 't', 'u', 'v', 'w', 'b', 'c', 'd', 'e'][i % 16]
      texte = ''
      texte += `$${nameF}(x)=${prettyTex(math.simplify(expression, ['(n1)/(n2)->n1/n2']))}$`
      // Correction
      const derNum = math.simplify(math.derivative(termeNum, 'x'), reglesDeSimplifications)
      const derDen = math.simplify(math.derivative(termeDen, 'x'), reglesDeSimplifications)
      texteCorr = ''
      // texteCorr = `$${nameF}$ est dérivable sur $${ensembleDerivation}$. Soit $x\\in${ensembleDerivation}$.<br>`
      texteCorr += 'On rappelle le cours : si $u,v$ sont  deux fonctions dérivables sur un même intervalle $I$, et que $v$ ne s\'annule pas sur $I$ alors leur quotient est dérivable sur $I$ et on a la formule : '
      texteCorr += '\\[\\left(\\frac{u}{v}\\right)\'=\\frac{u\'\\times v-u\\times v\'}{v^2}.\\]'
      texteCorr += `Ici $${nameF}=\\frac{u}{v}$ avec : `
      texteCorr += `\\[\\begin{aligned}u(x)&=${prettyTex(math.parse(termeNum))},\\ u'(x)=${prettyTex(derNum)}\\\\ v(x)&=${prettyTex(math.parse(termeDen))},\\ v'(x)=${prettyTex(derDen)}.\\end{aligned}\\]`
      switch (listeTypeDeQuestions[i]) {
        case 'poly1a/poly1':
        case 'poly/poly1': {
          // fDen = cx+d
          const c = fDen.monomes[1]
          const d = fDen.monomes[0]
          texteCorr += `Ici la formule ci-dessus est applicable pour tout $x$ tel que $${termeDen}\\neq 0$. C'est-à-dire $x\\neq${math.fraction(-d / c).toLatex()}$.<br>`
          texteCorr += 'On obtient alors : '
          if (fNum.deg === 1) {
            // fNum = ax+b
            const a = fNum.monomes[1]
            const b = fNum.monomes[0]
            texteCorr += `\\[${nameF}'(x)=\\frac{${a}(${termeDen})-(${termeNum})\\times${c < 0 ? `(${c})` : c}}{(${termeDen})^2}.\\]`
            texteCorr += 'D\'où, en développant le numérateur : '
            texteCorr += `\\[${nameF}'(x)=\\frac{${fDen.multiply(a)}-(${fNum.multiply(c)})}{(${termeDen})^2}.\\]`
            texteCorr += 'Les termes en $x$ se compensent et on obtient : '
            texteCorr += `\\[${nameF}'(x)=\\frac{${a * d}${ecritureAlgebrique(-c * b)}}{(${termeDen})^2}.\\]`
            texteCorr += 'C\'est-à-dire : '
            texteCorr += `\\[\\boxed{${nameF}'(x)=\\frac{${(a * d) - (c * b)}}{(${termeDen})^2}.}\\]`
            maReponse = `\\frac{${(a * d) - (c * b)}}{(${termeDen})^2}`
            handleAnswers(this, i, { reponse: { value: maReponse, compare: functionCompare } })
          } else if (fNum.deg === 2) {
            texteCorr += `\\[${nameF}'(x)=\\frac{(${fNum.derivee()})(${termeDen})-(${termeNum})\\times${c < 0 ? `(${c})` : c}}{(${termeDen})^2}.\\]`
            texteCorr += 'D\'où, en développant le numérateur : '
            const polyInterm = fNum.derivee().multiply(fDen)
            texteCorr += `\\[${nameF}'(x)=\\frac{${polyInterm}-(${fNum.multiply(c)})}{(${termeDen})^2}.\\]`
            texteCorr += 'On réduit le numérateur pour obtenir : '
            maReponse = `\\frac{${polyInterm.add(fNum.multiply(-c))}}{(${termeDen})^2}`
            texteCorr += `\\[\\boxed{${nameF}'(x)=${maReponse}.}\\]`
            handleAnswers(this, i, { reponse: { value: maReponse, compare: functionCompare } })
            texteCorr += '<b>Remarque : </b>la plupart du temps, on veut le signe de la dérivée. Il serait donc plus logique de factoriser le numérateur si possible, mais cela sort du cadre de cet exercice.'
          }
          break
        }
        case 'mon/poly2centre': {
          const c = fDen.monomes[2]
          const d = fDen.monomes[0]
          const fDenDer = fDen.derivee().toLatex()
          if (c * d > 0) {
            texteCorr += `Ici la formule ci-dessus est applicable pour tout $x$ car $${termeDen}${c < 0 ? '<0' : '>0'}$ pour tout $x$.<br>`
          } else {
            const valeurInterdite = `\\sqrt{${math.fraction(-d / c).toLatex()}}`
            texteCorr += `Ici la formule ci-dessus est applicable pour tout $x$ tel que $${termeDen}\\neq 0$. C'est-à-dire $x\\neq${valeurInterdite}$ et $x\\neq-${valeurInterdite}$.<br>`
          }
          texteCorr += 'On obtient alors : '
          texteCorr += `\\[${nameF}'(x)=\\frac{${fNum.derivee()}(${fDen})-${fNum}\\times${fDenDer.startsWith('-') ? `(${fDenDer})` : `${fDenDer}`}}{(${termeDen})^2}.\\]`
          texteCorr += 'D\'où, en développant le numérateur : '
          texteCorr += `\\[${nameF}'(x)=\\frac{${fNum.derivee().multiply(fDen)}${fNum.multiply(fDen.derivee().multiply(-1)).toMathExpr(true)}}{(${termeDen})^2}.\\]`
          texteCorr += 'On simplifie pour obtenir :'
          maReponse = `\\frac{${fNum.derivee().multiply(fDen).add(fNum.multiply(fDen.derivee().multiply(-1)))}}{(${termeDen})^2}`
          texteCorr += `\\[\\boxed{${nameF}'(x)=${maReponse}.}\\]`
          texteCorr += '<b>Remarque : </b>la plupart du temps, on veut le signe de la dérivée. Il serait donc plus logique de factoriser le numérateur, mais cela sort du cadre de cet exercice.'
          handleAnswers(this, i, { reponse: { value: maReponse, compare: functionCompare } })
        }
          break
        case 'mon/poly1': {
          // fDen = cx+d
          const c = fDen.monomes[1]
          const d = fDen.monomes[0]
          texteCorr += `Ici la formule ci-dessus est applicable pour tout $x$ tel que $${termeDen}\\neq 0$. C'est-à-dire $x\\neq${math.fraction(-d / c).toLatex()}$.<br>`
          texteCorr += 'On obtient alors : '
          texteCorr += `\\[${nameF}'(x)=\\frac{${fNum.derivee()}(${fDen})-${fNum}\\times${c < 0 ? `(${c})` : c}}{(${termeDen})^2}.\\]`
          texteCorr += 'D\'où, en développant le numérateur : '
          texteCorr += `\\[${nameF}'(x)=\\frac{${fNum.derivee().multiply(fDen)}${fNum.multiply(-c).toMathExpr(true)}}{(${termeDen})^2}.\\]`
          texteCorr += 'On simplifie pour obtenir :'
          maReponse = `\\frac{${fNum.derivee().multiply(fDen).add(fNum.multiply(-c))}}{(${termeDen})^2}`
          texteCorr += `\\[\\boxed{${nameF}'(x)=${maReponse}.}\\]`
          texteCorr += '<b>Remarque : </b>la plupart du temps, on veut le signe de la dérivée. Il serait donc plus logique de factoriser le numérateur, mais cela sort du cadre de cet exercice.'
          handleAnswers(this, i, { reponse: { value: maReponse, compare: functionCompare } })
          break
        }
        case 'exp/poly1' : {
          // fDen = cx+d
          const c = fDen.monomes[1]
          const d = fDen.monomes[0]
          texteCorr += `Ici la formule ci-dessus est applicable pour tout $x$ tel que $${termeDen}\\neq 0$. C'est-à-dire $x\\neq${math.fraction(-d / c).toLatex()}$.<br>`
          texteCorr += 'On obtient alors : '
          texteCorr += `\\[${nameF}'(x)=\\frac{${fNum}(${fDen})-${fNum}\\times${c < 0 ? `(${c})` : c}}{(${termeDen})^2}.\\]`
          texteCorr += 'On factorise par $e^x$, et on obtient : '
          texteCorr += `\\[${nameF}'(x)=\\frac{${fNum}(${fDen}${ecritureAlgebrique(-c)})}{(${termeDen})^2},\\]`
          texteCorr += 'ce qui donne, après réduction : '
          maReponse = `\\frac{${fNum}(${Polynome.print([d - c, c])})}{(${termeDen})^2}`
          texteCorr += `\\[\\boxed{${nameF}'(x)=${maReponse}.}\\]`
          handleAnswers(this, i, { reponse: { value: maReponse, compare: functionCompare } })
          break
        }
        default:
          texteCorr += 'TODO'
          break
      }
      texte = texte.replaceAll('\\frac', '\\dfrac')
      if (this.sup2) {
        texte += `<br>Montrer que $${nameF}^\\prime(x)=${maReponse.replaceAll('\\frac', '\\dfrac')}$`
      }
      texteCorr = texteCorr.replaceAll('\\frac', '\\dfrac')
      if (this.interactif && !this.sup2) {
        texte += '<br><br>' + ajouteChampTexteMathLive(this, i, 'inline largeur75', { texteAvant: `$${nameF}'(x)=$` })
      }
      if (this.liste_valeurs.indexOf(expression) === -1) {
        this.liste_valeurs.push(expression)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['types de fonctions (nombre séparés par des tirets)', '1 : (ax+b)/(cx+d)\n2 : ax^n/(cx+d)\n3 : (ax²+bx+c)/(ex+f)\n4 ax^n/(ax²+bx+c)\n5 : mélange']
  this.besoinFormulaire2CaseACocher = ['Montrer que... (non interactif)', true]
}
