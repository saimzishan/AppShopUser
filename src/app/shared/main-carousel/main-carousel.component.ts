import {
    Component,
    OnInit,
    Input,
    AfterViewInit,
    DoCheck
} from "@angular/core";
import {
    SwiperConfigInterface,
    SwiperPaginationInterface
} from "ngx-swiper-wrapper";
import {AppService} from "../../app.service";
import {Router} from "@angular/router";

@Component({
    selector: "app-main-carousel",
    templateUrl: "./main-carousel.component.html",
    styleUrls: ["./main-carousel.component.scss"]
})
export class MainCarouselComponent implements OnInit, AfterViewInit, DoCheck {
    @Input() slides: Array<any> = [];
    @Input() appShopSlides: Array<any> = [];

    public config: SwiperConfigInterface = {};

    private pagination: SwiperPaginationInterface = {
        el: ".swiper-pagination",
        clickable: true
    };

    loadSlider = false;
    loadAppShopSlidesSlider = false;

    constructor(public appService: AppService, private router: Router) {
    }

    ngOnInit() {
    }

    ngDoCheck() {
        if (this.slides.length) {
            this.loadSlider = true;
        }

        if (this.appShopSlides.length) {
            this.loadAppShopSlidesSlider = true;
        }
    }

    ngAfterViewInit() {
        this.config = {
            slidesPerView: 1,
            spaceBetween: 0,
            keyboard: true,
            navigation: true,
            pagination: this.pagination,
            grabCursor: true,
            loop: false,
            preloadImages: false,
            lazy: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false
            },
            speed: 500,
            effect: 'slide'
        };
    }

    public productDetail(product) {
        this.router.navigate([
            '/products',
            product.id,
            product.name,
            {supplier_id: product.suppliers[0].id}
        ]);
        // ['/products', product.id, product.name, {supplier_id: product.supplier_id}]
    }
}
