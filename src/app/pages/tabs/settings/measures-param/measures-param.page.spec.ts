import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasuresParamPage } from './measures-param.page';

import { getTestImports, getTestProviders } from '../../../../../tests/TestUtils'

describe('MeasuresParamPage', () => {
  let component: MeasuresParamPage;
  let fixture: ComponentFixture<MeasuresParamPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MeasuresParamPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
      ,
      imports: getTestImports(),
      providers: getTestProviders()
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasuresParamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
