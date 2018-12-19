import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {HomeComponent} from './home.component';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from '@angular/common/http';


export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export const routes = [
    {path: '', component: HomeComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: translateHttpLoaderFactory,
              deps: [HttpClient]
            }
          })
    ],
    declarations: [
        HomeComponent
    ]
})
export class HomeModule {
}