import { MatDialogRef } from "@angular/material";
import { CentroAdministraCuposComponent } from "../../../add-cupos-solicitados/centro-administra-cupos/centro-administra-cupos.component";

export module FunctionLoadCentroAdminCupos {
  export function loadForm(
    dialog,
    cmp,
    f
  ) {
    if (cmp.checked) {
      let title = "Centro que va administrar cupos";
      let dialogRef: MatDialogRef<any> = dialog.open(
        CentroAdministraCuposComponent,
        {
          width: "420px",
          disableClose: true,
          data: { title: title },
        }
      );

      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          // If user press cancel
         f.id_gestiona.setValue(null);
         f.administra.setValue(false);
          return;
        }
        f.id_gestiona.setValue(res.id_centro);
      });
    } else {
      f.id_gestiona.setValue(null);
    }
  }
}
