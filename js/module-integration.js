/**
 * Module Integration System
 * 
 * This file coordinates the initialization and communication between all modules
 * of the House Maintenance Guide application. It handles module loading order,
 * dependency management, and shared configurations.
 */

class ModuleIntegrationSystem {
  constructor() {
    // Module registry
    this.modules = {};
    
    // Module loading states
    this.loadingStates = {
      ERROR_HANDLER: false,
      DOM_SAFETY_MANAGER: false,
      EVENT_MANAGER: false,
      NAVIGATION_MANAGER: false,
      SEARCH_SYSTEM: false,
      GUIDE_VIEWER: false
    };
    
    // Shared application state
    this.appState = {
      currentTheme: 'light',
      currentPage: 'home',
      searchQuery: '',
      currentRoom: null,
      activeFilters: ['all'],
      initialized: false
    };
    
    // Module dependencies
    this.moduleDependencies = {
      'ERROR_HANDLER': [],
      'DOM_SAFETY_MANAGER': ['ERROR_HANDLER'],
      'EVENT_MANAGER': ['ERROR_HANDLER', 'DOM_SAFETY_MANAGER'],
      'NAVIGATION_MANAGER': ['ERROR_HANDLER', 'DOM_SAFETY_MANAGER', 'EVENT_MANAGER'],
      'SEARCH_SYSTEM': ['ERROR_HANDLER', 'DOM_SAFETY_MANAGER', 'EVENT_MANAGER'],
      'GUIDE_VIEWER': ['ERROR_HANDLER', 'DOM_SAFETY_MANAGER', 'EVENT_MANAGER', 'SEARCH_SYSTEM']
    };
    
    // Module script paths
    this.modulePaths = {
      'ERROR_HANDLER': 'js/error-handler.js',
      'DOM_SAFETY_MANAGER': 'js/dom-safety-manager.js',
      'EVENT_MANAGER': 'js/event-manager.js',
      'NAVIGATION_MANAGER': 'js/navigation-manager.js',
      'SEARCH_SYSTEM': 'js/search-system.js',
      'GUIDE_VIEWER': 'js/guide-viewer.js'
    };
    
    // Module initialization order
    this.initOrder = [
      'ERROR_HANDLER',
      'DOM_SAFETY_MANAGER',
      'EVENT_MANAGER',
      'NAVIGATION_MANAGER',
      'SEARCH_SYSTEM',
      'GUIDE_VIEWER'
    ];
    
    // Global configuration (can be extended by modules)
    this.config = {
      debug: true,
      apiEndpoint: '/api',
      offlineMode: false,
      autoSave: true,
      animationsEnabled: true,
      cacheExpiry: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    };
    
    // Initialize integration system
    this.init();
  }
  
  /**
   * Initialize the module integration system
   */
  init() {
    console.log('🔄 Initializing Module Integration System');
    
    // Load modules in the correct order
    this.loadModules()
      .then(() => {
        console.log('✅ All modules loaded successfully');
        this.appState.initialized = true;
        
        // Dispatch application ready event
        this.dispatchEvent('APP_READY', {
          appState: this.appState,
          config: this.config
        });
      })
      .catch(error => {
        console.error('❌ Module initialization failed:', error);
        if (window.ErrorHandler) {
          window.ErrorHandler.reportError(error, { context: 'ModuleIntegration.init' });
        }
      });
    
    // Listen for window load event
    window.addEventListener('load', () => {
      this.dispatchEvent('APP_LOADED', { timestamp: Date.now() });
    });
    
    // Handle online/offline status
    window.addEventListener('online', () => {
      this.config.offlineMode = false;
      this.dispatchEvent('CONNECTIVITY_CHANGED', { online: true });
    });
    
    window.addEventListener('offline', () => {
      this.config.offlineMode = true;
      this.dispatchEvent('CONNECTIVITY_CHANGED', { online: false });
    });
  }
  
  /**
   * Load all modules in the correct order
   */
  async loadModules() {
    console.log('📦 Loading modules in sequence');
    
    for (const moduleName of this.initOrder) {
      try {
        await this.loadModule(moduleName);
        console.log(`✅ Module loaded: ${moduleName}`);
      } catch (error) {
        console.error(`❌ Failed to load module ${moduleName}:`, error);
        throw error;
      }
    }
    
    // Initialize modules after loading
    this.initializeModules();
  }
  
  /**
   * Load a single module
   */
  loadModule(moduleName) {
    return new Promise((resolve, reject) => {
      // Check if all dependencies are loaded
      for (const dep of this.moduleDependencies[moduleName]) {
        if (!this.loadingStates[dep]) {
          return reject(new Error(`Dependency ${dep} not loaded for ${moduleName}`));
        }
      }
      
      // Create script element
      const script = document.createElement('script');
      script.src = this.modulePaths[moduleName];
      script.async = false; // Load in order
      
      // Handle loading success
      script.onload = () => {
        this.loadingStates[moduleName] = true;
        resolve();
      };
      
      // Handle loading error
      script.onerror = () => {
        reject(new Error(`Failed to load ${moduleName} from ${this.modulePaths[moduleName]}`));
      };
      
      // Add to document
      document.head.appendChild(script);
    });
  }
  
  /**
   * Initialize modules after they're all loaded
   */
  initializeModules() {
    console.log('🚀 Initializing all modules');
    
    // Register modules with this integration system
    this.registerModule('ErrorHandler', window.ErrorHandler);
    this.registerModule('DOMSafetyManager', window.DOMSafetyManager);
    this.registerModule('EventManager', window.EventManager);
    this.registerModule('NavigationManager', window.NavigationManager);
    this.registerModule('SearchSystem', window.SearchSystem);
    this.registerModule('GuideViewer', window.GuideViewer);
    
    // Inject shared state and config
    Object.values(this.modules).forEach(module => {
      if (module && typeof module.setIntegrationSystem === 'function') {
        module.setIntegrationSystem(this);
      }
      
      if (module && typeof module.setAppState === 'function') {
        module.setAppState(this.appState);
      }
      
      if (module && typeof module.setConfig === 'function') {
        module.setConfig(this.config);
      }
    });
  }
  
  /**
   * Register a module with the integration system
   */
  registerModule(name, instance) {
    if (!instance) {
      console.warn(`⚠️ Module ${name} not found when registering`);
      return;
    }
    
    this.modules[name] = instance;
    console.log(`📝 Registered module: ${name}`);
  }
  
  /**
   * Get a module instance
   */
  getModule(name) {
    return this.modules[name] || null;
  }
  
  /**
   * Update application state
   */
  updateAppState(partialState) {
    this.appState = {
      ...this.appState,
      ...partialState
    };
    
    // Notify all modules of state change
    this.dispatchEvent('APP_STATE_CHANGED', {
      appState: this.appState,
      changedProps: Object.keys(partialState)
    });
    
    return this.appState;
  }
  
  /**
   * Update configuration
   */
  updateConfig(partialConfig) {
    this.config = {
      ...this.config,
      ...partialConfig
    };
    
    // Notify all modules of config change
    this.dispatchEvent('CONFIG_CHANGED', {
      config: this.config,
      changedProps: Object.keys(partialConfig)
    });
    
    return this.config;
  }
  
  /**
   * Dispatch events to all modules
   */
  dispatchEvent(eventName, data = {}) {
    // First use the EventManager if available
    if (this.modules.EventManager && typeof this.modules.EventManager.emit === 'function') {
      this.modules.EventManager.emit(eventName, data);
      return;
    }
    
    // Fallback to manual dispatch
    Object.values(this.modules).forEach(module => {
      if (module && typeof module.handleEvent === 'function') {
        module.handleEvent(eventName, data);
      }
    });
    
    // Also dispatch a custom event for any listeners
    const customEvent = new CustomEvent(`qwen:${eventName.toLowerCase()}`, {
      detail: data,
      bubbles: true
    });
    
    document.dispatchEvent(customEvent);
  }
  
  /**
   * Get system health status
   */
  getSystemHealth() {
    const moduleStatus = {};
    
    // Check status of each module
    Object.entries(this.modules).forEach(([name, instance]) => {
      moduleStatus[name] = {
        loaded: !!instance,
        initialized: instance && typeof instance.isInitialized === 'function' ? 
                     instance.isInitialized() : this.loadingStates[name.toUpperCase()]
      };
    });
    
    return {
      initialized: this.appState.initialized,
      modulesLoaded: Object.values(this.loadingStates).every(state => state),
      moduleStatus,
      offlineMode: this.config.offlineMode,
      currentPage: this.appState.currentPage
    };
  }
  
  /**
   * Handle error events from any module
   */
  handleModuleError(moduleName, error, context = {}) {
    console.error(`❌ Error in module ${moduleName}:`, error, context);
    
    if (this.modules.ErrorHandler) {
      this.modules.ErrorHandler.reportError(error, {
        module: moduleName,
        ...context
      });
    }
  }
}

// Initialize integration system
window.ModuleIntegration = new ModuleIntegrationSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModuleIntegrationSystem;
}

console.log('✅ Module Integration System loaded successfully');