// ===== EVENT MANAGER MODULE =====
// Centralized event delegation and management system for House Maintenance Guide application

/**
 * Event Manager
 * Handles centralized event delegation, custom events, and performance optimization
 */
class EventManager {
  constructor() {
    // Event listeners registry
    this.listeners = new Map();
    
    // Custom event listeners
    this.customListeners = new Map();
    
    // Throttled/debounced functions cache
    this.throttleCache = new Map();
    this.debounceCache = new Map();
    
    // Touch and gesture support
    this.touchSupported = 'ontouchstart' in window;
    this.gestureStates = new Map();
    
    // Performance tracking
    this.eventMetrics = {
      total: 0,
      throttled: 0,
      debounced: 0,
      custom: 0
    };
    
    // Integration system reference
    this.integrationSystem = null;
    
    this.init();
  }
  
  init() {
    console.log('🎯 Event Manager initialized');
    
    // Setup global event delegation
    this.setupGlobalDelegation();
    
    // Setup touch/gesture handlers if supported
    if (this.touchSupported) {
      this.setupTouchHandlers();
    }
    
    // Setup keyboard event handlers
    this.setupKeyboardHandlers();
    
    // Setup resize handler
    this.setupResizeHandler();
    
    // Setup unload handlers for cleanup
    this.setupCleanupHandlers();
  }
  
  /**
   * Set integration system reference
   */
  setIntegrationSystem(integrationSystem) {
    this.integrationSystem = integrationSystem;
  }
  
  /**
   * Setup global event delegation for common events
   */
  setupGlobalDelegation() {
    // Delegate click events
    document.addEventListener('click', (e) => {
      this.handleDelegatedClick(e);
    }, { passive: false });
    
    // Delegate input events
    document.addEventListener('input', (e) => {
      this.handleDelegatedInput(e);
    }, { passive: true });
    
    // Delegate change events
    document.addEventListener('change', (e) => {
      this.handleDelegatedChange(e);
    }, { passive: true });
    
    // Delegate focus events
    document.addEventListener('focusin', (e) => {
      this.handleDelegatedFocus(e);
    }, { passive: true });
    
    // Delegate blur events
    document.addEventListener('focusout', (e) => {
      this.handleDelegatedBlur(e);
    }, { passive: true });
  }
  
  /**
   * Handle delegated click events
   */
  handleDelegatedClick(event) {
    const target = event.target;
    
    try {
      // Handle room cards
      const roomCard = target.closest('.room-card');
      if (roomCard) {
        event.preventDefault();
        this.emit('ROOM_SELECTED', {
          room: roomCard.dataset.room,
          element: roomCard
        });
        return;
      }
      
      // Handle navigation items
      const navItem = target.closest('.nav-item');
      if (navItem) {
        event.preventDefault();
        this.emit('NAV_ITEM_CLICKED', {
          page: navItem.dataset.page,
          element: navItem
        });
        return;
      }
      
      // Handle filter chips
      const chip = target.closest('.chip');
      if (chip) {
        event.preventDefault();
        this.emit('FILTER_SELECTED', {
          filter: chip.dataset.filter,
          element: chip
        });
        return;
      }
      
      // Handle theme toggle
      if (target.closest('#themeToggle')) {
        event.preventDefault();
        this.emit('THEME_TOGGLE_REQUESTED');
        return;
      }
      
      // Handle issue items
      const issueItem = target.closest('.issue-item');
      if (issueItem) {
        event.preventDefault();
        this.emit('ISSUE_SELECTED', {
          element: issueItem
        });
        return;
      }
      
      // Handle task cards
      const taskCard = target.closest('.task-card');
      if (taskCard) {
        event.preventDefault();
        const taskType = Array.from(taskCard.classList).find(cls => 
          ['winter', 'spring', 'summer', 'autumn'].includes(cls)
        );
        this.emit('SEASONAL_TASK_SELECTED', {
          season: taskType,
          element: taskCard
        });
        return;
      }
      
      this.eventMetrics.total++;
    } catch (error) {
      this.handleEventError('handleDelegatedClick', error);
    }
  }
  
  /**
   * Handle delegated input events
   */
  handleDelegatedInput(event) {
    const target = event.target;
    
    try {
      // Handle search input
      if (target.id === 'searchInput') {
        this.debounce('search-input', () => {
          this.emit('SEARCH_QUERY_CHANGED', {
            query: target.value,
            element: target
          });
        }, 300);
        return;
      }
      
      this.eventMetrics.total++;
    } catch (error) {
      this.handleEventError('handleDelegatedInput', error);
    }
  }
  
  /**
   * Handle delegated change events
   */
  handleDelegatedChange(event) {
    const target = event.target;
    
    try {
      // Handle form elements
      if (target.tagName === 'SELECT' || target.type === 'checkbox' || target.type === 'radio') {
        this.emit('FORM_ELEMENT_CHANGED', {
          element: target,
          value: target.value,
          checked: target.checked
        });
      }
      
      this.eventMetrics.total++;
    } catch (error) {
      this.handleEventError('handleDelegatedChange', error);
    }
  }
  
  /**
   * Handle delegated focus events
   */
  handleDelegatedFocus(event) {
    const target = event.target;
    
    try {
      // Add focus styling
      target.classList.add('focused');
      
      // Emit focus event
      this.emit('ELEMENT_FOCUSED', {
        element: target,
        tagName: target.tagName,
        id: target.id,
        className: target.className
      });
      
      this.eventMetrics.total++;
    } catch (error) {
      this.handleEventError('handleDelegatedFocus', error);
    }
  }
  
  /**
   * Handle delegated blur events
   */
  handleDelegatedBlur(event) {
    const target = event.target;
    
    try {
      // Remove focus styling
      target.classList.remove('focused');
      
      // Emit blur event
      this.emit('ELEMENT_BLURRED', {
        element: target,
        tagName: target.tagName,
        id: target.id,
        className: target.className
      });
      
      this.eventMetrics.total++;
    } catch (error) {
      this.handleEventError('handleDelegatedBlur', error);
    }
  }
  
  /**
   * Setup touch/gesture handlers
   */
  setupTouchHandlers() {
    let touchStartTime = 0;
    let touchStartPos = { x: 0, y: 0 };
    
    document.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      if (e.touches.length === 1) {
        touchStartPos.x = e.touches[0].clientX;
        touchStartPos.y = e.touches[0].clientY;
      }
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      
      // Detect tap vs long press
      if (touchDuration < 200) {
        // Quick tap - treat as click
        this.emit('TOUCH_TAP', {
          target: e.target,
          duration: touchDuration
        });
      } else if (touchDuration > 500) {
        // Long press
        this.emit('TOUCH_LONG_PRESS', {
          target: e.target,
          duration: touchDuration
        });
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', this.throttle('touchmove', (e) => {
      if (e.touches.length === 1) {
        const currentPos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        
        const deltaX = currentPos.x - touchStartPos.x;
        const deltaY = currentPos.y - touchStartPos.y;
        
        // Detect swipe gestures
        if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
          let direction = '';
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
          } else {
            direction = deltaY > 0 ? 'down' : 'up';
          }
          
          this.emit('TOUCH_SWIPE', {
            direction,
            delta: { x: deltaX, y: deltaY },
            target: e.target
          });
        }
      }
    }, 16), { passive: true }); // 60fps
  }
  
  /**
   * Setup keyboard event handlers
   */
  setupKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      try {
        // Handle escape key globally
        if (e.key === 'Escape') {
          this.emit('ESCAPE_PRESSED', { originalEvent: e });
        }
        
        // Handle enter key
        if (e.key === 'Enter') {
          this.emit('ENTER_PRESSED', { 
            target: e.target,
            originalEvent: e 
          });
        }
        
        // Handle arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          this.emit('ARROW_KEY_PRESSED', {
            direction: e.key.replace('Arrow', '').toLowerCase(),
            target: e.target,
            originalEvent: e
          });
        }
        
        // Handle keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
          this.emit('KEYBOARD_SHORTCUT', {
            key: e.key,
            ctrl: e.ctrlKey,
            meta: e.metaKey,
            shift: e.shiftKey,
            alt: e.altKey,
            originalEvent: e
          });
        }
        
        this.eventMetrics.total++;
      } catch (error) {
        this.handleEventError('setupKeyboardHandlers', error);
      }
    }, { passive: false });
  }
  
  /**
   * Setup resize handler
   */
  setupResizeHandler() {
    window.addEventListener('resize', this.throttle('resize', () => {
      this.emit('WINDOW_RESIZED', {
        width: window.innerWidth,
        height: window.innerHeight,
        timestamp: Date.now()
      });
    }, 100), { passive: true });
  }
  
  /**
   * Setup cleanup handlers
   */
  setupCleanupHandlers() {
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
    
    // Cleanup on page hide (mobile)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.emit('PAGE_HIDDEN');
      } else {
        this.emit('PAGE_VISIBLE');
      }
    });
  }
  
  /**
   * Add event listener with automatic cleanup tracking
   */
  addEventListener(element, eventType, handler, options = {}) {
    try {
      if (!element || typeof handler !== 'function') {
        console.warn('Invalid parameters for addEventListener');
        return null;
      }
      
      // Create unique ID for this listener
      const listenerId = `${eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Wrap handler with error handling
      const wrappedHandler = (event) => {
        try {
          handler.call(element, event);
          this.eventMetrics.total++;
        } catch (error) {
          this.handleEventError(`addEventListener:${eventType}`, error);
        }
      };
      
      // Add the actual listener
      element.addEventListener(eventType, wrappedHandler, options);
      
      // Store for cleanup
      this.listeners.set(listenerId, {
        element,
        eventType,
        handler: wrappedHandler,
        options,
        originalHandler: handler
      });
      
      return listenerId;
    } catch (error) {
      this.handleEventError('addEventListener', error);
      return null;
    }
  }
  
  /**
   * Remove event listener
   */
  removeEventListener(listenerId) {
    try {
      const listenerInfo = this.listeners.get(listenerId);
      if (listenerInfo) {
        const { element, eventType, handler } = listenerInfo;
        element.removeEventListener(eventType, handler);
        this.listeners.delete(listenerId);
        return true;
      }
      return false;
    } catch (error) {
      this.handleEventError('removeEventListener', error);
      return false;
    }
  }
  
  /**
   * Emit custom event
   */
  emit(eventName, data = {}) {
    try {
      // Notify registered custom listeners
      const listeners = this.customListeners.get(eventName) || [];
      listeners.forEach(listener => {
        try {
          listener(data, eventName);
        } catch (error) {
          this.handleEventError(`emit:${eventName}`, error);
        }
      });
      
      // Dispatch DOM event
      const customEvent = new CustomEvent(`app:${eventName.toLowerCase()}`, {
        detail: data,
        bubbles: true
      });
      
      document.dispatchEvent(customEvent);
      
      this.eventMetrics.custom++;
    } catch (error) {
      this.handleEventError('emit', error);
    }
  }
  
  /**
   * Subscribe to custom event
   */
  on(eventName, handler) {
    try {
      if (typeof handler !== 'function') {
        console.warn('Event handler must be a function');
        return null;
      }
      
      if (!this.customListeners.has(eventName)) {
        this.customListeners.set(eventName, []);
      }
      
      this.customListeners.get(eventName).push(handler);
      
      // Return unsubscribe function
      return () => {
        this.off(eventName, handler);
      };
    } catch (error) {
      this.handleEventError('on', error);
      return null;
    }
  }
  
  /**
   * Unsubscribe from custom event
   */
  off(eventName, handler) {
    try {
      const listeners = this.customListeners.get(eventName);
      if (listeners) {
        const index = listeners.indexOf(handler);
        if (index > -1) {
          listeners.splice(index, 1);
          return true;
        }
      }
      return false;
    } catch (error) {
      this.handleEventError('off', error);
      return false;
    }
  }
  
  /**
   * Throttle function execution
   */
  throttle(key, func, delay) {
    if (this.throttleCache.has(key)) {
      return this.throttleCache.get(key);
    }
    
    let lastCall = 0;
    const throttledFunc = (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        this.eventMetrics.throttled++;
        return func.apply(this, args);
      }
    };
    
    this.throttleCache.set(key, throttledFunc);
    return throttledFunc;
  }
  
  /**
   * Debounce function execution
   */
  debounce(key, func, delay) {
    if (this.debounceCache.has(key)) {
      clearTimeout(this.debounceCache.get(key).timeoutId);
    }
    
    const timeoutId = setTimeout(() => {
      this.eventMetrics.debounced++;
      func.apply(this);
      this.debounceCache.delete(key);
    }, delay);
    
    this.debounceCache.set(key, { timeoutId });
  }
  
  /**
   * Handle errors in event processing
   */
  handleEventError(context, error) {
    console.error(`Event Manager Error in ${context}:`, error);
    
    if (this.integrationSystem) {
      this.integrationSystem.handleModuleError('EventManager', error, { context });
    } else if (window.ErrorHandler) {
      window.ErrorHandler.reportError(error, { 
        module: 'EventManager',
        context 
      });
    }
  }
  
  /**
   * Clean up all event listeners
   */
  cleanup() {
    console.log('🧹 Event Manager cleanup started');
    
    // Remove all tracked listeners
    this.listeners.forEach((listenerInfo, listenerId) => {
      this.removeEventListener(listenerId);
    });
    
    // Clear custom listeners
    this.customListeners.clear();
    
    // Clear caches
    this.throttleCache.clear();
    this.debounceCache.forEach(({ timeoutId }) => clearTimeout(timeoutId));
    this.debounceCache.clear();
    
    console.log('✅ Event Manager cleanup completed');
  }
  
  /**
   * Get event manager statistics
   */
  getStats() {
    return {
      ...this.eventMetrics,
      activeListeners: this.listeners.size,
      customEventTypes: this.customListeners.size,
      throttledFunctions: this.throttleCache.size,
      debouncedFunctions: this.debounceCache.size,
      touchSupported: this.touchSupported
    };
  }
  
  /**
   * Check if initialized
   */
  isInitialized() {
    return this.listeners instanceof Map;
  }
}

// Initialize Event Manager
window.EventManager = new EventManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EventManager;
}

console.log('✅ Event Manager module loaded successfully');