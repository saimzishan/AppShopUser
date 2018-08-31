import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {SignInComponent} from './sign-in.component';
import {SignInService} from "./sign-in.service";

export const routes = [
    {path: '', component: SignInComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        SharedModule
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
