import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityChooseComponent } from './city-choose.component';

describe('CityChooseComponent', () => {
  let component: CityChooseComponent;
  let fixture: ComponentFixture<CityChooseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityChooseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityChooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
