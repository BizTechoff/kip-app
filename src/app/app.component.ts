import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { openDialog, RouteHelperService } from '@remult/angular';
import { InputField } from '@remult/angular/interfaces';
import { Remult } from 'remult';
import { AuthService } from './auth.service';
import { DialogService } from './common/dialog';
import { InputAreaComponent } from './common/input-area/input-area.component';
import { terms } from './terms';
import { PasswordControl } from "./users/PasswordControl";
import { User } from './users/user';
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container#creating_gaps_between_items
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    private routeHelper: RouteHelperService,
    public dialogService: DialogService,
    public remult: Remult,
    public auth: AuthService) { }
  terms = terms;

  async signIn() {
    let mobile = new InputField<string>({ caption: terms.mobile });
    openDialog(InputAreaComponent, i => i.args = {
      title: terms.signIn,
      fields: () => [
        mobile
      ],
      ok: async () => {
        // this.auth.signIn(mobile.value, password.value);
      }
    });
  }

  ngOnInit(): void {

  }

  signOut() {
    this.auth.signOut();
    this.router.navigate(['/']);
  }
  signUp() {
    let user = this.remult.repo(User).create();
    let password = new PasswordControl();
    let confirmPassword = new PasswordControl(terms.confirmPassword);
    openDialog(InputAreaComponent, i => i.args = {
      title: terms.signUp,
      fields: () => [
        user.$.name,
        password,
        confirmPassword
      ],
      ok: async () => {
        if (password.value != confirmPassword.value) {
          confirmPassword.error = terms.doesNotMatchPassword;
          throw new Error(confirmPassword.metadata.caption + " " + confirmPassword.error);
        }
        // await user.create(password.value);
        // this.auth.signIn(user.name, password.value);

      }
    });
  }

  async updateInfo() {
    let user = await this.remult.repo(User).findId(this.remult.user.id);
    openDialog(InputAreaComponent, i => i.args = {
      title: terms.updateInfo,
      fields: () => [
        { field: user.$.garden, readonly: true, visible: () => this.remult.user.isGardener },
        user.$.name,
        user.$.mobile
      ],
      ok: async () => {
        await user._.save();
      }
    });
  }
  async changePassword() {
    // let user = await this.remult.repo(User).findId(this.remult.user.id);
    // let password = new PasswordControl();
    // let confirmPassword = new PasswordControl(terms.confirmPassword);
    // openDialog(InputAreaComponent, i => i.args = {
    //   title: terms.changePassword,
    //   fields: () => [
    //     password,
    //     confirmPassword
    //   ],
    //   ok: async () => {
    //     if (password.value != confirmPassword.value) {
    //       confirmPassword.error = terms.doesNotMatchPassword;
    //       throw new Error(confirmPassword.metadata.caption + " " + confirmPassword.error);
    //     }
    //     await user.updatePassword(password.value);
    //     await user._.save();
    //   }
    // });

  }

  routeName(route: Route) {
    let name = route.path;
    if (route.data && route.data['name'])
      name = route.data['name'];
    return name;
  }

  currentTitle() {
    if (this.activeRoute!.snapshot && this.activeRoute!.firstChild)
      if (this.activeRoute.snapshot.firstChild!.data!['name']) {
        return this.activeRoute.snapshot.firstChild!.data['name'];
      }
      else {
        if (this.activeRoute.firstChild.routeConfig)
          return this.activeRoute.firstChild.routeConfig.path;
      }
    return 'kip-app';
  }

  shouldDisplayRoute(route: Route) {
    if (!(route.path && route.path.indexOf(':') < 0 && route.path.indexOf('**') < 0))
      return false;
    return this.routeHelper.canNavigateToRoute(route);
  }
  //@ts-ignore ignoring this to match angular 7 and 8
  @ViewChild('sidenav') sidenav: MatSidenav;
  routeClicked() {
    if (this.dialogService.isScreenSmall())
      this.sidenav.close();

  }


}
