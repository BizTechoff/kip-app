import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { BackendMethod, Fields, getFields, Remult } from 'remult';
import { DialogService } from '../common/dialog';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { terms } from '../terms';
import { Roles } from './roles';
import { User } from './user';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @DataControl<UsersComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: `${terms.searchByName}` })
  search: string = ''

  constructor(private dialog: DialogService, public remult: Remult) {
  }
  isAdmin() {
    return this.remult.isAllowed(Roles.admin);
  }

  users = new GridSettings(this.remult.repo(User), {
    allowCrud: false,
    numOfColumnsInGrid: 20,

    orderBy: { name: "asc" },
    rowsInPage: 100,

    columnSettings: users => [
      users.name,
      users.mobile,
      users.admin,
      users.gardener,
      users.parent,
      users.verifiedCodeSentTime,
      users.verifiedSentCount,
      users.verified,
      users.verifiedTime,
      users.verifiedCount
    ],
    gridButtons: [{
      textInMenu: () => terms.refresh,
      click: async () => await this.refresh(),
      icon: 'refresh'
    }],
    rowButtons: [{
      name: 'Reset Password',
      click: async () => {
        if (await this.dialog.yesNoQuestion("Are you sure you want to delete the password of " + this.users.currentRow.name)) {
          await UsersComponent.resetPassword(this.users.currentRow.id);
          this.dialog.info("Password deleted");
        };
      }
    }],
    confirmDelete: async (h) => {
      return await this.dialog.confirmDelete(h.name)
    },
  });
  @BackendMethod({ allowed: Roles.admin })
  static async resetPassword(userId: string, remult?: Remult) {
    // let u = await remult!.repo(User).findId(userId);
    // if (u) {
    //   u.password = '';
    //   await u._.save();
    // }
  }

  ngOnInit() {
  }
  get $() { return getFields(this, this.remult) };
  terms = terms

  async refresh() {
    await this.users.reloadData()
  }

  async addUser() {
    let add = this.remult.repo(User).create()
    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: '',
        fields: () => [
          add.$.name,
          add.$.mobile,
          add.$.admin,
          add.$.gardener,
          add.$.parent
        ],
        ok: () => { }
      },
      dlg => dlg ? dlg.ok : false)
    if (changed) {
      await add.save()
      await this.refresh()
    }
  }

}
