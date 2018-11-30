import {Component, OnInit} from "@angular/core";
import {Category, Product} from "../../app.models";
import {AppService} from "../../app.service";
import {SpinnerService} from "../../shared/spinner/spinner.service";

@Component({
    selector: 'app-browsing-history',
    templateUrl: './browsing-history.component.html',
    styleUrls: ['./browsing-history.component.scss']
})

export class BrowsingHistoryComponent implements OnInit {

    public products: Array<Product> = [];
    public productsArray = [];
    public totalProducts;
    public categories: Category[];
    public brands = [];

    constructor(private appService: AppService, private spinnerService: SpinnerService) {
        this.categories = new Array<Category>();
    }

    ngOnInit() {
        this.getHistoryProducts();
        this.getCategories();
        this.getBrandsNew();
    }

    public getHistoryProducts() {
        const browsingHistory = JSON.parse(localStorage.getItem('browsing_history'));
        console.log(browsingHistory);
        if (this.productsArray.length) {
            this.productsArray = [];
        }
        this.appService.getHistoryProducts(browsingHistory).subscribe(data => {
            console.log(data);
            this.spinnerService.requestInProcess(false);
            this.totalProducts = data.data.total;
            this.products = data.data.data;
            // console.log(this.products);
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
        });
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
}
