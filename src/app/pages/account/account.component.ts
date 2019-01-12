import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DetectChangesService } from "../../shared/detectchanges.service";
import { AppService } from "../../app.service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  @ViewChild("sidenav") sidenav: any;
  public sidenavOpen: boolean = true;
  public links = [
    { name: "Account Dashboard", href: "dashboard", icon: "dashboard" },
    { name: "Account Information", href: "information", icon: "info" },
    { name: "Addresses", href: "addresses", icon: "location_on" },
    { name: "Order History", href: "orders", icon: "add_shopping_cart" },
    { name: "Logout", href: "/sign-in", icon: "power_settings_new" }
  ];
  cartSubscription: any;
  constructor(
    public router: Router,
    private translateService: TranslateService,
    private detectChanges: DetectChangesService,
    public appService: AppService
  ) {
    translateService.addLangs(["en", "de"]);
    const de = this.appService.getCurrentLan();
    translateService.setDefaultLang(de);
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
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    window.innerWidth < 960
      ? (this.sidenavOpen = false)
      : (this.sidenavOpen = true);
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (window.innerWidth < 960) {
          this.sidenav.close();
        }
      }
    });
  }
}
