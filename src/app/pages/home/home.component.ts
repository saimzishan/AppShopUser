import { Component, OnInit } from "@angular/core";
import { AppService } from "../../app.service";
import { Product } from "../../app.models";
import { NgxSpinnerService } from "ngx-spinner";
import { SpinnerService } from "../../shared/spinner/spinner.service";
import { TranslateService } from "@ngx-translate/core";
import { DetectChangesService } from "../../shared/detectchanges.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
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
  public appShopSlides = [];
  public brands = [];
  public banners = [];
  public featuredProducts: Array<Product>;
  public onSaleProducts: Array<Product>;
  public topRatedProducts: Array<Product>;
  public newArrivalsProducts: Array<Product>;
  public hotProducts: Array<Product>;
  nofeaturedProducts = false;
  noonsaleProducts = false;
  nonewarrivalProducts = false;
  nohotProducts = false;
  cartSubscription: any;

  /*public featuredProductsArray = [];
      public onSaleProductsArray = [];
      public topRatedProductsArray = [];*/

  constructor(
    public appService: AppService,
    private spinner: NgxSpinnerService,
    public spinnerService: SpinnerService,
    private translateService: TranslateService,
    private detectChanges: DetectChangesService
  ) {
    translateService.addLangs(["en", "de"]);
    translateService.setDefaultLang("de");
    this.cartSubscription = this.detectChanges.notifyObservable$.subscribe(
      res => {
        // console.log(res);
        if (res) {
          if (res.option === "switchLanguage") {
            this.translateService.use(res.value);
          }
        }
      }
    );
  }

  ngOnInit() {
    // this.getBanners();
    this.getProductsNew("featured");
    this.getProductsNew("on sale");
    this.getProductsNew("new arrivals");
    this.getProductsNew("hot");
    this.getBrandsNew();
    this.getSlides();
    this.getAppShopSlides();
  }

  public onLinkClick(e) {
    this.getProductsNew(e.tab.textLabel.toLowerCase());
  }

  public getSlides() {
    this.spinnerService.requestInProcess(true);
    this.appService.getSlides().subscribe(data => {
      this.slides = data.data;
      // console.log(this.slides);
      // this.slides = this.slides.slice(1, 6);
      this.spinnerService.requestInProcess(false);

      /*if (this.slides) {
                  this.slides.map(item => {
                     // console.log(item);
                     item.title = 'The biggest sale';
                     item.subtitle = 'Special for today';
                  });
                  }*/
    });
  }

  public getAppShopSlides() {
    this.spinnerService.requestInProcess(true);
    this.appService.getAppShopSlides().subscribe(data => {
      this.appShopSlides = data.data;
      // console.log(this.appShopSlides);
      // this.slides = this.slides.slice(1, 6);
      this.spinnerService.requestInProcess(false);
    });
  }

  public getProductsNew(type) {
    if (type === "featured" && !this.featuredProducts) {
      this.spinnerService.requestInProcess(true);

      this.appService.getProductsNew("featured").subscribe(data => {
        this.featuredProducts = data.data;
        if (data.length === 0) {
          this.nofeaturedProducts = true;
        }
        this.featuredProducts = this.createProductsArray(this.featuredProducts);
        this.spinnerService.requestInProcess(false);
      });
    }
    if (type === "on sale" && !this.onSaleProducts) {
      this.spinnerService.requestInProcess(true);

      this.appService.getProductsNew("on-sale").subscribe(data => {
        this.spinnerService.requestInProcess(false);
        this.onSaleProducts = data.data;
        if (data.length === 0) {
          this.noonsaleProducts = true;
        }
        this.onSaleProducts = this.createProductsArray(this.onSaleProducts);
        this.spinnerService.requestInProcess(false);
      });
    }
    if (type === "top rated" && !this.topRatedProducts) {
      this.spinnerService.requestInProcess(true);

      this.appService.getProductsNew("top-rated").subscribe(data => {
        this.topRatedProducts = data.data;
        this.topRatedProducts = this.createProductsArray(this.topRatedProducts);
        this.spinnerService.requestInProcess(false);
      });
    }
    if (type === "new arrivals" && !this.newArrivalsProducts) {
      this.spinnerService.requestInProcess(true);

      this.appService.getProductsNew("new-arrival").subscribe(data => {
        this.newArrivalsProducts = data.data;
        if (data.length === 0) {
          this.nonewarrivalProducts = true;
        }
        this.spinnerService.requestInProcess(false);

        this.newArrivalsProducts = this.createProductsArray(
          this.newArrivalsProducts
        );
      });
    }
    if (type === "hot" && !this.hotProducts) {
      this.spinnerService.requestInProcess(true);

      this.appService.getProductsNew("hot").subscribe(data => {
        this.hotProducts = data.data;
        // console.log(this.hotProducts);
        if (data.length === 0) {
          this.nohotProducts = true;
        }
        this.spinnerService.requestInProcess(false);

        this.hotProducts = this.createProductsArray(this.hotProducts);
      });
    }
    // this.spinnerService.requestInProcess(false);
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
    const newProductArray = [];
    // console.log(productArray);
    if (productArray.length) {
      productArray.forEach(value => {
        // console.log(value);
        if (value) {
          value.suppliers.forEach(item => {
            // console.log(item.images);
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
                              : item.product_images[0].small.startsWith("http")
                              ? item.product_images[0].small
                              : this.appService.imgUrl + item.product_images[0].small*/
            };
            newProductArray.push(newProduct);
          });
        }
      });
    }
    // console.log(newProductArray);
    return newProductArray;
  }

  public getBanners() {
    this.appService.getBanners().subscribe(data => {
      // console.log(data.data);
      this.banners = data.data;
      /*if (this.banners) {
                  this.banners.map(item => {
                      // console.log(item);
                      item.title = 'The biggest sale';
                      item.subtitle = 'Special for today';
                  });
                  }*/
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
      this.brands.map(item => {
        item.image = !item.image
          ? "assets/images/img_not_available.png"
          : item.image.small.startsWith("http")
          ? item.image.small
          : this.appService.imgUrl + item.image.small;
      });
    });
  }
}
