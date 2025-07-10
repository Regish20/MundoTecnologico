
    // ==========================================
    // FUNCIONES DE BÚSQUEDA
    // ==========================================
    
    // Función principal de búsqueda
    function performSearch(query) {
      const searchTerm = query.toLowerCase().trim();
      
      if (searchTerm === '') {
        return [];
      }
      
      return articlesData.filter(article => {
        return (
          article.title.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm) ||
          article.category.toLowerCase().includes(searchTerm) ||
          article.author.toLowerCase().includes(searchTerm) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      });
    }
    
    // Función para mostrar resultados de búsqueda
    function displaySearchResults(results, query) {
      const container = document.querySelector('.container.mb-5');
      
      // Remover resultados anteriores si existen
      const existingResults = document.getElementById('search-results');
      if (existingResults) {
        existingResults.remove();
      }
      
      // Crear contenedor de resultados
      const resultsContainer = document.createElement('div');
      resultsContainer.id = 'search-results';
      resultsContainer.className = 'mb-5';
      
      let html = `
        <div class="row mb-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="h4 text-danger">
                <i class="fas fa-search me-2"></i>
                Resultados de búsqueda para: "<span class="text-dark">${query}</span>"
              </h2>
              <button onclick="clearSearchResults()" class="btn btn-outline-secondary btn-sm">
                <i class="fas fa-times me-1"></i>Limpiar
              </button>
            </div>
            <p class="text-muted">Se encontraron ${results.length} resultado(s)</p>
          </div>
        </div>
      `;
      
      if (results.length === 0) {
        html += `
          <div class="row">
            <div class="col-12">
              <div class="text-center py-5">
                <i class="fas fa-search fs-1 text-muted mb-3"></i>
                <h3 class="text-muted">No se encontraron resultados</h3>
                <p class="text-muted">Intenta con otros términos de búsqueda</p>
              </div>
            </div>
          </div>
        `;
      } else {
        html += '<div class="row g-4">';
        
        results.forEach(article => {
          const badgeColor = getBadgeColor(article.category);
          const formattedDate = formatDate(article.date);
          
          html += `
            <div class="col-md-6 col-lg-4">
              <div class="card h-100 shadow-sm border-0">
                <div class="card-body">
                  <div class="mb-2">
                    <span class="badge ${badgeColor} mb-2">${article.category}</span>
                  </div>
                  <h5 class="card-title">
                    <a href="#" class="text-decoration-none text-dark" onclick="mostrarNoticiaCompleta(${article.id})">
                      ${highlightSearchTerm(article.title, query)}
                    </a>
                  </h5>
                  <p class="card-text text-muted small">
                    ${highlightSearchTerm(article.content.substring(0, 100) + '...', query)}
                  </p>
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                      <i class="fas fa-user me-1"></i>${article.author}
                    </small>
                    <small class="text-muted">
                      <i class="fas fa-calendar me-1"></i>${formattedDate}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
        
        html += '</div>';
      }
      
      resultsContainer.innerHTML = html;

      // Insertar resultados después del hero section
      const heroSection = document.querySelector('.hero-section').closest('.row');
      heroSection.parentNode.insertBefore(resultsContainer, heroSection.nextSibling);
      
      // Scroll a los resultados
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Función para resaltar términos de búsqueda
    function highlightSearchTerm(text, term) {
      if (!term.trim()) return text;
      
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark class="bg-warning">$1</mark>');
    }

    // Función para limpiar resultados
    function clearSearchResults() {
      const resultsContainer = document.getElementById('search-results');
      if (resultsContainer) {
        resultsContainer.remove();
      }
      
      // Limpiar input de búsqueda
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.value = '';
      }
    }

    function openArticle(articleId) {
      const article = articlesData.find(a => a.id === articleId);
      if (article) {
        alert(`Abriendo artículo: "${article.title}"\n\nEn una implementación real, esto redirigiría a la página completa del artículo.`);
      }
    }

    // Función para guardar búsquedas recientes 
    function saveRecentSearch(term) {
      let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      
      // Evitar duplicados y agregar al principio
      recentSearches = recentSearches.filter(search => search.toLowerCase() !== term.toLowerCase());
      recentSearches.unshift(term);
      recentSearches = recentSearches.slice(0, 10);
      
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }

    // Función para mostrar búsquedas recientes
    function showRecentSearches() {
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      
      if (recentSearches.length > 0) {
        console.log('Búsquedas recientes:', recentSearches);
        // Podrías implementar una lista desplegable aquí
      }
    }

    // ==========================================
    // FUNCIONES AUXILIARES
    // ==========================================

    // Función para obtener color de badge según categoría
    function getBadgeColor(category) {
      const colors = {
        'Desarrollo': 'bg-primary',
        'Innovación': 'bg-info',
        'Programación': 'bg-success',
        'Hardware': 'bg-secondary',
        'Ciberseguridad': 'bg-warning text-dark',
        'IA': 'bg-danger'
      };
      return colors[category] || 'bg-secondary';
    }

    // Función para formatear fecha
    function formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    }

    document.addEventListener('DOMContentLoaded', function() {
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const hoy = new Date();
      const fechaFormateada = `${dias[hoy.getDay()]}, ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`;
      const fechaElemento = document.getElementById('current-date');
      if (fechaElemento) fechaElemento.textContent = fechaFormateada;
    });