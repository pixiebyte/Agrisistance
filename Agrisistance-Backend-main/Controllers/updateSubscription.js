import { StatusCodes } from 'http-status-codes';
import pool from '../DB/connect.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const UpdateSubscription = async (req, res) => {

    // Get the subscription_type , payment_method_id and user_id 
    const { subscription_type, payment_method_id } = req.body;
    const user_id = req.user.id;

    // Define the prices for the subscription types
    const prices = {
        Basic: 0, // $0.00
        Premium: 1000, // $10.00
    };
    const amount = prices[subscription_type];
    
    try {

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method: payment_method_id,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            return_url: 'https://example.com/return',
            confirm: true,
        });

        // Update the subscription type in the database
        await pool.query(`UPDATE Users SET subscription_type = ? WHERE user_id = ?`, [subscription_type, user_id]);

        // Send the response
        res.status(StatusCodes.OK).json({ message: 'Subscription updated successfully', paymentIntent });
        
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

export default UpdateSubscription;
