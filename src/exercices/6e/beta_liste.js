import Exercice from '../Exercice'
import { randint } from '../../modules/outils.js'
import { createList } from '../../lib/format/lists.ts'
import { context } from '../../modules/context.js'
export const titre = 'Somme de deux entiers'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '25/10/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '24/10/2021' // Une date de modification importante au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

export const uuid = 'fc42d'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Rémi Angot
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
  }

  nouvelleVersion () {
    const a = randint(1, 10)
    const b = randint(1, 10)
    // this.question = 'Développer les expressions suivantes :'
    // const expressions = [`$A=(${a}x + ${b})^2$`, `$B=(${a}x - ${b})^2$`, `$C=(${a}x + ${b})(${a}x - ${b})$`]
    const entreesNiveau3 = [
      'test1', 'test2', 'test3', 'test4'
    ]
    const basePourNiveau3 = {
      items: entreesNiveau3,
      style: 'puces'
    }
    const entreesNiveau2 = [
      'mon premier sous-point',
      basePourNiveau3,
      'mon deuxième sous-point'
    ]
    const basePourNiveau2 = {
      items: entreesNiveau2,
      style: 'alpha',
      classOptions: 'space-y-2 pt-2',
      introduction: 'Une sous-liste'
    }
    const entrees = [
      'mon premier point',
      'mon deuxième point',
      basePourNiveau2,
      'mon troisième point'
    ]
    const basePourListe = { items: entrees, style: 'nombres', classOptions: 'space-y-4 pt-4' }
    const maListe = context.isHtml ? createList(basePourListe).outerHTML : createList(basePourListe)
    this.question = 'Voici des points importants :'
    this.question += maListe
    this.correction = `$${a} + ${b} = ${a + b}$`
    this.reponse = a + b
  }
}
