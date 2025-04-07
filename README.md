# Mystery Messages - Anonymous Feedback App

<!-- ![Mystery Messages Logo](https://via.placeholder.com/150x50?text=Mystery+Messages)  -->

A complete anonymous messaging platform built entirely with Next.js, featuring built-in API routes for backend functionality. Send and receive anonymous feedback securely without revealing your identity.

<div align="center" style="margin: 40px 0;">
  <a href="https://mystery-message-snowy-one.vercel.app/" target="_blank">
    <img width="70%" src="/public/demoScreenshot.png" alt="Demo screenshot">
  </a>
  <br><br>
  <a href="https://mystery-message-snowy-one.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Try_Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white&labelColor=000" alt="Live Demo">
  </a>
</div>

## Features

- 🔒 **100% Anonymous Messaging**: Send messages without any sender identification
- ✉️ **Email Verification**: Secure sign-up process with OTP verification
- 📬 **Message Inbox**: Organized view of all received messages
- ⚙️ **Privacy Toggle**: Enable/disable message receiving anytime
- 📱 **Mobile-Optimized**: Responsive design for all devices
- 🔄 **Session Management**: Automatic logout after inactivity

## Tech Stack

### Full-stack Next.js Implementation

- **Next.js 14** (App Router)
- **React** + TypeScript
- **NextAuth.js** (Authentication)
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **Shadcn/ui** (Beautiful UI Components)
- **MUI** (Material UI Components)
- **Tailwind CSS** (Utility-first styling)
- **React Hook Form** + **Zod** (Form validation)
- **Bcrypt.js** (Password hashing)
- **Nodemailer** (Email services)

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance
- SMTP email service (SendGrid, Resend, etc.)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/Kuldeep-Rathod/Mystery-Message.git
    cd mystery-messages
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**
   Create `.env` file in root directory:

    ```env
    MONGODB_URI=mongodb://localhost:27017/
    NEXTAUTH_SECRET=your-strong-secret-key-here
    NEXTAUTH_URL=http://localhost:3000
    SMTP_HOST=your.smtp.server
    SMTP_PORT=587
    SMTP_USER=your@email.com
    SMTP_PASS=your-email-password
    FROM_EMAIL=no-reply@yourdomain.com
    ```

4. **Run the development server**

    ```bash
    npm run dev
    ```

5. **Access the app**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
mystery-message/
├── public/               # Static files (images, fonts, etc.)
│
├── src/                  # Main application code
│   ├── app/              # Next.js App Router
│   │   ├── (app)/        # Protected routes wrapper
│   │   ├── (auth)/       # Authentication routes wrapper
│   │   ├── api/          # API route handlers
│   │   └── u/[username]/ # Dynamic user message pages
│   │
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── lib/              # Utility/helper functions
│   ├── models/           # Database models (Mongoose)
│   ├── schemas/          # Zod validation schemas
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Email templates and utilities
│   └── middleware.ts     # Next.js middleware
│
└── .env                  # Environment variables
```

## Usage Guide

### For Message Senders

1. Find a user's profile (e.g., `mystery-message.com/u/username`)
2. Type your secret message
3. Click "Send Anonymously"
4. The recipient will never know it was you!

### For Message Receivers

1. Register and verify your email
2. Share your unique link (`/u/yourusername`)
3. Manage messages in your private dashboard
4. Control who can message you in settings

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Create a new project in Vercel
3. Add all environment variables
4. Deploy!

### Environment Variables Needed in Production:

```env
MONGODB_URI=your_production_mongo_uri
NEXTAUTH_SECRET=your_production_secret
SMTP_CREDENTIALS=your_production_email_creds
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

For questions or feedback:

- Kuldeep Rathod - kuldiprathod375@gmail.com
- Project Link: [https://github.com/Kuldeep-Rathod/Mystery-Message](https://github.com/Kuldeep-Rathod/Mystery-Message)
