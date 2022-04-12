import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Field, Fields, IdEntity } from "remult";
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

    @DataControl<Picking, User>({
        hideDataOnInput: true,
        click: async (row, col) => {
            let u!: User // = await (await require('../../common/selectors')).openUserSelector()
            if (u) {
                row.$.parent.value = u
            }
        },
        clickIcon: 'search'
    })
    @Field(() => User, { caption: terms.parent })
    parent!: User

    @Field(() => User, { caption: terms.childName })
    childs!: User[] //other parent childs

}
