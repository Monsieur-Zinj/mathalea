import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString.js'
import Exercice from '../deprecatedExercice.js'
import choisirExpressionNumerique from './_choisirExpressionNumerique.js'
import ChoisirExpressionLitterale from './_Choisir_expression_litterale.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import { context } from '../../modules/context.js'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { choixDeroulant } from '../../lib/interactif/questionListeDeroulante.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { range } from '../../lib/outils/nombres'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'

export const interactifReady = true
export const interactifType = ['mathLive', 'listeDeroulante']
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '21/09/2023'
/**
 * Fonction noyau pour 6 fonctions qui utilisent les mêmes variables et la fonction choisirExpressionNumerique
 * @author Jean-Claude Lhote
 */
export default function EcrireUneExpressionNumerique () {
  Exercice.call(this)
  this.nbQuestions = 4
  this.nbCols = 1
  this.nbColsCorr = 1
  this.sup2 = false // si false alors utilisation de nombres entiers, si true alors utilisation de nombres à un chiffre après la virgule.
  this.sup3 = true // Si présence ou pas du signe "fois"
  this.sup4 = 6
  this.version = 1 // 1 pour ecrire une expression, 2 pour écrire la phrase, 3 pour écrire l'expression et la calculer, 4 pour calculer une expression numérique
  this.besoinFormulaire4Texte = ['Nombre d\'opérations par expression', 'Nombres séparés par des tirets\n1 : Expressions à 1 opération\n2 : Expressions à 2 opérations\n3 : Expressions à 3 opérations\n4 : Expressions à 4 opérations\n5 : Expressions à 5 opérations\n6 : Mélange'] // Texte, tooltip - il faut au moins deux opérations
  this.besoinFormulaire2CaseACocher = ['Utilisation de décimaux (pas de calcul mental)', false]

  this.nouvelleVersion = function () {
    this.interactifType = this.version !== 2 ? 'mathLive' : 'listeDeroulante'
    this.autoCorrection = []
    let reponse
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup4,
      min: 1,
      max: 5,
      melange: 6,
      defaut: 6,
      nbQuestions: this.nbQuestions
    })

    let expf
    let expn
    let expc
    let decimal
    let nbval
    let nbOperations
    let resultats
    const calculMental = this.sup2
    if (!calculMental) {
      decimal = 10
    } else {
      decimal = 1
    }
    // pour 5C12-1
    if (this.sup2) {
      decimal = 10
    } else {
      decimal = 1
    }
    // pour 6C13-2
    const sousCas = combinaisonListes(range(3), this.nbQuestions)
    let nbSousCas = 0

    for (let i = 0, texte, texteCorr, val1, val2, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      this.autoCorrection[i] = {}
      nbOperations = listeTypeDeQuestions[i]
      val1 = randint(2, 5)
      val2 = randint(6, 9)
      if (this.version > 2 && nbOperations === 1 && !this.litteral) nbOperations++
      if (!this.litteral) {
        resultats = choisirExpressionNumerique(nbOperations, decimal, this.sup3, calculMental, sousCas[nbSousCas])
        if (nbOperations === 1) nbSousCas++
      } else {
        resultats = ChoisirExpressionLitterale(nbOperations, decimal, val1, val2, this.sup3, calculMental)
      }
      expf = resultats[0]
      expn = resultats[1].split('=')[0]
      expn += expn[expn.length - 1] !== '$' ? '$' : ''
      expc = resultats[2]
      nbval = resultats[3]
      const expNom = this.litteral ? resultats[6].split(' ')[1] : resultats[5] // Le split, c'est pour virer le déterminant.
      switch (this.version) {
        case 1:
          this.consigne = 'Traduire la phrase par un calcul (il n\'est pas demandé d\'effectuer ce calcul).'
          texte = `${expf}.`
          expn = expn.split(' ou ') // Pour traiter le cas du 'ou'.
          texteCorr = `${expf} s'écrit : $${miseEnEvidence(expn[0].substring(1, expn[0].length - 1))}$`
          texteCorr += expn.length > 1 ? ` ou $${miseEnEvidence(expn[1].substring(1, expn[1].length - 1))}$.` : '.'
          reponse = /* expn.length > 1 ? expn[1].substring(1, expn[1].length - 1) : */ expn[0].substring(1, expn[0].length - 1)
          break
        case 2:
          if (expn.indexOf('ou') > 0) expn = expn.substring(0, expn.indexOf('ou') - 1) // on supprime la deuxième expression fractionnaire
          this.consigne = this.interactif ? 'De quel type est chaque calcul ?' : 'Traduire le calcul par une phrase en français.'
          texte = `${expn}`
          expf = 'l' + expf.substring(1)
          texteCorr = `${expn} s'écrit : ${texteEnCouleurEtGras(expf)}.`
          break
        case 3:
        {
          if (this.interactif) {
            this.consigne = 'Traduire la phrase par un calcul et effectuer le calcul demandé au brouillon.<br> Saisir uniquement le résultat.'
          } else {
            this.consigne = 'Traduire la phrase par un calcul et effectuer le calcul demandé.'
          }
          if (!this.litteral) texte = `${expf}.`
          else if (nbval === 2) texte = `${expf} puis calculer pour $x=${val1}$ et $y=${val2}$.` // nbval contient le nombre de valeurs en cas de calcul littéral
          else texte = `${expf} puis calculer pour $x=${val1}$.`
          texteCorr = `${expf} s'écrit : ${resultats[1]}.<br>`

          if (!this.litteral) {
            texteCorr = ''
            if (!this.sup4) { // EE : Ce test ne semble plus servir.
              const expc2 = expc.substring(1, expc.length - 1).split('=')
              texteCorr += `$${miseEnEvidence(expc2[0])} =$` + sp()
              for (let ee = 1; ee < expc2.length - 1; ee++) {
                texteCorr += `$${expc2[ee]}  = $` + sp()
              }
              texteCorr += `$${miseEnEvidence(expc2[expc2.length - 1])}$`
            } else {
              // On découpe
              const etapes = expc.split('=')
              let nbEtapes = 0
              etapes.forEach(function (etape) {
                nbEtapes++
                etape = etape.replace('$', '')
                if (context.isHtml) {
                  texteCorr += '<br>'
                }
                texteCorr += (nbEtapes === etapes.length || nbEtapes === 1) ? `${texteEnCouleurEtGras(lettreDepuisChiffre(i + 1) + ' = ')} $${miseEnEvidence(etape)}$ <br>` : `${lettreDepuisChiffre(i + 1)} = $${etape}$ <br>`
              })
            }
          } else if (nbval === 2) texteCorr += `Pour $x=${val1}$ et $y=${val2}$ :<br> ${expc}`
          else texteCorr += `Pour $x=${val1}$ :<br>${expc}`
          reponse = expc.split('=')[expc.split('=').length - 1].replace('$', '')

          if (this.litteral) {
          // Uniformisation : Mise en place de la réponse attendue en interactif en orange et gras
            const textCorrSplit = texteCorr.split('=')
            let aRemplacer = textCorrSplit[textCorrSplit.length - 1]
            aRemplacer = aRemplacer.replace('$', '').replace('<br>', '')

            texteCorr = ''
            for (let ee = 0; ee < textCorrSplit.length - 1; ee++) {
              texteCorr += textCorrSplit[ee] + '='
            }
            texteCorr += `$ $${miseEnEvidence(aRemplacer)}$`
          // Fin de cette uniformisation
          }
          break
        }
        case 4:
          {
            if (expn.indexOf('ou') > 0) expn = expn.substring(0, expn.indexOf('ou') - 1) // on supprime la deuxième expression fractionnaire
            this.consigne = ''
            if (!this.litteral) texte = `${expn}`
            else if (nbval === 2) texte = `Pour $x=${val1}$ et $y=${val2}$, calculer ${expn}.`
            else texte = `Pour $x=${val1}$, calculer ${expn}.`
            if (!this.litteral) texteCorr = `${expc}`
            else if (nbval === 2) texteCorr = `Pour $x=${val1}$ et $y=${val2}$ :<br>${expc}`
            else texteCorr = `Pour $x=${val1}$ :<br>${expc}`
            reponse = expc.split('=')[expc.split('=').length - 1].replace('$', '')

            // Uniformisation : Mise en place de la réponse attendue en interactif en orange et gras
            const textCorrSplit = texteCorr.split('=')
            let aRemplacer = textCorrSplit[textCorrSplit.length - 1]
            aRemplacer = aRemplacer.replace('$', '').replace('<br>', '')

            texteCorr = ''
            for (let ee = 0; ee < textCorrSplit.length - 1; ee++) {
              texteCorr += textCorrSplit[ee] + '='
            }
            texteCorr += `$ $${miseEnEvidence(aRemplacer)}$`
          // Fin de cette uniformisation
          }
          break
      }
      if ((this.questionJamaisPosee(i, nbOperations, nbval, this.version, expf) && !this.litteral) || (this.litteral && this.questionJamaisPosee(i, nbOperations, nbval, this.version, resultats[4]))) { // Si la question n'a jamais été posée, on en créé une autre
        // On doit effectuer un calcul numérique et donner une réponse numérique
        if (this.version > 2) {
          /// vérifier qu'il n'y a plus d'OpenNUM
          if (context.isAmc) {
            texte += '<br>Détailler les calculs dans le cadre et coder le résultat ci-dessous.'
            this.autoCorrection[i] = {
              enonce: '',
              enonceAvant: false,
              propositions: [
                {
                  type: 'AMCOpen',
                  propositions: [{
                    enonce: texte,
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
                      texte: 'Résultat de cet enchaînement de calculs : ',
                      valeur: [reponse],
                      param: {
                        digits: 2,
                        decimals: 0,
                        signe: false,
                        approx: 0
                      }
                    }
                  }]
                }
              ]
            }
          } else {
            texte += '<br>' + ajouteChampTexteMathLive(this, i, 'largeur25 inline', { texteAvant: ' Résultat : ' })
            handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison } })
          }
        }
        // on doit donner la traduction en français de l'expression (liste déroulante pour l'interactif et AMCOpen
        if (this.version === 2) {
          if (context.isAmc) { // AMCOpen pour 5C11, 5C11-1, 5L10-1, 5L10-3
            this.autoCorrection[i] =
              {
                enonce: this.consigne + '<br>' + texte,
                propositions: [
                  {
                    texte: texteCorr,
                    statut: this.version, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                    sanscadre: false, // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
                    pointilles: this.version === 2 // EE : ce champ est facultatif et permet (si false) d'enlever les pointillés sur chaque ligne.
                  }
                ]
              }
          } else {
            texte += sp(10) + choixDeroulant(this, i, combinaisonListes(['somme', 'différence', 'produit', 'quotient'], 1), 'une réponse')
            handleAnswers(this, i, { reponse: { value: expNom } }, { formatInteractif: 'listeDeroulante' })
          }
        }

        if (this.version === 1) {
          if (context.isAmc) { // AMCOpen pour 5C11, 5C11-1, 5L10-1, 5L10-3
            this.autoCorrection[i] =
            {
              enonce: this.consigne + '<br>' + texte,
              propositions: [
                {
                  texte: texteCorr,
                  statut: this.version, // OBLIGATOIRE (ici c'est le nombre de lignes du cadre pour la réponse de l'élève sur AMC)
                  sanscadre: false, // EE : ce champ est facultatif et permet (si true) de cacher le cadre et les lignes acceptant la réponse de l'élève
                  pointilles: this.version === 2 // EE : ce champ est facultatif et permet (si false) d'enlever les pointillés sur chaque ligne.
                }
              ]
            }
          } else {
            texte += '<br>' + ajouteChampTexteMathLive(this, i, 'largeur01 inline', { texteAvant: ' Résultat : ' })
            handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison } })
          }
        }

        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
