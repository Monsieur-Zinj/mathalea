<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  type FlexOrientation = 'col' | 'row'

  export let title: string
  export let valueSelected: string|number
  export let labelsValues: {
    label: string
    value: string|number
    isDisabled?: boolean
  }[] = []
  export let isDisabled: boolean = false
  export let orientation: FlexOrientation = 'col'
  export let bgColor: string = 'bg-coopmaths-canvas'

  const name =
    title !== undefined
      ? title
        .replaceAll(' ', '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
      : Math.round(Math.random() * 1000).toString()
  const dispatch = createEventDispatcher()
  function valueHasChanged () {
    dispatch('newvalue')
  }
</script>

<!--
  @component
  Formulaire avec boutons radios

  ### Action :

  `newvalue` est dispatché lorsque la valeur du groupe de question a changé

  ### Paramètres :

  * `title` :  titre du groupe de boutons
  * `isDisabled`: booléen servant à désactiver le groupe

  ### Exemple :

    ```tsx
  <FormRadio
      isDisabled={maVariable2 === 0}
      bind:valueSelected={maVariable}
      labelsValues={[
          { label: 'Titre du label 1', value: '1' },
          { label: 'Titre du label 2', value: '2', isDisabled: true }
      ]}
      on:newvalue={() => {do_something}}
  />
  ```
 -->

<div class="flex flex-{orientation} justify-start items-start mt-1">
  {#each labelsValues as labelValue, i}
    <div class="form-check flex flex-row ml-4 items-center">
      <input
        class="form-check-input rounded-full h-4 w-4 mt-1 mr-2
          transition duration-200
          text-coopmaths-action dark:text-coopmathsdark-action
          {bgColor} dark:bg-coopmathsdark-canvas-dark
          border
          border-coopmaths-action dark:border-coopmathsdark-action
          checked:border-coopmaths-action dark:checked:border-coopmathsdark-action
          active:border-coopmaths-action dark:active:border-coopmathsdark-action
          focus:outline-0 focus:ring-0 focus:border-1
          focus:border-coopmaths-action dark:focus:border-coopmathsdark-action
          checked:bg-coopmaths-action dark:checked:bg-coopmathsdark-action
          checked:disabled:bg-opacity-10 checked:disabled:border-opacity-10
          {isDisabled || labelValue.isDisabled
            ? `border-opacity-10 dark:border-opacity-10
              bg-opacity-10 dark:bg-opacity-10
              checked:disabled:opacity-10 dark:checked:disabled:opacity-10`
            : 'cursor-pointer'}"
        type="radio"
        {name}
        id={name + i.toString()}
        bind:group={valueSelected}
        value={labelValue.value}
        disabled={isDisabled || labelValue.isDisabled}
        on:change={valueHasChanged}
      />
      <label
        class="form-check-label inline-block text-sm
          text-coopmaths-corpus dark:text-coopmathsdark-corpus
          {valueSelected === labelValue.value ? 'font-semibold' : 'font-light'}
          {isDisabled || labelValue.isDisabled ? 'text-opacity-10' : 'text-opacity-70 cursor-pointer'}"
        for={name + i.toString()}
      >
        {labelValue.label}
      </label>
    </div>
  {/each}
</div>
