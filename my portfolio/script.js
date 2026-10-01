/**
 * ==========================================================================
 * RONIT KUMAR SINGH - PORTFOLIO INTERACTIVE SCRIPT
 * Typed.js, Prompt Library (LocalStorage + Clipboard), AOS & Mobile Nav
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
    initScrollAnimations();
    initNavbarScroll();
    initMobileNav();
    initButtonRipples();
    initPromptLibrary();
    initContactInteractions();
    initBackToTop();
});

/* ==========================================================================
   1. TYPED.JS MOVING TEXT (WITH PURE JS FALLBACK)
   ========================================================================== */
function initTypingEffect() {
    const targetElement = document.getElementById('typed-text');
    if (!targetElement) return;

    const roles = [
        'B.Tech First Year Student',
        'Aspiring Data Analyst',
        'Future Startup Founder',
        'Social Media Marketer',
        'Prompt Engineering Learner'
    ];

    // Check if Typed.js library is loaded from CDN
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: roles,
            typeSpeed: 60,
            backSpeed: 35,
            backDelay: 1800,
            startDelay: 400,
            loop: true,
            showCursor: false
        });
    } else {
        // Fallback custom typewriter logic if CDN is blocked / offline
        let currentRoleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function type() {
            const currentRole = roles[currentRoleIndex];
            
            if (isDeleting) {
                targetElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                targetElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 1800; // Pause at end of text
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentRoleIndex = (currentRoleIndex + 1) % roles.length;
                typingSpeed = 400; // Pause before typing next
            }

            setTimeout(type, typingSpeed);
        }

        type();
    }
}

/* ==========================================================================
   2. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add slight stagger for smooth visual entrance
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 40);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => animateObserver.observe(el));
}

/* ==========================================================================
   3. NAVBAR SCROLL & ACTIVE SECTION TRACKING
   ========================================================================== */
function initNavbarScroll() {
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky shadow and padding change
        if (window.scrollY > 40) {
            navbarWrapper.classList.add('scrolled');
        } else {
            navbarWrapper.classList.remove('scrolled');
        }

        // Active link tracking based on scroll position
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ==========================================================================
   4. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav when clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ==========================================================================
   5. BUTTON RIPPLE EFFECT
   ========================================================================== */
function initButtonRipples() {
    document.querySelectorAll('.ripple-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const circle = document.createElement('span');
            circle.classList.add('ripple-circle');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            circle.style.width = circle.style.height = `${size}px`;
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;

            this.appendChild(circle);

            setTimeout(() => {
                circle.remove();
            }, 600);
        });
    });
}

/* ==========================================================================
   6. PROMPT LIBRARY (STATE, LOCALSTORAGE, COPY & EDITOR)
   ========================================================================== */
const DEFAULT_PROMPTS = [
    {
        id: 'seed-1',
        title: 'Exploratory Data Cleaning & Analysis',
        category: 'data',
        content: `Act as a Senior Data Analyst. Analyze the dataset provided below and perform the following:
1. Identify any missing values, abnormal data types, or outlier anomalies.
2. Outline step-by-step data cleaning operations in Python (using Pandas) and Excel formulas.
3. Recommend 3 top business questions we can answer using this data.
4. Suggest key visualization charts (scatter, bar, heatmap) to present findings to stakeholders.

Dataset Context: [Insert Column Names / Sample Data Here]`,
        isCustom: false
    },
    {
        id: 'seed-2',
        title: 'High-Impact Executive Cold Outreach Email',
        category: 'email',
        content: `You are an expert executive communication strategist. Draft a concise, high-conversion cold email to a tech startup founder or mentor.
- Objective: Connect, share genuine appreciation for their recent milestone, and explore collaboration or internship advice.
- Tone: Professional, polite, humble, and value-driven. No generic fluff.
- Structure:
  1. Compelling subject line (under 6 words).
  2. Contextual opener mentioning their specific work.
  3. 2-sentence value proposition highlighting my B.Tech engineering & data analytics dedication.
  4. Low-friction Call-to-Action (e.g. 10-minute brief virtual chat).`,
        isCustom: false
    },
    {
        id: 'seed-3',
        title: 'Viral Instagram Reel Script & 3-Second Hook',
        category: 'social',
        content: `Act as a top-tier social media growth consultant who has scaled accounts past 50,000+ organic followers.
Create a high-retention 45-second Instagram Reel script on the topic: [Insert Topic e.g., Top 3 AI Tools for Students].
Format:
- 0-3s: Disruptive Visual & Verbal Hook (Curiosity gap).
- 4-15s: Problem statement & relatable pain point.
- 16-35s: Rapid value delivery (Actionable solution / tip).
- 36-45s: Strong Call-to-Action (Save for later, share with a friend).
Include text-on-screen cues and audio suggestions.`,
        isCustom: false
    },
    {
        id: 'seed-4',
        title: 'Gamma App Pitch Deck / Presentation Architect',
        category: 'gamma',
        content: `Act as a venture pitch designer and presentation architect. I need a comprehensive 7-slide outline ready to generate inside Gamma App for a modern tech concept.
- Theme: Minimalist, clean, high-impact typography.
- For each slide provide:
  - Slide Title
  - 3 Bulleted Key Talking Points
  - Suggested Visual / Diagram representation
- Slides required: 1. Problem, 2. Proposed Solution, 3. Market Opportunity, 4. Product Architecture, 5. Business Model, 6. Traction / Roadmap, 7. Team & Contact.`,
        isCustom: false
    }
];

function initPromptLibrary() {
    const promptsContainer = document.getElementById('prompts-container');
    const promptCountBadge = document.getElementById('prompt-count');
    const filterButtons = document.querySelectorAll('.filter-chip');
    const form = document.getElementById('create-prompt-form');
    const titleInput = document.getElementById('prompt-title');
    const categorySelect = document.getElementById('prompt-category');
    const contentTextarea = document.getElementById('prompt-content');
    const charCounter = document.getElementById('prompt-char-count');
    const resetBtn = document.getElementById('reset-prompt-btn');

    if (!promptsContainer) return;

    // Load stored prompts from localStorage or initialize with seed prompts
    let storedPrompts = [];
    try {
        const localData = localStorage.getItem('ronit_portfolio_prompts');
        if (localData) {
            storedPrompts = JSON.parse(localData);
        } else {
            storedPrompts = [...DEFAULT_PROMPTS];
            localStorage.setItem('ronit_portfolio_prompts', JSON.stringify(storedPrompts));
        }
    } catch (e) {
        console.warn('LocalStorage unavailable, defaulting to memory store:', e);
        storedPrompts = [...DEFAULT_PROMPTS];
    }

    let activeFilter = 'all';

    // Live character counter
    if (contentTextarea && charCounter) {
        contentTextarea.addEventListener('input', () => {
            charCounter.textContent = `${contentTextarea.value.length} / 1200`;
        });
    }

    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            form.reset();
            if (charCounter) charCounter.textContent = '0 / 1200';
        });
    }

    // Render prompts function
    function renderPrompts() {
        promptsContainer.innerHTML = '';

        const filtered = storedPrompts.filter(item => {
            if (activeFilter === 'all') return true;
            return item.category === activeFilter;
        });

        if (promptCountBadge) {
            promptCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Prompt' : 'Prompts'}`;
        }

        if (filtered.length === 0) {
            promptsContainer.innerHTML = `
                <div class="glass-card" style="padding: 2.5rem; text-align: center;">
                    <i class="fa-solid fa-folder-open" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 0.75rem;"></i>
                    <p style="color: var(--text-secondary); margin: 0;">No prompts found in this category yet. Use the editor to add one!</p>
                </div>
            `;
            return;
        }

        filtered.forEach(prompt => {
            const card = document.createElement('div');
            card.classList.add('prompt-item-card');

            const categoryLabels = {
                data: 'Data Analysis',
                email: 'Business Email',
                social: 'Social Media',
                gamma: 'Gamma / Presentation',
                startup: 'Startup & Tech'
            };

            const categoryName = categoryLabels[prompt.category] || prompt.category;

            card.innerHTML = `
                <div class="prompt-card-top-row">
                    <div class="prompt-title-wrap">
                        <h4>${escapeHTML(prompt.title)}</h4>
                        <span class="prompt-category-badge">${categoryName}</span>
                        ${prompt.isCustom ? '<span class="prompt-custom-badge">Custom</span>' : ''}
                    </div>
                    <div class="prompt-actions">
                        <button class="btn-copy-prompt" data-copy-id="${prompt.id}" title="Copy Prompt Content">
                            <i class="fa-regular fa-copy"></i>
                            <span>Copy</span>
                        </button>
                        ${prompt.isCustom ? `
                            <button class="btn-delete-prompt" data-delete-id="${prompt.id}" title="Delete Prompt">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="prompt-snippet-box">${escapeHTML(prompt.content)}</div>
            `;

            // Copy handler
            const copyBtn = card.querySelector('.btn-copy-prompt');
            copyBtn.addEventListener('click', () => {
                copyPromptToClipboard(prompt.content, copyBtn);
            });

            // Delete handler (for custom prompts)
            const deleteBtn = card.querySelector('.btn-delete-prompt');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    deletePrompt(prompt.id);
                });
            }

            promptsContainer.appendChild(card);
        });
    }

    // Copy to clipboard helper
    function copyPromptToClipboard(text, buttonElement) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                onCopySuccess(buttonElement);
            }).catch(() => {
                fallbackCopyTextToClipboard(text, buttonElement);
            });
        } else {
            fallbackCopyTextToClipboard(text, buttonElement);
        }
    }

    function fallbackCopyTextToClipboard(text, buttonElement) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            onCopySuccess(buttonElement);
        } catch (err) {
            showToast('Unable to copy. Please copy manually.');
        }
        document.body.removeChild(textArea);
    }

    function onCopySuccess(buttonElement) {
        const originalHTML = buttonElement.innerHTML;
        buttonElement.classList.add('copied');
        buttonElement.innerHTML = `<i class="fa-solid fa-check"></i><span>Copied!</span>`;

        showToast('Prompt copied to clipboard successfully!');

        setTimeout(() => {
            buttonElement.classList.remove('copied');
            buttonElement.innerHTML = originalHTML;
        }, 2200);
    }

    // Delete prompt function
    function deletePrompt(promptId) {
        storedPrompts = storedPrompts.filter(p => p.id !== promptId);
        try {
            localStorage.setItem('ronit_portfolio_prompts', JSON.stringify(storedPrompts));
        } catch (e) {
            console.error('Error updating localStorage:', e);
        }
        renderPrompts();
        showToast('Prompt removed from library.');
    }

    // Filter clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activeFilter = button.getAttribute('data-filter');
            renderPrompts();
        });
    });

    // Form submit: Create Prompt (Frontend only, saves to localStorage)
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = titleInput.value.trim();
            const category = categorySelect.value;
            const content = contentTextarea.value.trim();

            if (!title || !content) {
                showToast('Please provide both a Title and Prompt Content.');
                return;
            }

            const newPrompt = {
                id: 'custom-' + Date.now(),
                title,
                category,
                content,
                isCustom: true
            };

            // Prepend new prompt to the top
            storedPrompts.unshift(newPrompt);

            try {
                localStorage.setItem('ronit_portfolio_prompts', JSON.stringify(storedPrompts));
            } catch (err) {
                console.error('Error saving prompt:', err);
            }

            form.reset();
            if (charCounter) charCounter.textContent = '0 / 1200';

            // Switch filter to 'all' or matching category to show the prompt immediately
            activeFilter = 'all';
            filterButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
            });

            renderPrompts();
            showToast('New prompt added to your library!');
        });
    }

    // Initial render
    renderPrompts();
}

/* ==========================================================================
   7. CONTACT SECTION INTERACTIONS
   ========================================================================== */
function initContactInteractions() {
    const contactForm = document.getElementById('contact-form');
    const senderName = document.getElementById('sender-name');
    const senderEmail = document.getElementById('sender-email');
    const senderSubject = document.getElementById('sender-subject');
    const senderMessage = document.getElementById('sender-message');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = senderName.value.trim();
        const email = senderEmail.value.trim();
        const subject = senderSubject.value.trim() || 'Portfolio Inquiry';
        const message = senderMessage.value.trim();

        if (!name || !email || !message) {
            showToast('Please fill out all required fields.');
            return;
        }

        const mailtoRecipient = '@ronitaiml.26';
        const bodyContent = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
        const mailtoUrl = `mailto:${mailtoRecipient}?subject=${encodeURIComponent(subject)}&body=${bodyContent}`;

        // Open mailto link
        window.location.href = mailtoUrl;

        showToast('Opening your email client to send message...');
        contactForm.reset();
    });
}

/* ==========================================================================
   8. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   9. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/* Helper to escape HTML characters */
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
