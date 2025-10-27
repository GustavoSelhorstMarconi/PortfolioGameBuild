import { CommonModule, DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';

declare const createUnityInstance: any;
interface UnityInstance {
  SetFullscreen(mode: number): void;
  SendMessage(objectName: string, methodName: string, value?: any): void;
  Quit(): Promise<void>;
  Module?: any;
}

@Component({
  selector: 'app-unity-player',
  imports: [DecimalPipe, CommonModule],
  templateUrl: './unity-player.html',
  styleUrl: './unity-player.scss',
})
export class UnityPlayer implements AfterViewInit, OnDestroy {
  @ViewChild('unityCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  unityInstance: UnityInstance | null = null;
  progress = 0;
  loading = true;

  private buildUrl = 'assets/unity/Build';
  private loaderUrl = `${this.buildUrl}/PortfolioGameBuild.loader.js`;
  private config = {
    dataUrl: `${this.buildUrl}/PortfolioGameBuild.data`,
    frameworkUrl: `${this.buildUrl}/PortfolioGameBuild.framework.js`,
    codeUrl: `${this.buildUrl}/PortfolioGameBuild.wasm`,
    companyName: 'DefaultCompany',
    productName: 'Portfolio',
    productVersion: '0.1.0',
  };

  ngAfterViewInit(): void {
    this.loadUnity();
    this.adjustCanvasSize();
  }

  ngOnDestroy(): void {
    if (this.unityInstance) {
      this.unityInstance.Quit();
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[data-src="${src}"]`)) {
        resolve();
        return;
      }

      const scriptElement = document.createElement('script');
      scriptElement.src = src;
      scriptElement.async = true;
      scriptElement.setAttribute('data-src', src);
      scriptElement.onload = () => resolve();
      scriptElement.onerror = (e) =>
        reject(new Error(`Failed to load script ${src}`));
      document.body.appendChild(scriptElement);
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustCanvasSize();
  }

  private adjustCanvasSize() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private async loadUnity() {
    try {
      await this.loadScript(this.loaderUrl);

      const canvas = this.canvasRef.nativeElement;
      createUnityInstance(canvas, this.config, (progress: number) => {
        this.progress = progress;
      })
        .then((instance: any) => {
          this.unityInstance = instance;
          this.loading = false;
          instance.SetFullscreen(1);
        })
        .catch((err: any) => {
          console.error('Failed to instantiate unity:', err);
        });
    } catch (err) {
      console.error('Erro ao carregar loader do unity:', err);
    }
  }

  sendMessageToUnity() {
    if (!this.unityInstance) return;

    this.unityInstance.SendMessage(
      'GameManager',
      'OnMessage',
      'Olá do angular!'
    );
  }

  pauseUnity() {
    if (this.unityInstance) this.unityInstance.SetFullscreen(0);
  }

  resumeUnity() {
    if (this.unityInstance) this.unityInstance.SetFullscreen(1);
  }
}
