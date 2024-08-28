import {
  shuffle
} from '../../lib/outils/arrayOutils'
import {
  miseEnEvidence,
  texteEnCouleurEtGras
} from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import {
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
  randint
} from '../../modules/outils.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
export const titre =
  "Ranger une liste de nombres entiers dans l'ordre croissant ou décroissant"
export const dateDeModificationImportante = '28/08/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * * Ranger une liste de nombres dans l'odre croissant ou décroissant
 * * 6N11-4
 * @author Sébastien Lozano
 * Refactorisé et passé en interactif par Jean-Claude Lhote
 */

export const uuid = '3bba9'
export const ref = '6N11-4'
export const refs = {
  'fr-fr': ['6N11-4'],
  'fr-ch': ['9NO2-4']
}
// une fonction pour gérer l'ordre
function myOrdre (ordre, tab) {
  tab.sort((a, b) => a - b)
  switch (ordre) {
    case 'croissant':
      return tab
    case 'décroissant':
      return tab.reverse()
  }
}

export default function RangerOrdreCroissantDecroissant () {
  Exercice.call(this)
  this.beta = false
  this.sup = 1
  if (this.beta) {
    this.nbQuestions = 2
  } else {
    this.nbQuestions = 2
  }

  // this.consigne = `Classer les nombres suivants dans l'ordre indiqué.`;

  this.nbCols = 1
  this.nbColsCorr = 1
  // this.nbQuestionsModifiable = false;
  this.spacing = context.isHtml ? 3 : 2
  this.spacingCorr = context.isHtml ? 2.5 : 1.5

  this.nouvelleVersion = function () {
    this.reinit()
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      nbQuestions: this.nbQuestions,
      min: 1,
      max: 2,
      melange: 3,
      defaut: 3
    }) // Tous les types de questions sont posées --> à remettre comme ci-dessus

    for (
      let i = 0, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      // les chiffres
      const c1 = randint(1, 9)
      const c2 = randint(1, 9, [c1])
      const c3 = randint(1, 9, [c1, c2])
      const c4 = randint(1, 9, [c1, c2, c3])
      const c5 = randint(1, 9, [c1, c2, c3, c4])
      const croissant = listeTypeDeQuestions[i] === 1
      const ordre = croissant ? 'croissant' : 'décroissant'
      const symbole = croissant ? '~<~' : '~>~'
      const symboleCorr = miseEnEvidence(symbole)
      // pour les situations, autant de situations que de cas dans le switch !
      const n1 = Number([c1, c2, c3, c4, c5].map(String).join(''))
      const n2 = Number([c1, c3, c3, c4, c5].map(String).join(''))
      const n3 = Number([c1, c2, c5, c4, c3].map(String).join(''))
      const n4 = Number([c1, randint(0, 9), randint(0, 9), randint(0, 9)].map(String).join(''))
      const n5 = Number([1, randint(0, 9), randint(0, 9), randint(0, 9), randint(0, 9), randint(0, 9)].map(String).join(''))
      const n6 = Number([c1, c2, randint(0, 9), randint(0, 9), randint(0, 9)].map(String).join(''))
      // const enonces = []
      const nombres = shuffle([n1, n2, n3, n4, n5, n6])
      const nombresRanges = myOrdre(ordre, nombres.slice())

      // autant de case que d'elements dans le tableau des situations
      texte = `Classer les nombres suivants dans l'ordre ${ordre} :<br>$${nombres.map((nb) => texNombre(nb, 0)).join('\\text{ ; }')}$.<br>`
      texte += remplisLesBlancs(this,
        i,
        `%{champ1}${symbole}%{champ2}${symbole}%{champ3}${symbole}%{champ4}${symbole}%{champ5}${symbole}%{champ6}`,
        ` ${KeyboardType.numbersSpace}`
      )
      texteCorr = `Les nombres rangés dans l'ordre ${texteEnCouleurEtGras(ordre)} :<br>$${nombresRanges.map((nb) => texNombre(nb, 0)).join(symboleCorr)}$`
      const listeChamps = nombresRanges.map(nb => texNombre(nb, 0)).map((el, index) => [`champ${index + 1}`, { value: el }])
      const objetReponse = Object.fromEntries([...listeChamps])
      handleAnswers(this, i, objetReponse)
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
  this.besoinFormulaireTexte = [
    'Croissance',
    'Nombres séparés par des tirets\n1 : Croissant\n2 : Décroissant\n3 : Mélange'
  ]
}
