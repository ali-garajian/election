(function() {
  var IS_SNACK_SHOWN = false;
  function Snack(options) {
    // set body's position to relative so snack can be positioned accordingly
    document.body.classList.add("snack-compatible-body");

    this.snack = document.createElement("div");
    this.snack.className = `snack ${
      options.state == "error"
        ? "snack-error"
        : options.state == "success"
        ? "snack-success"
        : "snack-info"
    } ${options.classes ? options.classes : ""}`;

    var _self = this;
    this.snack.innerHTML = `
        <span class="snack-close-btn" onclick="closeSnack()">&times;</span>
        <div class="snack-message">${options.message}</div>
    `;

    options.styles &&
      Object.keys(options.styles).forEach(key => {
        this.snack.style[key] = options.styles[key];
      });

    Snack.prototype.show = function() {
      if (!IS_SNACK_SHOWN) {
        IS_SNACK_SHOWN = true;
        document.body.appendChild(this.snack);
        setTimeout(() => {
          this.snack.style.bottom = "10px";
        }, 10);

        setTimeout(
          () => {
            this.hide();
          },
          options.timeout ? options.timeout : 4000
        );
      }
    };

    Snack.prototype.hide = function() {
      IS_SNACK_SHOWN = false;
      this.snack.style.bottom = "-100%";
      setTimeout(() => {
        this.snack.remove();
      }, 1000);
    };

    closeSnack = () => {
      this.hide();
    };
  }

  window.Snack = Snack;
})();
