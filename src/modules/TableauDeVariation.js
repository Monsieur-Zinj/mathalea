import katex from 'katex'
import { point } from '../lib/2d/points.js'
import { polygone } from '../lib/2d/polygones.js'
import { segment, vecteur } from '../lib/2d/segmentsVecteurs.js'
import { translation } from '../lib/2d/transformations.js'
import { arrondi } from '../lib/outils/nombres.js'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from './2dGeneralites.js'
import { context } from './context.js'

/**
 * Classe TableauDeVariation Initiée par Sebastien Lozano, transformée par Jean-Claude Lhote
 * publié le 9/02/2021
 * tabInit est un tableau contenant sous forme de chaine les paramètres de la macro Latex \tabInit{}{}
 * tabLines est un tableau contenant sous forme de chaine les paramètres des différentes macro \tabLine{}
 * Voir le commentaire avant la fonction tableauDeVariation() qui crée une instance de cette classe avec des valeurs par défaut
 * exemple :
 * tabInit:[[[texte1,taille1,long1],[texte2,taille2,long2]...],[valeur1,long1,valeur2,long2,valeur3,long3...]]
 * tabLines:[[type,long0,codeL1C1,long1,codeL1C2,long2,codeL1C3,long3...],[type,long0,codeL2C1,long1,codeL2C2,long2,codeL2C3,long3...]]
 * Pour colors, c'est propre à Latex : color, colorC = blue!15, colorL = green!15
 * colorL (comme couleur de la ligne) pour la zone 1
 * colorV (comme couleur de la variable) pour la zone 2
 * colorC (comme couleur de la colonne) pour la zone 3
 * colorT (comme couleur du tableau) pour la zone 4.
 * escpl=taille en cm entre deux antécédents, deltacl=distance entre la bordure et les premiers et derniers antécédents
 * lgt = taille de la première colonne tout est en cm
 * tabInit contient 2 tableaux
 * le premier contient des triplets [chaine d'entête,hauteur de ligne,nombre de pixels de largeur estimée du texte pour le centrage]
 * le deuxième contient une succession de chaines et de largeurs en pixels : ce sont les antécédent de la ligne d'entête
 * tabLines contient des tableaux de la forme ['type',...]
 * type est 'Line' pour une ligne de signes et valeurs. Les valeurs sont données avec à la suite leur largeur estimée en pixels.
 * type est 'Var' pour une ligne de variations. Les variations sont des chaines respectant une syntaxe particulière.
 * On intercale une largeur estimée pour le texte éventuel
 * type est 'Ima' il faut 4 paramètres numériques : le 1er et le 2e sont les N° des antécédents entre lesquels on veut placer l'image
 * le 3e est la valeur de l'image et le 4e est la largeur estimée en pixels
 * type est 'Val' il faut 5 paramètres : Idem Ima pour les deux premiers, le 3e est l'antécédent à ajouter, le 4e son image et le 5e sa taille
 * Pour plus d'info sur le codage des variations, voir ce tuto : https://zestedesavoir.com/tutoriels/439/des-tableaux-de-variations-et-de-signes-avec-latex/
 * reste à faire les types  'Slope"
 * @param {Object} param0
 * @author Jean-Claude Lhote
 */
export function tableauDeVariation ({
  tabInit = ['', ''],
  tabLines = [],
  lgt = 3.5,
  escpl = 5,
  deltacl = 0.8,
  colors = [],
  colorBackground = 'gray',
  scale = 0.5
}) {
  const hauteurLignes = context.pixelsParCm
  const tabInit0 = tabInit[0]
  const tabInit1 = tabInit[1]
  let yLine = 0
  const segments = []
  let index = 0
  const textes = []
  let texte
  let long
  let s
  let p
  let v
  let fleches = []
  let codeVar = []
  let ZI = []
  let ZIon
  let zonesEstInterdit = []
  const longueurTotale = lgt + (tabInit1.length / 2 - 1) * escpl + 2 * deltacl
  const demiIntervalle = 1 / context.pixelsParCm / 2
  const intervalle = 2 * demiIntervalle
  /**
   * Retire les $ $ du début et de la fin de la chaine passée s'il y en a et retourne la chaine
   * @param {string } text
   * @returns {string}
   */
  const latexContent = function (text) {
    if (text[0] === '$') text = text.substring(1, text.length - 1)
    return text
  }
  const sortieTexte = function (texte, x, y) {
    x += 0.7
    y -= 0.7
    return { texte, x, y }
  }
  // On crée une ligne horizontale et les séparations verticales de base
  segments.push(segment(0, 0, longueurTotale, 0))
  segments.push(segment(0, 0, 0, -tabInit0[0][1] * hauteurLignes * intervalle))
  segments.push(segment(lgt, 0, lgt, 0 - tabInit0[0][1] * hauteurLignes * intervalle))
  segments.push(segment(longueurTotale, 0, longueurTotale, -tabInit0[0][1] * hauteurLignes * intervalle))
  
  texte = tabInit0[0][0]
  long = tabInit0[0][2]//
  textes.push(sortieTexte(latexContent(texte), lgt / 2, -tabInit0[0][1] * hauteurLignes * demiIntervalle))
  for (let j = 0; j < tabInit1.length / 2; j++) {
    texte = tabInit1[j * 2]
    long = tabInit1[j * 2 + 1]
    textes.push(sortieTexte(latexContent(texte), lgt + deltacl + escpl * j, -tabInit0[0][1] * hauteurLignes * demiIntervalle))
  }
  yLine -= tabInit0[0][1] * hauteurLignes * intervalle
  
  for (let i = 0; i < tabInit0.length && index < tabLines.length;) { // on s'arrête quand on dépasse le nombre de lignes prévues
    // Line et Var incrémente i de 1 et décrémente yLine de la hauteur de la ligne
    // Val, Ima et Slope incrémente index mais pas i
    switch (tabLines[index][0]) {
      case 'Line':
        i++
        long = tabInit0[i][2]
        textes.push(sortieTexte(latexContent(tabInit0[i][0]), lgt / 2, yLine - tabInit0[i][1] * hauteurLignes * demiIntervalle)) // hauteurLignes,colorBackground))
        
        for (let k = 1; k < tabLines[index].length / 2; k++) {
          if (tabLines[index][k * 2] !== '') {
            texte = tabLines[index][k * 2]
            long = tabLines[index][k * 2 + 1]
            if (texte.length === 1) {
              switch (texte[0]) {
                case 'z':
                  textes.push(sortieTexte('0', lgt + deltacl + escpl / 2 * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * demiIntervalle))
                  s = segment(lgt + deltacl + escpl / 2 * (k - 1), yLine, lgt + deltacl + escpl / 2 * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                  s.pointilles = 4
                  segments.push(s)
                  break
                case 'd':
                  segments.push(segment(lgt + deltacl + escpl / 2 * (k - 1) - 0.05, yLine, lgt + deltacl + escpl / 2 * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                  segments.push(segment(lgt + deltacl + escpl / 2 * (k - 1) + 0.05, yLine, lgt + deltacl + escpl / 2 * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                  break
                case 't':
                  s = segment(lgt + deltacl + escpl / 2 * (k - 1), yLine, lgt + deltacl + escpl / 2 * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                  s.pointilles = 4
                  segments.push(s)
                  break
                case 'h':
                  p = polygone([point(lgt + deltacl + escpl / 2 * (k - 1), yLine),
                    point(lgt + deltacl + escpl / 2 * (k), yLine),
                    point(lgt + deltacl + escpl / 2 * (k), yLine - tabInit0[i][1] * hauteurLignes * intervalle),
                    point(lgt + deltacl + escpl / 2 * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle)])
                  p.couleurDeRemplissage = colorToLatexOrHTML('gray')
                  segments.push(p)
                  break
                case '+':
                  textes.push(sortieTexte('+', lgt + deltacl + escpl / 2 * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * demiIntervalle))
                  
                  break
                case '-':
                  textes.push(sortieTexte('-', lgt + deltacl + escpl / 2 * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * demiIntervalle))
                  
                  break
              }
            } else if (texte === 'R/') {
              // textes.push(sortieTexte(texte, lgt + deltacl + escpl/2 * (k - 0.6), yLine-tabInit0[i][1] / 2))
            } else {
              textes.push(sortieTexte(latexContent(texte), lgt + deltacl + escpl / 2 * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * demiIntervalle))
            }
          }
        }
        // On crée une ligne horizontale et les séparations verticales de base
        segments.push(segment(0, yLine, longueurTotale, yLine))
        segments.push(segment(0, yLine, 0, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
        segments.push(segment(lgt, yLine, lgt, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
        segments.push(segment(longueurTotale, yLine, longueurTotale, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
        yLine -= tabInit0[i][1] * hauteurLignes * intervalle
        index++
        break
      case 'Var':
        i++ // index des lignes (ça démarre à -1 pour l'entête, ça passe à 0 pour la première ligne (celle sous l'entête) et c'est incrémenté à chaque nouvelle ligne)
        fleches = [] // les points qui marquent le départ et/ou l'arrivée d'une flèche (endroit où se situent les valeurs)
        ZI = [] // Liste de points (qui vont par deux : un sur la ligne du dessus, l'autre en dessous)
        ZIon = false // un booléen qui bascule à true si on entre dans une zone interdite et qui rebascule à false à la prochaine valeur
        // utilisé pour ajouter les deux points de droite servant à faire le rectangle hachuré/
        zonesEstInterdit = [] // Un tableau pour garder la trace des "zones interdites" où il ne doit pas y avoir de flèches
        for (let k = 1; k < tabLines[index].length / 2; k++) {
          textes.push(sortieTexte(latexContent(tabInit0[i][0]), lgt / 2, yLine - tabInit0[i][1] * hauteurLignes * demiIntervalle))
          if (tabLines[index][k * 2] !== '') {
            texte = tabLines[index][k * 2]
            long = tabLines[index][k * 2 + 1]
            codeVar = texte.split('/')
            switch (codeVar.length) {
              case 1: // il n'y a qu'un code
                // on ne fait rien, c'est la commande R/ ou un emplacement vide sans /
                break
              case 2: // Une seule expression (2 codes séparés par un seul /)
                switch (codeVar[0]) {
                  case '+': // une expression
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                    if (ZIon) {
                      ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                      ZIon = false
                    }
                    zonesEstInterdit.push(false)
                    break
                  case '-': // une expression
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    if (ZIon) {
                      ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                      ZIon = false
                    }
                    zonesEstInterdit.push(false)
                    break
                  case '+C': // une expression sur une double barre (prolongement par continuité)
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                    s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    if (ZIon) {
                      ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                      ZIon = false
                    }
                    zonesEstInterdit.push(false)
                    break
                  case '-C': // une expression sur une double barre (prolongement par continuité)
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    if (ZIon) {
                      ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                      ZIon = false
                    }
                    zonesEstInterdit.push(false)
                    break
                  case '+D': // une expression suivie d’une double barre (discontinuité)
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                    s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    if (ZIon) {
                      ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                      ZIon = false
                    }
                    zonesEstInterdit.push(false)
                    break
                  case '-D': // une expression suivie d’une double barre (discontinuité)
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    if (ZIon) {
                      ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                      ZIon = false
                    }
                    zonesEstInterdit.push(false)
                    break
                  case '+H': // une expression suivie d’une zone interdite
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                    ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                    ZIon = true
                    zonesEstInterdit.push(true)
                    break
                  case '-H': // une expression suivie d’une zone interdite
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                    ZIon = true
                    zonesEstInterdit.push(true)
                    break
                  case 'D-': // expression précédée d'une double barre discontinuité
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    if (ZIon) {
                      ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                      ZIon = false
                    }
                    zonesEstInterdit.push(false)
                    break
                  case 'D+':// expression précédée d'une double barre discontinuité
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                    s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    if (ZIon) {
                      ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                      ZIon = false
                    }
                    zonesEstInterdit.push(false)
                    break
                  case '-DH': // expression suivie d'une double barre discontinuité et d'une zone interdite
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    ZI.push(point(lgt + deltacl + escpl * (k - 1) + 0.06, yLine), point(lgt + deltacl + escpl * (k - 1) + 0.06, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                    ZIon = true
                    zonesEstInterdit.push(true)
                    break
                  case '+DH': // expression suivie d'une double barre discontinuité et d'une zone interdite
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                    s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    ZI.push(point(lgt + deltacl + escpl * (k - 1) + 0.06, yLine), point(lgt + deltacl + escpl * (k - 1) + 0.06, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                    ZIon = true
                    zonesEstInterdit.push(true)
                    break
                  case '-CH': // expression sur une double barre discontinuité et d'une zone interdite
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                    s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    ZI.push(point(lgt + deltacl + escpl * (k - 1) + 0.06, yLine), point(lgt + deltacl + escpl * (k - 1) + 0.06, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                    ZIon = true
                    zonesEstInterdit.push(true)
                    break
                  case '+CH': // expression sur une double barre discontinuité et d'une zone interdite
                    textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                    fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                    s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                    segments.push(s)
                    ZI.push(point(lgt + deltacl + escpl * (k - 1) + 0.06, yLine), point(lgt + deltacl + escpl * (k - 1) + 0.06, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                    ZIon = true
                    zonesEstInterdit.push(true)
                    break
                  case 3: // 2 expressions sérarées par / /
                    switch (codeVar[0]) { // on regarde le code
                      case '':
                        break
                      case '-CD-': // une expression sur une double barre (continuité) et une expression après la double barre (discontinuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '+CD+': // une expression sur une double barre (continuité) et une expression après la double barre (discontinuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) + long / 14, yLine - 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '-CD+': // une expression sur une double barre (continuité) et une expression après la double barre (discontinuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        zonesEstInterdit.push(true)
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '+CD-': // une expression sur une double barre (continuité) et une expression après la double barre (discontinuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        zonesEstInterdit.push(true)
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '-D-': // deux expressions de part et d’autre d’une double barre (discontinuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        zonesEstInterdit.push(true)
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '+D+': // deux expressions de part et d’autre d’une double barre (discontinuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        zonesEstInterdit.push(true)
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '-D+': // deux expressions de part et d’autre d’une double barre (discontinuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        zonesEstInterdit.push(true)
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '+D-': // deux expressions de part et d’autre d’une double barre (discontinuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        zonesEstInterdit.push(true)
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '-DC-': // une expression avant une double barre (discontinuité) et une expression sur la double barre (continuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '+DC+': // une expression avant une double barre (discontinuité) et une expression sur la double barre (continuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '-DC+': // une expression avant une double barre (discontinuité) et une expression sur la double barre (continuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        zonesEstInterdit.push(true)
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '+DC-': // une expression avant une double barre (discontinuité) et une expression sur la double barre (continuité)
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * demiIntervalle + 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        zonesEstInterdit.push(true)
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        s = segment(lgt + deltacl + escpl * (k - 1) - 0.05, yLine, lgt + deltacl + escpl * (k - 1) - 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        s = segment(lgt + deltacl + escpl * (k - 1) + 0.05, yLine, lgt + deltacl + escpl * (k - 1) + 0.05, yLine - tabInit0[i][1] * hauteurLignes * intervalle)
                        segments.push(s)
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '-V-': // deux expressions
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '+V+': // deux expressions
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '-V+': // deux expressions
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        zonesEstInterdit.push(true)
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                      case '+V-': // deux expressions
                        textes.push(sortieTexte(latexContent(codeVar[1]), lgt + deltacl + escpl * (k - 1) - long / 28, yLine - 0.95))
                        textes.push(sortieTexte(latexContent(codeVar[2]), lgt + deltacl + escpl * (k - 1) + long / 28, yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - 0.95))
                        zonesEstInterdit.push(true)
                        fleches.push(point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle + 0.95))
                        if (ZIon) {
                          ZI.push(point(lgt + deltacl + escpl * (k - 1), yLine), point(lgt + deltacl + escpl * (k - 1), yLine - tabInit0[i][1] * hauteurLignes * intervalle))
                          ZIon = false
                        }
                        zonesEstInterdit.push(false)
                        break
                    }
                    break
                }
            }
          }
        }
        for (let n = 0; n < fleches.length - 1; n++) {
          if (!zonesEstInterdit[n]) {
            v = vecteur(translation(fleches[n], vecteur(0.5, 0)), translation(fleches[n + 1], vecteur(-1.5, 0))).representant(translation(fleches[n], vecteur(1, 0)))
            v.styleExtremites = '->'
            segments.push(v)
          }
        }
        for (let n = 0; n <= ZI.length / 4 - 1; n++) {
          p = polygone(ZI[4 * n], ZI[4 * n + 2], ZI[4 * n + 3], ZI[4 * n + 1])
          p.opacite = 1
          p.hachures = 'north east lines'
          segments.push(p)
        }
        
        // On crée une ligne horizontale et les séparations verticales de base
        segments.push(segment(0, yLine, longueurTotale, yLine))
        segments.push(segment(0, yLine, 0, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
        segments.push(segment(lgt, yLine, lgt, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
        segments.push(segment(longueurTotale, yLine, longueurTotale, yLine - tabInit0[i][1] * hauteurLignes * intervalle))
        yLine -= tabInit0[i][1] * hauteurLignes * intervalle
        index++
        break
      case 'Val': // ajouter un antécédent et son image sur la flèche. 6 paramètres + 'Val'
        // ['Val',antécédent du début de la flèche, antécédent de la fin de la flèche, position sur la flèche entre 0 et 1, 'antécédent', 'image',long]
        if (tabLines[index][5] !== '') {
          long = tabLines[index][6]
          textes.push(sortieTexte(latexContent(tabLines[index][5]), lgt + deltacl + escpl * (tabLines[index][1] - 1) + 1 + (escpl - 2) * (tabLines[index][2] - tabLines[index][1]) * tabLines[index][3], yLine + 1.1 + tabLines[index][3] * tabInit0[i][1] * hauteurLignes * demiIntervalle))
          textes.push(sortieTexte(latexContent(tabLines[index][4]), lgt + deltacl + escpl * (tabLines[index][1] - 1) + 1 + (escpl - 2) * (tabLines[index][2] - tabLines[index][1]) * tabLines[index][3], -tabInit0[0][1] * hauteurLignes * demiIntervalle))
        }
        index++
        break
      case 'Ima': // ajouter des valeurs sur la flèche...
        
        if (tabLines[index][3] !== '') {
          texte = tabLines[index][3]
          long = tabLines[index][4]
          textes.push(sortieTexte(latexContent(texte), lgt + deltacl + escpl * ((tabLines[index][1] - 1) + (tabLines[index][2] - 1)) / 2, yLine + tabInit0[i][1] * hauteurLignes * demiIntervalle))
        }
        index++
        break
      case 'Slope':
        /****************************************************************************/
        // Slope n'est pas implémenté... reste à faire (si quelqu'un en a besoin).
        /****************************************************************************/
        for (let k = 1; k < tabLines[index].length / 2; k++) {
          if (tabLines[index][k * 2] !== '') {
            texte = tabLines[index][k * 2]
            long = tabLines[index][k * 2 + 1]
          }
        }
        break
    }
  }
  
  // On ferme le tableau en bas
  segments.push(segment(0, yLine, longueurTotale, yLine))
  const divsTexte = []
  for (const latex of textes) {
    const texte = latex.texte
    const xTexte = arrondi(latex.x * context.pixelsParCm, 1)
    const yTexte = arrondi(-latex.y * context.pixelsParCm, 1)
    divsTexte.push(` <div class="divLatex" style="position: absolute; top: ${yTexte}px; left: ${xTexte}px;transform: translate(-50%,-50%)" data-top="${yTexte}" data-left="${xTexte}">${katex.renderToString(texte)}</div>`)
  }
  const svgCode = mathalea2d(Object.assign({}, fixeBordures(segments)), segments)
  const codeHtml =
    `<div style="padding: 10px 0px;">
<div style="position: relative; top: 0px; left: 0px;">
        ${svgCode}
        ${divsTexte.join('\n')}
      </div>
      </div>
`
  //const { xmin, xmax, ymin, ymax } = fixeBordures(objets)
  
  // bordures = [xmin, ymin, xmax, ymax]
  
  let codeLatex = `\\\\begin{tikzpicture}[baseline scale=${scale}]
    \\tkzTabInit[lgt=${lgt},deltacl=${deltacl},espcl=${escpl}`
  for (let i = 0; i < colors.length; i++) {
    codeLatex += `,${colors[i]}`
  }
  codeLatex += ']{'
  const tabinit0 = tabInit[0]
  const tabinit1 = tabInit[1]
  let type
  for (let i = 0; i < tabinit0.length; i++) {
    if (tabinit0[i][0].indexOf(',') !== -1) {
      tabinit0[i][0] = `{${tabinit0[i][0]}}`
    }
    codeLatex += ` ${tabinit0[i][0]} / ${tabinit0[i][1]},`
  }
  codeLatex = codeLatex.substring(0, codeLatex.length - 1)
  codeLatex += '}{'
  for (let i = 0; i < tabinit1.length / 2; i++) {
    if (tabinit1[i * 2].indexOf(',') !== -1) {
      tabinit1[i * 2] = `{${tabinit1[i * 2]}}`
    }
    codeLatex += ` ${tabinit1[i * 2]},`
  }
  codeLatex = codeLatex.substring(0, codeLatex.length - 1)
  codeLatex += '}' + '\n\t'
  for (let i = 0; i < tabLines.length; i++) {
    type = tabLines[i][0]
    if (type === 'Val' || type === 'Ima') {
      codeLatex += `\\tkzTab${type}`
      for (let j = 1; j < tabLines[i].length - 1; j++) {
        if (tabLines[i][j].indexOf(',') !== -1) {
          tabLines[i][j] = `{${tabLines[i][j]}}`
        }
        codeLatex += `{${tabLines[i][j]}},`
      }
      codeLatex += '\n\t'
    } else if (type === 'Var' || type === 'Line') {
      codeLatex += `\\tkzTab${type}{ `
      for (let j = 2; j < tabLines[i].length; j += 2) {
        if (tabLines[i][j].indexOf(',') !== -1) {
          tabLines[i][j] = `{${tabLines[i][j]}}`
        }
        codeLatex += ` ${tabLines[i][j]},`
      }
      codeLatex = codeLatex.substring(0, codeLatex.length - 1)
      codeLatex += '}' + '\n\t}'
    }
  }
  return context.isHtml ? codeHtml : codeLatex
}



