<script lang="ts">
  export let text: string
  export let title: string = ''
  export let disabled: boolean = false
  export let icon: string = ''
  export let inverted: boolean = false
</script>

<button
  type="button"
  {title}
  class="{$$props.class || 'rounded-lg py-1 px-2'}
    {disabled ? 'dark:bg-coopmathsdark-action bg-opacity-10 dark:bg-opacity-10' : ''}
    {inverted
      ? `border border-coopmaths-action
        text-coopmaths-action dark:text-coopmathsdark-action
        bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
        hover:bg-coopmaths-action dark:hover:bg-coopmathsdark-action
        hover:text-coopmaths-canvas dark:hover:text-coopmathsdark-canvas`
      : `text-coopmaths-canvas dark:text-coopmathsdark-canvas
        bg-coopmaths-action dark:bg-coopmathsdark-action
        hover:bg-coopmaths-action-lightest dark:hover:bg-coopmathsdark-action-lightest`}"
  {disabled}
  on:click
>
  {#if icon !== ''}
    <i class="bx {icon}" />
  {/if}
  {text}
</button>
