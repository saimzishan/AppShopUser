import {Component} from '@angular/core';
import {AppService} from "../../app.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {MatDialog} from "@angular/material";
import {OrderDetailComponent} from "../../dialogs/order-detail.component";

@Component({
    selector: 'app-my-orders',
    templateUrl: './my-orders.component.html',
    styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent {

    /*public orders = [
        {number: '#3258', date: 'March 29, 2018', status: 'Completed', total: '$140.00 for 2 items', invoice: true},
        {number: '#3145', date: 'February 14, 2018', status: 'On hold', total: '$255.99 for 1 item', invoice: false},
        {number: '#2972', date: 'January 7, 2018', status: 'Processing', total: '$255.99 for 1 item', invoice: true},
        {number: '#2971', date: 'January 5, 2018', status: 'Completed', total: '$73.00 for 1 item', invoice: true},
        {
            number: '#1981',
            date: 'December 24, 2017',
            status: 'Pending Payment',
            total: '$285.00 for 2 items',
            invoice: false
        },
        {number: '#1781', date: 'September 3, 2017', status: 'Refunded', total: '$49.00 for 2 items', invoice: false}
    ];*/
    orders = [];
    userId;

    constructor(private dialog: MatDialog, private appService: AppService) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const helper = new JwtHelperService();
            const decodedToken = helper.decodeToken(currentUser.access_token);
            // console.log(decodedToken);
            this.userId = decodedToken.id;
            this.getOrders(this.userId);
        }
    }

    public getOrders(id) {
        this.appService.getOrders(id).subscribe(orders => {
            // console.log(orders.data);
            this.orders = orders.data;
        });
    }

    public getTotal(items) {
        // console.log(items);
        let total = 0;
        let totalItems = 0;
        items.forEach(item => {
            // console.log(item);
            total += item.price_paid;
            totalItems += item.quantity;
        });
        return '$' + total + ' for ' + totalItems + ' items';
    }

    public openOrderDetail(order) {

        const dialogRef = this.dialog.open(OrderDetailComponent, {
            data: order,
            panelClass: 'order-dialog'
        });
        dialogRef.afterClosed().subscribe(options => {
            if (options) {
                // console.log(options);
            }
        });
    }
}