document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
});

// GSAP Initialization
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
const heroTl = gsap.timeline();

heroTl.from("#hero-name", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out"
})
    .from("#hero-tagline", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .from("#hero-subtext", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .from("#hero-buttons", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8");

// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal');

revealElements.forEach((el) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none"
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Project Card Hover Animation (Extra Polish reach)
const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            boxShadow: "0 20px 40px rgba(112, 0, 255, 0.15)",
            duration: 0.4,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            boxShadow: "none",
            duration: 0.4,
            ease: "power2.out"
        });
    });
});

// Custom Cursor (Optional Premium Touch)
const cursorBlob = document.querySelector('.bg-blob');
window.addEventListener('mousemove', (e) => {
    gsap.to(cursorBlob, {
        x: e.clientX * 0.1,
        y: e.clientY * 0.1,
        duration: 2,
        ease: "power2.out"
    });
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== CAROUSEL SYSTEM =====
function getCarousel(btn) {
    return btn.closest('[data-carousel]');
}

function getCarouselState(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dots button');
    const currentIndex = parseInt(carousel.dataset.currentSlide || '0');
    return { track, slides, dots, currentIndex };
}

function updateCarousel(carousel, index) {
    const { track, slides, dots } = getCarouselState(carousel);
    const total = slides.length;

    // Clamp index
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    // Animate slide
    gsap.to(track, {
        x: `-${index * 100}%`,
        duration: 0.5,
        ease: "power2.out"
    });

    // Update dots
    dots.forEach((dot, i) => {
        dot.className = i === index
            ? 'w-1.5 h-1.5 rounded-full bg-white transition-all duration-300'
            : 'w-1.5 h-1.5 rounded-full bg-white/40 transition-all duration-300';
    });

    // Store current index
    carousel.dataset.currentSlide = index;
}

window.carouselPrev = function (btn) {
    const carousel = getCarousel(btn);
    const { currentIndex } = getCarouselState(carousel);
    updateCarousel(carousel, currentIndex - 1);
};

window.carouselNext = function (btn) {
    const carousel = getCarousel(btn);
    const { currentIndex } = getCarouselState(carousel);
    updateCarousel(carousel, currentIndex + 1);
};

window.carouselGoTo = function (btn, index) {
    const carousel = getCarousel(btn);
    updateCarousel(carousel, index);
};

// Touch/Swipe Support
document.querySelectorAll('[data-carousel]').forEach(carousel => {
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const { currentIndex } = getCarouselState(carousel);

        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                updateCarousel(carousel, currentIndex + 1);
            } else {
                updateCarousel(carousel, currentIndex - 1);
            }
        }
    }, { passive: true });
});

window.copyEmail = function () {
    const emailText = document.getElementById('email-text').innerText;
    navigator.clipboard.writeText(emailText).then(() => {
        const feedback = document.getElementById('copy-feedback');

        // GSAP feedback animation
        const tl = gsap.timeline();
        tl.to(feedback, {
            opacity: 1,
            y: -5,
            duration: 0.4,
            ease: "power2.out"
        })
            .to(feedback, {
                opacity: 0,
                y: 0,
                duration: 0.4,
                delay: 1.5,
                ease: "power2.in"
            });
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

// ===== RESUME DOWNLOAD =====
window.downloadResume = function () {
    const a = document.createElement('a');
    a.href = 'assets/BagusBachtiar_CV.pdf';
    a.download = 'BagusBachtiar_CV.pdf';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

// ===== PROJECT MODAL SYSTEM =====

const projectData = {
    'ar-sandbox': {
        title: 'AR Sandbox for Motor Skill Therapy',
        tags: ['Linux', 'IoT', 'Kinect', 'Projector', 'C++'],
        images: [
            { src: 'assets/ar-1.jpg', alt: 'AR Sandbox Full Overview' },
            { src: 'assets/ar-2.jpg', alt: 'AR Sandbox Sensor Setup' },
            { src: 'assets/ar-3.jpg', alt: 'AR Sandbox Therapy in Action' },
        ],
        role: 'Lead Developer & System Integrator — I was responsible for integrating the Xbox Kinect depth sensor with a projector to create real-time augmented reality topographic maps on a physical sandbox surface. I handled both the hardware integration (calibrating sensors and projector alignment) and the software logic for depth mapping and visual feedback rendering.',
        description: 'An interactive Augmented Reality sandbox designed to support soft motor skill therapy for children. The system uses an Xbox Kinect sensor to capture real-time depth data from sand, which is then processed and projected back as a dynamic topographic visualization. The colored contour lines and virtual water simulation respond instantly to hand and sand movements, creating an engaging therapeutic environment.',
        contributions: [
            'Designed and assembled the complete hardware setup including sandbox frame, Kinect sensor mount, and projector alignment',
            'Implemented real-time depth sensing and color-mapped topographic visualization using the Kinect SDK',
            'Calibrated sensor-to-projector mapping for accurate AR overlay on the physical sand surface',
            'Developed interactive visual feedback modes tailored for motor skill rehabilitation exercises',
            'Collaborated with therapy professionals to validate the system\'s effectiveness in clinical settings',
        ]
    },
    'jidoka': {
        title: 'Jidoka.id – Construction Management System',
        tags: ['Laravel', 'MySQL', 'Backend', 'REST API', 'Admin Panel'],
        images: [
            { src: 'assets/jidoka-1.jpg', alt: 'Jidoka.id Unit Management' },
            { src: 'assets/jidoka-2.png', alt: 'Jidoka.id Reports' },
        ],
        role: 'Backend Developer — I was responsible for architecting and developing the entire backend system for this construction housing management platform. My work included designing the database schema, building RESTful APIs, implementing authentication and role-based access control, and creating the admin dashboard for managing housing units, customers, and financial transactions.',
        description: 'A comprehensive backend management system built for a construction housing company. The platform streamlines the entire business workflow — from listing available housing units and managing customer data to tracking payments, generating invoices, and producing financial reports. Built with Laravel for robust performance and maintainability.',
        contributions: [
            'Architected the database schema to handle complex relationships between units, customers, payments, and contractors',
            'Built a full-featured admin panel with role-based access control for different management levels',
            'Developed automated payment tracking and installment scheduling system',
            'Implemented reporting modules for financial summaries and unit availability dashboards',
            'Created RESTful API endpoints for potential mobile app integration',
        ]
    },
    'toko': {
        title: 'Sales & Inventory Management System',
        tags: ['PHP', 'Laravel', 'Inventory', 'POS', 'MySQL'],
        images: [
            { src: 'assets/toko-1.jpg', alt: 'Sales Transaction View' },
            { src: 'assets/toko-2.jpg', alt: 'Product Management' },
        ],
        role: 'Full Stack Developer — I designed and built this complete sales and inventory management solution from the ground up. I handled everything from database design and backend API development to the frontend interface. The system was deployed for a real retail business, handling daily transactions, stock management, and supplier coordination.',
        description: 'A comprehensive shop operations management system that handles the full retail workflow. Features include point-of-sale transaction processing, product categorization with multi-level categories, real-time stock tracking, supplier management, purchase order creation, and detailed sales reporting with date-range filters and export capabilities.',
        contributions: [
            'Designed and implemented the complete database architecture for products, categories, suppliers, and transactions',
            'Built a fast point-of-sale (POS) interface optimized for quick daily transaction processing',
            'Developed real-time inventory tracking with low-stock alerts and automated reorder suggestions',
            'Created supplier management module with purchase order workflows',
            'Implemented comprehensive reporting dashboards with sales analytics, profit margins, and trend visualizations',
        ]
    }
};

let modalCurrentSlide = 0;
let modalTotalSlides = 0;

window.openProjectModal = function (projectKey) {
    const project = projectData[projectKey];
    if (!project) return;

    const modal = document.getElementById('project-modal');
    const track = document.getElementById('modal-carousel-track');
    const dotsContainer = document.getElementById('modal-carousel-dots');

    // Populate carousel slides
    track.innerHTML = project.images.map(img => `
        <div class="carousel-slide w-full h-full flex-shrink-0">
            <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-contain bg-black/90">
        </div>
    `).join('');

    // Populate dots
    modalTotalSlides = project.images.length;
    modalCurrentSlide = 0;
    dotsContainer.innerHTML = project.images.map((_, i) => `
        <button class="w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-white scale-110' : 'bg-white/40'} transition-all duration-300 hover:bg-white/70" onclick="modalCarouselGoTo(${i})"></button>
    `).join('');

    // Populate text content
    document.getElementById('modal-title').textContent = project.title;

    // Tags
    document.getElementById('modal-tags').innerHTML = project.tags.map(tag => `
        <span class="px-3 py-1 bg-white/5 text-[10px] uppercase rounded-full border border-white/10 tracking-wider">${tag}</span>
    `).join('');

    // Role & Description
    document.getElementById('modal-role').textContent = project.role;
    document.getElementById('modal-description').textContent = project.description;

    // Key Contributions
    document.getElementById('modal-contributions').innerHTML = project.contributions.map(item => `
        <li class="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
            <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0"></span>
            <span>${item}</span>
        </li>
    `).join('');

    // Reset carousel position
    gsap.set(track, { x: '0%' });

    // Show modal
    modal.classList.remove('hidden', 'closing');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Scroll modal content to top
    const scrollContainer = modal.querySelector('.modal-scroll');
    if (scrollContainer) scrollContainer.scrollTop = 0;
};

window.closeProjectModal = function () {
    const modal = document.getElementById('project-modal');
    modal.classList.add('closing');

    setTimeout(() => {
        modal.classList.remove('active', 'closing');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 250);
};

function updateModalCarousel(index) {
    if (index < 0) index = modalTotalSlides - 1;
    if (index >= modalTotalSlides) index = 0;
    modalCurrentSlide = index;

    const track = document.getElementById('modal-carousel-track');
    gsap.to(track, {
        x: `-${index * 100}%`,
        duration: 0.5,
        ease: "power2.out"
    });

    // Update dots
    const dots = document.getElementById('modal-carousel-dots').querySelectorAll('button');
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.className = 'w-2.5 h-2.5 rounded-full bg-white scale-110 transition-all duration-300 hover:bg-white/70';
        } else {
            dot.className = 'w-2.5 h-2.5 rounded-full bg-white/40 transition-all duration-300 hover:bg-white/70';
        }
    });
}

window.modalCarouselPrev = function () {
    updateModalCarousel(modalCurrentSlide - 1);
};

window.modalCarouselNext = function () {
    updateModalCarousel(modalCurrentSlide + 1);
};

window.modalCarouselGoTo = function (index) {
    updateModalCarousel(index);
};

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('project-modal');
        if (modal.classList.contains('active')) {
            closeProjectModal();
        }
    }
});

