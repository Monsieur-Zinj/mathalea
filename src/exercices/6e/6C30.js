/* eslint-disable camelcase */
import { grille, seyes } from '../../lib/2d/reperes.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { calculANePlusJamaisUtiliser, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Operation from '../../modules/operations.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Poser des multiplications de nombres décimaux'

/**
 * Multiplication de deux nombres décimaux
 *
 * * xxx * xx,x chiffres inférieurs à 5
 * * xx,x * x,x
 * * x,xx * x0x
 * * 0,xx * x,x
 * @author Rémi Angot
 * Référence 6C30
 */
export const uuid = '52939'
export const ref = '6C30'
export const refs = {
  'fr-fr': ['6C30'],
  'fr-ch': ['9NO8-8']
}
export default function MultiplierDecimaux () {
  Exercice.call(this)
  this.titre = titre
  this.consigne = 'Poser et effectuer les calculs suivants.'
  this.spacing = 2
  this.spacingCorr = 1 // Important sinon le calcul posé ne fonctionne pas avec opmul et spacing
  this.nbQuestions = 4
  this.sup = false
  this.sup2 = 3
  this.besoinFormulaire2Numerique = [
    'Type de cahier',
    3,
    ' 1 : Cahier à petits carreaux\n 2 : Cahier à gros carreaux (Seyes)\n 3 : Feuille blanche'
  ]

  this.nouvelleVersion = function () {
    this.sup2 = parseInt(this.sup2)
    const typesDeQuestionsDisponibles = [1, 2, 3, 4]
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"

    let grilletxt
    if (this.sup2 < 3) {
      const g = (this.sup2 < 3 ? grille(0, 0, 5, 8, 'gray', 0.7) : '')
      const carreaux = (this.sup2 === 2 ? seyes(0, 0, 5, 8) : '')
      const sc = (this.sup2 === 2 ? 0.8 : 0.5)
      const params = { xmin: 0, ymin: 0, xmax: 5, ymax: 8, pixelsParCm: 20, scale: sc }
      grilletxt = '<br>' + mathalea2d(params, g, carreaux)
    } else {
      grilletxt = ''
    }

    let typesDeQuestions, reponse
    for (let i = 0, texte, texteCorr, cpt = 0, a, b; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        case 1: // xxx * xx,x chiffres inférieurs à 5
          a = randint(2, 5) * 100 + randint(2, 5) * 10 + randint(2, 5)
          b = calculANePlusJamaisUtiliser(randint(2, 5) * 10 + randint(2, 5) + randint(2, 5) / 10)
          break
        case 2: // xx,x * x,x
          a = calculANePlusJamaisUtiliser(randint(2, 9) * 10 + randint(2, 9) + randint(2, 9) / 10)
          b = calculANePlusJamaisUtiliser(randint(6, 9) + randint(6, 9) / 10)
          break
        case 3: // x,xx * x0x
          a = calculANePlusJamaisUtiliser(randint(2, 9) + randint(2, 9) / 10 + randint(2, 9) / 100)
          b = calculANePlusJamaisUtiliser(randint(2, 9) * 100 + randint(2, 9))
          break
        case 4: // 0,xx * x,x
          a = calculANePlusJamaisUtiliser(randint(2, 9) / 10 + randint(2, 9) / 100)
          b = calculANePlusJamaisUtiliser(randint(2, 9) + randint(2, 9) / 10)
          break
      }

      texte = `$${texNombre(a)}\\times${texNombre(b)}$`
      texte += grilletxt
      reponse = calculANePlusJamaisUtiliser(a * b)
      texteCorr = Operation({ operande1: a, operande2: b, type: 'multiplication', style: 'display: inline' })
      texteCorr += context.isHtml ? '' : '\\hspace*{30mm}'
      texteCorr += Operation({ operande1: b, operande2: a, type: 'multiplication', style: 'display: inline' })
      if (context.isHtml && this.interactif) texte += '$~=$' + ajouteChampTexteMathLive(this, i, '')
      setReponse(this, i, reponse)
      this.autoCorrection[i].options = {
        digits: 0,
        decimals: 0,
        signe: false,
        exposantNbChiffres: 0,
        exposantSigne: false,
        approx: 0
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
