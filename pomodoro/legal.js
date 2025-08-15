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
            // Skip elements with .content keys as they will be handled with innerHTML
            if (key.includes('.content')) {
                return;
            }
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
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key.includes('.content')) {
                const keys = key.split('.');
                let value = translations[lang];
                for (const k of keys) {
                    value = value[k];
                }
                element.innerHTML = value;
            }
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
    
    const animatedElements = document.querySelectorAll('.legal-section');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});