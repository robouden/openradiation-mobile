import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Actions, ofActionDispatched, ofActionErrored, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AutoUnsubscribePage } from '../../../components/auto-unsubscribe/auto-unsubscribe.page';
import { Measure, MeasureSeries, MeasureType, PositionAccuracyThreshold } from '../../../states/measures/measure';
import {
  DeleteAllMeasures,
  DeleteMeasure,
  PublishMeasure,
  ShowMeasure
} from '../../../states/measures/measures.action';
import { MeasuresState } from '../../../states/measures/measures.state';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss']
})
export class HistoryPage extends AutoUnsubscribePage {
  @Select(MeasuresState.measures)
  measures$: Observable<(Measure | MeasureSeries)[]>;

  measureBeingSentMap: { [K: string]: boolean } = {};
  positionAccuracyThreshold = PositionAccuracyThreshold;
  measureType = MeasureType;

  measureSeriesMessageMapping = {
    '=1': _('HISTORY.MEASURE_SERIES.SINGULAR'),
    other: _('HISTORY.MEASURE_SERIES.PLURAL')
  };

  url = '/tabs/(history:history)';

  constructor(
    protected router: Router,
    private store: Store,
    private alertController: AlertController,
    private translateService: TranslateService,
    private actions$: Actions,
    private toastController: ToastController,
    private navController: NavController
  ) {
    super(router);
  }

  pageEnter() {
    super.pageEnter();
    this.subscriptions.push(
      this.actions$.pipe(ofActionErrored(PublishMeasure)).subscribe(({ measure }: PublishMeasure) => {
        this.measureBeingSentMap[measure.id] = false;
        this.toastController
          .create({
            message: this.translateService.instant('HISTORY.SEND_ERROR'),
            showCloseButton: true,
            duration: 3000,
            closeButtonText: this.translateService.instant('GENERAL.OK')
          })
          .then(toast => toast.present());
      }),
      this.actions$.pipe(ofActionDispatched(PublishMeasure)).subscribe(({ measure }: PublishMeasure) => {
        this.measureBeingSentMap[measure.id] = true;
      }),
      this.actions$
        .pipe(ofActionSuccessful(PublishMeasure))
        .subscribe(({ measure }: PublishMeasure) => (this.measureBeingSentMap[measure.id] = false)),
      this.actions$.pipe(ofActionSuccessful(ShowMeasure)).subscribe(action => {
        this.navController.navigateRoot(
          ['measure', action.measure.type === MeasureType.Measure ? 'report' : 'report-series'],
          true,
          {
            queryParams: { goBackHistory: true }
          }
        );
      })
    );
  }

  showDetail(measure: Measure) {
    this.store.dispatch(new ShowMeasure(measure));
  }

  publish(event: Event, measure: Measure | MeasureSeries) {
    event.stopPropagation();
    if (this.canSendMeasure(measure)) {
      this.alertController
        .create({
          header: this.translateService.instant('HISTORY.TITLE'),
          subHeader: this.translateService.instant('HISTORY.SEND.TITLE'),
          message: this.translateService.instant('HISTORY.SEND.NOTICE'),
          backdropDismiss: false,
          buttons: [
            {
              text: this.translateService.instant('GENERAL.NO')
            },
            {
              text: this.translateService.instant('GENERAL.YES'),
              handler: () => this.store.dispatch(new PublishMeasure(measure))
            }
          ]
        })
        .then(alert => alert.present());
    }
  }

  canSendMeasure(measure: Measure | MeasureSeries): boolean {
    return (
      measure.type === MeasureType.MeasureSeries ||
      (measure.accuracy !== undefined &&
        measure.accuracy < PositionAccuracyThreshold.No &&
        measure.endAccuracy !== undefined &&
        measure.endAccuracy < PositionAccuracyThreshold.No)
    );
  }

  delete(event: Event, measure: Measure) {
    event.stopPropagation();
    this.alertController
      .create({
        header: this.translateService.instant('HISTORY.TITLE'),
        message: this.translateService.instant('HISTORY.DELETE.NOTICE'),
        backdropDismiss: false,
        buttons: [
          {
            text: this.translateService.instant('GENERAL.NO')
          },
          {
            text: this.translateService.instant('GENERAL.YES'),
            handler: () => this.store.dispatch(new DeleteMeasure(measure))
          }
        ]
      })
      .then(alert => alert.present());
  }

  deleteAll() {
    this.alertController
      .create({
        header: this.translateService.instant('HISTORY.TITLE'),
        subHeader: this.translateService.instant('HISTORY.DELETE_ALL.TITLE'),
        message: this.translateService.instant('HISTORY.DELETE_ALL.NOTICE'),
        backdropDismiss: false,
        buttons: [
          {
            text: this.translateService.instant('GENERAL.NO')
          },
          {
            text: this.translateService.instant('GENERAL.YES'),
            handler: () => this.store.dispatch(new DeleteAllMeasures())
          }
        ]
      })
      .then(alert => alert.present());
  }
}
