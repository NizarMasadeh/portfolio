import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'goofy-text-anim1',
  templateUrl: './text-anim1.component.html',
  styleUrls: ['./text-anim1.component.scss']
})
export class TextAnim1Component implements AfterViewInit {

  private texts = [
    "FulllStack Developer",
    "NestJs Obsessed",
    "Guitarist",
    "Poet",
    "Author",
    "Other stuff",
  ];

  private morphTime = 1;
  private cooldownTime = 1;

  private textIndex = this.texts.length - 1;
  private time = new Date();
  private morph = 0;
  private cooldown = this.cooldownTime;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    const elts = {
      text1: this.el.nativeElement.querySelector("#text1"),
      text2: this.el.nativeElement.querySelector("#text2")
    };

    elts.text1.textContent = this.texts[this.textIndex % this.texts.length];
    elts.text2.textContent = this.texts[(this.textIndex + 1) % this.texts.length];

    const animate = () => {
      requestAnimationFrame(animate);

      const newTime = new Date();
      const shouldIncrementIndex = this.cooldown > 0;
      const dt = (newTime.getTime() - this.time.getTime()) / 1000;
      this.time = newTime;

      this.cooldown -= dt;

      if (this.cooldown <= 0) {
        if (shouldIncrementIndex) {
          this.textIndex++;
        }
        this.doMorph(elts);
      } else {
        this.doCooldown(elts);
      }
    };

    animate();
  }

  private doMorph(elts: { text1: HTMLElement; text2: HTMLElement }) {
    this.morph -= this.cooldown;
    this.cooldown = 0;

    let fraction = this.morph / this.morphTime;
    if (fraction > 1) {
      this.cooldown = this.cooldownTime;
      fraction = 1;
    }

    this.setMorph(fraction, elts);
  }

  private setMorph(fraction: number, elts: { text1: HTMLElement; text2: HTMLElement }) {
    elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;
    elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    elts.text1.textContent = this.texts[this.textIndex % this.texts.length];
    elts.text2.textContent = this.texts[(this.textIndex + 1) % this.texts.length];
  }

  private doCooldown(elts: { text1: HTMLElement; text2: HTMLElement }) {
    this.morph = 0;

    elts.text2.style.filter = "";
    elts.text2.style.opacity = "100%";

    elts.text1.style.filter = "";
    elts.text1.style.opacity = "0%";
  }
}