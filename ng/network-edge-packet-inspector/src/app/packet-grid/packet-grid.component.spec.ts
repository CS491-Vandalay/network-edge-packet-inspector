import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketGridComponent } from './packet-grid.component';

describe('DeviceGridComponent', () => {
  let component: PacketGridComponent;
  let fixture: ComponentFixture<PacketGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacketGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacketGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
