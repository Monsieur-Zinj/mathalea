import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureNombreRelatif, ecritureNombreRelatifc, ecritureParentheseSiNegatif } from '../../lib/outils/ecritures.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { propositionsQcm } from '../../lib/interactif/qcm.js'
import { context } from '../../modules/context.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions.js'
import Decimal from 'decimal.js'
import { arrondi } from '../../lib/outils/nombres'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { orangeMathalea } from 'apigeom/src/elements/defaultValues'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = ['qcm', 'mathLive']

export const titre = 'Addition de deux nombres relatifs'
export const dateDeModifImportante = '24/9/2024'

/**
 * Additionner deux relatifs inférieurs à la valeur maximale en paramètre qui est par défaut à 20.
 * Paramètre supplémentaire ; utilisation des écritures simplifiées / utilisation de nombres décimaux
 * @author Rémi Angot
 * 5R20
 */
export const uuid = 'cbc26'
export const ref = '5R20'
export const refs = {
  'fr-fr': ['5R20'],
  'fr-ch': ['9NO9-6']
}
export default class ExerciceAdditionsRelatifs extends Exercice {
  modeQcm: boolean
  constructor () {
    super()
    this.sup = 20
    this.sup4 = false // nombres décimaux
    this.consigne = 'Calculer.'
    this.spacing = 0.5
    this.modeQcm = false
    this.sup3 = false
    this.nbCols = 3
    this.nbColsCorr = 3
    this.besoinFormulaireNumerique = ['Valeur maximale', 99999]
    this.besoinFormulaire2Numerique = ['Type de questions', 3, 'Tous les nombres entre parenthèses \n2 : Seul le 2e terme négatif est entre parenthèses \n3 : Écriture simplifiée']
    this.sup2 = 1 // écriture simplifiée
    this.besoinFormulaire4CaseACocher = ['Avec des nombres décimaux']
    if (context.isHtml) this.besoinFormulaire3CaseACocher = ['QCM']
    this.comment = "Si l'option « Avec des nombres décimaux » est activée, 2 fois sur 3 les nombres auront un chiffre après la virgule et une fois sur 3 un seul terme aura deux chiffres après la virgule."
  }

  nouvelleVersion () {
    // Rétrocompatibilité avec les liens vers les exercices quand c'était des cases à cocher
    if (this.sup2 === false) {
      this.sup2 = 1
    } else if (this.sup2 === true) {
      this.sup2 = 3
    }
    this.sup = parseInt(this.sup)
    this.interactifType = this.sup3 ? 'qcm' : 'mathLive'
    const partieDecimaleAUnChiffre = combinaisonListes([true, true, false], this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let a: number
      let b: number
      let texte = ''
      let texteCorr = ''
      a = randint(1, this.sup)
      b = randint(1, this.sup)
      const k: (1 | -1)[] = choice([[-1, -1], [-1, 1], [1, -1]]) // Les deux nombres relatifs ne peuvent pas être tous les deux positifs
      a = a * k[0]
      b = b * k[1]
      if (this.sup4) {
        a = new Decimal(randint(1, this.sup * 10)).div(10).mul(k[0]).toNumber()
        if (partieDecimaleAUnChiffre[i]) {
          b = new Decimal(randint(1, this.sup * 10)).div(10).mul(k[1]).toNumber()
        } else {
          b = new Decimal(randint(1, this.sup * 100)).div(100).mul(k[1]).toNumber()
        }
        if (choice([true, false])) {
          [a, b] = [b, a]
        }
      }
      if (this.sup2 === 1) {
        texte = '$ ' + ecritureNombreRelatif(a) + ' + ' + ecritureNombreRelatif(b) + ' =$'
        texteCorr = '$ ' + ecritureNombreRelatifc(a) + ' + ' + ecritureNombreRelatifc(b) + ' = ' + ecritureNombreRelatifc(a + b, { color: orangeMathalea }) + ' $'
      } else if (this.sup2 === 2) {
        texte = `$ ${texNombre(a)} + ${ecritureParentheseSiNegatif(b)} =$`
        texteCorr = `$ ${a} + ${ecritureParentheseSiNegatif(b)} = ${miseEnEvidence(texNombre(a + b))} $`
      } else {
        texte = `$ ${texNombre(a)}${ecritureAlgebrique(b)} =$`
        texteCorr = `$ ${a}${ecritureAlgebrique(b)} = ${miseEnEvidence(texNombre(a + b))} $`
      }
      this.autoCorrection[i] = {}
      this.autoCorrection[i].options = {}
      this.autoCorrection[i].enonce = `${texte}\n`
      this.autoCorrection[i].propositions = [
        {
          texte: `$${texNombre(a + b)}$`,
          // @ts-expect-error problème typage handleAnswers
          statut: true
        },
        {
          texte: `$${texNombre(a - b)}$`,
          // @ts-expect-error problème typage handleAnswers
          statut: false
        },
        {
          texte: `$${texNombre(-a + b)}$`,
          // @ts-expect-error problème typage handleAnswers
          statut: false
        },
        {
          texte: `$${texNombre(-a - b)}$`,
          // @ts-expect-error problème typage handleAnswers
          statut: false
        }
      ]
      if (this.sup3) {
        const qcm = propositionsQcm(this, i)
        texte += qcm.texte
        if (!this.interactif) {
          texteCorr += qcm.texteCorr
        }
      } else {
        texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
        handleAnswers(this, i, { reponse: { value: (arrondi(a + b)).toString(), compare: fonctionComparaison, options: { calculSeulementEtNonOperation: true } } })
      }
      if (this.questionJamaisPosee(i, a, b)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
