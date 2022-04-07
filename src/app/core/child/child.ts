import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { terms } from "../../terms";
import { Garden } from "../garden/garden";

@Entity<Child>('childs', (options, remult) => {
    options.allowApiDelete = false
    options.allowApiInsert = Allow.authenticated
    options.allowApiUpdate = Allow.authenticated
    options.allowApiRead = Allow.authenticated
})
export class Child extends IdEntity {

    @Field<Child, Garden>(() => Garden, { caption: terms.gardener })
    garden!: Garden

    name = ''

    photo = ''

    @Fields.integer({
        // sqlExpression: row => `( select count(*) from pickers where child = childs.id )`
    })
    pickersCount = 0

}
