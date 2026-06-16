# Contact Form Setup Guide

Your contact form is now configured to send emails using Web3Forms. Follow these steps to complete the setup:

## Step 1: Get Your Web3Forms Access Key (FREE)

1. Visit [https://web3forms.com](https://web3forms.com)
2. Click on "Get Started" or "Create Access Key"
3. Enter your email address where you want to receive form submissions
4. Verify your email address
5. Copy your Access Key (it looks like: `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

## Step 2: Add Access Key to Your Project

### Option A: Using Environment Variable (Recommended)

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add the following line:
   ```
   VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```
3. Replace `your_access_key_here` with your actual access key
4. Restart your development server

### Option B: Direct in Code (Quick Setup)

1. Open `src/components/sections/ContactSection.tsx`
2. Find the line: `access_key: 'YOUR_ACCESS_KEY_HERE'`
3. Replace `YOUR_ACCESS_KEY_HERE` with your actual access key
4. Save the file

## Step 3: Test Your Form

1. Run your development server: `npm run dev`
2. Navigate to the contact section
3. Fill out and submit the form
4. Check your email inbox for the submission

## Features

✅ **FREE forever** - No credit card required
✅ **Unlimited submissions** on free tier
✅ **Spam protection** built-in
✅ **Email notifications** to your inbox
✅ **Custom reply-to** - Replies go to the form submitter
✅ **No backend required**

## Customization Options

You can customize the email format by modifying the `body` in the fetch request:

```javascript
body: JSON.stringify({
  access_key: 'your_key',
  name: formData.name,
  email: formData.email,
  subject: formData.subject,
  message: formData.message,
  // Add custom fields below:
  from_name: 'Portfolio Contact Form',
  replyto: formData.email,
  // Add more custom data as needed
}),
```

## Troubleshooting

### Form not sending?
- Check that your access key is correct
- Verify your email is confirmed on Web3Forms
- Check browser console for error messages

### Not receiving emails?
- Check your spam folder
- Verify your email on Web3Forms dashboard
- Test with a different email address

## Alternative Email Services

If you prefer a different service, you can also use:

- **EmailJS** (https://www.emailjs.com) - Client-side email service
- **Formspree** (https://formspree.io) - Form backend service
- **Getform** (https://getform.io) - Form endpoint service

## Need Help?

- Web3Forms Documentation: https://docs.web3forms.com
- Web3Forms Support: support@web3forms.com
