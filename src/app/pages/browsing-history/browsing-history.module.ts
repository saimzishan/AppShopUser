import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from '../../shared/shared.module';
import {BrowsingHistoryComponent} from "./browsing-history.component";
import { TreeModule } from "angular-tree-component";

export const routes = [
    { path: '', component: BrowsingHistoryComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        SharedModule,
        NgxPaginationModule,
        TreeModule
    ],
    declarations: [
        BrowsingHistoryComponent
    ]
})
export class BrowsingHistoryModule { }
