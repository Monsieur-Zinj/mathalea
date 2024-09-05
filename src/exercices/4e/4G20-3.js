import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { context } from '../../modules/context.js'
import Decimal from 'decimal.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer un carré'
export const dateDePublication = '17/01/2023'
export const dateDeModifImportante = '5/4/2024' // Refonte des cas pour n'utiliser que les 15 premiers carrés parfaits
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Calculer de carré d'un nombre
 *
 * * Entier relatif
 * * Décimal relatif
 * * Fractionnaire relatif
 * @author Sébastien LOZANO
 * Référence 4G20-3
 */

export const uuid = 'e564b'
export const ref = '4G20-3'
export const refs = {
  'fr-fr': ['4G20-3'],
  'fr-ch': ['10NO2-2']
}
export default class calculsDeCarre extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.sup = 1
    this.nbQuestions = 6
    context.isHtml ? this.spacingCorr = 2 : this.spacingCorr = 1.5
    context.isHtml ? this.spacing = 2 : this.spacing = 2
    this.consigneModifiable = false
    this.correctionDetailleeDisponible = false
    this.besoinFormulaireNumerique = ['Type de nombre', 4, ' 1: Entier naturel \n2 : Entier relatif\n3 : Nombre décimal positif \n4 : Nombre décimal relatif \n5 : Fractionnaire relatif \n6 : Mélange']
    this.comment = 'Il est possible de faire cet exercice de tête en connaissant les 15 premiers carrés parfaits.'
  }

  nouvelleVersion () {
    let typesDeQuestionsDisponibles
    switch (this.sup) {
      case 1: // entier naturel
        typesDeQuestionsDisponibles = [1]
        break
      case 2: // entier relatif
        typesDeQuestionsDisponibles = [2]
        break
      case 3: // décimal positif
        typesDeQuestionsDisponibles = [3]
        break
      case 4: // décimal relatif
        typesDeQuestionsDisponibles = [4]
        break
      case 5: // fractionnaire relatif
        typesDeQuestionsDisponibles = [5]
        break
      default:
        typesDeQuestionsDisponibles = [1, 2, 3, 4, 5]
        break
    }

    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    this.nbQuestions === 1 ? this.consigne = 'Calculer le carré du nombre suivant.' : this.consigne = 'Calculer les carrés des nombres suivants.'
    if (this.interactif) {
      this.consigne = 'Calculer'
    }

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const entier = randint(1, 15)
      const signe = randint(-1, 1, [0])
      const decimal = new Decimal(randint(1, 15)).div(10)
      const numerateur = randint(2, 9)
      let denominateur = randint(2, 9, [numerateur])
      while (denominateur % numerateur === 0 || numerateur % denominateur === 0) {
        denominateur = randint(2, 9)
      }
      switch (listeTypeDeQuestions[i]) {
        case 1: // entier naturel
          texte = this.interactif ? `$${entier}^2 =$` : `$${entier}$`
          texteCorr = signe === -1 ? `$(${entier})^2` : `$${entier}^2`
          texteCorr += `=${miseEnEvidence(entier * entier)}$`
          setReponse(this, i, entier * entier)
          break
        case 2: // entier relatif
          texte = this.interactif ? `$${signe * entier}^2=$` : `$${signe * entier}$`
          texteCorr = signe === -1 ? `$(${signe * entier})^2` : `$${signe * entier}^2`
          texteCorr += `=${miseEnEvidence(entier * entier)}$`
          setReponse(this, i, entier * entier)
          break
        case 3: // décimal positif
          texte = this.interactif ? `$${texNombre(decimal, 2)}^2=$` : `$${texNombre(decimal, 2)}$`
          texteCorr = `$${texNombre(decimal, 2)}^2`
          texteCorr += `=${miseEnEvidence(texNombre(decimal.pow(2), 2))}$`
          setReponse(this, i, decimal.pow(2))
          break
        case 4: // décimal relatif
          texte = this.interactif ? `$${texNombre(signe * decimal, 2)}^2=$` : `$${texNombre(signe * decimal, 2)}$`
          texteCorr = signe === -1 ? `$(${texNombre(signe * decimal, 2)})^2` : `$${texNombre(signe * decimal, 2)}^2`
          texteCorr += `=${miseEnEvidence(texNombre(decimal.pow(2), 2))}$`
          setReponse(this, i, decimal.pow(2))
          break
        case 5: // fractionnaire relatif
          texte = this.interactif ? `$\\left(${signe === -1 ? '-' : ''}\\dfrac{${numerateur}}{${denominateur}}\\right)^2=$` : `$${signe === -1 ? '-' : ''}\\dfrac{${numerateur}}{${denominateur}}$`
          texteCorr = signe === -1 ? `$\\left(-\\dfrac{${numerateur}}{${denominateur}}\\right)^2` : `$\\left(\\dfrac{${numerateur}}{${denominateur}}\\right)^2`
          texteCorr += `=${miseEnEvidence(`\\dfrac{${numerateur * numerateur}}{${denominateur * denominateur}}`)}$`
          setReponse(this, i, new FractionEtendue(numerateur * numerateur, denominateur * denominateur), { formatInteractif: 'fractionEgale' })
          break
      }

      if (this.questionJamaisPosee(i, texte)) {
        texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBaseAvecFraction)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
