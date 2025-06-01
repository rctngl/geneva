class App extends HTMLElement {
	
	connectedCallback() {
		console.log("App component loaded")
	}
	
}

export const registerApp = () => {
	customElements.define('x-app', App)
}