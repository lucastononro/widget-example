import { EventBus } from '../utils/EventBus';

class ChatIframe extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInSlideUp {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeOutSlideDown {
        0% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(20px);
        }
      }

      iframe {
        display: none;
        position: fixed;
        bottom: 120px;
        right: 20px;
        width: 400px;
        height: 600px;
        border: none;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 9998; /* Set lower z-index than the button */
        background: white;
        max-height: calc(100vh - 140px); /* Adjust height to fit the screen */
      }

      iframe.show {
        display: block;
        animation: fadeInSlideUp 0.6s forwards;
      }

      iframe.hide {
        animation: fadeOutSlideDown 0.6s forwards;
        display: block; /* Ensure it's visible during animation */
      }

      @media (max-width: 768px) {
        iframe {
          top: 0; /* Fill the screen */
          right: 0;
          width: 100%;
          height: calc(100% - 100px); /* Adjust height to leave space for the button */
          border-radius: 0;
          max-height: none; /* Remove max-height constraint for mobile view */
        }
      }

      @media (max-height: 700px) {
        iframe {
          height: calc(100vh - 140px); /* Adjust height to fit the screen */
        }
      }
    `;

    const iframe = document.createElement('iframe');
    // iframe.allow = 'microphone; fullscreen';
    this.shadowRoot.append(style, iframe);

    this.iframe = iframe;
  }

  connectedCallback() {
    let src = `https://www.example.ai/` // Alter this to your chatbot website URL - using a fake website for demo purposes

    this.iframe.src = src;

    EventBus.on('open-chat', () => {
      this.iframe.style.display = 'block';
      this.iframe.classList.remove('hide');
      this.iframe.classList.add('show');
    });

    EventBus.on('close-chat', () => {
      this.iframe.classList.remove('show');
      this.iframe.classList.add('hide');
      this.iframe.addEventListener('animationend', () => {
        if (this.iframe.classList.contains('hide')) {
          this.iframe.style.display = 'none';
        }
      }, { once: true });
    });
  }
}

customElements.define('chat-iframe', ChatIframe);