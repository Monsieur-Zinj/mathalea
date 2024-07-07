<script lang="ts">
  import { getUniqueStringBasedOnTimeStamp } from '../../../lib/components/time'
  export let text: string = ''
  export let title: string = ''
  export let isDisabled: boolean = false
  export let icon: string = ''
  export let idLabel: string = getUniqueStringBasedOnTimeStamp('btn-')
  export let inverted: boolean = false
  export let floatUnderText: string = ''
</script>

<!--
  @component
  Bouton

  ### Paramètres

  * `text` :  texte qui s'affiche au milieu du bouton (si vide, une icône de Boxicons est affiché à la place, à reseingner dans `icon`)
  * `isDisabled`: booléen servant à désactiver le bouton
  * `icon` : nom de l'icône de [Boxicons](https://boxicons.com/?query=)
  * `idLabel` : id pour le bouton (si non renseigné, une ID est construite sur la base d'un time stamp)

  ### Remarques
  Les éléments de style sont à ajouter normalement au composant par un `class`. Ces éléments viendront s'ajouter
  à ceux déjà présents concernant la couleur du texte. ILs doivent être au format [Tailwind](https://tailwindcss.com/docs/installation).

  ### Exemple

    ```tsx
  <Button
      text="Valider"
      class="p-1 font-bold rounded-lg text-xs ml-2"
      on:click={maFonction}
      isDisabled={maVariable === 0}
  />
  ```
 -->

{#if text.length === 0}
  <button
    type="button"
    id={idLabel}
    {title}
    class="{$$props.class || ''} text-coopmaths-action dark:text-coopmathsdark-action
      {isDisabled ? 'text-opacity-10 dark:text-opacity-10' : 'hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest'}"
    disabled={isDisabled}
    on:click
  >
    <slot></slot>
    <i class="relative bx {icon}">
      {#if floatUnderText !== ''}
        <div class="absolute left-1/2 -translate-x-1/2 -translate-y-2 text-sm font-extrabold font-sans">
          {floatUnderText}
        </div>
      {/if}
    </i>
  </button>
{:else}
  <button
    type="button"
    id={idLabel}
    {title}
    class="{$$props.class || ''}
      {isDisabled ? 'dark:bg-coopmathsdark-action bg-opacity-10 dark:bg-opacity-10' : ''}
      {inverted
        ? 'text-coopmaths-action dark:text-coopmathsdark-action bg-coopmaths-canvas dark:bg-coopmathsdark-canvas hover:bg-coopmaths-action dark:hover:bg-coopmathsdark-action hover:text-coopmaths-canvas dark:hover:text-coopmathsdark-canvas border border-coopmaths-action'
        : 'text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-action dark:bg-coopmathsdark-action hover:bg-coopmaths-action-lightest dark:hover:bg-coopmathsdark-action-lightest'}"
    disabled={isDisabled}
    on:click
  >
    <slot></slot>
    {#if icon !== ''}
      <i class="bx {icon}" />
    {/if}
    {text}
  </button>
{/if}
