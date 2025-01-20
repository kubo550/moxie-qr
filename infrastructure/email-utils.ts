import {EmailService} from "./email-service";
import {generateHTMLTemplate} from "./email-templates/templates";
import {getCustomers} from "./firebase";


const emailService = new EmailService(
    process.env.NEXT_PUBLIC_RESHRD_EMAIL!,
    process.env.NEXT_PUBLIC_RESHRD_EMAIL_PASSWORD!
);

export const sendInvitationEmail = async (email: string) => {

    const emailConfig = {
        from: displayEmail(),
        to: email,
        subject: 'Get access to your updateable QR Clothing | MOXIEIMPACT',
        html: generateHTMLTemplate.newUser(email),
        attachments: [{
            filename: 'logo.png',
            path: 'https://eoq.soundestlink.com/image/newsletter/6366e56f7c36a9001d08e0be',
            cid: 'logo'
        }]
    };

    await emailService.send(emailConfig);
    console.log('email sent to ', email);
}



export const sendEmailToOldCustomer = async (email: string) => {

        const emailConfig = {
            from: displayEmail(),
            to: email,
            subject: 'New item has joined the party | MOXIEIMPACT',
            html: generateHTMLTemplate.alreadyUser(),
            attachments: [{
                filename: 'logo.png',
                path: `https://eoq.soundestlink.com/image/newsletter/6366e56f7c36a9001d08e0be`,
                cid: 'logo'
            }]
        };

        await emailService.send(emailConfig);
        console.log('email sent to ', email);
}

export const sendRegistrationEmail = async (email: string) => {

        const customers = await getCustomers();
        const isUser = customers.find(customer => customer.email === email);

        const emailConfig = {
            from: displayEmail(),
            to: email,
            subject: 'Thanks for registering! | Moxie',
            html: isUser ? generateHTMLTemplate.registrationUser() : generateHTMLTemplate.registrationNotUser(),
            attachments: [{
                filename: 'logo.png',
                path: `https://eoq.soundestlink.com/image/newsletter/6366e56f7c36a9001d08e0be`,
                cid: 'logo'
            }]
        };

        await emailService.send(emailConfig);
        console.log('email sent to ', email);
}

function displayEmail() {
   return `MOXIE team <${process.env.NEXT_PUBLIC_RESHRD_EMAIL}>`
}