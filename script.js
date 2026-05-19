document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const useCustomCursor = hasFinePointer && !prefersReducedMotion;

    // 1. Custom Cursor (desktop uniquement)
    const cursorOutline = document.querySelector('.cursor-outline');

    if (useCustomCursor && cursorOutline) {
        document.body.classList.add('custom-cursor');
        const linksAndButtons = document.querySelectorAll('a, button, .module-item, input, textarea, select');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let outlineX = mouseX;
        let outlineY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const darkSections = document.querySelectorAll('.hero, .galerie-stats, .ingenierie, .contact, .stat-banner, .navbar, .footer, .case-study-form');
        darkSections.forEach((sec) => {
            sec.addEventListener('mouseenter', () => document.body.classList.add('cursor-on-dark'));
            sec.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on-dark'));
        });

        linksAndButtons.forEach((el) => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    } else if (cursorOutline) {
        cursorOutline.remove();
    }

    // Scroll lock helper
    function setScrollLock(locked) {
        document.body.classList.toggle('no-scroll', locked);
    }

    // Mobile Burger Menu
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinksContainer = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');

    function closeMobileMenu() {
        if (!burgerMenu || !navLinksContainer) return;
        burgerMenu.classList.remove('active');
        navLinksContainer.classList.remove('active');
        burgerMenu.setAttribute('aria-expanded', 'false');
        burgerMenu.setAttribute('aria-label', 'Ouvrir le menu');
        setScrollLock(false);
    }

    function openMobileMenu() {
        if (!burgerMenu || !navLinksContainer) return;
        burgerMenu.classList.add('active');
        navLinksContainer.classList.add('active');
        burgerMenu.setAttribute('aria-expanded', 'true');
        burgerMenu.setAttribute('aria-label', 'Fermer le menu');
        setScrollLock(true);
    }

    if (burgerMenu && navLinksContainer) {
        burgerMenu.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.contains('active');
            if (isOpen) closeMobileMenu();
            else openMobileMenu();
        });

        navItems.forEach((item) => {
            item.addEventListener('click', closeMobileMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMobileMenu();
        });
    }

    // Logo background removal
    const logoImg = document.querySelector('.nav-logo img');
    if (logoImg) {
        if (logoImg.complete) {
            removeBackground(logoImg);
        } else {
            logoImg.addEventListener('load', () => removeBackground(logoImg), { once: true });
        }
    }

    function removeBackground(imgElement) {
        if (imgElement.src.startsWith('data:')) return;
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const r0 = data[0], g0 = data[1], b0 = data[2];

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                const dist = Math.sqrt(Math.pow(r - r0, 2) + Math.pow(g - g0, 2) + Math.pow(b - b0, 2));
                const tolerance = 40;
                if (dist < tolerance) {
                    const alpha = Math.max(0, Math.min(255, Math.pow(dist / tolerance, 2) * 255));
                    data[i + 3] = Math.min(a, alpha);
                }
            }
            ctx.putImageData(imageData, 0, 0);
            imgElement.src = canvas.toDataURL('image/png');
        };
        img.src = imgElement.src;
    }

    // Navigation blur on scroll
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Word reveal for declaration title
    const titleToReveal = document.querySelector('.declaration-title');
    if (titleToReveal && !prefersReducedMotion) {
        const words = titleToReveal.innerText.split(' ');
        titleToReveal.innerHTML = '';
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.innerHTML = `<span class="word-inner" style="transition-delay: ${index * 0.08}s">${word}&nbsp;</span>`;
            titleToReveal.appendChild(wordSpan);
        });
    }

    // Intersection Observer
    const animatedSections = document.querySelectorAll('.section-animate');
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    const counters = entry.target.querySelectorAll('.counter');
                    if (counters.length > 0) runCounters(counters);
                } else if (!prefersReducedMotion) {
                    entry.target.classList.remove('is-visible');
                    entry.target.querySelectorAll('.counter').forEach((counter) => {
                        counter.innerText = '0' + (counter.getAttribute('data-suffix') || '');
                    });
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animatedSections.forEach((section) => sectionObserver.observe(section));

    function runCounters(counters) {
        counters.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = prefersReducedMotion ? 0 : 2000;
            if (duration === 0) {
                counter.innerText = target + suffix;
                return;
            }
            const increment = target / (duration / 16);
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCounter();
        });
    }

    // Case study form
    const caseStudyForm = document.getElementById('caseStudyForm');
    const caseStudySuccess = document.getElementById('caseStudySuccess');
    const caseStudySubmit = document.getElementById('caseStudySubmit');

    if (caseStudyForm) {
        caseStudyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('caseStudyEmail').value;
            const originalText = caseStudySubmit.innerHTML;
            caseStudySubmit.innerHTML = 'Envoi en cours…';
            caseStudySubmit.disabled = true;

            try {
                const webhookUrl = 'https://hook.eu2.make.com/p5vdfmo6y26tbsvom5x84horc7xk7r73';
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        source: 'FocusAI Landing Page',
                        date: new Date().toISOString(),
                    }),
                });

                caseStudyForm.hidden = true;
                caseStudySuccess.hidden = false;
            } catch (error) {
                console.error('Erreur webhook étude de cas', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
                caseStudySubmit.innerHTML = originalText;
                caseStudySubmit.disabled = false;
            }
        });
    }

    // Audit Modal
    const auditModal = document.getElementById('auditModal');
    let lastFocusedElement = null;

    function showSuccess(el) {
        if (!el) return;
        el.hidden = false;
    }

    window.openAuditModal = function (e) {
        if (e) e.preventDefault();
        if (!auditModal) return;

        lastFocusedElement = document.activeElement;
        auditModal.classList.add('active');
        auditModal.setAttribute('aria-hidden', 'false');
        setScrollLock(true);
        closeMobileMenu();

        const firstInput = auditModal.querySelector('input');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    };

    window.closeAuditModal = function () {
        if (!auditModal) return;
        auditModal.classList.remove('active');
        auditModal.setAttribute('aria-hidden', 'true');
        setScrollLock(false);
        if (lastFocusedElement) lastFocusedElement.focus();
    };

    if (auditModal) {
        auditModal.addEventListener('click', (e) => {
            if (e.target === auditModal) closeAuditModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && auditModal.classList.contains('active')) {
                closeAuditModal();
            }
        });
    }

    const auditForm = document.getElementById('auditForm');
    if (auditForm) {
        auditForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = document.getElementById('auditSubmitBtn');
            const originalText = btn.innerText;
            btn.innerText = 'Envoi en cours…';
            btn.disabled = true;

            const payload = {
                name: document.getElementById('auditName').value,
                email: document.getElementById('auditEmail').value,
                phone: document.getElementById('auditPhone').value,
                domain: document.getElementById('auditDomain').value,
                source: "FocusAI - Demande d'Audit Pop-up",
                date: new Date().toISOString(),
            };

            try {
                await fetch('https://hook.eu2.make.com/dn74zfv9mkhvx62s6lwa9gu9z1yyj83r', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                auditForm.hidden = true;
                showSuccess(document.getElementById('auditSuccessMsg'));
            } catch (err) {
                console.error(err);
                btn.innerText = 'Erreur — réessayez';
                btn.disabled = false;
            }
        });
    }
});
