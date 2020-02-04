class BranchModal extends Modal {
  constructor(branchData) {
    super();

    this.data = branchData;

    this.setHeader(this.createHeader())
      .setBody(this.createBody())
      .setFooter(this.createFooter());
  }

  createHeader() {
    return "مشخصات حوزه";
  }
  createBody() {
    return "جزئیات بازآوری شده درباره حوزه انتخاب شده";
  }
  createFooter() {
    let moveToBranchPageBtn = document.createElement("a");
    moveToBranchPageBtn.setAttribute("href", "#");
    moveToBranchPageBtn.innerHTML = "انتخاب حوزه";
    moveToBranchPageBtn.classList.add("modal-footer-cta");

    return moveToBranchPageBtn;
  }
}
