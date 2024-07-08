<script lang="ts">
  import ButtonIcon from './ButtonIcon.svelte'
  export let tooltip: string
  export let icon: string
  export let classForButton: string
  export let buttonSecondIcon: string = ''

</script>

<!-- À la différence de ButtonIcon qui est vraiment un bouton, ButtonIconTooltip est un div qui contient un bouton -->

<div class="tooltip tooltip-bottom tooltip-neutral" data-tip={tooltip}>
  <ButtonIcon
    {icon}
    class="{classForButton}"
    {buttonSecondIcon}
    on:click
  />
</div>
