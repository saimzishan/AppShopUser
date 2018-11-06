import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../app.service';
import {Category} from '../../../app.models';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    public categories: Category[];
    private sub: any;
    public catId;
    public mainCategories: Category[];

    constructor(private activatedRoute: ActivatedRoute, public appService: AppService, private router: Router) {
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            // console.log(params['name']);
            this.catId = params['name'];
            // console.log(this.catId);
            /*if (this.catId) {
                this.getProductsByCat();
            } else {
                this.getAllProductsNew();
            }*/
        });
        this.getCategories();
    }

    public getCategories() {
        if (this.appService.Data.categories.length === 0) {
            this.appService.getCategories().subscribe(data => {
                // console.log(data);
                this.categories = data.data;
                this.appService.Data.categories = data.data;
                this.mainCategories = this.categories.filter(category => category.parent_id === null);
                console.log(this.categories);
            });
        } else {
            this.categories = this.appService.Data.categories;
            this.mainCategories = this.categories.filter(category => category.parent_id === null);
            console.log(this.categories);
        }
    }

    public checkChildren(child) {
        console.log(child);
        return this.categories.find(item => item.id === child.parent_id).children.length;
    }

    public getThirdChildren(child) {
        // console.log(child);
        const childArray = this.categories.find(item => item.id === child.parent_id).children;
        return childArray;
    }

    public onChangeCategory(event) {
        // console.log(event);
        this.router.navigate(['/products', event]);
        /*if (event.target) {
            console.log(event);
            this.router.navigate(['/products', event.target.innerText.toLowerCase()]);
        }*/
    }

    public openMegaMenu() {
        let pane = document.getElementsByClassName('cdk-overlay-pane');
        [].forEach.call(pane, function (el) {
            if (el.children.length > 0) {
                if (el.children[0].classList.contains('mega-menu')) {
                    el.classList.add('mega-menu-pane');
                }
            }
        });
    }

}
