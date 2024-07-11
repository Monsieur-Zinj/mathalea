<script lang="ts">
  import { mathaleaGenerateSeed } from '../../../lib/mathalea'

  export let title: string = ''
  export let placeholder: string = ''
  export let showTitle: boolean = true
  export let value: string = ''
  export let isDisabled: boolean = false
  export let inputID: string = mathaleaGenerateSeed()
  export let classAddenda: string = ''
</script>

<!--
  @component
  Champ de saisie de texte

  ### Paramètres

  * `title` : titre du champ de texte (situé au dessus du champ de saisie)
  * `placeholder` : texte de'invite pour le champ
  * `showTitle` : flag permettant de décider de l'affichage du titre au dessus du champ ou pas
  * `value` : valeur du champ
  * `isDisabled` : flag permettant de désactiver le champ
  * `inputID` : ID du champ
  * `classAddenda` : éléments de style à ajouter à ceux déjà présents ( voir [Tailwindd CSS](https://tailwindcss.com/docs/installation))

  ### Exemple

  ```tsx
  <InputText
    title="Importer les exercices d'une feuille élève"
    placeholder="Lien"
    bind:value={urlFeuilleEleve}
    classAddenda="w-50"
  />
  ```

 -->

<div>
  <label
    class="font-light text-xs pr-4
      {showTitle ? 'block' : 'hidden'}
      {isDisabled ? 'text-opacity-10 dark:text-opacity-10' : 'text-opacity-100 dark:text-opacity-100'}
      text-coopmaths-struct dark:text-coopmathsdark-struct"
    for={inputID}
  >
    {title}
  </label>
  <input
    type="text"
    id={inputID}
    name={inputID}
    disabled={isDisabled}
    bind:value
    {placeholder}
    class="block h-5 text-sm border-1
      border-coopmaths-action dark:border-coopmathsdark-action
      focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest
      focus:outline-0 focus:ring-0 focus:border-1
      bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
      disabled:opacity-20
      text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light {classAddenda}"
  />
</div>
