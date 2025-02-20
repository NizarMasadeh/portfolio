import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { LiquidBackgroundComponent } from "../widgets/liquid-background/liquid-background.component";
import { TextAnim1Component } from "../widgets/text-anim1/text-anim1.component";
import { CardsStackComponent } from "../../layout/cards-stack/cards-stack.component";

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

  skills = [
    {
      name: 'Angular',
      icon: 'devicon-angular-plain',
      color: '#dd0031',
      description: 'Building robust, scalable web applications with Angular framework',
      experience: 95
    },
    {
      name: 'NestJS',
      icon: 'devicon-nestjs-plain',
      color: '#e0234e',
      description: 'Creating efficient backend services with NestJS framework',
      experience: 90
    },
    {
      name: 'PostgreSQL',
      icon: 'devicon-postgresql-plain',
      color: '#336791',
      description: 'Designing and optimizing database structures',
      experience: 85
    },
    {
      name: 'RxJS',
      icon: 'devicon-rxjs-plain',
      color: '#b7178c',
      description: 'Handling complex async operations and state management',
      experience: 92
    },
    {
      name: 'NodeJS',
      icon: 'devicon-nodejs-plain',
      color: '#339933',
      description: 'Server-side JavaScript development and API creation',
      experience: 88
    },
    {
      name: 'ExpressJS',
      icon: 'devicon-express-original',
      color: '#000000',
      description: 'Fast, unopinionated web framework for Node.js',
      experience: 87
    }
  ];

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