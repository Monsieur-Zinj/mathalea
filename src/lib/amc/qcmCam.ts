import type Exercice from '../../exercices/Exercice'
import { lettreDepuisChiffre } from '../outils/outilString'

export default function qcmCamExport (exercice: Exercice): string {
  const laQuestion = exercice.listeQuestions[0]
  const [enonce, qcm] = laQuestion.split('<br>')
  const correction = exercice.listeCorrections[0]
  const [qcmCorr] = correction.split('<br>')
  const props = qcm.split('</div></div>')
  const propsCorr = qcmCorr.split('<label id="labelEx')
  const listeElements:{bonneReponse:boolean, prop:string}[] = []
  let question = `<h3 data-translate="{&quot;html&quot;:&quot;questions.defaultquestion&quot;}">${enonce.replaceAll(/\$([^$]*)\$/g, '<span class="math-tex">$1</span>')}</h3><ol>`
  let reponse: string = ''
  for (let i = 0; i < props.length - 1; i++) {
    if (exercice.autoCorrection != null && exercice.autoCorrection[0] != null && exercice.autoCorrection[0].propositions != null) {
      const prop = exercice.autoCorrection[0]?.propositions[i]?.texte.replaceAll(/\$([^$]*)\$/g, '<span class="math-tex">$1</span>')
      const bonneReponse = propsCorr[i].includes('checked')
      question += `<li${bonneReponse ? ' class="rondvert"' : ''}>${prop}</li>`
      listeElements.push({ bonneReponse, prop })
      if (bonneReponse) reponse = lettreDepuisChiffre(i + 1)
    }
  }
  question += '</ol>'
  const sortie = JSON.stringify({ question, reponse })
  return sortie
}
