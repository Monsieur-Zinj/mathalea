<script lang="ts">
  import { showDialogForLimitedTime } from '../../../../../../../lib/components/dialogs'
  import TwoStatesIcon from '../../../../../../../components/shared/icons/TwoStatesIcon.svelte'
  import { onMount, onDestroy } from 'svelte'

  // eslint dit que ce n'est pas nécessaire de l'initialiser à undefined mais si on ne le fait pas, typescript n'est pas d'accord dans les components parents
  // eslint-disable-next-line no-undef-init
  export let callback: ((isFullScreen: boolean) => void) | undefined = undefined

  const appId = 'appComponent'
  let isFullScreen = false

  onMount(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
  })

  onDestroy(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
  })

  const handleFullscreenChange = () => { // pour gérer le cas où l'utilisateur sort du plein écran avec la touche ESC
    const isInFullScreen = document.fullscreenElement != null
    isFullScreen = isInFullScreen
    if (typeof callback === 'function') callback(isFullScreen)
  }

  const switchFullScreen = () => {
    isFullScreen = !isFullScreen
    const element: HTMLElement | null = document.getElementById(appId)
    if (element == null) { // Bugsnag a remonté un cas où il était undefined o_O
      handleFullScreenError(new Error(`#${appId} non trouvé`))
    } else {
      if (typeof callback === 'function') callback(isFullScreen)
      if (isFullscreenEnabled(element)) {
        if (isFullScreen) {
          requestFullScreen(element)
        } else {
          exitFullScreen()
        }
      } else {
        handleFullScreenError(new Error('Plein écran non disponible'))
      }
    }
  }

  const requestFullScreen = (element: HTMLElement & {
    requestFullscreen?(): Promise<void>
    mozRequestFullScreen?(): Promise<void>
    webkitRequestFullscreen?(): Promise<void>
    msRequestFullscreen?(): Promise<void>
  }) => {
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(handleFullScreenError)
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen().catch(handleFullScreenError)
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen().catch(handleFullScreenError)
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen().catch(handleFullScreenError)
    }
  }

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(handleFullScreenError)
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen().catch(handleFullScreenError)
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen().catch(handleFullScreenError)
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen().catch(handleFullScreenError)
    }
  }

  const isFullscreenEnabled = (element: HTMLElement): element is HTMLElement & {
    requestFullscreen?(): Promise<void>
    mozRequestFullScreen?(): Promise<void>
    webkitRequestFullscreen?(): Promise<void>
    msRequestFullscreen?(): Promise<void>
  } => {
    return (
      'requestFullscreen' in element ||
      'mozRequestFullScreen' in element ||
      'webkitRequestFullscreen' in element ||
      'msRequestFullscreen' in element
    )
  }

  const handleFullScreenError = (error: Error) => {
    console.error('Accès au plein écran refusé', error)
    showDialogForLimitedTime('notifDialog', 2000, 'Accès au plein écran refusé')
  }
</script>

<button
  type="button"
  class="tooltip tooltip-bottom tooltip-neutral"
  data-tip={isFullScreen ? 'Quitter le plein écran' : 'Plein écran'}
  on:click={switchFullScreen}
>
  <div class="px-2">
    <TwoStatesIcon isOnStateActive={isFullScreen}>
      <i
        slot="icon_to_switch_on"
        class="bx bx-fullscreen text-3xl
          text-coopmaths-action dark:text-coopmathsdark-action
          hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest"
      />
      <i
        slot="icon_to_switch_off"
        class="bx bx-exit-fullscreen text-3xl
        text-coopmaths-action dark:text-coopmathsdark-action
        hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest"
      />
    </TwoStatesIcon>
  </div>
</button>
