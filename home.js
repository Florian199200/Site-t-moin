/**
 * home.js - JavaScript spécifique à la page d'accueil LINKA LAB
 * Gère les animations et interactions spécifiques
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Animation des compteurs
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // Contrôle la vitesse des compteurs
        
        counters.forEach(counter => {
            // Initialiser à "+0%"
            counter.innerText = "+0%";
            
            // Fonction pour incrémenter le compteur
            function updateCount() {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace('+', '').replace('%', '');
                const increment = target / speed;
                
                if (count < target) {
                    counter.innerText = '+' + Math.ceil(count + increment) + '%';
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = '+' + target + '%';
                    // Ajouter la classe au parent .metric pour activer la diode
                    counter.closest('.metric').classList.add('counter-complete');
                }
            }
            
            // Observer pour démarrer l'animation quand visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCount();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    // Animation de la roadmap au scroll
    function initRoadmap() {
        const steps = document.querySelectorAll('.roadmap-step');
        const progress = document.querySelector('.roadmap-progress');
        const roadmapContainer = document.querySelector('.roadmap-container');
        
        // Détection mobile fiable
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
        
        if (!roadmapContainer) return; // Sortir si l'élément n'existe pas
        
        if (isMobile) {
            // Approche simplifiée pour mobile
            let currentActive = 0;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const step = entry.target;
                        const stepIndex = parseInt(step.dataset.step) - 1;
                        
                        // Activer l'étape actuelle et toutes les précédentes
                        steps.forEach((s, index) => {
                            if (index <= stepIndex) {
                                s.classList.add('active');
                            }
                        });
                        
                        // Mettre à jour la progression
                        const progressValue = ((stepIndex + 1) / steps.length) * 100;
                        progress.style.height = progressValue + '%';
                        
                        // Mettre à jour l'index actif
                        if (stepIndex > currentActive) {
                            currentActive = stepIndex;
                        }
                    }
                });
            }, { threshold: 0.3 });
            
            steps.forEach(step => {
                observer.observe(step);
            });
        } else {
            // Animation basée sur le scroll pour desktop
            function animateOnScroll() {
                if (!roadmapContainer) return;
                
                const scrollPosition = window.scrollY + window.innerHeight * 0.6;
                const sectionTop = roadmapContainer.getBoundingClientRect().top + window.scrollY;
                const sectionHeight = roadmapContainer.offsetHeight;
                const sectionProgress = (scrollPosition - sectionTop) / sectionHeight;
                
                // Limiter la progression entre 0 et 1
                const limitedProgress = Math.max(0, Math.min(1, sectionProgress));
                
                // Appliquer la hauteur à la barre de progression
                if (progress) {
                    progress.style.height = (limitedProgress * 100) + '%';
                }
                
                // Activer les étapes en fonction du défilement
                steps.forEach((step, index) => {
                    const stepTop = step.getBoundingClientRect().top + window.scrollY;
                    
                    if (scrollPosition > stepTop) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                });
            }
            
            // Initialisation pour desktop
            window.addEventListener('scroll', animateOnScroll);
            window.addEventListener('resize', animateOnScroll);
            
            // Déclencher une fois au chargement
            setTimeout(animateOnScroll, 300);
            
            // S'assurer que l'animation fonctionne même sur les longs chargements
            window.addEventListener('load', animateOnScroll);
        }
    }
    
    // Initialisation des animations
    initCounters();
    initRoadmap();
    
    // Animation d'apparition des éléments au scroll
    function initRevealOnScroll() {
        const elements = document.querySelectorAll('.reveal-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Ajouter la classe pour permettre l'animation
    document.querySelectorAll('.hero-content, .hero-visual, .metric, .section-header').forEach(el => {
        el.classList.add('reveal-on-scroll');
    });
    
    initRevealOnScroll();
    
    // Ajuster la taille des sections sur mobile
    function adjustSectionHeight() {
        const viewportHeight = window.innerHeight;
        const hero = document.querySelector('.hero');
        
        if (window.innerWidth <= 767 && hero) {
            hero.style.minHeight = viewportHeight + 'px';
        } else if (hero) {
            hero.style.minHeight = '100vh';
        }
    }
    
    window.addEventListener('resize', adjustSectionHeight);
    adjustSectionHeight();
});
