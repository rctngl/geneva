import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';

import { ToolDefinitionLoaderService } from './services/tool-definition-loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MobileHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  private loader = inject(ToolDefinitionLoaderService)
  title = 'geneva'

  handleSidebar(): void {
    let check = document.getElementById('app-sidebar')

    if (check) {
      check.click()
    }
  }

  ngOnInit() {
    this.loader.loadToolDefinitions();
  }
  

}
