import { Component, signal } from '@angular/core';
import { UnityPlayer } from './unity-player/unity-player';

@Component({
  selector: 'app-root',
  imports: [UnityPlayer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('portfolio-game');
}
