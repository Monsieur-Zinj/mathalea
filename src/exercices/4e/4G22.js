import { choice, combinaisonListes, enleveElement } from '../../lib/outils/arrayOutils'
import { creerNomDePolygone, sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { RedactionPythagore } from './_pythagore.js'
import Decimal from 'decimal.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { propositionsQcm } from '../../lib/interactif/qcm'
import Figure from 'apigeom'
export const titre = 'Résoudre des problèmes utilisant le théorème de Pythagore'
export const dateDeModifImportante = '26/08/2024' // Ajout de l'interactivité par EE
export const interactifReady = true
export const interactifType = ['qcm', 'mathLive']

/**
 * Problèmes utilisant le théorème de Pythagore ou sa réciproque et des propriétés des quadrilatères particuliers.
 *
 * * Dans un losange, on connaît la longueur du côté et une diagonale, il faut calculer l'autre.
 * * Dans un rectangle, on connaît la longueur et une diagonale, il faut calculer la largeur.
 * * Dans un rectangle, on connaît la longueur et la largeur, il faut calculer la diagonale.
 * * Est-ce qu'un parallélogramme est un losange ? On peut démontrer que les diagonales sont perpendiculaires ou pas.
 * * Est-ce qu'un parallélogramme est un rectangle ? On peut démontrer qu'il possède un angle droit ou pas .
 * @author Rémi Angot (Factorisation de la rédaction de Pythagore par Eric Elter)
 */
export const uuid = 'b18e8'
export const ref = '4G22'
export const refs = {
  'fr-fr': ['4G22'],
  'fr-ch': ['10GM4-3', '11GM1-4']
}
export default class ProblemesPythagore extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 2
    this.nbCols = 1
    this.nbColsCorr = 1
    this.spacing = 1
    this.sup = 3
    context.isHtml ? (this.spacingCorr = 2) : (this.spacingCorr = 1.5)
    this.besoinFormulaireNumerique = ['Sens direct ou réciproque/contraposée', 3, '1 : Sens direct\n2 : Réciproque/contraposée\n3 : Mélange']
  }

  nouvelleVersion () {
    let typesDeQuestionsDisponibles
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [
        'losange',
        'rectangle_diagonale_connue',
        'rectangle_diagonale_a_trouver'
      ]
    } else if (this.sup === 2) {
      if (this.nbQuestions > 2) {
        typesDeQuestionsDisponibles = [
          'parallelogramme_est_losange',
          'parallelogramme_n_est_pas_losange',
          'parallelogramme_est_rectangle',
          'parallelogramme_n_est_pas_rectangle'
        ]
      } else {
        typesDeQuestionsDisponibles = [
          choice(['parallelogramme_est_losange', 'parallelogramme_n_est_pas_losange']),
          choice(['parallelogramme_est_rectangle', 'parallelogramme_n_est_pas_rectangle'])
        ]
      }
    } else {
      if (this.nbQuestions >= 5) {
        typesDeQuestionsDisponibles = [
          'losange',
          'rectangle_diagonale_connue',
          'rectangle_diagonale_a_trouver',
          'parallelogramme_est_losange',
          'parallelogramme_n_est_pas_losange',
          'parallelogramme_est_rectangle',
          'parallelogramme_n_est_pas_rectangle'
        ]
      } else {
        typesDeQuestionsDisponibles = [
          'losange',
          'rectangle_diagonale_connue',
          'rectangle_diagonale_a_trouver',
          choice(['parallelogramme_est_losange', 'parallelogramme_n_est_pas_losange']),
          choice(['parallelogramme_est_rectangle',
            'parallelogramme_n_est_pas_rectangle'])
        ]
      }
    }
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    )
    const listeTripletsPythagoriciens = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [7, 24, 25],
      [8, 15, 17],
      [9, 12, 15],
      [9, 40, 41],
      [10, 24, 26],
      [11, 60, 61],
      [12, 16, 20],
      [12, 35, 37],
      [13, 84, 85],
      [14, 48, 50],
      [15, 20, 25],
      [15, 36, 39],
      [16, 30, 34],
      [16, 63, 65],
      [18, 24, 30],
      [18, 80, 82],
      [20, 21, 29],
      [20, 48, 52],
      [21, 28, 35],
      [21, 72, 75],
      [24, 32, 40],
      [24, 45, 51],
      [24, 70, 74],
      [25, 60, 65],
      [27, 36, 45],
      [28, 45, 53],
      [28, 96, 100],
      [30, 40, 50],
      [30, 72, 78],
      [32, 60, 68],
      [33, 44, 55],
      [33, 56, 65],
      [35, 84, 91],
      [36, 48, 60],
      [36, 77, 85],
      [39, 52, 65],
      [39, 80, 89],
      [40, 42, 58],
      [40, 75, 85],
      [42, 56, 70],
      [45, 60, 75],
      [48, 55, 73],
      [48, 64, 80],
      [51, 68, 85],
      [54, 72, 90],
      [57, 76, 95],
      [60, 63, 87],
      [60, 80, 100],
      [65, 72, 97]
    ]
    let listeNomsQuadrilateres = ['L', 'M', 'N', 'O']
    for (
      let i = 0, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;

    ) {
      if (i % 3 === 0) listeNomsQuadrilateres = ['LMNOQD'] // lettres à éviter
      const nomQuadrilatere = creerNomDePolygone(4, listeNomsQuadrilateres)
      listeNomsQuadrilateres.push(nomQuadrilatere)
      const A = nomQuadrilatere[0]
      const B = nomQuadrilatere[1]
      const C = nomQuadrilatere[2]
      const D = nomQuadrilatere[3]
      const O = 'O'
      const triplet = choice(listeTripletsPythagoriciens)
      enleveElement(listeTripletsPythagoriciens, triplet) // Supprime le triplet pour les prochaines questions
      let a = triplet[0]
      let b = triplet[1]
      let c = triplet[2]
      if (
        listeTypeDeQuestions[i] === 'parallelogramme_n_est_pas_losange' ||
        listeTypeDeQuestions[i] === 'parallelogramme_n_est_pas_rectangle'
      ) {
        do {
          c = triplet[2] + randint(-3, 3, [0]) // on change la valeur de c
          while (a ** 2 + b ** 2 === c ** 2) {
          // si par hasard (est-ce possible ?) on retombe sur un triplet pythagoricien on change les valeurs
            c += randint(-3, 3, [0]) // on change la valeur de c
            b += randint(-3, 3, [0]) // on change la valeur de b
          }
        } while (c <= a || c <= b || c >= a + b)
      }
      if (a > 9 && choice([true, true, true, false])) {
        // le plus souvent on utilise des décimaux
        a = new Decimal(a).div(10)
        b = new Decimal(b).div(10)
        c = new Decimal(c).div(10)
      }

      switch (listeTypeDeQuestions[i]) {
        case 'losange':
          texte = `$${nomQuadrilatere}$ est un losange de centre $O$ tel que $${A + B
            }=${texNombre(c)}$ cm et $${A + C}=${texNombre(2 * a)}$ cm.<br>`
          texte += `Calculer $${D + B}$.`
          texte += this.interactif ? (sp(20) + `$${D + B} = $` + ajouteChampTexteMathLive(this, i, ' ', { texteApres: ' cm' })) : ''
          handleAnswers(this, i, { reponse: { value: 2 * b } }, { formatInteractif: 'mathlive' })

          texteCorr = `$${nomQuadrilatere}$ est un losange donc ses diagonales se coupent en leur milieu : $${A + O
            }=${A + C}\\div2=${texNombre(2 * a)}\\div2=${texNombre(
              a
            )}$ cm.<br>`
          texteCorr += `On sait que les diagonales d'un losange se coupent perpendiculairement donc $${A + O + B
            }$ est un triangle rectangle en $O$.<br>`
          texteCorr += RedactionPythagore('O', B, A, 2, b, a, c, 'cm', 'blue')[0]
          texteCorr += `<br>Finalement comme $O$ est aussi le milieu de $[${D + B
            }]$ : $${D + B}=2\\times ${O + B}=2\\times${texNombre(
              b
            )}=${miseEnEvidence(texNombre(2 * b))}$ ${texteEnCouleurEtGras('cm')}.`
          break

        case 'rectangle_diagonale_connue':
          texte = `$${nomQuadrilatere}$ est un rectangle tel que $${A + B
            }=${texNombre(a)}$ cm et $${A + C}=${texNombre(c)}$ cm.<br>`
          texte += `Calculer $${B + C}$.`
          texte += this.interactif ? (sp(20) + `$${B + C} = $` + ajouteChampTexteMathLive(this, i, ' ', { texteApres: ' cm' })) : ''
          handleAnswers(this, i, { reponse: { value: b } }, { formatInteractif: 'mathlive' })
          texteCorr = `$${nomQuadrilatere}$ est un rectangle donc il possède 4 angles droits.`
          texteCorr += RedactionPythagore(B, A, C, 2, b, a, c)[0]
          break

        case 'rectangle_diagonale_a_trouver':
          texte = `$${nomQuadrilatere}$ est un rectangle tel que $${A + B
            }=${texNombre(a)}$ cm et $${B + C}=${texNombre(b)}$ cm.<br>`
          texte += `Calculer $${A + C}$.`
          texte += this.interactif ? (sp(20) + `$${A + C} = $` + ajouteChampTexteMathLive(this, i, ' ', { texteApres: ' cm' })) : ''
          handleAnswers(this, i, { reponse: { value: c } }, { formatInteractif: 'mathlive' })
          texteCorr = `$${nomQuadrilatere}$ est un rectangle donc il possède 4 angles droits `
          texteCorr += RedactionPythagore(B, A, C, 1, b, a, c)[0]
          break

        case 'parallelogramme_est_losange':
          texte = `$${nomQuadrilatere}$ est un parallélogramme de centre $O$ tel que $${A + O
            }=${texNombre(a)}$ cm, $${A + B}=${texNombre(c)}$ cm et $${B + O
            }=${texNombre(b)}$ cm.<br>`
          texte += `$${nomQuadrilatere}$ est-il un losange ?`
          this.autoCorrection[i] = {
            texte,
            propositions: [
              {
                texte: `$${nomQuadrilatere}$ est un losange.`,
                statut: true
              },
              {
                texte: `$${nomQuadrilatere}$ n'est pas un losange.`,
                statut: false
              }
            ],
            options: {
              ordered: false
            }
          }
          texte += this.interactif ? propositionsQcm(this, i).texte : ''
          texteCorr = drawParallelogramm(A, B, C, D)
          texteCorr += `Dans le triangle $${A + O + B
            }$, le plus grand côté est $[${A + B}]$.<br>`
          texteCorr += `$${A + B}^2=${texNombre(c)}^2=${texNombre(
            c ** 2
          )}$<br>`
          texteCorr += `$${A + O}^2+${O + B}^2=${texNombre(a)}^2+${texNombre(
            b
          )}^2=${texNombre(a ** 2 + b ** 2)}$<br>`
          texteCorr += `On constate que $${A + B}^2=${A + O}^2+${O + B
            }^2$, l'égalité de Pythagore est vérifiée donc $${A + O + B
            }$ est rectangle en $O$.<br>`
          texteCorr += `Finalement, comme $${nomQuadrilatere}$ est un parallélogramme qui a ses diagonales perpendiculaires alors $${nomQuadrilatere}$ ${texteEnCouleurEtGras('est')} aussi ${texteEnCouleurEtGras('un losange')}.`
          break

        case 'parallelogramme_n_est_pas_losange':
          texte = `$${nomQuadrilatere}$ est un parallélogramme de centre $O$ tel que $${A + O
            }=${texNombre(a)}$ cm, $${A + B}=${texNombre(c)}$ cm et $${B + O
            }=${texNombre(b)}$ cm.<br>`
          texte += `$${nomQuadrilatere}$ est-il un losange ?`
          this.autoCorrection[i] = {
            texte,
            propositions: [
              {
                texte: `$${nomQuadrilatere}$ est un losange.`,
                statut: false
              },
              {
                texte: `$${nomQuadrilatere}$ n'est pas un losange.`,
                statut: true
              }
            ],
            options: {
              ordered: false
            }
          }
          texte += this.interactif ? propositionsQcm(this, i).texte : ''
          texteCorr = drawParallelogramm(A, B, C, D)
          texteCorr += `Dans le triangle $${A + O + B
            }$, le plus grand côté est $[${A + B}]$.<br>`
          texteCorr += `$${A + B}^2=${texNombre(c)}^2=${texNombre(
            c ** 2
          )}$<br>`
          texteCorr += `$${A + O}^2+${O + B}^2=${texNombre(a)}^2+${texNombre(
            b
          )}^2=${texNombre(a ** 2 + b ** 2)}$<br>`
          texteCorr += `On constate que $${A + B}^2\\not=${A + O}^2+${O + B
            }^2$, l'égalité de Pythagore n'est pas vérifiée donc $${A + O + B
            }$ n'est pas un triangle rectangle.<br>`
          texteCorr += `Si $${nomQuadrilatere}$ était un losange alors ses diagonales devraient être perpendiculaires et $${A + O + B
            }$ devrait être un triangle rectangle.<br>`
          texteCorr += `Finalement, comme $${A + O + B
            }$ n'est pas un triangle rectangle, alors $${nomQuadrilatere}$ ${texteEnCouleurEtGras('n\'est pas un losange')}.`
          break

        case 'parallelogramme_est_rectangle':
          texte = `$${nomQuadrilatere}$ est un parallélogramme de centre $O$ tel que $${A + B
            }=${texNombre(a)}$ cm, $${A + C}=${texNombre(c)}$ cm et $${B + C
            }=${texNombre(b)}$ cm.<br>`
          texte += `$${nomQuadrilatere}$ est-il un rectangle ?`
          this.autoCorrection[i] = {
            texte,
            propositions: [
              {
                texte: `$${nomQuadrilatere}$ est un rectangle.`,
                statut: true
              },
              {
                texte: `$${nomQuadrilatere}$ n'est pas un rectangle.`,
                statut: false
              }
            ],
            options: {
              ordered: false
            }
          }
          texte += this.interactif ? propositionsQcm(this, i).texte : ''
          texteCorr = drawParallelogramm(A, B, C, D)
          texteCorr += `Dans le triangle $${A + B + C
            }$, le plus grand côté est $[${A + C}]$.<br>`
          texteCorr += `$${A + C}^2=${texNombre(c)}^2=${texNombre(
            c ** 2
          )}$<br>`
          texteCorr += `$${A + B}^2+${B + C}^2=${texNombre(a)}^2+${texNombre(
            b
          )}^2=${texNombre(a ** 2 + b ** 2)}$<br>`
          texteCorr += `On constate que $${A + C}^2=${A + B}^2+${B + C
            }^2$, l'égalité de Pythagore est vérifiée donc $${A + B + C
            }$ est rectangle en $${B}$.<br>`
          texteCorr += `Finalement, comme $${nomQuadrilatere}$ est un parallélogramme qui a un angle droit en $${B}$ alors $${nomQuadrilatere}$ ${texteEnCouleurEtGras('est')} aussi ${texteEnCouleurEtGras('un rectangle')}.`
          break

        case 'parallelogramme_n_est_pas_rectangle':
          texte = `$${nomQuadrilatere}$ est un parallélogramme de centre $O$ tel que $${A + B
            }=${texNombre(a)}$ cm, $${A + C}=${texNombre(c)}$ cm et $${B + C
            }=${texNombre(b)}$ cm.<br>`
          texte += `$${nomQuadrilatere}$ est-il un rectangle ?`
          this.autoCorrection[i] = {
            texte,
            propositions: [
              {
                texte: `$${nomQuadrilatere}$ est un rectangle.`,
                statut: false
              },
              {
                texte: `$${nomQuadrilatere}$ n'est pas un rectangle.`,
                statut: true
              }
            ],
            options: {
              ordered: false
            }
          }
          texte += this.interactif ? propositionsQcm(this, i).texte : ''
          texteCorr = drawParallelogramm(A, B, C, D)
          texteCorr += `Dans le triangle $${A + B + C
            }$, le plus grand côté est $[${A + C}]$.<br>`
          texteCorr += `$${A + C}^2=${texNombre(c)}^2=${texNombre(
            c ** 2
          )}$<br>`
          texteCorr += `$${A + B}^2+${B + C}^2=${texNombre(a)}^2+${texNombre(
            b
          )}^2=${texNombre(a ** 2 + b ** 2)}$<br>`
          texteCorr += `On constate que $${A + C}^2\\not=${A + B}^2+${B + C
            }^2$, l'égalité de Pythagore n'est pas vérifiée donc $${A + B + C
            }$ n'est pas rectangle en $${B}$.<br>`
          texteCorr += `Finalement, comme $${nomQuadrilatere}$ n'a pas d'angle droit en $${B}$ alors $${nomQuadrilatere}$ ${texteEnCouleurEtGras('n\'est pas un rectangle')}.`
          break
      }

      if (this.questionJamaisPosee(i, a, b, c)) {
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

function drawParallelogramm (labelA, labelB, labelC, labelD, labelO = 'O', x = 6, y = 3, dx = 1) {
  const figureCorr = new Figure({ xMin: -1, yMin: -4, height: 160 })
  const A = figureCorr.create('Point', { label: labelA, shape: '', x: 0, y: 0, labelDxInPixels: -10 })
  const B = figureCorr.create('Point', { label: labelB, shape: '', x, y: 0 })
  const C = figureCorr.create('Point', { label: labelC, shape: '', x: x + dx, y: -y, labelDyInPixels: -10 })
  const D = figureCorr.create('Point', { label: labelD, shape: '', x: dx, y: -y, labelDxInPixels: -10, labelDyInPixels: -10 })
  figureCorr.create('Middle', { label: labelO, labelDxInPixels: 0, shape: '', point1: A, point2: C })
  figureCorr.create('Polygon', { points: [A, B, C, D] })
  figureCorr.create('Segment', { point1: A, point2: C, isDashed: true })
  figureCorr.create('Segment', { point1: B, point2: D, isDashed: true })

  if (context.isHtml) {
    return `<div>${figureCorr.getStaticHtml()}</div>`
  }
  return `${figureCorr.tikz()}\n\n`
}
