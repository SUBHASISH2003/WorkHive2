import { contactUsEmail } from "../utils/contactUsEmail.js";
import { Contact } from "../models/contactUS.model.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

     // Compose the email message
     const emailMessage = `
     <h1>New Contact Us Submission</h1>
     <p><strong>Name:</strong> ${name}</p>
     <p><strong>Email:</strong> ${email}</p>
     <p><strong>Message:</strong> ${message}</p>
   `;

   // Use the sendEmail utility
   await contactUsEmail({
     email, // Admin email from environment variables
     subject: `Message From Dutio`,
     message: emailMessage,
   });

   res.status(200).json({ message: 'Your inquiry has been submitted successfully.' });
 } catch (error) {
   res.status(500).json({ message: 'Failed to send your inquiry. Please try again later.' });
 }
};