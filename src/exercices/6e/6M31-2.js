import Exercice from '../Exercice.js'
import { listeQuestionsToContenu, randint, combinaisonListes, texNombre, sp, nombreDeChiffresDe, nombreDeChiffresDansLaPartieDecimale } from '../../modules/outils.js'
import { ajouteChampTexteMathLive } from '../../modules/interactif/questionMathLive.js'
import { setReponse } from '../../modules/gestionInteractif.js'
import { min } from 'mathjs'
import Decimal from 'decimal.js'
import { getDigitFromNumber } from './_ExerciceConversionsLongueurs.js'
export const titre = 'Convertir des volumes ou des capacités'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Conversions d'unités de volumes vers les unités de capacité ou inversement.
 *
 * Dans la correction, on passe systématiquement par l'équivalence dm3 = L
 *
 * * 1 : Unités de volume vers litres
 * * 2 : Litres vers unités de volume
 * * 3 : Un mélange de toutes les conversions
 * * Paramètre supplémentaire : utiliser des nombres décimaux (par défaut tous les nombres sont entiers)
 * @author Rémi Angot
 * Référence 6M31-2
 */
export const uuid = 'f4d29'
export const ref = '6M31-2'
export default function UnitesDeVolumesEtDeCapacite (niveau = 1) {
  Exercice.call(this) // Héritage de la classe Exercice()
  this.sup = niveau // Niveau de difficulté de l'exercice
  this.sup2 = false // Avec des nombres décimaux ou pas
  this.titre = titre
  this.consigne = 'Compléter : '
  this.spacing = 2
  this.nbQuestions = 8
  this.nbColsCorr = 1

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées
    this.autoCorrection = []
    let listeTypeDeQuestions
    this.sup = parseInt(this.sup)
    if (this.sup === 1) {
      listeTypeDeQuestions = combinaisonListes(
        ['dam3toL', 'm3toL', 'dm3toL', 'cm3toL'],
        this.nbQuestions
      )
    }
    if (this.sup === 2) {
      listeTypeDeQuestions = combinaisonListes(
        ['Ltodm3', 'Ltocm3', 'Ltom3'],
        this.nbQuestions
      )
    }
    if (this.sup === 3) {
      listeTypeDeQuestions = combinaisonListes(
        [
          'dam3toL',
          'm3toL',
          'dm3toL',
          'cm3toL',
          'mm3toL',
          'Ltodm3',
          'Ltocm3',
          'Ltom3'
        ],
        this.nbQuestions
      )
    }
    let listeDeN = []; let bonusDecimalesAMC, resultat
    if (this.sup2) {
      listeDeN = combinaisonListes([1, 2, 3, 4], this.nbQuestions)
    } else {
      listeDeN = combinaisonListes([1, 2, 3, 4, 5, 6], this.nbQuestions)
    }
    for (
      let i = 0, n, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;

    ) {
      if (this.sup2) {
        switch (listeDeN[i]) {
          case 1:
            n = new Decimal(randint(2, 9)).div(10)
            break
          case 2:
            n = new Decimal(randint(11, 99)).div(10)
            break
          case 3:
            n = new Decimal(randint(1, 9)).div(10).add(randint(1, 9) * 10)
            break
          case 4:
            n = new Decimal(randint(11, 99, [10, 20, 30, 40, 50, 60, 70, 80, 90])).div(100)
            break
        }
      } else {
        switch (listeDeN[i]) {
          case 1:
            n = new Decimal(randint(2, 9))
            break
          case 2:
            n = new Decimal(randint(11, 99))
            break
          case 3:
            n = new Decimal(randint(1, 9) * 10)
            break
          case 4:
            n = new Decimal(randint(1, 9) * 100)
            break
          case 5:
            n = new Decimal(randint(11, 99) * 100)
            break
          case 6:
            n = new Decimal(randint(1, 9) * 1000)
            break
        }
      }
      switch (listeTypeDeQuestions[i]) {
        case 'dam3toL':
          if (this.interactif) {
            texte = `$${texNombre(n, 3)}${sp()}\\text{dam}^3=$` + ajouteChampTexteMathLive(this, i, 'inline', { tailleExtensible: true }) + `${sp(3)}L`
          } else {
            texte = `$${texNombre(n, 3)}${sp()}\\text{dam}^3=\\dotfill${sp()}\\text{L}$`
          }
          bonusDecimalesAMC = n < 1000 ? randint(0, 1) : 0 // Sinon, cela fait trop de digits
          resultat = n * 1000000
          setReponse(this, i, resultat, { digits: min(nombreDeChiffresDe(resultat) + randint(0, 1) + bonusDecimalesAMC, 10), decimals: nombreDeChiffresDansLaPartieDecimale(resultat) + bonusDecimalesAMC, signe: false })
          texteCorr = `$${texNombre(n, 3)}${sp()}\\text{dam}^3=${texNombre(n, 3)}\\times1${sp()}000\\times1${sp()}000${sp()}\\text{dm}^3=${texNombre(resultat, 0)}${sp()}\\text{L}$`
          texteCorr += !this.sup4 ? '' : '<br>' + buildTab(n, 'dam', resultat, 'dm', 2, true, true)

          break
        case 'm3toL':
          if (this.interactif) {
            texte = `$${texNombre(n, 3)}${sp()}\\text{m}^3=$` + ajouteChampTexteMathLive(this, i, 'inline', { tailleExtensible: true }) + `${sp(3)}L`
          } else {
            texte = `$${texNombre(n, 3)}${sp()}\\text{m}^3=\\dotfill${sp()}\\text{L}$`
          }
          bonusDecimalesAMC = randint(0, 1)
          resultat = n * 1000
          setReponse(this, i, resultat, { digits: nombreDeChiffresDe(resultat) + randint(0, 1) + bonusDecimalesAMC, decimals: nombreDeChiffresDansLaPartieDecimale(resultat) + bonusDecimalesAMC, signe: false })
          texteCorr = `$${texNombre(n, 3)}${sp()}\\text{m}^3=${texNombre(n, 3)}\\times1${sp()}000${sp()}\\text{dm}^3=${texNombre(resultat, 0)}${sp()}\\text{L}$`
          texteCorr += !this.sup4 ? '' : '<br>' + buildTab(n, 'm', resultat, 'dm', 2, true, true)
          break
        case 'dm3toL':
          if (this.interactif) {
            texte = `$${texNombre(n, 3)}${sp()}\\text{dm}^3=$` + ajouteChampTexteMathLive(this, i, 'inline', { tailleExtensible: true }) + `${sp(3)}L`
          } else {
            texte = `$${texNombre(n, 3)}${sp()}\\text{dm}^3=\\dotfill${sp()}\\text{L}$`
          }
          bonusDecimalesAMC = randint(0, 1)
          resultat = n
          setReponse(this, i, resultat, { digits: nombreDeChiffresDe(resultat) + randint(0, 1) + bonusDecimalesAMC, decimals: nombreDeChiffresDansLaPartieDecimale(resultat) + bonusDecimalesAMC, signe: false })
          texteCorr = `$${texNombre(n, 3)}${sp()}\\text{dm}^3=${texNombre(resultat, 3)}${sp()}\\text{L}$`
          texteCorr += !this.sup4 ? '' : '<br>' + buildTab(n, 'dm', resultat, 'dm', 2, true, true)
          break
        case 'cm3toL':
          if (this.interactif) {
            texte = `$${texNombre(n, 3)}${sp()}\\text{cm}^3=$` + ajouteChampTexteMathLive(this, i, 'inline', { tailleExtensible: true }) + `${sp(3)}L`
          } else {
            texte = `$${texNombre(n, 3)}${sp()}\\text{cm}^3=\\dotfill${sp()}\\text{L}$`
          }
          bonusDecimalesAMC = randint(0, 1)
          resultat = n.div(1000)
          setReponse(this, i, resultat, { digits: nombreDeChiffresDe(resultat) + randint(0, 1) + bonusDecimalesAMC, decimals: nombreDeChiffresDansLaPartieDecimale(resultat) + bonusDecimalesAMC, signe: false })
          texteCorr = `$${texNombre(n, 3)}${sp()}\\text{cm}^3=${texNombre(n, 3)}\\div 1${sp()}000${sp()}\\text{dm}^3=${texNombre(resultat, 6)}${sp()}\\text{L}$`
          texteCorr += !this.sup4 ? '' : '<br>' + buildTab(n, 'cm', resultat, 'dm', 2, true, true)
          break
        case 'mm3toL':
          if (this.interactif) {
            texte = `$${texNombre(n, 3)}${sp()}\\text{mm}^3=$` + ajouteChampTexteMathLive(this, i, 'inline', { tailleExtensible: true }) + `${sp(3)}L`
          } else {
            texte = `$${texNombre(n, 3)}${sp()}\\text{mm}^3=\\dotfill${sp()}\\text{L}$`
          }
          bonusDecimalesAMC = randint(0, 1)
          resultat = n.div(1000000)
          setReponse(this, i, resultat, { digits: nombreDeChiffresDe(resultat) + randint(0, 1) + bonusDecimalesAMC, decimals: nombreDeChiffresDansLaPartieDecimale(resultat) + bonusDecimalesAMC, signe: false })
          texteCorr = `$${texNombre(n, 3)}${sp()}\\text{mm}^3=${texNombre(n, 3)}\\div1${sp()}000\\div 1${sp()}000${sp()}\\text{dm}^3=${texNombre(resultat, 9)}${sp()}\\text{L}$`
          texteCorr += !this.sup4 ? '' : '<br>' + buildTab(n, 'mm', resultat, 'dm', 2, true, true)
          break
        case 'Ltodm3':
          if (this.interactif) {
            texte = `$${texNombre(n, 3)}${sp()}\\text{L}=$` + ajouteChampTexteMathLive(this, i, 'inline', { tailleExtensible: true }) + `$${sp(3)}\\text{dm}^3$`
          } else {
            texte = `$${texNombre(n, 3)}${sp()}\\text{L}=\\dotfill${sp()}\\text{dm}^3$`
          }
          bonusDecimalesAMC = randint(0, 1)
          resultat = n
          setReponse(this, i, resultat, { digits: nombreDeChiffresDe(resultat) + randint(0, 1) + bonusDecimalesAMC, decimals: nombreDeChiffresDansLaPartieDecimale(resultat) + bonusDecimalesAMC, signe: false })
          texteCorr = `$${texNombre(n, 3)}${sp()}\\text{L}=${texNombre(resultat, 3)}${sp()}\\text{dm}^3$`
          texteCorr += !this.sup4 ? '' : '<br>' + buildTab(n, 'dm', resultat, 'dm', 2, true, true)
          break
        case 'Ltocm3':
          if (this.interactif) {
            texte = `$${texNombre(n, 3)}${sp()}\\text{L}=$` + ajouteChampTexteMathLive(this, i, 'inline', { tailleExtensible: true }) + `$${sp(3)}\\text{cm}^3$`
          } else {
            texte = `$${texNombre(n, 3)}${sp()}\\text{L}=\\dotfill${sp()}\\text{cm}^3$`
          }
          bonusDecimalesAMC = randint(0, 1)
          resultat = n * 1000
          setReponse(this, i, resultat, { digits: nombreDeChiffresDe(resultat) + randint(0, 1) + bonusDecimalesAMC, decimals: nombreDeChiffresDansLaPartieDecimale(resultat) + bonusDecimalesAMC, signe: false })
          texteCorr = `$${texNombre(n, 3)}${sp()}\\text{L}=${texNombre(n, 0)}${sp()}\\text{dm}^3=${texNombre(n, 0)}\\times1${sp()}000${sp()}\\text{cm}^3=${texNombre(n * 1000)}${sp()}\\text{cm}^3$`
          texteCorr += !this.sup4 ? '' : '<br>' + buildTab(n, 'dm', resultat, 'cm', 2, true, true)
          break
        case 'Ltom3':
          if (this.interactif) {
            texte = `$${texNombre(n, 3)}${sp()}\\text{L}=$` + ajouteChampTexteMathLive(this, i, 'inline', { tailleExtensible: true }) + `$${sp(3)}\\text{m}^3$`
          } else {
            texte = `$${texNombre(n, 3)}${sp()}\\text{L}=\\dotfill${sp()}\\text{m}^3$`
          }
          bonusDecimalesAMC = randint(0, 1)
          resultat = n.div(1000)
          setReponse(this, i, resultat, { digits: nombreDeChiffresDe(resultat) + randint(0, 1) + bonusDecimalesAMC, decimals: nombreDeChiffresDansLaPartieDecimale(resultat) + bonusDecimalesAMC, signe: false })
          texteCorr = `$${texNombre(n, 3)}${sp()}\\text{L}=${texNombre(n, 3)}${sp()}\\text{dm}^3=${texNombre(n, 3)}\\div1${sp()}000${sp()}\\text{m}^3=${texNombre(resultat, 6)}${sp()}\\text{m}^3$`
          texteCorr += !this.sup4 ? '' : '<br>' + buildTab(n, 'dm', resultat, 'm', 2, true, true)
          break
      }

      if (this.sup3 && i === this.nbQuestions - 1) {
        texte += '<br><br>' + buildTab(0, '', 0, '', Math.min(8, this.nbQuestions), true, false)
      }

      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
  this.besoinFormulaireNumerique = [
    'Niveau de difficulté',
    3,
    '1 : Unités de volume vers litres\n2 : Litres vers unités de volume\n3 : Mélange'
  ]
  this.besoinFormulaire2CaseACocher = ['Avec des nombres décimaux']
  this.besoinFormulaire3CaseACocher = ['Avec tableau dans l\'énoncé', false]
  this.besoinFormulaire4CaseACocher = ['Avec tableau dans la correction', false]
}

function buildTab (a, uniteA, r, uniteR, ligne = 2, force = false, correction = false) {
  const tabRep = function (nbre, uniteNbre) {
    const res = []
    let caseARemplir
    // for (let ee = 0; ee < 21; ee++) res.push('\\hspace*{0.4cm}')
    for (let ee = 0; ee < 21; ee++) res.push('')
    switch (uniteNbre.replaceAll(' ', '')) {
      case 'dam':
        for (let i = 0; i < 21; i++) {
          caseARemplir = i % 3 === 1 ? (getDigitFromNumber(nbre, Decimal.pow(10, 5 - i)) !== '' ? '\\hspace*{0.2cm}' + getDigitFromNumber(nbre, Decimal.pow(10, 5 - i)) + '\\hspace*{0.2cm}' : '\\hspace*{0.6cm}') : (getDigitFromNumber(nbre, Decimal.pow(10, 5 - i)) === '' ? '\\hspace*{0.2cm}' : getDigitFromNumber(nbre, Decimal.pow(10, 5 - i)))
          res[i] = (5 - i === 0 ? '\\color{red}{' : '') + caseARemplir + (5 - i === 0 ? (new Decimal(nbre).decimalPlaces() === 0 ? '}' : ',}') : '')
        }
        break
      case 'm':
        for (let i = 0; i < 21; i++) {
          caseARemplir = i % 3 === 1 ? (getDigitFromNumber(nbre, Decimal.pow(10, 8 - i)) !== '' ? '\\hspace*{0.2cm}' + getDigitFromNumber(nbre, Decimal.pow(10, 8 - i)) + '\\hspace*{0.2cm}' : '\\hspace*{0.6cm}') : (getDigitFromNumber(nbre, Decimal.pow(10, 8 - i)) === '' ? '\\hspace*{0.2cm}' : getDigitFromNumber(nbre, Decimal.pow(10, 8 - i)))
          res[i] = (8 - i === 0 ? '\\color{red}{' : '') + caseARemplir + (8 - i === 0 ? (new Decimal(nbre).decimalPlaces() === 0 ? '}' : ',}') : '')
        }
        break
      case 'dm':
        for (let i = 0; i < 21; i++) {
          caseARemplir = i % 3 === 1 ? (getDigitFromNumber(nbre, Decimal.pow(10, 11 - i)) !== '' ? '\\hspace*{0.2cm}' + getDigitFromNumber(nbre, Decimal.pow(10, 11 - i)) + '\\hspace*{0.2cm}' : '\\hspace*{0.6cm}') : (getDigitFromNumber(nbre, Decimal.pow(10, 11 - i)) === '' ? '\\hspace*{0.2cm}' : getDigitFromNumber(nbre, Decimal.pow(10, 11 - i)))
          res[i] = (11 - i === 0 ? '\\color{red}{' : '') + caseARemplir + (11 - i === 0 ? (new Decimal(nbre).decimalPlaces() === 0 ? '}' : ',}') : '')
        }
        break
      case 'cm':
        for (let i = 0; i < 21; i++) {
          caseARemplir = i % 3 === 1 ? (getDigitFromNumber(nbre, Decimal.pow(10, 14 - i)) !== '' ? '\\hspace*{0.2cm}' + getDigitFromNumber(nbre, Decimal.pow(10, 14 - i)) + '\\hspace*{0.2cm}' : '\\hspace*{0.6cm}') : (getDigitFromNumber(nbre, Decimal.pow(10, 14 - i)) === '' ? '\\hspace*{0.2cm}' : getDigitFromNumber(nbre, Decimal.pow(10, 14 - i)))
          res[i] = (14 - i === 0 ? '\\color{red}{' : '') + caseARemplir + (14 - i === 0 ? (new Decimal(nbre).decimalPlaces() === 0 ? '}' : ',}') : '')
        }
        break
      case 'mm':
        for (let i = 0; i < 21; i++) {
          caseARemplir = i % 3 === 1 ? (getDigitFromNumber(nbre, Decimal.pow(10, 17 - i)) !== '' ? '\\hspace*{0.2cm}' + getDigitFromNumber(nbre, Decimal.pow(10, 17 - i)) + '\\hspace*{0.2cm}' : '\\hspace*{0.6cm}') : (getDigitFromNumber(nbre, Decimal.pow(10, 17 - i)) === '' ? '\\hspace*{0.2cm}' : getDigitFromNumber(nbre, Decimal.pow(10, 17 - i)))
          res[i] = (17 - i === 0 ? '\\color{red}{' : '') + caseARemplir + (17 - i === 0 ? (new Decimal(nbre).decimalPlaces() === 0 ? '}' : ',}') : '')
        }
        break
    }
    return res
  }

  const createTab = function (aT, rT, first, end, ligne, correction = false) {
    let texte = '$\\def\\arraystretch{1.5}\\begin{array}{|'
    for (let i = first; i <= end; i++) {
      texte += 'c|'
    }
    texte += '}'
    const headers2 = ['\\hspace*{0.4cm}', '\\text{dam}^3', '\\text{m}^3', '\\text{dm}^3', '\\text{cm}^3', '\\text{mm}^3', '\\hspace*{0.4cm}']
    texte += '\\hline '
    for (let i = first; i < end; i++) {
      texte += `${headers2[i]} ${i < end - 1 ? ' &' : ' \\\\'}`
    }

    for (let i = first; i < first + 3; i++) {
      texte += '&'
    }
    texte += '\\begin{array}{c:c:c}'
    texte += '\\text{hL} & \\text{daL} & \\text{L}\\hspace*{0.2cm}\\\\'
    texte += '\\end{array}&'
    texte += '\\begin{array}{c:c:c}'
    texte += '\\hspace*{0.1cm}\\text{dL} & \\hspace*{0.1cm}\\text{cL}\\hspace*{0.1cm} & \\text{mL}\\\\'
    texte += '\\end{array}&'

    for (let i = first + 5; i < end; i++) {
      texte += (i !== end - 1 ? ' & ' : '')
    }
    if (correction) {
      texte += '\\\\'
      texte += '\\hline '
      for (let i = first; i < end; i++) {
        texte += '\\begin{array}{c:c:c}'
        texte += `${aT[3 * i]} & ${aT[3 * i + 1]}& ${aT[3 * i + 2]}  \\\\`
        texte += `${rT[3 * i]}  & ${rT[3 * i + 1]}& ${rT[3 * i + 2]}  \\\\`
        texte += !correction ? ` ${rT[3 * i]} & ${rT[3 * i + 1]}& ${rT[3 * i + 2]}  \\\\` : ''
        texte += '\\end{array}'
        texte += (i !== end - 1 ? ' & ' : '')
      }
    } else {
      for (let k = 1; k <= ligne; k++) {
        texte += '\\\\ \\hline '
        for (let i = first; i < end; i++) {
          texte += '\\begin{array}{c:c:c}'
          texte += '\\hspace*{0.6cm} & \\hspace*{0.6cm} & \\hspace*{0.6cm} \\\\'
          texte += '\\end{array}'
          texte += (i !== end - 1 ? ' & ' : '')
        }
      }
    }
    texte += '\\\\ \\hline '

    texte += ' \\end{array}$'
    return texte
  }
  const aTab = tabRep(a, uniteA)
  const rTab = tabRep(r, uniteR)
  /*
  const minTab1 = aTab[0] !== '' || aTab[1] !== '' || aTab[2] !== '' ? 0 : aTab[3] !== '' || aTab[4] !== '' || aTab[5] !== '' || force ? 3 : 6
  const minTab2 = rTab[0] !== '' || rTab[1] !== '' || rTab[2] !== '' ? 0 : rTab[3] !== '' || rTab[4] !== '' || rTab[5] !== '' || force ? 3 : 6
  const maxTab1 = aTab[20] !== '' || aTab[19] !== '' || aTab[18] !== '' ? 21 : aTab[17] !== '' || aTab[16] !== '' || aTab[15] !== '' || force ? 18 : 15
  const maxTab2 = rTab[20] !== '' || rTab[19] !== '' || rTab[18] !== '' ? 21 : rTab[17] !== '' || rTab[16] !== '' || rTab[15] !== '' || force ? 18 : 15
  const texte = createTab(aTab, rTab, Math.min(minTab1, minTab2) / 3, Math.max(maxTab1, maxTab2) / 3, ligne, correction, vierge)
  */
  const texte = createTab(aTab, rTab, 0, 6, ligne, correction)
  return texte
}
