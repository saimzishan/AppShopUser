import {Component, OnInit} from '@angular/core';
import {Data, AppService} from '../../app.service';
import {Router} from "@angular/router";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    total = [];
    grandTotal = 0;
    public currentUser = JSON.parse(localStorage.getItem('currentUser'));
    public guestUser = JSON.parse(localStorage.getItem('guestUser'));

    constructor(public appService: AppService, private router: Router) {
    }

    ngOnInit() {
        this.appService.Data.cartList.forEach(product => {
            console.log(product);
            this.total[product.id] = +product.price * product.count;
            this.grandTotal += +product.price * product.count;
        });
    }

    checkOut() {
        if (this.currentUser) {
            this.router.navigate(['/checkout']);
        } else {
            this.router.navigate(['/sign-in']);
        }
    }

    getImageSrc(product) {
        return product.images.length && product.images[0].small.startsWith('http') ? product.images[0].small :
            product.images.length && !product.images[0].small.startsWith('http') ? this.appService.imgUrl + product.images[0].small :
                !product.images.length && product.product_images.length && product.product_images[0].small.startsWith('http') ? product.product_images[0].small :
                    this.appService.imgUrl + product.product_images[0].small;
    }

    public getTotalPrice(value) {
        console.log(value);
        if (value) {
            this.appService.Data.cartList.forEach(item => {
                if (value.productId === item.id) {
                    item.count = value.soldQuantity;
                }
            });
            console.log(this.appService.Data.cartList);
            this.total[value.productId] = value.total;
            this.grandTotal = 0;
            this.total.forEach(price => {
                this.grandTotal += price;
            });
        }
    }

    public remove(product) {
        const index: number = this.appService.Data.cartList.indexOf(product);
        if (index !== -1) {
            this.appService.Data.cartList.splice(index, 1);
            this.grandTotal = this.grandTotal - this.total[product.id];
            this.total.forEach(val => {
                if (val === this.total[product.id]) {
                    this.total[product.id] = 0;
                }
            });
        }
    }

    public clear() {
        this.appService.Data.cartList.length = 0;
    }

}
