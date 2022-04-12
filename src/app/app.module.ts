import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { RemultModule } from '@remult/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogService } from './common/dialog';
import { InputAreaComponent } from './common/input-area/input-area.component';
import { YesNoQuestionComponent } from './common/yes-no-question/yes-no-question.component';
import { HomeComponent } from './home/home.component';
import { AdminGuard, GardenerGuard, ParentGuard, ParentOrAdminGuard } from "./users/AdminGuard";
import { UsersComponent } from './users/users.component';
import { PickingFromGateComponent } from './core/picking/picking-from-gate/picking-from-gate.component';
import { PickingFromDoorComponent } from './core/picking/picking-from-door/picking-from-door.component';
import { PickingToParentComponent } from './core/picking/picking-to-parent/picking-to-parent.component';
import { GardensComponent } from './core/garden/gardens/gardens.component';
import { PickingsComponent } from './core/picking/pickings/pickings.component';
import { SelectUserComponent } from './common/select-user/select-user.component';


@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    HomeComponent,
    YesNoQuestionComponent,
    InputAreaComponent,
    PickingFromGateComponent,
    PickingFromDoorComponent,
    PickingToParentComponent,
    GardensComponent,
    PickingsComponent,
    SelectUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RemultModule
  ],
  providers: [DialogService, AdminGuard, GardenerGuard, ParentGuard, ParentOrAdminGuard],
  bootstrap: [AppComponent],
  entryComponents: [YesNoQuestionComponent, InputAreaComponent]
})
export class AppModule { }
