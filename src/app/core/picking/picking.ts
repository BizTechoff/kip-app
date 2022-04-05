import { Fields, IdEntity } from "remult";
import { terms } from "../../terms";
import { User } from "../../users/user";

export class Picking extends IdEntity {

    @Fields.uuid({ caption: terms.date })
    date!: Date

    @Fields.uuid({ caption: terms.parent })
    parent!: User

    @Fields.uuid({ caption: terms.childName })
    childs!: User[] //other parent childs

}
