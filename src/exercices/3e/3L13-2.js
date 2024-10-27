import Decimal from 'decimal.js'
import { choice, combinaisonListesSansChangerOrdre, shuffle } from '../../lib/outils/arrayOutils'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'
import { texNombre } from '../../lib/outils/texNombre'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.ts'

import { tableau } from '../../lib/2d/tableau'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../deprecatedExercice.js'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites'

export const titre = 'Résoudre une équation résolvante pour le théorème de Thalès'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '15/12/2020'
export const dateDeModifImportante = '15/06/2024'
/**
 * * Équations résolvantes pour le théorème de Thalès
 * @author Sébastien Lozano
 */
export const uuid = '6516e'
export const ref = '3L13-2'
export const refs = {
  'fr-fr': ['3L13-2'],
  'fr-ch': ['11GM3-7', '11FA5-5']
}
export default function EqResolvantesThales () {
  Exercice.call(this)
  this.nbQuestions = 2
  this.sup = 1
  this.consignePluriel = 'Résoudre les équations suivantes.'
  this.consigneSingulier = 'Résoudre l\'équation suivante.'
  this.tailleDiaporama = 3

  this.nbCols = 1
  this.nbColsCorr = 1
  context.isHtml ? this.spacing = 3 : this.spacing = 2
  context.isHtml ? this.spacingCorr = 2.5 : this.spacingCorr = 1.5

  let typesDeQuestionsDisponibles

  this.nouvelleVersion = function () {
    this.consigne = (this.nbQuestions === 1 || context.vue === 'diap') ? this.consigneSingulier : this.consignePluriel
    typesDeQuestionsDisponibles = shuffle([choice([0, 1]), choice([2, 3])])

    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    // let listeTypeDeQuestions  = combinaisonListes(typesDeQuestionsDisponibles,this.nbQuestions) // Tous les types de questions sont posées mais l'ordre diffère à chaque "cycle"
    const listeTypeDeQuestions = combinaisonListesSansChangerOrdre(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées --> à remettre comme ci-dessus

    for (let i = 0, texte, texteCorr, reponse, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // on a besoin d'un coeff pour le type de nombres
      let coeff, masterChoix
      let nbAlea = [1, 1, 1]
      // On génère un c pour s'assurer que le résultat soit décimal.
      // Au min 10, au max 100
      const exposantDeDeux = randint(1, 2)
      const exposantDeCinq = randint(1, 2)
      const cTempCase3 = new Decimal(2 ** exposantDeDeux * 5 ** exposantDeCinq)
      const dixieme = new Decimal(1).div(10)
      const one = new Decimal(1)
      const moinsUn = one.mul(-1)
      switch (this.sup) {
        case 1: // entiers
          coeff = [one, one, one]
          nbAlea[0] = new Decimal(randint(2, 9))
          nbAlea[1] = new Decimal(randint(2, 9, nbAlea[0].toNumber()))
          nbAlea[2] = new Decimal(choice([2, 4, 5, 8], [nbAlea[0].toNumber(), nbAlea[1].toNumber()]))
          break
        case 2: // relatifs
          coeff = [choice([one, moinsUn]), choice([one, moinsUn]), choice([one, moinsUn])]
          nbAlea[0] = new Decimal(randint(2, 9))
          nbAlea[1] = new Decimal(randint(2, 9, nbAlea[0].toNumber()))
          nbAlea[2] = new Decimal(choice([2, 4, 5, 8], [nbAlea[0].toNumber(), nbAlea[1].toNumber()]))
          break
        case 3: // décimaux
          coeff = [dixieme, dixieme, dixieme]
          nbAlea[0] = new Decimal(randint(2, 9))
          nbAlea[1] = new Decimal(randint(2, 9, nbAlea[0].toNumber()))
          nbAlea[2] = cTempCase3
          break
        case 4: // mélange
          nbAlea[0] = new Decimal(randint(2, 9))
          nbAlea[1] = new Decimal(randint(2, 9, nbAlea[0].toNumber()))
          nbAlea[2] = new Decimal(choice([2, 4, 5, 8], [nbAlea[0].toNumber(), nbAlea[1].toNumber()]))

          masterChoix = choice([
            { c: [one, one, one], na: [nbAlea[0], nbAlea[1], nbAlea[2]] },
            {
              c: [choice([one, moinsUn]), choice([one, moinsUn]), choice([one, moinsUn])],
              na: [nbAlea[0], nbAlea[1], nbAlea[2]]
            },
            {
              c: [dixieme, dixieme, dixieme],
              na: [new Decimal(randint(11, 99)), new Decimal(randint(11, 99)), cTempCase3]
            }
          ])
          coeff = masterChoix.c
          nbAlea = masterChoix.na
      }

      let inc
      if (this.exo === '4L15-1') {
        inc = choice(['r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
      } else if (this.exo === '4P10-2') {
        inc = '?'
      } else {
        inc = choice(['x', 'y', 'GO', 'AB', 'z', 'GA', 'BU', 'ZO', 'ME'])
      }

      const a = nbAlea[0].mul(coeff[0])
      const b = nbAlea[1].mul(coeff[1])
      const c = nbAlea[2].mul(coeff[2])
      // const fraction = new FractionEtendue(nbAlea[1].mul(nbAlea[0]), nbAlea[2].div(coeff[0]).div(coeff[1]))

      // pour les situations, autant de situations que de cas dans le switch !
      const situations = [
        { // x/b = a/c
          eq: `\\dfrac{${inc}}{${texNombre(b, 4)}}=\\dfrac{${texNombre(a, 4)}}{${texNombre(c, 4)}}`,
          ligne1: [{ texte: inc, latex: true }, { texte: texNombre(a, 2), latex: true }],
          ligne2: [{ texte: texNombre(b, 2), latex: true }, { texte: texNombre(c, 2), latex: true }]
        },
        { // a/c = x/b
          eq: `\\dfrac{${texNombre(a, 4)}}{${texNombre(c, 4)}}=\\dfrac{${inc}}{${texNombre(b, 4)}}`,
          ligne1: [{ texte: texNombre(a, 2), latex: true }, { texte: inc, latex: true }],
          ligne2: [{ texte: texNombre(c, 2), latex: true }, { texte: texNombre(b, 2), latex: true }]
        },
        { // b/x = c/a
          eq: `\\dfrac{${texNombre(b, 4)}}{${inc}}=\\dfrac{${texNombre(c, 4)}}{${texNombre(a, 4)}}`,
          ligne2: [{ texte: inc, latex: true }, { texte: texNombre(a, 2), latex: true }],
          ligne1: [{ texte: texNombre(b, 2), latex: true }, { texte: texNombre(c, 2), latex: true }]
        },
        { // c/a = b/x
          eq: `\\dfrac{${texNombre(c, 4)}}{${texNombre(a, 4)}}=\\dfrac{${texNombre(b, 4)}}{${inc}}`,
          ligne2: [{ texte: texNombre(a, 2), latex: true }, { texte: inc, latex: true }],
          ligne1: [{ texte: texNombre(c, 2), latex: true }, { texte: texNombre(b, 2), latex: true }]
        }
      ]

      let enoncePlus
      let corrPlusPremiereLigne

      const enonces = []
      for (let k = 0; k < situations.length; k++) {
        if (this.exo === '4P10-2') {
          const monTableau = tableau({ ligne1: situations[k].ligne1, ligne2: situations[k].ligne2, largeur: 5, largeurTitre: 5, nbColonnes: 2 })
          const bordures = fixeBordures([monTableau])
          enoncePlus = mathalea2d(Object.assign(bordures, {
            scale: 0.6,
            style: 'display:block'
          }), monTableau)

          corrPlusPremiereLigne = 'Le tableau ci-dessus est un tableau de proportionnalité, pour déterminer la quatrième proportionnelle, il suffit par exemple de résoudre l\'équation suivante : <br>'
        } else {
          enoncePlus = `$${situations[k].eq}$`
          corrPlusPremiereLigne = ''
        }

        enonces.push({
          enonce: enoncePlus,
          question: '',
          correction: `${corrPlusPremiereLigne}
$${situations[k].eq}$<br>
${texteEnCouleurEtGras('Les produits en croix sont égaux.', 'blue')}<br>
$${texNombre(c, 4)}\\times ${inc} = ${texNombre(a, 2)}\\times ${ecritureParentheseSiNegatif(b)}$<br>
${texteEnCouleurEtGras(`On divise les deux membres par ${texNombre(c, 2)}`, 'blue')}.<br>
$\\dfrac{${texNombre(c, 4)}\\times ${inc}}{${texNombre(c, 4)}}= \\dfrac{${texNombre(a, 4)}\\times ${ecritureParentheseSiNegatif(b)}}{${texNombre(c, 4)}}$<br>
${texteEnCouleurEtGras('On simplifie et on calcule.', 'blue')}<br>
$${inc}=${miseEnEvidence(texNombre(b.mul(a).div(c), 4))}$`,
          correctionInteractif: [b.mul(a).div(c).toFixed(4)]
        })
      }

      texte = `${enonces[listeTypeDeQuestions[i]].enonce}`
      texteCorr = `${enonces[listeTypeDeQuestions[i]].correction}`

      const correctionInteractif = enonces[listeTypeDeQuestions[i]].correctionInteractif[0].replace('{', '').replace('}', '')

      texte += ajouteChampTexteMathLive(this, i, ' ', { texteAvant: `<br> ${inc} = ` })
      reponse = new FractionEtendue(Number(correctionInteractif))
      if (context.isAmc) setReponse(this, i, reponse)
      else setReponse(this, i, reponse, { formatInteractif: 'fractionEgale' })

      if (this.questionJamaisPosee(i, nbAlea)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = ['Type de nombres', 4, '1 : Entiers naturels\n2 : Entiers relatifs\n3 : Décimaux\n4 : Mélange']
}
