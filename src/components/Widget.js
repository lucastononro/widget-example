import { EventBus } from '../utils/EventBus';
import './ChatButton';
import './ChatIframe';

class ChatWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.timeoutId = null;
  }

  connectedCallback() {
    if (!this.shadowRoot.querySelector('chat-button')) {
      const chatButton = document.createElement('chat-button');
      const chatIframe = document.createElement('chat-iframe');
      const imgUrl = this.getAttribute('img-url');
      const bgColor = this.getAttribute('background-color');
      const popupDelay = parseInt(this.getAttribute('popup-delay'), 10); 
      const soundUrl = this.getAttribute('sound-url');

      if (imgUrl) {
        chatButton.setAttribute('img-url', imgUrl);
      }

      if (bgColor) {
        chatButton.setAttribute('background-color', bgColor);
      }


      this.shadowRoot.appendChild(chatButton);
      this.shadowRoot.appendChild(chatIframe);

      EventBus.on('open-chat', (data) => {
        chatIframe.style.display = 'block';
        chatIframe.classList.remove('hide');
        chatIframe.classList.add('show');
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
        // Play sound if sound URL is provided and playSound flag is true
        if (soundUrl && data && data.playSound) {
          const audio = new Audio(soundUrl);
          audio.play();
        }
      });

      EventBus.on('close-chat', () => {
        chatIframe.classList.remove('show');
        chatIframe.classList.add('hide');
        chatIframe.addEventListener('animationend', () => {
          if (chatIframe.classList.contains('hide')) {
            chatIframe.style.display = 'none';
          }
        }, { once: true });
      });

      // Handle automatic opening after delay
      if (popupDelay && !isNaN(popupDelay)) {
        this.timeoutId = setTimeout(() => {
          if (!chatButton.classList.contains('open')) {
            EventBus.emit('open-chat', { playSound: true });
          }
        }, popupDelay * 1000);
      }
    }
  }
}

customElements.define('chat-widget', ChatWidget);