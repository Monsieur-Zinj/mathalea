<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Button from '../forms/Button.svelte'
  export let message: string
  export let messageError: string
  export let dialogId: string = 'dialogbox'
  export let tooltipMessage: string = ''
  export let buttonSize: string = 'text-2xl'
  export let buttonIcon: string = 'bx-link'
  export let buttonSecondIcon: string = ''
  export let classForButton: string = ''
  export let title: string = ''

  const dispatch = createEventDispatcher()

</script>

<!--
    @component
    Bouton pour lancer une action et afficher un message informatif dans un modal

    ### Action

    `display` : déclanchée lors du clic sur le bouton et appelée par `on:display={monAction}`

    ⚠ La fonction `monAction` est responsable de l'affichage du modal... ⚠

    ### Paramètres

    * `message` : message à afficher
    * `dialogId` : ID de la dialog box
    * `tooltipMessage` : message affiché au survol
    * `buttonSize` : taille du bouton
    * `buttonIcon` : icone utilisée pour le bouton
    * `buttonSecondIcon` : icone à ajouter
    * `classForButton` : pour ajouter des éléments de positionnement du bouton
    * `title` : titre pour un bouton (remplace l'icone)

    ### Exemple

    ```tsx
    <ModalActionWithDialog
        on:display={() => copyLinkToClipboard("linkCopiedDialog-2")}
        message="Le lien est copié dans le presse-papier !"
        messageError="Impossible de copier le lien dans le presse-papier"
        dialogId="linkCopiedDialog-2"
        tooltipMessage="Lien du Diaporama"
        buttonSize="text-[100px]"
        buttonIcon="bx-link"
        buttonSecondIcon=""
        classForButton = "mr-4 my-2"
        title = ""
    />
    ```
 -->

<div class="tooltip tooltip-bottom tooltip-neutral" data-tip={tooltipMessage}>
  <Button
    id="modalaction-button"
    class="{classForButton} {title.length === 0
      ? `text-coopmaths-action dark:text-coopmathsdark-action
         hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest`
      : `text-coopmaths-canvas dark:text-coopmathsdark-canvas
         bg-coopmaths-action dark:bg-coopmathsdark-action
         hover:bg-coopmaths-action-lightest dark:hover:bg-coopmathsdark-action-lightest`}"
    on:click={() => dispatch('display')}
  >
    {#if title.length === 0}
      <i class="relative bx {buttonIcon} {buttonSize}" />
      {#if buttonSecondIcon.length !== 0}
        <i class="absolute -bottom-1 bx {buttonSecondIcon} text-sm -translate-x-3
          text-coopmaths-warn dark:text-coopmathsdark-warn"
        />
      {/if}
    {:else}
      {title}
    {/if}
  </Button>
</div>

<dialog
  id={dialogId + '-success'}
  class="rounded-xl p-6 shadow-lg
    bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark
    text-coopmaths-corpus dark:text-coopmathsdark-corpus-light"
>
  <div class="container font-light">
    {@html message}
  </div>
</dialog>

<dialog
  id={dialogId + '-error'}
  class="rounded-xl p-6 shadow-lg
    bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark
    text-coopmaths-corpus dark:text-coopmathsdark-corpus-light"
>
  <div class="container font-light">
    {messageError}
  </div>
</dialog>