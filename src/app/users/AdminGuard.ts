import { Injectable } from '@angular/core';
import { AuthenticatedGuard } from '@remult/angular';
import { Roles } from './roles';

@Injectable()
export class AdminGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.admin;
    }
}

@Injectable()
export class GardenerGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.gardener;
    }
}

@Injectable()
export class ParentGuard extends AuthenticatedGuard {

    override isAllowed() {
        return Roles.parent;
    }
}

@Injectable()
export class ParentOrAdminGuard extends AuthenticatedGuard {

    override isAllowed() {
        return this.remult.isAllowed([Roles.admin, Roles.parent])
    }
}

@Injectable()
export class GardenerOrAdminGuard extends AuthenticatedGuard {

    override isAllowed() {
        return this.remult.isAllowed([Roles.admin, Roles.gardener])
    }
}

// יש חוג
// עוד כמה דקות
// כרגע עסוקים
// הילדים אוכלים כרגע
// סבתא\הורה\יש אישור או לא
// אוקיי קיבלתי
// מסרתי את הילד
// זיהיתי את ההורה
// מעיל+מים+תיק+בגדים+ציורים+
// אני צריכה לשוחח איתך
