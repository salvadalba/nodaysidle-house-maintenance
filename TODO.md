# NDI - Making home maintenance accessible, safe, and straightforward for everyone. 🏠✨ Web App - Project Plan

A mobile-first, responsive web app for house maintenance guides, built with HTML, CSS, and JS using a Bauhaus-inspired design.

## Phase 1: Project Setup & Foundation
- [ ] **Initialize Project Structure**
    - Create root directory `qwen-webapp`
    - Create subfolders: `css/`, `js/`, `icons/`, `content/`
- [ ] **Create Core Files**
    - `index.html` (Main homepage)
    - `css/styles.css` (Main stylesheet with Bauhaus theme)
    - `js/script.js` (Main JavaScript for interactivity)
    - `README.md` (Project documentation)
- [ ] **Version Control**
    - Initialize Git repository
    - Create initial commit

## Phase 2: Core Structure & Layout (HTML)
- [ ] **Build Basic HTML Skeleton**
    - Semantic HTML5 structure (`<header>`, `<main>`, `<footer>`, etc.)
    - Meta tags for responsiveness (`viewport`)
    - Link Google Fonts (IBM Plex Mono)
- [ ] **Implement Mobile-First Layout Patterns**
    - [ ] **Component: Bottom Navigation Bar**
        - Create `<nav class="bottom-nav">` with 3-5 icons (e.g., Home, Search, Favorites)
    - [ ] **Component: Search-First Header**
        - Create `<header>` with search bar and filter chips
    - [ ] **Page: Home/Hub Template**
        - Hero search bar
        - Horizontal scroll row for "Seasonal Tasks"
        - Grid of room cards (using `.grid .cards` structure)
        - List of "Recent Issues"
- [ ] **Create Detail/Guide Template Page (`guide.html`)**

## Phase 3: Styling & Theming (CSS)
- [ ] **Define Bauhaus Color Scheme & Variables**
    - Implement CSS custom properties for theming
    - Set primary color: `#7dfbc2` (icons)
    - Set text color: `#000000`
    - Set background color: `#f0e3f7`
- [ ] **Typography**
    - Apply IBM Plex Mono font family globally
    - Establish typographic scale (headings, body, captions)
- [ ] **Style Core Components**
    - Style the bottom navigation bar
    - Style the search header and filter chips
    - Style room cards and list items
    - Style accordions for guide steps (`<details>`, `<summary>`)
- [ ] **Implement Dark/Light Mode Toggle**
    - Create CSS logic for color scheme switching
    - Add toggle button in UI

## Phase 4: Interactivity & Functionality (JS)
- [ ] **Implement Dark/Light Mode Toggle Logic**
- [ ] **Add Basic Interactivity to Components**
    - Make accordions functional
    - Handle filter chip clicks
    - Simulate navigation between "pages" (for prototype)
- [ ] **Implement Basic Search Functionality** (static content)

## Phase 5: Content Population
- [ ] **Structure JSON or HTML for Maintenance Guides**
- [ ] **Populate Homepage with Room Categories**
- [ ] **Create at least 2-3 sample detailed guides** (e.g., "Unclog Kitchen Sink", "Fix a Leaky Faucet")

## Phase 6: Testing & Refinement
- [ ] **Cross-Browser Testing** (Chrome, Firefox, Safari)
- [ ] **Responsive Testing**
    - Test on mobile view (360x800, 390x844)
    - Test on tablet view
    - Test on desktop view
- [ ] **Accessibility (a11y) Check**
    - Keyboard navigation
    - Screen reader testing
    - Color contrast verification
- [ ] **Performance Check** (Lighthouse audit)

## Phase 7: Polish & Deployment
- [ ] **Final Design Polish**
- [ ] **Choose Deployment Platform** (e.g., Netlify, Vercel, GitHub Pages)
- [ ] **Deploy Live Version**

---

## README.md

```markdown
# QWEN - House Maintenance Web App

A mobile-first, responsive web application designed to help EU-based homeowners and renters fix common household problems. Built with a Bauhaus-inspired design theme.

## 🎨 Design Specifications

*   **Theme:** Bauhaus
*   **Primary Color (Icons):** `#7dfbc2`
*   **Text Color:** `#000000`
*   **Background Color:** `#f0e3f7`
*   **Font:** IBM Plex Mono (from Google Fonts)
*   **Icons:** Material You (3 styles)
*   **Requirement:** Dark/Light mode toggle

## 📱 Layout & Patterns

The app follows modern mobile-first layout patterns:
*   Single Column Flow: Stacked cards/lists on mobile, enhancing to multi-column grids on larger screens.
*   Bottom Navigation: Persistent bar with 3-5 main app destinations.
*   Search-First Header: Prominent search bar with filter chips underneath.
*   Progressive Disclosure: Using accordions (`<details>`, `<summary>`) for guide steps.

## 🛠️ Built With

*   Semantic HTML5
*   CSS3 (Flexbox, Grid, Custom Properties)
*   Vanilla JavaScript

## 🚀 Getting Started

1.  Clone the repository: `git clone [repository-url]`
2.  Open `index.html` in your browser to view the project locally.

## 📁 Project Structure
