import { fixeBordures } from '../../modules/2dGeneralites'
import { milieu, point, Point } from './points'
import { polygone, polyline } from './polygones'
import { segment } from './segmentsVecteurs.js'
import { latexParCoordonnees, texteParPosition } from './textes'
import { context } from '../../modules/context.js'
import { stringNombre, texNombre } from '../outils/texNombre'
import { AddTabDbleEntryMathlive } from '../interactif/tableaux/AjouteTableauMathlive'
import { randint } from '../../modules/outils.js'
import { MathfieldElement } from 'mathlive'
import './tableau2x2.scss'
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
      t = texteParPosition(texte.texte, M.x, M.y + (h > 0 ? 0.5 : -0.8), 0, color, 1, 0, math)
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
      t = texteParPosition(texte.texte, M.x + h, M.y - 0.6, 0, color, 1, flip ? 'droite' : 0, math)
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
          const texte = texteParPosition(ligne1[i + 1].texte ?? '', x + largeur / 2, A.y + 1.4 * hauteur, 0, color, 1.2, 'milieu', math)
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
          const texte = texteParPosition(ligne2[i + 1].texte ?? '', x + largeur / 2, A.y + 0.4 * hauteur, 0, color, 1.2, 'milieu', math)
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
        const texte = texteParPosition(ligne1[0].texte ?? '', A.x + largeurTitre / 2, A.y + 1.4 * hauteur, 0, color, 1.2, 'milieu', math)
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
        const texte = texteParPosition(ligne2[0].texte ?? '', A.x + largeurTitre / 2, A.y + 0.4 * hauteur, 0, color, 1.2, 'milieu', math)
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
 * @param {boolean} isInteractif
 * @param {object} style Un objet pour passer le style des cellules si on veut customiser.
 * @return {string}
 * @author Sébastien Lozano
 *
 */
export function tableauColonneLigne (tabEntetesColonnes,
  tabEntetesLignes,
  tabLignes,
  arraystretch = 1,
  math = true,
  exo = randint(0, 9999999),
  question = randint(0, 9999999),
  isInteractif = false,
  style = {}) {
  // on définit le nombre de colonnes
  const C = tabEntetesColonnes.length
  // on définit le nombre de lignes
  const L = tabEntetesLignes.length
  // On construit le string pour obtenir le tableau pour compatibilité HTML et LaTeX
  if (context.isHtml) {
    const tableauCL = AddTabDbleEntryMathlive.create(exo, question, AddTabDbleEntryMathlive.convertTclToTableauMathlive(tabEntetesColonnes, tabEntetesLignes, tabLignes), 'tableauMathlive', isInteractif, style)
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
    const color0 = style.L0C0 != null ? style.L0C0 : 'lightgray'
    if (typeof tabEntetesColonnes[0] === 'number') {
      tableauCL += `\\cellcolor{${color0}} ${math ? texNombre(tabEntetesColonnes[0], 2) : '\\text{' + stringNombre(tabEntetesColonnes[0], 2) + '}'}`
    } else {
      tableauCL += `\\cellcolor{${color0}} ${math ? tabEntetesColonnes[0] : ('\\text{' + tabEntetesColonnes[0] + '}')}`
    }
    for (let k = 1; k < C; k++) {
      const color = style[`L0C${k}`] != null ? style[`L0C${k}`] : 'lightgray'
      if (typeof tabEntetesColonnes[k] === 'number') {
        tableauCL += ` & \\cellcolor{${color}} ${math ? texNombre(tabEntetesColonnes[k]) : '\\text{' + stringNombre(tabEntetesColonnes[k]) + '}'}`
      } else {
        tableauCL += ` & \\cellcolor{${color}} ${math ? tabEntetesColonnes[k] : ('\\text{' + tabEntetesColonnes[k] + '}')}`
      }
    }
    tableauCL += '\\\\\n'
    tableauCL += '\\hline\n'
    // on construit toutes les lignes
    for (let k = 0; k < L; k++) {
      const color = style[`L${k + 1}C0`] != null ? style[`L${k + 1}C0`] : 'lightgray'
      if (typeof tabEntetesLignes[k] === 'number') {
        tableauCL += `\\cellcolor{${color}} ${math ? texNombre(tabEntetesLignes[k]) : '\\text{' + stringNombre(tabEntetesLignes[k]) + '}'}`
      } else {
        tableauCL += `\\cellcolor{${color}} ${math ? tabEntetesLignes[k] : '\\text{' + tabEntetesLignes[k] + '}'}`
      }
      for (let m = 0; m < C - 1; m++) {
        const color = style[`L${k + 1}C${m + 1}`] != null ? style[`L${k + 1}C${m + 1}`] : ''
        if (typeof tabLignes[(C - 1) * k + m] === 'number') {
          if (color !== '') {
            tableauCL += ` & \\cellcolor{${color}} ${math ? texNombre(tabLignes[(C - 1) * k + m]) : '\\text{' + stringNombre(tabLignes[(C - 1) * k + m]) + '}'}`
          } else {
            tableauCL += ` & ${math ? texNombre(tabLignes[(C - 1) * k + m]) : '\\text{' + stringNombre(tabLignes[(C - 1) * k + m]) + '}'}`
          }
        } else {
          if (color !== '') {
            tableauCL += ` & \\cellcolor{${color}} ${math ? tabLignes[(C - 1) * k + m] : '\\text{' + tabLignes[(C - 1) * k + m] + '}'}`
          } else {
            tableauCL += ` & ${math ? tabLignes[(C - 1) * k + m] : '\\text{' + tabLignes[(C - 1) * k + m] + '}'}`
          }
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

/**
 * produit un tableau 2x2 pour calcul de 4e proportionnelle par exemple
 * @param {{content: string, latex: boolean, color: string, background: string}} L0C0
 * @param {{content: string, latex: boolean, color: string, background: string}} L0C1
 * @param {{content: string, latex: boolean, color: string, background: string}} L1C0
 * @param {{content: string, latex: boolean, color: string, background: string}} L1C1
 * @param {number} numeroExercice
 * @param {number} question
 * @param {boolean} isInteractif
 * @param {string} classe
 */
export function tableau2x2 ({ L0C0, L0C1, L1C0, L1C1 }, numeroExercice, question, isInteractif, classes) {
  let tableau
  if (context.isHtml) {
    const ajouteClass = function (element, classes) {
      for (const classe of classes.split(' ')) {
        if (classe !== '') element.classList.add(classe)
      }
    }
    const table = document.createElement('table')
    table.className = 'tableau2x2'
    table.id = `tableau2x2Ex${numeroExercice}Q${question}`
    const firstLine = document.createElement('tr')
    const secondLine = document.createElement('tr')
    table.appendChild(firstLine)
    table.appendChild(secondLine)
    const l0c0 = document.createElement('td')
    const l0c1 = document.createElement('td')
    const l1c0 = document.createElement('td')
    const l1c1 = document.createElement('td')
    firstLine.appendChild(l0c0)
    firstLine.appendChild(l0c1)
    secondLine.appendChild(l1c0)
    secondLine.appendChild(l1c1)
    if (isInteractif) {
      if (L0C0.content === '') {
        const mf00 = new MathfieldElement()
        mf00.id = `champTexteEx${numeroExercice}Q${question}L0C0`
        mf00.setAttribute('virtual-keyboard-mode', 'manual')
        l0c0.appendChild(mf00)
        ajouteClass(mf00, classes)
        l0c0.appendChild(mf00)
      } else {
        const span00 = document.createElement('span')
        span00.textContent = L0C0.content
        if (span00) l0c0.appendChild(span00)
      }
      if (L0C1.content === '') {
        const mf01 = new MathfieldElement()
        mf01.id = `champTexteEx${numeroExercice}Q${question}L0C1`
        mf01.setAttribute('virtual-keyboard-mode', 'manual')
        l0c1.appendChild(mf01)
        ajouteClass(mf01, classes)
      } else {
        const span01 = document.createElement('span')
        span01.textContent = L0C1.content
        if (span01) l0c1.appendChild(span01)
      }
      if (L1C0.content === '') {
        const mf10 = new MathfieldElement()
        mf10.id = `champTexteEx${numeroExercice}Q${question}L1C0`
        mf10.setAttribute('virtual-keyboard-mode', 'manual')
        l1c0.appendChild(mf10)
        ajouteClass(mf10, classes)
      } else {
        const span10 = document.createElement('span')
        span10.textContent = L1C0.content
        if (span10) l1c0.appendChild(span10)
      }
      if (L1C1.content === '') {
        const mf11 = new MathfieldElement()
        mf11.id = `champTexteEx${numeroExercice}Q${question}L1C1`
        mf11.setAttribute('virtual-keyboard-mode', 'manual')
        l1c1.appendChild(mf11)
        ajouteClass(mf11, classes)
      } else {
        const span11 = document.createElement('span')
        span11.textContent = L1C1.content
        if (span11) l1c1.appendChild(span11)
      }
    } else {
      l0c0.textContent = L0C0.content ?? ''
      l0c1.textContent = L0C1.content ?? ''
      l1c0.textContent = L1C0.content ?? ''
      l1c1.textContent = L1C1.content ?? ''
    }
    if (L0C0.background != null) l0c0.style.backgroundColor = L0C0.background
    if (L0C1.background != null) l0c1.style.backgroundColor = L0C1.background
    if (L1C0.background != null) l1c0.style.backgroundColor = L1C0.background
    if (L1C1.background != null) l1c1.style.backgroundColor = L1C1.background
    if (L0C0.color != null) l0c0.style.color = L0C0.color
    if (L0C1.color != null) l0c1.style.color = L0C1.color
    if (L1C0.color != null) l1c0.style.color = L1C0.color
    if (L1C1.color != null) l1c1.style.color = L1C1.color

    tableau = table.outerHTML
  } else {
    tableau = '$\\renewcommand{\\arraystretch}{1.5}\n\\begin{array}{|c|c|}\n\\hline'
    if (L0C0 != null && L0C0.content !== '') {
      tableau += `${L0C0.background !== null && L0C0.background !== undefined ? '\\cellcolor{' + L0C0.background + '}' : ''} ${L0C0.content} `
    }
    tableau += ' & '
    if (L0C1 != null && L0C1.content !== '') {
      tableau += `${L0C1.background != null && L0C1.background !== undefined ? '\\cellcolor{' + L0C1.background + '}' : ''} ${L0C1.content} `
    }
    tableau += '\\\\\n \\hline\n '
    if (L1C0 != null && L1C0.content !== '') {
      tableau += `${L1C0.background !== null && L1C0.background !== undefined ? '\\cellcolor{' + L1C0.background + '}' : ''} ${L1C0.content} `
    }
    tableau += ' & '
    if (L1C1 != null && L1C1.content !== '') {
      tableau += `${L1C1.background !== null && L1C1.background !== undefined ? '\\cellcolor{' + L1C1.background + '}' : ''} ${L1C1.content} `
    }
    tableau += '\\\\\n \\hline\n '
    tableau += '\\end{array}\n\\renewcommand{\\arraystretch}{1}$'
  }
  return tableau
}
