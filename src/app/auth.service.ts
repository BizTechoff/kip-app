import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Remult } from 'remult';
import { DialogService } from './common/dialog';
import { terms } from './terms';
import { User } from './users/user';

export interface States {
    isLogedin?: boolean,
    isNeewVerifiedCode?: boolean,
    isError?: boolean
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    async signIn(mobile: string, code: number): Promise<States> {
        let res = await User.signIn(mobile, code)
        if (res.success) {
            this.setAuthToken(res.error);
            return { isLogedin: true }
        }
        else if (res.error?.length) {
            this.dialog.info(res.error)
            return { isError: true }
        }
        else {
            // input verified code
            return { isNeewVerifiedCode: true }
        }
    }

    setAuthToken(token: string) {
        this.remult.setUser(new JwtHelperService().decodeToken(token));

        // control user-login by field in table
        // let u = await this.remult.repo(User).findId(this.remult.user.id)
        // if(u){
        //     if(!u.verified){
        //         this.signOut()
        //     }
        // }

        localStorage.setItem(AUTH_TOKEN_KEY, token);

        console.log('before', this.router.url)
        this.router.navigateByUrl(terms.picking)
        console.log('after', this.router.url)
    }

    signOut() {
        this.remult.setUser(undefined!);
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    static fromStorage(): string {
        return localStorage.getItem(AUTH_TOKEN_KEY)!;
    }

    constructor(private remult: Remult, private router: Router, private dialog: DialogService) {
        let token = AuthService.fromStorage();
        if (token) {
            this.setAuthToken(token);
        }
    }
}
const AUTH_TOKEN_KEY = "kipAuthToken";
