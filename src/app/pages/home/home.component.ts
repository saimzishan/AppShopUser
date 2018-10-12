import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {Product} from '../../app.models';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    /*public slides = [
        {title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner1.jpg'},
        {title: 'Summer collection', subtitle: 'New Arrivals On Sale', image: 'assets/images/carousel/banner2.jpg'},
        {title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner3.jpg'},
        {title: 'Summer collection', subtitle: 'New Arrivals On Sale', image: 'assets/images/carousel/banner4.jpg'},
        {title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner5.jpg'}
    ];*/

    public slides = [];
    public brands = [];
    public banners = [];
    public featuredProducts: Array<Product>;
    public onSaleProducts: Array<Product>;
    public topRatedProducts: Array<Product>;
    public newArrivalsProducts: Array<Product>;
    /*public featuredProductsArray = [];
    public onSaleProductsArray = [];
    public topRatedProductsArray = [];*/


    constructor(public appService: AppService) {
    }

    ngOnInit() {
        this.getBanners();
        this.getProductsNew('featured');
        this.getBrandsNew();
        this.getSlides();
    }

    public onLinkClick(e) {
        this.getProductsNew(e.tab.textLabel.toLowerCase());
    }

    public getSlides() {
        this.appService.getSlides().subscribe(data => {
            // console.log(data.data);
            this.slides = data.data.data;
            // console.log(this.slides);
            this.slides.map(item => {
               // console.log(item);
               item.title = 'The biggest sale';
               item.subtitle = 'Special for today';
            });
            // console.log(this.slides);
        });
    }

    public getProductsNew (type) {
        if (type === 'featured' && !this.featuredProducts) {
            this.appService.getProductsNew('featured').subscribe(data => {
                this.featuredProducts = data.data.data;
                this.featuredProducts = this.createProductsArray(this.featuredProducts);
            });
        }
        if (type === 'on sale' && !this.onSaleProducts) {
            this.appService.getProductsNew('on-sale').subscribe(data => {
                this.onSaleProducts = data.data.data;
                this.onSaleProducts = this.createProductsArray(this.onSaleProducts);
            });
        }
        if (type === 'top rated' && !this.topRatedProducts) {
            this.appService.getProductsNew('top-rated').subscribe(data => {
                this.topRatedProducts = data.data.data;
                this.topRatedProducts = this.createProductsArray(this.topRatedProducts);
            });
        }
        if (type === 'new arrivals' && !this.newArrivalsProducts) {
            this.appService.getProductsNew('new-arrival').subscribe(data => {
                this.newArrivalsProducts = data.data.data;
                this.newArrivalsProducts = this.createProductsArray(this.newArrivalsProducts);
            });
        }

    }

    /*public getProducts(type) {
        if (type === 'featured' && !this.featuredProducts) {
            this.appService.getProducts('featured').subscribe(data => {
                this.featuredProducts = data;
            });
        }
        if (type === 'on sale' && !this.onSaleProducts) {
            this.appService.getProducts('on-sale').subscribe(data => {
                this.onSaleProducts = data;
            });
        }
        if (type === 'top rated' && !this.topRatedProducts) {
            this.appService.getProducts('top-rated').subscribe(data => {
                this.topRatedProducts = data;
            });
        }
        if (type === 'new arrivals' && !this.newArrivalsProducts) {
            this.appService.getProducts('new-arrivals').subscribe(data => {
                this.newArrivalsProducts = data;
            });
        }

    }*/

    public createProductsArray(productArray) {
        let newProductArray = [];
        productArray.forEach(value => {
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
                newProductArray.push(newProduct);
            });
        });
        return newProductArray;
    }

    public getBanners() {
        this.appService.getBanners().subscribe(data => {
            console.log(data.data.data);
            this.banners = data.data.data;
            this.banners.map(item => {
                // console.log(item);
                item.title = 'The biggest sale';
                item.subtitle = 'Special for today';
            });
            // console.log(this.banners);
        });
    }

    /*public getBanners() {
        this.appService.getBanners().subscribe(data => {
            this.banners = data;
        });
    }*/

    public getBrandsNew() {
        // this.brands = this.appService.getBrandsNew();
        this.appService.getBrandsNew().subscribe(data => {
            this.brands = data.data;
            // console.log(this.brands);
        });
    }

}
