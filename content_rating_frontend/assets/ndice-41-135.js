/* Path normalization: Any image/icon references should be assets-relative (figmaimages/<file>); no JS URL changes required */
(function(){
  'use strict';

  /*
    File: assets/ndice-41-135.js
    Summary of updates:
    - Added aria-live region announcements for better accessibility feedback
    - Preserved public init function and click bindings; added keyboard focus feedback
    - Avoided animations if prefers-reduced-motion is enabled
  */

  // Create a polite aria-live region for announcements (screen-reader only)
  function createLiveRegion(){
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.style.position = 'absolute';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.margin = '-1px';
    region.style.border = '0';
    region.style.padding = '0';
    region.style.clip = 'rect(0 0 0 0)';
    region.style.overflow = 'hidden';
    region.style.whiteSpace = 'nowrap';
    region.id = 'live-region';
    document.body.appendChild(region);
    return region;
  }

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // PUBLIC_INTERFACE
  function initIndiceScreen() {
    /**
     * Initialize CTA buttons for the Índice screen:
     * - Binds click handlers to the three prototype buttons.
     * - Adds small tactile pulse (respecting reduced motion).
     * - Announces action via aria-live for screen readers.
     */
    const buttons = document.querySelectorAll('.cta-btn[data-proto]');
    // Ensure live region exists after DOM is ready
    const ensureLiveRegion = () => document.getElementById('live-region') || createLiveRegion();

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-proto');
        console.info(`Iniciar prototipo ${id}`);
        // Visual pulse (reduced-motion aware)
        if (!prefersReducedMotion) {
          btn.classList.add('pulse');
          setTimeout(() => btn.classList.remove('pulse'), 160);
        }
        // Screen-reader announcement
        const lr = ensureLiveRegion();
        lr.textContent = `Iniciar prototipo ${id}`;
      });

      // Add keyboard hint via title already set in HTML; ensure focus outline visible is handled by CSS
      btn.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          // mimic click announcement for keyboard activation if default prevented elsewhere
          const id = btn.getAttribute('data-proto');
          const lr = ensureLiveRegion();
          lr.textContent = `Iniciar prototipo ${id}`;
        }
      });
    });
  }

  // Add a small pulse effect when clicked using inline style manipulation.
  const style = document.createElement('style');
  style.textContent = `
    .cta-btn.pulse { transform: scale(0.98); filter: brightness(0.98); }
    @media (prefers-reduced-motion: reduce){
      .cta-btn.pulse { transform: none; filter: none; }
    }
  `;
  document.head.appendChild(style);

  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIndiceScreen);
    document.addEventListener('DOMContentLoaded', () => { if (!document.getElementById('live-region')) createLiveRegion(); });
  } else {
    if (!document.getElementById('live-region')) createLiveRegion();
    initIndiceScreen();
  }
})();
