import emailjs from '@emailjs/browser';

// These should ideally be in environment variables, but for this specific user request/demo, 
// we'll keep them here or ask the user to fill them in.
// We will use placeholders that the user needs to replace.

export const EMAIL_CONFIG = {
    SERVICE_ID: 'service_appl22g', // User needs to replace this
    TEMPLATE_ID: 'template_44n8fb8', // User needs to replace this
    PUBLIC_KEY: 'E4kIe5OZDXqRHCPN9',   // User needs to replace this
};

export const sendBirthdaySummary = async (
    userName: string,
    wish: string,
    bucketList: string[]
) => {
    if (EMAIL_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID') {
        console.warn('EmailJS not configured. Skipping email send.');
        return;
    }

    try {
        const templateParams = {
            to_name: 'Admin', // The user who owns the site
            from_name: userName, // The guest (birthday girl)
            message: wish,
            bucket_list: bucketList.join(', '),
            reply_to: 'no-reply@birthday-app.com', // Optional
        };

        const response = await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            EMAIL_CONFIG.TEMPLATE_ID,
            templateParams,
            EMAIL_CONFIG.PUBLIC_KEY
        );

        console.log('SUCCESS!', response.status, response.text);
        return true;
    } catch (err) {
        console.error('FAILED...', err);
        return false;
    }
};
