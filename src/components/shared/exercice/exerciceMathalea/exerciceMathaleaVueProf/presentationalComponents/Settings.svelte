<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte'
  import type TypeExercice from '../../../../../../exercices/Exercice'

  export let exercice: TypeExercice
  export let exerciceIndex: number
  export let isVisible: boolean = true
  let nbQuestions: number
  let duration: number
  let sup: boolean
  let sup2: boolean
  let sup3: boolean
  let sup4: boolean
  let sup5: boolean
  let alea: string
  let correctionDetaillee: boolean
  let premierUpdate: boolean = true
  let isCommentDisplayed: boolean = false

  // pour récupérer les tooltips de l'exercice
  type FormNumerique = {
    titre: string
    champs: string[] | number
  }
  let formNum1: FormNumerique
  let formNum2: FormNumerique
  let formNum3: FormNumerique
  let formNum4: FormNumerique
  let formNum5: FormNumerique

  afterUpdate(async () => {
    if (exercice.seed !== undefined) {
      alea = exercice.seed
    }
    // On ne remplit les champs que la première fois
    if (exercice && premierUpdate) {
      premierUpdate = false
      nbQuestions = exercice.nbQuestions
      duration = exercice.duration || 10
      if (exercice.sup === 'false') {
        sup = false
      } else {
        sup = exercice.sup
      }
      sup2 = exercice.sup2
      sup3 = exercice.sup3
      sup4 = exercice.sup4
      sup5 = exercice.sup5
      const seed = exercice.seed
      if (seed !== undefined) {
        alea = seed
      }
      correctionDetaillee = exercice.correctionDetaillee
    }
  })

  const dispatch = createEventDispatcher()

  function newSettings () {
    dispatch('settings', {
      nbQuestions,
      duration,
      sup,
      sup2,
      sup3,
      sup4,
      sup5,
      alea,
      correctionDetaillee
    })
  }
  /**
   * Transforme le tableau des tooltips d'un paramètre type numérique en un objet
   * constitué d'un titre (celui du paramètre) et soit d'un tableau
   * des options, soit d'un nombre correspond à la valeur maximale.
   * <i>Référence :</i> commentaire du fichier Exercice.ts sur la propriété
   * <code>besoinFormulaireNumerique</code> (<code>false</code>
   * sinon this.besoinFormulaireNumerique = [texte, max, tooltip facultatif])
   * @param {string[]} entreesFormulaire Typiquement la valeur de la propriété
   * <code>besoinFormulaireNumerique</code>
   * @author sylvain chambon
   */
  function parseFormNumerique (
    entreesFormulaire:
      | [titre: string, max: number, tooltip: string]
      | [titre: string, max: number]
  ): FormNumerique {
    const entrees:
      | [titre: string, max: number, tooltip: string]
      | [titre: string, max: number] = [...entreesFormulaire]
    if (![2, 3].includes(entrees.length)) {
      // `besoinFormulaireNumerique` est de la forme [texte, max, tooltip] ou [texte, max]
      throw new Error(
        `Dans ${exercice.uuid}, besoinFormulaireNumerique est mal déclaré`
      )
    } else {
      // la liste entrees a deux ou trois éléments
      const premier = entrees.shift()
      const titre: string = (premier as string) ?? '' // le titre du paramètre est le 1er elt
      let champs: string[] | number
      if (entrees.length > 1) {
        // il y a une liste de tooltips qui deviendront les entrées
        const dernier = entrees.pop() as string
        if (dernier) {
          champs = dernier.split('\n').map((x) => x.replace(/(?:\d* *: *)/i, ''))
        } else {
          champs = []
        }
      } else {
        // les champs se résument à un seul nombre correspondant au maximum
        const max = entrees[0]
        champs = typeof max === 'number' ? max : parseInt(max)
      }
      return { titre, champs }
    }
  }
  // fabrication des objets correspondant aux paramètres numériques.
  if (typeof exercice.besoinFormulaireNumerique !== 'boolean') {
    formNum1 = parseFormNumerique(exercice.besoinFormulaireNumerique)
  }
  if (typeof exercice.besoinFormulaire2Numerique !== 'boolean') {
    formNum2 = parseFormNumerique(exercice.besoinFormulaire2Numerique)
  }
  if (typeof exercice.besoinFormulaire3Numerique !== 'boolean') {
    formNum3 = parseFormNumerique(exercice.besoinFormulaire3Numerique)
  }
  if (typeof exercice.besoinFormulaire4Numerique !== 'boolean') {
    formNum4 = parseFormNumerique(exercice.besoinFormulaire4Numerique)
  }
  if (typeof exercice.besoinFormulaire5Numerique !== 'boolean') {
    formNum5 = parseFormNumerique(exercice.besoinFormulaire5Numerique)
  }
</script>

<div
  class="relative bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark {isVisible
    ? 'visible lg:w-1/4'
    : 'hidden lg:w-0'} flex flex-col duration-500"
>
  <div class="absolute top-2 right-3">
    <button type="button" on:click={() => {
      isVisible = !isVisible
      dispatch('clickSettings', { isVisible })
    }} >
      <i
        class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest text-xl bx bx-x"
      />
    </button>
  </div>
  <div
    class="text-lg lg:text-base ml-2 lg:ml-4 space-y-4 p-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
  >
    <h3 class="text-coopmaths-struct dark:text-coopmathsdark-struct font-bold">
      Paramètres
    </h3>
    {#if exercice.nbQuestionsModifiable}
      <div>
        <span
          class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        >
          Nombre de questions :
        </span>
        <input
          type="number"
          id="settings-nb-questions-{exercice.uuid}"
          min="1"
          max="100"
          bind:value={nbQuestions}
          on:change={newSettings}
          on:input={newSettings}
          class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
        />
      </div>
    {/if}
    {#if exercice.besoinFormulaireCaseACocher}
      <div class="container">
        <label
          class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
          for="settings-check1-{exercice.uuid}"
        >
          {#if typeof exercice.besoinFormulaireCaseACocher !== 'boolean'}
            {exercice.besoinFormulaireCaseACocher[0]} :
          {/if}
        </label>
        <input
          name="settings-check1-{exercice.uuid}"
          type="checkbox"
          id="settings-check1-{exercice.uuid}"
          class="ml-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-1 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded cursor-pointer"
          bind:checked={sup}
          on:change={newSettings}
        />
      </div>
    {/if}
    {#if formNum1}
      {#if Array.isArray(formNum1.champs)}
        <div class="flex flex-col">
          <form id="settings-form-formNum1-{exerciceIndex}" action="">
            <label
              class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
              for="settings-formNum1-{exerciceIndex}">{formNum1.titre} :</label
            >
            <select
              class="flex flex-auto w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              name="formNum1"
              id="settings-formNum1-{exerciceIndex}"
              bind:value={sup}
              on:change={newSettings}
            >
              {#each formNum1.champs as entree, i}
                <option
                  value={i + 1}
                  class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
                  >{entree}</option
                >
              {/each}
            </select>
          </form>
        </div>
      {:else}
        <div>
          <!-- Pas de tooltips -->
          <label
            class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="settings-formNum1-{exerciceIndex}"
            >{formNum1.titre} :
          </label>
          <input
            name="formNum1"
            id="settings-formNum1-{exerciceIndex}"
            type="number"
            class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
            min="1"
            max={formNum1.champs}
            bind:value={sup}
            on:change={newSettings}
          />
        </div>
      {/if}
    {/if}
    {#if exercice.besoinFormulaireTexte}
      <form
        id="settings-form-formText1-{exerciceIndex}"
        name="settings-form-formText1"
        on:submit|preventDefault={newSettings}
      >
        {#if typeof exercice.besoinFormulaireTexte !== 'boolean'}
          <label
            class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="settings-formText1-{exerciceIndex}"
          >
            {exercice.besoinFormulaireTexte[0]} :
          </label>
          <div
            class="tooltip tooltip-bottom w-full before:whitespace-pre-wrap before:content-[attr(data-tip)] before:text-left"
            data-tip={exercice.besoinFormulaireTexte[1]}
          >
            <input
              class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              name="settings-formText1"
              id="settings-formText1-{exerciceIndex}"
              type="text"
              bind:value={sup}
              on:input={newSettings}
            />
          </div>
        {/if}
      </form>
    {/if}

    <!-- sup2 -->
    {#if exercice.besoinFormulaire2CaseACocher}
      <div class="container">
        <label
          class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
          for="settings-check2-{exerciceIndex}"
        >
          {#if typeof exercice.besoinFormulaire2CaseACocher !== 'boolean'}
            {exercice.besoinFormulaire2CaseACocher[0]} :
          {/if}
        </label>
        <input
          name="settings-check2"
          id="settings-check2-{exerciceIndex}"
          type="checkbox"
          class="ml-2  bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-1 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded cursor-pointer"
          bind:checked={sup2}
          on:change={newSettings}
        />
      </div>
    {/if}
    {#if formNum2}
      {#if Array.isArray(formNum2.champs)}
        <div class="flex flex-col">
          <form id="settings-form-formNum2-{exerciceIndex}" action="">
            <label
              class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
              for="settings-formNum2-{exerciceIndex}">{formNum2.titre} :</label
            >
            <select
              class="flex flex-auto w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              name="settings-formNum2"
              id="settings-formNum2-{exerciceIndex}"
              bind:value={sup2}
              on:change={newSettings}
            >
              {#each formNum2.champs as entree, i}
                <option
                  value={i + 1}
                  class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
                  >{entree}</option
                >
              {/each}
            </select>
          </form>
        </div>
      {:else}
        <div>
          <!-- Pas de tooltips -->
          <label
            class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="settings-formNum2-{exerciceIndex}"
            >{formNum2.titre} :
          </label>
          <input
            name="settings-formNum2"
            type="number"
            id="settings-formNum2-{exerciceIndex}"
            class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
            min="1"
            max={formNum2.champs}
            bind:value={sup2}
            on:change={newSettings}
          />
        </div>
      {/if}
    {/if}
    {#if exercice.besoinFormulaire2Texte}
      <form
        id="settings-form-formText2-{exerciceIndex}"
        name="settings-form-formText2"
        on:submit|preventDefault={newSettings}
      >
        {#if typeof exercice.besoinFormulaire2Texte !== 'boolean'}
          <label
            class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="settings-formText2-{exerciceIndex}"
          >
            {exercice.besoinFormulaire2Texte[0]} :
          </label>
          <div
            class="tooltip tooltip-bottom w-full before:whitespace-pre-wrap before:content-[attr(data-tip)] before:text-left"
            data-tip={exercice.besoinFormulaire2Texte[1]}
          >
            <input
              class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              name="settings-formText2"
              id="settings-formText2-{exerciceIndex}"
              type="text"
              bind:value={sup2}
              on:input={newSettings}
            />
          </div>
        {/if}
      </form>
    {/if}

    <!-- sup3 -->
    {#if exercice.besoinFormulaire3CaseACocher}
      <div class="container">
        <label
          class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
          for="settings-check3-{exerciceIndex}"
        >
          {#if typeof exercice.besoinFormulaire3CaseACocher !== 'boolean'}
            {exercice.besoinFormulaire3CaseACocher[0]} :
          {/if}
        </label>
        <input
          name="settings-check3"
          id="settings-check3-{exerciceIndex}"
          type="checkbox"
          class="ml-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-1 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded cursor-pointer"
          bind:checked={sup3}
          on:change={newSettings}
        />
      </div>
    {/if}
    {#if formNum3}
      {#if Array.isArray(formNum3.champs)}
        <div class="flex flex-col">
          <form id="settings-form-formNum3-{exerciceIndex}" action="">
            <label
              class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
              for="settings-formNum3-{exerciceIndex}">{formNum3.titre} :</label
            >
            <select
              class="flex flex-auto w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              name="settings-formNum3"
              id="settings-formNum3-{exerciceIndex}"
              bind:value={sup3}
              on:change={newSettings}
            >
              {#each formNum3.champs as entree, i}
                <option
                  value={i + 1}
                  class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
                  >{entree}</option
                >
              {/each}
            </select>
          </form>
        </div>
      {:else}
        <div>
          <!-- Pas de tooltips -->
          <label
            class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="settings-formNum3-{exerciceIndex}"
            >{formNum3.titre} :
          </label>
          <input
            name="settings-formNum3"
            id="settings-formNum3-{exerciceIndex}"
            type="number"
            class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
            min="1"
            max={formNum3.champs}
            bind:value={sup3}
            on:change={newSettings}
          />
        </div>
      {/if}
    {/if}
    {#if exercice.besoinFormulaire3Texte}
      <form
        id="settings-form-formText3-{exerciceIndex}"
        name="settings-form-formText3"
        on:submit|preventDefault={newSettings}
      >
        {#if typeof exercice.besoinFormulaire3Texte !== 'boolean'}
          <label
            class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="settings-formText3-{exerciceIndex}"
          >
            {exercice.besoinFormulaire3Texte[0]} :
          </label>
          <div
            class="tooltip tooltip-bottom w-full before:whitespace-pre-wrap before:content-[attr(data-tip)] before:text-left"
            data-tip={exercice.besoinFormulaire3Texte[1]}
          >
            <input
              class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              name="settings-formText3"
              id="settings-formText3-{exerciceIndex}"
              type="text"
              bind:value={sup3}
              on:input={newSettings}
            />
          </div>
        {/if}
      </form>
    {/if}

    <!-- sup4 -->
    {#if exercice.besoinFormulaire4CaseACocher}
      <div class="container">
        <label
          class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
          for="settings-check4-{exerciceIndex}"
        >
          {#if typeof exercice.besoinFormulaire4CaseACocher !== 'boolean'}
            {exercice.besoinFormulaire4CaseACocher[0]} :
          {/if}
        </label>
        <input
          name="settings-check4"
          id="settings-check4-{exerciceIndex}"
          type="checkbox"
          class="ml-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-1 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded cursor-pointer"
          bind:checked={sup4}
          on:change={newSettings}
        />
      </div>
    {/if}
    {#if formNum4}
      {#if Array.isArray(formNum4.champs)}
        <div class="flex flex-col">
          <form id="settings-form-formNum4-{exerciceIndex}" action="">
            <label
              class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
              for="settings-formNum4-{exerciceIndex}">{formNum4.titre} :</label
            >
            <select
              class="flex flex-auto w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              name="settings-formNum4"
              id="settings-formNum4-{exerciceIndex}"
              bind:value={sup4}
              on:change={newSettings}
            >
              {#each formNum4.champs as entree, i}
                <option
                  value={i + 1}
                  class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
                  >{entree}</option
                >
              {/each}
            </select>
          </form>
        </div>
      {:else}
        <div>
          <!-- Pas de tooltips -->
          <label
            class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="settings-formNum4-{exerciceIndex}"
            >{formNum4.titre} :
          </label>
          <input
            name="settings-formNum4"
            id="settings-formNum4-{exerciceIndex}"
            type="number"
            class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
            min="1"
            max={formNum4.champs}
            bind:value={sup4}
            on:change={newSettings}
          />
        </div>
      {/if}
    {/if}
    {#if exercice.besoinFormulaire4Texte}
      <form
        id="settings-form-formText4-{exerciceIndex}"
        name="settings-form-formText4"
        class="flex flex-col justify-start"
        on:submit|preventDefault={newSettings}
      >
        {#if typeof exercice.besoinFormulaire4Texte !== 'boolean'}
          <label
            class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="settings-formText4-{exerciceIndex}"
          >
            {exercice.besoinFormulaire4Texte[0]} :
          </label>
          <div
            class="tooltip tooltip-bottom w-full before:whitespace-pre-wrap before:content-[attr(data-tip)] before:text-left"
            data-tip={exercice.besoinFormulaire4Texte[1]}
          >
            <input
              class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              name="settings-formText4"
              id="settings-formText4-{exerciceIndex}"
              type="text"
              bind:value={sup4}
              on:input={newSettings}
            />
          </div>
        {/if}
      </form>
    {/if}

     <!-- sup5 -->
     {#if exercice.besoinFormulaire5CaseACocher}
     <div class="container">
       <label
         class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
         for="settings-check5-{exerciceIndex}"
       >
         {#if typeof exercice.besoinFormulaire5CaseACocher !== 'boolean'}
           {exercice.besoinFormulaire5CaseACocher[0]} :
         {/if}
       </label>
       <input
         name="settings-check5"
         id="settings-check5-{exerciceIndex}"
         type="checkbox"
         class="ml-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-1 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded cursor-pointer"
         bind:checked={sup5}
         on:change={newSettings}
       />
     </div>
   {/if}
   {#if formNum5}
     {#if Array.isArray(formNum5.champs)}
       <div class="flex flex-col">
         <form id="settings-form-formNum5-{exerciceIndex}" action="">
           <label
             class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
             for="settings-formNum5-{exerciceIndex}">{formNum5.titre} :</label
           >
           <select
             class="flex flex-auto w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
             name="settings-formNum5"
             id="settings-formNum5-{exerciceIndex}"
             bind:value={sup5}
             on:change={newSettings}
           >
             {#each formNum5.champs as entree, i}
               <option
                 value={i + 1}
                 class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
                 >{entree}</option
               >
             {/each}
           </select>
         </form>
       </div>
     {:else}
       <div>
         <!-- Pas de tooltips -->
         <label
           class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
           for="settings-formNum5-{exerciceIndex}"
           >{formNum5.titre} :
         </label>
         <input
           name="settings-formNum5"
           id="settings-formNum5-{exerciceIndex}"
           type="number"
           class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
           min="1"
           max={formNum5.champs}
           bind:value={sup5}
           on:change={newSettings}
         />
       </div>
     {/if}
   {/if}
   {#if exercice.besoinFormulaire5Texte}
     <form
       id="settings-form-formText5-{exerciceIndex}"
       name="settings-form-formText5"
       class="flex flex-col justify-start"
       on:submit|preventDefault={newSettings}
     >
       {#if typeof exercice.besoinFormulaire5Texte !== 'boolean'}
         <label
           class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
           for="settings-formText5-{exerciceIndex}"
         >
           {exercice.besoinFormulaire5Texte[0]} :
         </label>
         <div
           class="tooltip tooltip-bottom w-full before:whitespace-pre-wrap before:content-[attr(data-tip)] before:text-left"
           data-tip={exercice.besoinFormulaire5Texte[1]}
         >
           <input
             class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
             name="settings-formText5"
             id="settings-formText5-{exerciceIndex}"
             type="text"
             bind:value={sup5}
             on:input={newSettings}
           />
         </div>
       {/if}
     </form>
   {/if}

    {#if exercice.correctionDetailleeDisponible}
      <div class="container">
        <label for="settings-correction-detaillee-{exerciceIndex}">
          <span
            class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
          >
            Correction détaillée :
          </span>
        </label>
        <input
          type="checkbox"
          id="settings-correction-detaillee-{exerciceIndex}"
          class="ml-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-1 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded cursor-pointer"
          bind:checked={correctionDetaillee}
          on:change={newSettings}
        />
      </div>
    {/if}
    <form
      id="settings-form-formAlea-{exerciceIndex}"
      name="settings-form-formAlea"
      on:submit|preventDefault={newSettings}
    >
      <label
        class="text-sm md:text-normal text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        for="settings-formAlea-{exerciceIndex}"
      >
        Série :
      </label>
      <input
        class="w-full text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-dark border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
        name="settings-formAlea"
        id="settings-formAlea-{exerciceIndex}"
        type="text"
        bind:value={alea}
        on:input={newSettings}
      />
    </form>
    {#if exercice.comment !== undefined}
      <div class="flex flex-col justify-start items-start p-2">
        <button
          type="button"
          class="flex items-center text-coopmaths-action dark:text-coopmathsdark-action cursor-pointer"
          on:click={() => {
            isCommentDisplayed = !isCommentDisplayed
          }}
          on:keydown={() => {
            isCommentDisplayed = !isCommentDisplayed
          }}
        >
          <i class="bx bx-info-circle mr-2" />En savoir plus...
        </button>
        <div
          class="{isCommentDisplayed
            ? 'block'
            : 'hidden'} pt-4 font-light text-justify text-coopmaths-corpus-light text-sm"
        >
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html exercice.comment}
        </div>
      </div>
    {/if}
  </div>
</div>
