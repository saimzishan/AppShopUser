import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import {
  emailValidator,
  matchingPasswords
} from "../../theme/utils/app-validators";
import { SignInService } from "./sign-in.service";
import { User } from "../../app.models";
import { DetectChangesService } from "../../shared/detectchanges.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "../../app.service";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"]
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  guestForm: FormGroup;
  errMessage = "";
  guestUser = JSON.parse(localStorage.getItem("guestUser"));
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  public supplier_id;
  public product_id;
  public product_name;
  returnUrl;
  cartSubscription: any;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    public signInService: SignInService,
    private detectChanges: DetectChangesService,
    private spinner: NgxSpinnerService,
    private translateService: TranslateService,
    public appService: AppService
  ) {
    translateService.addLangs(["en", "de"]);
    // translateService.setDefaultLang("de");
    const de = this.appService.getCurrentLan();
    translateService.setDefaultLang(de);
    this.cartSubscription = this.detectChanges.notifyObservable$.subscribe(
      res => {
        // console.log(res);
        if (res) {
          if (res.option === "switchLanguage") {
            this.translateService.use(res.value);
          }
        }
      }
    );
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl;
    });

    this.activatedRoute.params.subscribe(params => {
      this.supplier_id = params["sId"];
      this.product_id = params["pId"];
      this.product_name = params["pName"];
      // console.log(params);
    });

    if (this.currentUser) {
      this.router.navigate(["/checkout"]);
    }

    this.loginForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, emailValidator])],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });

    this.guestForm = this.formBuilder.group({
      email: [
        this.guestUser ? this.guestUser.email : "",
        Validators.compose([Validators.required, emailValidator])
      ]
    });

    this.registerForm = this.formBuilder.group(
      {
        name: [
          "",
          Validators.compose([Validators.required, Validators.minLength(3)])
        ],
        email: ["", Validators.compose([Validators.required, emailValidator])],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
        phone: ["", Validators.compose([Validators.required])]
      },
      { validator: matchingPasswords("password", "confirmPassword") }
    );
  }

  public onLoginFormSubmit(values: Object): void {
    if (this.loginForm.valid) {
      // console.log(values);
      this.signInService.loginUser(values).subscribe(
        data => {
          // console.log(data);
          if (data.error === false) {
            localStorage.setItem("currentUser", JSON.stringify(data));
            // console.log(JSON.parse(localStorage.getItem('guestUser')));
            localStorage.removeItem("guestUser");
            // const currUser = JSON.parse(localStorage.getItem('currentUser'));
            // localStorage.removeItem('currentUser');
            // console.log('logged in');
            this.detectChanges.notifyOther({
              option: "loggedIn",
              value: true
            });
            if (this.supplier_id) {
              /*console.log(this.product_id);
                        console.log(this.product_name);
                        console.log(this.supplier_id);*/
              this.router.navigate([
                "/products",
                this.product_id,
                this.product_name,
                { supplier_id: this.supplier_id }
              ]);
            } else if (this.returnUrl) {
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.router.navigate(["/checkout"]);
            }
          }
        },
        err => {
          this.spinner.hide();
          this.errMessage = this.signInService.getErrorMessage(err);
          // console.log(this.errMessage);
        }
      );
    }
  }

  public onGuestFormSubmit(values: Object): void {
    // console.log(values);
    if (this.guestForm.valid) {
      if (this.guestUser) {
        this.router.navigate(["/checkout"]);
      } else {
        localStorage.setItem("guestUser", JSON.stringify(values));
        this.router.navigate(["/checkout"]);
      }
    }
  }

  public onRegisterFormSubmit(values: User): void {
    // console.log(values);
    if (this.registerForm.valid) {
      delete values.confirmPassword;
      // console.log(values);
      // values.roles = 'MobileClient';
      this.signInService.registerUser(values).subscribe(
        data => {
          // console.log(data);
          if (!data.error) {
            let loginData = { email: values.email, password: values.password };
            this.signInService.loginUser(loginData).subscribe(result => {
              if (!result.error) {
                localStorage.setItem("currentUser", JSON.stringify(result));
                // console.log(JSON.parse(localStorage.getItem('guestUser')));
                localStorage.removeItem("guestUser");

                this.snackBar.open("User Created Successfully", "×", {
                  panelClass: "success",
                  verticalPosition: "top",
                  duration: 1000
                });
                this.detectChanges.notifyOther({
                  option: "loggedIn",
                  value: true
                });
                // console.log(result);
                setTimeout(() => {
                  // this.router.navigate(['/checkout']);
                  if (this.supplier_id) {
                    this.router.navigate([
                      "/products",
                      this.product_id,
                      this.product_name,
                      { supplier_id: this.supplier_id }
                    ]);
                  } else if (this.returnUrl) {
                    this.router.navigateByUrl(this.returnUrl);
                  } else {
                    this.router.navigate(["/checkout"]);
                  }
                }, 3000);
              }
            });
            // localStorage.setItem('currentUser', JSON.stringify(data));
            // const currUser = JSON.parse(localStorage.getItem('currentUser'));
            // localStorage.removeItem(JSON.parse(localStorage.getItem('guestUser')));
          } else {
            this.snackBar.open("User Creation Failed", "×", {
              panelClass: "failure",
              verticalPosition: "top",
              duration: 1000
            });
          }
        },
        err => {
          this.spinner.hide();
          this.errMessage = this.signInService.getErrorMessage(err);
          console.log(this.errMessage);
        }
      );
    }
  }
}
