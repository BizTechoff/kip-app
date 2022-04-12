import { ErrorHandler, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NotAuthenticatedGuard, RemultModule } from '@remult/angular';
import { AuthService } from './auth.service';
import { ShowDialogOnErrorErrorHandler } from './common/dialog';
import { GardensComponent } from './core/garden/gardens/gardens.component';
import { PickingsComponent } from './core/picking/pickings/pickings.component';
import { HomeComponent } from './home/home.component';
import { terms } from './terms';
import { AdminGuard, ParentOrAdminGuard } from "./users/AdminGuard";
import { UsersComponent } from './users/users.component';



const defaultRoute = terms.home;
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent, canActivate: [NotAuthenticatedGuard] },
  { path: terms.picking, component: PickingsComponent, canActivate: [ParentOrAdminGuard] },
  { path: terms.outgoing, component: UsersComponent, canActivate: [ParentOrAdminGuard] },
  { path: terms.gardens, component: GardensComponent, canActivate: [AdminGuard] },
  { path: terms.userAccounts, component: UsersComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '/' + defaultRoute, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    RemultModule,
  JwtModule.forRoot({
    config: { tokenGetter: () => AuthService.fromStorage() }
  })],
  providers: [AdminGuard, { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
