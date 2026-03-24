import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="page auth-wrapper">
            <div className="bg-layer"></div>
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="card">
                {children}
            </div>
        </div>
    );
};
