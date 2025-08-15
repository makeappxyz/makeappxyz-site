document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    let currentLang = localStorage.getItem('language') || 'zh';
    
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        
        const langNames = {
            'zh': '中文',
            'en': 'English',
            'ja': '日本語'
        };
        
        document.querySelector('.current-lang').textContent = langNames[lang];
        
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = translations[lang];
            for (const k of keys) {
                value = value[k];
            }
            element.textContent = value;
        });
        
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const keys = key.split('.');
            let value = translations[lang];
            for (const k of keys) {
                value = value[k];
            }
            element.innerHTML = value;
        });
    }
    
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');
    
    languageToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });
    
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const lang = this.dataset.lang;
            setLanguage(lang);
            languageDropdown.classList.remove('show');
        });
    });
    
    document.addEventListener('click', function() {
        languageDropdown.classList.remove('show');
    });
    
    setLanguage(currentLang);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.feature-card, .achievement-item, .achievement-card, .stat-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    const planeIcon = document.querySelector('.plane-icon');
    if (planeIcon) {
        let position = 0;
        setInterval(() => {
            position = (position + 1) % 100;
            const offset = Math.sin(position * 0.1) * 30;
            planeIcon.style.transform = `translateX(${offset}px)`;
        }, 50);
    }
    
    const timer = document.querySelector('.timer-display');
    if (timer) {
        let minutes = 23;
        let seconds = 45;
        
        setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    minutes = 23;
                    seconds = 45;
                } else {
                    minutes--;
                    seconds = 59;
                }
            } else {
                seconds--;
            }
            
            const displayMinutes = String(minutes).padStart(2, '0');
            const displaySeconds = String(seconds).padStart(2, '0');
            timer.textContent = `${displayMinutes}:${displaySeconds}`;
        }, 1000);
    }
    
    const counters = document.querySelectorAll('.summary-number');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    if (counter.textContent.includes('h')) {
                        counter.textContent = target + 'h';
                    } else if (counter.textContent.includes('km')) {
                        counter.textContent = target.toLocaleString() + 'km';
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }
            };
            
            counter.textContent = '0';
            updateCounter();
        });
    };
    
    const statsSection = document.querySelector('.stats-summary');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        bar.addEventListener('mouseenter', () => {
            bar.style.height = '100%';
        });
        
        bar.addEventListener('mouseleave', () => {
            bar.style.height = bar.style.getPropertyValue('--height');
        });
    });
    
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                
                const confetti = document.createElement('div');
                confetti.style.position = 'absolute';
                confetti.style.top = '50%';
                confetti.style.left = '50%';
                confetti.style.transform = 'translate(-50%, -50%)';
                confetti.textContent = '🎉';
                confetti.style.fontSize = '3rem';
                confetti.style.animation = 'confetti 1s ease-out forwards';
                this.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 1000);
            }, 200);
        });
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti {
            0% {
                transform: translate(-50%, -50%) scale(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -150%) scale(1.5) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // 初始化语言设置
    setLanguage(currentLang);
    
    console.log('Flight Focus - Ready for takeoff! ✈️');
});