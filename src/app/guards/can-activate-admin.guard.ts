import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';
import { AutenticacionService } from '../services/autenticacion.service';

export const canActivateAdminGuard: CanActivateFn = (route, state) => {
  const user = inject(AutenticacionService);
  const toast = inject(ToastService)
  const { user$ } = user;

  console.log("Ingresa al guard")

  return user$.pipe(
    take(1), 
    map((user) => {
      if (user && user.rol === 'Admin') {
        return true; 
      } else {
        toast.showError("Debe ser administrador para acceder.", "Error");
        return false; 
      }
    })
  );
};
