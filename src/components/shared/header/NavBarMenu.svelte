<script lang="ts">
  import type { Action } from '../../../lib/types'
  export let entrees: string[]
  export let actions: (string | Action)[] = []
  export let isMenuOpen: boolean
  export let titre: string
  export let id: string
  export let isNavBarVisible: boolean

  function handleClickOnEntry (i: number) {
    isMenuOpen = false
    isNavBarVisible = false
    const action = actions[i]
    if (typeof action === 'string') {
      window.location.href = action
    } else {
      action()
    }
  }
</script>

<!--
  @component
  Menu déroulant

  ### Paramètres

  * `entrees` : Liste des entrées du menu
  * `actions` : Liste des actions/liens associés à chaque entrée (la liste doit être rangée dans le même ordre que les entrées)
  * `isMenuOpen` : flag pour détecter si le menu est ouvert/fermé
  * `titre` : le titre du menu
  * `id` : base pour construire les IDs des entrées du menu
  * `isNavBarVisible` : flag pour ?
 -->

<!-- Source pour les menus déroulants au survol :
https://codesandbox.io/s/tailwind-dropdown-with-group-hover-gm9k9?file=/tailwind.config.js:45-74
 -->
<div class="group inline-block relative">
  <button
    class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest text-xl font-extrabold relative flex lg:block py-6 px-2 lg:px-8 items-center"
  >
    <span class="mr-1">{titre}</span>
    <i class="bx bx-chevron-down" />
  </button>
  <ul class="absolute hidden group-hover:block z-10">
    {#each entrees as entree, i}
      <li>
        <a
          class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas-dark dark:hover:bg-coopmathsdark-canvas-darkest text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest py-2 px-4 block whitespace-no-wrap cursor-pointer"
          id={[id, '-entree-', i + 1].join('')}
          on:click={() => handleClickOnEntry(i)}
          on:keydown={() => handleClickOnEntry(i)}
          role="button"
          tabindex="0"
        >
          {entree}
        </a>
      </li>
    {/each}
  </ul>
</div>
