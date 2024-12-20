import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Platform } from '@ionic/angular';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AutoUnsubscribePage } from '@app/components/auto-unsubscribe/auto-unsubscribe.page';
import { SelectIconOption } from '@app/components/select-icon/select-icon-option';
import { NavigationService } from '@app/services/navigation.service';
import { AbstractMeasure, FlightNumberMask, Measure, MeasureEnvironment } from '@app/states/measures/measure';
import {
  AddRecentTag,
  CancelMeasure,
  FlightNumberValidation,
  StopMeasure,
  StopMeasureSeries,
} from '@app/states/measures/measures.action';
import { MeasuresState } from '@app/states/measures/measures.state';
import { UserState } from '@app/states/user/user.state';
import { MeasuresService } from '@app/states/measures/measures.service';
import { TranslateService } from '@ngx-translate/core';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';

export abstract class AbstractMeasureReportPage<T extends AbstractMeasure> extends AutoUnsubscribePage {
  login$: Observable<string | undefined> = inject(Store).select(UserState.login);

  recentTags$: Observable<string[]> = inject(Store).select(MeasuresState.recentTags);

  measureReportForm?: UntypedFormGroup;
  reportScan = true;
  positionChangeSpeedOverLimit = false;
  positionChangeAltitudeOverLimit = false;
  fromHistory = false;

  measurementEnvironmentOptions: SelectIconOption[];

  measurementHeightOptions: SelectIconOption[] = [
    {
      iconOn: 'assets/img/icon-floor-on.png',
      iconOff: 'assets/img/icon-floor-off.png',
      label: 'MEASURES.SENSOR_POSITION.FLOOR' as string,
      value: 0,
    },
    {
      iconOn: 'assets/img/icon-elevated-on.png',
      iconOff: 'assets/img/icon-elevated-off.png',
      label: 'MEASURES.SENSOR_POSITION.1_METER_HIGH' as string,
      value: 1,
    },
  ];

  rainOptions: SelectIconOption[] = [
    {
      iconOn: 'assets/img/icon-sun-on.png',
      iconOff: 'assets/img/icon-sun-off.png',
      label: 'MEASURES.WEATHER.NO_RAIN' as string,
      value: false,
    },
    {
      iconOn: 'assets/img/icon-rain-on.png',
      iconOff: 'assets/img/icon-rain-off.png',
      label: 'MEASURES.WEATHER.RAIN' as string,
      value: true,
    },
  ];

  stormOptions: SelectIconOption[] = [
    {
      iconOn: 'assets/img/icon-plane-on.png',
      iconOff: 'assets/img/icon-plane-off.png',
      label: 'MEASURES.WEATHER.NO_STORM' as string,
      value: false,
    },
    {
      iconOn: 'assets/img/icon-plane-storm-on.png',
      iconOff: 'assets/img/icon-plane-storm-off.png',
      label: _('MEASURES.WEATHER.STORM') as string,
      value: true,
    },
  ];

  windowSeatOptions: SelectIconOption[] = [
    {
      iconOn: 'assets/img/icon-aisle-on.png',
      iconOff: 'assets/img/icon-aisle-off.png',
      label: _('MEASURES.SENSOR_POSITION.NO_WINDOW_SIDE') as string,
      value: false,
    },
    {
      iconOn: 'assets/img/icon-window-on.png',
      iconOff: 'assets/img/icon-window-off.png',
      label: _('MEASURES.SENSOR_POSITION.WINDOW_SIDE') as string,
      value: true,
    },
  ];

  protected exampleFlightNumber = { message: ': AF179' };
  protected exampleSeatNumber = { message: ': C15' };
  protected flightNumberWarningMessage = '';
  readonly flightMask: MaskitoOptions = new FlightNumberMask(this.store);
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  protected constructor(
    protected router: Router,
    protected store: Store,
    protected activatedRoute: ActivatedRoute,
    protected navigationService: NavigationService,
    protected actions$: Actions,
    protected platform: Platform,
    protected measureService: MeasuresService,
    protected translateService: TranslateService,
  ) {
    super(router);
  }

  init() {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((queryParams) => {
      if (queryParams.goBackHistory) {
        this.fromHistory = true;
        this.subscriptions.push(
          this.actions$.pipe(ofActionSuccessful(StopMeasureSeries, CancelMeasure, StopMeasure)).subscribe(() => {
            this.measureReportForm = undefined;
            this.navigationService.pop();
          }),
        );
        this.subscriptions.push(this.platform.backButton.subscribeWithPriority(9999, () => this.cancelMeasure()));
      } else {
        this.subscriptions.push(
          this.actions$.pipe(ofActionSuccessful(StopMeasureSeries, CancelMeasure, StopMeasure)).subscribe(() => {
            this.measureReportForm = undefined;
            this.navigationService.navigateRoot(['tabs', 'home']);
          }),
        );
      }
    });

    this.actions$.pipe(ofActionSuccessful(FlightNumberValidation)).subscribe((flightNumberValidation) => {
      if (flightNumberValidation.isValid) {
        this.flightNumberWarningMessage = '';
      } else {
        this.flightNumberWarningMessage = this.translateService.instant('MEASURES.FLIGHT.MASK');
      }
    });
  }

  cancelMeasure() {
    this.store.dispatch(new CancelMeasure());
  }

  protected updateMeasurementEnvironmentOptions() {
    this.measurementEnvironmentOptions = [
      {
        iconOn: 'assets/img/icon-countryside-on.png',
        iconOff: 'assets/img/icon-countryside-off.png',
        label: _('MEASURES.ENVIRONMENT.COUNTRYSIDE') as string,
        value: MeasureEnvironment.Countryside,
        disabled: this.positionChangeSpeedOverLimit,
      },
      {
        iconOn: 'assets/img/icon-city-on.png',
        iconOff: 'assets/img/icon-city-off.png',
        label: _('MEASURES.ENVIRONMENT.CITY') as string,
        value: MeasureEnvironment.City,
        disabled: this.positionChangeSpeedOverLimit,
      },
      {
        iconOn: 'assets/img/icon-inside-on.png',
        iconOff: 'assets/img/icon-inside-off.png',
        label: _('MEASURES.ENVIRONMENT.INSIDE') as string,
        value: MeasureEnvironment.Inside,
        disabled: this.positionChangeSpeedOverLimit,
      },
      {
        iconOn: 'assets/img/icon-ontheroad-on.png',
        iconOff: 'assets/img/icon-ontheroad-off.png',
        label: _('MEASURES.ENVIRONMENT.ON_THE_ROAD') as string,
        value: MeasureEnvironment.OnTheRoad,
      },
    ];
  }

  protected static hasPositionChanged(measure: Measure): boolean {
    const lat = measure!.latitude;
    const long = measure!.longitude;
    const endLat = measure!.endLatitude;
    const endLong = measure!.endLongitude;
    const duration = (measure!.endTime! + 5000 - measure!.startTime) / 60000;
    if (lat !== undefined && long !== undefined && endLat !== undefined && endLong !== undefined && duration > 0) {
      return AbstractMeasureReportPage.checkPositionChangeSpeed(lat, long, endLat, endLong, duration);
    } else {
      return false;
    }
  }

  private static checkPositionChangeSpeed(
    lat: number,
    long: number,
    endLat: number,
    endLong: number,
    duration: number,
  ): boolean {
    let speed;
    const distance = AbstractMeasureReportPage.getDistance(lat, long, endLat, endLong);
    if (distance > 0) {
      speed = (distance * 60) / duration;
    } else {
      return false;
    }
    return speed > 25;
  }

  private static getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const earth_radius = 6378137;
    const rlo1 = (Math.PI * lng1) / 180;
    const rla1 = (Math.PI * lat1) / 180;
    const rlo2 = (Math.PI * lng2) / 180;
    const rla2 = (Math.PI * lat2) / 180;
    const dlo = (rlo2 - rlo1) / 2;
    const dla = (rla2 - rla1) / 2;
    const a = Math.sin(dla) * Math.sin(dla) + Math.cos(rla1) * Math.cos(rla2) * (Math.sin(dlo) * Math.sin(dlo));
    const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (earth_radius * d) / 1000;
  }

  tagAdded(tag: string) {
    this.store.dispatch(new AddRecentTag(tag));
  }

  abstract canPublish(measure: T): boolean;

  protected static positionChangeAltitudeOverLimit(altitude: number | undefined): boolean {
    return altitude !== undefined && altitude > 6000;
  }

  protected abstract initMeasurementEnvironmentOptions(measure: T): void;
  protected abstract initPositionChangeAltitudeOverLimit(measure: T): void;
}
