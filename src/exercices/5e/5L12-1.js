import { choice, combinaisonListesSansChangerOrdre } from '../../lib/outils/arrayOutils.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { rienSi1 } from '../../lib/outils/ecritures.js'
import { sp } from '../../lib/outils/outilString.js'
export const titre = 'Réduire un produit et une somme à partir des mêmes éléments algébriques pour distinguer la différence'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '04/11/2023'

/**
 * Distinction entre la réduction d'un produit et la réduction d'une somme, on garde les même coeffs
 * @author Sébastien Lozano (modifié par EE)
 */
export const uuid = '46234'
export const ref = '5L12-1'
export default function ReduireDinstinctionSommeProduit () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.nbQuestions = 2
  this.nbCols = 1
  this.nbColsCorr = 1
  let typesDeQuestionsDisponibles
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    typesDeQuestionsDisponibles = [choice([0, 2]), choice([1, 3])]

    const listeTypeDeQuestions = combinaisonListesSansChangerOrdre(typesDeQuestionsDisponibles, this.nbQuestions)
    // const listeTypeDeQuestions = combinaisonListesSansChangerOrdre([0], this.nbQuestions)

    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const variables = ['x', 'y', 'z', 't']
      const enonces = []
      const n = randint(1, 6)
      const p = randint(1, 6)
      // n = 1
      // p = 1
      const inc = variables[randint(0, variables.length - 1)]

      //= ==== 0 le produit puis la somme
      enonces.push({
        enonce: `Simplifier le plus possible le produit puis la somme de $${rienSi1(n)}${inc}$ et de $${rienSi1(p)}${inc}$`,
        questtion: '',
        correction_produit: `Le produit de $${rienSi1(n)}${inc}$ et de $${rienSi1(p)}${inc}$ vaut : ` + (n * p === 1 ? `$${inc}\\times ${inc} =$` : `$${rienSi1(n)}${inc}\\times ${rienSi1(p)}${inc} = ${n}\\times ${inc}\\times ${p}\\times ${inc} = ${n}\\times ${p}\\times ${inc}\\times ${inc}=$`),
        correction_somme: `La somme de $${rienSi1(n)}${inc}$ et de $${rienSi1(p)}${inc}$ vaut $${rienSi1(n)}${inc}+${rienSi1(p)}${inc} = ${n}\\times ${inc}+${p}\\times ${inc} = (${n}+${p})\\times ${inc}=$ `
      })

      //= ==== 1 le produit puis la somme
      enonces.push({
        enonce: `Simplifier le plus possible l'expression $${rienSi1(n)}${inc}\\times ${rienSi1(p)}${inc}$ puis l'expression $${rienSi1(n)}${inc}+${rienSi1(p)}${inc}$`,
        questtion: '',
        correction_produit: (n * p === 1 ? `$${inc}\\times ${inc} =$` : `$${rienSi1(n)}${inc}\\times ${rienSi1(p)}${inc} = ${n}\\times ${inc}\\times ${p}\\times ${inc} = ${n}\\times ${p}\\times ${inc}\\times ${inc}=$`),
        correction_somme: `$${rienSi1(n)}${inc}+${rienSi1(p)}${inc} = ${n}\\times ${inc}+${p}\\times ${inc} = (${n}+${p})\\times ${inc}=$ `
      })

      //= ==== 2 la somme puis le produit
      enonces.push({
        enonce: `Simplifier le plus possible la somme puis le produit de $${rienSi1(n)}${inc}$ et de $${rienSi1(p)}${inc}$`,
        questtion: '',
        correction_produit: `Le produit de $${rienSi1(n)}${inc}$ et de $${rienSi1(p)}${inc}$ vaut : ` + (n * p === 1 ? `$${inc}\\times ${inc} =$` : `$${rienSi1(n)}${inc}\\times ${rienSi1(p)}${inc} = ${n}\\times ${inc}\\times ${p}\\times ${inc} = ${n}\\times ${p}\\times ${inc}\\times ${inc}=$`),
        correction_somme: `La somme de $${rienSi1(n)}${inc}$ et de $${rienSi1(p)}${inc}$ vaut : $${rienSi1(n)}${inc}+${rienSi1(p)}${inc} = ${n}\\times ${inc}+${p}\\times ${inc} = (${n}+${p})\\times ${inc}=$ `
      })

      //= ==== 3 la somme puis le produit
      enonces.push({
        enonce: `Simplifier le plus possible l'expression $${rienSi1(n)}${inc}+${rienSi1(p)}${inc}$ puis l'expression $${rienSi1(n)}${inc}\\times ${rienSi1(p)}${inc}$`,
        questtion: '',
        correction_produit: (n * p === 1 ? `$${inc}\\times ${inc} =$` : `$${rienSi1(n)}${inc}\\times ${rienSi1(p)}${inc} = ${n}\\times ${inc}\\times ${p}\\times ${inc} = ${n}\\times ${p}\\times ${inc}\\times ${inc}=$`),
        correction_somme: `$${rienSi1(n)}${inc}+${rienSi1(p)}${inc} = ${n}\\times ${inc}+${p}\\times ${inc} = (${n}+${p})\\times ${inc}=$ `
      })

      texte = `${enonces[listeTypeDeQuestions[i]].enonce}.`

      const reponseProduit = `${rienSi1(n * p)}${inc}^2`
      const correctionProduitFinal = `$${sp()}${miseEnEvidence(reponseProduit)}$` + (listeTypeDeQuestions[i] % 2 === 0 ? '.' : '')
      const reponseSomme = `${n + p}${inc}`
      const correctionSommeFinale = `$${sp()}${miseEnEvidence(reponseSomme)}$` + (listeTypeDeQuestions[i] % 2 === 0 ? '.' : '')

      if (this.interactif) {
        texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur01 inline nospacebefore', { texteAvant: listeTypeDeQuestions[i] > 1 ? '<br>Somme : ' : '<br>Produit : ' })
        setReponse(this, 2 * i, listeTypeDeQuestions[i] > 1 ? reponseSomme : reponseProduit, { formatInteractif: 'formeDeveloppeeParEE' })
        texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur01 inline nospacebefore', { texteAvant: listeTypeDeQuestions[i] > 1 ? '<br>Produit : ' : '<br>Somme : ' })
        setReponse(this, 2 * i + 1, listeTypeDeQuestions[i] > 1 ? reponseProduit : reponseSomme, { formatInteractif: 'formeDeveloppeeParEE' })
      }
      texteCorr = listeTypeDeQuestions[i] > 1 ? enonces[listeTypeDeQuestions[i]].correction_somme : enonces[listeTypeDeQuestions[i]].correction_produit
      texteCorr += listeTypeDeQuestions[i] > 1 ? correctionSommeFinale : correctionProduitFinal
      texteCorr += '<br>'
      texteCorr += listeTypeDeQuestions[i] > 1 ? enonces[listeTypeDeQuestions[i]].correction_produit : enonces[listeTypeDeQuestions[i]].correction_somme
      texteCorr += listeTypeDeQuestions[i] > 1 ? correctionProduitFinal : correctionSommeFinale

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
