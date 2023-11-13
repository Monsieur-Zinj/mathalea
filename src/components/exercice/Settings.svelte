<script lang="ts">
  import { afterUpdate, createEventDispatcher } from 'svelte'
  import type TypeExercice from '../../exercices/ExerciceTs.ts'
  import { mathaleaGenerateSeed } from '../../lib/mathalea.js'

  export let exercice: TypeExercice
  let nbQuestions: number
  let duration: number
  let sup: boolean
  let sup2: boolean
  let sup3: boolean
  let sup4: boolean
  let alea: string
  let correctionDetaillee: boolean
  let premierUpdate: boolean = true
  let isCommentDisplayed: boolean = false

  // pour récupérer les tooltips de l'exercice
  type FormNumerique = {
    titre: string
    max: number
    champs: string[] | string
  }
  let formNum1: FormNumerique
  let formNum2: FormNumerique
  let formNum3: FormNumerique
  let formNum4: FormNumerique

  afterUpdate(async () => {
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
      alea = exercice.seed ?? mathaleaGenerateSeed()
      correctionDetaillee = exercice.correctionDetaillee
    }
  })

  const dispatch = createEventDispatcher()

  function newSettings() {
    dispatch('settings', {
      nbQuestions,
      duration,
      sup,
      sup2,
      sup3,
      sup4,
      alea,
      correctionDetaillee
    })
  }
  /**
   * Transforme le tableau des tooltips d'un paramètre type numérique en un objet
   * constitué d'un titre (celui du paramètre) et soit d'un tableau
   * des options, soit d'un nombre correspond à la valeur maximale.
   * <i>Référence :</i> commentaire du fichier Exercice.ts sur la propriété
   * <code>besoinFormulaireNumérique</code> (<code>false</code>
   * sinon this.besoinFormulaireNumerique = [texte, max, tooltip facultatif])
   * @param {string[]} entreesFormulaire Typiquement la valeur de la propriété
   * <code>besoinFormulaireNumérique</code>
   * @author sylvain chambon
   */
  function parseFormNumerique(
    entreesFormulaire:
      | [titre: string, max: number, tooltip: string]
      | [titre: string, max: number]
  ) {
    const entrees:
      | [titre: string, max: number, tooltip: string]
      | [titre: string, max: number] = [...entreesFormulaire]
    const premier = entrees[0]
    const titre: string = premier ? premier.toString() : 'mon titre' // le titre du paramètre est le 1er elt
    const max: number = entrees[1]
    let champs: string[] | string
    if (entrees.length === 3) {
      // il y a une liste de tooltips qui deviendront les entrées
      champs = entrees[2].split('\n').map((x) => x.replace(/(?:\d *: *)/i, ''))
    } else {
      // les champs se résument à un seul nombre correspondant au maximum
      champs = entrees[0]
    }
    return { titre, max, champs }
  }
  // fabrication des objets correspondant aux paramètres numériques.
  // soit besoinFormulaireNumerique vaut false, c'est un tableau
  // donc le test sur le type défférent d'un booléen revient à
  // tester si besoinFormulaireNumerique n'est pas `false`
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
</script>

<div
  class="text-xl lg:text-base ml-2 lg:ml-4 space-y-4 p-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
>
  <h3 class="text-coopmaths-struct dark:text-coopmathsdark-struct font-bold">
    Paramètres
  </h3>
  {#if !exercice.nbQuestionsModifiable && !exercice.besoinFormulaireCaseACocher && !exercice.besoinFormulaireNumerique && !exercice.besoinFormulaireTexte}
    <div class="italic">Cet exercice ne peut pas être paramétré.</div>
  {/if}
  {#if exercice.nbQuestionsModifiable}
    <div>
      <span
        class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
      >
        Nombre de questions :
      </span>
      <input
        type="number"
        min="1"
        bind:value={nbQuestions}
        on:change={newSettings}
        on:input={newSettings}
        class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
      />
    </div>
  {/if}
  <div>
    <span
      class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
    >
      Durée d'une question pour le diaporama :
    </span>
    <input
      type="number"
      min="1"
      bind:value={duration}
      on:change={newSettings}
      class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
    />
  </div>
  {#if typeof exercice.besoinFormulaireCaseACocher !== 'boolean'}
    <div class="container">
      <label
        class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        for="check1"
      >
        {exercice.besoinFormulaireCaseACocher[0]} :
      </label>
      <input
        name="check1"
        type="checkbox"
        class="ml-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-1 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded cursor-pointer"
        bind:checked={sup}
        on:change={newSettings}
      />
    </div>
  {/if}
  {#if formNum1 !== undefined}
    {#if Array.isArray(formNum1.champs)}
      <div class="flex flex-col">
        <form action="">
          <label
            class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="formNum1"
          >
            {formNum1.titre} :
          </label>
          <select
            class="flex flex-auto w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
            name="formNum1"
            id="formNum1-select"
            bind:value={sup}
            on:change={newSettings}
          >
            {#each formNum1.champs as entree, i}
              <option
                value={i + 1}
                class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              >
                {entree}
              </option>
            {/each}
          </select>
        </form>
      </div>
    {:else}
      <div>
        <!-- Il faudra gérer l'absence de tooltip -->
        <label
          class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
          for="formNum1"
          >{formNum1.titre} :
        </label>
        <input
          name="formNum1"
          type="number"
          class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
          min="1"
          max={formNum1.max}
          data-bs-toggle="tooltip"
          title={formNum1.champs || ''}
          bind:value={sup}
          on:change={newSettings}
        />
      </div>
    {/if}
  {/if}
  {#if typeof exercice.besoinFormulaireTexte !== 'boolean'}
    <form
      id="formText1"
      name="formText1"
      on:submit|preventDefault={newSettings}
    >
      <label
        class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        for="formText1"
      >
        {exercice.besoinFormulaireTexte[0]} :
      </label>
      <div
        class="tooltip tooltip-bottom w-full before:whitespace-pre-wrap before:content-[attr(data-tip)] before:text-left"
        data-tip={exercice.besoinFormulaireTexte[1]}
      >
        <input
          class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
          name="formText1"
          type="text"
          bind:value={sup}
          on:input={newSettings}
        />
      </div>
      <!-- <fieldset>
        <legend
          class="text-coopmaths-struct dark:text-coopmathsdark-struct opacity-35"
          >{formText1.titre}</legend
        >
        <div class="flex flex-col ml-3 mt-1">
          {#each formText1.champsDecortiques as entree, i}
            <div class="flew-row space-x-2">
              <Curseur
                on:curseurNotif={() => submitOnSliderChange('formText1')}
                titre={entree.parametre}
                montant={0}
                identifiant={['paramText1-', i + 1, '-curseur'].join('')}
                nom={['paramText1-idNum-', entree.valeur].join('')}
                max={nbQuestions}
              />
            </div>
          {/each}
        </div>
      </fieldset> -->
    </form>
  {/if}

  <!-- sup2 -->
  {#if typeof exercice.besoinFormulaire2CaseACocher !== 'boolean'}
    <div class="container">
      <label
        class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        for="check2"
      >
        {exercice.besoinFormulaire2CaseACocher[0]} :
      </label>
      <input
        name="check2"
        type="checkbox"
        class="ml-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-1 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded cursor-pointer"
        bind:checked={sup2}
        on:change={newSettings}
      />
    </div>
  {/if}
  {#if formNum2 !== undefined}
    {#if Array.isArray(formNum2.champs)}
      <div class="flex flex-col">
        <form action="">
          <label
            class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="formNum2"
          >
            {formNum2.titre} :
          </label>
          <select
            class="flex flex-auto w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
            name="formNum2"
            id="formNum2-select"
            bind:value={sup2}
            on:change={newSettings}
          >
            {#each formNum2.champs as entree, i}
              <option
                value={i + 1}
                class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              >
                {entree}
              </option>
            {/each}
          </select>
        </form>
      </div>
    {:else}
      <div>
        <!-- Il faudra gérer l'absence de tooltip -->
        <label
          class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
          for="formNum2"
        >
          {formNum2.titre} :
        </label>
        <input
          name="formNum2"
          type="number"
          class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
          min="1"
          max={formNum2.max}
          data-bs-toggle="tooltip"
          title={formNum2.champs || ''}
          bind:value={sup2}
          on:change={newSettings}
        />
      </div>
    {/if}
  {/if}
  {#if typeof exercice.besoinFormulaire2Texte !== 'boolean'}
    <form
      id="formText2"
      name="formText2"
      on:submit|preventDefault={newSettings}
    >
      <label
        class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        for="formText2"
      >
        {exercice.besoinFormulaire2Texte[0]} :
      </label>
      <div
        class=" tooltip tooltip-bottom w-full before:whitespace-pre-wrap before:content-[attr(data-tip)] before:text-left"
        data-tip={exercice.besoinFormulaire2Texte[1]}
      >
        <input
          class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
          name="formText2"
          type="text"
          bind:value={sup2}
          on:input={newSettings}
        />
      </div>
      <!-- <fieldset>
          <legend class="text-coopmaths-struct dark:text-coopmathsdark-struct opacity-35">{formText2.titre}</legend>
          <div class="flex flex-col  ml-3 mt-1">
            {#each formText2.champsDecortiques as entree, i}
              <div class="flew-row space-x-2">
                <Curseur
                  on:curseurNotif={() => submitOnSliderChange("formText2")}
                  titre={entree.parametre}
                  montant={0}
                  identifiant={["paramText2-", i + 1, "-curseur"].join("")}
                  nom={["paramText2-idNum-", entree.valeur].join("")}
                  max={nbQuestions}
                />
              </div>
            {/each}
          </div>
        </fieldset> -->
    </form>
  {/if}

  <!-- sup3 -->
  {#if typeof exercice.besoinFormulaire3CaseACocher !== 'boolean'}
    <div class="container">
      <label
        class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        for="check3"
      >
        {exercice.besoinFormulaire3CaseACocher[0]} :
      </label>
      <input
        name="check3"
        type="checkbox"
        class="ml-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-1 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded cursor-pointer"
        bind:checked={sup3}
        on:change={newSettings}
      />
    </div>
  {/if}
  {#if formNum3 !== undefined}
    {#if Array.isArray(formNum3.champs)}
      <div class="flex flex-col">
        <form action="">
          <label
            class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="formNum3"
          >
            {formNum3.titre} :
          </label>
          <select
            class="flex flex-auto w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
            name="formNum3"
            id="formNum3-select"
            bind:value={sup3}
            on:change={newSettings}
          >
            {#each formNum3.champs as entree, i}
              <option
                value={i + 1}
                class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              >
                {entree}
              </option>
            {/each}
          </select>
        </form>
      </div>
    {:else}
      <div>
        <!-- Il faudra gérer l'absence de tooltip -->
        <label
          class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
          for="formNum3"
        >
          {formNum3.titre} :
        </label>
        <input
          name="formNum3"
          type="number"
          class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
          min="1"
          max={formNum3.max}
          data-bs-toggle="tooltip"
          title={formNum3.champs || ''}
          bind:value={sup3}
          on:change={newSettings}
        />
      </div>
    {/if}
  {/if}
  {#if typeof exercice.besoinFormulaire3Texte !== 'boolean'}
    <form
      id="formText3"
      name="formText3"
      on:submit|preventDefault={newSettings}
    >
      <label
        class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        for="formText3"
      >
        {exercice.besoinFormulaire3Texte[0]} :
      </label>
      <div
        class=" tooltip tooltip-bottom w-full before:whitespace-pre-wrap before:content-[attr(data-tip)] before:text-left"
        data-tip={exercice.besoinFormulaire3Texte[1]}
      >
        <input
          class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
          name="formText3"
          type="text"
          bind:value={sup3}
          on:input={newSettings}
        />
      </div>
      <!-- <div>
      <form id="formText3" name="formText3">
        <fieldset>
          <legend class="text-coopmaths-struct dark:text-coopmathsdark-struct opacity-35">{formText3.titre}</legend>
          <div class="flex flex-col  ml-3 mt-1">
            {#each formText3.champsDecortiques as entree, i}
              <div class="flew-row space-x-2">
                <Curseur
                  on:curseurNotif={() => submitOnSliderChange("formText3")}
                  titre={entree.parametre}
                  montant={0}
                  identifiant={["paramText3-", i + 1, "-curseur"].join("")}
                  nom={["paramText3-idNum-", entree.valeur].join("")}
                  max={nbQuestions}
                />
              </div>
            {/each}
          </div>
        </fieldset> -->
    </form>
  {/if}

  <!-- sup4 -->
  {#if typeof exercice.besoinFormulaire4CaseACocher !== 'boolean'}
    <div class="container">
      <label
        class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        for="check4"
      >
        {exercice.besoinFormulaire4CaseACocher[0]} :
      </label>
      <input
        name="check4"
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
        <form action="">
          <label
            class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
            for="formNum4"
          >
            {formNum4.titre} :
          </label>
          <select
            class="flex flex-auto w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
            name="formNum4"
            id="formNum4-select"
            bind:value={sup4}
            on:change={newSettings}
          >
            {#each formNum4.champs as entree, i}
              <option
                value={i + 1}
                class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
              >
                {entree}
              </option>
            {/each}
          </select>
        </form>
      </div>
    {:else}
      <div>
        <!-- Il faudra gérer l'absence de tooltip -->
        <label
          class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
          for="formNum4"
        >
          {formNum4.titre} :
        </label>
        <input
          name="formNum4"
          type="number"
          class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
          min="1"
          max={formNum4.max}
          data-bs-toggle="tooltip"
          title={formNum4.champs || ''}
          bind:value={sup4}
          on:change={newSettings}
        />
      </div>
    {/if}
  {/if}
  {#if typeof exercice.besoinFormulaire4Texte !== 'boolean'}
    <form
      id="formText4"
      name="formText4"
      class="flex flex-col justify-start"
      on:submit|preventDefault={newSettings}
    >
      <label
        class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
        for="formText4"
      >
        {exercice.besoinFormulaire4Texte[0]} :
      </label>
      <div
        class="tooltip tooltip-bottom w-full before:whitespace-pre-wrap before:content-[attr(data-tip)] before:text-left"
        data-tip={exercice.besoinFormulaire4Texte[1]}
      >
        <input
          class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
          name="formText4"
          type="text"
          bind:value={sup4}
          on:input={newSettings}
        />
      </div>
    </form>
    <!-- <div>
      <form id="formText4" name="formText4">
        <fieldset>
          <legend class="text-coopmaths-struct dark:text-coopmathsdark-struct opacity-35">{formText4.titre}</legend>
          <div class="flex flex-col  ml-3 mt-1">
            {#each formText4.champsDecortiques as entree, i}
              <div class="flew-row space-x-2">
                <Curseur
                  on:curseurNotif={() => submitOnSliderChange("formText4")}
                  titre={entree.parametre}
                  montant={0}
                  identifiant={["paramText4-", i + 1, "-curseur"].join("")}
                  nom={["paramText4-idNum-", entree.valeur].join("")}
                  max={nbQuestions}
                />
              </div>
            {/each}
          </div>
        </fieldset>
      </form>
    </div> -->
  {/if}

  {#if exercice.correctionDetailleeDisponible}
    <div class="container">
      <span
        class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
      >
        Correction détaillée :
      </span>
      <input
        type="checkbox"
        class="ml-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-1 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded cursor-pointer"
        bind:checked={correctionDetaillee}
        on:change={newSettings}
      />
    </div>
  {/if}
  <form id="formAlea" name="formAlea" on:submit|preventDefault={newSettings}>
    <label
      class="text-coopmaths-struct dark:text-coopmathsdark-struct font-light"
      for="formAlea"
    >
      Série :
    </label>
    <input
      class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
      name="formAlea"
      type="text"
      bind:value={alea}
      on:input={newSettings}
    />
  </form>
  {#if exercice.comment !== undefined}
    <div class="flex flex-col justify-start items-start p-2">
      <button
        type="button"
        id="settings-comments-display-button"
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
        {@html exercice.comment}
      </div>
    </div>
  {/if}
</div>
