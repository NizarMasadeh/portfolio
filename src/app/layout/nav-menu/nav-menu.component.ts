import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { gsap } from 'gsap';
import { CSSRulePlugin } from 'gsap/CSSRulePlugin';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  imports: [CommonModule],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit, OnDestroy {
  isOpen = false;
  timeline: gsap.core.Timeline;
  currentRoute = '';
  private routerSubscription: Subscription;

  constructor(
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {
    gsap.registerPlugin(CSSRulePlugin);
    this.timeline = gsap.timeline({ paused: true });

    this.currentRoute = this._router.url;

    this.routerSubscription = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        this._cdr.detectChanges();
      }
    });
  }

  ngOnInit() {
    gsap.set('.menu-item p', { y: 255 });

    this.timeline
      .to('.overlay', {
        duration: 1.5,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ease: 'power4.inOut'
      })
      .to('.menu-item p', {
        duration: 1.5,
        y: 0,
        stagger: 0.2,
        ease: 'power4.out'
      }, '-=1')
      .to('.sub-nav', {
        bottom: '10%',
        opacity: 1,
        duration: 0.5,
        delay: 0.5
      }, '<');
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    if (this.isOpen) {
      this.timeline.reverse();
    } else {
      this.timeline.play();
    }
    this.isOpen = !this.isOpen;
  }

  navigateAndClose(path: string) {
    this._router.navigate([path]);
    if (this.isOpen) {
      this.toggleMenu();
    }
  }

  isActive(path: string): boolean {
    if (path === '/') {
      return this.currentRoute === '/';
    }
    return this.currentRoute.startsWith(path);
  }
}