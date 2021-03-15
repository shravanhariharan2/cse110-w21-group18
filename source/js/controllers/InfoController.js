class InfoController {
  constructor() {

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
