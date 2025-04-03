import * as React from 'react';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export const VerificationEmailTemplate = ({
    username,
    otp,
}: VerificationEmailProps) => {
    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Verify Your Account</h1>
                </div>

                <div style={contentStyle}>
                    <p style={greetingStyle}>Hello, {username}</p>
                    <p style={textStyle}>
                        Thank you for registering with us. Please use the
                        following verification code to complete your account
                        setup:
                    </p>

                    <div style={otpContainerStyle}>
                        <span
                            style={otpStyle}
                            title='OTP'
                        >
                            {otp}
                        </span>
                    </div>

                    <p style={textStyle}>
                        This code will expire in 10 minutes.
                    </p>
                    <p style={textStyle}>
                        If you didn&apos;t request this code, please ignore this
                        email.
                    </p>
                </div>

                <div style={footerStyle}>
                    <p style={footerTextStyle}>
                        © {new Date().getFullYear()} Your Company Name. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Updated Styles
const containerStyle: React.CSSProperties = {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: "'Arial', sans-serif",
    lineHeight: '1.6',
};

const cardStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const headerStyle: React.CSSProperties = {
    backgroundColor: '#2563eb',
    padding: '20px',
    textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
    color: '#ffffff',
    margin: '0',
    fontSize: '24px',
    fontWeight: '600',
};

const contentStyle: React.CSSProperties = {
    padding: '30px',
};

const greetingStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333333',
};

const textStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#555555',
    marginBottom: '20px',
};

const otpContainerStyle: React.CSSProperties = {
    margin: '30px 0',
    textAlign: 'center',
};

const otpStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '15px 30px',
    backgroundColor: '#f0f7ff',
    color: '#2563eb',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '2px',
    borderRadius: '6px',
    border: '1px dashed #2563eb',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
};

const footerStyle: React.CSSProperties = {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    textAlign: 'center',
    borderTop: '1px solid #eeeeee',
};

const footerTextStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#999999',
    margin: '0',
};
