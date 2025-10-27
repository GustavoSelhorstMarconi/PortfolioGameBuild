import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnityPlayer } from './unity-player';

describe('UnityPlayer', () => {
  let component: UnityPlayer;
  let fixture: ComponentFixture<UnityPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnityPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnityPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
