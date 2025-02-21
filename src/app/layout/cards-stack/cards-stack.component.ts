import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-cards-stack',
  imports: [
    CommonModule,
  ],
  templateUrl: './cards-stack.component.html',
  styleUrl: './cards-stack.component.scss',
})
export class CardsStackComponent implements OnInit, AfterViewInit {
  cards = new Array(6);
  private rotations = [-12, 10, -5, 5, -5, -2];

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const lenis = new Lenis();
    
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const cards = gsap.utils.toArray('.card');

    cards.forEach((card: any, index: number) => {
      gsap.set(card, {
        y: window.innerHeight / 2,
        rotate: this.rotations[index],
      });
    });

    ScrollTrigger.create({
      trigger: '.sticky-cards',
      start: 'top top',
      end: `+=${window.innerHeight * 6}px`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalCards = cards.length;
        const progressPerCard = 1 / totalCards;

        cards.forEach((card: any, index: number) => {
          const cardStart = index * progressPerCard;
          let cardProgress = (progress - cardStart) / progressPerCard;
          cardProgress = Math.min(Math.max(cardProgress, 0), 1);

          let yPos = window.innerWidth * (1 - cardProgress);
          let xPos = 0;

          if (cardProgress === 1 && index < totalCards - 1) {
            const remainingProgress = (progress - (cardStart + progressPerCard)) / 
              (1 - (cardStart + progressPerCard));

            if (remainingProgress > 0) {
              const distanceMultiplier = 1 - index * 0.15;
              xPos = -window.innerWidth * 0.3 * distanceMultiplier * remainingProgress;
              yPos = -window.innerHeight * 0.3 * distanceMultiplier * remainingProgress;
            }
          }

          gsap.to(card, {
            y: yPos,
            x: xPos,
            duration: 0,
            ease: 'none',
          });
        });
      },
    });
  }
}