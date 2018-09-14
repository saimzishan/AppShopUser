import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {CheckoutComponent} from './checkout.component';
import {NgxPayPalModule} from 'ngx-paypal';

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
        NgxPayPalModule
    ],
    declarations: [
        CheckoutComponent
    ]
})
export class CheckoutModule {
}
