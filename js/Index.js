
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

  

  function mostrarNoticiaCompleta(id) {
    const noticia = articlesData.find(n => n.id === id);
    if (!noticia) return;

    // Asocia imágenes a cada noticia por id
    let imagen = '';
    switch (id) {
      case 1:
        imagen = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80';
        break;
      case 2:
        imagen = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80';
        break;
      case 3:
        imagen = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';
        break;
      case 4:
        imagen = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
        break;
      case 5:
        imagen = 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80';
        break;
      case 6:
        imagen = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'; // Imagen tecnológica moderna
        break;
      case 7:
        imagen = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80';
        break;
      case 8:
        imagen = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'; // Imagen de evento tecnológico
        break;
      case 9:
        imagen = 'https://images.unsplash.com/photo-1667372459567-3853510dd5ce?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        break;
      case 10:
        imagen = 'https://images.unsplash.com/photo-1669023414171-56f0740e34cd?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        break;
      case 11:
        imagen = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80';
        break;
      case 12:
        imagen = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        break;
      case 13:
        imagen = 'https://images.unsplash.com/photo-1506097425191-7ad538b29cef?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        break;
      default:
        imagen = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80';
    }


    // Contenido extendido personalizado para cada noticia
    let contenidoExtendido = '';
    if (id === 1) {
      contenidoExtendido = `
        <p>
          El desarrollo web ha experimentado una transformación radical en los últimos años gracias a la aparición de frameworks como Next.js, React y Vue. Estos frameworks permiten a los desarrolladores crear aplicaciones más rápidas, escalables y seguras.
        </p>
        <p>
          Además, la integración de inteligencia artificial en los flujos de trabajo está permitiendo automatizar tareas repetitivas, mejorar la experiencia del usuario y optimizar el rendimiento de las aplicaciones.
        </p>
        <ul>
          <li>Automatización de pruebas y despliegues.</li>
          <li>Generación de código asistida por IA.</li>
          <li>Personalización dinámica de interfaces.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"La revolución de los frameworks JavaScript y la IA está democratizando el acceso al desarrollo web profesional." - Juan Pérez, experto en desarrollo web</p>
        
        </blockquote>
        <p>
          En conclusión, los desarrolladores full-stack que dominen estas herramientas estarán mejor preparados para afrontar los retos del futuro tecnológico.
        </p>
      `;
    } else if (id === 2) {
      contenidoExtendido = `
        <p>
          Las startups tecnológicas están liderando la innovación en sectores clave como la salud, la educación y la energía. Gracias a la inteligencia artificial y la automatización, estas empresas logran procesos más eficientes y productos más inteligentes.
        </p>
        <ul>
          <li>IA aplicada a diagnósticos médicos.</li>
          <li>Robots en la industria manufacturera.</li>
          <li>Plataformas educativas personalizadas.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"La automatización no solo reduce costos, sino que también mejora la calidad de vida de las personas." - María García, analista de innovación</p>
        </blockquote>
        <p>
          El futuro de la industria será cada vez más digital y automatizado, abriendo nuevas oportunidades para emprendedores y profesionales tecnológicos.
        </p>
      `;
    } else if (id === 3) {
      contenidoExtendido = `
        <p>
          Java sigue evolucionando con nuevas versiones que mejoran el rendimiento, la seguridad y la productividad de los desarrolladores. El salto del JDK 8 al JDK 28 incluye características como expresiones lambda, módulos, y mejoras en la recolección de basura.
        </p>
        <ul>
          <li>Mayor compatibilidad con la nube.</li>
          <li>Herramientas modernas para desarrollo empresarial.</li>
          <li>Soporte extendido y comunidad activa.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"Java se mantiene relevante gracias a su constante innovación y robustez." - Carlos López, arquitecto de software</p>
        </blockquote>
        <p>
          Si eres desarrollador, actualizarte en Java es clave para aprovechar todo su potencial en el mundo empresarial actual.
        </p>
      `;
    } else if (id === 4) {
      contenidoExtendido = `
        <p>
          Los procesadores cuánticos prometen revolucionar la informática doméstica. Gracias a avances en miniaturización y enfriamiento, pronto estarán disponibles para consumidores.
        </p>
        <ul>
          <li>Procesamiento de datos a velocidades nunca vistas.</li>
          <li>Aplicaciones en criptografía y simulaciones científicas.</li>
          <li>Desafíos en software y compatibilidad.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"La computación cuántica será tan común como los smartphones en pocos años." - Ana Rodríguez, ingeniera en hardware</p>
          
        </blockquote>
        <p>
          Prepárate para una nueva era de tecnología en casa.
        </p>
      `;
    } else if (id === 5) {
      contenidoExtendido = `
        <p>
          La autenticación biométrica está reemplazando rápidamente a las contraseñas tradicionales. El reconocimiento facial y de voz ofrecen mayor seguridad y comodidad.
        </p>
        <ul>
          <li>Menos riesgo de hackeos por contraseñas débiles.</li>
          <li>Acceso rápido y personalizado a dispositivos.</li>
          <li>Desafíos en privacidad y protección de datos.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"La biometría es el futuro de la seguridad digital." - Pedro Martínez, experto en ciberseguridad<</p>
        </blockquote>
        <p>
          ¿Estás listo para decirle adiós a tus contraseñas?
        </p>
      `;
    } else if (id === 6) {
      contenidoExtendido = `
        <p>
          Configurar tu entorno de desarrollo para Python en 2025 es más sencillo y potente que nunca. Aquí tienes una guía paso a paso para que tu experiencia como desarrollador sea óptima:
        </p>
        <ol>
          <li><strong>Instala Python 3.12+</strong>: Descarga la última versión desde <a href="https://www.python.org/downloads/" target="_blank">python.org</a> y asegúrate de agregar Python al PATH.</li>
          <li><strong>Utiliza entornos virtuales</strong>: Ejecuta <code>python -m venv venv</code> para aislar dependencias de cada proyecto.</li>
          <li><strong>Elige un editor moderno</strong>: Visual Studio Code es ideal por su integración con Python, autocompletado y depuración.</li>
          <li><strong>Instala extensiones útiles</strong>: Añade extensiones como Python, Pylance, Black y Jupyter en VS Code.</li>
          <li><strong>Gestiona paquetes con pip</strong>: Usa <code>pip install paquete</code> para instalar librerías y <code>pip freeze &gt; requirements.txt</code> para guardar dependencias.</li>
          <li><strong>Automatiza pruebas</strong>: Configura <code>pytest</code> para pruebas unitarias y <code>pre-commit</code> para mantener la calidad del código.</li>
          <li><strong>Versiona tu código</strong>: Usa Git y GitHub para control de versiones y colaboración.</li>
        </ol>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"Un entorno bien configurado es la base de la productividad y la calidad en cualquier proyecto de software." - Sofía Hernández, desarrolladora Python</p>
        </blockquote>
        <p>
          Sigue estos pasos y estarás listo para afrontar cualquier reto de desarrollo en Python, desde ciencia de datos hasta aplicaciones web modernas.
        </p>
      `;
      imagen = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'; // Imagen tecnológica moderna
    } else if (id === 7) {
      contenidoExtendido = `
        <p>
          La inteligencia artificial multimodal combina texto, imágenes y audio para crear sistemas más inteligentes y versátiles.
        </p>
        <ul>
          <li>Asistentes virtuales que entienden imágenes y voz.</li>
          <li>Aplicaciones en medicina, educación y entretenimiento.</li>
          <li>Desafíos éticos y de privacidad.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"La IA multimodal es el siguiente paso hacia una inteligencia artificial verdaderamente humana." - David González, investigador en IA</p>
        </blockquote>
        <p>
          El futuro de la IA será cada vez más integrado y natural para los usuarios.
        </p>
      `;
    } else if (id === 8) {
      contenidoExtendido = `
        <p>
          La <strong>Conferencia Tech 2025</strong> reunió a los líderes más influyentes del sector tecnológico en Lima, Perú, para debatir sobre las tendencias que marcarán el futuro de la industria. 
        </p>
        <ul>
          <li>Avances en computación cuántica y su impacto en la vida cotidiana.</li>
          <li>El auge de la inteligencia artificial multimodal en empresas y hogares.</li>
          <li>La importancia de la ciberseguridad en un mundo hiperconectado.</li>
          <li>Paneles sobre sostenibilidad y tecnología verde.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"Tech 2025 ha sido el punto de encuentro para quienes están construyendo el mañana." - Laura Méndez, organizadora del evento</p>
        </blockquote>
        <p>
          Más de 500 asistentes participaron en talleres, charlas magistrales y sesiones de networking, consolidando a la conferencia como un referente en Latinoamérica.
        </p>
        <div class="alert alert-info mt-4">
          <i class="fas fa-info-circle me-2"></i>
          ¿Te perdiste el evento? Pronto estarán disponibles las grabaciones y materiales en el sitio oficial.
        </div>
      `;
      imagen = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'; // Imagen de evento tecnológico
    } else if (id === 9) {
      contenidoExtendido = `
        <p>
          Los microservicios han revolucionado la arquitectura de software, permitiendo a las empresas escalar y mantener aplicaciones de forma eficiente. Cada componente puede desarrollarse, desplegarse y escalarse de manera independiente.
        </p>
        <ul>
          <li>Despliegues independientes y rápidos.</li>
          <li>Facilidad para integrar nuevas tecnologías.</li>
          <li>Mejor tolerancia a fallos.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"La arquitectura de microservicios permite a los equipos innovar sin miedo a romper todo el sistema."</p>
        </blockquote>
        <p>
          En 2025, la mayoría de las grandes empresas ya han migrado a este modelo, obteniendo mayor flexibilidad y velocidad de respuesta ante el mercado.
        </p>
      `;
      
    } else if (id === 10) {
      contenidoExtendido = `
        <p>
          GraphQL está superando a REST en nuevas implementaciones gracias a su flexibilidad y eficiencia. Permite a los clientes solicitar exactamente los datos que necesitan, reduciendo el tráfico y mejorando la experiencia de desarrollo.
        </p>
        <ul>
          <li>Consultas precisas y optimizadas.</li>
          <li>Menos endpoints y mayor control.</li>
          <li>Mejor integración con frontend moderno.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"GraphQL permite a los clientes pedir exactamente lo que necesitan, nada más."</p>
        </blockquote>
        <p>
          Empresas como Facebook, GitHub y Shopify ya han adoptado GraphQL como estándar para sus APIs.
        </p>
      `;
      
    } else if (id === 11) {
      contenidoExtendido = `
        <p>
          El desarrollo frontend está en constante evolución. Frameworks como React, Vue y Angular permiten crear interfaces de usuario dinámicas, rápidas y escalables.
        </p>
        <ul>
          <li>Componentes reutilizables.</li>
          <li>Mejor rendimiento y experiencia de usuario.</li>
          <li>Gran ecosistema de herramientas y librerías.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"El futuro del frontend es modular, reactivo y altamente interactivo."</p>
        </blockquote>
        <p>
          Aprender estos frameworks es esencial para cualquier desarrollador web moderno.
        </p>
      `;
      
    } else if (id === 12) {
      contenidoExtendido = `
        <p>
          WebAssembly (WASM) permite ejecutar código de alto rendimiento en el navegador, abriendo la puerta a aplicaciones web complejas como juegos, edición de video y más.
        </p>
        <ul>
          <li>Ejecuta código en C, C++, Rust y otros lenguajes en la web.</li>
          <li>Rendimiento casi nativo en el navegador.</li>
          <li>Integración sencilla con JavaScript.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"WebAssembly es el futuro de las aplicaciones web complejas."</p>
        </blockquote>
        <p>
          Grandes empresas ya lo usan para ofrecer experiencias web avanzadas y rápidas.
        </p>
      `;
      
    } else if (id === 13) {
      contenidoExtendido = `
        <p>
          Las nuevas propiedades de CSS permiten crear animaciones y efectos visuales impresionantes sin necesidad de JavaScript, mejorando la experiencia del usuario y el rendimiento.
        </p>
        <ul>
          <li>Animaciones nativas con @keyframes y transitions.</li>
          <li>Soporte para efectos 3D y filtros avanzados.</li>
          <li>Interfaces más atractivas y accesibles.</li>
        </ul>
        <blockquote class="blockquote my-4">
          <p class="mb-0">"El diseño web nunca ha sido tan creativo y eficiente como ahora."</p>
        </blockquote>
        <p>
          Dominar CSS avanzado es clave para destacar en el desarrollo frontend actual.
        </p>
      `;
      
    } else {
      contenidoExtendido = `<p>${noticia.content}</p>`;
    }

    const html = `
      <div class="card mb-4 shadow border-0 rounded-4">
        <img src="${imagen}" class="card-img-top rounded-top-4" alt="${noticia.title}">
        <div class="card-body">
          <button class="btn btn-outline-secondary btn-sm float-end" onclick="cerrarNoticiaCompleta()">
            <i class="fas fa-arrow-left"></i> Volver
          </button>
          <h2 class="mb-3">${noticia.title}</h2>
          <div class="mb-2">
            <span class="badge bg-primary">${noticia.category}</span>
            <span class="badge bg-secondary">${noticia.author}</span>
            <span class="badge bg-light text-dark">${formatDate(noticia.date)}</span>
          </div>
          <hr>
          <p class="fs-5">${noticia.content}</p>
          ${contenidoExtendido}
        </div>
      </div>
    `;

    // Oculta el contenido principal
    document.querySelectorAll('.row.mb-4, .row.mb-5, .row.g-4, .row.text-center, .tab-content').forEach(el => el.style.display = 'none');

    // Muestra la noticia completa
    const contenedor = document.getElementById('noticia-completa');
    contenedor.innerHTML = html;
    contenedor.style.display = 'block';

    window.scrollTo(0, 0);
    }

    // Mostrar la fecha actual en el top bar
    document.addEventListener('DOMContentLoaded', function() {
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const hoy = new Date();
      const fechaFormateada = `${dias[hoy.getDay()]}, ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`;
      const fechaElemento = document.getElementById('current-date');
      if (fechaElemento) fechaElemento.textContent = fechaFormateada;
    });
