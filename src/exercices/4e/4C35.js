import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { puissanceEnProduit } from '../../lib/outils/puissance'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { context } from '../../modules/context.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Transformer une écriture de puissance en écriture décimale ou fractionnaire'

export const dateDePublication = '14/06/2022'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * @author Rémi Angot
 */
export const uuid = '125bd'
export const ref = '4C35'
export const refs = {
  'fr-fr': ['4C35'],
  'fr-ch': ['10NO2-12']
}
export default function PuissanceDecimaleOuFractionnaire () {
  Exercice.call(this)
  this.consigne = 'Calculer de tête l\'écriture décimale ou fractionnaire des nombres suivants.'
  this.nbQuestions = 8
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = false
  this.besoinFormulaireCaseACocher = ['Avec des nombres négatifs']
  this.besoinFormulaire2CaseACocher = ['Avec que des exposants positifs (incontournable pour AMC)']

  this.nouvelleVersion = () => {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const typeQuestionsDisponibles = ['puissancePos', 'puissanceNeg', 'negPuissancePaire', 'negPuissanceImpaire', 'negParenthesePuissancePaire', 'negParenthesePuissanceImpaire', 'puissance0', 'puissance1', 'negParenthesePuissancePaireNeg', 'negParenthesePuissanceImpaireNeg'] // On créé 3 types de questions
    const typesDeQuestions = this.sup2 || context.isAmc // Ici on ne prends que les exposants positifs pour ne pas influencer par le format de réponse AMC
      ? ['puissance0', 'puissance1', 'puissancePos', 'puissancePos', 'puissancePos', 'puissancePos']
      : this.sup
        ? typeQuestionsDisponibles
        : ['puissance0', 'puissance1', 'puissancePos', 'puissanceNeg', 'puissancePos', 'puissanceNeg', 'puissancePos', 'puissanceNeg', 'puissancePos', 'puissanceNeg']
    const listeTypeQuestions = combinaisonListes(typesDeQuestions, this.nbQuestions)
    let texte/** string */, texteCorr
    /** string */
    let a /** number */, n /** number */, reponse/** any */
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (listeTypeQuestions[i]) {
        case 'puissancePos':
          a = choice([2, 3, randint(4, 9)])
          n = (a === 2) ? randint(2, 8) : (a < 4) ? randint(2, 3) : 2
          texte = `$${a}^{${n}} = $`
          texteCorr = `$${a}^{${n}} = ${puissanceEnProduit(a, n)} = ${a ** n}$`
          reponse = new FractionEtendue(a ** n)
          break
        case 'puissanceNeg':
          a = choice([2, 3, randint(4, 9)])
          n = (a === 2) ? randint(2, 8) : (a < 4) ? randint(2, 3) : 2
          texte = `$${a}^{${-n}} = $`
          texteCorr = `$${a}^{${-n}} =  \\dfrac{1}{${a}^{${n}}} = ${puissanceEnProduit(a, -n)} = \\dfrac{1}{${a ** n}}$`
          reponse = new FractionEtendue(1, a ** n)
          break
        case 'negPuissancePaire':
          a = choice([2, 3, randint(4, 9)])
          n = (a === 2) ? choice([2, 4, 6, 8]) : 2
          texte = `$${-a}^{${n}} = $`
          texteCorr = `$${-a}^{${n}} = - (${puissanceEnProduit(a, n)}) = - ${a ** n}$`
          reponse = new FractionEtendue(-(a ** n))
          break
        case 'negPuissanceImpaire':
          a = 2
          n = choice([3, 5, 7])
          texte = `$${-a}^{${n}} = $`
          texteCorr = `$${-a}^{${n}} = -(${puissanceEnProduit(a, n)}) = - ${a ** n}$`
          reponse = new FractionEtendue(-(a ** n))
          break
        case 'negParenthesePuissancePaire':
          a = choice([2, 3, randint(4, 9)])
          n = (a === 2) ? choice([2, 4, 6, 8]) : 2
          texte = `$(${-a})^{${n}} = $`
          texteCorr = `$(${-a})^{${n}} = ${puissanceEnProduit(-a, n)} = ${a ** n}$`
          reponse = new FractionEtendue(a ** n)
          break
        case 'negParenthesePuissanceImpaire':
          a = choice([2, 3, randint(4, 5)])
          n = (a === 2) ? choice([3, 5, 7, 9]) : 3
          texte = `$(${-a})^{${n}} = $`
          texteCorr = `$(${-a})^{${n}} = ${puissanceEnProduit(-a, n)} = -${a ** n}$`
          reponse = new FractionEtendue(-(a ** n))
          break
        case 'puissance0':
          a = randint(11, 40)
          if (this.sup) a *= choice([-1, 1])
          n = 0
          texte = `$${a}^{${n}} = $`
          if (a > 0) {
            texteCorr = `$${a}^{${n}} = 1$`
            reponse = new FractionEtendue(1)
          } else {
            texteCorr = `$${a}^{${n}} = -1$`
            reponse = new FractionEtendue(-1)
          }
          break
        case 'puissance1':
          a = randint(11, 40)
          if (this.sup) a *= choice([-1, 1])
          n = 1
          texte = `$${a}^{${n}} = $`
          texteCorr = `$${a}^{${n}} = ${a}$`
          reponse = new FractionEtendue(a)
          break
        case 'negParenthesePuissancePaireNeg':
          a = choice([2, 3, randint(4, 9)])
          n = (a === 2) ? choice([2, 4, 6, 8]) : 2
          texte = `$(${-a})^{${-n}} = $`
          texteCorr = `$(${-a})^{${-n}} = ${puissanceEnProduit(-a, -n)} = \\dfrac{1}{${a ** n}}$`
          reponse = new FractionEtendue(1, a ** n)
          break
        case 'negParenthesePuissanceImpaireNeg':
          a = choice([2, 3, randint(4, 5)])
          n = (a === 2) ? choice([3, 5, 7, 9]) : 3
          texte = `$(${-a})^{${-n}} = $`
          texteCorr = `$(${-a})^{${-n}} = ${puissanceEnProduit(-a, -n)} = \\dfrac{-1}{${a ** n}}$`
          reponse = new FractionEtendue(-1, a ** n)
          break
        default :
          texte = 'Cas non traité'
          texteCorr = 'Cas non traité'
      }
      if (!context.isAmc) setReponse(this, i, reponse, { formatInteractif: 'fractionEgale' })
      else setReponse(this, i, Number(reponse), { formatInteractif: 'calcul' })

      // Uniformisation : Mise en place de la réponse attendue en interactif en orange et gras

      const textCorrSplit = texteCorr.split('=')
      let aRemplacer = textCorrSplit[textCorrSplit.length - 1]
      aRemplacer = aRemplacer.replace('$', '').replace('<br>', '')

      texteCorr = ''
      for (let ee = 0; ee < textCorrSplit.length - 1; ee++) {
        texteCorr += textCorrSplit[ee] + '='
      }
      texteCorr += `$ $${miseEnEvidence(aRemplacer)}$`

      // Fin de cette uniformisation

      texte += ajouteChampTexteMathLive(this, i)
      if (this.questionJamaisPosee(i, a, n, listeTypeQuestions[i])) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }
}
