import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MobileHeaderComponent } from './components/mobile-header/mobile-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MobileHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'geneva';
}
