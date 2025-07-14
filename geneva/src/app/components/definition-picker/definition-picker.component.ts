import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ToolDefinition } from '../../models/tool-definition.model';
import { ToolDefinitionLoaderService } from '../../services/tool-definition-loader.service';
import { BluetoothService } from '../../services/bluetooth.service';

@Component({
  selector: 'app-definition-picker',
  imports: [CommonModule],
  templateUrl: './definition-picker.component.html',
})
export class DefinitionPickerComponent {

  official$: Observable<ToolDefinition[]>
  unofficial$: Observable<ToolDefinition[]>
  contributed$: Observable<ToolDefinition[]>
  loaded$: Observable<Boolean>
  lastLoaded$: Observable<Date>

  constructor(private definitionService: ToolDefinitionLoaderService, private bluetooth: BluetoothService) {
    this.official$ = definitionService.official$
    this.unofficial$ = definitionService.unofficial$
    this.contributed$ = definitionService.contributed$
    this.loaded$ = definitionService.loaded$
    this.lastLoaded$ = definitionService.lastLoaded$
  }

  useDefinition(definition: ToolDefinition) {
    this.bluetooth.requestTool(definition)
  }

}
