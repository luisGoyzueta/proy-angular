import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AccessibleChart } from './accessible-chart';

describe('AccessibleChart', () => {
  it('should create an instance', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div'),
    };

    TestBed.configureTestingModule({
      providers: [
        AccessibleChart,
        { provide: ElementRef, useValue: mockElementRef },
      ],
    });

    const directive = TestBed.inject(AccessibleChart);
    expect(directive).toBeTruthy();
  });
});
