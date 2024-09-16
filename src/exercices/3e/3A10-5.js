import { sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { contraindreValeur, gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { context } from '../../modules/context.js'

export const titre = 'Recourir à une décomposition en facteurs premiers dans des cas simples'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDePublication = '29/08/2022'
export const dateDeModifImportante = '16/09/2024'
/**
 *
 * Attendus de 3e : Recourir à une décomposition en facteurs premiers dans des cas simples
 * @author Eric Elter
 */

export const uuid = 'eee79'
export const ref = '3A10-5'
export const refs = {
  'fr-fr': ['3A10-5'],
  'fr-ch': ['9NO4-28']
}
export default function RecourirDecompositionFacteursPremiers () {
  Exercice.call(this)
  this.nbQuestions = 4
  this.besoinFormulaireTexte = ['Nombres premiers utilisés ', 'Nombres séparés par des tirets\n1 : 2, 3 et 5\n2 : 2, 3 et 7\n3 : 2, 5 et 7\n4 : 3, 5 et 7\n5 : Au moins un nombre premier entre 10 et 20\n6 : Mélange']
  this.besoinFormulaire2Numerique = ['Puissance la plus élevée possible (entre 2 et 5)', 3]
  this.sup = 6
  this.tailleDiaporama = 2

  function ecrireReponse (alpha, a, beta, b, gamma, c) {
    let reponse = ''
    let reponse2 = ''
    if (a !== 0) {
      reponse += `${alpha}`
      reponse2 += `${alpha}`
      if (a !== 1) {
        for (let k = 1; k < a; k++) {
          reponse += `\\times${alpha}`
        }
        reponse2 += `^${a}`
      }
    }
    if (b !== 0) {
      reponse += a === 0 ? '' : '\\times'
      reponse2 += a === 0 ? '' : '\\times'
      reponse += `${beta}`
      reponse2 += `${beta}`
      if (b !== 1) {
        for (let k = 1; k < b; k++) {
          reponse += `\\times${beta}`
        }
        reponse2 += `^${b}`
      }
    }
    if (c !== 0) {
      reponse += `\\times${gamma}`
      reponse2 += `\\times${gamma}`
      if (c !== 1) {
        for (let k = 1; k < c; k++) {
          reponse += `\\times${gamma}`
        }
        reponse2 += `^${c}`
      }
    }
    return ([reponse, reponse2])
  }

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    this.sup2 = contraindreValeur(1, 3, parseInt(this.sup2), 3)
    this.consigne = 'Décomposer en produit de facteurs premiers '
    this.consigne += (this.nbQuestions === 1 || context.isAmc) ? 'le nombre suivant.' : 'les nombres suivants.'
    if (this.interactif) this.consigne += '<br>Indiquer les facteurs par ordre croissant.'
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 5,
      melange: 6,
      defaut: 6,
      nbQuestions: this.nbQuestions
    })
    const puissanceMax = contraindreValeur(2, 5, this.sup2, 3)
    for (
      let i = 0, texte, texteCorr, facteur1, facteur2, facteurX, solution, cpt = 0, a, b, c, nbADecomposer; i < this.nbQuestions && cpt < 50;) {
      a = randint(0, puissanceMax)
      b = randint(0, puissanceMax, a)
      c = randint(0, puissanceMax, [a, b])
      switch (listeTypeDeQuestions[i]) {
        case 1: // 2, 3 et 5
          nbADecomposer = Math.pow(2, a) * Math.pow(3, b) * Math.pow(5, c)
          texte = `$${texNombre(nbADecomposer)}`
          texteCorr = texte + `${sp(2)}=${sp(1)}` + miseEnEvidence(ecrireReponse(2, a, 3, b, 5, c)[0], 'blue') + `${sp(2)}=${sp(1)}` + miseEnEvidence(ecrireReponse(2, a, 3, b, 5, c)[1]) + '$'
          texte += '$' + ajouteChampTexteMathLive(this, i, 'inline largeur25 nospacebefore', { texteAvant: `${sp(2)}=` })
          setReponse(this, i, ecrireReponse(2, a, 3, b, 5, c), { formatInteractif: 'texte' })
          break
        case 2: // 2, 3 et 7
          nbADecomposer = Math.pow(2, a) * Math.pow(3, b) * Math.pow(7, c)
          texte = `$${texNombre(nbADecomposer)}`
          texteCorr = texte + `${sp(2)}=${sp(1)}` + miseEnEvidence(ecrireReponse(2, a, 3, b, 7, c)[0], 'blue') + `${sp(2)}=${sp(1)}` + miseEnEvidence(ecrireReponse(2, a, 3, b, 7, c)[1]) + '$'
          texte += '$' + ajouteChampTexteMathLive(this, i, 'inline largeur25 nospacebefore', { texteAvant: `${sp(2)}=` })
          setReponse(this, i, ecrireReponse(2, a, 3, b, 7, c), { formatInteractif: 'texte' })
          break
        case 3: // 2, 5 et 7
          nbADecomposer = Math.pow(2, a) * Math.pow(5, b) * Math.pow(7, c)
          texte = `$${texNombre(nbADecomposer)}`
          texteCorr = texte + `${sp(2)}=${sp(1)}` + miseEnEvidence(ecrireReponse(2, a, 5, b, 7, c)[0], 'blue') + `${sp(2)}=${sp(1)}` + miseEnEvidence(ecrireReponse(2, a, 5, b, 7, c)[1]) + '$'
          texte += '$' + ajouteChampTexteMathLive(this, i, 'inline largeur25 nospacebefore', { texteAvant: `${sp(2)}=` })
          setReponse(this, i, ecrireReponse(2, a, 5, b, 7, c), { formatInteractif: 'texte' })
          break
        case 4: // 3, 5 et 7
          nbADecomposer = Math.pow(3, a) * Math.pow(5, b) * Math.pow(7, c)
          texte = `$${texNombre(nbADecomposer)}`
          texteCorr = texte + `${sp(2)}=${sp(1)}` + miseEnEvidence(ecrireReponse(3, a, 5, b, 7, c)[0], 'blue') + `${sp(2)}=${sp(1)}` + miseEnEvidence(ecrireReponse(3, a, 5, b, 7, c)[1]) + '$'
          texte += '$' + ajouteChampTexteMathLive(this, i, 'inline largeur25 nospacebefore', { texteAvant: `${sp(2)}=` })
          setReponse(this, i, ecrireReponse(3, a, 5, b, 7, c), { formatInteractif: 'texte' })
          break
        case 5: // 11, 13, 17 ou 19 et deux autres facteurs parmi 2, 3 et 5
          facteur1 = choice([2, 3, 5])
          facteur2 = choice([2, 3, 5], [facteur1])
          if (facteur1 > facteur2) {
            facteurX = facteur1
            facteur1 = facteur2
            facteur2 = facteurX
          }
          facteurX = choice([11, 13, 17, 19])
          nbADecomposer = Math.pow(facteurX, 1) * Math.pow(facteur1, b) * Math.pow(facteur2, c)
          texte = `$${texNombre(nbADecomposer)}`
          solution = ecrireReponse(facteur1, b, facteur2, c, facteurX, 1)
          texteCorr = texte + `${sp(2)}=${sp(1)}` + miseEnEvidence(solution[0], 'blue') + `${sp(2)}=${sp(1)}` + miseEnEvidence(solution[1]) + '$'
          texte += '$' + ajouteChampTexteMathLive(this, i, 'inline largeur25 nospacebefore', { texteAvant: `${sp(2)}=` })
          setReponse(this, i, solution, { formatInteractif: 'texte' })
          break
      }
      if (this.questionJamaisPosee(i, a, b, c)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: this.consigne.substring(0, this.consigne.length - 1) + ' : ' + texte + '.<br>',
            propositions: [{ texte: texteCorr, statut: 1, feedback: '', sanscadre: false, pointilles: false }]
          }
        }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
