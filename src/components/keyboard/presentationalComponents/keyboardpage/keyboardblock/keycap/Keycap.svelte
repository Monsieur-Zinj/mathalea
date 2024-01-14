<script lang="ts">
  import type { KeyCap } from '../../../../types/keycap'
  import { KEYCAP_WIDTH, SM_BREAKPOINT } from '../../../../lib/sizes'
  import type { Keys } from '../../../../types/keyboardContent'
  export let innerWidth: number
  export let keyName: Keys
  export let key: KeyCap
  export let isSpecial: boolean = false
  export let clickKeycap: (data: KeyCap, event: MouseEvent) => void
  let button: HTMLButtonElement
  $: keycapwidth =
    innerWidth <= SM_BREAKPOINT ? KEYCAP_WIDTH.sm : KEYCAP_WIDTH.md
</script>

<button
  bind:this={button}
  class="key--{keyName} customwidth h-full flex justify-center items-center text-xs md:text-xl border-b-2 border-r border-r-slate-400 dark:border-r-gray-500 border-b-slate-300 dark:border-b-gray-600 active:border-b-0 active:border-r-0 text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light active:text-coopmaths-canvas active:translate-y-[1.5px] dark:active:text-coopmathsdark-canvas active:bg-coopmaths-action active:shadow-none dark:active:bg-coopmathsdark-action dark:active:shadow-none transition-transform ease-in-out shadow-[2px_2px_4px_rgba(180,180,180,0.5)] {isSpecial
    ? 'bg-coopmaths-struct-lightest dark:bg-coopmathsdark-struct-lightest'
    : 'bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas'}  py-1.5 px-2 md:py-2 md:px-4 text-center rounded-md font-mono"
  style="--keycapwidth:{keycapwidth}"
  on:click={(e) => {
    clickKeycap(key, e)
  }}
>
  <div id="key-{key.display}" class="relative">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <span>{@html key.display}</span>
  </div>
</button>

<style>
  .customwidth {
    width: calc(var(--keycapwidth) * 1px);
  }
  button.key--FCT,
  button.key--LIM,
  button.key--SIGMA,
  button.key--COS,
  button.key--SIN,
  button.key--TAN {
    font-size: 1rem /* 16px */;
    line-height: 1.5rem /* 24px */;
  }
  button.key--PROB {
    font-size: 0.75rem /* 12px */;
    line-height: 1rem /* 16px */;
  }
</style>
