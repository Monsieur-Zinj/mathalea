<script lang="ts">
  import ChipsList from './ChipsList.svelte'

  export let setupButtonsList = [
    { bxName: 'bx-zoom-in' },
    { bxName: 'bx-zoom-out' },
    { bxName: 'bx-refresh' },
    { bxName: 'bx-trash' },
    { bxName: 'bx-fullScreen' }
  ]
  export let exportButtonsList = [
    { bxName: 'bx-slideshow' },
    { bxName: 'bxs-graduation' }
  ]
  export let chipsListDisplayed: boolean = false
</script>

<!--
  @component
  Container pour positionner les boutons de réglages généraux de la liste des exercices

  ### Paramètres

  * `setupButtonsList` : liste d'icônes à afficher
  * `exportButtonsList` : idem
  * `barWidthPercentage` : pourcentage pour le calcul de la longueur de la barre...

  ### Remarque

  Les paramètres `setupButtonsList` et `exportButtonsList` ne sont utiles que pour calibrer la barre des boutons.
  Dans les faits, la déclaration des boutons se fait dans

  ```tsx
  <div slot="setup-buttons" ...>
    boutons ici
  </div>
  ```
  et dans

  ```tsx
  <div slot="export-buttons" ...>
    boutons ici
  </div>
  ```
 -->

<div
  class={`${
    $$props.class || ''
  } flex flex-col w-full md:flex-row justify-start items-start sm:justify-center sm:items-center`}
>
  <div
    class="w-full flex flex-col xl:flex-row pr-4 xl:!pl-96 py-2 justify-between items-center bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  >

    <div id="setupButtonsBar" class="flex">
      <slot name="setup-buttons">
        {#each setupButtonsList as button}
          <i
            class="bx bx-sm px-2 {button.bxName} hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
          />
        {/each}
      </slot>
    </div>
    {#if $$slots.input}
      <div id="input">
        <slot name="input" />
      </div>
    {/if}
    {#if $$slots['export-buttons']}
      <div id="exportButtonsBar" class="xl:pr-6">
        <slot name="export-buttons">
          {#each exportButtonsList as button}
            <i
              class="bx bx-sm px-2 {button.bxName} hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
            />
          {/each}
        </slot>
      </div>
    {/if}
    <!-- Barre des chips -->
    <div
    id="exoChipsList"
      class="{chipsListDisplayed
        ? 'flex flex-row justify-start items-center w-full p-4 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'
        : 'hidden'} "
    >
      <ChipsList />
    </div>
  </div>
</div>
