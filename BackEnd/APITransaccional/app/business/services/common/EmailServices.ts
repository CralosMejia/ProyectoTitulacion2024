import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import dotenv from 'dotenv';
import { injectable } from 'inversify';
// Load environment variables from .env file
dotenv.config();

/**
 * Service class for sending emails.
 */
@injectable()
export class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVER,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    /**
     * Sends an email.
     * 
     * @param to - The recipient's email address.
     * @param subject - The subject of the email.
     * @param text - The plain text content of the email.
     * @param html - The HTML content of the email.
     * @returns A promise that resolves to the information about the sent message.
     */
    async sendEmail(to: string, subject: string, text: string, html: string): Promise<SentMessageInfo> {
        const mailOptions: SendMailOptions = {
            from: process.env.SMTP_MAIL,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending mail:', error);
            throw error;
        }
    }
}
