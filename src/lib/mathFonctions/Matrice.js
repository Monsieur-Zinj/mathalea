import { create, all } from 'mathjs'
import { rangeMinMax } from '../outils/nombres'
const config = {
  epsilon: 1e-12,
  matrix: 'Array',
  number: 'Fraction',
  precision: 64,
  predictable: false,
  randomSeed: null
}
const math = create(all, config)

/**
 *  Classe MatriceCarree
 *  Cette classe a été crée à une époque où nous n'utilisions pas encore la librairie mathjs !
 *  Vous avez le choix d'utiliser ce code ou d'utiliser mathjs et toutes ses possibilités de calcul matriciel
 * Générateur de Matrice :
 * Si l'argument est un nombre, alors on s'en sert pour définir la taille de la matrice carrée qu'on rempli de zéros.
 * Sinon, c'est le tableau qui sert à remplir la Matrice
 *  @author Jean-Claude Lhote
 */
export class Matrice extends math.matrix {
  constructor (table) {
    super(table)
    this.dim = this._size[0]
    this.determinant = function () {
      return math.det(this)
    }

    this.inverse = function () {
      if (math.det(this) !== 0) return matrice(math.inv(this).valueOf())
      return new Matrice(math.zeros(...this._size).valueOf())
    }

    this.transpose = function () {
      return matrice(math.transpose(this).valueOf())
    }

    this.multiply = function (v) {
      const produit = math.multiply(this, v)
      if (!Array.isArray(produit._data[0])) return produit // Si les éléments de produit ne sont pas des array alors on a un vecteur
      return matrice(produit) // sinon, c'est une matrice et on lui colle les méthodes de MatriceCarree
    }

    this.add = function (m) {
      return matrice(math.add(this, m).valueOf()) // On repasse le tableau au constructeur pour ajouter les méthodes de cette classe
    }

    this.divide = function (k) {
      return matrice(math.divide(this, k).valueOf()) // On repasse le tableau au constructeur pour ajouter les méthodes de cette classe
    }
    this.toTex = function () {
      return math.parse(this.toString()).toTex().replaceAll('bmatrix', 'pmatrix')
    }
    this.texDet = function () {
      let content = ''
      for (let arrIndex = 0; arrIndex < this._data.length; arrIndex++) {
        content += `${this._data[arrIndex].join(' & ')}`
        if (arrIndex < this._data.length - 1) content += '\\\\'
      }
      return `\\begin{vmatrix}\n${content}\n\\end{vmatrix}`
    }
    this.reduite = function (l, c) {
      const lignes = rangeMinMax(0, this.dim - 1, l)
      const colonnes = rangeMinMax(0, this.dim - 1, c)
      return matrice(this.subset(math.index(lignes, colonnes)).valueOf())
    }
  }
}
export function matrice (table) {
  if (Array.isArray(table || typeof table === 'number')) return new Matrice(table)
  else if (table._data != null) {
    return new Matrice(table._data)
  }
}
