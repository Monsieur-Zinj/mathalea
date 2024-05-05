import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { expressionDeveloppeeEtReduiteCompare } from '../../lib/interactif/comparisonFunctions'
export const titre = 'Encadrer un entier'
export const interactifType = 'mathLive'
export const interactifReady = true
export const dateDeModificationImportante = '16/04/2024'
/**
* * Encadrer un nombre entier par deux entier consécutifs
* * 6N11-3
* @author Sébastien Lozano
*/

export const uuid = '29b40'
export const ref = '6N11-3'
export const refs = {
  'fr-fr': ['6N11-3'],
  'fr-ch': ['9NO2-3']
}

// selon la precision on veut certains chiffres plus souvant que d'autres ...
function myNombres (nbChiffres) {
  let sortie = ''
  // on fabrique le nombre à partir de ses chiffres et on veut des cas limites
  let mu, md, mc, mmu, mmd, mmc
  const N = choice([[randint(0, 9, [0]), 0, 0, 0, 0, 0, 0, 0, 0], [randint(0, 9, [0]), 9, 9, 9, 9, 9, 9, 9, 9], [randint(0, 9, [0]), randint(0, 9), randint(0, 9), randint(0, 9), randint(0, 9), randint(0, 9), randint(0, 9), randint(0, 9), randint(0, 9)]])
  mmc = N[0]
  mmd = N[1]
  mmu = N[2]
  mc = N[3]
  md = N[4]
  mu = N[5]
  const c = N[6]
  const d = N[7]
  const u = N[8]
  switch (nbChiffres) {
    case 4:
      mu = randint(0, 9, [0])
      sortie = mu.toString() + c.toString() + d.toString() + u.toString()
      break
    case 5:
      md = randint(0, 9, [0])
      sortie = md.toString() + mu.toString() + c.toString() + d.toString() + u.toString()
      break
    case 6:
      mc = randint(0, 9, [0])
      sortie = mc.toString() + md.toString() + mu.toString() + c.toString() + d.toString() + u.toString()
      break
    case 7:
      mmu = randint(0, 9, [0])
      sortie = mmu.toString() + mc.toString() + md.toString() + mu.toString() + c.toString() + d.toString() + u.toString()
      break
    case 8:
      mmd = randint(0, 9, [0])
      sortie = mmd.toString() + mmu.toString() + mc.toString() + md.toString() + mu.toString() + c.toString() + d.toString() + u.toString()
      break
    case 9:
      mmc = randint(0, 9, [0])
      sortie = mmc.toString() + mmd.toString() + mmu.toString() + mc.toString() + md.toString() + mu.toString() + c.toString() + d.toString() + u.toString()
      break
  }
  return Number(sortie)
}

// une fonction pour les correction à la precision près
function encadrementCorr (nb, precision) {
  if (precision === 1) {
    return [Math.trunc(nb / precision) * precision - precision, Math.trunc(nb / precision) * precision + precision]
  } else if (precision === 10 || precision === 100) {
    if (nb % precision === 0) {
      return [Math.trunc(nb / precision) * precision - precision, Math.trunc(nb / precision) * precision + precision]
    } else {
      return [Math.trunc(nb / precision) * precision, Math.trunc(nb / precision) * precision + precision]
    }
  }
}
export default function EncadrerUnEntierParDeuxEntiersConsecutifs () {
  Exercice.call(this)
  this.sup = '1'
  this.sup2 = '2'
  this.nbQuestions = 3

  this.consigne = ''

  this.nbCols = 1
  this.nbColsCorr = 1
  // this.nbQuestionsModifiable = false;
  context.isHtml ? this.spacing = 3 : this.spacing = 2
  context.isHtml ? this.spacingCorr = 2.5 : this.spacingCorr = 1.5

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const nbChiffres = gestionnaireFormulaireTexte({ saisie: this.sup2, min: 1, max: 7, defaut: 3, nbQuestions: this.nbQuestions, melange: 7 })
    const typesDeQuestionsDisponibles = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 3, defaut: 1, nbQuestions: this.nbQuestions, melange: 4 })
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // pour la précision d'encadrement
      const precision = Number(listeTypeDeQuestions[i])
      const pDix = 10 ** (precision - 1)
      const nombre = myNombres(nbChiffres[i] + 3)
      // autant de case que d'elements dans le tableau des situations
      const [inf, sup] = encadrementCorr(nombre, pDix)
      switch (pDix) {
        case 1:
          texte = 'Compléter avec le nombre entier qui précède et le nombre entier qui suit :'
          break
        case 10:
          texte = 'Compléter avec le multiple de 10 qui précède et le multiple de 10 qui suit :'
          break
        case 100:
          texte = 'Compléter avec le multiple de 100 qui précède et le multiple de 100 qui suit :'
          break
      }
      texte += remplisLesBlancs(this, i, `%{champ1}<${texNombre(nombre, 0)}<%{champ2}`, 'fillInThBlank')
      texteCorr = `$${miseEnEvidence(texNombre(inf, 0))}<${texNombre(nombre, 0)}<${miseEnEvidence(texNombre(sup, 0))}$`
      handleAnswers(this, i, { champ1: { value: String(inf), compare: expressionDeveloppeeEtReduiteCompare }, champ2: { value: String(sup), compare: expressionDeveloppeeEtReduiteCompare } }, { formatInteractif: 'mathlive' })

      if (this.questionJamaisPosee(i, nombre)) { // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireTexte = ['Type de question (nombres séparés par des tirets', '1 : Encadrer entre deux entiers consécutifs\n2 : Encadrer entre deux multiples consécutifs de 10\n3 : Encadrer entre deux multiples consécutifs de 100\n4 : Mélange']
  this.besoinFormulaire2Texte = ['Difficulté (nombres séparés par des tirets)', '1 : 4 chiffres\n2 : 5 chiffres\n3 : 6 chiffres\n4 : 7 chiffres\n5 : 8 chiffres\n6 : 9 chiffres\n7 : Mélange']
}
