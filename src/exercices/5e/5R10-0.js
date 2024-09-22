import { combinaisonListes, combinaisonListesSansChangerOrdre } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { tableauColonneLigne } from '../../lib/2d/tableau'
export const titre = 'Trouver l\'opposé d\'un nombre relatif'
export const dateDeModifImportante = '21/09/2024'

/**
* * Remplir un tableau en utilisant la notion d'opposé
* * 5R10-0
* @author Sébastien Lozano
* Ajout d'un paramètre pour afficher quelques fois le signe des nombres positif par Guillaume Valmont le 26/11/2021
*/

export const uuid = 'cab80'
export const ref = '5R10-0'
export const refs = {
  'fr-fr': ['5R10-0'],
  'fr-ch': ['9NO9-3']
}
export default class TrouverOppose extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireCaseACocher = ['Afficher quelques fois le signe des nombres positifs']
    this.besoinFormulaire2CaseACocher = ['Avec distance à zéro']
    this.sup = true
    this.sup2 = true
    this.nbQuestions = 1
    this.titre = titre
    this.consigne = 'Compléter le tableau suivant.'
  }

  nouvelleVersion () {
    this.reinit()
    const typesDeQuestionsDisponibles = [1]
    const listeTypeDeQuestions = combinaisonListesSansChangerOrdre(typesDeQuestionsDisponibles, this.nbQuestions) // Tous les types de questions sont posées --> à remettre comme ci-dessus
    const listeSignesPositifs = combinaisonListes(['+', ''], 6 * this.nbQuestions)
    const listeSignes = combinaisonListes(['+', '-'], 6 * this.nbQuestions)

    for (let i = 0, texte, texteCorr, indice = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // une fonction pour générer un relatif et son opposé
      const nbRelatifEtSonOppose = function (signe) {
        const signePositif = signe ? listeSignesPositifs[indice] : ''
        const nbNum = randint(0, 9) + randint(0, 9) / 10
        if (listeSignes[indice] === '+') {
          indice++
          return {
            nb: signePositif + texNombre(nbNum),
            dz: texNombre(nbNum), // distance à zéro
            opp: texNombre(-nbNum)
          }
        } else {
          indice++
          return {
            nb: texNombre(-nbNum),
            dz: texNombre(nbNum),
            opp: signePositif + texNombre(nbNum)
          }
        }
      }
      const nbLigneNombres = []
      const nbLigneNombresCorr = []
      const nbLigneNombresOpp = []
      const nbLigneNombresOppCorr = []
      const nbLigneNombresDistZero = []
      const nbLigneNombresDistZeroCorr = []
      for (let k = 0; k < 6; k++) {
        const nb = nbRelatifEtSonOppose(this.sup)
        const lig = this.sup2 ? randint(0, 2) : randint(0, 1)
        if (lig === 0) {
          nbLigneNombres.push('\\phantom{rrrrr}')
          nbLigneNombresCorr.push(miseEnEvidence(nb.nb))
          nbLigneNombresOpp.push(nb.opp)
          nbLigneNombresOppCorr.push(nb.opp)
          nbLigneNombresDistZero.push('\\phantom{rrrrr}')
          nbLigneNombresDistZeroCorr.push(miseEnEvidence(nb.dz))
        } else if (lig === 1) {
          nbLigneNombres.push(nb.nb)
          nbLigneNombresCorr.push(nb.nb)
          nbLigneNombresOpp.push('\\phantom{rrrrr}')
          nbLigneNombresOppCorr.push(miseEnEvidence(nb.opp))
          nbLigneNombresDistZero.push('\\phantom{rrrrr}')
          nbLigneNombresDistZeroCorr.push(miseEnEvidence(nb.dz))
        } else {
          nbLigneNombres.push('\\phantom{rrrrr}')
          nbLigneNombresCorr.push(miseEnEvidence(nb.nb))
          nbLigneNombresOpp.push('\\phantom{rrrrr}')
          nbLigneNombresOppCorr.push(miseEnEvidence(nb.opp))
          nbLigneNombresDistZero.push(nb.dz)
          nbLigneNombresDistZeroCorr.push(nb.dz)
        }
      }

      const enonces = []
      if (this.sup2) {
        enonces.push({
          enonce: `${tableauColonneLigne([], ['\\text{Nombre}', '\\text{Distance à zéro du nombre}', '\\text{Opposé du nombre}'], nbLigneNombres.concat(nbLigneNombresDistZero).concat(nbLigneNombresOpp))}`,
          question: '',
          correction: `${tableauColonneLigne([], ['\\text{Nombre}', '\\text{Distance à zéro du nombre}', '\\text{Opposé du nombre}'], nbLigneNombresCorr.concat(nbLigneNombresDistZeroCorr).concat(nbLigneNombresOppCorr))}`
        })
      } else {
        enonces.push({
          enonce: `${tableauColonneLigne([], ['\\text{Nombre}', '\\text{Opposé du nombre}'], nbLigneNombres.concat(nbLigneNombresOpp))}`,
          question: '',
          correction: `${tableauColonneLigne([], ['\\text{Nombre}', '\\text{Opposé du nombre}'], nbLigneNombresCorr.concat(nbLigneNombresOppCorr))}`
        })
      }

      switch (listeTypeDeQuestions[i]) {
        case 1:
          texte = `${enonces[0].enonce}`
          if (this.debug) {
            texte += '<br>'
            texte += `<br> =====CORRECTION======<br>${enonces[0].correction}`
            texteCorr = ''
          } else {
            texteCorr = `${enonces[0].correction}`
          }
          break
        case 2:
          texte = `${enonces[1].enonce}`
          if (this.debug) {
            texte += '<br>'
            texte += `<br> =====CORRECTION======<br>${enonces[1].correction}`
            texteCorr = ''
          } else {
            texteCorr = `${enonces[1].correction}`
          }
          break
      }

      if (this.listeQuestions.indexOf(texte) === -1) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
