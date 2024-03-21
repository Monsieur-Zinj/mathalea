import './styleSandbox.scss'
import { MathfieldElement, type Expression } from 'mathlive'
import { ComputeEngine, type BoxedExpression } from '@cortex-js/compute-engine'

export type FOrmatValue = 'litteral' | 'numerique' | 'fonction' | 'liste' | 'fraction'

interface ILitteralValues {
  developper?: boolean,
  simplifier?: boolean,
  ordonner?: boolean,
  deriver?: boolean,
  compiler?: boolean
}

interface IFractionValues {
  irreductible: boolean,
  forcerdecimalenrationnel: boolean,
  fractionplussimple: boolean
}

interface INumeriqueValues {
  // puissance: boolean,
  notation: string
}

interface IListeValues {
  ordonnee: boolean,
  croissant: boolean,
  eliminedoublons: boolean
}

interface IFonctionValues {
  deriver: boolean,
  simplifier: boolean,
}

const litteralOptionsValues = ['développer', 'simplifier', 'dériver', 'compiler']
const numeriqueOptionsValue: [string, string, string][] = [['notation', 'scientifique', 'ingénieure']]
const fractionOptionsValues = ['irréductible', 'forcer décimal en rationnel', 'fraction plus simple']
const listeOptionsValues = ['ordonnée', 'croissant', 'élimine doublons']
const fonctionOptionsValues = ['simplifier', 'dériver']

interface IOptionFormat {
  litteral?: ILitteralValues,
  fraction?: IFractionValues,
  fonction?: IFonctionValues,
  liste?: IListeValues,
  numerique?: INumeriqueValues
}

const ce = new ComputeEngine()
ce.latexOptions.decimalMarker = '{,}'
// ce.latexOptions.avoidExponentsInRange = [-9, 9]
ce.latexOptions.exponentProduct = '\\times'
// ce.latexOptions.fractionStyle = ()=>"display-quotient"

const gcd = function (a: number, b: number): number {
  if (!Number.isInteger(a)) a = Math.round(a)
  if (!Number.isInteger(b)) b = Math.round(b)
  if (!b) {
    return a
  }
  return gcd(b, a % b)
}

/*
ce.jsonSerializationOptions = {
    metadata: ["latex"]
}
*/
function cleanDivTexContent (parent: HTMLDivElement) {
  for (const child of Array.from(parent.children)) {
    if (child.children.length > 0 && child instanceof HTMLDivElement) cleanDivTexContent(child)
    else {
      if (child.textContent !== '') {
        child.textContent = ''
      }
    }
  }
}

/**
 * La fonction qui effectue les vérifications en aiguillant vers les bonnes procédures (beaucoup restent à implémenter)
 * @param saisie
 * @param reponse
 * @param saisieCanonical
 * @param reponseCanonical
 * @param isEqual
 * @param formatSelector
 * @param optionsFormatSaisie
 * @param optionsFormatReponse
 */
function compare (saisie: string, reponse: string, {
  saisieCanonical,
  reponseCanonical,
  isEqual,
  formatSelector, optionsFormatSaisie, optionsFormatReponse
}: {
  saisieCanonical: boolean,
  reponseCanonical: boolean,
  isEqual: boolean,
  formatSelector: FOrmatValue,
  optionsFormatSaisie: IOptionFormat,
  optionsFormatReponse: IOptionFormat
}): boolean {
  if (formatSelector === 'fraction') {
    saisieCanonical = false
    reponseCanonical = false
  }
  const feedback = document.querySelector<HTMLDivElement>('div#feedback')

  let saisieCompilee: ((args: Record<string, unknown>) => unknown) | undefined
  let reponseCompilee: ((args: Record<string, unknown>) => unknown) | undefined
  let saisieFinaleLatex: string
  let reponseFinaleLatex: string
  let notationSaisie: string | undefined
  let notationReponse: string | undefined
  // On nettoie le div 'feedback' du message précédent
  if (feedback != null) cleanDivTexContent(feedback)
  // on récupère le contenu des champs Mathlive
  // let numSaisie, denSaisie, numReponse, denReponse
  let saisieParsed: BoxedExpression
  let reponseParsed: BoxedExpression
  let result: boolean
  // On aiguille vers la bonne fonction de vérification qui va appliquer les options sélectionnées
  switch (formatSelector) {
    case 'litteral':
      saisieParsed = ce.parse(saisie, { canonical: saisieCanonical })
      reponseParsed = ce.parse(reponse, { canonical: reponseCanonical })
      if (optionsFormatSaisie.litteral) {
        if (optionsFormatSaisie.litteral.developper) {
          saisieParsed = ce.box(['Expand', saisieParsed]).evaluate()
        }
        if (optionsFormatSaisie.litteral.simplifier) {
          saisieParsed = saisieParsed.simplify()
        }
        // Pour l'instant l'option n'est pas encore disponible dans Compute-engine, donc elle est retiré en attendant des choix possibles.
        if (optionsFormatSaisie.litteral.deriver) {
          alert('Attention ! la dérivée n\'est fonctionnelle que pour les polynômes.')
          saisieParsed = ce.box(['D', saisieParsed, 'x']).evaluate()
        }
        if (optionsFormatSaisie.litteral.compiler) {
          saisieCompilee = saisieParsed.compile()
        }
      }
      saisieFinaleLatex = saisieParsed.latex
      if (optionsFormatReponse.litteral) {
        if (optionsFormatReponse.litteral.developper) { // @todo comprendre comment ça fonctionne
          reponseParsed = ce.box(['Expand', reponseParsed]).evaluate()
        }
        if (optionsFormatReponse.litteral.simplifier) {
          reponseParsed = reponseParsed.simplify()
        }
        if (optionsFormatReponse.litteral.deriver) { // @todo comprendre comment ça fonctionne
          reponseParsed = ce.box(['Derivative', reponseParsed, 'x']).evaluate()
        }
        if (optionsFormatReponse.litteral.compiler) { // @todo comprendre comment ça fonctionne
          reponseCompilee = reponseParsed.compile()
        }
      }
      reponseFinaleLatex = reponseParsed.latex
      break
    case 'numerique':
      notationSaisie = optionsFormatSaisie.numerique?.notation
      if (notationSaisie) {
        if (notationSaisie === 'scientifique') {
          ce.latexOptions.notation = 'scientific'
          ce.latexOptions.avoidExponentsInRange = [0, 0]
        } else if (notationSaisie === 'ingénieure') {
          ce.latexOptions.notation = 'engineering'
          ce.latexOptions.avoidExponentsInRange = [0, 0]
        } else {
          ce.latexOptions.notation = 'auto'
          ce.latexOptions.avoidExponentsInRange = [-9, 9]
        }
      }
      saisieParsed = ce.parse(saisie, { canonical: saisieCanonical })
      saisieFinaleLatex = saisieParsed.latex
      notationReponse = optionsFormatReponse.numerique?.notation
      if (notationReponse) {
        if (notationReponse === 'scientifique') {
          ce.latexOptions.notation = 'scientific'
          ce.latexOptions.avoidExponentsInRange = [0, 0]
        } else if (notationReponse === 'ingénieure') {
          ce.latexOptions.notation = 'engineering'
          ce.latexOptions.avoidExponentsInRange = [0, 0]
        } else {
          ce.latexOptions.notation = 'auto'
          ce.latexOptions.avoidExponentsInRange = [-9, 9]
        }
      }
      reponseParsed = ce.parse(reponse, { canonical: reponseCanonical })
      reponseFinaleLatex = reponseParsed.latex
      break
    case 'liste':// @todo à implémenter
    case 'fonction':// @todo à implémenter
    case 'fraction':
    default:
      if (optionsFormatSaisie.fraction?.forcerdecimalenrationnel) {
        ce.latexOptions.parseNumbers = 'rational'
      }
      reponseParsed = ce.parse(reponse, { canonical: false })
      saisieParsed = ce.parse(saisie, { canonical: false })
      if (optionsFormatSaisie.fraction?.forcerdecimalenrationnel) {
        isEqual = true
      } else {
        isEqual = true
        if (optionsFormatSaisie.fraction?.irreductible) {
          reponseParsed = reponseParsed.canonical
        }
      }
      saisieFinaleLatex = saisieParsed.latex
      reponseFinaleLatex = reponseParsed.latex
      break
  }
  if (formatSelector === 'fraction') {
    if (optionsFormatSaisie.fraction?.fractionplussimple) {
      const num1 = saisieParsed.op1.numericValue
      const num2 = reponseParsed.op1.numericValue
      if (num1 != null && num2 != null) {
        result = saisieParsed.isEqual(reponseParsed)
        result = result && num1 < num2
      } else {
        console.warn(`On a un problème avec l'un des deux numérateurs : numSaisie = ${num1} et numReponse = ${num2} `)
        result = false
      }
    } else if (optionsFormatSaisie.fraction?.irreductible) {
      const numSaisie = Number(saisieParsed.op1.numericValue)
      const denSaisie = Number(saisieParsed.op2.numericValue)
      const irreductible = gcd(numSaisie, denSaisie) === 1
      result = irreductible && saisieParsed.isEqual(reponseParsed)
    } else { // ni irreductible, ni plus simple,
      result = saisieParsed.isEqual(reponseParsed)
    }
  } else {
    result = isEqual ? saisieParsed.isEqual(reponseParsed) : saisieParsed.isSame(reponseParsed)
  }
  // On connait la réponse, on va maintenant rendre compte dans les différents éléments de feedback.
  const resultatSaisie = document.querySelector('#resultatSaisie')
  const resultatReponse = document.querySelector('#resultatReponse')
  if (resultatSaisie && resultatReponse) {
    resultatSaisie.textContent = `${saisieFinaleLatex}`
    resultatReponse.textContent = `${reponseFinaleLatex}`
  }

  if (feedback != null) { // c'est pour pas que ts râle feedback est dans la page html.
    const p1 = document.querySelector('div#conclusion')
    if (p1) p1.appendChild(document.createTextNode(`Comparaison de la saisie élève [${saisieParsed.json}] soit ${saisieParsed.latex} et de la réponse [${reponseParsed.json}] soit ${reponseParsed.latex} en utilisant la méthode ${isEqual ? 'isEqual()' : 'isSame()'} avec le processus de traitement pour le format ${formatSelector} : ${String(result)}`))
    if (saisieCompilee) {
      const div1 = document.querySelector('div#saisieCompile')
      if (div1) div1.appendChild(document.createTextNode(`saisie compilée : ${saisieCompilee}`))
    }
    if (reponseCompilee) {
      const div2 = document.querySelector('div#reponseCompile')
      if (div2) div2.appendChild(document.createTextNode(`réponse compilée : ${reponseCompilee}`))
    }
  }
  // alert(`Résultat de la comparaison = ${result}`)
  return result
}

export const uuid = 'sandboxCE'
export const titre = 'Compute-engine sandbox'

class ComputeEngineSandbox {
  typeExercice: string
  numeroExercice!: number
  sup!: string
  titre: string
  container: HTMLDivElement

  constructor () {
    this.typeExercice = 'html'
    this.titre = 'Compute-engine sandbox'
    this.container = document.createElement('div')
    this.container.setAttribute('overflow', 'auto')
    const mathVirtualKeyboard = window.mathVirtualKeyboard
    this.container.id = 'sandbox'
    this.container.innerHTML = `<table id="table1">
        <thead>
        <tr>
            <th colspan="3">
                <h2>Saisir deux expressions puis choisir le type de comparaison</h2>
            </th>
        </tr>
        <tr>
            <td>
             <label>Type de comparaison :
                    <select id="format">
                        <option>littéral</option>
                        <option>numérique</option>
                        <option>fraction</option>
                        <option>liste</option>
                        <option>fonction</option>
                    </select>
                </label>
</td>
<td>    </td>
     <td>séparateur décimal
     <form id="sep">
     <input type="radio" name="sep" value="virgule" checked><label>virgule</label></input>
     <input type="radio" name="sep" value="point"><label>point</label></input>
</form>
</td>          
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><h3>Saisie élève</h3></td>
            <td><h3>Réponse attendue</h3></td>
            <td><h3>Résultat de la comparaison</h3></td>
        </tr>
        <tr>
            <td id="saisie"></td>
            <td id="reponse"></td>
            <td id="resultat">true</td>
        </tr>
        <tr>
            <td id="optionsSaisie"></td>
            <td id="optionsReponse"></td>
        </tr>
        <tr>
            <th>Rendre canonique la saisie élève ?</th>
            <th>Rendre canonique la réponse attendue ?</th>
            <th>Utiliser isSame() ou isEqual() ?</th>
        </tr>
        <tr>
            <th>
                <form id='canonicalSaisie'>
                    <label><input type='radio' name='canonicalSaisie' value='true' checked>True</label><br>
                    <label><input type='radio' name='canonicalSaisie' value='false'>False</label>
                </form>
            </th>
            <th>
                <form id='canonicalReponse'>
                    <label><input type='radio' name='canonicalReponse' value='true' checked>True</label><br>
                    <label><input type='radio' name='canonicalReponse' value='false'>False</label>
                </form>
            </th>
            <th>
                <form id="isEqual">
                    <label><input type='radio' name='isEqual' value='true' checked>isEqual()</label><br>
                    <label><input type='radio' name='isEqual' value='false'>isSame()</label>
                </form>
            </th>
        </tr>
        <tr>

        </tr>
        <tr>
            <th colspan="2">
                résultat après traitement
            </th>
        </tr>
        <tr>
            <th id="resultatSaisie">
                &nbsp;
            </th>
            <th id="resultatReponse">
                &nbsp;
            </th>
        </tr>
        </tbody>
    </table>
    <div id="feedback" style="display: block">
        <div id="conclusion"></div>
        <div id="divCompile" style="display: inline">
            <div id="saisieCompile" style="display: inline"></div>
            &nbsp;&nbsp;
            <div id="reponseCompile" style="display: inline"></div>
        </div>
    </div>
`
    const inputSep = this.container.querySelector<HTMLFormElement>('#sep')
    const formSaisieCanonical = this.container.querySelector<HTMLFormElement>('#canonicalSaisie')
    const formReponseCanonical = this.container.querySelector<HTMLFormElement>('#canonicalReponse')
    const optionsSaisie = this.container.querySelector<HTMLTableCellElement>('#optionsSaisie')
    const optionsReponse = this.container.querySelector<HTMLTableCellElement>('#optionsReponse')
    const formIsEqual = this.container.querySelector<HTMLFormElement>('#isEqual')
    const radioSaisieCanonical = formSaisieCanonical?.querySelectorAll('input')
    const radioReponseCanonical = formReponseCanonical?.querySelectorAll('input')
    const radioIsEqual = formIsEqual?.querySelectorAll('input')
    const cellSaisie = this.container.querySelector<HTMLTableCellElement>('#saisie')
    const cellReponse = this.container.querySelector<HTMLTableCellElement>('#reponse')
    const cellResultat = this.container.querySelector<HTMLTableCellElement>('#resultat')
    const formatSelector = this.container.querySelector<HTMLSelectElement>('#format')
    // les options pour chaque format (à implémenter)

    // initialisation des variables
    let saisieCanonical = false
    let reponseCanonical = false
    let isEqual = false
    let optionsFormatSaisie: IOptionFormat
    let optionsFormatReponse: IOptionFormat

    // MathfieldElement.fontsDirectory = '../assets/fonts'
    // MathfieldElement.soundsDirectory = '../assets/sounds'
    MathfieldElement.decimalSeparator = ','

    // On crée les deux inputs Mathlive et on active le clavier au focus (on le vire au focusout)
    const saisie = new MathfieldElement()
    const reponse = new MathfieldElement()
    saisie.mathVirtualKeyboardPolicy = 'manual'
    reponse.mathVirtualKeyboardPolicy = 'manual'
    saisie.addEventListener('focusin', () => mathVirtualKeyboard.show())
    reponse.addEventListener('focusin', () => mathVirtualKeyboard.show())
    saisie.addEventListener('focusout', () => mathVirtualKeyboard.hide())
    reponse.addEventListener('focusout', () => mathVirtualKeyboard.hide())

    // Les deux formulaires pour les options de format
    const formOptionsSaisie: HTMLFormElement = document.createElement('form')
    const formOptionsReponse: HTMLFormElement = document.createElement('form')

    /**
     * Une fonction pour nettoyer les zones d'options
     */
    function cleanOptions () {
      if (optionsSaisie && formOptionsSaisie) {
        for (const child of Array.from(formOptionsSaisie.children)) {
          formOptionsSaisie.removeChild(child)
        }
        for (const child of Array.from(optionsSaisie.children)) {
          optionsSaisie.removeChild(child)
        }
      }
      if (optionsReponse && formOptionsReponse) {
        for (const child of Array.from(formOptionsReponse.children)) {
          formOptionsReponse.removeChild(child)
        }
        for (const child of Array.from(optionsReponse.children)) {
          optionsReponse.removeChild(child)
        }
      }
    }

    /**
     * crée un label contenant un input de type checkbox pour le formulaire de même nom que le label
     * @param label
     * @param value
     * @param checked
     */
    function addCheckbox (label: string, value: string, checked: boolean) {
      const lab1 = document.createElement('label')
      const textContent = document.createTextNode(label)
      const input1 = document.createElement('input')
      input1.addEventListener('change', () => updateResultat())
      input1.type = 'checkbox'
      input1.value = value
      input1.checked = checked
      input1.name = value
      lab1.appendChild(input1)
      lab1.appendChild(textContent)
      return lab1
    }

    function addRadios (label: [string, string, string], checked: boolean) {
      const lab1 = document.createElement('label')
      const textContent = document.createTextNode(label[0] + ' : ')
      const input1 = document.createElement('input')
      input1.addEventListener('change', () => updateResultat())
      input1.type = 'radio'
      input1.value = label[1]
      input1.checked = checked
      input1.name = label[0]
      const input2 = document.createElement('input')
      input2.addEventListener('change', () => updateResultat())
      input2.type = 'radio'
      input2.value = label[2]
      input2.checked = false
      input2.name = label[0]
      const text1 = document.createTextNode(label[1])
      const text2 = document.createTextNode(label[2])
      lab1.appendChild(textContent)
      lab1.appendChild(input1)
      lab1.appendChild(text1)
      lab1.appendChild(input2)
      lab1.appendChild(text2)
      return lab1
    }

    /**
     * Ajoute les différents label/inputs à chaque formulaire pour les options de format
     * @param {boolean} onlySaisie si true, il n'y aura pas de cases à cocher sur la réponse
     * @param {strings} labels les différentes options du format.
     */
    function renseigneOptions (onlySaisie: boolean, ...labels: string[] | [string, string, string][]) {
      cleanOptions()
      for (const label of labels) {
        const element = Array.isArray(label) ? addRadios(label, false) : addCheckbox(label, label.replaceAll('é', 'e').replaceAll(/\s/g, ''), false)
        formOptionsSaisie.appendChild(element)
        formOptionsSaisie.appendChild(document.createElement('br'))
        if (!onlySaisie) {
          formOptionsReponse.appendChild(Array.isArray(label) ? addRadios(label, false) : addCheckbox(label, label.replaceAll('é', 'e').replaceAll(/\s/g, ''), false))
          formOptionsReponse.appendChild(document.createElement('br'))
        }
      }
    }

    /**
     * met à jour les options du format (appelé à chaque changement de format et à l'init avec la valeur 'littéral')
     * @param format
     */
    function updateOptions (format: string) {
      if (format) {
        if (optionsSaisie && optionsReponse) {
          switch (format) {
            case 'littéral': // mise en place des checkboxes de configuration du format littéral
              renseigneOptions(false, ...litteralOptionsValues)
              break
            case 'numérique':
              renseigneOptions(false, ...numeriqueOptionsValue)
              break
            case 'fonction':
              renseigneOptions(false, ...fonctionOptionsValues)
              break
            case 'liste':
              renseigneOptions(false, ...listeOptionsValues)
              break
            case 'fraction':
              renseigneOptions(true, ...fractionOptionsValues)
              break
            default:
              cleanOptions()
              throw Error(`Le sélecteur de format a rencontré une valeur imprévue : ${formatSelector?.value}`)
          }
          optionsSaisie.appendChild(formOptionsSaisie)
          optionsReponse.appendChild(formOptionsReponse)
        }
      }
    }

    // Mise en place des listeners sur les différents éléments qui provoque un changement
    if (formatSelector) { // sélecteur de format
      formatSelector.addEventListener('change', () => {
        if (formatSelector?.value === 'fraction') {
          alert('En format "fraction", le test se fait toujours avec isEqual, et l\'option canonical à false.\nSi l\'option "forcer décimal en rationnel" est active, les nombres décimaux sont convertis en fractions décimales.\nLes options permettent d\'affiner le test.')
          if (formReponseCanonical) {
            const inputs = Array.from(formReponseCanonical.querySelectorAll('input'))
            if (inputs[1]) inputs[1].checked = true
          }
        }
        updateOptions(formatSelector.value)
      }
      )
    }

    if (inputSep) {
      const jsonChange = ({ from, to, json }: {from: string, to: string, json: Expression|string}) => {
        if (Array.isArray(json)) {
          for (const element of json) {
            jsonChange({ from, to, json: element })
          }
        } else if (typeof json === 'string') {
          json.replaceAll(from, to)
        }
      }
      inputSep.addEventListener('change', () => {
        const buttons = Array.from(inputSep.querySelectorAll('input'))
        const saisieExp = saisie.expression
        const reponseExp = reponse.expression
        if (Array.isArray(buttons) && buttons.length > 0) {
          const button = buttons.find((el) => el?.checked)
          if (button) {
            const separator = button.value
            if (separator === 'virgule') {
              MathfieldElement.decimalSeparator = ','
              jsonChange({ from: '.', to: ',', json: saisieExp })
              jsonChange({ from: '.', to: ',', json: reponseExp })
              saisie.expression = saisieExp
              reponse.expression = reponseExp
            } else {
              MathfieldElement.decimalSeparator = '.'
              jsonChange({ from: ',', to: '.', json: saisieExp })
              jsonChange({ from: ',', to: '.', json: reponseExp })
              saisie.expression = saisieExp
              reponse.expression = reponseExp
            }
          }
        }
      })
    }

    if (formSaisieCanonical) { // radios forme canonique saisie
      formSaisieCanonical.addEventListener('change', () => {
        if (formatSelector?.value === 'fraction') {
          alert('En format "fraction", le test se fait avec isEqual, l\'option canonical à false.\nLes options permettent de configurer plus finement le test.\nDe plus, si l\'option "forcer décimal en rationnel" est active, les nombres décimaux sont convertis en fraction décimale avant le test.')
          const inputs = Array.from(formSaisieCanonical.querySelectorAll('input'))
          if (inputs[1]) inputs[1].checked = true
          return
        }
        if (radioSaisieCanonical) saisieCanonical = Boolean(radioSaisieCanonical[0]?.checked)
        updateResultat()
      })
    }
    if (formReponseCanonical) { // radios forme canonique réponse
      formReponseCanonical.addEventListener('change', () => {
        if (formatSelector?.value === 'fraction') {
          alert('En format "fraction", l\'option canonical reste à false car sinon, cela provoque la réduction de la fraction.')
          const inputs = Array.from(formReponseCanonical.querySelectorAll('input'))
          if (inputs[1]) inputs[1].checked = true
          return
        }
        if (radioReponseCanonical) reponseCanonical = Boolean(radioReponseCanonical[0]?.checked)
        updateResultat()
      })
    }
    if (formIsEqual) { // radios isEqual/isSame
      formIsEqual.addEventListener('change', () => {
        if (radioIsEqual && formatSelector && formatSelector.value === 'fraction') {
          const optionsSaisie = document.querySelector('#optionsSaisie')
          if (optionsSaisie) {
            const formSaisie = optionsSaisie.firstChild as HTMLFormElement
            const elements = formSaisie.elements
            // const irreductible = (elements[0] as HTMLInputElement).checked
            const accepterDecimal = (elements[1] as HTMLInputElement).checked
            // const plusSimple = (elements[2] as HTMLInputElement).checked
            if (accepterDecimal) { // On accepte une valeur décimale même si irreductible ou plusSimple sont cochés... c'est pour faire des tests.
              // En théorie, si on veut une fraction irréductible, on ne tolérera pas les décimaux.
              isEqual = true
              if (radioIsEqual[0] && radioIsEqual[1]) {
                radioIsEqual[0].checked = true
                radioIsEqual[1].checked = false
              }
            } else {
              isEqual = false
              if (radioIsEqual[0] && radioIsEqual[1]) {
                radioIsEqual[1].checked = true
                radioIsEqual[0].checked = false
              }
            }
          }
        } else if (radioIsEqual) isEqual = Boolean(radioIsEqual[0]?.checked)
        updateResultat()
      })
    }
    if (saisie) { // champ de saisie Mathlive
      saisie.addEventListener('change', () => {
        updateResultat()
      })
    }
    if (reponse) { // champ de réponse Mathlive
      reponse.addEventListener('change', () => {
        updateResultat()
      })
    }

    /**
     * La fonction qui met à jour le résultat de la comparaison...
     */
    function updateResultat () {
      optionsFormatSaisie = {}
      optionsFormatReponse = {}
      let property: FOrmatValue
      if (formatSelector) {
        const format = formatSelector.value
        if (['littéral', 'fraction', 'fonction', 'numérique', 'liste'].includes(format)) {
          property = format.replaceAll('é', 'e').replaceAll(/\s/g, '') as FOrmatValue
          const propsSaisie = (Array.from(formOptionsSaisie.elements) as HTMLInputElement[]).filter(elt => elt.checked).map(elt => {
            return elt.name === 'notation' ? [elt.name, elt.value] : [elt.name, true]
          })
          const propsReponse = (Array.from(formOptionsReponse.elements) as HTMLInputElement[]).filter(elt => elt.checked).map(elt => {
            return elt.name === 'notation' ? [elt.name, elt.value] : [elt.name, true]
          })
          const objetSaisie = [property, Object.fromEntries(propsSaisie)]
          const objetReponse = [property, Object.fromEntries(propsReponse)]
          optionsFormatSaisie = Object.fromEntries([objetSaisie])
          optionsFormatReponse = Object.fromEntries([objetReponse])
          if (cellResultat) {
            const resultat = compare(saisie.value, reponse.value, {
              saisieCanonical,
              reponseCanonical,
              isEqual,
              formatSelector: property,
              optionsFormatSaisie,
              optionsFormatReponse
            })
            cellResultat.innerText = String(resultat)
          }
        }
      }
    }

    // Mise en place des inputMathlive dans la table
    if (cellSaisie) cellSaisie.appendChild(saisie)
    if (cellReponse) cellReponse.appendChild(reponse)

    updateOptions('littéral') // à la mise en route, on est en format 'littéral'
  }

  get html () {
    return this.container
  }
}
export default ComputeEngineSandbox

// Les éléments à piloter

// Les éléments à piloter
