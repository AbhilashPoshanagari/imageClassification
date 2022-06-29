import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IotEsp32Component } from './iot-esp32.component';

describe('IotEsp32Component', () => {
  let component: IotEsp32Component;
  let fixture: ComponentFixture<IotEsp32Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IotEsp32Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IotEsp32Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
