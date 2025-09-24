// ===== GUIDE VIEWER MODULE =====
// Individual guide viewing system for House Maintenance Guide application

/**
 * Guide Viewer
 * Handles displaying individual maintenance guides with detailed content
 */
class GuideViewer {
  constructor() {
    // Current guide being viewed
    this.currentGuide = null;
    
    // View state
    this.isOpen = false;
    
    // Integration references
    this.integrationSystem = null;
    this.eventManager = null;
    this.searchSystem = null;
    
    this.init();
  }
  
  init() {
    console.log('📖 Guide Viewer initialized');
    this.createGuideViewerModal();
    this.setupEventListeners();
  }
  
  /**
   * Set integration system reference
   */
  setIntegrationSystem(integrationSystem) {
    this.integrationSystem = integrationSystem;
    this.eventManager = integrationSystem.getModule('EventManager');
    this.searchSystem = integrationSystem.getModule('SearchSystem');
    
    // Subscribe to events
    if (this.eventManager) {
      this.eventManager.on('SEARCH_RESULT_SELECTED', (data) => {
        this.openGuide(data.guide);
      });
      
      this.eventManager.on('ESCAPE_PRESSED', () => {
        if (this.isOpen) {
          this.closeGuide();
        }
      });
    }
  }
  
  /**
   * Create guide viewer modal
   */
  createGuideViewerModal() {
    const modal = document.createElement('div');
    modal.id = 'guideViewerModal';
    modal.className = 'guide-modal hidden';
    modal.innerHTML = `
      <div class="guide-modal-overlay"></div>
      <div class="guide-modal-content">
        <div class="guide-header">
          <button class="guide-back-btn" aria-label="Go back">
            <span class="material-icons">arrow_back</span>
          </button>
          <div class="guide-title-area">
            <h1 class="guide-title"></h1>
            <div class="guide-meta"></div>
          </div>
          <button class="guide-close-btn" aria-label="Close guide">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="guide-body">
          <div class="guide-content">
            <div class="guide-description"></div>
            <div class="guide-steps"></div>
            <div class="guide-tools"></div>
            <div class="guide-tips"></div>
          </div>
        </div>
        <div class="guide-footer">
          <button class="guide-action-btn favorite-btn">
            <span class="material-icons">favorite_border</span>
            Save Guide
          </button>
          <button class="guide-action-btn share-btn">
            <span class="material-icons">share</span>
            Share
          </button>
        </div>
      </div>
    `;
    
    // Add styles
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Add CSS for modal components
    this.addModalStyles();
  }
  
  /**
   * Add CSS styles for the modal
   */
  addModalStyles() {
    const style = document.createElement('style');
    style.id = 'guide-viewer-styles';
    style.textContent = `
      .guide-modal.show {
        opacity: 1;
        visibility: visible;
      }
      
      .guide-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }
      
      .guide-modal-content {
        position: relative;
        width: 90%;
        max-width: 800px;
        max-height: 90%;
        background: var(--card-background, white);
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .guide-header {
        display: flex;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--border-color, #e0e0e0);
        background: var(--header-background, #f8f9fa);
      }
      
      .guide-back-btn, .guide-close-btn {
        background: none;
        border: none;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        color: var(--text-secondary, #666);
        transition: all 0.2s ease;
      }
      
      .guide-back-btn:hover, .guide-close-btn:hover {
        background: var(--hover-background, #f0f0f0);
        color: var(--text-primary, #333);
      }
      
      .guide-title-area {
        flex: 1;
        margin: 0 16px;
      }
      
      .guide-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary, #333);
      }
      
      .guide-meta {
        display: flex;
        gap: 16px;
        margin-top: 8px;
        font-size: 0.9rem;
        color: var(--text-secondary, #666);
      }
      
      .guide-meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .guide-body {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
      }
      
      .guide-description {
        font-size: 1.1rem;
        line-height: 1.6;
        color: var(--text-primary, #333);
        margin-bottom: 24px;
      }
      
      .guide-section {
        margin-bottom: 24px;
      }
      
      .guide-section-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--primary-color, #007bff);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .guide-steps {
        counter-reset: step-counter;
      }
      
      .guide-step {
        counter-increment: step-counter;
        position: relative;
        padding: 16px;
        margin-bottom: 12px;
        background: var(--step-background, #f8f9fa);
        border-radius: 8px;
        border-left: 4px solid var(--primary-color, #007bff);
      }
      
      .guide-step:before {
        content: counter(step-counter);
        position: absolute;
        left: -2px;
        top: -8px;
        width: 24px;
        height: 24px;
        background: var(--primary-color, #007bff);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.9rem;
      }
      
      .guide-tools-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .tool-tag {
        background: var(--tag-background, #e9ecef);
        color: var(--tag-text, #495057);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9rem;
      }
      
      .guide-footer {
        padding: 20px;
        border-top: 1px solid var(--border-color, #e0e0e0);
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      
      .guide-action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border: 1px solid var(--border-color, #e0e0e0);
        background: var(--button-background, white);
        color: var(--text-primary, #333);
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
      }
      
      .guide-action-btn:hover {
        background: var(--button-hover, #f8f9fa);
        border-color: var(--primary-color, #007bff);
      }
      
      .guide-action-btn.favorited {
        background: var(--primary-color, #007bff);
        color: white;
      }
      
      @media (max-width: 768px) {
        .guide-modal-content {
          width: 100%;
          height: 100%;
          max-height: 100%;
          border-radius: 0;
        }
        
        .guide-header {
          padding: 16px;
        }
        
        .guide-title {
          font-size: 1.3rem;
        }
        
        .guide-body {
          padding: 20px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const modal = document.getElementById('guideViewerModal');
    if (!modal) return;
    
    // Close buttons
    const closeBtn = modal.querySelector('.guide-close-btn');
    const backBtn = modal.querySelector('.guide-back-btn');
    const overlay = modal.querySelector('.guide-modal-overlay');
    
    closeBtn?.addEventListener('click', () => this.closeGuide());
    backBtn?.addEventListener('click', () => this.closeGuide());
    overlay?.addEventListener('click', () => this.closeGuide());
    
    // Action buttons
    const favoriteBtn = modal.querySelector('.favorite-btn');
    const shareBtn = modal.querySelector('.share-btn');
    
    favoriteBtn?.addEventListener('click', () => this.toggleFavorite());
    shareBtn?.addEventListener('click', () => this.shareGuide());
    
    // Listen for guide selection from search results
    document.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.view-guide-btn');
      if (viewBtn) {
        const guideId = viewBtn.dataset.guideId;
        if (guideId && this.searchSystem) {
          const guide = this.searchSystem.guides.find(g => g.id === guideId);
          if (guide) {
            this.openGuide(guide);
          }
        }
      }
    });
  }
  
  /**
   * Open a guide
   */
  openGuide(guide) {
    if (!guide) return;
    
    this.currentGuide = guide;
    this.isOpen = true;
    
    // Populate modal content
    this.populateGuideContent(guide);
    
    // Show modal
    const modal = document.getElementById('guideViewerModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('show');
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    
    console.log(`📖 Opened guide: ${guide.title}`);
    
    // Emit event
    if (this.eventManager) {
      this.eventManager.emit('GUIDE_OPENED', { guide });
    }
  }
  
  /**
   * Close the guide
   */
  closeGuide() {
    this.isOpen = false;
    this.currentGuide = null;
    
    const modal = document.getElementById('guideViewerModal');
    if (modal) {
      modal.classList.remove('show');
      
      // Re-enable body scroll
      document.body.style.overflow = '';
      
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    }
    
    console.log('📖 Guide closed');
    
    // Emit event
    if (this.eventManager) {
      this.eventManager.emit('GUIDE_CLOSED');
    }
  }
  
  /**
   * Populate guide content in modal
   */
  populateGuideContent(guide) {
    const modal = document.getElementById('guideViewerModal');
    if (!modal) return;
    
    // Set title
    const titleEl = modal.querySelector('.guide-title');
    if (titleEl) titleEl.textContent = guide.title;
    
    // Set meta information
    const metaEl = modal.querySelector('.guide-meta');
    if (metaEl) {
      metaEl.innerHTML = `
        <div class="guide-meta-item">
          <span class="material-icons">room</span>
          ${guide.room}
        </div>
        <div class="guide-meta-item">
          <span class="material-icons">speed</span>
          ${guide.difficulty}
        </div>
        <div class="guide-meta-item">
          <span class="material-icons">schedule</span>
          ${guide.timeEstimate}
        </div>
      `;
    }
    
    // Set description
    const descEl = modal.querySelector('.guide-description');
    if (descEl) descEl.textContent = guide.description;
    
    // Set steps
    const stepsEl = modal.querySelector('.guide-steps');
    if (stepsEl) {
      const steps = this.generateSteps(guide);
      stepsEl.innerHTML = `
        <div class="guide-section">
          <h3 class="guide-section-title">
            <span class="material-icons">list</span>
            Steps to Fix
          </h3>
          ${steps.map(step => `
            <div class="guide-step">
              <strong>${step.title}</strong>
              <p>${step.description}</p>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // Set tools
    const toolsEl = modal.querySelector('.guide-tools');
    if (toolsEl && guide.tools) {
      toolsEl.innerHTML = `
        <div class="guide-section">
          <h3 class="guide-section-title">
            <span class="material-icons">build</span>
            Tools Needed
          </h3>
          <div class="guide-tools-list">
            ${guide.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
          </div>
        </div>
      `;
    }
    
    // Set tips
    const tipsEl = modal.querySelector('.guide-tips');
    if (tipsEl) {
      const tips = this.generateTips(guide);
      tipsEl.innerHTML = `
        <div class="guide-section">
          <h3 class="guide-section-title">
            <span class="material-icons">lightbulb</span>
            Pro Tips
          </h3>
          ${tips.map(tip => `
            <div class="guide-tip" style="padding: 12px; background: var(--tip-background, #fff3cd); border-radius: 6px; margin-bottom: 8px;">
              <strong>💡 ${tip.title}</strong>
              <p style="margin: 4px 0 0 0;">${tip.description}</p>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
  
  /**
   * Generate detailed steps for a guide
   */
  generateSteps(guide) {
    // Generate steps based on guide content
    const baseSteps = [
      {
        title: "Safety First",
        description: "Turn off power/water if needed and gather safety equipment."
      },
      {
        title: "Assess the Problem", 
        description: guide.content || "Identify the root cause of the issue."
      },
      {
        title: "Apply Solution",
        description: "Follow the repair procedure carefully."
      },
      {
        title: "Test and Verify",
        description: "Ensure the problem is resolved and everything works properly."
      }
    ];
    
    // Customize based on guide type
    if (guide.room === 'kitchen' && guide.title.includes('Drain')) {
      return [
        {
          title: "Clear Visible Debris",
          description: "Remove any visible food particles or debris from the drain opening."
        },
        {
          title: "Use Baking Soda Method",
          description: "Pour 1/2 cup baking soda down the drain, followed by 1/2 cup vinegar."
        },
        {
          title: "Let it Work",
          description: "Wait 15 minutes for the mixture to break down the clog."
        },
        {
          title: "Flush with Hot Water",
          description: "Pour several cups of hot water down the drain to clear the debris."
        }
      ];
    }
    
    return baseSteps;
  }
  
  /**
   * Generate tips for a guide
   */
  generateTips(guide) {
    const tips = [
      {
        title: "Prevention",
        description: "Regular maintenance prevents most issues from occurring."
      },
      {
        title: "When to Call a Pro",
        description: "If you're unsure or the problem persists, consult a professional."
      }
    ];
    
    // Add specific tips based on guide type
    if (guide.difficulty === 'easy') {
      tips.unshift({
        title: "Perfect for Beginners",
        description: "This is a great DIY project that most homeowners can handle."
      });
    }
    
    return tips;
  }
  
  /**
   * Toggle favorite status
   */
  toggleFavorite() {
    if (!this.currentGuide) return;
    
    const btn = document.querySelector('.favorite-btn');
    if (!btn) return;
    
    const icon = btn.querySelector('.material-icons');
    const text = btn.lastChild;
    
    if (btn.classList.contains('favorited')) {
      // Remove from favorites
      btn.classList.remove('favorited');
      if (icon) icon.textContent = 'favorite_border';
      text.textContent = ' Save Guide';
      
      this.removeFromFavorites(this.currentGuide.id);
    } else {
      // Add to favorites
      btn.classList.add('favorited');
      if (icon) icon.textContent = 'favorite';
      text.textContent = ' Saved!';
      
      this.addToFavorites(this.currentGuide);
    }
  }
  
  /**
   * Share guide
   */
  shareGuide() {
    if (!this.currentGuide) return;
    
    const shareData = {
      title: this.currentGuide.title,
      text: this.currentGuide.description,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback - copy to clipboard
      const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.showNotification('Guide link copied to clipboard!');
      });
    }
  }
  
  /**
   * Add guide to favorites
   */
  addToFavorites(guide) {
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteGuides') || '[]');
      if (!favorites.find(f => f.id === guide.id)) {
        favorites.push(guide);
        localStorage.setItem('favoriteGuides', JSON.stringify(favorites));
      }
    } catch (error) {
      console.warn('Could not save to favorites:', error);
    }
  }
  
  /**
   * Remove guide from favorites
   */
  removeFromFavorites(guideId) {
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteGuides') || '[]');
      const updated = favorites.filter(f => f.id !== guideId);
      localStorage.setItem('favoriteGuides', JSON.stringify(updated));
    } catch (error) {
      console.warn('Could not remove from favorites:', error);
    }
  }
  
  /**
   * Show notification
   */
  showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color, #007bff);
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 3000;
      font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  /**
   * Check if initialized
   */
  isInitialized() {
    return document.getElementById('guideViewerModal') !== null;
  }
}

// Initialize Guide Viewer
window.GuideViewer = new GuideViewer();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GuideViewer;
}

console.log('✅ Guide Viewer module loaded successfully');