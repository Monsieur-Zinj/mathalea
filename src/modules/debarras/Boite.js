import { point } from '../../lib/2d/points.js'
import { colorToLatexOrHTML } from '../2dGeneralites.js'
import { latexParCoordonnees, texteParPositionEchelle } from '../../lib/2d/textes.js'
import { polygone } from '../../lib/2d/polygones.js'

/**
 * Objet composé d'un rectangle horizontal et d'un texte optionnel à l'intérieur
 * Les paramètres sont les suivants :
 * Xmin, Ymin : coordonnées du sommet en bas à gauche
 * Xmax,Ymax : coordonnées du sommet en haut à droite
 * color : la couleur de la bordure
 * colorFill : 'none' sinon, la couleur de remplissage (exemple : 'orange') Code couleur HTML accepté
 * opaciteDeRemplissage : valeur de 0 (transparent) à 1 (opaque)
 * texteIn : texte à mettre à l'intérieur
 * tailleTexte : comme son nom l'indique la taille du texte (1 par défaut)
 * texteColor : sa couleur
 * textMath : un booléen qui détermine la police (true -> Book Antiqua Italic)
 * echelleFigure : pour passer la valeur de scale de tikzPicture (valeur scale de la commande mathalea) afin d'adapter la taille du texte dans la boite à la résolution
 * @class
 * @author Jean-Claude Lhote
 */
export class Boite {
  constructor ({
    Xmin = 0,
    Ymin = 0,
    Xmax = 1,
    Ymax = 1,
    color = 'black',
    colorFill = 'none',
    opaciteDeRemplissage = 0.7,
    texteIn = '',
    tailleTexte = 1,
    texteColor = 'black',
    texteOpacite = 0.7,
    texteMath = false,
    echelleFigure = 1
  } = {}) {
    // ObjetMathalea2D.call(this, {}) rectification due aux latexParCoordonnees() qui ne sont plus des ObjetsMathalea2d comme les autres
    // Jean-Claude Lhote 15/08/2023
    this.forme = polygone([point(Xmin, Ymin), point(Xmax, Ymin), point(Xmax, Ymax), point(Xmin, Ymax)], color)
    this.bordures = this.forme.bordures
    if (colorFill !== 'none') {
      this.forme.couleurDeRemplissage = colorToLatexOrHTML(colorFill)
      this.forme.opaciteDeRemplissage = opaciteDeRemplissage
    }
    if (texteIn !== '') {
      if (texteIn.charAt(0) === '$') {
        this.texte = latexParCoordonnees(texteIn.replaceAll('$', ''), (Xmin + Xmax) / 2, (Ymin + Ymax) / 2, texteColor)
      } else {
        this.texte = texteParPositionEchelle(texteIn, (Xmin + Xmax) / 2, (Ymin + Ymax) / 2, 'milieu', texteColor, tailleTexte, 'middle', texteMath, echelleFigure)
        this.texte.opacite = texteOpacite
      }
    } else {
      this.texte = false
    }
    return this.texte ? [this.texte, this.forme] : this.forme
  }
}

/**
 * Crée un rectangle positionné horizontal/vertical avec possibilité d'écrire du texte dedans
 * @param {number} [Xmin = 0] abscisse du sommet en bas à gauche
 * @param {number} [Ymin = 0] ordonnée du sommet en bas à gauche
 * @param {number} [Xmax = 1] abscisse du sommet en haut à droite
 * @param {number} [Ymax = 1] ordonnée du sommet en haut à droite
 * @param {string} [color = 'black'] couleur du cadre
 * @param {string} [colorFill = 'none'] couleur de remplissage
 * @param {number} [opaciteDeRemplissage = 0.7] comme son nom l'indique utilisé si colorFill !== 'none'
 * @param {string} texteIn Texte à afficher (On peut passer du latex si texteIn commence et finit par $)
 * @param {number} [tailleTexte = 1] permet de modifier la taille du texteIn
 * @param {string} [texteColor = 'black'] permet de choisir la couleur du texteIn
 * @param {number} [texteOpacite = 0.7] indice d'opacité du texte de 0 à 1
 * @param {boolean} [texteMa = false] Si le texte n'est pas du latex, change la police pour mettre un style mathématique si true
 * @param {number} [echelleFigure = 1] permet de passer le scale utilisé dans la fonction mathalea2d afin d'adapter la taille du texte en latex
 * @return {Boite}
 * @author Jean-Claude Lhote
 */
export function boite ({
  Xmin = 0,
  Ymin = 0,
  Xmax = 1,
  Ymax = 1,
  color = 'black',
  colorFill = 'none',
  opaciteDeRemplissage = 0.7,
  texteIn = '',
  tailleTexte = 1,
  texteColor = 'black',
  texteOpacite = 0.7,
  texteMath = false,
  echelleFigure = 1
} = {}) {
  return new Boite({
    Xmin,
    Ymin,
    Xmax,
    Ymax,
    color,
    colorFill,
    opaciteDeRemplissage,
    texteIn,
    tailleTexte,
    texteColor,
    texteOpacite,
    texteMath,
    echelleFigure
  })
}
