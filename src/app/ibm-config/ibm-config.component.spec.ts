import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbmConfigComponent } from './ibm-config.component';

describe('IbmConfigComponent', () => {
  let component: IbmConfigComponent;
  let fixture: ComponentFixture<IbmConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbmConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbmConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
