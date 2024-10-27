import { angleOriente, codageAngle, codageAngleDroit } from '../../lib/2d/angles.js'
import { milieu, point, pointIntersectionDD, tracePoint } from '../../lib/2d/points.js'
import { barycentre, nommePolygone, polygone } from '../../lib/2d/polygones.js'
import { longueur, segment } from '../../lib/2d/segmentsVecteurs.js'
import { latexParPoint } from '../../lib/2d/textes.ts'
import { homothetie, rotation, similitude } from '../../lib/2d/transformations.js'
import { choice, shuffle } from '../../lib/outils/arrayOutils'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { arrondi } from '../../lib/outils/nombres'
import { creerNomDePolygone } from '../../lib/outils/outilString.js'
import { texNombre2 } from '../../lib/outils/texNombre'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { droite } from '../../lib/2d/droites.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Calculer un angle dans un triangle rectangle en utilisant la trigonométrie'
export const dateDeModifImportante = '11/04/2023' // Modif consigne et passage à AMCHbride par EE.

/**
 * @author Jean-Claude Lhote à partir de 3G30-1 de Rémi Angot
 * 3G31 Exercice remplaçant l'exercice initial utilisant MG32
 * Calculer un angle en utilisant l'un des trois rapport trigonométrique.
 * * Si this.level=4 alors seul le cosinus sera utilisé.
 * Mars 2021
 */
export const uuid = '0ac11'
export const ref = '3G31'
export const refs = {
  'fr-fr': ['3G31'],
  'fr-ch': []
}
export default function CalculDAngle () {
  Exercice.call(this)
  this.nbQuestions = 2
  this.nbQuestionsModifiable = true
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = false
  this.correctionDetailleeDisponible = true
  this.correctionDetaillee = false
  this.debug = false
  this.spacing = 2
  if (context.isHtml) {
    this.spacingCorr = 3
  } else {
    this.spacingCorr = 2
  }

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    let listChoixRapportTrigo = []
    for (let i = 0; i < this.nbQuestions; i++) {
      const nom = creerNomDePolygone(3, 'QD')
      let texte = ''
      let texteCorr = ''
      const objetsEnonce = []
      const objetsCorrection = []
      let choixRapportTrigo
      let ab, bc, ac, angleABC
      if (this.level === 4) {
        choixRapportTrigo = choice(['Acos'])
      } else {
        if (listChoixRapportTrigo.length === 0) listChoixRapportTrigo = ['Acos', 'Asin', 'Atan']
        listChoixRapportTrigo = shuffle(listChoixRapportTrigo)
        choixRapportTrigo = listChoixRapportTrigo.pop()
      }

      switch (choixRapportTrigo) {
        case 'Acos': // AB=BCxcos(B)
          bc = arrondi(randint(100, 150) / 10, 1)
          ab = arrondi(randint(40, (bc - 2) * 10) / 10, 1)
          angleABC = Math.round(Math.acos(ab / bc) * 180 / Math.PI)
          ac = bc * Math.sin(Math.acos(ab / bc))
          texte += `Le triangle $${nom}$ est rectangle en $${nom[0]}$ tel que $${nom[1] + nom[2]}=${texNombre2(bc)}$ cm et $${nom[0] + nom[1]}=${texNombre2(ab)}$ cm.<br>`
          break
        case 'Asin':
          bc = randint(100, 150) / 10
          ac = randint(40, (bc - 2) * 10) / 10
          angleABC = Math.round(Math.asin(ac / bc) * 180 / Math.PI)
          ab = bc * Math.cos(Math.asin(ac / bc))
          texte += `Le triangle $${nom}$ est rectangle en $${nom[0]}$ tel que $${nom[1] + nom[2]}=${texNombre2(bc)}$ cm et $${nom[0] + nom[2]}=${texNombre2(ac)}$ cm.<br>`
          break
        case 'Atan':
          ab = randint(40, 100) / 10
          ac = randint(40, 100) / 10
          angleABC = Math.round(Math.atan(ac / ab) * 180 / Math.PI)
          bc = ab / Math.cos(Math.atan(ac / ab))
          texte += `Le triangle $${nom}$ est rectangle en $${nom[0]}$ tel que $${nom[0] + nom[1]}=${texNombre2(ab)}$ cm et  $${nom[0] + nom[2]}=${texNombre2(ac)}$ cm.<br>`
          break
      }

      const ratioerreur = randint(80, 120, 100) / 100
      const a = point(0, 0)
      const b = point(ab * ratioerreur, 0)
      const bb = point(ab, 0)
      const c = point(0, ac / ratioerreur)
      const cb = point(0, ac)
      const p1 = polygone(a, b, c)
      const p3 = polygone(a, bb, cb)
      const alpha = randint(0, 360)
      const p2 = rotation(p1, a, alpha)
      const p4 = rotation(p3, a, alpha)
      const A = p2.listePoints[0]
      const B = p2.listePoints[1]
      const C = p2.listePoints[2]
      const Bb = p4.listePoints[1]
      const Cb = p4.listePoints[2]

      const codage = codageAngleDroit(B, A, C)
      const codageb = codageAngleDroit(Bb, A, Cb)
      A.nom = nom[0]
      B.nom = nom[1]
      C.nom = nom[2]
      const nomme = nommePolygone(p2, nom)
      const nommeb = nommePolygone(p4, nom)

      const hypo = segment(Cb, Bb, 'blue')
      hypo.epaisseur = 2
      const codageDeAngle = codageAngle(A, B, C, 2)
      const codageDeAngleB = codageAngle(A, Bb, Cb, 2)

      const mAB = milieu(A, B)
      const mAC = milieu(A, C)
      const mBC = milieu(B, C)
      const G = barycentre(p2)
      const mABb = milieu(A, Bb)
      const mACb = milieu(A, Cb)
      const mBbCb = milieu(Bb, Cb)
      const Gb = barycentre(p4)
      const pLabelBC = homothetie(mBC, G, 1 + 1.5 / longueur(G, mBC))
      pLabelBC.positionLabel = 'center'

      const pixelsParCm = 20
      const demirectWitdh = 30
      const demirectHeight = 6
      intersectionSegmentRectangle(B, C, pLabelBC, demirectWitdh, demirectHeight, pixelsParCm)

      const pLabelAB = homothetie(mAB, mBC, 1 + 1.5 / longueur(mBC, mAB))
      pLabelAB.positionLabel = 'center'
      intersectionSegmentRectangle(A, B, pLabelAB, demirectWitdh, demirectHeight, pixelsParCm)
      const pLabelAC = homothetie(mAC, mBC, 1 + 1.5 / longueur(mBC, mAC))
      pLabelAC.positionLabel = 'center'
      intersectionSegmentRectangle(A, C, pLabelAC, demirectWitdh, demirectHeight, pixelsParCm)

      const m3b = homothetie(mBbCb, Gb, 1 + 1.5 / longueur(Gb, mBbCb))
      m3b.positionLabel = 'center'
      intersectionSegmentRectangle(Cb, Bb, m3b, demirectWitdh, demirectHeight, pixelsParCm)

      const m1b = homothetie(mABb, mBbCb, 1 + 1.5 / longueur(mBbCb, mABb))
      m1b.positionLabel = 'center'
      intersectionSegmentRectangle(A, Bb, m1b, demirectWitdh, demirectHeight, pixelsParCm)

      const m2b = homothetie(mACb, mBbCb, 1 + 1.5 / longueur(mBbCb, mACb))
      m2b.positionLabel = 'center'
      intersectionSegmentRectangle(A, Cb, m2b, demirectWitdh, demirectHeight, pixelsParCm)

      let m4b, pLabelAngle
      let texteAngle, texteAB, texteBC, t1b, t2b, t3b
      switch (choixRapportTrigo) {
        case 'Acos': // AB=BCxcos(B)
          texteBC = latexParPoint(`${texNombre2(bc)} \\text{ cm}`, pLabelBC, 'black', 120, 12, '')
          texteAB = latexParPoint(`${texNombre2(ab)} \\text{ cm}`, pLabelAB, 'black', 120, 12, '')
          pLabelAngle = similitude(A, B, angleOriente(A, B, C) / 2, 2.7 / longueur(B, A))
          pLabelAngle.positionLabel = 'center'
          texteAngle = latexParPoint('?', pLabelAngle, 'black', 50, 12, '')
          t3b = latexParPoint(`${texNombre2(bc)} \\text{ cm}`, m3b, 'black', 120, 12, '')
          t2b = latexParPoint(`${texNombre2(ab)} \\text{ cm}`, m1b, 'black', 120, 12, '')
          m4b = similitude(A, Bb, angleOriente(A, Bb, Cb) / 2, 2.7 / longueur(Bb, A))
          m4b.positionLabel = 'center'
          t1b = latexParPoint('?', m4b, 'black', 50, 12, '')
          break
        case 'Asin':
          texteBC = latexParPoint(`${texNombre2(bc)} \\text{ cm}`, pLabelBC, 'black', 120, 12, '')
          texteAB = latexParPoint(`${texNombre2(ac)} \\text{ cm}`, pLabelAC, 'black', 120, 12, '')
          pLabelAngle = similitude(A, B, angleOriente(A, B, C) / 2, 2.7 / longueur(B, A))
          pLabelAngle.positionLabel = 'center'
          texteAngle = latexParPoint('?', pLabelAngle, 'black', 100, 12, '')
          t3b = latexParPoint(`${texNombre2(bc)} \\text{ cm}`, m3b, 'black', 120, 12, '')
          t2b = latexParPoint(`${texNombre2(ac)} \\text{ cm}`, m2b, 'black', 120, 12, '')
          m4b = similitude(A, Bb, angleOriente(A, Bb, Cb) / 2, 2.7 / longueur(Bb, A))
          m4b.positionLabel = 'center'
          t1b = latexParPoint('?', m4b, 'black', 100, 12, '')
          break
        case 'Atan':
          texteAngle = latexParPoint(`${texNombre2(ab)} \\text{ cm}`, pLabelAB, 'black', 120, 12, '')
          texteAB = latexParPoint(`${texNombre2(ac)} \\text{ cm}`, pLabelAC, 'black', 120, 12, '')
          pLabelAngle = similitude(A, B, angleOriente(A, B, C) / 2, 2.7 / longueur(B, A))
          pLabelAngle.positionLabel = 'center'
          texteBC = latexParPoint('?', pLabelAngle, 'black', 100, 12, '')
          t1b = latexParPoint(`${texNombre2(ab)} \\text{ cm}`, m1b, 'black', 120, 12, '')
          t2b = latexParPoint(`${texNombre2(ac)} \\text{ cm}`, m2b, 'black', 120, 12, '')
          m4b = similitude(A, Bb, angleOriente(A, Bb, Cb) / 2, 2.7 / longueur(Bb, A))
          m4b.positionLabel = 'center'
          t3b = latexParPoint('?', m4b, 'black', 100, 12, '')
          break
      }

      objetsEnonce.push(p2, codage, nomme, texteAngle, texteAB, texteBC, codageDeAngle)
      if (this.debug) {
        objetsEnonce.push(tracePoint(pLabelAB, pLabelAC, pLabelBC),
          segment(point(pLabelBC.x - demirectWitdh / pixelsParCm, pLabelBC.y + demirectHeight / pixelsParCm), point(pLabelBC.x - demirectWitdh / pixelsParCm, pLabelBC.y - demirectHeight / pixelsParCm)),
          segment(point(pLabelBC.x + demirectWitdh / pixelsParCm, pLabelBC.y - demirectHeight / pixelsParCm), point(pLabelBC.x + demirectWitdh / pixelsParCm, pLabelBC.y + demirectHeight / pixelsParCm)),
          segment(point(pLabelBC.x - demirectWitdh / pixelsParCm, pLabelBC.y + demirectHeight / pixelsParCm), point(pLabelBC.x + demirectWitdh / pixelsParCm, pLabelBC.y + demirectHeight / pixelsParCm)),
          segment(point(pLabelBC.x - demirectWitdh / pixelsParCm, pLabelBC.y - demirectHeight / pixelsParCm), point(pLabelBC.x + demirectWitdh / pixelsParCm, pLabelBC.y - demirectHeight / pixelsParCm)),
          segment(point(pLabelAC.x - demirectWitdh / pixelsParCm, pLabelAC.y + demirectHeight / pixelsParCm), point(pLabelAC.x - demirectWitdh / pixelsParCm, pLabelAC.y - demirectHeight / pixelsParCm)),
          segment(point(pLabelAC.x + demirectWitdh / pixelsParCm, pLabelAC.y - demirectHeight / pixelsParCm), point(pLabelAC.x + demirectWitdh / pixelsParCm, pLabelAC.y + demirectHeight / pixelsParCm)),
          segment(point(pLabelAC.x - demirectWitdh / pixelsParCm, pLabelAC.y + demirectHeight / pixelsParCm), point(pLabelAC.x + demirectWitdh / pixelsParCm, pLabelAC.y + demirectHeight / pixelsParCm)),
          segment(point(pLabelAC.x - demirectWitdh / pixelsParCm, pLabelAC.y - demirectHeight / pixelsParCm), point(pLabelAC.x + demirectWitdh / pixelsParCm, pLabelAC.y - demirectHeight / pixelsParCm)),
          segment(point(pLabelAB.x - demirectWitdh / pixelsParCm, pLabelAB.y + demirectHeight / pixelsParCm), point(pLabelAB.x - demirectWitdh / pixelsParCm, pLabelAB.y - demirectHeight / pixelsParCm)),
          segment(point(pLabelAB.x + demirectWitdh / pixelsParCm, pLabelAB.y - demirectHeight / pixelsParCm), point(pLabelAB.x + demirectWitdh / pixelsParCm, pLabelAB.y + demirectHeight / pixelsParCm)),
          segment(point(pLabelAB.x - demirectWitdh / pixelsParCm, pLabelAB.y + demirectHeight / pixelsParCm), point(pLabelAB.x + demirectWitdh / pixelsParCm, pLabelAB.y + demirectHeight / pixelsParCm)),
          segment(point(pLabelAB.x - demirectWitdh / pixelsParCm, pLabelAB.y - demirectHeight / pixelsParCm), point(pLabelAB.x + demirectWitdh / pixelsParCm, pLabelAB.y - demirectHeight / pixelsParCm)))
      }

      objetsCorrection.push(p4, codageb, nommeb, t1b, t2b, t3b, hypo, codageDeAngleB)

      const paramsEnonce = {
        xmin: Math.min(A.x, B.x, C.x) - 2,
        ymin: Math.min(A.y, B.y, C.y) - 2,
        xmax: Math.max(A.x, B.x, C.x) + 2,
        ymax: Math.max(A.y, B.y, C.y) + 2,
        pixelsParCm: 20,
        scale: 0.4,
        mainlevee: true,
        amplitude: 0.4
      }
      const paramsCorrection = {
        xmin: Math.min(A.x, B.x, C.x) - 4,
        ymin: Math.min(A.y, B.y, C.y) - 4,
        xmax: Math.max(A.x, B.x, C.x) + 3,
        ymax: Math.max(A.y, B.y, C.y) + 2,
        pixelsParCm: 20,
        scale: 0.5,
        mainlevee: false
      }

      if (!context.isHtml && this.sup && !context.isAmc) {
        texte += '\\begin{minipage}{.4\\linewidth}\n'
      }
      if (this.sup) {
        texte += mathalea2d(paramsEnonce, objetsEnonce) + '<br>'
      }
      if (this.correctionDetaillee) {
        if (!context.isHtml && !context.isAmc) texteCorr += '\\begin{minipage}{.5\\linewidth}\n'
        texteCorr += mathalea2d(paramsCorrection, objetsCorrection) + '<br>'
        if (!context.isHtml && !context.isAmc) texteCorr += '\n\\end{minipage}\n'
      }
      if (!context.isHtml && this.sup && !context.isAmc) {
        texte += '\n\\end{minipage}\n'
      }
      if (this.correctionDetaillee && !context.isHtml) texteCorr += '\\begin{minipage}{.5\\linewidth}\n'
      switch (choixRapportTrigo) {
        case 'Acos': // AB=BCxcos(B)
          texteCorr += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$, le cosinus de l'angle $\\widehat{${nom}}$ est défini par :<br>`
          texteCorr += `$\\cos\\left(\\widehat{${nom}}\\right)=\\dfrac{${nom[0] + nom[1]}}{${nom[1] + nom[2]}}$.<br>`
          texteCorr += 'Avec les données numériques :<br>'
          texteCorr += `$\\cos\\left(\\widehat{${nom}}\\right)=${texFractionFromString(texNombre2(ab), texNombre2(bc))}$<br>`
          texteCorr += `$\\widehat{${nom}}=\\arccos\\left(${texFractionFromString(texNombre2(ab), texNombre2(bc))}\\right)`
          break
        case 'Asin':
          texteCorr += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$, le sinus de l'angle $\\widehat{${nom}}$ est défini par :<br>`
          texteCorr += `$\\sin \\left(\\widehat{${nom}}\\right)=${texFractionFromString(nom[0] + nom[2], nom[1] + nom[2])}$<br>`
          texteCorr += 'Avec les données numériques :<br>'
          texteCorr += `$\\sin\\left(\\widehat{${nom}}\\right)=${texFractionFromString(texNombre2(ac), texNombre2(bc))}$<br>`
          texteCorr += `$\\widehat{${nom}}=\\arcsin\\left(${texFractionFromString(texNombre2(ac), texNombre2(bc))}\\right)`

          break
        case 'Atan':
          texteCorr += `Dans le triangle $${nom}$ rectangle en $${nom[0]}$, la tangente de l'angle $\\widehat{${nom}}$ est défini par :<br>`
          texteCorr += `$\\tan \\left(\\widehat{${nom}}\\right)=${texFractionFromString(nom[0] + nom[2], nom[0] + nom[1])}$<br>`
          texteCorr += 'Avec les données numériques :<br>'
          texteCorr += `$\\tan\\left(\\widehat{${nom}}\\right)=${texFractionFromString(texNombre2(ac), texNombre2(ab))}$<br>`
          texteCorr += `$\\widehat{${nom}}=\\arctan\\left(${texFractionFromString(texNombre2(ac), texNombre2(ab))}\\right)`
          break
      }
      texteCorr += `\\approx ${miseEnEvidence(angleABC)}^\\circ$<br>`
      if (this.correctionDetaillee && !context.isHtml) texteCorr += '\n\\end{minipage}\n'

      texte += `Calculer $\\widehat{${nom}}$`

      // Pour AMC
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: '',
          enonceAvant: false,
          propositions: [
            {
              type: 'AMCOpen',
              propositions: [{
                enonce: texte + '.',
                texte: texteCorr,
                statut: 4,
                pointilles: true
              }]
            },
            {
              type: 'AMCNum',
              propositions: [{
                texte: '',
                statut: '',
                reponse: {
                  texte: `Valeur de l'angle $\\widehat{${nom}}$, arrondie à 1$^\\circ$ près : `,
                  valeur: [angleABC],
                  alignement: 'center',
                  param: {
                    digits: 2,
                    decimals: 0,
                    signe: false,
                    approx: 0
                  }
                }
              }]
            }
          ]
        }
      } else if (this.interactif && context.isHtml) {
        setReponse(this, i, angleABC)
      }
      texte += ' à $1 ^\\circ$ près.'

      texte += ajouteChampTexteMathLive(this, i, '', { texteApres: ' °' })

      if (this.questionJamaisPosee(i, nom, choixRapportTrigo)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
      }
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
  this.besoinFormulaireCaseACocher = ['Figure à main levée', false]

  /**
   * Détermine si le rectangle est en intersection avec le segment
   * Décale de 5 pixels dans le sens
   * @param {*} A extremité du segment
   * @param {C} B extremité du segment
   * @param {*} centre centre du rectangle || variable mis à jour (décaléé droite ou à gauche)
   * @param {*} demirectWitdh demi longueur du rectangle
   * @param {*} demirectHeight demi largeur du rectangle
   * @param {*} pixelsParCm nombre de pixels par unité de mesure
   * @returns retourne les points d'intersection (les quatre premiers sont les points d'intersection, les quatre suivants sont des booleans si 'intersection ou pas)
   */
  function intersectionSegmentRectangle (A, B, centre, demirectWitdh, demirectHeight, pixelsParCm, iteration = 4) {
    const pgauche = pointIntersectionDD(droite(A, B), droite(point(centre.x - demirectWitdh / pixelsParCm, centre.y + demirectHeight / pixelsParCm), point(centre.x - demirectWitdh / pixelsParCm, centre.y - demirectHeight / pixelsParCm)))
    const pdroite = pointIntersectionDD(droite(A, B), droite(point(centre.x + demirectWitdh / pixelsParCm, centre.y - demirectHeight / pixelsParCm), point(centre.x + demirectWitdh / pixelsParCm, centre.y + demirectHeight / pixelsParCm)))
    const phaut = pointIntersectionDD(droite(A, B), droite(point(centre.x - demirectWitdh / pixelsParCm, centre.y + demirectHeight / pixelsParCm), point(centre.x + demirectWitdh / pixelsParCm, centre.y + demirectHeight / pixelsParCm)))
    const pbas = pointIntersectionDD(droite(A, B), droite(point(centre.x - demirectWitdh / pixelsParCm, centre.y - demirectHeight / pixelsParCm), point(centre.x + demirectWitdh / pixelsParCm, centre.y - demirectHeight / pixelsParCm)))
    const bgauche = pgauche.y >= centre.y - demirectHeight / pixelsParCm && pgauche.y <= centre.y + demirectHeight / pixelsParCm
    const bdroite = pdroite.y >= centre.y - demirectHeight / pixelsParCm && pdroite.y <= centre.y + demirectHeight / pixelsParCm
    const bhaut = phaut.x >= centre.x - demirectWitdh / pixelsParCm && phaut.x <= centre.x + demirectWitdh / pixelsParCm
    const bbas = pbas.x >= centre.x - demirectWitdh / pixelsParCm && pbas.x <= centre.x + demirectWitdh / pixelsParCm

    if (bgauche) {
      centre.x = centre.x + 5 / pixelsParCm
      if (iteration > 0) intersectionSegmentRectangle(A, B, centre, demirectWitdh, demirectHeight, pixelsParCm, iteration - 1)
    } else if (bdroite) {
      centre.x = centre.x - 5 / pixelsParCm
      if (iteration > 0) intersectionSegmentRectangle(A, B, centre, demirectWitdh, demirectHeight, pixelsParCm, iteration - 1)
    } else if ((bbas || bhaut) && centre.x > pbas.x) {
      centre.x = centre.x + 5 / pixelsParCm
      if (iteration > 0) intersectionSegmentRectangle(A, B, centre, demirectWitdh, demirectHeight, pixelsParCm, iteration - 1)
    } else if ((bbas || bhaut) && centre.x < pbas.x) {
      centre.x = centre.x - 5 / pixelsParCm
      if (iteration > 0) intersectionSegmentRectangle(A, B, centre, demirectWitdh, demirectHeight, pixelsParCm, iteration - 1)
    }
    return { pgauche, pdroite, phaut, pbas, bgauche, bdroite, bhaut, bbas }
  }
}
