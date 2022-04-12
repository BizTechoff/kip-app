import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BusyService, openDialog } from '@remult/angular';
import { Remult } from 'remult';
import { terms } from '../../terms';
import { User } from '../../users/user';
import { InputAreaComponent } from '../input-area/input-area.component';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss']
})
export class SelectUserComponent implements OnInit {
  searchString = '';
  args: {
    allowClear?: boolean,
    canSelectAll?: boolean,
    title?: string,
    explicit?: string[],
    onSelect: (u?: User) => void
  } = { allowClear: true, canSelectAll: true, title: '', explicit: [], onSelect: undefined! }
  constructor(public remult: Remult, private busy: BusyService, private dialogRef: MatDialogRef<any>) { }
  users: User[] = [];
  terms = terms;
  ngOnInit() {
    // console.log(this.args.canSelectAll)
    // this.args.canSelectAll = true
    if (!this.args.explicit) {
      this.args.explicit = [] as string[]
    }
    this.loadUsers();
  }
  async loadUsers() {
    let bids = [] as string[]
    let uid = this.remult.user.id
    let u = await this.remult.repo(User).findId(uid)
    // console.log('this.args.explicit',this.args.explicit)
    this.users = await this.remult.repo(User).find({
      where: {
        name: this.searchString ? { $contains: this.searchString } : undefined!,
        id: bids.length > 0 ? bids : undefined! // {} [] - no-one-selected
        // id: this.args.explicit && this.args.explicit.length > 0 ? this.args.explicit : undefined
      }
    });
  }
  async doSearch() {
    await this.busy.donotWait(async () => this.loadUsers());
  }

  select(p: User) {
    this.args.onSelect(p);
    this.dialogRef.close();
  }
  selectFirst() {
    if (this.users.length > 0)
      this.select(this.users[0]);
  }
  async clear() {
    this.args.onSelect(undefined!);
  }
  async create() {
    let t = this.remult.repo(User).create();
    t.parent = true
    let changed = await openDialog(InputAreaComponent,
      _ => _.args = {
        title: terms.addUser,
        fields: () => [
          t!.$.name,
          t!.$.mobile
        ],
        ok: async () => {
          await t!.save();
          this.select(t);
        }
      },
      _ => _ ? _.ok : false);
    // if (changed) {
    // await this.loadBranchs();
    // if (await this.dialog.yesNoQuestion(terms.shouldAddActivity.replace('!t.name!', t.name))) {
    //   this.openActivity(t);
    // }
    // }


    // let Branch = this.remult.repo(Branch).create({
    //   name: this.searchString,
    //   type: this.filterBranch
    // });
    // openDialog(EditBranchComponent, x => x.args = {
    //   Branch,
    //   ok: () => {
    //     this.select(Branch);
    //   }
    // });
  }

}
