import { Allow, Entity, Fields, IdEntity } from "remult";

@Entity<Picker>('pickers', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
})
export class Picker extends IdEntity {

    // garden!: Garden

    // childs: Child[] = [] as Child[]

    @Fields.string()
    name = ''

    @Fields.string()
    relation = ''

    @Fields.string()
    email = ''

    @Fields.string()
    mobile = ''

}
