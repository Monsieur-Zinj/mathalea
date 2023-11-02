import { combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { modalPdf } from '../../lib/outils/modales.js'
import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import { eclatePuissance, simpExp } from '../../lib/outils/puissance.js'
import Exercice from '../Exercice.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'

export const titre = 'Effectuer des calculs qu\'avec des puissances de 10'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'qcmMono'
export const dateDeModifImportante = '24/09/2023'

/**
 * 4C30 -- Puissances de 10
 * * Travailler des résultats automatisés
 * @author Sébastien Lozano
 */
export const uuid = 'f5dcf'
export const ref = '4C30'
export default function PuissancesDeDix () {
  Exercice.call(this) // Héritage de la classe Exercice()
  context.isHtml
    ? (this.consigne = 'Écrire sous la forme $\\mathbf{10^n}$.')
    : (this.consigne = 'Écrire sous la forme $10^n$.')
  context.isHtml ? (this.spacing = 3) : (this.spacing = 2)
  context.isHtml ? (this.spacingCorr = 3) : (this.spacingCorr = 2)
  this.nbQuestions = 5
  this.nbColsCorr = 1
  this.sup = 1
  this.sup2 = 4
  this.besoinFormulaireNumerique = false // Voir 2N31-5 pour voir besoinFormulaireNumerique à true
  this.besoinFormulaire2Texte = ['Type de calculs', 'Nombres séparés par des tirets\n1 : Produit de puissances\n2 : Quotient de puissances\n3 : Puissance de puissances\n4 : Mélange'] // le paramètre sera numérique de valeur max 2 (le 2 en vert)

  this.nouvelleVersion = function (numeroExercice) {
    this.correctionDetailleeDisponible = this.sup !== 2
    let typesDeQuestions
    this.boutonAide = modalPdf(
      numeroExercice,
      'assets/pdf/FichePuissances-4N21.pdf',
      'Aide mémoire sur les puissances (Sébastien Lozano)',
      'Aide mémoire'
    )

    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    let typesDeQuestionsDisponibles = []
    if (this.sup === 1) {
      typesDeQuestionsDisponibles = [1, 2, 3] // produit, quotient et exponentiation de puissances de 10
      if (this.nbQuestions > 30) {
        typesDeQuestionsDisponibles = [1, 2, 3, 1, 2]
      }
    } else if (this.sup === 2) {
      typesDeQuestionsDisponibles = [4, 5, 6, 7, 8, 9, 10, 11] // calculs première série
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] // calculs deuxième série
    }
    const listeTypeDeQuestions = this.besoinFormulaireNumerique
      ? combinaisonListes(
        typesDeQuestionsDisponibles,
        this.nbQuestions
      )
      : gestionnaireFormulaireTexte({
        nbQuestions: this.nbQuestions,
        saisie: this.sup2,
        max: 3,
        melange: 4,
        defaut: 4
      })

    // pour pouvoir adapter les couleurs en cas de besoin
    const coul0 = 'red'
    const coul1 = 'blue'

    for (
      let i = 0,
        exp0,
        exp1,
        exp,
        couleurExp0,
        couleurExp1,
        lettre,
        texte,
        texteCorr,
        reponseInteractive,
        exposantAMC,
        cpt = 0;
      i < this.nbQuestions && cpt < 100;
    ) {
      typesDeQuestions = listeTypeDeQuestions[i]

      exp0 = randint(1, 9)
      exp1 = randint(1, 9, [exp0])
      exp = [exp0, exp1] // on choisit deux exposants différents c'est mieux
      lettre = lettreDepuisChiffre(i + 1) // on utilise des lettres pour les calculs
      let nbSimplifications
      switch (typesDeQuestions) {
        case 1: // produit de puissances de même base
          texte = `$${lettre}=10^${exp[0]}\\times 10^${exp[1]}$`
          texteCorr = `$${lettre}=10^${exp[0]}\\times 10^${exp[1]}$`
          if (this.correctionDetaillee) {
            texteCorr += '<br>'
            texteCorr += `$${lettre}=${eclatePuissance(
                            10,
                            exp[0],
                            coul0
                        )} \\times ${eclatePuissance(10, exp[1], coul1)}$`
          }
          texteCorr += '<br>'
          texteCorr += `Il y a donc $\\mathbf{\\color{${coul0}}{${exp[0]}}~\\color{black}{+}~\\color{${coul1}}{${exp[1]}}}$ facteurs tous égaux à $10$.`
          texteCorr += '<br>'
          reponseInteractive = `10^{${exp[0] + exp[1]}}`
          texteCorr += `$${lettre}=10^{${exp[0]}+${exp[1]}} = ${miseEnEvidence(reponseInteractive)}$`
          exposantAMC = [exp[0] + exp[1], exp[0] * exp[1], Math.max(...exp) - Math.min(...exp), -1 * (exp[0] + exp[1])]
          break
        case 2: // quotient de puissances de même base
          // Pour que la couleur de la 10 associée à l'exposant max soit toujours rouge.
          reponseInteractive = `10^{${exp[0] - exp[1]}}`
          if (Math.max(exp[0], exp[1]) === exp[0]) {
            couleurExp0 = coul0
            couleurExp1 = coul1
          } else {
            couleurExp0 = coul1
            couleurExp1 = coul0
          }
          texte = `$${lettre}=\\dfrac{10^${exp[0]}}{10^${exp[1]}}$`
          texteCorr = `$${lettre}=\\dfrac{10^${exp[0]}}{10^${exp[1]}}$`
          if (this.correctionDetaillee) {
            texteCorr += '<br>'
            texteCorr += `$${lettre}=\\dfrac{${eclatePuissance(
                            10,
                            exp[0],
                            couleurExp0
                        )}}{${eclatePuissance(10, exp[1], couleurExp1)}}$`
          }
          texteCorr += '<br>'
          nbSimplifications = Math.min(
            exp[0],
            exp[1]
          )
          texteCorr += `Il y a donc $\\mathbf{\\color{${coul1}}{${nbSimplifications}}}$ simplification${nbSimplifications === 1 ? '' : 's'} par $10$ possible${nbSimplifications === 1 ? '' : 's'}.`
          if (this.correctionDetaillee) {
            texteCorr += '<br>'
          }
          /* if (exp[0] - exp[1] === 0) { // EE : impossible puisqu'ils sont différents
            if (this.correctionDetaillee) {
              texteCorr += `$${lettre}=\\dfrac{${eclatePuissance(
                                '\\cancel{10}',
                                exp[0],
                                couleurExp0
                            )}}{${eclatePuissance('\\cancel{10}', exp[0], couleurExp1)}}$`
            }
            texteCorr += '<br>'
            texteCorr += `$${lettre}=1`
          } else */
          if (exp[0] - exp[1] < 0) {
            if (this.correctionDetaillee) {
              texteCorr += `$${lettre}=\\dfrac{${eclatePuissance(
                                '\\cancel{10}',
                                exp[0],
                                couleurExp0
                            )}}{${eclatePuissance(
                                '\\cancel{10}',
                                exp[0],
                                couleurExp1
                            )}\\times${eclatePuissance(10, exp[1] - exp[0], couleurExp1)}}$`
            }
            texteCorr += '<br>'
            texteCorr += `$${lettre}=\\dfrac{1}{10^{${exp[1]}-${exp[0]}}}=\\dfrac{1}{10^{${exp[1] - exp[0]}}}`
            /* if ((exp[1] - exp[0]) % 2 === 0) { // EE : Je ne vois pas ce qui change si cette différence est paire
              texteCorr += `=\\dfrac{1}{${simpNotPuissance(
                                10,
                                exp[1] - exp[0]
                            )}}=${simpNotPuissance(10, exp[0] - exp[1])}`
            } else { */
            texteCorr += `=${miseEnEvidence(reponseInteractive)}$`
            // }
          } else {
            if (this.correctionDetaillee) {
              texteCorr += `$${lettre}=\\dfrac{${eclatePuissance(
                                '\\cancel{10}',
                                exp[1],
                                couleurExp0
                            )}\\times${eclatePuissance(
                                10,
                                exp[0] - exp[1],
                                couleurExp0
                            )}}{${eclatePuissance('\\cancel{10}', exp[1], couleurExp1)}}$`
            }
            texteCorr += '<br>'
            texteCorr += `$${lettre}=10^{${exp[0]}-${exp[1]}}=${miseEnEvidence(reponseInteractive)}$`
          }
          setReponse(this, i, `10^{${exp[0] - exp[1]}}`, { formatInteractif: 'puissance' })
          exposantAMC = [exp[0] - exp[1], exp[0] * exp[1], -exp[0] + exp[1], exp[0] + exp[1]]
          break
        case 3: // exponentiation
          exp = [randint(2, 4), randint(2, 5)] // on redéfinit les deux exposants pour ne pas avoir d'écritures trop longues et pour éviter 1
          texte = `$${lettre}=(10^${exp[0]})^{${exp[1]}}$`
          texteCorr = `$${lettre}=(10^${exp[0]})^{${exp[1]}}$`
          if (this.correctionDetaillee) {
            texteCorr += '<br>'
            texteCorr += `$${lettre}=\\color{${coul0}}{\\underbrace{${eclatePuissance(
                            `(10^${exp[0]})`,
                            exp[1],
                            coul0
                        )}}_{${exp[1]}\\thickspace\\text{facteurs}}}$`
            texteCorr += '<br>'
            texteCorr += `$${lettre}=\\color{${coul0}}{\\underbrace{${eclatePuissance(
                            `(\\color{${coul1}}{\\underbrace{${eclatePuissance(
                                10,
                                exp[0],
                                coul1
                            )}}_{${exp[0]}\\thickspace\\text{facteurs}}}\\color{${coul0}})`,
                            exp[1],
                            coul0
                        )}}_{${exp[1]}\\times\\color{${coul1}}{${exp[0]
                        }}\\thickspace\\color{black}{\\text{facteurs}}}}$`
          }
          texteCorr += '<br>'
          texteCorr += `Il y a donc $\\mathbf{\\color{${coul0}}{${exp[1]}}~\\color{black}{\\times}~\\color{${coul1}}{${exp[0]}}}$ facteurs tous égaux à $10$.`
          texteCorr += '<br>'
          reponseInteractive = `10^{${exp[0] * exp[1]}}`
          texteCorr += `$${lettre}=10^{${exp[0]}\\times${exp[1]}} = ${miseEnEvidence(reponseInteractive)}$`
          exposantAMC = [exp[0] * exp[1], exp[0] - exp[1], exp[0] + exp[1], -1 * (exp[0] + exp[1])]
          break
        case 4:
          exp = [randint(1, 7, [1]), randint(1, 7, [1]), randint(1, 7, [1])] // on a besoin de 3 exposants distincts
          texte = `$${lettre}=\\dfrac{10^${exp[0]}\\times 100}{10^${exp[1]} \\times 10^${exp[2]}}$`
          texteCorr = `$${lettre}=\\dfrac{10^${exp[0]}\\times 100}{10^${exp[1]} \\times 10^${exp[2]}}`
          texteCorr += ` = \\dfrac{10^${exp[0]}\\times 10^{2}}{10^${exp[1]} \\times 10^${exp[2]}}`
          texteCorr += ` = \\dfrac{10^{${exp[0]}+2}}{10^{${exp[1]}+${exp[2]}}}`
          texteCorr += ` = \\dfrac{10^{${exp[0] + 2}}}{10^{${exp[1] + exp[2]
                    }}}`
          texteCorr += ` = 10^{${exp[0] + 2}-${exp[1] + exp[2]}}`
          reponseInteractive = `10^{${exp[0] + 2 - exp[1] - exp[2]}}`
          texteCorr += ` = ${miseEnEvidence(reponseInteractive)}`
          if (
            exp[0] + 2 - exp[1] - exp[2] === 0 ||
                        exp[0] + 2 - exp[1] - exp[2] === 1
          ) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant 1 est évincé
            texteCorr += sp(2) + '(=' + simpExp(10, exp[0] + 2 - exp[1] - exp[2]) + ')'
          }
          texteCorr += '$'
          exposantAMC = [exp[0] + 2 - exp[1] - exp[2], exp[0] + 2 - exp[1] + exp[2], exp[0] + 2 + exp[1] - exp[2], exp[0] + 1 - exp[1] - exp[2]]
          break
        case 5:
          exp = [randint(1, 7, [1]), randint(1, 7, [1])] // on a besoin de 2 exposants distincts
          texte = `$${lettre}=\\dfrac{10^${exp[0]}\\times 1000}{10^${exp[1]}}$`
          texteCorr = `$${lettre}=\\dfrac{10^${exp[0]}\\times 1000}{10^${exp[1]}}`
          texteCorr += ` = \\dfrac{10^${exp[0]}\\times 10^3}{10^${exp[1]}}`
          texteCorr += ` = \\dfrac{10^{${exp[0]}+3}}{10^${exp[1]}}`
          texteCorr += ` = \\dfrac{10^{${exp[0] + 3}}}{10^${exp[1]}}`
          texteCorr += ` = 10^{${exp[0] + 3}-${exp[1]}}`
          reponseInteractive = `10^{${exp[0] + 3 - exp[1]}}`
          texteCorr += ` = ${miseEnEvidence(reponseInteractive)}`
          if (exp[0] + 3 - exp[1] === 0 || exp[0] + 3 - exp[1] === 1) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant 1 est évincé
            texteCorr += sp(2) + '(=' + simpExp(10, exp[0] + 3 - exp[1]) + ')'
          }
          texteCorr += '$'
          exposantAMC = [exp[0] + 3 - exp[1], exp[0] + 3 + exp[1], -exp[0] + 3 + exp[1], -exp[0] + 3 - exp[1]]
          break
        case 6:
          exp = [randint(1, 7, [1]), randint(1, 2)] // on a besoin de 2 exposants distincts
          // le second exposant ne peut valoir que 1 ou 2 la fonction testExp ne convient pas à l'affichage ici
          if (exp[1] === 2) {
            texte = `$${lettre}=\\dfrac{10\\times 10^${exp[0]}}{100^${exp[1]}}$`
            texteCorr = `$${lettre}=\\dfrac{10\\times 10^${exp[0]}}{100^${exp[1]}}`
            texteCorr += `=\\dfrac{10^{1+${exp[0]}}}{(10^2)^${exp[1]}}`
            texteCorr += `=\\dfrac{10^{1+${exp[0]}}}{10^{2 \\times ${exp[1]}}}`
            texteCorr += `=\\dfrac{10^{${1 + exp[0]}}}{10^{${2 * exp[1]}}}`
          } else {
            texte = `$${lettre}=\\dfrac{10\\times 10^${exp[0]}}{100}$`
            texteCorr = `$${lettre}=\\dfrac{10\\times 10^${exp[0]}}{100}`
            texteCorr += `=\\dfrac{10^{1+${exp[0]}}}{10^2}`
          }
          texteCorr += `=10^{${1 + exp[0]}-${2 * exp[1]}}`
          reponseInteractive = `10^{${1 + exp[0] - 2 * exp[1]}}`
          texteCorr += `=${miseEnEvidence(reponseInteractive)}`
          if (1 + exp[0] - 2 * exp[1] === 0 || 1 + exp[0] - 2 * exp[1] === 1) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant 1 est évincé
            texteCorr += sp(2) + '(=' + simpExp(10, 1 + exp[0] - 2 * exp[1]) + ')'
          }
          texteCorr += '$'
          exposantAMC = [1 + exp[0] + 2 * exp[1], 1 - exp[0] + 2 * exp[1], 1 + exp[0] - 2 * exp[1], 1 + exp[0] + exp[1]]
          break
        case 7:
          exp = [randint(1, 7, [1])] // on a besoin de 1 exposant
          texte = `$${lettre}=\\dfrac{10\\times 10^${exp[0]}}{100\\times 100}$`
          texteCorr = `$${lettre}=\\dfrac{10\\times 10^${exp[0]}}{100\\times 100}`
          texteCorr += `=\\dfrac{10^{1+${exp[0]}}}{10^2\\times 10^2}`
          texteCorr += `=\\dfrac{10^{${1 + exp[0]}}}{10^{2+2}}`
          texteCorr += `=\\dfrac{10^{${1 + exp[0]}}}{10^{${2 + 2}}}`
          texteCorr += `=10^{${1 + exp[0]}-${2 + 2}}`
          reponseInteractive = `10^{${exp[0] - 3}}`
          texteCorr += `=${miseEnEvidence(reponseInteractive)}`
          if (1 + exp[0] - 2 - 2 === 0 || 1 + exp[0] - 2 - 2 === 1) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant 1 est évincé
            texteCorr += sp(2) + '(=' + simpExp(10, exp[0] - 3) + ')'
          }
          texteCorr += '$'
          exposantAMC = [exp[0] - 3, exp[0] + 3, exp[0] - 2, exp[0] - 1]
          break
        case 8:
          exp = [randint(1, 7, [1])] // on a besoin de 1 exposant
          texte = `$${lettre}=\\dfrac{100^${exp[0]}}{10}$`
          texteCorr = `$${lettre}=\\dfrac{100^${exp[0]}}{10}`
          texteCorr += `=\\dfrac{(10^2)^${exp[0]}}{10}`
          texteCorr += `=\\dfrac{10^{2\\times ${exp[0]}}}{10}`
          texteCorr += `=\\dfrac{10^{${2 * exp[0]}}}{10}`
          texteCorr += `=10^{${2 * exp[0]}-1}`
          reponseInteractive = `10^{${2 * exp[0] - 1}}`
          texteCorr += `=${miseEnEvidence(reponseInteractive)}$`
          // Inutile de tester l'exposant final car il vaut au minimum 3
          exposantAMC = [2 * exp[0] - 1, 2 * exp[0] + 1, 2 * exp[0], exp[0] - 1]
          break
        case 9:
          exp = [randint(1, 3, [1])] // on a besoin de 1 exposant
          texte = `$${lettre}=\\dfrac{1000^${exp[0]}}{10}$`
          texteCorr = `$${lettre}=\\dfrac{1000^${exp[0]}}{10}`
          texteCorr += `=\\dfrac{(10^3)^${exp[0]}}{10}`
          texteCorr += `=\\dfrac{10^{3\\times ${exp[0]}}}{10}`
          texteCorr += `=\\dfrac{10^{${3 * exp[0]}}}{10}`
          texteCorr += `=10^{${3 * exp[0]}-1}`
          reponseInteractive = `10^{${3 * exp[0] - 1}}`
          texteCorr += `=${miseEnEvidence(reponseInteractive)}$`
          // inutile de tester l'exposant final car il vaut au minimum 5
          exposantAMC = [3 * exp[0] - 1, 3 * exp[0] + 1, 3 * exp[0], 3 * exp[0] - 2]
          break
        case 10:
          exp = [randint(1, 7, [1]), randint(1, 7, [1]), randint(1, 4, [1])] // on a besoin de 3 exposants distincts
          texte = `$${lettre}=\\dfrac{10^${exp[0]}\\times 10^${exp[1]}}{100^${exp[2]}}\\times 10$`
          texteCorr = `$${lettre}=\\dfrac{10^${exp[0]}\\times 10^${exp[1]}}{100^${exp[2]}}\\times 10`
          texteCorr += `=\\dfrac{10^{${exp[0]}+${exp[1]}}}{(10^2)^${exp[2]}}\\times 10`
          texteCorr += `=\\dfrac{10^{${exp[0] + exp[1]}}}{10^{2\\times ${exp[2]
                    }}}\\times 10`
          texteCorr += `=\\dfrac{10^{${exp[0] + exp[1]}}}{10^{${2 * exp[2]
                    }}}\\times 10`
          texteCorr += `=\\dfrac{10^{${exp[0] + exp[1]}}\\times 10}{10^{${2 * exp[2]
                    }}}`
          texteCorr += `=\\dfrac{10^{${exp[0] + exp[1]}+1}}{10^{${2 * exp[2]
                    }}}`
          texteCorr += `=\\dfrac{10^{${exp[0] + exp[1] + 1}}}{10^{${2 * exp[2]
                    }}}`
          texteCorr += `=10^{${exp[0] + exp[1] + 1}-${2 * exp[2]}}`
          reponseInteractive = `10^{${exp[0] + exp[1] + 1 - 2 * exp[2]}}`
          texteCorr += `=${miseEnEvidence(reponseInteractive)}`
          if (
            exp[0] + exp[1] + 1 - 2 * exp[2] === 0 ||
                        exp[0] + exp[1] + 1 - 2 * exp[2] === 1
          ) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant est évincé
            texteCorr += sp(2) + '(=' + simpExp(10, exp[0] + exp[1] + 1 - 2 * exp[2]) + ')'
          }
          texteCorr += '$'
          exposantAMC = [exp[0] + exp[1] + 1 - 2 * exp[2], exp[0] + exp[1] - 2 * exp[2], exp[0] + exp[1] + 1 - exp[2], exp[0] + exp[1] - exp[2]]
          break
        case 11:
          exp = [randint(1, 7, [1])] // on a besoin de 1 exposant
          texte = `$${lettre}=\\dfrac{1000\\times 10}{100^${exp[0]}}$`
          texteCorr = `$${lettre}=\\dfrac{1000\\times 10}{100^${exp[0]}}`
          texteCorr += `=\\dfrac{10^3\\times 10}{(10^2)^${exp[0]}}`
          texteCorr += `=\\dfrac{10^{3+1}}{10^{2\\times${exp[0]}}}`
          texteCorr += `=\\dfrac{10^{4}}{10^{${2 * exp[0]}}}`
          texteCorr += `=10^{4-${2 * exp[0]}}`
          reponseInteractive = `10^{${4 - 2 * exp[0]}}`
          texteCorr += `=${miseEnEvidence(reponseInteractive)}`
          if (3 + 1 - 2 * exp[0] === 0 || 3 + 1 - 2 * exp[0] === 1) {
            // on ne teste l'exposant que pour la sortie puisque l'exposant est évincé
            texteCorr += sp(2) + '(=' + simpExp(10, 3 + 1 - 2 * exp[0]) + ')'
          }
          texteCorr += '$'
          exposantAMC = [4 - 2 * exp[0], 4 - exp[0], 3 - 2 * exp[0], 5 - 2 * exp[0]]
          break
      }
      if (this.interactif && !context.isAmc) {
        setReponse(this, i, reponseInteractive, { formatInteractif: 'puissance' })
        texte += ajouteChampTexteMathLive(this, i, 'largeur15 inline nospacebefore', { texteAvant: `${sp(2)}$=$${sp(2)}` })
      }
      if (context.isAmc) {
        // setReponse(this, i, reponseInteractive, { formatInteractif: 'puissance', basePuissance: 10, exposantPuissance: exposantInteractif })
        this.autoCorrection[i] = {}
        this.autoCorrection[i].enonce = `${texte}\n`
        this.autoCorrection[i].options = {
          ordered: false
        }
        this.autoCorrection[i].propositions = [
          {
            texte: `$10^{${exposantAMC[0]}}$`,
            statut: true
          },
          {
            texte: `$10^{${exposantAMC[1]}}$`,
            statut: false
          },
          {
            texte: `$10^{${exposantAMC[2]}}$`,
            statut: false
          },
          {
            texte: `$10^{${exposantAMC[3]}}$`,
            statut: false
          }
        ]
      }
      if (this.questionJamaisPosee(i, exp, typesDeQuestions)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
