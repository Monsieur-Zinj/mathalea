import { combinaisonListes, shuffle } from '../../lib/outils/arrayOutils.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { choixDeroulant } from '../../lib/interactif/questionListeDeroulante.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements.js'

export const titre = 'Associer puissances de 10 et préfixes'
export const interactifReady = true
export const interactifType = 'listeDeroulante'
export const dateDePublication = '12/04/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Associer une puissance de 10 à un préfixe
 * @author Rémi Angot
 */
export const uuid = 'b0b3c'
export const ref = '4C30-4'
export default class PuissancesEtPrefixe extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 5
    this.nbCols = 2
    this.nbColsCorr = 1
    this.sup = 1
    this.besoinFormulaireNumerique = ['Type de questions', 2, '1: De la puissance de 10 au préfixe\n2: Du préfixe à la puissance de 10']
  }

  nouvelleVersion () {
    this.interactifType = (this.sup === 1) ? 'listeDeroulante' : 'mathLive'
    this.consigne = (this.sup === 1) ? 'Compléter avec le préfixe correspondant.' : 'Compléter avec la puissance de 10 correspondant à ce préfixe.'
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const exposants = [[-9, 'nano', 'un milliardième'], [-6, 'micro', 'un millionième'], [-3, 'milli', 'un millième'], [-2, 'centi', 'un centième'], [-1, 'déci', 'un dixième'], [1, 'déca', 'dix'], [2, 'hecto', 'cent'], [3, 'kilo', 'mille'], [6, 'méga', 'un-million'], [9, 'giga', 'un-milliard'], [12, 'téra', 'mille-milliards']]
    const listeExposants = combinaisonListes(exposants, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const exposant = listeExposants[i][0]
      const prefixe = listeExposants[i][1]
      const description = listeExposants[i][2]
      if (this.sup === 1) {
        texte = `$10^{${exposant}}$` + choixDeroulant(this, i, 0, shuffle(['nano', 'micro', 'milli', 'centi', 'déci', 'déca', 'hecto', 'kilo', 'Mega', 'Giga', 'Tera']), 'une réponse')
        setReponse(this, i, prefixe)
        texteCorr = `$10^{${exposant}}$, c'est ${description} donc le préfixe correspondant est ${texteEnCouleurEtGras(prefixe)}.`
      } else {
        texte = `${prefixe}` + ajouteChampTexteMathLive(this, i, 'texte')
        if (exposant !== 1) setReponse(this, i, `10^{${exposant}}`)
        else setReponse(this, i, ['10^{1}', '10'])

        texteCorr = `Le préfixe ${prefixe} est associé à ${description}, soit $${miseEnEvidence(`10^{${exposant}}`)}$.`
      }
      if (this.questionJamaisPosee(i, exposant)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
