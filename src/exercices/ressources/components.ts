export function createButon ({ title = 'Valider' } : {title?: string} = {}) {
  const button = document.createElement('button')
  button.textContent = title
  button.classList.add('text-coopmaths-canvas', 'dark:text-coopmathsdark-canvas', 'bg-coopmaths-action', 'dark:bg-coopmathsdark-action', 'hover:bg-coopmaths-action-lightest', 'dark:hover:bg-coopmathsdark-action-lightest', 'p-2')
  return button
}

export function createTextInput ({ placeholder = '', autoCorrect = true } : {placeholder?: string, autoCorrect?: boolean} = {}) {
  const input = document.createElement('input')
  input.setAttribute('placeholder', placeholder)
  input.classList.add('mr-4', 'p-2', 'border-2', 'border-coopmaths-action', 'dark:border-coopmathsdark-action', 'focus:border-coopmaths-action-lightest', 'dark:focus:border-coopmathsdark-action-lightest', 'focus:outline-0', 'focus:ring-0', 'focus:border-1', 'bg-coopmaths-canvas', 'dark:bg-coopmathsdark-canvas', 'text-coopmaths-corpus-light', 'dark:text-coopmathsdark-corpus-light')
  input.setAttribute('autocorrect', autoCorrect ? 'on' : 'off')
  input.setAttribute('spellcheck', autoCorrect ? 'true' : 'false')
  return input
}
