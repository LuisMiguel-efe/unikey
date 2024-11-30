import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPorteriaComponent } from './registro-porteria.component';

describe('RegistroPorteriaComponent', () => {
  let component: RegistroPorteriaComponent;
  let fixture: ComponentFixture<RegistroPorteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPorteriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroPorteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
