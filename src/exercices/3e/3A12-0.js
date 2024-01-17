import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { numAlpha } from '../../lib/outils/outilString.js'
import { texNombre } from '../../lib/outils/texNombre.js'
import Exercice from '../Exercice.js'
import { contraindreValeur, listeQuestionsToContenu, ppcm, randint } from '../../modules/outils.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { engrenages } from '../../lib/2d/engrenage.js'
import { setReponse } from '../../lib/interactif/gestionInteractif.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'

export const titre = 'Problèmes avec des engrenages'
export const dateDePublication = '05/10/2022'

/**
 * @author Jean-Claude Lhote
 * Résoudre des problèmes de ppcm avec les engrenages.
 */
export const uuid = '6b37f'
export const ref = '3A12-0'

export default class EngrenagesAnimes extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.nbCols = 1
    this.nbColsCorr = 1
    this.sup = 1
    this.sup2 = false
    this.besoinFormulaireNumerique = ['Niveau de difficulté', 4, '1 : Calculer le nombre de dents\n2 : Calculer le nombre de tours\n3 : Synchroniser 3 roues\n4 : Mélange']
    this.besoinFormulaire2CaseACocher = ['Arrêt de l\'animation après un cycle']
  }

  // eslint-disable-next-line no-unused-vars

  nouvelleVersion (numeroExercice) {
    this.listeQuestions = []
    this.listeCorrections = []
    this.sup = contraindreValeur(1, 4, this.sup, 1)
    const typeDeQuestionsDisponibles = this.sup === 1 ? [1, 2] : this.sup === 2 ? [3, 4] : this.sup === 3 ? [5] : [1, 2, 3, 4, 5]
    const listeTypesDeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions)

    /**
     * Liste les multiples de nbDentsRoueA par séries de 5 jusqu'à mettre en évidence un multiple de nbDentsRoueB
     * @param {number} nbDentsRoueA
     * @param {number} nbDentsRoueB
     */
    const listePremiersMultiples = function (nbDentsRoueA, nbDentsRoueB) {
      let result = `Voici la liste des premiers multiples de $${nbDentsRoueA}$ :<br>`
      // on va faire en sorte de toujours avoir un nombre de multiples multiple de 5
      const nbMarge = 5 - (ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueA) % 5
      const kMax = (ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueA + nbMarge)
      for (let k = 1; k < kMax + 1; k++) {
        result += `$${k}\\times${nbDentsRoueA} = `
        if (k === (ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueA)) {
          result += miseEnEvidence(texNombre(k * nbDentsRoueA, 0), 'blue')
          result += '$ ; '
        } else {
          result += `${texNombre(k * nbDentsRoueA, 0)}$ ; `
        }
        if (k % 5 === 0 && k !== kMax) {
          result += '<br>'
        }
      }
      result += '$\\ldots$ '
      result += '<br>'
      return result
    }
    const objetsEnonce = []
    const objetsCorrection = []
    let interA, interB, interC, interABC
    let nbDentsRoueA, nbDentsRoueB, nbDentsRoueC
    let nbToursA, nbToursB, nbToursC, nbToursAbc
    let roueACorr, roueBCorr, roueCCorr
    let texte = '' // Nous utilisons souvent cette variable pour construire le texte de la question.
    let texteCorr = '' // Idem pour le texte de la correction.
    let remiseAZero
    const divM2d = document.createElement('div') // Notre nouveau div de type HTMLElement (et non plus un string)
    divM2d.setAttribute('id', 'divM2d')
    let roues = []
    let rouesCorr
    let animRoueA, animRoueB, animRoueC, compteurRoueA, compteurRoueB, compteurRoueC
    switch (listeTypesDeQuestions[0]) {
      case 1:
        do {
          nbDentsRoueA = randint(8, 25)
          nbDentsRoueB = randint(8, 25, nbDentsRoueA)
          nbToursA = ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueA
          nbToursB = ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueB
        } while ((nbToursA > 4 && nbToursB > 4) || nbToursA === 1 || nbToursB === 1) // au moins une des deux roues fait moins de 5 tours
        texte += `La roue dentée de gauche possède $${nbDentsRoueA}$ dents ` + (context.isHtml ? '(le dessin n\'est pas représentatif)' : '') + '.<br>'
        texte += `Quand elle effectue $${nbToursA}$ tours, la roue de droite effectue $${nbToursB}$ tours.<br>`
        texte += 'Combien la roue de droite possède-t-elle de dents ?'
        texte += ajouteChampTexteMathLive(this, 0, 'largeur01 inline')
        texte += '<br>'
        texteCorr += 'Le nombre de dents multiplié par le nombre de tours de chaque roue doit donner le même résultat.<br>'
        texteCorr = `La roue de gauche effectue $${nbToursA}$ tours, donc tourne de $${nbToursA}\\times ${nbDentsRoueA}=${nbDentsRoueA * nbToursA}$ dents.<br>`
        texteCorr += `Soit $n$ le nombre de dents de la roue de droite qui effectue $${nbToursB}$ tours, on a alors : $n\\times${nbToursB} = ${nbDentsRoueA}\\times ${nbToursA} = ${nbDentsRoueA * nbToursA}$.<br>`
        texteCorr += `On en déduit que $n=\\dfrac{${nbDentsRoueA * nbToursA}}{${nbToursB}}=${nbDentsRoueB}$.<br>`
        texteCorr += `La roue de droite a donc $${miseEnEvidence(nbDentsRoueB)}$ dents.<br>`
        setReponse(this, 0, nbDentsRoueB)
        roues = engrenages({ dureeTourBase: 0, module: 0.4 }, nbDentsRoueA, nbDentsRoueB)
        rouesCorr = engrenages({ dureeTourBase: Math.ceil(20 / Math.max(nbToursA, nbToursB)), module: 0.4, marqueurs: true }, nbDentsRoueA, nbDentsRoueB)
        roueACorr = rouesCorr[0]
        roueBCorr = rouesCorr[1]
        remiseAZero = () => {
          if (divM2d == null) return
          try {
            clearInterval(interABC)
            clearInterval(interA)
            clearInterval(interB)
            clearInterval(interC)
            do {
              animRoueA = divM2d.querySelector(`#animRoue${roueACorr.id}`)
              animRoueB = divM2d.querySelector(`#animRoue${roueBCorr.id}`)
            } while (animRoueA == null || animRoueB == null)
            animRoueA.beginElement()
            animRoueB.beginElement()
            do {
              compteurRoueA = divM2d.querySelector(`text#compteur${roueACorr.id}`)
              compteurRoueB = divM2d.querySelector(`text#compteur${roueBCorr.id}`)
            } while (compteurRoueA == null || compteurRoueB == null)
            compteurRoueA.textContent = '0'
            compteurRoueB.textContent = '0'
            interA = setInterval(() => {
              compteurRoueA.textContent = parseInt(compteurRoueA.textContent) + 1
            }, animRoueA.getAttribute('dur') * 1000)
            interB = setInterval(() => {
              compteurRoueB.textContent = parseInt(compteurRoueB.textContent) + 1
            }, animRoueB.getAttribute('dur') * 1000)
            if (this.sup2) {
              interABC = setInterval(() => {
                animRoueA.endElement()
                animRoueB.endElement()
                clearInterval(interA)
                clearInterval(interB)
              }, ppcm(2 * parseFloat(animRoueA.getAttribute('dur')), 2 * parseFloat(animRoueB.getAttribute('dur'))) * 500)
            }
          } catch (e) {
            window.notify(`${e.msg} ... erreur dans la fonction remiseAZero()`, { divM2d: JSON.stringify(divM2d), animRoueA, animRoueB, compteurRoueA, compteurRoueB })
          }
        }

        break
      case 2:
        do {
          nbDentsRoueA = randint(8, 25)
          nbDentsRoueB = randint(8, 25, nbDentsRoueA)
          nbToursA = ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueA
          nbToursB = ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueB
        } while ((nbToursA > 4 && nbToursB > 4) || nbToursA === 1 || nbToursB === 1) // au moins une des deux roues fait moins de 5 tours
        texte += `La roue dentée de gauche possède $${nbDentsRoueA}$ dents ` + (context.isHtml ? '(le dessin n\'est pas représentatif)' : '') + '.<br>'
        texte += `Elle tourne de $${nbToursA * nbDentsRoueA}$ dents. Pendant ce temps, la roue de droite fait $${nbToursB}$ tour${nbToursB > 1 ? 's' : ''}.<br>`
        texte += 'Combien la roue de droite possède-t-elle de dents ?'
        texte += ajouteChampTexteMathLive(this, 0, 'largeur01 inline')
        texte += '<br>'
        setReponse(this, 0, nbDentsRoueB)
        texteCorr += 'Le nombre de dents multiplié par le nombre de tours de chaque roue doit donner le même résultat.<br>'
        texteCorr += `La roue de gauche tourne de $${nbToursA * nbDentsRoueA}$ dents en $${nbToursA}$ tours.<br>`
        texteCorr += `Soit $n$ le nombre de dents de la roue de droite, on a alors : $n\\times${nbToursB} = ${nbDentsRoueA * nbToursA}$.<br>`
        texteCorr += `On en déduit que $n=\\dfrac{${nbDentsRoueA * nbToursA}}{${nbToursB}}=${nbDentsRoueB}$.<br>`
        texteCorr += `La roue de droite a donc $${miseEnEvidence(nbDentsRoueB)}$ dents.<br>`
        roues = engrenages({ dureeTourBase: 0, module: 0.4 }, nbDentsRoueA, nbDentsRoueB)
        rouesCorr = engrenages({ dureeTourBase: Math.ceil(20 / Math.max(nbToursA, nbToursB)), module: 0.4, marqueurs: true }, nbDentsRoueA, nbDentsRoueB)
        roueACorr = rouesCorr[0]
        roueBCorr = rouesCorr[1]
        remiseAZero = () => {
          if (divM2d == null) return
          try {
            clearInterval(interABC)
            clearInterval(interA)
            clearInterval(interB)
            clearInterval(interC)
            do {
              animRoueA = divM2d.querySelector(`#animRoue${roueACorr.id}`)
              animRoueB = divM2d.querySelector(`#animRoue${roueBCorr.id}`)
            } while (animRoueA == null || animRoueB == null)
            animRoueA.beginElement()
            animRoueB.beginElement()
            do {
              compteurRoueA = divM2d.querySelector(`text#compteur${roueACorr.id}`)
              compteurRoueB = divM2d.querySelector(`text#compteur${roueBCorr.id}`)
            } while (compteurRoueA == null || compteurRoueB == null)
            compteurRoueA.innerHTML = '0'
            compteurRoueB.innerHTML = '0'
            interA = setInterval(() => {
              compteurRoueA.innerHTML = String(parseInt(compteurRoueA.innerHTML) + 1)
            }, animRoueA.getAttribute('dur') * 1000)
            interB = setInterval(() => {
              compteurRoueB.innerHTML = String(parseInt(compteurRoueB.innerHTML) + 1)
            }, animRoueB.getAttribute('dur') * 1000)
            if (this.sup2) {
              interABC = setInterval(() => {
                animRoueA.endElement()
                animRoueB.endElement()
                clearInterval(interA)
                clearInterval(interB)
              }, ppcm(2 * parseFloat(animRoueA.getAttribute('dur')), 2 * parseFloat(animRoueB.getAttribute('dur'))) * 500)
            }
          } catch (e) {
            window.notify(`${e.msg} ... erreur dans la fonction remiseAZero()`, { divM2d: JSON.stringify(divM2d), animRoueA, animRoueB, compteurRoueA, compteurRoueB })
          }
        }

        break
      case 3:
        do {
          nbDentsRoueA = randint(8, 25)
          nbDentsRoueB = randint(8, 25, nbDentsRoueA)
          nbToursA = ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueA
          nbToursB = ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueB
        } while ((nbToursA > 4 && nbToursB > 4) || nbToursA === 1 || nbToursB === 1) // au moins une des deux roues fait moins de 5 tours
        texte += `La roue dentée de gauche possède $${nbDentsRoueA}$ dents et celle de droite possède $${nbDentsRoueB}$ dents.<br>`
        texte += `${numAlpha(0)} Au bout de combien de tours pour la roue de gauche les deux roues retrouveront leur position initiale ?<br>`
        texte += `${numAlpha(1)} Combien de tours aura alors effectués la roue de droite ?`
        texte += ajouteChampTexteMathLive(this, 0, 'largeur01 inline')
        texte += '<br>'
        setReponse(this, 0, nbToursB)
        texteCorr += `Lorsque la roue de gauche effectue $n$ tours, cela fait $${nbDentsRoueA}n$ dents.<br>`
        texteCorr += `Lorsque la roue de gauche effectue $m$ tours, cela fait $${nbDentsRoueB}m$ dents.<br>`
        texteCorr += `Nous cherchons donc le plus petit multiple commun à $${nbDentsRoueA}$ et à $${nbDentsRoueB}$.<br>`
        texteCorr += listePremiersMultiples(nbDentsRoueA, nbDentsRoueB)
        texteCorr += listePremiersMultiples(nbDentsRoueB, nbDentsRoueA)
        texteCorr += `${numAlpha(0)}Il faudra donc $${nbToursA}$ tours de la roue de gauche pour que les roues retrouvent leur position initiale.<br>`
        texteCorr += `${numAlpha(1)}La roue de droite aura effectué alors $${miseEnEvidence(nbToursB)}$ tours.<br>`
        roues = engrenages({ dureeTourBase: 0, module: 0.4 }, nbDentsRoueA, nbDentsRoueB)
        rouesCorr = engrenages({ dureeTourBase: Math.ceil(20 / Math.max(nbToursA, nbToursB)), module: 0.4, marqueurs: true }, nbDentsRoueA, nbDentsRoueB)
        roueACorr = rouesCorr[0]
        roueBCorr = rouesCorr[1]
        remiseAZero = () => {
          if (divM2d == null) return
          try {
            clearInterval(interABC)
            clearInterval(interA)
            clearInterval(interB)
            clearInterval(interC)
            do {
              animRoueA = divM2d.querySelector(`#animRoue${roueACorr.id}`)
              animRoueB = divM2d.querySelector(`#animRoue${roueBCorr.id}`)
            } while (animRoueA == null || animRoueB == null)
            animRoueA.beginElement()
            animRoueB.beginElement()
            do {
              compteurRoueA = divM2d.querySelector(`text#compteur${roueACorr.id}`)
              compteurRoueB = divM2d.querySelector(`text#compteur${roueBCorr.id}`)
            } while (compteurRoueA == null || compteurRoueB == null)
            compteurRoueA.innerHTML = '0'
            compteurRoueB.innerHTML = '0'
            interA = setInterval(() => {
              compteurRoueA.innerHTML = parseInt(compteurRoueA.innerHTML) + 1
            }, animRoueA.getAttribute('dur') * 1000)
            interB = setInterval(() => {
              compteurRoueB.innerHTML = parseInt(compteurRoueB.innerHTML) + 1
            }, animRoueB.getAttribute('dur') * 1000)
            if (this.sup2) {
              interABC = setInterval(() => {
                animRoueA.endElement()
                animRoueB.endElement()
                clearInterval(interA)
                clearInterval(interB)
              }, ppcm(2 * parseFloat(animRoueA.getAttribute('dur')), 2 * parseFloat(animRoueB.getAttribute('dur'))) * 500)
            }
          } catch (e) {
            window.notify(`${e.msg} ... erreur dans la fonction remiseAZero()`, { divM2d: JSON.stringify(divM2d), animRoueA, animRoueB, compteurRoueA, compteurRoueB })
          }
        }
        break
      case 4:
        do {
          nbDentsRoueA = randint(8, 25)
          nbDentsRoueB = randint(8, 25, nbDentsRoueA)
          nbToursA = ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueA
          nbToursB = ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueB
        } while ((nbToursA > 4 && nbToursB > 4) || nbToursA === 1 || nbToursB === 1) // au moins une des deux roues fait moins de 5 tours
        texte += `La roue dentée de gauche possède $${nbDentsRoueA}$ dents et la roue de droite en possède $${nbDentsRoueB}$ ` + (context.isHtml ? '(le dessin n\'est pas représentatif)' : '') + '.<br>'
        texte += `La roue de gauche tourne de $${nbToursA * nbDentsRoueA}$ dents.<br>Pendant ce temps, combien la roue de droite effectue-t-elle de tours ?`
        texte += ajouteChampTexteMathLive(this, 0, 'largeur01 inline')
        texte += '<br>'
        setReponse(this, 0, nbToursB)
        texteCorr += 'Le nombre de dents multiplié par le nombre de tours de chaque roue doit donner le même résultat.<br>'
        texteCorr += `La roue de gauche tourne de $${nbToursA * nbDentsRoueA}$ dents.<br>`
        texteCorr += `Soit $n$ le nombre de tours de la roue de droite qui a $${nbDentsRoueB}$ dents, on a alors : $n\\times${nbDentsRoueB} = ${nbDentsRoueA * nbToursA}$.<br>`
        texteCorr += `On en déduit que $n=\\dfrac{${nbDentsRoueA * nbToursA}}{${nbDentsRoueB}}=${nbToursB}$<br>`
        texteCorr += `La roue de droite a donc effectué $${miseEnEvidence(nbToursB)}$ tours pendant que la roue de gauche en a effectués $${nbToursA}$.<br>`
        roues = engrenages({ dureeTourBase: 0, module: 0.4 }, nbDentsRoueA, nbDentsRoueB)
        rouesCorr = engrenages({ dureeTourBase: Math.ceil(20 / Math.max(nbToursA, nbToursB)), module: 0.4, marqueurs: true }, nbDentsRoueA, nbDentsRoueB)
        roueACorr = rouesCorr[0]
        roueBCorr = rouesCorr[1]
        remiseAZero = () => {
          try {
            clearInterval(interABC)
            clearInterval(interA)
            clearInterval(interB)
            clearInterval(interC)
            do {
              animRoueA = divM2d.querySelector(`#animRoue${roueACorr.id}`)
              animRoueB = divM2d.querySelector(`#animRoue${roueBCorr.id}`)
            } while (animRoueA == null || animRoueB == null)
            animRoueA.beginElement()
            animRoueB.beginElement()
            do {
              compteurRoueA = divM2d.querySelector(`text#compteur${roueACorr.id}`)
              compteurRoueB = divM2d.querySelector(`text#compteur${roueBCorr.id}`)
            } while (compteurRoueA == null || compteurRoueB == null)
            compteurRoueA.innerHTML = '0'
            compteurRoueB.innerHTML = '0'
            interA = setInterval(() => {
              compteurRoueA.innerHTML = parseInt(compteurRoueA.innerHTML) + 1
            }, animRoueA.getAttribute('dur') * 1000)
            interB = setInterval(() => {
              compteurRoueB.innerHTML = parseInt(compteurRoueB.innerHTML) + 1
            }, animRoueB.getAttribute('dur') * 1000)
            if (this.sup2) {
              interABC = setInterval(() => {
                animRoueA.endElement()
                animRoueB.endElement()
                clearInterval(interA)
                clearInterval(interB)
              }, ppcm(2 * parseFloat(animRoueA.getAttribute('dur')), 2 * parseFloat(animRoueB.getAttribute('dur'))) * 500)
            }
          } catch (e) {
            window.notify(`${e.msg} ... erreur dans la fonction remiseAZero()`, { divM2d: JSON.stringify(divM2d), animRoueA, animRoueB, compteurRoueA, compteurRoueB })
          }
        }
        break
      case 5:
        do {
          nbDentsRoueA = randint(8, 25)
          nbDentsRoueB = randint(8, 12, nbDentsRoueA)
          nbDentsRoueC = randint(8, 25, [nbDentsRoueA, nbDentsRoueB])
          nbToursA = ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueA
          nbToursB = ppcm(nbDentsRoueA, nbDentsRoueB) / nbDentsRoueB
          nbToursC = ppcm(nbDentsRoueA, nbDentsRoueC) / nbDentsRoueC
          nbToursAbc = ppcm(ppcm(nbDentsRoueA, nbDentsRoueB), nbDentsRoueC) / nbDentsRoueA
        } while ((nbToursA > 4 && nbToursC > 4 && nbToursB > 4) || nbToursA === 1 || nbToursC === 1 || nbToursB === 1) // au moins une des deux roues fait moins de 5 tours
        roues = engrenages({ dureeTourBase: 0, module: 0.4 }, nbDentsRoueA, nbDentsRoueB, nbDentsRoueC)
        rouesCorr = engrenages({ dureeTourBase: Math.ceil(20 / Math.max(nbToursA, nbToursB, nbToursC)), module: 0.4, marqueurs: true }, nbDentsRoueA, nbDentsRoueB, nbDentsRoueC)
        roueACorr = rouesCorr[0]
        roueBCorr = rouesCorr[1]
        roueCCorr = rouesCorr[2]
        texte += `La roue de gauche possède $${nbDentsRoueA}$ dents, celle du milieu en a $${nbDentsRoueB}$ et celle de droite en a $${nbDentsRoueC}$.<br>`
        texte += `${numAlpha(0)}Combien de tours doit effectuer la roue de gauche avant que son repère et celui de la roue du milieu soient à nouveau comme dans la position initiale ?`
        texte += ajouteChampTexteMathLive(this, 0, 'largeur01 inline')
        texte += '<br>'
        setReponse(this, 0, nbToursA)
        texte += `${numAlpha(1)}Combien de tours doit effectuer la roue de gauche avant que son repère et celui de la roue de droite soient à nouveau comme dans la position initiale ?`
        texte += ajouteChampTexteMathLive(this, 0, 'largeur01 inline')
        texte += '<br>'
        setReponse(this, 1, nbToursB)
        texte += `${numAlpha(2)}`
        texte += this.interactif
          ? `Dans la situation ${numAlpha(1, true)}, la roue du milieu n'étant pas dans sa position initiale, combien de tours la roue de gauche doit-elle effectuer pour que les trois roues retrouvent leur position initiale ?`
          : `Dans la situation ${numAlpha(1, true)}, la roue du milieu est-elle dans sa position initiale ? Sinon, combien de tours la roue de gauche doit-elle effectuer pour que les trois roues retrouvent leur position initiale ?`
        texte += ajouteChampTexteMathLive(this, 0, 'largeur01 inline')
        texte += '<br>'
        setReponse(this, 0, nbToursAbc)
        texteCorr += `${numAlpha(0)}Le nombre de dents multiplié par le nombre de tours de chaque roue doit donner le même résultat.<br>`
        texteCorr += `Nous cherchons donc le plus petit multiple commun à $${nbDentsRoueA}$ et à $${nbDentsRoueB}$.<br>`
        texteCorr += listePremiersMultiples(nbDentsRoueA, nbDentsRoueB)
        texteCorr += listePremiersMultiples(nbDentsRoueB, nbDentsRoueA)
        texteCorr += `Il faudra donc $${miseEnEvidence(nbToursA)}$ tours de la roue de gauche et $${nbToursB}$ tours à la roue du milieu pour qu'elles se retrouvent dans leur position initiale.<br>`
        texteCorr += `<br>${numAlpha(1)}Faisons de même avec la roue de gauche et celle de droite.<br>`
        texteCorr += `Nous cherchons donc le plus petit multiple commun à $${nbDentsRoueA}$ et à $${nbDentsRoueC}$.<br>`
        texteCorr += listePremiersMultiples(nbDentsRoueA, nbDentsRoueC)
        texteCorr += listePremiersMultiples(nbDentsRoueC, nbDentsRoueA)
        texteCorr += `La roue de droite effectuera donc $${miseEnEvidence(nbToursC)}$ tours quand la roue de gauche en effectuera $${nbToursC * nbDentsRoueC / nbDentsRoueA}$.<br>`
        if (nbToursC !== nbDentsRoueA) {
          texteCorr += `En effet $${nbToursC}\\times ${nbDentsRoueC}=${nbToursC * nbDentsRoueC / nbDentsRoueA}\\times ${nbDentsRoueA}=${nbToursC * nbDentsRoueC}$.<br>`
        } else {
          texteCorr += `Remarque : Quand le plus petit multiple commun de deux nombres est le produit de ces nombres, on dit qu'ils sont premiers entre eux. $${nbDentsRoueC}$ et $${nbDentsRoueA}$ sont premiers entre eux.<br>`
        }
        texteCorr += `<br>${numAlpha(2)}Dans cette situation, la roue du milieu tourne, elle aussi, de $${nbToursC * nbDentsRoueC}$ dents.<br>`
        texteCorr += nbToursC * nbDentsRoueC % nbDentsRoueB === 0 ? `Ce nombre est un multiple du nombre de dents de la roue du milieu, donc elle a effectué exactement $\\dfrac{${nbToursC * nbDentsRoueC}}{${nbDentsRoueB}}=${nbToursC * nbDentsRoueC / nbDentsRoueB}$ tours.<br>` : 'Ce nombre n\'est pas un multiple du nombre de dents de la roue du milieu, donc elle ne sera pas dans sa position initiale.<br>'
        texteCorr += `Il faudra attendre que la roue de gauche tourne de $${nbToursAbc * nbDentsRoueA}$ dents soit $${miseEnEvidence(nbToursAbc)}$ tours, la roue du milieu en fera $${nbToursAbc * nbDentsRoueA / nbDentsRoueB}$ et la roue de droite en fera $${nbToursAbc * nbDentsRoueA / nbDentsRoueC}$.<br>`
        remiseAZero = () => {
          if (divM2d == null) return
          try {
            clearInterval(interABC)
            clearInterval(interA)
            clearInterval(interB)
            clearInterval(interC)
            do {
              animRoueA = divM2d.querySelector(`#animRoue${roueACorr.id}`)
              animRoueB = divM2d.querySelector(`#animRoue${roueBCorr.id}`)
              animRoueC = divM2d.querySelector(`#animRoue${roueCCorr.id}`)
            } while (animRoueA == null || animRoueB == null || animRoueC == null)
            animRoueA.beginElement()
            animRoueB.beginElement()
            animRoueC.beginElement()
            do {
              compteurRoueA = divM2d.querySelector(`text#compteur${roueACorr.id}`)
              compteurRoueB = divM2d.querySelector(`text#compteur${roueBCorr.id}`)
              compteurRoueC = divM2d.querySelector(`text#compteur${roueCCorr.id}`)
            } while (compteurRoueA == null || compteurRoueB == null || compteurRoueC == null)
            compteurRoueA.innerHTML = '0'
            compteurRoueB.innerHTML = '0'
            compteurRoueC.innerHTML = '0'
            interA = setInterval(() => {
              compteurRoueA.innerHTML = parseInt(compteurRoueA.innerHTML) + 1
            }, animRoueA.getAttribute('dur') * 1000)
            interB = setInterval(() => {
              compteurRoueB.innerHTML = parseInt(compteurRoueB.innerHTML) + 1
            }, animRoueB.getAttribute('dur') * 1000)
            interC = setInterval(() => {
              compteurRoueC.innerHTML = parseInt(compteurRoueC.innerHTML) + 1
            }, animRoueC.getAttribute('dur') * 1000)
            if (this.sup2) {
              interABC = setInterval(() => {
                animRoueA.endElement()
                animRoueB.endElement()
                animRoueC.endElement()
                clearInterval(interA)
                clearInterval(interB)
                clearInterval(interC)
              }, parseFloat(animRoueA.getAttribute('dur')) * nbToursAbc * 1000)
            }
          } catch (e) {
            window.notify(`${e.msg} ... erreur dans la fonction remiseAZero()`, { divM2d: JSON.stringify(divM2d), animRoueA, animRoueB, animRoueC, compteurRoueA, compteurRoueB, compteurRoueC })
          }
        }
        break
    }
    if (context.isAmc) {
      this.autoCorrection[0] = {
        enonce: 'Dans un engrenage, il y a deux roues. ' + texte,
        propositions: [{ texte: texteCorr, statut: 3, feedback: '', sanscadre: false, pointilles: false }]
      }
    }
    objetsEnonce.push(...roues)
    objetsCorrection.push(...rouesCorr)

    const paramsEnonce = Object.assign({}, fixeBordures(objetsEnonce), { pixelsParCm: 20, scale: 0.75 })
    const paramsCorrection = Object.assign({}, fixeBordures(objetsCorrection), { pixelsParCm: 20, scale: 0.75 })

    texte += mathalea2d(paramsEnonce, objetsEnonce)
    texteCorr += context.isHtml ? `<div id="animRoues${numeroExercice}"></div>` : ''

    divM2d.innerHTML = mathalea2d(paramsCorrection, objetsCorrection)
    const insertInDom = function () {
      const div = document.querySelector(`#animRoues${numeroExercice}`) // Quand insertInDom sera exécuté, le i aura été incrémenté d'où ce i - 1
      if (div) {
        div.innerHTML = ''
        div.appendChild(divM2d)
        const button = document.createElement('button')
        button.innerText = 'Relancer l\'animation'
        button.onclick = remiseAZero
        div.appendChild(button)
        button.classList.add('px-6', 'py-2.5', 'mr-10', 'my-5', 'ml-6', 'bg-coopmaths', 'text-white', 'font-medium', 'text-xs', 'leading-tight', 'uppercase', 'rounded', 'shadow-md',
          'transform', 'hover:scale-110', 'hover:bg-coopmaths-dark', 'hover:shadow-lg', 'focus:bg-coopmaths-dark', 'focus:shadow-lg', 'focus:outline-none', 'focus:ring-0', 'active:bg-coopmaths-dark', 'active:shadow-lg', 'transition', 'duration-150', 'ease-in-out')
        remiseAZero()
        document.removeEventListener('exercicesAffiches', remiseAZero)
        document.removeEventListener('exercicesAffiches', insertInDom)
      }
    }

    document.addEventListener('exercicesAffiches', insertInDom)

    this.listeQuestions[0] = texte
    this.listeCorrections[0] = texteCorr
    listeQuestionsToContenu(this)
  }
}
