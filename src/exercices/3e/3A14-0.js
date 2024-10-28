import { point } from '../../lib/2d/points.js'
import { polygone } from '../../lib/2d/polygones.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { texteParPosition } from '../../lib/2d/textes.ts'
import { choice } from '../../lib/outils/arrayOutils'
import { createList } from '../../lib/format/lists.ts'
import { egalOuApprox } from '../../lib/outils/ecritures'
import { numAlpha } from '../../lib/outils/outilString.js'
import { decompositionFacteursPremiers, premierAvec } from '../../lib/outils/primalite'
import { texteGras } from '../../lib/format/style'
import { texNombre, stringNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { mathalea2d, fixeBordures, colorToLatexOrHTML } from '../../modules/2dGeneralites.js'
import { pyramide3d, pave3d, point3d, polygone3d } from '../../modules/3d.js'

export const titre = 'Arithmétique & volumes'

/**
 * diviseurs communs, calcul de volume
 * @author Jean-Claude Lhote
 * Référence dnb06_2022_5
 */
export const uuid = '2e22a'
export const ref = '3A14-0'
export const refs = {
  'fr-fr': ['3A14-0'],
  'fr-ch': ['11GM2-2']
}
export default function DesChocolatsDansDesBoites () {
  Exercice.call(this)
  this.titre = titre
  this.introduction = 'D’après Brevet des Collège - Centres étrangers - Juin 2022'
  this.consigne = ''
  context.isHtml ? this.spacing = 1 : this.spacing = 2
  context.isHtml ? this.spacingCorr = 2 : this.spacingCorr = 2
  this.nbQuestions = 1
  this.nbQuestionsModifiable = false
  this.nbCols = 1
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    context.anglePerspective = 50
    const premier1 = choice([2, 3, 5, 7])
    const premier2 = choice([2, 3, 5, 7])
    const nbBoites = premier1 * premier2
    const nbTruffesCafeParBoite = randint(5, 12)
    const nbTruffesCocoParBoite = premierAvec(nbTruffesCafeParBoite)
    const nbTruffesParBoite = nbTruffesCocoParBoite + nbTruffesCafeParBoite
    const nbTruffesCafe = nbBoites * nbTruffesCafeParBoite
    const nbTruffesCoco = nbBoites * nbTruffesCocoParBoite
    const nbTruffes = nbTruffesCafe + nbTruffesCoco
    const intro = 'Pour fêter les 25 ans de sa boutique, un chocolatier souhaite offrir aux premiers clients de la journée une boîte contenant des truffes au chocolat.'
    const donneesTruffes = createList({
      items: ['Le nombre de truffes parfumées au café soit le même dans chaque boîte ;',
        'Le nombre de truffes enrobées de noix de coco soit le même dans chaque boîte ;',
        'Toutes les truffes soient utilisées.'],
      style: 'fleches',
      classOptions: 'w-3/4 py-2 px-4'
    })
    // question 1
    let texteQuestion1 = ''
    texteQuestion1 += `Il a confectionné $${nbTruffes}$ truffes: $${nbTruffesCafe}$ truffes parfumées au café et $${nbTruffesCoco}$ truffes enrobées de noix de coco. Il souhaite fabriquer ces boîtes de sorte que :`

    texteQuestion1 += donneesTruffes
    texteQuestion1 += createList({
      items: [
        `Décomposer $${nbTruffesCafe}$ et $${nbTruffesCoco}$ en produit de facteurs premiers.`,
        `En déduire la liste des diviseurs communs à $${nbTruffesCafe}$ et $${nbTruffesCoco}$.`,
        'Quel nombre maximal de boîtes pourra-t-il réaliser ?',
        'Dans ce cas, combien y aura-t-il de truffes de chaque sorte dans chaque boîte ?'
      ],
      style: 'alpha',
      classOptions: 'py-4'
    })

    // question 2
    let texteQuestion2 = ''
    const largeurCadre = 30
    const hauteurCadre = 20
    const cadrePrincipal = polygone([point(0, 0), point(largeurCadre, 0), point(largeurCadre, hauteurCadre), point(0, hauteurCadre)])
    const ligne1 = segment(point(0, hauteurCadre / 3), point(largeurCadre, hauteurCadre / 3))
    const ligne2 = segment(point(largeurCadre / 2, hauteurCadre), point(largeurCadre / 2, 0))
    const text1 = texteParPosition('type A', largeurCadre / 4 - 1, hauteurCadre - 1, 'milieu', 'black', 2)
    const text2 = texteParPosition('type B', 3 * largeurCadre / 4 - 1, hauteurCadre - 1, 'milieu', 'black', 2)
    text1.epaisseur = 4
    text1.contour = true
    text1.couleurDeRemplissage = colorToLatexOrHTML('black')
    text2.epaisseur = 4
    text2.contour = true
    text2.couleurDeRemplissage = colorToLatexOrHTML('black')
    const sommetPyramide = point3d(largeurCadre / 4 - 2, 4, hauteurCadre - 4)
    const base = polygone3d([
      point3d(largeurCadre / 4 - 6, 0, hauteurCadre / 3 + 1),
      point3d(largeurCadre / 4 + 2, 0, hauteurCadre / 3 + 1),
      point3d(largeurCadre / 4 + 2, 8, hauteurCadre / 3 + 1),
      point3d(largeurCadre / 4 - 6, 8, hauteurCadre / 3 + 1)
    ])
    const pyramide = pyramide3d(base, sommetPyramide)
    const sommetsPave = [
      point3d(3 * largeurCadre / 4 - 5, 0, hauteurCadre / 3 + 2),
      point3d(3 * largeurCadre / 4 + 3, 0, hauteurCadre / 3 + 2),
      point3d(3 * largeurCadre / 4 - 5, 0, hauteurCadre - 5),
      point3d(3 * largeurCadre / 4 - 5, 5, hauteurCadre / 3 + 2)
    ]
    const pave = pave3d(...sommetsPave)
    const diametreTruffes = randint(10, 15) / 10
    const volumeTotalTruffe = nbTruffesParBoite * 4 * Math.PI * (diametreTruffes / 2) ** 3 / 3
    const volumeCible = 1.7 * volumeTotalTruffe
    const volumeTropImportant = 2.3 * volumeTotalTruffe
    let basePyramide, hauteurPave
    const longueurPave = randint(4, 5)
    const largeurPave = randint(2, 3) - 0.5
    const hauteurPyramide = randint(4, 6)
    const paveQuiConvient = Math.random() < 0.5
    if (paveQuiConvient) {
      hauteurPave = Number((volumeCible / longueurPave / largeurPave).toFixed(1))
      basePyramide = Number(Math.sqrt(3 * volumeTropImportant / hauteurPyramide).toFixed(1))
    } else {
      hauteurPave = Math.round(volumeTropImportant / longueurPave / largeurPave)
      basePyramide = Number(Math.sqrt(3 * volumeCible / hauteurPyramide).toFixed(1))
    }
    const volumePave = largeurPave * longueurPave * hauteurPave
    const volumePyramide = (hauteurPyramide * basePyramide ** 2) / 3
    const textA1 = texteParPosition('Pyramide à base carrée', largeurCadre / 4, hauteurCadre / 3 - 1, 'milieu', 'black', 1.5)
    const textA2 = texteParPosition(`de côté ${stringNombre(basePyramide, 1)} cm`, largeurCadre / 4, hauteurCadre / 3 - 2, 'milieu', 'black', 1.5)
    const textA3 = texteParPosition(`et de hauteur ${stringNombre(hauteurPyramide, 1)} cm`, largeurCadre / 4, hauteurCadre / 3 - 3, 'milieu', 'black', 1.5)
    const textB1 = texteParPosition('Pavé droit', 3 * largeurCadre / 4, hauteurCadre / 3 - 1, 'milieu', 'black', 1.5)
    const textB2 = texteParPosition(`de longueur ${longueurPave} cm`, 3 * largeurCadre / 4, hauteurCadre / 3 - 2, 'milieu', 'black', 1.5)
    const textB3 = texteParPosition(`de largeur ${stringNombre(largeurPave, 1)} cm`, 3 * largeurCadre / 4, hauteurCadre / 3 - 3, 'milieu', 'black', 1.5)
    const textB4 = texteParPosition(`et de hauteur ${stringNombre(hauteurPave, 1)} cm`, 3 * largeurCadre / 4, hauteurCadre / 3 - 4, 'milieu', 'black', 1.5)
    const objets = [cadrePrincipal, ligne1, ligne2, text1, text2, pyramide.c2d, pave.c2d, textA1, textA2, textA3, textB1, textB2, textB3, textB4]

    texteQuestion2 += `Le chocolatier souhaite fabriquer des boîtes contenant $${nbTruffesParBoite}$ truffes. Pour cela, il a le choix entre deux types de boites qui peuvent contenir les $${nbTruffesParBoite}$ truffes, et dont les caractéristiques sont données ci-dessous:`
    texteQuestion2 += '<br>' + mathalea2d(Object.assign({ scale: 0.5 }, fixeBordures(objets)), objets)
    texteQuestion2 += `Dans cette question, chacune des $${nbTruffesParBoite}$ truffes est assimilée à une boule de diamètre $${texNombre(diametreTruffes, 1)}$ cm.<br>`
    texteQuestion2 += 'À l\'intérieur d\'une boîte, pour que les truffes ne s\'abîment pas pendant le transport, le volume occupé par les truffes doit être supérieur au volume non occupé par les truffes.<br>'
    texteQuestion2 += 'Quel(s) type(s) de boîte le chocolatier doit-il choisir pour que cette condition soit respectée?'

    // toute les questions dans une liste numérotée
    this.listeQuestions[0] = intro + createList({
      items: [texteQuestion1, texteQuestion2],
      style: 'nombres',
      classOptions: 'pt-4'
    })

    // correction
    const texteCorr = mathalea2d(Object.assign({ scale: 0.5 }, fixeBordures(objets)), objets)
    // question 1
    let correctionQuestion1 = ''
    correctionQuestion1 += `Il a confectionné $${nbTruffes}$ truffes: $${nbTruffesCafe}$ truffes parfumées au café et $${nbTruffesCoco}$ truffes enrobées de noix de coco. Il souhaite fabriquer ces boîtes de sorte que :`
    correctionQuestion1 += donneesTruffes
    correctionQuestion1 += createList({
      items: [
        `$${nbTruffesCafe}=${decompositionFacteursPremiers(nbTruffesCafe)}$ et $${nbTruffesCoco}=${decompositionFacteursPremiers(nbTruffesCoco)}$.`,
        `On cherche le plus grand diviseur commun de $${nbTruffesCafe}$ et de $${nbTruffesCoco}$.<br>` +
        `Dans les décompositions en facteurs premiers de $${nbTruffesCafe}$ et de $${nbTruffesCoco}$, on retrouve $${decompositionFacteursPremiers(nbBoites)}$, donc leur plus grand diviseur commun est $${decompositionFacteursPremiers(nbBoites)}=${nbBoites}$.`,
        `Le nombre maximal de boites qu'il pourra réaliser est donc $${nbBoites}$.`,
        `Il y aura donc $\\dfrac{${nbTruffesCafe}}{${nbBoites}}=${nbTruffesCafeParBoite}$ truffes au café par boite et $\\dfrac{${nbTruffesCoco}}{${nbBoites}}=${nbTruffesCocoParBoite}$ truffes à la noix de coco par boite.<br><br>`
      ],
      style: 'alpha',
      classOptions: 'py-2'
    })

    // correction question 2
    let correctionQuestion2 = ''
    correctionQuestion2 += `Dans cette question, chacune des $${nbTruffesParBoite}$ truffes est assimilée à une boule de diamètre $${texNombre(diametreTruffes, 1)}$ cm.<br>`
    correctionQuestion2 += 'À l\'intérieur d\'une boîte, pour que les truffes ne s\'abîment pas pendant le transport, le volume occupé par les truffes doit être supérieur au volume non occupé par les truffes.<br>'
    const sousListe1 = {
      items: [`La pyramide a une base carrée de côté $${texNombre(basePyramide, 1)}$ cm, l'aire de sa base est donc en cm$^2$ : $${texNombre(basePyramide, 1)}\\times ${texNombre(basePyramide, 1)} = ${texNombre(basePyramide ** 2, 2)}$cm$^2$.`,
      `Son volume en cm$^3$ est : $\\dfrac{\\text{aire de la base}\\times\\text{hauteur}}{3}=\\dfrac{${texNombre(basePyramide ** 2, 2)}\\times ${hauteurPyramide}}{3}${egalOuApprox(volumePyramide, 1)}${texNombre(volumePyramide, 1)}$ cm$^3$.`,
      `Le volume de la pyramide est d'environ $${texNombre(volumePyramide, 1)}$ cm$^3$ ; celui des truffes est d'environ $${texNombre(volumeTotalTruffe, 1)}$ cm$^3$.`,
      `Le volume non occupé par les truffes est d'environ $${texNombre(volumePyramide, 1)}-${texNombre(volumeTotalTruffe, 1)}$ soit $${texNombre(volumePyramide - volumeTotalTruffe, 1)}$ cm$^3$`,
      paveQuiConvient
        ? 'il est supérieur au volume des truffes, donc la boite en forme de pyramide ne convient pas.'
        : 'il est inférieur au volume des truffes, donc la boite en forme de pyramide convient.'],
      style: 'fleches',
      introduction: 'La pyramide :'
    }
    const sousListe2 = {
      items: [`Le pavé droit a pour volume en cm$^3$ de : $${texNombre(largeurPave, 1)}\\times ${texNombre(longueurPave, 1)} \\times ${texNombre(hauteurPave, 1)}=${texNombre(volumePave, 3)}$.`,
      `Le volume du pavé droit est de $${texNombre(volumePave, 1)}$ cm$^3$ ; celui des truffes est d'environ $${texNombre(volumeTotalTruffe, 1)}$ cm$^3$.`,
      `Le volume non occupé par les truffes est d'environ $${texNombre(volumePave, 1)}-${texNombre(volumeTotalTruffe, 1)}$ soit $${texNombre(volumePave - volumeTotalTruffe, 1)}$ cm$^3$.`,
      paveQuiConvient
        ? 'il est inférieur au volume des truffes, donc la boite en forme de pavé droit convient.'
        : 'il est supérieur au volume des truffes, donc la boite en forme de pavé droit ne convient pas.'],
      style: 'fleches',
      introduction: 'Le pavé droit :'
    }
    correctionQuestion2 += createList({
      items: [`Une truffe est assimilée à une boule de diamètre $${texNombre(diametreTruffes, 1)}$ cm, donc de rayon $${texNombre(diametreTruffes / 2, 2)}$ cm et son voulme en cm$^3$ est : $\\dfrac{4}{3}\\times\\pi\\times${texNombre(diametreTruffes / 2, 2)}^3$.`,
      `Le volume occupé par $${nbTruffesParBoite}$ truffes est donc de : $${nbTruffesParBoite}\\times\\dfrac{4}{3}\\times\\pi\\times${texNombre(diametreTruffes / 2, 2)}^3=\\dfrac{${texNombre(nbTruffesParBoite * 4 * (diametreTruffes / 2) ** 3, 4)}}{3}\\pi$ soit environ $${texNombre(nbTruffesParBoite * 4 * Math.PI * (diametreTruffes / 2) ** 3 / 3, 1)}$cm$^3$.`,
      sousListe1,
      sousListe2
      ],
      style: 'puces'
    })

    this.listeCorrections[0] = texteCorr + createList({
      items: [correctionQuestion1, correctionQuestion2],
      style: 'nombres'
    })
    listeQuestionsToContenu(this)
  }
}
