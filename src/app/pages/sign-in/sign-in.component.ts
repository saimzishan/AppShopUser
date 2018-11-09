import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {emailValidator, matchingPasswords} from '../../theme/utils/app-validators';
import {SignInService} from './sign-in.service';
import {User} from '../../app.models';
import {DetectChangesService} from '../../shared/detectchanges.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
    loginForm: FormGroup;
    registerForm: FormGroup;
    guestForm: FormGroup;
    errMessage = '';
    guestUser = JSON.parse(localStorage.getItem('guestUser'));

    constructor(public formBuilder: FormBuilder,
                public router: Router,
                public snackBar: MatSnackBar,
                public signInService: SignInService,
                private detectChanges: DetectChangesService,
                private spinner: NgxSpinnerService) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            'email': ['', Validators.compose([Validators.required, emailValidator])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });

        this.guestForm = this.formBuilder.group({
            'email': [this.guestUser ? this.guestUser.email : '', Validators.compose([Validators.required, emailValidator])]
        });

        this.registerForm = this.formBuilder.group({
            'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'email': ['', Validators.compose([Validators.required, emailValidator])],
            'password': ['', Validators.required],
            'confirmPassword': ['', Validators.required],
            'phone': ['', Validators.compose([Validators.required])],
        }, {validator: matchingPasswords('password', 'confirmPassword')});

    }

    public onLoginFormSubmit(values: Object): void {
        if (this.loginForm.valid) {

            this.signInService.loginUser(values).subscribe(data => {
                    console.log(data);
                    if (data.error === false) {
                        localStorage.setItem('currentUser', JSON.stringify(data));
                        console.log(JSON.parse(localStorage.getItem('guestUser')));
                        localStorage.removeItem('guestUser');
                        // const currUser = JSON.parse(localStorage.getItem('currentUser'));
                        // localStorage.removeItem('currentUser');
                        console.log('logged in');
                        this.detectChanges.notifyOther({
                            option: 'loggedIn',
                            value: true
                        });
                        this.router.navigate(['/checkout']);
                    }
                },
                err => {
                    this.spinner.hide();
                    this.errMessage = this.signInService.getErrorMessage(err);
                    console.log(this.errMessage);
                });
        }
    }

    public onGuestFormSubmit(values: Object): void {
        console.log(values);
        if (this.guestForm.valid) {
            localStorage.setItem('guestUser', JSON.stringify(values));
            this.router.navigate(['/checkout']);
        }
    }

    public onRegisterFormSubmit(values: User): void {
        console.log(values);
        if (this.registerForm.valid) {
            delete values.confirmPassword;
            console.log(values);
            // values.roles = 'MobileClient';
            this.signInService.registerUser(values).subscribe(data => {
                    console.log(data);
                    if (!data.error) {
                        localStorage.setItem('currentUser', JSON.stringify(data));
                        // const currUser = JSON.parse(localStorage.getItem('currentUser'));
                        localStorage.removeItem(JSON.parse(localStorage.getItem('guestUser')));
                        this.snackBar.open('User Created Successfully', '×', {
                            panelClass: 'success',
                            verticalPosition: 'top',
                            duration: 1000
                        });
                        this.detectChanges.notifyOther({
                            option: 'loggedIn',
                            value: true
                        });
                        console.log(data);
                        setTimeout(() => {
                            this.router.navigate(['/checkout']);
                        }, 3000);
                    } else {
                        this.snackBar.open('User Creation Failed', '×', {
                            panelClass: 'failure',
                            verticalPosition: 'top',
                            duration: 1000
                        });
                    }
                },
                err => {
                    this.spinner.hide();
                    this.errMessage = this.signInService.getErrorMessage(err);
                    console.log(this.errMessage);
                });
        }
    }

}
