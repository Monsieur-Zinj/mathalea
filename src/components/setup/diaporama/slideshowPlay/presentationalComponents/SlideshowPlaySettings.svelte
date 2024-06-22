<script lang="ts">
  import { setPhraseDuree } from '../../../../../lib/components/time'
  import FullscreenButton from '../../../start/presentationalComponents/header/headerButtons/setupButtons/FullscreenButton.svelte'

  export let displayCurrentCorrectionMode: () => string
  export let flow: number | undefined
  export let isManualModeActive: boolean | undefined
  export let handleTimerChange: (cursorTimeValue: number) => void
  export let handleQuit: (event: Event) => void
  export let isPause: boolean
  export let nextQuestion: () => void
  export let pause: () => void
  export let prevQuestion: () => void
  export let switchCorrectionMode: () => void
  export let switchPause: () => void
  export let zoomMoins: () => void
  export let zoomPlus: () => void
  export let currentDuration: number

  let displayCurrentDuration: () => string
  let cursorTimeValue = 10
  let messageDuree: string

$: displayCurrentDuration = () => {
  return isManualModeActive ? 'Manuel' : currentDuration + 's'
}

$: messageDuree = setPhraseDuree(cursorTimeValue)

</script>

<footer
class="w-full h-[10%] py-1 sticky bottom-0 opacity-100 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
>
<div class="flex flex-row justify-between w-full">
  <!-- boutons réglagles zoom -->
  <div class="flex flex-row justify-start ml-10 w-[33%] items-center">
  <FullscreenButton/>
    <button type="button" on:click={zoomPlus}>
      <i
        class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-plus"
      />
    </button>
    <button type="button" on:click={zoomMoins}>
      <i
        class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-minus"
      />
    </button>
  </div>
  <!-- boutons contrôle défilement -->
  <div class="flex flex-row justify-center w-[33%] items-center">
    <button type="button" on:click={prevQuestion}>
      <i
        class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-skip-previous"
      />
    </button>
    <button
      type="button"
      on:click={() => {
        if (flow !== undefined && flow > 0) {
          nextQuestion()
        } else {
          switchPause()
        }
      }}
      class:invisible={isManualModeActive}
    >
      <i
        class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg
        {isPause ? 'bx-play' : 'bx-pause'}"
      />
    </button>
    <button type="button" on:click={nextQuestion}>
      <i
        class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-skip-next"
      />
    </button>
  </div>
  <!-- boutons timers correction quitter -->
  <div class="flex flex-row justify-end mr-10 w-[33%] items-center">
    <label for="timerSettings" class="modal-button">
      <i
        class="relative text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-stopwatch"
        on:click={pause}
        on:keydown={pause}
        role="button"
        tabindex="0"
      >
        <div
          class="absolute -bottom-[10px] left-1/2 -translate-x-1/2 text-sm font-sans text-coopmaths-struct dark:text-coopmathsdark-struct"
        >
          {displayCurrentDuration()}
        </div>
      </i>
    </label>
    <input
      type="checkbox"
      id="timerSettings"
      class="modal-toggle bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    />
    <div class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3
          class="font-bold text-lg text-coopmaths-struct dark:text-coopmathsdark-struct"
        >
          Temps par question
        </h3>
        <p
          class="py-4 text-coopmaths-corpus dark:text-coopmathsdark-corpus"
        >
          Régler la durée de projection en secondes
        </p>
        <div class="flew-row space-x-2">
          <div
            class="flex flex-row justify-start items-center space-x-2"
          >
            <input
              class="w-1/4 h-2 bg-transparent text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer"
              type="range"
              max="30"
              min="0"
              name="duration"
              id="duration"
              bind:value={cursorTimeValue}
              on:change={() => handleTimerChange(cursorTimeValue)}
            />
            <label
              class="w-3/4 text-sm text-coopmaths-corpus"
              for="duration">{messageDuree}</label
            >
          </div>
        </div>
        <div class="modal-action">
          <label
            for="timerSettings"
            class="btn btn-neutral"
            on:click={switchPause}
            on:keydown={switchPause}
          >
            Fermer
          </label>
        </div>
      </div>
    </div>
    <div
      class={(flow !== undefined && flow > 0)
        ? 'hidden'
        : 'block'}
    >
      <button type="button" on:click={switchCorrectionMode}>
        <i
          class="relative text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-show"
        >
          <div
            class="absolute -bottom-[8px] left-1/2 -translate-x-1/2 text-sm font-extrabold font-sans"
          >
            {displayCurrentCorrectionMode()}
          </div>
        </i>
      </button>
    </div>
    <button type="button" on:click={handleQuit} on:keydown={handleQuit}>
      <i
        class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-power-off"
      />
    </button>
  </div>
</div>
</footer>
