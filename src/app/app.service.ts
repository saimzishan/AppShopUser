import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { MatSnackBar } from "@angular/material";
import { BrowsingHistory, Category, Order, Product } from "./app.models";
import { map } from "rxjs/operators";
import { DetectChangesService } from "./shared/detectchanges.service";

export class Data {
  constructor(
    public categories: Category[],
    public compareList: Product[],
    public wishList: Product[],
    public cartList: Product[],
    public browsingHistory: BrowsingHistory[],
    // public orderList: Order,
    public totalPrice: number
  ) {}
}

@Injectable()
export class AppService {
  public Data = new Data(
    [], // categories
    [], // compareList
    [], // wishList
    [], // cartList
    [], // maintaining viewed products
    // null, // order
    null // totalPrice
  );

  public loginRedirect = false;

  public url = "assets/data/";

  public apiUrl =
    "http://124.109.39.22:18089/onlineappshopapi/public/api/auth/";
  // public apiUrl = 'http://www.econowholesale.com/api/public/api/auth/';
  public imgUrl = "http://124.109.39.22:18089/onlineappshopapi";
  // public imgUrl = 'http://www.econowholesale.com/api';
  private currentLanguage = "en";

  public getCurrentLan() {
    return this.currentLanguage;
  }
  public setCurrentLan(language) {
    this.currentLanguage = language;
  }
  public httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  public currentUser;

  constructor(
    public http: HttpClient,
    public snackBar: MatSnackBar,
    private detectChanges: DetectChangesService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (localStorage.getItem("cartList")) {
      this.Data.cartList = JSON.parse(localStorage.getItem("cartList"));
    }
    if (localStorage.getItem("browsing_history")) {
      this.Data.browsingHistory = JSON.parse(
        localStorage.getItem("browsing_history")
      );
    }
    if (localStorage.getItem("totalPrice")) {
      this.Data.totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
    }
  }

  public getCategories(): Observable<any> {
    /*return this.http.get<Category[]>(this.url + 'categories.json');*/
    return this.http.get<any>(this.apiUrl + "categories");
  }

  public getAllCategories(): Observable<any> {
    /*return this.http.get<Category[]>(this.url + 'categories.json');*/
    return this.http.get<any>(this.apiUrl + "categories?all");
  }

  public getProducts(type): Observable<Product[]> {
    return this.http.get<Product[]>(this.url + type + "-products.json");
  }

  public getProductsNew(type): Observable<any> {
    return this.http.get<any>(this.apiUrl + "products?" + type);
  }

  public getAllProductsNew(page?, count?): Observable<any> {
    // console.log(count);
    // console.log(page);
    if (!page) {
      return this.http.get<any>(
        this.apiUrl + "products?with_suppliers&count=" + count
      );
    } else {
      return this.http.get<any>(
        this.apiUrl +
          "products?count=" +
          count +
          "&page=" +
          page +
          "&with_suppliers"
      );
    }
  }

  public getFilteredProduct(
    search,
    option: string,
    page?,
    count?
  ): Observable<any> {
    return this.http.get<any>(this.apiUrl + "products" + option + search);
  }

  public getAllProductsByCat(catId): Observable<any> {
    return this.http.get<any>(
      this.apiUrl + "categories/" + catId + "?with_products"
    );
  }

  public getAllProductsByBrand(brandId, page?, count?): Observable<any> {
    if (!page) {
      return this.http.get<any>(
        this.apiUrl + "brands/" + brandId + "?with_products&count=" + count
      );
    } else {
      return this.http.get<any>(
        this.apiUrl +
          "brands/" +
          brandId +
          "?with_products&count=" +
          count +
          "&page=" +
          page
      );
    }
  }

  public getAllProductsBySupplier(supplierId, page?, count?): Observable<any> {
    if (!page) {
      return this.http.get<any>(
        this.apiUrl +
          "suppliers/" +
          supplierId +
          "?with_products&count=" +
          count
      );
    } else {
      return this.http.get<any>(
        this.apiUrl +
          "suppliers/" +
          supplierId +
          "?with_products&count=" +
          count +
          "&page=" +
          page
      );
    }
  }

  public getProductById(id): Observable<Product> {
    return this.http.get<Product>(this.url + "product-" + id + ".json");
  }

  public getProductByIdNew(id, supId): Observable<any> {
    return this.http.get<any>(
      this.apiUrl + "products?product_id=" + id + "&supplier_id=" + supId
    );
  }

  public getTodayDealsProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "products?product_id=");
  }

  public getHistoryProducts(historyProducts): Observable<any> {
    return this.http.post<any>(this.apiUrl + "browsingHistory", {
      historyProducts: historyProducts
    });
  }

  public getProductReviews(id, supId): Observable<any> {
    return this.http.get<any>(
      "http://www.econowholesale.com/api/public/api/detailedRatings?product_id=" +
        id +
        "&supplier_id=" +
        supId
    );
  }

  public getBanners(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "products?promoted&count=6");
  }

  /*public getBanners(): Observable<any[]> {
        return this.http.get<any[]>(this.url + 'banners.json');
    }*/

  /*public getSlides(): Observable<any> {
        return this.http.get<any>(this.apiUrl + 'products?slider');
    }*/

  public getSlides(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "sliders");
  }

  public getAppShopSlides(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "products?slider");
  }

  public getBrandsNew(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "brands");
  }

  public getSuppliers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "suppliers");
  }

  public createOrder(order): Observable<any> {
    let httpOptions;
    // console.log(this.currentUser);
    /* if (this.currentUser) {
           httpOptions = {
               headers: new HttpHeaders({
                   'Content-Type': 'application/json',
                   Authorization: `Bearer ${this.currentUser.access_token}`
               })
           };
       }*/
    if (order.user_id === -1) {
      httpOptions = this.httpOptions;
    } else {
      httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.currentUser.access_token}`
        })
      };
    }
    return this.http.post<any>(this.apiUrl + "orders", order, httpOptions);
  }

  public contactUs(user): Observable<any> {
    return this.http.post<any>(this.apiUrl + "contactUs", { user: user });
  }

  public getClientToken(): Observable<any> {
    /*let httpOptions;
        if (this.currentUser) {
            httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.currentUser.access_token}`
                })
            };
        }*/
    return this.http.get<any>(this.apiUrl + "cashiers", this.httpOptions).pipe(
      map((token: any) => {
        // console.log(token.data);
        return token.data;
        // console.log(token);
      })
    );
  }

  public createPurchase(purchaseObj): Observable<any> {
    return this.http
      .post(this.apiUrl + "cashiers", purchaseObj, this.httpOptions)
      .pipe(
        map((response: any) => {
          console.log(response);
          return response;
        })
      );
  }

  public getOrders(user_id): Observable<any> {
    let httpOptions;
    if (this.currentUser) {
      httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.currentUser.access_token}`
        })
      };
    }
    return this.http.get<any>(
      this.apiUrl + "orders?user_id=" + user_id,
      httpOptions
    );
  }

  public postRating(ratingObj): Observable<any> {
    let httpOptions;
    // console.log(this.currentUser);
    if (this.currentUser) {
      httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.currentUser.access_token}`
        })
      };
    }
    // console.log(httpOptions);
    // console.log(ratingObj);
    return this.http.post<any>(
      this.apiUrl + "detailedRatings",
      ratingObj,
      httpOptions
    );
  }

  /*public updateOrder(orderId): Observable<any> {
        return this.http.put();
    }*/

  public addToCompare(product: Product) {
    let message, status;
    if (this.Data.compareList.filter(item => item.id === product.id)[0]) {
      message =
        "The product " + product.name + " already added to comparison list.";
      status = "error";
    } else {
      this.Data.compareList.push(product);
      message =
        "The product " + product.name + " has been added to comparison list.";
      status = "success";
    }
    this.snackBar.open(message, "×", {
      panelClass: [status],
      verticalPosition: "top",
      duration: 3000
    });
  }

  public addToWishList(product: Product) {
    let message, status;
    if (this.Data.wishList.filter(item => item.id === product.id)[0]) {
      message = "The product " + product.name + " already added to wish list.";
      status = "error";
    } else {
      this.Data.wishList.push(product);
      message = "The product " + product.name + " has been added to wish list.";
      status = "success";
    }
    this.snackBar.open(message, "×", {
      panelClass: [status],
      verticalPosition: "top",
      duration: 3000
    });
  }

  public addToCart(product: Product, count: number) {
    /*public addToCart(product: Product) {*/
    // console.log(product);
    // console.log(this.Data.cartList);
    if (!this.Data.cartList) {
      this.Data.cartList = [];
    }
    let message, status;
    if (
      this.Data.cartList.length &&
      this.Data.cartList.filter(item => item.id === product.id)[0]
    ) {
      message = "The product " + product.name + " already added to cart.";
      status = "error";
    } else {
      this.Data.totalPrice = null;
      // product.price = (+product.price * count).toString();
      product.count = count;
      this.Data.cartList.push(product);
      this.Data.cartList.forEach(cartProduct => {
        /*this.Data.totalPrice = this.Data.totalPrice + cartProduct.newPrice;*/
        this.Data.totalPrice =
          this.Data.totalPrice + +cartProduct.price * cartProduct.count;
      });
      if (localStorage.getItem("cartList")) {
        localStorage.removeItem("cartList");
      }
      localStorage.setItem("cartList", JSON.stringify(this.Data.cartList));
      if (localStorage.getItem("totalPrice")) {
        localStorage.removeItem("totalPrice");
      }
      localStorage.setItem("totalPrice", JSON.stringify(this.Data.totalPrice));
      this.detectChanges.cartSync({
        option: "cartChanged",
        value: true
      });
      message = "The product " + product.name + " has been added to cart.";
      status = "success";
    }
    this.snackBar.open(message, "×", {
      panelClass: [status],
      verticalPosition: "top",
      duration: 3000
    });
  }

  public getBrands() {
    return [
      { name: "aloha", image: "assets/images/brands/aloha.png" },
      { name: "dream", image: "assets/images/brands/dream.png" },
      { name: "congrats", image: "assets/images/brands/congrats.png" },
      { name: "best", image: "assets/images/brands/best.png" },
      { name: "original", image: "assets/images/brands/original.png" },
      { name: "retro", image: "assets/images/brands/retro.png" },
      { name: "king", image: "assets/images/brands/king.png" },
      { name: "love", image: "assets/images/brands/love.png" },
      { name: "the", image: "assets/images/brands/the.png" },
      { name: "easter", image: "assets/images/brands/easter.png" },
      { name: "with", image: "assets/images/brands/with.png" },
      { name: "special", image: "assets/images/brands/special.png" },
      { name: "bravo", image: "assets/images/brands/bravo.png" }
    ];
  }

  public getCountries() {
    return [
      { name: "Afghanistan", code: "AF" },
      { name: "Aland Islands", code: "AX" },
      { name: "Albania", code: "AL" },
      { name: "Algeria", code: "DZ" },
      { name: "American Samoa", code: "AS" },
      { name: "AndorrA", code: "AD" },
      { name: "Angola", code: "AO" },
      { name: "Anguilla", code: "AI" },
      { name: "Antarctica", code: "AQ" },
      { name: "Antigua and Barbuda", code: "AG" },
      { name: "Argentina", code: "AR" },
      { name: "Armenia", code: "AM" },
      { name: "Aruba", code: "AW" },
      { name: "Australia", code: "AU" },
      { name: "Austria", code: "AT" },
      { name: "Azerbaijan", code: "AZ" },
      { name: "Bahamas", code: "BS" },
      { name: "Bahrain", code: "BH" },
      { name: "Bangladesh", code: "BD" },
      { name: "Barbados", code: "BB" },
      { name: "Belarus", code: "BY" },
      { name: "Belgium", code: "BE" },
      { name: "Belize", code: "BZ" },
      { name: "Benin", code: "BJ" },
      { name: "Bermuda", code: "BM" },
      { name: "Bhutan", code: "BT" },
      { name: "Bolivia", code: "BO" },
      { name: "Bosnia and Herzegovina", code: "BA" },
      { name: "Botswana", code: "BW" },
      { name: "Bouvet Island", code: "BV" },
      { name: "Brazil", code: "BR" },
      { name: "British Indian Ocean Territory", code: "IO" },
      { name: "Brunei Darussalam", code: "BN" },
      { name: "Bulgaria", code: "BG" },
      { name: "Burkina Faso", code: "BF" },
      { name: "Burundi", code: "BI" },
      { name: "Cambodia", code: "KH" },
      { name: "Cameroon", code: "CM" },
      { name: "Canada", code: "CA" },
      { name: "Cape Verde", code: "CV" },
      { name: "Cayman Islands", code: "KY" },
      { name: "Central African Republic", code: "CF" },
      { name: "Chad", code: "TD" },
      { name: "Chile", code: "CL" },
      { name: "China", code: "CN" },
      { name: "Christmas Island", code: "CX" },
      { name: "Cocos (Keeling) Islands", code: "CC" },
      { name: "Colombia", code: "CO" },
      { name: "Comoros", code: "KM" },
      { name: "Congo", code: "CG" },
      { name: "Congo, The Democratic Republic of the", code: "CD" },
      { name: "Cook Islands", code: "CK" },
      { name: "Costa Rica", code: "CR" },
      { name: "Cote D'Ivoire", code: "CI" },
      { name: "Croatia", code: "HR" },
      { name: "Cuba", code: "CU" },
      { name: "Cyprus", code: "CY" },
      { name: "Czech Republic", code: "CZ" },
      { name: "Denmark", code: "DK" },
      { name: "Djibouti", code: "DJ" },
      { name: "Dominica", code: "DM" },
      { name: "Dominican Republic", code: "DO" },
      { name: "Ecuador", code: "EC" },
      { name: "Egypt", code: "EG" },
      { name: "El Salvador", code: "SV" },
      { name: "Equatorial Guinea", code: "GQ" },
      { name: "Eritrea", code: "ER" },
      { name: "Estonia", code: "EE" },
      { name: "Ethiopia", code: "ET" },
      { name: "Falkland Islands (Malvinas)", code: "FK" },
      { name: "Faroe Islands", code: "FO" },
      { name: "Fiji", code: "FJ" },
      { name: "Finland", code: "FI" },
      { name: "France", code: "FR" },
      { name: "French Guiana", code: "GF" },
      { name: "French Polynesia", code: "PF" },
      { name: "French Southern Territories", code: "TF" },
      { name: "Gabon", code: "GA" },
      { name: "Gambia", code: "GM" },
      { name: "Georgia", code: "GE" },
      { name: "Germany", code: "DE" },
      { name: "Ghana", code: "GH" },
      { name: "Gibraltar", code: "GI" },
      { name: "Greece", code: "GR" },
      { name: "Greenland", code: "GL" },
      { name: "Grenada", code: "GD" },
      { name: "Guadeloupe", code: "GP" },
      { name: "Guam", code: "GU" },
      { name: "Guatemala", code: "GT" },
      { name: "Guernsey", code: "GG" },
      { name: "Guinea", code: "GN" },
      { name: "Guinea-Bissau", code: "GW" },
      { name: "Guyana", code: "GY" },
      { name: "Haiti", code: "HT" },
      { name: "Heard Island and Mcdonald Islands", code: "HM" },
      { name: "Holy See (Vatican City State)", code: "VA" },
      { name: "Honduras", code: "HN" },
      { name: "Hong Kong", code: "HK" },
      { name: "Hungary", code: "HU" },
      { name: "Iceland", code: "IS" },
      { name: "India", code: "IN" },
      { name: "Indonesia", code: "ID" },
      { name: "Iran, Islamic Republic Of", code: "IR" },
      { name: "Iraq", code: "IQ" },
      { name: "Ireland", code: "IE" },
      { name: "Isle of Man", code: "IM" },
      { name: "Israel", code: "IL" },
      { name: "Italy", code: "IT" },
      { name: "Jamaica", code: "JM" },
      { name: "Japan", code: "JP" },
      { name: "Jersey", code: "JE" },
      { name: "Jordan", code: "JO" },
      { name: "Kazakhstan", code: "KZ" },
      { name: "Kenya", code: "KE" },
      { name: "Kiribati", code: "KI" },
      { name: "Korea, Democratic People'S Republic of", code: "KP" },
      { name: "Korea, Republic of", code: "KR" },
      { name: "Kuwait", code: "KW" },
      { name: "Kyrgyzstan", code: "KG" },
      { name: "Lao People'S Democratic Republic", code: "LA" },
      { name: "Latvia", code: "LV" },
      { name: "Lebanon", code: "LB" },
      { name: "Lesotho", code: "LS" },
      { name: "Liberia", code: "LR" },
      { name: "Libyan Arab Jamahiriya", code: "LY" },
      { name: "Liechtenstein", code: "LI" },
      { name: "Lithuania", code: "LT" },
      { name: "Luxembourg", code: "LU" },
      { name: "Macao", code: "MO" },
      { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
      { name: "Madagascar", code: "MG" },
      { name: "Malawi", code: "MW" },
      { name: "Malaysia", code: "MY" },
      { name: "Maldives", code: "MV" },
      { name: "Mali", code: "ML" },
      { name: "Malta", code: "MT" },
      { name: "Marshall Islands", code: "MH" },
      { name: "Martinique", code: "MQ" },
      { name: "Mauritania", code: "MR" },
      { name: "Mauritius", code: "MU" },
      { name: "Mayotte", code: "YT" },
      { name: "Mexico", code: "MX" },
      { name: "Micronesia, Federated States of", code: "FM" },
      { name: "Moldova, Republic of", code: "MD" },
      { name: "Monaco", code: "MC" },
      { name: "Mongolia", code: "MN" },
      { name: "Montserrat", code: "MS" },
      { name: "Morocco", code: "MA" },
      { name: "Mozambique", code: "MZ" },
      { name: "Myanmar", code: "MM" },
      { name: "Namibia", code: "NA" },
      { name: "Nauru", code: "NR" },
      { name: "Nepal", code: "NP" },
      { name: "Netherlands", code: "NL" },
      { name: "Netherlands Antilles", code: "AN" },
      { name: "New Caledonia", code: "NC" },
      { name: "New Zealand", code: "NZ" },
      { name: "Nicaragua", code: "NI" },
      { name: "Niger", code: "NE" },
      { name: "Nigeria", code: "NG" },
      { name: "Niue", code: "NU" },
      { name: "Norfolk Island", code: "NF" },
      { name: "Northern Mariana Islands", code: "MP" },
      { name: "Norway", code: "NO" },
      { name: "Oman", code: "OM" },
      { name: "Pakistan", code: "PK" },
      { name: "Palau", code: "PW" },
      { name: "Palestinian Territory, Occupied", code: "PS" },
      { name: "Panama", code: "PA" },
      { name: "Papua New Guinea", code: "PG" },
      { name: "Paraguay", code: "PY" },
      { name: "Peru", code: "PE" },
      { name: "Philippines", code: "PH" },
      { name: "Pitcairn", code: "PN" },
      { name: "Poland", code: "PL" },
      { name: "Portugal", code: "PT" },
      { name: "Puerto Rico", code: "PR" },
      { name: "Qatar", code: "QA" },
      { name: "Reunion", code: "RE" },
      { name: "Romania", code: "RO" },
      { name: "Russian Federation", code: "RU" },
      { name: "RWANDA", code: "RW" },
      { name: "Saint Helena", code: "SH" },
      { name: "Saint Kitts and Nevis", code: "KN" },
      { name: "Saint Lucia", code: "LC" },
      { name: "Saint Pierre and Miquelon", code: "PM" },
      { name: "Saint Vincent and the Grenadines", code: "VC" },
      { name: "Samoa", code: "WS" },
      { name: "San Marino", code: "SM" },
      { name: "Sao Tome and Principe", code: "ST" },
      { name: "Saudi Arabia", code: "SA" },
      { name: "Senegal", code: "SN" },
      { name: "Serbia and Montenegro", code: "CS" },
      { name: "Seychelles", code: "SC" },
      { name: "Sierra Leone", code: "SL" },
      { name: "Singapore", code: "SG" },
      { name: "Slovakia", code: "SK" },
      { name: "Slovenia", code: "SI" },
      { name: "Solomon Islands", code: "SB" },
      { name: "Somalia", code: "SO" },
      { name: "South Africa", code: "ZA" },
      { name: "South Georgia and the South Sandwich Islands", code: "GS" },
      { name: "Spain", code: "ES" },
      { name: "Sri Lanka", code: "LK" },
      { name: "Sudan", code: "SD" },
      { name: "Suriname", code: "SR" },
      { name: "Svalbard and Jan Mayen", code: "SJ" },
      { name: "Swaziland", code: "SZ" },
      { name: "Sweden", code: "SE" },
      { name: "Switzerland", code: "CH" },
      { name: "Syrian Arab Republic", code: "SY" },
      { name: "Taiwan, Province of China", code: "TW" },
      { name: "Tajikistan", code: "TJ" },
      { name: "Tanzania, United Republic of", code: "TZ" },
      { name: "Thailand", code: "TH" },
      { name: "Timor-Leste", code: "TL" },
      { name: "Togo", code: "TG" },
      { name: "Tokelau", code: "TK" },
      { name: "Tonga", code: "TO" },
      { name: "Trinidad and Tobago", code: "TT" },
      { name: "Tunisia", code: "TN" },
      { name: "Turkey", code: "TR" },
      { name: "Turkmenistan", code: "TM" },
      { name: "Turks and Caicos Islands", code: "TC" },
      { name: "Tuvalu", code: "TV" },
      { name: "Uganda", code: "UG" },
      { name: "Ukraine", code: "UA" },
      { name: "United Arab Emirates", code: "AE" },
      { name: "United Kingdom", code: "GB" },
      { name: "United States", code: "US" },
      { name: "United States Minor Outlying Islands", code: "UM" },
      { name: "Uruguay", code: "UY" },
      { name: "Uzbekistan", code: "UZ" },
      { name: "Vanuatu", code: "VU" },
      { name: "Venezuela", code: "VE" },
      { name: "Viet Nam", code: "VN" },
      { name: "Virgin Islands, British", code: "VG" },
      { name: "Virgin Islands, U.S.", code: "VI" },
      { name: "Wallis and Futuna", code: "WF" },
      { name: "Western Sahara", code: "EH" },
      { name: "Yemen", code: "YE" },
      { name: "Zambia", code: "ZM" },
      { name: "Zimbabwe", code: "ZW" }
    ];
  }

  public getMonths() {
    return [
      { value: "01", name: "January" },
      { value: "02", name: "February" },
      { value: "03", name: "March" },
      { value: "04", name: "April" },
      { value: "05", name: "May" },
      { value: "06", name: "June" },
      { value: "07", name: "July" },
      { value: "08", name: "August" },
      { value: "09", name: "September" },
      { value: "10", name: "October" },
      { value: "11", name: "November" },
      { value: "12", name: "December" }
    ];
  }

  public getYears() {
    return [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026",
      "2027",
      "2028",
      "2029",
      "2030"
    ];
  }

  public getDeliveryMethods() {
    return [
      {
        value: "free",
        ename: "Free Delivery",
        edesc: "$0.00 / Delivery in 7 to 14 business Days",
        dname: "Gratisversand",
        ddesc: "0,00 € / Lieferung in 7 bis 14 Werktagen"
      },
      {
        value: "standard",
        ename: "Standard Delivery",
        edesc: "$0.00 / Delivery in 7 to 14 business Days",
        dname: "Gratisversand",
        ddesc: "$ 7.99 / Lieferung in 5 bis 7 Werktagen"
      },
      {
        value: "express",
        ename: "Express Delivery",
        edesc: "$0.00 / Delivery in 7 to 14 business Days",
        dname: "Gratisversand",
        ddesc: "29,99 € / Lieferung in 1 Werktag"
      }
    ];
  }
}
