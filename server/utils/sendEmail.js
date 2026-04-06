import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'mernshop@psatyakiran.in'; 

export const sendOTPEmail = async (email, otp) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `MernShop <${FROM_EMAIL}>`,
            to: [email],
            subject: 'Your Account OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Authentication OTP</h2>
                    <p>Your one-time password (OTP) is:</p>
                    <h1 style="color: #4A90E2; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 10 minutes. Do not share it with anyone.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error('Failed to send OTP email');
        }
        return data;
    } catch (err) {
        console.error('Resend Exception:', err);
    }
};

export const sendOrderConfirmation = async (email, order) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `MernShop <${FROM_EMAIL}>`,
            to: [email],
            subject: `Order Confirmation - #${order._id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Thank you for your order!</h2>
                    <p>Your order has been placed successfully.</p>
                    <h3>Order Details:</h3>
                    <ul>
                        ${order.orderItems.map(item => `<li>${item.name} - ${item.qty} x ₹${item.price}</li>`).join('')}
                    </ul>
                    <hr/>
                    <h4>Total Price: ₹${order.totalPrice}</h4>
                    <p>We will notify you once your order is shipped and delivered.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error('Failed to send order confirmation email');
        }
        return data;
    } catch (err) {
        console.error('Resend Exception:', err);
    }
};

export const sendOrderDelivered = async (email, order) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `MernShop <${FROM_EMAIL}>`,
            to: [email],
            subject: `Order Delivered - #${order._id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Your Order has been Delivered!</h2>
                    <p>Order #${order._id} has been marked as delivered.</p>
                    <p>We hope you enjoy your purchase! Thank you for shopping at MernShop.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error('Failed to send order delivery email');
        }
        return data;
    } catch (err) {
        console.error('Resend Exception:', err);
    }
};
