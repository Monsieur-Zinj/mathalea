import { choice } from '../../../lib/outils/arrayOutils'
import { simplificationDeFractionAvecEtapes, texFractionReduite } from '../../../lib/outils/deprecatedFractions.js'
import { ecritureAlgebriqueSauf1, reduireAxPlusB, rienSi1 } from '../../../lib/outils/ecritures'
import { abs } from '../../../lib/outils/nombres'
import Exercice from '../../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { propositionsQcm } from '../../../lib/interactif/qcm.js'
export const titre = 'Donner le sens de variation d’une fonction affine'
export const interactifReady = true
export const interactifType = 'qcm'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '19/05/2023' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export const uuid = 'a3e06'
export const ref = 'can2F15'
export const refs = {
  'fr-fr': ['can2F15'],
  'fr-ch': []
}
export default function VariationFA () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 1.3

  this.spacing = 1
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    let texte, texteCorr, a, b, d, props
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      a = randint(-10, 10, 0) // coefficient a de la fonction affine
      b = randint(-10, 10) // coefficient b de la fonction affine
      d = choice([abs(a) + 1, abs(b) + 1]) // dénominateur
      while (d === 1) {
        a = randint(-10, 10, 0) // coefficient a de la fonction affine
        b = randint(-10, 10) // coefficient b de la fonction affine
        d = choice([abs(a) + 1, abs(b) + 1])
      } // dénominateur
      const nom = [
        ['f'], ['g'], ['h'], ['u'],
        ['v'], ['w']
      ]
      const nomF = choice(nom)
      switch (choice([1, 1, 2, 2, 3])) {
        case 1:
          texte = `Donner le sens de variation de la fonction $${nomF}$ définie sur $\\mathbb R$ par : `
          if (choice([true, false])) {
            texte += `$${nomF}(x)=${reduireAxPlusB(a, b)}$.`
          } else {
            texte += `$${b === 0 ? `${nomF}(x)=${rienSi1(a)}x` : `${nomF}(x)=${b}${ecritureAlgebriqueSauf1(a)}x`}$.`
          }
          if (a > 0) {
            this.autoCorrection[i] = {
              enonce: texte,
              options: { horizontal: true },
              propositions: [
                {
                  texte: `$${nomF}$ est croissante  sur $\\mathbb R$`,
                  statut: true
                },
                {
                  texte: `$${nomF}$ est décroissante  sur $\\mathbb R$`,
                  statut: false
                },
                {
                  texte: `$${nomF}$ est constante  sur $\\mathbb R$`,
                  statut: false
                }
              ]
            }
          } else {
            this.autoCorrection[i] = {
              enonce: texte,
              options: { horizontal: true },
              propositions: [
                {
                  texte: `$${nomF}$ est décroissante  sur $\\mathbb R$`,
                  statut: true
                },
                {
                  texte: `$${nomF}$ est croissante  sur $\\mathbb R$`,
                  statut: false
                },
                {
                  texte: `$${nomF}$ est constante  sur $\\mathbb R$`,
                  statut: false
                }
              ]
            }
          }
          props = propositionsQcm(this, i)
          if (this.interactif) texte += props.texte

          texteCorr = `On reconnaît que $${nomF}$ est une fonction affine, de la forme $${nomF}(x)=ax+b$, `
          texteCorr += `avec $a=${a}~$ et $b=${b}$. <br>
    On sait qu'une fonction affine est monotone sur $\\mathbb{R}$.<br>
      Son sens de variation dépend du signe de $a$.<br>`
          if (a > 0) {
            texteCorr += `Comme $a=${a}>0$ , la fonction $${nomF}$ est strictement croissante sur $\\mathbb{R}$.<br>`
          } else {
            texteCorr += `Comme $a=${a}<0$ , la fonction $${nomF}$ est strictement décroissante sur $\\mathbb{R}$.<br>`
          }
          break

        case 2:
          texte = `Donner le sens de variation de la fonction $${nomF}$ définie sur $\\mathbb R$ par : `
          if (choice([true, false])) {
            texte += `$${nomF}(x)=\\dfrac{${reduireAxPlusB(a, b)}}{${d}}$.`
          } else {
            texte += `$${b === 0 ? `${nomF}(x)=\\dfrac{${rienSi1(a)}x}{${d}}` : `${nomF}(x)=\\dfrac{${b}${ecritureAlgebriqueSauf1(a)}x}{${d}}`}$.`
          }
          if (a > 0) {
            this.autoCorrection[i] = {
              enonce: texte,
              options: { horizontal: true },
              propositions: [
                {
                  texte: `$${nomF}$ est croissante  sur $\\mathbb R$`,
                  statut: true
                },
                {
                  texte: `$${nomF}$ est décroissante  sur $\\mathbb R$`,
                  statut: false
                },
                {
                  texte: `$${nomF}$ est constante  sur $\\mathbb R$`,
                  statut: false
                }
              ]
            }
          } else {
            this.autoCorrection[i] = {
              enonce: texte,
              options: { horizontal: true },
              propositions: [
                {
                  texte: `$${nomF}$ est décroissante  sur $\\mathbb R$`,
                  statut: true
                },
                {
                  texte: `$${nomF}$ est croissante  sur $\\mathbb R$`,
                  statut: false
                },
                {
                  texte: `$${nomF}$ est constante  sur $\\mathbb R$`,
                  statut: false
                }
              ]
            }
          }
          props = propositionsQcm(this, i)
          if (this.interactif) texte += props.texte

          texteCorr = `On reconnaît que $${nomF}$ est une fonction affine, de la forme $${nomF}(x)=ax+b$, `
          texteCorr += `avec $a=\\dfrac{${a}}{${d}}${simplificationDeFractionAvecEtapes(a, d)}$ et $b=\\dfrac{${b}}{${d}}${simplificationDeFractionAvecEtapes(b, d)}$. <br>
        On sait qu'une fonction affine est monotone sur $\\mathbb{R}$.<br>
          Son sens de variation dépend du signe de $a$.<br>`
          if (a > 0) {
            texteCorr += `Comme $a=${texFractionReduite(a, d)}>0$ , la fonction $${nomF}$ est strictement croissante sur $\\mathbb{R}$.<br>`
          } else {
            texteCorr += `Comme $a=${texFractionReduite(a, d)}<0$ , la fonction $${nomF}$ est strictement décroissante sur $\\mathbb{R}$.<br>`
          }
          break
        case 3:
          texte = `Donner le sens de variation de la fonction $${nomF}$ définie sur $\\mathbb R$ par :
            $${nomF}(x)=${b}$`

          this.autoCorrection[i] = {
            enonce: texte,
            options: { horizontal: true },
            propositions: [
              {
                texte: `$${nomF}$ est décroissante  sur $\\mathbb R$`,
                statut: false
              },
              {
                texte: `$${nomF}$ est croissante  sur $\\mathbb R$`,
                statut: false
              },
              {
                texte: `$${nomF}$ est constante  sur $\\mathbb R$`,
                statut: true
              }
            ]
          }

          props = propositionsQcm(this, i)
          if (this.interactif) texte += props.texte

          texteCorr = `On reconnaît que $${nomF}$ est une fonction affine, de la forme $${nomF}(x)=ax+b$, `
          texteCorr += `avec $a=0$ et $b=${b}$. <br>
      Il s'agit d'une fonction constante (fonction affine particulière).`

          break
      }
      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on la stocke dans la liste des questions
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.canEnonce = texte
        this.canReponseACompleter = ''
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
