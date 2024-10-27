import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { infoMessage } from '../../lib/format/message.js'
import { sp } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const titre = 'Intercaler un nombre décimal entre deux nombres décimaux'
export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '29/10/2021'

/**
 * Intercaler un nombre décimal entre deux décimaux
 * @author Rémi Angot
 * Référence 6N31-4
 * Ajout AMC : Janvier 2022 par EE
 */
export const uuid = 'b86b9'
export const ref = '6N31-4'
export const refs = {
  'fr-fr': ['6N31-4'],
  'fr-ch': ['9NO7-7']
}
export default function IntercalerDecimalEntre2Decimaux () {
  Exercice.call(this)
  this.consigne = 'Compléter avec un nombre décimal.'
  this.nbQuestions = 6
  this.nbCols = 2 // Nombre de colonnes pour la sortie LaTeX
  this.nbColsCorr = 2 // Nombre de colonnes dans la correction pour la sortie LaTeX

  this.nouvelleVersion = function () {
    this.autoCorrection = []

    const listeTypeDeQuestionsDisponibles = ['a,b1', 'a,b2', 'a,9', 'a,bc', 'a,b9', 'a,99', 'a,b0c', 'a,1', 'a,01', 'a']
    const listeTypeDeQuestions = combinaisonListes(listeTypeDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, texte, texteCorr, a, b, r, u, d1, c1, c2, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      switch (listeTypeDeQuestions[i]) {
        case 'a,b1':
          d1 = randint(1, 6)
          u = randint(1, 39)
          a = u + d1 / 10
          b = u + randint(d1 + 2, 9) / 10
          r = a + 1 / 10
          break
        case 'a,b2':
          d1 = randint(1, 8)
          u = randint(1, 39)
          a = u + d1 / 10
          b = u + (d1 + 1) / 10
          r = a + 5 / 100
          break
        case 'a,9':
          a = randint(1, 39) + 9 / 10
          b = a + 1 / 10
          r = a + 5 / 100
          break
        case 'a,bc':
          u = randint(1, 39)
          d1 = randint(1, 9)
          c1 = randint(1, 8)
          c2 = c1 + 1
          a = u + d1 / 10 + c1 / 100
          b = u + d1 / 10 + c2 / 100
          r = a + 5 / 1000
          break
        case 'a,b9':
          u = randint(1, 39)
          d1 = randint(1, 9)
          c1 = 9
          a = u + d1 / 10 + c1 / 100
          b = u + (d1 + 1) / 10
          r = a + 5 / 1000
          break
        case 'a,99':
          u = randint(1, 39)
          a = u + 99 / 100
          b = u + 1
          r = a + 5 / 1000
          break
        case 'a,b0c':
          u = randint(1, 39)
          d1 = randint(1, 6)
          c1 = randint(1, 8)
          c2 = c1 + 1
          a = u + d1 / 10 + c1 / 1000
          b = u + randint(d1 + 1, 9) / 10
          if (b - a > 0.1) {
            r = u + (d1 + 1) / 10
          } else {
            r = u + (d1) / 10 + 1 / 100
          }
          break
        case 'a,1':
          u = randint(1, 39)
          d1 = 1
          a = u
          b = u + d1 / 10
          r = u + 5 / 100
          break

        case 'a,01':
          u = randint(1, 39)
          c1 = 1
          a = u
          b = u + c1 / 100
          r = u + 5 / 1000
          break

        case 'a':
          a = randint(1, 39)
          b = a + 1
          r = a + 1 / 10
          break
      }
      if (this.interactif) {
        texte = `$${texNombre(a)}<$` + ajouteChampTexteMathLive(this, i, '') + `$\\quad<${texNombre(b)}$`
        setReponse(this, i, [a, b], { formatInteractif: 'intervalleStrict' })
      } else {
        texte = `$${texNombre(a)}<${sp(3)}\\ldots\\ldots\\ldots\\ldots\\ldots${sp(3)}<${texNombre(b)}$`
      }
      texteCorr = `$${texNombre(a)}<${texNombre(r)}<${texNombre(b)}$`

      if (context.isAmc) {
        this.autoCorrection[i] = {
          enonce: texte,
          propositions: [{ texte: texteCorr, statut: 3, feedback: '', sanscadre: true }]
        }
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
    if (context.isHtml) {
      this.contenuCorrection = infoMessage({
        titre: 'Remarque',
        texte: "Il y a une infinité de solutions. La correction ne montre qu'une possibilité.",
        couleur: 'black'
      }) + this.contenuCorrection
    }
  }
}
