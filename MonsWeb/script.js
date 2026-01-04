// Set flag untuk navigasi sebelum halaman di-load
document.addEventListener('DOMContentLoaded', function() {
    // Tambahkan event listener ke semua link navigasi
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', function() {
            sessionStorage.setItem('navigated', 'true');
        });
    });
});

// Loading Screen Animation - hanya untuk refresh, tidak untuk navigasi
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Cek apakah ini adalah refresh atau navigasi dari halaman lain
    const isPageRefresh = !sessionStorage.getItem('navigated');
    
    if (loadingScreen) {
        if (isPageRefresh) {
            // Tampilkan loading screen untuk refresh
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    sessionStorage.setItem('navigated', 'true');
                }, 600);
            }, 2500);
        } else {
            // Langsung sembunyikan untuk navigasi
            loadingScreen.style.display = 'none';
        }
    }
});

// Page navigation system
let currentPage = 'home';

function navigateToPage(pageName) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(pageName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentPage = pageName;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('nav-link-active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('nav-link-active');
            }
        });
    }
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make navigateToPage available globally
window.navigateToPage = navigateToPage;

// Hamburger Menu Toggle
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

function toggleMobileMenu() {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', toggleMobileMenu);
}

// Handle navbar link clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const pageName = this.getAttribute('data-page');
        // Only prevent default and navigate if data-page exists (internal navigation)
        // Let regular href links (like skills.html) work normally
        if (pageName) {
            e.preventDefault();
            navigateToPage(pageName);
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
});

// Handle hash navigation on page load
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        navigateToPage(hash);
    } else {
        navigateToPage('home');
    }
});

// Navbar scroll effect
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Parallax effect untuk background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const bgGradient = document.querySelector('.bg-gradient');
    if (bgGradient) {
        bgGradient.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.5}px)`;
    }
});

// Animated counter untuk stats (jika ada)
function animateCounter(element, target, duration) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer untuk animasi saat scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe semua elemen yang perlu animasi
document.querySelectorAll('.btn, .description, .subtitle').forEach(el => {
    observer.observe(el);
});

// Particle effect pada mouse move
let particles = [];
const maxParticles = 50;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.life = 100;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2;
        if (this.size > 0.2) this.size -= 0.05;
    }
}

// Mouse move effect dengan partikel - DISABLED for performance
// document.addEventListener('mousemove', (e) => {
//     if (Math.random() > 0.95 && particles.length < maxParticles) {
//         particles.push(new Particle(e.clientX, e.clientY));
//     }
// });

// Button hover effect dengan ripple
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Dynamic title effect
const titleElement = document.querySelector('.title');
if (titleElement) {
    const titleText = titleElement.textContent.trim();
    let index = 0;
    
    // Glitch effect pada hover
    titleElement.addEventListener('mouseenter', () => {
        titleElement.style.animation = 'glitch 0.3s ease-in-out';
    });
    
    titleElement.addEventListener('mouseleave', () => {
        titleElement.style.animation = '';
    });
}

// Enhanced star generation dengan efek kelap kelip merah yang indah
const starsContainer = document.getElementById('stars');

if (starsContainer) {
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    
    // Random delay untuk setiap bintang agar kelap kelip tidak seragam
    const randomDelay = Math.random() * 6;
    star.style.setProperty('--delay', randomDelay + 's');
    
    // Variasi ukuran untuk kedalaman visual
    const size = 2 + Math.random() * 2;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    
    starsContainer.appendChild(star);
}
}

// Logo rotation on scroll - DISABLED for performance
// const logoMain = document.querySelector('.logo-main');
// if (logoMain) {
//     window.addEventListener('scroll', () => {
//         const scrolled = window.pageYOffset;
//         logoMain.style.transform = `rotate(${scrolled * 0.1}deg)`;
//     });
// }

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Fade in animation untuk main content
    setTimeout(() => {
        document.querySelector('main').style.opacity = '1';
    }, 100);
});

// Nav link active state on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Console easter egg
console.log('%c🚀 Mons Portfolio', 'color: #7A0F27; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ by Mons', 'color: #4A0D20; font-size: 14px;');

// Performance monitoring
if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    });
}

// ============================================
// MODERN ENHANCEMENTS - Added for better UX
// ============================================

// Smooth reveal animation on scroll
const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.about-card, .server-card, .skill-simple-card, .feature-card');
    
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 100;
        
        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Add CSS for reveal animation dynamically
const revealStyles = document.createElement('style');
revealStyles.textContent = `
    .about-card, .server-card, .skill-simple-card, .feature-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .about-card.revealed, .server-card.revealed, .skill-simple-card.revealed, .feature-card.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .about-card:nth-child(1), .skill-simple-card:nth-child(1) { transition-delay: 0.1s; }
    .about-card:nth-child(2), .skill-simple-card:nth-child(2) { transition-delay: 0.2s; }
    .about-card:nth-child(3), .skill-simple-card:nth-child(3) { transition-delay: 0.3s; }
    .skill-simple-card:nth-child(4) { transition-delay: 0.4s; }
    .skill-simple-card:nth-child(5) { transition-delay: 0.5s; }
    .skill-simple-card:nth-child(6) { transition-delay: 0.6s; }
`;
document.head.appendChild(revealStyles);

// Enhanced cursor glow effect (subtle)
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

const cursorGlowStyles = document.createElement('style');
cursorGlowStyles.textContent = `
    .cursor-glow {
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(122, 15, 39, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body:hover .cursor-glow {
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        .cursor-glow {
            display: none;
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .cursor-glow {
            display: none;
        }
    }
`;
document.head.appendChild(cursorGlowStyles);

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Typing effect for subtitle (only on home page)
const subtitle = document.querySelector('.subtitle');
if (subtitle && subtitle.textContent.includes('Portfolio')) {
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing after loading screen
    setTimeout(typeWriter, 3000);
}

// Loading screen timeout fallback (prevent infinite loading)
setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 600);
    }
}, 5000); // Force hide after 5 seconds
