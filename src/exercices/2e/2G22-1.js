import { milieu, point } from '../../lib/2d/points.js'
import { repere } from '../../lib/2d/reperes.js'
import {
  longueur,
  nomVecteurParPosition,
  vecteur
} from '../../lib/2d/segmentsVecteurs.js'
import {
  labelPoint,
  latex2d,
  latexParPoint,
  texteParPosition
} from '../../lib/2d/textes.ts'
import { homothetie } from '../../lib/2d/transformations.js'
import { choice } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { mathalea2d, colorToLatexOrHTML } from '../../modules/2dGeneralites.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom'
import { orangeMathalea } from 'apigeom/src/elements/defaultValues'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Représenter un vecteur dans un repère, à partir de ses coordonnées'
export const interactifReady = true
export const interactifType = 'custom'
export const dateDeModifImportante = '06/08/2024'

/**
 * Tracer un vecteur dont on connait les coordonnées dans un repère.
 * @author Stéphane Guyon légèrement modifié par Jean-Claude Lhote, rendu interactif par Eric Elter
 */
export const uuid = '3a3ec'
export const ref = '2G22-1'
export const refs = {
  'fr-fr': ['2G22-1'],
  'fr-ch': []
}

export default class RepresenterUnVecteur extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 2
    this.nbCols = 1
    this.nbColsCorr = 1
    this.sup = 1 //
    this.besoinFormulaireNumerique = [
      'Situations différentes',
      2,
      '1 : Avec un point origine\n 2 : Avec un point extrémité'
    ]
  }

  nouvelleVersion () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.longueur = 10
    this.largeur = 10
    /**
     * @type {Figure[]}
     */
    this.figure = []
    const xA = []
    const xB = []
    const yA = []
    const yB = []
    for (
      let i = 0,
        r,
        posLabelA,
        posLabelB,
        labelA,
        labelB,
        A,
        B,
        H,
        h1,
        h2,
        O,
        I,
        J,
        j,
        k,
        l,
        s,
        o,
        ux,
        uy,
        AB,
        nomi,
        nomj,
        nomAB,
        texte,
        texteCorr,
        cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      this.idApigeom = `apigeomEx${this.numeroExercice}${i}EE`
      this.figure[i] = new Figure({
        xMin: -this.longueur - 0.25, // On enlève 0.25 unités
        yMin: -this.largeur - 0.25,
        width: 0.65 * (this.longueur * 2 * 30 + 20), // On ajoute 20 pixels
        height: 0.65 * (this.largeur * 2 * 30 + 20),
        border: false,
        scale: 0.65
      })

      const OVecteur = this.figure[i].create('Point', { x: 0, y: 0, isVisible: false })
      const IVecteur = this.figure[i].create('Point', { x: 1, y: 0, isVisible: false })
      const JVecteur = this.figure[i].create('Point', { x: 0, y: 1, isVisible: false })
      this.figure[i].create('VectorByPoints', { point1: OVecteur, point2: IVecteur, color: orangeMathalea, thickness: 3, isSelectable: false })
      this.figure[i].create('VectorByPoints', { point1: OVecteur, point2: JVecteur, color: orangeMathalea, thickness: 3, isSelectable: false })
      this.figure[i].create('TextByPosition', {
        text: '$O$',
        x: -0.15,
        y: -0.15,
        anchor: 'topRight',
        color: orangeMathalea,
        fontSize: '8pt'
      })
      this.figure[i].create('TextByPosition', {
        text: '$\\vec \\imath$',
        x: 0.5,
        y: 0,
        anchor: 'topRight',
        color: orangeMathalea,
        fontsize: '3em'
      })
      this.figure[i].create('TextByPosition', {
        text: '$\\vec \\jmath$',
        x: -0.5,
        y: 0,
        anchor: 'bottomRight',
        color: orangeMathalea,
        fontsize: '3em'
      })

      this.figure[i].create('Grid', {
        strokeWidthGrid: 1,
        color: 'black',
        yMin: -this.largeur + 0.1,
        yMax: this.largeur - 0.1,
        xMax: this.longueur - 0.1,
        xMin: -this.longueur + 0.1,
        axeX: true,
        axeY: true,
        labelX: true,
        labelY: true
      })
      this.figure[i].snapGrid = true
      this.figure[i].setToolbar({
        tools: ['DRAG', 'REMOVE', 'VECTOR', 'POINT', 'SET_OPTIONS']
        // position: 'top'
      })
      this.figure[i].options.thickness = 3
      this.figure[i].options.color = 'blue'
      this.figure[i].buttons.get('VECTOR')?.click()

      xA.push(randint(2, 8) * choice([-1, 1]))
      yA.push(randint(2, 8) * choice([-1, 1]))
      ux = randint(3, 8) * choice([-1, 1])
      uy = randint(3, 8) * choice([-1, 1])
      xB.push(xA[i] + ux)
      yB.push(yA[i] + uy)
      while (Math.abs(xB[i]) < 2 || Math.abs(xB[i]) > 8) {
        // On s'assure de choisir des points bien placés dans le repère.
        xA[i] = randint(3, 8) * choice([-1, 1])
        ux = randint(3, 8) * choice([-1, 1])
        xB[i] = xA[i] + ux
      }
      while (Math.abs(yB[i]) < 2 || Math.abs(yB[i]) > 8) {
        // Idem pour les ordonnées
        yA[i] = randint(3, 8) * choice([-1, 1])
        uy = randint(3, 8) * choice([-1, 1])
        yB[i] = yA[i] + uy
      }
      A = point(xA[i], yA[i])
      B = point(xB[i], yB[i])
      AB = vecteur(A, B)
      r = repere({ axesEpaisseur: 1 }) // On définit le repère
      posLabelA = homothetie(B, A, -0.7 / longueur(A, B), '', 'center') // pour positionner les noms des points aux extrémités proprement
      posLabelB = homothetie(A, B, -0.7 / longueur(A, B), '', 'center')
      const numeroPoint1 = randint(1, 26, [15]) // 15 : Pour éviter le point O
      const nomPoint1 = lettreDepuisChiffre(numeroPoint1)
      const numeroPoint2 = randint(1, 26, [15, numeroPoint1])
      const nomPoint2 = lettreDepuisChiffre(numeroPoint2)
      labelA = latexParPoint(nomPoint1, posLabelA, 'red', 10, 12, '')
      labelB = latexParPoint(nomPoint2, posLabelB, 'red', 10, 12, '')

      H = point(xA[i] + ux, yA[i])
      s = AB.representant(A) // On trace en rouge [AB]
      h1 = vecteur(A, H).representant(A, 'blue')
      h2 = vecteur(H, B).representant(H, 'green')
      const longueurAH = latex2d(ux, milieu(A, H).x, milieu(A, H).y + 0.5, { color: 'blue', letterSize: 'footnotesize' })
      const longueurBH = latex2d(uy, milieu(B, H).x + 0.5, milieu(B, H).y, { color: 'blue', letterSize: 'footnotesize' })
      O = point(0, 0) // On définit et on trace le point O
      o = texteParPosition('O', -0.3, -0.3, 0, 'blue', 0.75, 'milieu', true)
      I = point(1, 0) // On définit sans tracer le point I
      J = point(0, 1) // On définit sans tracer le point J
      k = vecteur(O, I).representant(O, 'blue') // Variable qui trace [OI] en bleu
      j = vecteur(O, J).representant(O, 'blue') // Variable qui trace [OJ] en bleu
      s.epaisseur = 1.5 // Variable qui grossit le tracé du vecteur AB
      s.color = colorToLatexOrHTML(orangeMathalea)
      k.epaisseur = 1.1 // Variable qui grossit le tracé du vecteur OI
      j.epaisseur = 1.1 // Variable qui grossit le tracé du vecteur OJ
      h1.epaisseur = 1.5 // Variable qui grossit le tracé bleu
      h2.epaisseur = 1.5 // Variable qui grossit le tracé bleu
      nomi = nomVecteurParPosition('i', 0.5, -0.7, 0.7, 0, 'blue')
      nomj = nomVecteurParPosition('j', -0.7, 0.5, 0.7, 0, 'blue')
      nomAB = AB.representantNomme(A, 'u', 0.7, 'red')
      if (this.sup === 1) {
        l = labelPoint(A, 'red') // Variable qui trace les nom s A et B

        // texte = ` Dans un repère orthonormé $\\big(O ; \\vec i,\\vec j\\big)$, représenter le vecteur $\\vec{u}\\begin{pmatrix}${ux} \\\\${uy}\\end{pmatrix}$, `
        texte = ` Dans un repère orthonormé $\\big(O ; \\vec i,\\vec j\\big)$, représenter le vecteur de coordonnées $\\begin{pmatrix}${ux} \\\\${uy}\\end{pmatrix}$, `
        texte += `ayant pour origine le point $${nomPoint1}\\left(${xA[i]};${yA[i]}\\right)$.`
        this.figure[i].create('Point', {
          x: xA[i],
          y: yA[i],
          label: nomPoint1,
          isFree: false,
          isSelectable: false
        })
        texteCorr = "On sait qu'un vecteur mesure un déplacement."
        texteCorr += `<br> À partir du point $${nomPoint1}$,  on trace donc le déplacement correspondant à $${ux}$ unités horizontalement (en bleu) puis $${uy}$ unités verticalement (en vert) pour arriver au point $${nomPoint2}$, extrémité du vecteur $\\vec{u}$.`
      } else {
        texte = ` Dans un repère orthonormé $\\big(O ; \\vec i,\\vec j\\big)$, représenter le vecteur $\\vec{u}\\begin{pmatrix}${ux} \\\\${uy}\\end{pmatrix}$, `
        texte += `ayant pour extrémité le point $${nomPoint2}\\left(${xB[i]};${yB[i]}\\right)$.`
        this.figure[i].create('Point', {
          x: xB[i],
          y: yB[i],
          label: nomPoint2,
          isFree: false,
          isSelectable: false
        })
        texteCorr = "On sait qu'un vecteur mesure un déplacement."
        texteCorr += `<br> On cherche donc un point $${nomPoint1}$, à partir duquel en traçant le déplacement correspondant à $${ux}$ unités horizontalement (en bleu)  puis $${uy}$ unités verticalement (en vert), on arrive au point $${nomPoint2}$.`
        l = labelPoint(A, B, 'red') // Variable qui trace les noms A et B
      }
      texteCorr +=
          `<br> Voir les déplacements dans le repère ci-dessous et le tracé en orange du vecteur-solution $${miseEnEvidence('\\vec{u}')}$.<br>`
      texte += this.interactif ? '<br>Pour valider votre réponse, il faut que le vecteur-solution soit en vert et que ce soit le seul vecteur en vert.' : ''
      texte += figureApigeom({
        exercice: this,
        idApigeom: this.idApigeom,
        figure: this.figure[i],
        question: i
      })

      texteCorr += mathalea2d(
        {
          xmin: -10,
          ymin: -10,
          xmax: 10,
          ymax: 10,
          scale: 0.4
        },
        r,
        l,
        k,
        j,
        s,
        o,
        nomi,
        nomj,
        nomAB,
        h1,
        h2,
        labelA,
        labelB,
        longueurAH,
        longueurBH
      ) // On trace le graphique

      this.correctionInteractive = (i) => {
        this.answers = {}
        // Sauvegarde de la réponse pour Capytale
        this.answers[this.idApigeom] = this.figure[i].json
        const divFeedback = document.querySelector(
          `#feedbackEx${this.numeroExercice}Q${i}`
        )
        this.figure[i].isDynamic = false
        this.figure[i].divButtons.style.display = 'none'
        this.figure[i].divUserMessage.style.display = 'none'
        // this.figure[i].buttons.get('SHAKE')?.click()

        let { isValid, vectors } = this.figure[i].checkVector({
          xOrigin: xA[i],
          x: xB[i] - xA[i],
          yOrigin: yA[i],
          y: yB[i] - yA[i]
        })

        const nbVecteurs = [...this.figure[i].elements.values()].filter(
          (e) => e.type === 'VectorByPoints' && e.color === 'green'
        ).length
        isValid &&= nbVecteurs === 1

        if (isValid) {
          divFeedback.innerHTML = 'Bravo !'
          if (vectors[0] !== undefined) {
            vectors[0].color = 'green'
          }
          return 'OK'
        }

        const wrongVectors = [...this.figure[i].elements.values()].filter(
          (e) => e.type === 'VectorByPoints' && e.isSelectable
        )
        for (const vector of wrongVectors) {
          vector.color = 'red'
        }

        let message
        if (nbVecteurs === 0) {
          message = "Aucun vecteur n'est tracé."
        } else if (nbVecteurs > 1) {
          message = 'Trop de vecteurs sont tracés.'
        } else {
          message = "Le vecteur tracé n'est pas celui qui est attendu."
        }
        divFeedback.innerHTML = message
        return 'KO'
      }
      if (this.questionJamaisPosee(i, xA[i], yA[i], xB[i], yB[i])) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
