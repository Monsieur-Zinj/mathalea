<script lang="ts">
  import ButtonIcon from './ButtonIcon.svelte'
  export let icon: string
  export let tooltip: string
  export let tooltipPosition: 'auto' | 'top' | 'bottom' | 'left' | 'right' = 'bottom'
  export let title: string = ''
  export let disabled: boolean = false
  export let floatUnderText: string = ''
  export let cornerIcon: string = ''
  export let cornerIconClass: string = ''

</script>

<!-- À la différence de ButtonIcon qui est vraiment un bouton, ButtonIconTooltip est un div qui contient un bouton -->

<div class="tooltip tooltip-{tooltipPosition} tooltip-neutral" data-tip={tooltip}>
  <ButtonIcon
    class="{$$props.class || ''}"
    {icon}
    {title}
    {disabled}
    {floatUnderText}
    {cornerIcon}
    {cornerIconClass}
    on:click
  />
</div>
