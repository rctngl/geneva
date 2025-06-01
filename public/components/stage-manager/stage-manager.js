class StageManagerComponent extends HTMLElement {
	
	#stage = 1
	
	connectedCallback() {
		
		// Set Nav Buttons
		this.querySelector('#devices').onclick = () => {
			this.#stage = 0
			this.update()
		}
		
		this.querySelector('#dashboard').onclick = () => {
			this.#stage = 1
			this.update()
		}
		
		this.querySelector('#scope').onclick = () => {
			this.#stage = 2
			this.update()
		}
		
		// Set the stage
		this.update();
	}
	
	update() {
		const id = this.getTemplateName();
		const template = document.querySelector(`template#${id}`)
		this.querySelector('#stage').innerHTML = template.innerHTML
	}
	
	getTemplateName() {
		
		switch (this.#stage) {
			case 0:
				return 'stage-devices'
				break;
			case 1:
				return 'stage-dashboard'
				break;
			case 2:
				return 'stage-scope'
				break;
			
		}
		
	}
	
}

export const registerStageManagerComponent = () => {
	customElements.define('x-stage-manager', StageManagerComponent)
}