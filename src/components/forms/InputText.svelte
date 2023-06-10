<script lang="ts">
  export let title: string = "Title"
  export let placeholder = "Your text here"
  export let showTitle: boolean = true
  export let value: string = ""
  export let isDisabled: boolean = false
  export let inputID: string = "input-text"
  export let classAddenda: string = ""
</script>

<div>
  <label class="{showTitle ? 'block' : 'hidden'} font-light text-xs text-coopmaths-struct dark:text-coopmathsdark-struct pr-4" for={inputID}>
    {title}
  </label>
  <input
    type="text"
    id={inputID}
    name={inputID}
    disabled={isDisabled}
    bind:value
    {placeholder}
    class="block h-5 text-sm border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light {classAddenda}"
  />
</div>
