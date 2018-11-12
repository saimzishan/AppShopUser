import {Component, OnInit, HostListener, ViewChild, AfterViewInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Router, NavigationEnd} from '@angular/router';
import {Settings, AppSettings} from '../app.settings';
import {AppService} from '../app.service';
import {Category} from '../app.models';
import {SidenavMenuService} from '../theme/components/sidenav-menu/sidenav-menu.service';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
    providers: [SidenavMenuService]
})
export class PagesComponent implements OnInit, AfterViewInit {
    public showBackToTop: boolean = false;
    public categories: Category[];
    public category: Category;
    public sidenavMenuItems: Array<any>;
    @ViewChild('sidenav') sidenav: any;

    public settings: Settings;
    public currentUser = JSON.parse(localStorage.getItem('currentUser'));
    public guestUser = JSON.parse(localStorage.getItem('guestUser'));

    constructor(public appSettings: AppSettings,
                public appService: AppService,
                public sidenavMenuService: SidenavMenuService,
                public router: Router) {
        this.settings = this.appSettings.settings;
    }

    ngOnInit() {
        this.getCategories();
        this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
        // console.log(this.appService.Data.cartList);
    }

    public getCategories() {
        this.appService.getCategories().subscribe(data => {
            // console.log(data.data);
            this.categories = data.data;
            this.category = data.data[0];
            this.appService.Data.categories = data.data;
        })
    }

    public changeCategory(event) {
        if (event.target) {
            this.category = this.categories.filter(category => category.name === event.target.innerText)[0];
            // console.log(this.category);
        }
        if (window.innerWidth < 960) {
            this.stopClickPropagate(event);
        }
    }

    public remove(product) {
        const index: number = this.appService.Data.cartList.indexOf(product);
        if (index !== -1) {
            this.appService.Data.cartList.splice(index, 1);
            this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.price;
        }
    }

    public clear() {
        this.appService.Data.cartList.length = 0;
    }

    checkOut() {
        /*if (this.currentUser) {
            this.router.navigate(['/checkout']);
        } else {
            this.router.navigate(['/sign-in']);
        }*/
    }

    public getImageSrc(product) {
        // console.log(product);
        return product.images.length && product.images[0].small.startsWith('http') ? product.images[0].small :
            product.images.length && !product.images[0].small.startsWith('http') ? this.appService.imgUrl + product.images[0].small :
                !product.images.length && product.product_images.length && product.product_images[0].small.startsWith('http') ? product.product_images[0].small :
                    this.appService.imgUrl + product.product_images[0].small;
    }

    public changeTheme(theme) {
        this.settings.theme = theme;
    }

    public stopClickPropagate(event: any) {
        event.stopPropagation();
        event.preventDefault();
    }

    public search() {
    }


    public scrollToTop() {
        var scrollDuration = 200;
        var scrollStep = -window.pageYOffset / (scrollDuration / 20);
        var scrollInterval = setInterval(() => {
            if (window.pageYOffset != 0) {
                window.scrollBy(0, scrollStep);
            }
            else {
                clearInterval(scrollInterval);
            }
        }, 10);
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                window.scrollTo(0, 0)
            });
        }
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event) {
        ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
    }

    ngAfterViewInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.sidenav.close();
            }
        });
        this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
    }

    public closeSubMenus() {
        if (window.innerWidth < 960) {
            this.sidenavMenuService.closeAllSubMenus();
        }
    }

}