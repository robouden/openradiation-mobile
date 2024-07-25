import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './pages/menu/menu.component';
import { DevicesState } from './states/devices/devices.state';
import { MeasuresState } from './states/measures/measures.state';
import { UserState } from './states/user/user.state';

@NgModule({
    declarations: [AppComponent, MenuComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot({
            name: 'ord-db',
            driverOrder: ['sqlite']
        }),
        NgxsModule.forRoot([DevicesState, MeasuresState, UserState]),
        NgxsFormPluginModule.forRoot(),
        NgxsLoggerPluginModule.forRoot({
            disabled: environment.production
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        HttpClientModule
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        DatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
