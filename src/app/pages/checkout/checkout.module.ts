import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {CheckoutComponent} from './checkout.component';
import {NgxPayPalModule} from 'ngx-paypal';
import {NgxBraintreeModule} from 'ngx-braintree';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from '@angular/common/http';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export const routes = [
    {path: '', component: CheckoutComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        NgxPayPalModule,
        NgxBraintreeModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: translateHttpLoaderFactory,
              deps: [HttpClient]
            }
          })
    ],
    declarations: [
        CheckoutComponent
    ]
})
export class CheckoutModule {
}
