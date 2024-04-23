<script lang="ts">
  import PdfTextIcon from '../../../../../../../components/shared/icons/PdfTextIcon.svelte'
  import Button from '../../../../../../../components/shared/forms/Button.svelte'
  import AmcIcon from '../../../../../../../components/shared/icons/AmcIcon.svelte'
  import AnkiIcon from '../../../../../../../components/shared/icons/AnkiIcon.svelte'
  import MoodleIcon from '../../../../../../../components/shared/icons/MoodleIcon.svelte'
  import type { VueType } from '../../../../../../../lib/types'
  import ModalActionWithDialog from '../../../../../../../components/shared/modal/ModalActionWithDialog.svelte'
  import { downloadRedirectFile } from '../../../../../../../lib/components/redirectFile'
  export let handleExport: (vue: VueType) => void
</script>

<div class="tooltip tooltip-bottom" data-tip="Diaporama">
  <Button
    title=""
    icon="bx-slideshow"
    class="flex items-center text-3xl"
    on:click={() => handleExport('diaporama')}
  />
</div>
<button
  type="button"
  class="tooltip tooltip-bottom tooltip-neutral"
  data-tip="Lien pour les élèves"
  on:click={() => handleExport('confeleve')}
>
  <div
    class="relative hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
  >
    <i class="bx text-3xl bx-link" />
    <div class="absolute -bottom-1 -right-1">
      <i class="scale-75 bx bx-xs bxs-graduation" />
    </div>
  </div>
</button>
<button
  type="button"
  class="tooltip tooltip-bottom tooltip-neutral"
  data-tip="LaTeX"
  on:click={() => handleExport('latex')}
>
  <PdfTextIcon
    class="w-7 h-7 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest"
  />
</button>
<button
  type="button"
  class="tooltip tooltip-bottom tooltip-neutral"
  data-tip="AMC"
  on:click={() => handleExport('amc')}
>
  <AmcIcon
    class="w-7 h-7 hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
  />
</button>
<button
  type="button"
  class="tooltip tooltip-bottom tooltip-neutral"
  data-tip="Anki"
  on:click={() => handleExport('anki')}
>
  <AnkiIcon
    class="w-7 h-7 hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
  />
</button>
<button
  type="button"
  class="tooltip tooltip-bottom tooltip-neutral"
  data-tip="Moodle"
  on:click={() => handleExport('moodle')}
>
  <MoodleIcon
    class="w-7 h-7 hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
  />
</button>
<div class="tooltip tooltip-bottom" data-tip="Fichier">
  <!--<Button
    title=""
    icon="bxs-file-export"
    class="flex items-center text-3xl"
    on:click={() => handleExport('redirectFile')}
  />-->
  <ModalActionWithDialog
    on:display={() =>
      downloadRedirectFile(
        'downlaodRedirectFileDialog',
        new URL(location.href),
        'mathAlea',
        false,
        false
      )}
    message="Le téléchargement va début dans quelques instants."
    messageError="Impossible de télécharger le fichier !"
    dialogId="downlaodRedirectFileDialog"
    tooltipMessage={'Fichier de redirection'}
    buttonIcon={'bxs-file-export'}
  />
</div>
