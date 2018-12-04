import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { MatMenuTrigger } from "@angular/material";
import { ITreeOptions } from "angular-tree-component";
import { SpinnerService } from "../../../shared/spinner/spinner.service";
import { AppService } from "../../../app.service";
import { DetectChangesService } from "../../../shared/detectchanges.service";
import { Router } from "@angular/router";
import { Category } from "../../../app.models";

@Component({
  selector: "cat-sub-cat",
  templateUrl: "sub-cat.component.html",
  styleUrls: ["./sub-cat.component.scss"]
})
export class SubCatComponent implements OnInit {
  @ViewChild(MatMenuTrigger) notificationMenuBtn: MatMenuTrigger;
  categories: Category[];
  parentCat;
  firstLevelChild = [];
  nodes: any[] = [];
  parentCatId: any;
  cats = [];
  @ViewChild("tree") tree;

  @Output() getProductsOfCat = new EventEmitter<string>();

  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this)
  };

  constructor(
    private spinnerService: SpinnerService,
    protected http: HttpClient,
    public appService: AppService,
    private detectChanges: DetectChangesService,
    private router: Router
  ) {
    this.categories = new Array<Category>();
  }
  ngOnInit() {
    // this.nodes = this.createNode(this.categories);
    this.getCategories();
  }
  public getCategories() {
    this.spinnerService.requestInProcess(true);
    this.appService.getAllCategories().subscribe(data => {
      this.spinnerService.requestInProcess(false);
      this.categories = data.data;
      const cat = this.createCategoriesWithChild(this.categories);
      this.nodes = this.createNode(cat);
    });
  }

  createCategoriesWithChild(obj) {
    let res = [];
    for (const iterator of obj) {
      if (iterator.parent_id === null) {
        let myChild = this.getChild(iterator.id);
        let tempObj: any = [];
        tempObj = iterator;
        tempObj["children"] = myChild;

        res.push(tempObj);
      }
    }
    return res;
  }

  getChild(id) {
    let myChild = [];
    for (const x of this.categories) {
      if (x.parent_id === id) {
        myChild.push(x);
      }
    }
    return myChild;
  }

  activeNodes(treeModel: any) {
    this.parentCat = treeModel.activeNodes[0].data.name;
    this.parentCatId = treeModel.activeNodes[0].data.my_id;

    if (!treeModel.activeNodes[0].data.hasChildren) {
      this.getProductOfCategory(treeModel.activeNodes[0].data);
    }

    const someNode = this.tree.treeModel.getNodeById(
      treeModel.activeNodes[0].data.id
    );
    someNode.expand();
  }

  getProductOfCategory(category) {
    this.spinnerService.requestInProcess(true);
    this.appService.getAllProductsByCat(category.my_id).subscribe(data => {
      if (data) {
        this.spinnerService.requestInProcess(false);
        // this.getProductsOfCat.emit(cat_id);
        this.router.navigate([
          "products/category/" + category.my_id + "/" + category.name
        ]);
      }
    });
  }
  getCatById(id) {
    for (const x of this.categories) {
      if (x.id === id) {
        return x;
      }
    }
  }
  getChildren(node: any) {
    let res: any = this.getCatById(node.data.my_id);
    res = this.getChild(res.id);
    let tempRes = [];
    for (const iterator of res) {
      let i = this.getChild(iterator.id);
      let j = iterator;
      j["children"] = i;
      tempRes.push(j);
    }
    return this.createNode(tempRes);
  }
  createNode(obj) {
    let tempNode = [];
    obj.forEach(row => {
      let tempObj = {};
      if (row.children.length > 0) {
        tempObj = {
          name: row.name,
          hasChildren: true,
          my_id: row.id
        };
      } else {
        tempObj = { name: row.name, my_id: row.id };
      }
      tempNode.push(tempObj);
    });
    return tempNode;
  }
}
