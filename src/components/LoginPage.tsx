import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  BarChart3, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  KeyRound, 
  ArrowRight,
  ShieldAlert,
  Clock,
  ExternalLink
} from 'lucide-react';
import { PortalRole, UserSession } from '../types';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  onNavigateToPortal: (role: PortalRole) => void;
  defaultRole?: 'student' | 'employer' | 'admin';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToPortal,
  defaultRole
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'employer' | 'admin'>(defaultRole || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(true);

  // Two-stage login flow: 'form' (credentials) -> 'otp' (dedicated verification page).
  // The actual /api/login request is NEVER fired until stage 2 succeeds.
  const [authStage, setAuthStage] = useState<'form' | 'otp'>('form');
  const [pendingPayload, setPendingPayload] = useState<{
    email: string;
    password: string;
    phone: string;
    portalRole: 'student' | 'employer' | 'admin';
    name?: string;
    isSignUp: boolean;
  } | null>(null);

  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpInfo, setOtpInfo] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0);
  
  // Sign Up Specific Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [course, setCourse] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);

  // Loading & Error States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Rate Limiter Telemetry
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remaining: number;
    limit: number;
    retryAfterDate: Date | null;
    isBlocked: boolean;
    ip?: string;
  }>({
    remaining: 5,
    limit: 5,
    retryAfterDate: null,
    isBlocked: false
  });

  // Fetch initial rate limit status
  const fetchRateLimitStatus = async () => {
    try {
      const res = await fetch('/api/login/rate-limit-status');
      if (res.ok) {
        const data = await res.json();
        const retryAfterDate = data.retryAfterSeconds > 0 
          ? new Date(Date.now() + data.retryAfterSeconds * 1000) 
          : null;
        setRateLimitInfo({
          remaining: data.remaining,
          limit: data.limit,
          retryAfterDate,
          isBlocked: !data.allowed,
          ip: data.ip
        });
      }
    } catch (err) {
      console.warn('Failed to fetch rate limit status:', err);
    }
  };

  useEffect(() => {
    fetchRateLimitStatus();
  }, []);

  // Countdown for the OTP "Resend" cooldown + the OTP's own expiry window
  useEffect(() => {
    if (otpResendCooldown <= 0 && otpSecondsLeft <= 0) return;
    const timer = setInterval(() => {
      setOtpResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      setOtpSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpResendCooldown, otpSecondsLeft]);

  // The OTP screen is treated as its own page: pressing the browser Back
  // button while on it returns the user to the credentials form instead of
  // leaving the app.
  useEffect(() => {
    const handlePopState = () => {
      setAuthStage('form');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmailFormat = (value: string) => EMAIL_REGEX.test(value.trim().toLowerCase());
  const isValidPhoneFormat = (value: string) => {
    const normalized = (value || '').replace(/[\s\-()]/g, '');
    return /^(\+91|91)?[6-9]\d{9}$/.test(normalized) || /^\+[1-9]\d{7,14}$/.test(normalized);
  };

  // Helper to split phone into country code and body
  const parsePhone = (rawPhone: string) => {
    const trimmed = (rawPhone || '').trim();
    if (trimmed.startsWith('+91')) {
      return { code: '+91', body: trimmed.substring(3).trim() };
    } else if (trimmed.startsWith('+1')) {
      return { code: '+1', body: trimmed.substring(2).trim() };
    } else if (trimmed.startsWith('+44')) {
      return { code: '+44', body: trimmed.substring(3).trim() };
    }
    // Default fallback: if it doesn't match a known country code, guess by space
    const spaceIndex = trimmed.indexOf(' ');
    if (trimmed.startsWith('+') && spaceIndex > 0) {
      return { code: trimmed.substring(0, spaceIndex), body: trimmed.substring(spaceIndex + 1) };
    }
    return { code: '+91', body: trimmed }; // default to +91
  };

  const { code: currentCode, body: currentBody } = parsePhone(phone);

  const handlePhoneBodyChange = (value: string) => {
    // Only allow digits up to 10
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setPhone(`${currentCode} ${digits}`);
  };

  const handleCountryCodeChange = (newCode: string) => {
    setPhone(`${newCode} ${currentBody}`);
  };

  // Sends (or re-sends) an OTP for a given phone number. Returns whether it succeeded.
  const dispatchOtp = async (phoneNumber: string): Promise<boolean> => {
    setOtpError(null);
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      });
      const data = await res.json();
      if (res.ok && data.smsSent) {
        setOtpResendCooldown(30);
        setOtpSecondsLeft(data.expiresInSeconds || 300);
        setOtpInfo('A 6-digit verification code has been sent to your mobile number.');
        return true;
      }
      // Show the error on the MAIN FORM (not just the hidden OTP screen)
      const errMsg = data.error || (res.ok ? 'SMS could not be delivered. Please check your phone number.' : 'Could not send OTP. Please try again.');
      setOtpError(errMsg);
      setErrorMessage(errMsg);
      return false;
    } catch (err) {
      const errMsg = 'Network error while sending OTP. Please check your connection and try again.';
      setOtpError(errMsg);
      setErrorMessage(errMsg);
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 1 -> Step 2: validate the credentials form, then move to the
  // dedicated OTP page and send the code. The login request itself is not
  // made here - it only fires after the OTP is verified.
  const goToOtpStep = async () => {
    const payload = {
      email,
      password,
      phone,
      portalRole: selectedRole,
      name: isSignUp ? (selectedRole === 'employer' ? companyName : name) : undefined,
      isSignUp
    };
    setOtp('');
    setOtpInfo(null);
    setOtpError(null);
    setErrorMessage(null);   // Clear any stale form-level errors before starting
    const sent = await dispatchOtp(phone);
    if (sent) {
      setPendingPayload(payload);
      setAuthStage('otp');
      // Give the OTP step a real URL/history entry so it behaves like its
      // own page (Back button returns to the form instead of leaving the app).
      window.history.pushState({ page: 'verify-otp' }, '', '#/verify-otp');
    }
  };

  const handleBackToForm = () => {
    setAuthStage('form');
    setOtp('');
    setOtpError(null);
    setOtpInfo(null);
    setPendingPayload(null);
    if (window.location.hash === '#/verify-otp') {
      window.history.back();
    }
  };

  const handleResendOtp = async () => {
    if (!pendingPayload || otpResendCooldown > 0) return;
    setOtp('');
    await dispatchOtp(pendingPayload.phone);
  };

  // Step 2: verify the OTP, and ONLY on success actually execute the login
  // request. Until this returns true, no /api/login call is ever made.
  const handleVerifyOtpAndLogin = async () => {
    if (!pendingPayload) return;
    if (!otp || otp.trim().length !== 6) {
      setOtpError('Enter the 6-digit code sent to your phone.');
      return;
    }

    setOtpError(null);
    setIsVerifyingOtp(true);
    try {
      const verifyRes = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: pendingPayload.phone, otp: otp.trim() })
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.verified) {
        setOtpError(verifyData.error || 'Incorrect OTP. Please try again.');
        setIsVerifyingOtp(false);
        return;
      }

      // OTP confirmed correct - now, and only now, execute the login request.
      const loginRes = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingPayload)
      });
      const loginData = await loginRes.json();

      if (loginRes.status === 429) {
        setErrorMessage(loginData.message || 'HTTP 429: Too Many Requests. Rate limit triggered.');
        setRateLimitInfo({
          remaining: 0,
          limit: loginData.limit || 5,
          retryAfterDate: new Date(Date.now() + (loginData.retryAfter || 60) * 1000),
          isBlocked: true,
          ip: loginData.ip
        });
        setAuthStage('form');
        window.history.replaceState({}, '', window.location.pathname + window.location.search);
      } else if (loginRes.ok) {
        setSuccessMessage(loginData.message || 'Logged in successfully!');
        fetchRateLimitStatus();
        window.history.replaceState({}, '', window.location.pathname + window.location.search);
        if (loginData.user) {
          setTimeout(() => {
            onLoginSuccess({
              id: loginData.user.id,
              name: loginData.user.name,
              email: loginData.user.email,
              role: loginData.user.role,
              token: loginData.user.token,
              loginTime: loginData.user.loginTime
            });
            onNavigateToPortal(selectedRole as PortalRole);
          }, 800);
        }
      } else {
        // Credential-level failure (wrong password, etc.) - send the user
        // back to the form with the reason shown there.
        setErrorMessage(loginData.error || 'Login failed. Please check your credentials.');
        setAuthStage('form');
        window.history.replaceState({}, '', window.location.pathname + window.location.search);
        fetchRateLimitStatus();
      }
    } catch (err) {
      setOtpError('Network error. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (rateLimitInfo.isBlocked && rateLimitInfo.retryAfterDate) {
      timer = setInterval(() => {
        if (Date.now() >= rateLimitInfo.retryAfterDate!.getTime()) {
          setRateLimitInfo(prev => ({
            ...prev,
            retryAfterDate: null,
            isBlocked: false,
            remaining: prev.limit
          }));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitInfo.isBlocked, rateLimitInfo.retryAfterDate]);

  // Role Auto-fill Helper
  const handleRoleSelect = (role: 'student' | 'employer' | 'admin') => {
    setSelectedRole(role);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (role === 'admin') {
      setIsSignUp(false);
    }

    // Switching roles/identity means any prior OTP step no longer applies.
    setAuthStage('form');
    setPendingPayload(null);
    setOtp('');
    setOtpInfo(null);
    setOtpError(null);

    // These are just convenience placeholders to speed up filling the demo
    // form - they are not real credentials. Student/employer accounts are
    // created on first "Create New Account" (sign up) and must sign in with
    // the same password afterwards. Admin credentials are never bundled in
    // the client; they must be typed in and match ADMIN_EMAIL/ADMIN_PASSWORD
    // configured on the server.
    if (role === 'student') {
      setEmail('ananya.sharma@du.ac.in');
      setPassword('');
      setPhone('+91 98765 43210');
    } else if (role === 'employer') {
      setEmail('recruiter@techmahindra.com');
      setPassword('');
      setPhone('+91 91234 56789');
    } else if (role === 'admin') {
      setEmail('');
      setPassword('');
      setPhone('+91 90000 00000');
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Vercel serverless functions cap request bodies at 4.5MB. Base64 adds
  // ~33% overhead, so we stay safely under that on the original file size
  // and fail with a clear message instead of a raw network/413 error.
  const MAX_RESUME_FILE_BYTES = 3 * 1024 * 1024; // 3MB

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_RESUME_FILE_BYTES) {
      setErrorMessage('That resume is too large (max 3MB). Please upload a smaller PDF, or fill in your details manually.');
      e.target.value = '';
      return;
    }

    setIsParsingResume(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const base64 = await convertFileToBase64(file);
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileData: base64, mimeType: file.type })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.name) setName(data.name);
        if (data.phone) setPhone(data.phone);
        if (data.institution) setInstitution(data.institution);
        if (data.course) setCourse(data.course);
        if (data.strengths) setStrengths(data.strengths);
        if (data.weaknesses) setWeaknesses(data.weaknesses);
        setSuccessMessage('Resume parsed successfully! Please review the extracted details.');
      } else {
        throw new Error('Failed to parse resume');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not parse resume automatically. Please enter details manually.');
    } finally {
      setIsParsingResume(false);
    }
  };

  // Login handler with Rate Limiter backend call
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaChecked) {
      setErrorMessage('Please complete the security CAPTCHA verification check.');
      return;
    }
    if (!isValidEmailFormat(email)) {
      setErrorMessage('Please enter a genuine, valid email address.');
      return;
    }
    if (!isValidPhoneFormat(phone)) {
      setErrorMessage('Please enter a valid mobile number.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    // This only sends an OTP and moves to the verification page - the actual
    // /api/login request does not fire until handleVerifyOtpAndLogin succeeds.
    await goToOtpStep();
    setIsSubmitting(false);
  };

  // Simulate Brute Force / 5x Rapid Logins to trigger Rate Limiter
  const handleSimulateBruteForce = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    let triggered429 = false;

    for (let i = 0; i < 6; i++) {
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `test_brute_${i}@test.com`,
            password: 'wrongpassword',
            portalRole: selectedRole
          })
        });

        const data = await res.json();
        if (res.status === 429) {
          triggered429 = true;
          setRateLimitInfo({
            remaining: 0,
            limit: data.limit || 5,
            retryAfterDate: new Date(Date.now() + (data.retryAfter || 60) * 1000),
            isBlocked: true,
            ip: data.ip
          });
          setErrorMessage(`🛑 HTTP 429 Triggered! Brute-force security active: ${data.message}`);
          break;
        }
      } catch (err) {
        console.error('Brute force simulation request failed:', err);
      }
    }

    if (!triggered429) {
      fetchRateLimitStatus();
    }
    setIsSubmitting(false);
  };

  // Reset Rate Limit Cache
  const handleResetRateLimit = async () => {
    try {
      const res = await fetch('/api/login/reset-rate-limit', { method: 'POST' });
      if (res.ok) {
        setErrorMessage(null);
        setSuccessMessage('Rate limiter IP cache reset successfully!');
        fetchRateLimitStatus();
      }
    } catch (err) {
      console.warn('Failed to reset rate limit:', err);
    }
  };

  if (authStage === 'otp' && pendingPayload) {
    const maskedPhone = pendingPayload.phone.replace(/(\+?\d{2,3})?.*(\d{4})$/, (_m, prefix, last4) =>
      `${prefix ? prefix + ' ' : ''}•••• ${last4}`
    );
    const minutesLeft = Math.floor(otpSecondsLeft / 60);
    const secondsLeft = otpSecondsLeft % 60;

    return (
      <div className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4 animate-in fade-in duration-300">
        <div className="absolute inset-0 z-0 bg-blue-50/50" />
        <div className="relative z-10 w-full max-w-md">
          <button
            type="button"
            onClick={handleBackToForm}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            Back to login details
          </button>

          <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-3xl border border-gray-300 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 border border-gray-200 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7 text-green-600" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Verify Your Mobile Number</h2>
            <p className="text-sm text-gray-600 mb-1">
              We've sent a 6-digit verification code via SMS to
            </p>
            <p className="text-sm font-bold text-gray-900 mb-8 font-mono tracking-wide">{maskedPhone}</p>

            {otpInfo && (
              <div className="p-3 rounded-2xl mb-6 bg-green-50 border border-green-200 text-green-800 text-xs flex items-start gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{otpInfo}</span>
              </div>
            )}
            {otpError && (
              <div className="p-3 rounded-2xl mb-6 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{otpError}</span>
              </div>
            )}

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • • • •"
              disabled={isVerifyingOtp}
              className="w-full text-center bg-white border border-gray-300 rounded-2xl px-4 py-4 text-2xl text-gray-900 tracking-[0.6em] placeholder:tracking-normal placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 mb-3"
            />

            {otpSecondsLeft > 0 && (
              <p className="text-[11px] text-gray-500 mb-6 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Code expires in {minutesLeft}:{secondsLeft.toString().padStart(2, '0')}
              </p>
            )}

            <button
              type="button"
              onClick={handleVerifyOtpAndLogin}
              disabled={isVerifyingOtp || otp.length !== 6}
              className="group w-full py-3.5 rounded-2xl bg-[#005E93] text-white hover:bg-[#004A75] font-extrabold text-sm hover:bg-neutral-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isVerifyingOtp ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying & Logging In...</span>
                </>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isSendingOtp || otpResendCooldown > 0}
              className="text-xs font-semibold text-sky-400 hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-not-allowed"
            >
              {isSendingOtp
                ? 'Resending...'
                : otpResendCooldown > 0
                ? `Resend code in ${otpResendCooldown}s`
                : "Didn't get it? Resend code"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="absolute inset-0 z-0 bg-blue-50/50" />

      {/* Government Banner Image */}
      <div className="relative z-10 mb-8 animate-in fade-in duration-500">
        <img
          src="/assets/login_banner.png"
          alt="PM Internship Scheme - Ministry of Corporate Affairs, Government of India"
          className="w-full max-h-36 object-cover rounded-xl shadow-md border border-gray-200"
        />
      </div>

      {/* Header Banner */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-100 border border-green-300 text-green-800 text-xs font-semibold mb-4">
          <ShieldCheck className="w-4 h-4 text-green-600 animate-pulse" />
          <span>Official Portal — Ministry of Corporate Affairs</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">
          PM Internship Scheme Login
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Secure portal access for Candidates, Employer Companies, and System Administrators. All sessions are protected and monitored.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Role Selector + Illustration */}
        <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-left-2 duration-500 [animation-delay:100ms] [animation-fill-mode:backwards]">

          {/* Hero Illustration */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
            <img
              src="/assets/login_hero.png"
              alt="Students and professionals benefiting from PM Internship Scheme"
              className="w-full h-52 object-cover"
            />
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-orange-50 border-t border-gray-200 flex items-center gap-2">
              <span className="text-lg">🇮🇳</span>
              <div>
                <p className="text-xs font-bold text-blue-900">Prime Minister's Internship Scheme</p>
                <p className="text-[10px] text-gray-600">Empowering Youth · Building New India</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-3xl space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-gray-600">
              Select Portal Login Type
            </h3>

            <div className="space-y-3">
              {/* Student Role */}
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 ${
                  selectedRole === 'student'
                    ? 'bg-blue-50 border-blue-200 text-blue-900 ring-1 ring-blue-300 shadow-sm'
                    : 'bg-white border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${selectedRole === 'student' ? 'bg-sky-500/20 text-sky-400' : 'bg-white/10 text-gray-600'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center justify-between">
                    <span>Student / Candidate</span>
                    {selectedRole === 'student' && <span className="text-[10px] bg-sky-400/20 text-sky-300 px-2 py-0.5 rounded-full font-mono">Active</span>}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Apply for 1,200+ scheme roles, view AI Match scores & track stipend status.
                  </p>
                </div>
              </button>

              {/* Employer Role */}
              <button
                type="button"
                onClick={() => handleRoleSelect('employer')}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 ${
                  selectedRole === 'employer'
                    ? 'bg-green-50 border-green-200 text-green-900 ring-1 ring-green-300 shadow-sm'
                    : 'bg-white border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${selectedRole === 'employer' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-gray-600'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center justify-between">
                    <span>Company / Partner Employer</span>
                    {selectedRole === 'employer' && <span className="text-[10px] bg-purple-400/20 text-purple-300 px-2 py-0.5 rounded-full font-mono">Active</span>}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Post internship listings, evaluate candidate SOPs & issue offer letters.
                  </p>
                </div>
              </button>

              {/* Admin Role */}
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 ${
                  selectedRole === 'admin'
                    ? 'bg-orange-50 border-orange-200 text-orange-900 ring-1 ring-orange-300 shadow-sm'
                    : 'bg-white border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${selectedRole === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-gray-600'}`}>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold flex items-center justify-between">
                    <span>System Administrator</span>
                    {selectedRole === 'admin' && <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">Active</span>}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    System oversight, state quota distribution & batch verification audits.
                  </p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Dedicated Login Form */}
        <div className="lg:col-span-7 animate-in fade-in slide-in-from-bottom-6 duration-500 [animation-delay:180ms] [animation-fill-mode:backwards]">
          <div className="bg-white border border-gray-200 shadow-sm p-6 sm:p-8 rounded-3xl border border-gray-300 relative">
            
            {/* Role Header Indicator */}
            <div key={`${selectedRole}-${isSignUp}`} className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 capitalize">
                  {isSignUp ? 'Create New Account' : (
                    <>
                      {selectedRole === 'student' && '🎓 Student Candidate Login'}
                      {selectedRole === 'employer' && '🏢 Employer / Partner Login'}
                      {selectedRole === 'admin' && '🏛️ Portal System Admin Login'}
                    </>
                  )}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {isSignUp ? 'Sign up to get started.' : 'Enter registered credentials to authenticate into the scheme dashboard.'}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-gray-200 transition-transform hover:scale-110">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
            </div>

            {/* Error / Rate Limit Alert Box */}
            {errorMessage && (
              <div className={`p-4 rounded-2xl mb-6 text-xs flex items-start gap-3 border animate-in fade-in duration-200 ${
                rateLimitInfo.isBlocked 
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-orange-50 border-orange-200 text-orange-800'
              }`}>
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-sm">
                    {rateLimitInfo.isBlocked ? 'HTTP 429: Security Rate Limiter Active' : 'Authentication Alert'}
                  </div>
                  <div>{errorMessage}</div>
                  {rateLimitInfo.isBlocked && rateLimitInfo.retryAfterDate && (
                    <div className="mt-2 font-mono text-xs text-red-300 font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Security Cooldown Active: Log in after {rateLimitInfo.retryAfterDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div className="p-4 rounded-2xl mb-6 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-3 animate-in fade-in zoom-in duration-300 shimmer-sweep">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div className="font-semibold">{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      disabled={rateLimitInfo.isBlocked}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                    />
                  </div>
                  {selectedRole === 'student' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Upload Resume (PDF) - AI Auto-Fill</label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          disabled={rateLimitInfo.isBlocked || isParsingResume}
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                        />
                        {isParsingResume && <p className="text-xs text-sky-400 mt-1">Extracting details with AI...</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Institution</label>
                        <input
                          type="text"
                          required
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="University Name"
                          disabled={rateLimitInfo.isBlocked}
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Course Name</label>
                        <input
                          type="text"
                          required
                          value={course}
                          onChange={(e) => setCourse(e.target.value)}
                          placeholder="e.g., B.Tech Computer Science"
                          disabled={rateLimitInfo.isBlocked}
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-700">Strengths</label>
                          <input
                            type="text"
                            value={strengths}
                            onChange={(e) => setStrengths(e.target.value)}
                            placeholder="e.g., Python, React"
                            disabled={rateLimitInfo.isBlocked}
                            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-700">Weaknesses</label>
                          <input
                            type="text"
                            value={weaknesses}
                            onChange={(e) => setWeaknesses(e.target.value)}
                            placeholder="e.g., Public Speaking"
                            disabled={rateLimitInfo.isBlocked}
                            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedRole === 'employer' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Company Name</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Tech Corp Ltd."
                          disabled={rateLimitInfo.isBlocked}
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-700">Company Description</label>
                        <textarea
                          required
                          value={companyDescription}
                          onChange={(e) => setCompanyDescription(e.target.value)}
                          placeholder="Briefly describe your company and industry."
                          disabled={rateLimitInfo.isBlocked}
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                          rows={2}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Phone Number (mandatory - OTP is sent to this on submit) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span>Mobile Number</span>
                  <span className="text-[10px] text-gray-600 font-mono">OTP will be sent here</span>
                </label>
                <div className="flex rounded-xl border border-gray-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <select
                    value={currentCode}
                    onChange={(e) => handleCountryCodeChange(e.target.value)}
                    disabled={rateLimitInfo.isBlocked}
                    className="bg-gray-50 border-r border-gray-300 text-sm font-bold text-gray-700 px-3 py-3 focus:outline-none cursor-pointer"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    value={currentBody}
                    onChange={(e) => handlePhoneBodyChange(e.target.value)}
                    placeholder="98765 43210"
                    disabled={rateLimitInfo.isBlocked}
                    className="flex-1 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 font-mono tracking-wider"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span>Registered Email Address</span>
                  <span className="text-[10px] text-gray-600 font-mono">Corporate ID</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-600 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    disabled={rateLimitInfo.isBlocked}
                    className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-700">Account Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Reset link requested! Please check your email inbox.'); }} className="text-[11px] text-sky-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-600 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={rateLimitInfo.isBlocked}
                    className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* CAPTCHA Checkbox */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-gray-200 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={captchaChecked}
                    onChange={(e) => setCaptchaChecked(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 bg-black text-green-600 focus:ring-emerald-400"
                  />
                  <span className="text-xs text-gray-700 font-medium">
                    I am not a robot (Security Check)
                  </span>
                </label>
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || rateLimitInfo.isBlocked}
                className="group w-full py-3.5 rounded-2xl bg-[#005E93] text-white hover:bg-[#004A75] font-extrabold text-sm hover:bg-neutral-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : rateLimitInfo.isBlocked ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Log in after {rateLimitInfo.retryAfterDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </>
                ) : (
                  <>
                    <span>Continue & Verify Mobile Number</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-gray-500 -mt-1">
                We'll text a 6-digit code to your phone. Your {isSignUp ? 'account is not created' : 'login is not completed'} until it's verified.
              </p>
            </form>

            {selectedRole !== 'admin' && (
              <div className="mt-6 text-center text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
                <button 
                  type="button" 
                  onClick={() => setIsSignUp(!isSignUp)} 
                  className="ml-2 text-sky-400 font-semibold hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Create New Account'}
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
