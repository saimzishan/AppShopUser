import {Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AppService} from '../app.service';
import {Product} from '../app.models';
import {DropzoneConfigInterface} from 'ngx-dropzone-wrapper';

export const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: 'https://httpbin.org/post',
    // url: 'http://18.217.12.17/api/public/api/auth/drop-image',
    maxFilesize: 2,
    maxFiles: 1,
    init: function () {
        this.on('maxfilesexceeded', function (file) {
            this.removeAllFiles();
            this.addFile(file);
        });
    },
    acceptedFiles: 'image/png, image/jpeg',
    headers: {
        'Content-Type': 'application/json'
    },
    createImageThumbnails: true,
    clickable: true,
    addRemoveLinks: true
};

@Component({
    selector: 'app-printing-options-dialog',
    templateUrl: './printing-options.component.html',
    styleUrls: ['./printing-options.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PrintingOptionsComponent implements OnInit {

    filesArray = [];

    constructor(public appService: AppService,
                public dialogRef: MatDialogRef<PrintingOptionsComponent>,
                @Inject(MAT_DIALOG_DATA) public product: Product) {
        // console.log(product);
    }

    ngOnInit() {
    }

    public close(): void {
        this.dialogRef.close();
    }

    public onUploadSuccess(evt, sideName) {
        // console.log(evt);
        this.addPicture(evt[0], sideName);

    }

    public onUploadError(evt) {
        console.log(evt);
    }

    public addPicture(obj, sideName) {
        let image: any = {};
        image.base64String = obj.dataURL.split(',')[1];
        image.content_type = obj.type.split('/')[1];
        // image.content_type = "." + this.supplier.image.content_type;
        image.type = sideName;
        // console.log(image);
        this.filesArray.push(image);
    }
}
