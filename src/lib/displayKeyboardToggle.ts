const styleKeyboard = document.createElement('style')
document.head.appendChild(styleKeyboard)

export default function displayKeyboardToggle (isVisible: boolean) {
  if (isVisible) {
    styleKeyboard.innerHTML = `
        math-field::part(virtual-keyboard-toggle) {
          display: none;
      }
        `
  } else {
    styleKeyboard.innerHTML = ''
  }
}
