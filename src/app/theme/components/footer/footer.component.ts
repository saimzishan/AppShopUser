import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DetectChangesService } from "../../../shared/detectchanges.service";
import { AppService } from "../../../app.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  public lat = 43.735911;
  public lng = -79.778323;
  public zoom = 12;
  cartSubscription: any;
  // 43.735911, -79.778323

  constructor(
    private translateService: TranslateService,
    private detectChanges: DetectChangesService,
    public appService: AppService
  ) {
    translateService.addLangs(["en", "de"]);
    // translateService.setDefaultLang("de");
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

  ngOnInit() {}

  subscribe() {}
}
