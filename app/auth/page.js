'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import styles from './auth.module.css';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignup) {
        // Signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          console.error('Signup error:', error);
          setError(error.message);
        } else {
          console.log('Signup successful:', data);
          setSuccessMessage(
            'Signup successful! Please check your email (including spam/junk folders) to confirm your account before logging in.'
          );
          setEmail('');
          setPassword('');
          setIsSignup(false); // Switch to login form after signup
        }
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.error('Login error:', error);
          if (error.message.includes('Email not confirmed')) {
            setError('Please confirm your email before logging in. Check your email (including spam/junk folders) for the confirmation link.');
          } else {
            setError(error.message);
          }
        } else {
          console.log('Login successful:', data);
          router.push('/chat');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{isSignup ? 'Sign Up' : 'Log In'}</h1>
      {isSignup && (
        <p className={styles.infoMessage}>
          After signing up, you’ll need to confirm your email before you can log in. Check your email (including spam/junk folders) for the confirmation link.
        </p>
      )}
      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
      <form onSubmit={handleAuth} className={styles.authForm}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.input}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={styles.input}
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.authButton}>
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>
        <p className={styles.toggleText}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError(null);
              setSuccessMessage(null);
            }}
            className={styles.toggleButton}
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </form>
    </div>
  );
}