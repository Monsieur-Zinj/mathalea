import { choice, enleveElement } from '../../lib/outils/arrayOutils'
import { nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import Exercice from '../Exercice'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { getDynamicFractionDiagram } from './6N20-2'
import figureApigeom from '../../lib/figureApigeom'
import type { MathfieldElement } from 'mathlive'

export const titre = 'Décomposer une fraction (partie entière + fraction inférieure à 1)'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '24/01/2024' // Brouillon interactif

/**
 * @author Rémi Angot
 * Relecture : Novembre 2021 par EE
 */
export const uuid = '6c8a1'
export const ref = '6N20'
export const refs = {
  'fr-fr': ['6N20'],
  'fr-ch': ['9NO10-9']
}
export default class ExerciceFractionsDecomposer extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 5
    this.consigne =
          "Écrire sous la forme de la somme d'un nombre entier et d'une fraction inférieure à 1."
    this.spacing = 2
    this.spacingCorr = 2
    this.sup2 = true
    this.sup3 = '11'
    this.sup4 = true
    this.besoinFormulaire3Texte = ['Dénominateurs à choisir', 'Nombres séparés par des tirets\n2: demis\n4: quarts\n5: cinquièmes\n8: huitièmes\n10: dixièmes\n11: Mélange']
    this.besoinFormulaire4CaseACocher = ['Brouillon interactif']
  }

  nouvelleVersion () {
    if (this.sup4) {
      const figure = getDynamicFractionDiagram()
      this.introduction = figureApigeom({ exercice: this, i: 0, figure })
      if (figure.ui) figure.ui.send('FILL')
    } else {
      this.introduction = ''
    }
    const listeDenominateurs = gestionnaireFormulaireTexte({
      saisie: this.sup3,
      min: 2,
      max: 10,
      defaut: 11,
      melange: 11,
      nbQuestions: this.nbQuestions
    }) as number[]
    let fractions: [number, number, number|string, string?][] = []
    let fractions1: [number, number, string][] = []
    if (!this.sup2) {
      fractions = [
        [1, 2, ',5'],
        [1, 4, ',25'],
        [3, 4, ',75'],
        [1, 5, ',2'],
        [2, 5, ',4'],
        [3, 5, ',6'],
        [4, 5, ',8'],
        [1, 8, ',125'],
        [3, 8, ',375'],
        [1, 10, ',1'],
        [3, 10, ',3'],
        [7, 10, ',7'],
        [9, 10, ',9']
      ] // Fractions irréductibles avec une écriture décimale exacte
      fractions1 = [
        [1, 2, ',5'],
        [1, 4, ',25'],
        [3, 4, ',75'],
        [1, 8, ',125']
      ]
      fractions1.push(
        choice([
          [1, 10, ',1'],
          [2, 10, ',2'],
          [3, 10, ',3'],
          [7, 10, ',7'],
          [9, 10, ',9']
        ])
      )
      fractions1.push(
        choice([
          [1, 5, ',2'],
          [2, 5, ',4'],
          [3, 5, ',6'],
          [4, 5, ',8']
        ])
      ) // liste_fractions pour les 6 premières
    } else {
      const denominateursDifferents = new Set(listeDenominateurs)
      const nbDenominateursDifferents = denominateursDifferents.size
      const aleaMax = Math.ceil(this.nbQuestions / nbDenominateursDifferents)
      for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 200;) {
        const n = randint(1, aleaMax)
        const b = listeDenominateurs[i]
        const num = randint(1, b - 1)
        const partieDecimale = num * 1000 / b // avec les 8e on a 3 chiffres, avec les 4 2...
        const partieDecimaleString = ',' + partieDecimale.toString().match(/[1-9]+/g)![0]
        const a = n * b + randint(1, b - 1)
        if (fractions.filter((element) => element[0] === a && element[1] === b).length === 0) { // la fraction n'a pas encore été construite
          fractions.push([a, b, n, partieDecimaleString])
          i++
        } else {
          cpt++
        }
      }
    }
    for (
      let i = 0, fraction, a, b, c, n, texte, texteCorr;
      i < this.nbQuestions;
      i++
    ) {
      if (!this.sup2) {
        if (i < 6) {
          fraction = choice(fractions1)
          enleveElement(fractions1, fraction)
        } else {
          fraction = choice(fractions)
        }
        //
        c = fraction[0]
        b = fraction[1]
        n = randint(1, 4)
        a = n * b + c
      } else {
        a = fractions[i][0]
        b = fractions[i][1]
        n = fractions[i][2] as number
        c = a - n * b
        // ed = fractions[i][2].toString() + fractions[i][3]
      }
      texte =
                '$ ' +
                texFraction(a, b) +
                ' = \\ldots\\ldots + ' +
                texFraction('\\ldots\\ldots', '\\ldots\\ldots') +
                ' $'
      texteCorr =
                '$ ' + texFraction(a, b) + ' = ' + n + '+' + texFraction(c, b) + ' $'

      if (this.interactif) {
        texte = remplisLesBlancs(this, i, `\\dfrac{${a}}{${b}}~=~%{champ1} + \\dfrac{%{champ2}}{%{champ3}}`, 'inline clavierDeBaseAvecFraction fillInTheBlank')
        handleAnswers(this, i, {
          champ1: { value: String(n) },
          champ2: { value: String(c) },
          champ3: { value: String(b) }
        }, { formatInteractif: 'fillInTheBlank' })
      }
      if (context.isAmc) {
        this.autoCorrection[i] = {
          // enonce: 'Décomposer $' + texFraction(a, b) + '$ sous forme d\'une somme d\'un entier et d\'une fraction inférieure à 1.',
          enonceAvant: false, // EE : ce champ est facultatif et permet (si false) de supprimer l'énoncé ci-dessus avant la numérotation de chaque question.
          enonceAvantUneFois: false, // EE : ce champ est facultatif et permet (si true) d'afficher l'énoncé ci-dessus une seule fois avant la numérotation de la première question de l'exercice. Ne fonctionne correctement que si l'option melange est à false.
          melange: false, // EE : ce champ est facultatif et permet (si false) de ne pas provoquer le mélange des questions.
          // @ts-expect-error typage de AMC
          options: { multicols: true, barreseparation: true, numerotationEnonce: true }, // facultatif. Par défaut, multicols est à false. Ce paramètre provoque un multicolonnage (sur 2 colonnes par défaut) : pratique quand on met plusieurs AMCNum. !!! Attention, cela ne fonctionne pas, nativement, pour AMCOpen. !!!
          // barreseparation (par défaut à false) permet de mettre une barre de séparation entre les deux colonnes.
          propositions: [
            {
              // @ts-expect-error typage de AMC
              type: 'AMCNum', // on donne le type de la première question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
              propositions: [ // une ou plusieurs (Qcms) 'propositions'
                {
                  texte: texteCorr, // Facultatif. la proposition de Qcm ou ce qui est affiché dans le corrigé pour cette question quand ce n'est pas un Qcm
                  statut: true, // true au false pour un QCM
                  feedback: '',
                  reponse: { // utilisé si type = 'AMCNum'
                    texte: 'Décomposer $' + texFraction(a, b) + '$ sous forme d\'une somme d\'un entier et d\'une fraction inférieure à 1. \\\\\n \\\\\n Entier ', // facultatif
                    valeur: n, // obligatoire (la réponse numérique à comparer à celle de l'élève). EE : Si une fraction est la réponse, mettre un tableau sous la forme [num,den]
                    alignement: 'flushleft', // EE : ce champ est facultatif et n'est fonctionnel que pour l'hybride. Il permet de choisir où les cases sont disposées sur la feuille. Par défaut, c'est comme le texte qui le précède. Pour mettre à gauche, au centre ou à droite, choisir parmi ('flushleft', 'center', 'flushright').
                    param: {
                      digits: nombreDeChiffresDansLaPartieEntiere(n) + 1, // obligatoire pour AMC (le nombre de chiffres dans le nombre, si digits est mis à 0, alors il sera déterminé pour coller au nombre décimal demandé)
                      decimals: 0, // obligatoire pour AMC (le nombre de chiffres dans la partie décimale du nombre, si decimals est mis à 0, alors il sera déterminé pour coller au nombre décimal demandé)
                      signe: false // obligatoire pour AMC (présence d'une case + ou -)
                    }
                  },
                  options: { ordered: false, lastChoice: false } // options pour Qcms
                }
              ]
            },
            {
              // @ts-expect-error typage de AMC
              type: 'AMCNum', // on donne le type de la première question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
              propositions: [ // une ou plusieurs (Qcms) 'propositions'
                {
                  texte: texteCorr, // Facultatif. la proposition de Qcm ou ce qui est affiché dans le corrigé pour cette question quand ce n'est pas un Qcm
                  statut: true, // true au false pour un QCM
                  feedback: '',
                  reponse: { // utilisé si type = 'AMCNum'
                    texte: 'Fraction inférieure à 1', // facultatif
                    valeur: new FractionEtendue(c, b), // obligatoire (la réponse numérique à comparer à celle de l'élève). EE : Si une fraction est la réponse, mettre un tableau sous la forme [num,den]
                    alignement: 'flushleft', // EE : ce champ est facultatif et n'est fonctionnel que pour l'hybride. Il permet de choisir où les cases sont disposées sur la feuille. Par défaut, c'est comme le texte qui le précède. Pour mettre à gauche, au centre ou à droite, choisir parmi ('flushleft', 'center', 'flushright').
                    param: {
                      digits: 3, // obligatoire pour AMC (le nombre de chiffres dans le nombre, si digits est mis à 0, alors il sera déterminé pour coller au nombre décimal demandé)
                      decimals: 0, // obligatoire pour AMC (le nombre de chiffres dans la partie décimale du nombre, si decimals est mis à 0, alors il sera déterminé pour coller au nombre décimal demandé)
                      signe: false, // obligatoire pour AMC (présence d'une case + ou -)
                      digitsNum: nombreDeChiffresDansLaPartieEntiere(c) + 1, // Facultatif. digitsNum correspond au nombre TOTAL de chiffres du numérateur à coder si la réponse est une fraction.
                      digitsDen: nombreDeChiffresDansLaPartieEntiere(b) + 1 // Facultatif. digitsDencorrespond au nombre TOTAL de chiffres du dénominateur à coder si la réponse est une fraction.
                    }
                  },
                  options: { ordered: false, lastChoice: false } // options pour Qcms
                }
              ]
            }
          ]
        }
      }
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque question.
  }

  correctionInteractive = (i: number) => {
    const mfe = document.querySelector(`math-field#champTexteEx${this.numeroExercice}Q${i}`) as MathfieldElement
    if (mfe == null) {
      throw Error('verifQuestionMathlive: type fillInTheBlank ne trouve pas le mathfieldElement dans le dom : ' + JSON.stringify({ selecteur: `math-field#champTexteEx${this.numeroExercice}Q${i}` }))
    }
    const spanReponseLigne = document.querySelector(`#resultatCheckEx${this.numeroExercice}Q${i}`)
    const reponses = this.autoCorrection[i]?.reponse?.valeur
    let result: string
    const num = Number(mfe.getPromptValue('champ2'))
    const den = Number(mfe.getPromptValue('champ3'))
    const fractionIsOk = (num * den) && Number(reponses?.champ2?.value) * den === Number(reponses?.champ3?.value) * num
    const partieEntiereIsOk = reponses?.champ1?.value === mfe.getPromptValue('champ1')
    if (partieEntiereIsOk && fractionIsOk) {
      result = 'OK'
    } else {
      result = 'KO'
    }
    if (!this.answers) this.answers = {}
    this.answers[`Ex${this.numeroExercice}Q${i}`] = mfe.getValue()
    mfe.setPromptState('champ2', fractionIsOk ? 'correct' : 'incorrect', true)
    mfe.setPromptState('champ3', fractionIsOk ? 'correct' : 'incorrect', true)
    mfe.setPromptState('champ1', partieEntiereIsOk ? 'correct' : 'incorrect', true)

    if (spanReponseLigne != null) {
      spanReponseLigne.innerHTML = result === 'OK' ? '😎' : '☹️'
    }
    return result
  }
}

function texFraction (a: number | string, b: number | string): string {
  return `\\dfrac{${a}}{${b}}`
}
