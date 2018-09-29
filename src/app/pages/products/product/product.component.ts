import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {SwiperConfigInterface, SwiperDirective} from 'ngx-swiper-wrapper';
import {Data, AppService} from '../../../app.service';
import {Product} from '../../../app.models';
import {emailValidator} from '../../../theme/utils/app-validators';
import {ProductZoomComponent} from './product-zoom/product-zoom.component';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('zoomViewer') zoomViewer;
    @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
    public config: SwiperConfigInterface = {};
    public product: any;
    public image: any;
    public zoomImage: any;
    private sub: any;
    public form: FormGroup;
    public relatedProducts: Array<Product>;

    public variantImages = [];
    public optionsArray = [];

    constructor(public appService: AppService,
                private activatedRoute: ActivatedRoute,
                public dialog: MatDialog,
                public formBuilder: FormBuilder) {
    }

    ngOnInit() {
        // console.log(this.activatedRoute.snapshot.paramMap.get('supplier_id'))
        this.sub = this.activatedRoute.params.subscribe(params => {
            // console.log(params['supplier_id']);
            this.getProductByIdNew(params['id'], params['supplier_id']);
        });
        this.form = this.formBuilder.group({
            'review': [null, Validators.required],
            'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
            'email': [null, Validators.compose([Validators.required, emailValidator])]
        });
        this.getRelatedProducts();
    }

    ngAfterViewInit() {
        this.config = {
            observer: false,
            slidesPerView: 4,
            spaceBetween: 10,
            keyboard: true,
            navigation: true,
            pagination: false,
            loop: false,
            preloadImages: false,
            lazy: true,
            breakpoints: {
                480: {
                    slidesPerView: 2
                },
                600: {
                    slidesPerView: 3,
                }
            }
        };
    }

    /*public getProductById(id) {
        this.appService.getProductById(id).subscribe(data => {
            this.product = data;
            this.image = data.images[0].medium;
            this.zoomImage = data.images[0].big;
            setTimeout(() => {
                this.config.observer = true;
                // this.directiveRef.setIndex(0);
            });
        });
    }*/

    public getProductByIdNew(id, supId) {
        this.appService.getProductByIdNew(id, supId).subscribe(data => {
            this.product = data.data;
            this.product.availibilityCount = 100;
            console.log(this.product);
            if (!this.product.product_variants.length) {
                this.product.images[0].medium = this.product.images[0].medium ? this.product.images[0].medium : this.product.images[0].small;
                this.product.images[0].large = this.product.images[0].large ? this.product.images[0].large : this.product.images[0].small;
                if (!this.product.images[0].small.startsWith('http') || !this.product.images[0].medium.startsWith('http') || !this.product.images[0].large.startsWith('http')) {
                    // only this required start
                    this.image = this.appService.imgUrl + this.product.images[0].medium;
                    this.zoomImage = this.appService.imgUrl + this.product.images[0].large;
                    this.variantImages = this.product.images;
                    this.variantImages.forEach(item => {
                        item.small = this.appService.imgUrl + item.small;
                    });
                    // only this required end
                } else {
                    this.image = this.product.images[0].medium;
                    this.zoomImage = this.product.images[0].large;
                    this.variantImages = this.product.images;
                }

            } else {
                this.product.product_supplier_attributes.forEach(variants => {
                    if (this.optionsArray.length && this.optionsArray.find(val => val.name === variants.option_set.name)) {
                        this.optionsArray.forEach(itm => {
                            if (itm.name === variants.option_set.name) {
                                itm.values.push(
                                    {id: variants.option.id, value: variants.option.value}
                                );
                            }
                        });
                    } else {
                    this.optionsArray.push({
                        id: variants.option_set.id,
                        'name': variants.option_set.name,
                        'values': [{id: variants.option.id, value: variants.option.value}]
                    });
                    }
                });
                // console.log(this.optionsArray);

                // let publicIndex = this.product.product_variants[0].images[0].small.indexOf('images');
                /*this.image = this.appService.imgUrl + this.product.product_variants[0].images[0].medium.substring(publicIndex);*/
                if (this.product.product_variants[0].images.length) {
                    this.image = this.appService.imgUrl + this.product.product_variants[0].images[0].medium;
                    this.zoomImage = this.appService.imgUrl + this.product.product_variants[0].images[0].large;
                    this.product.product_variants.forEach(variant => {
                        this.variantImages = this.variantImages.concat(variant.images);
                    });
                    this.variantImages.forEach(item => {
                        item.small = this.appService.imgUrl + item.small;
                    });
                }
                // price calculation
                if (this.product.product_variants[0].operation === 'none' || this.product.product_variants[0].operation === null) {
                    let newArr = [];
                    this.product.product_variants[0].product_variant_attributes.forEach(attr => {
                        newArr = newArr.concat(this.product.product_supplier_attributes.filter(item => {
                           return item.option_set_id === attr.option_set_id && item.option_id === attr.option_id;
                       }));
                       // console.log(newArr);
                    });
                    newArr.forEach(item => {
                       if (item.operation && item.operation !== 'none') {
                           // console.log(item.operation);
                           if (item.operation === 'add' && item.changeBy === 'percentage') {
                               this.product.price += (this.product.price * item.amount) / 100;
                           } else if (item.operation === 'add' && item.changeBy === 'absolute') {
                               this.product.price += item.amount;
                           } else if (item.operation === 'subtract' && item.changeBy === 'percentage') {
                               this.product.price -= (this.product.price * item.amount) / 100;
                           } else {
                               this.product.price -= item.amount;
                           }
                       }
                    });
                }
            }
            setTimeout(() => {
                this.config.observer = true;
                // this.directiveRef.setIndex(0);
            });
        });
    }

    public getRelatedProducts() {
        this.appService.getProducts('related').subscribe(data => {
            this.relatedProducts = data;
        });
    }

    public selectImage(image) {
        console.log(image);
        this.image = this.appService.imgUrl + image.medium;
        this.zoomImage = this.appService.imgUrl + image.large;
    }

    public onMouseMove(e) {
        if (window.innerWidth >= 1280) {
            let image, offsetX, offsetY, x, y, zoomer;
            image = e.currentTarget;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            x = offsetX / image.offsetWidth * 100;
            y = offsetY / image.offsetHeight * 100;
            zoomer = this.zoomViewer.nativeElement.children[0];
            if (zoomer) {
                zoomer.style.backgroundPosition = x + '% ' + y + '%';
                zoomer.style.display = 'block';
                zoomer.style.height = image.height + 'px';
                zoomer.style.width = image.width + 'px';
            }
        }
    }

    public onMouseLeave(event) {
        this.zoomViewer.nativeElement.children[0].style.display = 'none';
    }

    public openZoomViewer() {
        this.dialog.open(ProductZoomComponent, {
            data: this.zoomImage,
            panelClass: 'zoom-dialog'
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public onSubmit(values: Object): void {
        if (this.form.valid) {
            // email sent
        }
    }
}
