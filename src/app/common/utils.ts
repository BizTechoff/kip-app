
export const mobileFromDb = (mobile: string) => {
    let result = '';// [0]00-0000-000
    if (mobile && mobile.length > 0) {
        let last = mobile.length - 3;
        if (last > 0) {
            result = mobile.substring(0, last) + '-' + mobile.substring(last);

            let first = result.length - 7 - 1;//'-'
            if (first > 0) {
                result = result.substring(0, first) + '-' + result.substring(first);
            }
        }
    }
    return result;
}

export const mobileToDb = (mobile: string, mobile2?: string): boolean | string => {
    let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let fixedMobile = '';// [0]000000000
    if (mobile && mobile.length > 0) {
        for (const c of mobile) {
            if (digits.includes(c)) {
                fixedMobile += c;
            }
        }
    }
    if (fixedMobile.length > 0) {
        fixedMobile = fixedMobile.padStart(10, '0');
        if (!fixedMobile.startsWith('05')) {
            if (!fixedMobile.startsWith('000')) {
                if (fixedMobile.startsWith('00')) {
                    fixedMobile = fixedMobile.substring(1);//02,03,..
                }
            }
        }
    }

    if (mobile2 && mobile2.length > 0) {
        let fixedMobile2 = '';// [0]000000000
        for (const c of mobile2) {
            if (digits.includes(c)) {
                fixedMobile2 += c;
            }
        }
        if (fixedMobile2.length > 0) {
            fixedMobile2 = fixedMobile2.padStart(10, '0');
            if (!fixedMobile2.startsWith('05')) {
                if (!fixedMobile2.startsWith('000')) {
                    if (fixedMobile2.startsWith('00')) {
                        fixedMobile2 = fixedMobile2.substring(1);//02,03,..
                    }
                }
            }
        }

        return fixedMobile === fixedMobile2
    }

    return fixedMobile;
}

export const toDateTime = (row: any, col: Date) => {
    return datetimeFormat(col)
}

export const toDate = (row: any, col: Date) => {
    return dateFormat(col)
}


const dateFormat = (col: Date) => {
    let result = col?.toLocaleDateString('en-GB')
    return (result ?? undefined)
}

const datetimeFormat = (col: Date) => {
    let result = col?.toLocaleString('en-GB')
    return (result ?? undefined)
}
