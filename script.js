document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursorOutline = document.querySelector('.cursor-outline');
    const linksAndButtons = document.querySelectorAll('a, button, .module-item');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        if (cursorOutline) {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Change cursor color based on section background
    const darkSections = document.querySelectorAll('.hero, .galerie-stats, .ingenierie, .contact, .stat-banner, .navbar, .footer');
    darkSections.forEach(sec => {
        sec.addEventListener('mouseenter', () => document.body.classList.add('cursor-on-dark'));
        sec.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on-dark'));
    });

    linksAndButtons.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            faqItems.forEach((other) => {
                other.classList.remove('is-open');
                const q = other.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Mobile Burger Menu Logic
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinksContainer = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');

    if (burgerMenu && navLinksContainer) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // 1.5. Remove Logo Background (Canvas Chroma Key)
    const logoImg = document.querySelector('.nav-logo img');
    if (logoImg) {
        // Run when the image is fully loaded
        if (logoImg.complete) {
            removeBackground(logoImg);
        } else {
            logoImg.addEventListener('load', () => removeBackground(logoImg), { once: true });
        }
    }

    function removeBackground(imgElement) {
        if (imgElement.src.startsWith('data:')) return; // Empêche la boucle infinie
        // Create an offscreen image to avoid CORS canvas taint issues if any
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Assume top-left pixel is the solid background color
            const r0 = data[0], g0 = data[1], b0 = data[2];
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                // Distance in RGB space
                const dist = Math.sqrt(Math.pow(r - r0, 2) + Math.pow(g - g0, 2) + Math.pow(b - b0, 2));
                
                // Tolerance threshold (adjust if edges are too sharp or background remains)
                const tolerance = 40; 
                
                if (dist < tolerance) {
                    // Smooth alpha transition for anti-aliasing edges
                    const alpha = Math.max(0, Math.min(255, Math.pow(dist / tolerance, 2) * 255));
                    data[i+3] = Math.min(a, alpha); // apply transparency
                }
            }
            ctx.putImageData(imageData, 0, 0);
            // Replace the image source with the transparent version
            imgElement.src = canvas.toDataURL('image/png');
        };
        img.src = imgElement.src;
    }

    // 2. Navigation Blur on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Word Reveal for Declaration Title
    const titleToReveal = document.querySelector('.declaration-title');
    if (titleToReveal) {
        const text = titleToReveal.innerText;
        const words = text.split(' ');
        titleToReveal.innerHTML = '';
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.innerHTML = `<span class="word-inner" style="transition-delay: ${index * 0.1}s">${word}&nbsp;</span>`;
            titleToReveal.appendChild(wordSpan);
        });
    }

    // 4. Intersection Observer for Scroll Animations
    const animatedSections = document.querySelectorAll('.section-animate');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Trigger counters if they exist in this section
                const counters = entry.target.querySelectorAll('.counter');
                if (counters.length > 0) {
                    runCounters(counters);
                }
            } else {
                entry.target.classList.remove('is-visible');
                // Reset counters
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    counter.innerText = '0' + (counter.getAttribute('data-suffix') || '');
                });
            }
        });
    }, observerOptions);

    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 5. Counters Animation
    function runCounters(counters) {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
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

    // 6. Formulaire d'Étude de Cas (Webhook Automation)
    const caseStudyForm = document.getElementById('caseStudyForm');
    const caseStudySuccess = document.getElementById('caseStudySuccess');
    const caseStudySubmit = document.getElementById('caseStudySubmit');

    if (caseStudyForm) {
        caseStudyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('caseStudyEmail').value;
            
            // Modifier le texte du bouton pendant le chargement
            const originalText = caseStudySubmit.innerText;
            caseStudySubmit.innerText = 'Envoi en cours...';
            caseStudySubmit.style.opacity = '0.7';
            caseStudySubmit.disabled = true;

            try {
                // REMPLACEZ CETTE URL PAR VOTRE WEBHOOK MAKE.COM OU ZAPIER
                const webhookUrl = 'https://hook.eu2.make.com/p5vdfmo6y26tbsvom5x84horc7xk7r73';
                
                if (webhookUrl === 'VOTRE_URL_WEBHOOK_ICI') {
                    // Simulation si l'URL n'est pas encore configurée
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    console.log("Email capturé (simulation) :", email);
                } else {
                    // Envoi réel vers le webhook
                    await fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            email: email, 
                            source: 'FocusAI Landing Page',
                            date: new Date().toISOString()
                        })
                    });
                }

                // Afficher le message de succès
                caseStudyForm.style.display = 'none';
                caseStudySuccess.style.display = 'block';

            } catch (error) {
                console.error("Erreur lors de l'envoi au webhook", error);
                alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
                caseStudySubmit.innerText = originalText;
                caseStudySubmit.style.opacity = '1';
                caseStudySubmit.disabled = false;
            }
        });
    }

    // 7. Audit Modal Logic
    window.openAuditModal = function(e) {
        if(e) e.preventDefault();
        const modal = document.getElementById('auditModal');
        if(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            
            // Close mobile menu if open
            const bMenu = document.getElementById('burgerMenu');
            const nLinks = document.getElementById('navLinks');
            if(bMenu && bMenu.classList.contains('active')) {
                bMenu.classList.remove('active');
                nLinks.classList.remove('active');
            }
        }
    };

    window.closeAuditModal = function() {
        const modal = document.getElementById('auditModal');
        if(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    const auditForm = document.getElementById('auditForm');
    if(auditForm) {
        auditForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('auditSubmitBtn');
            const originalText = btn.innerText;
            btn.innerText = 'Envoi en cours...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            const payload = {
                name: document.getElementById('auditName').value,
                email: document.getElementById('auditEmail').value,
                phone: document.getElementById('auditPhone').value,
                domain: document.getElementById('auditDomain').value,
                source: "FocusAI - Demande d'Audit Pop-up",
                date: new Date().toISOString()
            };

            try {
                const auditWebhookUrl = 'https://hook.eu2.make.com/dn74zfv9mkhvx62s6lwa9gu9z1yyj83r';
                
                await fetch(auditWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                auditForm.style.display = 'none';
                document.getElementById('auditSuccessMsg').style.display = 'block';
            } catch (err) {
                console.error(err);
                btn.innerText = 'Erreur. Réessayez.';
                btn.style.opacity = '1';
                btn.disabled = false;
            }
        });
    }
});
