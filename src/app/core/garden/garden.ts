import { Allow, Entity, Fields, IdEntity } from "remult";
import { Roles } from "../../users/roles";

@Entity<Garden>('gardens', (options, remult) => {
    options.allowApiRead = Allow.authenticated
    options.allowApiUpdate = Roles.admin
    options.allowApiDelete = Roles.admin
    options.allowApiInsert = Roles.admin
})
export class Garden extends IdEntity {

    @Fields.string({})
    name = ''

    @Fields.string({})
    address = ''

    @Fields.string({ inputType: 'time' })
    openGateTimes = ''

    @Fields.integer({
        sqlExpression: row => `( select count(*) from childs where garden = gardens.id )`
    })
    childsCount = 0

}
