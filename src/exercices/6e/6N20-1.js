import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { modalTexteCourt } from '../../lib/outils/modales.js'
import { rangeMinMax } from '../../lib/outils/nombres'
import Exercice from '../Exercice'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'

import { fraction } from '../../modules/fractions.js'
import { ajouteFeedback, remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { getDynamicFractionDiagram } from './6N20-2'
import figureApigeom from '../../lib/figureApigeom'
import { consecutiveCompare, expressionDeveloppeeEtReduiteCompare } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Encadrer une fraction entre deux nombres entiers consécutifs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '24/01/2024' // Brouillon interactif

/**
 * Une fraction avec pour dénominateur 2, 3, 4, 5, 10 à encadrer entre 2 entiers
 * @author Rémi Angot (AMC par EE)
 * Référence 6N20-1
 * Relecture : Novembre 2021 par EE
 */
export const uuid = '1f5de'
export const ref = '6N20-1'
export const refs = {
  'fr-fr': ['6N20-1'],
  'fr-ch': ['9NO11-1']
}
export default class EncadrerFractionEntre2Entiers extends Exercice {
  constructor () {
    super()
    this.consigne = 'Compléter avec deux nombres entiers consécutifs.' + modalTexteCourt(1, 'Nombres entiers consécutifs : Ce sont deux nombres entiers qui se suivent comme 4 et 5.', 'Consécutifs')
    this.introduction = 'Exemple : $2 < \\dfrac{9}{4} < 3$ car  $2=\\dfrac{8}{4}$ et $3=\\dfrac{12}{4}$'
    this.nbQuestions = 6
    this.nbCols = 2
    this.nbColsCorr = 1
    this.correctionDetaillee =
          this.sup = false
    this.sup2 = '11'
    this.sup3 = true
    this.besoinFormulaireCaseACocher = ['Exercice à la carte (à paramétrer dans le formulaire suivant)', false]
    this.besoinFormulaire2Texte = this.lycee
      ? ['Dénominateurs à choisir', 'Nombres séparés par des tirets\nDe 2 à 9\n10: mélange']
      : ['Dénominateurs à choisir', 'Nombres séparés par des tirets\n2: demis\n3: tiers\n4: quarts\n5: cinquièmes\n10: dixièmes\n11: Mélange']
    this.besoinFormulaire3CaseACocher = ['Brouillon interactif']
  }

  nouvelleVersion () {
    this.correctionDetailleeDisponible = !this.lycee
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const listeDenominateurs = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 2,
      max: this.lycee ? 9 : 10,
      defaut: this.lycee ? 10 : 11,
      melange: this.lycee ? 10 : 11,
      nbQuestions: this.nbQuestions,
      exclus: this.lycee ? [] : [6, 7, 8, 9]
    })
    if (this.sup3) {
      const figure = getDynamicFractionDiagram()
      this.introduction = figureApigeom({ exercice: this, idApigeom: `apiGeomEx${this.numeroExercice}`, figure })
      figure.isDynamic = true
      figure.divButtons.style.display = 'grid'
      if (figure.ui) figure.ui.send('FILL')
    } else {
      this.introduction = ''
    }
    this.liste_de_denominateurs = !this.sup ? this.lycee ? combinaisonListes([2, 3, 4, 5, 6, 7, 8, 9], this.nbQuestions) : combinaisonListes([2, 3, 4, 5, 10], this.nbQuestions) : listeDenominateurs
    const denominateursDifferents = new Set(this.liste_de_denominateurs)
    const nbDenominateursDifferents = denominateursDifferents.size
    const aleaMax = Math.ceil(this.nbQuestions / nbDenominateursDifferents) + 1

    // this.liste_de_k = this.lycee ? combinaisonListes(rangeMinMax(-5, 5), this.nbQuestions) : combinaisonListes(rangeMinMax(0, aleaMax), this.nbQuestions)
    for (let i = 0, texte, texteCorr, n, d, k, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      d = this.liste_de_denominateurs[i]
      k = this.lycee ? choice(rangeMinMax(-5, 5)) : choice(rangeMinMax(0, aleaMax))
      n = k * d + randint(1, d - 1)
      texte = remplisLesBlancs(this, i, `%{champ1} < \\dfrac{${n}}{${d}} < %{champ2}`, 'college6eme', '\\ldots')
      texte += ajouteFeedback(this, i)
      texteCorr = `$${k} < \\dfrac{${n}}{${d}} < ${k + 1}$`
      texteCorr += ` $\\qquad$ car $\\quad ${k}=\\dfrac{${k * d}}{${d}}\\quad$ et $\\quad${k + 1}=\\dfrac{${(k + 1) * d}}{${d}}$ `
      texteCorr += '<br><br>'
      if (this.correctionDetaillee && !this.lycee && context.isHtml) {
        const representation = fraction(n, d).representation(0, 0, 3, 0, 'barre', 'blue')
        texteCorr += mathalea2d(Object.assign({}, fixeBordures(representation)), representation)
      }

      if (this.questionJamaisPosee(i, d, n)) {
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: texte,
            options: { multicols: true, numerotationEnonce: true },
            propositions: [
              {
                type: 'AMCNum',
                propositions: [{
                  texte: texteCorr,
                  statut: '',
                  reponse: {
                    texte: 'Entier inférieur',
                    valeur: k,
                    param: {
                      digits: 1,
                      decimals: 0,
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: 'Entier supérieur',
                    valeur: k + 1,
                    param: {
                      digits: 1,
                      decimals: 0,
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              }
            ]
          }
        } else {
          handleAnswers(this, i, {
            bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
            feedback: (saisies/** {champ1: string, champ2:string} */) => {
              const rep1 = saisies.champ1
              const rep2 = saisies.champ2
              // on teste consecutiveCompare pour le feedback seulement, comme c'est un fillInTheBlank, la comparaison se fait sur les valeurs exactes des bornes entières.
              // consecutiveCompare peut être utilisée pour évaluer des saisies complètes d'encadrements avec les signes < ou >
              const { feedback } = consecutiveCompare(`${rep1}<${(n / d).toFixed(4)}<${rep2}`, `${k}<${(2 * k + 1) / 2}<${k + 1}`)
              return feedback
            },
            champ1: { value: String(k), compare: expressionDeveloppeeEtReduiteCompare },
            champ2: { value: String(k + 1), compare: expressionDeveloppeeEtReduiteCompare }
          }, { formatInteractif: 'fillInTheBlank' })
        }
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      } else {
        cpt++
      }
    }
    listeQuestionsToContenu(this)
  }
}
