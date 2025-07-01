import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { HeaderComponent } from '../../../components/header/header.component';
import { ToolDefinitionLoaderService } from '../../../services/tool-definition-loader.service';
import { ToolDefinition } from '../../../models/tool-definition.model';

@Component({
  selector: 'app-tools-home',
  imports: [CommonModule,HeaderComponent],
  templateUrl: './tools-home.component.html'
})
export class ToolsHomeComponent {
  
  official$: Observable<ToolDefinition[]>
  unofficial$: Observable<ToolDefinition[]>
  contributed$: Observable<ToolDefinition[]>
  loaded$: Observable<Boolean>
  lastLoaded$: Observable<Date>

  constructor(private definitionService: ToolDefinitionLoaderService) {
    this.official$ = definitionService.official$
    this.unofficial$ = definitionService.unofficial$
    this.contributed$ = definitionService.contributed$
    this.loaded$ = definitionService.loaded$
    this.lastLoaded$ = definitionService.lastLoaded$
  }

  // ngAfterContentInit() {
  //   document.getElementById("add_button")!.click()
  // }

}
