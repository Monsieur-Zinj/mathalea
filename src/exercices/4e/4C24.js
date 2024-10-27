import { choice } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu } from '../../modules/outils.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { context } from '../../modules/context.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Simplifier des fractions à l\'aide des nombres premiers'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

export const dateDePublication = '17/03/2022'
export const dateDeModifImportante = '03/10/2023'

/**
 * @author Guillaume Valmont (amendée par Eric Elter pour this.sup2 et une version 3e)
 * Référence 4C24
 */
export const uuid = '612b9'
export const ref = '4C24'
export const refs = {
  'fr-fr': ['4C24'],
  'fr-ch': ['9NO12-9']
}
export default function SimplifierFractions () {
  Exercice.call(this)
  this.consigne = 'Simplifier le plus possible les fractions suivantes.'
  this.nbQuestions = 5

  // this.besoinFormulaireNumerique = ['Nombre de facteurs communs', 3, '1, 2 ou 3']
  this.besoinFormulaireTexte = ['Nombre maximum de facteurs communs', '1, 2, 3 ou 4']
  // this.besoinFormulaire2Numerique = ['Facteurs premiers utilisés', 2, '1 : De 2 à 7\n2 : De 2 à 23']
  this.besoinFormulaire2Texte = ['Choix des facteurs premiers utilisés', 'Nombres séparés par des tirets.\nChoisir valeur entre 2 et 23.']
  this.sup = 2
  this.sup2 = '2-3-5-7'
  this.sup3 = 2
  this.nbCols = 2
  this.nbColsCorr = 2
  this.tailleDiaporama = 3
  this.video = ''

  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    if (this.nbQuestions === 1) {
      this.consigne = 'Simplifier le plus possible la fraction suivante.'
    }
    const listeFacteursPremiers = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 2,
      max: 23,
      defaut: 11,
      melange: 24,
      nbQuestions: this.nbQuestions,
      exclus: [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22]
    })
    const nbFacteursCommuns = gestionnaireFormulaireTexte({
      saisie: this.sup,
      max: 4,
      defaut: 1,
      nbQuestions: 1
    })
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      /* let facteurCommun1 = this.sup2 !== 1 ? choice([2, 3, 5, 11, 13, 17, 19]) : choice([2, 3, 5])
      let facteurCommun2 = this.sup2 !== 1 ? choice([2, 3, 5, 11, 13, 17, 19]) : choice([2, 3, 5])
      let facteurCommun3 = this.sup2 !== 1 ? choice([2, 3, 5, 11, 13, 17, 19]) : choice([2, 3, 5])
      let facteurSurprise = this.sup2 !== 1 ? choice([2, 3, 5, 11, 13, 17, 19, 23]) : choice([2, 3, 5, 7])
      let facteurNumerateur = this.sup2 !== 1 ? choice([2, 3, 5, 11, 13, 17, 19, 23]) : choice([2, 3, 5, 7])
      let facteurDenominateur = this.sup2 !== 1 ? choice([2, 3, 5, 11, 13, 17, 19, 23]) : choice([2, 3, 5, 7]) */
      let facteurCommun1 = choice(listeFacteursPremiers)
      let facteurCommun2 = choice(listeFacteursPremiers)
      let facteurCommun3 = choice(listeFacteursPremiers)
      const facteurSurprise = choice(listeFacteursPremiers)
      const facteurDenominateur = choice(listeFacteursPremiers)
      const facteurNumerateur = choice(listeFacteursPremiers)
      let numerateur, denominateur
      if (nbFacteursCommuns[0] - 1 < 3) facteurCommun3 = 1
      if (nbFacteursCommuns[0] - 1 < 2) facteurCommun2 = 1
      if (nbFacteursCommuns[0] - 1 < 1) facteurCommun1 = 1
      numerateur = facteurNumerateur * facteurCommun1 * facteurCommun2 * facteurCommun3
      denominateur = facteurDenominateur * facteurCommun1 * facteurCommun2 * facteurCommun3
      if (numerateur === denominateur) numerateur = numerateur * facteurCommun1
      /* while (numerateur === denominateur) {
        facteurNumerateur = this.sup2 !== 1 ? choice([2, 3, 5, 11, 13, 17, 19, 23]) : choice([2, 3, 5, 7])
        numerateur = facteurNumerateur * facteurCommun1 * facteurCommun2 * facteurCommun3
      } */
      const surprise = choice(['numerateur', 'denominateur', 'aucun'])
      switch (surprise) {
        case 'numerateur':
          if (numerateur * facteurSurprise !== denominateur) numerateur = numerateur * facteurSurprise
          break
        case 'denominateur':
          if (denominateur * facteurSurprise !== numerateur) denominateur = denominateur * facteurSurprise
          break
      }
      const f = new FractionEtendue(numerateur, denominateur)
      texte = `$${f.texFraction}$${ajouteChampTexteMathLive(this, i, ' ', { texteAvant: ' =' })}`
      texteCorr = `$${f.texFraction}${f.texSimplificationAvecEtapes(true, '#f15929')}$`
      handleAnswers(this, i, { reponse: { value: f.simplifie().toLatex(), compare: fonctionComparaison, options: { fractionIrreductible: true } } })

      if (context.isAmc) {
        if (this.sup3 === 1) {
          this.autoCorrection[i] = {
            enonce: '',
            enonceAvant: false,
            propositions: [
              {
                type: 'AMCOpen',
                propositions: [{
                  enonce: 'Rendre irréductible la fraction ' + texte + '.<br>La rédaction sera évaluée plus que le résultat en lui-même.',
                  texte: texteCorr,
                  statut: 3, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                  sanscadre: false, // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
                  pointilles: false // EE : ce champ est facultatif et permet (si false) d'enlever les pointillés sur chaque ligne.
                }]
              }
            ]
          }
        } else {
          this.autoCorrection[i] = {
            enonce: '',
            enonceAvant: false,
            propositions: [
              {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: 'Rendre irréductible la fraction ' + texte + '.',
                    valeur: [f.simplifie()],
                    param: {
                      digits: 2,
                      decimals: 0,
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              }
            ]
          }
        }
      }
      if (this.questionJamaisPosee(i, numerateur, denominateur)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }

    listeQuestionsToContenu(this)
  }
  this.besoinFormulaire3Numerique = ['Type de réponses AMC', 2, '1 : Question ouverte\n2 : Réponse numérique']
}
