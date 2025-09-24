// ===== DOM SAFETY MANAGER MODULE =====
// Safe DOM manipulation and XSS prevention for House Maintenance Guide application

/**
 * DOM Safety Manager
 * Provides secure DOM manipulation utilities with XSS prevention
 */
class DOMSafetyManager {
  constructor() {
    this.allowedTags = [
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u',
      'br', 'hr', 'img', 'a', 'button', 'input', 'textarea',
      'select', 'option', 'label', 'form', 'article', 'section',
      'header', 'footer', 'nav', 'main', 'aside', 'details', 'summary'
    ];
    
    this.allowedAttributes = {
      '*': ['id', 'class', 'data-*', 'aria-*', 'role', 'tabindex', 'title'],
      'a': ['href', 'target', 'rel'],
      'img': ['src', 'alt', 'width', 'height'],
      'input': ['type', 'name', 'value', 'placeholder', 'required', 'disabled'],
      'button': ['type', 'disabled'],
      'form': ['action', 'method'],
      'textarea': ['name', 'placeholder', 'rows', 'cols', 'required'],
      'select': ['name', 'required', 'multiple'],
      'option': ['value', 'selected'],
      'details': ['open'],
      'label': ['for']
    };

    this.dangerousPatterns = [
      /javascript:/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      /on\w+\s*=/gi,
      /<script/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /<link/gi,
      /<meta/gi,
      /<style/gi
    ];

    this.init();
  }

  init() {
    // Override dangerous DOM methods if in strict mode
    if (this.isStrictMode()) {
      this.overrideDangerousMethods();
    }

    console.log('🛡️ DOM Safety Manager initialized');
  }

  isStrictMode() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.search.includes('strict=true');
  }

  /**
   * Safe querySelector with null checks and error handling
   */
  safeQuery(selector, context = document) {
    try {
      if (!selector || typeof selector !== 'string') {
        console.warn('Invalid selector:', selector);
        return null;
      }

      const element = context.querySelector(selector);
      return element || null;
    } catch (error) {
      console.error('Query selector error:', error);
      if (window.ErrorHandler) {
        window.ErrorHandler.reportError(error, { 
          context: 'safeQuery', 
          selector 
        });
      }
      return null;
    }
  }

  /**
   * Safe querySelectorAll with validation
   */
  safeQueryAll(selector, context = document) {
    try {
      if (!selector || typeof selector !== 'string') {
        console.warn('Invalid selector:', selector);
        return [];
      }

      const elements = context.querySelectorAll(selector);
      return Array.from(elements);
    } catch (error) {
      console.error('Query selector all error:', error);
      if (window.ErrorHandler) {
        window.ErrorHandler.reportError(error, { 
          context: 'safeQueryAll', 
          selector 
        });
      }
      return [];
    }
  }

  /**
   * Safe getElementById with validation
   */
  safeGetById(id) {
    try {
      if (!id || typeof id !== 'string') {
        console.warn('Invalid ID:', id);
        return null;
      }

      return document.getElementById(id) || null;
    } catch (error) {
      console.error('Get by ID error:', error);
      if (window.ErrorHandler) {
        window.ErrorHandler.reportError(error, { 
          context: 'safeGetById', 
          id 
        });
      }
      return null;
    }
  }

  /**
   * Safe element creation with attribute validation
   */
  createElement(tagName, attributes = {}, textContent = '') {
    try {
      if (!this.isAllowedTag(tagName)) {
        console.warn('Unsafe tag blocked:', tagName);
        return null;
      }

      const element = document.createElement(tagName);

      // Set safe attributes
      Object.entries(attributes).forEach(([key, value]) => {
        if (this.isAllowedAttribute(tagName, key)) {
          const safeValue = this.sanitizeAttributeValue(key, value);
          if (safeValue !== null) {
            element.setAttribute(key, safeValue);
          }
        } else {
          console.warn('Unsafe attribute blocked:', key, 'for tag:', tagName);
        }
      });

      // Set safe text content
      if (textContent) {
        element.textContent = this.sanitizeText(textContent);
      }

      return element;
    } catch (error) {
      console.error('Create element error:', error);
      if (window.ErrorHandler) {
        window.ErrorHandler.reportError(error, { 
          context: 'createElement', 
          tagName, 
          attributes 
        });
      }
      return null;
    }
  }

  /**
   * Safe text content setting
   */
  safeSetText(element, text) {
    try {
      if (!element || !element.nodeType) {
        console.warn('Invalid element for text setting');
        return false;
      }

      element.textContent = this.sanitizeText(text);
      return true;
    } catch (error) {
      console.error('Safe set text error:', error);
      if (window.ErrorHandler) {
        window.ErrorHandler.reportError(error, { 
          context: 'safeSetText' 
        });
      }
      return false;
    }
  }

  /**
   * Safe HTML content setting
   */
  safeSetHTML(element, html) {
    try {
      if (!element || !element.nodeType) {
        console.warn('Invalid element for HTML setting');
        return false;
      }

      const sanitizedHTML = this.sanitizeHTML(html);
      element.innerHTML = sanitizedHTML;
      return true;
    } catch (error) {
      console.error('Safe set HTML error:', error);
      if (window.ErrorHandler) {
        window.ErrorHandler.reportError(error, { 
          context: 'safeSetHTML' 
        });
      }
      return false;
    }
  }

  /**
   * Sanitize text content
   */
  sanitizeText(text) {
    if (typeof text !== 'string') {
      return String(text || '');
    }

    // Remove dangerous patterns
    return text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitize HTML content
   */
  sanitizeHTML(html) {
    if (typeof html !== 'string') {
      return '';
    }

    let sanitized = html;

    // Remove dangerous patterns
    this.dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Remove script tags and their content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers from attributes
    sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove dangerous URLs
    sanitized = sanitized.replace(/href\s*=\s*["']\s*javascript:/gi, 'href="#"');
    sanitized = sanitized.replace(/src\s*=\s*["']\s*javascript:/gi, 'src=""');

    return sanitized;
  }

  /**
   * Sanitize attribute values
   */
  sanitizeAttributeValue(name, value) {
    if (value === null || value === undefined) {
      return null;
    }

    let sanitized = String(value);

    // Check for dangerous patterns
    const isDangerous = this.dangerousPatterns.some(pattern => 
      pattern.test(sanitized)
    );

    if (isDangerous) {
      console.warn('Dangerous attribute value blocked:', name, value);
      return null;
    }

    // Special handling for URLs
    if (name === 'href' || name === 'src') {
      return this.sanitizeURL(sanitized);
    }

    // Special handling for data attributes
    if (name.startsWith('data-')) {
      return this.sanitizeText(sanitized);
    }

    // Default sanitization
    return sanitized.trim();
  }

  /**
   * Sanitize URLs
   */
  sanitizeURL(url) {
    if (!url || typeof url !== 'string') {
      return '';
    }

    const trimmedURL = url.trim();

    // Allow relative URLs
    if (trimmedURL.startsWith('/') || trimmedURL.startsWith('./') || trimmedURL.startsWith('../')) {
      return trimmedURL;
    }

    // Allow hash links
    if (trimmedURL.startsWith('#')) {
      return trimmedURL;
    }

    // Allow safe protocols
    const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    const hasValidProtocol = safeProtocols.some(protocol => 
      trimmedURL.toLowerCase().startsWith(protocol)
    );

    if (!hasValidProtocol) {
      console.warn('Unsafe URL protocol blocked:', trimmedURL);
      return '#';
    }

    return trimmedURL;
  }

  /**
   * Check if tag is allowed
   */
  isAllowedTag(tagName) {
    return this.allowedTags.includes(tagName.toLowerCase());
  }

  /**
   * Check if attribute is allowed for tag
   */
  isAllowedAttribute(tagName, attributeName) {
    const tag = tagName.toLowerCase();
    const attr = attributeName.toLowerCase();

    // Check universal attributes
    const universalAttrs = this.allowedAttributes['*'] || [];
    if (universalAttrs.some(pattern => {
      if (pattern.endsWith('*')) {
        return attr.startsWith(pattern.slice(0, -1));
      }
      return attr === pattern;
    })) {
      return true;
    }

    // Check tag-specific attributes
    const tagAttrs = this.allowedAttributes[tag] || [];
    return tagAttrs.includes(attr);
  }

  /**
   * Check if content is safe
   */
  isSafe(content) {
    if (typeof content !== 'string') {
      return true;
    }

    return !this.dangerousPatterns.some(pattern => 
      pattern.test(content)
    );
  }

  overrideDangerousMethods() {
    console.warn('🔒 DOM Safety: Overriding dangerous methods (development mode)');

    // Override document.write (completely disable)
    document.write = function() {
      console.error('🚨 document.write is disabled for security');
    };

    document.writeln = function() {
      console.error('🚨 document.writeln is disabled for security');
    };
  }

  getStats() {
    return {
      allowedTags: this.allowedTags.length,
      allowedAttributes: Object.keys(this.allowedAttributes).length,
      dangerousPatterns: this.dangerousPatterns.length,
      strictMode: this.isStrictMode()
    };
  }
}

// Initialize DOM Safety Manager
window.DOMSafetyManager = new DOMSafetyManager();

// Create convenient global functions
window.safeQuery = (selector, context) => window.DOMSafetyManager.safeQuery(selector, context);
window.safeQueryAll = (selector, context) => window.DOMSafetyManager.safeQueryAll(selector, context);
window.safeGetById = (id) => window.DOMSafetyManager.safeGetById(id);
window.safeSetText = (element, text) => window.DOMSafetyManager.safeSetText(element, text);
window.safeSetHTML = (element, html) => window.DOMSafetyManager.safeSetHTML(element, html);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DOMSafetyManager;
}

console.log('✅ DOM Safety Manager module loaded successfully');