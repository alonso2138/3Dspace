const express = require('express');
const stripe = require('stripe')('sk_test_51JprSpH6YrdtkYECuPCY9zC2NFGRYuEBZLes9paj0cRrjSoMTAi1nX3lBYgzsaH7kxeT8KAFZUE3EG18CdJPE4Xq00gC0QbE7Y');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.body,
        mode: 'payment',
        billing_address_collection: 'required', // Collect billing address
        shipping_address_collection: {
            allowed_countries: ['ES', 'FR', 'IT', 'AD'] // Add the countries you want to allow
        },
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
    });

    res.json({ id: session.id });
});

// Serve the index.html file for the root path
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Use the PORT environment variable provided by Heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));