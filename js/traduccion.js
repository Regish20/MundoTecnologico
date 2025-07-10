
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

