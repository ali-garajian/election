class Modal {
  static MODAL_PARTS = {
    modalDialog: {
      name: "modalDialog",
      cssClass: "modal-dialog"
    },
    modalHeader: {
      name: "modalHeader",
      cssClass: "modal-header"
    },
    modalBody: {
      name: "modalBody",
      cssClass: "modal-body"
    },
    modalFooter: {
      name: "modalFooter",
      cssClass: "modal-footer"
    }
  };

  constructor(header, body, footer, styles) {
    this.header = header;
    this.body = body;
    this.footer = footer;
    this.styles = styles;

    this.modalParts = {};

    this.init();
  }

  init() {
    // set the body element's required css props in order for the modal to work properly
    document.body.style.position = "relative";

    // create different sections
    Object.keys(Modal.MODAL_PARTS).forEach(part => {
      this.modalParts[part] = document.createElement("div");
      this.modalParts[part].classList.add(Modal.MODAL_PARTS[part].cssClass);

      if (Modal.MODAL_PARTS[part].name !== Modal.MODAL_PARTS.modalDialog.name)
        this.modalParts[Modal.MODAL_PARTS.modalDialog.name].appendChild(
          this.modalParts[part]
        );
    });

    // add user styles
    this.styles &&
      Object.keys(this.styles).forEach(part => {
        let partStyles = this.styles[part];
        this.modalParts[part].style = Object.keys(partStyles).reduce(
          (acc, curr) => {
            acc += `${curr}: ${partStyles[curr]};`;
          },
          ""
        );
      });

    // adding the content
    this.modalParts[Modal.MODAL_PARTS.modalHeader.name].innerHTML = this.header || '';
    this.modalParts[Modal.MODAL_PARTS.modalBody.name].innerHTML = this.body || '';
    this.modalParts[Modal.MODAL_PARTS.modalFooter.name].innerHTML = this.footer || '';

    // adding close button to header
    this.closeBtn = document.createElement("span");
    this.closeBtn.classList.add("modal-close-btn");
    this.closeBtn.innerHTML = "&times;";
    this.closeBtn.addEventListener("click", () => {
      this.hide();
    });
    this.modalParts[Modal.MODAL_PARTS.modalHeader.name].appendChild(
      this.closeBtn
    );

    // adding modal overlay to the body
    this.overlay = document.createElement("div");
    this.overlay.classList.add("modal-overlay");
    document.body.appendChild(this.overlay);
  }

  show() {
    if (
      !this.modalParts[Modal.MODAL_PARTS.modalDialog.name].classList.contains(
        "modal-show"
      )
    ) {
      document.body.appendChild(
        this.modalParts[Modal.MODAL_PARTS.modalDialog.name]
      );
      setTimeout(() => {
        this.overlay.classList.add("overlay-d-block");
        this.modalParts[Modal.MODAL_PARTS.modalDialog.name].classList.add(
          "modal-show"
        );
      }, 1);
    }
  }
  hide() {
    this.overlay.classList.remove("overlay-d-block");
    this.modalParts[Modal.MODAL_PARTS.modalDialog.name].classList.remove(
      "modal-show"
    );
    setTimeout(() => {
      document.body.removeChild(
        this.modalParts[Modal.MODAL_PARTS.modalDialog.name]
      );
      document.body.removeChild(this.overlay);
    }, 1000);
  }
  
  setHeader(content) {
    this.modalParts[Modal.MODAL_PARTS.modalHeader.name].innerHTML = content.outerHTML || content;
    this.modalParts[Modal.MODAL_PARTS.modalHeader.name].appendChild(this.closeBtn);

    return this;
  }
  setBody(content) {
    this.modalParts[Modal.MODAL_PARTS.modalBody.name].innerHTML = content.outerHTML || content;

    return this;
  }
  setFooter(content) {
    this.modalParts[Modal.MODAL_PARTS.modalFooter.name].innerHTML = content.outerHTML || content;

    return this;
  }
}
