import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAnim1Component } from './text-anim1.component';

describe('TextAnim1Component', () => {
  let component: TextAnim1Component;
  let fixture: ComponentFixture<TextAnim1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextAnim1Component]
    });
    fixture = TestBed.createComponent(TextAnim1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
