document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fade-in-section');

    // Safely initialize Lucide icons
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error("Lucide failed to load", error);
    }

    // Intersection Observer for fade-in animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    } else {
        // Fallback if IntersectionObserver is not supported
        sections.forEach(section => section.classList.add('is-visible'));
    }

    // Safety fallback: force visibility after 1.5 seconds just in case the observer fails silently
    setTimeout(() => {
        sections.forEach(section => section.classList.add('is-visible'));
    }, 1500);

    // Text Split Animation for elegant staggered reveal
    const animateTitles = document.querySelectorAll('.brand-title, .large-title, .section-title');
    animateTitles.forEach(title => {
        const nodes = Array.from(title.childNodes);
        title.innerHTML = '';
        
        let charIndex = 0;
        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                for (let char of text) {
                    const span = document.createElement('span');
                    span.textContent = char;
                    if (char === ' ') {
                        span.style.whiteSpace = 'pre';
                    }
                    // Stagger the transition delay for each character
                    span.style.transitionDelay = `${charIndex * 0.03}s`;
                    span.classList.add('char-anim');
                    title.appendChild(span);
                    charIndex++;
                }
            } else if (node.nodeName.toLowerCase() === 'br') {
                title.appendChild(document.createElement('br'));
            } else {
                // For any other elements (like icons), just append them back
                title.appendChild(node.cloneNode(true));
            }
        });
    });

    // Image Slider Logic
    const slides = document.querySelectorAll('.slider-track .lighthouse-img');
    if (slides.length > 0) {
        const nextBtn = document.getElementById('sliderNext');
        const prevBtn = document.getElementById('sliderPrev');
        const dotsContainer = document.getElementById('sliderDots');
        let currentSlide = 0;
        let slideInterval;

        // Create dots dynamically based on number of slides
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.slider-dot');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('slide-active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = index;
            
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            
            slides[currentSlide].classList.add('slide-active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() { 
            goToSlide(currentSlide + 1); 
            resetInterval();
        }
        
        function prevSlide() { 
            goToSlide(currentSlide - 1); 
            resetInterval();
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        }

        // Start autoplay
        resetInterval();
    }
});
