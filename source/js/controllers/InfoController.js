let instance = null;

class InfoController {
  constructor() {
    if (instance) return instance;
    instance = this;

    // binding methods to objects
    this.openInfo = this.openInfo.bind(this);
    this.closeInfo = this.closeInfo.bind(this);

    this.DOM_ELEMENTS = {
      infoButton: document.getElementById('info-button'),
      infoModal: document.getElementById('info-modal'),
    };

    this.DOM_ELEMENTS.infoModal.style.display = 'none';

    return instance;
  }

  /**
   * Opens info box UI
   */
  openInfo() {
    this.DOM_ELEMENTS.infoModal.style.display = 'block';
  }
  /**
   * Closes info box UI
   */
  closeInfo() {
    this.DOM_ELEMENTS.infoModal.style.display = 'none';
  }

  
}

export default InfoController;
