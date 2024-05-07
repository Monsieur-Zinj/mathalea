import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { modalPdf } from '../../lib/outils/modales.js'
import { lettreDepuisChiffre } from '../../lib/outils/outilString.js'
import { eclatePuissance, simpNotPuissance } from '../../lib/outils/puissance'
import { texteGras } from '../../lib/format/style'
import { context } from '../../modules/context.js'

import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenuSansNumero, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { handleAnswers, setReponse } from '../../lib/interactif/gestionInteractif.ts'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { powerCompare } from '../../lib/interactif/comparisonFunctions'

export const titre = 'Effectuer des calculs avec des puissances'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDeModifImportante = '14/09/2023'
/**
 * Puissances d'un relatif (1)
 * * L\'objectif est de travailler le sens des règles de calcul sur les puissances plutôt que les formules magiques
 *
 * Paramétrages possibles :
 * * 1 : produit de puissances de même base
 * * 2 : quotient de puissances de même base
 * * 3 : puissance de puissance
 * * 4 : produit de puissances de même exposant
 * * 5 : mélange des trois autres niveaux
 * @author Sébastien Lozano
 * 4C33-1
 */
export const uuid = 'bae57'
export const ref = '4C33-1'
export const refs = {
  'fr-fr': ['4C33-1'],
  'fr-ch': ['10NO2-11']
}

/**
 * Fonction pour écrire avec deux couleurs la forme éclatée d'un produit de puissances de même exposant
 * @param b1 base1
 * @param b2 base2
 * @param e exposant
 * @param couleur1
 * @param couleur2
 * @author Sébastien Lozano
 */
export function reorganiseProduitPuissance (b1, b2, e, couleur1, couleur2) {
  let str
  switch (e) {
    case 0:
      return '1'
    case 1:
      return `\\mathbf{\\color{${couleur1}}{${b1}}} \\times \\mathbf{\\color{${couleur2}}{${b2}}}`
    default:
      str = `\\mathbf{(\\color{${couleur1}}{${b1}}} \\times \\mathbf{\\color{${couleur2}}{${b2}}}) `
      for (let i = 1; i < e; i++) {
        str = str + `\\times (\\mathbf{\\color{${couleur1}}{${b1}}} \\times \\mathbf{\\color{${couleur2}}{${b2}}})`
      }
      return str
  }
}

export default function PuissancesDunRelatif1 () {
  Exercice.call(this)
  context.isHtml
    ? (this.consigne = 'Écrire sous la forme $\\mathbf{a^n}$.')
    : (this.consigne = 'Écrire sous la forme $a^n$.')
  context.isHtml ? (this.spacing = 3) : (this.spacing = 2)
  context.isHtml ? (this.spacingCorr = 2) : (this.spacingCorr = 1)
  this.nbQuestions = 5
  this.correctionDetailleeDisponible = true
  this.nbColsCorr = 1
  this.sup = 5
  this.sup2 = 1
  this.classe = 4

  this.listePackages = 'bclogo'

  // une fonction pour des infos supp sur les exposants
  function remarquesPuissances (base, baseUtile, exposant) {
    let sortie = ''
    if (base < 0 && exposant % 2 === 0) {
      sortie += '<br>'
      sortie += `${texteGras('Remarque : ')} Dans ce cas, comme les puissances d'exposant pair de deux nombres opposés sont égales, on peut écrire $${simpNotPuissance(base, exposant)}$ à la place de $${baseUtile}^{${exposant}}$.`
    }
    if (base < 0 && exposant % 2 === 1) {
      sortie += '<br>'
      sortie += `${texteGras('Remarque : ')} Dans ce cas, comme les puissances d'exposant impair de deux nombres négatifs sont opposées, on pourrait écrire $${simpNotPuissance(base, exposant)}$  à la place de $${baseUtile}^{${exposant}}$.`
    }

    return sortie
  }

  this.nouvelleVersion = function (numeroExercice) {
    this.boutonAide = modalPdf(
      numeroExercice,
      'assets/pdf/FichePuissances-4N21.pdf',
      'Aide mémoire sur les puissances (Sébastien Lozano)',
      'Aide mémoire'
    )

    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    // const typesDeQuestionsDisponibles = this.sup < 5 ? [this.sup] : [1, 2, 3, 4]
    const typesDeQuestionsDisponibles = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 4,
      melange: 5,
      defaut: 5,
      nbQuestions: this.nbQuestions,
      shuffle: true
    })

    const listeTypeDeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions
    )

    // pour pouvoir adapter les couleurs en cas de besoin
    const coul0 = 'red'
    const coul1 = 'blue'

    for (
      let i = 0,
        base0,
        base1,
        base,
        baseUtile,
        baseUtileBisAMC,
        exp0,
        exp1,
        exp,
        couleurExp0,
        couleurExp1,
        lettre,
        texte,
        texteCorr,
        reponseInteractive,
        exposantInteractif,
        cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      base = randint(2, 9)
      base = base * (this.sup2 === 1 ? 1 : this.sup2 === 2 ? -1 : choice([-1, 1])) // on choisit une base sauf 1 ... penser à gérer le cas des bases qui sont des puissances
      exp0 = randint(3, 5)
      exp1 = this.classe === 4 ? randint(2, exp0 - 1) : randint(2, 5, exp0)
      exp = [exp0, exp1] // on choisit deux exposants différents c'est mieux
      lettre = lettreDepuisChiffre(i + 1) // on utilise des lettres pour les calculs

      if (base < 0) {
        baseUtile = '(' + base + ')' // on définit une base avec des parenthèses pour l'affichage du cas negatif
      } else {
        baseUtile = base
      }

      texteCorr = ''

      switch (listeTypeDeQuestions[i]) {
        case 1: // produit de puissances de même base
          texte = `$${lettre}=${baseUtile}^${exp[0]}\\times ${baseUtile}^${exp[1]}$`

          // texteCorr += `$${lettre}=${baseUtile}^${exp[0]}\\times ${baseUtile}^${exp[1]}$`
          if (this.correctionDetaillee) {
            texteCorr += `$${lettre}=${eclatePuissance(
                            baseUtile,
                            exp[0],
                            coul0
                        )} \\times ${eclatePuissance(baseUtile, exp[1], coul1)}$`
            texteCorr += '<br>'
            texteCorr += `Il y a donc $\\mathbf{\\color{${coul0}}{${exp[0]}}~\\color{black}{+}~\\color{${coul1}}{${exp[1]}}}$ facteurs tous égaux à $${baseUtile}$.`
            texteCorr += '<br>'
          }
          if ((base < 0) && ((exp[1] + exp[0]) % 2 === 0)) {
            texteCorr += `$${lettre}=${baseUtile}^{${exp[0]}+${exp[1]}} = ${baseUtile}^{${exp[0] + exp[1]}}=${miseEnEvidence(simpNotPuissance(base, exp[1] + exp[0]))}$`
          } else {
            texteCorr += `$${lettre}=${baseUtile}^{${exp[0]}+${exp[1]}} = ${miseEnEvidence(`${baseUtile}^{${exp[0] + exp[1]}}`)}$`
          }
          texteCorr += remarquesPuissances(base, baseUtile, exp[1] + exp[0])
          if (base < 0 && ((exp[0] + exp[1]) % 2) === 0) {
            reponseInteractive = [`${baseUtile}^${exp[1] + exp[0]}`, `${-base}^${exp[1] + exp[0]}`]
            baseUtileBisAMC = -base
          } else {
            reponseInteractive = `${baseUtile}^${exp[1] + exp[0]}`
          }
          exposantInteractif = exp[1] + exp[0]
          break
        case 2: // quotient de puissances de même base
          // Pour que la couleur de la base associée à l'exposant max soit toujours rouge.
          if (Math.max(exp[0], exp[1]) === exp[0]) {
            couleurExp0 = coul0
            couleurExp1 = coul1
          } else {
            couleurExp0 = coul1
            couleurExp1 = coul0
          }

          texte = `$${lettre}=\\dfrac{${baseUtile}^${exp[0]}}{${baseUtile}^${exp[1]}}$`

          if (this.correctionDetaillee) {
            texteCorr += `$${lettre}=\\dfrac{${eclatePuissance(baseUtile, exp[0], couleurExp0)}}{${eclatePuissance(baseUtile, exp[1], couleurExp1)}}$`
            texteCorr += '<br>'
            texteCorr += `Il y a donc $\\mathbf{\\color{${coul1}}{${Math.min(exp[0], exp[1])}}}$ simplification${Math.min(exp[0], exp[1]) === 1 ? '' : 's'} par $${baseUtile}$ possibles.`
            texteCorr += '<br>'
          }
          if (exp[0] - exp[1] === 0) {
            if (this.correctionDetaillee) {
              texteCorr += `$${lettre}=\\dfrac{${eclatePuissance(
                                `\\cancel{${baseUtile}}`,
                                exp[0],
                                couleurExp0
                            )}}{${eclatePuissance(
                                `\\cancel{${baseUtile}}`,
                                exp[0],
                                couleurExp1
                            )}}$`
              texteCorr += '<br>'
            }
            texteCorr += `$${lettre}=1$`
          } else if (exp[0] - exp[1] < 0) {
            if (this.correctionDetaillee) {
              texteCorr += `$${lettre}=\\dfrac{${eclatePuissance(
                                `\\cancel{${baseUtile}}`,
                                exp[0],
                                couleurExp0
                            )}}{${eclatePuissance(
                                `\\cancel{${baseUtile}}`,
                                exp[0],
                                couleurExp1
                            )}\\times${eclatePuissance(
                                baseUtile,
                                exp[1] - exp[0],
                                couleurExp1
                            )}}$`
              texteCorr += '<br>'
            }
            texteCorr += `$${lettre}=\\dfrac{1}{${baseUtile}^{${exp[1]}-${exp[0]}}}=\\dfrac{1}{${baseUtile}^{${exp[1] - exp[0]}}}`
            if ((base < 0) && ((exp[1] - exp[0]) % 2 === 0)) {
              texteCorr += `=\\dfrac{1}{${simpNotPuissance(
                                base,
                                exp[1] - exp[0]
                            )}}=${miseEnEvidence(`${simpNotPuissance(base, exp[0] - exp[1])}`)}$`
            } else {
              texteCorr += `=${miseEnEvidence(`${baseUtile}^{${exp[0] - exp[1]}}`)}$`
            }
          } else {
            if (this.correctionDetaillee) {
              texteCorr += `$${lettre}=\\dfrac{${eclatePuissance(
                                `\\cancel{${baseUtile}}`,
                                exp[1],
                                couleurExp0
                            )}\\times${eclatePuissance(
                                baseUtile,
                                exp[0] - exp[1],
                                couleurExp0
                            )}}{${eclatePuissance(
                                `\\cancel{${baseUtile}}`,
                                exp[1],
                                couleurExp1
                            )}}$`
              texteCorr += '<br>'
            }
            texteCorr += `$${lettre}=${baseUtile}^{${exp[0]}-${exp[1]}}`
            if ((base < 0) && ((exp[0] - exp[1]) % 2 === 0)) {
              texteCorr += `=${baseUtile}^{${exp[0] - exp[1]}}=${miseEnEvidence(simpNotPuissance(base, exp[0] - exp[1]))}$`
            } else {
              texteCorr += `=${miseEnEvidence(`${baseUtile}^{${exp[0] - exp[1]}}`)}$`
            }
          }
          texteCorr += remarquesPuissances(base, baseUtile, exp[0] - exp[1])
          if (base < 0 && ((exp[0] - exp[1]) % 2) === 0) {
            reponseInteractive = [`${baseUtile}^${exp[0] - exp[1]}`, `${-base}^${exp[0] - exp[1]}`]
            baseUtileBisAMC = -base
          } else {
            reponseInteractive = `${baseUtile}^${exp[0] - exp[1]}`
          }
          exposantInteractif = exp[0] - exp[1]
          break
        case 3: // exponentiation
          exp = [randint(2, 4), randint(2, 4)] // on redéfinit les deux exposants pour ne pas avoir d'écritures trop longues et pour éviter 1
          texte = `$${lettre}=(${baseUtile}^${exp[0]})^{${exp[1]}}$`

          if (this.correctionDetaillee) {
            texteCorr += `$${lettre}=\\color{${coul0}}{\\underbrace{${eclatePuissance(
                            `(${baseUtile}^${exp[0]})`,
                            exp[1],
                            coul0
                        )}}_{${exp[1]}\\thickspace\\text{facteurs}}}$`
            texteCorr += '<br>'
            texteCorr += `$${lettre}=\\color{${coul0}}{\\underbrace{${eclatePuissance(
                            `(\\color{${coul1}}{\\underbrace{${eclatePuissance(
                                baseUtile,
                                exp[0],
                                coul1
                            )}}_{${exp[0]}\\thickspace\\text{facteurs}}}\\color{${coul0}})`,
                            exp[1],
                            coul0
                        )}}_{${exp[1]}\\times\\color{${coul1}}{${exp[0]
                        }}\\thickspace\\color{black}{\\text{facteurs}}}}$`
            texteCorr += '<br>'
          }
          texteCorr += `Il y a donc $\\mathbf{\\color{${coul0}}{${exp[1]}}~\\color{black}{\\times}~\\color{${coul1}}{${exp[0]}}}$ facteurs tous égaux à $${baseUtile}$.`
          texteCorr += '<br>'
          texteCorr += `$${lettre}=${baseUtile}^{${exp[0]}\\times${exp[1]
                    }} `
          if ((base < 0) && ((exp[1] * exp[0]) % 2 === 0)) {
            texteCorr += `= ${baseUtile}^{${exp[0] * exp[1]}} = ${miseEnEvidence(simpNotPuissance(base, exp[0] * exp[1]))}$`
          } else {
            texteCorr += `= ${miseEnEvidence(`${baseUtile}^{${exp[0] * exp[1]}}`)}$`
          }
          texteCorr += remarquesPuissances(base, baseUtile, exp[0] * exp[1])
          if (base < 0 && (exp[0] * exp[1] % 2) === 0) {
            reponseInteractive = [`${baseUtile}^${exp[0] * exp[1]}`, `${-base}^${exp[0] * exp[1]}`]
            baseUtileBisAMC = -base
          } else {
            reponseInteractive = `${baseUtile}^${exp[0] * exp[1]}`
          }
          exposantInteractif = exp[0] * exp[1]
          break
        case 4: // produit de puissances de même exposant
          base0 = randint(2, 8, [4, 6])
          base1 = randint(2, 8, [4, 6, base0])
          base = [base0, base1] // on choisit 2 bases différentes c'est mieux
          exp = randint(2, 5, 6) // on choisit un exposant
          texte = `$${lettre}=${base[0]}^${exp}\\times ${base[1]}^${exp}$`
          texteCorr += `$${lettre}=${base[0]}^${exp}\\times ${base[1]}^${exp}$`

          if (this.correctionDetaillee) {
            texteCorr += '<br>'
            texteCorr += `$${lettre}=${eclatePuissance(
                            base[0],
                            exp,
                            coul0
                        )} \\times ${eclatePuissance(base[1], exp, coul1)}$`
            texteCorr += '<br>'
            texteCorr += `$${lettre}=${reorganiseProduitPuissance(
                            base[0],
                            base[1],
                            exp,
                            coul0,
                            coul1
                        )}$`
          }
          texteCorr += '<br>'
          texteCorr += `$${lettre}= (\\color{${coul0}}{\\mathbf{${base[0]
                    }}} \\color{black}{\\times} \\color{${coul1}}{\\mathbf{${base[1]
                    }}}\\color{black}{)^{${exp}}}=${miseEnEvidence(`${base[0] * base[1]}^${exp}`)}$`
          // Ici la base ne peut jamais être négative
          reponseInteractive = `${base[0] * base[1]}^${exp}`
          baseUtile = base[0] * base[1]
          baseUtileBisAMC = base[0] * base[1] // juste pour ne pas avoir à ajouter une batterie de lignes spécifiques pour ce cas, je mets deux fois la même chose
          base = baseUtile
          exposantInteractif = exp
          break
      }

      if (this.interactif && !context.isAmc) {
        handleAnswers(this, i, { reponse: { value: reponseInteractive, compare: powerCompare } })
        texte += ajouteChampTexteMathLive(this, i, 'largeur25 inline', { texteAvant: ' $=$' })
      }
      if (context.isAmc) {
        setReponse(this, i, reponseInteractive, {
          formatInteractif: 'puissance',
          basePuissance: base,
          exposantPuissance: exposantInteractif,
          exposantNbChiffres: 2,
          signe: true,
          aussiCorrect: baseUtileBisAMC
        })
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
  /*  this.besoinFormulaireNumerique = [
    'Règle à travailler',
    5,
    '1 : Produit de deux puissances de même base\n2 : Quotient de deux puissances de même base\n3 : Puissance de puissances\n4 : Produit de puissances positives de même exposant\n5 : Mélange'
  ] */
  this.besoinFormulaireTexte = ['Règle à travailler', 'Nombres séparés par des tirets\n1 : Produit de deux puissances de même base\n2 : Quotient de deux puissances de même base\n3 : Puissance de puissances\n4 : Produit de puissances positives de même exposant\n5 : Mélange']

  this.besoinFormulaire2Numerique = [
    'Signe de la mantisse',
    3,
    '1 : Positif\n2 : Négatif\n3 : Mélange'
  ]
}
