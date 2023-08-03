import { fraction, matrix, parse } from 'mathjs'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { egal } from '../../modules/outils.js'
import { rationnalise } from './outilsMaths.js'

/**
 *  Classe MatriceCarree
 *  Cette classe a été crée à une époque où nous n'utilisions pas encore la librairie mathjs !
 *  Vous avez le choix d'utiliser ce code ou d'utiliser mathjs et toutes ses possibilités de calcul matriciel
 * Générateur de Matrice :
 * Si l'argument est un nombre, alors on s'en sert pour définir la taille de la matrice carrée qu'on rempli de zéros.
 * Sinon, c'est le tableau qui sert à remplir la Matrice
 *  @author Jean-Claude Lhote
 */
export class MatriceCarree {
  constructor (table) {
    let ligne
    this.table = []
    if (typeof (table) === 'number') {
      this.dim = table // si c'est un nombre qui est passé en argument, c'est la taille, et on rempli la table de 0
      for (let i = 0; i < this.dim; i++) {
        ligne = []
        for (let j = 0; j < this.dim; j++) {
          ligne.push(0)
        }
        this.table.push(ligne)
      }
    } else { // si l'argument est une table, on la copie dans this.table et sa longueur donne la dimension de la matrice
      this.dim = table.length
      for (const ligne of table) { // on copie table dans this.table, élément par élément mais en convertissant en FractionEtendue
        this.table.push([])
        for (const elt of ligne) {
          const val = rationnalise(elt)
          this.table[this.table.length - 1].push(val)
        }
      }
    }
    /**
     * Méthode : Calcule le déterminant de la matrice carrée
     * @author Jean-Claude Lhote
     */
    this.determinant = function () {
      const n = this.dim // taille de la matrice = nxn
      let determinant = new FractionEtendue(0)
      let M
      for (let i = 0; i < n; i++) { // on travaille sur la ligne du haut de la matrice :ligne 0 i est la colonne de 0 à n-1
        // if (n==1) determinant=this.table[0][0]
        if (n === 2) {
          determinant = this.table[0][0].produitFraction(this.table[1][1]).differenceFraction(this.table[1][0].produitFraction(this.table[0][1])).simplifie()
        } else {
          M = this.matriceReduite(0, i)
          determinant = determinant.sommeFraction(M.determinant().produitFraction(this.table[0][i].multiplieEntier((-1) ** i)))
        }
      }
      return determinant
    }
    /**
     * Méthode : m=M.matriceReduite(l,c) retourne une nouvelle matrice obtenue à partir de la matrice M (carrée) en enlevant la ligne l et la colonne c
     * (Utilisée dans le calcul du déterminant d'une matrice carrée.)
     * @author Jean-Claude Lhote
     */
    this.matriceReduite = function (l, c) {
      const resultat = []
      let ligne
      for (let i = 0; i < this.table.length; i++) {
        if (i !== l) {
          ligne = []
          for (let j = 0; j < this.table.length; j++) {
            if (j !== c) ligne.push(this.table[i][j])
          }
          if (ligne.length > 0) resultat.push(ligne)
        }
      }
      return matriceCarree(resultat)
    }
    /**
     * Méthode : m=M.cofacteurs() retourne la matrice des cofacteurs de M utilisée dans l'inversion de M.
     */
    this.cofacteurs = function () { // renvoie la matrice des cofacteurs.
      const n = this.dim
      let resultat = []
      let ligne
      let M
      if (n > 2) {
        for (let i = 0; i < n; i++) {
          ligne = []
          for (let j = 0; j < n; j++) {
            M = this.matriceReduite(i, j)
            ligne.push(M.determinant().multiplieEntier((-1) ** (i + j)).simplifie())
          }
          resultat.push(ligne)
        }
      } else if (n === 2) {
        resultat = [[this.table[1][1], -this.table[1][0]], [-this.table[0][1], this.table[0][0]]]
      } else return false
      return matriceCarree(resultat)
    }
    /**
     * Méthode : m=M.transposee() retourne la matrice transposée de M utilisée pour l'inversion de M
     */
    this.transposee = function () { // retourne la matrice transposée
      const n = this.dim
      const resultat = []
      let ligne
      for (let i = 0; i < n; i++) {
        ligne = []
        for (let j = 0; j < n; j++) {
          ligne.push(this.table[j][i].simplifie())
        }
        resultat.push(ligne)
      }
      return matriceCarree(resultat)
    }
    /**
     * m=M.multiplieParFraction(f) Multiplie tous les éléments de la matrice par f. Utilisée pour l'inversion de M
     * @param {FractionEtendue} f
     */
    this.multiplieParFraction = function (f) { // retourne k * la matrice
      const n = this.dim
      const resultat = []
      let ligne
      for (let i = 0; i < n; i++) {
        ligne = []
        for (let j = 0; j < n; j++) {
          const f2 = new FractionEtendue(this.table[i][j])
          ligne.push(f2.produitFraction(f).simplifie())
        }
        resultat.push(ligne)
      }
      return matriceCarree(resultat)
    }
    /**
     * m=M.multiplieParReel(k) Multiplie tous les éléments de la matrice par k. Utilisée pour l'inversion de M
     * @param {*} k
     */
    this.multiplieParReel = function (k) { // retourne k * la matrice on essaye de convertir k en FractionEtendue
      const n = this.dim
      k = fraction(k.toFixed(2))
      k = new FractionEtendue(k.s * k.n, k.d)
      const resultat = []
      let ligne
      for (let i = 0; i < n; i++) {
        ligne = []
        for (let j = 0; j < n; j++) {
          ligne.push(k.produitFraction(this.table[i][j]).simplifie())
        }
        resultat.push(ligne)
      }
      return matriceCarree(resultat)
    }
    
    /**
     * Méthode : Calcule le produit d'une matrice nxn par un vecteur 1xn (matrice colonne): retourne un vecteur 1xn.
     *
     */
    this.multiplieVecteur = function (V) { // Vecteur est un simple array pour l'instant
      const n = this.dim
      const resultat = []
      let somme
      if (n === V.length) {
        for (let i = 0; i < n; i++) {
          somme = new FractionEtendue(0)
          for (let j = 0; j < n; j++) {
            V[j] = rationnalise(V[j])
            somme = somme.sommeFraction(this.table[i][j].produitFraction(V[j])).simplifie()
          }
          resultat.push(somme)
        }
        return resultat
      } else return false
    }
    /**
     * Méthode : m=M.inverse() Retourne la matrice inverse de M. Utilisation : résolution de systèmes linéaires
     */
    this.inverse = function () { // retourne la matrice inverse (si elle existe)
      const d = this.determinant()
      if (!egal(d, 0)) {
        return this.cofacteurs().transposee().multiplieParFraction(d.inverse().simplifie())
      } else return false
    }
    /**
     * Méthode : m=M.multiplieMatriceCarree(P) : retourne m = M.P
     *
     */
    this.multiplieMatriceCarree = function (M) {
      const n = this.dim
      const resultat = []
      let ligne
      let somme
      for (let i = 0; i < n; i++) {
        ligne = []
        for (let j = 0; j < n; j++) {
          somme = new FractionEtendue(0)
          for (let k = 0; k < n; k++) {
            somme = somme.sommeFraction(this.table[i][k].produitFraction(M.table[k][j]).simplifie())
          }
          ligne.push(somme.simplifie())
        }
        resultat.push(ligne)
      }
      return matriceCarree(resultat)
    }
    this.toTex = function () {
      let matrice = this.table
      matrice = matrix(matrice)
      matrice = matrice.toString()
      matrice = parse(matrice).toTex().replaceAll('bmatrix', 'pmatrix')
      return matrice
    }
  }
}

/**
 * Crée une nouvelle instance de la classe MatriceCarree à partir d'un tableau.
 *
 */
export function matriceCarree (table) {
  return new MatriceCarree(table)
}
