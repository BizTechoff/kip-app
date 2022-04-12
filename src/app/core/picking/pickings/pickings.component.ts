import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { DialogService } from '../../../common/dialog';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { terms } from '../../../terms';
import { Picking } from '../picking';

@Component({
  selector: 'app-pickings',
  templateUrl: './pickings.component.html',
  styleUrls: ['./pickings.component.scss']
})
export class PickingsComponent implements OnInit {

  @DataControl<PickingsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: `${terms.searchByName}` })
  search: string = ''

  constructor(private dialog: DialogService, public remult: Remult) { }
  get $() { return getFields(this, this.remult) };
  terms = terms

  ngOnInit(): void {
  }

  async refresh() {
  }

  async addPicking() {
    let add = this.remult.repo(Picking).create()
    add.date = new Date()
    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: '',
        fields: () => [
          add.$.date,
          add.$.parent,
          add.$.childs
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
