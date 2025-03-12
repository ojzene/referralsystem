import sgMail from '@sendgrid/mail';

import { SENDGRID_API_KEY } from "../../../config";

export class sendGridService { 

    public sendMail = async (to: any, subject: any, message: any) => {
        let templateId: any;
        let from = 'oyekanmi.owolabi@etranzactng.com';
        switch (subject) {
            case 'BillOn Account Invitation':
                templateId = ''
                from = 'oyekanmi.owolabi@etranzactng.com'
                break;
            case 'BillOn Account Verification':
                templateId = ''
                from = 'oyekanmi.owolabi@etranzactng.com'
                break;
            case 'BillOn Account Registration':
                templateId = ''
                from = 'oyekanmi.owolabi@etranzactng.com'
                break;
            case 'BillOn Transaction':
                templateId = ''
                from = 'oyekanmi.owolabi@etranzactng.com'
                break;
            case 'BillOn Reset Password':
                templateId = ''
                from = 'oyekanmi.owolabi@etranzactng.com'
                break; 
            case 'Confirmation':
                templateId = ''
                from = 'oyekanmi.owolabi@etranzactng.com'
                break;   
            default:
                break;
        }

        // const apiKey = SENDGRID_API_KEY;
        // sgMail.setApiKey(apiKey)
        sgMail.setApiKey("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")
        const msg = {
            to: to, // Change to your recipient
            from: 'oyekanmi.owolabi@etranzactng.com', // Change to your verified sender
            subject: subject,
            text: message,
            html: `${message}`
        }
        // sgMail.send(msg).then(() => {
        //     console.log('Email sent');
        // })
        // .catch((error) => {
        //     console.error(error);
        // })
        const sendMessage = await sgMail.send(msg);
        return sendMessage;
    }

}