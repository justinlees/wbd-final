// const express = require("express");
// const router = express.Router();
// const Stripe = require("stripe");
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// // POST /api/payments/intent/:freelancerId
// router.post("/intent/:freelancerId", async (req, res) => {
//     const { amount, currency } = req.body;

//     // Basic validation
//     if (!amount || typeof amount !== "number" || amount < 50) {
//         return res.status(400).json({
//             error: "Invalid amount. Minimum $0.50 required.",
//         });
//     }

//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount, // in cents
//             currency,
//             automatic_payment_methods: { enabled: true },
//         });

//         res.json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         console.error("Stripe Error:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// });

// module.exports = router;
