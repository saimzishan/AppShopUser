import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-banners',
    templateUrl: './banners.component.html',
    styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
    @Input('banners') banners: Array<any> = [];

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    public getBanner(index) {
        if (this.banners[index]) {
            // console.log(this.banners[0]);
            return this.banners[index];
        }
    }

    public getBgImage(index) {
        // console.log(this.banners[index].images[0].small);
        let bgImage = {
            'background-image': this.banners[index] != null ? 'url(' + this.banners[index].product_images[0].large + ')' : 'url(https://via.placeholder.com/600x400/ff0000/fff/)'
        };
        // console.log(bgImage);
        return bgImage;
    }

    public productDetail(index) {
        console.log(this.banners[index]);
        this.router.navigate(['/products', this.banners[index].id, this.banners[index].name, {supplier_id: this.banners[index].suppliers[0].id}]);
        // ['/products', product.id, product.name, {supplier_id: product.supplier_id}]

    }

}
