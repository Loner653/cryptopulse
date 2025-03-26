// app/analytics/ErrorBoundary.js
"use client";

import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static displayName = "AnalyticsErrorBoundary"; // Name it here

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}