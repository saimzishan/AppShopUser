import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import {MyOrdersComponent} from "./my-orders.component";

export const routes = [
    { path: '', component: MyOrdersComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        MyOrdersComponent
    ]
})
export class MyOrdersModule { }
