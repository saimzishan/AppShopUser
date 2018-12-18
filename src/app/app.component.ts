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

  constructor(
    public appSettings: AppSettings,
    public router: Router,
    public spinnerService: SpinnerService,
    private translateService: TranslateService
  ) {
    this.settings = this.appSettings.settings;
    this.sub = this.spinnerService.requestInProcess$.subscribe(isDone => {
      this.isRequesting = isDone;
    });
    translateService.addLangs(["en", "de"]);
    translateService.setDefaultLang("de");
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
