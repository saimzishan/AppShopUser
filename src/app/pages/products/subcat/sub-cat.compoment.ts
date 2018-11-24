import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatMenuTrigger } from "@angular/material";
import { ITreeOptions } from "angular-tree-component";
import { SpinnerService } from "../../../shared/spinner/spinner.service";

@Component({
  selector: "cat-sub-cat",
  templateUrl: "sub-cat.component.html",
  styleUrls: ["./sub-cat.component.scss"]
})
export class SubCatComponent implements OnInit {
  @ViewChild(MatMenuTrigger) notificationMenuBtn: MatMenuTrigger;
  @Input() categories;
  parentCat;
  firstLevelChild = [];
  nodes: any[] = [];
  parentCatId: any;
  @ViewChild("tree") tree;

  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this)
  };

  constructor(
    private spinnerService: SpinnerService,
    protected http: HttpClient
  ) {}
  ngOnInit() {
    this.nodes = this.createNode(this.categories);
  }
  setFirstChild() {
    this.nodes = this.createNode(this.firstLevelChild);
  }

  activeNodes(treeModel: any) {
    this.parentCat = treeModel.activeNodes[0].data.name;
    this.parentCatId = treeModel.activeNodes[0].data.my_id;

    const someNode = this.tree.treeModel.getNodeById(
      treeModel.activeNodes[0].data.id
    );
    someNode.expand();
  }

  getChildren(node: any) {
    return new Promise((resolve, reject) => {
      this.spinnerService.requestInProcess(true);
      const httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      };
      this.http
        .get(
          "http://www.econowholesale.com/api/public/api/auth/categories/" +
            node.data.my_id,
          httpOptions
        )
        .subscribe((response: any) => {
          if (!response.error) {
            resolve(this.createNode(response.data.children));
          } else {
          }
          this.spinnerService.requestInProcess(false);
        }, reject);
    });
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
