// =============================================
//  PLH ROBOTICS — Project Page JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Tema claro/oscuro ──
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = themeBtn?.querySelector('.theme-icon');

  const saved = localStorage.getItem('plh-theme') || 'dark';

  html.setAttribute('data-theme', saved);

  if (themeIcon) {
    themeIcon.textContent = saved === 'dark' ? '☀' : '🌙';
  }

  themeBtn?.addEventListener('click', () => {

    const next =
      html.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark';

    html.setAttribute('data-theme', next);

    localStorage.setItem('plh-theme', next);

    if (themeIcon) {
      themeIcon.textContent =
        next === 'dark' ? '☀' : '🌙';
    }

  });

  // ── Scroll reveal ──
  const obs = new IntersectionObserver((entries) => {

    entries.forEach((e, i) => {

      if (e.isIntersecting) {

        setTimeout(() => {
          e.target.classList.add('visible');
        }, i * 80);

        obs.unobserve(e.target);

      }

    });

  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal')
    .forEach(el => obs.observe(el));

  // ── FAQ accordion ──
  document.querySelectorAll('.faq-item').forEach(item => {

    item.querySelector('.faq-question')
      ?.addEventListener('click', () => {

        const isOpen =
          item.classList.contains('open');

        document.querySelectorAll('.faq-item')
          .forEach(i => i.classList.remove('open'));

        if (!isOpen) {
          item.classList.add('open');
        }

      });

  });

  // ── Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery img')
    .forEach(img => {

      img.addEventListener('click', () => {

        lightboxImg.src = img.src;

        lightbox.classList.add('open');

        document.body.style.overflow = 'hidden';

      });

    });

  lightboxClose?.addEventListener('click', () => {

    lightbox.classList.remove('open');

    document.body.style.overflow = '';

  });

  lightbox?.addEventListener('click', e => {

    if (e.target === lightbox) {

      lightbox.classList.remove('open');

      document.body.style.overflow = '';

    }

  });

  // ═══════════════════════════════════════════════
  //  MODAL COMUNIDAD
  // ═══════════════════════════════════════════════

  const overlay = document.getElementById('community-modal-overlay');

  const closeBtn = document.getElementById('close-community-modal');

  const form = document.getElementById('community-form');

  const success = document.getElementById('community-success');

  const submitBtn = document.getElementById('community-submit-btn');

  function openModal() {

    overlay.classList.add('open');

    document.body.style.overflow = 'hidden';

  }

  function closeModal() {

    overlay.classList.remove('open');

    document.body.style.overflow = '';

  }

  document.getElementById('open-community-modal')
    ?.addEventListener('click', openModal);

  document.getElementById('open-community-modal-2')
    ?.addEventListener('click', openModal);

  closeBtn?.addEventListener('click', closeModal);

  overlay?.addEventListener('click', e => {

    if (e.target === overlay) {
      closeModal();
    }

  });

  document.addEventListener('keydown', e => {

    if (e.key === 'Escape') {
      closeModal();
    }

  });

  // ═══════════════════════════════════════════════
  //  FOTO + CLOUDINARY
  // ═══════════════════════════════════════════════

  const fileInput = document.getElementById('c-photo');

  const fileTrigger = document.getElementById('file-trigger');

  const fileDrop = document.getElementById('file-drop');

  const filePreview = document.getElementById('file-preview');

  const previewImg = document.getElementById('preview-img');

  const fileRemove = document.getElementById('file-remove');

  let uploadedImageUrl = null;

  // ── Abrir selector ──

  fileDrop?.addEventListener('click', () => {

    fileInput.click();

  });

  fileTrigger?.addEventListener('click', e => {

    e.stopPropagation();

    fileInput.click();

  });

  // ── Drag & Drop ──

  fileDrop?.addEventListener('dragover', e => {

    e.preventDefault();

    fileDrop.classList.add('drag-over');

  });

  fileDrop?.addEventListener('dragleave', () => {

    fileDrop.classList.remove('drag-over');

  });

  fileDrop?.addEventListener('drop', e => {

    e.preventDefault();

    fileDrop.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith('image/')) {
      processPhoto(file);
    }

  });

  fileInput?.addEventListener('change', () => {

    if (fileInput.files[0]) {

      processPhoto(fileInput.files[0]);

    }

  });

  // ── Procesar foto ──

  async function processPhoto(file) {

    // Tamaño máximo 5MB

    if (file.size > 5 * 1024 * 1024) {

      alert('La foto no debe superar 5 MB.');

      return;

    }

    // Preview local

    previewImg.src = URL.createObjectURL(file);

    fileDrop.style.display = 'none';

    filePreview.style.display = 'block';

    // Upload Cloudinary

    const data = new FormData();

    data.append('file', file);

    data.append(
      'upload_preset',
      'plh_community'
    );

    try {

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dhnlevrsj/image/upload',
        {
          method: 'POST',
          body: data
        }
      );

      const json = await res.json();

      uploadedImageUrl = json.secure_url;

      console.log(
        'Imagen subida:',
        uploadedImageUrl
      );

    } catch (err) {

      console.error(err);

      alert(
        'Error subiendo imagen. Intenta nuevamente.'
      );

    }

  }

  // ── Quitar foto ──

  fileRemove?.addEventListener('click', () => {

    uploadedImageUrl = null;

    fileInput.value = '';

    previewImg.src = '';

    fileDrop.style.display = 'block';

    filePreview.style.display = 'none';

  });

  // ═══════════════════════════════════════════════
  //  ENVÍO FORMSPREE
  // ═══════════════════════════════════════════════

  form?.addEventListener('submit', async e => {

    e.preventDefault();

    const name =
      document.getElementById('c-name')
        .value.trim();

    const city =
      document.getElementById('c-location')
        .value.trim();

    const comment =
      document.getElementById('c-comment')
        .value.trim();

    const email =
      document.getElementById('c-email')
        .value.trim();

    if (!name || !comment || !email) {
      return;
    }

    const origText = submitBtn.textContent;

    submitBtn.textContent = 'Enviando...';

    submitBtn.disabled = true;

    const payload = {

      _subject:
        '🤖 Nueva construcción comunidad — JERR-1',

      proyecto:
        'JERR-1 Robot Sumo con IA',

      nombre_usuario: name,

      ciudad:
        city || '(no indicada)',

      experiencia: comment,

      correo: email,

      foto_url:
        uploadedImageUrl || '(sin foto)',

    };

    try {

      const res = await fetch(
        'https://formspree.io/f/mdaoqnvk',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },

          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {

        form.style.display = 'none';

        success.style.display = 'block';

        setTimeout(() => {

          closeModal();

          setTimeout(() => {

            form.style.display = 'block';

            success.style.display = 'none';

            form.reset();

            uploadedImageUrl = null;

            fileInput.value = '';

            previewImg.src = '';

            fileDrop.style.display = 'block';

            filePreview.style.display = 'none';

            submitBtn.textContent = origText;

            submitBtn.disabled = false;

          }, 400);

        }, 3000);

      } else {

        throw new Error('Formspree error');

      }

    } catch {

      submitBtn.textContent =
        '⚠ Error — intenta de nuevo';

      submitBtn.disabled = false;

      setTimeout(() => {

        submitBtn.textContent = origText;

      }, 3500);

    }

  });

  // ═══════════════════════════════════════════════
  //  WIDGET DE IDIOMA
  // ═══════════════════════════════════════════════

  const langBtn = document.getElementById('lang-btn');

  const langDropdown = document.getElementById('lang-dropdown');

  const langCurrent = document.getElementById('lang-current');

  const langLabels = {
    es: 'ES',
    en: 'EN',
    pt: 'PT',
    fr: 'FR',
    de: 'DE',
    ja: 'JA'
  };

  langBtn?.addEventListener('click', e => {

    e.stopPropagation();

    langDropdown.classList.toggle('open');

  });

  document.addEventListener('click', () => {

    langDropdown?.classList.remove('open');

  });

  document.querySelectorAll('.lang-option')
    .forEach(btn => {

      btn.addEventListener('click', () => {

        const lang = btn.dataset.lang;

        const expires = new Date();

        expires.setFullYear(
          expires.getFullYear() + 1
        );

        if (lang === 'es') {

          document.cookie =
            'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

          document.cookie =
            'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain='
            + location.hostname;

        } else {

          document.cookie =
            `googtrans=/es/${lang}; expires=${expires.toUTCString()}; path=/`;

          document.cookie =
            `googtrans=/es/${lang}; expires=${expires.toUTCString()}; path=/; domain=${location.hostname}`;

        }

        document.querySelectorAll('.lang-option')
          .forEach(o => o.classList.remove('active'));

        btn.classList.add('active');

        if (langCurrent) {

          langCurrent.textContent =
            langLabels[lang]
            || lang.toUpperCase();

        }

        langDropdown?.classList.remove('open');

        location.reload();

      });

    });

  const match =
    document.cookie.match(
      /googtrans=\/es\/([a-z]+)/
    );

  if (match) {

    const al = match[1];

    if (langCurrent) {

      langCurrent.textContent =
        langLabels[al]
        || al.toUpperCase();

    }

    document.querySelectorAll('.lang-option')
      .forEach(o => {

        o.classList.toggle(
          'active',
          o.dataset.lang === al
        );

      });

  }

  //visualizar proyecto con boton de imagen a 3d
  const open3dBtn = document.getElementById('open-3d-btn');

  const preview3d = document.getElementById('cover-preview');

  const viewer3d = document.getElementById('cover-3d-container');

  const close3dBtn = document.getElementById('close-3d-btn');

  open3dBtn?.addEventListener('click', () => {

    preview3d.style.display = 'none';

    viewer3d.style.display = 'block';

  });

  close3dBtn?.addEventListener('click', () => {

    viewer3d.style.display = 'none';

    preview3d.style.display = 'block';

  });



});