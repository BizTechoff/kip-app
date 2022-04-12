import { openDialog } from "@remult/angular"
import { User } from "../users/user"
import { SelectUserComponent } from "./select-user/select-user.component"

export const openUserSelector = async (): Promise<User | undefined> => {
    let selected!: User
    let changed = await openDialog(SelectUserComponent,
        dlg => dlg.args = {
            title: 'משתמש',
            onSelect: u => {
                if (u) {
                    selected = u
                }
            }
        },
        dlg => dlg ? true : false)
    if (changed) {
    }
    return selected
}
