// NDI House Maintenance App - Main JavaScript

class QwenApp {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupEventListeners();
    this.setupSearch();
    this.setupNavigation();
    this.setupFilters();
  }

  // Theme Management
  setupTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateThemeIcon();
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('.material-icons');
    icon.textContent = this.currentTheme === 'light' ? 'dark_mode' : 'light_mode';
  }

  // Event Listeners
  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => this.toggleTheme());

    // Room cards
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
      card.addEventListener('click', (e) => this.handleRoomClick(e));
    });

    // Issue items
    const issueItems = document.querySelectorAll('.issue-item');
    issueItems.forEach(item => {
      item.addEventListener('click', (e) => this.handleIssueClick(e));
    });

    // Seasonal tasks
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
      card.addEventListener('click', (e) => this.handleTaskClick(e));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
  }

  // Search Functionality
  setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.performSearch(e.target.value);
      }
    });
  }

  performSearch(query) {
    if (!query.trim()) {
      this.clearSearchResults();
      return;
    }

    // Simulate search results (in a real app, this would query your data)
    const mockResults = this.getMockSearchResults(query);
    this.displaySearchResults(mockResults);
  }

  getMockSearchResults(query) {
    const allIssues = [
      { title: 'Blocked Kitchen Drain', room: 'kitchen', type: 'diy', description: 'Use baking soda and vinegar mixture' },
      { title: 'Leaky Faucet', room: 'kitchen', type: 'diy', description: 'Replace washers and O-rings' },
      { title: 'Flickering Lights', room: 'bedroom', type: 'professional', description: 'Electrical work required' },
      { title: 'Toilet Running', room: 'bathroom', type: 'diy', description: 'Adjust flapper and chain' },
      { title: 'Heating Problems', room: 'living-room', type: 'mixed', description: 'Check filters first' },
      { title: 'Mold Growth', room: 'bathroom', type: 'professional', description: 'May require remediation' }
    ];

    return allIssues.filter(issue =>
      issue.title.toLowerCase().includes(query.toLowerCase()) ||
      issue.room.toLowerCase().includes(query.toLowerCase()) ||
      issue.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  displaySearchResults(results) {
    // In a real implementation, you'd update the UI with search results
    console.log('Search results:', results);

    // For demo purposes, show an alert
    if (results.length > 0) {
      const resultTitles = results.map(r => r.title).join(', ');
      this.showNotification(`Found ${results.length} results: ${resultTitles}`);
    } else {
      this.showNotification('No results found. Try a different search term.');
    }
  }

  clearSearchResults() {
    // Clear search results display
    console.log('Clearing search results');
  }

  // Navigation
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => this.handleNavClick(e));
    });
  }

  handleNavClick(e) {
    const navItem = e.currentTarget;
    const page = navItem.dataset.page;

    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to clicked item
    navItem.classList.add('active');

    // Handle navigation (in a real app, this would change views)
    this.navigateToPage(page);
  }

  navigateToPage(page) {
    console.log(`Navigating to: ${page}`);

    switch(page) {
      case 'home':
        this.showNotification('You are on the Home page');
        break;
      case 'search':
        document.getElementById('searchInput').focus();
        this.showNotification('Search focused');
        break;
      case 'favorites':
        this.showNotification('Favorites page - Coming soon!');
        break;
      case 'emergency':
        this.showEmergencyInfo();
        break;
    }
  }

  // Filter Management
  setupFilters() {
    const filterChips = document.querySelectorAll('.chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', (e) => this.handleFilterClick(e));
    });
  }

  handleFilterClick(e) {
    const chip = e.currentTarget;
    const filter = chip.dataset.filter;

    // Remove active class from all chips
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));

    // Add active class to clicked chip
    chip.classList.add('active');

    // Apply filter
    this.applyFilter(filter);
  }

  applyFilter(filter) {
    console.log(`Applying filter: ${filter}`);

    if (filter === 'all') {
      this.showNotification('Showing all rooms');
      return;
    }

    // In a real app, this would filter the displayed content
    this.showNotification(`Filtering by: ${filter}`);
  }

  // Click Handlers
  handleRoomClick(e) {
    const roomCard = e.currentTarget;
    const room = roomCard.dataset.room;

    // Add click animation
    roomCard.style.transform = 'scale(0.98)';
    setTimeout(() => {
      roomCard.style.transform = '';
    }, 150);

    this.showNotification(`Opening ${room} maintenance guide...`);

    // In a real app, this would navigate to the room's detail page
    setTimeout(() => {
      this.loadRoomGuide(room);
    }, 300);
  }

  handleIssueClick(e) {
    const issueItem = e.currentTarget;
    const issueTitle = issueItem.querySelector('h4').textContent;

    this.showNotification(`Opening guide: ${issueTitle}`);

    // In a real app, this would open the specific issue guide
    setTimeout(() => {
      this.loadIssueGuide(issueTitle);
    }, 300);
  }

  handleTaskClick(e) {
    const taskCard = e.currentTarget;
    const taskTitle = taskCard.querySelector('h3').textContent;

    this.showNotification(`Opening seasonal task: ${taskTitle}`);
  }

  // Keyboard Navigation
  handleKeyNavigation(e) {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'k':
          e.preventDefault();
          document.getElementById('searchInput').focus();
          break;
        case 'd':
          e.preventDefault();
          this.toggleTheme();
          break;
      }
    }

    // Handle escape key
    if (e.key === 'Escape') {
      document.getElementById('searchInput').blur();
      this.clearSearchResults();
    }
  }

  // Utility Functions
  showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 140px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--primary-color);
      color: var(--text-color);
      padding: 12px 24px;
      border-radius: 8px;
      font-family: var(--font-family);
      font-weight: 500;
      z-index: 1000;
      box-shadow: 0 4px 12px var(--shadow-color);
      animation: slideDown 0.3s ease;
    `;

    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  showEmergencyInfo() {
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

  loadRoomGuide(room) {
    // In a real app, this would load the room-specific guide
    console.log(`Loading guide for: ${room}`);

    // For demo, show some sample content
    const roomGuides = {
      'kitchen': 'Kitchen Guide: 10 common problems including blocked drains, leaky faucets, and appliance issues.',
      'bathroom': 'Bathroom Guide: 10 common problems including water leaks, blocked drains, and ventilation issues.',
      'bedroom': 'Bedroom Guide: 10 common problems including poor ventilation, heating issues, and electrical problems.',
      'living-room': 'Living Room Guide: 10 common problems including heating/cooling, electrical, and flooring issues.',
      'office': 'Home Office Guide: 10 common problems including electrical overload, lighting, and ventilation.',
      'outdoor': 'Outdoor Guide: 10 common problems including drainage, roofing, and landscaping issues.'
    };

    this.showNotification(roomGuides[room] || 'Guide loading...');
  }

  loadIssueGuide(issueTitle) {
    // In a real app, this would load the specific issue guide
    console.log(`Loading issue guide: ${issueTitle}`);
    this.showNotification(`Loading detailed guide for: ${issueTitle}`);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.qwenApp = new QwenApp();

  // Add some helpful keyboard shortcuts info
  console.log(`
🔧 QWEN House Maintenance App Loaded!

Keyboard Shortcuts:
• Ctrl/Cmd + K: Focus search
• Ctrl/Cmd + D: Toggle dark mode
• Escape: Clear search

Features:
• Mobile-first responsive design
• Dark/Light mode toggle
• Search functionality
• Room-based navigation
• Seasonal maintenance tasks
  `);
});

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment when you add a service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(error => console.log('SW registration failed'));
  });
}
