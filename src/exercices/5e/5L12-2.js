import { choice } from '../../lib/outils/arrayOutils.js'
import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import {
  calculANePlusJamaisUtiliser,
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
  randint
} from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'

export const titre = 'Réduire une expression littérale (somme et produit)'
export const interactifReady = true
export const interactifType = 'mathLive'

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
 * 5L12
 */
export const uuid = 'a8ad0'
export const ref = '5L12-2'
export default function ReduireUneExpressionLitterale () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.consigne = 'Réduire les expressions suivantes.'
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 9 // valeur maximale des coefficients
  this.sup2 = false // avec des nombres décimaux
  this.sup3 = '6-7-8-9' // Type de question

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    /*
        let listeDesProblemes = []
        if (!this.sup3 || parseInt(this.sup3) === 0) { // Si aucune liste n'est saisie ou mélange demandé
          listeDesProblemes = range1(9)
        } else {
          if (typeof (this.sup3) === 'number') { // Si c'est un nombre c'est que le nombre a été saisi dans la barre d'adresses
            listeDesProblemes[0] = contraindreValeur(0, 9, this.sup3, 1)
          } else {
            listeDesProblemes = this.sup3.split('-')// Sinon on créé un tableau à partir des valeurs séparées par des -
            for (let i = 0; i < listeDesProblemes.length; i++) { // on a un tableau avec des strings : ['1', '1', '2']
              listeDesProblemes[i] = contraindreValeur(0, 9, parseInt(listeDesProblemes[i]), 1) // parseInt en fait un tableau d'entiers
            }
          }
        }
      */
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup3,
      max: 9,
      defaut: 10,
      melange: 10,
      nbQuestions: this.nbQuestions
    })

    for (let i = 0, texte, texteCorr, reponse, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let a, b, c, d
      if (this.sup2) {
        a = calculANePlusJamaisUtiliser(randint(2, this.sup) + randint(1, 9) / 10)
        b = choice([calculANePlusJamaisUtiliser(randint(2, 9) + randint(1, 9) / 10), calculANePlusJamaisUtiliser(randint(2, 9) + randint(1, 9) / 10 + randint(1, 9) / 100)])
        c = calculANePlusJamaisUtiliser(randint(2, this.sup) + randint(1, 9) / 10)
        d = choice([calculANePlusJamaisUtiliser(randint(2, 9) + randint(1, 9) / 10), calculANePlusJamaisUtiliser(randint(2, 9) + randint(1, 9) / 10 + randint(1, 9) / 100)])
      } else {
        a = randint(2, this.sup)
        b = randint(2, this.sup)
        c = randint(2, this.sup)
        d = randint(2, this.sup)
      }
      switch (listeTypeDeQuestions[i]) {
        case 1: // ax+bx+c
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}x+${texNombre(c)}$`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a + b))}x+${texNombre(c)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}x+${texNombre(c)}`
          break
        case 2: // ax+b+x+c
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}+x+${texNombre(c)}$`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a + 1))}x+${texNombre(calculANePlusJamaisUtiliser(b + c))}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}+x+${texNombre(c)}`
          break
        case 3: // ax^2+bx+c+dx^2+x
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x^2+${texNombre(b)}x+${texNombre(c)}+${texNombre(d)}x^2+x$`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a + d))}x^2+${texNombre(calculANePlusJamaisUtiliser(b + 1))}x+${texNombre(c)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x^2+${texNombre(b)}x+${texNombre(c)}+${texNombre(d)}x^2+x`
          break
        case 4: // a+x+b+c+dx
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}+x+${texNombre(b)}+${texNombre(c)}+${texNombre(d)}x$`
          reponse = `${texNombre(1 + d)}x+${texNombre(a + b + c)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}+x+${texNombre(b)}+${texNombre(c)}+${texNombre(d)}x`
          break
        case 5: // ax+y+bx+c+dy
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+y+${texNombre(b)}x+${texNombre(c)}+${texNombre(d)}y$`
          reponse = `${texNombre(a + b)}x+${texNombre(1 + d)}y+${texNombre(c)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+y+${texNombre(b)}x+${texNombre(c)}+${texNombre(d)}y`
          break
        case 6: // ax . bx
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x\\times${texNombre(b)}x$`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a * b))}x^2`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x\\times${texNombre(b)}x`
          break
        case 7: // ax+c
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(c)}$`
          reponse = `${texNombre(a)}x+${texNombre(c)}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(c)}`
          break
        case 8: // ax . b
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x\\times${texNombre(b)}$`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a * b))}x`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x\\times${texNombre(b)}`
          break
        case 9: // ax+bx
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}x$`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a + b))}x`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}x`
          break
      }
      texteCorr += `=${miseEnEvidence(reponse)}$`
      setReponse(this, i, reponse, { formatInteractif: 'formeDeveloppeeParEE' })
      texte += ajouteChampTexteMathLive(this, i, 'inline largeur01 nospacebefore', { texteAvant: sp() + '= ' })
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Valeur maximale des coefficients', 999]
  this.besoinFormulaire2CaseACocher = ['Avec des nombres décimaux']
  this.besoinFormulaire3Texte = [
    'Type de questions', [
      '1 : ax+bx+c',
      '2 : ax+b+x+c',
      '3 : ax^2+bx+c+dx^2+x',
      '4 : a+x+b+c+dx',
      '5 : ax+y+bx+c+dy',
      '6 : ax.bx',
      '7 : ax+c',
      '8 : ax × b',
      '9 : ax+bx',
      '10 : Mélange des types de questions'
    ].join('\n')
  ]
}
