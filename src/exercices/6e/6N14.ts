import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'

import { fraction } from '../../modules/fractions.js'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom.js'
import CircleFractionDiagram from 'apigeom/src/elements/diagrams/CircleFractionDiagram.js'
import { ajouteFeedback } from '../../lib/interactif/questionMathLive'
export const titre = 'Représenter des fractions'
export const amcReady = true
export const interactifReady = true
export const interactifType = 'custom'
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '15/01/2024'

/**
 * Représenter des fractions simples avec des disques partagés de façon adéquate.
 * @author Jean-Claude Lhote (Modifié par EE : rajout d'un paramètre puis Rémi Angot pour apiGeom)
 * 6N14
 * Relecture : Novembre 2021 par EE
 */
export const uuid = '87479'
export const ref = '6N14'
export const refs = {
  'fr-fr': ['6N14'],
  'fr-ch': ['9NO10-1']
}
export default class RepresenterUneFraction extends Exercice {
  figures: Figure[] = []
  diagrammes: CircleFractionDiagram[] = []
  idApigeom: string[] = []
  numerators: number[] = []
  constructor () {
    super()
    this.consigne = ''
    this.nbQuestions = 4
    this.nbCols = 2
    this.nbColsCorr = 2
    this.sup = 3
    this.besoinFormulaireNumerique = ['Type de fractions', 6, '1 : Inférieures à 1\n2 : Supérieures à 1\n3 : Peu importe']
    this.diagrammes = []
  }

  nouvelleVersion (numeroExercice: number) {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let sc
    const ppc = 20
    if (context.isHtml) {
      sc = 0.5
    } else {
      sc = 0.4
    }

    const params = {
      xmin: -2.2,
      ymin: -2.2,
      xmax: 18,
      ymax: 3,
      pixelsParCm: ppc,
      scale: sc
    }; let den; let num; let f

    const liste = combinaisonListes([2, 3, 4, 5, 6], this.nbQuestions)

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      den = liste[i]
      switch (this.sup) {
        case 1 :
          num = randint(1, den - 1)
          break
        case 2 :
          num = randint(den + 1, den * 3)
          break
        default :
          num = randint(1, den * 3)
          break
      }
      num = randint(1, den * 3)
      f = fraction(num, den)
      texte = `Sachant qu'un disque représente une unité, représenter la fraction $${f.texFraction}$ en coloriant la part correspondante.<br>`
      if (this.interactif) {
        this.numerators[i] = num
        const figure = new Figure({ xMin: -2, yMin: -2, width: 600, height: 95 })
        this.figures[i] = figure
        figure.options.color = 'blue'
        figure.setToolbar({ tools: ['FILL'], position: 'top' })
        if (figure.ui) figure.ui.send('FILL')
        this.diagrammes[i] = new CircleFractionDiagram(figure, { denominator: den, numberOfCircle: 3, radius: 1 })
        this.idApigeom[i] = `apiGeomEx${numeroExercice}F${i}`
        texte += figureApigeom({ exercice: this, idApigeom: this.idApigeom[i], figure })
        figure.divButtons.style.display = 'none' // Doit apparaitre après figureApigeom
        texte += ajouteFeedback(this, i)
      } else {
        texte += mathalea2d(params, fraction(den * 3, den).representation(0, 0, 2, 0, 'gateau', 'white'))
      }
      texteCorr = `Voici sur ces dessins, coloriés en bleu, la part correspondante à la fraction $${f.texFraction}$ :<br>`
      if (this.interactif) {
        const figureCorr = new Figure({ xMin: -2, yMin: -2, width: 600, height: 95 })
        figureCorr.options.color = 'blue'
        const diagrammeCorr = new CircleFractionDiagram(figureCorr, { denominator: den, numberOfCircle: 3, radius: 1 })
        diagrammeCorr.numerator = num
        texteCorr += figureCorr.getStaticHtml()
      } else {
        texteCorr += mathalea2d(params, f.representation(0, 0, 2, randint(0, den - 1), 'gateau', 'blue'))
      }
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: 'ici la (ou les) question(s) est(sont) posée(s)',
          enonceAvant: false, // EE : ce champ est facultatif et permet (si false) de supprimer l'énoncé ci-dessus avant la numérotation de chaque question.
          enonceAvantUneFois: false, // EE : ce champ est facultatif et permet (si true) d'afficher l'énoncé ci-dessus une seule fois avant la numérotation de la première question de l'exercice. Ne fonctionne correctement que si l'option melange est à false.
          propositions: [
            {
              type: 'AMCOpen', // on donne le type de la première question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
              propositions: [
                {
                  texte: texteCorr,
                  statut: 3, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                  enonce: texte,
                  sanscadre: true // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
                }
              ]
            }
          ]
        }
      }
      if (this.questionJamaisPosee(i, num, den)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }

  correctionInteractive = (i: number) => {
    this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.idApigeom[i]] = this.figures[i].json
    let result = 'KO'
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${i}`) as HTMLDivElement
    if (this.diagrammes[i].numerator === this.numerators[i]) {
      if (divFeedback) divFeedback.innerHTML = '😎'
      result = 'OK'
    } else {
      const p1 = document.createElement('p')
      p1.innerText = '☹️'
      const p2 = document.createElement('p')
      p2.innerText = `Tu as colorié $\\dfrac{${this.diagrammes[i].numerator}}{${this.diagrammes[i].denominator}}$.`
      if (divFeedback) divFeedback.appendChild(p1)
      if (divFeedback) divFeedback.appendChild(p2)
    }
    this.figures[i].isDynamic = false
    this.figures[i].divUserMessage.style.display = 'none'
    return result
  }
}
