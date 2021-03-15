export default class InfoController {
  constructor() {
    this.DOM_ELEMENTS = {
      infoModal: document.getElementById('info-modal'),
    };
    this.DOM_ELEMENTS.infoModal.style.display = 'none';
  }

   /*
   * Opens info box UI
   */
  openInfo() {
    document.getElementById('info-modal').style.display = 'block';
  }
  /**
   * Closes info box UI
   */
  closenfo() {
    document.getElementById('info-modal').style.display = 'none';
  }
}
   