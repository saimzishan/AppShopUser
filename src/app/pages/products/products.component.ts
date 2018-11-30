import {
    Component,
    OnInit,
    ViewChild,
    HostListener,
    OnDestroy
} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {ProductDialogComponent} from "../../shared/products-carousel/product-dialog/product-dialog.component";
import {AppService} from "../../app.service";
import {Product, Category} from "../../app.models";
import {SpinnerService} from "../../shared/spinner/spinner.service";
import {DetectChangesService} from "../../shared/detectchanges.service";

@Component({
    selector: "app-products",
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.scss"]
})
export class ProductsComponent implements OnInit, OnDestroy {
    @ViewChild("sidenav") sidenav: any;
    public sidenavOpen: boolean = true;
    private sub: any;
    public viewType: string = "grid";
    public viewCol: number = 25;
    public counts = [12, 24, 36];
    public count = 12;
    public sortings = ["Default", "Lowest Price", "Highest Price"];
    public sort: any;
    public products: Array<Product> = [];
    public productsArray = [];
    public productsCatArray = [];
    public productsBrandArray = [];
    public categories: Category[];
    public brands = [];
    option;
    public colors = [
        "#5C6BC0",
        "#66BB6A",
        "#EF5350",
        "#BA68C8",
        "#FF4081",
        "#9575CD",
        "#90CAF9",
        "#B2DFDB",
        "#DCE775",
        "#FFD740",
        "#00E676",
        "#FBC02D",
        "#FF7043",
        "#F5F5F5",
        "#000000"
    ];
    public sizes = [
        "S",
        "M",
        "L",
        "XL",
        "2XL",
        "32",
        "36",
        "38",
        "46",
        "52",
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
    searching;

    constructor(
        private activatedRoute: ActivatedRoute,
        public appService: AppService,
        public dialog: MatDialog,
        private router: Router,
        private spinnerService: SpinnerService,
        private detectChangesService: DetectChangesService
    ) {
        this.categories = new Array<Category>();
    }

    ngOnInit() {
        const tempSearch = localStorage.getItem("searching");
        this.count = this.counts[0];
        this.sort = this.sortings[0];

        if (tempSearch) {
            this.getFilteredProduct(tempSearch, "?search=");
        }
        this.sub = this.activatedRoute.params.subscribe(params => {
            const currentUrl = this.router.url;
            this.param = params["id"];
            if (currentUrl.indexOf("products/browsing-history") !== -1) {
                this.getHistoryProducts();
            } else if (currentUrl.indexOf("products/today-deals") !== -1) {
                // const catId = this.param.substr(0, this.param.indexOf('cat'));
                this.getTodayDealsProducts();
            } else if (this.param && currentUrl.indexOf("products/category") !== -1) {
                // const catId = this.param.substr(0, this.param.indexOf('cat'));
                this.getProductsByCat(this.param);
            } else if (this.param && currentUrl.indexOf("products/brand") !== -1) {
                // const brandId = this.param.substr(0, this.param.indexOf('bnd'));
                this.getProductsByBrand(this.param);
            } else if (!tempSearch) {
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
        this.searching = this.detectChangesService.notifyObservable$.subscribe(
            res => {
                if (res.option === "searching") {
                    this.option = "?search=";
                    this.getFilteredProduct(res.value, this.option);
                } else if (res.option === "all") {
                    localStorage.removeItem("searching");
                    this.ngOnInit();
                } else if (res.option.startsWith("?")) {
                    this.getFilteredProduct(res.value, res.option);
                }
            }
        );
    }

    public getProductsByCat(catId) {
        this.spinnerService.requestInProcess(true);
        this.appService.getAllProductsByCat(catId).subscribe(data => {
            this.spinnerService.requestInProcess(false);
            this.products = data.data.products.data;
            this.productsCatArray = [];
            this.products.forEach(value => {
                value.suppliers.forEach(item => {
                    const newProduct = {
                        id: value.id,
                        name: value.name,
                        category_id: value.category_id,
                        supplier_id: item.id,
                        supplier_name: item.name,
                        price: item.price,
                        image:
                            !value.product_images.length && !item.product_images.length
                                ? "assets/images/img_not_available.png"
                                : value.product_images.length &&
                                !item.product_images.length &&
                                value.product_images[0].small.startsWith("http")
                                ? value.product_images[0].small
                                : value.product_images.length &&
                                !item.product_images.length &&
                                !value.product_images[0].small.startsWith("http")
                                    ? this.appService.imgUrl + value.product_images[0].small
                                    : !value.product_images.length &&
                                    item.product_images.length &&
                                    item.product_images[0].small.startsWith("http")
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
                        image:
                            !value.product_images.length && !item.product_images.length
                                ? "assets/images/img_not_available.png"
                                : value.product_images.length &&
                                !item.product_images.length &&
                                value.product_images[0].small.startsWith("http")
                                ? value.product_images[0].small
                                : value.product_images.length &&
                                !item.product_images.length &&
                                !value.product_images[0].small.startsWith("http")
                                    ? this.appService.imgUrl + value.product_images[0].small
                                    : !value.product_images.length &&
                                    item.product_images.length &&
                                    item.product_images[0].small.startsWith("http")
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

    public getHistoryProducts() {
        const browsingHistory = JSON.parse(localStorage.getItem('browsing_history'));
        // console.log(browsingHistory);
        if (this.productsArray.length) {
            this.productsArray = [];
        }
        this.appService.getHistoryProducts(browsingHistory).subscribe(data => {
            // console.log(data);
            this.totalProducts = 10;
            this.products = data.data;
            // console.log(this.products);
            /*this.products.forEach(value => {
                value.suppliers.forEach(item => {
                    // console.log(item);
                    const newProduct = {
                        id: value.id,
                        name: value.name,
                        category_id: value.category_id,
                        supplier_id: item.id,
                        supplier_name: item.name,
                        price: item.price,
                        ratingsCount: item.product_rating.length
                            ? item.product_rating[0].ratingsCount
                            : null,
                        ratingsValue: item.product_rating.length
                            ? item.product_rating[0].ratingsValue
                            : null,
                        // image: item.images.length > 0 ? item.images[0].small : ''
                        image:
                            !value.product_images.length && !item.product_images.length
                                ? "assets/images/img_not_available.png"
                                : value.product_images.length &&
                                !item.product_images.length &&
                                value.product_images[0].small.startsWith("http")
                                ? value.product_images[0].small
                                : value.product_images.length &&
                                !item.product_images.length &&
                                !value.product_images[0].small.startsWith("http")
                                    ? this.appService.imgUrl + value.product_images[0].small
                                    : !value.product_images.length &&
                                    item.product_images.length &&
                                    item.product_images[0].small.startsWith("http")
                                        ? item.product_images[0].small
                                        : this.appService.imgUrl + item.product_images[0].small
                    };
                    // 'assets/images/img_not_available.png'
                    this.productsArray.push(newProduct);
                });
            });*/
            // this.products = this.productsArray;

            this.products = this.createProductsArray(this.products);
            this.spinnerService.requestInProcess(false);
        });
    }

    public getTodayDealsProducts() {
        this.spinnerService.requestInProcess(true);
        this.appService.getProductsNew("today-deal").subscribe(data => {
            this.products = data.data;
            this.products = this.createProductsArray(this.products);
            this.spinnerService.requestInProcess(false);
        });
    }

    public getAllProductsNew(page?, count?) {
        if (this.productsArray.length) {
            this.productsArray = [];
        }
        this.spinnerService.requestInProcess(true);
        this.appService.getAllProductsNew(page, count).subscribe(data => {
            this.totalProducts = data.data.total;
            this.products = data.data.data;
            // console.log(this.products);
            /*this.products.forEach(value => {
                value.suppliers.forEach(item => {
                    // console.log(item);
                    const newProduct = {
                        id: value.id,
                        name: value.name,
                        category_id: value.category_id,
                        supplier_id: item.id,
                        supplier_name: item.name,
                        price: item.price,
                        ratingsCount: item.product_rating.length
                            ? item.product_rating[0].ratingsCount
                            : null,
                        ratingsValue: item.product_rating.length
                            ? item.product_rating[0].ratingsValue
                            : null,
                        // image: item.images.length > 0 ? item.images[0].small : ''
                        image:
                            !value.product_images.length && !item.product_images.length
                                ? "assets/images/img_not_available.png"
                                : value.product_images.length &&
                                !item.product_images.length &&
                                value.product_images[0].small.startsWith("http")
                                ? value.product_images[0].small
                                : value.product_images.length &&
                                !item.product_images.length &&
                                !value.product_images[0].small.startsWith("http")
                                    ? this.appService.imgUrl + value.product_images[0].small
                                    : !value.product_images.length &&
                                    item.product_images.length &&
                                    item.product_images[0].small.startsWith("http")
                                        ? item.product_images[0].small
                                        : this.appService.imgUrl + item.product_images[0].small
                        /!*image: !item.product_images.length
                                        ? value.product_images[0].small
                                        : item.product_images[0].small.startsWith('http')
                                            ? item.product_images[0].small
                                            : this.appService.imgUrl + item.product_images[0].small*!/
                    };
                    // 'assets/images/img_not_available.png'
                    this.productsArray.push(newProduct);
                });
            });*/
            // this.products = this.productsArray;
            this.products = this.createProductsArray(this.products);
            this.spinnerService.requestInProcess(false);

            // for show more product
            /*for (let index = 0; index < 3; index++) {
                            this.productsArray = this.productsArray.concat(this.productsArray);
                        }*/
        });
    }

    public createProductsArray(productArray) {
        const newProductArray = [];
        console.log(productArray);
        if (productArray.length) {
            productArray.forEach(value => {
                if (value) {
                    value.suppliers.forEach(item => {
                        // console.log(item);
                        const newProduct = {
                            id: value.id,
                            name: value.name,
                            category_id: value.category_id,
                            supplier_id: item.id,
                            supplier_name: item.name,
                            price: item.price,
                            ratingsCount: item.product_rating.length
                                ? item.product_rating[0].ratingsCount
                                : null,
                            ratingsValue: item.product_rating.length
                                ? item.product_rating[0].ratingsValue
                                : null,
                            // image: item.images.length > 0 ? item.images[0].small : ''
                            image:
                                !value.product_images.length && !item.product_images.length
                                    ? "assets/images/img_not_available.png"
                                    : value.product_images.length &&
                                    !item.product_images.length &&
                                    value.product_images[0].small.startsWith("http")
                                    ? value.product_images[0].small
                                    : value.product_images.length &&
                                    !item.product_images.length &&
                                    !value.product_images[0].small.startsWith("http")
                                        ? this.appService.imgUrl + value.product_images[0].small
                                        : !value.product_images.length &&
                                        item.product_images.length &&
                                        item.product_images[0].small.startsWith("http")
                                            ? item.product_images[0].small
                                            : this.appService.imgUrl + item.product_images[0].small
                            /*image: !item.product_images.length
                                            ? value.product_images[0].small
                                            : item.product_images[0].small.startsWith('http')
                                                ? item.product_images[0].small
                                                : this.appService.imgUrl + item.product_images[0].small*/
                        };
                        // 'assets/images/img_not_available.png'
                        newProductArray.push(newProduct);
                    });
                }
            });
        }
        return newProductArray;
    }

    public getCategories() {
        this.spinnerService.requestInProcess(true);
        if (this.appService.Data.categories.length === 0) {
            this.appService.getCategories().subscribe(data => {
                this.spinnerService.requestInProcess(false);
                this.categories = data.data;
                // let rootCat = document.getElementById('rootCat');
                // rootCat.click();

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
        return !brand.image
            ? "assets/images/img_not_available.png"
            : brand.image && brand.image.small.startsWith("http")
                ? brand.image.small
                : this.appService.imgUrl + brand.image.small;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        if (this.router.url !== "/products") {
            localStorage.removeItem("searching");
        }
    }

    @HostListener("window:resize")
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
            case "Default": {
                this.products.sort((a, b) => {
                    return a.id - b.id;
                });
                break;
            }
            case "Lowest Price": {
                this.products.sort((a, b) => {
                    return a.price - b.price;
                });
                break;
            }
            case "Highest Price": {
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
            panelClass: "product-dialog"
        });
        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                this.router.navigate(["/products", product.id, product.name]);
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
        this.router.navigate(["/products/category", event.id, event.name]);
        /*if (event.target) {
                    this.router.navigate(['/products', event.target.innerText.toLowerCase()]);
                }*/
    }

    public getBrandProducts(brand) {
        this.router.navigate(["/products/brand", brand.id, brand.name]);
    }

    public getFilteredProduct(word, option) {
        // if (this.productsArray.length) {
        this.productsArray = [];
        // }

        this.spinnerService.requestInProcess(true);
        this.appService.getFilteredProduct(word, option).subscribe(data => {
            this.totalProducts = data.data.total;
            this.products = data.data.data;
            this.products.forEach(value => {
                value.suppliers.forEach(item => {
                    // console.log(item);
                    const newProduct = {
                        id: value.id,
                        name: value.name,
                        category_id: value.category_id,
                        supplier_id: item.id,
                        supplier_name: item.name,
                        price: item.price,
                        ratingsCount: item.product_rating.length
                            ? item.product_rating[0].ratingsCount
                            : null,
                        ratingsValue: item.product_rating.length
                            ? item.product_rating[0].ratingsValue
                            : null,
                        // image: item.images.length > 0 ? item.images[0].small : ''
                        image:
                            !value.product_images.length && !item.product_images.length
                                ? "assets/images/img_not_available.png"
                                : value.product_images.length &&
                                !item.product_images.length &&
                                value.product_images[0].small.startsWith("http")
                                ? value.product_images[0].small
                                : value.product_images.length &&
                                !item.product_images.length &&
                                !value.product_images[0].small.startsWith("http")
                                    ? this.appService.imgUrl + value.product_images[0].small
                                    : !value.product_images.length &&
                                    item.product_images.length &&
                                    item.product_images[0].small.startsWith("http")
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
            this.spinnerService.requestInProcess(false);

            // for show more product
            /*for (let index = 0; index < 3; index++) {
                            this.productsArray = this.productsArray.concat(this.productsArray);
                        }*/
        });
    }
}
