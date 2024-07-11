<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  export let id: string
  export let min: number = 1
  export let max: number = 100
  export let value: number
  export let isDisabled: boolean = false

  const dispatch = createEventDispatcher()
</script>

<span class="flex justify-center">
  <input
    type="number"
    id={id}
    min={min}
    max={max}
    step={$$props.step || 1}
    bind:value={value}
    on:change={() => dispatch('change', value)}
    class="{$$props.class} ml-3 w-16 h-8
      bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
      border-1
      border-coopmaths-action dark:border-coopmathsdark-action
      focus:border-1 focus:outline-0 focus:ring-0
      focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest
      disabled:opacity-30"
    disabled={isDisabled}
  />
</span>
