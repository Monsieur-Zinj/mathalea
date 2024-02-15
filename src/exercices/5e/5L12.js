import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { rienSi1 } from '../../lib/outils/ecritures'
import { range1 } from '../../lib/outils/nombres'
import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint, calculANePlusJamaisUtiliser } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { context } from '../../modules/context.js'

export const titre = 'Réduire une expression littérale'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDeModifImportante = '04/11/2023'

/**
* Réduire une expression
*
* * ax+bx+c
* * ax+b+x+c
* * ax^2+bx+c+dx^2+x
* * a+x+b+c+dx
* * ax+y+bx+c+dy
* * ax+b-cx
* @author Rémi Angot
*/
export const uuid = '85d2d'
export const ref = '5L12'
export const refs = {
  'fr-fr': ['5L12'],
  'fr-ch': []
}
export default function ReduireUneExpressionLitterale () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = 9 // valeur maximale des coefficients
  this.sup2 = false // avec des nombres décimaux

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    this.consigne = this.nbQuestions === 1 ? 'Réduire l\'expression suivante.' : 'Réduire les expressions suivantes.'

    const typesDeQuestionsDisponibles = range1(7)
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    const variables = ['x', 'y', 'z', 'a', 'b', 'c']

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let a, b, c, d
      this.sup = Math.max(this.sup, 2)
      const choixLettre = randint(0, variables.length - 1)
      const inc = variables[choixLettre]
      const inc2 = variables[randint(0, variables.length - 1, choixLettre)]
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
      let reponse = ''
      switch (listeTypeDeQuestions[i]) {
        case 1: // ax+bx+c
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}+${texNombre(b)}${inc}+${texNombre(c)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}+${texNombre(b)}${inc}+${texNombre(c)}=`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a + b))}${inc}+${texNombre(c)}`
          break
        case 2: // ax+b+x+c
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}+${texNombre(b)}+${inc}+${texNombre(c)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}+${texNombre(b)}+${inc}+${texNombre(c)}=`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a + 1))}${inc}+${texNombre(calculANePlusJamaisUtiliser(b + c))}`
          break
        case 3: // ax^2+bx+c+dx^2+x
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}^2+${texNombre(b)}${inc}+${texNombre(c)}+${texNombre(d)}${inc}^2+${inc}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}^2+${texNombre(b)}${inc}+${texNombre(c)}+${texNombre(d)}${inc}^2+${inc}=`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a + d))}${inc}^2+${texNombre(calculANePlusJamaisUtiliser(b + 1))}${inc}+${texNombre(c)}`
          break
        case 4: // a+x+b+c+dx
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}+${inc}+${texNombre(b)}+${texNombre(c)}+${texNombre(d)}${inc}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}+${inc}+${texNombre(b)}+${texNombre(c)}+${texNombre(d)}${inc}=`
          reponse = `${texNombre(1 + d)}${inc}+${texNombre(a + b + c)}`
          break
        case 5: // ax+y+bx+c+dy
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}+${inc2}+${texNombre(b)}${inc}+${texNombre(c)}+${texNombre(d)}${inc2}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}+${inc2}+${texNombre(b)}${inc}+${texNombre(c)}+${texNombre(d)}${inc2}=`
          reponse = `${texNombre(a + b)}${inc}+${texNombre(1 + d)}${inc2}+${texNombre(c)}`
          break
        case 6: // ax+b-cx
          if (c > a) {
            [a, c] = [c, a] // pour s'assurer que a-c est positif
          } else if (c === a) {
            a++
          }
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}+${texNombre(b)}-${texNombre(c)}${inc}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}+${texNombre(b)}-${texNombre(c)}${inc}=`
          reponse = `${rienSi1(a - c)}${inc}+${texNombre(b)}`
          break
        case 7: // ax-cx
          if (c > a) {
            [a, c] = [c, a] // pour s'assurer que a-c est positif
          } else if (c === a) {
            a++
          }
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}-${texNombre(c)}${inc}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}${inc}-${texNombre(c)}${inc}=`
          reponse = `${rienSi1(a - c)}${inc}`
          break
      }
      texteCorr += `${sp()}${miseEnEvidence(reponse)}$`
      texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', { texteAvant: `$${sp()} = $` })
      setReponse(this, i, reponse, { formatInteractif: 'formeDeveloppeeParEE' })
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: 'Réduire l\'expression ' + texte + '.',
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
  this.besoinFormulaireNumerique = ['Valeur maximale des coefficients (sup. à 1)', 999]
  this.besoinFormulaire2CaseACocher = ['Avec des nombres décimaux']
}
