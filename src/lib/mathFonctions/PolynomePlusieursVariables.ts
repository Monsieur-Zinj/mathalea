import FractionEtendue from '../../modules/FractionEtendue'
import { randint } from '../../modules/outils'
import { shuffle } from '../outils/arrayOutils'
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
    // order the monomials by increasing degree
    monomesNew.sort((a, b) => {
      return a.degre - b.degre
    })

    return new PolynomePlusieursVariables(monomesNew)
  }

  // Créer un polynome aléatoire de degré donné avec le nombre de terme donné en paramètre. Il faudrait également ajouter un paramètre pour le type de coefficient, les variables et si on veut spécifier un ou plusieurs monômes (parties littérales) particuliers qui doivent être inclus dans le polynôme
  static createRandomPolynome (degMin: number, degMax: number, nbTermes: number, typeCoeff: string, variables: string[], monomes: MonomePlusieursVariables[] = []): PolynomePlusieursVariables {
    const monomesListe = []
    // Add a check to make sure that all the monomials have a different literal part
    for (let i = 0; i < nbTermes; i++) {
      if (monomes.length > i) {
        monomesListe.push(MonomePlusieursVariables.createMonomeFromPartieLitterale(typeCoeff, monomes[i].partieLitterale))
      } else {
        let isSemblable = false
        do {
          const m = MonomePlusieursVariables.createRandomMonome(randint(0, degMax), typeCoeff, variables)
          isSemblable = false
          // check if m is not sembable with any of the monomes in monomesListe
          for (let j = 0; j < monomesListe.length; j++) {
            if (m.estSemblable(monomesListe[j])) {
              isSemblable = true
              break
            }
          }
          if (!isSemblable) {
            monomesListe.push(m)
          }
        } while (isSemblable)
      }
    }
    shuffle(monomesListe)
    return new PolynomePlusieursVariables(monomesListe)
  }

  static createPolynomeFromMonome (monome: MonomePlusieursVariables): PolynomePlusieursVariables {
    return new PolynomePlusieursVariables(monome)
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

    return PolynomePlusieursVariables.PolynomeNonReduit(nouveauxMonomes)
  }

  oppose (): PolynomePlusieursVariables {
    const nouveauxMonomes = this.monomes.map(monome => monome.oppose())
    return PolynomePlusieursVariables.PolynomeNonReduit(nouveauxMonomes)
  }

  // Une méthode pour déterminer si un terme est un carré
  // Pas encore terminée
  contientCarre (): boolean {
    let estCarre = false
    // check if a coefficient is a square
    for (let i = 0; i < this.monomes.length; i++) {
      if (this.monomes[i].coefficient.num === this.monomes[i].coefficient.den ** 2) {
        estCarre = true
        break
      }
    }
    return estCarre
  }

  // Générer des identités remarquables sans avoir de carré dans les termes de départ

  difference (p: PolynomePlusieursVariables | MonomePlusieursVariables): PolynomePlusieursVariables {
    const nouveauxMonomes = [...this.monomes]
    if (p instanceof PolynomePlusieursVariables) {
      (p.produit(new MonomePlusieursVariables(new FractionEtendue(-1, 1), { variables: [], exposants: [] }))).monomes.forEach(monome => nouveauxMonomes.push(monome))
    } else {
      nouveauxMonomes.push(p.produit(new MonomePlusieursVariables(new FractionEtendue(-1, 1), { variables: [], exposants: [] })))
    }

    return PolynomePlusieursVariables.PolynomeNonReduit(nouveauxMonomes)
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
    return PolynomePlusieursVariables.PolynomeNonReduit(nouveauxMonomes)
  }

  // Réduit le PolynomePlusieursVariables en combinant les monomes semblables
  reduire (): PolynomePlusieursVariables {
    const reduit = PolynomePlusieursVariables.PolynomeReduit(this.monomes)
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
