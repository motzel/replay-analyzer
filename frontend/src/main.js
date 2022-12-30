import './style.css'
import './stores/settings'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app
