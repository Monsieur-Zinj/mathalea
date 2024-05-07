import Decimal from 'decimal.js'
import { codageAngle, codageAngleDroit } from '../../lib/2d/angles.js'
import { milieu, point } from '../../lib/2d/points.js'
import { barycentre, nommePolygone, polygone } from '../../lib/2d/polygones.js'
import { longueur, segment } from '../../lib/2d/segmentsVecteurs.js'
import { latexParPoint } from '../../lib/2d/textes.ts'
import { homothetie, rotation } from '../../lib/2d/transformations.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { quatriemeProportionnelle } from '../../lib/outils/calculs'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { creerNomDePolygone, numAlpha } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import Grandeur from '../../modules/Grandeur'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '21/03/2022'

export const titre = 'Calculer une longueur dans un triangle rectangle en utilisant la trigonométrie'

/**
 * @author Jean-Claude Lhote à partir de 3G30-1 de Rémi Angot
 * 3G30 Exercice remplaçant l'exercice initial utilisant MG32
 * Calculer une longueur en utilisant l'un des trois rapport trigonométrique.
 * * Si this.level=4 alors seul le cosinus sera utilisé.
 * Mars 2021
 * combinaisonListes des questions par Guillaume Valmont le 23/05/2022
 */
export const uuid = 'bd6b1'
export const ref = '3G30'
export const refs = {
  'fr-fr': ['3G30'],
  'fr-ch': []
}
export default function CalculDeLongueur () {
  Exercice.call(this)
  this.nbQuestions = 3
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = false
  this.correctionDetailleeDisponible = true
  this.correctionDetaillee = false
  this.interactif = false
  if (context.isHtml) {
    this.spacing = 2
    this.spacingCorr = 3
  } else {
    this.spacing = 2
    this.spacingCorr = 2
  }

  this.nouvelleVersion = function () {
    this.consigne = ''
    this.autoCorrection = []
    this.listeQuestions = []
    this.listeCorrections = []
    let reponse
    let listeDeNomsDePolygones
    let typeQuestionsDisponibles = ['cosinus', 'sinus', 'tangente', 'invCosinus', 'invSinus', 'invTangente']
    if (this.level === 4) typeQuestionsDisponibles = ['cosinus', 'invCosinus']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0; i < this.nbQuestions; i++) {
      const unite = choice(['m', 'cm', 'dm', 'mm'])
      if (i % 3 === 0) listeDeNomsDePolygones = ['QD']
      const nom = creerNomDePolygone(3, listeDeNomsDePolygones)
      listeDeNomsDePolygones.push(nom)
      let texte = ''
      let texteAMC = ''
      let q2AMC = ''
      let nom1, nom2
      let texteCorr = ''
      const objetsEnonce = []
      const objetsCorrection = []
      let ab, bc, ac

      const angleABC = randint(35, 55)
      const angleABCr = Decimal.acos(-1).div(180).mul(angleABC)
      if (!context.isHtml && this.sup) {
        // texte += '\\begin{minipage}{.7\\linewidth}\n'
      }
      switch (listeTypeQuestions[i]) {
        case 'cosinus': // AB=BCxcos(B)
          bc = new Decimal(randint(10, 15))
          ab = Decimal.cos(angleABCr).mul(bc)
          ac = Decimal.sin(angleABCr).mul(bc)
          texteAMC += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> $${nom[1] + nom[2]}=${bc}$ ${unite} et $\\widehat{${nom}}=${angleABC}^\\circ$.<br>`
          nom1 = nom[0]
          nom2 = nom[1]
          break
        case 'sinus':
          bc = new Decimal(randint(10, 15))
          ab = Decimal.cos(angleABCr).mul(bc)
          ac = Decimal.sin(angleABCr).mul(bc)
          texteAMC += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> $${nom[1] + nom[2]}=${bc}$ ${unite} et $\\widehat{${nom}}=${angleABC}^\\circ$.<br>`
          nom1 = nom[0]
          nom2 = nom[2]
          break
        case 'tangente':
          ab = new Decimal(randint(7, 10))
          ac = Decimal.tan(angleABCr).mul(ab)
          bc = new Decimal(ab).div(Decimal.cos(angleABCr))
          texteAMC += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> $${nom[0] + nom[1]}=${ab}$ ${unite} et $\\widehat{${nom}}=${angleABC}^\\circ$.<br>`
          nom1 = nom[0]
          nom2 = nom[2]
          break
        case 'invCosinus':
          ab = new Decimal(randint(7, 10))
          bc = new Decimal(ab).div(Decimal.cos(angleABCr))
          ac = Decimal.sin(angleABCr).mul(bc)
          texteAMC += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> $${nom[0] + nom[1]}=${ab}$ ${unite} et $\\widehat{${nom}}=${angleABC}^\\circ$.<br>`
          nom1 = nom[1]
          nom2 = nom[2]
          break
        case 'invSinus':
          ac = new Decimal(randint(7, 10))
          bc = new Decimal(ac).div(Decimal.sin(angleABCr))
          ab = Decimal.cos(angleABCr).mul(bc)
          texteAMC += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> $${nom[0] + nom[2]}=${ac}$ ${unite} et $\\widehat{${nom}}=${angleABC}^\\circ$.<br>`
          nom1 = nom[1]
          nom2 = nom[2]
          break
        case 'invTangente':
          ac = new Decimal(randint(7, 10))
          bc = new Decimal(ac).div(Decimal.sin(angleABCr))
          ab = Decimal.cos(angleABCr).mul(bc)
          texteAMC += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> $${nom[0] + nom[2]}=${ac}$ ${unite} et $\\widehat{${nom}}=${angleABC}^\\circ$.<br>`
          nom1 = nom[0]
          nom2 = nom[1]
          break
      }
      texte += texteAMC + `Calculer $${nom1 + nom2}$ à $0,1$ ${unite} près.`
      q2AMC = `Calculer $${nom1 + nom2}$ au dixième de ${unite}.`

      if (!context.isHtml && this.sup) {
        // texte += '\n\\end{minipage}\n'
      }
      const a = point(0, 0)
      const b = point(ab, 0)
      const c = point(0, ac)
      const p1 = polygone(a, b, c)
      // p1.isVisible = false
      const p2 = rotation(p1, a, randint(0, 360))
      const A = p2.listePoints[0]
      const B = p2.listePoints[1]
      const C = p2.listePoints[2]
      const codage = codageAngleDroit(B, A, C)
      A.nom = nom[0]
      B.nom = nom[1]
      C.nom = nom[2]
      const nomme = nommePolygone(p2, nom)
      const hypo = segment(C, B, 'blue')
      hypo.epaisseur = 2
      const codageDeAngle = codageAngle(A, B, C, 2)
      const mAB = milieu(A, B)
      const mAC = milieu(A, C)
      const mBC = milieu(B, C)
      const G = barycentre(p2)
      const m3 = homothetie(mBC, G, 1 + 1.5 / longueur(G, mBC), 'm3', 'center')
      const m1 = homothetie(mAB, mBC, 1 + 1.5 / longueur(mBC, mAB), 'm1', 'center')
      const m2 = homothetie(mAC, mBC, 1 + 1.5 / longueur(mBC, mAC), 'm2', 'center')
      let m4
      let t1, t2, t3
      let nomLongueur // la longueur à déterminer
      let calcul0, calcul1, calcul2, calcul3, calcul4, calcul5 // les propsitions de calcul pour AMC
      let calculTrue
      switch (listeTypeQuestions[i]) {
        case 'cosinus': // AB=BCxcos(B)
          t3 = latexParPoint(`${bc} \\text{ ${unite}}`, m3, 'black', 120, 12, '')
          t2 = latexParPoint('?', m1, 'black', 120, 12, '')
          m4 = homothetie(G, B, 2.7 / longueur(B, G), 'B2', 'center')
          t1 = latexParPoint(`${angleABC}^\\circ`, m4, 'black', 20, 12, '')
          break
        case 'sinus':
          t3 = latexParPoint(`${bc} \\text{ ${unite}}`, m3, 'black', 120, 12, '')
          t2 = latexParPoint('?', m2, 'black', 120, 12, '')
          m4 = homothetie(G, B, 2.7 / longueur(B, G), 'B2', 'center')
          t1 = latexParPoint(`${angleABC}^\\circ`, m4, 'black', 100, 12, '')
          break
        case 'tangente':
          t1 = latexParPoint(`${ab} \\text{ ${unite}}`, m1, 'black', 120, 12, '')
          t2 = latexParPoint('?', m2, 'black', 120, 12, '')
          m4 = homothetie(G, B, 2.7 / longueur(B, G), 'B2', 'center')
          t3 = latexParPoint(`${angleABC}^\\circ`, m4, 'black', 100, 12, '')
          break
        case 'invCosinus':
          t1 = latexParPoint(`${ab} \\text{ ${unite}}`, m1, 'black', 120, 12, '')
          t3 = latexParPoint('?', m3, 'black', 120, 12, '')
          m4 = homothetie(G, B, 2.7 / longueur(B, G), 'B2', 'center')
          t2 = latexParPoint(`${angleABC}^\\circ`, m4, 'black', 100, 12, '')
          break
        case 'invSinus':
          t2 = latexParPoint(`${ac} \\text{ ${unite}}`, m2, 'black', 120, 12, '')
          t3 = latexParPoint('?', m3, 'black', 120, 12, '')
          m4 = homothetie(G, B, 2.7 / longueur(B, G), 'B2', 'center')
          t1 = latexParPoint(`${angleABC}^\\circ`, m4, 'black', 100, 12, '')
          break
        case 'invTangente':
          t2 = latexParPoint(`${ac} \\text{ ${unite}}`, m2, 'black', 120, 12, '')
          t1 = latexParPoint('?', m1, 'black', 120, 12, '')
          m4 = homothetie(G, B, 2.7 / longueur(B, G), 'B2', 'center')
          t3 = latexParPoint(`${angleABC}^\\circ`, m4, 'black', 100, 12, '')
          break
      }
      objetsEnonce.push(p2, codage, nomme, t1, t2, t3, codageDeAngle)
      objetsCorrection.push(p2, codage, nomme, t1, t2, t3, hypo, codageDeAngle)

      const paramsEnonce = {
        xmin: Math.min(A.x, B.x, C.x) - 2,
        ymin: Math.min(A.y, B.y, C.y) - 2,
        xmax: Math.max(A.x, B.x, C.x) + 2,
        ymax: Math.max(A.y, B.y, C.y) + 2,
        pixelsParCm: 20,
        scale: 0.37,
        mainlevee: true,
        amplitude: context.isHtml ? 0.4 : 1
      }
      const paramsCorrection = {
        xmin: Math.min(A.x, B.x, C.x) - 4,
        ymin: Math.min(A.y, B.y, C.y) - 4,
        xmax: Math.max(A.x, B.x, C.x) + 2,
        ymax: Math.max(A.y, B.y, C.y) + 2,
        pixelsParCm: 20,
        scale: 0.35,
        mainlevee: false
      }
      if (!context.isHtml && this.sup) {
        texte += '\\\\' // \\begin{minipage}{.3\\linewidth}\n'
      }
      if (this.sup) {
        texte += mathalea2d(paramsEnonce, objetsEnonce) + '<br>'
      }
      if (this.correctionDetaillee) {
        if (!context.isHtml) {
          texteCorr += '\\begin{minipage}{.4\\linewidth}\n'
        }
        texteCorr += mathalea2d(paramsCorrection, objetsCorrection)
        if (!context.isHtml) {
          texteCorr += '\n\\end{minipage}\n' + '\\begin{minipage}{.7\\linewidth}\n'
        }
      }
      if (!context.isHtml && this.sup) {
        // texte += '\n\\end{minipage}\n'
      }
      switch (listeTypeQuestions[i]) {
        case 'cosinus': // AB=BCxcos(B)
          texteCorr += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> le cosinus de l'angle $\\widehat{${nom}}$ est défini par :<br>`
          texteCorr += `$\\cos\\left(\\widehat{${nom}}\\right)=\\dfrac{${nom[0] + nom[1]}}{${nom[1] + nom[2]}}$.<br>`
          texteCorr += 'Avec les données numériques :<br>'
          texteCorr += `$\\dfrac{\\cos\\left(${angleABC}^\\circ\\right)}{\\color{red}{1}}=${texFractionFromString(nom[0] + nom[1], bc)}$<br>`
          texteCorr += `${texteEnCouleurEtGras('Les produits en croix sont égaux, donc : ', 'red')}<br>`
          texteCorr += `$${nom[0] + nom[1]}=${quatriemeProportionnelle('\\color{red}{1}', bc, `\\cos\\left(${angleABC}^\\circ\\right)`)}$`
          texteCorr += `soit $${nom[0] + nom[1]}\\approx${texNombre(ab, 1)}$ ${unite}.`
          reponse = ab.toDP(1)
          nomLongueur = `$${nom[0] + nom[1]}$`
          calcul0 = `$${nom[1] + nom[2]}\\times\\cos\\left(${angleABC}^\\circ\\right)$`
          calcul1 = `$${nom[1] + nom[2]}\\times\\sin\\left(${angleABC}^\\circ\\right)$`
          calcul2 = `$${nom[1] + nom[2]}\\times\\tan\\left(${angleABC}^\\circ\\right)$`
          calcul3 = `$\\dfrac{${nom[1] + nom[2]}}{\\cos\\left(${angleABC}^\\circ\\right)}$`
          calcul4 = `$\\dfrac{${nom[1] + nom[2]}}{\\sin\\left(${angleABC}^\\circ\\right)}$`
          calcul5 = `$\\dfrac{${nom[1] + nom[2]}}{\\tan\\left(${angleABC}^\\circ\\right)}$`
          calculTrue = 0
          break
        case 'sinus':
          texteCorr += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> le sinus de l'angle $\\widehat{${nom}}$ est défini par :<br>`
          texteCorr += `$\\sin \\left(\\widehat{${nom}}\\right)=${texFractionFromString(nom[0] + nom[2], nom[1] + nom[2])}$<br>`
          texteCorr += 'Avec les données numériques :<br>'
          texteCorr += `$\\dfrac{\\sin\\left(${angleABC}^\\circ\\right)}{\\color{red}{1}}=${texFractionFromString(nom[0] + nom[2], bc)}$<br>`
          texteCorr += `${texteEnCouleurEtGras('Les produits en croix sont égaux, donc : ', 'red')}<br>`
          texteCorr += `$${nom[0] + nom[2]}=${quatriemeProportionnelle('\\color{red}{1}', bc, `\\sin\\left(${angleABC}^\\circ\\right)`)}$`
          texteCorr += `soit $${nom[0] + nom[2]}\\approx${texNombre(ac, 1)}$ ${unite}.`
          reponse = ac.toDP(1)
          nomLongueur = `$${nom[0] + nom[2]}$`
          calcul0 = `$${nom[1] + nom[2]}\\times\\cos\\left(${angleABC}^\\circ\\right)$`
          calcul1 = `$${nom[1] + nom[2]}\\times\\sin\\left(${angleABC}^\\circ\\right)$`
          calcul2 = `$${nom[1] + nom[2]}\\times\\tan\\left(${angleABC}^\\circ\\right)$`
          calcul3 = `$\\dfrac{${nom[1] + nom[2]}}{\\cos\\left(${angleABC}^\\circ\\right)}$`
          calcul4 = `$\\dfrac{${nom[1] + nom[2]}}{\\sin\\left(${angleABC}^\\circ\\right)}$`
          calcul5 = `$\\dfrac{${nom[1] + nom[2]}}{\\tan\\left(${angleABC}^\\circ\\right)}$`
          calculTrue = 1
          break
        case 'tangente':
          texteCorr += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> la tangente de l'angle $\\widehat{${nom}}$ est défini par :<br>`
          texteCorr += `$\\tan \\left(\\widehat{${nom}}\\right)=${texFractionFromString(nom[0] + nom[2], nom[0] + nom[1])}$<br>`
          texteCorr += 'Avec les données numériques :<br>'
          texteCorr += `$\\dfrac{\\tan\\left(${angleABC}^\\circ\\right)}{\\color{red}{1}}=${texFractionFromString(nom[0] + nom[2], ab)}$<br>`
          texteCorr += `${texteEnCouleurEtGras('Les produits en croix sont égaux, donc : ', 'red')}<br>`
          texteCorr += `$${nom[0] + nom[2]}=${quatriemeProportionnelle('\\color{red}{1}', ab, `\\tan\\left(${angleABC}^\\circ\\right)`)}$`
          texteCorr += `soit $${nom[0] + nom[2]}\\approx${texNombre(ac, 1)}$ ${unite}.`
          reponse = ac.toDP(1)
          nomLongueur = `$${nom[0] + nom[2]}$`
          calcul0 = `$${nom[0] + nom[1]}\\times\\cos\\left(${angleABC}^\\circ\\right)$`
          calcul1 = `$${nom[0] + nom[1]}\\times\\sin\\left(${angleABC}^\\circ\\right)$`
          calcul2 = `$${nom[0] + nom[1]}\\times\\tan\\left(${angleABC}^\\circ\\right)$`
          calcul3 = `$\\dfrac{${nom[0] + nom[1]}}{\\cos\\left(${angleABC}^\\circ\\right)}$`
          calcul4 = `$\\dfrac{${nom[0] + nom[1]}}{\\sin\\left(${angleABC}^\\circ\\right)}$`
          calcul5 = `$\\dfrac{${nom[0] + nom[1]}}{\\tan\\left(${angleABC}^\\circ\\right)}$`
          calculTrue = 2
          break
        case 'invCosinus':
          texteCorr += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> le cosinus de l'angle $\\widehat{${nom}}$ est défini par :<br>`
          texteCorr += `$\\cos\\left(\\widehat{${nom}}\\right)=\\dfrac{${nom[0] + nom[1]}}{${nom[1] + nom[2]}}$.<br>`
          texteCorr += 'Avec les données numériques :<br>'
          texteCorr += `$\\dfrac{\\cos\\left(${angleABC}^\\circ\\right)}{\\color{red}{1}}=${texFractionFromString(ab, nom[1] + nom[2])}$<br>`
          texteCorr += `${texteEnCouleurEtGras('Les produits en croix sont égaux, donc : ', 'red')}<br>`
          texteCorr += `$${nom[1] + nom[2]}=${quatriemeProportionnelle(`\\cos\\left(${angleABC}^\\circ\\right)`, ab, '\\color{red}{1}')}$`
          texteCorr += `soit $${nom[1] + nom[2]}\\approx${texNombre(bc, 1)}$ ${unite}.`
          reponse = bc.toDP(1)
          nomLongueur = `$${nom[1] + nom[2]}$`
          calcul0 = `$${nom[0] + nom[1]}\\times\\cos\\left(${angleABC}^\\circ\\right)$`
          calcul1 = `$${nom[0] + nom[1]}\\times\\sin\\left(${angleABC}^\\circ\\right)$`
          calcul2 = `$${nom[0] + nom[1]}\\times\\tan\\left(${angleABC}^\\circ\\right)$`
          calcul3 = `$\\dfrac{${nom[0] + nom[1]}}{\\cos\\left(${angleABC}^\\circ\\right)}$`
          calcul4 = `$\\dfrac{${nom[0] + nom[1]}}{\\sin\\left(${angleABC}^\\circ\\right)}$`
          calcul5 = `$\\dfrac{${nom[0] + nom[1]}}{\\tan\\left(${angleABC}^\\circ\\right)}$`
          calculTrue = 3
          break
        case 'invSinus':
          texteCorr += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> le sinus de l'angle $\\widehat{${nom}}$ est défini par :<br>`
          texteCorr += `$\\sin \\left(\\widehat{${nom}}\\right)=${texFractionFromString(nom[0] + nom[2], nom[1] + nom[2])}$<br>`
          texteCorr += 'Avec les données numériques :<br>'
          texteCorr += `$\\dfrac{\\sin\\left(${angleABC}^\\circ\\right)}{\\color{red}{1}}=${texFractionFromString(ac, nom[1] + nom[2])}$<br>`
          texteCorr += `${texteEnCouleurEtGras('Les produits en croix sont égaux, donc : ', 'red')}<br>`
          texteCorr += `$${nom[1] + nom[2]}=${quatriemeProportionnelle(`\\sin\\left(${angleABC}^\\circ\\right)`, ac, '\\color{red}{1}')}$`
          texteCorr += `soit $${nom[1] + nom[2]}\\approx${texNombre(bc, 1)}$ ${unite}.`
          reponse = bc.toDP(1)
          nomLongueur = `$${nom[1] + nom[2]}$`
          calcul0 = `$${nom[0] + nom[2]}\\times\\cos\\left(${angleABC}^\\circ\\right)$`
          calcul1 = `$${nom[0] + nom[2]}\\times\\sin\\left(${angleABC}^\\circ\\right)$`
          calcul2 = `$${nom[0] + nom[2]}\\times\\tan\\left(${angleABC}^\\circ\\right)$`
          calcul3 = `$\\dfrac{${nom[0] + nom[2]}}{\\cos\\left(${angleABC}^\\circ\\right)}$`
          calcul4 = `$\\dfrac{${nom[0] + nom[2]}}{\\sin\\left(${angleABC}^\\circ\\right)}$`
          calcul5 = `$\\dfrac{${nom[0] + nom[2]}}{\\tan\\left(${angleABC}^\\circ\\right)}$`
          calculTrue = 4
          break
        case 'invTangente':
          texteCorr += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$,<br> la tangente de l'angle $\\widehat{${nom}}$ est défini par :<br>`
          texteCorr += `$\\tan \\left(\\widehat{${nom}}\\right)=${texFractionFromString(nom[0] + nom[2], nom[0] + nom[1])}$<br>`
          texteCorr += 'Avec les données numériques :<br>'
          texteCorr += `$\\dfrac{\\tan\\left(${angleABC}^\\circ\\right)}{\\color{red}{1}}=${texFractionFromString(ac, nom[0] + nom[1])}$<br>`
          texteCorr += `${texteEnCouleurEtGras('Les produits en croix sont égaux, donc : ', 'red')}<br>`
          texteCorr += `$${nom[0] + nom[1]}=${quatriemeProportionnelle(`\\tan\\left(${angleABC}^\\circ\\right)`, ac, '\\color{red}{1}')}$`
          texteCorr += `soit $${nom[0] + nom[1]}\\approx${texNombre(ab, 1)}$ ${unite}.`
          reponse = ab.toDP(1)
          nomLongueur = `$${nom[0] + nom[1]}$`
          calcul0 = `$${nom[0] + nom[2]}\\times\\cos\\left(${angleABC}^\\circ\\right)$`
          calcul1 = `$${nom[0] + nom[2]}\\times\\sin\\left(${angleABC}^\\circ\\right)$`
          calcul2 = `$${nom[0] + nom[2]}\\times\\tan\\left(${angleABC}^\\circ\\right)$`
          calcul3 = `$\\dfrac{${nom[0] + nom[2]}}{\\cos\\left(${angleABC}^\\circ\\right)}$`
          calcul4 = `$\\dfrac{${nom[0] + nom[2]}}{\\sin\\left(${angleABC}^\\circ\\right)}$`
          calcul5 = `$\\dfrac{${nom[0] + nom[2]}}{\\tan\\left(${angleABC}^\\circ\\right)}$`
          calculTrue = 5
          break
      }
      if (!context.isHtml && this.correctionDetaillee) {
        texteCorr += '\n\\end{minipage}\n'
      }
      /*****************************************************/
      // Pour AMC
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texteAMC + (this.sup ? mathalea2d(paramsEnonce, objetsEnonce) + '<br>La figure ci-dessus ne respecte pas les dimensions.' : ''), // + '\\\\\n',
          enonceAvantUneFois: true,
          // enonceApresNumQuestion: true,
          options: {
            multicols: false,
            barreseparation: true,
            multicolsAll: true,
            numerotationEnonce: true
          },
          propositions: [
            {
              type: 'qcmMono',
              enonce: numAlpha(0) + `Quel calcul effectuer pour calculer ${nomLongueur} ?`, // \\\\\n`,
              options: {
                ordered: true
              },
              propositions: [
                {
                  texte: calcul0,
                  statut: calculTrue === 0,
                  feedback: ''
                },
                {
                  texte: calcul1,
                  statut: calculTrue === 1,
                  feedback: ''
                },
                {
                  texte: calcul2,
                  statut: calculTrue === 2,
                  feedback: ''
                },
                {
                  texte: calcul3,
                  statut: calculTrue === 3,
                  feedback: ''
                },
                {
                  texte: calcul4,
                  statut: calculTrue === 4,
                  feedback: ''
                },
                {
                  texte: calcul5,
                  statut: calculTrue === 5,
                  feedback: ''
                }
              ]
            },
            {
              type: 'AMCNum',
              propositions: [
                {
                  reponse: {
                    texte: numAlpha(1) + q2AMC, // `${nomLongueur} arrondie au dixième de ${unite}:\\\\\n`,
                    valeur: [reponse],
                    param: {
                      digits: 3,
                      decimals: 1,
                      signe: false,
                      exposantNbChiffres: 0,
                      exposantSigne: false,
                      approx: 1
                    }
                  }
                }]
            }
          ]
        }
      }
      if (context.isHtml && !context.isAmc) {
        texte += ajouteChampTexteMathLive(this, i, 'largeur25 inline unites[Longueur]')
        setReponse(this, i, new Grandeur(reponse, unite), { formatInteractif: 'unites' })
      }
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }

  this.besoinFormulaireCaseACocher = ['Figure à main levée', false]
}
