import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import Lenis from '@studio-freight/lenis';
import { LoadingService } from './services/loading.service';
import { ScrollService } from './services/scroll.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* => *', [
        style({ position: 'relative' }),
        style({
          opacity: 0,
          transform: 'scale(0.95) translateY(30px)',
          filter: 'blur(10px)'
        }),
        animate('0.8s cubic-bezier(0.16, 1, 0.3, 1)', style({
          opacity: 1,
          transform: 'scale(1) translateY(0)',
          filter: 'blur(0)'
        }))
      ])
    ])
  ],
})
export class AppComponent implements OnInit {
  private loadingService = inject(LoadingService);
  private scrollService = inject(ScrollService);
  loading$ = this.loadingService.loading$;

  ngOnInit() {
    this.scrollService.initLenis();

    setTimeout(() =>
      this.loadingService.setLoading(false),
      2000);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? '';
  }

}