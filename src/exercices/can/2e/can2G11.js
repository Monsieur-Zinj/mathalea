import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { creerNomDePolygone, sp } from '../../../lib/outils/outilString.js'
import Exercice from '../../deprecatedExercice.js'
import { listeQuestionsToContenu } from '../../../modules/outils.js'
import { propositionsQcm } from '../../../lib/interactif/qcm.js'
export const titre = 'Utiliser la relation de Chasles/réductions vectorielles*'
export const interactifReady = true
export const interactifType = 'qcm'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '30/10/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag
export const dateDeModifImportante = '03/01/2022'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export const uuid = '7bc4a'
export const ref = 'can2G11'
export const refs = {
  'fr-fr': ['can2G11'],
  'fr-ch': []
}
export default function RelationChasles2 () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.spacing = 3
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.nouvelleVersion = function () {
    this.listeQuestions = []
    this.listeCorrections = []
    let texte, texteCorr, props, n
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const nom = creerNomDePolygone(7, ['QD'])
      const choix = choice([1, 2, 3, 3])
      switch (choix) { //, 'b'
        case 1 :
          texte = `$\\overrightarrow{${nom[0]}${nom[1]}}+\\overrightarrow{${nom[2]}${nom[3]}}+\\overrightarrow{${nom[1]}${nom[2]}}=$`
          this.autoCorrection[i] = {
            enonce: texte,
            options: { horizontal: true },
            propositions: [
              {
                texte: `$\\overrightarrow{${nom[0]}${nom[3]}}$ `,
                statut: true
              },
              {
                texte: `$\\overrightarrow{${nom[0]}${nom[2]}}$ `,
                statut: false
              },
              {
                texte: `$\\overrightarrow{${nom[1]}${nom[2]}}$ `,
                statut: false
              }
            ]
          }

          props = propositionsQcm(this, i)
          if (this.interactif) texte += props.texte
          else {
            texte = `Écrire à l'aide d'un seul vecteur : <br>
      $\\overrightarrow{${nom[0]}${nom[1]}}+\\overrightarrow{${nom[2]}${nom[3]}}+\\overrightarrow{${nom[1]}${nom[2]}}=$`
          }
          this.canEnonce = 'Écrire à l\'aide d\'un seul vecteur.'
          this.canReponseACompleter = ` $\\overrightarrow{${nom[0]}${nom[1]}}+\\overrightarrow{${nom[2]}${nom[3]}}+\\overrightarrow{${nom[1]}${nom[2]}}=\\ldots$`
          texteCorr = `On utilise la relation de Chasles :<br>
        $\\begin{aligned}
        \\overrightarrow{${nom[0]}${nom[1]}}+\\overrightarrow{${nom[2]}${nom[3]}}+\\overrightarrow{${nom[1]}${nom[2]}}
        &=\\underbrace{\\overrightarrow{${nom[0]}${miseEnEvidence(nom[1])}}+
        \\overrightarrow{${miseEnEvidence(nom[1])}${nom[2]}}}_{\\overrightarrow{${nom[0]}${nom[2]}}}+
        \\overrightarrow{${nom[2]}${nom[3]}}\\\\
        &=\\underbrace{\\overrightarrow{${nom[0]}${miseEnEvidence(nom[2])}}+
        \\overrightarrow{${miseEnEvidence(nom[2])}${nom[3]}}}_{\\overrightarrow{${miseEnEvidence(nom[0])}${nom[3]}}}\\\\
        &=\\overrightarrow{${nom[0]}${nom[3]}}
        \\end{aligned}$
        `

          break
        case 2 :
          n = choice(['a', 'b'])
          if (n === 'a') {
            texte = `$\\overrightarrow{${nom[5]}${nom[1]}}+\\overrightarrow{${nom[2]}${nom[3]}}-\\overrightarrow{${nom[2]}${nom[1]}}=$`
            this.autoCorrection[i] = {
              enonce: texte,
              options: { horizontal: true },
              propositions: [
                {
                  texte: `$\\overrightarrow{${nom[5]}${nom[3]}}$ `,
                  statut: true
                },
                {
                  texte: `$\\overrightarrow{${nom[5]}${nom[2]}}$ `,
                  statut: false
                },
                {
                  texte: `$\\overrightarrow{${nom[1]}${nom[2]}}$ `,
                  statut: false
                }
              ]
            }

            props = propositionsQcm(this, i)
            if (this.interactif) texte += props.texte
            else {
              texte = `Écrire à l'aide d'un seul vecteur : <br>
          $\\overrightarrow{${nom[5]}${nom[1]}}+\\overrightarrow{${nom[2]}${nom[3]}}-\\overrightarrow{${nom[2]}${nom[1]}}=$`
            }
            this.canEnonce = 'Écrire à l\'aide d\'un seul vecteur.'
            this.canReponseACompleter = ` $\\overrightarrow{${nom[5]}${nom[1]}}+\\overrightarrow{${nom[2]}${nom[3]}}-\\overrightarrow{${nom[2]}${nom[1]}}=\\ldots$`
            texteCorr = `On utilise la relation de Chasles :<br>
        $\\begin{aligned}
        \\overrightarrow{${nom[5]}${nom[1]}}+\\overrightarrow{${nom[2]}${nom[3]}}\\underbrace{-\\overrightarrow{${nom[2]}${nom[1]}}}_{+\\overrightarrow{${nom[1]}${nom[2]}}}
        &=  \\overrightarrow{${nom[5]}${nom[1]}}+\\overrightarrow{${nom[2]}${nom[3]}}+\\overrightarrow{${nom[1]}${nom[2]}}\\\\
        &=\\underbrace{\\overrightarrow{${nom[5]}${miseEnEvidence(nom[1])}}+
        \\overrightarrow{${miseEnEvidence(nom[1])}${nom[2]}}}_{\\overrightarrow{${nom[5]}${nom[2]}}}+
        \\overrightarrow{${nom[2]}${nom[3]}}\\\\
        &=\\underbrace{\\overrightarrow{${nom[5]}${miseEnEvidence(nom[2])}}+
        \\overrightarrow{${miseEnEvidence(nom[2])}${nom[3]}}}_{\\overrightarrow{${miseEnEvidence(nom[5])}${nom[3]}}}\\\\
        &=\\overrightarrow{${nom[5]}${nom[3]}}
        \\end{aligned}$
        `
          }
          if (n === 'b') {
            texte = `$\\overrightarrow{${nom[0]}${nom[1]}}-\\overrightarrow{${nom[3]}${nom[2]}}+\\overrightarrow{${nom[1]}${nom[2]}}=$`
            this.autoCorrection[i] = {
              enonce: texte,
              options: { horizontal: true },
              propositions: [
                {
                  texte: `$\\overrightarrow{${nom[0]}${nom[3]}}$ `,
                  statut: true
                },
                {
                  texte: `$\\overrightarrow{${nom[0]}${nom[2]}}$ `,
                  statut: false
                },
                {
                  texte: `$\\overrightarrow{${nom[1]}${nom[2]}}$ `,
                  statut: false
                }
              ]
            }

            props = propositionsQcm(this, i)
            if (this.interactif) texte += props.texte
            else {
              texte = `Écrire à l'aide d'un seul vecteur : <br>
          $\\overrightarrow{${nom[0]}${nom[1]}}-\\overrightarrow{${nom[3]}${nom[2]}}+\\overrightarrow{${nom[1]}${nom[2]}}=$`
            }
            this.canEnonce = 'Écrire à l\'aide d\'un seul vecteur.'
            this.canReponseACompleter = `  $\\overrightarrow{${nom[0]}${nom[1]}}-\\overrightarrow{${nom[3]}${nom[2]}}+\\overrightarrow{${nom[1]}${nom[2]}}=\\ldots$`
            texteCorr = `On utilise la relation de Chasles       :<br>
        $\\begin{aligned}
        \\overrightarrow{${nom[0]}${nom[1]}}\\underbrace{-\\overrightarrow{${nom[3]}${nom[2]}}}_{+\\overrightarrow{${nom[2]}${nom[3]}}}+\\overrightarrow{${nom[1]}${nom[2]}}
        &=  \\overrightarrow{${nom[0]}${nom[1]}}+\\overrightarrow{${nom[2]}${nom[3]}}+\\overrightarrow{${nom[1]}${nom[2]}}\\\\
        &=\\underbrace{\\overrightarrow{${nom[0]}${miseEnEvidence(nom[1])}}+
        \\overrightarrow{${miseEnEvidence(nom[1])}${nom[2]}}}_{\\overrightarrow{${nom[0]}${nom[2]}}}+
        \\overrightarrow{${nom[2]}${nom[3]}}\\\\
        &=\\underbrace{\\overrightarrow{${nom[0]}${miseEnEvidence(nom[2])}}+
        \\overrightarrow{${miseEnEvidence(nom[2])}${nom[3]}}}_{\\overrightarrow{${nom[0]}${nom[3]}}}\\\\
        &=\\overrightarrow{${nom[0]}${nom[3]}}
        \\end{aligned}$
        `
          }
          break
        case 3 :
          n = choice(['a', 'b', 'c', 'd'])//, 'b'
          if (n === 'a') {
            texte = `$\\overrightarrow{${nom[3]}${nom[4]}}+\\overrightarrow{${nom[5]}${nom[0]}}+\\overrightarrow{${nom[4]}${nom[3]}}=$`
            this.autoCorrection[i] = {
              enonce: texte,
              options: { horizontal: true },
              propositions: [
                {
                  texte: `$\\overrightarrow{${nom[5]}${nom[0]}}$ `,
                  statut: true
                },
                {
                  texte: '$\\overrightarrow{0}$ ',
                  statut: false
                },
                {
                  texte: `$2${sp(1)}\\overrightarrow{${nom[4]}${nom[3]}}$ `,
                  statut: false
                }
              ]
            }

            props = propositionsQcm(this, i)
            if (this.interactif) texte += props.texte
            else {
              texte = `Écrire à l'aide d'un seul vecteur : <br>
          $\\overrightarrow{${nom[3]}${nom[4]}}+\\overrightarrow{${nom[5]}${nom[0]}}+\\overrightarrow{${nom[4]}${nom[3]}}=$`
            }
            this.canEnonce = 'Écrire à l\'aide d\'un seul vecteur.'
            this.canReponseACompleter = `   $\\overrightarrow{${nom[3]}${nom[4]}}+\\overrightarrow{${nom[5]}${nom[0]}}+\\overrightarrow{${nom[4]}${nom[3]}}=\\ldots$`
            texteCorr = `On utilise la relation de Chasles :<br>
        $\\begin{aligned}
        \\overrightarrow{${nom[3]}${nom[4]}}+\\overrightarrow{${nom[5]}${nom[0]}}+\\overrightarrow{${nom[4]}${nom[3]}}
        &=\\underbrace{\\overrightarrow{${nom[3]}${miseEnEvidence(nom[4])}}+\\overrightarrow{${miseEnEvidence(nom[4])}${nom[3]}}}_{\\overrightarrow{${nom[3]}${nom[3]}}}+\\overrightarrow{${nom[5]}${nom[0]}}\\\\
&= \\overrightarrow{0}+\\overrightarrow{${nom[5]}${nom[0]}}\\\\
&= \\overrightarrow{${nom[5]}${nom[0]}}
        \\end{aligned}$
        `
          }
          if (n === 'b') {
            texte = `$\\overrightarrow{${nom[2]}${nom[0]}}+\\overrightarrow{${nom[3]}${nom[2]}}+\\overrightarrow{${nom[0]}${nom[3]}}=$`
            this.autoCorrection[i] = {
              enonce: texte,
              options: { horizontal: true },
              propositions: [
                {
                  texte: '$\\overrightarrow{0}$ ',
                  statut: true
                },
                {
                  texte: `$2${sp(1)}\\overrightarrow{${nom[0]}${nom[2]}}$ `,
                  statut: false
                },
                {
                  texte: `$\\overrightarrow{${nom[2]}${nom[3]}}$ `,
                  statut: false
                }
              ]
            }

            props = propositionsQcm(this, i)
            if (this.interactif) texte += props.texte
            else {
              texte = `Écrire à l'aide d'un seul vecteur : <br>
          $\\overrightarrow{${nom[2]}${nom[0]}}+\\overrightarrow{${nom[3]}${nom[2]}}+\\overrightarrow{${nom[0]}${nom[3]}}=$`
            }
            this.canEnonce = 'Écrire à l\'aide d\'un seul vecteur.'
            this.canReponseACompleter = `    $\\overrightarrow{${nom[2]}${nom[0]}}+\\overrightarrow{${nom[3]}${nom[2]}}+\\overrightarrow{${nom[0]}${nom[3]}}=\\ldots$`
            texteCorr = `On utilise la relation de Chasles       :<br>
        $\\begin{aligned}
        \\overrightarrow{${nom[2]}${nom[0]}}+\\overrightarrow{${nom[3]}${nom[2]}}+\\overrightarrow{${nom[0]}${nom[3]}}
        &=  \\underbrace{\\overrightarrow{${nom[2]}${miseEnEvidence(nom[0])}}+\\overrightarrow{${miseEnEvidence(nom[0])}${nom[3]}}}_{\\overrightarrow{${nom[2]}${nom[3]}}}+\\overrightarrow{${nom[3]}${nom[2]}}\\\\
        &=  \\underbrace{\\overrightarrow{${nom[2]}${miseEnEvidence(nom[3])}}+\\overrightarrow{${miseEnEvidence(nom[3])}${nom[2]}}}_{\\overrightarrow{${nom[2]}${nom[2]}}}\\\\
        &=\\overrightarrow{${nom[2]}${nom[2]}}\\\\
        &=\\overrightarrow{0}
        \\end{aligned}$
        `
          }
          if (n === 'c') {
            texte = `$\\overrightarrow{${nom[4]}${nom[1]}}+\\overrightarrow{${nom[0]}${nom[1]}}+\\overrightarrow{${nom[0]}${nom[4]}}=$`
            this.autoCorrection[i] = {
              enonce: texte,
              options: { horizontal: true },
              propositions: [
                {
                  texte: `$2${sp(1)}\\overrightarrow{${nom[0]}${nom[1]}}$ `,
                  statut: true
                },
                {
                  texte: '$\\overrightarrow{0}$ ',
                  statut: false
                },
                {
                  texte: `$\\overrightarrow{${nom[0]}${nom[1]}}$ `,
                  statut: false
                }
              ]
            }

            props = propositionsQcm(this, i)
            if (this.interactif) texte += props.texte
            else {
              texte = `Écrire à l'aide d'un seul vecteur : <br>
          $\\overrightarrow{${nom[4]}${nom[1]}}+\\overrightarrow{${nom[0]}${nom[1]}}+\\overrightarrow{${nom[0]}${nom[4]}}=$`
            }
            this.canEnonce = 'Écrire à l\'aide d\'un seul vecteur.'
            this.canReponseACompleter = `    $\\overrightarrow{${nom[4]}${nom[1]}}+\\overrightarrow{${nom[0]}${nom[1]}}+\\overrightarrow{${nom[0]}${nom[4]}}=\\ldots$`
            texteCorr = `On utilise la relation de Chasles       :<br>
        $\\begin{aligned}
        \\overrightarrow{${nom[4]}${nom[1]}}+\\overrightarrow{${nom[0]}${nom[1]}}+\\overrightarrow{${nom[0]}${nom[4]}}
        &= \\underbrace{\\overrightarrow{${nom[0]}${miseEnEvidence(nom[4])}}+\\overrightarrow{${miseEnEvidence(nom[4])}${nom[1]}}}_{\\overrightarrow{${nom[0]}${nom[1]}}}+\\overrightarrow{${nom[0]}${nom[1]}}\\\\
        &=  \\overrightarrow{${nom[0]}${nom[1]}}+\\overrightarrow{${nom[0]}${nom[1]}}\\\\
        &=  2\\overrightarrow{${nom[0]}${nom[1]}}
        \\end{aligned}$
        `
          }
          if (n === 'd') {
            texte = `$\\overrightarrow{${nom[6]}${nom[1]}}-\\overrightarrow{${nom[6]}${nom[0]}}+\\overrightarrow{${nom[1]}${nom[0]}}=$`
            this.autoCorrection[i] = {
              enonce: texte,
              options: { horizontal: true },
              propositions: [
                {
                  texte: '$\\overrightarrow{0}$ ',
                  statut: true
                },
                {
                  texte: `$2${sp(1)}\\overrightarrow{${nom[0]}${nom[1]}}$ `,
                  statut: false
                },
                {
                  texte: `$\\overrightarrow{${nom[1]}${nom[0]}}$ `,
                  statut: false
                }
              ]
            }

            props = propositionsQcm(this, i)
            if (this.interactif) texte += props.texte
            else {
              texte = `Écrire à l'aide d'un seul vecteur : <br>
          $\\overrightarrow{${nom[6]}${nom[1]}}-\\overrightarrow{${nom[6]}${nom[0]}}+\\overrightarrow{${nom[1]}${nom[0]}}=$`
            }
            this.canEnonce = 'Écrire à l\'aide d\'un seul vecteur.'
            this.canReponseACompleter = `   $\\overrightarrow{${nom[6]}${nom[1]}}-\\overrightarrow{${nom[6]}${nom[0]}}+\\overrightarrow{${nom[1]}${nom[0]}}=\\ldots$`
            texteCorr = `On utilise la relation de Chasles       :<br>
        $\\begin{aligned}
        \\overrightarrow{${nom[6]}${nom[1]}}\\underbrace{-\\overrightarrow{${nom[6]}${nom[0]}}}_{+\\overrightarrow{${nom[0]}${nom[6]}}}+\\overrightarrow{${nom[1]}${nom[0]}}
        &=\\overrightarrow{${nom[6]}${nom[1]}}+\\overrightarrow{${nom[0]}${nom[6]}}+\\overrightarrow{${nom[1]}${nom[0]}}\\\\
        &= \\underbrace{\\overrightarrow{${nom[1]}${miseEnEvidence(nom[0])}}+\\overrightarrow{${miseEnEvidence(nom[0])}${nom[6]}}}_{\\overrightarrow{${nom[1]}${nom[6]}}}+\\overrightarrow{${nom[6]}${nom[1]}}\\\\
        &=\\underbrace{\\overrightarrow{${nom[1]}${miseEnEvidence(nom[6])}}+\\overrightarrow{${miseEnEvidence(nom[6])}${nom[1]}}}_{\\overrightarrow{${nom[1]}${nom[1]}}}\\\\
        &=\\overrightarrow{${nom[1]}${nom[1]}}\\\\
        &=\\overrightarrow{0}
        \\end{aligned}$
        `
          }

          break
      }
      if (this.questionJamaisPosee(i, nom, choix)) {
      // Si la question n'a jamais été posée, on la stocke dans la liste des questions
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        this.canEnonce = texte
        this.canReponseACompleter = props.texte
        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(this.canReponseACompleter)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
