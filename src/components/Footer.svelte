<script>
  import { keyboardState } from './keyboard/stores/keyboardStore'
</script>

<footer class="{$keyboardState.isVisible ? 'pt-48 md:pt-60' : 'pt-4'} w-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas h-12 flex flex-row-reverse justify-center items-center opacity-100 pb-4 px-4">
<a href="https://coopmaths.fr/www/mentions_legales/" target="_blank">
  <img class="hidden md:block px-6" style="height: 20px" src='./assets/images/logo2.png' alt="Logo Coopmaths 2" />
</a>
  <a
    class="flex flex-row items-center justify-start pr-6 font-thin text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
    href="https://x.com/CoopMaths_fr"
    target="_blank"
  >
    <i class="bx bx-sm bxl-twitter" />
  </a>
  <a
    class="flex flex-row items-center justify-start pr-6 font-thin text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
    href="https://mathstodon.xyz/@coopmaths"
    target="_blank"
  >
    <i class="bx bx-sm bxl-mastodon" />
  </a>
  <a
    class="flex flex-row items-center justify-start pr-6 font-thin text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
    href="mailto:contact@coopmaths.fr"
  >
    <i class="bx bx-sm bx-envelope" />
  </a>
</footer>
