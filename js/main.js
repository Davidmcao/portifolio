// ===== ARQUIVO JAVASCRIPT PRINCIPAL =====

// Elementos do DOM
const loadingScreen = document.getElementById('loadingScreen');
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-link');

// ===== TELA DE CARREGAMENTO =====
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        
        // Inicializa animações após o carregamento
        initializeAnimations();
        initializeCounters();
        initializeTechLevels();
        setupScrollIndicator();
    }, 2000);
});

// ===== FUNCIONALIDADE DO INDICADOR DE ROLAGEM =====
function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollArrow = document.querySelector('.scroll-arrow');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = aboutSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Torna clicável com cursor pointer
        scrollIndicator.style.cursor = 'pointer';
        
        // Adiciona efeito de hover
        scrollIndicator.addEventListener('mouseenter', () => {
            if (scrollArrow) {
                scrollArrow.style.transform = 'translateY(-5px)';
            }
        });
        
        scrollIndicator.addEventListener('mouseleave', () => {
            if (scrollArrow) {
                scrollArrow.style.transform = 'translateY(0)';
            }
        });
    }
}

// ===== EFEITO DE ROLAGEM DO CABEÇALHO =====
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Adiciona classe 'scrolled' para estilização
    if (header) {
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Esconde/mostra o cabeçalho ao rolar
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollY = currentScrollY;
    
    // Atualiza link de navegação ativo
    updateActiveNavLink();
    
    // Dispara animações ao rolar
    handleScrollAnimations();
    
    // Esconde indicador de rolagem ao rolar
    hideScrollIndicatorOnScroll();
});

// ===== ESCONDER INDICADOR DE ROLAGEM =====
function hideScrollIndicatorOnScroll() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
        }
    }
}

// ===== NAVEGAÇÃO =====
// Alternância do menu mobile
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

// Fecha o menu mobile ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});

// Rolagem suave para links de navegação
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection && header) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Atualiza link de navegação ativo conforme posição de rolagem
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + (header ? header.offsetHeight : 80) + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// ===== ALTERNAÇÃO DE TEMA =====
let isDarkTheme = true;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle('light-theme', !isDarkTheme);
        
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        // Salva preferência de tema
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    });
}

// Carrega tema salvo
const savedTheme = localStorage.getItem('theme');
if (savedTheme && themeToggle) {
    isDarkTheme = savedTheme === 'dark';
    document.body.classList.toggle('light-theme', !isDarkTheme);
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ===== ANIMAÇÕES =====
function initializeAnimations() {
    // Intersection Observer para animações de rolagem
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    const animateElements = document.querySelectorAll('.tech-category, .project-card, .contact-card, .timeline-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

function handleScrollAnimations() {
    // Efeito parallax para elementos flutuantes
    const floatingElements = document.querySelectorAll('.floating-element');
    const scrolled = window.pageYOffset;
    
    floatingElements.forEach((element, index) => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
}

// ===== CONTADORES =====
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 40);
}

// ===== NÍVEIS DE TECNOLOGIA =====
function initializeTechLevels() {
    const techLevels = document.querySelectorAll('.level-bar');
    
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.dataset.level;
                setTimeout(() => {
                    bar.style.width = `${level}%`;
                }, 500);
                techObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    techLevels.forEach(bar => {
        techObserver.observe(bar);
    });
}

// ===== INTERAÇÕES COM ITENS DE TECNOLOGIA =====
document.addEventListener('DOMContentLoaded', () => {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const techName = item.dataset.tech;
            if (techName) {
                // Adiciona efeito de hover ou mostra informação adicional
                item.style.transform = 'translateX(10px) scale(1.02)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0) scale(1)';
        });
    });
});

// ===== TRATAMENTO DO FORMULÁRIO =====
function handleContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtém dados do formulário
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Mostra estado de carregamento
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simula envio do formulário
            setTimeout(() => {
                // Reseta formulário
                contactForm.reset();
                
                // Mostra mensagem de sucesso
                showNotification('Mensagem enviada com sucesso!', 'success');
                
                // Reseta botão
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Mostra notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== NAVEGAÇÃO POR TECLADO =====
document.addEventListener('keydown', (e) => {
    // Tecla ESC para fechar menu mobile
    if (e.key === 'Escape') {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
    
    // Setas para navegação
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let targetIndex;
            
            if (e.key === 'ArrowDown') {
                targetIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else {
                targetIndex = Math.max(currentIndex - 1, 0);
            }
            
            const targetSection = sections[targetIndex];
            if (targetSection && header) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
});

// ===== OTIMIZAÇÕES DE PERFORMANCE =====
// Função debounce para eventos de rolagem
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função throttle para eventos de resize
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Manipulador de rolagem otimizado
const optimizedScrollHandler = throttle(() => {
    updateActiveNavLink();
    handleScrollAnimations();
    hideScrollIndicatorOnScroll();
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// ===== MANIPULADOR DE RESIZE =====
const optimizedResizeHandler = debounce(() => {
    // Lida com mudanças responsivas
    if (window.innerWidth > 1024) {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// ===== ACESSIBILIDADE =====
// Gerenciamento de foco para navegação por teclado
document.addEventListener('focusin', (e) => {
    if (e.target.matches('.nav-link, .btn, .contact-card a')) {
        e.target.style.outline = '2px solid var(--primary-green)';
        e.target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', (e) => {
    if (e.target.matches('.nav-link, .btn, .contact-card a')) {
        e.target.style.outline = 'none';
    }
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa todos os componentes
    handleContactForm();
    setupScrollIndicator();
    
    // Adiciona classe de carregamento ao body
    document.body.classList.add('loading');
    
    // Remove classe de carregamento após tudo carregar
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 1000);
    });
});

// ===== EASTER EGG =====
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg ativado!
        document.body.style.filter = 'hue-rotate(180deg)';
        showNotification('🎉 Código Konami ativado! Você encontrou o easter egg!', 'success');
        
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 5000);
        
        konamiCode = [];
    }
});

// ===== EXPORTAÇÃO PARA TESTES =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateActiveNavLink,
        animateCounter,
        showNotification,
        debounce,
        throttle,
        setupScrollIndicator
    };
}