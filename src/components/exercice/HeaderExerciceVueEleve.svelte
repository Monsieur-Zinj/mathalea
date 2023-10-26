<script lang="ts">
  import { globalOptions, isMenuNeededForExercises } from '../stores/generalStore'
  export let title: string
  export let indiceExercice: number
  export let showNumber = true
</script>

<!--
  @component
  Barre de titre et d'actions au-dessus d'un exercice

  __Utilisation__ :

  ```tsx
  const headerExerciceProps = {
    title: exercice.titre,
    indiceExercice: 2
  }
  <HeaderExerciceVueEleve {...headerExerciceProps}/>
  ```
 -->

<div class="z-0 flex-1">
  <h1
    id="headerExoVueEleve-{indiceExercice}"
    class=" text-coopmaths-struct dark:text-coopmathsdark-struct pb-2 flex {$isMenuNeededForExercises
      ? 'flex-col items-start'
      : 'flex-row items-center'}"
  >
    <!-- titre -->
    <div
      class="flex flex-row justify-start items-start"
      id="exerciceHeader{indiceExercice}"
    >
      <div
        class={showNumber && $globalOptions.presMode === 'liste_exos'
          ? 'flex'
          : 'hidden'}
      >
        <div
          class="{$isMenuNeededForExercises &&
          $globalOptions.presMode !== 'liste_exos'
            ? 'hidden'
            : 'inline-flex'} items-center justify-center h-6 w-6 bg-coopmaths-struct text-coopmaths-canvas font-light text-lg lg:text-normal translate-y-1"
        >
          {indiceExercice + 1}
        </div>
      </div>
      <div
        class="font-light {$isMenuNeededForExercises &&
        $globalOptions.presMode !== 'liste_exos'
          ? 'text-xl'
          : 'text-lg'} ml-2"
      >
        {title}
      </div>
    </div>
  </h1>
</div>
