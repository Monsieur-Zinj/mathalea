import { max } from 'mathjs'
import { choice, getRandomSubarray } from '../../lib/outils/arrayOutils'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils'
import Exercice from '../Exercice'
import { lettreDepuisChiffre } from '../../lib/outils/outilString'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import FractionEtendue from '../../modules/FractionEtendue'
import MonomePlusieursVariables from '../../lib/mathFonctions/MonomePlusieursVariables'
import IdentiteRemarquable from '../../lib/mathFonctions/IdentiteRemarquable'
export const titre = 'Compléter une identité remarquable à trou'
export const dateDePublication = '11/09/2024'

/**
 * Réduire une expression littérale
 * @author Nathan Scheinmann
*/

export const uuid = '7f0cf'
export const refs = {
  'fr-fr': ['3L11-16'],
  'fr-ch': ['11FA1-13']
}

export default class nomExercice extends Exercice {
  constructor () {
    super()
    this.consigne = 'Compléter le terme manquant afin d\'obtenir une identité remarquable. Écrire ensuite l\'identité remarquable correspondante factorisée.'
    this.nbQuestions = 4
    this.besoinFormulaireTexte = ['Choix des questions', 'Nombres séparés par des tirets\n1 - (x+a)^2\n2 - (x-a)^2\n3 - (x-a)(x-b)\n4 - (x+a)(x+b)\n5 - (ax+by)^2\n6 - (ax-by)^2\n7 - (ax+by)(ax-by)\n8 - (ax+b)(ax+c)\n9 - Mélange']
    this.besoinFormulaire2Numerique = ['Coefficients', 3, 'Entiers \n2 : Fractionnaires \n3 : Mélange']
    this.besoinFormulaire3Numerique = ['Degré maximum', 5, '1\n2\n3\n4\n5']
    this.besoinFormulaire4Numerique = ['Nombre de variables différentes', 5, '1\n2\n3\n4\n5']
    // this.besoinFormulaireCaseACocher = ['Type de coefficients', 3, 'Entiers\nFractionnaires\nMélange']
    // this.besoinFormulaire5Numerique = ['Nombre de termes', 5, '1\n2\n3\n4\n5']
    this.sup = 9
    this.sup2 = 1
    this.sup3 = 2
    this.sup4 = 2
    this.listeAvecNumerotation = false
  }

  nouvelleVersion () {
    this.consigne = 'Compléter le terme manquant afin d\'obtenir une identité remarquable. Écrire ensuite l\'identité remarquable correspondante factorisée.'
    this.listeCorrections = []
    this.autoCorrection = []
    const listeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 8,
      melange: 9,
      defaut: 9,
      nbQuestions: this.nbQuestions

    })
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      const degMax = max(this.sup3, 0)
      const variables = ['x', 'y', 'z', 'r', 's', 't']
      const variablesSelect = getRandomSubarray(variables, this.sup4)
      const typeCoeffListe = ['entier', 'fractionnaire']
      let typeofCoeff = []
      let p1: MonomePlusieursVariables
      let p2: MonomePlusieursVariables
      let pSP1: MonomePlusieursVariables
      let pSP2: MonomePlusieursVariables
      p1 = new MonomePlusieursVariables(new FractionEtendue(1, 1), { variables: [], exposants: [] })
      p2 = new MonomePlusieursVariables(new FractionEtendue(1, 1), { variables: [], exposants: [] })
      pSP1 = new MonomePlusieursVariables(new FractionEtendue(1, 1), { variables: [], exposants: [] })
      pSP2 = new MonomePlusieursVariables(new FractionEtendue(1, 1), { variables: [], exposants: [] })
      if (this.sup2 === 1) {
        typeofCoeff = ['entier']
      } else if (this.sup2 === 2) {
        typeofCoeff = ['fraction']
      } else {
        typeofCoeff = typeCoeffListe
      }
      if (listeDeQuestions[i] === 1 || listeDeQuestions[i] === 2 || listeDeQuestions[i] === 3 || listeDeQuestions[i] === 4) {
        p1 = MonomePlusieursVariables.createRandomMonome(degMax, choice(typeofCoeff), variablesSelect)
        p2 = MonomePlusieursVariables.createRandomMonome(0, choice(typeofCoeff), variablesSelect)
        pSP1 = MonomePlusieursVariables.createRandomMonome(0, 'entier', variablesSelect)
        do {
          pSP2 = MonomePlusieursVariables.createRandomMonome(0, 'entier', variablesSelect)
        } while (pSP2 === pSP1 || pSP2.oppose() === pSP1)
        p1.coefficient = new FractionEtendue(1, 1)
        if (p2.coefficient.signe < 0) {
          p2 = p2.oppose()
        }
      }
      if (listeDeQuestions[i] === 5 || listeDeQuestions[i] === 6 || listeDeQuestions[i] === 7 || listeDeQuestions[i] === 8) {
        p1 = MonomePlusieursVariables.createRandomMonome(randint(1, max(1, degMax)), choice(typeofCoeff), variablesSelect)
        do {
          p2 = MonomePlusieursVariables.createRandomMonome(randint(1, max(1, degMax)), choice(typeofCoeff), variablesSelect)
        }
        while (p2.estSemblable(p1))
        pSP1 = MonomePlusieursVariables.createRandomMonome(0, 'entier', variablesSelect)
        do {
          pSP2 = MonomePlusieursVariables.createRandomMonome(0, 'entier', variablesSelect)
        } while (pSP2 === pSP1 || pSP2.oppose() === pSP1)
        // if p1 is negative, take its opposite
        if (p1.coefficient.signe < 0) {
          p1 = p1.oppose()
        }
        if (p2.coefficient.signe < 0) {
          p2 = p2.oppose()
        }
      }
      switch (listeDeQuestions[i]) {
        case 1:
        case 5:
        {
          const expr = IdentiteRemarquable.carreDuneSomme(p1, p2).melangerTermes(true)
          texte = `$${lettreDepuisChiffre(i + 1)}=${expr.toStringSansLeDernierTerme()}\\,=\\,\\ldots\\ldots$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${expr.toStringAvecDernierTermeEnEvidence()}=${miseEnEvidence(`\\left(${p1.toString()}+${p2.toString()}\\right)^2`)}$`
          break
        }
        case 2:
        case 6:
        {
          const expr = IdentiteRemarquable.carreDuneDifference(p1, p2).melangerTermes(true)
          texte = `$${lettreDepuisChiffre(i + 1)}=${expr.toStringSansLeDernierTerme()}\\,=\\,\\ldots\\ldots$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${expr.toStringAvecDernierTermeEnEvidence()}=${miseEnEvidence(`\\left(${p1.toString()}-${p2.toString()}\\right)^2`)}$`
          break
        }
        case 3:
        case 7:
        {
          const signe = ['+', '-']
          const choixSigne = randint(0, 1)
          const expr = IdentiteRemarquable.differenceDeDeuxCarres(p1, p2).melangerTermes(true)
          texte = `$${lettreDepuisChiffre(i + 1)}=${expr.toStringSansLeDernierTerme()}\\,=\\,\\ldots\\ldots$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${expr.toStringAvecDernierTermeEnEvidence()}=${miseEnEvidence(`\\left(${p1.toString()}${signe[choixSigne]} ${p2.toString()}\\right)\\left(${p1.toString()}${signe[(choixSigne + 1) % 2]}${p2.toString()}\\right)`)}$`
          break
        }
        case 4:
        case 8:
        {
          const signeT1 = pSP1.coefficient.signe < 0 ? '' : '+'
          const signeT2 = pSP2.coefficient.signe < 0 ? '' : '+'
          const expr = IdentiteRemarquable.sommeProduit(p1, pSP1, pSP2).melangerTermes(true)
          texte = `$${lettreDepuisChiffre(i + 1)}=${expr.toStringSansLeDernierTerme()}\\,=\\,\\ldots\\ldots$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${expr.toStringAvecDernierTermeEnEvidence()}=${miseEnEvidence(`\\left(${p1.toString()}${signeT1}${pSP1.toString()}\\right)\\left(${p1.toString()}${signeT2}${pSP2.toString()}\\right)`)}$`
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
