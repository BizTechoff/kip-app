import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Field, Fields, IdEntity, isBackend, Validators } from "remult";
import { terms } from "../../terms";
import { Garden } from "../garden/garden";

@Entity<Gate>('gates', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
    options.validation = async (row, refRow) => {
        if (row && isBackend()) {
            let conflict = await remult.repo(Gate).findFirst({
                garden: row.garden,
                id: { "!=": row.id },
                from: { "<=": row.to },
                to: { ">=": row.from }
                // $or: [
                //     { from: { ">": row.to } },
                //     { to: { "<": row.from } }
                // ]
            }) 
            if (conflict) {
                row.$.from.error = terms.gateTimesConflict
                row.$.to.error = terms.gateTimesConflict
            }
        }
    }
})
export class Gate extends IdEntity {

    @Field<Gate, Garden>(() => Garden, {
        caption: terms.garden,
        validate: (row, col) => [Validators.required]
    })
    garden!: Garden

    @DataControl<Gate, string>({
        valueChange: (row, col) => {
            if (row.$.to.value === '00:00') {
                row.$.to.value = col.value
            }
            else if (row.$.to.value < row.$.from.value) {
                row.$.to.value = row.$.from.value
            }
        } 
    })
    @Fields.string({
        caption: terms.fromTime,
        dbName: 'from_time',
        inputType: 'time',
        validate: (row, col) => [Validators.required]
    })
    from = '00:00'

    @DataControl<Gate, string>({
        valueChange: (row, col) => {
            if (row.$.from.value > row.$.to.value) {
                row.$.from.value = row.$.to.value
            }
        }
    })
    @Fields.string({
        caption: terms.toTime,
        dbName: 'to_time',
        inputType: 'time',
        validate: (row, col) => [Validators.required]
    })
    to = '00:00'

}
