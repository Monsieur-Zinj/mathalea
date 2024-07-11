<script lang="ts">
  import type Exercice from '../../../../../exercices/Exercice'
  import { listOfRandomIndexes } from '../../../../../lib/components/shuffle'
  import CheckboxWithLabel from '../../../../shared/forms/CheckboxWithLabel.svelte'
  import NumberInput from '../../../../shared/forms/InputNumber.svelte'

  export let exercises: Exercice[]
  export let selectedExercisesIndexes: number[]
  export let updateSelect: (selection: number[] | undefined) => void

  const isSelectedExercises: boolean = selectedExercisesIndexes.length > 0
  let selectedExercisesCount: number = selectedExercisesIndexes.length

  function applyRandomSelectionOfExercises (numberOfSelectedExercises: number) {
    let selection: number[] | undefined
    if (numberOfSelectedExercises > 0 && numberOfSelectedExercises < exercises.length) {
      selection = [...listOfRandomIndexes(exercises.length, numberOfSelectedExercises)].sort((a, b) => a - b)
    }
    updateSelect(selection)
  }

</script>

<div class="pb-6">
  <div
    class="flex text-lg font-bold mb-1
      text-coopmaths-struct dark:text-coopmathsdark-struct
      {exercises.length === 1 ? 'text-opacity-20' : 'text-opacity-100'}"
  >
    Sélection aléatoire d'exercices
  </div>
  <CheckboxWithLabel
    id="slideshow-selected-exercises-checkbox"
    isChecked={isSelectedExercises}
    isDisabled={exercises.length === 0}
    label="Seulement certains exercices de la liste"
    on:change={(e) => {
      const isChecked = e.detail
      selectedExercisesCount = isChecked ? exercises.length - 1 : 0
      applyRandomSelectionOfExercises(selectedExercisesCount)
    }}
  />
  <div class="pl-8 mt-1 flex">
    <NumberInput
      id="slideshow-selected-exercises-count-input"
      max={exercises.length}
      value={selectedExercisesCount}
      isDisabled={!selectedExercisesCount}
      on:change={(e) => {
        const selectedExercisesCount = e.detail
        applyRandomSelectionOfExercises(selectedExercisesCount)
      }}
    />
    <span
      class="ml-2 my-auto
        text-coopmaths-corpus dark:text-coopmathsdark-corpus
        {selectedExercisesCount ? 'text-opacity-100 dark:text-opacity-100' : 'text-opacity-10 dark:text-opacity-10'}"
    >
      parmi {exercises.length}
    </span>
  </div>
</div>
