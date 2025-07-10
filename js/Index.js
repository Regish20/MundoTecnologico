
    // ==========================================
    // SISTEMA DE TEMAS (CLARO/OSCURO)
    // ==========================================

    // Función para alternar entre modo claro y oscuro
    function initThemeToggle() {
      document.getElementById('theme-toggle').addEventListener('click', function (e) {
        e.preventDefault();

        const iconElement = this.querySelector('i');
        const isDarkMode = document.body.classList.toggle('dark-mode');

        if (isDarkMode) {
          iconElement.classList.remove('fa-moon');
          iconElement.classList.add('fa-sun');
          localStorage.setItem('theme', 'dark');
        } else {
          iconElement.classList.remove('fa-sun');
          iconElement.classList.add('fa-moon');
          localStorage.setItem('theme', 'light');
        }
      });
    }

    // Verificar tema guardado
    function checkSavedTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
        }
      }
    }

    // ==========================================
    // SISTEMA DE AUTENTICACIÓN
    // ==========================================

    // Función para manejar el formulario de registro
    function initRegisterForm() {
      document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerPasswordConfirm').value;
        
        // Validación básica
        if (password !== confirmPassword) {
          document.getElementById('register-error').textContent = 'Las contraseñas no coinciden';
          document.getElementById('register-error').classList.remove('d-none');
          document.getElementById('register-success').classList.add('d-none');
          return;
        }
        
        // Simulación de registro exitoso
        const userData = {
          name: name,
          email: email,
          registeredAt: new Date().toISOString()
        };
        
        // Guardar en localStorage (simulando una base de datos)
        localStorage.setItem('user_' + email, JSON.stringify(userData));
        
        // Mostrar mensaje de éxito
        document.getElementById('register-success').classList.remove('d-none');
        document.getElementById('register-error').classList.add('d-none');
        
        this.reset();
    
        setTimeout(() => {
          const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
          modal.hide();
        }, 2000);
      });
    }

    // Función para manejar el formulario de inicio de sesión
    function initLoginForm() {
      document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('loginRemember').checked;
        
        // Verificar si el usuario existe (simulación)
        const userData = localStorage.getItem('user_' + email);
        
        if (userData) {
          document.getElementById('login-success').classList.remove('d-none');
          document.getElementById('login-error').classList.add('d-none');
          
          // Guardar sesión
          if (remember) {
            localStorage.setItem('currentUser', email);
          } else {
            sessionStorage.setItem('currentUser', email);
          }
          
          this.reset();
          
          updateUIForLoggedUser(JSON.parse(userData));
          
          setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
          }, 2000);
        } else {
          document.getElementById('login-error').classList.remove('d-none');
          document.getElementById('login-success').classList.add('d-none');
        }
      });
    }

    // Función para actualizar la UI cuando el usuario está logueado
    function updateUIForLoggedUser(userData) {
      const loginButton = document.querySelector('.btn-light.text-danger');
      const registerButton = document.querySelector('.btn-outline-light.me-2');
      
      if (loginButton) {
        loginButton.innerHTML = `<i class="fas fa-user me-1"></i> ${userData.name}`;
      }
      if (registerButton) {
        registerButton.innerHTML = `<i class="fas fa-sign-out-alt me-1"></i> Cerrar sesión`;
        
        registerButton.removeEventListener('click', openRegisterModal);
        registerButton.addEventListener('click', logoutUser);
      }
    }

    // Función para cerrar sesión
    function logoutUser(e) {
      e.preventDefault();
      
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      
      const loginButton = document.querySelector('.btn-light.text-danger');
      const registerButton = document.querySelector('.btn-outline-light.me-2');
      
      if (loginButton) {
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt me-1"></i> <span class="login-text">Iniciar Sesión</span>';
      }
      if (registerButton) {
        registerButton.innerHTML = '<i class="fas fa-user-plus me-1"></i> <span class="register-text">Registrarse</span>';
        
        registerButton.addEventListener('click', openRegisterModal);
      }
      
      location.reload();
    }

    function openRegisterModal() {
      const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
      registerModal.show();
    }
    
    function checkLoggedUser() {
      const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      
      if (currentUser) {
        const userData = localStorage.getItem('user_' + currentUser);
        if (userData) {
          updateUIForLoggedUser(JSON.parse(userData));
        }
      }
    }

    // ==========================================
    // CONFIGURACIÓN DE IDIOMA
    // ==========================================

    // Verificar idioma guardado
    function checkSavedLanguage() {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      if (savedLanguage && translations && translations[savedLanguage]) {
        changeLanguage(savedLanguage);
      }
    }

    // ==========================================
    // INICIALIZACIÓN Y EVENTOS
    // ==========================================

    // Configuración inicial del DOM
    document.addEventListener('DOMContentLoaded', function() {
      
      // Inicializar Google Translate observer
      const observer = new MutationObserver(hideGoogleTranslateDiv);
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      hideGoogleTranslateDiv();

      // Configurar formulario de búsqueda
      const searchForm = document.getElementById('search-form');
      const searchInput = document.getElementById('search-input');
      
      if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const searchTerm = searchInput.value.trim();
          
          if (searchTerm.length > 0) {
            // Realizar búsqueda
            const results = performSearch(searchTerm);
            
            // Mostrar resultados
            displaySearchResults(results, searchTerm);
            
            // Guardar búsqueda reciente
            saveRecentSearch(searchTerm);
            
            console.log(`Búsqueda realizada: "${searchTerm}" - ${results.length} resultados encontrados`);
          }
        });
      }
      
      // Búsqueda en tiempo real 
      if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
          clearTimeout(searchTimeout);
          
          const searchTerm = this.value.trim();
          
          if (searchTerm.length >= 3) {
            searchTimeout = setTimeout(() => {
              const results = performSearch(searchTerm);
              displaySearchResults(results, searchTerm);
            }, 500); 
          } else if (searchTerm.length === 0) {
            clearSearchResults();
          }
        });
      }

      // Inicializar sistemas
      initThemeToggle();
      initRegisterForm();
      initLoginForm();
      
      // Verificar configuraciones guardadas
      checkSavedTheme();
      checkSavedLanguage();
      checkLoggedUser();

      // Configuración responsive para dispositivos móviles
      if (window.innerWidth < 768) {
        const languageSelector = document.querySelector('.language-selector');
        if (languageSelector) {
          languageSelector.style.display = 'none';
        }
      }

      const explorarBtn = document.getElementById('explorarNoticiasBtn');
      if (explorarBtn) {
        explorarBtn.addEventListener('click', function(e) {
          e.preventDefault();
          const tabsSection = document.getElementById('categoryTabs');
          if (tabsSection) {
            tabsSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    });


