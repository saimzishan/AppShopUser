import { Component, Input, Output, EventEmitter, DoCheck } from "@angular/core";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"]
})
export class CategoryListComponent implements DoCheck {
  @Input() categories;
  @Input() categoryParentId;
  @Output() change: EventEmitter<any> = new EventEmitter();
  mainCategories;

  constructor() {}

  public ngDoCheck() {
    if (this.categories && !this.mainCategories) {
      this.mainCategories = this.categories.filter(
        category => category.parent_id === this.categoryParentId
      );
    }
  }

  public stopClickPropagate(event: any) {
    if (window.innerWidth < 960) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  public changeCategory(event) {
    this.change.emit(event);
  }
}
