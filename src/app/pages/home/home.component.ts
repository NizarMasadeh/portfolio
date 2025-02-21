import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { LiquidBackgroundComponent } from "../widgets/liquid-background/liquid-background.component";
import { TextAnim1Component } from "../widgets/text-anim1/text-anim1.component";
import { CardsStackComponent } from "../../layout/cards-stack/cards-stack.component";
import { SKILLS } from './skills';

interface Skill {
  name: string;
  icon: string;
  color: string;
  description: string;
  experience: number;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    // LiquidBackgroundComponent,
    TextAnim1Component,
    CardsStackComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private el = inject(ElementRef);

  showGoofyText: boolean = false;

  skills = SKILLS;

  ngOnInit() {
    
    setTimeout(() => {
      this.showGoofyText = true;
    }, 2000);
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-content', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.scroll-indicator', {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 1,
      ease: 'power3.out'
    });

    gsap.utils.toArray('.skill-card').forEach((card: any, index: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out',
        onComplete: () => {
          const progress = card.querySelector('.skill-progress');
          if (progress) {
            gsap.to(progress, {
              width: `${this.skills[index].experience}%`,
              duration: 1.5,
              ease: 'power2.out'
            });
          }
        }
      });
    });
  }
}