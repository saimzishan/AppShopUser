import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material';
import {Data, AppService} from '../../app.service';
import {PayPalConfig, PayPalEnvironment, PayPalIntegrationType} from 'ngx-paypal';
import {Router} from '@angular/router';
import {Order} from "../../app.models";

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
    orderObj:any = {};
    order_id;

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
                                // billing_address: this.billingAddress,
                                /*billing_address: {
                                    recipient_name: 'Brian Robinson',
                                    line1: '4th Floor',
                                    line2: 'Unit #34',
                                    city: 'San Jose',
                                    country_code: 'US',
                                    postal_code: '95131',
                                    phone: '011862212345678',
                                    state: 'CA'
                                },*/
                                // shipping_address: this.shippingAddress
                            }
                        },
                    ]
                }
            });
        },
        // onAuthorize() is called when the buyer approves the payment
        onAuthorize: (data, actions) => {

            console.log(data);

            // return actions.payment.get().then(data1 => {
            // console.log(data1);
            // Make a call to the REST api to execute the payment
            return actions.payment.execute().then((paymentData) => {
                console.log(paymentData);
                this.order.payment_id = paymentData.id;
                /*this.order.billing_address = this.billingAddress;
                this.order.shipping_address = this.shippingAddress;*/
                // let orderObj;
                // console.log(this.appService.Data.cartList);
                /*this.appService.createOrder(this.order).then(order => {
                    console.log(order);
                });*/
                /*this.appService.Data.cartList.forEach(item => {
                    console.log(item);
                    orderObj.sku = item.sku;
                    orderObj.quantity = item.count;
                    orderObj.price_paid = item.price;
                    orderObj.line_item_printing_infos = item.line_item_printing_infos;
                    this.order.line_items.push(orderObj);
                });*/
                // this.order.line_items = data1.line_items;
                console.log(this.order);
                this.confirmation = true;
                this.horizontalStepper.next();
                this.horizontalStepper._steps.forEach(step => step.editable = false);
                this.verticalStepper._steps.forEach(step => step.editable = false);
                this.appService.Data.cartList.length = 0;
            });
            // });
        }
    };

    // public payPalConfig?: PayPalConfig;

    constructor(public router: Router, public appService: AppService, public formBuilder: FormBuilder) {
        const currUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currUser) {
            this.router.navigate(['/sign-in']);
        }
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

        // this.order = new Order();

        console.log(this.order);

        // this.checkoutItems =
        console.log(this.appService.Data.cartList);
        this.appService.Data.cartList.forEach(item => {
            console.log(item);
            let obj = {
                sku: item.sku,
                name: item.name,
                description: item.short_description,
                quantity: item.count,
                price: item.price,
                currency: 'USD',
                // line_item_printing_infos: item.line_item_printing_infos
            };
            this.checkoutItems.push(obj);
        });
        // console.log(this.checkoutItems);
        // this.initConfig();
    }

    ngAfterViewChecked() {
        if (!this.addScript) {
            this.addPaypalScript().then(() => {
                // this.paypalConfig.payment().transactions[0].amount.total = this.grandTotal;
                paypal.Button.render(this.paypalConfig, '#paypal-checkout-button');
            });
        }
    }

    addPaypalScript() {
        this.addScript = true;
        return new Promise((resolve, reject) => {
            let scriptElement = document.createElement('script');
            scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
            scriptElement.onload = resolve;
            document.body.appendChild(scriptElement);
        });
    }

    /*private initConfig(): void {
        this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
            commit: true,
            client: {
                sandbox: 'AXQDCvOuxxjOA0YnBfcsdQ238zS2YjlQHcNVvxstSryNKTvdpgPUx07ehBSGsWIE0Z6_T09Il40cmwzX',
            },
            button: {
                label: 'checkout',
                layout: 'horizontal',
                fundingicons: false
            },
            onPaymentComplete: (data, actions) => {
                console.log('OnPaymentComplete');
            },
            onCancel: (data, actions) => {
                console.log('OnCancel');
            },
            onError: (err) => {
                console.log('OnError');
            },
            /!*validate: (actions) => {
                console.log('validate');
            },*!/
            transactions: [{
                amount: {
                    currency: 'USD',
                    total: 1
                }
            }]
        });
    }*/

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
        console.log(this.order);
        this.appService.createOrder(this.order).subscribe(data => {
            console.log(data);
            this.order_id = data.data.order_uuid;
            console.log(this.order_id);
        });

        this.horizontalStepper._steps.forEach(step => step.editable = false);
        this.verticalStepper._steps.forEach(step => step.editable = false);
        this.appService.Data.cartList.length = 0;
    }

    onChange(evt) {
        this.billlingAddressFlag = !(evt.checked && this.billlingAddressFlag);
    }

}
