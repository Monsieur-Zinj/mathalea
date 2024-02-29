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

  // document.addEventListener('KeyboardUpdated', function() {
  //   // on recalcul quand le clavier est affiché et pas avant   
  //   if (visible) {
  //     console.log('message reçu: ' + 'KeyboardUpdated' + ', le clavier a changé de forme')
  //     const questionContent = document.getElementById(`question-content-${index}`) as HTMLDivElement
  //     if (questionContent) setSizeWithinSvgContainer(questionContent)
  //   }
  // })

  keyboardState.subscribe((value) => {
    if (visible) {
      console.log('message reçu: ' + 'KeyboardUpdated' + ', le clavier a changé de forme')
      const questionContent = document.getElementById(`question-content-${index}`) as HTMLDivElement
      if (questionContent) setSizeWithinSvgContainer(questionContent)
      console.log('message reçu fin : ' + 'KeyboardUpdated' + ', le clavier a changé de forme')
    }
    return value
  })

  afterUpdate(() => {
    // const questionsContainer = document.getElementById('questions-container') as HTMLDivElement
    // if (questionsContainer) {
    //  setSizeWithinSvgContainer(questionsContainer)
    // }
    const questionContent = document.getElementById(
      `question-content-${index}`
    ) as HTMLDivElement
    setSizeWithinSvgContainer(questionContent)
  })

  $: {
    if (visible) {
      const mf = questionContainer?.querySelector('math-field') as MathfieldElement
      if (mf) {
        // ToDo : gérer les QCM
        mf.addEventListener('input', (e) => {
          if (e instanceof InputEvent && e.data === 'insertLineBreak') {
            nextQuestion()
          }
          if (mf.value !== '') {
            // console.log('input', index)
            $canOptions.questionGetAnswer[index] = true
          } else {
            // console.log('input empty', index)
            $canOptions.questionGetAnswer[index] = false
          }
        })
        $keyboardState.idMathField = mf.id
        window.setTimeout(() => {
          mf.focus()
        }, 0)
      }
    }
  }
</script>

<div
  id="question-content-{index}"
  class={visible
    ? 'px-4 md:px-20 lg:px-32 flex flex-col justify-center items-center font-normal leading-relaxed overflow-y-auto h-[100%]  w-[100%] text-justify'
    : 'hidden'}
  bind:this={questionContainer}
>
  {#if mode === 'display' || mode === 'correction'}
    <div class=''>
    <div class="text-pretty">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html consigne}
    </div>
    <div class="text-pretty">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html question}
    </div>
    </div>
  {/if}

  {#if mode === 'correction'}
    <div class="relative flex p-4 mt-10 bg-coopmaths-warn-200 dark:bg-coopmathsdark-warn-lightest">
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
