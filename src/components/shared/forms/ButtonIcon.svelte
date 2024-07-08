<script lang="ts">
  import { getUniqueStringBasedOnTimeStamp } from '../../../lib/components/time'
  export let icon: string
  export let title: string = ''
  export let disabled: boolean = false
  export let id: string = getUniqueStringBasedOnTimeStamp('btn-')
  export let floatUnderText: string = ''
  export let buttonSecondIcon: string = ''
</script>

<button
  type="button"
  {id}
  {title}
  class="{$$props.class || ''} text-coopmaths-action dark:text-coopmathsdark-action
    {disabled ? 'text-opacity-10 dark:text-opacity-10' : 'hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest'}"
  {disabled}
  on:click
>
  <i class="relative bx {icon}">
    {#if floatUnderText !== ''}
      <div class="absolute left-1/2 -translate-x-1/2 -translate-y-2 text-sm font-extrabold font-sans">
        {floatUnderText}
      </div>
    {/if}
    {#if buttonSecondIcon !== ''}
      <i class="absolute -bottom-1 bx {buttonSecondIcon} text-sm -translate-x-3
        text-coopmaths-warn dark:text-coopmathsdark-warn"
      />
    {/if}
  </i>
</button>
