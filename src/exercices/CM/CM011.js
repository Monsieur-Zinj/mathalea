import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { range1 } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Quart'
export const amcReady = true
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'

/**
 * Calculer le quart d'un multiple de 4, d'un impair, d'un multiple de 400, d'un multiple de 40, d'un nombre a,b avec a et b multiples de 4
 * @author Rémi Angot
 * Référence CM011
 */
export const uuid = 'b434c'
export const ref = 'CM011'
export const refs = {
  'fr-fr': ['CM011'],
  'fr-ch': []
}
export default function Quart () {
  Exercice.call(this)
  this.consigne = 'Calculer.'
  this.nbQuestions = 10
  this.nbCols = 2
  this.nbColsCorr = 2
  this.tailleDiaporama = 3

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    const typesDeQuestionsDisponibles = range1(5)
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    for (
      let i = 0, texte, texteCorr, a, b, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      switch (listeTypeDeQuestions[i]) {
        case 1: // Table de 4
          a = randint(2, 9)
          texte = `$\\text{Le quart de }${a * 4}$`
          texteCorr = `$\\text{Le quart de }${a * 4} \\text{ est } ${a}$`
          setReponse(this, i, a)
          if (this.interactif) texte += ajouteChampTexteMathLive(this, i, '')
          break
        case 2: // Impair
          a = randint(2, 9)
          b = choice([1, 2, 3])
          texte = `$\\text{Le quart de }${a * 4 + b}$`
          texteCorr = `$\\text{Le quart de }${a * 4 + b
                    } \\text{ est } ${texNombre(a + b / 4)}$`
          setReponse(this, i, calculANePlusJamaisUtiliser(a + b / 4))
          if (this.interactif) texte += ajouteChampTexteMathLive(this, i, '')
          break
        case 3: // Table de 400
          a = randint(2, 9)
          texte = `$\\text{Le quart de }${texNombre(a * 4 * 100)}$`
          texteCorr = `$\\text{Le quart de }${texNombre(
                        a * 4 * 100
                    )} \\text{ est } ${texNombre(a * 100)}$`
          setReponse(this, i, a * 100)
          if (this.interactif) texte += ajouteChampTexteMathLive(this, i, '')
          break
        case 4: // Table de 40
          a = randint(2, 9)
          texte = `$\\text{Le quart de }${texNombre(a * 4 * 10)}$`
          texteCorr = `$\\text{Le quart de }${texNombre(
                        a * 4 * 10
                    )} \\text{ est } ${texNombre(a * 10)}$`
          setReponse(this, i, a * 10)
          if (this.interactif) texte += ajouteChampTexteMathLive(this, i, '')
          break
        case 5: // a,b avec a et b divisibles par 4
          a = randint(2, 9)
          b = randint(2, 9)
          texte = `$\\text{Le quart de }${texNombre(a * 4 + (b * 4) / 100)}$`
          texteCorr = `$\\text{Le quart de }${texNombre(
                        a * 4 + (b * 4) / 100
                    )} \\text{ est } ${texNombre(a + b / 100)}$`
          setReponse(this, i, calculANePlusJamaisUtiliser(a + b / 100))
          if (this.interactif) texte += ajouteChampTexteMathLive(this, i, '')
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
