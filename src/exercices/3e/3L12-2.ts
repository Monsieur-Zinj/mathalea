import { max } from 'mathjs'
import PolynomePlusieursVariables from '../../lib/mathFonctions/PolynomePlusieursVariables'
import { choice, combinaisonListes, getRandomSubarray } from '../../lib/outils/arrayOutils'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils'
import Exercice from '../Exercice'
import { lettreDepuisChiffre } from '../../lib/outils/outilString'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import FractionEtendue from '../../modules/FractionEtendue'
export const titre = 'Factoriser à l\'aide de la mise en évidence'
// ou des identités remarquables'
export const dateDePublication = '10/09/2024'

/**
 * Réduire une expression littérale
 * @author Nathan Scheinmann
*/

export const uuid = 'c4b73'
export const refs = {
  'fr-fr': ['3L12-2'],
  'fr-ch': ['11FA1-12']
}

export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.consigne = this.nbQuestions > 1 ? 'Factoriser au maximum les expressions suivantes' : 'Factoriser au maximum l\'expression suivante'
    this.nbQuestions = 10
    this.besoinFormulaireTexte = ['Choix des questions', 'Nombres séparés par des tirets\n1 - Mise en évidence\n2 - Mélange']
    // this.besoinFormulaireTexte = ['Choix des questions', 'Nombres séparés par des tirets\n1 - Mise en évidence\n2 - Identité remarquable (sans somme-produit)\n3 - Mise en évidence puis identité (sans somme-produit)\n4 - Identité remarquable (somme-produit)\n5 - Mise en évidence puis identité (somme-produit)\n6 - Mélange']
    this.besoinFormulaire2Numerique = ['Degré maximum du monôme en évidence', 3, '1\n2\n3']
    this.besoinFormulaire3Numerique = ['Degré maximum du facteur restant', 5, '1\n2\n3\n4\n5']
    this.besoinFormulaire4Numerique = ['Nombre de variables différentes', 5, '1\n2\n3\n4\n5']
    this.besoinFormulaire5CaseACocher = ['Consigne avec la méthode']
    this.comment = 'Exercice en cours de développement. Les identités remarquables seront bientôt ajoutées.'
    // this.besoinFormulaireCaseACocher = ['Type de coefficients', 3, 'Entiers\nFractionnaires\nMélange']
    // this.besoinFormulaire5Numerique = ['Nombre de termes', 5, '1\n2\n3\n4\n5']
    this.sup = 1
    this.sup2 = 1
    this.sup3 = 2
    this.sup4 = 2
    this.sup5 = false
    this.listeAvecNumerotation = false
  }

  nouvelleVersion () {
    this.consigne = this.nbQuestions > 1 ? 'Factoriser au maximum les expressions suivantes' : 'Factoriser au maximum l\'expression suivante'
    if (this.sup5) {
      if (this.sup === 1) {
        this.consigne += ' en utilisant la méthode de la mise en évidence d\'un facteur commun.'
      }
      if (this.sup === 2) {
        this.consigne += ' en utilisant la méthode des identités remarquables.'
      }
      if (this.sup === 3) {
        this.consigne += ' en utilisant la méthode de la mise en évidence d\'un facteur commun ou des identités remarquables.'
      }
      if (this.sup === 4) {
        this.consigne += ' en utilisant la méthode de la mise en évidence d\'un facteur commun et des identités remarquables.'
      }
    } else {
      this.consigne += '.'
    }
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const listeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 1,
      melange: 2,
      defaut: 1,
      nbQuestions: this.nbQuestions

    })
    const degMin = 0
    const listeTypeDeQuestions = combinaisonListes(listeDeQuestions, this.nbQuestions)

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte, texteCorr: string
      texte = ''
      texteCorr = ''
      const degMax = max(this.sup3, 0)
      const variables = ['x', 'y', 'z', 'r', 's', 't']
      const variablesSelect = getRandomSubarray(variables, this.sup4)
      const typeofCoeff = ['entier']
      let p1: PolynomePlusieursVariables
      let p2: PolynomePlusieursVariables
      switch (listeTypeDeQuestions[i]) {
        case 1:{
          do {
            do {
              p1 = PolynomePlusieursVariables.createRandomPolynome(0, this.sup2, 1, choice(typeofCoeff), variablesSelect)
            }
            while (p1.toString() === '1')
            do {
              p2 = PolynomePlusieursVariables.createRandomPolynome(1, this.sup3, randint(2, 3), choice(typeofCoeff), variablesSelect)
            }
            while (p2.miseEnFacteurCommun().toString() !== '1')
          }
          while (p1.contientCarre() || p2.contientCarre())
          texte = `$${lettreDepuisChiffre(i + 1)}=${p1.produit(p2).reduire().toString()}$`
          // check if all the coefficients are negative in which case we need to add a minus sign
          let testAllNeg = true
          let testSomeNeg = false

          for (let j = 0; j < p1.produit(p2).reduire().monomes.length; j++) {
            if (p1.produit(p2).reduire().monomes[j].coefficient.num > 0) {
              testAllNeg = false
              break
            }
          }
          for (let j = 0; j < p1.produit(p2).reduire().monomes.length; j++) {
            if (p1.produit(p2).reduire().monomes[j].coefficient.num < 0) {
              testSomeNeg = true
              break
            }
          }
          const produitReduit = p1.produit(p2).reduire()
          const facteurCommun = produitReduit.miseEnFacteurCommun()
          const facteurCommunOppose = facteurCommun.oppose()
          const polynomeRestant = produitReduit.diviserParMonome(facteurCommun)
          if (testAllNeg) {
            texteCorr = `$${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(`${facteurCommunOppose.toString()}(${polynomeRestant.oppose().toString()})`)}$`
          } else if (testSomeNeg) {
            texteCorr = `$${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(`${facteurCommun.toString()}(${polynomeRestant.toString()})`)}$ ou $${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(`${facteurCommunOppose.toString()}(${polynomeRestant.oppose().toString()})`)}$`
          } else {
            texteCorr = `$${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(`${facteurCommun.toString()}(${polynomeRestant.toString()})`)}$`
          }
          break
        }
        case 2:{
          p1 = PolynomePlusieursVariables.createRandomPolynome(degMin, degMax, 2, choice(typeofCoeff), variablesSelect)
          p2 = PolynomePlusieursVariables.createRandomPolynome(degMin, degMax, 2, choice(typeofCoeff), variablesSelect, getRandomSubarray(p1.monomes, randint(1, 0)))
          // On redéfinit à présent le coefficient des monômes fractionnaires afin que toutes les fractions soient des multiples les unes des autres
          let testPremiereFraction = true
          let denominateurCommun = 1
          for (let i = 0; i < p1.monomes.length; i++) {
            if (p1.monomes[i].coefficient.den !== 1) {
              if (testPremiereFraction) {
                denominateurCommun = p1.monomes[i].coefficient.den
                testPremiereFraction = false
              } else {
                p1.monomes[i].coefficient = new FractionEtendue(randint(-10, 10, [0]), denominateurCommun * randint(-2, 2, [0]))
              }
            }
          }
          for (let i = 0; i < p2.monomes.length; i++) {
            if (p2.monomes[i].coefficient.den !== 1) {
              if (testPremiereFraction) {
                denominateurCommun = p2.monomes[i].coefficient.den
                testPremiereFraction = false
              } else {
                p2.monomes[i].coefficient = new FractionEtendue(randint(-10, 10, [0]), denominateurCommun * randint(-2, 2, [0]))
              }
            }
          }
          let p3 : PolynomePlusieursVariables
          p3 = p1
          let avecSigne = false
          if (this.sup5) {
            if (randint(0, 1) === 0) {
              p3 = p1.oppose()
              avecSigne = true
            } else {
              p3 = p1
            }
          }
          texte = `$${p3.produit(p2).miseEnFacteurCommun()}$ $p_3=${p3}, p_2=${p2}$`
          texteCorr = `$\\begin{aligned}${lettreDepuisChiffre(i + 1)}&=${avecSigne ? `\\left(${p1.oppose().toString()}\\right)\\left(${p2.toString()}\\right)\\\\&=` : ''}${p3.produit(p2).toString()}\\\\&=${miseEnEvidence(p3.produit(p2).reduire().toString())}\\end{aligned}$`
          break
        }
      }
      if (this.questionJamaisPosee(i, texte)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
