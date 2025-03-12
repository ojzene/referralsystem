import Twilio from 'twilio';

export class twilioService { 

    public sendSMS = async (toPhoneNumber: string, smsMessage: any) => {
        // kanmi
        // const accountSid = "AC1aebf83b608938295596a7186670c120";
        // const authToken = "c9d950b787d17cf18d1fe89e055e508a";

        // e-tranazct - live
        const accountSid = "AC6c1e6bf1712f42c30bbec50b32a8a283";
        const authToken = "4902d2b72a2099cb6b4ec0ec96005590";
        const messageServiceSid = "MG5b1b89ceecccb88b9a199cda4f5c650b";

        // https://billonapp.azurewebsites.net/api/sms/delivery-status

        // test
        // const accountSid = "AC81aca9d9565708fb0bec4b59293476ee";
        // const authToken = "a324afefdf0a2643d0ac5892dd58486d";

        // const verifySid = "VA8ef58c41db42e65ad899e78f42309587";
        
        const client = Twilio(accountSid, authToken);

        client.lookups.v1.phoneNumbers(toPhoneNumber)
                 .fetch({type: ['carrier']})
                 .then(phone_number => console.log(phone_number.carrier));

        const message = await client.messages.create({
            body: smsMessage,
            messagingServiceSid: messageServiceSid,
            to: toPhoneNumber
        }).then(response => console.log(response));
        
        return message;
    }

}
