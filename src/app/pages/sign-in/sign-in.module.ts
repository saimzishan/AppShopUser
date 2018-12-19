import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {SignInComponent} from './sign-in.component';
import {SignInService} from "./sign-in.service";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from '@angular/common/http';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export const routes = [
    {path: '', component: SignInComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
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
        SignInComponent
    ],
    providers: [
        SignInService
    ]
})
export class SignInModule {
}
