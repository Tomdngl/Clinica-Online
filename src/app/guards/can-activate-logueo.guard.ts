import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { SwalService } from '../services/swal.service';

export const canActivateLogueoGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const swal = inject(SwalService)
  const { seLogueo } = userService;
  
  if(seLogueo)
  {
    return true
  }

  swal.Error("ERROR","¡No puede ingresar sin estar logueado!")
  router.navigateByUrl('/');
  return false;
};
