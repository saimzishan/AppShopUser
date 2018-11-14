import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material';
import {Data, AppService} from '../../app.service';
import {PayPalConfig, PayPalEnvironment, PayPalIntegrationType} from 'ngx-paypal';
import {Router} from '@angular/router';
import {Order} from '../../app.models';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';

declare let paypal: any;

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewChecked {
    @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
    @ViewChild('verticalStepper') verticalStepper: MatStepper;
    billingForm: FormGroup;
    shippingForm: FormGroup;
    deliveryForm: FormGroup;
    paymentForm: FormGroup;
    countries = [];
    months = [];
    years = [];
    deliveryMethods = [];
    grandTotal = 0;
    checkoutItems = [];

    addScript = false;
    confirmation = false;
    billlingAddressFlag = true;
    billingAddress: any = {};
    shippingAddress: any = {};
    order: Order;
    orderObj: any = {};
    order_id;
    bTree: any;
    enabledStyle = {
        'background-color': 'rgb(211, 47, 47)',
        'color': '#ffffff',
        'border': 'none',
        'border-radius': '4px',
        'height': '40px',
        'line-height': '40px',
        'font-size': '16px',
        'cursor': 'pointer',
        'padding-left': '10px',
        'padding-right': '10px'
    };

    disabledStyle = {
        'background-color': 'lightgrey',
        'color': '#ffffff',
        'border': 'none',
        'border-radius': '4px',
        'height': '40px',
        'line-height': '40px',
        'font-size': '16px',
        'cursor': 'not-allowed',
        'padding-left': '10px',
        'padding-right': '10px'
    };
    public currentUser = JSON.parse(localStorage.getItem('currentUser'));
    public guestUser = JSON.parse(localStorage.getItem('guestUser'));

    paypalConfig = {
        env: 'sandbox', // sandbox | production

        /*intent: 'sale',
        orderID: '90048630024435',*/

        // Specify the style of the button

        style: {
            label: 'checkout',
            size: 'medium',    // small | medium | large | responsive
            shape: 'pill',     // pill | rect
            color: 'gold'      // gold | blue | silver | black
        },

        // PayPal Client IDs - replace with your own
        // Create a PayPal app: https://developer.paypal.com/developer/applications/create
        client: {
            sandbox: 'AXQDCvOuxxjOA0YnBfcsdQ238zS2YjlQHcNVvxstSryNKTvdpgPUx07ehBSGsWIE0Z6_T09Il40cmwzX',
            production: '<insert production client id>'
        },

        // Show the buyer a 'Pay Now' button in the checkout flow
        commit: true,

        // payment() is called when the button is clicked
        payment: (data, actions) => {

            // Make a call to the REST api to create the payment
            return actions.payment.create({
                payment: {
                    /*payer: {
                        payment_method: 'paypal'
                    },*/
                    transactions: [
                        {
                            amount: {total: this.grandTotal, currency: 'USD'},
                            description: 'The payment transaction description.',
                            // order_id: this.order_id,
                            custom: this.order_id,
                            // invoice_number: '0000897',
                            item_list: {
                                items: this.checkoutItems,
                            }
                        },
                    ]
                }
            });
        },
        // onAuthorize() is called when the buyer approves the payment
        onAuthorize: (data, actions) => {

            console.log(data);

            // Make a call to the REST api to execute the payment
            return actions.payment.execute().then((paymentData) => {
                console.log(paymentData);
                this.order.payment_id = paymentData.id;
                console.log(this.order);
                this.confirmation = true;
                this.horizontalStepper.next();
                this.horizontalStepper._steps.forEach(step => step.editable = false);
                this.verticalStepper._steps.forEach(step => step.editable = false);
                this.appService.Data.cartList.length = 0;
            });
        }
    };

    constructor(public http: HttpClient, public router: Router, public appService: AppService, public formBuilder: FormBuilder) {
        /*if (this.guestUser || !this.currentUser) {
            this.router.navigate(['/sign-in']);
        }*/
    }

    ngOnInit() {

        console.log(this.order);
        this.appService.Data.cartList.forEach(product => {
            this.grandTotal += +product.price * product.count;
        });
        this.countries = this.appService.getCountries();
        this.months = this.appService.getMonths();
        this.years = this.appService.getYears();
        this.deliveryMethods = this.appService.getDeliveryMethods();
        this.billingForm = this.formBuilder.group({
            /*bfirstName: ['', Validators.required],
            blastName: ['', Validators.required],
            bmiddleName: '',
            bcompany: '',
            bemail: ['', Validators.required],
            bphone: ['', Validators.required],*/
            bNo: ['', Validators.required],
            bStreet: ['', Validators.required],
            bcountry: ['', Validators.required],
            bcity: ['', Validators.required],
            bstate: '',
            bzip: ['', Validators.required],
            // baddress: ['', Validators.required]
        });
        this.shippingForm = this.formBuilder.group({
            /*sfirstName: ['', Validators.required],
            slastName: ['', Validators.required],
            smiddleName: '',
            scompany: '',
            semail: ['', Validators.required],
            sphone: ['', Validators.required],*/
            sNo: ['', Validators.required],
            sStreet: ['', Validators.required],
            scountry: ['', Validators.required],
            scity: ['', Validators.required],
            sstate: '',
            szip: ['', Validators.required],
            // saddress: ['', Validators.required]
        });
        this.deliveryForm = this.formBuilder.group({
            deliveryMethod: [this.deliveryMethods[0], Validators.required]
        });
        this.paymentForm = this.formBuilder.group({
            cardHolderName: ['', Validators.required],
            cardNumber: ['', Validators.required],
            expiredMonth: ['', Validators.required],
            expiredYear: ['', Validators.required],
            cvv: ['', Validators.required]
        });

        console.log(this.appService.Data.cartList);
        this.appService.Data.cartList.forEach(item => {
            // console.log(item);
            let obj = {
                sku: item.sku,
                name: item.name,
                description: item.short_description,
                quantity: item.count,
                price: item.price,
                currency: 'CAD',
            };
            this.checkoutItems.push(obj);
        });
    }

    ngAfterViewChecked() {
    }

    public getClientToken(): Observable<string> {
        return this.appService.getClientToken();
    }

    getImageSrc(product) {
        // console.log(product);
        return product.images.length && product.images[0].small.startsWith('http') ? product.images[0].small :
            product.images.length && !product.images[0].small.startsWith('http') ? this.appService.imgUrl + product.images[0].small :
                !product.images.length && product.product_images.length && product.product_images[0].small.startsWith('http') ? product.product_images[0].small :
                    this.appService.imgUrl + product.product_images[0].small;
    }

    public createPurchase(nonce: string, chargeAmount: number): Observable<any> {
        const purchaseObj = {
            nonce: nonce,
            chargeAmount: chargeAmount,
            amount: this.grandTotal,
            order_uuid: this.order_id
        };
        return this.appService.createPurchase(purchaseObj);
    }

    onPaymentStatus(evt) {
        console.log(evt);
        if (!evt.error) {
            this.confirmation = true;
            this.horizontalStepper.next();
            this.horizontalStepper._steps.forEach(step => step.editable = false);
            this.verticalStepper._steps.forEach(step => step.editable = false);
            this.appService.Data.cartList.length = 0;
        }
    }

    public placeOrder() {
        if (!this.billlingAddressFlag) {
            this.billingAddress = {
                no: this.billingForm.value.bNo,
                street: this.billingForm.value.bStreet,
                city: this.billingForm.value.bcity,
                postol_code: this.billingForm.value.bzip,
                state: this.billingForm.value.bstate,
                country: this.billingForm.value.bcountry
            };
            this.shippingAddress = {
                no: this.billingForm.value.bNo,
                street: this.billingForm.value.bStreet,
                city: this.billingForm.value.bcity,
                postol_code: this.billingForm.value.bzip,
                state: this.billingForm.value.bstate,
                country: this.billingForm.value.bcountry
            };
        } else {
            // console.log(this.shippingForm.value);
            this.billingAddress = {
                no: this.billingForm.value.bNo,
                street: this.billingForm.value.bStreet,
                city: this.billingForm.value.bcity,
                postol_code: this.billingForm.value.bzip,
                state: this.billingForm.value.bstate,
                country: this.billingForm.value.bcountry
            };
            this.shippingAddress = {
                no: this.shippingForm.value.sNo,
                street: this.shippingForm.value.sStreet,
                city: this.shippingForm.value.scity,
                postol_code: this.shippingForm.value.szip,
                state: this.shippingForm.value.sstate,
                country: this.shippingForm.value.scountry
            };
        }
        this.orderObj.billing_address = this.billingAddress;
        this.orderObj.shipping_address = this.shippingAddress;
        this.orderObj.line_items = [];
        let newOrder: any = {};
        console.log(this.appService.Data.cartList);
        this.appService.Data.cartList.forEach(item => {
            console.log(item);
            newOrder = {
                sku: item.sku,
                quantity: item.count,
                price_paid: item.price,
                line_item_printing_infos: item.line_item_printing_infos
            };
            console.log(newOrder);
            this.orderObj.line_items.push(newOrder);
        });
        console.log(this.orderObj);
        // this.orderObj.line_items = newArr;
        // console.log(this.orderObj);
        this.order = this.orderObj;
        this.order.payment_id = 0;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const helper = new JwtHelperService();
            const decodedToken = helper.decodeToken(currentUser.access_token);
            console.log(decodedToken);
        }
        console.log(this.order);
        this.appService.createOrder(this.order).subscribe(data => {
            console.log(data);
            this.order_id = data.data.order_uuid;
            console.log(this.order_id);
        });

        /*this.horizontalStepper._steps.forEach(step => step.editable = false);
        this.verticalStepper._steps.forEach(step => step.editable = false);*/
        // this.appService.Data.cartList.length = 0;
    }

    onChange(evt) {
        this.billlingAddressFlag = !(evt.checked && this.billlingAddressFlag);
    }

}
