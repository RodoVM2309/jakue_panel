import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup
} from "@angular/forms";
import {
  MatChipInputEvent,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";

export interface Mail {
  value: string;
  invalid: boolean;
}

@Component({
  selector: "app-usuario-sin-email",
  templateUrl: "./usuario-sin-email.component.html",
  styleUrls: ["./usuario-sin-email.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class UsuarioSinEmailComponent implements OnInit {
  itemForm: FormGroup;
  incorrect_emails: boolean = false;
  etiqueta1: string = "";
  cuit: string = "";
  razon: string = "";
  mailusuario = "";
  mailarray: Mail[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UsuarioSinEmailComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.etiqueta1 = this.data.title;
    this.cuit = this.data.payload.cuit;
    this.razon = this.data.payload.razon;
    this.mailarray = [];
    //console.log(' this.mailarray', this.mailarray);
    this.itemForm = this.fb.group({
      emails: this.fb.array([], [this.validateArrayNotEmpty]),
    });
    this.data.payload.emails.forEach(element => {
      this.mailarray.push({ value: element, invalid: false });
    });

  }

  submit(opcion) {
    let email = [];
    for (let index = 0; index < this.mailarray.length; index++) {
      const element = this.mailarray[index];
      if (!element.invalid) {
        email.push(element.value)
      }
    }
    let data = {
      cuit: this.cuit,
      razon_social: this.razon,
      email: email,
      omitir: opcion == 0 ? true : false
    };
    this.dialogRef.close(data);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Agregando mail
    if ((value || "").trim()) {
      //  comprobando si puedo agregar el maail al arreglo
      if (this.validateEmail(event.value)) {
        this.mailarray.push({ value: event.value, invalid: false });
      } else {
        this.mailarray.push({ value: event.value, invalid: true });
        this.itemForm.controls["emails"].setErrors({ incorrectEmail: true });
      }
    }

    // Reset todos los mail
    if (input) {
      input.value = "";
    }
  }

  remove(correo: Mail): void {
    const index = this.mailarray.indexOf(correo);

    if (index >= 0) {
      this.mailarray.splice(index, 1);
      this.mailusuario = "";
      this.mailarray.forEach((mail, i) => {
        this.mailusuario += mail.value + ";";
      });
      //this.itemForm.controls["emails"].setValue(this.mailusuario);
    }
  }
  comprobarEmails() {
    let info_emails = [];
    this.incorrect_emails = false;
    this.itemForm.invalid;
    if (this.itemForm.controls["emails"].value.toString() !== "") {
      let emailsparam = this.itemForm.controls["emails"].value.toString();
      info_emails = emailsparam.split(";");
      for (let i = 0; i < info_emails.length; i++) {
        if (
          !/^([a-zA-Z0-9\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
            info_emails[i]
          )
        ) {
          this.itemForm.controls["emails"].markAsDirty();
          this.incorrect_emails = true;
          return;
        }
      }
      this.incorrect_emails = false;
    } else {
      this.itemForm.valid;
      this.incorrect_emails = false;
    }
  }

  private validateEmail(email) {
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/;
    return re.test(String(email).toLowerCase());
  }

  private validateArrayNotEmpty(c: FormControl) {
    if (c.value && c.value.length === 0) {
      return {
        validateArrayNotEmpty: { valid: false },
      };
    }
    return null;
  }

  validateForm() {
    let valid = true;
    if (this.mailarray.length == 0) {
      valid = false;
      this.itemForm.controls["emails"].setErrors({ empty: true });
      this.itemForm.controls["emails"].markAsDirty();
    } else {
      let countValid = 0;
      this.mailarray.forEach((element) => {
        if (!element.invalid) {
          countValid++;
        }
      });
      if (countValid == 0) {
        valid = false;
        this.itemForm.controls["emails"].setErrors({ incorrectEmail: true });
        this.itemForm.controls["emails"].markAsDirty();
      }
    }
    if (valid) {
      this.itemForm.valid;
      this.itemForm.controls["emails"].enable();
    }
    return valid;
  }
}
