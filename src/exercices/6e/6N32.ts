import { grille, seyes } from '../../lib/2d/reperes.js'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils.js'
import Exercice from '../Exercice.js'
import { mathalea2d, vide2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { fraction } from '../../modules/fractions.js'
import Figure from 'apigeom'
import LineFractionDiagram from 'apigeom/src/elements/diagrams/LineFractionDiagram'
import figureApigeom from '../../lib/figureApigeom.js'
export const titre = 'Représenter une fraction de l\'unité'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'custom'
export const dateDeModifImportante = '7/10/2024'
/**
 * Tracer un segment de longueur une fraction de l'unité.
 * @author Jean-Claude Lhote (Rémi Angot pour l'interactivité)
 * 6N32
 */

export const uuid = 'c28e5'
export const ref = '6N32'
export const refs = {
  'fr-fr': ['6N32'],
  'fr-ch': ['9NO10-12']
}
export default class FractionsDunite extends Exercice {
  goodAnswers: number[] = []
  diagrams: LineFractionDiagram[] = []
  figuresApigeom: Figure[] = []
  constructor () {
    super()
    this.nbQuestions = 5
    this.consigne = 'Colorier en bleu un segment de longueur ...'
    context.isHtml ? (this.spacingCorr = 3.5) : (this.spacingCorr = 2)
    context.isHtml ? (this.spacing = 2) : (this.spacing = 2)
    this.sup = 1
    this.sup2 = 1
    this.besoinFormulaireNumerique = ['Type  de questions', 4, '1 : Fraction inférieure à 1\n2 : Demis, tiers et quarts\n3 : Quarts, cinquièmes, sixièmes et dixièmes\n4 : Toutes les fractions supérieures à 1']
    this.besoinFormulaire2Numerique = ['Type de cahier', 2, '1 : Cahier à petits carreaux\n2 : Cahier à gros carreaux (Seyes)']
  }

  nouvelleVersion () {
    let typesDeQuestionsDisponibles, g, carreaux, sc, unit
    let listeTypeDeQuestions = []
    if (this.sup < 5) { typesDeQuestionsDisponibles = [parseInt(this.sup)] } else { typesDeQuestionsDisponibles = [1, 2, 3, 4] }
    listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (
      let i = 0, cpt = 0;
      i < this.nbQuestions && cpt < 50;

    ) {
      let den = 1
      let num = 1
      let texte = ''
      let texteCorr = ''
      switch (listeTypeDeQuestions[i]) {
        case 1:
          den = choice([4, 5, 6, 10])
          num = randint(1, den - 1)
          break
        case 2:
          den = choice([2, 3, 4])
          if (den === 3) num = randint(3, 2 * den - 1, den)
          else num = randint(3, 2 * den - 1, den)
          break
        case 3:
          den = choice([4, 5, 6, 10])
          if (den === 4) num = randint(5, 3 * den - 1, den)
          else num = randint(5, 2 * den - 1, den)
          break
        case 4:
          den = choice([2, 3, 4, 5, 6, 10])
          if (den === 2 || den === 4) num = randint(den + 1, 3 * den - 1, den)
          else num = randint(den + 1, 2 * den - 1, den)
          break
      }
      if (den % 3 === 0) unit = 12
      else if (den % 5 === 0) unit = 10
      else unit = 8
      const frac = fraction(num, den)
      this.goodAnswers[i] = Math.round(num / den * unit)
      if (this.interactif) {
        texte = `$${frac.texFraction}$ unité.`
      } else {
        texte = `$${frac.texFraction}$ unité en prenant ${unit} carreaux (ou ${unit} cm) pour une unité.`
      }
      if (this.sup2 < 3) g = grille(0, 0, 26, 2, 'gray', 0.7)
      else g = vide2d()
      if (parseInt(this.sup2) === 2) {
        sc = 0.6
        carreaux = seyes(0, 0, 26, 2)
      } else {
        sc = 0.5
        carreaux = vide2d()
      }

      if (this.interactif) {
        const figure = new Figure({ xMin: -0.5, yMin: -0.3, height: 40, width: 600 })
        this.figuresApigeom[i] = figure
        figure.setToolbar({ position: 'top', tools: ['FILL'] })
        figure.options.color = 'blue'
        this.diagrams[i] = new LineFractionDiagram(figure, { denominator: unit, max: 3, width: 6 })
        texte += figureApigeom({ exercice: this, figure, defaultAction: 'FILL', i })
        figure.divButtons.style.display = 'none'
        figure.divUserMessage.style.display = 'none'
      }

      texteCorr = mathalea2d({ xmin: 0, ymin: 0, xmax: 26, ymax: 2, pixelsParCm: 20, scale: sc }, frac.representation(1, 1, unit, 0, 'segment', 'blue', 0, 1), g, carreaux)
      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: 'ici la (ou les) question(s) est(sont) posée(s)',
          enonceAvant: false, // EE : ce champ est facultatif et permet (si false) de supprimer l'énoncé ci-dessus avant la numérotation de chaque question.
          enonceAvantUneFois: false, // EE : ce champ est facultatif et permet (si true) d'afficher l'énoncé ci-dessus une seule fois avant la numérotation de la première question de l'exercice. Ne fonctionne correctement que si l'option melange est à false.
          propositions: [
            {
              // @ts-expect-error Problème typage
              type: 'AMCOpen', // on donne le type de la première question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
              propositions: [
                {
                  texte: texteCorr,
                  statut: 2, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                  enonce: this.consigne.split('.')[0] + ' ' + texte,
                  pointilles: false,
                  sanscadre: false // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
                }
              ]
            }
          ]
        }
      }
      if (this.questionJamaisPosee(i, num, den)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }

  correctionInteractive = (i: number) => {
    const figure = this.figuresApigeom[i]
    if (this.answers == null) this.answers = {}
    // Sauvegarde de la réponse pour Capytale
    this.answers[figure.id] = figure.json
    figure.isDynamic = false
    figure.divButtons.style.display = 'none'
    figure.divUserMessage.style.display = 'none'
    const divFeedback = document.querySelector(`#feedback${`Ex${this.numeroExercice}Q${i}`}`)
    const result = (this.diagrams[i].numerator === this.goodAnswers[i] && this.diagrams[i].numerator === this.diagrams[i].indiceLastInColor)
    if (divFeedback != null) {
      if (result) {
        divFeedback.innerHTML = '😎'
      } else {
        const p = document.createElement('p')
        p.innerText = '☹️'
        divFeedback.insertBefore(p, divFeedback.firstChild)
      }
    }
    return result ? 'OK' : 'KO'
  }
}
