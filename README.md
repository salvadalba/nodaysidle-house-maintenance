# NDI - House Maintenance Web App

A mobile-first, responsive web application designed to help EU-based homeowners and renters fix common household problems. Built with a Bauhaus-inspired design theme.

## 🎨 Design Specifications

- **Theme:** Bauhaus
- **Primary Color (Icons):** `#7dfbc2`
- **Text Color:** `#000000`
- **Background Color:** `#f0e3f7`
- **Font:** IBM Plex Mono (from Google Fonts)
- **Icons:** Material Icons
- **Features:** Dark/Light mode toggle

## 📱 Layout & Features

The app follows modern mobile-first layout patterns:

- **Single Column Flow:** Stacked cards/lists on mobile, enhancing to multi-column grids on larger screens
- **Bottom Navigation:** Persistent bar with 4 main app destinations
- **Search-First Header:** Prominent search bar with filter chips
- **Progressive Disclosure:** Using accordions (`<details>`, `<summary>`) for guide steps
- **Responsive Design:** Optimized for mobile (360px+), tablet, and desktop
- **Accessibility:** Keyboard navigation, screen reader support, high contrast mode
- **Dark/Light Mode:** System preference detection with manual toggle

## 🛠️ Built With

- **HTML5:** Semantic markup with accessibility in mind
- **CSS3:** Modern features including Flexbox, Grid, Custom Properties
- **Vanilla JavaScript:** No frameworks, lightweight and fast
- **Material Icons:** Google's Material Design icon system
- **IBM Plex Mono:** Monospace font for Bauhaus aesthetic

## 🚀 Getting Started

1. Clone or download the repository
2. Open `index.html` in your browser to view the homepage
3. Open `guide.html` to see a detailed maintenance guide example
4. No build process required - it's pure HTML, CSS, and JavaScript!

## 📁 Project Structure

```
ndi-webapp/
├── index.html              # Main homepage
├── guide.html              # Sample detailed guide page
├── css/
│   ├── styles.css          # Main stylesheet with Bauhaus theme
│   └── guide.css           # Guide page specific styles
├── js/
│   ├── script.js           # Main app functionality
│   └── guide.js            # Guide page specific functionality
├── PLAN.md                 # Comprehensive maintenance content plan
├── TESTINGCHECKLIST.md     # Testing requirements
├── TODO.md                 # Development roadmap
└── README.md               # This file
```

## ✨ Key Features

### Homepage (`index.html`)
- **Hero Section:** Clean introduction with search focus
- **Seasonal Tasks:** Horizontal scrolling cards for time-sensitive maintenance
- **Room Categories:** Grid of maintenance categories (Kitchen, Bathroom, etc.)
- **Recent Issues:** Quick access to common problems
- **Bottom Navigation:** Home, Search, Favorites, Emergency

### Guide Pages (`guide.html`)
- **Step-by-Step Instructions:** Expandable accordion format
- **Safety Warnings:** Prominent safety information
- **Tools & Materials:** Clear supply lists
- **DIY vs Professional:** Clear indicators for complexity
- **Prevention Tips:** Proactive maintenance advice
- **Related Guides:** Cross-linking to similar issues

### Interactive Features
- **Theme Toggle:** Dark/Light mode with system preference detection
- **Search Functionality:** Real-time search with mock results
- **Filter System:** Category-based filtering
- **Favorites System:** Save guides for later (localStorage)
- **Share Functionality:** Native Web Share API with clipboard fallback
- **Print Support:** Optimized printing with expanded steps
- **Progress Tracking:** Visual progress indicator for guide completion
- **Keyboard Navigation:** Full keyboard accessibility

## 🎯 Content Coverage

Based on the comprehensive plan in `PLAN.md`, the app covers:

- **10 rooms:** Kitchen, Bathroom, Bedroom, Living Room, Home Office, Pantry, Laundry, Entry, Garage, Outdoor
- **100+ common issues:** 10 most common problems per room
- **10 unexpected issues:** Hidden problems homeowners face
- **Complete solutions:** DIY steps, professional requirements, prevention strategies
- **Safety guidelines:** Clear safety warnings and professional recommendations

## 📱 Responsive Breakpoints

- **Mobile:** 320px - 767px (single column, bottom navigation)
- **Tablet:** 768px - 1023px (two columns, enhanced layout)
- **Desktop:** 1024px+ (three columns, hidden bottom navigation)

## ♿ Accessibility Features

- **Semantic HTML:** Proper heading hierarchy and landmarks
- **Keyboard Navigation:** Full keyboard support with visible focus indicators
- **Screen Reader Support:** ARIA labels and descriptive text
- **Color Contrast:** WCAG AA compliant color combinations
- **Reduced Motion:** Respects user's motion preferences
- **Touch Targets:** Minimum 44x44px touch targets for mobile
- **Zoom Support:** Functional at 200% zoom level

## 🔧 Browser Support

- **Modern Browsers:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile Browsers:** iOS Safari 13+, Chrome Mobile 80+
- **Progressive Enhancement:** Core functionality works without JavaScript

## 🚀 Performance

- **Lightweight:** No external frameworks or heavy dependencies
- **Fast Loading:** Optimized CSS and JavaScript
- **Offline Ready:** Prepared for Service Worker implementation
- **Mobile Optimized:** Touch-friendly interface with smooth animations

## 🔮 Future Enhancements

- **PWA Features:** Service Worker, offline support, app installation
- **Content Management:** Dynamic content loading from JSON/API
- **User Accounts:** Personal favorites and progress tracking
- **Localization:** Multi-language support for EU markets
- **Advanced Search:** Full-text search with filters and suggestions
- **Video Guides:** Embedded instructional videos
- **Community Features:** User ratings and comments

## 📝 Development Notes

### CSS Architecture
- **Custom Properties:** Consistent theming and easy customization
- **Mobile-First:** Progressive enhancement from mobile to desktop
- **Component-Based:** Reusable CSS classes and patterns
- **Accessibility-First:** Built-in focus states and high contrast support

### JavaScript Architecture
- **Class-Based:** Organized into logical classes (QwenApp, GuideApp)
- **Event-Driven:** Efficient event handling with delegation
- **Local Storage:** Persistent user preferences and favorites
- **Progressive Enhancement:** Works without JavaScript for core content

### Performance Optimizations
- **Lazy Loading:** Images and content loaded as needed
- **Efficient Animations:** CSS transforms and opacity for smooth performance
- **Minimal DOM Manipulation:** Efficient JavaScript with minimal reflows
- **Optimized Assets:** Compressed images and minified code ready

## 🧪 Testing

See `TESTINGCHECKLIST.md` for comprehensive testing requirements including:
- Responsive design testing
- Accessibility compliance
- Cross-browser compatibility
- Performance benchmarks

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

---

