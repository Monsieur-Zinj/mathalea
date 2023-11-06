<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  function notifyChange () {
    dispatch('curseurNotif')
  }
  export let titre: string
  export let montant: number
  export let nom: string
  export let identifiant: string
  export let max: number
  export let pas: number
</script>

<!--
  @component
  Curseur

  __Paramètres__ :

  * `titre` :  titre du curseur
  * `montant`: nombre associé au curseur
  * `nom`: nom de l'élément `input`
  * `identifiant` : nom de l'ID de l'élément `input`
  * `max` : valeur maximale pour le curseur
  * `pas` : valeur de l'incrément lors du déplacement du curseur

  __Exemple__:

    ```tsx
    <Curseur
      on:curseurNotif={() => submitOnSliderChange("formText1")}
      titre={entree.parametre}
      montant={0}
      identifiant={["paramText1-", i + 1, "-curseur"].join("")}
      nom={["paramText1-idNum-", entree.valeur].join("")}
      max={nbQuestions}
    />
    ```
-->

<div class="flex flex-row justify-start items-center space-x-2">
  <input
    class="w-1/4 h-2 bg-transparent text-coopmaths-action dark:text-coopmathsdark-action cursor-pointer"
    type="range"
    step={pas}
    {max}
    min="0"
    name={nom}
    id={identifiant}
    bind:value={montant}
    on:change={notifyChange}
  />
  <label class="w-3/4 text-sm" for={nom}>{titre} ({montant})</label>
</div>
