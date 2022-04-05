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
        validate: [Validators.required, Validators.uniqueOnBackend],
        caption: terms.username
    })
    name = '';

    @Fields.string({ includeInApi: false })
    password = '';

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

    @Fields.boolean({
        includeInApi: false,
        caption: terms.verified
    })
    verified = false;

    @Fields.string<User>({
        caption: terms.childName//,
        // valueConverter: {
        //     toDb: col => JSON.stringify(col),
        //     fromDb: col => JSON.parse(col)
        // }
    })
    childs = '';

    @Fields.string({
        caption: terms.kindergardenName
    })
    kindergardenName = ''

    constructor(private remult: Remult) {
        super();
    }
    async hashAndSetPassword(password: string) {
        this.password = (await import('password-hash')).generate(password);
    }
    async passwordMatches(password: string) {
        return !this.password || (await import('password-hash')).verify(password, this.password);
    }
    @BackendMethod({ allowed: true })
    async create(password: string) {
        if (!this._.isNew())
            throw new Error(terms.invalidOperation);
        await this.hashAndSetPassword(password);
        await this._.save();
    }
    @BackendMethod({ allowed: Allow.authenticated })
    async updatePassword(password: string) {
        if (this._.isNew() || this.id != this.remult.user.id)
            throw new Error(terms.invalidOperation);
        await this.hashAndSetPassword(password);
        await this._.save();
    }
    @BackendMethod({ allowed: true })
    static async signIn(user: string, password: string, remult?: Remult) {
        let result: UserInfo;
        let u = await remult!.repo(User).findFirst({ name: user });
        if (u) {
            if (await u.passwordMatches(password)) {
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
