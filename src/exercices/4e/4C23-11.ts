import Exercice from '../Exercice'
import { gestionnaireFormulaireTexte } from '../../modules/outils'
import { obtenirListeFractionsIrreductibles } from '../../modules/fractions'
import { choice, shuffle } from '../../lib/outils/arrayOutils'
import FractionEtendue from '../../modules/FractionEtendue'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive'
import { lettreDepuisChiffre } from '../../lib/outils/outilString'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Effectuer des calculs complexes avec des fractions'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '20/06/2024'

/**
 * @author Jean-Claude Lhote
 * Référence 4C23-11
 */
export const uuid = 'f7f49'
export const ref = '4C23-1'
export const refs = {
  'fr-fr': ['4C23-1'],
  'fr-ch': []
}
export default class FractionEtPriorites extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireTexte = ['Types de questions', 'Nombres séparés par des tirets\n1 : produit en premier\n2 : produit en deuxième sans piège\n3 : produit en deuxième avec piège\n4 : Mélange']
    this.besoinFormulaire2CaseACocher = ['Présence de nombre relatifs', false]
    this.sup = '3'
    this.titre = titre
    this.correctionDetaillee = true
    this.correctionDetailleeDisponible = true
  }

  nouvelleVersion () {
    this.reinit()
    this.consigne = this.interactif
      ? 'Donner le résultat du calcul sous forme d\'une fraction irréductible.'
      : 'Effectuer les calculs suivant en respectant les priorités opératoires.'
    const cd = this.correctionDetaillee
    const useRelatifs = this.sup2
    let reponse : FractionEtendue
    const listeTypeDeQuestion = gestionnaireFormulaireTexte({ defaut: 1, saisie: this.sup, nbQuestions: this.nbQuestions, min: 1, max: 3, melange: 4 })
    for (let i = 0, cpt = 0; i < listeTypeDeQuestion.length && cpt < 50;) {
      let texte: string = ''
      let texteCorr: string = ''
      let operation = choice(['+', '-'])
      let update: boolean = false // Un booléen mis à true en cas d'étape supplémentaire
      let a: FractionEtendue = choice(obtenirListeFractionsIrreductibles())
      let b: FractionEtendue = choice(obtenirListeFractionsIrreductibles().filter(el => !el.isEqual(a)))
      let c: FractionEtendue = choice(obtenirListeFractionsIrreductibles())
      const changeForSignes = function (): void {
        if (operation === '-' && a.signe === -1) {
          operation = '+'
          a = a.oppose()
          update = true
        } else if (a.signe === -1) {
          update = true
          operation = '-'
          a = a.oppose()
        }
      }
      c.den = a.den * b.den
      if (useRelatifs) { // On injecte deux - et un + sur les trois fractions au hasard
        const signes = shuffle([1, -1, -1])
        a = a.multiplieEntier(signes[0])
        b = b.multiplieEntier(signes[1])
        c = c.multiplieEntier(signes[2])
      }
      switch (Number(listeTypeDeQuestion[i])) {
        case 2: // c +/- a*b
          texte = `$${lettreDepuisChiffre(i + 1)}=${c.texFraction}${operation}${a.texFraction}\\times ${b.texFraction}=$`
          texteCorr = texte.slice(3, -2) // La correction de base reprend l'énoncé
          if (this.interactifReady) { // Pour gérer l'interactivité
            texte += ajouteChampTexteMathLive(this, i, 'largeur01 nospacebefore')
            texte += ajouteFeedback(this, i)
          }
          // on utilise l'environnement aligned pour les calculs
          texteCorr = `$\\begin{aligned}${lettreDepuisChiffre(i + 1)} &=` + texteCorr
          if (b.signe === -1) { // on change le signe de b et donc de a pour conserver le signe du produit
            a = a.oppose()
            b = b.oppose()
            update = true
          }
          changeForSignes()
          // cd est un booléen qui active la correction détaillée (on ajoute des commentaires)
          if (update) texteCorr += `${cd ? '&\\text{On s\'occupe d\'abord des signes moins.}' : ''} \\\\`
          if (update) texteCorr += ` &= ${c.texFSD}${operation}${a.texFSD}\\times ${b.texFraction}${cd ? '&\\text{On effectue la multiplication en priorité.}' : ''} \\\\`
          else texteCorr += `${cd ? '&\\text{On effectue la multiplication en priorité.}' : ''} \\\\`
          texteCorr += ` &= ${c.texFSD}${operation}${a.produitFraction(b).texFSD}${cd ? `&\\text{On effectue ${operation === '-' ? 'la soustraction.' : 'l\'addtition.'}}` : ''}\\\\`
          reponse = operation === '+' ? c.sommeFraction(a.produitFraction(b)) : c.differenceFraction(a.produitFraction(b))
          // dernière étape on simplifie si c'est nécessaire après le switch car étape commune
          break
        case 3: // c +/- a*b avec piège de priorité
          c = new FractionEtendue(c.num, a.den)
          texte = `$${lettreDepuisChiffre(i + 1)}=${c.texFraction}${operation}${a.texFraction}\\times ${b.texFraction}=$`
          texteCorr = texte.slice(3, -2) // La correction de base reprend l'énoncé
          if (this.interactifReady) { // Pour gérer l'interactivité
            texte += ajouteChampTexteMathLive(this, i, 'largeur01 nospacebefore')
            texte += ajouteFeedback(this, i)
          }
          // on utilise l'environnement aligned pour les calculs
          texteCorr = `$\\begin{aligned}${lettreDepuisChiffre(i + 1)} &=` + texteCorr
          if (b.signe === -1) { // on change le signe de b et donc de a pour conserver le signe du produit
            a = a.oppose()
            b = b.oppose()
            update = true
          }
          changeForSignes()
          // cd est un booléen qui active la correction détaillée (on ajoute des commentaires)
          if (update) texteCorr += `${cd ? '&\\text{On s\'occupe d\'abord des signes moins.}' : ''} \\\\`
          if (update) texteCorr += ` &= ${c.texFSD}${operation}${a.texFSD}\\times ${b.texFraction}${cd ? '&\\text{On effectue la multiplication en priorité.}' : ''} \\\\`
          else texteCorr += `${cd ? '&\\text{On effectue la multiplication en priorité.}' : ''} \\\\`
          texteCorr += ` &= ${c.texFSD}${operation}${a.produitFraction(b).texFSD}${cd ? '&\\text{On met au même dénominateur}' : ''}\\\\`
          texteCorr += ` &= ${c.reduire(b.den).texFSD}${operation}${a.produitFraction(b).texFSD}${cd ? `&\\text{On effectue ${operation === '-' ? 'la soustraction.' : 'l\'addtition.'}}` : ''}\\\\`
          reponse = operation === '+' ? c.sommeFraction(a.produitFraction(b)) : c.differenceFraction(a.produitFraction(b))
          // dernière étape on simplifie si c'est nécessaire après le switch car étape commune
          break
        case 1:
        default: // a +/- b*c
          texte = `$${lettreDepuisChiffre(i + 1)}=${a.texFraction}\\times ${b.texFraction}${operation}${c.texFraction}=$`
          texteCorr = texte.slice(3, -2) // La correction de base reprend l'énoncé
          if (this.interactifReady) { // Pour gérer l'interactivité
            texte += ajouteChampTexteMathLive(this, i, 'largeur01 nospacebefore')
            texte += ajouteFeedback(this, i)
          }
          // on utilise l'environnement aligned pour les calculs
          texteCorr = `$\\begin{aligned}${lettreDepuisChiffre(i + 1)} &=` + texteCorr
          if (b.signe === -1) { // on change le signe de b et donc de a pour conserver le signe du produit
            a = a.oppose()
            b = b.oppose()
            update = true
          }
          if (operation === '-' && c.signe === -1) {
            operation = '+'
            c = c.oppose()
            update = true
          } else if (c.signe === -1) {
            update = true
            operation = '-'
            c = c.oppose()
          }
          // cd est un booléen qui active la correction détaillée (on ajoute des commentaires)
          if (update) texteCorr += `${cd ? '&\\text{On s\'occupe d\'abord des signes moins.}' : ''} \\\\`
          if (update) texteCorr += ` &= ${a.texFSD}\\times ${b.texFraction}${operation}${c.texFraction}${cd ? '&\\text{On effectue la multiplication en priorité.}' : ''} \\\\`
          else texteCorr += `${cd ? '&\\text{On effectue la multiplication en priorité.}' : ''} \\\\`
          texteCorr += ` &= ${a.produitFraction(b).texFSD}${operation}${c.texFraction}${cd ? `&\\text{On effectue ${operation === '-' ? 'la soustraction.' : 'l\'addtition.'}}` : ''}\\\\`
          reponse = operation === '+' ? a.produitFraction(b).sommeFraction(c) : a.produitFraction(b).differenceFraction(c)
          // dernière étape on simplifie si c'est nécessaire après le switch car étape commune
          break
      }
      // La dernière étape de réduction est commune on la fait maintenant si besoin
      if (!reponse.estIrreductible) {
        texteCorr += ` &= ${reponse.texFSD}`
        texteCorr += `${cd ? '&\\text{On pense à simplifier le résultat.}' : ''}\\\\`
        texteCorr += `&= ${reponse.texFractionSimplifiee}\\\\`
      } else {
        texteCorr += ` &= ${reponse.texFSD}\\\\`
      }
      texteCorr += '\\end{aligned}$\n'
      if (this.questionJamaisPosee(i, a.texFraction, b.texFraction, c.texFraction)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        if (this.interactif) handleAnswers(this, i, { reponse: { value: reponse.texFractionSimplifiee, compare: fonctionComparaison, options: { avecFractions: true, fractionIrreductibleSeulement: true } } })
        i++
      }
      cpt++
    }
  }
}
