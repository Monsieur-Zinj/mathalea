import { choice } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import {
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
  randint
} from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { context } from '../../modules/context.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Réduire et simplifier une expression littérale (somme et produit)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '22/02/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '05/11/2023'
/**
 * Réduire une expression
 *
 *    '0 : Mélange des types de questions',
 *    '1 : ax+bx+c',
 *    '2 : ax+b+x+c',
 *    '3 : ax^2+bx+c+dx^2+x',
 *    '4 : a+x+b+c+dx',
 *    '5 : ax+y+bx+c+dy',
 *    '6 : ax.bx',
 *    '7 : ax+c',
 *    '8 : ax.b',
 *    '9 : ax+bx'
 * @author Mickael Guironnet - Rémi Angot
 */
export const uuid = 'a8ad0'
export const ref = '5L12-2'
export const refs = {
  'fr-fr': ['5L12-2'],
  'fr-ch': ['10FA1-10']
}
export default function ReduireUneExpressionLitterale () {
  Exercice.call(this)
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 9 // valeur maximale des coefficients
  this.sup2 = false // avec des nombres décimaux
  this.sup3 = '6-7-8-9' // Type de question

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions === 1 ? 'Réduire et simplifier l\'expression suivante' : 'Réduire et simplifier les expressions suivantes'
    this.consigne += ', si c\'est possible.'
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup3,
      max: 9,
      defaut: 10,
      melange: 10,
      nbQuestions: this.nbQuestions
    })
    const variables = ['x', 'y', 'z', 'a', 'b', 'c']

    for (let i = 0, texte, texteCorr, reponse, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let a, b, c, d
      const choixLettre = randint(0, variables.length - 1)
      const inc = variables[choixLettre]
      const inc2 = variables[randint(0, variables.length - 1, choixLettre)]
      if (this.sup2) {
        a = randint(2, this.sup) + randint(1, 9) / 10
        b = choice([randint(2, 9) + randint(1, 9) / 10, randint(2, 9) + randint(1, 9) / 10 + randint(1, 9) / 100])
        c = randint(2, this.sup) + randint(1, 9) / 10
        d = choice([randint(2, 9) + randint(1, 9) / 10, randint(2, 9) + randint(1, 9) / 10 + randint(1, 9) / 100])
      } else {
        a = randint(2, this.sup)
        b = randint(2, this.sup)
        c = randint(2, this.sup)
        d = randint(2, this.sup)
      }
      switch (listeTypeDeQuestions[i]) {
        case 1: // ax+bx+c
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}+${texNombre(b, 2)}${inc}+${texNombre(c, 2)}$`
          reponse = `${texNombre(a + b, 2)}${inc}+${texNombre(c, 2)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}+${texNombre(b, 2)}${inc}+${texNombre(c, 2)}`
          break
        case 2: // ax+b+x+c
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}+${texNombre(b, 2)}+${inc}+${texNombre(c, 2)}$`
          reponse = `${texNombre(a + 1, 1)}${inc}+${texNombre(b + c, 2)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}+${texNombre(b, 2)}+${inc}+${texNombre(c, 2)}`
          break
        case 3: // ax^2+bx+c+dx^2+x
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}^2+${texNombre(b, 2)}${inc}+${texNombre(c, 2)}+${texNombre(d, 2)}${inc}^2+${inc}$`
          reponse = `${texNombre(a + d, 2)}${inc}^2+${texNombre(b + 1, 2)}${inc}+${texNombre(c, 2)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}^2+${texNombre(b, 2)}${inc}+${texNombre(c, 2)}+${texNombre(d, 2)}${inc}^2+${inc}`
          break
        case 4: // a+x+b+c+dx
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}+${inc}+${texNombre(b, 2)}+${texNombre(c, 2)}+${texNombre(d, 2)}${inc}$`
          reponse = `${texNombre(1 + d)}${inc}+${texNombre(a + b + c)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}+${inc}+${texNombre(b, 2)}+${texNombre(c, 2)}+${texNombre(d, 2)}${inc}`
          break
        case 5: // ax+y+bx+c+dy
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}+${inc2}+${texNombre(b, 2)}${inc}+${texNombre(c, 2)}+${texNombre(d, 2)}${inc2}$`
          reponse = `${texNombre(a + b)}${inc}+${texNombre(1 + d)}${inc2}+${texNombre(c, 2)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}+${inc2}+${texNombre(b, 2)}${inc}+${texNombre(c, 2)}+${texNombre(d, 2)}${inc2}`
          break
        case 6: // ax . bx
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}\\times${texNombre(b, 2)}${inc}$`
          reponse = `${texNombre(a * b, 3)}${inc}^2`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}\\times${texNombre(b, 2)}${inc}`
          break
        case 7: // ax+c
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}+${texNombre(c, 2)}$`
          reponse = `${texNombre(a, 1)}${inc}+${texNombre(c, 2)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}+${texNombre(c, 2)}`
          break
        case 8: // ax . b
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}\\times${texNombre(b, 2)}$`
          reponse = `${texNombre(a * b, 3)}${inc}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}\\times${texNombre(b, 2)}`
          break
        case 9: // ax+bx
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}+${texNombre(b, 2)}${inc}$`
          reponse = `${texNombre(a + b, 2)}${inc}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a, 1)}${inc}+${texNombre(b, 2)}${inc}`
          break
      }
      /* EE : Pour tests identiques seulement
      texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(3, 1)}${'y'}\\times${texNombre(2, 2)}$`
      reponse = `${texNombre(2 * 3, 3)}${'y'}`
      texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(3, 1)}${'y'}\\times${texNombre(2, 2)}`
      */
      texteCorr += `=${miseEnEvidence(reponse)}$`
      handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison } })
      texte += ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore', { texteAvant: sp() + '= ' })
      if (this.questionJamaisPosee(i, a, b, c, d)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: 'Réduire l\'expression ' + texte + '. Si ce n\'est pas possible, recopier juste l\'expression.<br>',
            propositions: [
              {
                texte: texteCorr,
                statut: 1, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                sanscadre: false, // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
                pointilles: false // EE : ce champ est facultatif et permet (si false) d'enlever les pointillés sur chaque ligne.
              }
            ]
          }
        }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Valeur maximale des coefficients', 999]
  this.besoinFormulaire2CaseACocher = ['Avec des nombres décimaux']
  this.besoinFormulaire3Texte = [
    'Type de questions ', [
      'Nombres séparés par des tirets',
      '1 : ax+bx+c',
      '2 : ax+b+x+c',
      '3 : ax^2+bx+c+dx^2+x',
      '4 : a+x+b+c+dx',
      '5 : ax+y+bx+c+dy',
      '6 : ax × bx',
      '7 : ax+c',
      '8 : ax × b',
      '9 : ax+bx',
      '10 : Mélange'
    ].join('\n')
  ]
}
