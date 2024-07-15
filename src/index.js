import './components/ChatButton';
import './components/ChatIframe';
import './components/Widget';
import { initializeObserver } from './utils/PageObserver';

document.addEventListener('DOMContentLoaded', () => {
  initializeObserver();
});