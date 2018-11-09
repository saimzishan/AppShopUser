import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() { }

  subscribe() { }

}