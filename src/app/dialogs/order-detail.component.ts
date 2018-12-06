import {Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AppService} from '../app.service';

@Component({
    selector: 'app-order-detail-dialog',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OrderDetailComponent implements OnInit {

    constructor(public appService: AppService,
                public dialogRef: MatDialogRef<OrderDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public order) {
        // console.log(product);
    }

    ngOnInit() {
        // console.log(this.order);
    }

    public close(): void {
        this.dialogRef.close();
    }
}
