<script lang="ts">
  import { afterUpdate, onMount } from 'svelte'
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import { setSizeWithinSvgContainer } from '../../../../lib/components/sizeTools'
  import { loadMathLive } from '../../../../modules/loaders'
  import { keyboardState } from '../../../keyboard/stores/keyboardStore'
  import type { MathfieldElement } from 'mathlive'
  import { canOptions } from '../../../../lib/stores/canStore'

  export let question: string
  export let consigne: string
  export let correction: string
  export let consigneCorrection: string
  export let mode: 'display' | 'correction' = 'display'
  export let visible: boolean
  export let index: number
  export let nextQuestion: () => void

  let questionContainer: HTMLDivElement
  onMount(() => {
    const questionContent = document.getElementById(
      `question-content-${index}`
    ) as HTMLDivElement
    if (questionContent) {
      mathaleaRenderDiv(questionContent)
    }
    loadMathLive()
  })

  afterUpdate(() => {
    if (visible) {
      const questionContent = document.getElementById(
        `question-content-${index}`
      ) as HTMLDivElement
      setSizeWithinSvgContainer(questionContent)
    }
  })

  $: {
    if (visible) {
      if (questionContainer) {
        const mf = questionContainer?.querySelector('math-field') as MathfieldElement
        if (mf) {
          // ToDo : gérer les QCM
          mf.addEventListener('input', (e) => {
            if (e instanceof InputEvent && e.data === 'insertLineBreak') {
              nextQuestion()
            }
            if (mf.value !== '') {
              $canOptions.questionGetAnswer[index] = true
            } else {
              $canOptions.questionGetAnswer[index] = false
            }
          })
          $keyboardState.idMathField = mf.id
          window.setTimeout(() => {
            mf.focus()
            // @ToFix Je remets le clavier visible pour les fillInTheBlanks mais en fait je ne sais pas ce qui les rend invisibles
            $keyboardState.isVisible = true
          }, 0)
        } else {
          // on n'a pas trouvé de math-field, c'est pas du mathlive !
          const qcm = questionContainer?.querySelectorAll('input')
          if (qcm == null || qcm.length < 2) {
            window.notify('Question.svelte vérifie un qcm qui n\'a pas 2 inputs minimum ou alors, il n\'y a pas d\'input', { qcm: JSON.stringify(qcm) })
            $canOptions.questionGetAnswer[index] = false
          } else {
            for (const box of qcm) {
              box.addEventListener('click', el => {
                if (el.currentTarget?.checked) {
                  $canOptions.questionGetAnswer[index] = true
                }
              })
            }
          }
        }
      }
    }
  }
</script>

<div
  id="question-content-{index}"
  class={visible
    ? 'px-4 md:px-20 lg:px-32 flex flex-col justify-center items-center font-normal leading-relaxed h-[100%]  w-[100%] text-center'
    : 'hidden'}
  bind:this={questionContainer}
>
  {#if mode === 'display' || mode === 'correction'}
    <div style='padding:15px;' class='flex overflow-x-auto overflow-y-auto'>
    <div class="text-pretty">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html consigne}
    </div>
    <div class="text-pretty" style=''>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html question}
    </div>
    </div>
  {/if}

  {#if mode === 'correction'}
    <div class="relative flex p-4 mt-10 bg-coopmaths-warn-200 dark:bg-coopmathsdark-warn-lightest text-coopmaths-corpus dark:text-coopmathsdark-corpus">
      <div class="text-pretty">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html consigneCorrection}
      </div>
      <div class="text-pretty">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html correction}
      </div>
      <div
        class="flex absolute top-8 -left-12 font-bold text-xl text-coopmaths-warn-1000 dark:text-coopmathsdark-warn-dark -rotate-90"
      >
        Solution
      </div>
    </div>
  {/if}
</div>
