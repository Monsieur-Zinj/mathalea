import { combinaisonListes, choice } from '../../lib/outils/arrayOutils.js'
import { numAlpha } from '../../lib/outils/outilString.js'
import Exercice from '../Exercice.js'
import { randint, listeQuestionsToContenuSansNumero } from '../../modules/outils.js'
import { context } from '../../modules/context.js'
import { tableauColonneLigne } from '../../lib/2d/tableau.js'
import { AddTabDbleEntryMathlive } from '../../lib/interactif/tableaux/AjouteTableauMathlive'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { numberCompare } from '../../lib/interactif/mathLive.js'
import Decimal from 'decimal.js'
import { texNombre } from '../../lib/outils/texNombre'
import FractionEtendue from '../../modules/FractionEtendue.js'
export const titre = 'Compléter et utiliser un tableau d\'effectif'
export const dateDePublication = '08/01/2024'
export const interactifReady = true
export const interactifType = 'mathLive'
/**
 * Compléter ou utiliser un tableau
 * @author Gilles Mora
 * Références 2S10-4
 */
export const uuid = '3f39d'
// Je déréférence temporairement pour éviter que cet exo non finalisé apparaîsse dans le menu.
// export const ref = '2S10-4'

export default function TableauProportion () {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.nbCols = 1
  this.nbColsCorr = 1
  this.spacing = context.isHtml ? 1 : 2
  this.spacingCorr = context.isHtml ? 1 : 2
  this.nbQuestions = 1
  this.sup = 2
  this.tailleDiaporama = 1
  this.listeAvecNumerotation = false
  this.exoCustomResultat = true

  this.nouvelleVersion = function () {
    this.answers = {}
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []

    let typesDeQuestionsDisponibles = [1]
    if (this.sup === 2) {
      typesDeQuestionsDisponibles = [2]
    } else if (this.sup === 3) {
      typesDeQuestionsDisponibles = [1, 2]
    }
    const toutPourUn = (listePoints) => [Math.min(...listePoints), 1]
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    this.autoCorrection = []
    let index = 0
    let increment = 1
    for (let i = 0, texte, texteCorr, cpt = 0, typesDeQuestions; i < this.nbQuestions && cpt < 50;) {
      typesDeQuestions = listeTypeDeQuestions[i]
      const total = choice([100, 150, 200, 250, 300, 350])//
      const totalGA = randint(4, 6) * total / 10
      const totalG = randint(5, 6) * total / 10
      const totalF = total - totalGA
      const totalT = total - totalG
      const GAetG = choice([26, 28]) * total / 100
      const FetG = totalG - GAetG
      const GAetT = totalGA - GAetG
      const FetT = totalF - FetG
      const pourcGA = new Decimal(totalGA).div(total).mul(100)
      const pourcG = new Decimal(totalG).div(total).mul(100)
      const pourcGAetG = new Decimal(GAetG).div(total).mul(100)
      const pourcF = new Decimal(totalF).div(total).mul(100)
      const pourcT = new Decimal(totalT).div(total).mul(100)
      const choixEnonce = choice([`Dans un lycée, on compte $${total}$ élèves en classe de première dont $${texNombre(pourcGA, 0)} \\,\\%$ sont des garçons et $${texNombre(pourcG, 0)} \\,\\%$ sont dans une filière générale. <br>
      De plus, $${texNombre(pourcGAetG, 0)} \\,\\%$ des élèves sont des garçons en première générale.`,
      `Dans un lycée, on compte $${total}$ élèves en classe de première dont $${texNombre(pourcF, 0)} \\,\\%$ sont des filles et $${texNombre(pourcT, 0)} \\,\\%$ sont dans une filière technologique. <br>
      De plus, $${texNombre(pourcGAetG, 0)} \\,\\%$ des élèves sont des garçons en première générale.`])
      const entetesCol = ['~', '\\text{Garçons}', '\\text{Filles}', '\\text{Total}']
      const entetesLgn = ['\\text{Filière générale}', '\\text{Filière technologique}', '\\text{Total}']
      const contenu = ['', '', '', '', '', '', '', '', '']
      switch (typesDeQuestions) {
        case 1: // tableau à compléter
          texte = `${choixEnonce}`
          texte += ' Compléter le tableau suivant :<br><br>'
          if (this.interactif) {
            const tableauVide = AddTabDbleEntryMathlive.convertTclToTableauMathlive(entetesCol, entetesLgn, ['', '', '', '', '', '', '', '', ''])
            const tabMathlive = AddTabDbleEntryMathlive.create(this.numeroExercice, index, tableauVide, 'nospacebefore')
            texte += tabMathlive.output
          } else {
            texte += tableauColonneLigne(entetesCol, entetesLgn, contenu)
          }
          texteCorr = tableauColonneLigne(['~', '\\text{Garçons}', '\\text{Filles}', '\\text{Total}'],
            ['\\text{Filière générale}', '\\text{Filière technologique}', '\\text{Total}'],
            [`${GAetG}`, `${FetG}`, `${totalG}`, `${GAetT}`, `${FetT}`, `${totalT}`, `${totalGA}`, `${totalF}`, `${total}`])
          setReponse(this, index, {
            bareme: toutPourUn,
            L1C1: { value: GAetG, compare: numberCompare },
            L1C2: { value: FetG, compare: numberCompare },
            L1C3: { value: totalG, compare: numberCompare },
            L2C1: { value: GAetT, compare: numberCompare },
            L2C2: { value: FetT, compare: numberCompare },
            L2C3: { value: totalT, compare: numberCompare },
            L3C1: { value: totalGA, compare: numberCompare },
            L3C2: { value: totalF, compare: numberCompare },
            L3C3: { value: total, compare: numberCompare }
          },
          { formatInteractif: 'tableauMathlive' })
          increment = 1
          break
        case 2: // tableau à utiliser
          texte = `Dans un lycée, on compte $${total}$ élèves en classe de première.<br>
        Ils sont répartis selon le tableau suivant :<br><br> `
          texte += tableauColonneLigne(['~', '\\text{Garçons}', '\\text{Filles}', '\\text{Total}'],
            ['\\text{Filière générale}', '\\text{Filière technologique}', '\\text{Total}'],
            [`${GAetG}`, `${FetG}`, `${totalG}`, `${GAetT}`, `${FetT}`, `${totalT}`, `${totalGA}`, `${totalF}`, `${total}`])

          texte += `<br><br>${numAlpha(0)}  Quelle est la proportion de filles en première technologique parmi les élèves de ce lycée ?`
          setReponse(this, index, new FractionEtendue(FetT, total), { formatInteractif: 'fractionEgale' })
          texte += ajouteChampTexteMathLive(this, index, 'inline largeur01')
          texte += `<br><br>${numAlpha(1)} Quelle est la proportion de filles en première technologique parmi les élèves en première technologique ?`
          setReponse(this, index + 1, new FractionEtendue(FetT, totalT), { formatInteractif: 'fractionEgale' })
          texte += ajouteChampTexteMathLive(this, index + 1, 'inline largeur01')

          texte += `<br><br>${numAlpha(3)}  Quelle est la proportion de filles en première technologique parmi les filles ?`
          setReponse(this, index + 2, new FractionEtendue(FetT, totalF), { formatInteractif: 'fractionEgale' })
          texte += ajouteChampTexteMathLive(this, index + 2, 'inline largeur01')
          texteCorr = ''
          increment = 3
          break
      }

      if (this.questionJamaisPosee(i, total, typesDeQuestions[i])) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
        index += increment
      }
      cpt++
    }
    listeQuestionsToContenuSansNumero(this)
  }
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, ' 1 : Tableau à compléter\n 2 : Utiliser un tableau\n 3 : Mélange']
}
