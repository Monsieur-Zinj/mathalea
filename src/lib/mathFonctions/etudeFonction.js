import katex from 'katex'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { fraction } from '../../modules/fractions.js'
import { egal } from '../../modules/outils.js'
import { point } from '../2d/points.js'
import { polygone } from '../2d/polygones.js'
import { segment, vecteur } from '../2d/segmentsVecteurs.js'
import { translation } from '../2d/transformations.js'
import { arrondi } from '../outils/nombres'
import { stringNombre } from '../outils/texNombre'
import { matrice } from './Matrice.js'
import engine from '../interactif/comparisonFunctions'
import { round } from 'mathjs'

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
  scale = 0.75
}) {
  if (context.isHtml) {
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
      if (text == null || typeof text !== 'string') {
        return false // c'est sortieTexte() qui va faire le signalement.
      }
      if (text[0] === '$') text = text.substring(1, text.length - 1)
      return text
    }
    const sortieTexte = function (texte, x, y) {
      if (typeof texte !== 'string') {
        window.notify(`Dans TableauDeVariation(), sortieTexte() a reçu un drôle de texte : ${texte}, du coup je renvoie ''`)
        return { texte: '', x, y }
      }
      if (texte[0] === '$' && texte[texte.length - 1] === '$') { // on suprime les $ superflus, parce qu'il n'en faut pas !
        texte = texte.substring(1, texte.length - 2)
      }
      if (texte.length > 0) {
        return { texte, x, y }
      }
      return { texte: '', x, y }
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

          if (tabLines[index][4] !== '') {
            texte = tabLines[index][4]
            long = tabLines[index][3]
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
      divsTexte.push(` <div class="divLatex" style="position: absolute; top: ${yTexte}px; left: ${xTexte}px;transform: translate(-50%,-50%) scale(${scale})" data-top="${yTexte}" data-left="${xTexte}">${katex.renderToString(texte)}</div>`)
    }
    // Si l'on de définit pas rxmin, rymin, rxmax et rymax, ceux-ci sont fixés par défaut à -0.5 et +0.5, ce qui s'ajoute aux marges déjà prévues pour les segments de -0.2 et +0.2
    // voilà d'où vient le décallage de 0.7 enregistré sur la position des latex par rapport au cadre !

    const svgCode = mathalea2d(Object.assign({}, fixeBordures(segments, {
      rxmin: -0.05,
      rymin: -0.1,
      rxmax: 0.1,
      rymax: 0.05
    })), segments)

    /* pour éviter d'avoir des containers imbriquées, util pour le zoom */
    const codeHtml = `<div class="svgContainer">
      <div style="position: relative;">
        ${svgCode.replaceAll('svgContainer', '')} 
        ${divsTexte.join('\n')}
      </div>
      </div>`
    return codeHtml
  } else {
    let codeLatex = `\\begin{tikzpicture}[baseline, scale=${scale}]
    \\tkzTabInit[lgt=${lgt},deltacl=${deltacl},espcl=${escpl}`
    for (let i = 0; i < colors.length; i++) {
      codeLatex += `,${colors[i]}`
    }
    codeLatex += ']{'
    const tabinit0 = tabInit[0]
    const tabinit1 = tabInit[1]
    let type

    for (let i = 0; i < tabinit0.length; i++) {
      let exp = tabinit0[i][0]
      const taille = String(tabinit0[i][1])
      if (typeof exp === 'string' && exp[0] === '$' && exp[exp.length - 1] === '$') {
        exp = exp.substring(1, exp.length - 1)
      }
      if (typeof exp === 'string' && exp.includes(',')) {
        exp = `\\numprint{${exp}}`
      }
      if (typeof exp === 'string') codeLatex += ` $${exp}$ / ${taille},`
      else codeLatex += ` $${String(exp)}$ / ${taille},`
    }
    codeLatex = codeLatex.substring(0, codeLatex.length - 1) // pour enlever la virgule du dernier élément ajouté.
    codeLatex += '}{'
    for (let i = 0; i < tabinit1.length / 2; i++) {
      let exp = tabinit1[i * 2]
      if (typeof exp === 'string' && exp[0] === '$' && exp[exp.length - 1] === '$') {
        exp = exp.substring(1, exp.length - 1)
      }
      if (typeof exp === 'string' && exp.includes(',')) {
        exp = `\\numprint{${exp}}`
      }
      codeLatex += ` $${exp}$,`
    }
    codeLatex = codeLatex.substring(0, codeLatex.length - 1) // on retire la virgule du dernier élément ajouté
    codeLatex += '}' + '\n\t'
    for (let i = 0; i < tabLines.length; i++) {
      type = tabLines[i][0]
      if (type === 'Val') {
        codeLatex += `\\tkzTab${type}`
        for (let j = 1; j < tabLines[i].length - 1; j++) { // pas de $ ici non plus, car il y a des paramètres qui sont autre chose que des expressions
          // les expressions à mettre sur les flèches ou au bout de celles-ci doivent avoir leur $ $
          if (typeof tabLines[i][j] === 'string' && tabLines[i][j].includes(',')) {
            tabLines[i][j] = `{${tabLines[i][j]}}`
          }
          codeLatex += `{${tabLines[i][j]}},`
        }
        codeLatex += '\n\t'
      } else if (type === 'Ima') {
        codeLatex += `\\tkzTab${type}`
        for (let j = 1; j < tabLines[i].length; j++) {
          codeLatex += `{${tabLines[i][j]}}`
        }
        codeLatex += '\n\t'
      } else if (type === 'Var') { // pas de $ ajoutés ici car il y a des commandes... les expressions doivent avoir leur propres $ $
        codeLatex += `\\tkzTab${type}{ `
        for (let j = 2; j < tabLines[i].length; j += 2) {
          const exp = tabLines[i][j]
          codeLatex += ` ${exp},`
        }
        codeLatex = codeLatex.substring(0, codeLatex.length - 1)
        codeLatex += '}' + '\n\t'
      } else { // si c'est pas tabVal, tabIma ou tabVar, c'est un tabLine et ça ne contient que des codes !
        codeLatex += `\\tkzTab${type}{ `
        for (let j = 2; j < tabLines[i].length; j += 2) {
          if (tabLines[i][j].indexOf(',') !== -1) {
            tabLines[i][j] = `{${tabLines[i][j]}}`
          }
          codeLatex += ` ${tabLines[i][j]},`
        }
        codeLatex = codeLatex.substring(0, codeLatex.length - 1)
        codeLatex += '}' + '\n\t'
      }
    }
    codeLatex += '\\end{tikzpicture}\n'
    return codeLatex
  }
}

/**
 * Une fonction pour trouver les solutions de f(x)=y.
 * @param fonction
 * @param y
 * @param xMin
 * @param xMax
 * @param tolerance
 */
// export function solve (fonction, y, xMin, xMax, tolerance) {

// }
/**
 * renvoie les solutions (intervalles) de f(x) < y (ou f(x)<=y ou f(x)>y ou f(x)>=y)
 * @param {function} fonction une fonction x=>f(x)
 * @param {number} y la valeur de y à atteindre
 * @param {number|FractionEtendue} xMin la borne gauche du domaine de définition
 * @param {number|FractionEtendue} xMax la borne droite du domaine de définition
 * @param {boolean} inferieur si true < si false >
 * @param {boolean} strict si true < ou > sinon <= ou >=
 * @param {Object} [options]
 * @param {number|FractionEtendue} options.step le pas de recherche en x.
 * @return {{borneG: {x: number, included: boolean, y: number}, borneD: {x: number, included: boolean, y: number}}[]} le ou les intervalles dans une liste
 */
export function inferieurSuperieur (fonction, y, xMin, xMax, inferieur = true, strict = false, { step = new FractionEtendue(1, 100) } = {}) {
  const satisfy = function (image, y, inferieur, strict) {
    if (inferieur) {
      return strict ? y - image > 0 : y - image >= 0
    } else {
      return strict ? y - image < 0 : y - image <= 0
    }
  }
  if (!(step instanceof FractionEtendue)) step = new FractionEtendue(step)
  const solutions = []
  let borneG = {}
  let borneD = {}
  xMin = xMin instanceof FractionEtendue ? xMin : new FractionEtendue(xMin)
  let x, image
  try {
    for (x = xMin; x <= xMax;) {
      image = fonction(x)
      if (borneG.x === undefined && satisfy(image, y, inferieur, strict)) { // c'est le premier x qui matche
        borneG = { x, y: image, included: !strict }
      } else if (satisfy(image, y, inferieur, strict)) { // les suivants qui matchent écrasent borneD
        borneD = { x, y: image, included: !strict }
      } else { // ça ne matche plus ou pas
        if (borneD.x !== undefined) { // il y a eu un intervalle, ça a matché et c'est terminé
          solutions.push({
            borneG: { x: borneG.x, y: borneG.y, included: borneG.included },
            borneD: { x: borneD.x, y: borneD.y, included: borneD.included }
          })
          borneG = {}
          borneD = {} // on réinitialise pour le prochain intervalle
        } else if (borneG.x !== undefined) { // On n'a pas de borneD, mais on a une borneG, cas particulier du singleton
          solutions.push({
            borneG: { x: borneG.x, y: borneG.y, included: borneG.included },
            borneD: { x: borneG.x, y: borneG.y, included: borneG.included }
          })
          borneG = {}
          borneD = {} // on réinitialise pour le prochain intervalle
        }
      }
      x = x.sommeFraction(step) // dans tous les cas, on avance
    }
  } catch (e) {
    console.error(`e.message avec x = ${x} et image = ${image}`)
  }
  if (borneD.x !== undefined) { // le dernier intervalle n'a pas été mis dans les solutions car on est encore dedans
    solutions.push({
      borneG: { x: borneG.x, y: borneG.y, included: borneG.included },
      borneD: { x: borneD.x, y: borneD.y, included: borneD.included }
    })
  }
  return solutions
}

export function racines ({ fonction, xMin, xMax, tol = 1e-13, maxIter = 100, precision = 1 }) {
  const racines = []
  for (let x = xMin; x <= xMax - 0.2; x += 0.2) {
    if (fonction(x) * fonction(x + 0.2) < 0) {
      const { root } = brent(fonction, x, x + 0.2, tol, maxIter)
      if (root != null) racines.push(round(root, precision))
    } else {
      if (fonction(x) === 0) racines.push(round(x, precision))
      if (fonction(x + 0.2) === 0) racines.push(round(x + 0.2, precision))
    }
  }
  return Array.from((new Set(racines)).values())
}
/**
 * Retourne un array avec les signes successifs de la fonction sur l'intervalle
 * @param {function} fonction du type (x)=>number
 * @param {number|FractionEtendue} xMin
 * @param {number|FractionEtendue} xMax
 * @returns {{xG: number, xD: number, signe: string}[]}
 */
export function signesFonction (fonction, xMin, xMax) {
  const signes = []
  const zeros = racines({ fonction, xMin, xMax })
  let x
  if (zeros.length === 0) {
    return [{ xG: xMin, xD: xMax, signe: fonction((xMin + xMax) / 2) > 0 ? '+' : '-' }]
  }
  if (xMin !== zeros[0]) signes.push({ xG: xMin, xD: zeros[0], signe: fonction(xMin) > 0 ? '+' : '-' })
  x = zeros[0]
  signes.push({ xG: zeros[0], xD: zeros[0], signe: 'z' })
  for (let i = 1; i < zeros.length; i++) {
    const y = fonction((x + zeros[i]) / 2)
    signes.push({ xG: x, xD: zeros[i], signe: y > 0 ? '+' : '-' })
    signes.push({ xG: zeros[i], xD: zeros[i], signe: 'z' })
    x = zeros[i]
  }
  if (zeros[zeros.length - 1] === xMax) return signes
  const y = fonction((zeros[zeros.length - 1] + xMax) / 2)
  signes.push({ xG: zeros[zeros.length - 1], xD: xMax, signe: y > 0 ? '+' : '-' })
  return signes
}

/**
 * retourne un tableau décrivant les variations de la fonction
 * Attention, la fonction fournie doit avoir une methode derivee(x) qui retourne la valeur de la dérivée en x
 * @param {(x)=>number} derivee
 * @param {number|FractionEtendue} xMin
 * @param {number|FractionEtendue} xMax
 * @param {number|FractionEtendue} step // fournir un step adapté à l'intervalle pour ne pas louper les valeurs particulières et pour ne pas ralentir le navigateur
 * @param {number|FractionEtendue} tolerance // écart maximum à zéro pour assimiler f(x) à zéro
 * @returns {null|*[]}
 */
export function variationsFonction (derivee, xMin, xMax, step, tolerance = 0.005) {
  if (derivee !== null && typeof derivee === 'function') {
    const signesDerivee = signesFonction(derivee, xMin, xMax, step ?? new FractionEtendue(1, 100), tolerance)
    const variations = []
    for (const signe of signesDerivee) {
      if (signe.signe === '+') {
        variations.push({ xG: signe.xG, xD: signe.xD, variation: 'croissant' })
      } else if (signe.signe === '-') {
        variations.push({ xG: signe.xG, xD: signe.xD, variation: 'decroissant' })
      } // on ne fait rien pour signe.signe==='z'
    }
    return variations.filter((variation) => variation.xG !== variation.xD)
  } else {
    window.notify('variationsFonction() appelée avec autre chose qu\'une fonction', { derivee })
    return null
  }
}

/**
 * retourne les coefficients a et b de la fonction affine passant par (x1,y1) et (x2,y2)
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 * @returns {[number,number]}
 */
export function trouveFonctionAffine (x1, x2, y1, y2) {
  const maMatrice = matrice([[x1, 1], [x2, 1]])
  return maMatrice.inverse().multiply([y1, y2]).toArray()
}

/**
 * Fonction qui cherche les minimas et maximas d'une fonction polynomiale f(x)=ax^3 + bx² + cx + d
 * retourne [] si il n'y en a pas, sinon retourne [[x1,f(x1)],[x2,f(x2)] ne précise pas si il s'agit d'un minima ou d'un maxima.
 * @author Jean-Claude Lhote
 */
export function chercheMinMaxFonction ([a, b, c, d]) {
  const delta = 4 * b * b - 12 * a * c
  if (delta <= 0) return [[0, 10 ** 99], [0, 10 ** 99]]
  const x1 = (-2 * b - Math.sqrt(delta)) / (6 * a)
  const x2 = (-2 * b + Math.sqrt(delta)) / (6 * a)
  return [[x1, a * x1 ** 3 + b * x1 ** 2 + c * x1 + d], [x2, a * x2 ** 3 + b * x2 ** 2 + c * x2 + d]]
}

/**
 * renvoie le tableau de signes d'une fonction
 * @param fonction
 * @param {number|FractionEtendue} xMin
 * @param {number|FractionEtendue} xMax
 * @param {object} options
 * @param {{antVal:number, antTex:string, imgVal:number, imgTex:string}[]} [options.substituts] valeur à remplacer dans le tableau (valeur au centième)
 * @param {number|FractionEtendue} [options.step] // pas de balayage pour trouver les solutions de f(x)=0
 * @param {number|FractionEtendue} [options.tolerance] // écart maximum à zéro pour assimiler f(x) à zéro
 * @param {string} [options.nomVariable] // ce qui est écrit dans l'entête de la première ligne 'x' par défaut
 * @returns {string} [options.nomFonction] // ce  qui est écrit dans l'entête de la deuxième ligne 'f(x)' par défaut
 */
export function tableauSignesFonction (fonction, xMin, xMax, {
  substituts = [],
  step = fraction(1, 1000),
  tolerance = 0.005,
  nomVariable = 'x',
  nomFonction = 'f(x)'
} = {}) {
  const signes = signesFonction(fonction, xMin, xMax, step, tolerance)
  const premiereLigne = []
  for (let i = 0; i < signes.length; i++) {
    if (i === 0) {
      premiereLigne.push(stringNombre(signes[0].xG, 2), 10)
    }
    if (i > 0 && signes[i].xG !== signes[i - 1].xG) {
      premiereLigne.push(stringNombre(signes[i].xG, 2), 10)
    }
  }
  premiereLigne.push(stringNombre(signes[signes.length - 1].xD, 2), 10)
  if (substituts && Array.isArray(substituts)) {
    for (let i = 0; i < premiereLigne.length; i += 2) {
      const strNb = premiereLigne[i].replaceAll(/\s/g, '')
      const substitut = substituts.find((el) => stringNombre(el.antVal, 2).replaceAll(/\s/g, '') === strNb)
      if (substitut) {
        premiereLigne[i] = substitut.antTex
      }
    }
  }
  const tabLine = ['Line', 30]
  if (egal(fonction(xMin), 0)) {
    tabLine.push('z', 10)
  } else {
    tabLine.push('', 10)
  }
  for (const signe of signes) {
    tabLine.push(signe.signe, 10)
  }
  return tableauDeVariation({
    tabInit: [
      [
        [nomVariable, 2, 10], [nomFonction, 2, 10]
      ],
      premiereLigne
    ],
    tabLines: [tabLine],
    colorBackground: '',
    escpl: 3.5, // taille en cm entre deux antécédents
    deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
    lgt: 8 // taille de la première colonne en cm
  })
}

/**
 *
 * @param {function} fonction
 * @param {function} derivee
 * @param {number|FractionEtendue} xMin
 * @param {number|FractionEtendue} xMax
 * @param {object} options
 * @param {{antVal: number, antTex: string, imgVal: number, imgTex: string}[]} [options.substituts]
 * @param {number|FractionEtendue} [options.step] // pas de balayage pour trouver les solutions de f'(x)=0
 * @param {number|FractionEtendue} [options.tolerance] // la valeur en dessous de laquelle les images sont considérées comme des zéros
 * @param {boolean} [options.ligneDerivee] Mettre à true pour faire apparaître la ligne de f'
 * @param {string} [options.nomVariable] 'x' par défaut
 * @param {string} [options.nomFonction] 'f(x)' par défaut
 * @param {string} [options.nomDerivee] 'f′(x)' par défaut
 * @param {number} [options.precisionImage] 2 par défaut = nombre de décimale des images approchées
 * @returns {string}
 */
export function tableauVariationsFonction (fonction, derivee, xMin, xMax, {
  substituts = [],
  step = fraction(1, 1000),
  tolerance = 0.005,
  ligneDerivee = false,
  nomVariable = 'x',
  nomFonction = 'f(x)',
  nomDerivee = 'f^{\\prime}(x)',
  precisionImage = 2
} = {}) {
  const signes = signesFonction(derivee, xMin, xMax, step, tolerance).filter((signe) => signe.xG !== signe.xD)
  const premiereLigne = []
  const initalValue = []
  premiereLigne.push(...signes.reduce((previous, current) => previous.concat([stringNombre(current.xG, 2), 10]), initalValue))
  premiereLigne.push(stringNombre(signes[signes.length - 1].xD, 2), 10)
  if (substituts && Array.isArray(substituts)) {
    for (let i = 0; i < premiereLigne.length; i += 2) {
      const strNb = premiereLigne[i].replaceAll(/\s/g, '')
      const substitut = substituts.find((el) => stringNombre(el.antVal, 2).replaceAll(/\s/g, '') === strNb)
      if (substitut) {
        premiereLigne[i] = typeof substitut.antTex === 'string' ? substitut.antTex : substitut.antTex.toString()
      }
    }
  }
  const tabLineDerivee = ['Line', 30]
  if (egal(derivee(xMin), 0)) {
    tabLineDerivee.push('z', 10)
  } else {
    tabLineDerivee.push('', 10)
  }
  for (const signe of signes) {
    tabLineDerivee.push(signe.signe, 10)
    tabLineDerivee.push('z', 10)
  }
  if (!egal(derivee(xMax), 0)) {
    tabLineDerivee.splice(-2, 2)
  }

  const variations = variationsFonction(derivee, xMin, xMax, step, tolerance)

  const tabLineVariations = ['Var', 10]
  const tabLinesImage = []
  let variationG = variations[0]
  let variationD
  if (variationG.variation === 'croissant') {
    tabLineVariations.push(`-/${stringNombre(fonction(variationG.xG), precisionImage)}`, 10)
  } else {
    tabLineVariations.push(`+/${stringNombre(fonction(variationG.xG), precisionImage)}`, 10)
  }
  for (let i = 0; i < variations.length - 1; i++) {
    variationG = variations[i]
    variationD = variations[i + 1]
    if (variationG.variation === variationD.variation) {
      tabLineVariations.push('R/', 10)
      tabLinesImage.push(['Ima', i + 1, i + 3, i + 2, stringNombre(fonction(variationG.xD), precisionImage)])
    } else {
      tabLineVariations.push(`${variationG.variation === 'croissant' ? '+' : '-'}/${stringNombre(fonction(variationG.xD), precisionImage)}`, 10)
    }
  }
  if (variationD != null) {
    if (variationD.variation === 'croissant') {
      tabLineVariations.push(`+/${stringNombre(fonction(variationD.xD, 1), precisionImage)}`, 10)
    } else {
      tabLineVariations.push(`-/${stringNombre(fonction(variationD.xD, 1), precisionImage)}`, 10)
    }
  } else {
    tabLineVariations.push(`${variationG.variation === 'croissant' ? '+' : '-'}/${stringNombre(fonction(variationG.xD), precisionImage)}`, 10)
  }
  if (substituts && Array.isArray(substituts)) {
    for (let i = 2; i < tabLineVariations.length; i += 2) {
      const strChunks = tabLineVariations[i].split('/')
      const substitut = substituts.find((el) => stringNombre(Number(el.imgVal), 3).replaceAll(/\s/g, '') === strChunks[1].replaceAll(/\s/g, ''))
      if (substitut) {
        tabLineVariations[i] = strChunks[0] + '/' + substitut.imgTex
      }
    }
  }
  const tabLines = ligneDerivee ? [tabLineDerivee] : []
  tabLines.push(tabLineVariations)
  if (tabLinesImage.length > 0) {
    tabLines.push(...tabLinesImage)
  }
  return tableauDeVariation({
    tabInit: [
      ligneDerivee
        ? [
            [nomVariable, 1.5, 10], [nomDerivee, 2, 10], [nomFonction, 3, 10]
          ]
        : [
            [nomVariable, 1.5, 10], [nomFonction, 3, 10]
          ],
      premiereLigne
    ],
    tabLines,
    colorBackground: '',
    escpl: 4.5, // taille en cm entre deux antécédents
    deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
    lgt: 3 // taille de la première colonne en cm
  })
}

/**
 * retourne la dérivée partielle de la fonction de la variable
 * @param {string} fonction
 * @param {string} variable
 */
export function derivee (fonction, variable) {
  const laFonction = engine.parse(fonction.replaceAll('dfrac', 'frac'))
  return engine.box(['D', laFonction, variable]).evaluate().latex
}

export function brent (f, a, b, tol = 1e-5, maxIter = 100) {
  if (f(a) * f(b) >= 0) {
    throw new Error("La fonction doit changer de signe sur l'intervalle [a, b]")
  }

  let fa = f(a); let fb = f(b)
  let c = a; let fc = fa
  let d = b - a; let e = d

  for (let iter = 0; iter < maxIter; iter++) {
    if (fb * fc > 0) {
      c = a
      fc = fa
      d = e = b - a
    }

    if (Math.abs(fc) < Math.abs(fb)) {
      [a, b, c] = [b, c, b];
      [fa, fb, fc] = [fb, fc, fb]
    }

    const tol1 = 2.0 * tol * Math.abs(b) + 0.5 * tol
    const xm = 0.5 * (c - b)

    if (Math.abs(xm) <= tol1 || fb === 0.0) {
      return { root: b, iter }
    }

    if (Math.abs(e) >= tol1 && Math.abs(fa) > Math.abs(fb)) {
      const s = fb / fa
      let p, q
      if (a === c) {
        p = 2.0 * xm * s
        q = 1.0 - s
      } else {
        q = fa / fc
        const r = fb / fc
        p = s * (2.0 * xm * q * (q - r) - (b - a) * (r - 1.0))
        q = (q - 1.0) * (r - 1.0) * (s - 1.0)
      }
      if (p > 0) q = -q
      p = Math.abs(p)
      if (2.0 * p < Math.min(3.0 * xm * q - Math.abs(tol1 * q), Math.abs(e * q))) {
        e = d
        d = p / q
      } else {
        d = e = xm
      }
    } else {
      d = e = xm
    }

    a = b
    fa = fb
    if (Math.abs(d) > tol1) {
      b += d
    } else {
      b += xm >= 0 ? tol1 : -tol1
    }
    fb = f(b)
  }

  throw new Error('Maximum number of iterations exceeded')
}
