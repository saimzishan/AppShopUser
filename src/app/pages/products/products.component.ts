import {
    Component,
    OnInit,
    ViewChild,
    HostListener,
    OnDestroy
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ProductDialogComponent} from '../../shared/products-carousel/product-dialog/product-dialog.component';
import {AppService} from '../../app.service';
import {Product, Category} from '../../app.models';
import {SpinnerService} from '../../shared/spinner/spinner.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
    @ViewChild('sidenav') sidenav: any;
    public sidenavOpen: boolean = true;
    private sub: any;
    public viewType: string = 'grid';
    public viewCol: number = 25;
    public counts = [12, 24, 36];
    public count = 12;
    public sortings = ['Default', 'Lowest Price', 'Highest Price'];
    public sort: any;
    public products: Array<Product> = [];
    public productsArray = [];
    public productsCatArray = [];
    public productsBrandArray = [];
    public categories: Category[];
    public brands = [];
    public priceFrom = 750;
    public priceTo = 1599;
    public colors = [
        '#5C6BC0',
        '#66BB6A',
        '#EF5350',
        '#BA68C8',
        '#FF4081',
        '#9575CD',
        '#90CAF9',
        '#B2DFDB',
        '#DCE775',
        '#FFD740',
        '#00E676',
        '#FBC02D',
        '#FF7043',
        '#F5F5F5',
        '#000000'
    ];
    public sizes = [
        'S',
        'M',
        'L',
        'XL',
        '2XL',
        '32',
        '36',
        '38',
        '46',
        '52',
        '13.3"',
        '15.4"',
        '17"',
        '21"',
        '23.4"'
    ];
    public page: any;
    public avgPrice: string;
    public catId;
    public param;
    public totalProducts;
    public itemPerPage;

    constructor(
        private activatedRoute: ActivatedRoute,
        public appService: AppService,
        public dialog: MatDialog,
        private router: Router,
        private spinnerService: SpinnerService
    ) {
    }

    ngOnInit() {
        this.count = this.counts[0];
        this.sort = this.sortings[0];
        this.sub = this.activatedRoute.params.subscribe(params => {
            const currentUrl = this.router.url;
            this.param = params['id'];
            if (this.param && currentUrl.indexOf('products/category') !== -1) {
                // const catId = this.param.substr(0, this.param.indexOf('cat'));
                this.getProductsByCat(this.param);
            } else if (this.param && currentUrl.indexOf('products/brand') !== -1) {
                // const brandId = this.param.substr(0, this.param.indexOf('bnd'));
                this.getProductsByBrand(this.param);
            } else {
                this.getAllProductsNew(1, this.count);
            }
        });
        if (window.innerWidth < 960) {
            this.sidenavOpen = false;
        }
        if (window.innerWidth < 1280) {
            this.viewCol = 33.3;
        }

        this.getCategories();
        this.getBrandsNew();
        // this.getAllProducts();
    }

    public getProductsByCat(catId) {
        this.spinnerService.requestInProcess(true);
        this.appService.getAllProductsByCat(catId).subscribe(data => {
            this.spinnerService.requestInProcess(false);
            this.products = data.data.products.data;
            this.productsCatArray = [];
            // if (this.products.length > 0) {
            // console.log(this.products);
            this.products.forEach(value => {
                value.suppliers.forEach(item => {
                    const newProduct = {
                        id: value.id,
                        name: value.name,
                        category_id: value.category_id,
                        supplier_id: item.id,
                        supplier_name: item.name,
                        price: item.price,
                        image: !value.product_images.length && !item.product_images.length
                            ? 'assets/images/img_not_available.png'
                            : value.product_images.length && !item.product_images.length && value.product_images[0].small.startsWith('http')
                                ? value.product_images[0].small
                                : value.product_images.length && !item.product_images.length && !value.product_images[0].small.startsWith('http')
                                    ? this.appService.imgUrl + value.product_images[0].small
                                    : !value.product_images.length && item.product_images.length && item.product_images[0].small.startsWith('http')
                                        ? item.product_images[0].small
                                        : this.appService.imgUrl + item.product_images[0].small
                        // image: item.images[0].small
                    };
                    this.productsCatArray.push(newProduct);
                });
            });
            // }
            this.products = this.productsCatArray;

            // for show more product
            /*for (let index = 0; index < 3; index++) {
                      this.products = this.products.concat(this.products);
                  }*/
        });
    }

    public getProductsByBrand(brandId) {
        this.spinnerService.requestInProcess(true);
        this.appService.getAllProductsByBrand(brandId).subscribe(data => {
            this.spinnerService.requestInProcess(false);
            this.products = data.data.products.data;
            this.itemPerPage = data.data.per_page;
            this.productsBrandArray = [];
            // if (this.products.length > 0) {
            this.products.forEach(value => {
                value.suppliers.forEach(item => {
                    const newProduct = {
                        id: value.id,
                        name: value.name,
                        category_id: value.category_id,
                        supplier_id: item.id,
                        supplier_name: item.name,
                        price: item.price,
                        image: !value.product_images.length && !item.product_images.length
                            ? 'assets/images/img_not_available.png'
                            : value.product_images.length && !item.product_images.length && value.product_images[0].small.startsWith('http')
                                ? value.product_images[0].small
                                : value.product_images.length && !item.product_images.length && !value.product_images[0].small.startsWith('http')
                                    ? this.appService.imgUrl + value.product_images[0].small
                                    : !value.product_images.length && item.product_images.length && item.product_images[0].small.startsWith('http')
                                        ? item.product_images[0].small
                                        : this.appService.imgUrl + item.product_images[0].small
                        /*image: !item.product_images.length
                            ? value.product_images[0].small
                            : item.product_images[0].small.startsWith('http')
                                ? item.product_images[0].small
                                : this.appService.imgUrl + item.product_images[0].small*/
                    };
                    this.productsBrandArray.push(newProduct);
                });
            });
            // }
            this.products = this.productsBrandArray;
        });
    }

    public getAllProductsNew(page?, count?) {
        if (this.productsArray.length) {
            this.productsArray = [];
        }
        this.spinnerService.requestInProcess(true);
        this.appService.getAllProductsNew(page, count).subscribe(data => {
            this.spinnerService.requestInProcess(false);
            this.totalProducts = data.data.total;
            this.products = data.data.data;
            // console.log(this.products);
            this.products.forEach(value => {
                value.suppliers.forEach(item => {
                    const newProduct = {
                        id: value.id,
                        name: value.name,
                        category_id: value.category_id,
                        supplier_id: item.id,
                        supplier_name: item.name,
                        price: item.price,
                        // image: item.images.length > 0 ? item.images[0].small : ''
                        image: !value.product_images.length && !item.product_images.length
                            ? 'assets/images/img_not_available.png'
                            : value.product_images.length && !item.product_images.length && value.product_images[0].small.startsWith('http')
                                ? value.product_images[0].small
                                : value.product_images.length && !item.product_images.length && !value.product_images[0].small.startsWith('http')
                                    ? this.appService.imgUrl + value.product_images[0].small
                                    : !value.product_images.length && item.product_images.length && item.product_images[0].small.startsWith('http')
                                        ? item.product_images[0].small
                                        : this.appService.imgUrl + item.product_images[0].small
                        /*image: !item.product_images.length
                            ? value.product_images[0].small
                            : item.product_images[0].small.startsWith('http')
                                ? item.product_images[0].small
                                : this.appService.imgUrl + item.product_images[0].small*/
                    };
                    // 'assets/images/img_not_available.png'
                    this.productsArray.push(newProduct);
                });
            });
            this.products = this.productsArray;

            // for show more product
            /*for (let index = 0; index < 3; index++) {
                      this.productsArray = this.productsArray.concat(this.productsArray);
                  }*/
        });
    }

    public getCategories() {
        this.spinnerService.requestInProcess(true);
        if (this.appService.Data.categories.length === 0) {
            this.appService.getCategories().subscribe(data => {
                this.spinnerService.requestInProcess(false);
                this.categories = data.data;
                this.appService.Data.categories = data.data;
            });
        } else {
            this.spinnerService.requestInProcess(false);
            this.categories = this.appService.Data.categories;
        }
    }

    public getBrands() {
        this.brands = this.appService.getBrands();
    }

    public getBrandsNew() {
        // this.brands = this.appService.getBrandsNew();
        this.spinnerService.requestInProcess(true);
        this.appService.getBrandsNew().subscribe(data => {
            this.brands = data.data;
            // console.log(this.brands);
            this.spinnerService.requestInProcess(false);
        });
    }

    public getImgSrc(brand) {
        return !brand.image ? 'assets/images/img_not_available.png'
            : brand.image && brand.image.small.startsWith('http')
                ? brand.image.small
                : this.appService.imgUrl + brand.image.small;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        window.innerWidth < 960
            ? (this.sidenavOpen = false)
            : (this.sidenavOpen = true);
        window.innerWidth < 1280 ? (this.viewCol = 33.3) : (this.viewCol = 25);
    }

    public changeCount(count) {
        this.count = count;
        /*this.getAllProducts();*/
        this.getAllProductsNew(1, this.count);
    }

    public changeSorting(sort) {
        this.sort = sort;
        switch (sort) {
            case 'Default': {
                this.products.sort((a, b) => {
                    return a.id - b.id;
                });
                break;
            }
            case 'Lowest Price': {
                this.products.sort((a, b) => {
                    return a.price - b.price;
                });
                break;
            }
            case 'Highest Price': {
                this.products.sort((a, b) => {
                    return b.price - a.price;
                });
                break;
            }
        }
    }

    public changeViewType(viewType, viewCol) {
        this.viewType = viewType;
        this.viewCol = viewCol;
    }

    public openProductDialog(product) {
        const dialogRef = this.dialog.open(ProductDialogComponent, {
            data: product,
            panelClass: 'product-dialog'
        });
        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                this.router.navigate(['/products', product.id, product.name]);
            }
        });
    }

    public onPageChanged(event) {
        this.page = event;
        /*this.getAllProducts();*/
        this.getAllProductsNew(this.page, this.count);
        window.scrollTo(0, 0);
    }

    public onChangeCategory(event) {
        console.log(event);
        this.router.navigate(['/products/category', event.id, event.name]);
        /*if (event.target) {
                this.router.navigate(['/products', event.target.innerText.toLowerCase()]);
            }*/
    }

    public getBrandProducts(brand) {
        this.router.navigate(['/products/brand', brand.id, brand.name]);
    }
}
