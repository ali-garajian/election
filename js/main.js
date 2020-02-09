import QrScanner from "../lib/js/qr-scanner.min.js";

(function() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  function ready() {
    // SETTING UP QRSCANNER
    QrScanner.WORKER_PATH = "./lib/js/qr-scanner-worker.min.js";

    //   APP CONSTANTS
    var OPTIONS_LOADING = "در حال بارگزاری ...";
    var RETRIEVE_OPTIONS = {
      QRCode: 0,
      Barcode: 1,
      List: 2
    };

    // APP STATES
    var isAutocompleteDropped = false;
    var currentTab = RETRIEVE_OPTIONS.QRCode;
    var QrcodeValue = null;

    // CACHING THE DOM
    var autocomplete_dropdownicon = document.querySelector(
      ".autocomplete__dropdownicon"
    );
    var autocomplete_dropupicon = document.querySelector(
      ".autocomplete__dropupicon"
    );
    var autocomplete_loadingicon = document.querySelector(
      ".autocomplete__loadingicon"
    );
    var autocomplete_options = document.querySelector(".autocomplete__options");
    var autocomplete__options__infotext = document.querySelector(
      ".autocomplete__options__infotext"
    );
    var retrieve_data_btn = document.querySelector(".retrieve-branch-info");
    var tabHeaders = document.querySelectorAll(".tab-header");
    var tabPanes = document.querySelectorAll(".tab-panel");
    var qrcode__scanner__closebtn = document.querySelector(
      ".qrcode__scanner__closebtn"
    );
    var scannerContainer = document.querySelector(".scanner-container");
    var qrcodeSuccessMessage = document.querySelector(".qrcode__success");
    var barcodeInput = document.querySelector(".barcode__input");
    var autocompleteInput = document.querySelector(".autocomplete__input");
    var mainContent = document.querySelector(".main-content");
    var tabPanesContainer = document.querySelector(".tab-panes");
    var mainTopHeader = document.querySelector(".header__top-header");

    // ADDING EVENT LISTENERS
    document
      .querySelector(".qrcode__scanner__btn")
      .addEventListener("click", handleClick_startScan);

    document
      .querySelector(".autocomplete")
      .addEventListener("click", handleClick_autocompleteList);

    autocomplete_dropdownicon.addEventListener("click", toggleAutoCompleteList);
    autocomplete_dropupicon.addEventListener("click", toggleAutoCompleteList);

    // add a click away listener for the autocomplete list
    document.addEventListener("click", e => {
      if (
        !document.querySelector(".autocomplete").contains(e.target) &&
        isAutocompleteDropped
      )
        toggleAutoCompleteList();
    });

    retrieve_data_btn.addEventListener("click", handleClick_retrieveBranchInfo);

    tabHeaders.forEach((tabHeader, index) => {
      tabHeader.addEventListener("click", () => {
        tabPanesContainer.classList.add("d-block");
        mainTopHeader.classList.add("d-none");
        
        tabPanes.forEach(pane => pane.classList.remove("active-pane"));
        tabHeaders.forEach(header => header.classList.remove("active"));

        tabHeader.classList.add("active");
        tabPanes[index].classList.add("active-pane");

        currentTab = tabHeader.className.includes("qrcode")
          ? RETRIEVE_OPTIONS.QRCode
          : tabHeader.className.includes("barcode")
          ? RETRIEVE_OPTIONS.Barcode
          : RETRIEVE_OPTIONS.List;

        // disable or enable retrieve data btn based on the tab the user's on
        if (
          (currentTab === RETRIEVE_OPTIONS.QRCode && QrcodeValue) ||
          (currentTab === RETRIEVE_OPTIONS.Barcode &&
            Boolean(barcodeInput.value)) ||
          (currentTab === RETRIEVE_OPTIONS.List &&
            Boolean(autocompleteInput.value))
        ) {
          retrieve_data_btn.removeAttribute("disabled");
        } else {
          retrieve_data_btn.setAttribute("disabled", "disabled");
        }
      });
    });

    qrcode__scanner__closebtn.addEventListener("click", () => {
      scannerContainer.classList.remove("scanner-container--show");
      document.body.classList.remove("body--set-as-background");
      mainContent.classList.remove("d-none");
    });

    barcodeInput.addEventListener("input", handleInputChange);
    autocompleteInput.addEventListener("input", handleInputChange);

    // EVENT HADNLERS
    function handleClick_startScan() {
      QrScanner.hasCamera()
        .then(hasCamera => {
          if (hasCamera) {
            let qrscanner = new QrScanner(
              document.getElementById("qrcode-preview"),
              result => {
                console.log(result);

                scannerContainer.classList.remove("scanner-container--show");
                document.body.classList.remove("body--set-as-background");
                mainContent.classList.remove("d-none");

                qrscanner.destroy();

                // let the user know branch's id is received and mark the retrieve data button
                qrcodeSuccessMessage.classList.add("d-block");
                retrieve_data_btn.removeAttribute("disabled");
              }
            );

            qrscanner.start();

            scannerContainer.classList.add("scanner-container--show");
            document.body.classList.add("body--set-as-background");
            mainContent.classList.add("d-none");
          } else {
            new Snack({
              state: "error",
              message: "دوربینی برای اسکن پیدا نشد"
            }).show();

            document
              .getElementsByTagName("html")[0]
              .classList.add("no-getusermedia");
          }
        })
        .catch(e => {
          document
            .getElementsByTagName("html")[0]
            .classList.add("no-getusermedia");
        });
    }
    function handleClick_autocompleteList() {
      if (!isAutocompleteDropped) {
        toggleAutoCompleteList();
      }
    }
    function handleClick_retrieveBranchInfo() {
      // TODO: call services to retrive data based on the value of currentTab State

      new BranchModal().show();
    }
    function handleInputChange(e) {
      if (!Boolean(e.target.value)) {
        retrieve_data_btn.setAttribute("disabled", "disabled");
        return;
      }
      retrieve_data_btn.removeAttribute("disabled");
    }

    //   UTILITY FUNCTIONS
    function toggleAutoCompleteList(e) {
      // prevent event bubbling from calling the fucntion twice
      if (e) e.stopPropagation();

      isAutocompleteDropped = !isAutocompleteDropped;
      autocomplete_dropdownicon.classList.toggle("d-none");
      autocomplete_dropupicon.classList.toggle("d-block");
      autocomplete_loadingicon.classList.toggle("d-block");
      autocomplete_options.classList.toggle("d-block");

      //   if open we should call our services to fetch the data
      if (isAutocompleteDropped) {
        FetchBranches();
      }
    }
    function FetchBranches() {
      autocomplete__options__infotext.classList.remove("d-none");
      //   check if the data exists in the session storage
      let data = sessionStorage.getItem("branchesData");
      if (data) {
        createOptionsList(data);
        return;
      }

      //   fetch()
      //     .then(response => response.json())
      //     .then(result => {
      //       if (result) {
      //         autocomplete__options__infotext.classList.add("d-none");
      //         const data = result;
      //         sessionStorage.setItem("branchesData", data);
      //         createOptionsList(data);
      //       }
      //     });
    }
    function createOptionsList(data) {
      data.forEach(branch => {
        let listItem = document.createElement("div");
        listItem.className = "autocomplete__listItem";
        listItem.innerText = branch.name;
        listItem.setAttribute("data-name", branc.name);
        listItem.setAttribute("data-id", branc.id);
        autocomplete_options.appendChild(listItem);
      });
    }
  }
})();
