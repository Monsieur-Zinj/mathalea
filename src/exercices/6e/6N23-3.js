import { point } from '../../lib/2d/points.js'
import { droiteGraduee } from '../../lib/2d/reperes.js'
import { segment } from '../../lib/2d/segmentsVecteurs.js'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { nombreDeChiffresDe } from '../../lib/outils/nombres'
import { stringNombre, texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import Decimal from 'decimal.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = 'Lire une abscisse décimale grâce à des zooms successifs'

export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDeModifImportante = '05/09/2024'
/**
 * Ajout Interactivité et AMC : Janvier 2022 par EE
 */
export const uuid = '23c48'
export const ref = '6N23-3'
export const refs = {
  'fr-fr': ['6N23-3'],
  'fr-ch': ['9NO11-7']
}
export default function LireUneAbscisseAvecZoom () {
  Exercice.call(this)
  this.niveau = 'sixième'
  this.sup = 3
  if (context.isHtml) {
    this.spacing = 2
    this.spacingCorr = 3
  } else {
    this.spacing = 1
    this.spacingCorr = 1
  }
  this.vspace = -1
  this.nbCols = 1
  this.nbColsCorr = 1
  this.nbQuestions = 1

  this.nouvelleVersion = function () {
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let reponse1
      let reponse2A
      let reponse2B
      let reponse3
      let d1
      let d2
      let d3
      let d3Corr
      let d1Corr
      let d2Corr
      let extremite
      let extreme
      const noms = choisitLettresDifferentes(5, 'QFN')
      let x1 = 0
      let x2 = 0
      let x3 = 0
      const objets = []
      let fenetre
      let thickOff = 0
      const objetsCorr = []
      let xmin
      let xmax
      let origine
      let pA1
      let pA2
      let pB1
      let pB2
      let sA
      let sB
      let x21
      let x31
      let pC1
      let pC2
      let pD1
      let pD2
      let sC
      let sD
      if (this.sup === 1) {
        if (this.niveau === 'CM') {
          xmin = 0
          thickOff = 0
          origine = 0
          extreme = 9
          xmax = 9
        } else {
          xmin = randint(5, 10) - 0.2
          origine = Math.round(xmin + 0.2)
          extreme = origine + 9
          thickOff = 0.1
          xmax = origine + 9.2
        }

        const alea1 = new Decimal(randint(2, 8)).div(10)
        x1 = new Decimal(xmin).add(alea1).add(0.2).add(randint(1, 5))

        if (xmin === 0) extremite = '|->'
        else extremite = '->'

        d1 = droiteGraduee({
          x: 0,
          y: 3,
          Min: xmin,
          axePosition: 'H',
          Max: xmax + 0.2,
          thickSec: true,
          thickTer: false,
          Unite: 3,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 4,
          labelsPrincipaux: false,
          labelListe: [[origine, `${stringNombre(origine)}`], [extreme, `${stringNombre(extreme)}`]],
          pointListe: [[x1, `${noms[1]}`], [x1.floor(), `${noms[0]}`], [x1.add(1).floor(), `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })

        d2 = droiteGraduee({
          x: x1.sub(xmin).add(1.5).floor().toNumber(),
          y: 0,
          Min: x1.floor().toNumber(),
          axePosition: 'H',
          Max: x1.add(1).floor().toNumber(),
          thickSec: true,
          thickTer: false,
          Unite: 20,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 4,
          labelsPrincipaux: false,
          pointListe: [[x1, `${noms[1]}`], [x1.floor(), `${noms[0]}`], [x1.add(1).floor(), `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })
        d1Corr = droiteGraduee({
          x: 0,
          y: 3,
          Min: xmin,
          axePosition: 'H',
          Max: xmax + 0.2,
          thickSec: true,
          thickTer: false,
          Unite: 3,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 4,
          labelsPrincipaux: true,
          labelListe: [[origine, `${stringNombre(origine)}`], [extreme, `${stringNombre(extreme)}`]],
          pointListe: [[x1, `${noms[1]}`], [x1.floor(), `${noms[0]}`], [Math.floor(x1 + 1), `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })
        d2Corr = droiteGraduee({
          x: x1.floor().sub(xmin).add(1.5).toNumber(),
          y: 0,
          Min: x1.floor().toNumber(),
          axePosition: 'H',
          Max: x1.add(1).floor().toNumber(),
          thickSec: true,
          thickTer: false,
          Unite: 20,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 4,
          labelsPrincipaux: false,
          labelsSecondaires: true,
          labelListe: [[x1.floor(), `${stringNombre(x1.floor())}`], [x1, `${stringNombre(x1)}`], [Math.ceil(x1), `${stringNombre(Math.ceil(x1))}`]],
          pointListe: [[x1, `${noms[1]}`], [x1.floor(), `${noms[0]}`], [Math.floor(x1 + 1), `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })

        pA1 = point((x1.floor().toNumber() - xmin) * 3, 3)
        pA2 = point(x1.floor().toNumber() - xmin + 1.5, 0)
        pB1 = point((x1.floor().toNumber() + 1 - xmin) * 3, 3)
        pB2 = point(x1.floor().toNumber() - xmin + 21.5, 0)
        sA = segment(pA1, pA2)
        sB = segment(pB1, pB2)
        sA.pointilles = 5
        sB.pointilles = 5
        objets.push(d1, d2, sA, sB)
        objetsCorr.push(d1Corr, d2Corr, sA, sB)
        fenetre = { xmin: -1.5, xmax: 35, ymin: -1, ymax: 4.5, pixelsParCm: 25, scale: 0.5 }
        texteCorr = `L'abscisse de $${noms[1]} $est : $${texNombre(x1)}=${texNombre(x1.floor())} + ${texFractionFromString(calculANePlusJamaisUtiliser(10 * (x1 - x1.floor())), 10)}=${texFractionFromString(calculANePlusJamaisUtiliser(x1 * 10), 10)}$.<br>`

        const partent = x1.floor()
        const pardec = new Decimal(x1).sub(partent)
        texteCorr = `L'abscisse de $${noms[1]} $est : $${miseEnEvidence(texNombre(x1))}=${miseEnEvidence(`${texNombre(partent)} + ${new FractionEtendue(pardec * 10, 10).toLatex()}`)}=${miseEnEvidence(new FractionEtendue(x1 * 10, 10).toLatex())}$.<br>`

        reponse1 = x1
        reponse2A = partent
        reponse2B = new FractionEtendue(new Decimal(pardec).mul(10).toNumber(), 10)
        reponse3 = new FractionEtendue(new Decimal(x1).mul(10).toNumber(), 10)
      } else if (this.sup === 2) {
        if (this.niveau === 'CM') {
          xmin = 0
          thickOff = 0
        } else {
          xmin = randint(1, 15) - 0.02
          thickOff = 0.01
        }
        let alea1 = new Decimal(randint(2, 8)).div(10)
        const alea2 = new Decimal(randint(2, 8)).div(100)
        x1 = new Decimal(xmin).add(alea1).add(alea2)
        x2 = x1.mul(10).floor().div(10)
        alea1 = new Decimal(1).div(10)
        x3 = x2.add(alea1)
        xmin = this.niveau === 'CM' ? new Decimal(0) : x2.floor()
        xmax = new Decimal(xmin).add(1)

        if (xmin === 0) extremite = '|->'
        else extremite = '->'
        d1 = droiteGraduee({
          x: 0,
          y: 3,
          Min: xmin.sub(0.01).toNumber(),
          axePosition: 'H',
          Max: xmax.add(0.01).toNumber(),
          thickSec: true,
          thickTer: true,
          Unite: 30,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 8,
          thickDistance: 1,
          thickSecDist: 0.1,
          thickTerDist: 0.01,
          labelsPrincipaux: false,
          labelListe: [[x1.floor(), `${x1.floor()}`], [Math.ceil(x1), `${Math.ceil(x1)}`]],
          pointListe: [[x1, `${noms[1]}`], [x2, `${noms[0]}`], [x3, `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })
        d2 = droiteGraduee({
          x: x2.sub(xmin).add(6).toNumber(),
          y: 0,
          Min: x2.toNumber(),
          axePosition: 'H',
          Max: x2.add(0.1).toNumber(),
          thickSec: true,
          thickTer: false,
          Unite: 200,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 6,
          thickDistance: 0.1,
          thickSecDist: 0.01,
          thickTerDist: 0.001,
          labelsPrincipaux: false,
          pointListe: [[x1, `${noms[1]}`], [x2, `${noms[0]}`], [x2.add(0.1), `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })
        d1Corr = droiteGraduee({
          x: 0,
          y: 3,
          Min: xmin.toNumber(),
          axePosition: 'H',
          Max: xmax.toNumber(),
          thickSec: true,
          thickTer: true,
          Unite: 30,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 8,
          thickDistance: 1,
          thickSecDist: 0.1,
          thickTerDist: 0.01,
          labelsSecondaires: true,
          labelListe: [[x1.floor(), `${x1.floor()}`], [Math.ceil(x1), `${Math.ceil(x1)}`]],
          pointListe: [[x1, `${noms[1]}`], [x2, `${noms[0]}`], [x3, `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })
        d2Corr = droiteGraduee({
          x: (x2 - xmin) + 6,
          y: 0,
          Min: x2.toNumber(),
          axePosition: 'H',
          Max: x2.add(0.1).toNumber(),
          thickSec: true,
          thickTer: false,
          Unite: 200,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 6,
          thickDistance: 0.1,
          thickSecDist: 0.01,
          thickTerDist: 0.001,
          labelsPrincipaux: false,
          labelsSecondaires: true,
          labelListe: [[x2, `${stringNombre(x2)}`], [x1, `${stringNombre(x1)}`], [x3, `${stringNombre(x3)}`]],
          pointListe: [[x1, `${noms[1]}`], [x2, `${noms[0]}`], [x2.add(0.1), `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })

        pA1 = point((Math.floor(x1 * 10) / 10 - xmin) * 30, 3)
        pA2 = point(x2 - xmin + 6, 0)
        pB1 = point((Math.floor(x1 * 10) / 10 + 0.1 - xmin) * 30, 3)
        pB2 = point(x3 - xmin + 26, 0)
        sA = segment(pA1, pA2)
        sB = segment(pB1, pB2)
        sA.pointilles = 5
        sB.pointilles = 5
        fenetre = { xmin: -1.5, xmax: 35, ymin: -1.5, ymax: 4.5, pixelsParCm: 25, scale: 0.5 }
        objets.push(d1, d2, sA, sB)
        objetsCorr.push(d1Corr, d2Corr, sA, sB)
        const partent = x1.floor()
        const pardec = new Decimal(x1).sub(partent)
        texteCorr = `L'abscisse de $${noms[1]} $est : $${miseEnEvidence(texNombre(x1))}=${miseEnEvidence(`${texNombre(partent)} + ${new FractionEtendue(pardec * 100, 100).toLatex()}`)}=${miseEnEvidence(new FractionEtendue(x1 * 100, 100).toLatex())}$.<br>`

        reponse1 = x1
        reponse2A = partent
        reponse2B = new FractionEtendue(new Decimal(pardec).mul(100).toNumber(), 100)
        reponse3 = new FractionEtendue(new Decimal(x1).mul(100).toNumber(), 100)
      } else { // this.sup === 3
        if (this.niveau === 'CM') {
          xmin = 0
          thickOff = 0
        } else {
          xmin = randint(1, 15)
          thickOff = 0.001
        }
        let alea1 = new Decimal(randint(2, 8)).div(10)
        const alea2 = new Decimal(randint(2, 8)).div(100)
        const alea3 = new Decimal(randint(2, 8)).div(1000)
        x1 = new Decimal(xmin).add(alea1).add(alea2).add(alea3)
        x2 = x1.mul(10).floor().div(10)
        x21 = x1.mul(100).floor().div(100)
        alea1 = new Decimal(1).div(10)
        x3 = x2.add(alea1)
        alea1 = new Decimal(1).div(100)
        x31 = x21.add(alea1)
        xmin = this.niveau === 'CM' ? new Decimal(0) : x2.floor()
        xmax = new Decimal(xmin).add(1)
        if (xmin === 0) extremite = '|->'
        else extremite = '->'
        d1 = droiteGraduee({
          x: 0,
          y: 6,
          Min: xmin.toNumber() - 0.002,
          axePosition: 'H',
          Max: xmax.toNumber() + 0.002,
          thickSec: true,
          thickTer: true,
          Unite: 30,
          thickDistance: 1,
          thickSecDist: 0.1,
          thickTerDist: 0.01,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 6,
          labelsPrincipaux: true,
          labelListe: [[xmin, `${stringNombre(xmin)}`], [xmax, `${stringNombre(xmax)}`]],
          pointListe: [[x1, `${noms[1]}`], [x2, `${noms[0]}`], [x3, `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 3,
          axeStyle: extremite
        })
        d2 = droiteGraduee({
          x: 6.5,
          y: 3,
          Min: x2.toNumber(),
          axePosition: 'H',
          Max: x3.toNumber(),
          thickSec: true,
          thickTer: true,
          Unite: 200,
          thickSecDist: 0.01,
          thickTerDist: 0.001,
          thickDistance: 0.1,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 6,
          labelsPrincipaux: false,
          pointListe: [[x1, `${noms[1]}`], [x2, `${noms[0]}`], [x3, `${noms[2]}`], [x21, `${noms[3]}`], [x31, `${noms[4]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })
        d3 = droiteGraduee({
          x: 6.5,
          y: 0,
          Min: x21.toNumber(),
          axePosition: 'H',
          Max: x31.toNumber(),
          thickSec: true,
          thickTer: false,
          Unite: 2000,
          thickSecDist: 0.001,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 6,
          labelsPrincipaux: false,
          pointListe: [[x1, `${noms[1]}`], [x21, `${noms[3]}`], [x31, `${noms[4]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })
        d1Corr = droiteGraduee({
          x: 0,
          y: 6,
          Min: xmin.toNumber() - 0.002,
          axePosition: 'H',
          Max: xmax.toNumber() + 0.002,
          thickSec: true,
          thickTer: true,
          Unite: 30,
          thickDistance: 1,
          thickSecDist: 0.1,
          thickTerDist: 0.01,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 6,
          labelsPrincipaux: true,
          labelsSecondaires: true,
          labelListe: [[xmin, `${stringNombre(xmin)}`], [xmax, `${stringNombre(xmax)}`]],
          pointListe: [[x1, `${noms[1]}`], [x2, `${noms[0]}`], [x3, `${noms[2]}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 3,
          axeStyle: extremite
        })
        d2Corr = droiteGraduee({
          x: 6.5,
          y: 3,
          Min: x2.toNumber(),
          axePosition: 'H',
          Max: x3.toNumber(),
          thickSec: true,
          thickTer: true,
          Unite: 200,
          thickSecDist: 0.01,
          thickTerDist: 0.001,
          thickDistance: 0.1,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 6,
          labelsPrincipaux: false,
          labelsSecondaires: true,
          pointListe: [[x1, `${noms[1]}`], [x2, `${noms[0]}`], [x3, `${noms[2]}`], [x21, `${noms[3]}`], [x31, `${noms[4]}`]],
          labelListe: [[x2, `${stringNombre(x2)}`], [x3, `${stringNombre(x3)}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })
        d3Corr = droiteGraduee({
          x: 6.5,
          y: 0,
          Min: x21.toNumber(),
          axePosition: 'H',
          Max: x31.toNumber(),
          thickSec: true,
          thickTer: false,
          Unite: 2000,
          thickSecDist: 0.001,
          thickOffset: thickOff,
          thickCouleur: 'black',
          axeCouleur: 'black',
          axeHauteur: 6,
          labelsPrincipaux: false,
          labelsSecondaires: true,
          pointListe: [[x1, `${noms[1]}`], [x21, `${noms[3]}`], [x31, `${noms[4]}`]],
          labelListe: [[x21, `${stringNombre(x21)}`], [x31, `${stringNombre(x31)}`]],
          pointTaille: 6,
          pointOpacite: 0.8,
          pointCouleur: 'blue',
          pointStyle: '|',
          pointEpaisseur: 2,
          axeStyle: extremite
        })

        pA1 = point((x2 - xmin) * 30, 6)
        pA2 = point(6.5, 3)
        pB1 = point((x3 - xmin) * 30, 6)
        pB2 = point(26.5, 3)
        sA = segment(pA1, pA2)
        sB = segment(pB1, pB2)
        sA.pointilles = 5
        sB.pointilles = 5
        pC1 = point(6.5 + (x21 - x2) * 200, 3)
        pC2 = point(6.5, 0)
        pD1 = point(6.5 + (x31 - x2) * 200, 3)
        pD2 = point(26.5, 0)
        sC = segment(pC1, pC2)
        sD = segment(pD1, pD2)
        sC.pointilles = 5
        sD.pointilles = 5
        fenetre = { xmin: -1.5, xmax: 35, ymin: -1.5, ymax: 7.5, pixelsParCm: 25, scale: 0.5 }
        objets.push(d1, d2, d3, sA, sB, sC, sD)
        objetsCorr.push(d1Corr, d2Corr, d3Corr, sA, sB, sC, sD)
        const partent = x1.floor()
        const pardec = new Decimal(x1).sub(partent)
        texteCorr = `L'abscisse de $${noms[1]} $est : $${miseEnEvidence(texNombre(x1))}=${miseEnEvidence(`${texNombre(partent)} + ${new FractionEtendue(pardec * 1000, 1000).toLatex()}`)}=${miseEnEvidence(new FractionEtendue(x1 * 1000, 1000).toLatex())}$.<br>`
        reponse1 = x1
        reponse2A = partent
        reponse2B = new FractionEtendue(new Decimal(pardec).mul(1000).toNumber(), 1000)
        reponse3 = new FractionEtendue(new Decimal(x1).mul(1000).toNumber(), 1000)
      }
      texte = `Donner l'abscisse de $${noms[1]} $sous `
      texte += context.isAmc ? 'deux ' : 'trois '
      texte += 'formes : en écriture décimale'
      texte += context.isAmc ? '' : ', comme somme d\'un nombre entier et d\'une fraction décimale inférieure à 1,'
      texte += ' et sous forme d\'une seule fraction décimale.<br>'
      texte += mathalea2d(fenetre, objets)
      if (this.interactif) {
        handleAnswers(this, 3 * i, { reponse: { value: reponse1, compare: fonctionComparaison } })
        handleAnswers(this, 3 * i + 1, { reponse: { value: `${reponse2A}+${reponse2B.toLatex()}`, compare: fonctionComparaison, options: { operationSeulementEtNonCalcul: true } } })
        handleAnswers(this, 3 * i + 2, { reponse: { value: reponse1, compare: fonctionComparaison, options: { fractionDecimale: true } } })

        texte += ajouteChampTexteMathLive(this, i * 3, `  ${KeyboardType.numbersSpace}`, {
          texteAvant: `Abscisse de $${noms[1]}$ en écriture décimale : `
        })
        texte += '<br><br>' + ajouteChampTexteMathLive(this, i * 3 + 1, `  ${KeyboardType.numbersSpace}`, {
          texteAvant: `Abscisse de $${noms[1]}$ comme somme d'un nombre entier et d'une fraction décimale inférieure à 1 : `
        })
        texte += '<br><br>' + ajouteChampTexteMathLive(this, i * 3 + 2, `  ${KeyboardType.numbersSpace}`, {
          texteAvant: `Abscisse de $${noms[1]}$ sous forme d'une fraction décimale : `
        })
      } else if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte,
          // melange: false, // EE : ce champ est facultatif et permet (si false) de ne pas provoquer le mélange des questions.
          options: { multicols: true, barreseparation: false, numerotationEnonce: true },
          propositions: [
            {
              type: 'AMCNum', // on donne le type de la première question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
              propositions: [ // une ou plusieurs (Qcms) 'propositions'
                {
                  reponse: { // utilisé si type = 'AMCNum'
                    texte: `Abscisse de $${noms[1]}$ en écriture décimale : `, // facultatif
                    valeur: reponse1, // obligatoire (la réponse numérique à comparer à celle de l'élève). EE : Si une fraction est la réponse, mettre un tableau sous la forme [num,den]
                    alignement: 'center', // EE : ce champ est facultatif et n'est fonctionnel que pour l'hybride. Il permet de choisir où les cases sont disposées sur la feuille. Par défaut, c'est comme le texte qui le précède. Pour mettre à gauche, au centre ou à droite, choisir parmi ('flushleft', 'center', 'flushright').
                    param: {
                      digits: 0, // obligatoire pour AMC (le nombre de chiffres pour AMC, si digits est mis à 0, alors il sera déterminé pour coller au nombre décimal demandé)
                      decimals: 0, // facultatif. S'il n'est pas mis, il sera mis à 0 et sera déterminé automatiquement comme décrit ci-dessus
                      signe: false // (présence d'une case + ou -)
                    }
                  }
                }
              ]
            },
            {
              type: 'AMCNum', // on donne le type de la deuxième question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
              propositions: [ // une ou plusieurs (Qcms) 'propositions'
                {
                  reponse: { // utilisé si type = 'AMCNum'
                    texte: `Abscisse de $${noms[1]}$ sous forme d'une fraction décimale : `,
                    valeur: reponse3, // obligatoire (la réponse numérique à comparer à celle de l'élève). EE : Si une fraction est la réponse, mettre un tableau sous la forme [num,den]
                    alignement: 'center', // EE : ce champ est facultatif et n'est fonctionnel que pour l'hybride. Il permet de choisir où les cases sont disposées sur la feuille. Par défaut, c'est comme le texte qui le précède. Pour mettre à gauche, au centre ou à droite, choisir parmi ('flushleft', 'center', 'flushright').
                    param: {
                      digits: 0, // obligatoire pour AMC (le nombre de chiffres pour AMC, si digits est mis à 0, alors il sera déterminé pour coller au nombre décimal demandé)
                      decimals: 0, // facultatif. S'il n'est pas mis, il sera mis à 0 et sera déterminé automatiquement comme décrit ci-dessus
                      signe: false, // (présence d'une case + ou -)
                      digitsNum: nombreDeChiffresDe(reponse3.num), // Facultatif. digitsNum correspond au nombre TOTAL de chiffres du numérateur à coder si la réponse est une fraction.
                      digitsDen: nombreDeChiffresDe(reponse3.den) // Facultatif. digitsDencorrespond au nombre TOTAL de chiffres du dénominateur à coder si la réponse est une fraction.
                    }
                  }
                }
              ]
            }
          ]
        }
      }
      texteCorr += mathalea2d(fenetre, objetsCorr)
      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on la stocke dans la liste des questions
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, '1 : Au dixième\n2 : Au centième\n3 : Au millième']
}
