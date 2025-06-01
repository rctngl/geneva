// Components
import { registerStageManagerComponent } from './components/stage-manager/stage-manager.js'

// Core App Layout
import { registerApp } from './app/app.js'

const app = () => {
	
	// Components
	registerStageManagerComponent()
	
	// Core App Layout
	registerApp()
	
	// Load initial layout template
	const template = document.querySelector('template#root')
	
	if (template) {
		document.body.appendChild(template.content, true)
	}
	
}

document.addEventListener('DOMContentLoaded', app)