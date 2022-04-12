import { Allow, Entity, Fields, IdEntity } from "remult";
import { toDate } from "../../common/utils";
import { terms } from "../../terms";
import { User } from "../../users/user";

@Entity('pickings', { allowApiCrud: Allow.authenticated })
export class Picking extends IdEntity {
 
    @Fields.dateOnly({
        caption: terms.date,
        displayValue: toDate
    })
    date!: Date

    @Fields.uuid({ caption: terms.parent })
    parent!: User

    @Fields.uuid({ caption: terms.childName })
    childs!: User[] //other parent childs

}
