<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { getUniqueStringBasedOnTimeStamp } from '../../../lib/components/time'

  export let title: string
  export let explanations = ["Text when it's on", "Text when it's off"]
  export let value: boolean = true
  export let isDisabled: boolean = false
  export let id = ['toggle-', getUniqueStringBasedOnTimeStamp()].join('')
  const dispatch = createEventDispatcher()

  function toggle () {
    value = !value
    dispatch('toggle')
  }
</script>

<div {id} class="flex flex-col justify-start items-start">
  <div class="flex flex-row items-center space-x-1">
    <input
      class="mr-2 mt-[0.3rem] h-3 w-8 appearance-none rounded-[0.4375rem] bg-coopmaths-canvas border-coopmaths-action before:pointer-events-none before:absolute before:h-3 before:w-3 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-4 after:w-4 after:rounded-full after:border after:border-coopmaths-action after:bg-coopmaths-canvas-darkest after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-coopmaths-action checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-4 checked:after:w-4 checked:after:rounded-full checked:after:border-none checked:after:bg-coopmaths-action checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-coopmaths-action checked:focus:bg-coopmaths-action checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
      type="checkbox"
      role="switch"
      id="input-{id}"
      disabled={isDisabled}
      on:change={toggle}
      checked={value}
    />
    <label
      class="inline-block pl-[0.15rem] hover:cursor-pointer text-coopmaths-corpus text-opacity-70 text-sm {value
        ? 'font-semibold'
        : 'font-light'}"
      for="input-{id}"
    >
      {title}
    </label>
  </div>
  <div class="flex flex-row p-2 font-light text-xs text-coopmaths-corpus text-opacity-70">
    {#if value}
      {explanations[0]}
    {:else}
      {explanations[1]}
    {/if}
  </div>
</div>
