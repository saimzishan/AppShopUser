import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnInit
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Settings, AppSettings } from "./app.settings";
import { SpinnerService } from "./shared/spinner/spinner.service";
import { TranslateService } from "@ngx-translate/core";
import { DetectChangesService } from "./shared/detectchanges.service";
import { AppService } from "./app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit {
  loading = false;
  public settings: Settings;
  public isRequesting = false;
  private sub: any;
  cartSubscription: any;

  constructor(
    public appSettings: AppSettings,
    public router: Router,
    public spinnerService: SpinnerService,
    private translateService: TranslateService,
    private detectChanges: DetectChangesService,
    public appService: AppService
  ) {
    this.settings = this.appSettings.settings;
    this.sub = this.spinnerService.requestInProcess$.subscribe(isDone => {
      this.isRequesting = isDone;
    });
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
    // this.router.navigate(['']);  // redirect other pages to homepage on browser refresh
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
  showProgress(val: boolean) {
    this.isRequesting = val;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
