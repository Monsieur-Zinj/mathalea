import { choice, combinaisonListes, shuffle } from '../../lib/outils/arrayOutils.js'
import { obtenirListeFacteursPremiers } from '../../lib/outils/primalite.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { arrondi } from '../../lib/outils/nombres.js'

export const titre = 'Deviner un nombre relatif'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDeModifImportante = '15/01/2024'
/**
 * Additions à trou dans les relatifs
 *
 *  @author Jean-Claude Lhote à partir de CM000 de Rémi Angot
 * Eric Elter le rend interactif le 15/01/2024
 */

export const uuid = '76343'
export const ref = '5R10-1'
export default function DevinerNombreRelatif () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.spacing = 2
  this.nbQuestions = 3
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    const typesDeQuestionsDisponibles = [1, 2, 3]
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    let dixieme; let signe; let centieme; let unite; let somme; let produit; let facteurs; const type = ['négatif', 'nul', 'positif']
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions & cpt < 50;) {
      signe = choice([-1, 1])
      switch (listeTypeDeQuestions[i]) {
        case 1:
          unite = randint(1, 9)
          somme = randint(unite + 1, unite + 9)
          dixieme = somme - unite
          centieme = 0
          texte = `Je suis un nombre ${type[signe + 1]} dont la distance à zéro est comprise entre ${unite} et ${unite + 1}.<br>`
          texte += `On m'écrit avec deux chiffres dont la somme est ${somme}.<br>Qui suis-je ?`
          break

        case 2:
          unite = randint(1, 9)
          somme = randint(unite + 1, unite + 9)
          dixieme = somme - unite
          centieme = 0
          texte = 'Je suis un nombre dont l\'opposé est compris entre '
          if (signe < 0) {
            texte += `$${unite}$ et $${unite + 1}$.<br>`
          } else {
            texte += `$${-unite - 1}$ et $${-unite}$.<br>`
          }
          texte += `La somme de mes deux chiffres est $${somme}$.<br>Qui suis-je ?`
          break

        case 3:
          produit = choice([6, 10, 15])
          facteurs = obtenirListeFacteursPremiers(produit)
          facteurs.push(1)
          facteurs = shuffle(facteurs)
          unite = facteurs[0]
          dixieme = facteurs[1]
          centieme = facteurs[2]
          texte = `Je suis un nombre ${type[signe + 1]} dont la distance à zéro est comprise entre ${unite} et ${unite + 1}.<br>`
          texte += `Le produit de mes trois chiffres vaut ${produit}.<br>`
          if (dixieme < centieme) {
            texte += 'Mon chiffre des centièmes est supérieur à mon chiffre des dixièmes.'
          } else {
            texte += 'Mon chiffre des centièmes est inférieur à mon chiffre des dixièmes.'
          }
          texte += ' Qui suis-je ?'
          break

        case 4:
          break
      }
      texteCorr = `Je suis $${texNombre(signe * (unite + dixieme / 10 + centieme / 100))}$.`
      texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline')

      setReponse(this, i, arrondi(signe * (unite + dixieme / 10 + centieme / 100), 3), { signe: true })
      if (this.questionJamaisPosee(i, texte)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
