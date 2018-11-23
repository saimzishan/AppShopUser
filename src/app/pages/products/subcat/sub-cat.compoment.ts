import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material";

@Component({
  selector: "cat-sub-cat",
  templateUrl: "sub-cat.component.html",
  styleUrls: ["./sub-cat.component.scss"]
})
export class SubCatComponent implements OnInit {
  @ViewChild(MatMenuTrigger) notificationMenuBtn: MatMenuTrigger;

  ngOnInit() {
    // this.notificationMenuBtn.openMenu();
    console.log(this.notificationMenuBtn);
  }
}
