<script lang="ts">
  import { alphanumericLayouts, isSpecialKey } from '../../layouts/alphanumericRows'
  import { keys } from '../../lib/keycaps'
  import type { AlphanumericPages, Keys } from '../../types/keyboardContent'
  import type { KeyCap } from '../../types/keycap'
  // import type { KeyCap } from '../../types/keycap'
  export let pageType: AlphanumericPages
  $: rows = alphanumericLayouts[pageType]
  export let clickKeycap: (data: KeyCap, event: MouseEvent, value?: Keys) => void
</script>

<div class="flex justify-center">
  <div class="flex flex-col w-2/3 space-y-4 bg-coopmaths-struct">
    {#each rows as row}
      <div
        class="flex flex-row w-full bg-coopmaths-struct justify-evenly space-x-4"
      >
        {#each row as key}
          <button
            type="button"
            class="key--{key} flex justify-center items-center grow h-10 text-xl text-coopmaths-corpus font-mono {isSpecialKey(key) ? 'bg-coopmaths-canvas-darkest' : 'bg-coopmaths-canvas'} rounded-md"
            on:click={(e) => {
              clickKeycap(keys[key], e, key)
            }}
          >
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html keys[key].display}
          </button>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  button.key--SPACE {
    flex: var(--special-flex, 3);
  }
</style>
