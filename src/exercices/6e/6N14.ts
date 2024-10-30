import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'

import { fraction } from '../../modules/fractions.js'
import Figure from 'apigeom'
import figureApigeom from '../../lib/figureApigeom.js'
import type CircleFractionDiagram from 'apigeom/src/elements/diagrams/CircleFractionDiagram.js'
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
  numerators: number[] = []
  constructor () {
    super()
    this.consigne = ''
    this.nbQuestions = 4
    this.nbCols = 2
    this.nbColsCorr = 2
    this.sup = 3
    this.besoinFormulaireNumerique = ['Type de fractions', 6, '1 : Inférieures à 1\n2 : Supérieures à 1\n3 : Peu importe']
  }

  nouvelleVersion () {
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
      f = fraction(num, den)
      texte = `Sachant qu'un disque représente une unité, représenter la fraction $${f.texFraction}$ en coloriant la part correspondante.<br>`
      this.numerators[i] = num
      const figure = new Figure({ xMin: -1.6, yMin: -1.6, width: 336, height: 95 })
      figure._scale = context.isHtml ? 1 : 0.6
      this.figures[i] = figure
      figure.create('CircleFractionDiagram', { denominator: den, numberOfCircle: 3, radius: 1.5 })
      if (this.interactif) {
        figure.options.color = 'blue'
        figure.setToolbar({ tools: ['FILL'], position: 'top' })
        texte += figureApigeom({ exercice: this, figure, isDynamic: true, i, defaultAction: 'FILL' })
        figure.divButtons.style.display = 'none' // Doit apparaitre après figureApigeom
        figure.divUserMessage.style.display = 'none'
      } else {
        // if (context.isHtml) {
        //   texte += figure.getStaticHtml()
        // } else {
        //   texte += figure.tikz()
        // }
        const f2 = fraction(den * 3, den)
        texte += mathalea2d(params, f2.representation(0, 0, 2, 0, 'gateau', 'white'))
      }
      texteCorr = `Voici sur ces dessins, coloriés en bleu, la part correspondante à la fraction $${f.texFraction}$ :<br>`
      if (this.interactif) {
        const figureCorr = new Figure({ xMin: -2, yMin: -2, width: 600, height: 95 })
        figureCorr.options.color = 'blue'
        const diagrammeCorr = figureCorr.create('CircleFractionDiagram', { denominator: den, numberOfCircle: 3, radius: 1 })
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
              // @ts-expect-error typage pour les QCM
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
    if (this.answers == null) this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[this.figures[i].id] = this.figures[i].json
    let result = 'KO'
    const divCheck = document.querySelector(`#resultatCheckEx${this.numeroExercice}Q${i}`)
    const divFeedback = document.querySelector(`#feedbackEx${this.numeroExercice}Q${i}`)
    const diagramme = this.figures[i].elements.get('element0') as CircleFractionDiagram
    if (diagramme.type !== 'CircleFractionDiagram') throw new Error('On attendait un diagramme circulaire de fractions')
    if (diagramme.numerator === this.numerators[i]) {
      if (divCheck) divCheck.innerHTML = '😎'
      result = 'OK'
    } else {
      if (divCheck) divCheck.innerHTML = '☹️'
      const p = document.createElement('p')
      p.innerText = `Tu as colorié $\\dfrac{${diagramme.numerator}}{${diagramme.denominator}}$.`
      if (divFeedback) {
        divFeedback.innerHTML = ''
        divFeedback.appendChild(p)
      }
      result = 'KO'
    }
    this.figures[i].isDynamic = false
    this.figures[i].divUserMessage.style.display = 'none'
    return result
  }
}
