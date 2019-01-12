import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SwiperModule} from "ngx-swiper-wrapper";
import {NgxPaginationModule} from "ngx-pagination";
import {SharedModule} from "../../shared/shared.module";
import {PipesModule} from "../../theme/pipes/pipes.module";
import {ProductsComponent} from "./products.component";
import {ProductComponent} from "./product/product.component";
import {ProductZoomComponent} from "./product/product-zoom/product-zoom.component";
import {SubCatComponent} from "./subcat/sub-cat.compoment";
import {TreeModule} from "angular-tree-component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export const routes = [
    {path: "", component: ProductsComponent, pathMatch: "full"},
    // { path: ':name', component: ProductsComponent },
    {path: ":name", component: ProductsComponent},
    {
        path: "brand/:id/:name",
        component: ProductsComponent,
        data: {breadcrumb: "Brands"}
    },
    {
        path: "supplier/:id/:name",
        component: ProductsComponent,
        data: {breadcrumb: "Suppliers"}
    },
    {
        path: "category/:id/:name",
        component: ProductsComponent,
        data: {breadcrumb: "Categories"}
    },
    {
        path: "browsing-history",
        component: ProductsComponent,
        data: {breadcrumb: "Browsing History"}
    },
    {
        path: "today-deals",
        component: ProductsComponent,
        data: {breadcrumb: "Today Deals"}
    },
    {path: ":id/:name", component: ProductComponent}
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
        TreeModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: translateHttpLoaderFactory,
              deps: [HttpClient]
            }
          })
    ],
    declarations: [
        ProductsComponent,
        ProductComponent,
        ProductZoomComponent,
        SubCatComponent
    ],
    entryComponents: [ProductZoomComponent]
})
export class ProductsModule {
}
