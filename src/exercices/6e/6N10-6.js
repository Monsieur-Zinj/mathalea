import { choice, combinaisonListes2 } from '../../lib/outils/arrayOutils'
import { nombreDeChiffresDansLaPartieDecimale, nombreDeChiffresDe } from '../../lib/outils/nombres'
import { texNombre, stringNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteFeedback, remplisLesBlancs } from '../../lib/interactif/questionMathLive.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'
import { max } from 'mathjs'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fraction } from '../../modules/fractions.js'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre = 'Donner l\'écriture (décimale ou en fraction décimale) d\'une somme (ou différence) de nombres avec fractions décimales'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '20/01/2022'
/**
 * Donner l\'écriture (décimale ou en fraction décimale) d\'une somme (ou différence) de nombres avec fractions décimales
 *
 * * La somme avec entiers peut être avec retenue (genre 2+23/10) ou sans retenue (3+7/10)
 * * Tous les choix sont paramétrables
 * *
 * @author Eric Elter
 * Référence 6N10-6
 */

export const uuid = 'c5438'
export const ref = '6N10-6'
export const refs = {
  'fr-fr': ['6N10-6'],
  'fr-ch': ['9NO13-4']
}
export default function SommeFractionsDecimales () {
  Exercice.call(this)
  this.nbQuestions = 6
  this.besoinFormulaireTexte = ['Type des calculs', 'Nombres séparés par des tirets\n(Les fractions sont décimales et de même dénominateur)\n1 : Somme de 2 fractions\n2 : Différence de 2 fractions\n3 : Somme (sans retenue) d\'un entier et d\'une somme de 2 fractions\n4 : Somme (sans retenue) d\'un entier et d\'une différence de 2 fractions\n5 : Somme d\'un entier et d\'une somme de 2 fractions\n6 : Somme d\'un entier et d\'une différence de 2 fractions\n7 : Mélange']
  this.besoinFormulaire2Numerique = ['Forme de la solution', 3, '1 : Un nombre décimal\n2 : Une fraction décimale\n3 : Les deux']
  this.sup = 7
  this.sup2 = 3
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    // this.sup2 = contraindreValeur(1, 3, this.sup2, 3)
    this.consigne = 'Donner le résultat de '
    this.consigne += this.nbQuestions === 1 ? 'ce' : 'chaque'
    switch (this.sup2) {
      case 1 :
        this.consigne += ' calcul.'
        break
      case 2 :
        this.consigne += ' calcul sous forme d\'une fraction décimale.'
        break
      case 3 :
        this.consigne += ' calcul sous forme d\'une fraction décimale puis en écriture décimale.'
        break
    }

    const typesDeQuestionsDisponibles = gestionnaireFormulaireTexte({
      max: 6,
      defaut: 7,
      melange: 7,
      nbQuestions: this.nbQuestions,
      saisie: this.sup
    })

    const listeTypeDeQuestions = combinaisonListes2(typesDeQuestionsDisponibles, this.nbQuestions)
    for (
      let i = 0, texte, texteCorr, cpt = 0, a, b, c, reponseAMC, denAMC, numAMC, choix; i < this.nbQuestions && cpt < 50;) {
      a = randint(2, 19)
      b = randint(2, 19, a)
      c = randint(2, 19, [a, b])
      choix = randint(1, 3)
      denAMC = Math.pow(10, choix)
      switch (listeTypeDeQuestions[i]) {
        case 1: { // Somme de deux fractions décimales de même dénominateur
          b = randint(2, 50)
          c = randint(2, 50, [b])
          while ((b + c) % 10 === 0) {
            c = randint(2, 50, [b])
          } // Pour éviter d'avoir une somme multiple de 10
          const fracB = fraction(b, denAMC)
          const fracC = fraction(c, denAMC)
          const fracBPlusC = fraction(b + c, denAMC)
          texte = `$${fracB.texFraction}+${fracC.texFraction}$`
          numAMC = b + c
          reponseAMC = numAMC / denAMC
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${fracB.texFraction}+${fracC.texFraction}$ sous forme d'une fraction décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          texteCorr = `$${fracB.texFraction}+${fracC.texFraction}=${miseEnEvidence(fracBPlusC.texFraction)}`
        }
          break
        case 2: { // Différence de deux fractions décimales de même dénominateur
          b = randint(3, 50)
          c = randint(2, b - 1)
          numAMC = b - c
          reponseAMC = numAMC / denAMC
          const fracB = fraction(b, denAMC)
          const fracC = fraction(c, denAMC)
          const fracBMoinsC = fraction(b - c, denAMC)
          texte = `$${fracB.texFraction}-${fracC.texFraction}$`
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${fracB.texFraction}-${fracC.texFraction}$ sous forme d'une fraction décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          texteCorr = `$${fracB.texFraction}-${fracC.texFraction}=${miseEnEvidence(fracBMoinsC.texFraction)}`
        }
          break
        case 3: { // Somme d'un entier avec une somme de deux fractions décimales de même dénominateur, sans retenue
          b = (choix === 1) ? randint(2, 7) : randint(2, 50)
          c = (choix === 1) ? randint(2, 7, [b, 10 - b]) : randint(2, 50, [b])
          a = randint(2, 20, [b, c])
          while ((b + c) % 10 === 0) {
            c = randint(2, 50, [a, b])
          } // Pour éviter d'avoir une somme multiple de 10
          const fracA = fraction(a * denAMC, denAMC)
          const fracB = fraction(b, denAMC)
          const fracC = fraction(c, denAMC)
          const fracBPlusC = fraction(b + c, denAMC)
          texte = `$${a}+${fracB.texFraction}+${fracC.texFraction}$`
          numAMC = a * denAMC + b + c
          const fracNumAMC = fraction(numAMC, denAMC)
          reponseAMC = numAMC / denAMC
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${a}+${fracB.texFraction}+${fracC.texFraction}$ sous forme décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          texteCorr = `$${a}+${fracB.texFraction}+${fracC.texFraction}=${a}+${fracBPlusC.texFraction}=${fracA.texFraction}+${fracBPlusC.texFraction}=${miseEnEvidence(fracNumAMC.texFraction)}`
        }
          break
        case 4: { // Somme d'un entier avec une différence de deux fractions décimales de même dénominateur, sans retenue
          b = randint(3, 50)
          c = (choix === 1) ? randint(max(b - 9, 2), b - 1) : randint(2, b - 1)
          a = randint(2, 20, [b, c])
          numAMC = a * denAMC + b - c
          const fracNumAMC = fraction(numAMC, denAMC)
          const fracA = fraction(a * denAMC, denAMC)
          const fracB = fraction(b, denAMC)
          const fracC = fraction(c, denAMC)
          const fracBMoinsC = fraction(b - c, denAMC)
          texte = `$${a}+${fracB.texFraction}-${fracC.texFraction}$`
          reponseAMC = numAMC / denAMC
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${a}+${fracB.texFraction}-${fracC.texFraction}$ sous forme décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          texteCorr = `$${a}+${fracB.texFraction}-${fracC.texFraction}=${a}+${fracBMoinsC.texFraction}=${fracA.texFraction}+${fracBMoinsC.texFraction}=${miseEnEvidence(fracNumAMC.texFraction)}`
        }
          break
        case 5: { // Somme d'un entier avec une somme de deux fractions décimales de même dénominateur, avec éventuelle retenue
          b = randint(2, 50)
          c = randint(2, 50, [b])
          a = randint(2, 20, [b, c])
          while ((b + c) % 10 === 0) {
            c = randint(2, 50, [a, b])
          } // Pour éviter d'avoir une somme multiple de 10
          const fracA = fraction(a * denAMC, denAMC)
          const fracB = fraction(b, denAMC)
          const fracC = fraction(c, denAMC)
          const fracBPlusC = fraction(b + c, denAMC)
          texte = `$${a}+${fracB.texFraction}+${fracC.texFraction}$`
          numAMC = a * denAMC + b + c
          const fracNumAMC = fraction(numAMC, denAMC)
          reponseAMC = numAMC / denAMC
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${a}+${fracB.texFraction}+${fracC.texFraction}$ sous forme décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          texteCorr = `$${a}+${fracB.texFraction}+${fracC.texFraction}=${a}+${fracBPlusC.texFraction}=${fracA.texFraction}+${fracBPlusC.texFraction}=${miseEnEvidence(fracNumAMC.texFraction)}`
        }
          break
        case 6:{ // Somme d'un entier avec une différence de deux fractions décimales de même dénominateur, avec éventuelle retenue
          b = randint(3, 50)
          c = randint(2, b - 1)
          a = randint(2, 20, [b, c])
          const fracA = fraction(a * denAMC, denAMC)
          const fracB = fraction(b, denAMC)
          const fracC = fraction(c, denAMC)
          const fracBMoinsC = fraction(b - c, denAMC)
          texte = `$${a}+${fracB.texFraction}-${fracC.texFraction}$`
          numAMC = a * denAMC + b - c
          const fracNumAMC = fraction(numAMC, denAMC)
          reponseAMC = numAMC / denAMC
          if (!context.isHtml) {
            this.canEnonce = `Calculer $${a}+${fracB.texFraction}-${fracC.texFraction}$ sous forme décimale.`
            this.correction = this.listeCorrections[0]
            this.canReponseACompleter = ''
          }
          texteCorr = `$${a}+${fracB.texFraction}-${fracC.texFraction}=${a}+${fracBMoinsC.texFraction}=${fracA.texFraction}+${fracBMoinsC.texFraction}=${miseEnEvidence(fracNumAMC.texFraction)}`
        }
          break
      }
      // commun à tous les cas : on termine avec '$' ou on ajoute la valeur décimale suivie de '$'
      texteCorr += this.sup2 === 2 ? '$' : `=${miseEnEvidence(texNombre(reponseAMC))}$`
      const choixDigit = randint(0, 1)
      const fractionResultat = fraction(numAMC, denAMC).texFraction
      switch (this.sup2) {
        case 1 :
          if (context.isAmc) {
            this.autoCorrection[i] = {
              enonce: texte, // Si vide, l'énoncé est celui de l'exercice.
              propositions: [
                {
                  texte: '' // Si vide, le texte est la correction de l'exercice.
                }
              ],
              reponse: {
                valeur: [reponseAMC], // obligatoire (la réponse numérique à comparer à celle de l'élève), NE PAS METTRE DE STRING à virgule ! 4.9 et non pas 4,9. Cette valeur doit être passée dans un tableau d'où la nécessité des crochets.
                param: {
                  digits: nombreDeChiffresDe(reponseAMC) + randint(choixDigit, choixDigit + 1),
                  decimals: nombreDeChiffresDansLaPartieDecimale(reponseAMC) + choixDigit,
                  signe: false
                }
              }
            }
          } else {
            handleAnswers(this, i, { bareme: (listePoints) => [listePoints[0], 1], champ1: { value: stringNombre(reponseAMC, 3), compare: fonctionComparaison, options: { avecFractions: false } } })
          }

          break
        case 2 :
          if (context.isAmc) {
            this.autoCorrection[i] = {
              enonce: texte, // Si vide, l'énoncé est celui de l'exercice.
              propositions: [
                {
                  texte: '' // Si vide, le texte est la correction de l'exercice.
                }
              ],
              reponse: {
                valeur: [new FractionEtendue(numAMC, denAMC)], // obligatoire (la réponse numérique à comparer à celle de l'élève), NE PAS METTRE DE STRING à virgule ! 4.9 et non pas 4,9. Cette valeur doit être passée dans un tableau d'où la nécessité des crochets.
                param: {
                  digitsNum: nombreDeChiffresDe(numAMC),
                  digitsDen: nombreDeChiffresDe(denAMC) + 1,
                  signe: false
                }
              }
            }
          } else {
            handleAnswers(this, i, { bareme: (listePoints) => [listePoints[0], 1], champ1: { value: fractionResultat, compare: fonctionComparaison, options: { fractionDecimale: true } } })
          }
          break
        case 3 :
          if (context.isAmc) {
            if (choice([0, 1]) === 0) {
              this.autoCorrection[i] = {
                enonce: texte, // Si vide, l'énoncé est celui de l'exercice.
                propositions: [
                  {
                    texte: '' // Si vide, le texte est la correction de l'exercice.
                  }
                ],
                reponse: {
                  valeur: [new FractionEtendue(numAMC, denAMC)], // obligatoire (la réponse numérique à comparer à celle de l'élève), NE PAS METTRE DE STRING à virgule ! 4.9 et non pas 4,9. Cette valeur doit être passée dans un tableau d'où la nécessité des crochets.
                  param: {
                    digitsNum: nombreDeChiffresDe(numAMC),
                    digitsDen: nombreDeChiffresDe(denAMC) + 1,
                    signe: false
                  }
                }
              }
            } else {
              this.autoCorrection[i] = {
                enonce: texte, // Si vide, l'énoncé est celui de l'exercice.
                propositions: [
                  {
                    texte: '' // Si vide, le texte est la correction de l'exercice.
                  }
                ],
                reponse: {
                  valeur: [reponseAMC], // obligatoire (la réponse numérique à comparer à celle de l'élève), NE PAS METTRE DE STRING à virgule ! 4.9 et non pas 4,9. Cette valeur doit être passée dans un tableau d'où la nécessité des crochets.
                  param: {
                    digits: nombreDeChiffresDe(reponseAMC) + randint(choixDigit, choixDigit + 1),
                    decimals: nombreDeChiffresDansLaPartieDecimale(reponseAMC) + choixDigit,
                    signe: false
                  }
                }
              }
            }
          } else {
            handleAnswers(this, i, {
              bareme: (listePoints) => [listePoints[0] + listePoints[1], 2],
              champ1: { value: fractionResultat, compare: fonctionComparaison, options: { fractionDecimale: true } },
              //  champ2: { value: stringNombre(reponseAMC, 3), compare: fonctionComparaison, options: { avecFractions: false } }
              champ2: { value: stringNombre(reponseAMC, 3), compare: fonctionComparaison, options: { nombreDecimalSeulement: true } }
            })
          }
          break
      }
      if (this.interactif) {
        if (this.sup2 === 3) {
          texte += remplisLesBlancs(this, i, '= ~  %{champ1} ~ = ~ %{champ2}', 'inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction, '\\ldots\\ldots')
          //   texte += ajouteChampTexteMathLive(this, 2 * i, 'largeur01 inline', { texteAvant: `${sp(6)}=` })
        //  texte += ajouteChampTexteMathLive(this, 2 * i + 1, 'largeur01 inline', { texteAvant: `${sp(6)}=` })
        } else {
          // texte += remplisLesBlancs(this, i, '= ~ %{champ1}', 'inline nospacebefore ' + this.sup2 === 1 ? KeyboardType.clavierNumbers : KeyboardType.clavierDeBaseAvecFraction, '\\ldots\\ldots')
          texte += remplisLesBlancs(this, i, '= ~ %{champ1}', 'inline nospacebefore ' + (this.sup2 === 1 ? KeyboardType.clavierNumbers : KeyboardType.clavierDeBaseAvecFraction), '\\ldots\\ldots')
          // texte += ajouteChampTexteMathLive(this, i, 'largeur01 inline', { texteAvant: `${sp(6)}=` })
        }
      }

      texte += ajouteFeedback(this, i)
      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        if (!context.isHtml && i === 0) {
          texteCorr = '\\setlength\\itemsep{2em}' + texteCorr
        } // espacement entre les questions
        this.listeCorrections.push(texteCorr)
        this.listeCanEnonces.push(this.canEnonce ?? '')
        this.listeCanReponsesACompleter.push(this.canReponseACompleter ?? '')
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
