import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Operation from '../../modules/operations.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { handleAnswers, setReponse } from '../../lib/interactif/gestionInteractif'
import { sp } from '../../lib/outils/outilString.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Effectuer des divisions euclidiennes'

/**
 * Poser et effectuer les divisions euclidiennes suivantes puis donner l'égalité fondamentale correspondante.
 *
 * Niveau de difficulté 2 :
 * * division par 2, 3 , 4 ou 5
 *
 * Niveau de difficulté 2 :
 * * division par 2, 3 , 4 ou 5
 * * division par 6 à 9
 * * un 0 dans le quotient
 *
 * Niveau de difficulté 3 :
 * * division par 11, 12, 15, 25
 * * division par 13,14,21,22,23 ou 24 et un 0 dans le quotient
 * * division par un multiple de 10 et un 0 dans le quotient
 * @author Rémi Angot
 */
export const uuid = '2da81'
export const ref = '6C11'
export const refs = {
  'fr-fr': ['6C11'],
  'fr-ch': ['9NO3-3']
}
export default function DivisionsEuclidiennes () {
  Exercice.call(this)
  this.sup = 1
  this.sup2 = false
  this.spacing = 2
  context.isHtml ? (this.spacingCorr = 2) : (this.spacingCorr = 1) // Important sinon opidiv n'est pas joli
  this.nbQuestions = 4
  this.classe = 6

  this.nouvelleVersion = function () {
    if (this.sup2) {
      this.consigne = 'À partir '
      this.consigne += this.nbQuestions === 1 ? 'de la division euclidienne suivante' : 'des divisions euclidiennes suivantes'
      this.consigne += ", donner l'égalité fondamentale correspondante."
    } else {
      this.consigne = 'Poser et effectuer '
      this.consigne += this.nbQuestions === 1 ? 'la division euclidienne suivante ' : 'les divisions euclidiennes suivantes '
      this.consigne += "puis donner l'égalité fondamentale correspondante."
    }
    this.autoCorrection = []
    let typesDeQuestionsDisponibles, typesDeQuestions
    if (this.sup === 1) typesDeQuestionsDisponibles = [1, 1, 1, 1]
    else if (this.sup === 2) typesDeQuestionsDisponibles = [1, 2, 2, 3]
    else if (this.sup === 3) typesDeQuestionsDisponibles = [4, 4, 5, 6]
    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    ) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"

    for (
      let i = 0, texte = '', texteCorr = '', cpt = 0, a, b, q, r;
      i < this.nbQuestions && cpt < 50;
    ) {
      // La ligne suivante ne doit pas être mise après les setReponses car sinon elle les efface
      this.autoCorrection[i] = { enonce: texte, propositions: [{ texte: texteCorr, statut: 4, feedback: '' }] }
      typesDeQuestions = listeTypeDeQuestions[i]
      switch (typesDeQuestions) {
        case 1: // division par 2, 3 , 4 ou 5
          q = randint(2, 5) * 100 + randint(2, 5) * 10 + randint(2, 5)
          b = randint(2, 5)
          break
        case 2: // division par 6 à 9
          q = randint(5, 9) * 100 + randint(2, 5) * 10 + randint(5, 9)
          b = randint(6, 9)
          break
        case 3: // un 0 dans le quotient
          if (randint(1, 2) === 1) {
            q = randint(2, 9) * 1000 + randint(2, 9) * 100 + randint(2, 9)
          } else {
            q = randint(2, 9) * 1000 + randint(2, 9) * 10 + randint(2, 9)
          }
          b = randint(7, 9)
          break
        case 4: // division par 11, 12, 15, 25
          q = randint(1, 5) * 100 + randint(1, 5) * 10 + randint(1, 5)
          b = choice([11, 12, 15, 25])
          break
        case 5: // division par 13,14,21,22,23 ou 24 et un 0 dans le quotient
          q = randint(1, 5) * 1000 + randint(6, 9) * 100 + randint(1, 5)
          b = choice([11, 12, 13, 14, 21, 22, 23, 24])
          break
        case 6: // division par un multiple de 10 et un 0 dans le quotient
          q = randint(6, 9) * 1000 + randint(6, 9) * 10 + randint(1, 5)
          b = randint(2, 9) * 10
          break
      }
      r = randint(0, b - 1) // reste inférieur au diviseur
      a = b * q + r
      texte = this.sup2
        ? Operation({
          operande1: a,
          operande2: b,
          type: 'divisionE',
          options: { solutions: false }
        })
        : `La division euclidienne de $${texNombre(a)}$ par $${b}$.`
      if (r === 0) {
        texteCorr = Operation({
          operande1: a,
          operande2: b,
          type: 'divisionE'
        }) + `$${miseEnEvidence(`${texNombre(a)}=${b}\\times${texNombre(q)}`)}$`
        setReponse(this, i, [`${a}=${b}\\times${q}`, `${a}=${q}\\times${b}`,
        `${b}\\times${q}=${a}`, `${q}\\times${b}=${a}`,
        `${a}=${b}\\times ${q}+${0}`, `${a}=${q}\\times ${b}+${0}`,
        `${b}\\times ${q}+${0}=${a}`, `${q}\\times ${b}+${0}=${a}`,
        `${a}=(${b}\\times ${q})+${0}`, `${a}=(${q}\\times ${b})+${0}`,
        `(${b}\\times ${q})+${0}=${a}`, `(${q}\\times ${b})+${0}=${a}`,
        `${a}\\div${b}=${q}`, `${a}\\div${q}=${b}`,
        `${q}=${a}\\div${b}`, `${b}=${a}\\div${q}`])
      } else {
        texteCorr = Operation({
          operande1: a,
          operande2: b,
          type: 'divisionE'
        }) + (this.classe !== 6
          ? `$${miseEnEvidence(`${texNombre(a)}=${b}\\times${texNombre(q)}+${r}`)}$`
          : `$${miseEnEvidence(`${texNombre(a)}=(${b}\\times${texNombre(q)})+${r}`)}$`)
        handleAnswers(this, i, {
          reponse: {
            value: [`${a}=${b}\\times ${q}+${r}`, `${a}=${q}\\times ${b}+${r}`,
        `${b}\\times ${q}+${r}=${a}`, `${q}\\times ${b}+${r}=${a}`,
        `${a}=(${b}\\times ${q})+${r}`, `${a}=(${q}\\times ${b})+${r}`,
        `(${b}\\times ${q})+${r}=${a}`, `(${q}\\times ${b})+${r}=${a}`],
            compare: fonctionComparaison,
            options: { operationSeulementEtNonCalcul: true }
          }
        })
      }
      texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBaseAvecEgal, { texteAvant: sp(10) + ' Égalité fondamentale :' })
      // Pour AMC question AmcOpen
      if (context.isAmc) {
        this.autoCorrection[i].enonce = 'Poser et effectuer la division euclidienne suivante puis donner l\'égalité fondamentale correspondante.<br>' + texte
        this.autoCorrection[i].propositions[0].texte = texteCorr
        this.autoCorrection[i].propositions[0].sanscadre = false
        this.autoCorrection[i].propositions[0].statut = 3
        this.autoCorrection[i].propositions[0].pointilles = false
      }
      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, '1 : Divisions par 2, 3, 4 ou 5\n2 : Diviseur à 1 chiffre\n3 : Diviseur à 2 chiffres']
  this.besoinFormulaire2CaseACocher = ['Opérations posées dans l\'énoncé', false]
}
