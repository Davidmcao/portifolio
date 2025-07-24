// ===== PROJECTS MANAGEMENT =====

// GitHub API configuration
const GITHUB_USERNAME = 'Davidmcao';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

// Real projects from GitHub (based on actual repositories)
const realProjects = [
    {
        name: 'portifolio',
        description: 'Meu portfólio pessoal desenvolvido com HTML, CSS e JavaScript. Design responsivo e moderno com foco na experiência do usuário.',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        featured: true,
        demoUrl: 'https://david-mendes.vercel.app',
        githubUrl: 'https://github.com/Davidmcao/portifolio'
    },
    {
        name: 'FreeCalc',
        description: 'Uma aplicação web moderna e responsiva para calcular valores de frete baseados no CEP de destino, desenvolvida em PHP com integração à API ViaCEP.',
        tech: ['PHP', 'HTML5', 'CSS3', 'JavaScript'],
        featured: true,
        githubUrl: 'https://freecalc.free.nf/?i=1'
    },
    {
        name: 'Projeto-Senac---Landing-Page-Pokedex',
        description: 'Landing page temática do Pokémon desenvolvida como projeto do curso SENAC. Interface moderna e responsiva.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        featured: true,
        githubUrl: 'https://github.com/Davidmcao/Projeto-Senac---Landing-Page-Pokedex'
    },
    {
        name: 'Projeto-Senac-Landing-Page-The-box',
        description: 'Landing page "The Box" desenvolvida como projeto educacional no SENAC. Design clean e responsivo.',
        tech: ['HTML', 'CSS'],
        featured: true,
        githubUrl: 'https://github.com/Davidmcao/Projeto-Senac-Landing-Page-The-box'
    },
    {
        name: 'Projeto-Senac---Landing-Page-Twitter',
        description: 'Recriação da interface do Twitter como projeto de estudo. Foco em replicar o design e funcionalidades básicas.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        featured: true,
        githubUrl: 'https://github.com/Davidmcao/Projeto-Senac---Landing-Page-Twitter'
    },
    {
        name: 'Projeto-Dbz',
        description: 'Projeto temático de Dragon Ball Z desenvolvido com HTML e CSS. Interface interativa e design atrativo.',
        tech: ['HTML', 'CSS'],
        featured: false,
        githubUrl: 'https://github.com/Davidmcao/Projeto-Dbz'
    },
    {
        name: 'exercicios-java',
        description: 'Coleção de exercícios e práticas em Java desenvolvidos durante o curso. Diversos algoritmos e estruturas de dados.',
        tech: ['Java'],
        featured: false,
        githubUrl: 'https://github.com/Davidmcao/exercicios-java'
    }
];

// Project categories
const projectCategories = {
    all: 'Todos',
    web: 'Web Development',
    java: 'Java',
    frontend: 'Frontend'
};

// Tech stack icons mapping
const techIcons = {
    'HTML5': 'fab fa-html5',
    'HTML': 'fab fa-html5',
    'CSS3': 'fab fa-css3-alt',
    'CSS': 'fab fa-css3-alt',
    'JavaScript': 'fab fa-js-square',
    'Java': 'fab fa-java',
    'Default': 'fas fa-code'
};

// ===== PROJECT LOADING =====
class ProjectManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.isLoading = false;
        this.container = document.getElementById('projectsGrid');
        
        this.init();
    }
    
    async init() {
        await this.loadProjects();
        this.renderProjects();
        this.setupFilters();
        this.setupSearch();
    }
    
    async loadProjects() {
        this.isLoading = true;
        this.showLoading();
        
        try {
            // Use real projects from GitHub
            this.projects = realProjects;
            
            // Try to fetch additional data from GitHub API
            try {
                const response = await fetch(GITHUB_API_URL);
                if (response.ok) {
                    const githubRepos = await response.json();
                    this.mergeGitHubData(githubRepos);
                }
            } catch (error) {
                console.log('GitHub API not available, using static project data');
            }
            
            this.filteredProjects = [...this.projects];
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError();
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }
    
    mergeGitHubData(githubRepos) {
        // Update existing projects with GitHub data
        this.projects = this.projects.map(project => {
            const githubRepo = githubRepos.find(repo => repo.name === project.name);
            if (githubRepo) {
                return {
                    ...project,
                    description: project.description || githubRepo.description || 'Projeto desenvolvido como parte dos estudos.',
                    stars: githubRepo.stargazers_count,
                    forks: githubRepo.forks_count,
                    language: githubRepo.language,
                    updatedAt: githubRepo.updated_at,
                    githubUrl: githubRepo.html_url
                };
            }
            return project;
        });
    }
    
    renderProjects() {
        if (!this.container) return;
        
        if (this.filteredProjects.length === 0) {
            this.container.innerHTML = this.getEmptyState();
            return;
        }
        
        const projectsHTML = this.filteredProjects
            .slice(0, 6) // Limit to 6 projects for better performance
            .map(project => this.createProjectCard(project))
            .join('');
        
        this.container.innerHTML = projectsHTML;
        
        // Add animation delay to cards
        const cards = this.container.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
        
        // Setup card interactions
        this.setupCardInteractions();
    }
    
    createProjectCard(project) {
        const techBadges = project.tech
            .slice(0, 4) // Limit to 4 tech badges
            .map(tech => `<span class="tech-badge">${tech}</span>`)
            .join('');
        
        const stats = project.stars !== undefined ? `
            <div class="project-stats">
                <span class="stat">
                    <i class="fas fa-star"></i>
                    ${project.stars}
                </span>
                <span class="stat">
                    <i class="fas fa-code-branch"></i>
                    ${project.forks}
                </span>
            </div>
        ` : '';
        
        const demoLink = project.demoUrl ? `
            <a href="${project.demoUrl}" target="_blank" class="project-link" title="Ver Demo">
                <i class="fas fa-external-link-alt"></i>
            </a>
        ` : '';
        
        return `
            <div class="project-card" data-category="${this.getProjectCategory(project)}">
                <div class="project-header">
                    <h3 class="project-title">${this.formatProjectName(project.name)}</h3>
                    <div class="project-links">
                        ${demoLink}
                        <a href="${project.githubUrl}" target="_blank" class="project-link" title="Ver no GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
                
                <p class="project-description">${project.description}</p>
                
                ${stats}
                
                <div class="project-tech">
                    ${techBadges}
                </div>
                
                ${project.featured ? '<div class="featured-badge">Destaque</div>' : ''}
            </div>
        `;
    }
    
    formatProjectName(name) {
        return name
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/Senac/g, 'SENAC')
            .replace(/Dbz/g, 'DBZ');
    }
    
    getProjectCategory(project) {
        const name = project.name.toLowerCase();
        const tech = project.tech.join(' ').toLowerCase();
        
        if (tech.includes('java')) return 'java';
        if (tech.includes('html') || tech.includes('css') || tech.includes('javascript')) return 'web';
        if (name.includes('landing') || name.includes('page')) return 'frontend';
        
        return 'web'; // Default category
    }
    
    setupCardInteractions() {
        const cards = this.container.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            // Hover effect
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
            
            // Click effect
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.project-link')) {
                    const githubLink = card.querySelector('.project-link[href*="github"]');
                    if (githubLink) {
                        window.open(githubLink.href, '_blank');
                    }
                }
            });
        });
    }
    
    setupFilters() {
        // Create filter buttons if they don't exist
        const filtersContainer = document.querySelector('.project-filters');
        if (!filtersContainer) {
            this.createFilterButtons();
        }
        
        // Setup filter event listeners
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                const filter = e.target.dataset.filter;
                this.filterProjects(filter);
                
                // Update active filter button
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
    }
    
    createFilterButtons() {
        const projectsSection = document.getElementById('projects');
        const container = projectsSection.querySelector('.container');
        const sectionHeader = container.querySelector('.section-header');
        
        const filtersHTML = `
            <div class="project-filters">
                ${Object.entries(projectCategories)
                    .map(([key, label]) => `
                        <button class="filter-btn ${key === 'all' ? 'active' : ''}" data-filter="${key}">
                            ${label}
                        </button>
                    `).join('')}
            </div>
        `;
        
        sectionHeader.insertAdjacentHTML('afterend', filtersHTML);
    }
    
    setupSearch() {
        // Create search input if it doesn't exist
        const searchContainer = document.querySelector('.project-search');
        if (!searchContainer) {
            this.createSearchInput();
        }
        
        // Setup search event listener
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProjects(e.target.value);
            });
        }
    }
    
    createSearchInput() {
        const filtersContainer = document.querySelector('.project-filters');
        if (filtersContainer) {
            const searchHTML = `
                <div class="project-search">
                    <input type="text" id="projectSearch" placeholder="Buscar projetos..." class="search-input">
                    <i class="fas fa-search search-icon"></i>
                </div>
            `;
            filtersContainer.insertAdjacentHTML('afterend', searchHTML);
        }
    }
    
    filterProjects(category) {
        this.currentFilter = category;
        
        if (category === 'all') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(project => 
                this.getProjectCategory(project) === category
            );
        }
        
        this.renderProjects();
    }
    
    searchProjects(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filterProjects(this.currentFilter);
            return;
        }
        
        this.filteredProjects = this.projects.filter(project => {
            const searchableText = [
                project.name,
                project.description,
                ...project.tech
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchTerm);
        });
        
        this.renderProjects();
    }
    
    showLoading() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="projects-loading">
                    <div class="loading-spinner"></div>
                    <p>Carregando projetos...</p>
                </div>
            `;
        }
    }
    
    hideLoading() {
        const loadingElement = document.querySelector('.projects-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    showError() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="projects-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Erro ao carregar projetos</h3>
                    <p>Não foi possível carregar os projetos. Tente novamente mais tarde.</p>
                    <button class="btn btn-primary" onclick="projectManager.loadProjects()">
                        Tentar Novamente
                    </button>
                </div>
            `;
        }
    }
    
    getEmptyState() {
        return `
            <div class="projects-empty">
                <i class="fas fa-folder-open"></i>
                <h3>Nenhum projeto encontrado</h3>
                <p>Não há projetos que correspondam aos critérios de busca.</p>
            </div>
        `;
    }
}

// ===== INITIALIZE PROJECT MANAGER =====
let projectManager;

document.addEventListener('DOMContentLoaded', () => {
    projectManager = new ProjectManager();
});

// ===== UTILITY FUNCTIONS =====
function getTechIcon(tech) {
    return techIcons[tech] || techIcons['Default'];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProjectManager,
        realProjects,
        getTechIcon,
        formatDate,
        truncateText
    };
}

