import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'app-banners',
    templateUrl: './banners.component.html',
    styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
    @Input('banners') banners: Array<any> = [];

    constructor() {
    }

    ngOnInit() {
    }

    public getBanner(index) {
        if (this.banners[index]) {
            return this.banners[index];
        }
    }

    public getBgImage(index) {
        // console.log(this.banners[index].images[0].small);
        let bgImage = {
            'background-image': this.banners[index] != null ? 'url(' + this.banners[index].images[0].small + ')' : 'url(https://via.placeholder.com/600x400/ff0000/fff/)'
        };
        // console.log(bgImage);
        return bgImage;
    }

}
