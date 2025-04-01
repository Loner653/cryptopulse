"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import styles from "./auth.module.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`, // Redirect back after link confirmation
        },
      });
      if (error) {
        console.error("Signup error:", error);
        setError(error.message);
      } else {
        console.log("Signup successful:", data);
        setSuccessMessage(
          "Signup successful! Check your email (including spam/junk) for a confirmation link or code."
        );
        setConfirmCode(""); // Reset code field
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Auth error:", err);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Email not confirmed")) {
          setError(
            "Please confirm your email before logging in. Check your email (including spam/junk) for the confirmation link or code."
          );
        } else {
          setError(error.message);
        }
      } else {
        console.log("Login successful:", data);
        router.push("/chat");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Auth error:", err);
    }
  };

  // Handle Password Reset Request
  const handleResetRequest = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) {
        console.error("Reset error:", error);
        setError(error.message);
      } else {
        setSuccessMessage(
          "Password reset email sent! Check your email (including spam/junk) for a link or code."
        );
        setConfirmCode(""); // Reset code field
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Reset error:", err);
    }
  };

  // Handle Confirmation Code (Signup or Reset)
  const handleCodeConfirm = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: confirmCode,
        type: isReset ? "recovery" : "signup",
      });
      if (error) {
        console.error("Code confirmation error:", error);
        setError(error.message);
      } else {
        setSuccessMessage(
          isReset
            ? "Password reset confirmed! Please log in with your new password."
            : "Signup confirmed! Please log in."
        );
        setIsSignup(false);
        setIsReset(false);
        setEmail("");
        setPassword("");
        setConfirmCode("");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Code confirmation error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>
        {isReset ? "Reset Password" : isSignup ? "Sign Up" : "Log In"}
      </h1>
      {isSignup && !confirmCode && (
        <p className={styles.infoMessage}>
          After signing up, confirm your email with a link or code from your inbox (check spam/junk too).
        </p>
      )}
      {isReset && !confirmCode && (
        <p className={styles.infoMessage}>
          Enter your email to receive a reset link or code (check spam/junk).
        </p>
      )}
      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
      {error && <p className={styles.error}>{error}</p>}

      {/* Main Form: Login, Signup, or Reset Request */}
      {!confirmCode && (
        <form
          onSubmit={
            isReset ? handleResetRequest : isSignup ? handleSignup : handleLogin
          }
          className={styles.authForm}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={styles.input}
            required
          />
          {!isReset && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={styles.input}
              required
            />
          )}
          <button type="submit" className={styles.authButton}>
            {isReset ? "Send Reset Email" : isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>
      )}

      {/* Code Confirmation Form */}
      {(isSignup || isReset) && successMessage?.includes("code") && (
        <form onSubmit={handleCodeConfirm} className={styles.authForm}>
          <input
            type="text"
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value)}
            placeholder="Enter confirmation code"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.authButton}>
            Confirm Code
          </button>
        </form>
      )}

      {/* Toggle Buttons */}
      <div className={styles.toggleText}>
        {!isReset && !confirmCode && (
          <>
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setIsReset(false);
                setError(null);
                setSuccessMessage(null);
                setConfirmCode("");
              }}
              className={styles.toggleButton}
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
            {!isSignup && (
              <button
                type="button"
                onClick={() => {
                  setIsReset(true);
                  setIsSignup(false);
                  setError(null);
                  setSuccessMessage(null);
                  setConfirmCode("");
                }}
                className={styles.toggleButton}
              >
                Forgot Password?
              </button>
            )}
          </>
        )}
        {(isReset || isSignup) && confirmCode && (
          <button
            type="button"
            onClick={() => {
              setIsSignup(false);
              setIsReset(false);
              setError(null);
              setSuccessMessage(null);
              setConfirmCode("");
            }}
            className={styles.toggleButton}
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}