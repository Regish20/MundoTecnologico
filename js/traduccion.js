
    // ==========================================
    // CONFIGURACIÓN DE GOOGLE TRANSLATE
    // ==========================================
    
    (function() {
      var gtConstEvalStartTime = new Date().getTime();
      var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.getElementsByTagName('head')[0].appendChild(s);
    })();
  
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: 'en,es,fr,de',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
      
      // Ocultar el div después de inicializar
      hideGoogleTranslateDiv();
    }
    
    // Función para ocultar el div de Google Translate
    function hideGoogleTranslateDiv() {
      const translateDiv = document.getElementById('google_translate_element');
      if (translateDiv) {
        translateDiv.style.visibility = 'hidden';
        translateDiv.style.position = 'absolute';
        translateDiv.style.top = '-9999px';
        translateDiv.style.left = '-9999px';
        translateDiv.style.height = '1px';
        translateDiv.style.width = '1px';
        translateDiv.style.overflow = 'hidden';
      }
    }
    
    // Función para activar el selector de idioma directamente
    function activateGoogleTranslate() {
      setTimeout(function() {
        try {
          const translateElement = document.querySelector('.goog-te-gadget-simple, .goog-te-menu-value');
          if (translateElement) {
            translateElement.click();
          } else {
            console.log('Elemento del traductor no encontrado');
          }
        } catch (e) {
          console.error('Error al activar el traductor:', e);
        }
      }, 500);
    }
    
    // Función para eliminar el banner de Google Translate
    function removeBanner() {
      const iframes = document.getElementsByTagName('iframe');
      for (let i = 0; i < iframes.length; i++) {
        if (iframes[i].name.includes('goog_')) {
          if (iframes[i].style.visibility !== 'hidden') {
            iframes[i].style.visibility = 'hidden';
          }
        }
      }
      
      // Eliminar la clase que Google añade al body
      document.body.classList.remove('translated-ltr');
      
      // Restaurar la posición original del body
      if (document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
    }

    // Agregar CSS para ocultar definitivamente el widget original
    const style = document.createElement('style');
    style.textContent = `
      #google_translate_element {
        visibility: hidden !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        height: 1px !important;
        width: 1px !important;
        overflow: hidden !important;
      }
      
      .goog-te-menu-frame {
        box-shadow: none !important;
      }
      
      body > .skiptranslate, .goog-te-menu-frame {
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);

    // ==========================================
    // DATOS DE ARTÍCULOS
    // ==========================================
    
    const articlesData = [
      {
        id: 1,
        title: "El futuro pertenece a los desarrolladores full-stack: La revolución de los frameworks JavaScript",
        category: "Desarrollo",
        content: "La evolución de Next.js y otros frameworks modernos está redefiniendo el desarrollo web",
        author: "Juan Pérez",
        date: "2025-05-26",
        tags: ["javascript", "framework", "desarrollo", "fullstack"]
      },
      {
        id: 2,
        title: "Startups tecnológicas revolucionan la industria con IA y automatización",
        category: "Innovación",
        content: "Nuevas empresas están implementando inteligencia artificial y robótica",
        author: "María García",
        date: "2025-05-25",
        tags: ["ia", "startups", "automatización", "innovación"]
      },
      {
        id: 3,
        title: "Java comienza un nuevo camino en la programación: 3 datos clave",
        category: "Programación",
        content: "Las últimas actualizaciones prometen revolucionar el desarrollo de aplicaciones empresariales",
        author: "Carlos López",
        date: "2025-05-24",
        tags: ["java", "programación", "desarrollo", "empresarial"]
      },
      {
        id: 4,
        title: "Los procesadores cuánticos estarán disponibles para el consumidor en 2026",
        category: "Hardware",
        content: "Avances en la miniaturización y enfriamiento permitirán su uso doméstico",
        author: "Ana Rodríguez",
        date: "2025-05-23",
        tags: ["cuántico", "procesadores", "hardware", "consumidor"]
      },
      {
        id: 5,
        title: "Nuevos métodos de autenticación biométrica que reemplazarán las contraseñas",
        category: "Ciberseguridad",
        content: "La combinación de reconocimiento facial y de voz está revolucionando la seguridad",
        author: "Pedro Martínez",
        date: "2025-05-22",
        tags: ["biométrica", "seguridad", "autenticación", "contraseñas"]
      },
      {
        id: 6,
        title: "Cómo configurar tu entorno de desarrollo para Python en 2025",
        category: "Programación",
        content: "Guía completa para configurar Python con las mejores herramientas del mercado",
        author: "Sofía Hernández",
        date: "2025-05-21",
        tags: ["python", "desarrollo", "configuración", "herramientas"]
      },
      {
        id: 7,
        title: "La IA multimodal: el futuro de la inteligencia artificial",
        category: "IA",
        content: "Sistemas que combinan texto, imágenes y audio para entender el mundo como los humanos",
        author: "David González",
        date: "2025-05-20",
        tags: ["ia", "multimodal", "artificial", "inteligencia"]
      },
      {
        id: 8,
        title: "Conferencia Tech 2025: Las tendencias del momento",
        category: "Eventos",
        content: "La Conferencia Tech 2025 reunió a los líderes más influyentes del sector tecnológico en Lima, Perú, para debatir sobre las tendencias que marcarán el futuro de la industria.",
        author: "Laura Méndez",
        date: "2025-05-20",
        tags: ["conferencia", "eventos", "tecnología", "tendencias"]
      },
      {
        id: 9,
        title: "Microservicios: El futuro de la arquitectura de software",
        content: "Los microservicios están transformando la manera en que desarrollamos y desplegamos aplicaciones empresariales.",
        category: "Arquitectura",
        author: "Luis García",
        date: "2025-01-15"
      },
      {
        id: 10,
        title: "GraphQL vs REST: ¿Cuál elegir en 2025?",
        content: "Una comparación detallada entre GraphQL y REST para ayudarte a tomar la mejor decisión.",
        category: "APIs",
        author: "Carmen Ruiz",
        date: "2025-01-10"
      },
      {
        id: 11,
        title: "Frontend moderno: React, Vue y Angular",
        content: "Exploramos los frameworks frontend más populares y sus ventajas en el desarrollo actual.",
        category: "Frontend",
        author: "Miguel Torres",
        date: "2025-01-08"
      },
      {
        id: 12,
        title: "WebAssembly: Poder nativo en la web",
        content: "Descubre cómo WebAssembly está revolucionando las aplicaciones web de alto rendimiento.",
        category: "Web",
        author: "Elena Morales",
        date: "2025-01-05"
      },
      {
        id: 13,
        title: "CSS avanzado: Animaciones y efectos modernos",
        content: "Las nuevas características de CSS que están transformando el diseño web moderno.",
        category: "CSS",
        author: "Roberto Silva",
        date: "2025-01-03"
      }
    ];

