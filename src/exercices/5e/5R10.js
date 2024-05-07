import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureParentheseSiMoins } from '../../lib/outils/ecritures'
import { arrondi, nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.ts'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'

export const interactifReady = true

export const amcReady = true
export const amcType = 'AMCNum'
export const interactifType = 'mathLive'
export const titre = 'Trouver le terme manquant d\'une somme de nombres relatifs'

/**
 * Additions à trou dans les relatifs
 *
 *  @author Jean-Claude Lhote à partir de CM000 de Rémi Angot
 */
export const uuid = '61b4a'
export const ref = '5R10'
export const refs = {
  'fr-fr': ['5R10'],
  'fr-ch': ['9NO9-4']
}
export default function TermeInconnuDeSomme () {
  Exercice.call(this)
  this.nbQuestions = 5
  this.sup = 1
  this.sup3 = 1
  this.sup2 = 20 // additions|additions à trous|soustractions|soustractions à trous|mélange sans trou|mélange avec trou
  this.titre = titre
  this.consigne = 'Calculer le terme manquant.'
  this.spacing = 2
  this.interactif = false
  this.interactifReady = interactifReady
  this.interactifType = interactifType
  this.amcType = amcType
  this.amcReady = amcReady

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const typesDeQuestionsDisponibles = [1, 2, 3, 4]
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    let decimal
    let inconnue
    if (this.sup === 1) {
      decimal = 1
    } else {
      decimal = 10
    }
    for (let i = 0, a, b, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (!context.isAmc) {
        a = arrondi(randint(4 * decimal, this.sup2 * decimal) / decimal, 1)
        b = arrondi(randint(2 * decimal, this.sup2 * decimal) / decimal, 1)
      } else {
        a = arrondi(randint(4 * decimal, 20 * decimal) / decimal, 1)
        b = arrondi(randint(2 * decimal, 20 * decimal) / decimal, 1)
      }
      if (this.interactif) inconnue = ajouteChampTexteMathLive(this, i, 'inline largeur15 nospacebefore')
      else if (this.sup3 === 1) {
        inconnue = ' $\\ldots\\ldots$ '
      } else {
        inconnue = ` $${choice(['x', 'y', 'z', 'a', 't', 'n'])}$ `
      }

      switch (listeTypeDeQuestions[i]) {
        case 1:
          texte = `$${texNombre(a)} + $` + inconnue + `$ = ${texNombre(b)}$`
          texteCorr = `$${texNombre(a)} + ${ecritureParentheseSiMoins(texNombre(b - a))} = ${texNombre(b)}$`
          break

        case 2:
          texte = inconnue + `$ + ${texNombre(a)} = ${texNombre(b)}$`
          texteCorr = `$${ecritureParentheseSiMoins(texNombre(b - a))} + ${texNombre(a)} = ${texNombre(b)}$`
          break

        case 3:
          texte = `$${texNombre(b)} = $` + inconnue + `$ + ${texNombre(a)}$`
          texteCorr = `$${texNombre(b)}=${ecritureParentheseSiMoins(texNombre(b - a))} + ${texNombre(a)}$`
          break

        case 4:
          if (this.interactif && !context.isAmc) {
            texte = `$ ${texNombre(b)} = ${texNombre(a)} + $${ajouteChampTexteMathLive(this, i, 'inline largeur15')}`
          } else {
            texte = `$${texNombre(b)} = ${texNombre(a)} + $` + inconnue
          }
          texteCorr = `$${texNombre(b)}=${texNombre(a)} + ${ecritureParentheseSiMoins(texNombre(b - a))}$`
          break
      }
      texteCorr += `. En effet : $${texNombre(b)}-${texNombre(a)}=${texNombre(b - a)}$`

      if (this.questionJamaisPosee(i, a, b)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        setReponse(this, i, arrondi(b - a, 2), {
          signe: true,
          digits: Math.max(2, nombreDeChiffresDansLaPartieEntiere(b - a)),
          decimals: 0
        })
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, '1 : Nombres entiers\n2 : Nombres décimaux']
  this.besoinFormulaire2Numerique = ['Valeur maximale', 9999]
  this.besoinFormulaire3Numerique = ["Type d'égalités", 2, '1 : Égalités à trou\n2 : Équations']
}
