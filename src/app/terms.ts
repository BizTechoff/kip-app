export const terms = {
    admin: 'אדמין',
    areYouSureYouWouldLikeToDelete: "האם למחוק",
    cancel: 'ביטול',
    certificates: 'תעודות',
    childName: 'שם הילד',
    changePassword: "שינוי סיסמה",
    confirmPassword: "אשר סיסמא",
    customer: 'לקוח',
    customers: 'לקוחות',
    date: 'תאריך',
    doesNotMatchPassword: "סיסמאות שונות",
    emailMiddle1LettersError: 'אמצע האימייל לפחות תו אחד',
    emailPrefix3LettersError: 'תחילת האימייל לפחות 3 תווים',
    emailSufix3LettersError: 'סיומת האימייל לפחות 3 תווים',
    gardener: 'גננת',
    gardens: 'גנים',
    hello: "שלום",
    home: 'אפליקציה לאיסוף מהגן', // 'ברוכים הבאים',
    installer: 'מתקין',
    installtions: 'התקנות',
    invalidOperation: "פעולה שגויה",
    invalidSignIn: "שגיאה בפרטי כניסה",
    invoices: 'חשבון',
    kindergardenName: 'שם הגן',
    manager: 'מנהל',
    missingAt: 'חסר את הסימן @ באימייל',
    missingPoint: 'חסר נקודה (.) באימייל',
    mobile: 'סלולרי',
    newOrder: 'הזמנה חדשה',
    no: 'לא',
    office: 'משרד',
    ok: 'אישור',
    orders: 'הזמנות',
    outgoing: 'באו לאסוף',
    parent: 'הורה',
    password: 'סיסמא',
    picking: 'איסוף',
    products: 'מוצרים',
    requiredField: 'שדה חובה',
    reviewer: 'סוקר',
    reviews: 'סקרים',
    signIn: "כניסה",
    signOut: 'התנתקות',
    signUp: "הירשמות",
    status: 'סטטוס',
    updateInfo: "פרטים אישיים",
    userAccounts: 'משתמשים',
    usher: 'סדרן',
    verified: 'אומת',
    verifiedCode: 'קוד אימות',
    verifiedDate: 'זמן אימות',
    yes: 'כן',
    username: "שם משתמש"
}

declare module 'remult' {
    export interface UserInfo {
        isAdmin: boolean
        isParent: boolean
        isGardener: boolean
    }
}
