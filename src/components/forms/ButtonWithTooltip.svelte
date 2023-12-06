<script lang="ts">
  import { onMount } from 'svelte'
  import { getUniqueStringBasedOnTimeStamp } from '../utils/time'
  import { Tooltip, initTE } from 'tw-elements'
  export let title: string = 'Valider'
  export let isDisabled: boolean = false
  export let icon: string = ''
  export let idLabel: string = getUniqueStringBasedOnTimeStamp('btn-')
  export let inverted: boolean = false
  export let tooltipTitle: string = 'Mon tooltip'
  export let tooltipPlacement: 'auto' | 'top' | 'bottom' | 'left' | 'right' =
    'top'

  onMount(() => {
    initTE({ Tooltip })
  })
</script>

<!--
  @component
  Bouton

  ### Paramètres

  * `title` :  titre du bouton (si vide, une icône de Boxicons est affiché à la place, à reseingner dans `icon`)
  * `isDisabled`: booléen servant à désactiver le bouton
  * `icon` : nom de l'icône de [Boxicons](https://boxicons.com/?query=)
  * `idLabel` : id pour le bouton (si non renseigné, une ID est construite sur la base d'un time stamp)

  ### Remarques
  Les éléments de style sont à ajouter normalement au composant par un `class`. Ces éléments viendront s'ajouter
  à ceux déjà présents concernant la couleur du texte. ILs doivent être au format [Tailwind](https://tailwindcss.com/docs/installation).

  ### Exemple

    ```tsx
  <Button
      title="Titre"
      class="p-1 font-bold rounded-lg text-xs ml-2"
      on:click={maFonction}
      isDisabled={maVariable === 0}
  />
  ```
 -->

<span
  class="inline-block"
  data-te-toggle="tooltip"
  data-te-placement={tooltipPlacement}
  title={tooltipTitle}
>
  {#if title.length === 0}
    <button
      type="button"
      id={idLabel}
      class={`${
        $$props.class || ''
      } text-coopmaths-action dark:text-coopmathsdark-action
        ${
          isDisabled
            ? ' text-opacity-10 dark:text-opacity-10'
            : 'hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest'
        }`}
      disabled={isDisabled}
      on:click
    >
      <i class="bx {icon}" />
    </button>
  {:else}
    <button
      type="button"
      id={idLabel}
      class={`${$$props.class || ''}
    ${
      inverted
        ? 'text-coopmaths-action dark:text-coopmathsdark-action bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border border-coopmaths-action hover:bg-coopmaths-action dark:hover:bg-coopmathsdark-action hover:text-coopmaths-canvas dark:hover:text-coopmathsdark-canvas'
        : 'text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action dark:bg-coopmathsdark-action hover:bg-coopmaths-action-lightest dark:hover:bg-coopmathsdark-action-lightest'
    }
      ${
        isDisabled
          ? 'dark:bg-coopmathsdark-action bg-opacity-10 dark:bg-opacity-10'
          : ''
      }`}
      disabled={isDisabled}
      on:click
    >
      {#if icon !== ''}
        <i class="bx {icon}" />
      {/if}
      {title}
    </button>
  {/if}
</span>
