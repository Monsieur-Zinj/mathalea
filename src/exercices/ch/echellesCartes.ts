import { choice, combinaisonListes } from '../../lib/outils/arrayOutils.js'
import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { Tableau } from '../../lib/2d/tableau.js'
import { context } from '../../modules/context.js'
import { texNombre } from '../../lib/outils/texNombre'
import Decimal from 'decimal.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { setReponse } from '../../lib/interactif/gestionInteractif'
export const titre = 'Situation de proportionnalité avec des échelles'
export const dateDePublication = '14/12/2023'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '412a7'
// export const dateDeModifImportante = '24/10/2021'

/**
 * Description didactique de l'exercice
 * @author
*/

export default class EchellesCartes extends Exercice {
  constructor () {
    super()
    this.consigne = ''
    this.nbQuestions = 2
    this.sup = 1
    this.besoinFormulaireNumerique = ['Type de questions', 4, '1 : Distance sur la carte\n2 : Distance réelle\n3 : Échelle\n4 : Mélange']
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    let typeQuestionsDisponibles: ('carte' | 'reelle' | 'echelle')[]
    if (this.sup === 1) {
      typeQuestionsDisponibles = ['carte']
    } else if (this.sup === 2) {
      typeQuestionsDisponibles = ['reelle']
    } else if (this.sup === 3) {
      typeQuestionsDisponibles = ['echelle']
    } else {
      typeQuestionsDisponibles = ['carte', 'reelle', 'echelle']
    }

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const dCarte = randint(2, 30)
      const echelle = new Decimal(randint(1, 50, dCarte)).mul(choice([1, 10, 100, 1000])).mul(1000)
      const dReelle = new Decimal(echelle.mul(dCarte))
      const dReelleKM = dReelle.div(100000)
      const echelleKM = echelle.div(100000)
      const premiereLigneReelle = ['$1$', 'd']
      const deuxiemeLigneReelle = [`$${texNombre(echelleKM, 3)}$`, `$${texNombre(dReelleKM, 3)}$`]
      const premiereLigneCarte = ['$1$', `$${dCarte}$`]
      const deuxiemeLigneCarte = [`$${texNombre(echelleKM, 3)}$`, 'd']
      const premiereLigneEchelle = ['$1$', `$${dCarte}$`]
      const deuxiemeLigneEchelle = ['d', `$${texNombre(dReelleKM, 3)}$`]
      const ligne1CorrCarte = [{ texte: 'Distance sur la carte (cm)' }].concat(premiereLigneCarte.map(elt => {
        return { texte: String(elt), math: true }
      }))
      const ligne2CorrCarte = [{ texte: 'Distance réelle (km)' }].concat(deuxiemeLigneCarte.map(elt => {
        return { texte: String(elt), math: true }
      }))
      const monTableauCorrCarte = new Tableau({
        largeurTitre: 10,
        largeur: 5,
        hauteur: 2,
        nbColonnes: 3,
        ligne1: ligne1CorrCarte,
        ligne2: ligne2CorrCarte
      })
      const ligne1CorrReelle = [{ texte: 'Distance sur la carte (cm)' }].concat(premiereLigneReelle.map(elt => {
        return { texte: String(elt), math: true }
      }))
      const ligne2CorrReelle = [{ texte: 'Distance réelle (km)' }].concat(deuxiemeLigneReelle.map(elt => {
        return { texte: String(elt), math: true }
      }))
      const monTableauCorrReelle = new Tableau({
        largeurTitre: 10,
        largeur: 5,
        hauteur: 2,
        nbColonnes: 3,
        ligne1: ligne1CorrReelle,
        ligne2: ligne2CorrReelle
      })
      const ligne1CorrEchelle = [{ texte: 'Distance sur la carte (cm)' }].concat(premiereLigneEchelle.map(elt => {
        return { texte: String(elt), math: true }
      }))
      const ligne2CorrEchelle = [{ texte: 'Distance réelle (km)' }].concat(deuxiemeLigneEchelle.map(elt => {
        return { texte: String(elt), math: true }
      }))
      const monTableauCorrEchelle = new Tableau({
        largeurTitre: 10,
        largeur: 5,
        hauteur: 2,
        nbColonnes: 3,
        ligne1: ligne1CorrEchelle,
        ligne2: ligne2CorrEchelle
      })
      let texte = ''
      let texteCorr = ''
      switch (listeTypeQuestions[i]) {
        case 'carte':
          texte = `Tu mesures sur une carte d'échelle $1:${texNombre(echelle, 3)}$ une distance de $${dCarte}$ cm entre deux villes.
          <br>Quelle est la distance réelle (en km) entre ces deux villes ?`
          texteCorr = `L'échelle d'une carte correspond au rapport entre la distance sur la carte et la distance réelle. 
          Dans notre cas, 1 cm sur la carte correspond à $${texNombre(echelle, 3)} cm = ${texNombre(echelleKM, 3)} km$ dans la réalité. 
          Ainsi, `
          if (context.isHtml) {
            texteCorr += mathalea2d(Object.assign({}, fixeBordures([monTableauCorrCarte])), monTableauCorrCarte)
          } else {
            texteCorr += '\n\n\\Propor[Math,Stretch=2,largeur=15, GrandeurA=Dist. carte (cm),GrandeurB=Dist. réelle (km)]{'
            texteCorr += `${premiereLigneCarte[0]}/${deuxiemeLigneCarte[0]},${premiereLigneCarte[0]}/${deuxiemeLigneCarte[1]}}<br>`
          }
          texteCorr += `<br> et en utilisant le produit en croix, on obtient que $d=${texNombre(echelleKM, 3)} \\times ${dCarte} = ${texNombre(dReelleKM, 3)}$ km.`
          if (this.interactif && context.isHtml) {
            texte += '<br>' + remplisLesBlancs(this, i, '\\text{La distance réelle est de } %{champ1}\\text{ km}.')
            setReponse(this, i, {
              bareme: (listePoints: number[]) => [listePoints[0], 1],
              champ1: { value: dReelleKM }
            },
            { formatInteractif: 'fillInTheBlank' }
            )
          }
          break
        case 'reelle':
          texte = `Deux villes se situent à une distance de $${dReelleKM}$ km.
          <br>Quelle distance sépare les deux villes (en cm) sur une carte d'échelle $1:${echelle}$ ?`
          texteCorr = `L'échelle d'une carte correspond au rapport entre la distance sur la carte et la distance réelle. 
          Dans notre cas, 1 cm sur la carte correspond à $${echelle} cm = ${echelleKM} km$ dans la réalité. 
          Ainsi, `
          if (context.isHtml) {
            texteCorr += mathalea2d(Object.assign({}, fixeBordures([monTableauCorrReelle])), monTableauCorrReelle)
          } else {
            texteCorr += '\n\n\\Propor[Math,Stretch=2,largeur=15, GrandeurA=Dist. carte (cm),GrandeurB=Dist. réelle (km)]{'
            texteCorr += `${premiereLigneReelle[0]}/${deuxiemeLigneReelle[0]},${premiereLigneReelle[1]}/${deuxiemeLigneReelle[1]}}<br>`
          }
          texteCorr += `<br> et en utilisant le produit en croix, on obtient que $d=1 \\times   ${texNombre(dReelleKM, 3)} \\div ${texNombre(echelleKM, 3)} = ${dCarte}$ cm.`
          if (this.interactif && context.isHtml) {
            texte += '<br>' + remplisLesBlancs(this, i, '\\text{La distance sur la carte est de }%{champ1} \\text{ cm}.')
            setReponse(this, i, {
              bareme: (listePoints: number[]) => [listePoints[0], 1],
              champ1: { value: dCarte }
            },
            { formatInteractif: 'fillInTheBlank' }
            )
          }
          break
        case 'echelle':
          texte = `Deux villes se situent à une distance de $${dCarte}$ cm sur une carte. Dans la réalité, elles se situent à $${texNombre(dReelleKM, 3)}$ km de distance.
          <br> Détermine l'échelle de la carte.`
          texteCorr = `L'échelle d'une carte correspond au rapport entre la distance sur la carte et la distance réelle. 
          Dans notre cas, $${dCarte}$ cm sur la carte correspondent à $${texNombre(dReelle, 3)}$ km dans la réalité. 
          Ainsi,`
          if (context.isHtml) {
            texteCorr += mathalea2d(Object.assign({}, fixeBordures([monTableauCorrEchelle])), monTableauCorrEchelle)
          } else {
            texteCorr += '\n\n\\Propor[Math,Stretch=2,largeur=15, GrandeurA=Dist. carte (cm),GrandeurB=Dist. réelle (km)]{'
            texteCorr += `${premiereLigneEchelle[0]}/${deuxiemeLigneEchelle[0]},${premiereLigneEchelle[1]}/${deuxiemeLigneEchelle[1]}}<br>`
          }
          texteCorr += `<br> donc $d=${dReelleKM} \\div  ${dCarte}=${echelleKM}$ km. Ce qui signifie que $1cm$ sur la carte correspond à $${echelleKM}km=${echelle}cm$ en réalité. L'échelle de la carte est 1:${echelle}.`
          if (this.interactif && context.isHtml) {
            texte += '<br>' + remplisLesBlancs(this, i, '\\text{L\'échelle de la carte est } %{champ1}:%{champ2}')
            setReponse(this, i, {
              bareme: (listePoints: number[]) => [Math.min(listePoints[0], listePoints[1]), 1],
              champ1: { value: 1 },
              champ2: { value: echelle }
            },
            { formatInteractif: 'fillInTheBlank' }
            )
          }
          break
      }
      if (this.questionJamaisPosee(i, dCarte, dReelle.toString(), echelle.toString())) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
