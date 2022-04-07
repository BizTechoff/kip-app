import { BackendMethod } from "remult";


export interface SmsRequest {
    uid: string,
    mobile: string,
    message: string,
    schedule?: string
}

export class NotificationService {

    static sendSms: (req: SmsRequest) => Promise<{ success: boolean, message: string, count: number }>;

    @BackendMethod({ allowed: true })
    static async SendSms(req: SmsRequest) {
        return await NotificationService.sendSms(req);
    }

}
