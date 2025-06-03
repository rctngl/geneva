class StageManagerComponent extends HTMLElement {
	
	#stage = 0
	
	connectedCallback() {
		
		const nav = this.querySelector('nav')
		const buttonTemplate = document.querySelector('template#stage-button').content
		
		// Create Nav buttons for each stage
		
		this.querySelectorAll('x-stage').forEach((stage,index) => {
			
			const button = buttonTemplate.querySelector('button').cloneNode()
			const title = stage.getAttribute('title')
			
			button.innerText = title
			
			button.onclick = () => {
				this.#stage = index
				this.update()
			}
			
			nav.appendChild(button)
		})
		
		// Set the stage
		this.update();
	}
	
	update() {
		// Set active state for each stage
		this.querySelectorAll('x-stage').forEach((stage,index) => {
			stage.setAttribute('active', index === this.#stage)
		})
	}
}

/**
 * Usage:
 * <x-stage active="true" template="template-id" title="Stage Title"></x-stage>
 */

class StageComponent extends HTMLElement {
	
	static get observedAttributes() {
		return ['active']
	}
	
	connectedCallback() {
		const templateId = this.getAttribute('template')
		
		if (!templateId) {
			return
		}
		
		const template = document.querySelector(`template#${templateId}`)
		this.appendChild(template.content)
	}
	
	attributeChangedCallback() {
		this.update()
	}
	
	update() {
		const style = (this.getAttribute('active') === "false") ? "display:none;" : ""
		this.style = style
	}
	
}

export const registerStageManagerComponent = () => {
	customElements.define('x-stage', StageComponent)
	customElements.define('x-stage-manager', StageManagerComponent)
}