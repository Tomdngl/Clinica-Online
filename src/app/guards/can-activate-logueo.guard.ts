import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SwalService } from '../services/swal.service';
import { AutenticacionService } from '../services/autenticacion.service';

export const canActivateLogueoGuard: CanActivateFn = (route, state) => {
  const userService = inject(AutenticacionService);
  const router = inject(Router);
  const swal = inject(SwalService)
  const { seLogueo } = userService;
  
  if(seLogueo)
  {
    return true
  }

  swal.Error("Error.","Debe iniciar sesión para ingresar.")
  router.navigateByUrl('/');
  return false;
};
