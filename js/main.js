/* ==========================================================================
   MAIN JS - SCROLL OBSERVERS, HIGHLIGHTS, TAPE STICKERS & FORM FEEDBACK
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll Reveal Observer (Orchestrated entry per section)
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Global helper for dynamically injected elements
  window.observeReveals = function(container = document) {
    const reveals = container.querySelectorAll ? container.querySelectorAll('.reveal') : [];
    reveals.forEach(el => {
      revealObserver.observe(el);
      // Ensure immediate visibility fallback
      el.classList.add('visible');
    });
  };

  // 2. Highlight Marker Observer (Draws highlighter effect when in view)
  const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        highlightObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.highlight').forEach(el => {
    highlightObserver.observe(el);
  });

  // 3. Paper Tear Tape Sticker Observer
  document.querySelectorAll('.paper-tear-wrapper').forEach(wrapper => {
    const sticker = wrapper.querySelector('.tape-sticker');
    if (!sticker) return;
    
    const tearObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sticker.style.opacity = '0.9';
          sticker.style.transform = sticker.classList.contains('right') ? 'rotate(3deg)' : 'rotate(-4deg)';
          tearObserver.unobserve(wrapper);
        }
      });
    }, { threshold: 0.4 });
    
    tearObserver.observe(wrapper);
  });

  // 4. Form Submission (Google Apps Script Integration)
  const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbywg1-8K81hve5-ifomlnO1xbxQ3PUJrh_pYDqMu6_nuIGkf5ZeRbki1S9wL249rNWx6Q/exec';

  async function submitEnquiry(formEl) {
    const submitBtn = formEl.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';

    if (submitBtn) {
      submitBtn.innerHTML = 'Sending Enquiry...';
      submitBtn.disabled = true;
    }

    const formData = new FormData(formEl);
    const messageParts = formData.getAll('message').filter(Boolean);
    const payload = {
      name: formData.get('name') || '',
      phone: formData.get('phone') || '',
      email: formData.get('email') || '',
      course: formData.get('course') || '',
      message: messageParts.join(' | '),
      sourcePage: window.location.pathname
    };

    try {
      await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      formEl.reset();
      showSuccessMessage(formEl);
    } catch (err) {
      if (submitBtn) {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
      showErrorMessage(formEl);
    }
  }

  function showSuccessMessage(formEl) {
    const parent = formEl.parentElement;
    const successBox = document.createElement('div');
    successBox.className = 'enquiry-success-message nb-card';
    successBox.style.cssText = 'padding: 36px 24px; text-align: center; background: #DEF7EC; border: 3px solid #03543F; border-radius: 16px; margin-top: 12px;';
    successBox.innerHTML = `
      <div style="font-size: 44px; margin-bottom: 12px;">✅</div>
      <h3 class="text-h3" style="color: #03543F; margin-bottom: 8px;">Enquiry Received!</h3>
      <p class="text-feature" style="color: #046C4E; font-weight: 700; font-size: 18px; margin-bottom: 16px;">
        Thank you! We'll contact you within 24 hours.
      </p>
      <div style="padding: 12px 16px; background: #FFFFFF; border-radius: 8px; border: 2px solid #03543F; display: inline-block;">
        <p class="text-caption" style="color: #03543F; font-size: 14px; margin: 0;">
          Need immediate assistance? Call us directly:<br>
          <a href="tel:8148904335" style="color: var(--color-primary-dark); font-weight: 800; text-decoration: underline;">📞 8148904335</a> | 
          <a href="tel:9514571990" style="color: var(--color-primary-dark); font-weight: 800; text-decoration: underline;">📞 9514571990</a>
        </p>
      </div>
    `;
    formEl.style.display = 'none';
    if (parent) {
      parent.appendChild(successBox);
    }
  }

  function showErrorMessage(formEl) {
    let errBox = formEl.querySelector('.enquiry-error-msg');
    if (!errBox) {
      errBox = document.createElement('div');
      errBox.className = 'enquiry-error-msg';
      errBox.style.cssText = 'padding: 12px 16px; background: #FDE8E8; border-left: 4px solid #E02424; border-radius: 6px; font-size: 14px; color: #9B1C1C; margin-top: 16px; text-align: center;';
      formEl.appendChild(errBox);
    }
    errBox.innerHTML = `Submission issue detected. Please call us directly at <a href="tel:8148904335" style="color: #9B1C1C; font-weight: 700; text-decoration: underline;">8148904335</a> / <a href="tel:9514571990" style="color: #9B1C1C; font-weight: 700; text-decoration: underline;">9514571990</a>.`;
  }

  document.querySelectorAll('.enquiry-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      submitEnquiry(form);
    });
  });

  // Toast Function (Global Utility)
  window.showToast = function(message) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  };
});
