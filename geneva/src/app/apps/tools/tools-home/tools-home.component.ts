import { Component } from '@angular/core';

import { HeaderComponent } from '../../../components/header/header.component';
import { DefinitionPickerComponent } from '../../../components/definition-picker/definition-picker.component';

@Component({
  selector: 'app-tools-home',
  imports: [HeaderComponent, DefinitionPickerComponent],
  templateUrl: './tools-home.component.html'
})
export class ToolsHomeComponent {

}
