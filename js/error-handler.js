// ===== ERROR HANDLER MODULE =====
// Comprehensive error handling for House Maintenance Guide application

/**
 * Global Error Handler
 * Provides centralized error handling, logging, and user notifications
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.isEnabled = true;
    this.showUserErrors = true;
    this.debugMode = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.search.includes('debug=true');
    
    this.init();
  }

  init() {
    // Set up global error handlers
    this.setupGlobalErrorHandlers();
    this.setupPromiseRejectionHandler();
    this.setupConsoleOverride();
    
    // Initialize error notification styles
    this.injectErrorStyles();
    
    console.log('🛡️ ErrorHandler initialized', { debugMode: this.debugMode });
  }

  setupGlobalErrorHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'JavaScript Error',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error,
        stack: event.error?.stack
      });
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError({
          type: 'Resource Error',
          element: event.target.tagName,
          source: event.target.src || event.target.href,
          message: `Failed to load ${event.target.tagName.toLowerCase()}`
        });
      }
    }, true);
  }

  setupPromiseRejectionHandler() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'Promise Rejection',
        message: event.reason?.message || event.reason,
        stack: event.reason?.stack,
        promise: event.promise
      });
    });
  }

  setupConsoleOverride() {
    // Override console.error to capture all errors
    const originalError = console.error;
    console.error = (...args) => {
      this.logError({
        type: 'Console Error',
        message: args.join(' '),
        timestamp: new Date().toISOString()
      });
      originalError.apply(console, args);
    };
  }

  handleError(errorInfo) {
    if (!this.isEnabled) return;

    const processedError = this.processError(errorInfo);
    this.logError(processedError);

    if (this.shouldShowUserNotification(processedError)) {
      this.showUserError(processedError);
    }

    if (this.debugMode) {
      console.group('🚨 Error Details');
      console.error('Error:', processedError);
      console.trace('Stack trace');
      console.groupEnd();
    }
  }

  processError(errorInfo) {
    return {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      type: errorInfo.type || 'Unknown Error',
      message: errorInfo.message || 'An unknown error occurred',
      filename: errorInfo.filename,
      line: errorInfo.line,
      column: errorInfo.column,
      stack: errorInfo.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: this.determineSeverity(errorInfo),
      userMessage: this.generateUserMessage(errorInfo)
    };
  }

  generateErrorId() {
    return 'ERR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  determineSeverity(errorInfo) {
    // High severity errors
    if (errorInfo.type === 'TypeError' || 
        errorInfo.message.includes('Cannot read property') ||
        errorInfo.message.includes('is not a function')) {
      return 'high';
    }

    // Medium severity errors
    if (errorInfo.type === 'ReferenceError' ||
        errorInfo.type === 'Promise Rejection') {
      return 'medium';
    }

    // Low severity errors
    return 'low';
  }

  generateUserMessage(errorInfo) {
    const type = errorInfo.type?.toLowerCase() || '';
    const message = errorInfo.message?.toLowerCase() || '';

    // Common error scenarios with user-friendly messages
    if (message.includes('network') || message.includes('fetch')) {
      return 'Please check your internet connection and try again.';
    }

    if (message.includes('not found') || type.includes('resource')) {
      return 'Some content failed to load. Please refresh the page.';
    }

    // Generic messages by error type
    switch (type) {
      case 'javascript error':
      case 'typeerror':
        return 'A technical error occurred. Please refresh the page.';
      case 'promise rejection':
        return 'An operation failed to complete. Please try again.';
      default:
        return 'Something went wrong. Please refresh the page or try again later.';
    }
  }

  shouldShowUserNotification(errorInfo) {
    if (!this.showUserErrors) return false;
    
    // Don't spam users with low severity errors
    if (errorInfo.severity === 'low') return false;

    // Check if we've already shown this type of error recently
    const recentSimilarErrors = this.errorLog
      .slice(-10)
      .filter(err => err.type === errorInfo.type && 
                     Date.now() - new Date(err.timestamp).getTime() < 30000);

    return recentSimilarErrors.length === 0;
  }

  showUserError(errorInfo) {
    // Create error notification element
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    notification.innerHTML = `
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <div class="error-message">
          <strong>Something went wrong</strong>
          <p>${errorInfo.userMessage}</p>
        </div>
        <button class="error-close" aria-label="Dismiss error">×</button>
      </div>
    `;

    // Add close functionality
    const closeButton = notification.querySelector('.error-close');
    closeButton.addEventListener('click', () => {
      notification.remove();
    });

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);

    // Add to page
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
  }

  logError(errorInfo) {
    this.errorLog.unshift(errorInfo);
    
    // Maintain log size limit
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Store in localStorage for persistence (limited to prevent storage issues)
    try {
      const persistentLog = this.errorLog.slice(0, 10);
      localStorage.setItem('errorLog', JSON.stringify(persistentLog));
    } catch (e) {
      // Storage full, ignore
    }
  }

  injectErrorStyles() {
    if (document.querySelector('#error-handler-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'error-handler-styles';
    styles.textContent = `
      .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-family: inherit;
      }

      .error-notification.show {
        transform: translateX(0);
      }

      .error-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .error-icon {
        font-size: 20px;
        flex-shrink: 0;
      }

      .error-message {
        flex: 1;
      }

      .error-message strong {
        display: block;
        margin-bottom: 4px;
        font-size: 16px;
      }

      .error-message p {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }

      .error-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .error-close:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      @media (max-width: 480px) {
        .error-notification {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  // Public API methods
  reportError(error, context = {}) {
    this.handleError({
      type: 'Manual Report',
      message: error.message || error,
      stack: error.stack,
      ...context
    });
  }

  getErrorLog() {
    return [...this.errorLog];
  }

  getStats() {
    const totalErrors = this.errorLog.length;
    const errorsByType = {};
    const errorsBySeverity = { high: 0, medium: 0, low: 0 };

    this.errorLog.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
    });

    return {
      totalErrors,
      errorsByType,
      errorsBySeverity,
      debugMode: this.debugMode,
      userNotifications: this.showUserErrors
    };
  }
}

// Initialize global error handler
window.ErrorHandler = new ErrorHandler();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
}

console.log('✅ ErrorHandler module loaded successfully');