import { Component, OnInit } from '@angular/core';
import { GridSettings } from '@remult/angular/interfaces';
import { Remult } from 'remult';
import { Garden } from '../garden';

@Component({
  selector: 'app-gardens',
  templateUrl: './gardens.component.html',
  styleUrls: ['./gardens.component.scss']
})
export class GardensComponent implements OnInit {

  gradens!: GridSettings<Garden>

  constructor(private remult: Remult) { }

  ngOnInit(): void {
    this.initGrid();
  }

  initGrid() {
    this.gradens = new GridSettings<Garden>(this.remult.repo(Garden), {
      allowCrud: this.remult.authenticated(),
      columnSettings: row => [
        row.name,
        row.address,
        row.openGateTimes,
        row.childsCount]
    })
  }

}
