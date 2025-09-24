// ===== SEARCH SYSTEM MODULE =====
// Full-text search system for House Maintenance Guide application

/**
 * Search System
 * Handles full-text search, indexing, filtering, and search suggestions
 */
class SearchSystem {
  constructor() {
    // Search index and data
    this.searchIndex = new Map();
    this.guides = [];
    this.searchHistory = [];
    this.maxHistoryItems = 20;
    
    // Search configuration
    this.searchConfig = {
      minQueryLength: 2,
      maxResults: 20,
      highlightClass: 'search-highlight',
      debounceDelay: 300
    };
    
    // Search filters
    this.activeFilters = ['all'];
    this.availableFilters = {
      'all': { label: 'All', count: 0 },
      'kitchen': { label: 'Kitchen', count: 0 },
      'bathroom': { label: 'Bathroom', count: 0 },
      'bedroom': { label: 'Bedroom', count: 0 },
      'living-room': { label: 'Living Room', count: 0 },
      'office': { label: 'Home Office', count: 0 },
      'outdoor': { label: 'Outdoor', count: 0 },
      'emergency': { label: 'Emergency', count: 0 },
      'seasonal': { label: 'Seasonal', count: 0 }
    };
    
    // Performance tracking
    this.searchMetrics = {
      totalSearches: 0,
      averageResponseTime: 0,
      totalIndexedItems: 0
    };
    
    // Integration references
    this.integrationSystem = null;
    this.eventManager = null;
    this.domSafetyManager = null;
    
    // Initialize
    this.init();
  }
  
  async init() {
    console.log('🔍 Search System initialized');
    
    // Load search data
    await this.loadSearchData();
    
    // Build search index
    this.buildSearchIndex();
    
    // Setup search UI
    this.setupSearchUI();
    
    // Load search history from localStorage
    this.loadSearchHistory();
  }
  
  /**
   * Set integration system reference
   */
  setIntegrationSystem(integrationSystem) {
    this.integrationSystem = integrationSystem;
    this.eventManager = integrationSystem.getModule('EventManager');
    this.domSafetyManager = integrationSystem.getModule('DOMSafetyManager');
    
    // Subscribe to search events
    if (this.eventManager) {
      this.eventManager.on('SEARCH_QUERY_CHANGED', (data) => {
        this.handleSearchInput(data.query, data.element);
      });
      
      this.eventManager.on('FILTER_SELECTED', (data) => {
        this.handleFilterChange(data.filter, data.element);
      });
      
      this.eventManager.on('ESCAPE_PRESSED', () => {
        this.clearSearch();
      });
    }
  }
  
  /**
   * Load search data (maintenance guides)
   */
  async loadSearchData() {
    try {
      // Check if guides.json exists
      const response = await fetch('content/guides.json');
      if (response.ok) {
        const data = await response.json();
        this.guides = data.guides || [];
      } else {
        // Fallback to mock data
        this.guides = this.generateMockGuides();
      }
      
      console.log(`📚 Loaded ${this.guides.length} maintenance guides`);
      this.searchMetrics.totalIndexedItems = this.guides.length;
      
      // Update filter counts
      this.updateFilterCounts();
      
    } catch (error) {
      console.warn('Could not load guides.json, using mock data');
      this.guides = this.generateMockGuides();
      this.searchMetrics.totalIndexedItems = this.guides.length;
      this.updateFilterCounts();
    }
  }
  
  /**
   * Generate mock maintenance guides data
   */
  generateMockGuides() {
    return [
      // Kitchen guides
      {
        id: 'kitchen-001',
        title: 'Blocked Kitchen Drain',
        description: 'Fix clogged kitchen sink drains using common household items',
        content: 'Use baking soda and vinegar mixture, followed by hot water flush. Check garbage disposal if present.',
        room: 'kitchen',
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        tools: ['plunger', 'baking soda', 'vinegar'],
        keywords: ['drain', 'clog', 'sink', 'water', 'backup']
      },
      {
        id: 'kitchen-002',
        title: 'Leaky Faucet Repair',
        description: 'Stop dripping faucets by replacing washers and O-rings',
        content: 'Turn off water supply, disassemble faucet, replace worn washers and O-rings, reassemble.',
        room: 'kitchen',
        difficulty: 'medium',
        timeEstimate: '30-60 minutes',
        tools: ['wrench', 'screwdriver', 'washers', 'O-rings'],
        keywords: ['faucet', 'leak', 'drip', 'water', 'washer']
      },
      {
        id: 'kitchen-003',
        title: 'Garbage Disposal Issues',
        description: 'Troubleshoot common garbage disposal problems',
        content: 'Check for clogs, reset button, ensure proper electrical connection, clean thoroughly.',
        room: 'kitchen',
        difficulty: 'medium',
        timeEstimate: '20-45 minutes',
        tools: ['flashlight', 'tongs', 'hex key'],
        keywords: ['disposal', 'garbage', 'jam', 'clog', 'motor']
      },
      
      // Bathroom guides
      {
        id: 'bathroom-001',
        title: 'Toilet Running Constantly',
        description: 'Fix toilets that won\'t stop running water',
        content: 'Check flapper seal, adjust chain length, replace flapper if warped, adjust water level.',
        room: 'bathroom',
        difficulty: 'easy',
        timeEstimate: '10-20 minutes',
        tools: ['none required'],
        keywords: ['toilet', 'running', 'flapper', 'chain', 'water']
      },
      {
        id: 'bathroom-002',
        title: 'Shower Low Water Pressure',
        description: 'Improve weak shower water flow',
        content: 'Clean showerhead, check for mineral buildup, replace if necessary, check water pressure.',
        room: 'bathroom',
        difficulty: 'easy',
        timeEstimate: '15-30 minutes',
        tools: ['vinegar', 'plastic bag', 'rubber band'],
        keywords: ['shower', 'pressure', 'flow', 'showerhead', 'water']
      },
      {
        id: 'bathroom-003',
        title: 'Caulk Replacement',
        description: 'Re-caulk bathroom fixtures to prevent water damage',
        content: 'Remove old caulk, clean surface, apply new caulk in continuous bead, smooth with finger.',
        room: 'bathroom',
        difficulty: 'medium',
        timeEstimate: '45-90 minutes',
        tools: ['caulk gun', 'silicone caulk', 'scraper', 'cleaning supplies'],
        keywords: ['caulk', 'seal', 'water', 'damage', 'mold']
      },
      
      // Living room guides
      {
        id: 'living-room-001',
        title: 'Squeaky Floor Repair',
        description: 'Eliminate annoying floor squeaks and creaks',
        content: 'Locate squeak source, secure loose subfloor, add screws to joists, use graphite for minor squeaks.',
        room: 'living-room',
        difficulty: 'medium',
        timeEstimate: '30-60 minutes',
        tools: ['drill', 'screws', 'stud finder', 'graphite'],
        keywords: ['floor', 'squeak', 'creak', 'noise', 'subfloor']
      },
      {
        id: 'living-room-002',
        title: 'Thermostat Problems',
        description: 'Troubleshoot heating and cooling control issues',
        content: 'Check batteries, verify wiring connections, calibrate temperature, replace if faulty.',
        room: 'living-room',
        difficulty: 'medium',
        timeEstimate: '20-40 minutes',
        tools: ['screwdriver', 'multimeter', 'batteries'],
        keywords: ['thermostat', 'heating', 'cooling', 'temperature', 'HVAC']
      },
      
      // Bedroom guides
      {
        id: 'bedroom-001',
        title: 'Electrical Outlet Not Working',
        description: 'Fix dead electrical outlets safely',
        content: 'Check circuit breaker, test GFCI reset, inspect wiring connections, replace outlet if needed.',
        room: 'bedroom',
        difficulty: 'medium',
        timeEstimate: '30-45 minutes',
        tools: ['voltage tester', 'screwdriver', 'wire nuts'],
        keywords: ['outlet', 'electrical', 'power', 'breaker', 'GFCI']
      },
      {
        id: 'bedroom-002',
        title: 'Window Won\'t Open or Close',
        description: 'Repair stuck or difficult windows',
        content: 'Clean tracks, lubricate hinges, adjust sash balance, repair broken cords.',
        room: 'bedroom',
        difficulty: 'medium',
        timeEstimate: '45-90 minutes',
        tools: ['lubricant', 'screwdriver', 'putty knife'],
        keywords: ['window', 'stuck', 'sash', 'balance', 'tracks']
      },
      
      // Outdoor guides
      {
        id: 'outdoor-001',
        title: 'Gutter Cleaning and Repair',
        description: 'Maintain proper water drainage from roof',
        content: 'Remove debris, check for leaks, ensure proper slope, secure loose brackets.',
        room: 'outdoor',
        difficulty: 'medium',
        timeEstimate: '2-4 hours',
        tools: ['ladder', 'gloves', 'trowel', 'hose'],
        keywords: ['gutter', 'roof', 'drainage', 'water', 'debris']
      },
      {
        id: 'outdoor-002',
        title: 'Sprinkler System Issues',
        description: 'Fix common irrigation problems',
        content: 'Check water pressure, clean clogged heads, adjust spray patterns, repair broken lines.',
        room: 'outdoor',
        difficulty: 'medium',
        timeEstimate: '1-3 hours',
        tools: ['shovel', 'PVC fittings', 'pipe cutter'],
        keywords: ['sprinkler', 'irrigation', 'water', 'pressure', 'landscape']
      },
      
      // Emergency guides
      {
        id: 'emergency-001',
        title: 'Water Main Shut-off',
        description: 'Emergency water supply shutdown procedures',
        content: 'Locate main water valve, turn clockwise to close, notify utility company if needed.',
        room: 'emergency',
        difficulty: 'easy',
        timeEstimate: '5-10 minutes',
        tools: ['water meter key', 'flashlight'],
        keywords: ['water', 'emergency', 'shutoff', 'main', 'valve']
      },
      {
        id: 'emergency-002',
        title: 'Circuit Breaker Tripped',
        description: 'Safely reset electrical circuit breakers',
        content: 'Identify tripped breaker, turn fully off then on, investigate cause of trip.',
        room: 'emergency',
        difficulty: 'easy',
        timeEstimate: '5-15 minutes',
        tools: ['flashlight'],
        keywords: ['breaker', 'electrical', 'power', 'trip', 'reset']
      }
    ];
  }
  
  /**
   * Build search index for fast searching
   */
  buildSearchIndex() {
    console.log('🏗️ Building search index...');
    this.searchIndex.clear();
    
    this.guides.forEach(guide => {
      // Create searchable text from all fields
      const searchText = [
        guide.title,
        guide.description,
        guide.content,
        guide.room,
        guide.difficulty,
        ...(guide.keywords || []),
        ...(guide.tools || [])
      ].join(' ').toLowerCase();
      
      // Index by individual words
      const words = searchText.split(/\s+/);
      words.forEach(word => {
        if (word.length >= 2) { // Skip very short words
          if (!this.searchIndex.has(word)) {
            this.searchIndex.set(word, []);
          }
          this.searchIndex.get(word).push(guide);
        }
      });
    });
    
    console.log(`📖 Search index built with ${this.searchIndex.size} unique terms`);
  }
  
  /**
   * Setup search UI elements
   */
  setupSearchUI() {
    // Setup search suggestions container
    this.createSearchSuggestionsContainer();
    
    // Setup search results container
    this.createSearchResultsContainer();
    
    // Update filter UI with counts
    this.updateFilterUI();
  }
  
  /**
   * Create search suggestions container
   */
  createSearchSuggestionsContainer() {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;
    
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'searchSuggestions';
    suggestionsContainer.className = 'search-suggestions hidden';
    suggestionsContainer.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--card-background, white);
      border: 1px solid var(--border-color, #e0e0e0);
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 12px var(--shadow-color, rgba(0,0,0,0.1));
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
    `;
    
    searchContainer.appendChild(suggestionsContainer);
    searchContainer.style.position = 'relative';
  }
  
  /**
   * Create search results container
   */
  createSearchResultsContainer() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    const resultsContainer = document.createElement('section');
    resultsContainer.id = 'searchResults';
    resultsContainer.className = 'search-results-section hidden';
    resultsContainer.innerHTML = `
      <div class="search-results-header">
        <h2>Search Results</h2>
        <button class="close-search" aria-label="Close search">×</button>
      </div>
      <div class="search-results-content"></div>
    `;
    
    // Insert after hero section
    const heroSection = mainContent.querySelector('.hero-section');
    if (heroSection) {
      heroSection.insertAdjacentElement('afterend', resultsContainer);
    } else {
      mainContent.insertBefore(resultsContainer, mainContent.firstChild);
    }
    
    // Setup close button
    const closeButton = resultsContainer.querySelector('.close-search');
    closeButton?.addEventListener('click', () => this.clearSearch());
  }
  
  /**
   * Handle search input changes
   */
  handleSearchInput(query, element) {
    const startTime = performance.now();
    
    if (!query || query.length < this.searchConfig.minQueryLength) {
      this.hideSuggestions();
      this.hideSearchResults();
      return;
    }
    
    // Perform search
    const results = this.performSearch(query);
    
    // Update metrics
    this.searchMetrics.totalSearches++;
    const responseTime = performance.now() - startTime;
    this.searchMetrics.averageResponseTime = 
      (this.searchMetrics.averageResponseTime + responseTime) / 2;
    
    // Show suggestions
    this.showSuggestions(query, results.slice(0, 5));
    
    // Add to search history
    this.addToSearchHistory(query);
    
    // If Enter was pressed, show full results
    if (results.length > 0) {
      this.showSearchResults(query, results);
    }
  }
  
  /**
   * Perform search query
   */
  performSearch(query) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const resultMap = new Map();
    
    // Search through index
    queryWords.forEach(word => {
      if (this.searchIndex.has(word)) {
        this.searchIndex.get(word).forEach(guide => {
          const score = resultMap.get(guide.id) || 0;
          resultMap.set(guide.id, score + 1);
        });
      }
      
      // Partial word matching
      this.searchIndex.forEach((guides, indexedWord) => {
        if (indexedWord.includes(word)) {
          guides.forEach(guide => {
            const score = resultMap.get(guide.id) || 0;
            resultMap.set(guide.id, score + 0.5); // Lower score for partial matches
          });
        }
      });
    });
    
    // Convert to array and sort by relevance score
    const results = Array.from(resultMap.entries())
      .map(([guideId, score]) => ({
        guide: this.guides.find(g => g.id === guideId),
        score
      }))
      .filter(result => result.guide)
      .sort((a, b) => b.score - a.score)
      .map(result => result.guide);
    
    // Apply active filters
    return this.applyFilters(results);
  }
  
  /**
   * Apply active filters to search results
   */
  applyFilters(results) {
    if (this.activeFilters.includes('all')) {
      return results;
    }
    
    return results.filter(guide => 
      this.activeFilters.some(filter => 
        guide.room === filter || 
        (filter === 'emergency' && guide.room === 'emergency') ||
        (filter === 'seasonal' && guide.keywords?.includes('seasonal'))
      )
    );
  }
  
  /**
   * Show search suggestions
   */
  showSuggestions(query, suggestions) {
    const container = document.getElementById('searchSuggestions');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (suggestions.length === 0) {
      container.innerHTML = '<div class="no-suggestions">No suggestions found</div>';
    } else {
      suggestions.forEach(guide => {
        const suggestion = document.createElement('div');
        suggestion.className = 'search-suggestion';
        suggestion.innerHTML = `
          <div class="suggestion-icon">
            <span class="material-icons">${this.getRoomIcon(guide.room)}</span>
          </div>
          <div class="suggestion-content">
            <div class="suggestion-title">${this.highlightMatch(guide.title, query)}</div>
            <div class="suggestion-meta">${guide.room} • ${guide.difficulty}</div>
          </div>
        `;
        
        suggestion.addEventListener('click', () => {
          this.selectSuggestion(guide);
        });
        
        container.appendChild(suggestion);
      });
    }
    
    container.classList.remove('hidden');
  }
  
  /**
   * Hide search suggestions
   */
  hideSuggestions() {
    const container = document.getElementById('searchSuggestions');
    if (container) {
      container.classList.add('hidden');
    }
  }
  
  /**
   * Show search results
   */
  showSearchResults(query, results) {
    const section = document.getElementById('searchResults');
    const content = section?.querySelector('.search-results-content');
    
    if (!section || !content) return;
    
    // Hide other sections
    document.querySelectorAll('.main-content > section:not(#searchResults)').forEach(s => {
      s.style.display = 'none';
    });
    
    // Show results section
    section.classList.remove('hidden');
    
    // Update header
    const header = section.querySelector('h2');
    if (header) {
      header.textContent = `Search Results for "${query}" (${results.length})`;
    }
    
    // Display results
    if (results.length === 0) {
      content.innerHTML = `
        <div class="no-results">
          <span class="material-icons">search_off</span>
          <h3>No results found</h3>
          <p>Try different keywords or check your spelling</p>
        </div>
      `;
    } else {
      content.innerHTML = results.slice(0, this.searchConfig.maxResults)
        .map(guide => this.createResultHTML(guide, query))
        .join('');
    }
  }
  
  /**
   * Hide search results
   */
  hideSearchResults() {
    const section = document.getElementById('searchResults');
    if (section) {
      section.classList.add('hidden');
    }
    
    // Show other sections
    document.querySelectorAll('.main-content > section:not(#searchResults)').forEach(s => {
      s.style.display = '';
    });
  }
  
  /**
   * Create HTML for search result
   */
  createResultHTML(guide, query) {
    return `
      <div class="search-result-item" data-guide-id="${guide.id}">
        <div class="result-icon">
          <span class="material-icons">${this.getRoomIcon(guide.room)}</span>
        </div>
        <div class="result-content">
          <h3 class="result-title">${this.highlightMatch(guide.title, query)}</h3>
          <p class="result-description">${this.highlightMatch(guide.description, query)}</p>
          <div class="result-meta">
            <span class="result-room">${guide.room}</span>
            <span class="result-difficulty ${guide.difficulty}">${guide.difficulty}</span>
            <span class="result-time">${guide.timeEstimate}</span>
          </div>
          <div class="result-tools">
            <span class="tools-label">Tools needed:</span>
            ${guide.tools?.join(', ') || 'None'}
          </div>
        </div>
        <div class="result-actions">
          <button class="view-guide-btn" data-guide-id="${guide.id}">View Guide</button>
        </div>
      </div>
    `;
  }
  
  /**
   * Handle filter changes
   */
  handleFilterChange(filter, element) {
    // Update active filters
    this.activeFilters = [filter];
    
    // Re-run current search if active
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
      this.handleSearchInput(searchInput.value, searchInput);
    }
    
    console.log(`🔽 Filter changed to: ${filter}`);
  }
  
  /**
   * Select a search suggestion
   */
  selectSuggestion(guide) {
    this.hideSuggestions();
    
    // Fill search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = guide.title;
    }
    
    // Show full results
    this.showSearchResults(guide.title, [guide]);
    
    // Emit navigation event
    if (this.eventManager) {
      this.eventManager.emit('SEARCH_RESULT_SELECTED', {
        guide,
        source: 'suggestion'
      });
    }
  }
  
  /**
   * Clear search
   */
  clearSearch() {
    // Clear input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Hide suggestions and results
    this.hideSuggestions();
    this.hideSearchResults();
    
    console.log('🧹 Search cleared');
  }
  
  /**
   * Highlight matching text
   */
  highlightMatch(text, query) {
    if (!query) return text;
    
    const words = query.split(/\s+/);
    let highlightedText = text;
    
    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, `<mark class="${this.searchConfig.highlightClass}">$1</mark>`);
    });
    
    return highlightedText;
  }
  
  /**
   * Get icon for room
   */
  getRoomIcon(room) {
    const icons = {
      'kitchen': 'kitchen',
      'bathroom': 'bathtub',
      'bedroom': 'bed',
      'living-room': 'weekend',
      'office': 'computer',
      'outdoor': 'yard',
      'emergency': 'warning'
    };
    
    return icons[room] || 'build';
  }
  
  /**
   * Update filter counts
   */
  updateFilterCounts() {
    // Reset counts
    Object.keys(this.availableFilters).forEach(key => {
      this.availableFilters[key].count = 0;
    });
    
    // Count guides by room
    this.guides.forEach(guide => {
      if (this.availableFilters[guide.room]) {
        this.availableFilters[guide.room].count++;
      }
      this.availableFilters.all.count++;
    });
  }
  
  /**
   * Update filter UI with counts
   */
  updateFilterUI() {
    const filterChips = document.querySelectorAll('.chip[data-filter]');
    filterChips.forEach(chip => {
      const filter = chip.dataset.filter;
      if (this.availableFilters[filter]) {
        const count = this.availableFilters[filter].count;
        if (count > 0) {
          chip.setAttribute('title', `${count} guides available`);
        }
      }
    });
  }
  
  /**
   * Add query to search history
   */
  addToSearchHistory(query) {
    if (!query || query.length < this.searchConfig.minQueryLength) return;
    
    // Remove existing instance
    const index = this.searchHistory.indexOf(query);
    if (index > -1) {
      this.searchHistory.splice(index, 1);
    }
    
    // Add to beginning
    this.searchHistory.unshift(query);
    
    // Limit size
    if (this.searchHistory.length > this.maxHistoryItems) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
    }
    
    // Save to localStorage
    this.saveSearchHistory();
  }
  
  /**
   * Load search history from localStorage
   */
  loadSearchHistory() {
    try {
      const stored = localStorage.getItem('searchHistory');
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Could not load search history:', error);
      this.searchHistory = [];
    }
  }
  
  /**
   * Save search history to localStorage
   */
  saveSearchHistory() {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.warn('Could not save search history:', error);
    }
  }
  
  /**
   * Get search statistics
   */
  getStats() {
    return {
      ...this.searchMetrics,
      indexSize: this.searchIndex.size,
      totalGuides: this.guides.length,
      historySize: this.searchHistory.length,
      activeFilters: this.activeFilters.length
    };
  }
  
  /**
   * Check if initialized
   */
  isInitialized() {
    return this.searchIndex && this.guides.length > 0;
  }
}

// Initialize Search System
window.SearchSystem = new SearchSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SearchSystem;
}

console.log('✅ Search System module loaded successfully');