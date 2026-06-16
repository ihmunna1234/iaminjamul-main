# 📧 Contact Form - Quick Start Guide

Your contact form is now **fully functional** and ready to send emails to your inbox!

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your FREE Access Key

1. Go to **[https://web3forms.com](https://web3forms.com)**
2. Enter your email address (where you want to receive form submissions)
3. Click "Create Access Key"
4. Check your email and verify
5. Copy your access key (looks like: `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

### Step 2: Add Access Key to Your Project

Create a `.env` file in your project root and add:

```env
VITE_WEB3FORMS_ACCESS_KEY=paste_your_access_key_here
```

### Step 3: Restart Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test It! 🎉

1. Open your website
2. Go to the contact section
3. Fill out the form
4. Submit it
5. Check your email inbox!

---

## ✨ What's Been Implemented

✅ **Fully functional contact form**
✅ **Real email delivery** to your inbox
✅ **Spam protection** built-in
✅ **Form validation**
✅ **Loading states** (Sending... feedback)
✅ **Success/Error notifications**
✅ **Auto-reply functionality** (users' emails are set as reply-to)
✅ **Completely FREE** - No credit card needed

---

## 🔧 Configuration

### Update Your Contact Information

Open `src/components/sections/ContactSection.tsx` and update:

```typescript
// Line 41-42: WhatsApp number
const whatsappNumber = '8801234567890'; // Replace with your actual number

// Line 71: Email address
<a href="mailto:injamul@example.com">
  injamul@example.com
</a>

// Line 83: Phone number
<a href="tel:+8801234567890">
  +880 123 456 7890
</a>

// Line 95: Location
<p className="font-medium">Dhaka, Bangladesh</p>
```

---

## 📧 Email Format

When someone submits the form, you'll receive an email with:

- **From:** Web3Forms notification
- **Reply-To:** The sender's email (click reply to respond directly)
- **Subject:** The subject they entered
- **Body:** Their name, email, and message

---

## 🔒 Security

✅ `.env` file is added to `.gitignore` (won't be committed to Git)
✅ Access key is stored securely in environment variables
✅ Spam protection enabled automatically
✅ CORS and HTTPS enabled by default

---

## 🎨 Customization Options

### Change Email Subject Format

In `ContactSection.tsx`, modify the fetch body:

```javascript
body: JSON.stringify({
  access_key: accessKey,
  subject: `New Contact: ${formData.subject}`, // Custom format
  // ... rest of the fields
}),
```

### Add More Form Fields

1. Add field to `formData` state
2. Add input in the form JSX
3. Add field to the fetch body

---

## ❓ Troubleshooting

### "Form not sending" / No emails received

1. **Check access key:** Make sure it's correct in `.env`
2. **Verify email:** Confirm your email on Web3Forms dashboard
3. **Check spam:** Look in your spam/junk folder
4. **Restart server:** Stop and restart `npm run dev`
5. **Check console:** Open browser DevTools → Console for errors

### TypeScript Errors

If you see import.meta.env errors, the types have been added to `src/vite-env.d.ts`

### Environment Variable Not Loading

- Make sure file is named exactly `.env` (not `.env.txt`)
- File must be in the **root** directory (next to package.json)
- Restart your development server after creating/editing `.env`

---

## 🌐 Alternative Services (If Needed)

If you prefer other services:

- **EmailJS** - [emailjs.com](https://www.emailjs.com)
- **Formspree** - [formspree.io](https://formspree.io)
- **Getform** - [getform.io](https://getform.io)

---

## 📞 Need Help?

- Web3Forms Docs: [docs.web3forms.com](https://docs.web3forms.com)
- Web3Forms Support: support@web3forms.com

---

## ✅ Checklist

- [ ] Created Web3Forms account
- [ ] Got access key
- [ ] Created `.env` file
- [ ] Added access key to `.env`
- [ ] Restarted development server
- [ ] Tested form submission
- [ ] Updated contact information (email, phone, WhatsApp)
- [ ] Checked email inbox (and spam folder)

---

**That's it! Your contact form is ready to receive messages.** 🎉
