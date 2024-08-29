import MonomePlusieursVariables from './MonomePlusieursVariables'

class PolynomePlusieursVariables {
  monomes: MonomePlusieursVariables[]

  constructor (monomes: MonomePlusieursVariables[] | MonomePlusieursVariables) {
    this.monomes = Array.isArray(monomes) ? monomes : [monomes]
  }

  static PolynomeNonReduit (monomes: MonomePlusieursVariables[]): PolynomePlusieursVariables {
    return new PolynomePlusieursVariables(monomes)
  }

  static PolynomeReduit (monomes: MonomePlusieursVariables[]): PolynomePlusieursVariables {
    const monomesNew: MonomePlusieursVariables[] = []

    monomes.forEach(monome => ajouterMonome(monome))

    function ajouterMonome (monome: MonomePlusieursVariables): void {
      const index = monomesNew.findIndex(m => m.estSemblable(monome))
      if (index !== -1) {
        monomesNew[index] = monomesNew[index].somme(monome)
        if (monomesNew[index].coefficient.num === 0) {
          monomesNew.splice(index, 1)
        }
      } else {
        monomesNew.push(monome)
      }
    }

    return new PolynomePlusieursVariables(monomesNew)
  }

  // Ajoute un monome au PolynomePlusieursVariables, en combinant avec les monomes semblables

  // Additionne deux PolynomePlusieursVariabless ou un PolynomePlusieursVariables et un monome
  somme (p: PolynomePlusieursVariables | MonomePlusieursVariables): PolynomePlusieursVariables {
    const nouveauxMonomes = [...this.monomes]

    if (p instanceof PolynomePlusieursVariables) {
      p.monomes.forEach(monome => nouveauxMonomes.push(monome))
    } else {
      nouveauxMonomes.push(p)
    }

    return new PolynomePlusieursVariables(nouveauxMonomes)
  }

  // Multiplie deux PolynomePlusieursVariabless ou un PolynomePlusieursVariables et un monome
  produit (p: PolynomePlusieursVariables | MonomePlusieursVariables): PolynomePlusieursVariables {
    const nouveauxMonomes: MonomePlusieursVariables[] = []

    if (p instanceof PolynomePlusieursVariables) {
      this.monomes.forEach(monome1 => {
        p.monomes.forEach(monome2 => {
          nouveauxMonomes.push(monome1.produit(monome2))
        })
      })
    } else {
      this.monomes.forEach(monome => {
        nouveauxMonomes.push(monome.produit(p))
      })
    }
    return new PolynomePlusieursVariables(nouveauxMonomes)
  }

  // Réduit le PolynomePlusieursVariables en combinant les monomes semblables
  reduire (): PolynomePlusieursVariables {
    const reduit = new PolynomePlusieursVariables(this.monomes)
    return reduit
  }

  // Convertit le polynome en une chaîne de caractères
  toString (): string {
    if (this.monomes.length === 0) return '0'
    let result = ''
    this.monomes.forEach((monome, index) => {
      const monomeStr = monome.toString() // Gets the string representation of the monomial

      if (monome.coefficient.num === 0) {
        return // Ignore zero terms
      }
      // Handle the first term separately
      if (index === 0) {
        result += monomeStr
      } else {
        if (monome.coefficient.signe === 1) {
          result += ' + ' + monomeStr
        } else {
          result += monomeStr
        }
      }
    })

    return result
  }
}

export default PolynomePlusieursVariables
