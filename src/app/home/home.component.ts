import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../common/notification';
import { mobileToDb } from '../common/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  mobile = ''

  constructor() { }

  ngOnInit() {
  }

  async signIn() {
    this.mobile = mobileToDb(this.mobile) as string
    let res = await NotificationService.SendSms({
      mobile: this.mobile,
      message: `קוד אימות: ${0} תקף לחמש דקות`,
      uid: '11'
    }) 
    console.log(res)
  }

}
