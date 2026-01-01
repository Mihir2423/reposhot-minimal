import { Repository } from '@/types';
import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { domToPng } from 'modern-screenshot';
import { ThemeService } from '@/app/services/theme/theme.service';

@Component({
  selector: 'reposhot-canvas',
  standalone: true,
  templateUrl: './canvas.html',
})
export class Canvas {
  canvasData = input.required<Repository>();
  cardElement = viewChild.required<ElementRef<HTMLElement>>('cardElement');

  protected themeService = inject(ThemeService);

  getResolvedTheme(): 'light' | 'dark' {
    const currentTheme = this.themeService.theme();
    if (currentTheme !== 'system') {
      return currentTheme as 'light' | 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  async downloadImage() {
    const el = this.cardElement().nativeElement;
    const isDark = this.getResolvedTheme() === 'dark';

    try {
      const dataUrl = await domToPng(el, {
        scale: 2,
        quality: 1,
        backgroundColor: isDark ? '#121214' : '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `RS-${this.getResolvedTheme().toUpperCase()}-${this.canvasData().name.toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Snapshot failed', err);
    }
  }
}
