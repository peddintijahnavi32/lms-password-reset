import { useState, useEffect, StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  
  // Interactive timers
  const [resendTimer, setResendTimer] = useState(45);
  const [countdownValue, setCountdownValue] = useState(3);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Tick down the Resend Link timer
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Tick down the redirect countdown when redirecting starts
  useEffect(() => {
    let interval = null;
    if (isRedirecting) {
      setCountdownValue(3);
      interval = setInterval(() => {
        setCountdownValue((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRedirecting(false);
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRedirecting]);

  const sendResetLink = () => {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }
    setMessage("Reset link sent successfully to: " + email);
  };

  const handleResend = () => {
    setResendTimer(45);
    setMessage("A new reset link has been sent!");
  };

  const resetPassword = () => {
    if (!password || !confirmPassword) {
      setMessage("Please enter both passwords.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Trigger redirect timer
    setIsRedirecting(true);
    setMessage("Password reset successfully! Redirecting...");
  };

  // Live password validation checks
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const passedRequirementsCount = Object.values(passwordRequirements).filter(Boolean).length;

  let strengthText = "Weak";
  let strengthColor = "#ef4444";
  if (passedRequirementsCount === 0) {
    strengthText = "Empty";
    strengthColor = "#cbd5e1";
  } else if (passedRequirementsCount <= 2) {
    strengthText = "Weak";
    strengthColor = "#f87171";
  } else if (passedRequirementsCount <= 4) {
    strengthText = "Medium";
    strengthColor = "#fbbf24";
  } else {
    strengthText = "Strong";
    strengthColor = "#22c55e";
  }

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #f1f3f9;
          color: #1e293b;
          min-height: 100vh;
        }

        .page {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px 60px;
        }

        /* ================= TITLE ================= */
        .main-title {
          text-align: center;
          margin-bottom: 40px;
        }

        .main-title h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
        }

        .main-title p {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 18px;
          color: #475569;
          margin: 0;
        }

        /* ================= CONTAINER ================= */
        .flow-container {
          background: #f8fafc;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 32px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* ================= STEPS ================= */
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-bottom: 32px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 24px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .step-top {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .step-number {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #4f46e5;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .step-description {
          font-size: 12px;
          color: #64748b;
          max-width: 240px;
          line-height: 1.4;
        }

        /* ================= CARDS ================= */
        .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: stretch;
        }

        .card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          min-height: 460px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .card-content {
          padding: 24px 24px 18px;
          flex-grow: 1;
        }

        /* Card 2 specific styling for full bleed landscape */
        .card-check-email {
          background: linear-gradient(180deg, #ffffff 0%, #f3f0ff 65%, #dcd6ff 100%) !important;
        }

        .card-content-check-email {
          position: relative;
          z-index: 2;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .card2-landscape-bg {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 90px;
          pointer-events: none;
          z-index: 1;
        }

        /* ================= CARD LOGO ================= */
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .logo-svg {
          width: 24px;
          height: 24px;
        }

        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        /* ================= ILLUSTRATIONS ================= */
        .illustration {
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 16px;
        }

        .illustration-svg {
          width: 100%;
          height: 100%;
          max-width: 180px;
        }

        .illustration-img {
          position: relative;
          z-index: 1;
          max-height: 100px;
          max-width: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
          transition: transform 0.3s ease;
        }

        .card:hover .illustration-img {
          transform: scale(1.05);
        }

        .illustration-glow-outer {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #f5f3ff;
          z-index: 0;
          pointer-events: none;
        }

        .illustration-glow-inner {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ede9fe;
          z-index: 0;
          pointer-events: none;
        }

        .question-badge {
          position: absolute;
          top: 0px;
          right: calc(50% - 55px);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #6366f1;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.4);
          user-select: none;
          z-index: 2;
          animation: float-badge 3s ease-in-out infinite;
        }

        @keyframes float-badge {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        /* ================= CARD TEXT ================= */
        .card h2 {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin: 0 0 6px 0;
        }

        .description {
          font-size: 13px;
          color: #64748b;
          text-align: center;
          line-height: 1.4;
          margin: 0 0 16px 0;
        }

        /* ================= FORM ELEMENTS ================= */
        .input-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #475569;
          margin-bottom: 8px;
          text-align: left;
        }

        .input-group {
          position: relative;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .input-icon svg {
          width: 18px;
          height: 18px;
        }

        .form-input {
          width: 100%;
          height: 42px;
          padding: 0 16px 0 44px;
          font-size: 14px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          background-color: #f8fafc;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          border-color: #6366f1;
          background-color: #ffffff;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .eye-toggle {
          position: absolute;
          right: 14px;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .eye-toggle:hover {
          color: #4f46e5;
        }

        .eye-toggle svg {
          width: 18px;
          height: 18px;
        }

        /* ================= BUTTONS ================= */
        .btn-primary {
          width: 100%;
          height: 42px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
          color: white;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(99, 102, 241, 0.4);
        }

        .btn-primary:active {
          transform: translateY(1px);
        }

        .btn-secondary {
          width: 100%;
          height: 42px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          background: white;
          color: #4f46e5;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #f5f3ff;
          border-color: #a5b4fc;
        }

        .btn-secondary:disabled {
          background: #f1f5f9;
          border-color: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
        }

        /* ================= DIVIDER ================= */
        .divider {
          display: flex;
          align-items: center;
          margin: 16px 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .divider span {
          padding: 0 12px;
        }

        /* ================= CARD FOOTER ================= */
        .card-footer {
          height: 50px;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #64748b;
          font-size: 12px;
          font-weight: 500;
        }

        .footer-icon {
          width: 14px;
          height: 14px;
          color: #6366f1;
        }

        /* ================= BACK NAVIGATION BUTTON ================= */
        .btn-back-nav {
          position: absolute;
          top: 24px;
          left: 24px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 5;
        }

        .btn-back-nav:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .btn-back-nav svg {
          width: 16px;
          height: 16px;
        }

        /* ================= BACK TO LOGIN LINK ================= */
        .back-to-login-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 600;
          margin-top: 18px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .back-to-login-link:hover {
          color: #4338ca;
        }

        .back-to-login-link svg {
          width: 14px;
          height: 14px;
        }

        .back-to-login-link-card2 {
          margin-top: auto !important;
          padding-bottom: 8px;
          z-index: 3;
          position: relative;
        }

        /* ================= ALERT BOX ================= */
        .alert {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          gap: 10px;
          margin-bottom: 14px;
          text-align: left;
        }

        .alert-icon {
          width: 20px;
          height: 20px;
          color: #16a34a;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .alert-content {
          font-size: 12px;
          line-height: 1.5;
          color: #14532d;
        }

        /* ================= STRENGTH METER ================= */
        .strength-bar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -10px;
          margin-bottom: 14px;
        }

        .strength-bars {
          display: flex;
          gap: 4px;
          flex-grow: 1;
          max-width: 160px;
        }

        .strength-bars .bar {
          height: 5px;
          flex-grow: 1;
          border-radius: 4px;
          background-color: #e2e8f0;
          transition: background-color 0.3s;
        }

        .strength-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* ================= REQUIREMENTS GRID ================= */
        .requirements-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 12px;
          margin-bottom: 14px;
          text-align: left;
        }

        .req-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #64748b;
          transition: color 0.2s;
        }

        .req-icon {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #16a34a;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .req-icon svg {
          width: 8px;
          height: 8px;
        }

        .req-item.valid {
          color: #16a34a;
        }

        .req-item.valid .req-icon {
          background: #dcfce7;
          color: #16a34a;
        }

        /* ================= BOTTOM NOTIFICATION CARDS ================= */
        .bottom-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }

        .bottom-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .bottom-card-icon-container {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bg-success {
          background: #dcfce7;
          color: #15803d;
        }

        .bg-redirect {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .bottom-card-icon-img {
          width: 44px;
          height: 44px;
          object-fit: contain;
          display: block;
          border-radius: 50%;
        }

        .success-check-svg {
          width: 22px;
          height: 22px;
        }

        .redirect-lock-svg {
          width: 20px;
          height: 20px;
        }

        .bottom-card-text {
          flex-grow: 1;
          text-align: left;
        }

        .bottom-card-text h4 {
          margin: 0 0 4px 0;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .bottom-card-text p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }

        .celebrate-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          margin-right: 8px;
          object-fit: contain;
        }

        .btn-circle-arrow {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .btn-circle-arrow:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .btn-circle-arrow svg {
          width: 14px;
          height: 14px;
        }

        /* ================= TIMER SVG REDIRECT ================= */
        .timer-container {
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .timer-svg {
          width: 100%;
          height: 100%;
        }

        .timer-bg {
          stroke: #e2e8f0;
        }

        .timer-progress {
          stroke: #2563eb;
          transition: stroke-dashoffset 1s linear;
        }

        .timer-number {
          position: absolute;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #2563eb;
        }

        /* ================= MESSAGE ================= */
        .toast-message {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0f172a;
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          z-index: 999;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* ================= ACTIVE STATE STYLING ================= */
        .pulse-border {
          border-color: #22c55e;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.2);
        }

        .active-redirect {
          border-color: #3b82f6;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.2);
        }

        .spin-animation {
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }

        /* ================= RESPONSIVE DESIGN ================= */
        @media (max-width: 992px) {
          .cards {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .bottom-section {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .steps {
            display: none; /* Hide steps on tablet/mobile as in screenshot spec */
          }
        }

        @media (max-width: 576px) {
          .page {
            padding: 24px 16px;
          }
          .flow-container {
            padding: 20px;
            border-radius: 16px;
          }
          .card-content {
            padding: 24px 16px;
          }
          .requirements-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ================= TITLE ================= */}
      <div className="main-title">
        <h1>LMS Forgot Password & Password Reset Flow</h1>
        <p>Forgot password, reset link and create new password screens</p>
      </div>

      <div className="flow-container">
        {/* ================= STEPS ================= */}
        <div className="steps">
          <div className="step">
            <div className="step-top">
              <span className="step-number">1</span>
              Forgot Password
            </div>
            <div className="step-description">
              Enter your email to receive a reset link
            </div>
          </div>

          <div className="step">
            <div className="step-top">
              <span className="step-number">2</span>
              Reset Link Sent
            </div>
            <div className="step-description">
              Check your email for the reset link
            </div>
          </div>

          <div className="step">
            <div className="step-top">
              <span className="step-number">3</span>
              Create New Password
            </div>
            <div className="step-description">
              Set a new password for your account
            </div>
          </div>
        </div>

        {/* ================= THREE CARDS ================= */}
        <div className="cards">
          
          {/* CARD 1: Forgot Password */}
          <div className="card">
            <div className="card-content">
              
              <div className="logo">
                <svg className="logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3H8C10.2091 3 12 4.79086 12 7V21C9 18 5 18 2 18V3Z" fill="url(#logo-grad-1)"/>
                  <path d="M22 3H16C13.7909 3 12 4.79086 12 7V21C15 18 19 18 22 18V3Z" fill="url(#logo-grad-2)"/>
                  <defs>
                    <linearGradient id="logo-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id="logo-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="logo-text">LMS</span>
              </div>

              <div className="illustration">
                <div className="illustration-glow-outer"></div>
                <div className="illustration-glow-inner"></div>
                <img className="illustration-img" src="/lock-icon.png" alt="Forgot Password Lock" />
                <div className="question-badge">?</div>
              </div>

              <h2>Forgot Password?</h2>
              <p className="description">
                No worries! Enter your registered email address and we'll send you a password reset link.
              </p>

              <label className="input-label">Email Address</label>
              <div className="input-group">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  className="form-input"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button className="btn-primary" onClick={sendResetLink}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                Send Reset Link
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <button className="btn-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "16px", height: "16px" }}>
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Login
              </button>

            </div>
            <div className="card-footer">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              We take your security seriously
            </div>
          </div>

          {/* CARD 2: Check Your Email with Full-Bleed Landscape */}
          <div className="card card-check-email">
            <div className="card-content card-content-check-email">
              
              <div className="illustration">
                <div className="illustration-glow-outer" style={{ background: "#f3f0ff" }}></div>
                <img className="illustration-img" src="/envelope-icon.png" alt="Check Your Email" />
              </div>

              <h2>Check Your Email</h2>
              <p className="description">
                We've sent a password reset link to your email address.
              </p>

              <div className="alert">
                <svg className="alert-icon" viewBox="0 0 24 24" fill="none" style={{ width: "20px", height: "20px" }}>
                  <circle cx="12" cy="12" r="10" fill="#22c55e" />
                  <text x="12" y="16" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">i</text>
                </svg>
                <div className="alert-content">
                  <strong>The reset link will expire in 30 minutes</strong> for security reasons.
                </div>
              </div>

              <button className="btn-primary">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                Open Email
              </button>

              <button
                className="btn-secondary"
                style={{ marginTop: "12px" }}
                onClick={handleResend}
                disabled={resendTimer > 0}
              >
                <svg className={resendTimer > 0 ? "spin-animation" : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "16px", height: "16px" }}>
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                {resendTimer > 0 ? `Resend Link (00:${resendTimer.toString().padStart(2, '0')})` : "Resend Link"}
              </button>

              <div className="back-to-login-link back-to-login-link-card2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Login
              </div>

            </div>

            {/* Custom Landscape Background Graphic covering the bottom */}
            <div className="card2-landscape-bg">
              <svg viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
                <path d="M-20 120V75C30 55 70 80 120 65C170 50 210 75 260 60C310 45 330 55 350 65V120H-20Z" fill="#ede9fe" opacity="0.6"/>
                <path d="M-20 120V90C40 70 90 90 140 75C190 60 240 80 295 65C320 58 335 65 350 70V120H-20Z" fill="#e0dbff" opacity="0.8"/>
                <path d="M-20 120V100C30 90 60 105 110 90C160 75 200 90 250 80C300 70 320 80 350 85V120H-20Z" fill="#cbbfff" />
                
                {/* Left foliage */}
                <g transform="translate(10, 65)">
                  <path d="M10 50C12 35 5 25 -2 20C-5 25 -3 35 10 50Z" fill="#818cf8" opacity="0.7"/>
                  <path d="M22 50C25 30 15 20 7 15C2 22 9 35 22 50Z" fill="#6366f1" opacity="0.5"/>
                  <path d="M35 50C37 25 25 15 15 10C10 18 20 35 35 50Z" fill="#a855f7" opacity="0.4"/>
                </g>
                
                {/* Right foliage */}
                <g transform="translate(255, 60)">
                  <path d="M10 55C5 40 15 30 25 25C28 30 22 43 10 55Z" fill="#818cf8" opacity="0.6"/>
                  <path d="M22 55C15 37 25 27 35 20C39 27 32 43 22 55Z" fill="#6366f1" opacity="0.4"/>
                </g>

                {/* Mailbox */}
                <g transform="translate(272, 60)">
                  <rect x="18" y="22" width="4" height="20" fill="#94a3b8" />
                  <path d="M5 12C5 5.37 10.37 0 17 0H35V26H17C10.37 26 5 20.63 5 12Z" fill="#6366f1" />
                  <path d="M9 12C9 7.58 12.58 4 17 4H31V22H17C12.58 22 9 18.42 9 12Z" fill="#4f46e5" />
                  <rect x="28" y="10" width="10" height="4" fill="#ef4444" transform="rotate(-60 28 10)" />
                  <circle cx="34" cy="2" r="2" fill="#ef4444" />
                  <path d="M5 12V26H0V12H5Z" fill="#2d1f85" />
                  <rect x="-4" y="16" width="10" height="7" rx="1" fill="#ffffff" transform="rotate(-15 -4 16)" />
                </g>
              </svg>
            </div>
          </div>

          {/* CARD 3: Create New Password */}
          <div className="card">
            <button className="btn-back-nav">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            <div className="card-content">
              
              <div className="illustration">
                <div className="illustration-glow-outer"></div>
                <div className="illustration-glow-inner"></div>
                <img className="illustration-img" src="/shield-icon.png" alt="Create New Password" />
              </div>

              <h2>Create New Password</h2>
              <p className="description">
                Create a strong password to secure your account.
              </p>

              <label className="input-label">New Password</label>
              <div className="input-group">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </span>
              </div>

              <div className="strength-bar-container">
                <div className="strength-bars">
                  <span className="bar" style={{ backgroundColor: passedRequirementsCount >= 1 ? strengthColor : "#e2e8f0" }}></span>
                  <span className="bar" style={{ backgroundColor: passedRequirementsCount >= 3 ? strengthColor : "#e2e8f0" }}></span>
                  <span className="bar" style={{ backgroundColor: passedRequirementsCount >= 5 ? strengthColor : "#e2e8f0" }}></span>
                </div>
                <span className="strength-label" style={{ color: strengthColor }}>{strengthText}</span>
              </div>

              <label className="input-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  className="form-input"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="eye-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </span>
              </div>

              <div className="requirements-grid">
                <div className={`req-item ${passwordRequirements.minLength ? "valid" : ""}`}>
                  <span className="req-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  Minimum 8 characters
                </div>
                <div className={`req-item ${passwordRequirements.hasNumber ? "valid" : ""}`}>
                  <span className="req-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  At least one number
                </div>
                <div className={`req-item ${passwordRequirements.hasUpper ? "valid" : ""}`}>
                  <span className="req-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  At least one uppercase letter
                </div>
                <div className={`req-item ${passwordRequirements.hasSpecial ? "valid" : ""}`}>
                  <span className="req-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  At least one special character
                </div>
                <div className={`req-item ${passwordRequirements.hasLower ? "valid" : ""}`}>
                  <span className="req-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  At least one lowercase letter
                </div>
              </div>

              <button className="btn-primary" onClick={resetPassword}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                Reset Password
              </button>

            </div>
            <div className="card-footer">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Your security is our priority
            </div>
          </div>

        </div>

        {/* ================= BOTTOM CARDS ================= */}
        <div className="bottom-section">
          
          {/* Success Box */}
          <div className={`bottom-card success-card ${isRedirecting ? "pulse-border" : ""}`}>
            <div className="bottom-card-icon-container bg-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="success-check-svg">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="bottom-card-text">
              <h4>Password Reset Successful!</h4>
              <p>
                Your password has been updated successfully.
                <br />
                You can now log in using your new password.
              </p>
            </div>
            <img
              className="celebrate-icon"
              src="/celebration-icon.png"
              alt="Celebration"
            />
            <button className="btn-circle-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Redirect Timer Box */}
          <div className={`bottom-card redirect-card ${isRedirecting ? "active-redirect" : ""}`}>
            <div className="bottom-card-icon-container">
              <img
                className="bottom-card-icon-img"
                src="/lock-icon.png"
                alt="Locked"
              />
            </div>
            <div className="bottom-card-text">
              <h4>Redirecting to Login...</h4>
              <p>
                You will be redirected to the login page
                <br />
                in a few seconds.
              </p>
            </div>
            
            <div className="timer-container">
              <svg className="timer-svg" viewBox="0 0 36 36">
                <path
                  className="timer-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3.5"
                />
                <path
                  className="timer-progress"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeDasharray="100, 100"
                  strokeDashoffset={100 - (countdownValue / 3) * 100}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="timer-number">{countdownValue}</div>
            </div>
          </div>

        </div>

        {/* ================= TOAST MESSAGE ================= */}
        {message && (
          <div className="toast-message" style={{ display: message ? "block" : "none" }}>
            {message}
          </div>
        )}

      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

export default App;