import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { arrondi } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../deprecatedExercice.js'
import { context } from '../../modules/context.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive.js'
import Decimal from 'decimal.js'
import { texTexte } from '../../lib/format/texTexte'
import { setReponse } from '../../lib/interactif/gestionInteractif'
import { sp } from '../../lib/outils/outilString'

export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = 'true'
export const amcType = 'AMCNum'
export const titre = 'Convertir des longueurs ou des masses'

/**
 * Conversions de longueur (ou de masses) en utilisant le préfixe pour déterminer la multiplication ou division à faire.
 *
 * * 1 : De dam, hm, km vers m
 * * 2 : De dm, cm, mm vers m
 * * 3 : Conversions en mètres
 * * 4 : Toutes les conversions de longueurs
 * * Paramètre supplémentaire : utiliser des nombres décimaux (par défaut tous les nombres sont entiers)
 * @author Rémi Angot
 */
export default function ExerciceConversionsLongueurs (niveau = 1) {
  Exercice.call(this)
  this.sup = niveau // Niveau de difficulté de l'exercice
  this.sup2 = false // Avec des nombres décimaux ou pas
  this.sup3 = false // avec le tableau
  this.sup4 = '1' // avec des mètres (pas des grammes)
  this.spacing = 2

  this.nouvelleVersion = function () {
    this.consigne = context.isDiaporama ? 'Convertir' : 'Compléter : '
    const reponses = []
    const typeDeGrandeur = gestionnaireFormulaireTexte({ saisie: this.sup4, min: 1, max: 2, defaut: 1, melange: 3, nbQuestions: this.nbQuestions })
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    const prefixeMulti = [
      ['da', 10],
      ['h', 100],
      ['k', 1000]
    ]
    const prefixeDiv = [
      ['d', 10],
      ['c', 100],
      ['m', 1000]
    ]
    const listeUnite1 = combinaisonListes(
      [0, 1, 2, 3, 4, 5, 6],
      this.nbQuestions
    )
    const listek = combinaisonListes([0, 1, 2], this.nbQuestions)
    const listeDeDecimaux = combinaisonListes(
      ['entier', 'XX,X', '0,X', '0,0X', 'X,XX'],
      this.nbQuestions
    )
    for (
      let i = 0, a, k, div, resultat, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;
    ) {
      // On limite le nombre d'essais pour chercher des valeurs nouvelles
      const unite = typeDeGrandeur[i] === 1 ? 'm' : 'g'
      const listeUnite = ['m', 'c', 'd', '', 'da', 'h', 'k'].map(pref => `${pref}${unite}`)
      const typesDeQuestions = this.sup
      k = listek[i] // Plutôt que de prendre un préfix au hasard, on alterne entre 10,100 et 1000
      if (typesDeQuestions === 1) {
        // niveau 1
        div = false // Il n'y aura pas de division
      } else if (typesDeQuestions === 2) {
        // niveau 2
        div = true // Avec des divisions
      } else {
        div = choice([true, false]) // Avec des multiplications ou des divisions
      }

      if (this.sup2) {
        // Si la case pour les nombres décimaux est cochée
        switch (listeDeDecimaux[i]) {
          case 'entier':
            a = randint(1, 99)
            break
          case 'XX,X':
            a = arrondi(randint(1, 19) + randint(1, 9) / 10, 1)
            break
          case '0,X':
            a = arrondi(randint(1, 9) / 10, 1)
            break
          case '0,0X':
            a = arrondi(randint(1, 9) / 100, 2)
            break
          case 'X,XX':
            a = arrondi(
              randint(1, 9) + randint(1, 9) / 10 + randint(1, 9) / 100,
              2
            )
        }
        // entier ou
      } else {
        a = choice([
          randint(1, 9),
          randint(1, 9) * 10,
          randint(1, 9) * 100,
          randint(1, 9) * 10 + randint(1, 9)
        ])
        // X, X0, X00, XX
      }

      if (!div && typesDeQuestions < 4) {
        // Si il faut multiplier pour convertir
        resultat = arrondi(a * prefixeMulti[k][1], 12)
        texte = `$${texNombre(a)} ${texTexte(prefixeMulti[k][0] + unite)} = `
        texte +=
          this.interactif && context.isHtml
            ? `$${ajouteChampTexteMathLive(this, i, 'largeur01 inline', { texteApres: `${sp()}$${texTexte(unite)}$` })}`
            : `\\dotfills  ${texTexte(unite)}$`
        texteCorr =
          `$ ${texNombre(a)}${texTexte(prefixeMulti[k][0] + unite)} =  ${texNombre(a)}\\times${prefixeMulti[k][1]}${texTexte(unite)} = ${texNombre(resultat)}${texTexte(unite)}$`
        if (this.sup3 && context.vue === 'diap') {
          texte += `<br>${buildTab(0, '', 0, '', 2, true)}`
        }
        if (this.sup3) {
          texteCorr +=
            `<br>${buildTab(a, `${prefixeMulti[k][0]}m`, resultat, unite)}`
        }
      } else if (div && typesDeQuestions < 4) {
        resultat = arrondi(a / prefixeDiv[k][1], 12)
        texte = `$${texNombre(a)} ${texTexte(prefixeDiv[k][0] + unite)} = `
        texte +=
          this.interactif && context.isHtml
            ? `$${ajouteChampTexteMathLive(this, i, 'largeur01 inline', { texteApres: `${sp()}$${texTexte(unite)}$` })}`
            : `\\dotfills  ${texTexte(unite)}$`
        texteCorr =
          `$ ${texNombre(a)}${texTexte(prefixeDiv[k][0] + unite)} =  ${texNombre(a)}\\div${texTexte(prefixeDiv[k][1])}${texTexte(unite)} = ${texNombre(resultat)}${texTexte(unite)}$`
        if (this.sup3 && context.vue === 'diap') {
          texte += `<br>${buildTab(0, '', 0, '', 2, true)}`
        }
        if (this.sup3) {
          texteCorr +=
            `<br>${buildTab(a, `${prefixeDiv[k][0]}m`, resultat, unite)}`
        }
      } else {
        // pour type de question = 4
        let unite1 = listeUnite1[i]
        let unite2 = randint(
          Math.max(0, unite1 - 3),
          Math.min(unite1 + 3, 6),
          unite1
        )
        if (unite1 > unite2) {
          [unite1, unite2] = [unite2, unite1]
        }
        const ecart = unite2 - unite1 // nombre de multiplication par 10 pour passer de l'un à l'autre
        if (randint(0, 1) > 0) {
          resultat = a * 10 ** ecart
          texte = `$${texNombre(a)} ${texTexte(listeUnite[unite2])} = `
          texte +=
            this.interactif && context.isHtml
              ? `$${ajouteChampTexteMathLive(this, i, 'largeur01 inline', { texteApres: `${sp()}$${texTexte(listeUnite[unite1])}$` })}`
              : `\\dotfills  ${texTexte(listeUnite[unite1])}$`
          texteCorr =
            `$ ${texNombre(a)}${texTexte(listeUnite[unite2])} =  ${texNombre(a)}\\times${texNombre(10 ** ecart)}${texTexte(listeUnite[unite1])} = ${texNombre(resultat)}${texTexte(listeUnite[unite1])}$`
          if (this.sup3 && context.vue === 'diap') {
            texte += `<br>${buildTab(0, '', 0, '', 2, true)}`
          }
          if (this.sup3) {
            texteCorr +=
              `<br>${buildTab(a, listeUnite[unite2], resultat, listeUnite[unite1])}`
          }
        } else {
          resultat = a / 10 ** ecart
          texte = `$${texNombre(a)} ${texTexte(listeUnite[unite1])} = `
          texte +=
            this.interactif && context.isHtml
              ? `$${ajouteChampTexteMathLive(this, i, 'largeur01 inline', { texteApres: `${sp()}$${texTexte(listeUnite[unite2])}$` })}`
              : `\\dotfills  ${texTexte(listeUnite[unite2])}$`
          texteCorr =
            `$ ${texNombre(a)}${texTexte(listeUnite[unite1])} =  ${texNombre(a)}\\div${texNombre(10 ** ecart)}${texTexte(listeUnite[unite2])} = ${texNombre(resultat)}${texTexte(listeUnite[unite2])}$`
          if (this.sup3 && context.vue === 'diap') {
            texte += `<br>${buildTab(0, '', 0, '', 2, true)}`
          }
          if (this.sup3) {
            texteCorr +=
              `<br>${buildTab(a, listeUnite[unite1], resultat, listeUnite[unite2])}`
          }
        }
      }

      if (this.questionJamaisPosee(i, resultat)) {
        reponses[i] = resultat
        setReponse(this, i, resultat.toString().replace('.', ','))
        // Si la question n'a jamais été posée, on en crée une autre
        if (context.vue === 'diap') {
          texte = texte.replace('= \\dotfills', '~\\text{en}')
        } else if (context.isHtml) {
          texte = texte.replace(
            '\\dotfills',
            '................................'
          )
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }

    listeQuestionsToContenu(this)
    this.introduction = ''
    if (context.vue === 'latex' && this.sup3) {
      this.introduction = "en s'aidant du tableau ci-dessous :\n\n"
      this.introduction += buildTab(
        0,
        '',
        0,
        '',
        Math.min(10, this.nbQuestions),
        true
      )
    } else if (context.vue !== 'diap' && context.isHtml && this.sup3) {
      this.introduction = "en s'aidant du tableau ci-dessous :<br>"
      this.introduction += buildTab(
        0,
        '',
        0,
        '',
        Math.min(10, this.nbQuestions),
        true
      )
    }
  }
  this.besoinFormulaireNumerique = [
    'Niveau de difficulté',
    4,
    ' 1 : De dam, hm, km vers m\n 2 : De dm, cm, mm vers m\n 3 : Conversions en mètres\n4 : Au hasard'
  ]
  this.besoinFormulaire2CaseACocher = ['Avec des nombres décimaux']
  this.besoinFormulaire3CaseACocher = ['Avec tableau']
  this.besoinFormulaire4Texte = ['Type de grandeur', 'Nombres séparés par des tirets\n1 : Longueur\n2 : Masse\n3 : Mélange']
}

/**
 * Fonction utilitaire retournant le rang d'un nombre
 * @param {*} nb Nombre entier ou décimal
 * @param {*} pos Le rang cherché
 * @returns retourne la valeur de la colonne, si zéro inutile alors on retourne ''
 * Exemple :
 * getDigitFromNumber(1302.56,1000) retourne '1'
 * getDigitFromNumber(1302.56,10000) retourne ''
 * getDigitFromNumber(1302.56,100) retourne '3'
 * getDigitFromNumber(1302.56,10) retourne '0'
 * getDigitFromNumber(1302.56,0.1) retourne '5'
 * getDigitFromNumber(1302.56,0.001) retourne ''
 */
export function getDigitFromNumber (nb, pos) {
  const n = new Decimal(nb)
  const po = new Decimal(pos)
  const exp = Decimal.ln(po).div(Decimal.ln(10))
  let res = ''
  if (po.comparedTo(1) >= 0) {
    // partie entière : milliers, centaines, dizaines, unités
    res = n.sub(n.div(po.mul(10)).trunc().mul(po.mul(10)))
    res = res.div(po).trunc()
    res = po.equals(1) || n.comparedTo(po) >= 0 ? res.toString() : ''
  } else {
    // partie décimale : dixième, centième, millième
    res = n.sub(n.div(po.mul(10)).trunc().mul(po.mul(10)))
    res = res.div(po).trunc()
    res = Math.abs(exp) <= n.decimalPlaces() ? res.toString() : ''
  }
  return res
}
/**
 * @param {*} a Nombre de départ
 * @param {*} uniteA Unité de départ (ex : 'km',...)
 * @param {*} r Nombre converti
 * @param {*} uniteR
 * @param {*} ligne Nombre de ligne dans le tableau (par défaut :2)
 * @param {*} force Ajoute deux colonnes avant km et deuux après mm (par défaut : false)
 * @returns Un tableau de conversion de longueur en latex.
 */
function buildTab (a, uniteA, r, uniteR, ligne = 2, force = false) {
  const tabRep = (nbre, uniteNbre) => {
    const res = ['', '', '', '', '', '', '', '', '', '', '']
    switch (uniteNbre.replaceAll(' ', '')) {
      case 'km':
        for (let i = 0; i <= 10; i++) {
          res[i] =
            (2 - i === 0 ? '\\color{red}{' : '') +
            getDigitFromNumber(nbre, Decimal.pow(10, 2 - i)) +
            (2 - i === 0
              ? new Decimal(nbre).decimalPlaces() === 0
                ? '}'
                : ',}'
              : '')
        }
        break
      case 'hm':
        for (let i = 0; i <= 10; i++) {
          res[i] =
            (3 - i === 0 ? '\\color{red}{' : '') +
            getDigitFromNumber(nbre, Decimal.pow(10, 3 - i)) +
            (3 - i === 0
              ? new Decimal(nbre).decimalPlaces() === 0
                ? '}'
                : ',}'
              : '')
        }
        break
      case 'dam':
        for (let i = 0; i <= 10; i++) {
          res[i] =
            (4 - i === 0 ? '\\color{red}{' : '') +
            getDigitFromNumber(nbre, Decimal.pow(10, 4 - i)) +
            (4 - i === 0
              ? new Decimal(nbre).decimalPlaces() === 0
                ? '}'
                : ',}'
              : '')
        }
        break
      case 'm':
        for (let i = 0; i <= 10; i++) {
          res[i] =
            (5 - i === 0 ? '\\color{red}{' : '') +
            getDigitFromNumber(nbre, Decimal.pow(10, 5 - i)) +
            (5 - i === 0
              ? new Decimal(nbre).decimalPlaces() === 0
                ? '}'
                : ',}'
              : '')
        }
        break
      case 'dm':
        for (let i = 0; i <= 10; i++) {
          res[i] =
            (6 - i === 0 ? '\\color{red}{' : '') +
            getDigitFromNumber(nbre, Decimal.pow(10, 6 - i)) +
            (6 - i === 0
              ? new Decimal(nbre).decimalPlaces() === 0
                ? '}'
                : ',}'
              : '')
        }
        break
      case 'cm':
        for (let i = 0; i <= 10; i++) {
          res[i] =
            (7 - i === 0 ? '\\color{red}{' : '') +
            getDigitFromNumber(nbre, Decimal.pow(10, 7 - i)) +
            (7 - i === 0
              ? new Decimal(nbre).decimalPlaces() === 0
                ? '}'
                : ',}'
              : '')
        }
        break
      case 'mm':
        for (let i = 0; i <= 10; i++) {
          res[i] =
            (8 - i === 0 ? '\\color{red}{' : '') +
            getDigitFromNumber(nbre, Decimal.pow(10, 8 - i)) +
            (8 - i === 0
              ? new Decimal(nbre).decimalPlaces() === 0
                ? '}'
                : ',}'
              : '')
        }
        break
    }
    return res
  }
  const createTab = (aT, rT, first, end, ligne) => {
    let texte = '$\\def\\arraystretch{1.5}\\begin{array}{'
    for (let i = first; i <= end; i++) {
      texte += `|c${i === end ? '|}' : ''}`
    }
    const headers = [
      '\\hspace*{0.6cm}',
      '\\hspace*{0.6cm}',
      '\\; km \\;',
      '\\; hm \\;',
      'dam',
      '\\;\\; m \\;\\;',
      '\\; dm \\;',
      '\\; cm \\;',
      '\\;mm\\;',
      '\\hspace*{0.6cm}',
      '\\hspace*{0.6cm}'
    ]
    texte += '\\hline '
    for (let i = first; i <= end; i++) {
      texte += `${headers[i]} ${i < end ? '&' : '\\\\'}`
    }
    texte += '\\hline '
    for (let i = first; i <= end; i++) {
      texte += `${aT[i]} ${i < end ? '&' : '\\\\'}`
    }
    texte += '\\hline '
    for (let i = first; i <= end; i++) {
      texte += `${rT[i]} ${i < end ? '&' : '\\\\'}`
    }
    for (let k = 3; k <= ligne; k++) {
      texte += '\\hline '
      for (let i = first; i <= end; i++) {
        texte += `  ${i < end ? '&' : '\\\\'}`
      }
    }
    texte += '\\hline \\end{array}$'
    return texte
  }
  const aTab = tabRep(a, uniteA)
  const rTab = tabRep(r, uniteR)
  const minTab1 = aTab[0] !== '' || aTab[1] !== '' || force ? 0 : 2
  const minTab2 = rTab[0] !== '' || rTab[1] !== '' || force ? 0 : 2
  const maxTab1 = aTab[9] !== '' || aTab[10] !== '' || force ? 10 : 8
  const maxTab2 = rTab[9] !== '' || rTab[10] !== '' || force ? 10 : 8
  const texte = createTab(
    aTab,
    rTab,
    Math.min(minTab1, minTab2),
    Math.max(maxTab1, maxTab2),
    ligne
  )
  return texte
}
