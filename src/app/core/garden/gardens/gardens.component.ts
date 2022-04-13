import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { terms } from '../../../terms';
import { Garden } from '../garden';

@Component({
  selector: 'app-gardens',
  templateUrl: './gardens.component.html',
  styleUrls: ['./gardens.component.scss']
})
export class GardensComponent implements OnInit {

  @DataControl<GardensComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: `${terms.searchByName}` })
  search: string = ''

  gradens!: GridSettings<Garden>

  constructor(private remult: Remult) { }
  get $() { return getFields(this, this.remult) };
  terms = terms

  ngOnInit(): void {
    this.initGrid();
  }

  async refresh() {
    await this.gradens.reloadData()
  }

  initGrid() {
    this.gradens = new GridSettings<Garden>(this.remult.repo(Garden), {
      allowCrud: false,
      where: { name: this.search?.trimStart().length ? { $contains: this.search.trimStart() } : undefined! },
      columnSettings: row => [
        row.name,
        row.address,
        row.pickTimes,
        row.childsCount],
      rowButtons: [
        {
          textInMenu: terms.pickTimes,
          click: async row => await this.gardenPickTimes(row.id),
          icon: 'schedule'
        },
        {
          textInMenu: terms.childsList,
          click: async row => await this.gardenChildsList(row.id),
          icon: 'groups'
        }
      ],
      gridButtons: [{
        textInMenu: () => terms.refresh,
        click: async () => await this.refresh(),
        icon: 'refresh'
      }]
    })
  }

  async gardenPickTimes(gardenId = '') {
    if (gardenId?.length) {

    }
  }

  async gardenChildsList(gardenId = '') {
    if (gardenId?.length) {

    }
  }

  async addGarden() {
    let add = this.remult.repo(Garden).create()
    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: '',
        fields: () => [
          add.$.name,
          add.$.address
        ],
        ok: async () => {
          await add.save()
        }
      },
      dlg => dlg ? dlg.ok : false)
    if (changed) {
      await add.save()
      await this.refresh()
    }
  }

}
