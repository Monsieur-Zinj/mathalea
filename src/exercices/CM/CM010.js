import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { range1 } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

export const titre = 'Tiers'
export const amcReady = true
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'

/**
 * Calculer le tiers d'un multiple de 3, d'un multiple de 300, d'un multiple de 30 ou d'un nombre a,b avec a et b multiples de 3
 * @author Rémi Angot
 * Référence CM010
 */
export const uuid = '6a3de'
export const ref = 'CM010'
export const refs = {
  'fr-fr': ['CM010'],
  'fr-ch': []
}
export default function Tiers () {
  Exercice.call(this)
  this.consigne = 'Calculer.'
  this.nbQuestions = 10
  this.nbCols = 2
  this.nbColsCorr = 2
  this.sup = 1 // niveau de difficulté
  this.tailleDiaporama = 3

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    const typesDeQuestionsDisponibles = range1(4)
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    for (
      let i = 0, texte, texteCorr, a, b, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      switch (listeTypeDeQuestions[i]) {
        case 1: // Table de 3
          a = randint(2, 9)
          texte = `$\\text{Le tiers de }${a * 3}$`
          texteCorr = `$\\text{Le tiers de }${a * 3} \\text{ est } ${a}$`
          setReponse(this, i, a)
          texte += ajouteChampTexteMathLive(this, i)
          break
        case 2: // Table de 300
          a = randint(2, 9)
          texte = `$\\text{Le tiers de }${texNombre(a * 3 * 100)}$`
          texteCorr = `$\\text{Le tiers de }${texNombre(
                        a * 3 * 100
                    )} \\text{ est } ${texNombre(a * 100)}$`
          setReponse(this, i, a * 100)
          texte += ajouteChampTexteMathLive(this, i)
          break
        case 3: // Table de 30
          a = randint(2, 9)
          texte = `$\\text{Le tiers de }${texNombre(a * 3 * 10)}$`
          texteCorr = `$\\text{Le tiers de }${texNombre(
                        a * 3 * 10
                    )} \\text{ est } ${texNombre(a * 10)}$`
          setReponse(this, i, a * 10)
          texte += ajouteChampTexteMathLive(this, i)
          break
        case 4: // a,b avec a et b divisibles par 3
          a = randint(2, 9)
          b = randint(2, 9)
          texte = `$\\text{Le tiers de }${texNombre(a * 3 + (b * 3) / 100)}$`
          texteCorr = `$\\text{Le tiers de }${texNombre(
                        a * 3 + (b * 3) / 100
                    )} \\text{ est } ${texNombre(a + b / 100)}$`
          setReponse(this, i, a + b / 100)
          texte += ajouteChampTexteMathLive(this, i)
          break
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  // this.besoinFormulaireNumerique = ['Niveau de difficulté',3];
}
