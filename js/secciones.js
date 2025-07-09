
    // Mostrar la sección correspondiente según el hash de la URL
    function mostrarSeccion(id) {
      document.querySelectorAll('.seccion-pagina').forEach(sec => sec.classList.remove('active'));
      const seccion = document.getElementById(id);
      if (seccion) {
        seccion.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Detectar hash al cargar y al cambiar
    function activarSeccionPorHash() {
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(hash)) {
        mostrarSeccion(hash);
      } else {
        mostrarSeccion('nuevas-tecnologias');
      }
    }

    window.addEventListener('DOMContentLoaded', activarSeccionPorHash);
    window.addEventListener('hashchange', activarSeccionPorHash);

    // Opcional: activar nav-link activo
    function activarNavLink(id) {
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => link.classList.remove('active', 'fw-bold'));
      const nav = document.getElementById('nav-' + id);
      if (nav) {
        nav.classList.add('active', 'fw-bold');
      }
    }
    // Llama a activarNavLink cuando cambie la sección
    function mostrarSeccion(id) {
      document.querySelectorAll('.seccion-pagina').forEach(sec => sec.classList.remove('active'));
      const seccion = document.getElementById(id);
      if (seccion) {
        seccion.classList.add('active');
        activarNavLink(id);
        window.location.hash = id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // GOOGLE TRANSLATE
    (function() {
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
      hideGoogleTranslateDiv();
    }

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

    function activateGoogleTranslate() {
      setTimeout(function() {
        try {
          const translateElement = document.querySelector('.goog-te-gadget-simple, .goog-te-menu-value');
          if (translateElement) {
            translateElement.click();
          }
        } catch (e) {}
      }, 500);
    }

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

      document.addEventListener('DOMContentLoaded', function() {
        // ...otros inicializadores...
        initThemeToggle();
        checkSavedTheme();
        checkLoggedUser();
      });

    // Funciones para actualizar la interfaz de usuario según el estado de inicio de sesión
    function updateUIForLoggedUser(userData) {
      const loginButton = document.querySelector('.btn-light.text-danger');
      const registerButton = document.querySelector('.btn-outline-light.me-2');

      if (loginButton) {
        loginButton.innerHTML = `<i class="fas fa-user me-1"></i> ${userData.name}`;
        loginButton.setAttribute('disabled', 'disabled');
      }
      if (registerButton) {
        registerButton.innerHTML = `<i class="fas fa-sign-out-alt me-1"></i> Cerrar sesión`;
        registerButton.removeEventListener('click', openRegisterModal);
        registerButton.addEventListener('click', logoutUser);
      }
    }

    // --- REGISTRO UNIFICADO ---
    document.getElementById('register-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim().toLowerCase();
      const password = document.getElementById('registerPassword').value;
      const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
      const terms = document.getElementById('registerTerms').checked;
      const successMsg = document.getElementById('register-success');
      const errorMsg = document.getElementById('register-error');

      successMsg.classList.add('d-none');
      errorMsg.classList.add('d-none');

      if (!name || !email || !password || !passwordConfirm || !terms) {
        errorMsg.textContent = "Completa todos los campos y acepta los términos.";
        errorMsg.classList.remove('d-none');
        return;
      }
      if (password !== passwordConfirm) {
        errorMsg.textContent = "Las contraseñas no coinciden.";
        errorMsg.classList.remove('d-none');
        return;
      }

      // Guardar usuario en localStorage bajo la clave 'user_' + email
      if (localStorage.getItem('user_' + email)) {
        errorMsg.textContent = "El correo ya está registrado.";
        errorMsg.classList.remove('d-none');
        return;
      }

      const userData = { name, email, password, registeredAt: new Date().toISOString() };
      localStorage.setItem('user_' + email, JSON.stringify(userData));

      successMsg.classList.remove('d-none');
      setTimeout(() => {
        var modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        modal.hide();
        document.getElementById('register-form').reset();
      }, 1200);
    });

    // --- LOGIN UNIFICADO ---
    document.getElementById('login-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const remember = document.getElementById('loginRemember').checked;
      const successMsg = document.getElementById('login-success');
      const errorMsg = document.getElementById('login-error');

      successMsg.classList.add('d-none');
      errorMsg.classList.add('d-none');

      const userDataStr = localStorage.getItem('user_' + email);
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData.password === password) {
          // Guardar sesión en localStorage o sessionStorage
          if (remember) {
            localStorage.setItem('currentUser', email);
          } else {
            sessionStorage.setItem('currentUser', email);
          }
          successMsg.classList.remove('d-none');
          setTimeout(() => {
            var modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            modal.hide();
            document.getElementById('login-form').reset();
            updateUIForLoggedUser(userData);
          }, 1000);
          return;
        }
      }
      errorMsg.classList.remove('d-none');
    });

    // --- ACTUALIZAR UI SEGUN SESIÓN ---
    function updateUIForLoggedUser(userData) {
      const loginBtn = document.querySelector('.btn-light.text-danger');
      const registerBtn = document.querySelector('.btn-outline-light.me-2');
      if (loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user me-1"></i> ${userData.name}`;
        loginBtn.setAttribute('disabled', 'disabled');
        loginBtn.removeAttribute('data-bs-toggle');
        loginBtn.removeAttribute('data-bs-target');
      }
      if (registerBtn) {
        registerBtn.innerHTML = `<i class="fas fa-sign-out-alt me-1"></i> Cerrar sesión`;
        registerBtn.removeAttribute('data-bs-toggle');
        registerBtn.removeAttribute('data-bs-target');
        registerBtn.onclick = logoutUser;
      }
    }

    // --- CERRAR SESIÓN UNIFICADO ---
    function logoutUser(e) {
      if (e) e.preventDefault();
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      location.reload();
    }

    // --- CHEQUEAR SESIÓN AL CARGAR ---
    function checkLoggedUser() {
      const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      if (currentUser) {
        const userDataStr = localStorage.getItem('user_' + currentUser);
        if (userDataStr) {
          updateUIForLoggedUser(JSON.parse(userDataStr));
        }
      }
    }

    document.addEventListener('DOMContentLoaded', checkLoggedUser);

    // --- ENLACE ENTRE PÁGINAS ---
    // Si te registras o inicias sesión en index.html, la sesión se mantiene aquí y viceversa,
    // porque ambos usan localStorage con la misma clave 'currentUser' y 'users'.
