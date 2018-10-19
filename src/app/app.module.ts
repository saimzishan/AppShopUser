import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgxSpinnerModule} from 'ngx-spinner';
import {AgmCoreModule} from '@agm/core';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
// import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import {OverlayContainer} from '@angular/cdk/overlay';
import {CustomOverlayContainer} from './theme/utils/custom-overlay-container';

import {SharedModule} from './shared/shared.module';
import {routing} from './app.routing';
import {AppComponent} from './app.component';
import {PagesComponent} from './pages/pages.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {TopMenuComponent} from './theme/components/top-menu/top-menu.component';
import {MenuComponent} from './theme/components/menu/menu.component';
import {SidenavMenuComponent} from './theme/components/sidenav-menu/sidenav-menu.component';
import {BreadcrumbComponent} from './theme/components/breadcrumb/breadcrumb.component';

import {AppSettings} from './app.settings';
import {AppService} from './app.service';
import {AppInterceptor} from './theme/utils/app-interceptor';
import {OptionsComponent} from './theme/components/options/options.component';
import {FooterComponent} from './theme/components/footer/footer.component';
import {DetectChangesService} from './shared/detectchanges.service';
import {DEFAULT_DROPZONE_CONFIG, PrintingOptionsComponent} from './dialogs/printing-options.component';



@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgxSpinnerModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB3HQ_Gk_XRt6KitPdiHQNGpVn0NDwQGMI'
        }),
        SharedModule,
        routing,
        DropzoneModule
    ],
    declarations: [
        AppComponent,
        PagesComponent,
        NotFoundComponent,
        TopMenuComponent,
        MenuComponent,
        SidenavMenuComponent,
        BreadcrumbComponent,
        OptionsComponent,
        FooterComponent,
        PrintingOptionsComponent
    ],
    providers: [
        AppSettings,
        AppService,
        DetectChangesService,
        {provide: OverlayContainer, useClass: CustomOverlayContainer},
        {provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true},
        { provide: DROPZONE_CONFIG, useValue: DEFAULT_DROPZONE_CONFIG }
    ],
    entryComponents: [
        PrintingOptionsComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
