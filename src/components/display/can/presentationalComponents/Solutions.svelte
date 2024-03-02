<script lang="ts">
  import Question from './Question.svelte'
  import Pagination from './Pagination.svelte'
  import NavigationButtons from './NavigationButtons.svelte'
  import { canOptions } from '../../../../lib/stores/canStore'
  import { afterUpdate, onMount } from 'svelte'
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import ButtonToggle from '../../../shared/forms/ButtonToggle.svelte'

  let current: number = 0
  export let questions: string[]
  export let consignes: string[]
  export let corrections: string[]
  export let consignesCorrections: string[]
  export let answers: string[]
  export let resultsByQuestion: boolean[]
  export let time: string
  export let score: string
  const numberOfQuestions: number = questions.length

  let displayCorrection = true

  onMount(() => {
    const questionContent = document.getElementById(
      'can-solutions'
    ) as HTMLDivElement
    if (questionContent) {
      mathaleaRenderDiv(questionContent)
    }
  })

  afterUpdate(() => {
    const answersContents = document.querySelectorAll(
      '[id^="answer-container"]'
    )
    for (let i = 0; i < answersContents.length; i++) {
      const content = answersContents[i] as HTMLDivElement
      mathaleaRenderDiv(content)
    }
  })

  function removeMF (text: string) {
    const regex = /<math-field[^>]*>[^]*?<\/math-field>/g
    return text.replace(regex, ' ... ')
  }
</script>

<div
  class="w-full h-full flex flex-col items-center bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
   {$canOptions.solutionsMode === 'split'
     ? 'justify-between'
     : 'justify-start'}"
>
  {#if $canOptions.solutionsMode === 'split'}
    <div class="w-full flex flex-col">
      <Pagination bind:current {numberOfQuestions} {resultsByQuestion} state={'solutions'} />
    </div>
    <div
      class="flex flex-col justify-center items-center font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus text-3xl md:text-5xl"
    >
      {#key current}
        <Question
          consigne={consignes[current]}
          question={questions[current]}
          consigneCorrection={consignesCorrections[current]}
          correction={corrections[current]}
          mode={'correction'}
          visible={true}
          index={current}
          nextQuestion={() => {}}
        />
        {#if $canOptions.isInteractive}
          <div
            id="answer-container-{current}"
            class="text-2xl text-coopmaths-corpus dark:text-coopmathsdark-corpus font-light py-2 md:py-4"
          >
            Réponse donnée&nbsp;:&nbsp;
            <span
              id="answer-{current}"
              class="text-coopmaths-warn-800 dark:text-coopmathsdark-warn font-bold"
              >{answers[current] === undefined
                ? 'aucune'
                : '$' + answers[current] + '$'}
            </span>
          </div>
        {/if}
      {/key}
    </div>
    <NavigationButtons
      bind:current
      {numberOfQuestions}
      state={'solutions'}
      {resultsByQuestion}
      handleEndOfRace={() => {}}
    />
  {/if}
  {#if $canOptions.solutionsMode === 'gathered'}
    <div
      class="w-full flex justify-center items-center p-6  bg-coopmaths-struct text-coopmaths-canvas dark:bg-coopmathsdark-struct dark:text-coopmathsdark-canvas text-5xl md:text-7xl font-black"
    >
      Corrections
    </div>
    <div class="w-full grid grid-rows-3 md:grid-cols-3 py-4 px-4 md:px-10 mb-10">
      {#if $canOptions.isInteractive}
        <div
          id="score"
          class="text-normal text-coopmaths-corpus dark:text-coopmathsdark-corpus font-light"
        >
          Score : <span
            class="text-coopmaths-warn-1000 dark:text-coopmathsdark-warn font-bold"
            >{score}</span
          >
        </div>
      {/if}
      <div
        id="score"
        class="text-normal text-coopmaths-corpus dark:text-coopmathsdark-corpus font-light"
      >
        Temps : <span
          class="text-coopmaths-warn-1000 dark:text-coopmathsdark-warn font-bold"
          >{time}</span
        >
      </div>
      <ButtonToggle
        bind:value={displayCorrection}
        titles={[
          'Correction uniquement des mauvaises réponses',
          'Correction de toutes les questions'
        ]}
      />
    </div>
    <ol
      class="w-full list-none list-inside text-base columns-1 md:columns-3 p-4 md:p-10 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      id="can-solutions"
    >
      {#each [...Array(numberOfQuestions).keys()] as i}
        <li class="break-inside-avoid-column">
          <div class="flex flex-row items-center justify-start">
            <div
              class="text-lg text-coopmaths-struct dark:text-coopmathsdark-struct font-bold"
            >
              Question {i + 1}
            </div>
            <div class={$canOptions.isInteractive ? 'flex text-xl' : 'hidden'}>
              <i
                class="pl-2 bx {resultsByQuestion[i]
                  ? 'bxs-check-square text-coopmaths-warn-800 dark:text-green-500'
                  : 'bxs-x-square text-red-500 dark:text-coopmathsdark-warn'}"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <div
              class="p-2 text-pretty text-coopmaths-corpus dark:text-coopmathsdark-corpus"
              hidden={resultsByQuestion[i] && displayCorrection}
            >
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html removeMF(questions[i])}
            </div>
            <div
              class="p-2 text-pretty bg-coopmaths-warn-200 dark:bg-coopmathsdark-warn-lightest text-coopmaths-corpus dark:text-coopmathsdark-corpus-darkest"
              hidden={resultsByQuestion[i] && displayCorrection}
            >
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html consignesCorrections[i]}
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html corrections[i]}
            </div>
            <div
              id="answer-container-{i}"
              class="{$canOptions.isInteractive &&
              (!resultsByQuestion[i] || !displayCorrection)
                ? 'flex text-coopmaths-corpus dark:text-coopmathsdark-corpus font-light py-2 md:py-4'
                : 'hidden'} "
            >
              Réponse donnée&nbsp;:&nbsp;
              <span
                id="answer-{i}"
                class="text-coopmaths-warn-1000 dark:text-coopmathsdark-warn font-bold"
              >
                {answers[i] === undefined ? 'aucune' : '$' + answers[i] + '$'}
              </span>
            </div>
          </div>
        </li>
      {/each}
    </ol>
  {/if}
</div>
