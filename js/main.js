(function() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

  function ready() {
    //   APP CONSTANTS
    var OPTIONS_LOADING = "در حال بارگزاری ...";

    // APP STATES
    var isAutocompleteDropped = false;

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
    var retrive_data_btn = document.querySelector(".retrieve-branch-info");
    var tabHeaders = document.querySelectorAll(".tab-header");
    var tabPanes = document.querySelectorAll(".tab-panel");
    var qrcode__scanner__closebtn = document.querySelector(
      ".qrcode__scanner__closebtn"
    );

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

    retrive_data_btn.addEventListener("click", handleClick_retrieveBranchInfo);

    tabHeaders.forEach((tabHeader, index) => {
      tabHeader.addEventListener("click", () => {
        tabPanes.forEach(pane => pane.classList.remove("active-pane"));
        tabHeaders.forEach(header => header.classList.remove("active"));

        tabHeader.classList.add("active");
        tabPanes[index].classList.add("active-pane");
      });
    });

    qrcode__scanner__closebtn.addEventListener("click", () => {
      document
        .querySelector(".scanner-container")
        .classList.remove("scanner-container--show");

      document.body.classList.remove("body--set-as-background");
    });

    // EVENT HADNLERS
    function handleClick_startScan() {
      let scanner = new Instascan.Scanner({
        video: document.getElementById("qrcode-preview")
      });
      scanner.addListener("scan", function(content) {
        console.log(content);
      });

      Instascan.Camera.getCameras()
        .then(function(cameras) {
          console.log("got here");
          if (cameras.length > 0) {
            // display the scanner preview section and start the camera continously
            let scannerContainer = document.querySelector(".scanner-container");
            let body = document.body;
            scannerContainer.classList.add("scanner-container--show");
            body.classList.add("body--set-as-background");

            cameras[1] ? scanner.start(cameras[1]) : scanner.start(cameras[0]);
          } else {
            new Snack({
              state: "error",
              message: "دوربینی برای اسکن پیدا نشد"
            }).show();
          }
        })
        .catch(error => {
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
      // TODO: call services to retrive data
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
