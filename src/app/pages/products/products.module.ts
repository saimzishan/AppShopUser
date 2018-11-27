import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SwiperModule } from "ngx-swiper-wrapper";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from "../../shared/shared.module";
import { PipesModule } from "../../theme/pipes/pipes.module";
import { ProductsComponent } from "./products.component";
import { ProductComponent } from "./product/product.component";
import { ProductZoomComponent } from "./product/product-zoom/product-zoom.component";
import { SubCatComponent } from "./subcat/sub-cat.compoment";
import { TreeModule } from "angular-tree-component";

export const routes = [
  { path: "", component: ProductsComponent, pathMatch: "full" },
  // { path: ':name', component: ProductsComponent },
  { path: ":name", component: ProductsComponent },
  {
    path: "brand/:id/:name",
    component: ProductsComponent,
    data: { breadcrumb: "Brands" }
  },
  {
    path: "category/:id/:name",
    component: ProductsComponent,
    data: { breadcrumb: "Categories" }
  },
  { path: ":id/:name", component: ProductComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule,
    TreeModule
  ],
  declarations: [
    ProductsComponent,
    ProductComponent,
    ProductZoomComponent,
    SubCatComponent
  ],
  entryComponents: [ProductZoomComponent]
})
export class ProductsModule {}
