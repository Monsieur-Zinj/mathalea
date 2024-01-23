import { fixeBordures } from '../../modules/2dGeneralites.js'
import { milieu, point, Point } from './points.js'
import { polygone, polyline } from './polygones.js'
import { segment } from './segmentsVecteurs.js'
import { latexParCoordonnees, texteParPosition } from './textes.js'
import { context } from '../../modules/context.js'
import { stringNombre, texNombre } from '../outils/texNombre'
import { AddTabDbleEntryMathlive } from '../interactif/tableaux/AjouteTableauMathlive'
import { randint } from '../../modules/outils.js'

/**
 * fonction utilisée par la classe Tableau pour créer une flèche
 * Pour l'objet texte : si texte.latex est true, alors les autres paramètres sont ignorés et tout le formatage doit être contenu dans texte
 * Si texte.latex est false, alors c'est texteParPosition qui est utilisé avec possibilité de mise en gras, en caractères spéciaux, en couleur
 * @param {Point} D
 * @param {Point} A
 * @param {object} texte {texte: string, gras: boolean = false, math:boolean= true, latex: boolean=false, color:string='black'}
 * @param {string} [texte.texte]
 * @param {boolean?} [texte.gras]
 * @param {boolean?} [texte.math]
 * @param {boolean?} [texte.latex]
 * @param {string?} [texte.color]
 * @param {number} h
 * @returns {array} (Polyline|Segment|TexteParPoint)[]
 * @author Rémi Angot
 */
function flecheH (D, A, texte, h = 1) {
  const D1 = new Point(D.x, D.y + h)
  const A1 = point(A.x, A.y + h)
  const fleche = polyline(D, D1, A1)
  const eFleche = segment(A1, A)
  eFleche.styleExtremites = '->'
  const M = milieu(D1, A1)
  const objets = [fleche, eFleche]
  let t
  if (texte) {
    const color = texte.color ?? 'black'
    if (texte.latex) {
      t = latexParCoordonnees(texte.texte, M.x, M.y + (h > 0 ? 0.5 : -0.8), color, 50, 20, '', 10)
    } else {
      const math = texte.math ?? false
      t = texteParPosition(texte.texte, M.x, M.y + (h > 0 ? 0.5 : -0.8), 'milieu', color, 1, 'middle', math)
      t.gras = texte.gras ?? false
    }
    objets.push(t)
  }
  return objets
}

/**
 * fonction utilisée par la classe Tableau pour créer une flèche
 * Pour l'objet texte : si texte.latex est true, alors les autres paramètres sont ignorés et tout le formatage doit être contenu dans texte
 * Si texte.latex est false, alors c'est texteParPosition qui est utilisé avec possibilité de mise en gras, en caractères spéciaux, en couleur* @param {Point} D
 * @param {Point} A
 * @param {Point} D
 * @param {object} texte {texte: string, gras: boolean = false, math:boolean= true, latex: boolean=false, color:string='black'}
 * @param {string} [texte.texte]
 * @param {boolean} [texte.gras]
 * @param {boolean} [texte.math]
 * @param {boolean} [texte.latex]
 * @param {number} h
 * @param {string} [texte.color]* @param {number} h
 * @param {boolean} flip Pour pouvoir faire des flèches à gauche et pas à droite
 * @returns {array} (Polyline|Segment|TexteParPoint)[]
 * @author Rémi Angot
 */
function flecheV (D, A, texte, h = 1, flip = false) {
  if (flip) h = -h
  const D1 = point(D.x + h, D.y)
  const A1 = point(A.x + h, A.y)
  const fleche = polyline(D, D1, A1)
  const eFleche = segment(A1, A)
  eFleche.styleExtremites = '->'
  const M = milieu(D1, A1)
  const objets = [fleche, eFleche]
  let t
  const color = texte.color ?? 'black'
  const math = texte.math ?? false
  if (texte) {
    if (texte.latex) {
      t = latexParCoordonnees(texte.texte, M.x + h, M.y - 0.6, color, 50, 20, '', 10)
    } else {
      t = texteParPosition(texte.texte, M.x + h, M.y - 0.6, flip ? 'droite' : 'milieu', color, 1, 'middle', math)
      t.gras = texte.gras ?? false
    }
    objets.push(t)
  }
  return objets
}

export class Tableau {
  /**
   * Réalise un tableau typique des exercices de proportionnalité avec d'éventuelles flèches
   * @param  {object} tab
   * @param { number } [tab.largeurTitre]
   * @param { number? } [tab.largeur]
   * @param { number? } [tab.hauteur]
   * @param { number? } [tab.nbColonnes]
   * @param { Point? } [tab.origine]
   * Pour les objets de ligne1 et ligne2 (appelés texte ci-après): si texte.latex est true, alors les autres paramètres sont ignorés et tout le formatage doit être contenu dans texte
   * Si texte.latex est false, alors c'est texteParPosition qui est utilisé avec possibilité de mise en gras, en caractères spéciaux, en couleur
   * @param { {texte: string, latex?: boolean, gras?: boolean, color?: string}[] } tab.ligne1 contient des objets avec {texte: string, gras: boolean= false; color: string = 'black', latex: boolean}
   * @param { {texte: string, latex?: boolean, gras?: boolean, color?: string}[] } tab.ligne2 contient des objets avec {texte: string, gras: boolean= false; color: string = 'black', latex: boolean}
   * @param { [number, number, string][]? } [tab.flecheHaut]
   * @param { [number, number, string][]? } [tab.flecheBas]
   * @param { string | boolean? } [tab.flecheDroite]
   * @param { string? } [tab.flecheDroiteSens]
   * @param { string | boolean? } [tab.flecheGauche]
   * @param { string? } [tab.flecheGaucheSens]
   * @constructor
   * @author Rémi Angot
   */
  constructor ({
    largeurTitre = 7,
    largeur = 3,
    hauteur = 2,
    nbColonnes = 3,
    origine = point(0, 0),
    ligne1, // des strings contenant du latex sans les $ $
    ligne2, // des strings contenant du latex sans les $ $
    flecheHaut = [], // [[1, 2, '\\times 6,4', 3], [2, 3, '\\div 6']]
    flecheBas = [],
    flecheDroite = false, // à remplacer par un string
    flecheDroiteSens = 'bas',
    flecheGauche = false,
    flecheGaucheSens = 'haut'
  }) {
    // ObjetMathalea2D.call(this, {}) rectification due aux latexParCoordonnees() qui ne sont plus des ObjetsMathalea2d comme les autres
    // Jean-Claude Lhote 15/08/2023
    if (ligne1 && ligne2 && Array.isArray(ligne1) && Array.isArray(ligne2)) {
      nbColonnes = Math.max(ligne1.length, ligne2.length, nbColonnes)
    }
    const A = origine
    const B = point(A.x + largeurTitre + largeur * (nbColonnes - 1), A.y)
    const C = point(B.x, B.y + 2 * hauteur)
    const D = point(A.x, A.y + 2 * hauteur)
    // ABCD est le cadre extérieur (A en bas à gauche et B en bas à droite)
    const objets = []
    objets.push(polygone(A, B, C, D))
    objets.push(segment(point(A.x, A.y + hauteur), point(B.x, B.y + hauteur)))
    // trait horizontal au milieu
    let x = A.x + largeurTitre
    // x est l'abscisse de la première séparation verticale
    // Ecrit le texte dans les colonnes
    for (let i = 0; i < nbColonnes; i++) {
      objets.push(segment(point(x, A.y), point(x, C.y)))
      if (ligne1[i + 1]) {
        if (ligne1[i + 1].latex) { // on utilise latexParCoordonnees() tant pis pour le zoom qui devient impossible !
          objets.push(latexParCoordonnees(ligne1[i + 1].texte ?? '', x + largeur / 2, A.y + 1.4 * hauteur, 'black', largeur * 8, 20, '', 10))
        } else {
          const color = ligne1[i + 1].color ?? 'black'
          const math = ligne1[i + 1].math ?? false
          const texte = texteParPosition(ligne1[i + 1].texte ?? '', x + largeur / 2, A.y + 1.4 * hauteur, 'milieu', color, 1.2, 'middle', math)
          texte.gras = ligne1[i + 1].gras ?? false
          objets.push(texte)
        }
      }
      if (ligne2[i + 1]) {
        if (ligne2[i + 1].latex) {
          objets.push(latexParCoordonnees(ligne2[i + 1].texte ?? '', x + largeur / 2, A.y + 0.4 * hauteur, 'black', largeur * 8, 20, '', 10))
        } else {
          const color = ligne2[i + 1].color ?? 'black'
          const math = ligne2[i + 1].math ?? false
          const texte = texteParPosition(ligne2[i + 1].texte ?? '', x + largeur / 2, A.y + 0.4 * hauteur, 'milieu', color, 1.2, 'middle', math)
          texte.gras = ligne2[i + 1].gras ?? false
          objets.push(texte)
        }
      }
      x += largeur
    }
    // Ecrit les titres
    if (ligne1[0]) {
      if (ligne1[0].latex) { // on utilise latexParCoordonnees() tant pis pour le zoom qui devient impossible !
        objets.push(latexParCoordonnees(ligne1[0].texte ?? '', A.x + largeurTitre / 2, A.y + 1.4 * hauteur, 'black', largeur * 8, 20, '', 10))
      } else {
        const color = ligne1[0].color ?? 'black'
        const math = ligne1[0].math ?? false
        const texte = texteParPosition(ligne1[0].texte ?? '', A.x + largeurTitre / 2, A.y + 1.4 * hauteur, 'milieu', color, 1.2, 'middle', math)
        texte.gras = ligne1[0].gras ?? false
        objets.push(texte)
      }
    }
    if (ligne2[0]) {
      if (ligne2[0].latex) { // on utilise latexParCoordonnees() tant pis pour le zoom qui devient impossible !
        objets.push(latexParCoordonnees(ligne2[0].texte ?? '', A.x + largeurTitre / 2, A.y + 0.4 * hauteur, 'black', largeur * 8, 20, '', 10))
      } else {
        const color = ligne2[0].color ?? 'black'
        const math = ligne2[0].math ?? false
        const texte = texteParPosition(ligne2[0].texte ?? '', A.x + largeurTitre / 2, A.y + 0.4 * hauteur, 'milieu', color, 1.2, 'middle', math)
        texte.gras = ligne2[0].gras ?? false
        objets.push(texte)
      }
    }
    for (const fleche of flecheHaut) {
      const Depart = point(A.x + largeurTitre + fleche[0] * largeur - 0.4 * largeur, A.y + 2.1 * hauteur)
      const Arrivee = point(A.x + largeurTitre + fleche[1] * largeur - 0.6 * largeur, A.y + 2.1 * hauteur)
      if (fleche[3]) {
        objets.push(...flecheH(Depart, Arrivee, fleche[2], fleche[3]))
      } else {
        objets.push(...flecheH(Depart, Arrivee, fleche[2]))
      }
    }
    for (const fleche of flecheBas) {
      const Depart = point(A.x + largeurTitre + fleche[0] * largeur - 0.4 * largeur, A.y - 0.1 * hauteur)
      const Arrivee = point(A.x + largeurTitre + fleche[1] * largeur - 0.6 * largeur, A.y - 0.1 * hauteur)
      let hFleche
      if (fleche[3]) {
        hFleche = -Math.abs(fleche[3])
      } else {
        hFleche = -1
      }
      objets.push(...flecheH(Depart, Arrivee, fleche[2], hFleche))
    }
    if (flecheDroite) {
      const Depart = point(A.x + largeurTitre + (nbColonnes - 1) * largeur + 0.2, A.y + 1.5 * hauteur)
      const Arrivee = point(A.x + largeurTitre + (nbColonnes - 1) * largeur + 0.2, A.y + 0.5 * hauteur)
      if (flecheDroiteSens === 'bas') {
        objets.push(...flecheV(Depart, Arrivee, flecheDroite))
      } else {
        objets.push(...flecheV(Arrivee, Depart, flecheDroite))
      }
      const { xmin, ymin, xmax, ymax } = fixeBordures(objets)
      this.bordures = [xmin, ymin, xmax, ymax]
    }
    if (flecheGauche) {
      const Depart = point(A.x, A.y + 1.5 * hauteur)
      const Arrivee = point(A.x, A.y + 0.5 * hauteur)
      if (flecheGaucheSens === 'bas') {
        objets.push(...flecheV(Depart, Arrivee, flecheGauche, 1, true))
      } else {
        objets.push(...flecheV(Arrivee, Depart, flecheGauche, 1, true))
      }
    }
    const { xmin, ymin, xmax, ymax } = fixeBordures(objets)
    this.bordures = [xmin, ymin, xmax, ymax]
    /*
      this.svg = function (coeff) {
        let code = ''
        for (const objet of objets) {
          code += '\n\t' + objet.svg(coeff)
        }
        code = `<g id="${this.id}">${code}</g>`
        return code
      }
        this.tikz = function () {
          let code = ''
          for (const objet of objets) {
            code += '\n\t' + objet.tikz()
          }
          return code
        }
        this.svgml = function (coeff, amp) {
          let code = ''
          for (const objet of objets) {
            if (typeof (objet.svgml) === 'undefined') code += '\n\t' + objet.svg(coeff)
            else code += '\n\t' + objet.svgml(coeff, amp)
          }
          return code
        }
        this.tikzml = function (amp) {
          let code = ''
          for (const objet of objets) {
            if (typeof (objet.tikzml) === 'undefined') code += '\n\t' + objet.tikz()
            else code += '\n\t' + objet.tikzml(amp)
          }
          return code
        }
         */
    return objets
  }
}
export function tableau (...args) {
  return new Tableau(...args)
}

/**
 * Crée un tableau avec un nombre de lignes et de colonnes déterminées
 * par la longueur des tableaux des entetes passés en paramètre
 * Les contenus sont en mode maths par défaut, il faut donc penser à remplir les tableaux
 * en utilisant éventuellement la commande \\text{}
 *
 * @example
 * tableauColonneLigne(['coin','A','B'],['1','2'],['A1','B1','A2','B2']) affiche le tableau ci-dessous
 * ------------------
 * | coin | A  | B  |
 * ------------------
 * |  1   | A1 | B1 |
 * ------------------
 * |  2   | A2 | B2 |
 * ------------------
 *
 * @example
 * tableauColonneLigne(['coin','A','B','C'],['1','2'],['A1','B1','C1','A2','B2','C2']) affiche le tableau ci-dessous
 * -----------------------
 * | coin | A  | B  | C  |
 * -----------------------
 * |  1   | A1 | B1 | C1 |
 * -----------------------
 * |  2   | A2 | B2 | C2 |
 * -----------------------
 *
 * @example
 * tableauColonneLigne(['coin','A','B'],['1','2','3'],['A1','B1','A2','B2','A3','B3']) affiche le tableau ci-dessous
 * ------------------
 * | coin | A  | B  |
 * ------------------
 * |  1   | A1 | B1 |
 * ------------------
 * |  2   | A2 | B2 |
 * ------------------
 * |  3   | A3 | B3 |
 * ------------------
 *
 * @example
 * tableauColonneLigne(['coin','A','B','C'],['1','2','3'],['A1','B1','C1','A2','B2','C2','A3','B3','C3']) affiche le tableau ci-dessous
 * -----------------------
 * | coin | A  | B  | C  |
 * -----------------------
 * |  1   | A1 | B1 | C1 |
 * -----------------------
 * |  2   | A2 | B2 | C2 |
 * -----------------------
 * |  3   | A3 | B3 | C3 |
 * -----------------------
 *
 * @param {array} tabEntetesColonnes contient les entetes des colonnes
 * @param {array} tabEntetesLignes contient les entetes des lignes
 * @param {array} tabLignes contient les elements de chaque ligne
 * @param {number} arraystretch
 * @param {boolean} math
 * @param {number} exo  Le numéro de l'exercice pour les ids
 * @param {number} question Le numéro de la question pour les ids
 * @return {string}
 * @author Sébastien Lozano
 *
 */
export function tableauColonneLigne (tabEntetesColonnes, tabEntetesLignes, tabLignes, arraystretch, math = true, exo = randint(0, 9999999), question = randint(0, 9999999)) {
  // on définit le nombre de colonnes
  const C = tabEntetesColonnes.length
  // on définit le nombre de lignes
  const L = tabEntetesLignes.length
  // On construit le string pour obtenir le tableau pour compatibilité HTML et LaTeX
  if (context.isHtml) {
    const tableauCL = AddTabDbleEntryMathlive.create(exo, question, AddTabDbleEntryMathlive.convertTclToTableauMathlive(tabEntetesColonnes, tabEntetesLignes, tabLignes), 'tableauMathlive')
    return tableauCL.output
  } else {
    let tableauCL = ''
    if (arraystretch === undefined || typeof arraystretch === 'boolean') {
      arraystretch = 1
    }

    tableauCL += `$\\renewcommand{\\arraystretch}{${arraystretch}}\n`
    tableauCL += '\\begin{array}{|'

    // on construit la 1ere ligne avec toutes les colonnes
    for (let k = 0; k < C; k++) {
      tableauCL += 'c|'
    }
    tableauCL += '}\n'

    tableauCL += '\\hline\n'
    if (typeof tabEntetesColonnes[0] === 'number') {
      tableauCL += `\\cellcolor{lightgray}${math ? texNombre(tabEntetesColonnes[0], 2) + '' : `\\text{${stringNombre(tabEntetesColonnes[0], 2)}} `}`
    } else {
      tableauCL += `\\cellcolor{lightgray}${math ? tabEntetesColonnes[0] : `\\text{${tabEntetesColonnes[0]}}`}`
    }
    for (let k = 1; k < C; k++) {
      if (typeof tabEntetesColonnes[k] === 'number') {
        tableauCL += ` & \\cellcolor{lightgray} ${math ? texNombre(tabEntetesColonnes[k]) : '\\text{' + stringNombre(tabEntetesColonnes[k]) + '}'}`
      } else {
        tableauCL += ` & \\cellcolor{lightgray} ${math ? tabEntetesColonnes[k] : '\\text{' + tabEntetesColonnes[k] + '}'}`
      }
    }
    tableauCL += '\\\\\n'
    tableauCL += '\\hline\n'
    // on construit toutes les lignes
    for (let k = 0; k < L; k++) {
      if (typeof tabEntetesLignes[k] === 'number') {
        tableauCL += `\\cellcolor{lightgray}${math ? texNombre(tabEntetesLignes[k]) : `\\text{${stringNombre(tabEntetesLignes[k]) + ''}}`}`
      } else {
        tableauCL += `\\cellcolor{lightgray}${math ? tabEntetesLignes[k] : `\\text{${tabEntetesLignes[k] + ''}}`}`
      }
      for (let m = 1; m < C; m++) {
        if (typeof tabLignes[(C - 1) * k + m - 1] === 'number') {
          tableauCL += ` & ${math ? texNombre(tabLignes[(C - 1) * k + m - 1]) : '\\text{' + stringNombre(tabLignes[(C - 1) * k + m - 1]) + '}'}`
        } else {
          tableauCL += ` & ${math ? tabLignes[(C - 1) * k + m - 1] : '\\text{' + tabLignes[(C - 1) * k + m - 1] + '}'}`
        }
      }
      tableauCL += '\\\\\n'
      tableauCL += '\\hline\n'
    }
    tableauCL += '\\end{array}\n'

    tableauCL += '\\renewcommand{\\arraystretch}{1}$\n'

    return tableauCL
  }
}
