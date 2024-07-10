import Exercice from '../../Exercice'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { Polynome } from '../../../lib/mathFonctions/Polynome'
import { gestionnaireFormulaireTexte, randint } from '../../../modules/outils'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { functionCompare } from '../../../lib/interactif/comparisonFunctions'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { ecritureAlgebriqueSauf1, reduireAxPlusB, rienSi1 } from '../../../lib/outils/ecritures'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Dériver des polynômes'
export const interactifReady = true
export const interactifType = 'mathLive'

// export const uuid = '60229'
// export const refs = {
//   'fr-fr': ['1AN14-30'],
//   'fr-ch': []
// }

export const dateDePublication = '17/04/2024'

/**
 * Dérivation de polynômes.
 * Doublon avec 1AN3.
 * @author Jean-Claude Lhote et Gilles Mora pour la correction
 *
 */
class DerivationSimple extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.besoinFormulaireTexte = ['Types de fonctions : ', 'Nombres séparés par des tirets\n1 : Fonctions affines\n2 : Polynomes de degré 2\n3 : Polynomes de degré 3\n4 : Monomes de degré quelconque\n5 : Mélange']
    this.sup = '5'
    this.nbQuestions = 2
    this.correctionDetailleeDisponible = true
  }

  nouvelleVersion () {
    // initialise les propriété exportée de l'exo comme this.autoCorrection, this.listeQuestions...
    this.reinit()
    // on récupère la liste des valeurs saisies dans le formulaire
    const listeTypeDeQuestion = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 4, defaut: 1, melange: 5, nbQuestions: this.nbQuestions })
    // Boucle principale pour fabriquer les question
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let laFonction
      let laDerivee
      let laFonctionEnLatex
      let df
      const nom = [
        ['f'], ['g'], ['h']
      ]
      const nomF = choice(nom)
      // on définit la fonction en fonction du choix effectué
      switch (Number(listeTypeDeQuestion[i])) {
        case 2:
          {
            const c = randint(-10, 10)
            laFonction = new Polynome({ rand: false, deg: 2, coeffs: [c, randint(-10, 10, c), randint(-10, 10, 0)] })
            df = '\\R'
            laDerivee = laFonction.derivee().toLatex()
            laFonctionEnLatex = laFonction.toLatex()
          }
          break
        case 3:
          {
            const c = randint(-10, 10, 0)
            laFonction = new Polynome({ rand: false, deg: 3, coeffs: [c, choice([randint(-7, 7), 0]), choice([randint(-10, 10), 0]), randint(-5, 5, 0)] })

            df = '\\R'
            laDerivee = laFonction.derivee().toLatex()
            laFonctionEnLatex = laFonction.toLatex()
          }
          break
        case 4:{
          const deg = randint(3, 15)
          const coeffs = new Array(deg).fill(0)
          coeffs[coeffs.length - 1] = randint(-5, 5, 0)
          laFonction = new Polynome({ rand: false, coeffs, deg })
          df = '\\R'
          laDerivee = laFonction.derivee().toLatex()
          laFonctionEnLatex = laFonction.toLatex()
        }
          break
        case 1:
        default: { // il faut toujours un default dans un switch, ça évite de sortir du switch bredouille
          const a = randint(-10, 10, 0)
          const b = randint(-5, 5, 0)
          laFonction = choice([true, false]) ? reduireAxPlusB(a, b, 'x') : `${String(b)}${ecritureAlgebriqueSauf1(a)}x`
          laFonctionEnLatex = laFonction
          laDerivee = String(a)
          df = '\\R'
        }
          break
      }
      // Une seule consigne @todo à améliorer ?
      const texte = `Donner l'expression de la dérivée de la fonction $${nomF}$ définie sur $${df}$ par $${nomF}(x)=${laFonctionEnLatex}$.<br>` + ajouteChampTexteMathLive(this, i, 'nospacebefore inline largeur01 ' + KeyboardType.clavierDeBaseAvecX + ' ' + KeyboardType.clavierFullOperations, { texteAvant: '$f\'(x)=$' })
      // Pratique : les 'Polynome' ont leur méthode derivee() !

      // La correction commune
      let texteCorr = ''
      // C'est fini... sauf pour la correction détaillée ci-dessous.
      if (this.correctionDetaillee) {
        if (listeTypeDeQuestion[i] === 1) { // cas fonctions affines
          texteCorr += `$${nomF}$ est une fonction affine de la forme $${nomF}(x)=mx+p$ dont la dérivée est donnée par $${nomF}'(x)=m$.<br>
          Ainsi $${nomF}$ est dérivable sur $\\mathbb{R}$ et $${nomF}'(x)=${miseEnEvidence(laDerivee)}$.`
        }
        if (listeTypeDeQuestion[i] === 2) { // cas polynômes degré 2
          const u = new Polynome({ rand: false, coeffs: [0, 0, laFonction.monomes[2]] })
          const v = new Polynome({ rand: false, coeffs: [laFonction.monomes[0], laFonction.monomes[1]] })
          texteCorr += `
           La fonction $${nomF}$ est une fonction polynôme du second degré de la forme $${nomF}(x)=u(x)+v(x)$ avec $u(x)=${u.toLatex()}$ 
           et $v(x)=${v.toLatex()}$. <br>
           On a $u'(x)=${u.derivee().toLatex()}$ et $v'(x)=${v.derivee().toLatex()}$. <br>
           On sait que $(u+v)'=u'+v'$.<br>
          Ainsi  $${nomF}$ est  dérivable sur $${df}$ et  $${nomF}'(x)=${miseEnEvidence(laDerivee)}$.
            `
        }
        if (listeTypeDeQuestion[i] === 3) { // cas des polynomes de 3
          const u = new Polynome({ rand: false, coeffs: [0, 0, 0, laFonction.monomes[3]] })
          const v = new Polynome({ rand: false, coeffs: [laFonction.monomes[0], laFonction.monomes[1], laFonction.monomes[2]] })
          texteCorr += `La fonction $${nomF}$ est une fonction polynôme de degré $3$ de la forme $${nomF}(x)=u(x)+v(x)$ avec $u(x)=${u.toLatex()}$ 
          et ${(laFonction.monomes[1] === 0 && laFonction.monomes[2] === 0) ? `$v(x)=${laFonction.monomes[0]}$.` : `$v(x)=${v.toLatex()}$.`}
          <br>
          On a $u'(x)=${u.derivee().toLatex()}$ et $v'(x)=${v.derivee().toLatex()}$. <br>
          On sait que $(u+v)'=u'+v'$.<br>
         Ainsi  $${nomF}$ est  dérivable sur $${df}$ et  $${nomF}'(x)=${miseEnEvidence(laDerivee)}$.`
          // for (let i = 0; i < laFonction.monomes.length; i++) {
          // const monome = new Polynome({ coeffs: laFonction.monomes.map((nb: number, index:number) => index === i ? nb : 0) })
          // const monomeD = monome.derivee()
          // texteCorr += `$(${monome.toLatex().replace('+', '')})^\\prime = ${monomeD.toLatex() !== '' ? monomeD.toLatex() : '0'}$<br>}
        }
        if (listeTypeDeQuestion[i] === 4) { // Cas du monome unique
          const deg = laFonction.deg
          const coeff: number = laFonction.monomes[deg]
          // const monome = rienSi1(coeff) + `x^{${deg}}`
          const monomeD = coeff * deg + `x^{${rienSi1(deg - 1)}}`
          texteCorr += `La fonction $${nomF}$ est une fonction de la forme $a\\times x^n$.<br>`
          texteCorr += `Sa dérivée est donc de la forme : $a\\times nx^{n-1}$ avec $n=${deg}$ et $a=${coeff}$.<br>`
          texteCorr += `$${nomF}$ est dérivable sur $${df}$ et $${nomF}^\\prime (x) = ${miseEnEvidence(monomeD)}$<br>`
        }
      } else { texteCorr += `$f^\\prime(x) =${miseEnEvidence(laDerivee)}$<br>` }
      // texteCorr += `L'expression de la dérivée de la fonction $f$ est :<br> $f^\\prime(x) =${miseEnEvidence(laFonction.toLatex())}$<br>`
      // On vérifie qu'on n'a pas deux fois la même fonction
      if (this.questionJamaisPosee(i, laFonctionEnLatex)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        handleAnswers(this, i, { reponse: { value: laDerivee, options: { variable: 'x' }, compare: functionCompare } })
        i++
        cpt--
      }
      cpt++
    } // fin de boucle sur les questions
  } // nouvelleVersion
} // DerivationSimple

export default DerivationSimple
