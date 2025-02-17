import { codageAngleDroit } from '../../lib/2d/angles.js'
import { afficheLongueurSegment } from '../../lib/2d/codages.js'
import { point } from '../../lib/2d/points.js'
import { nommePolygone, polygone } from '../../lib/2d/polygones.js'
import { longueur } from '../../lib/2d/segmentsVecteurs.js'
import { rotation, similitude } from '../../lib/2d/transformations.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { arrondi, nombreDeChiffresDe } from '../../lib/outils/nombres'
import { creerNomDePolygone, sp } from '../../lib/outils/outilString.js'
import Exercice from '../Exercice'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { context } from '../../modules/context.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Grandeur from '../../modules/Grandeur'
import { RedactionPythagore } from './_pythagore.js'
import { handleAnswers, setReponse } from '../../lib/interactif/gestionInteractif'
import engine from '../../lib/interactif/comparisonFunctions'
import { ordreAlphabetique } from '../../lib/outils/ecritures'

export const titre = 'Calculer une longueur avec le théorème de Pythagore'
export const amcType = 'AMCHybride'
export const amcReady = true
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Fonction utilisée pour la vérification des questions de cet exercice.
 * @param {string} input
 * @param {string} goodAnswer // L'expression commencera par la somme des carrés et comportera (ou pas) l'égalité avec le carré de l'hypoténuse
 * @return {{isOk: boolean, feedback: string}}
 */
export function pythagoreCompare (input, goodAnswer) {
  input = input.replaceAll(/([A-Z]{2})/g, '\\mathrm{$1}')
  const parsedInput = engine.parse(input)
  const parsedAnswer = engine.parse(goodAnswer)
  if (parsedAnswer.head === 'Equal') {
    if (parsedInput.head !== 'Equal') return { isOk: false, feedback: 'Il faut saisir une égalité de Pythagore' }
    // on a deux égalités. c'est le cas écrire l'égalité
    const inputOps = parsedInput.ops
    const answerOps = parsedAnswer.ops
    if (inputOps != null && answerOps != null) {
      const inputM1 = inputOps[0]
      const inputM2 = inputOps[1]
      const answerSum = answerOps[0]
      const answerHypo = answerOps[1]
      if (inputM1 && inputM2) {
        const inputHypo = ['Power', 'Square'].includes(inputM1.head) ? inputM1 : inputM2
        const inputSum = ['Power', 'Square'].includes(inputM1.head) ? inputM2 : inputM1
        const inputT1 = inputSum.ops[0] // un ['Square','BC'] par exemple
        const inputT2 = inputSum.ops[1]
        const answerT1 = answerSum.ops[0]
        const answerT2 = answerSum.ops[1]
        for (const term of [inputT1, inputT2]) { // On ne vérifie pas la réponse, c'est nous qui l'avons écrite
          if (!['Square', 'Power'].includes(term.head)) {
            return { isOk: false, feedback: 'Il manque au moins un carré.' }
          }
        }

        // c'est la même longueur pour l'hypoténues ?
        if (ordreAlphabetique(inputHypo.ops[0].toString()) !== answerHypo.ops[0].toString()) return { isOk: false, feedback: 'Tu as mal identifié l\'hypoténuse.' }
        // l'élève a-t-il bien mis l'hypoténuse au carré ?
        if (inputHypo.ops[1].toString() !== '2') return { isOk: false, feedback: 'Tu as oublié de mettre l\'hypoténuse au carré.' }
        if (inputSum.head !== 'Add') return { isOk: false, feedback: 'Le carré de l\'hypoténuse est égal à la $somme$ des carrés des deux autres côtés.' }
        // le premier terme de la saisie est-il un carré ?
        if (!['Square', 'Power'].includes(inputT1.head)) return { isOk: false, feedback: 'Il manque au moins un carré.' }
        const L1 = ordreAlphabetique(inputT1.ops[0].toString()) // on met la longeur saisie dans l'ordre alphabétique
        // le deuxième terme de la saisie est-il un carré ?
        if (!['Square', 'Power'].includes(inputT2.head)) return { isOk: false, feedback: 'Il manque au moins un carré.' }
        const L2 = ordreAlphabetique(inputT2.ops[0].toString())// on met la longeur saisie dans l'ordre alphabétique
        const LL1 = answerT1.ops[0].toString() // Ces longueurs sont déjà dans l'ordre alphabétique
        const LL2 = answerT2.ops[0].toString()
        // on teste les deux possibilités identiques ou croisées
        if ((LL1 === L1 && LL2 === L2) || (LL1 === L2 && LL2 === L1)) return { isOk: true }
        else return { isOk: false, feedback: 'Regarde bien la correction.' }
      }
    }
  } else { // on a une réponse sans égalité, il faut un input sans égalité
    if (parsedInput.head !== 'Add') return { isOk: false, feedback: 'Il faut saisir une somme ou une différence de deux carrés' }
    const isSub = parsedAnswer.ops[0].head === 'Negate'
    const inputOp = parsedInput.ops[0].head
    if (isSub && inputOp !== 'Negate') return { isOk: false, feedback: 'Il fallait saisir une différence de deux carrés.' }
    if (!isSub && inputOp === 'Negate') return { isOk: false, feedback: 'Il fallait saisir une somme de deux carrés.' }
    if (parsedAnswer.head !== parsedInput.head) return { isOk: false, feedback: 'L\'opération n\'est pas une somme ou une différence.' }

    const inputT1 = parsedInput.ops[1] // un ['Square','BC'] par exemple
    const inputT2 = isSub ? parsedInput.ops[0].ops[0] : parsedInput.ops[0]
    const answerT1 = parsedAnswer.ops[1]
    const answerT2 = isSub ? parsedAnswer.ops[0].ops[0] : parsedAnswer.ops[0]
    for (const term of [inputT1, inputT2]) {
      // On vérifie qu'il y a bien des carrés (on ne vérifie pas la réponse, c'est nous qui l'avons écrite)
      if (!['Square', 'Power'].includes(term.head)) {
        return { isOk: false, feedback: 'Il manque au moins un carré.' }
      }
    }
    const L1 = ordreAlphabetique(inputT1.ops[0].toString()) // on met la longeur saisie dans l'ordre alphabétique
    const L2 = ordreAlphabetique(inputT2.ops[0].toString())// on met la longeur saisie dans l'ordre alphabétique
    const LL1 = answerT1.ops[0].toString() // Ces longueurs sont déjà dans l'ordre alphabétique
    const LL2 = answerT2.ops[0].toString()
    if ((LL1 === L1 && LL2 === L2) || (LL1 === L2 && LL2 === L1 && !isSub)) return { isOk: true }
    else return { isOk: false, feedback: 'Regarde bien la correction.' }
  }
  return { isOk: parsedInput.isEqual(parsedAnswer), feedback: '' }
}

/**
 * Exercices sur le théorème de Pythagore avec MathALEA2D
 * @author Rémi Angot (Factorisation de la rédaction de Pythagore par Eric Elter )
 * 4G20
 */
export const uuid = 'bd660'
export const ref = '4G20'
export const refs = {
  'fr-fr': ['4G20'],
  'fr-ch': ['10GM4-1', '11GM1-1']
}

export default class Pythagore2D extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 3
    this.nbCols = 3
    this.nbColsCorr = 1
    this.sup = 3
    this.sup2 = 3
    this.sup3 = false
    this.typeDeQuestion = 'Calculer :'
    this.video = 'M9sceJ8gzNc'
    this.besoinFormulaire2Numerique = ['Recherche de côtés ', 3, '1 : Hypoténuse\n2 : Côtés de l\'angle droit\n3: Mélange']
  }

  nouvelleVersion () {
    let listeTypeDeQuestions
    if (this.sup2 === 1) {
      listeTypeDeQuestions = ['BC']
    } else if (this.sup2 === 2) {
      listeTypeDeQuestions = ['AB', 'AC']
    } else {
      listeTypeDeQuestions = ['AB', 'BC', 'AC']
    }
    let listeDeNomsDePolygones = []
    if (this.sup === 1) {
      this.consigne = ((context.vue !== 'diap' && this.nbQuestions > 1) ? 'Dans chaque cas, donner' : 'Donner') + " l'égalité de Pythagore."
    } else if (this.sup === 2) {
      this.consigne = ((context.vue !== 'diap' && this.nbQuestions > 1) ? 'Dans chaque cas, compléter' : 'Compléter') + " l'égalité en utilisant le théorème de Pythagore."
    } else {
      this.consigne = ((context.vue !== 'diap' && this.nbQuestions > 1) ? 'Dans chaque cas, calculer' : 'Calculer') + ' la longueur manquante (si nécessaire, l\'arrondir au millimètre près).'
    }
    listeTypeDeQuestions = combinaisonListes(listeTypeDeQuestions, this.nbQuestions)
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (i % 5 === 0) listeDeNomsDePolygones = ['QD']
      texte = ''
      texteCorr = ''
      const c1 = randint(22, 50) / 10
      const c2 = randint(22, 50) / 10
      const A1 = point(0, 0)
      const B1 = point(c1, 0)
      const C1 = similitude(B1, A1, 90, c2 / longueur(A1, B1))
      const p1 = polygone(A1, B1, C1)
      p1.isVisible = false
      const p2 = rotation(p1, A1, randint(0, 360))
      const A = p2.listePoints[0]
      const B = p2.listePoints[1]
      const C = p2.listePoints[2]
      const codage = codageAngleDroit(B, A, C)
      const xmin = Math.min(A.x, B.x, C.x) - 1
      const ymin = Math.min(A.y, B.y, C.y) - 1
      const xmax = Math.max(A.x, B.x, C.x) + 1
      const ymax = Math.max(A.y, B.y, C.y) + 1
      const nomDuPolygone = creerNomDePolygone(3, listeDeNomsDePolygones)
      listeDeNomsDePolygones.push(nomDuPolygone)
      const nomme = nommePolygone(p2, nomDuPolygone)
      const affAB = afficheLongueurSegment(B, A)
      const affAC = afficheLongueurSegment(A, C)
      const affBC = afficheLongueurSegment(C, B)
      const longueurAB = longueur(A, B, 1)
      const longueurAC = longueur(A, C, 1)
      const longueurBC = longueur(B, C, 1)
      const mesObjetsATracer = [codage, p2, nomme]

      if (this.typeDeQuestion === 'Calculer :' && listeTypeDeQuestions[i] === 'AB') {
        mesObjetsATracer.push(affAC, affBC)
      } else if (this.typeDeQuestion === 'Calculer :' && listeTypeDeQuestions[i] === 'BC') {
        mesObjetsATracer.push(affAC, affAB)
      } else if (this.typeDeQuestion === 'Calculer :' && listeTypeDeQuestions[i] === 'AC') {
        mesObjetsATracer.push(affAB, affBC)
      }

      if (!context.isHtml) {
        texte = '~\\\\'
      }
      texte += mathalea2d({ xmin, xmax, ymin, ymax, scale: 0.6, style: 'display: block' }, mesObjetsATracer)
      if (!context.isHtml && !context.isAmc && i !== this.nbQuestions - 1) {
        texte += '\\columnbreak'
      } // pour la sortie LaTeX sauf la dernière question

      let redaction
      let nomCote = ''
      if (this.typeDeQuestion === 'Calculer :') {
        let reponse
        if (listeTypeDeQuestions[i] === 'AB') {
          nomCote = A.nom + B.nom
          reponse = arrondi(Math.sqrt(longueurBC ** 2 - longueurAC ** 2), 1)
          redaction = RedactionPythagore(A.nom, B.nom, C.nom, 2, reponse, longueurAC, longueurBC)
        } else if (listeTypeDeQuestions[i] === 'BC') {
          nomCote = B.nom + C.nom
          reponse = arrondi(Math.sqrt(longueurAB ** 2 + longueurAC ** 2), 1)
          redaction = RedactionPythagore(A.nom, B.nom, C.nom, 1, longueurAB, longueurAC, reponse)
        } else { // listeTypeDeQuestions[i] === 'AC'
          nomCote = A.nom + C.nom
          reponse = arrondi(Math.sqrt(longueurBC ** 2 - longueurAB ** 2), 1)
          redaction = RedactionPythagore(A.nom, C.nom, B.nom, 2, reponse, longueurAB, longueurBC)
        }
        texteCorr = redaction[0]
        texte += this.interactif ? (`$${nomCote} ${redaction[1]}$` + ajouteChampTexteMathLive(this, i, '  unites[longueurs]', { texteApres: '<em class="ml-2">(Une unité de longueur est attendue.)</em>' })) : ''
        if (this.interactif) {
          setReponse(this, i, new Grandeur(reponse, 'cm'), {
            formatInteractif: 'unites',
            precision: 1
          })
        }

        if (context.isAmc) {
          this.autoCorrection[i] = {
            enonce: texte,
            enonceAvant: false,
            propositions: [
              {
                type: 'AMCOpen',
                propositions: [{
                  enonce: 'Calculer la longueur manquante.\\\\',
                  statut: 3,
                  pointilles: true,
                  multicolsBegin: true
                }]
              },
              {
                type: 'AMCNum',
                propositions: [{
                  texte: '',
                  statut: '',
                  multicolsEnd: true,
                  reponse: {
                    texte: texte + 'longueur arrondie à 0,1 cm : ',
                    valeur: [reponse.toFixed(1)],
                    param: {
                      digits: Math.max(nombreDeChiffresDe(reponse), 2),
                      decimals: 1,
                      signe: false
                    }
                  }
                }]
              }
            ]
          }
        }
      } else {
        const hypotenuse = [`\\mathrm{${ordreAlphabetique(B.nom + C.nom)}}^2`, `\\mathrm{${ordreAlphabetique(C.nom + B.nom)}}^2`]
        const cote1 = [`\\mathrm{${ordreAlphabetique(B.nom + A.nom)}}^2`, `\\mathrm{${ordreAlphabetique(A.nom + B.nom)}}^2`]
        const cote2 = [`\\mathrm{${ordreAlphabetique(C.nom + A.nom)}}^2`, `\\mathrm{${ordreAlphabetique(A.nom + C.nom)}}^2`]

        redaction = RedactionPythagore(A.nom, B.nom, C.nom, 0, longueurAB, longueurAC, null)
        texteCorr = redaction[0]
        let expr
        if (this.sup === 1) {
          expr = cote1[0] + '+' + cote2[0] + '=' + hypotenuse[0]
        } else {
          texteCorr += '<br>'
          if (listeTypeDeQuestions[i] === 'AB') {
            texte += `<br>$${A.nom + B.nom}^2=$`
            texteCorr += ` d'où $${A.nom + B.nom}^2=${B.nom + C.nom}^2-${A.nom + C.nom}^2$.`
            expr = `\\mathrm{${ordreAlphabetique(B.nom + C.nom)}}^2-\\mathrm{${ordreAlphabetique(A.nom + C.nom)}}^2`
          } else if (listeTypeDeQuestions[i] === 'AC') {
            texte += `<br>$${A.nom + C.nom}^2=$`
            texteCorr += ` d'où $${A.nom + C.nom}^2=${B.nom + C.nom}^2-${A.nom + B.nom}^2$.`
            expr = `\\mathrm{${ordreAlphabetique(B.nom + C.nom)}}^2-\\mathrm{${ordreAlphabetique(A.nom + B.nom)}}^2`
          } else {
            texte += `<br>$${B.nom + C.nom}^2=$`
            expr = `\\mathrm{${ordreAlphabetique(A.nom + B.nom)}}^2+\\mathrm{${ordreAlphabetique(A.nom + C.nom)}}^2`
          }
          texte += this.interactif ? '' : `$${sp(2)}\\ldots$`
        }

        handleAnswers(this, i, { reponse: { value: expr, compare: pythagoreCompare } }, { formatInteractif: 'calcul' })
        texte += ajouteChampTexteMathLive(this, i, ' clavierDeBase alphanumeric')
      }
      if (this.questionJamaisPosee(i, B1.x, B.y, C1.x, C1.y)) {
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
