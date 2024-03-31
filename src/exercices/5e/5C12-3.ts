import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteFeedback, remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { context } from '../../modules/context.js'
import { ComputeEngine } from '@cortex-js/compute-engine'
import type { MathfieldElement } from 'mathlive'

export const titre = 'Utiliser la distributivité pour du calcul mental'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCHybride'
const ce = new ComputeEngine()
export const dateDePublication = '26/11/2022'
export const dateDeModifImportante = '18/11/2023'
// Modif EE : Passage en interactif donc passage en TS
/**
 * Distributivité numérique
 * @author Sébastien LOZANO
*/

export const uuid = '9103e'
export const ref = '5C12-3'
export const refs = {
  'fr-fr': ['5C12-3'],
  'fr-ch': ['11FA2-1']
}

class DistributiviteNumerique extends Exercice {
  rep1: number[] = []
  rep2: number[] = []
  rep3: number[] = []
  rep4: number[] = []
  rep5: number[] = []
  typeQuestion: (1 | 2)[] = []
  exoCustomResultat: boolean
  constructor () {
    super()
    this.exoCustomResultat = true
    this.nbQuestions = 4 // Ici le nombre de questions
    this.sup = 3
    this.besoinFormulaireNumerique = ['Type des questions', 3, '1 : Sous forme développée\n2 : Sous forme factorisée\n3 : Mélange']
  }

  nouvelleVersion () {
    this.listeQuestions = [] // tableau contenant la liste des questions
    this.listeCorrections = []
    const typesDeQuestionsDisponibles = this.sup === 3 ? [1, 2, 3, 4] : this.sup === 2 ? [3, 4] : [1, 2]
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    this.consigne = 'Utiliser la distributivité pour calculer de façon astucieuse '
    const consigneAMC = this.consigne + 'l\'expression suivante : '
    this.consigne += this.nbQuestions === 1 ? 'l\'expression suivante.' : 'les expressions suivantes.'

    // Quelques fonctions pour factoriser le code
    function avecLesPriorites (i:number, k:number, b:number, c:number, formeInitiale:string, operation:number) {
      let sortie:[string, number, number, number, number, number] = ['', 0, 0, 0, 0, 0]
      if (formeInitiale === 'factorisee') {
        sortie = [`
        $\\textbf{Ici, il est plus judicieux de distribuer d'abord :}$<br>
        $${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(String(k))}\\times ${operation === 1 ? texNombre(b + c, 0) : texNombre(b - c, 0)}$<br>
        $${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(String(k))}\\times (${texNombre(b, 0)} ${operation === 1 ? `+ ${texNombre(c, 0)}` : `- ${texNombre(c, 0)}`})$<br>
        $${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(String(k))}\\times ${texNombre(b, 0)} ${operation === 1 ? '+' : '-'} ${miseEnEvidence(String(k))}\\times ${texNombre(c, 0)}$<br>
        $${lettreDepuisChiffre(i + 1)}=${texNombre(k * b, 0)} ${operation === 1 ? '+' : '-'} ${texNombre(k * c, 0)}$<br>
        $${lettreDepuisChiffre(i + 1)}=${operation === 1 ? texNombre(k * b + k * c, 0) : texNombre(k * b - k * c, 0)}$
        `,
        b,
        c,
        k * b,
        k * c,
        operation === 1 ? k * b + k * c : k * b - k * c
        ]
      } else {
        sortie = [`
        $\\textbf{Ici, il est plus judicieux de factoriser d'abord :}$<br>
        $${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(String(k))}\\times ${texNombre(b, 0)} ${operation === 1 ? '+' : '-'} ${miseEnEvidence(String(k))}\\times ${texNombre(c, 0)}$<br>
        $${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(String(k))}\\times (${texNombre(b, 0)} ${operation === 1 ? `+ ${texNombre(c, 0)}` : `- ${texNombre(c, 0)}`})$<br>
        $${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(String(k))}\\times ${operation === 1 ? texNombre(b + c, 0) : texNombre(b - c, 0)}$<br>
        $${lettreDepuisChiffre(i + 1)}=${operation === 1 ? texNombre(k * (b + c), 0) : texNombre(k * (b - c), 0)}$
        `,
        b,
        c,
        operation === 1 ? b + c : b - c,
        operation === 1 ? k * (b + c) : k * (b - c),
        0]
      }
      return sortie
    }

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = '' // Nous utilisons souvent cette variable pour construire le texte de la question.
      let texteCorr = '' // Idem pour le texte de la correction.
      // Choix des paramètres aléatoires
      let k = 0
      let b, c
      let cinqChamps: boolean = false
      let correctionTableau:[string, number, number, number, number, number] = ['', 0, 0, 0, 0, 0]
      const puissance = [100, 1000]
      const ajoutRetrait = randint(1, 3)
      switch (listeTypeDeQuestions[i]) { // Chaque question peut être d'un type différent, ici 4 cas sont prévus...
        case 1: { // Calcul mental addition developpée initialement
          k = randint(47, 83)
          const choixIndicePuissance = randint(0, 1)
          c = ajoutRetrait
          b = puissance[choixIndicePuissance] - c
          texte = `$${lettreDepuisChiffre(i + 1)}=${k}\\times ${texNombre(b, 0)} + ${k}\\times ${c}$`
          correctionTableau = avecLesPriorites(i, k, b, c, 'developpee', 1)
          cinqChamps = false
          this.typeQuestion[i] = 2
          break
        }
        case 2: { // Calcul mental soustraction  developpée initialement
          k = randint(47, 83)
          const choixIndicePuissance = randint(0, 1)
          c = ajoutRetrait
          b = puissance[choixIndicePuissance] + c
          texte = `$${lettreDepuisChiffre(i + 1)}=${k}\\times ${texNombre(b, 0)} - ${k}\\times ${c}$`
          correctionTableau = avecLesPriorites(i, k, b, c, 'developpee', -1)
          cinqChamps = false
          this.typeQuestion[i] = 2
          break
        }
        case 3: { // Calcul mental addition factorisée initialement
          k = randint(47, 83)
          const choixIndicePuissance = randint(0, 1)
          c = ajoutRetrait
          b = puissance[choixIndicePuissance] - c
          texte = `$${lettreDepuisChiffre(i + 1)}=${k}\\times ${texNombre(b + 2 * c, 0)}$`
          correctionTableau = avecLesPriorites(i, k, b + c, c, 'factorisee', 1)
          cinqChamps = true
          this.typeQuestion[i] = 1
          break
        }
        case 4: { // Calcul mental soustraction factorisée initialement
          k = randint(47, 83)
          const choixIndicePuissance = randint(0, 1)
          c = ajoutRetrait
          b = puissance[choixIndicePuissance] + c
          texte = `$${lettreDepuisChiffre(i + 1)}=${k}\\times ${texNombre(b - 2 * c, 0)}$`
          correctionTableau = avecLesPriorites(i, k, b - c, c, 'factorisee', -1)
          cinqChamps = true
          this.typeQuestion[i] = 1
          break
        }
      }
      texteCorr += correctionTableau[0]
      this.rep1[i] = correctionTableau[1]
      this.rep2[i] = correctionTableau[2]
      this.rep3[i] = correctionTableau[3]
      this.rep4[i] = correctionTableau[4]
      this.rep5[i] = correctionTableau[5]
      if (this.interactif) {
        if (cinqChamps) {
          const code = sp(2) + remplisLesBlancs(this, i, `= ${texNombre(k, 0)} \\times %{champ1} ${listeTypeDeQuestions[i] % 2 === 1 ? '+' : '-'} ${texNombre(k, 0)} \\times %{champ2} = %{champ3} ${listeTypeDeQuestions[i] % 2 === 1 ? '+' : '-'} %{champ4} = %{champ5}`, 'ml-2')
          texte += code
        } else {
          const code = sp(2) + remplisLesBlancs(this, i, ` = ${texNombre(k, 0)} \\times (%{champ1} ${listeTypeDeQuestions[i] % 2 === 1 ? '+' : '-'} %{champ2}) = ${texNombre(k, 0)} \\times %{champ3} = %{champ4}`, 'ml-2')
          texte += code
        }
        texte += ajouteFeedback(this, i)
      }

      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on la stocke dans la liste des questions
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: '',
            enonceAvant: true,
            propositions: [
              {
                type: 'AMCOpen',
                propositions: [{
                  enonce: consigneAMC + texte + '<br>',
                  texte: texteCorr,
                  statut: 3,
                  pointilles: false,
                  multicolsBegin: true
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  multicolsEnd: true,
                  reponse: {
                    texte: 'Détailler les calculs dans le cadre de gauche et donner le résultat ci-dessous.',
                    valeur: cinqChamps ? [correctionTableau[5]] : [correctionTableau[4]],
                    param: {
                      digits: 1,
                      decimals: 0,
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              }
            ]
          }
        }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this) // On envoie l'exercice à la fonction de mise en page
  }

  correctionInteractive = (i?: number) => {
    if (i === undefined) return ''
    if (this.answers === undefined) this.answers = {}
    const result: ('OK' | 'KO')[] = []
    const mf = document.querySelector(`#champTexteEx${this.numeroExercice}Q${i}`) as MathfieldElement
    this.answers[`Ex${this.numeroExercice}Q${i}`] = mf.getValue()
    // C'est dommage d'utiliser ce divFeedback pour y mettre juste un smiley !
    const divFeedback = document.querySelector(`div#feedbackEx${this.numeroExercice}Q${i}`) as HTMLDivElement
    const test1 = ce.parse(mf.getPromptValue('champ1')).isSame(ce.parse(`${this.rep1[i]}`))
    const test2 = ce.parse(mf.getPromptValue('champ2')).isSame(ce.parse(`${this.rep2[i]}`))
    const test3 = ce.parse(mf.getPromptValue('champ3')).isSame(ce.parse(`${this.rep3[i]}`))
    const test4 = ce.parse(mf.getPromptValue('champ4')).isSame(ce.parse(`${this.rep4[i]}`))
    mf.setPromptState('champ1', test1 ? 'correct' : 'incorrect', true)
    mf.setPromptState('champ2', test2 ? 'correct' : 'incorrect', true)
    mf.setPromptState('champ3', test3 ? 'correct' : 'incorrect', true)
    mf.setPromptState('champ4', test4 ? 'correct' : 'incorrect', true)
    if (this.typeQuestion[i] === 1) {
      const test5 = ce.parse(mf.getPromptValue('champ5')).isSame(ce.parse(`${this.rep5[i]}`))
      mf.setPromptState('champ5', test5 ? 'correct' : 'incorrect', true)
      if (test1 && test2 && test3 && test4) { // question à 5 champs test5 est pour la réponse finale
        result.push('OK')
        if (divFeedback) divFeedback.innerHTML = '😎'
      } else {
        result.push('KO')
        if (divFeedback) divFeedback.innerHTML = '☹️'
      }
      if (test5) {
        result.push('OK')
      } else {
        result.push('KO')
      }
    } else { // question à 4 champs test4 est pour la réponse final
      if (test1 && test2 && test3) {
        result.push('OK')
        if (divFeedback) divFeedback.innerHTML = '😎'
      } else {
        result.push('KO')
        if (divFeedback) divFeedback.innerHTML = '☹️'
      }
      if (test4) {
        result.push('OK')
      } else {
        result.push('KO')
      }
    }
    return result
  }
}

export default DistributiviteNumerique
