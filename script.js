document.addEventListener('DOMContentLoaded', () => {

  /* ─── Плавный скролл по якорям ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ─── Форма ──────────────────────────────────────────────────────────── */
  const form           = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');

  if (!form) return;

  /* Хелперы */
  function getField(id) {
    return document.getElementById(id);
  }

  function setError(inputId, errorId, message) {
    const input = getField(inputId);
    const error = getField(errorId);
    if (message) {
      input.classList.add('error');
      error.textContent = message;
    } else {
      input.classList.remove('error');
      error.textContent = '';
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* Валидация: Имя, Email (формат), Сообщение — все обязательны */
  function validateForm() {
    let valid = true;

    const name = getField('name').value.trim();
    if (!name) {
      setError('name', 'name-error', 'Введите имя');
      valid = false;
    } else {
      setError('name', 'name-error', '');
    }

    const email = getField('email').value.trim();
    if (!email) {
      setError('email', 'email-error', 'Введите email');
      valid = false;
    } else if (!isValidEmail(email)) {
      setError('email', 'email-error', 'Проверьте формат email');
      valid = false;
    } else {
      setError('email', 'email-error', '');
    }

    const message = getField('message').value.trim();
    if (!message) {
      setError('message', 'message-error', 'Напишите сообщение');
      valid = false;
    } else {
      setError('message', 'message-error', '');
    }

    return valid;
  }

  /* Отправка через fetch без перезагрузки страницы */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitBtn  = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled   = true;
    submitBtn.textContent = 'Отправка...';

    try {
      const response = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        form.style.display = 'none';
        successMessage.classList.add('visible');
      } else {
        submitBtn.disabled    = false;
        submitBtn.textContent = originalText;
        alert('Что-то пошло не так. Попробуйте ещё раз.');
      }
    } catch {
      submitBtn.disabled    = false;
      submitBtn.textContent = originalText;
      alert('Ошибка сети. Проверьте соединение и попробуйте ещё раз.');
    }
  });

  /* Сброс ошибок при вводе */
  ['name', 'email', 'message'].forEach(fieldId => {
    const field = getField(fieldId);
    if (!field) return;
    field.addEventListener('input', () => {
      field.classList.remove('error');
      getField(`${fieldId}-error`).textContent = '';
    });
  });

});
