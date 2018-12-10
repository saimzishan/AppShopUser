import {Component, OnDestroy, OnInit} from '@angular/core';
import {Data, AppService} from '../../../app.service';
import {Router} from '@angular/router';
import {DetectChangesService} from '../../../shared/detectchanges.service';
import {Subscription} from 'rxjs/Subscription';
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
    selector: 'app-top-menu',
    templateUrl: './top-menu.component.html'
})
export class TopMenuComponent implements OnInit, OnDestroy {
    public currencies = ['CAD', 'USD', 'EUR'];
    public currency: any;
    public flags = [
        {name: 'English', image: 'assets/images/flags/gb.svg'},
        {name: 'German', image: 'assets/images/flags/de.svg'},
        {name: 'French', image: 'assets/images/flags/fr.svg'},
        {name: 'Russian', image: 'assets/images/flags/ru.svg'},
        {name: 'Turkish', image: 'assets/images/flags/tr.svg'}
    ];
    public flag: any;
    public loggedIn = false;
    public changesSubscription: Subscription;
    decodedToken;

    constructor(public appService: AppService, public router: Router, private detectChanges: DetectChangesService) {
        this.changesSubscription = this.detectChanges.notifyObservable$.subscribe(
            res => {
                // console.log(res);
                if (res.option === 'loggedIn') {
                    this.loggedIn = res.value;
                    if (this.loggedIn) {
                        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                        if (currentUser) {
                            this.loggedIn = true;
                            const helper = new JwtHelperService();
                            this.decodedToken = helper.decodeToken(currentUser.access_token);
                        }
                    }
                    // this.callRelatedFunctions(res);
                }
            }
        );

        const currUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currUser) {
            this.loggedIn = true;
            const helper = new JwtHelperService();
            this.decodedToken = helper.decodeToken(currUser.access_token);
        }

    }

    ngOnInit() {
        this.currency = this.currencies[0];
        this.flag = this.flags[0];
    }

    public logout() {
        localStorage.removeItem('currentUser');
        this.detectChanges.notifyOther({
            option: 'loggedIn',
            value: false
        });
        this.router.navigate(['/']);
    }

    /*public callRelatedFunctions(res) {
        console.log(res);
        this.loggedIn = res.value;
    }*/

    public changeCurrency(currency) {
        this.currency = currency;
    }

    public changeLang(flag) {
        this.flag = flag;
    }

    ngOnDestroy() {
        this.changesSubscription.unsubscribe();
    }
}
