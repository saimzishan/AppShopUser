import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public lat = 43.735911;
  public lng = -79.778323;
  public zoom = 12;
  // 43.735911, -79.778323

  constructor(
    private translateService: TranslateService
  ) { 
    translateService.addLangs(["en", "de"]);
    translateService.setDefaultLang("de");
  }

  ngOnInit() { }

  subscribe() { }

}