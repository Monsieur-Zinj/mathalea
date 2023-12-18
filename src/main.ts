import 'boxicons/css/boxicons.min.css'
import './app.css'
import App from './components/App.svelte'
import './bugsnag'

const app = new App({
  target: document.getElementById('appMathalea') as HTMLElement
})

export default app
