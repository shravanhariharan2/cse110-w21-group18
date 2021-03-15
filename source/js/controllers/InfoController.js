export default class InfoController {
  constructor() {
    this.openInfo = this.openInfo.bind(this);
    this.closeInfo = this.closeInfo.bind(this);
    this.DOM_ELEMENTS = {
      infoModal: document.getElementById('info-modal'),
    };
    this.DOM_ELEMENTS.infoModal.style.display = 'none';
  }

  /*
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
