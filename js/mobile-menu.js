/**
 * Mobile Menu Functionality
 * Handles the mobile menu toggle and navigation
 */

class MobileMenu {
  constructor() {
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.mobileMenuClose = document.querySelector('.mobile-menu-close');
    this.body = document.body;
    
    this.init();
  }
  
  init() {
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener('click', () => this.openMenu());
    }
    
    if (this.mobileMenuClose) {
      this.mobileMenuClose.addEventListener('click', () => this.closeMenu());
    }
    
    // Close menu when clicking on a link
    const menuLinks = this.mobileMenu?.querySelectorAll('a');
    if (menuLinks) {
      menuLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
    }
    
    // Close menu when pressing escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenu?.classList.contains('active')) {
        this.closeMenu();
      }
    });
  }
  
  openMenu() {
    this.mobileMenu?.classList.add('active');
    this.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  }
  
  closeMenu() {
    this.mobileMenu?.classList.remove('active');
    this.body.style.overflow = ''; // Restore scrolling
  }
}

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
});
