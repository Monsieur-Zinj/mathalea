import { propositionsQcm } from '../../../lib/interactif/qcm.js'
import { tableauDeVariation } from '../../../lib/mathFonctions/etudeFonction.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { texFractionReduite } from '../../../lib/outils/deprecatedFractions.js'
import { reduireAxPlusB } from '../../../lib/outils/ecritures'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'

export const titre = 'Dresser le tableau de signes d’une fonction affine'
export const interactifReady = true
export const interactifType = 'qcm'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '15/12/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 */
export const uuid = '73ab4'
export const ref = 'can2F06'
export const refs = {
  'fr-fr': ['can2F06'],
  'fr-ch': []
}
export default function TableauSignes () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 1.3
  this.listePackages = ['tkz-tab']
  this.spacing = 1
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    let texte, texteCorr, a, b, ligne1
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (a === 0 && b === 0) { // On évite la fonction nulle
        a = 1
      }
      if (this.interactif) {
        a = randint(1, 6) * choice([-1, 1])// coefficient a de la fonction affine
        b = randint(1, 6) * choice([-1, 1])// coefficient b de la fonction affine
        texte = `Quel est le tableau de signes de la fonction $f$ définie sur  $\\mathbb R$ par $f(x)=${reduireAxPlusB(a, b)}$ ? `
        if (a > 0) {
          this.autoCorrection[i] = {
            enonce: texte,
            options: { vertical: true },
            propositions: [
              {
                texte: tableauDeVariation({
                  tabInit: [
                    [
                      // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                      ['$x$', 2, 30], ['$f(x)$', 2, 50]
                    ],
                    // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                    ['$-\\infty$', 30, `$${texFractionReduite(-b, a)}$`, 20, '$+\\infty$', 30]
                  ],
                  // tabLines ci-dessous contient les autres lignes du tableau.
                  tabLines: [['Line', 30, '', 0, '-', 20, 'z', 20, '+']],
                  colorBackground: '',
                  espcl: 3.5, // taille en cm entre deux antécédents
                  deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
                  lgt: 5,
                  scale: 1
                }),
                statut: true
              },
              {
                texte: tableauDeVariation({
                  tabInit: [
                    [
                      // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                      ['$x$', 2, 30], ['$f(x)$', 2, 50]
                    ],
                    // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                    ['$-\\infty$', 30, `$${texFractionReduite(b, a)}$`, 20, '$+\\infty$', 30]
                  ],
                  // tabLines ci-dessous contient les autres lignes du tableau.
                  tabLines: [['Line', 30, '', 0, '-', 20, 'z', 20, '+']],
                  colorBackground: '',
                  espcl: 3.5, // taille en cm entre deux antécédents
                  deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
                  lgt: 5,
                  scale: 1
                }),
                statut: false
              },
              {
                texte: tableauDeVariation({
                  tabInit: [
                    [
                      // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                      ['$x$', 2, 30], ['$f(x)$', 2, 50]
                    ],
                    // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                    ['$-\\infty$', 30, `$${texFractionReduite(-b, a)}$`, 20, '$+\\infty$', 30]
                  ],
                  // tabLines ci-dessous contient les autres lignes du tableau.
                  tabLines: [['Line', 30, '', 0, '+', 20, 'z', 20, '-']],
                  colorBackground: '',
                  espcl: 3.5, // taille en cm entre deux antécédents
                  deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
                  lgt: 5, // taille de la première colonne en cm
                  scale: 1
                }),
                statut: false
              }
            ]
          }
        } else {
          this.autoCorrection[i] = {
            enonce: texte,
            options: { vertical: true },
            propositions: [
              {
                texte: tableauDeVariation({
                  tabInit: [
                    [
                      // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                      ['$x$', 2, 30], ['$f(x)$', 2, 50]
                    ],
                    // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                    ['$-\\infty$', 30, `$${texFractionReduite(-b, a)}$`, 20, '$+\\infty$', 30]
                  ],
                  // tabLines ci-dessous contient les autres lignes du tableau.
                  tabLines: [['Line', 30, '', 0, '+', 20, 'z', 20, '-']],
                  colorBackground: '',
                  espcl: 3.5, // taille en cm entre deux antécédents
                  deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
                  lgt: 5, // taille de la première colonne en cm
                  scale: 1
                }),
                statut: true
              },
              {
                texte: tableauDeVariation({
                  tabInit: [
                    [
                      // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                      ['$x$', 2, 30], ['$f(x)$', 2, 50]
                    ],
                    // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                    ['$-\\infty$', 30, `$${texFractionReduite(b, a)}$`, 20, '$+\\infty$', 30]
                  ],
                  // tabLines ci-dessous contient les autres lignes du tableau.
                  tabLines: [['Line', 30, '', 0, '+', 20, 'z', 20, '-']],
                  colorBackground: '',
                  espcl: 3.5, // taille en cm entre deux antécédents
                  deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
                  lgt: 5, // taille de la première colonne en cm
                  scale: 1
                }),
                statut: false
              },
              {
                texte: tableauDeVariation({
                  tabInit: [
                    [
                      // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                      ['$x$', 2, 30], ['$f(x)$', 2, 50]
                    ],
                    // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                    ['$-\\infty$', 30, `$${texFractionReduite(-b, a)}$`, 20, '$+\\infty$', 30]
                  ],
                  // tabLines ci-dessous contient les autres lignes du tableau.
                  tabLines: [['Line', 30, '', 0, '-', 20, 'z', 20, '+']],
                  colorBackground: '',
                  espcl: 3.5, // taille en cm entre deux antécédents
                  deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
                  lgt: 5, // taille de la première colonne en cm
                  scale: 1
                }),
                statut: false
              }
            ]
          }
        }
        texte += propositionsQcm(this, i).texte
      } else {
        a = randint(1, 6) * choice([-1, 1])// coefficient a de la fonction affine
        b = randint(0, 6) * choice([-1, 1])// coefficient b de la fonction affine
        texte = `Dresser le tableau de signes de la fonction $f$ définie sur  $\\mathbb R$ par $f(x)=${reduireAxPlusB(a, b)}$. `
      }

      texteCorr = `$f$ est une fonction affine. Elle s’annule en $x_0=${texFractionReduite(-b, a)}$. `
      if (a > 0) {
        texteCorr += `<br>Comme $${a}>0~$, $~f(x)$ est positif pour $~x>${texFractionReduite(-b, a)} ~$ et négatif pour $~x<${texFractionReduite(-b, a)} $.<br>`
        ligne1 = ['Line', 30, '', 0, '-', 20, 'z', 20, '+']
      } else {
        texteCorr += `<br>Comme $${a}<0$,  $f(x)~$ est négatif pour $~x>${texFractionReduite(-b, a)} ~$ et positif pour $~x<${texFractionReduite(-b, a)} $.<br>`
        ligne1 = ['Line', 30, '', 0, '+', 20, 'z', 20, '-']
      }
      texteCorr += tableauDeVariation({
        tabInit: [
          [
            // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
            ['$x$', 2, 30], ['$f(x)$', 2, 50]
          ],
          // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
          ['$-\\infty$', 30, `$${texFractionReduite(-b, a)}$`, 20, '$+\\infty$', 30]
        ],
        // tabLines ci-dessous contient les autres lignes du tableau.
        tabLines: [ligne1],
        colorBackground: '',
        espcl: 3.5, // taille en cm entre deux antécédents
        deltacl: 0.8, // distance entre la bordure et les premiers et derniers antécédents
        lgt: 5 // taille de la première colonne en cm
      })
      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on la stocke dans la liste des questions
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.canEnonce = `Dresser le tableau de signes de la fonction $f$ définie sur  $\\mathbb R$ par $f(x)=${reduireAxPlusB(a, b)}$. `
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
