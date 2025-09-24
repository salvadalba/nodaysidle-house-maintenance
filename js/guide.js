// Guide Page Specific JavaScript

class GuideApp {
  constructor() {
    this.isFavorited = false;
    this.init();
  }

  init() {
    this.setupFavoriteButton();
    this.setupShareButton();
    this.setupPrintButton();
    this.setupStepTracking();
    this.loadFavoriteState();
  }

  // Favorite functionality
  setupFavoriteButton() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => this.toggleFavorite());
    }
  }

  toggleFavorite() {
    this.isFavorited = !this.isFavorited;
    this.updateFavoriteButton();
    this.saveFavoriteState();

    const message = this.isFavorited ? 'Added to favorites' : 'Removed from favorites';
    this.showNotification(message);
  }

  updateFavoriteButton() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const icon = favoriteBtn.querySelector('.material-icons');

    if (this.isFavorited) {
      icon.textContent = 'favorite';
      icon.style.color = 'var(--accent-red)';
      favoriteBtn.classList.add('active');
    } else {
      icon.textContent = 'favorite_border';
      icon.style.color = 'var(--text-color)';
      favoriteBtn.classList.remove('active');
    }
  }

  saveFavoriteState() {
    const guideId = this.getGuideId();
    const favorites = JSON.parse(localStorage.getItem('ndi-favorites') || '[]');

    if (this.isFavorited) {
      if (!favorites.includes(guideId)) {
        favorites.push(guideId);
      }
    } else {
      const index = favorites.indexOf(guideId);
      if (index > -1) {
        favorites.splice(index, 1);
      }
    }

    localStorage.setItem('ndi-favorites', JSON.stringify(favorites));
  }

  loadFavoriteState() {
    const guideId = this.getGuideId();
    const favorites = JSON.parse(localStorage.getItem('NDI-favorites') || '[]');
    this.isFavorited = favorites.includes(guideId);
    this.updateFavoriteButton();
  }

  getGuideId() {
    // In a real app, this would be based on the actual guide
    return window.location.pathname + window.location.search;
  }

  // Share functionality
  setupShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareGuide());
    }
  }

  async shareGuide() {
    const shareData = {
      title: document.querySelector('.guide-header h1').textContent,
      text: 'Check out this helpful maintenance guide from NDI',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        this.showNotification('Guide shared successfully');
      } else {
        // Fallback for browsers without Web Share API
        await navigator.clipboard.writeText(window.location.href);
        this.showNotification('Link copied to clipboard');
      }
    } catch (error) {
      console.log('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        this.showNotification('Link copied to clipboard');
      } catch (clipboardError) {
        this.showNotification('Unable to share - please copy the URL manually');
      }
    }
  }

  // Print functionality
  setupPrintButton() {
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => this.printGuide());
    }
  }

  printGuide() {
    // Open all accordion steps before printing
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
      step.setAttribute('open', '');
    });

    // Small delay to ensure all content is expanded
    setTimeout(() => {
      window.print();
    }, 100);

    this.showNotification('Opening print dialog...');
  }

  // Step tracking
  setupStepTracking() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      step.addEventListener('toggle', () => {
        if (step.hasAttribute('open')) {
          this.trackStepOpen(index + 1);
        }
      });
    });
  }

  trackStepOpen(stepNumber) {
    console.log(`Step ${stepNumber} opened`);

    // In a real app, you might track this for analytics
    // or to save user progress
    const progress = this.getProgress();
    if (!progress.includes(stepNumber)) {
      progress.push(stepNumber);
      this.saveProgress(progress);
    }
  }

  getProgress() {
    const guideId = this.getGuideId();
    const allProgress = JSON.parse(localStorage.getItem('ndi-progress') || '{}');
    return allProgress[guideId] || [];
  }

  saveProgress(progress) {
    const guideId = this.getGuideId();
    const allProgress = JSON.parse(localStorage.getItem('ndi-progress') || '{}');
    allProgress[guideId] = progress;
    localStorage.setItem('ndi-progress', JSON.stringify(allProgress));
  }

  // Utility function for notifications
  showNotification(message) {
    // Reuse the notification system from the main app
    if (window.qwenApp && window.qwenApp.showNotification) {
      window.qwenApp.showNotification(message);
    } else {
      // Fallback notification
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 100px;
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
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  }
}

// Enhanced step interaction
document.addEventListener('DOMContentLoaded', () => {
  // Initialize guide app
  window.guideApp = new GuideApp();

  // Add smooth scrolling to step navigation
  const steps = document.querySelectorAll('.step summary');
  steps.forEach(summary => {
    summary.addEventListener('click', (e) => {
      // Small delay to allow the accordion to open
      setTimeout(() => {
        const step = e.target.closest('.step');
        if (step.hasAttribute('open')) {
          step.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    });
  });

  // Add keyboard navigation for steps
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const focusedElement = document.activeElement;
      if (focusedElement.tagName === 'SUMMARY') {
        e.preventDefault();
        const allSummaries = Array.from(document.querySelectorAll('.step summary'));
        const currentIndex = allSummaries.indexOf(focusedElement);

        let nextIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % allSummaries.length;
        } else {
          nextIndex = currentIndex === 0 ? allSummaries.length - 1 : currentIndex - 1;
        }

        allSummaries[nextIndex].focus();
      }
    }
  });

  // Add progress indicator
  const createProgressIndicator = () => {
    const totalSteps = document.querySelectorAll('.step').length;
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-indicator';
    progressContainer.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background-color: var(--card-background);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 12px;
      font-size: 12px;
      font-weight: 600;
      z-index: 99;
      display: none;
    `;

    progressContainer.innerHTML = `
      <div>Progress</div>
      <div id="progress-text">0/${totalSteps}</div>
    `;

    document.body.appendChild(progressContainer);

    // Update progress as steps are opened
    const updateProgress = () => {
      const openSteps = document.querySelectorAll('.step[open]').length;
      const progressText = document.getElementById('progress-text');
      if (progressText) {
        progressText.textContent = `${openSteps}/${totalSteps}`;
      }

      // Show/hide progress indicator
      if (openSteps > 0) {
        progressContainer.style.display = 'block';
      } else {
        progressContainer.style.display = 'none';
      }
    };

    // Listen for step changes
    const observer = new MutationObserver(updateProgress);
    document.querySelectorAll('.step').forEach(step => {
      observer.observe(step, { attributes: true, attributeFilter: ['open'] });
    });
  };

  // Only show progress indicator on larger screens
  if (window.innerWidth > 768) {
    createProgressIndicator();
  }

  console.log('🔧 NDI Guide Page Loaded!');
});

// Add reading time estimation
document.addEventListener('DOMContentLoaded', () => {
  const estimateReadingTime = () => {
    const content = document.querySelector('.guide-content');
    if (!content) return;

    const text = content.textContent || content.innerText || '';
    const wordsPerMinute = 200; // Average reading speed
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);

    // Add reading time to the meta section
    const metaSection = document.querySelector('.guide-meta');
    if (metaSection) {
      const readingTimeElement = document.createElement('div');
      readingTimeElement.className = 'reading-time';
      readingTimeElement.innerHTML = `
        <span class="material-icons">schedule</span>
        <span>${readingTime} min read</span>
      `;
      readingTimeElement.style.cssText = `
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        background-color: var(--card-background);
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: var(--font-size-sm);
        font-weight: 500;
      `;

      metaSection.appendChild(readingTimeElement);
    }
  };

  estimateReadingTime();
});
