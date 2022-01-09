export default class LoadMoreBtn {
    constructor(selector) {
        this.button = document.querySelector(selector);
    }

    enable() {
        this.button.disabled = false;
        this.button.textContent = 'LOAD MORE';
    }

    disable() {
        this.button.disabled = true;
        this.button.textContent = 'Loading...';
    }
    
    show() {
        this.button.classList.remove('visually-hidden');
    }

    hide() {
        this.button.classList.add('visually-hidden');
    }
}