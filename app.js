// Gallery functionality
class NetflixGallery {
    constructor() {
        this.images = Array.from({ length: 50 }, (_, i) => `public/tar-${String(i + 1).padStart(2, '0')}.png`);
        this.scroller = document.getElementById('scroller');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.dots = document.getElementById('dots');
        
        if (!this.scroller || !this.prevBtn || !this.nextBtn || !this.dots) {
            return; // Elements not found, gallery not on this page
        }
        
        this.cardsPerView = this.getCardsPerView();
        this.cardHeightPx = 240;
        this.currentPage = 0;
        this.cardWidthPx = 0;
        this.gapPx = 0;

        this.renderCards();
        this.applyLayoutSizes();
        this.renderDots();
        this.bind();
        this.updatePaginationFromScroll();
    }

    getCardsPerView() {
        const w = window.innerWidth;
        if (w < 768) return 1;
        if (w < 1024) return 3;
        return 5;
    }

    renderCards() {
        this.scroller.innerHTML = '';

        this.images.forEach((src, idx) => {
            const card = document.createElement('div');
            card.className = 'relative shrink-0 snap-start rounded-lg overflow-hidden bg-gray-100 ring-1 ring-black/5 card-hover';
            card.style.height = `${this.cardHeightPx}px`;

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Photo ${idx + 1}`;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.className = 'w-full h-full object-cover select-none';

            const plus = document.createElement('a');
            plus.href = src;
            plus.target = '_blank';
            plus.rel = 'noopener';
            plus.setAttribute('aria-label', 'Open full size');
            plus.className = 'absolute bottom-2 right-2 bg-white/95 text-kineticBlack rounded-full p-1 shadow hidden md:inline-flex';
            plus.innerHTML = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>';

            card.appendChild(img);
            card.appendChild(plus);
            this.scroller.appendChild(card);
        });
    }

    applyLayoutSizes() {
        const styles = getComputedStyle(this.scroller);
        this.gapPx = parseFloat(styles.columnGap || styles.gap || '0') || 0;
        const innerWidth = this.scroller.clientWidth;
        const visibleWidth = innerWidth - this.gapPx * (this.cardsPerView - 1);
        this.cardWidthPx = Math.floor(visibleWidth / this.cardsPerView);
        Array.from(this.scroller.children).forEach((card) => { card.style.width = `${this.cardWidthPx}px`; });
    }

    renderDots() {
        this.dots.innerHTML = '';
        const pages = Math.ceil(this.images.length / this.cardsPerView);
        this.dots.style.display = (this.cardsPerView === 1) ? 'none' : 'flex';
        if (this.cardsPerView === 1) return;
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.className = 'mx-1 w-2.5 h-2.5 rounded-full bg-gray-300';
            dot.addEventListener('click', () => this.scrollToPage(i));
            this.dots.appendChild(dot);
        }
        this.updateActiveDot();
    }

    pageCount() { return Math.ceil(this.images.length / this.cardsPerView); }

    scrollToPage(page) {
        const pages = this.pageCount();
        this.currentPage = Math.max(0, Math.min(page, pages - 1));
        const index = this.currentPage * this.cardsPerView;
        const targetCard = this.scroller.children[index];
        if (targetCard) {
            const left = targetCard.offsetLeft;
            this.scroller.scrollTo({ left, behavior: 'smooth' });
        }
        this.updateActiveDot();
    }

    nextPage() {
        const lastPage = this.pageCount() - 1;
        if (this.currentPage >= lastPage) {
            this.scrollToPage(0);
        } else {
            this.scrollToPage(this.currentPage + 1);
        }
    }
    prevPage() { this.scrollToPage(this.currentPage - 1); }

    updateActiveDot() {
        const children = Array.from(this.dots.children);
        children.forEach((d, i) => d.classList.toggle('bg-primary', i === this.currentPage));
        children.forEach((d, i) => d.classList.toggle('bg-gray-300', i !== this.currentPage));
    }

    updatePaginationFromScroll() {
        if (this.cardsPerView === 1) return;
        if (!this.cardWidthPx) this.applyLayoutSizes();
        const step = this.cardWidthPx + this.gapPx;
        const approxIndex = Math.round(this.scroller.scrollLeft / step);
        const page = Math.floor(approxIndex / this.cardsPerView);
        if (page !== this.currentPage) { this.currentPage = page; this.updateActiveDot(); }
    }

    bind() {
        this.prevBtn.addEventListener('click', () => this.prevPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevPage();
            if (e.key === 'ArrowRight') this.nextPage();
        });
        this.scroller.addEventListener('scroll', () => {
            if (this._raf) cancelAnimationFrame(this._raf);
            this._raf = requestAnimationFrame(() => this.updatePaginationFromScroll());
        }, { passive: true });
        window.addEventListener('resize', () => {
            const newCpv = this.getCardsPerView();
            if (newCpv !== this.cardsPerView) {
                const beforeIndex = this.currentPage * this.cardsPerView;
                this.cardsPerView = newCpv;
                this.applyLayoutSizes();
                this.renderDots();
                const targetPage = Math.floor(beforeIndex / this.cardsPerView);
                this.scrollToPage(targetPage);
            } else { this.applyLayoutSizes(); }
        });
    }
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');

    if (!form) return; // Contact form not on this page

    // Hide messages initially
    function hideMessages() {
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }

    // Show success message
    function showSuccess() {
        hideMessages();
        successMessage.classList.remove('hidden');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Show error message
    function showError(message = 'Something went wrong. Please try again or contact us directly.') {
        hideMessages();
        errorMessage.querySelector('p').textContent = message;
        errorMessage.classList.remove('hidden');
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Reset form
    function resetForm() {
        form.reset();
        // Reset reCAPTCHA
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
    }

    // Set loading state
    function setLoading(loading) {
        if (loading) {
            submitBtn.disabled = true;
            submitText.classList.add('hidden');
            submitLoading.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            submitLoading.classList.add('hidden');
        }
    }

    // Wait for reCAPTCHA to be ready
    function waitForRecaptcha() {
        return new Promise((resolve) => {
            if (typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
                grecaptcha.ready(resolve);
            } else {
                // Fallback if grecaptcha.ready is not available
                const checkInterval = setInterval(() => {
                    if (typeof grecaptcha !== 'undefined') {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            }
        });
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        setLoading(true);
        hideMessages();

        try {
            // Wait for reCAPTCHA to be ready
            await waitForRecaptcha();
            
            // Check if reCAPTCHA is completed
            if (typeof grecaptcha !== 'undefined') {
                const recaptchaResponse = grecaptcha.getResponse();
                if (!recaptchaResponse) {
                    showError('Please complete the reCAPTCHA verification.');
                    setLoading(false);
                    return;
                }
            }

            // Get form data
            const formData = new FormData(form);
            
            // Submit to Netlify
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString(),
            });

            if (response.ok) {
                showSuccess();
                resetForm();
            } else {
                showError('Failed to submit form. Please try again.');
            }
        } catch (error) {
            showError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    });

    // Hide messages when user starts typing
    const formInputs = form.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', hideMessages);
    });
}

// Reveal animation functionality
class RevealOnScroll {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1 }
        );
        
        this.elements.forEach(el => this.observer.observe(el));
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Lesson plan toggle functionality
function toggleLessonPlan(button) {
    const content = document.getElementById('lesson-plan-content');
    const icon = button.querySelector('[data-icon]');
    
    if (content && icon) {
        content.classList.toggle('hidden');
        icon.textContent = content.classList.contains('hidden') ? '▾' : '▴';
    }
}

// Commit info functionality
async function loadCommitInfo() {
    const commitInfoDiv = document.getElementById('commit-info');
    if (!commitInfoDiv) return;
    
    try {
        // Try to load commit info from environment or API
        // This would need to be adapted based on your deployment setup
        const response = await fetch('/.well-known/commit-info.json').catch(() => null);
        if (response && response.ok) {
            const commitData = await response.json();
            commitInfoDiv.innerHTML = `
                <div class="fixed bottom-2 right-2 text-xs bg-black/80 text-white p-2 rounded">
                    ${commitData.hash?.substring(0, 8) || 'dev'} • ${new Date(commitData.timestamp || Date.now()).toLocaleDateString()}
                </div>
            `;
        }
    } catch (error) {
        // Silently fail if commit info is not available
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery
    new NetflixGallery();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize reveal animations
    new RevealOnScroll();
    
    // Load commit info
    loadCommitInfo();
});

// Make toggleLessonPlan available globally for inline onclick
window.toggleLessonPlan = toggleLessonPlan;