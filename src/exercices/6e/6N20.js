import { choice, enleveElement } from '../../lib/outils/arrayOutils'
import { deprecatedTexFraction } from '../../lib/outils/deprecatedFractions.js'
import { nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres.js'
import Exercice from '../Exercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const titre = 'Décomposer une fraction (partie entière + fraction inférieure à 1)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '14/05/2023' // ajout d'un paramètre pour choisir les dénominateurs

/**
 * @author Rémi Angot
 * 6N20
 * Relecture : Novembre 2021 par EE
 */
export const uuid = '6c8a1'
export const ref = '6N20'
export default function ExerciceFractionsDecomposer () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.consigne =
        "Écrire sous la forme de la somme d'un nombre entier et d'une fraction inférieure à 1."
  this.spacing = 2
  this.spacingCorr = 2
  this.sup = false // Donner l'écriture décimale
  this.sup2 = false
  this.sup3 = '11'
  this.besoinFormulaire2CaseACocher = ['Exercice à la carte (à paramétrer dans le formulaire suivant)', false]
  this.besoinFormulaire3Texte = ['Dénominateurs à choisir', 'Nombres séparés par des tirets\n2: demis\n4: quarts\n5: cinquièmes\n8: huitièmes\n10: dixièmes\n11: Mélange']

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const listeDenominateurs = gestionnaireFormulaireTexte({
      saisie: this.sup3,
      min: 2,
      max: 10,
      defaut: 11,
      melange: 11,
      nbQuestions: this.nbQuestions
    })
    let fractions = []
    let fractions1 = []
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
      let i = 0, fraction, a, b, c, n, texte, texteCorr, reponse;
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
        n = fractions[i][2]
        c = a - n * b
        // ed = fractions[i][2].toString() + fractions[i][3]
      }
      texte =
                '$ ' +
                deprecatedTexFraction(a, b) +
                ' = \\ldots\\ldots + ' +
                deprecatedTexFraction('\\ldots\\ldots', '\\ldots\\ldots') +
                ' $'
      texteCorr =
                '$ ' + deprecatedTexFraction(a, b) + ' = ' + n + '+' + deprecatedTexFraction(c, b) + ' $'
      reponse = `${n} + ${deprecatedTexFraction(c, b)}`

      setReponse(this, i, reponse)
      if (this.interactif) {
        texte = `$ ${deprecatedTexFraction(a, b)} = $`
        texte += ajouteChampTexteMathLive(this, i)
      }
      if (context.isAmc) {
        this.autoCorrection[i] = {
          // enonce: 'Décomposer $' + texFraction(a, b) + '$ sous forme d\'une somme d\'un entier et d\'une fraction inférieure à 1.',
          enonceAvant: false, // EE : ce champ est facultatif et permet (si false) de supprimer l'énoncé ci-dessus avant la numérotation de chaque question.
          enonceAvantUneFois: false, // EE : ce champ est facultatif et permet (si true) d'afficher l'énoncé ci-dessus une seule fois avant la numérotation de la première question de l'exercice. Ne fonctionne correctement que si l'option melange est à false.
          melange: false, // EE : ce champ est facultatif et permet (si false) de ne pas provoquer le mélange des questions.
          options: { multicols: true, barreseparation: true, numerotationEnonce: true }, // facultatif. Par défaut, multicols est à false. Ce paramètre provoque un multicolonnage (sur 2 colonnes par défaut) : pratique quand on met plusieurs AMCNum. !!! Attention, cela ne fonctionne pas, nativement, pour AMCOpen. !!!
          // barreseparation (par défaut à false) permet de mettre une barre de séparation entre les deux colonnes.
          propositions: [
            {
              type: 'AMCNum', // on donne le type de la première question-réponse qcmMono, qcmMult, AMCNum, AMCOpen
              propositions: [ // une ou plusieurs (Qcms) 'propositions'
                {
                  texte: texteCorr, // Facultatif. la proposition de Qcm ou ce qui est affiché dans le corrigé pour cette question quand ce n'est pas un Qcm
                  statut: true, // true au false pour un QCM
                  feedback: '',
                  reponse: { // utilisé si type = 'AMCNum'
                    texte: 'Décomposer $' + deprecatedTexFraction(a, b) + '$ sous forme d\'une somme d\'un entier et d\'une fraction inférieure à 1. \\\\\n \\\\\n Entier ', // facultatif
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
}
