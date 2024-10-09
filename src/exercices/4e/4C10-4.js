import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../deprecatedExercice.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Quotient de deux entiers relatifs'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Effectuer une division entre 2 nombres relatifs écrite sous la forme d'une fraction.
 *
 * * On peut choisir de n'avoir que des tables de multiplication, par défaut il y a aussi des divisions simples par 2, 3 ou 4
 * @author Rémi Angot
 * 4C10-4
 */
export const uuid = 'cdcc1'
export const ref = '4C10-4'
export const refs = {
  'fr-fr': ['4C10-4'],
  'fr-ch': ['10NO5-2']
}
export default function ExerciceQuotientsRelatifs () {
  Exercice.call(this)
  this.sup = false
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.titre = titre
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.nbQuestions = 6

  this.nouvelleVersion = function () {
    const listeTypeDeQuestions = combinaisonListes(['-+', '+-', '--', '++'], this.nbQuestions)
    let typesDeNombres = combinaisonListes(['tables', 'horstables'], this.nbQuestions)
    if (this.sup) {
      typesDeNombres = combinaisonListes(['tables'], this.nbQuestions)
    }
    for (let i = 0, a, b, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) { // On limite le nombre d'essais pour chercher des valeurs nouvelles
      if (typesDeNombres[i] === 'tables') {
        b = randint(2, 9)
        a = b * randint(2, 9)
      } else {
        b = choice([11, 12, 13, 14, 15, 16, 20, 60, 80])
        a = b * randint(2, 4)
      }
      switch (listeTypeDeQuestions[i]) {
        case '-+':
          a *= -1
          break
        case '+-':
          b *= -1
          break
        case '--':
          a *= -1
          b *= -1
          break
      }
      texte = `$\\dfrac{${a}}{${b}}$`
      texteCorr = `$\\dfrac{${a}}{${b}}=${calculANePlusJamaisUtiliser(a / b)}$`
      setReponse(this, i, calculANePlusJamaisUtiliser(a / b))
      texte += ajouteChampTexteMathLive(this, i)

      if (this.questionJamaisPosee(i, a, b)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireCaseACocher = ['Utiliser seulement les tables de multiplication de 2 à 9']
}
