<script lang="ts">
  export let text: string
  export let title: string = ''
  export let disabled: boolean = false
  export let icon: string = ''
</script>

<button
  type="button"
  {title}
  id = "{$$props.id}"
  class="{$$props.class || 'rounded-lg py-1 px-2'}"
  {disabled}
  on:click
>
  {#if icon !== ''}
    <i class="bx {icon}" />
  {/if}
  {text}
</button>
