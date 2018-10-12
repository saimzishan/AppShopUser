import {Component, OnInit} from '@angular/core';
import {Data, AppService} from '../../app.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    total = [];
    grandTotal = 0;

    constructor(public appService: AppService) {
    }

    ngOnInit() {
        this.appService.Data.cartList.forEach(product => {
            console.log(product);
            this.total[product.id] = +product.price * product.count;
            this.grandTotal += +product.price * product.count;
        });
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
