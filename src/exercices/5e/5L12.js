import { choice, combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { rienSi1 } from '../../lib/outils/ecritures.js'
import { range1 } from '../../lib/outils/nombres.js'
import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint, calculANePlusJamaisUtiliser } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'

export const titre = 'Réduire une expression littérale'
export const interactifReady = true
export const interactifType = 'mathLive'
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

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let a, b, c, d
      this.sup = Math.max(this.sup, 2)
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
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}x+${texNombre(c)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}x+${texNombre(c)}=$`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a + b))}x+${texNombre(c)}`
          break
        case 2: // ax+b+x+c
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}+x+${texNombre(c)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}+x+${texNombre(c)}=$`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a + 1))}x+${texNombre(calculANePlusJamaisUtiliser(b + c))}`
          break
        case 3: // ax^2+bx+c+dx^2+x
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x^2+${texNombre(b)}x+${texNombre(c)}+${texNombre(d)}x^2+x$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x^2+${texNombre(b)}x+${texNombre(c)}+${texNombre(d)}x^2+x=$`
          reponse = `${texNombre(calculANePlusJamaisUtiliser(a + d))}x^2+${texNombre(calculANePlusJamaisUtiliser(b + 1))}x+${texNombre(c)}`
          break
        case 4: // a+x+b+c+dx
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}+x+${texNombre(b)}+${texNombre(c)}+${texNombre(d)}x$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}+x+${texNombre(b)}+${texNombre(c)}+${texNombre(d)}x=$`
          reponse = `${texNombre(1 + d)}x+${texNombre(a + b + c)}`
          break
        case 5: // ax+y+bx+c+dy
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+y+${texNombre(b)}x+${texNombre(c)}+${texNombre(d)}y$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+y+${texNombre(b)}x+${texNombre(c)}+${texNombre(d)}y=$`
          reponse = `${texNombre(a + b)}x+${texNombre(1 + d)}y+${texNombre(c)}`
          break
        case 6: // ax+b-cx
          if (c > a) {
            [a, c] = [c, a] // pour s'assurer que a-c est positif
          } else if (c === a) {
            a++
          }
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}-${texNombre(c)}x$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x+${texNombre(b)}-${texNombre(c)}x=$`
          reponse = `${rienSi1(a - c)}x+${texNombre(b)}`
          break
        case 7: // ax-cx
          if (c > a) {
            [a, c] = [c, a] // pour s'assurer que a-c est positif
          } else if (c === a) {
            a++
          }
          texte = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x-${texNombre(c)}x$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${texNombre(a)}x-${texNombre(c)}x=$`
          reponse = `${rienSi1(a - c)}x`
          break
      }
      texteCorr += `$${sp()}${miseEnEvidence(reponse)}$`
      texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline nospacebefore', { texteAvant: `$${sp()} = $` })
      setReponse(this, i, reponse, { formatInteractif: 'formeDeveloppeeParEE' })
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Valeur maximale des coefficients (sup. à 1)', 999]
  this.besoinFormulaire2CaseACocher = ['Avec des nombres décimaux']
}
