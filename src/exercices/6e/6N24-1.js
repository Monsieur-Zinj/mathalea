import { choice } from '../../lib/outils/arrayOutils'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint, calculANePlusJamaisUtiliser } from '../../modules/outils.js'

export const titre = 'Multiplier ou diviser un nombre entier par 10, 100 ou 1 000'

/**
 * Multiplier ou diviser un nombre entier par 10, 100 ou 1 000
 *
 * Le nombre entier est de la forme X, XX, X0X, X00X ou XXX
 * @author Rémi Angot
 * 6N24-1
 */
export const uuid = 'ec005'
export const ref = '6N24-1'
export const refs = {
  'fr-fr': ['6N24-1'],
  'fr-ch': ['9NO10-5']
}
export default function ExerciceMultiplierOuDiviserUnNombreEntierPar101001000 () {
  Exercice.call(this)
  this.consigne = "Donner l'écriture décimale."
  this.spacing = 2
  this.spacingCorr = 2

  this.nouvelleVersion = function () {
    for (
      let i = 0, a, b, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;

    ) {
      a = choice(
        [
          randint(2, 9),
          randint(11, 99),
          randint(1, 9) * 100 + randint(1, 9),
          randint(1, 9) * 1000 + randint(1, 9)
        ],
        randint(101, 999)
      )
      // X, XX, X0X, X00X,XXX
      b = choice([10, 100, 1000])
      if (choice([true, false])) {
        texte =
          '$ ' + texFractionFromString(texNombre(a), texNombre(b)) + ' =  $'
        texteCorr =
          '$ ' +
          texFractionFromString(texNombre(a), texNombre(b)) +
          ' = ' +
          texNombre(calculANePlusJamaisUtiliser(a / b)) +
          ' $'
      } else {
        texte =
          '$ ' + texNombre(a) + '\\times' + texNombre(b) + ' =  $'
        texteCorr =
          '$ ' +
          texNombre(a) +
          '\\times' +
          texNombre(b) +
          ' = ' +
          texNombre(calculANePlusJamaisUtiliser(a * b)) +
          ' $'
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
}
