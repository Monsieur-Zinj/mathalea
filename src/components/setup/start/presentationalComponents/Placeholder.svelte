<script lang="ts">
  import Footer from '../../../Footer.svelte'
  import Advertising from './Advertising.svelte'

  export let text: string

</script>

<div class="relative flex-1 h-full">
  <div
    class="flex flex-col justify-between h-full text-coopmaths-corpus dark:text-coopmathsdark-corpus md:px-10 py-6"
  >
    <div class="bg-coopmaths-canvas">
      <span class="text-coopmaths-canvas">&nbsp;</span>
    </div>
    <div>
      <Advertising />
    </div>
    <div
      class="animate-pulse flex flex-col md:flex-row justify-start space-x-6 items-center"
    >
      <div class="mt-[10px]">
        <div class="hidden md:inline-flex">
          <i class="bx bx-chevron-left text-[50px]" />
        </div>
        <div class="inline-flex md:hidden">
          <i class="bx bx-chevron-up text-[50px]" />
        </div>
      </div>
      <div class="font-extralight text-[50px]">
        {text}
      </div>
    </div>
    <div class="flex items-center justify-center">
      <Footer />
    </div>
  </div>
</div>
