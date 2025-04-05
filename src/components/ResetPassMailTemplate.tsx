import * as React from 'react';

interface PasswordResetEmailProps {
    username: string;
    resetLink: string;
    expiryTime?: string; // e.g., "24 hours"
}

export const PasswordResetEmailTemplate = ({
    username,
    resetLink,
    expiryTime = '24 hours',
}: PasswordResetEmailProps) => {
    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Password Reset Request</h1>
                </div>

                <div style={contentStyle}>
                    <p style={greetingStyle}>Hello, {username}</p>
                    <p style={textStyle}>
                        We received a request to reset your password. Click the
                        button below to choose a new password:
                    </p>

                    <div style={buttonContainerStyle}>
                        <a
                            href={resetLink}
                            style={buttonStyle}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Reset Password
                        </a>
                    </div>

                    <p style={textStyle}>
                        This link will expire in {expiryTime}. If you
                        didn&apos;t request a password reset, you can safely
                        ignore this email.
                    </p>

                    <p style={textStyle}>
                        <strong>Security Tip:</strong> Never share your password
                        or this link with anyone.
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

// Reuse your existing styles where applicable
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
    backgroundColor: '#dc2626', // Different color for password reset
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

const buttonContainerStyle: React.CSSProperties = {
    margin: '30px 0',
    textAlign: 'center',
};

const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
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
