import { EventBus } from '../utils/EventBus';

class ChatButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #111f2a;
        color: black;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 24px;
        font-family: 'Roboto', sans-serif;
        font-style: italic;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        z-index: 9999;
        margin-bottom: 10px; 
        transition: background-color 0.3s, transform 0.3s;
      }

      button.open {
        background-color: #ff6347; 
        transform: translateY(2px) rotate(180deg); 
      }

      img {
        width: 48px;
        height: 48px;
        border-radius: 50%; 
        object-fit: cover; 
        display: block; /* Ensure the image is displayed as a block element */
        transition: opacity 0.3s;
      }

      .close-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.3s;
        color: black;
      }

      .close-icon:before {
        content: '';
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid white;
      }

      button.open .close-icon {
        opacity: 1;
      }

      button.open img {
        opacity: 0;
      }

      @media (max-width: 768px) {
        button {
          bottom: 10px;
          right: 10px;
        }
      }
    `;

    const button = document.createElement('button');
    this.button = button;

    const closeIcon = document.createElement('div');
    closeIcon.classList.add('close-icon');
    this.closeIcon = closeIcon;

    this.shadowRoot.append(style, button);
  }

  connectedCallback() {
    const imgUrl = this.getAttribute('img-url');
    const bgColor = this.getAttribute('background-color') || '#111f2a'; // Default color
    this.button.style.backgroundColor = bgColor;
    this.button.innerHTML = ''; // Clear previous content

    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = 'Chat Icon';
      img.onerror = () => {
        console.error(`Failed to load image at ${imgUrl}`);
        this.button.innerHTML = 'AI';
      };
      img.onload = () => {
        this.button.appendChild(img);
        this.button.appendChild(this.closeIcon);
      };
    } else {
      this.button.innerHTML = 'AI';
      this.button.appendChild(this.closeIcon);
    }

    this.button.addEventListener('click', this.toggleChat.bind(this));

    EventBus.on('open-chat', this.openChat.bind(this));
    EventBus.on('close-chat', this.closeChat.bind(this));
  }

  toggleChat() {
    if (this.button.classList.contains('open')) {
      EventBus.emit('close-chat');
    } else {
      EventBus.emit('open-chat', { playSound: true });
    }
  }

  openChat() {
    this.button.classList.add('open');
  }

  closeChat() {
    this.button.classList.remove('open');
  }
}

customElements.define('chat-button', ChatButton);