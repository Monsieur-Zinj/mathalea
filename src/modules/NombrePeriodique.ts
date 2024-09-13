// Classe pour les nombres périodiques

import { miseEnEvidence } from '../lib/outils/embellissements'
import FractionEtendue from './FractionEtendue'

class NombrePeriodique {
  partieEntiere: number
  partieDecimale: number
  periode: number
  fractionEntiere: FractionEtendue
  fractionDecimale: FractionEtendue
  fractionPeriode: FractionEtendue
  numberOfNines: number
  fractionJustePeriode: FractionEtendue
  constructor (partieEntiere: number, partieDecimale: number, periode: number) {
    this.partieEntiere = partieEntiere
    this.partieDecimale = partieDecimale
    this.periode = periode
    this.fractionEntiere = new FractionEtendue(this.partieEntiere, 1)
    this.fractionDecimale = new FractionEtendue(this.partieDecimale, 10 ** this.partieDecimale.toString().length)
    if (this.partieDecimale === -1) {
      this.fractionDecimale = new FractionEtendue(0, 1)
    }
    this.numberOfNines = this.periode.toString().length
    if (partieDecimale === -1) {
      this.fractionPeriode = new FractionEtendue(this.periode, 10 ** this.numberOfNines - 1)
    } else {
      this.fractionPeriode = new FractionEtendue(this.periode, 10 ** this.numberOfNines - 1).entierDivise(10 ** this.partieDecimale.toString().length)
    }
    this.fractionJustePeriode = new FractionEtendue(this.periode, 10 ** this.numberOfNines - 1)
  }

  toString () {
    return `${this.partieEntiere}, ${this.partieDecimale === -1 ? '' : this.partieDecimale}${this.periode === 0 ? '' : `\\overline{${this.periode}}`}`
  }

  toFraction () : FractionEtendue {
    // generate a number with the same number of 9 in the denominator as the number of digits in the period
    // différence si partie littérale est -1 ou 0 à implémenter
    if (this.partieDecimale === -1) {
      return this.fractionEntiere.sommeFraction(this.fractionPeriode).simplifie()
    } else {
      return this.fractionEntiere.sommeFraction(this.fractionDecimale).sommeFraction(this.fractionJustePeriode.diviseFraction(new FractionEtendue(10 ** (this.partieDecimale.toString().length), 1))).simplifie()
    }
  }

  toFractionProcedure () : string {
    let procedure = ''
    const nombreSansPeriode = `${this.partieEntiere} ${this.partieDecimale === -1 ? '' : `,${this.partieDecimale}`}`
    // Nombre de zéros égalent à la longueur de la partie décimale
    const nombreZeros = '0'.repeat(this.partieDecimale === -1 ? 0 : this.partieDecimale.toString().length)
    const justePeriode = `0,${nombreZeros}\\overline{${this.periode}}`
    const justePeriodeApresVirgule = `0,\\overline{${this.periode}}`
    if (this.partieDecimale !== -1 || this.partieEntiere !== 0) {
      procedure += `On commence par écrire le nombre sous forme $${this.toString()}={\\color{green}${nombreSansPeriode}}+{\\color{blue}${justePeriode}}$. `
      if (this.partieDecimale !== -1) {
        procedure += `On convertit ensuite chaque terme en fraction. On a : <br> \\[{\\color{green}${nombreSansPeriode}=${this.fractionEntiere.sommeFraction(this.fractionDecimale).texFraction}${this.fractionEntiere.sommeFraction(this.fractionDecimale).estIrreductible ? '' : `=${this.fractionEntiere.sommeFraction(this.fractionDecimale).texFractionSimplifiee}`}}\\]`
      }
    }
    procedure += `<br> On transforme $${justePeriode}$ en écriture fractionnaire. `
    if (this.partieDecimale !== -1) {
      procedure += ` On commence par écrire $${justePeriodeApresVirgule}$ en fraction. `
    }
    procedure += `On a : \\[${justePeriodeApresVirgule}=\\dfrac{${this.periode}}{${'9'.repeat(this.numberOfNines)}}${(this.partieDecimale === -1 && new FractionEtendue(this.periode, 10 ** this.periode.toString().length - 1).estIrreductible === false) ? `=${new FractionEtendue(this.periode, 10 ** this.periode.toString().length - 1).texFractionSimplifiee}` : ''}\\]`
    if (this.partieDecimale !== -1) {
      procedure += `Par ailleurs $${justePeriode}=${justePeriodeApresVirgule}${this.partieDecimale === -1 ? '' : `: 10{${this.partieDecimale.toString().length >= 2 ? `^${this.partieDecimale.toString().length}` : ''}}`}.$ Ainsi : \\[{\\color{blue}${justePeriode}=${justePeriodeApresVirgule}${this.partieDecimale === -1 ? '' : `: 10{${this.partieDecimale.toString().length >= 2 ? `^${this.partieDecimale.toString().length}` : ''}}`} =${this.fractionJustePeriode.diviseFraction(new FractionEtendue(10 ** (this.partieDecimale.toString().length), 1)).texFraction}=${this.fractionJustePeriode.diviseFraction(new FractionEtendue(10 ** (this.partieDecimale.toString().length), 1)).texFractionSimplifiee}}\\]`
    }
    if (this.partieDecimale !== -1 || this.partieEntiere !== 0) {
      procedure += `On additionne les fractions obtenues et on réduit le résultat pour obtenir la fraction irréductible de $${this.toString()}$.\\[${this.toString()}={\\color{green}${this.fractionEntiere.sommeFraction(this.fractionDecimale).texFractionSimplifiee}} +{\\color{blue}${this.fractionPeriode.texFractionSimplifiee}}=${miseEnEvidence(this.toFraction().texFraction)}\\]`
    }
    if (this.partieDecimale === -1 && this.partieEntiere === 0) {
      procedure += `Ainsi : \\[${justePeriodeApresVirgule}=${miseEnEvidence(new FractionEtendue(this.periode, 10 ** this.periode.toString().length - 1).texFractionSimplifiee)}\\]`
    }
    return procedure
  }
}
export default NombrePeriodique
