import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { Settings, AppSettings } from "../app.settings";
import { AppService } from "../app.service";
import { Category } from "../app.models";
import { SidenavMenuService } from "../theme/components/sidenav-menu/sidenav-menu.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { DetectChangesService } from "../shared/detectchanges.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"],
  providers: [SidenavMenuService]
})
export class PagesComponent implements OnInit, AfterViewInit {
  public showBackToTop = false;
  public categories: Category[];
  public category: Category;
  public sidenavMenuItems: Array<any>;
  @ViewChild("sidenav") sidenav: any;

  public settings: Settings;
  public currentUser = JSON.parse(localStorage.getItem("currentUser"));
  public guestUser = JSON.parse(localStorage.getItem("guestUser"));
  public cartSubscription: Subscription;

  searchVariable;
  categoryid = null;

  constructor(
    public appSettings: AppSettings,
    public appService: AppService,
    public sidenavMenuService: SidenavMenuService,
    public router: Router,
    private detectChanges: DetectChangesService
  ) {
    this.settings = this.appSettings.settings;

    this.cartSubscription = this.detectChanges.notifyObservable$.subscribe(
      res => {
        // console.log(res);
        if (res) {
          this.appService.Data.cartList = JSON.parse(
            localStorage.getItem("cartList")
          );
          this.appService.Data.totalPrice = JSON.parse(
            localStorage.getItem("totalPrice")
          );
          // console.log(this.appService.Data.totalPrice);
        }
      }
    );
  }

  ngOnInit() {
    this.getCategories();
    this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
    // console.log(this.appService.Data.cartList);
  }

  public getCategories() {
    this.appService.getCategories().subscribe(data => {
      this.categories = data.data;
      const obj = {
        id: 0,
        parent_id: null,
        name: 'All',
        notes: '',
        children: [],
      };
      this.categories.push(obj);
      this.categories = this.categories.reverse();
      this.appService.Data.categories = data.data;
    });
  }

  public changeCategory(event) {
    if (event) {
      this.searchVariable = event.name;
      this.categoryid = event.id;
    }
  }

  public remove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.appService.Data.totalPrice =
        this.appService.Data.totalPrice - product.price;
    }
    if (localStorage.getItem("cartList")) {
      localStorage.removeItem("cartList");
    }
    localStorage.setItem(
      "cartList",
      JSON.stringify(this.appService.Data.cartList)
    );
    if (localStorage.getItem("totalPrice")) {
      localStorage.removeItem("totalPrice");
    }
    localStorage.setItem(
      "totalPrice",
      JSON.stringify(this.appService.Data.totalPrice)
    );
    this.detectChanges.cartSync({
      option: "cartChanged",
      value: true
    });
  }

  public clear() {
    this.appService.Data.cartList.length = 0;
    if (localStorage.getItem("cartList")) {
      localStorage.removeItem("cartList");
    }
    if (localStorage.getItem("totalPrice")) {
      localStorage.removeItem("totalPrice");
    }
    this.detectChanges.cartSync({
      option: "cartChanged",
      value: true
    });
  }

  checkOut() {
    /*if (this.currentUser) {
            this.router.navigate(['/checkout']);
        } else {
            this.router.navigate(['/sign-in']);
        }*/
  }

  public getImageSrc(product) {
    // console.log(product);
    return product.images.length && product.images[0].small.startsWith("http")
      ? product.images[0].small
      : product.images.length && !product.images[0].small.startsWith("http")
        ? this.appService.imgUrl + product.images[0].small
        : !product.images.length &&
          product.product_images.length &&
          product.product_images[0].small.startsWith("http")
          ? product.product_images[0].small
          : this.appService.imgUrl + product.product_images[0].small;
  }

  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  public search() { }

  public scrollToTop() {
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset / (scrollDuration / 20);
    var scrollInterval = setInterval(() => {
      if (window.pageYOffset != 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll($event) {
    $event.target.documentElement.scrollTop > 300
      ? (this.showBackToTop = true)
      : (this.showBackToTop = false);
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });
    this.sidenavMenuService.expandActiveSubMenu(
      this.sidenavMenuService.getSidenavMenuItems()
    );
  }

  public closeSubMenus() {
    if (window.innerWidth < 960) {
      this.sidenavMenuService.closeAllSubMenus();
    }
  }

  searchProduct(event, value) {
    if (
      this.router.url === "/products" &&
      event.key === "Enter" &&
      value !== "" && this.categoryid === null
    ) {
      this.detectChanges.notifyOther({
        option: "searching",
        value: value
      });
    }
    if (
      this.router.url !== "/products" &&
      event.key === "Enter" &&
      value !== "" && this.categoryid === null
    ) {
      localStorage.setItem("searching", value);
      this.router.navigate(["/products"]);
    }
    if (value === "" && this.categoryid === null) {
      this.detectChanges.notifyOther({
        option: "all",
        value: value
      });
      //   localStorage.removeItem("searching");
      this.router.navigate(["/products"]);
    } if (this.categoryid !== null && event.key === "Enter" && value !== "") {
      if (this.categoryid !== 0) {
        this.detectChanges.notifyOther({
          option: "?category_id=" + this.categoryid + "&search=",
          value: value
        });
      } else {
        if (
          this.router.url === "/products" &&
          event.key === "Enter" &&
          value !== ""
        ) {
          this.detectChanges.notifyOther({
            option: "searching",
            value: value
          });
        }
        if (
          this.router.url !== "/products" &&
          event.key === "Enter" &&
          value !== ""
        ) {
          localStorage.setItem("searching", value);
          this.router.navigate(["/products"]);
        }
        if (value === "") {
          this.detectChanges.notifyOther({
            option: "all",
            value: value
          });
          //   localStorage.removeItem("searching");
          this.router.navigate(["/products"]);
        }
      }
    }
  }
}
