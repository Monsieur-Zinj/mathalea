import Exercice from '../Exercice.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ecritureParentheseSiNegatif, reduireAxPlusB, reduirePolynomeDegre3, rienSi1 } from '../../lib/outils/ecritures.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { choice } from '../../lib/outils/arrayOutils.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'

export const titre = 'Domaine de définition d\'une fonction logarithme'
export const dateDePublication = '22/7/2024'
export const uuid = '450e7'
export const interactifReady = true
export const interactifType = 'mathLive'
export const refs = {
  'fr-fr': ['TF1-0'],
  'fr-ch': []
}

/**
 * Réduire une expression en fonction de ln/log de x
 * @autor  Jean-Claude Lhote
 * Référence TF1-0
 */
export default class DomaineDefFnLog extends Exercice {
  version: string
  constructor () {
    super()
    this.version = 'ln'
    this.nbQuestions = 5
    this.spacingCorr = 3
    this.sup = '1'
    this.sup2 = true
    this.besoinFormulaireTexte = ['Type de fonction dans le logarithme (nombres séparés par des tirets)', '1 : Fonction affine\n2 : Fonction homographique\n3 : Polynome de degré 2\n4 : Mélange']
    this.besoinFormulaire2CaseACocher = ['Type de logarithme', true]
    this.comment = 'Domaines de définition de fonctions logarithmes'
  }

  nouvelleVersion () {
    const listeTypeDeQuestion = gestionnaireFormulaireTexte({ saisie: this.sup, nbQuestions: this.nbQuestions, min: 1, max: 3, melange: 4, defaut: 4 })
    if (this.sup2) this.version = 'ln'
    else this.version = 'log'
    const logString = this.version !== 'ln' ? '\\log' : '\\ln'
    const pluriel = this.nbQuestions > 1 ? 's' : ''
    this.consigne = `Donner le domaine de définition de${this.nbQuestions > 1 ? 's ' : 'la '}fonction${pluriel} suivante${pluriel}.`

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = `$\\mathcal{f}_${i}(x)=`
      let correction: string = ''
      let a: number
      let b: number
      let c: number
      let d: number
      let fonction: string
      let frac1: FractionEtendue
      let frac2: FractionEtendue
      let answer: string
      let texteCorr:string
      let de: number

      // On définit le contenu de l'énoncé
      switch (listeTypeDeQuestion[i]) {
        case 1: // affine
          a = randint(-9, 9, 0)
          b = randint(-9, 9, [0, a, -a])
          c = a
          d = b
          fonction = reduireAxPlusB(a, b)
          correction = `$\\begin{aligned}${fonction}\\gt 0 &\\iff `
          correction += `${rienSi1(a)}x\\gt ${rienSi1(-b)}\\\\`
          if (a !== 1) {
            frac1 = new FractionEtendue(-b, a).simplifie()
            if (a > 0) {
              correction += `&\\iff x\\gt ${frac1.texFractionSimplifiee}`
              answer = `\\left]${frac1.texFractionSimplifiee};+\\infty\\right[`
            } else {
              correction += `&\\iff x\\lt ${frac1.texFractionSimplifiee}`
              answer = `\\left]-\\infty;${frac1.texFractionSimplifiee}\\right[`
            }
            correction += '\\end{aligned}$'
          } else {
            correction += '\\end{aligned}$'
            answer = `\\left]${-b};+\\infty\\right[`
          }

          break
        case 2: // homographique
          do {
            a = randint(-3, 3, 0)
            b = randint(-9, 9, [0, a, -a])
            c = randint(-3, 3, [a, 0])
            d = randint(-9, 9, [0, c, -c])
            frac1 = new FractionEtendue(-b, a).simplifie()
            frac2 = new FractionEtendue(-d, c).simplifie()
            de = a * d - b * c //
          } while (de === 0) // On ne veut pas de fonction constante
          fonction = `\\dfrac{${reduireAxPlusB(a, b)}}{${reduireAxPlusB(c, d)}}`
          correction += `La dérivée de $${fonction}$ est $\\dfrac{${de}}{(${reduireAxPlusB(c, d)})^2}$, son signe est celui du numérateur, donc ${de > 0 ? 'positif' : 'négatif'}.<br>`
          correction += `$${fonction}$ est donc ${de > 0 ? 'croissante' : 'décroissante'} sur son domaine de définition $\\R\\backslash{\\{${frac2.texFractionSimplifiee}\\}}$ et change de signe en $${frac1.texFractionSimplifiee}$.<br>`
          if (de < 0) { // ax+b/cx+d décroissante
            if (frac1.inferieurstrict(frac2)) { //  -b / a < -d / c la fonction décroit et change de signe en -b/a, ensuite elle est négative sur -b/a;+inf
              answer = `\\left]-\\infty;${frac1.texFractionSimplifiee}\\right[`
            } else { // -d/c<-b/a la fonction décroit et change de signe après la valeur interdite elle est positive sur ]-inf;-d/c[U]-d/c;-b/a[
              answer = `\\left]-\\infty;${frac2.texFractionSimplifiee}\\right[\\cup\\left]${frac2.texFractionSimplifiee};${frac1.texFractionSimplifiee}\\right[`
            }
            correction += `Elle est donc positive pour $x<${frac1.texFractionSimplifiee}$ et négative pour $x>${frac1.texFractionSimplifiee}$.<br>`
          } else { // ax+b/cx+d croissante
            if (frac1.inferieurstrict(frac2)) { // -b/a<-d/c la fonction croit et elle change de signe en -b/a, ensuite elle est positive
              answer = `\\left]${frac1.texFractionSimplifiee};${frac2.texFractionSimplifiee}\\right[\\cup\\left]${frac2.texFractionSimplifiee};+\\infty\\right[`
            } else { // -d/c<-b/a la fonction croit en étant négative jusqu'en -b/a ou elle devient positive et le reste
              answer = `\\left]${frac1.texFractionSimplifiee};+\\infty\\right[`
            }
            correction += `Elle est donc négative pour $x<${frac1.texFractionSimplifiee}$ et positive pour $x>${frac1.texFractionSimplifiee}$.<br>`
          }
          break
        default: // polynôme degré 2
        {
          a = randint(-3, 3, 0)
          b = randint(-9, 9, [0, a, -a])
          c = randint(-3, 3, [a, 0])
          d = randint(-9, 9, [0, c, -c])
          if (choice([true, false])) {
            // une fois sur 2 on est certain d'avoir des racines (pouvant être doubles)
            frac1 = -b / a < -d / c ? new FractionEtendue(-b, a).simplifie() : new FractionEtendue(-d, c).simplifie()
            frac2 = -d / c > -b / a ? new FractionEtendue(-d, c).simplifie() : new FractionEtendue(-b, a).simplifie()
            const coeffX2 = a * c
            const coeffX0 = b * d
            const coeffX = a * d + b * c
            a = coeffX2
            b = coeffX
            c = coeffX0
            fonction = reduirePolynomeDegre3(0, a, b, c)
            de = b * b - 4 * a * c
            correction += `$${fonction}$ est un polynome de degré 2, calculons son discriminant : <br>`
            correction += `$\\Delta=${ecritureParentheseSiNegatif(b)}^2-4\\times ${ecritureParentheseSiNegatif(a)}\\times ${ecritureParentheseSiNegatif(c)}=${b * b - 4 * a * c}`

            if (de > 0) { // deux racines, le polynome est positif entre les deux racines : frac1 et frac2
              correction += `\\quad x_1=\\dfrac{${-b}-\\sqrt{${de}}}{2\\times ${ecritureParentheseSiNegatif(a)}}=${a > 0 ? frac1.texFractionSimplifiee : frac2.texFractionSimplifiee}$ et $x_2=\\dfrac{${-b}+\\sqrt{${de}}}{2\\times ${ecritureParentheseSiNegatif(a)}}=${a < 0 ? frac1.texFractionSimplifiee : frac2.texFractionSimplifiee}$.<br>`
              correction += `Le discriminant est positif, donc $${fonction}$ s'annule en $${frac1.texFractionSimplifiee}$ et en $${frac2.texFractionSimplifiee}$.<br>`
              if (a > 0) { // a>0 donc positif puis négatif puis positif
                correction += `le coefficient de $x^2$ étant positif, $${fonction}\\leq 0$ pour $x\\in \\left[${frac1.texFractionSimplifiee};${frac2.texFractionSimplifiee}\\right]$.<br>`
                answer = `\\left]-\\infty;${frac1.texFractionSimplifiee}\\right[\\cup\\left]${frac2.texFractionSimplifiee};+\\infty\\right[`
              } else { // a<0 donc positif entre les racines.
                correction += `le coefficient de $x^2$ étant négatif, $${fonction}\\gt 0$ pour $x\\in \\left]${frac1.texFractionSimplifiee};${frac2.texFractionSimplifiee}\\right[$.<br>`
                answer = `\\left]${frac1.texFractionSimplifiee};${frac2.texFractionSimplifiee}\\right[`
              }
            } else { // une racine double
              correction += `Le discriminant est null, donc $${fonction}$ s'annule en $${frac1.texFractionSimplifiee}$ et est du signe de son coefficient de dégré $2$, soit ${a > 0 ? 'positif' : 'négatif'}.<br>`
              answer = a > 0
                ? `\\R\\backslash{\\{${frac1.texFractionSimplifiee}\\}}`
                : '\\emptyset'
            }
          } else {
            // On conserve les a, b et c choisis aléatoirement
            fonction = reduirePolynomeDegre3(0, a, b, c)
            de = b * b - 4 * a * c
            correction += `$${fonction}$ est un polynome de degré 2, calculons son discriminant : <br>`
            correction += `$\\Delta=${ecritureParentheseSiNegatif(b)}^2-4\\times ${ecritureParentheseSiNegatif(a)}\\times ${ecritureParentheseSiNegatif(c)}=${b * b - 4 * a * c}`
            if (de < 0) {
              correction += `$.<br>Le discriminant est négatif, donc $${fonction}$ est du signe de son coefficient de dégré $2$, soit ${a > 0 ? 'positif' : 'négatif'}.<br>`
              answer = a > 0
                ? '\\R'
                : '\\emptyset'
            } else if (de === 0) {
              frac1 = new FractionEtendue(-b, 2 * a).simplifie()
              correction += `\\quad x_1=x_2=\\dfrac{${-b}}{2\\times ${ecritureParentheseSiNegatif(a)}}=${frac1.texFractionSimplifiee}$.<br>`
              // racine double : -b/2a
              correction += `Le discriminant est nul, donc $${fonction}$ s'annule en $${frac1.texFractionSimplifiee}$ et pour tout $x\\neq ${frac1.texFractionSimplifiee}$ est du signe de son coefficient de dégré $2$, soit ${a > 0 ? 'positif' : 'négatif'}.<br>`
              answer = answer = a > 0
                ? `\\R\\backslash{\\{${frac1.texFractionSimplifiee}\\}}`
                : '\\emptyset'
            } else { // deux racines (-b-delta)/2a et (-b+delta)/2a
              let borneG: string
              let borneD: string
              if (Math.sqrt(de) === Math.round(Math.sqrt(de))) {
                borneG = a > 0
                  ? `${new FractionEtendue(-b - Math.sqrt(de), 2 * a).simplifie().texFSD}`
                  : `${new FractionEtendue(b - Math.sqrt(de), -2 * a).simplifie().texFSD}`
                borneD = a > 0
                  ? `${new FractionEtendue(-b + Math.sqrt(de), 2 * a).simplifie().texFSD}`
                  : `${new FractionEtendue(b + Math.sqrt(de), -2 * a).simplifie().texFSD}`
              } else {
                borneG = a > 0
                  ? `\\dfrac{${-b}-\\sqrt{${de}}}{${2 * a}}`
                  : `\\dfrac{${b}-\\sqrt{${de}}}{${-2 * a}}`
                borneD = a > 0
                  ? `\\dfrac{${-b}+\\sqrt{${de}}}{${2 * a}}`
                  : `\\dfrac{${b}+\\sqrt{${de}}}{${-2 * a}}`
              }
              correction += `\\quad x_1=\\dfrac{${-b}-\\sqrt{${de}}}{2\\times ${ecritureParentheseSiNegatif(a)}}=${a > 0 ? borneG : borneD}$ et $x_2=\\dfrac{${-b}+\\sqrt{${de}}}{2\\times ${ecritureParentheseSiNegatif(a)}}=${a < 0 ? borneG : borneD}$.<br>`
              correction += `Le discriminant est positif, donc $${fonction}$ s'annule en $${a > 0 ? borneG : borneD}$ et en $${a > 0 ? borneD : borneG}$
               et est du signe contraire de son coefficient de dégré $2$ entre les racines, soit ${a < 0 ? 'positif' : 'négatif'} et est ${a > 0 ? 'positif' : 'négatif'} à l'extérieur des racines.<br>`
              answer = answer = a < 0
                ? `\\left]${borneG};${borneD}\\right[`
                : `\\left]-\\infty;${borneG}\\right[\\cup\\left]${borneD};+\\infty\\right[`
            }
          }
        }
      }
      texte += `${logString}\\left(${fonction}\\right)$<br>`
      texteCorr = `La fonction $${logString}$ est défine sur $\\R_+^*$, donc $x$ doit vérifier $${fonction}>0$<br>`
      correction += `Donc $\\mathcal{D}_{f_${i}}=${miseEnEvidence(answer)}$`
      texteCorr += correction
      if (this.questionJamaisPosee(i, a, b, c, d)) {
        if (this.interactif) {
          texte += ajouteChampTexteMathLive(this, i, `${KeyboardType.clavierEnsemble}`) + ajouteFeedback(this, i)
          handleAnswers(this, i, { reponse: { value: answer, compare: fonctionComparaison, options: { intervalle: true } } })
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
