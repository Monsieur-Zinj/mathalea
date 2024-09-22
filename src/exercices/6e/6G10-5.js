import { droite } from '../../lib/2d/droites.js'
import { point, pointIntersectionDD, pointSurSegment, tracePoint } from '../../lib/2d/points.js'
import { grille, seyes } from '../../lib/2d/reperes.js'
import { demiDroite, segment } from '../../lib/2d/segmentsVecteurs.js'
import { labelPoint } from '../../lib/2d/textes.ts'
import { lettreDepuisChiffre, numAlpha } from '../../lib/outils/outilString.js'
import Exercice from '../Exercice.ts'
import { mathalea2d, vide2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Alea2iep from '../../modules/Alea2iep.js'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom.ts'
import { ajouteFeedback } from '../../lib/interactif/questionMathLive'

export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Tracer des droites, segments, ...'
export const dateDePublication = '05/10/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '20/09/2024'
export const interactifReady = true
export const interactifType = 'custom'

/**
 * Fonction générale pour construire des segments, droites et demi-droites
 * @author Mickael Guironnet // rendu interactif par EE
 */

export const uuid = '3dbda'
export const ref = '6G10-5'
export const refs = {
  'fr-fr': ['6G10-5'],
  'fr-ch': ['9ES1-7']
}
export default class constructionElementaire extends Exercice {
//
  constructor () {
    super()
    this.nbQuestions = 1
    this.sup = 1
    this.exoCustomResultat = true
    this.besoinFormulaireNumerique = [
      'Type de cahier',
      3,
      ' 1 : Cahier à petits carreaux\n 2 : Cahier à gros carreaux (Seyes)\n 3 : Feuille blanche'
    ]
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    this.figures = []

    for (let i = 0, texte, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const anim = new Alea2iep()
      anim.equerreZoom(150)
      const objetsEnonce = []
      const objetsCorrection = []
      const indLettre = randint(1, 15)
      const A = point(randint(0, 3), randint(-8, -3), lettreDepuisChiffre(indLettre), 'above left')
      const B = point(randint(10, 11), randint(-4, 4, [-1, 0, 1]), lettreDepuisChiffre(indLettre + 1), 'above right')
      const d = droite(A, B, '', 'blue')
      const C = point(randint(2, 4, [A.x]), randint(3, 6, [A.y]), lettreDepuisChiffre(indLettre + 2), 'above left')
      const D = point(randint(6, 8), randint(-7, -6, [A.y]), lettreDepuisChiffre(indLettre + 3))
      const e = demiDroite(C, D, 'green', true)
      const f = segment(A, C, 'red')
      const E = pointIntersectionDD(droite(C, D), d, lettreDepuisChiffre(indLettre + 4), 'below right')
      const F = pointSurSegment(B, A, -1, lettreDepuisChiffre(indLettre + 5), 'below')
      const T = tracePoint(A, B, C, D)
      const Tc = tracePoint(E, F, 'red')
      T.tailleTikz = 0.3
      Tc.tailleTikz = 0.3
      objetsCorrection.push(T, Tc, labelPoint(A, B, C, D), labelPoint(E, F, 'red'), d, e, f)
      objetsEnonce.push(T, labelPoint(A, B, C, D))
      let correction = ''
      let questind = 0
      let enonce = ''
      if (context.isHtml && !this.interactif) enonce += numAlpha(questind++) + ' Reproduire la figure ci-dessous.<br>'
      enonce +=
        numAlpha(questind++) +
        `Tracer $(${A.nom}${B.nom})$ en bleu.<br>`
      enonce +=
        numAlpha(questind++) +
        `Tracer $[${A.nom}${C.nom}]$ en rouge.<br>`
      enonce +=
        numAlpha(questind++) +
        `Tracer $[${C.nom}${D.nom})$ en vert.<br>`
      enonce +=
        numAlpha(questind++) +
        `Placer $${E.nom}$ le point d'intersection de $(${A.nom}${B.nom})$ et $[${C.nom}${D.nom})$.<br>`
      enonce +=
        numAlpha(questind++) +
        `Placer un point $${F.nom}$ tel que $${F.nom} \\notin [${A.nom}${B.nom}]$ et $${F.nom} \\in (${A.nom}${B.nom})$.<br>`
      const Xmin = Math.floor(Math.min(A.x, B.x, C.x, D.x, E.x, F.x) - 1)
      const Xmax = Math.ceil(Math.max(A.x, B.x, C.x, D.x, E.x, F.x) + 1)
      const Ymin = Math.floor(Math.min(A.y, B.y, C.y, D.y, E.y, F.y) - 1)
      const Ymax = Math.ceil(Math.max(A.y, B.y, C.y, D.y, E.y, F.y) + 1)
      anim.recadre(Xmin - 3, Ymax)
      anim.pointsCreer(A, B, C, D)
      anim.regleDroite(A, B, { couleur: 'blue' })
      anim.regleSegment(A, C, { couleur: 'red' })
      anim.regleDemiDroiteOriginePoint(C, D, { couleur: 'green' })
      anim.regleMasquer()
      anim.crayonMontrer(E)
      anim.pointCreer(E, { couleur: 'red' })
      anim.crayonMontrer(F)
      anim.pointCreer(F, { couleur: 'red' })
      if (this.interactif) {
        this.idApigeom = `apiGeomEx${this.numeroExercice}Q${i}`
        const figure = new Figure({ xMin: -0.9, yMin: -8.9, width: 408, height: 468 })
        figure.options.labelAutomaticBeginsWith = E.nom
        figure.options.thickness = 2
        this.figures[i] = figure
        /* if (this.sup < 3) { // Je l'ai enlevé car il n'existe pas les carreaux Seyes en interactif.
          figure.create('Grid', {
            axeX: false,
            axeY: false,
            labelX: false,
            labelY: false
          })
        } */
        this.A = figure.create('Point', { x: A.x, y: A.y, label: A.nom })
        this.B = figure.create('Point', { x: B.x, y: B.y, label: B.nom })
        this.C = figure.create('Point', { x: C.x, y: C.y, label: C.nom })
        this.D = figure.create('Point', { x: D.x, y: D.y, label: D.nom })
        this.A.isDeletable = false
        this.B.isDeletable = false
        this.C.isDeletable = false
        this.D.isDeletable = false
        this.Enom = E.nom
        this.Fnom = F.nom

        figure.setToolbar({ tools: ['POINT', 'LINE', 'SEGMENT', 'RAY', 'POINT_INTERSECTION', 'POINT_ON', 'NAME_POINT', 'MOVE_LABEL', 'DRAG', 'REMOVE', 'SET_OPTIONS'] })
        const emplacementPourFigure = figureApigeom({ exercice: this, idApigeom: this.idApigeom, figure })
        enonce += emplacementPourFigure
      } else {
        let g, sc, carreaux
        if (this.sup < 3) g = grille(Xmin, Ymin, Xmax, Ymax, 'gray', 0.7)
        else g = vide2d()
        if (this.sup === 2) {
          sc = 0.8
          carreaux = seyes(Xmin, Ymin, Xmax, Ymax)
        } else {
          sc = 0.5
          carreaux = vide2d()
        }
        if (this.interactif) {
          g = vide2d()
          carreaux = vide2d()
        }
        objetsEnonce.push(g, carreaux)
        objetsCorrection.push(g, carreaux)
        enonce += '<br>' + mathalea2d(
          {
            xmin: Xmin,
            ymin: Ymin,
            xmax: Xmax,
            ymax: Ymax,
            pixelsParCm: 20,
            scale: sc
          },
          objetsEnonce
        )
      }
      correction += mathalea2d(
        {
          xmin: Xmin,
          ymin: Ymin,
          xmax: Xmax,
          ymax: Ymax,
          pixelsParCm: 20,
          scale: this.sup === 2 ? 0.8 : 0.5
        },
        objetsCorrection
      )

      correction += anim.htmlBouton(this.numeroExercice, i)
      enonce += ajouteFeedback(this, i)

      if (context.isAmc) {
      /** ********************** AMC Hybride *****************************/
        this.autoCorrection[i] = {
          enonce: enonce + '<br>',
          enonceAvant: false
        }

        this.autoCorrection[i].propositions = [
          {
            type: 'AMCOpen',
            propositions: [
              {
                texte: correction,
                statut: 3,
                enonce: enonce + '<br>Question \\textbf{a}',
                sanscadre: true
              }
            ]
          },
          {
            type: 'AMCOpen',
            propositions: [
              {
                texte: correction,
                statut: 3,
                enonce: 'Question \\textbf{b}',
                sanscadre: true
              }
            ]
          },
          {
            type: 'AMCOpen',
            propositions: [
              {
                texte: correction,
                statut: 3,
                enonce: 'Question \\textbf{c}',
                sanscadre: true
              }
            ]
          },
          {
            type: 'AMCOpen',
            propositions: [
              {
                texte: correction,
                statut: 3,
                enonce: 'Question \\textbf{d}',
                sanscadre: true
              }
            ]
          },
          {
            type: 'AMCOpen',
            propositions: [
              {
                texte: correction,
                statut: 3,
                enonce: 'Question \\textbf{e}',
                sanscadre: true
              }
            ]
          }
        ]
      }

      if (this.questionJamaisPosee(i, texte)) {
      // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(enonce + '<br>')
        this.listeCorrections.push(correction + '<br>')
        i++
      }
      cpt++
    }

    listeQuestionsToContenu(this)
  }

  correctionInteractive = (i) => {
    // if (i === undefined) return 'KO'
    const figure = this.figures[i]
    figure.isDynamic = false
    figure.divButtons.style.display = 'none'
    figure.divUserMessage.style.display = 'none'

    // Sauvegarde de la réponse pour Capytale
    if (this.answers == null) this.answers = {}
    this.answers[this.idApigeom] = figure.json

    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${i}`) // Ne pas changer le nom du FeedBack, il est écrit en dur, ailleurs.
    const resultat = []
    let feedback = ''
    let questind = 0
    const { isValid, message } = figure.checkLine({ point1: this.A, point2: this.B, color: 'blue' })
    resultat.push(isValid ? 'OK' : 'KO')
    if (message !== '') { feedback += numAlpha(questind++) + message + '<br>' }

    const { isValid: isValid2, message: message2 } = figure.checkSegment({ point1: this.A, point2: this.C, color: 'red' })
    resultat.push(isValid2 ? 'OK' : 'KO')
    if (message2 !== '') { feedback += numAlpha(questind++) + message2 + '<br>' }

    const { isValid: isValid3, message: message3 } = figure.checkRay({ point1: this.C, point2: this.D, color: 'green' })
    resultat.push(isValid3 ? 'OK' : 'KO')
    if (message3 !== '') { feedback += numAlpha(questind++) + message3 + '<br>' }

    const { isValid: isValid4, message: message4 } = figure.checkPointOnIntersectionLL({ labelPt: this.Enom, nameLine1: [`(${this.A.label}${this.B.label})`, `(${this.B.label}${this.A.label})`], nameLine2: `[${this.C.label}${this.D.label})` })
    resultat.push(isValid4 ? 'OK' : 'KO')
    if (message4 !== '') { feedback += numAlpha(questind++) + message4 + '<br>' }

    const { isValid: isValid5, message: message5 } = figure.checkPointOnLine({ labelPt: this.Fnom, nameLine: `${this.A.label}${this.B.label}` })
    if (!isValid5 && message5 !== '') { feedback += numAlpha(questind++) + message5 }
    if (isValid5) {
      const { isValid: isValid6 } = figure.checkPointBetween2Points({ labelPt: this.Fnom, labelPt1: `${this.A.label}`, labelPt2: `${this.B.label}` })
      if (!isValid6) feedback += numAlpha(questind++) + `Le point ${this.Fnom} est bien placé.`
      else feedback += numAlpha(questind++) + `Le point ${this.Fnom} n'est pas bien placé.`
      resultat.push(!isValid6 ? 'OK' : 'KO')
    } else resultat.push('KO')

    if (divFeedback) divFeedback.innerHTML = feedback

    return resultat
  }
}
