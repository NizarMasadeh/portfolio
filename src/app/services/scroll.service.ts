

import { Injectable, NgZone } from '@angular/core';
import Lenis from '@studio-freight/lenis';

@Injectable({
    providedIn: 'root'
})
export class ScrollService {
    private lenis: Lenis | null = null;

    constructor(private ngZone: NgZone) { }

    initLenis() {
        this.ngZone.runOutsideAngular(() => {
            this.lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true
            });

            const raf = (time: number) => {
                this.lenis?.raf(time);
                requestAnimationFrame(raf);
            };

            requestAnimationFrame(raf);
        });
    }

    scrollTo(target: string | HTMLElement) {
        this.lenis?.scrollTo(target, {
            offset: -80,
            duration: 1.5
        });
    }
}