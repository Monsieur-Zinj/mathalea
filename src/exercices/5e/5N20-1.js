import Exercice from '../Exercice.js'
import { calcul, listeQuestionsToContenu, randint, combinaisonListes, pgcd, miseEnEvidence, texFraction, texFractionReduite } from '../../modules/outils.js'

export const titre = 'Calculs de fractions (dénominateurs multiples) avec priorités opératoires'

export const dateDePublication = '10/05/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
/**
* Effectuer des calculs mêlant fractions (dont un dénominateur est un multiple de l'autre) et priorités opératoires simples .
*
* Le résultat de la soustraction peut être négatif.
*
* Pour ne pas surcharger la difficulté, le coefficient est limité à 2, 3, 4 ou 5.

* @author Mireille Gain
* 5N20-1
*/
export const uuid = '75f80'
export const ref = '5N20-1'
export default function ExerciceAdditionnerSoustraireFractions5e (max = 5) {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = max // Correspond au facteur commun
  this.sup3 = true // Si false alors le résultat n'est pas en fraction simplifiée
  this.titre = titre
  this.consigne = 'Calculer.'
  this.spacing = 2
  this.spacingCorr = 3
  this.nbQuestions = 4
  this.nbColsCorr = 2

  this.nouvelleVersion = function () {
    if (this.sup3) {
      this.consigne = 'Calculer et simplifier au maximum le résultat.'
    } else {
      this.consigne = 'Calculer.'
    }
    this.sup = parseInt(this.sup)
    this.sup2 = parseInt(this.sup2)
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const typeQuestionsDisponibles = ['type1', 'type2', 'type3', 'type4'] // On crée 4 types de questions

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posés mais l'ordre diffère à chaque "cycle"
    for (let i = 0, a, b, c, d, e, k, n, s, ordreDesFractions, negOuPos, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) { // Boucle principale où i+1 correspond au numéro de la question
      // les numérateurs
      a = randint(1, 9)
      e = randint(1, 9)
      // les dénominateurs
      b = randint(2, 9, a)
      if (this.sup > 1) {
        k = randint(2, this.sup)
      } else k = 1
      d = b * k
      c = randint(1, 9, d)
      n = randint(2, 5)
      ordreDesFractions = randint(1, 2)
      negOuPos = randint(1, 2)

      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'type1':
          if (negOuPos === 1) {
            if (ordreDesFractions === 1) {
              texte = `$${texFraction(a, b)}+ ${n} \\times  ${texFraction(c, d)}=$`
            } else {
              texte = `$${texFraction(c, d)}+ ${n} \\times  ${texFraction(a, b)}=$`
            }

            if (ordreDesFractions === 1) {
              texteCorr = `$${texFraction(a, b)}+ ${n} \\times ${texFraction(c, d)}=`

              texteCorr += `${texFraction(a, b)}+ ${texFraction(n * c, d)}=`

              texteCorr += `${texFraction(a * k, d)}+ ${texFraction(n * c, d)}=`

              texteCorr += `${texFraction(a * k + '+' + n * c, d)}=${texFraction(a * k + n * c, d)}$`
            } else {
              texteCorr = `$${texFraction(c, d)}+ ${n} \\times ${texFraction(a, b)}=`

              texteCorr += `${texFraction(c, d)}+ ${texFraction(n * a, b)}=`

              texteCorr += `${texFraction(c, d)}+ ${texFraction(n * a * k, d)}=`

              texteCorr += `${texFraction(c + '+' + n * a * k, d)}=${texFraction(n * a * k + c, d)}$`
            }
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              if (ordreDesFractions === 1) {
                s = pgcd(a * k + n * c, d)
                if (s !== 1) {
                  texteCorr += `$=${texFraction(calcul((a * k + n * c) / s) + miseEnEvidence('\\times ' + s), calcul(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calcul((a * k + n * c) / s), calcul(d / s))}$`
                }
              } else {
                s = pgcd(n * a * k + c, d)
                if (s !== 1) {
                  texteCorr += `$=${texFraction(calcul((n * a * k + c) / s) + miseEnEvidence('\\times ' + s), calcul(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calcul((n * a * k + c) / s), calcul(d / s))}$`
                }
              }
            }
          } else {
            if (ordreDesFractions === 1) {
              texte = `$${texFraction(a, b)}- ${n} \\times  ${texFraction(c, d)}=$`
            } else {
              texte = `$${texFraction(c, d)}- ${n} \\times  ${texFraction(a, b)}=$`
            }

            if (ordreDesFractions === 1) {
              texteCorr = `$${texFraction(a, b)}- ${n} \\times ${texFraction(c, d)}=`

              texteCorr += `${texFraction(a, b)}- ${texFraction(n * c, d)}=`

              texteCorr += `${texFraction(a * k, d)}- ${texFraction(n * c, d)}=`

              texteCorr += `${texFraction(a * k + '-' + n * c, d)}=${texFraction(a * k - n * c, d)}$`
            } else {
              texteCorr = `$${texFraction(c, d)}- ${n} \\times ${texFraction(a, b)}=`

              texteCorr += `${texFraction(c, d)}- ${texFraction(n * a, b)}=`

              texteCorr += `${texFraction(c, d)}- ${texFraction(n * a * k, d)}=`

              texteCorr += `${texFraction(c + '-' + n * a * k, d)}=`

              texteCorr += `${texFraction(c - n * a * k, d)}$`
            }
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              if (ordreDesFractions === 1) {
                s = pgcd(a * k - n * c, d)
                if (s !== 1) {
                  texteCorr += `$=${texFraction(calcul((a * k - n * c) / s) + miseEnEvidence('\\times ' + s), calcul(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calcul((a * k - n * c) / s), calcul(d / s))}$`
                }
              } else {
                s = pgcd(n * a * k - c, d)
                if (s !== 1) {
                  texteCorr += `$=${texFraction(calcul((c - n * a * k) / s) + miseEnEvidence('\\times ' + s), calcul(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calcul((c - n * a * k) / s), calcul(d / s))}$`
                }
              }
            }
          }
          break
        case 'type2':

          if (ordreDesFractions === 2) {
            texte = `$${texFraction(a, b)}- (${texFraction(c, b)} + ${texFraction(e, d)})=$`
          } else {
            texte = `$${texFraction(a, b)}- (${texFraction(c, d)} + ${texFraction(e, b)})=$`
          }

          if (ordreDesFractions === 2) {
            texteCorr = `$${texFraction(a, b)}- (${texFraction(c, b)} + ${texFraction(e, d)})=`

            texteCorr += `${texFraction(a, b)} - ( ${texFraction(k * c, d)} + ${texFraction(e, d)})=`

            texteCorr += `${texFraction(a, b)} -  ${texFraction(k * c + e, d)}=`

            texteCorr += `${texFraction(a * k, d)} - ${texFraction(k * c + e, d)}=`

            texteCorr += `${texFraction(a * k - c * k - e, d)}$`
          } else {
            texteCorr = `$${texFraction(a, b)}- (${texFraction(c, d)} + ${texFraction(e, b)})=`

            texteCorr += `${texFraction(a, b)} - ( ${texFraction(c, d)} + ${texFraction(k * e, d)})=`

            texteCorr += `${texFraction(a, b)} -  ${texFraction(c + k * e, d)}=`

            texteCorr += `${texFraction(a * k, d)} - ${texFraction(c + k * e, d)}=`

            texteCorr += `${texFraction(a * k - c - k * e, d)}$`
          }
          // Est-ce que le résultat est simplifiable ?
          if (this.sup3) {
            if (ordreDesFractions === 2) {
              s = pgcd(a * k - c * k - e, d)
              if (s !== 1) {
                texteCorr += `$=${texFraction(calcul((a * k - c * k - e) / s) + miseEnEvidence('\\times ' + s), calcul(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calcul((a * k - c * k - e) / s), calcul(d / s))}$`
              }
            } else {
              s = pgcd(a * k - c - k * e, d)
              if (s !== 1) {
                texteCorr += `$=${texFraction(calcul((a * k - c - k * e) / s) + miseEnEvidence('\\times ' + s), calcul(d / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calcul((a * k - c - k * e) / s), calcul(d / s))}$`
              }
            }
          }
          break
        case 'type3':
          if (negOuPos === 2) {
            texte = `$${texFraction(a, b)} + ${n}$`
            texteCorr = `$${texFraction(a, b)} + ${n}=`
            texteCorr += `${texFraction(a, b)} + ${texFraction(n * b, b)}=`
            texteCorr += `${texFraction(a + n * b, b)}$`
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              s = pgcd(a + n * b, b)
              if (s !== 1) {
                texteCorr += `$=${texFraction(calcul((a + n * b) / s) + miseEnEvidence('\\times ' + s), calcul(b / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calcul((a + n * b) / s), calcul(b / s))}$`
              }
            }
          } else {
            texte = `$${texFraction(a, b)} - ${n}$`
            texteCorr = `$${texFraction(a, b)} - ${n}=`
            texteCorr += `${texFraction(a, b)} - ${texFraction(n * b, b)}=`
            texteCorr += `${texFraction(a - n * b, b)}$`
            // Est-ce que le résultat est simplifiable ?
            if (this.sup3) {
              s = pgcd(a - n * b, b)
              if (s !== 1) {
                texteCorr += `$=${texFraction(calcul((a - n * b) / s) + miseEnEvidence('\\times ' + s), calcul(b / s) + miseEnEvidence('\\times ' + s))}=${texFractionReduite(calcul((a - n * b) / s), calcul(b / s))}$`
              }
            }
          }
          break
        case 'type4':
          texte = `$${texFraction(a, b)}-${texFraction(c, d)}+${texFraction(e, b)}$`

          texteCorr = `$${texFraction(a, b)}-${texFraction(c, d)}+${texFraction(e, b)}=`
          texteCorr += `${texFraction(a * k, b * k)}-${texFraction(c, d)}+${texFraction(e * k, b * k)}=`
          texteCorr += `${texFraction(a * k + '-' + c + '+' + e * k, d)}=`
          texteCorr += `${texFraction(a * k - c + e * k, d)}$`
          // Est-ce que le résultat est simplifiable ?
          if (this.sup3) {
            s = pgcd(a * k - c + e * k, d)
            if (s !== 1) {
              texteCorr += `$=${texFraction(calcul((a * k - c + e * k) / s) + miseEnEvidence('\\times' + s), calcul(d / s) + miseEnEvidence('\\times' + s))}=${texFractionReduite(calcul((a * k - c + e * k) / s), calcul(d / s))}$`
            }
          }
          break
      }

      if (this.questionJamaisPosee(i, a, k, b, c)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
    }
    listeQuestionsToContenu(this) // Espacement de 2 em entre chaque questions.
  }

  this.besoinFormulaireNumerique = ['Valeur maximale du coefficient multiplicateur', 99999]
  this.besoinFormulaire3CaseACocher = ['Avec l\'écriture simplifiée de la fraction résultat']
}
