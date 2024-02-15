import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique } from '../../lib/outils/ecritures'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, printlatex, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { context } from '../../modules/context.js'

export const titre = 'Réduire une expression de la forme $ax+bx$ '
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * Réduire des expressions de la forme ax+bx
 *
 * @author Rémi Angot
 */
export const uuid = '1bce3'
export const ref = '5L13'
export const refs = {
  'fr-fr': ['5L13'],
  'fr-ch': []
}
export default function Reductionaxbx () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup = true

  this.nouvelleVersion = function () {
    this.consigne = this.nbQuestions !== 1
      ? 'Réduire les expressions suivantes.'
      : 'Réduire l\'expression suivante.'
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const variables = ['x', 'y', 'z', 'a', 'b', 'c']

    const typesDeQuestionsDisponibles = ['ax+bx', 'ax+bx', 'ax+bx', 'ax+bx', 'ax+x']
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    for (let i = 0, texte, texteCorr, reponse, a, b, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const x = variables[randint(0, 5)]
      a = randint(-11, 11, 0)
      a = this.sup ? randint(-11, 11, 0) : randint(2, 11, 0)
      b = this.sup ? randint(-11, 11, [0, a, -a]) : randint(-a, a, 0)
      switch (listeTypeDeQuestions[i]) {
        case 'ax+bx':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*${x}+(${b}*${x})`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*${x}+(${b}*${x})`)}=(${a}${ecritureAlgebrique(b)})\\times ${x}=${printlatex(`${a + b}${x}`)}$`
          reponse = printlatex(`${a + b}${x}`)
          break
        case 'ax+x':
          texte = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*${x}+${x}`)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${printlatex(`${a}*${x}+${x}`)}=(${a}+1)\\times ${x}=${printlatex(`${a + 1}${x}`)}$`
          reponse = printlatex(`${a + 1}${x}`)
          break
      }

      setReponse(this, i, reponse, { formatInteractif: 'formeDeveloppeeParEE' })
      texte += ajouteChampTexteMathLive(this, i, 'inline nospacebefore largeur01', { texteAvant: ' $=$' })
      if (this.questionJamaisPosee(i, texte)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (context.isAmc) {
          this.autoCorrection[i] = {
            // enonce: 'Réduire l\'expression ' + '$' + texte.split('=')[1] + '.',
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

  this.besoinFormulaireCaseACocher = ['Avec des nombres relatifs']
}
