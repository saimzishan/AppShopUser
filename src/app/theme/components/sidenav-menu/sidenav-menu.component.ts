import {Component, OnInit, Input} from '@angular/core';
import {SidenavMenuService} from './sidenav-menu.service';
import {AppService} from "../../../app.service";
import {Category} from "../../../app.models";
import {Router} from "@angular/router";

@Component({
    selector: 'app-sidenav-menu',
    templateUrl: './sidenav-menu.component.html',
    styleUrls: ['./sidenav-menu.component.scss'],
    providers: [SidenavMenuService]
})
export class SidenavMenuComponent implements OnInit {
    @Input('menuItems') menuItems;
    @Input('menuParentId') menuParentId;
    parentMenu: Array<any>;
    public categories: Category[];
    public mainCategories: Category[];

    constructor(public appService: AppService, private router: Router, private sidenavMenuService: SidenavMenuService) {
    }

    ngOnInit() {
        // this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);
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

    onClick(menuId) {
        this.sidenavMenuService.toggleMenuItem(menuId);
        this.sidenavMenuService.closeOtherSubMenus(this.menuItems, menuId);
    }

}
