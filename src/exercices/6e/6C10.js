import { grille, seyes } from '../../lib/2d/reperes.js'
import { nombreDeChiffresDe } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Operation from '../../modules/operations.js'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { mathalea2d, vide2d } from '../../modules/2dGeneralites.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'

export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Poser additions, soustractions et multiplications de nombres entiers'

/**
 * Additions, soustractions et multiplications posées de nombres entiers
 *
 * * abcd +efg
 * * abc0-efg
 * * 1abc-def
 * * abc*d0e tables de 2 à 5
 * * abc*de tables de 5 à 9
 * @author Rémi Angot
 * Support des opérations posées en html par Jean-Claude Lhote.
 * Référence 6C10
 */
export const uuid = 'cfa6a'
export const ref = '6C10'
export const refs = {
  'fr-fr': ['6C10'],
  'fr-ch': ['9NO3-1']
}
export default function AdditionsSoustractionsMultiplicationsPosees () {
  Exercice.call(this)
  this.consigne = 'Poser et effectuer les calculs suivants.'
  this.spacing = 2
  context.isHtml ? (this.spacingCorr = 2) : (this.spacingCorr = 1) // Important sinon les opérations posées ne sont pas jolies
  this.nbQuestions = 5
  this.tailleDiaporama = 3

  this.besoinFormulaireTexte = ['Types de calculs', 'Nombres séparés par des tirets\n1 : abcde + fgh\n2 : abc0 - efg\n3 : 1abc - def\n4 : abc * d0e (tables de 2 à 5)\n5 : abc * de (tables de 5 à 9)\n6 : Mélange']
  this.besoinFormulaire2Numerique = [
    'Type de cahier',
    3,
    ' 1 : Cahier à petits carreaux\n 2 : Cahier à gros carreaux (Seyes)\n 3 : Feuille blanche'
  ]
  this.besoinFormulaire3CaseACocher = ['Opérations posées dans l\'énoncé', false]
  // this.besoinFormulaire4CaseACocher = ['Couleurs pour élève dys', false]
  this.sup = 6
  this.sup2 = 3
  this.sup3 = false
  this.sup4 = false

  this.nouvelleVersion = function () {
    let typesDeQuestions, reponse
    this.consigne = this.sup3 ? 'effectuer les opérations suivantes' : 'Poser et effectuer les calculs suivants.'
    const colore = this.sup4 ? 'Colore' : ''

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      max: 5,
      defaut: randint(1, 5),
      nbQuestions: this.nbQuestions,
      melange: 6,
      saisie: this.sup
    })

    let grilletxt
    if (this.sup2 < 3) {
      const g = (this.sup2 < 3 ? grille(0, 0, 5, 8, 'gray', 0.7) : vide2d())
      const carreaux = (this.sup2 === 2 ? seyes(0, 0, 5, 8) : vide2d())
      const sc = (this.sup2 === 2 ? 0.8 : 0.5)
      const params = { xmin: 0, ymin: 0, xmax: 5, ymax: 8, pixelsParCm: 20, scale: sc }
      grilletxt = '<br>' + mathalea2d(params, g, carreaux)
    } else {
      grilletxt = ''
    }

    for (let i = 0, texte, texteCorr, cpt = 0, a, b, c, d, e, f, g, x, y; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      this.autoCorrection[i] = {}
      switch (typesDeQuestions) {
        case 1: // abcde + fgh
          a =
                        randint(1, 9) * 10000 +
                        randint(5, 9) * 1000 +
                        randint(5, 9) * 100 +
                        randint(7, 9) * 10 +
                        randint(1, 9)
          b = randint(5, 9) * 100 + randint(7, 9) * 10 + randint(1, 9)
          texte = `$${texNombre(a, 0)}+${b}`
          if (this.interactif && !context.isAmc) texte += '=$' + ajouteChampTexteMathLive(this, i, 'inline clavierDeBase') // fonction à utiliser pour la version en ligne afin d'ajouter le formulaire de réponse
          else texte += '$'
          texte += grilletxt
          reponse = a + b
          texteCorr = Operation({ colore, operande1: a, operande2: b, type: 'addition' })
          if (this.sup3) {
            texte = Operation({ colore, operande1: a, operande2: b, type: 'addition', options: { solution: false } })
          }
          break
        case 2: // abc0 - efg
          a = randint(1, 9)
          b = randint(1, 9)
          c = randint(1, 9)
          e = randint(b, 9)
          f = randint(c, 9)
          g = randint(2, 9)
          x = a * 1000 + b * 100 + c * 10
          y = e * 100 + f * 10 + g
          texte = `$${texNombre(x, 0)}-${y}`
          if (this.interactif && !context.isAmc) texte += '=$' + ajouteChampTexteMathLive(this, i, 'inline clavierDeBase') // fonction à utiliser pour la version en ligne afin d'ajouter le formulaire de réponse
          else texte += '$'
          texte += grilletxt
          reponse = x - y
          texteCorr = Operation({ colore, operande1: x, operande2: y, type: 'soustraction' })
          if (this.sup3) {
            texte = Operation({ colore, operande1: x, operande2: y, type: 'soustraction', options: { solution: false } })
          }
          break
        case 3: // 1abc - def
          a = randint(1, 9)
          b = randint(1, 9)
          c = randint(1, 9)
          d = randint(a, 9)
          e = randint(1, 9)
          f = randint(c, 9)
          x = 1000 + a * 100 + b * 10 + c
          y = d * 100 + e * 10 + f
          texte = `$${texNombre(x, 0)}-${y}`
          if (this.interactif && !context.isAmc) texte += '=$' + ajouteChampTexteMathLive(this, i, 'inline clavierDeBase') // fonction à utiliser pour la version en ligne afin d'ajouter le formulaire de réponse
          else texte += '$'
          texte += grilletxt
          reponse = x - y
          texteCorr = Operation({ colore, operande1: x, operande2: y, type: 'soustraction' })
          if (this.sup3) {
            texte = Operation({ colore, operande1: x, operande2: y, type: 'soustraction', options: { solution: false } })
          }
          break
        case 4: // abc * d0e tables de 2 à 5
          a = randint(2, 5)
          b = randint(2, 5)
          c = randint(2, 5)
          d = randint(2, 5)
          e = randint(2, 5)
          x = 100 * a + 10 * b + c
          y = d * 100 + e
          texte = `$${texNombre(x, 0)}\\times${y}`
          if (this.interactif && !context.isAmc) texte += '=$' + ajouteChampTexteMathLive(this, i, 'inline clavierDeBase') // fonction à utiliser pour la version en ligne afin d'ajouter le formulaire de réponse
          else texte += '$'
          texte += grilletxt
          reponse = x * y
          texteCorr = Operation({ colore, operande1: x, operande2: y, type: 'multiplication' })
          if (this.sup3) {
            texte = Operation({ colore, operande1: x, operande2: y, type: 'multiplication', options: { solution: false } })
          }
          break
        case 5: // abc * de tables de 5 à 9
          a = randint(5, 9)
          b = randint(5, 9)
          c = randint(5, 9)
          d = randint(5, 9)
          e = randint(5, 9)
          x = 100 * a + 10 * b + c
          y = 10 * d + e
          texte = `$${x}\\times${y}`
          if (this.interactif && !context.isAmc) texte += '=$' + ajouteChampTexteMathLive(this, i, 'inline clavierDeBase') // fonction à utiliser pour la version en ligne afin d'ajouter le formulaire de réponse
          else texte += '$'
          texte += grilletxt
          reponse = x * y
          texteCorr = Operation({ colore, operande1: x, operande2: y, type: 'multiplication' })
          if (this.sup3) {
            texte = Operation({ colore, operande1: x, operande2: y, type: 'multiplication', options: { solution: false } })
          }
          break
      }

      if (this.questionJamaisPosee(i, a, b, c, d, e, f, g)) {
        // Si la question n'a jamais été posée, on l'enregistre
        this.listeQuestions.push(texte)
        if (!context.isHtml && i === 0) {
          texteCorr = '\\setlength\\itemsep{2em}' + texteCorr
        } // espacement entre les questions
        this.listeCorrections.push(texteCorr)
        if (!context.isAmc) {
          setReponse(this, i, reponse, { digits: 0 }) // fonction qui va renseigner this.autocorrection[i]
        } else {
          this.autoCorrection[i] = {
            enonce: '',
            enonceAvant: false,
            propositions: [
              {
                type: 'AMCOpen',
                propositions: [{
                  enonce: 'Poser et effectuer l\'opération suivante : ' + texte,
                  texte: texteCorr,
                  statut: 3,
                  pointilles: false
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  reponse: {
                    texte: 'Résultat de l\'opération : ',
                    valeur: [reponse],
                    param: {
                      digits: nombreDeChiffresDe(reponse),
                      decimals: 0,
                      signe: false,
                      approx: 0
                    }
                  }
                }]
              }
            ]
          }
        }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
