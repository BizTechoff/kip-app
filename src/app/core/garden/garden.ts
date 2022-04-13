import { Allow, Entity, Fields, IdEntity, Validators } from "remult";
import { terms } from "../../terms";
import { Roles } from "../../users/roles";

@Entity<Garden>('gardens', (options, remult) => {
    options.allowApiCrud = Roles.admin
    options.allowApiRead = Allow.authenticated
    options.defaultOrderBy = { name: "asc" }
})
export class Garden extends IdEntity {

    @Fields.string({
        caption: terms.name,
        validate: [Validators.required.withMessage(terms.requiredField), Validators.uniqueOnBackend.withMessage(terms.existsField)]
    })
    name = ''

    @Fields.string({
        caption: terms.address,
        validate: [Validators.required.withMessage(terms.requiredField)]
    })
    address = ''

    @Fields.integer((options, remult) => {
        options.caption = terms.childsCount
        options.sqlExpression = row => `( select count(*) from childs where garden = gardens.id )`
    })
    childsCount = 0

    @Fields.string<Garden>(
        (options, remult) => {
            options.caption = terms.pickTimes
            options.sqlExpression = row => `( select string_agg(from_time || '-' || to_time, ',' ORDER BY from_time || '-' || to_time) from gates where garden = gardens.id )`
            // options.serverExpression = async (garden) => (await (await remult.repo(Gate).find({ where: { garden }, load: () => [] }))).map(x => x.from + " - " + x.to).join(',')
        })
    pickTimes = '';

}
