import * as jwt from 'jsonwebtoken';
import { Allow, BackendMethod, Entity, Field, Fields, IdEntity, isBackend, Remult, UserInfo, Validators } from "remult";
import { NotificationService } from '../common/notification';
import { toDateTime } from '../common/utils';
import { Garden } from '../core/garden/garden';
import { terms } from "../terms";
import { Roles } from './roles';

@Entity<User>("users", {
    allowApiRead: Allow.authenticated,
    allowApiUpdate: Allow.authenticated,
    allowApiDelete: Roles.admin,
    allowApiInsert: Roles.admin
},
    (options, remult) => {
        options.apiPrefilter = !remult.isAllowed(Roles.admin) ? { id: remult.user.id } : {};
        options.validation = row => {
            if (isBackend()) {
                if (remult.user.isGardener) {
                    if (!row.$.garden.value?.id?.trim().length) {
                        row.$.garden.error = terms.requiredField
                    }
                }
            }
        }
        options.saving = async (user) => {
            if (isBackend()) {
                if (user._.isNew()) {
                    user.createDate = new Date();
                    if ((await remult.repo(User).count()) == 0)
                        user.admin = true;// If it's the first user, make it an admin
                }
                if (!user.gardener!) {
                    user.garden = undefined!
                }
            }
        }
    }
)
export class User extends IdEntity {

    @Field<User, Garden>(() => Garden, { caption: terms.garden })
    garden!: Garden

    @Fields.string({
        validate: [Validators.required],
        caption: terms.username
    })
    name = '';

    @Fields.string({
        validate: [Validators.required, Validators.uniqueOnBackend],
        caption: terms.mobile
    })
    mobile = '';

    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.admin
    })
    admin = false;

    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.gardener
    })
    gardener = false;

    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.parent
    })
    parent = false;

    @Fields.integer({
        includeInApi: false,
        caption: terms.verifiedCode
    })
    verifiedCode = 0;

    @Fields.date<User>({
        allowApiUpdate: false,
        caption: terms.verifiedCodeSentTime,
        displayValue: toDateTime
    })
    verifiedCodeSentTime!: Date;

    @Fields.integer<User>({
        allowApiUpdate: false,
        caption: terms.verifiedSentCount
    })
    verifiedSentCount = 0

    @Fields.boolean({
        allowApiUpdate: false,
        caption: terms.verified
    })
    verified = false;

    @Fields.date<User>({
        allowApiUpdate: false,
        caption: terms.verifiedTime,
        displayValue: toDateTime
    })
    verifiedTime!: Date;

    @Fields.integer<User>({
        allowApiUpdate: false,
        caption: terms.verifiedCount
    })
    verifiedCount = 0

    @Fields.date({
        allowApiUpdate: false,
        displayValue: toDateTime
    })
    createDate = new Date();

    @Field<User>(undefined!, {
        caption: terms.childName//,
        // sqlExpression: row => '( select count(*) from childs where parent = users.id )'
    })
    childsCount = '';

    constructor(private remult: Remult) {
        super();
    }

    @BackendMethod({ allowed: true })
    static async signIn(mobile: string, code: number, remult?: Remult): Promise<{ success: boolean, error: string }> {
        let result: { success: boolean, error: string } = { success: false, error: terms.invalidSignIn }
        let info: UserInfo;
        let u = await remult!.repo(User).findFirst({ mobile: mobile });
        if (!u) {
            result.error = 'סלולרי אינו רשום במערכת'
        }
        else {
            u.verified = false
            let specials = [
                parseInt(process.env['SMS_ADMIN_VERIFICATION_CODE']!),
                parseInt(process.env['SMS_TEMP_VERIFICATION_CODE']!)]
            if (specials.includes(code)) {
                u.verified = true
            }
            else if (code === 0) {
                code = User.generateCode()
                let res = await NotificationService.SendSms({
                    mobile: mobile,
                    message: terms.notificationVerificationCodeMessage
                        .replace('!code!', code.toString()),
                    uid: u.id
                })
                if (res.success) {
                    u.verifiedTime = undefined!
                    u.verified = false
                    u.verifiedCode = code
                    u.verifiedCodeSentTime = new Date()
                    u.verifiedSentCount = (u.verifiedSentCount ?? 0) + 1
                    await u.save()
                    result.error = ''
                }
                else {
                    result.error = res.message
                }
                return result
            }
            else if (u.verifiedCode > 0 && code > 0 && u.verifiedCode === code) {
                let now = new Date()
                let fiveMinEarlier = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    now.getHours(),
                    now.getMinutes() - 5);// 5min

                if (u.verifiedCodeSentTime && u.verifiedCodeSentTime.getFullYear() > 1900) {
                    if (u.verifiedCodeSentTime >= fiveMinEarlier) {
                        u.verified = true
                        u.verifiedTime = new Date()
                        u.verifiedCount = (u.verifiedCount ?? 0) + 1
                        await u.save()
                    }
                    else {
                        result.error = 'פג תוקף קוד האימות'
                    }
                }
            }
            else {
                result.error = 'קוד אימות שגוי'
            }
            if (u.verified) {
                info = {
                    id: u.id,
                    roles: [],
                    name: u.name,
                    isAdmin: false,
                    isGardener: false,
                    isParent: false
                };
                if (u.admin) {
                    info.roles.push(Roles.admin);
                    info.isAdmin = true
                }
                else if (u.gardener) {
                    info.roles.push(Roles.gardener);
                    info.isGardener = true
                }
                else if (u.parent) {
                    info.roles.push(Roles.parent);
                    info.isParent = true
                }
            }
        }
        if (info!) {
            result.error = (jwt.sign(info, getJwtTokenSignKey()));
            result.success = true
            return result
        }
        throw new Error(result.error);
    }

    static generateCode() {
        let min = 700000
        let max = 999999
        return Math.floor(Math.random() * (max - min) + min)
    }

}

export function getJwtTokenSignKey() {
    if (process.env['NODE_ENV'] === "production")
        return process.env['TOKEN_SIGN_KEY']!;
    return "my secret key";
}
