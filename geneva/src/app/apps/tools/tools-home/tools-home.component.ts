import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-tools-home',
  imports: [HeaderComponent],
  templateUrl: './tools-home.component.html'
})
export class ToolsHomeComponent {
  appName = "Alex"
}
