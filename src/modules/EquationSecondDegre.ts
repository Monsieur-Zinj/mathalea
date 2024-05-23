import { sqrt } from 'mathjs'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, rienSi1 } from '../lib/outils/ecritures'
import FractionEtendue from './FractionEtendue'
import { ComputeEngine } from '@cortex-js/compute-engine'
import { compareArrays, shuffle2tableauxSansModif } from '../lib/outils/arrayOutils'
import { randint } from './outils'
import type { Expression } from 'mathlive'

const ce = new ComputeEngine()
ce.latexOptions = {
  // precision: 3,
  // decimalMarker: "{,}",
  // invisiblePlus : '',
  fractionStyle: (expr: Expression, level: number) => 'block-quotient'
}

interface Options {
  format: string;
  variable: string;
  // other properties if needed
}

// créer une fonction qui construit une équation du second degré. On peut la créer à partir de solutions, à partir des coefficients ou simplement donner des conditions sur la solution et les coefficients pour la créer.
class EquationSecondDegre {
  coefficients: FractionEtendue[]
  coefficientsEqReduite: FractionEtendue[]
  delta: FractionEtendue
  nombreSolutions: number
  solutionsListeTex: string[]
  ensembleDeSolutionsTex: string
  natureDesSolutions: string
  equationTex: string
  correctionDetailleeTex: string
  correctionTex: string
  variable: string
  constructor (a: FractionEtendue, b: FractionEtendue, c: FractionEtendue, d: FractionEtendue, e: FractionEtendue, f: FractionEtendue, options = { format: 'initial', variable: 'x' }) {
    this.coefficients = [a, b, c, d, e, f]
    this.variable = options.variable
    this.natureDesSolutions = ''
    const nomValDefault = [`${this.variable}^2`, this.variable, '', `${this.variable}^2`, this.variable, '']
    this.coefficientsEqReduite = [a.differenceFraction(d), b.differenceFraction(e), c.differenceFraction(f), new FractionEtendue(0, 1), new FractionEtendue(0, 1), new FractionEtendue(0, 1)]
    this.equationTex = ''
    if (options.format === 'reduit') {
      this.equationTex = this.printToLatexEq(this.coefficientsEqReduite)
    } else if (options.format === 'melangeReduit') {
      const tabMelange = shuffle2tableauxSansModif(this.coefficientsEqReduite.slice(0, 3), nomValDefault.slice(0, 3))
      this.equationTex = this.printToLatexEq(tabMelange[0].concat(this.coefficientsEqReduite.slice(3)), tabMelange[1].concat(nomValDefault.slice(3)))
    } else if (options.format === 'melangeSimple') {
      this.equationTex = this.printToLatexEq(...shuffle2tableauxSansModif(this.coefficientsEqReduite, nomValDefault))
    } else if (options.format === 'melangeComplique') {
      const coefficientsRevus = this.complexifyCoefficients(this.coefficients)
      const tabMelange1 = shuffle2tableauxSansModif(coefficientsRevus.slice(0, 3), nomValDefault.slice(0, 3))
      const tabMelange2 = shuffle2tableauxSansModif(coefficientsRevus.slice(3), nomValDefault.slice(3))
      const tabMelange = [tabMelange1[0].concat(tabMelange2[0]), tabMelange1[1].concat(tabMelange2[1])]
      this.equationTex = this.printToLatexEq(tabMelange[0] as FractionEtendue[], tabMelange[1] as string[])
    } else if (options.format === 'initial') {
      this.equationTex = this.printToLatexEq(this.coefficients, nomValDefault)
    }
    this.delta = this.coefficientsEqReduite[1].produitFraction(this.coefficientsEqReduite[1]).differenceFraction(this.coefficientsEqReduite[0].produitFraction(this.coefficientsEqReduite[2]).produitFraction(4))
    this.nombreSolutions = 0
    if (this.delta.num > 0) {
      this.nombreSolutions = 2
    } else if (this.delta.num === 0) {
      this.nombreSolutions = 1
    } else {
      this.nombreSolutions = 0
    }
    this.solutionsListeTex = []
    this.natureDesSolutions = ''
    if (this.nombreSolutions > 0) {
      if (this.delta.estParfaite) {
        if (this.coefficientsEqReduite[1].multiplieEntier(-1).differenceFraction(new FractionEtendue(sqrt(this.delta.num) as number, sqrt(this.delta.den) as number)).produitFraction((a.multiplieEntier(2)).inverse()).denIrred === 1) {
          this.natureDesSolutions = 'entier'
        } else {
          this.natureDesSolutions = 'fractionnaire'
        }
      } else { this.natureDesSolutions = 'irrationnel' }
      if (this.natureDesSolutions === 'entier' || this.natureDesSolutions === 'fractionnaire') {
        this.solutionsListeTex = [`${this.coefficientsEqReduite[1].multiplieEntier(-1).differenceFraction(new FractionEtendue(sqrt(this.delta.num) as number, sqrt(this.delta.den) as number)).produitFraction((this.coefficientsEqReduite[0].multiplieEntier(2)).inverse()).texFractionSimplifiee}`, `${this.coefficientsEqReduite[1].multiplieEntier(-1).sommeFraction(new FractionEtendue(sqrt(this.delta.num) as number, sqrt(this.delta.den) as number)).produitFraction((this.coefficientsEqReduite[0].multiplieEntier(2)).inverse()).texFractionSimplifiee}`]
        // parse la réponse latex en CE qui la simplifie et l'imprime
      } else if (this.natureDesSolutions === 'irrationnel') {
        const sol1Tex = `\\dfrac{-${this.coefficientsEqReduite[1].ecritureParentheseSiNegatif}+\\sqrt{${this.delta.texFSD}}}{2\\times${this.coefficientsEqReduite[0].ecritureParentheseSiNegatif}}`.replaceAll('dfrac', 'frac')
        const sol2Tex = `\\dfrac{-${this.coefficientsEqReduite[1].ecritureParentheseSiNegatif}-\\sqrt{${this.delta.texFSD}}}{2\\times${this.coefficientsEqReduite[0].ecritureParentheseSiNegatif}}`.replaceAll('dfrac', 'frac')
        this.solutionsListeTex = [ce.serialize(ce.parse(sol1Tex, { canonical: true })), ce.serialize(ce.parse(sol2Tex, { canonical: true }))]
      }
    }
    this.ensembleDeSolutionsTex = this.delta.num < 0 ? 'S=\\emptyset' : this.delta.num > 0 ? 'S = \\left\\{' + this.solutionsListeTex.join(';') + '\\right\\}' : `S=\\left\\{${this.solutionsListeTex[0]}\\right\\}`
    if (this.nombreSolutions === 0) { this.correctionTex = `On a que $\\Delta=${this.delta.texFSD}$, l'équation n'a pas de solution réelle, $${this.ensembleDeSolutionsTex}$.` } else {
      this.correctionTex = `On a que $\\Delta=${this.delta.texFSD}$, donc l'équation a ${this.nombreSolutions} solution` + (this.nombreSolutions > 1 ? 's' : '') + `, ${this.ensembleDeSolutionsTex}.`
    }
    this.correctionDetailleeTex = ''
    if (!(compareArrays(this.coefficients, this.coefficientsEqReduite))) {
      this.correctionDetailleeTex += `On commence par mettre l'équation sous la forme réduite : \\[${this.printToLatexEq(this.coefficientsEqReduite)}\\]`
    }
    this.correctionDetailleeTex += `On calcule le discriminant : \\[\\Delta=${this.coefficientsEqReduite[1].ecritureParentheseSiNegatif}^2-4\\times${this.coefficientsEqReduite[0].ecritureParentheseSiNegatif}\\times${this.coefficientsEqReduite[2].ecritureParentheseSiNegatif}=${this.delta.texFSD}.\\] On a $\\Delta=${this.delta.texFSD}$, donc `
    if (this.nombreSolutions > 1) {
      this.correctionDetailleeTex += `l'équation a deux solutions. Les solutions sont
        \\[s_{1,2}=\\dfrac{-${this.coefficientsEqReduite[1].ecritureParentheseSiNegatif}\\pm\\sqrt{${this.delta.texFSD}}}{2\\times${this.coefficientsEqReduite[0].ecritureParentheseSiNegatif}}\\]
        Ainsi, $${this.ensembleDeSolutionsTex}$.`
    } else if (this.nombreSolutions === 1) {
      this.correctionDetailleeTex += `l'équation a une solution donnée par
    \\[s=\\dfrac{-${this.coefficientsEqReduite[1].ecritureParentheseSiNegatif}}{2\\times${this.coefficientsEqReduite[0].ecritureParentheseSiNegatif}}\\]
    Ainsi, $${this.ensembleDeSolutionsTex}$.`
    } else {
      this.correctionDetailleeTex += ` l'équation n'a pas de solution réelle, $${this.ensembleDeSolutionsTex}$.`
    }
  }

  // Méthode pour créer une équation à partir des coefficients
  static aPartirDesCoefficients (a: FractionEtendue, b: FractionEtendue, c: FractionEtendue, d: FractionEtendue, e: FractionEtendue, f: FractionEtendue, options:Options): EquationSecondDegre {
    return new EquationSecondDegre(a, b, c, d, e, f, options)
  }

  // Méthode pour créer une équation à partir des solutions
  static aPartirDesSolutions (sol1: FractionEtendue, sol2: FractionEtendue, coeffLead: FractionEtendue, options: Options): EquationSecondDegre {
    const a = coeffLead
    const b = sol1.sommeFraction(sol2).multiplieEntier(-1).produitFraction(coeffLead)
    const c = sol1.produitFraction(sol2).produitFraction(coeffLead)
    const d = new FractionEtendue(0, 1)
    const e = new FractionEtendue(0, 1)
    const f = new FractionEtendue(0, 1)
    return new EquationSecondDegre(a, b, c, d, e, f, options)
  }

  // Méthode pour créer une équation à partir du type de jeu de coefficients
  // static aPartirDuTypeDesCoefficients (type: string): EquationSecondDegre {
  //   const fractionNulle = new FractionEtendue(0, 1)
  //   let coefficients: FractionEtendue[] = [fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle] // Initialiser avec tous les coefficients à 0

  //   switch (type) {
  //     case 'naturels':
  //       // Définir les coefficients pour les nombres naturels
  //       coefficients = [fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle] // Exemple de coefficients
  //       break
  //     case 'entiers':
  //       // Définir les coefficients pour les entiers
  //       coefficients = [fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle] // Exemple de coefficients
  //       break
  //     case 'décimaux':
  //       // Définir les coefficients pour les nombres décimaux
  //       coefficients = [fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle] // Exemple de coefficients
  //       break
  //     case 'fraction':
  //       // Définir les coefficients pour les fractions
  //       coefficients = [fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle] // Exemple de coefficients
  //       break
  //     default:
  //       // Par défaut, utiliser les nombres naturels si le type n'est pas reconnu
  //       coefficients = [fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle, fractionNulle] // Exemple de coefficients
  //   }

  //   return new EquationSecondDegre(coefficients[0], coefficients[1], coefficients[2], coefficients[3], coefficients[4], coefficients[5])
  // }
  // Si tous les coefficients sont de fractions entières, alors on ajoute de part et d'autre aléatoire des entiers pour complexifier l'équation et si une des fractions n'est pas entière, on ajoute des fractions entières pour complexifier l'équation
  private complexifyCoefficients (coefficients: FractionEtendue[]): FractionEtendue[] {
    const newCoefficients = coefficients
    let checkFractionEntiere = true
    for (let i = 0; i < 6; i++) {
      if (!(coefficients[i].den === 1)) {
        checkFractionEntiere = false
        break
      }
    }
    if (checkFractionEntiere) {
      for (let i = 0; i < 3; i++) {
        const ajout = new FractionEtendue(randint(-10, 10), 1)
        newCoefficients[i] = newCoefficients[i].sommeFraction(ajout)
        newCoefficients[i + 3] = newCoefficients[i + 3].sommeFraction(ajout)
      }
    } else {
      for (let i = 0; i < 3; i++) {
        const ajout = new FractionEtendue(randint(-4, 4, [0]), randint(-3, 3, [0]))
        newCoefficients[i] = newCoefficients[i].sommeFraction(ajout)
        newCoefficients[i + 3] = newCoefficients[i + 3].sommeFraction(ajout)
      }
    }
    return newCoefficients
  }

  private printToLatexEq (coeff:FractionEtendue[], nomVal: string[] = [`${this.variable}^2`, this.variable, '', `${this.variable}^2`, this.variable, '']): string {
    let expr = ''
    let checkPreviousNull = true
    for (let i = 0; i < 3; i++) {
      if ((coeff.slice(0, 3).every(item => item.num === 0)) && i === 0) {
        expr = expr + '0'
      } else if (!(coeff[i].num === 0) && checkPreviousNull) {
        if (nomVal[i] === '') {
          expr = expr + `${coeff[i].texFSD}${nomVal[i]}`
        } else {
          expr = expr + `${rienSi1(coeff[i])}${nomVal[i]}`
        }
        checkPreviousNull = false
      } else if (!(coeff[i].num === 0) && !checkPreviousNull) {
        if (nomVal[i] === '') {
          expr = expr + `${ecritureAlgebrique(coeff[i])}${nomVal[i]}`
        } else {
          expr = expr + `${ecritureAlgebriqueSauf1(coeff[i])}${nomVal[i]}`
        }
        checkPreviousNull = false
      }
    }
    expr = expr + '='
    checkPreviousNull = true
    for (let i = 3; i < 6; i++) {
      if ((coeff.slice(3).every(item => item.num === 0)) && i === 3) {
        expr = expr + '0'
      } else if (!(coeff[i].num === 0) && checkPreviousNull) {
        if (nomVal[i] === '') {
          expr = expr + `${coeff[i].texFSD}${nomVal[i]}`
        } else {
          expr = expr + `${rienSi1(coeff[i])}${nomVal[i]}`
        }
        checkPreviousNull = false
      } else if (!(coeff[i].num === 0) && !checkPreviousNull) {
        if (nomVal[i] === '') {
          expr = expr + `${ecritureAlgebrique(coeff[i])}${nomVal[i]}`
        } else {
          expr = expr + `${ecritureAlgebriqueSauf1(coeff[i])}${nomVal[i]}`
        }
        checkPreviousNull = false
      }
    }
    return expr
  }

  printToLatex (): string {
    let expr = ''
    let checkPreviousNull = true
    const nomVal = [`${this.variable}^2`, this.variable, '', `${this.variable}^2`, this.variable, '']
    for (let i = 0; i < 3; i++) {
      if ((this.coefficients.slice(0, 3).every(item => item.num === 0)) && i === 0) {
        expr = expr + '0'
      } else if (!(this.coefficients[i].num === 0) && checkPreviousNull) {
        if (nomVal[i] === '') {
          expr = expr + `${this.coefficients[i].texFSD}${nomVal[i]}`
        } else {
          expr = expr + `${rienSi1(this.coefficients[i])}${nomVal[i]}`
        }
        checkPreviousNull = false
      } else if (!(this.coefficients[i].num === 0) && !checkPreviousNull) {
        if (nomVal[i] === '') {
          expr = expr + `${ecritureAlgebrique(this.coefficients[i])}${nomVal[i]}`
        } else {
          expr = expr + `${ecritureAlgebriqueSauf1(this.coefficients[i])}${nomVal[i]}`
        }
        checkPreviousNull = false
      }
    }
    expr = expr + '='
    checkPreviousNull = true
    for (let i = 3; i < 6; i++) {
      if ((this.coefficients.slice(3).every(item => item.num === 0)) && i === 3) {
        expr = expr + '0'
      } else if (!(this.coefficients[i].num === 0) && checkPreviousNull) {
        if (nomVal[i] === '') {
          expr = expr + `${this.coefficients[i].texFSD}${nomVal[i]}`
        } else {
          expr = expr + `${rienSi1(this.coefficients[i])}${nomVal[i]}`
        }
        checkPreviousNull = false
      } else if (!(this.coefficients[i].num === 0) && !checkPreviousNull) {
        if (nomVal[i] === '') {
          expr = expr + `${this.coefficients[i].texFSD}${nomVal[i]}`
        } else {
          expr = expr + `${ecritureAlgebriqueSauf1(this.coefficients[i])}${nomVal[i]}`
        }
        checkPreviousNull = false
      }
    }
    return expr
  }
}

export default EquationSecondDegre
