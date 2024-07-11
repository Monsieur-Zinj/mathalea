<script lang="ts">
  export let subtitle: string = ''
  export let type: 'export' | 'design' = 'export'
</script>

<!--
  @component
  Sous-titre du header de NavBarV2

  __Paramètres__ :

  * `subtitle` :  titre du groupe de boutons
  * `type`: `export`(défaut) ou `design`

  __Exemple__ :

    ```tsx
  <NavBarV2Subtitle
    subtitle = "Mon sous-titre"
    type = "design"
  />
  ```
 -->
<div class="flex flex-row items-center align-middle font-logo9 tracking-tighter
  pt-6 md:pt-0
  text-lg md:text-3xl xl:text-5xl"
>
  <div class="font-light
    pl-0 md:pl-10
    text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest"
  >
    <i class={type === 'export' ? 'bx bx-export rotate-90 md:translate-y-1' : 'hidden'} />
    <i class={type === 'design' ? 'bx bx-chevron-right md:translate-y-1' : 'hidden'} />
  </div>
  <div class="font-black
    ml-1 md:ml-3 xl:ml-5
    text-coopmaths-struct dark:text-coopmathsdark-struct"
  >
    {subtitle}
  </div>
</div>
