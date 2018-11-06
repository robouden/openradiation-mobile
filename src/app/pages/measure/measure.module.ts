import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MeasureReportPageModule } from './measure-report/measure-report.module';
import { MeasureRoutingModule } from './measure-routing.module';
import { MeasureScanPageModule } from './measure-scan/measure-scan.module';
import { MeasureStepsPageModule } from './measure-steps/measure-steps.module';
import { MeasureSeriesPageModule } from './measure-series/measure-series.module';
import { MeasureReportSeriesPageModule } from './measure-report-series/measure-report-series.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MeasureRoutingModule,
    MeasureSeriesPageModule,
    MeasureReportPageModule,
    MeasureReportSeriesPageModule,
    MeasureScanPageModule,
    MeasureStepsPageModule
  ],
  declarations: []
})
export class MeasureModule {}
