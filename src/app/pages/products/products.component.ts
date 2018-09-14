import {Component, OnInit, ViewChild, HostListener, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ProductDialogComponent} from '../../shared/products-carousel/product-dialog/product-dialog.component';
import {AppService} from '../../app.service';
import {Product, Category} from '../../app.models';

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
    public count: any;
    public sortings = ['Sort by Default', 'Best match', 'Lowest first', 'Highest first'];
    public sort: any;
    public products: Array<Product> = [];
    public productsArray = [];
    public productsCatArray = [];
    public categories: Category[];
    public brands = [];
    public priceFrom: number = 750;
    public priceTo: number = 1599;
    public colors = ['#5C6BC0', '#66BB6A', '#EF5350', '#BA68C8', '#FF4081', '#9575CD', '#90CAF9', '#B2DFDB', '#DCE775', '#FFD740', '#00E676', '#FBC02D', '#FF7043', '#F5F5F5', '#000000'];
    public sizes = ['S', 'M', 'L', 'XL', '2XL', '32', '36', '38', '46', '52', '13.3\"', '15.4\"', '17\"', '21\"', '23.4\"'];
    public page: any;
    public avgPrice: string;
    public catId;

    constructor(private activatedRoute: ActivatedRoute, public appService: AppService, public dialog: MatDialog, private router: Router) {
    }

    ngOnInit() {
        this.count = this.counts[0];
        this.sort = this.sortings[0];
        this.sub = this.activatedRoute.params.subscribe(params => {
            // console.log(params['name']);
            this.catId = params['name'];
            // console.log(this.catId);
            if (this.catId) {
                this.getProductsByCat();
            } else {
                this.getAllProductsNew();
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

    /*public getAllProducts() {
        this.appService.getProducts('featured').subscribe(data => {
            this.products = data;
            // for show more product
            for (var index = 0; index < 3; index++) {
                this.products = this.products.concat(this.products);
            }
        });
    }*/

    public getProductsByCat() {
        this.appService.getAllProductsByCat(this.catId).subscribe(data => {
            this.products = data.data.products.data;
            // console.log(this.products);
            this.productsCatArray = [];
            // if (this.products.length > 0) {
            this.products.forEach(value => {
                value.suppliers.forEach(item => {
                    // console.log(item.images);
                    let newProduct = {
                        id: value.id,
                        name: value.name,
                        category_id: value.category_id,
                        supplier_id: item.id,
                        supplier_name: item.name,
                        price: item.price,
                        image: item.images[0].small
                    };
                    this.productsCatArray.push(newProduct);
                });
            });
           // }
            this.products = this.productsCatArray;
            /*console.log(this.products);
            console.log(this.appService.Data.categories);*/

            // for show more product
            /*for (let index = 0; index < 3; index++) {
                this.products = this.products.concat(this.products);
            }*/
        });
    }

    public getAllProductsNew() {
        this.appService.getAllProductsNew().subscribe(data => {
            this.products = data.data.data;
            // console.log(this.products);
            this.products.forEach(value => {
                value.suppliers.forEach(item => {
                    // console.log(item.images);
                    let newProduct = {
                        id: value.id,
                        name: value.name,
                        category_id: value.category_id,
                        supplier_id: item.id,
                        supplier_name: item.name,
                        price: item.price,
                        image: item.images[0].small
                    };
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
        if (this.appService.Data.categories.length === 0) {
            this.appService.getCategories().subscribe(data => {
                this.categories = data.data;
                this.appService.Data.categories = data.data;
            });
        } else {
            this.categories = this.appService.Data.categories;
            // console.log(this.categories);
        }
    }

    public getBrands() {
        this.brands = this.appService.getBrands();
    }

    public getBrandsNew() {
        // this.brands = this.appService.getBrandsNew();
        this.appService.getBrandsNew().subscribe(data => {
            this.brands = data.data;
            // console.log(this.brands);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
        (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
    }

    public changeCount(count) {
        this.count = count;
        /*this.getAllProducts();*/
        this.getAllProductsNew();
    }

    public changeSorting(sort) {
        this.sort = sort;
    }

    public changeViewType(viewType, viewCol) {
        this.viewType = viewType;
        this.viewCol = viewCol;
    }

    public openProductDialog(product) {
        let dialogRef = this.dialog.open(ProductDialogComponent, {
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
        this.getAllProductsNew();
        window.scrollTo(0, 0);
    }

    public onChangeCategory(event) {
        // console.log(event);
        this.router.navigate(['/products', event]);
        /*if (event.target) {
            console.log(event);
            this.router.navigate(['/products', event.target.innerText.toLowerCase()]);
        }*/
    }

}
