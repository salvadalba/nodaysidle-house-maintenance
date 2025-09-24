// ===== NAVIGATION MANAGER MODULE =====
// Room-based navigation and browser history management for House Maintenance Guide application

/**
 * Navigation Manager
 * Handles room navigation, browser history, smooth scrolling, and accessibility
 */
class NavigationManager {
  constructor() {
    // Navigation state
    this.currentRoom = null;
    this.currentPage = 'home';
    this.navigationHistory = [];
    
    // Room configurations
    this.rooms = {
      'kitchen': {
        title: 'Kitchen',
        icon: 'kitchen',
        issues: 10,
        description: 'Common kitchen problems and solutions'
      },
      'bathroom': {
        title: 'Bathroom', 
        icon: 'bathtub',
        issues: 10,
        description: 'Plumbing and bathroom maintenance'
      },
      'bedroom': {
        title: 'Bedroom',
        icon: 'bed', 
        issues: 10,
        description: 'Bedroom comfort and maintenance'
      },
      'living-room': {
        title: 'Living Room',
        icon: 'weekend',
        issues: 10,
        description: 'Living area maintenance and comfort'
      },
      'office': {
        title: 'Home Office',
        icon: 'computer',
        issues: 10,
        description: 'Workspace optimization and maintenance'
      },
      'outdoor': {
        title: 'Outdoor',
        icon: 'yard',
        issues: 10,
        description: 'External maintenance and landscaping'
      }
    };
    
    // Page configurations
    this.pages = {
      'home': {
        title: 'Home',
        icon: 'home',
        route: '/',
        description: 'Main dashboard'
      },
      'search': {
        title: 'Search',
        icon: 'search', 
        route: '/search',
        description: 'Search maintenance guides'
      },
      'favorites': {
        title: 'Saved',
        icon: 'favorite',
        route: '/favorites',
        description: 'Saved maintenance guides'
      },
      'emergency': {
        title: 'Emergency',
        icon: 'warning',
        route: '/emergency',
        description: 'Emergency procedures and contacts'
      }
    };
    
    // Seasonal tasks
    this.seasons = {
      'winter': {
        title: 'Winter Prep',
        icon: 'ac_unit',
        description: 'Heating & insulation tasks'
      },
      'spring': {
        title: 'Spring Clean',
        icon: 'local_florist',
        description: 'Deep cleaning & repairs'
      },
      'summer': {
        title: 'Summer Care',
        icon: 'wb_sunny',
        description: 'Cooling & outdoor maintenance'
      },
      'autumn': {
        title: 'Autumn Prep',
        icon: 'eco',
        description: 'Weatherproofing tasks'
      }
    };
    
    // Animation settings
    this.animationDuration = 300;
    this.scrollBehavior = 'smooth';
    
    // Integration system reference
    this.integrationSystem = null;
    this.eventManager = null;
    
    // Initialize
    this.init();
  }
  
  init() {
    console.log('🧭 Navigation Manager initialized');
    
    // Setup history management
    this.setupHistoryManagement();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize current state from URL
    this.initializeFromURL();
    
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
  }
  
  /**
   * Set integration system reference
   */
  setIntegrationSystem(integrationSystem) {
    this.integrationSystem = integrationSystem;
    this.eventManager = integrationSystem.getModule('EventManager');
    
    // Subscribe to navigation events
    if (this.eventManager) {
      this.eventManager.on('ROOM_SELECTED', (data) => {
        this.navigateToRoom(data.room, data.element);
      });
      
      this.eventManager.on('NAV_ITEM_CLICKED', (data) => {
        this.navigateToPage(data.page, data.element);
      });
      
      this.eventManager.on('SEASONAL_TASK_SELECTED', (data) => {
        this.navigateToSeasonalTask(data.season, data.element);
      });
      
      this.eventManager.on('ISSUE_SELECTED', (data) => {
        this.navigateToIssue(data.element);
      });
    }
  }
  
  /**
   * Setup browser history management
   */
  setupHistoryManagement() {
    // Listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', (event) => {
      if (event.state) {
        this.restoreNavigationState(event.state);
      } else {
        // Fallback to URL parsing
        this.initializeFromURL();
      }
    });
    
    // Replace initial state
    const initialState = {
      page: this.currentPage,
      room: this.currentRoom,
      timestamp: Date.now()
    };
    
    history.replaceState(initialState, '', window.location.pathname);
  }
  
  /**
   * Setup event listeners for navigation elements
   */
  setupEventListeners() {
    // Handle room card hover effects
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.addHoverEffect(card);
      });
      
      card.addEventListener('mouseleave', () => {
        this.removeHoverEffect(card);
      });
    });
    
    // Handle navigation item animations
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        this.addNavHoverEffect(item);
      });
      
      item.addEventListener('mouseleave', () => {
        this.removeNavHoverEffect(item);
      });
    });
  }
  
  /**
   * Initialize navigation state from current URL
   */
  initializeFromURL() {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    
    // Parse path for page
    if (path === '/search' || params.has('search')) {
      this.currentPage = 'search';
    } else if (path === '/favorites' || params.has('favorites')) {
      this.currentPage = 'favorites';
    } else if (path === '/emergency' || params.has('emergency')) {
      this.currentPage = 'emergency';
    } else {
      this.currentPage = 'home';
    }
    
    // Parse hash for room
    if (hash && hash.startsWith('#room-')) {
      this.currentRoom = hash.substring(6);
    }
    
    // Update UI to reflect current state
    this.updateNavigationUI();
  }
  
  /**
   * Navigate to a specific room
   */
  navigateToRoom(roomId, sourceElement = null) {
    try {
      if (!this.rooms[roomId]) {
        console.warn('Unknown room:', roomId);
        return false;
      }
      
      // Add visual feedback if source element provided
      if (sourceElement) {
        this.addClickAnimation(sourceElement);
      }
      
      // Update state
      const previousRoom = this.currentRoom;
      this.currentRoom = roomId;
      
      // Add to history
      this.addToHistory({
        action: 'navigate_room',
        room: roomId,
        previousRoom,
        timestamp: Date.now()
      });
      
      // Update URL
      const newURL = `${window.location.pathname}#room-${roomId}`;
      const state = {
        page: this.currentPage,
        room: roomId,
        timestamp: Date.now()
      };
      
      history.pushState(state, '', newURL);
      
      // Emit navigation event
      this.emitNavigationEvent('ROOM_NAVIGATION', {
        room: roomId,
        roomConfig: this.rooms[roomId],
        previousRoom
      });
      
      // Show room content (mock implementation)
      this.showRoomContent(roomId);
      
      // Update document title
      document.title = `${this.rooms[roomId].title} - NDI House Maintenance Guide`;
      
      console.log(`🏠 Navigated to room: ${roomId}`);
      return true;
    } catch (error) {
      this.handleNavigationError('navigateToRoom', error);
      return false;
    }
  }
  
  /**
   * Navigate to a specific page
   */
  navigateToPage(pageId, sourceElement = null) {
    try {
      if (!this.pages[pageId]) {
        console.warn('Unknown page:', pageId);
        return false;
      }
      
      // Add visual feedback if source element provided
      if (sourceElement) {
        this.addClickAnimation(sourceElement);
      }
      
      // Update state
      const previousPage = this.currentPage;
      this.currentPage = pageId;
      
      // Clear room if navigating to non-home page
      if (pageId !== 'home') {
        this.currentRoom = null;
      }
      
      // Add to history
      this.addToHistory({
        action: 'navigate_page',
        page: pageId,
        previousPage,
        timestamp: Date.now()
      });
      
      // Update URL
      const newURL = this.pages[pageId].route;
      const state = {
        page: pageId,
        room: this.currentRoom,
        timestamp: Date.now()
      };
      
      history.pushState(state, '', newURL);
      
      // Update navigation UI
      this.updateNavigationUI();
      
      // Emit navigation event
      this.emitNavigationEvent('PAGE_NAVIGATION', {
        page: pageId,
        pageConfig: this.pages[pageId],
        previousPage
      });
      
      // Show page content
      this.showPageContent(pageId);
      
      // Update document title
      document.title = `${this.pages[pageId].title} - NDI House Maintenance Guide`;
      
      console.log(`📄 Navigated to page: ${pageId}`);
      return true;
    } catch (error) {
      this.handleNavigationError('navigateToPage', error);
      return false;
    }
  }
  
  /**
   * Navigate to seasonal task
   */
  navigateToSeasonalTask(season, sourceElement = null) {
    try {
      if (!this.seasons[season]) {
        console.warn('Unknown season:', season);
        return false;
      }
      
      // Add visual feedback
      if (sourceElement) {
        this.addClickAnimation(sourceElement);
      }
      
      // Add to history
      this.addToHistory({
        action: 'navigate_seasonal_task',
        season,
        timestamp: Date.now()
      });
      
      // Emit navigation event
      this.emitNavigationEvent('SEASONAL_TASK_NAVIGATION', {
        season,
        seasonConfig: this.seasons[season]
      });
      
      // Show seasonal task content (mock implementation)
      this.showSeasonalTaskContent(season);
      
      console.log(`🗓️ Navigated to seasonal task: ${season}`);
      return true;
    } catch (error) {
      this.handleNavigationError('navigateToSeasonalTask', error);
      return false;
    }
  }
  
  /**
   * Navigate to specific issue
   */
  navigateToIssue(issueElement) {
    try {
      const issueTitle = issueElement.querySelector('h4')?.textContent;
      if (!issueTitle) {
        console.warn('Could not find issue title');
        return false;
      }
      
      // Add visual feedback
      this.addClickAnimation(issueElement);
      
      // Add to history
      this.addToHistory({
        action: 'navigate_issue',
        issue: issueTitle,
        timestamp: Date.now()
      });
      
      // Emit navigation event
      this.emitNavigationEvent('ISSUE_NAVIGATION', {
        issue: issueTitle,
        element: issueElement
      });
      
      // Show issue content (mock implementation)
      this.showIssueContent(issueTitle);
      
      console.log(`🔧 Navigated to issue: ${issueTitle}`);
      return true;
    } catch (error) {
      this.handleNavigationError('navigateToIssue', error);
      return false;
    }
  }
  
  /**
   * Go back in navigation history
   */
  goBack() {
    try {
      if (this.navigationHistory.length > 0) {
        history.back();
        return true;
      }
      return false;
    } catch (error) {
      this.handleNavigationError('goBack', error);
      return false;
    }
  }
  
  /**
   * Go forward in navigation history
   */
  goForward() {
    try {
      history.forward();
      return true;
    } catch (error) {
      this.handleNavigationError('goForward', error);
      return false;
    }
  }
  
  /**
   * Smooth scroll to element
   */
  scrollToElement(element, offset = 0) {
    try {
      if (!element) return false;
      
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const scrollTop = elementTop - offset;
      
      window.scrollTo({
        top: scrollTop,
        behavior: this.scrollBehavior
      });
      
      return true;
    } catch (error) {
      this.handleNavigationError('scrollToElement', error);
      return false;
    }
  }
  
  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    if (this.eventManager) {
      this.eventManager.on('KEYBOARD_SHORTCUT', (data) => {
        this.handleKeyboardShortcut(data);
      });
      
      this.eventManager.on('ARROW_KEY_PRESSED', (data) => {
        this.handleArrowKeyNavigation(data);
      });
    }
  }
  
  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcut(data) {
    const { key, originalEvent } = data;
    
    switch (key.toLowerCase()) {
      case 'h':
        originalEvent.preventDefault();
        this.navigateToPage('home');
        break;
      case 's':
        originalEvent.preventDefault();
        this.navigateToPage('search');
        break;
      case 'f':
        originalEvent.preventDefault();
        this.navigateToPage('favorites');
        break;
      case 'e':
        originalEvent.preventDefault();
        this.navigateToPage('emergency');
        break;
      case 'b':
        originalEvent.preventDefault();
        this.goBack();
        break;
    }
  }
  
  /**
   * Handle arrow key navigation
   */
  handleArrowKeyNavigation(data) {
    const { direction, target } = data;
    
    // Navigate between room cards
    if (target.closest('.room-card')) {
      this.navigateRoomCards(direction);
    }
    
    // Navigate between nav items
    else if (target.closest('.nav-item')) {
      this.navigateNavItems(direction);
    }
    
    // Navigate between filter chips
    else if (target.closest('.chip')) {
      this.navigateFilterChips(direction);
    }
  }
  
  /**
   * Navigate between room cards using arrows
   */
  navigateRoomCards(direction) {
    const roomCards = Array.from(document.querySelectorAll('.room-card'));
    const currentIndex = roomCards.findIndex(card => card === document.activeElement);
    
    let nextIndex;
    if (direction === 'left' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (direction === 'right' && currentIndex < roomCards.length - 1) {
      nextIndex = currentIndex + 1;
    }
    
    if (nextIndex !== undefined) {
      roomCards[nextIndex].focus();
    }
  }
  
  /**
   * Navigate between nav items using arrows
   */
  navigateNavItems(direction) {
    const navItems = Array.from(document.querySelectorAll('.nav-item'));
    const currentIndex = navItems.findIndex(item => item === document.activeElement);
    
    let nextIndex;
    if (direction === 'left' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (direction === 'right' && currentIndex < navItems.length - 1) {
      nextIndex = currentIndex + 1;
    }
    
    if (nextIndex !== undefined) {
      navItems[nextIndex].focus();
    }
  }
  
  /**
   * Navigate between filter chips using arrows
   */
  navigateFilterChips(direction) {
    const chips = Array.from(document.querySelectorAll('.chip'));
    const currentIndex = chips.findIndex(chip => chip === document.activeElement);
    
    let nextIndex;
    if (direction === 'left' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (direction === 'right' && currentIndex < chips.length - 1) {
      nextIndex = currentIndex + 1;
    }
    
    if (nextIndex !== undefined) {
      chips[nextIndex].focus();
    }
  }
  
  /**
   * Update navigation UI to reflect current state
   */
  updateNavigationUI() {
    // Update nav item active states
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.dataset.page === this.currentPage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Update page title in header if applicable
    this.updatePageHeader();
  }
  
  /**
   * Update page header
   */
  updatePageHeader() {
    const pageConfig = this.pages[this.currentPage];
    if (pageConfig) {
      // Update any header elements that show current page
      const breadcrumb = document.querySelector('.breadcrumb');
      if (breadcrumb) {
        breadcrumb.textContent = pageConfig.title;
      }
    }
  }
  
  /**
   * Show room content (mock implementation)
   */
  showRoomContent(roomId) {
    const roomConfig = this.rooms[roomId];
    this.showNotification(`📍 Viewing ${roomConfig.title} maintenance guides`);
  }
  
  /**
   * Show page content (mock implementation)  
   */
  showPageContent(pageId) {
    const pageConfig = this.pages[pageId];
    
    switch (pageId) {
      case 'search':
        // Focus search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.focus();
        }
        break;
      case 'emergency':
        this.showEmergencyContent();
        break;
      default:
        this.showNotification(`📄 Switched to ${pageConfig.title} page`);
    }
  }
  
  /**
   * Show seasonal task content (mock implementation)
   */
  showSeasonalTaskContent(season) {
    const seasonConfig = this.seasons[season];
    this.showNotification(`🗓️ Viewing ${seasonConfig.title} tasks`);
  }
  
  /**
   * Show issue content (mock implementation)
   */
  showIssueContent(issueTitle) {
    this.showNotification(`🔧 Opening guide: ${issueTitle}`);
  }
  
  /**
   * Show emergency content
   */
  showEmergencyContent() {
    const emergencyInfo = `
🚨 EMERGENCY CONTACTS 🚨

• Gas Emergency: 0800 111 999
• Electrical Emergency: Contact local electrician  
• Water Emergency: Turn off main water supply
• Fire: Call 112 (EU Emergency Number)

⚠️ Safety First: If in doubt, call a professional!
    `;
    
    alert(emergencyInfo);
  }
  
  /**
   * Add click animation to element
   */
  addClickAnimation(element) {
    element.style.transform = 'scale(0.98)';
    element.style.transition = `transform ${this.animationDuration}ms ease`;
    
    setTimeout(() => {
      element.style.transform = '';
    }, this.animationDuration);
  }
  
  /**
   * Add hover effect to room card
   */
  addHoverEffect(card) {
    card.style.transform = 'translateY(-2px)';
    card.style.transition = 'transform 200ms ease';
  }
  
  /**
   * Remove hover effect from room card
   */
  removeHoverEffect(card) {
    card.style.transform = '';
  }
  
  /**
   * Add hover effect to nav item
   */
  addNavHoverEffect(item) {
    const icon = item.querySelector('.material-icons');
    if (icon) {
      icon.style.transform = 'scale(1.1)';
      icon.style.transition = 'transform 200ms ease';
    }
  }
  
  /**
   * Remove hover effect from nav item
   */
  removeNavHoverEffect(item) {
    const icon = item.querySelector('.material-icons');
    if (icon) {
      icon.style.transform = '';
    }
  }
  
  /**
   * Show notification
   */
  showNotification(message) {
    // Create simple notification
    const notification = document.createElement('div');
    notification.className = 'navigation-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 140px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--primary-color, #007bff);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 500;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }
  
  /**
   * Add to navigation history
   */
  addToHistory(entry) {
    this.navigationHistory.push(entry);
    
    // Keep history size manageable
    if (this.navigationHistory.length > 50) {
      this.navigationHistory.shift();
    }
  }
  
  /**
   * Restore navigation state from history
   */
  restoreNavigationState(state) {
    if (state.page) {
      this.currentPage = state.page;
    }
    if (state.room) {
      this.currentRoom = state.room;
    }
    
    this.updateNavigationUI();
  }
  
  /**
   * Emit navigation event
   */
  emitNavigationEvent(eventName, data) {
    if (this.eventManager) {
      this.eventManager.emit(eventName, data);
    }
  }
  
  /**
   * Handle navigation errors
   */
  handleNavigationError(context, error) {
    console.error(`Navigation Manager Error in ${context}:`, error);
    
    if (this.integrationSystem) {
      this.integrationSystem.handleModuleError('NavigationManager', error, { context });
    } else if (window.ErrorHandler) {
      window.ErrorHandler.reportError(error, {
        module: 'NavigationManager',
        context
      });
    }
  }
  
  /**
   * Get current navigation state
   */
  getCurrentState() {
    return {
      currentRoom: this.currentRoom,
      currentPage: this.currentPage,
      historyLength: this.navigationHistory.length,
      url: window.location.href
    };
  }
  
  /**
   * Get navigation statistics
   */
  getStats() {
    return {
      currentRoom: this.currentRoom,
      currentPage: this.currentPage,
      historyLength: this.navigationHistory.length,
      totalRooms: Object.keys(this.rooms).length,
      totalPages: Object.keys(this.pages).length,
      totalSeasons: Object.keys(this.seasons).length
    };
  }
  
  /**
   * Check if initialized
   */
  isInitialized() {
    return this.rooms && this.pages && this.seasons;
  }
}

// Initialize Navigation Manager
window.NavigationManager = new NavigationManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationManager;
}

console.log('✅ Navigation Manager module loaded successfully');