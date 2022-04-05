import { Fields, IdEntity } from "remult";

export class Garden extends IdEntity {

    @Fields.string({})
    name = ''

    @Fields.string({})
    address = ''

    @Fields.string({ inputType: 'time' })
    openGateTimes = ''

}
