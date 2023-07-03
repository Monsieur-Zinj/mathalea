import { deprecatedTexFraction } from '../../lib/outils/deprecatedFractions.js'
import Exercice from '../Exercice.js'
import {
  listeQuestionsToContenu,
  randint,
  enleveElement,
  choice,
  gestionnaireFormulaireTexte
} from '../../modules/outils.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
export const titre = 'Décomposer une fraction (partie entière + fraction inférieure à 1) puis donner l\'écriture décimale'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModificationImportante = '14/05/2023' // ajout d'un paramètre pour choisir les dénominateurs

/**
 * Décomposer une fraction (partie entière + fraction inférieure à 1) puis donner l'écriture décimale.
 * @author Rémi Angot
 * 6N20-2
 */
export const uuid = 'ab44e'
export const ref = '6N20-2'
export default function ExerciceFractionsDifferentesEcritures () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.consigne =
    "Écrire sous la forme de la somme d'un nombre entier et d'une fraction inférieure à 1 puis donner l'écriture décimale."
  this.spacing = 2
  this.spacingCorr = 2
  this.sup = false
  this.sup2 = '11'
  this.besoinFormulaireCaseACocher = ['Exercice à la carte (à paramétrer dans le formulaire suivant)', false]
  this.besoinFormulaire2Texte = ['Dénominateurs à choisir (nombres séparés par des tirets', '2: demis\n4: quarts\n5: cinquièmes\n8: huitièmes\n10: dixièmes\n11: Mélange']
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const listeDenominateurs = gestionnaireFormulaireTexte({ saisie: this.sup2, min: 2, max: 10, defaut: 11, melange: 11, nbQuestions: this.nbQuestions, exclus: [3, 6, 7, 9] })
    let fractions = []
    let fractions1 = []
    if (!this.sup) {
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
      ) // liste_fractions pour les 6 premières questions
    } else {
      const denominateursDifferents = new Set(listeDenominateurs)
      const nbDenominateursDifferents = denominateursDifferents.size
      const aleaMax = Math.ceil(this.nbQuestions / nbDenominateursDifferents)
      for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 200;) {
        const n = randint(1, aleaMax)
        const b = listeDenominateurs[i]
        const num = randint(1, b - 1)
        let partieDecimale = num * 1000 / b // avec les 8e on a 3 chiffres, avec les 4 2...
        partieDecimale = ',' + partieDecimale.toString().match(/[1-9]+/g)[0]
        const a = n * b + randint(1, b - 1)
        if (fractions.filter((element) => element[0] === a && element[1] === b).length === 0) { // la fraction n'a pas encore été construite
          fractions.push([a, b, n, partieDecimale])
          i++
        } else {
          cpt++
        }
      }
    }
    for (
      let i = 0, cpt = 0, fraction, a, ed, b, c, n, texte, texteCorr, reponse;
      i < this.nbQuestions && cpt < 100;

    ) {
      if (!this.sup) {
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
        ed = n + fraction[2]
      } else {
        a = fractions[i][0]
        b = fractions[i][1]
        n = fractions[i][2]
        c = a - n * b
        ed = fractions[i][2].toString() + fractions[i][3]
      }
      // enleveElement(fractions, fraction) // Il n'y aura pas 2 fois la même partie décimale
      texte =
        '$ ' +
        deprecatedTexFraction(a, b) +
        ' = \\phantom{0000} + ' +
        deprecatedTexFraction('\\phantom{00000000}', '') +
        ' =  $'
      texteCorr =
        '$ ' +
        deprecatedTexFraction(a, b) +
        ' = ' +
        n +
        '+' +
        deprecatedTexFraction(c, b) +
        ' = ' +
        ed +
        ' $'
      reponse = `${n}+${deprecatedTexFraction(c, b)}=${ed}`
      setReponse(this, i, reponse)
      if (this.interactif) texte = `$${deprecatedTexFraction(a, b)} = $` + ajouteChampTexteMathLive(this, i)
      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque question.
  }
}
