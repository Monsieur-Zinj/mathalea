import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { ecritureAlgebrique, ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { nombreDeChiffresDansLaPartieEntiere, range1 } from '../../lib/outils/nombres'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenuSansNumero, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

export const titre = 'Calculer en utilisant les priorités opératoires et les puissances'
export const dateDePublication = '23/01/2023'
export const dateDeModifImportante = '17/09/2023'

/**
 * Plusieurs types de calcul avec priorités opératoires/ relatifs/ puissances
 *
 * Sans parenthèses :
 * * a²+b*c
 * * a+b²*c
 * * a²+b+c*d
 *
 * * a²*b+c
 * * a*b²+c
 * * a²+b+c
 * * a+b²+c
 * * a+b+c²
 * * a+b²+c*d
 * * a+b+c²*d
 * * a+b+c*d²
 * * a²*b+c*d
 * * a*b+c*d²
 *
 * Avec parenthèses :
 * * a²*(b+c)
 * * a*(b²+c*d)
 * * (a+b+c²)*d
 * * d²(a+b+c)
 *
 * * a*(b²+c)
 * * a*(b+c²)
 * * (a²+b)*c
 * * (a+b²)*c
 * * (a+b)*c²
 * * a²*(b+c)*d
 * * a*(b²+c)*d
 * * a*(b+c²)*d
 * * a*(b+c)*d²
 * * a²*b*(c+d)
 * * a*b²*(c+d)
 * * a*b*(c²+d)
 * * a*b*(c+d²)
 * * a²*(b+c*d)
 * * a*(b+c²*d)
 * * a*(b+c*d²)
 * * a²+(b+c)
 * * a+(b²+c)
 * * a+(b+c²)
 * * (a²+b+c)*d
 * * (a+b²+c)*d
 * @author Mireille Gain
 * Ajout de l'interactivité par Guillaume Valmont le 2021-11-20
 */
export const uuid = '2d79c'
export const ref = '4C34'
export const refs = {
  'fr-fr': ['4C34'],
  'fr-ch': ['10NO6-1']
}
export default function PrioritesEtRelatifsEtPuissances () {
  Exercice.call(this)
  this.consigne = 'Calculer.'
  this.nbQuestions = 5
  this.nbCols = 1
  this.nbColsCorr = 1
  this.tailleDiaporama = 3
  this.video = 'https://youtu.be/0G9xWLl-0zg' // Id YouTube ou url
  this.spacing = context.isHtml ? 3 : 1
  this.spacingCorr = context.isHtml ? 3 : 1
  this.listeAvecNumerotation = false
  this.sup = false

  this.nouvelleVersion = function () {
    if (this.sup) this.amcType = 'AMCNum'
    let reponse
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    const listeQuestionsDisponibles = range1(7)

    const listeTypeDeQuestions = combinaisonListes(
      listeQuestionsDisponibles,
      this.nbQuestions
    )
    for (
      let i = 0, texte, texteCorr, a, b, c, d, m, n, p, cpt = 0;
      i < this.nbQuestions && cpt < 50;) {
      a = randint(2, 7) * choice([-1, 1])
      b = randint(1, 7) * choice([-1, 1])
      c = randint(1, 7) * choice([-1, 1])
      d = randint(1, 7) * choice([-1, 1])
      m = randint(1, 5) * choice([-1, 1])
      n = randint(1, 3) * (-1)
      p = randint(2, 3)
      this.autoCorrection[i] = {}
      switch (listeTypeDeQuestions[i]) {
        case 1: // a² + b*c
          texte = `$${lettreDepuisChiffre(i + 1)} = ${ecritureParentheseSiNegatif(a)}^2 +  ${ecritureParentheseSiNegatif(b)} \\times ${ecritureParentheseSiNegatif(c)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}=${miseEnEvidence(ecritureParentheseSiNegatif(a) + '^2', 'blue')}  +  ${ecritureParentheseSiNegatif(b)} \\times ${ecritureParentheseSiNegatif(c)}$`

          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${a * a} + ${miseEnEvidence((ecritureParentheseSiNegatif(b) + '\\times' + ecritureParentheseSiNegatif(c)), 'blue')}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${a * a} ${ecritureAlgebrique(b * c)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(a * a + b * c)}$`

          reponse = a * a + b * c
          break

        case 2: // a + b²*c
          texte = `$${lettreDepuisChiffre(i + 1)} = ${a} + ${ecritureParentheseSiNegatif(p)}^2 \\times ${ecritureParentheseSiNegatif(c)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}          =${a} + ${miseEnEvidence(ecritureParentheseSiNegatif(p) + '^2', 'blue')} \\times ${ecritureParentheseSiNegatif(c)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${a} + ${miseEnEvidence(ecritureParentheseSiNegatif(p * p) + '\\times' + ecritureParentheseSiNegatif(c), 'blue')}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${a + ecritureAlgebrique(p * p * c)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(a + p * p * c)}$`
          reponse = a + p * p * c
          break

        case 3: // a²+b+c*d
          texte = `$${lettreDepuisChiffre(i + 1)} = ${ecritureParentheseSiNegatif(a)}^2   ${ecritureAlgebrique(b)} ${ecritureAlgebrique(c)} \\times ${ecritureParentheseSiNegatif(d)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}        =${miseEnEvidence(ecritureParentheseSiNegatif(a) + '^2', 'blue')} ${ecritureAlgebrique(b)}  ${ecritureAlgebrique(c)} \\times ${ecritureParentheseSiNegatif(d)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${a * a} ${ecritureAlgebrique(b)} +  ${miseEnEvidence((ecritureParentheseSiNegatif(c) + '\\times' + ecritureParentheseSiNegatif(d)), 'blue')}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${a * a + ecritureAlgebrique(b) + ecritureAlgebrique(c * d)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(a * a + b + c * d)}$`
          reponse = a * a + b + c * d
          break

        case 4: // a²*(b+c)
          texte = `$${lettreDepuisChiffre(i + 1)} = ${ecritureParentheseSiNegatif(n)}^2 \\times ( ${b + ecritureAlgebrique(c)})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}          =${miseEnEvidence(ecritureParentheseSiNegatif(n) + '^2', 'blue')}  \\times ( ${b + ecritureAlgebrique(c)})$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${n * n} \\times ( ${miseEnEvidence(b + ecritureAlgebrique(c), 'blue')})$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${n * n} \\times ${ecritureParentheseSiNegatif(b + c)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(n * n * (b + c))}$`
          reponse = n * n * (b + c)
          break

        case 5: // m*(n²+p*n)
          texte = `$${lettreDepuisChiffre(i + 1)} = ${m} \\times ( ${ecritureParentheseSiNegatif(n)}^2${ecritureAlgebrique(p)}\\times${ecritureParentheseSiNegatif(n)})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}            =${m} \\times ( ${miseEnEvidence(ecritureParentheseSiNegatif(n) + '^2', 'blue')} ${ecritureAlgebrique(p)}\\times${ecritureParentheseSiNegatif(n)})$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${m} \\times ( ${n * n} + ${miseEnEvidence(ecritureParentheseSiNegatif(p) + '\\times' + ecritureParentheseSiNegatif(n), 'blue')})$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${m}\\times ( ${miseEnEvidence((n * n + ecritureAlgebrique(p * n)), 'blue')})$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${m}\\times ${ecritureParentheseSiNegatif(n * n + p * n)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(m * (n * n + p * n))}$`
          reponse = m * (n * n + p * n)
          break

        case 6: // (a+b+n²)*d
          texte = `$${lettreDepuisChiffre(i + 1)} = (${a} ${ecritureAlgebrique(b)} + ${ecritureParentheseSiNegatif(n)}^2 ) \\times ${ecritureParentheseSiNegatif(d)}$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}              =(${a} + ${ecritureParentheseSiNegatif(b)} + ${miseEnEvidence(ecritureParentheseSiNegatif(n) + '^2', 'blue')}  ) \\times ${ecritureParentheseSiNegatif(d)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=(${miseEnEvidence((a + ecritureAlgebrique(b) + ecritureAlgebrique(n * n)), 'blue')}) \\times ${ecritureParentheseSiNegatif(d)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${a + b + n * n} \\times ${ecritureParentheseSiNegatif(d)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence((a + b + n * n) * d)}$`
          reponse = (a + b + n * n) * d
          break

        case 7: // n²*(a+b+c)
          texte = `$${lettreDepuisChiffre(i + 1)} = ${ecritureParentheseSiNegatif(n)}^2 \\times ( ${a + ecritureAlgebrique(b) + ecritureAlgebrique(c)})$`
          texteCorr = `$${lettreDepuisChiffre(i + 1)}                =${miseEnEvidence(ecritureParentheseSiNegatif(n) + '^2', 'blue')} \\times ( ${a} ${ecritureAlgebrique(b)} ${ecritureAlgebrique(c)})$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${n * n} \\times ( ${miseEnEvidence(a + ecritureAlgebrique(b) + ecritureAlgebrique(c), 'blue')})$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)}=${n * n} \\times ${ecritureParentheseSiNegatif(a + b + c)}$`
          texteCorr += '<br>' + `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence((a + b + c) * n * n)}$`
          reponse = n * n * (a + b + c)
          break
      }
      if (this.questionJamaisPosee(i, texte)) {
        // Si la question n'a jamais été posée, on en créé une autre
        if (!context.isAmc && this.interactif) { // On vérifie qu'on est pas en AMC pour vérifier qu'on ne casse rien à ce qui a été fait pour AMC
          setReponse(this, i, reponse)
          texte += ' =' + ajouteChampTexteMathLive(this, i, 'inline largeur 25')
        } else if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: texte,
            enonceAvant: false,
            propositions: [
              {
                type: 'AMCOpen',
                propositions: [{
                  enonce: texte + '\\\\',
                  texte: texteCorr,
                  statut: 3,
                  pointilles: true,
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
                    texte: 'résultat',
                    valeur: reponse,
                    param: {
                      digits: Math.max(2, nombreDeChiffresDansLaPartieEntiere(reponse)),
                      decimals: 0,
                      signe: true,
                      exposantNbChiffres: 0,
                      exposantSigne: false
                    }
                  }
                }]
              }
            ]
          }
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireCaseACocher = ['AMC : Que la réponse numérique (pas de question ouverte)', 'false']
}
