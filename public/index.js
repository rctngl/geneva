import { registerAvatarComponent } from './components/avatar/avatar.js'
import { registerBadgeComponent } from './components/badge/badge.js'
import { registerHeaderComponent } from './components/header/header.js'

const app = () => {
	registerAvatarComponent()
	registerBadgeComponent()
	registerHeaderComponent()
}

document.addEventListener('DOMContentLoaded', app)