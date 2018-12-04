import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {SwiperConfigInterface, SwiperDirective} from 'ngx-swiper-wrapper';
import {Data, AppService} from '../../../app.service';
import {Product, Rating} from '../../../app.models';
import {emailValidator} from '../../../theme/utils/app-validators';
import {ProductZoomComponent} from './product-zoom/product-zoom.component';
import {PrintingOptionsComponent} from '../../../dialogs/printing-options.component';
import {SpinnerService} from '../../../shared/spinner/spinner.service';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('zoomViewer') zoomViewer;
    @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
    public config: SwiperConfigInterface = {};
    public product: Product;
    public image: any;
    public zoomImage: any;
    private sub: any;
    public form: FormGroup;
    public relatedProducts: Array<Product>;

    public variantImages = [];
    public optionsArray = [];
    public selOption;
    public clickOptions = [];
    public addToCart = false;
    public basePrice;
    public supplier_id;
    public product_id;
    public currentUser;
    public reviews;
    ratingValue: number;
    public ratingArray = [
        {name: 'Very Dissatisfied', icon: 'sentiment_very_dissatisfied'},
        {name: 'Dissatisfied', icon: 'sentiment_dissatisfied'},
        {name: 'Neutral', icon: 'sentiment_neutral'},
        {name: 'Satisfied', icon: 'sentiment_satisfied'},
        {name: 'Very Satisfied', icon: 'sentiment_very_satisfied'}
    ];
    public stars = ['star_border', 'star_border', 'star_border', 'star_border', 'star_border'];
    public storedRating = [];

    constructor(
        public appService: AppService,
        private activatedRoute: ActivatedRoute,
        public router: Router,
        public dialog: MatDialog,
        private spinnerService: SpinnerService,
        public formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.product_id = params['id'];
            this.supplier_id = params['supplier_id'];
            this.getProductByIdNew(params['id'], params['supplier_id']);
        });
        this.activatedRoute.params.subscribe(params => {
            this.supplier_id = params['supplier_id'];
            this.getProductReviews(params['id'], params['supplier_id']);
        });

        if (!this.appService.Data.browsingHistory.find(product => product.product_id === this.product_id)) {

            this.appService.Data.browsingHistory.unshift({
                product_id: this.product_id,
                supplier_id: this.supplier_id
            });
        }

        if (this.appService.Data.browsingHistory.length > 10) {
            this.appService.Data.browsingHistory.pop();
        }

        localStorage.setItem('browsing_history', JSON.stringify(this.appService.Data.browsingHistory));
        // localStorage.setItem('browsing_history', );
        // console.log(this.appService.Data.browsingHistory);


        /*this.form = this.formBuilder.group({
                'review': [null, Validators.required],
                'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
                'email': [null, Validators.compose([Validators.required, emailValidator])]
            });*/
        this.form = this.formBuilder.group({
            review: [null, Validators.required]
        });
        this.getRelatedProducts();

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
                    slidesPerView: 3
                }
            }
        };
    }

    public getProductByIdNew(id, supId) {
        this.spinnerService.requestInProcess(true);
        this.appService.getProductByIdNew(id, supId).subscribe(data => {
            this.product = data.data;
            // console.log(this.product);
            this.product.availibilityCount = this.product.stock;

            // showing product images
            if (!this.product.images.length) {
                this.spinnerService.requestInProcess(false);
                this.product.product_images[0].medium = this.product.product_images[0]
                    .medium
                    ? this.product.product_images[0].medium
                    : this.product.product_images[0].small;
                this.product.product_images[0].large = this.product.product_images[0]
                    .large
                    ? this.product.product_images[0].large
                    : this.product.product_images[0].small;
                /*if (!this.product.images[0].small.startsWith('http') || !this.product.images[0].medium.startsWith('http') || !this.product.images[0].large.startsWith('http')) {
                            // only this required start
                            this.image = this.appService.imgUrl + this.product.images[0].medium;
                            this.zoomImage = this.appService.imgUrl + this.product.images[0].large;
                            this.variantImages = this.product.images;
                            this.variantImages.forEach(item => {
                                item.small = this.appService.imgUrl + item.small;
                            });
                        }*/
                this.image = this.product.product_images[0].medium.startsWith('http')
                    ? this.product.product_images[0].medium
                    : this.appService.imgUrl + this.product.product_images[0].medium;
                this.zoomImage = this.product.product_images[0].large.startsWith('http')
                    ? this.product.product_images[0].large
                    : this.appService.imgUrl + this.product.product_images[0].large;
                this.variantImages = this.product.product_images;
                this.variantImages.map(img => {
                    img.small = img.small.startsWith('http')
                        ? img.small
                        : this.appService.imgUrl + img.small;
                    img.medium = img.medium.startsWith('http')
                        ? img.medium
                        : this.appService.imgUrl + img.medium;
                    img.large = img.large.startsWith('http')
                        ? img.large
                        : this.appService.imgUrl + img.large;
                });
            } else {
                this.spinnerService.requestInProcess(false);
                this.product.images[0].medium = this.product.images[0].medium
                    ? this.product.images[0].medium
                    : this.product.images[0].small;
                this.product.images[0].large = this.product.images[0].large
                    ? this.product.images[0].large
                    : this.product.images[0].small;
                /*if (!this.product.images[0].small.startsWith('http') || !this.product.images[0].medium.startsWith('http') || !this.product.images[0].large.startsWith('http')) {
                            // only this required start
                            this.image = this.appService.imgUrl + this.product.images[0].medium;
                            this.zoomImage = this.appService.imgUrl + this.product.images[0].large;
                            this.variantImages = this.product.images;
                            this.variantImages.forEach(item => {
                                item.small = this.appService.imgUrl + item.small;
                            });
                        }*/
                this.image = this.product.images[0].medium.startsWith('http')
                    ? this.product.images[0].medium
                    : this.appService.imgUrl + this.product.images[0].medium;
                this.zoomImage = this.product.images[0].large.startsWith('http')
                    ? this.product.images[0].large
                    : this.appService.imgUrl + this.product.images[0].large;
                this.variantImages = this.product.images;
                this.variantImages.map(img => {
                    img.small = img.small.startsWith('http')
                        ? img.small
                        : this.appService.imgUrl + img.small;
                    img.medium = img.medium.startsWith('http')
                        ? img.medium
                        : this.appService.imgUrl + img.medium;
                    img.large = img.large.startsWith('http')
                        ? img.large
                        : this.appService.imgUrl + img.large;
                });
            }

            if (!this.product.images.length && !this.product.product_images.length) {
                this.spinnerService.requestInProcess(false);
                this.image = 'assets/images/img_not_available.png';
                this.zoomImage = 'assets/images/img_not_available.png';
            }

            this.basePrice = this.product.price;
            this.spinnerService.requestInProcess(false);

            // showing product images when product variants does not exist
            /*if (!this.product.product_variants.length) {
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

                  } else {*/
            if (this.product.product_supplier_attributes.length) {
                this.spinnerService.requestInProcess(false);
                this.product.product_supplier_attributes.forEach(variants => {
                    if (
                        this.optionsArray.length &&
                        this.optionsArray.find(val => val.name === variants.option_set.name)
                    ) {
                        this.optionsArray.forEach(itm => {
                            if (itm.name === variants.option_set.name) {
                                itm.values.push({
                                    id: variants.option.id,
                                    value: variants.option.value
                                });
                            }
                        });
                    } else {
                        this.optionsArray.push({
                            id: variants.option_set.id,
                            name: variants.option_set.name,
                            values: [{id: variants.option.id, value: variants.option.value}]
                        });
                    }
                });
                console.log(this.optionsArray);
            } else {
                this.spinnerService.requestInProcess(false);
                this.addToCart = true;
            }

            // let publicIndex = this.product.product_variants[0].images[0].small.indexOf('images');
            /*this.image = this.appService.imgUrl + this.product.product_variants[0].images[0].medium.substring(publicIndex);*/
            // showing product images when product variants exist from 0 index
            /*if (this.product.product_variants[0].images.length) {
                          this.image = this.appService.imgUrl + this.product.product_variants[0].images[0].medium;
                          this.zoomImage = this.appService.imgUrl + this.product.product_variants[0].images[0].large;
                          this.product.product_variants.forEach(variant => {
                              this.variantImages = this.variantImages.concat(variant.images);
                          });
                          this.variantImages.forEach(item => {
                              item.small = this.appService.imgUrl + item.small;
                          });
                      }*/
            // price calculation
            /*if (this.product.product_variants[0].operation === 'none' || this.product.product_variants[0].operation === null) {
                      let newArr = [];
                      this.product.product_variants[0].product_variant_attributes.forEach(attr => {
                          newArr = newArr.concat(this.product.product_supplier_attributes.filter(item => {
                             return item.option_set_id === attr.option_set_id && item.option_id === attr.option_id;
                         }));
                      });
                      newArr.forEach(item => {
                         if (item.operation && item.operation !== 'none') {
                             if (item.operation === 'add' && item.changed_by === 'percentage') {
                                 this.product.price += (this.product.price * item.amount) / 100;
                             } else if (item.operation === 'add' && item.changed_by === 'absolute') {
                                 this.product.price += item.amount;
                             } else if (item.operation === 'subtract' && item.changed_by === 'percentage') {
                                 this.product.price -= (this.product.price * item.amount) / 100;
                             } else {
                                 this.product.price -= item.amount;
                             }
                         }
                      });
                  }*/
            //  }
            setTimeout(() => {
                this.config.observer = true;
                // this.directiveRef.setIndex(0);
            });
        });
    }

    public getProductReviews(prodId, supId) {
        this.appService.getProductReviews(prodId, supId).subscribe(data => {
            // console.log(data.data);
            this.reviews = data.data;
        });
    }

    public getVal(id) {
        const styleId = this.clickOptions.find(item => item.option_id === id);
        if (styleId) {
            return true;
        }
    }

    public selectedOption(optionSet, option) {
        /*console.log(optionSet);
        console.log(option);*/
        this.selOption = option.id;
        if (
            this.clickOptions.length &&
            this.clickOptions.find(val => val.option_set_id === optionSet.id)
        ) {
            this.clickOptions = this.clickOptions.filter(item => {
                return item.option_set_id !== optionSet.id;
            });
            this.clickOptions.push({
                option_set_id: optionSet.id,
                // 'option_set_name': optionSet.name,
                option_id: option.id
                // 'option_name': option.value
            });
        } else {
            this.clickOptions.push({
                option_set_id: optionSet.id,
                // 'option_set_name': optionSet.name,
                option_id: option.id
                // 'option_name': option.value
            });
        }
        console.log(this.clickOptions);
        if (this.optionsArray.length === this.clickOptions.length) {
            let nArray = [];
            let singleAttr;
            console.log(this.product.product_variants);
            this.product.product_variants.forEach(variants => {
                if (nArray.length < this.clickOptions.length) {
                    nArray = [];
                }
                console.log(variants.product_variant_attributes);
                this.clickOptions.forEach(item => {
                    singleAttr = variants.product_variant_attributes.find(attr => {
                        return (
                            attr.option_set_id === item.option_set_id &&
                            attr.option_id === item.option_id
                        );
                    });
                    console.log(singleAttr);
                    if (singleAttr) {
                        if (nArray.length) {
                            if (
                                nArray.find(
                                    vId =>
                                        vId.product_variant_id === singleAttr.product_variant_id
                                )
                            ) {
                                nArray.push(singleAttr);
                            }
                            // console.log('nArray length');
                        } else {
                            nArray.push(singleAttr);
                            // console.log('not narray length');
                        }
                        // console.log(nArray);
                    } else {
                        console.log(nArray);
                    }
                });
            });
            if (nArray.length === this.clickOptions.length) {
                this.addToCart = true;
                const reqVariant = this.product.product_variants.find(variant => {
                    return variant.id === nArray[0].product_variant_id;
                });
                this.product.sku = reqVariant.sku;
                this.product.stock = reqVariant.stock;
                /*reqVariant.images.forEach(img => {
                        if (!img.small.startsWith('http') || !img.medium.startsWith('http') || !img.large.startsWith('http')) {
                            this.image = this.appService.imgUrl + reqVariant.images[0].medium;
                            this.zoomImage = this.appService.imgUrl + reqVariant.images[0].large;
                            // this.variantImages = reqVariant.images;
                            /!*this.variantImages.forEach(item => {*!/
                             img.small = this.appService.imgUrl + img.small;
                        });*!/

                        } else {
                            this.image = reqVariant.images[0].medium;
                            this.zoomImage = reqVariant.images[0].large;
                            this.variantImages = reqVariant.images;
                        }
                        });*/
                // this.image = this.appService.imgUrl + reqVariant.images[0].medium;
                // this.zoomImage = this.appService.imgUrl + reqVariant.images[0].large;
                this.image = reqVariant.images[0].medium.startsWith('http')
                    ? reqVariant.images[0].medium
                    : this.appService.imgUrl + reqVariant.images[0].medium;
                this.zoomImage = reqVariant.images[0].large.startsWith('http')
                    ? reqVariant.images[0].large
                    : this.appService.imgUrl + reqVariant.images[0].large;
                this.variantImages = reqVariant.images;
                this.variantImages.map(img => {
                    img.small = img.small.startsWith('http')
                        ? img.small
                        : this.appService.imgUrl + img.small;
                    img.medium = img.medium.startsWith('http')
                        ? img.medium
                        : this.appService.imgUrl + img.medium;
                    img.large = img.large.startsWith('http')
                        ? img.large
                        : this.appService.imgUrl + img.large;
                });
                // this.product.product_variants = [reqVariant];    commented on 29-11-18
                // this.product.product_variants[0] = reqVariant;

                // price calculation
                if (reqVariant.operation === 'none' || reqVariant.operation === null) {
                    this.product.price = this.basePrice;
                    let newArr = [];
                    reqVariant.product_variant_attributes.forEach(attr => {
                        newArr = newArr.concat(
                            this.product.product_supplier_attributes.filter(item => {
                                return (
                                    item.option_set_id === attr.option_set_id &&
                                    item.option_id === attr.option_id
                                );
                            })
                        );
                    });
                    newArr.forEach(item => {
                        if (item.operation && item.operation !== 'none') {
                            if (
                                item.operation === 'add' &&
                                item.changed_by === 'percentage'
                            ) {
                                this.product.price += (this.product.price * item.amount) / 100;
                            } else if (
                                item.operation === 'add' &&
                                item.changed_by === 'absolute'
                            ) {
                                this.product.price += item.amount;
                            } else if (
                                item.operation === 'subtract' &&
                                item.changed_by === 'percentage'
                            ) {
                                this.product.price -= (this.product.price * item.amount) / 100;
                            } else {
                                this.product.price -= item.amount;
                            }
                        }
                    });
                } else {
                    this.product.price = this.basePrice;
                    if (
                        reqVariant.operation === 'add' &&
                        reqVariant.changed_by === 'percentage'
                    ) {
                        this.product.price +=
                            (this.product.price * reqVariant.amount) / 100;
                    } else if (
                        reqVariant.operation === 'add' &&
                        reqVariant.changed_by === 'absolute'
                    ) {
                        this.product.price += reqVariant.amount;
                    } else if (
                        reqVariant.operation === 'subtract' &&
                        reqVariant.changed_by === 'percentage'
                    ) {
                        this.product.price -=
                            (this.product.price * reqVariant.amount) / 100;
                    } else {
                        this.product.price -= reqVariant.amount;
                    }
                }
            } else {
                this.addToCart = false;
                this.product.sku = 'Not Available';
                this.product.stock = 0;
                this.product.price = this.basePrice;
                this.image = 'assets/images/not_available.jpg';
                this.zoomImage = '';
                this.variantImages = [];
                /*this.variantImages.forEach(item => {
                            item.small = this.appService.imgUrl + item.small;
                        });*/
            }

            // this.product.product_variants.find(item => )
            // count = 0;
        }
    }

    public getRelatedProducts() {
        this.spinnerService.requestInProcess(true);
        this.appService.getProducts('related').subscribe(data => {
            this.relatedProducts = data;
            this.spinnerService.requestInProcess(false);
        });
    }

    public selectImage(image) {
        image.medium = image.medium.startsWith('http')
            ? image.medium
            : this.appService.imgUrl + image.medium;
        image.large = image.large.startsWith('http')
            ? image.large
            : this.appService.imgUrl + image.large;
        /*this.image = this.appService.imgUrl + image.medium;
            this.zoomImage = this.appService.imgUrl + image.large;*/
        this.image = image.medium;
        this.zoomImage = image.large;
    }

    public login() {
        this.router.navigate(['/sign-in', {pId: this.product.id, pName: this.product.name, sId: this.supplier_id}]);
    }

    public onMouseMove(e) {
        if (window.innerWidth >= 1280) {
            let image, offsetX, offsetY, x, y, zoomer;
            image = e.currentTarget;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            x = (offsetX / image.offsetWidth) * 100;
            y = (offsetY / image.offsetHeight) * 100;
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

    public openPrintingOptionsDialog(product) {
        const printingInfo: any = product;
        printingInfo.line_item_printing_infos = {};

        const dialogRef = this.dialog.open(PrintingOptionsComponent, {
            data: product,
            panelClass: 'product-dialog'
        });
        dialogRef.afterClosed().subscribe(options => {
            if (options) {
                this.product.line_item_printing_infos.instructions =
                    options.instructions;
                this.product.line_item_printing_infos.images = options.filesArray;
                /*this.appService.Data.orderList.line_items.push({
                            sku: this.product.sku,
                            quantity: 1,
                            price_paid: this.product.price,
                            line_item_printing_infos: {
                                instructions: options.instructions,
                                images: options.filesArray
                            }
                        });*/
                // printingInfo.line_item_printing_infos.instructions = options.instructions;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    rating(val) {
        // console.log(val);
        switch (val) {
            case 1 : {
                this.stars = ['star', 'star_border', 'star_border', 'star_border', 'star_border'];
                break;
            }
            case 2 : {
                this.stars = ['star', 'star', 'star_border', 'star_border', 'star_border'];
                break;
            }
            case 3 : {
                this.stars = ['star', 'star', 'star', 'star_border', 'star_border'];
                break;
            }
            case 4 : {
                this.stars = ['star', 'star', 'star', 'star', 'star_border'];
                break;
            }
            case 5 : {
                this.stars = ['star', 'star', 'star', 'star', 'star'];
                break;
            }
        }
        this.ratingValue = val;
    }

    public getRating(val) {
        // console.log(val);
        switch (val) {
            case 1 : {
                this.storedRating = ['star', 'star_border', 'star_border', 'star_border', 'star_border'];
                break;
            }
            case 2 : {
                this.storedRating = ['star', 'star', 'star_border', 'star_border', 'star_border'];
                break;
            }
            case 3 : {
                this.storedRating = ['star', 'star', 'star', 'star_border', 'star_border'];
                break;
            }
            case 4 : {
                this.storedRating = ['star', 'star', 'star', 'star', 'star_border'];
                break;
            }
            case 5 : {
                this.storedRating = ['star', 'star', 'star', 'star', 'star'];
                break;
            }
        }
        return this.storedRating;
    }

    public onSubmit(values: Rating): void {
        if (this.form.valid) {
            let userId;
            if (this.currentUser) {
                const helper = new JwtHelperService();
                userId = helper.decodeToken(this.currentUser.access_token).id;
            }
            values.ratingsValue = this.ratingValue;
            values.user_id = userId;
            values.product_id = this.product.id;
            values.supplier_id = this.supplier_id;
            // console.log(values);
            this.appService.postRating(values).subscribe(data => {
                console.log(data);
                if (!data.error) {
                    this.getProductReviews(this.product.id, this.supplier_id);
                }
            });
        }
    }
}
