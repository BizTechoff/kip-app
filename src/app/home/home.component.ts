import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';
import { AuthService } from '../auth.service';
import { DialogService } from '../common/dialog';
import { mobileToDb } from '../common/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mobile = ''
  verifiedCode = ''
  isNeewVerifiedCode = false

  constructor(private remult: Remult, public auth: AuthService, private dialog: DialogService) { }

  ngOnInit() {
  }

  async signIn() {
    if (!this.mobile) {
      this.mobile = ''
    }
    this.mobile = this.mobile.trim()
    if (this.mobile.length < 9) {
      this.dialog.info('מספר סלולרי אינו תקין')
      return
    }
    this.mobile = mobileToDb(this.mobile) as string
    let verified = true
    let res = await this.auth.signIn(this.mobile, 0)
    this.isNeewVerifiedCode = res.isNeewVerifiedCode!
    // if (!verified) {
    //   let res = await NotificationService.SendSms({
    //     mobile: this.mobile,
    //     message: `קוד אימות: ${0} תקף לחמש דקות`,
    //     uid: this.remult.user.id
    //   })
    //   console.log(res)
    // }
  }

  async verifyCode() {
    if (!this.verifiedCode) {
      this.verifiedCode = ''
    }
    this.verifiedCode = this.verifiedCode.trim()
    if (this.verifiedCode.length < 6) {
      this.dialog.info('קוד אימות אינו תקין')
      return
    }
    let code = parseInt(this.verifiedCode)
    let res = await this.auth.signIn(this.mobile, code)
    if (res.isError) {
      this.dialog.info('קוד אימות אינו תקין')
    }
  }

}
