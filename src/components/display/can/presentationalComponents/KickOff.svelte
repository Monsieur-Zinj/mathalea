<script lang="ts">
  import type { CanState } from '../../../../lib/types/can'
  import ButtonTextAction from '../../../shared/forms/ButtonTextAction.svelte'
  export let state: CanState
  export let title = 'Course aux Nombres'
  export let subTitle = '2023'
</script>

<div
  class="h-full w-full flex flex-col items-center justify-center bg-coopmaths-struct dark:bg-coopmathsdark-canvas text-coopmaths-canvas dark:text-coopmathsdark-corpus"
>
  <div class="font-black text-center uppercase text-6xl md:text-[130px]">{title}</div>
  <div class="pt-2 md:pt-6 font-extralight text-5xl md:text-[100px]">{subTitle}</div>
  <div class="pt-10">
    <ButtonTextAction
      class="py-3 px-6 text-3xl rounded-xl flex flex-row-reverse items-center space-x-6 font-bold animate-pulse"
      text="Démarrer"
      icon="bx-play bx-lg pl-1"
      on:click={() => {
        state = 'countdown'
      }}
    />
  </div>
  <slot />
</div>
