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

                // Stop observing once animated
                observer.unobserve(entry.target);
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
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    }

    // 6. Hover Counter Animation (0% to 98%)
    const hoverCounters = document.querySelectorAll('.hover-counter');
    hoverCounters.forEach(el => {
        let isAnimating = false;
        el.addEventListener('mouseenter', () => {
            if (isAnimating) return;
            isAnimating = true;
            const target = +el.getAttribute('data-target');
            let current = 0;
            const duration = 1200; // ms
            const increment = target / (duration / 16); 
            
            const update = () => {
                current += increment;
                if (current < target) {
                    el.innerText = Math.ceil(current) + '%';
                    requestAnimationFrame(update);
                } else {
                    el.innerText = target + '%';
                    setTimeout(() => isAnimating = false, 500); // Prevent instant replay
                }
            };
            
            // Add a little color flash for feedback
            const originalColor = el.style.color;
            el.style.color = "var(--text-light)";
            update();
            setTimeout(() => el.style.color = originalColor, duration);
        });
    });
});
