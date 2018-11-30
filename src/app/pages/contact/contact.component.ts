import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {emailValidator} from '../../theme/utils/app-validators';
import {AppService} from "../../app.service";

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
    contactForm: FormGroup;
    message = '';

    constructor(public formBuilder: FormBuilder, private appService: AppService) {
    }

    ngOnInit() {
        this.contactForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, emailValidator])],
            phone: ['', Validators.required],
            message: ['', Validators.required]
        });
    }

    public onContactFormSubmit(values: Object): void {
        if (this.contactForm.valid) {
            // console.log(values);
            this.appService.contactUs(values).subscribe(res => {
                // console.log(res);
                if (res.message) {
                    this.message = res.message;
                }
            });
        }
    }

}
