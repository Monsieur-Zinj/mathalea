<script lang="ts">
  export let isSidenavOpened: boolean
  export let isRecorder: boolean
  export let toggleSidenav: (test: boolean) => void
</script>

<div
  class="flex justify-center items-center absolute z-50 left-0
     h-8 md:h-10
     w-8 md:w-10
    {isRecorder
      ? `${isSidenavOpened ? 'translate-x-[400px]' : ' translate-x-0'} top-0 rounded-r-md transition-transform ease-in-out`
      : 'bottom-0 rounded-t-md'}
    bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
>
  <button
    type="button"
    data-te-sidenav-toggle-ref
    data-te-target="#choiceSideMenuWrapper"
    aria-controls="#choiceSideMenuWrapper"
    aria-haspopup="true"
    on:click={() => {
      toggleSidenav(false)
    }}
  >
    <i
      class="bx
        text-lg md:text-2xl
        {isSidenavOpened ? 'bx-x' : 'bx-right-arrow-alt'}
        text-coopmaths-action dark:text-coopmathsdark-action
        hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
    />
  </button>
</div>
