import * as jwt from 'jsonwebtoken';
import { Allow, BackendMethod, Entity, Fields, IdEntity, isBackend, Remult, UserInfo, Validators } from "remult";
import { terms } from "../terms";
import { Roles } from './roles';

@Entity<User>("Users", {
    allowApiRead: Allow.authenticated,
    allowApiUpdate: Allow.authenticated,
    allowApiDelete: Roles.admin,
    allowApiInsert: Roles.admin
},
    (options, remult) => {
        options.apiPrefilter = !remult.isAllowed(Roles.admin) ? { id: remult.user.id } : {};
        options.saving = async (user) => {
            if (isBackend()) {
                if (user._.isNew()) {
                    user.createDate = new Date();
                    if ((await remult.repo(User).count()) == 0)
                        user.admin = true;// If it's the first user, make it an admin
                }
            }
        }
    }
)
export class User extends IdEntity {

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

    @Fields.date({
        allowApiUpdate: false
    })
    createDate = new Date();

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

    @Fields.date({
        allowApiUpdate: false,
        caption: terms.verifiedDate
    })
    verifiedCodeTime!: Date;

    @Fields.boolean({
        includeInApi: false,
        caption: terms.verified
    })
    verified = false;

    @Fields.string<User>({
        caption: terms.childName//,
        // sqlExpression: row => '( select count(*) from childs where parent = users.id )'
    })
    childsCount = '';

    constructor(private remult: Remult) {
        super();
    }

    @BackendMethod({ allowed: true })
    static async signIn(mobile: string, code: number, remult?: Remult) {
        let result: UserInfo;
        let u = await remult!.repo(User).findFirst({ name: mobile });
        if (u) {
            if (!u.verified) {
                if (u.verifiedCode > 0 && code > 0 && u.verifiedCode === code) {
                    let now = new Date()
                    let fiveMinEarlier = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        now.getHours(),
                        now.getMinutes() - 5);// 5min

                    if (u.verifiedCodeTime && u.verifiedCodeTime.getFullYear() > 1900) {
                        if (u.verifiedCodeTime >= fiveMinEarlier) {
                            u.verified = true
                            await u.save()
                        }
                    }
                }
            }
            if (u.verified) {
                result = {
                    id: u.id,
                    roles: [],
                    name: u.name,
                    isAdmin: false,
                    isGardener: false,
                    isParent: false
                };
                if (u.admin) {
                    result.roles.push(Roles.admin);
                    result.isAdmin = true
                }
                else if (u.gardener) {
                    result.roles.push(Roles.gardener);
                    result.isGardener = true
                }
                else if (u.parent) {
                    result.roles.push(Roles.parent);
                    result.isParent = true
                }
            }
        }
        if (result!) {
            return (jwt.sign(result, getJwtTokenSignKey()));
        }
        throw new Error(terms.invalidSignIn);
    }
}

export function getJwtTokenSignKey() {
    if (process.env['NODE_ENV'] === "production")
        return process.env['TOKEN_SIGN_KEY']!;
    return "my secret key";
}
