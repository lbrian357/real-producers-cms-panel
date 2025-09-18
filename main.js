const EVENTS_COLLECTION_ID = "658f30a87b1a52ef8ad0b8e4";
const USERS_COLLECTION_ID = "658f30a87b1a52ef8ad0b74b";
const BRANDS_COLLECTION_ID = "658f30a87b1a52ef8ad0b77b";
const PARTNERS_COLLECTION_ID = "65e7ff7b313c5cd8cd924886";
const PARTNER_CATEGORIES_COLLECTION_ID = "65e7fc8199c534cfe2cba083";
const SITE_ID = "658f30a87b1a52ef8ad0b732";

const additionalCSS = `
.single-image-container {
  position: relative;
  display: inline-block;
}

.single-image-delete-btn {
    background-color: #fff;
    background-image: url(https://cdn.prod.website-files.com/658f30a87b1a52ef8ad0b732/658f30a87b1a52ef8ad0bb2d_x-icon-black.png);
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 50% 50%;
    border-radius: 100px;
    width: 20px;
    height: 20px;
    position: absolute;
    inset: 5px 5px auto auto;
}

.single-image-container:hover .single-image-delete-btn {
  opacity: 1;
}

.single-image-delete-btn:hover {
  background-color: #cc0000;
}

.single-image-deleted {
  opacity: 0.3;
  filter: grayscale(100%);
}
`;



$(document).ready(function () {
  rpLib.utils.injectCSS();
  rpLib.utils.injectDependencies();

  // Run the scripts on relevant pages
  if (window.location.pathname === "/account/get-started") rpLib.getStartedPage.init();
  if (window.location.pathname === "/account/dashboard") rpLib.dashboardPage.init();
  if (window.location.pathname === "/account/partners") rpLib.partnersPage.init();
  if (window.location.pathname === "/account/events") rpLib.eventsPage.init();
  if (window.location.pathname === "/account/users") rpLib.usersPage.init();

  if (window.location.pathname.startsWith("/partners/")) {
    // Wait a bit to ensure MixItUp is initialized
    setTimeout(() => {
      rpLib.partnersSearchPage.init();
    }, 500);
  }
});

var rpLib = {
  getStartedPage: {
    init: function () {
      rpLib.utils.initCitySelection();
    },
  },
  dashboardPage: {
    init: function () {
      // Hide content that requires a city selection
      $(".grid-main-account-dashboard .grid-dashboard-section").hide();

      rpLib.utils.initCitySelection(
        // On city selected by user
        function (brandId) {
          // Show the content that requires a city selection
          $(".grid-main-account-dashboard .grid-dashboard-section").show();

          const selectedCityId = $("#city-select").val();
          const selectedCitySlug = $("#city-select option:selected").attr("data-slug");
          const selectedCityUrl = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${BRANDS_COLLECTION_ID}/items/${selectedCityId}`;

          $.ajax({
            url: selectedCityUrl,
            type: "GET",
            success: function (response) {
              const domain = response.fieldData?.domain || null;
              const setupComplete = response.fieldData?.["setup-complete"] || null;
              const basePageUrl = "https://www.realproducersmagazine.com";
              const originalWebsiteUrl = response.fieldData?.["url-original-rp-website"] || null;
              const isForwardedFromOriginalUrl = response.fieldData?.["url-original-rp-website-forwarded-to-new-website"] || false;

              if (domain && setupComplete) {
                $(".grid-dashboard-page-link-map .text-link-dashboard.domain").show();
                $(".grid-dashboard-page-link-map .links-to").show();

                // Update the domain links
                $(".domains-and-pages .home-domain-btn").attr("href", domain).text(domain);
                $(".domains-and-pages .issues-domain-btn").attr("href", domain + "/issues");
                $(".domains-and-pages .events-domain-btn").attr("href", domain + "/events");
                $(".domains-and-pages .partners-domain-btn").attr("href", domain + "/partners");
                $(".domains-and-pages .promos-domain-btn").attr("href", domain + "/promos");
                $(".domains-and-pages .hello-agents-domain-btn").attr("href", domain + "/hello-agents");
                $(".domains-and-pages .hello-partners-domain-btn").attr("href", domain + "/hello-partners");
                $(".domains-and-pages .about-domain-btn").attr("href", domain + "/about");
                $(".domains-and-pages .advertise-domain-btn").attr("href", domain + "/advertise");

                // Update the original website URL if provided
                $(".domains-and-pages .old-website-url-btn").attr("href", originalWebsiteUrl).text(originalWebsiteUrl);
                if (isForwardedFromOriginalUrl) {
                  // show .old-website-forwarded
                  $(".domains-and-pages .old-website-forwarded").show();
                  $(".domains-and-pages .old-website-no-forward").hide();
                } else {
                  // show .old-website-no-forward
                  $(".domains-and-pages .old-website-no-forward").show();
                  $(".domains-and-pages .old-website-forwarded").hide();
                }
              } else {
                $(".grid-dashboard-page-link-map .text-link-dashboard.domain").hide();
                $(".grid-dashboard-page-link-map .links-to").hide();
              }

              // Update the page links
              $(".domains-and-pages .home-page-btn").attr("href", basePageUrl + "/home/" + selectedCitySlug);
              $(".domains-and-pages .issues-page-btn").attr("href", basePageUrl + "/issues/" + selectedCitySlug);
              $(".domains-and-pages .events-page-btn").attr("href", basePageUrl + "/events/" + selectedCitySlug);
              $(".domains-and-pages .partners-page-btn").attr("href", basePageUrl + "/partners/" + selectedCitySlug);
              $(".domains-and-pages .promos-page-btn").attr("href", basePageUrl + "/promos/" + selectedCitySlug);
              $(".domains-and-pages .hello-agents-page-btn").attr("href", basePageUrl + "/hello-agents/" + selectedCitySlug);
              $(".domains-and-pages .hello-partners-page-btn").attr("href", basePageUrl + "/hello-partners/" + selectedCitySlug);
              $(".domains-and-pages .about-page-btn").attr("href", basePageUrl + "/about/" + selectedCitySlug);
              $(".domains-and-pages .advertise-page-btn").attr("href", basePageUrl + "/advertise/" + selectedCitySlug);

              // Update the text in the .domains-and-pages list
              $(".domains-and-pages a.text-link-dashboard").not('.is-label').each(function () {
                // replace text with href
                const href = $(this).attr("href");
                $(this).text(href);
              });
            },
          });
        }
      );
    },
  },
  usersPage: {
    state: {
      uploads: {
        profilePic: null,
        fullPic: null,
      },
      modalContentTemplateHTML: null,
    },
    init: function () {
      rpLib.utils.initCitySelection(function (brandId) {
        // On city selected
        rpLib.api.fetchBrandUsersAndRender(brandId);

        // Set View All link
        const citySlug = $("#city-select option:selected").attr("data-slug");
        $("a#view-all").attr("href", `http://www.realproducersmagazine.com/about/${citySlug}`);

        // Show elements that are hidden by default until a city is selected
        $("#view-all").removeClass("hidden");
        $(".lib-create-item-btn").removeClass("hidden");
        $(".grid-header-row").removeClass("hidden");
      });

      this.bindEventListeners();
    },
    bindEventListeners: function () {
      this.state.modalContentTemplateHTML = $(".collection-item-modal-content")[0].outerHTML;

      this.bindCreateUserEvents();
      this.bindEditUserEvents();
      this.bindDeleteUserEvents();
      this.bindShowHideEvents();
      this.bindModalEvents();
    },
    bindCreateUserEvents: function () {
      // Event listener for create button click
      $("body").on("click", ".lib-create-item-btn", function (event) {
        rpLib.usersPage.resetUsersModalContent(function () {
          // Show the modal after resetting content
          $(".collection-item-modal").removeClass("hidden");
        });
      });
    },
    bindEditUserEvents: function () {
      // Event listener for edit button click and open modal
      $("body").on("click", ".item-edit-btn", function (event) {
        let userId = $(this).closest(".collection-item").attr("data-user-id");
        let slug = $(this).closest(".collection-item").attr("data-slug");

        // Reset modal content
        rpLib.usersPage.resetUsersModalContent(function () {
          // Set the user ID for editing (not creating)
          $(".collection-item-modal").attr("data-user-id", userId);

          // Fetch and populate user details
          rpLib.api.fetchUserDetailsAndOpenModal(slug);
        });
      });
    },
    bindDeleteUserEvents: function () {
      // Event listener for delete button click
      $("body").on("click", ".item-delete-btn", function (event) {
        const userId = $(this).closest(".collection-item").attr("data-user-id");
        const userName = $(this).closest(".collection-item").find(".user-name").text();

        if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
          rpLib.api.archiveItem(USERS_COLLECTION_ID, userId, "User", function () {
            // Refresh the list after successful archive
            rpLib.api.fetchBrandUsersAndRender($("#city-select").val());
          });
        }
      });
    },
    bindShowHideEvents: function () {
      $("body").on("change", ".show-hide-switch .switch input", function () {
        const userId = $(this).closest(".collection-item").attr("data-user-id");
        const showUser = $(this).is(":checked");

        rpLib.api.updateUserShowHide(userId, showUser);
      });
    },
    bindModalEvents: function () {
      // Event listener on url inputs to add "http://" to website URL if not present
      $(document).on("blur", '.collection-item-modal input[type="url"]', function () {
        const url = $(this).val().trim();

        const urlWithProtocol = rpLib.utils.formatUrlWithProtocol(url);
        $(this).val(urlWithProtocol);
      });
    },
    handleSaveUserClick: function (profilePicFile, fullPicFile) {
      const userId = $(".collection-item-modal").attr("data-user-id");
      const isCreatingNewUser = !userId; // Check if we're creating a new user

      let uploadPromises = [];

      // Show saving status
      $("#save-user").text("Uploading images...");
      $("#save-user").prop("disabled", true);
      $("#full-page-loading-overlay").show();

      // Upload profile pic if it's a new file
      if (rpLib.usersPage.state.uploads.profilePic) {
        $("#profile-pic-upload-status").text("Uploading...");
        let profilePicPromise = new Promise((resolve) => {
          rpLib.api.uploadImage(
            rpLib.usersPage.state.uploads.profilePic,
            function (result) {
              $("#profile-pic-upload-status").text("Upload complete!");
              $("#profile-pic-preview").attr("src", result.url);
              resolve(result); // Resolve when upload succeeds
            },
            function (error) {
              $("#profile-pic-upload-status").text("Upload failed: " + error.statusText);
              resolve(); // Resolve even if upload fails
            }
          );
        });
        uploadPromises.push(profilePicPromise);
      }

      // Upload full pic if it's a new file
      if (fullPicFile) {
        $("#full-pic-upload-status").text("Uploading...");
        let fullPicPromise = new Promise((resolve) => {
          rpLib.api.uploadImage(
            fullPicFile,
            function (result) {
              $("#full-pic-upload-status").text("Upload complete!");
              $("#full-pic-preview").attr("src", result.url);
              resolve(result);
            },
            function (error) {
              $("#full-pic-upload-status").text("Upload failed: " + error.statusText);
              resolve();
            }
          );
        });
        uploadPromises.push(fullPicPromise);
      }

      // Wait for all uploads to finish before saving and closing modal
      Promise.all(uploadPromises).then((results) => {
        if (isCreatingNewUser) {
          const brandId = $("#city-select").val();
          rpLib.api.createUserAndRefreshList(brandId, profilePicFile, fullPicFile, function () {
            // Reset button text and re-enable it, then hide loading overlay
            $("#save-user").text("Save");
            $("#save-user").prop("disabled", false);
            $("#full-page-loading-overlay").hide();
          });
        } else {
          rpLib.api.updateUserAndRefreshList(userId, profilePicFile, fullPicFile, function () {
            // Reset button text and re-enable it, then hide loading overlay
            $("#save-user").text("Save");
            $("#save-user").prop("disabled", false);
            $("#full-page-loading-overlay").hide();
          });
        }
      });
    },
    resetUsersModalContent: function (afterResetCallback) {
      // Reset the uploads state
      rpLib.usersPage.state.uploads = {
        profilePic: null,
        fullPic: null,
      };

      // Add deletion tracking
      rpLib.usersPage.state.deletions = {
        profilePic: false,
        fullPic: false,
      };

      // Reset the modal content to template
      cleanModalContentTemplate = $(this.state.modalContentTemplateHTML);
      $(".collection-item-modal").removeAttr("data-user-id");
      $(".collection-item-modal").empty();
      $(".collection-item-modal").append(cleanModalContentTemplate);

      // Re/init rich text editor for user bio
      rpLib.utils.initRichTextEditor("user-bio", "Share user bio or info here...");

      if (typeof afterResetCallback === "function") {
        afterResetCallback();
      }

      // On save button click
      $("#save-user").on("click", function () {
        rpLib.usersPage.handleSaveUserClick(
          rpLib.usersPage.state.uploads.profilePic, 
          rpLib.usersPage.state.uploads.fullPic
        );
      });

      // Close modal
      $("#close-modal").on("click", function () {
        if (confirm("Are you sure you want to close the modal? Any unsaved changes will be lost.")) {
          $(".collection-item-modal").addClass("hidden");
        }
      });

      // On profile pic preview replacement click, open file dialog
      rpLib.utils.setupSingleImgPreviewReplacement("profile-pic-preview", function (result) {
        if (result === 'DELETED') {
          $("#profile-pic-upload-status").text("Image will be removed when saved");
          rpLib.usersPage.state.deletions.profilePic = true;
          rpLib.usersPage.state.uploads.profilePic = null;
        } else if (result) {
          $("#profile-pic-upload-status").text("Image selected (will upload when saved)");
          rpLib.usersPage.state.uploads.profilePic = result;
          rpLib.usersPage.state.deletions.profilePic = false;
        }
      });

      // On full pic preview replacement click, open file dialog
      rpLib.utils.setupSingleImgPreviewReplacement("full-pic-preview", function (result) {
        if (result === 'DELETED') {
          $("#full-pic-upload-status").text("Image will be removed when saved");
          rpLib.usersPage.state.deletions.fullPic = true;
          rpLib.usersPage.state.uploads.fullPic = null;
        } else if (result) {
          $("#full-pic-upload-status").text("Image selected (will upload when saved)");
          rpLib.usersPage.state.uploads.fullPic = result;
          rpLib.usersPage.state.deletions.fullPic = false;
        }
      });
    },
    renderUser: function (user) {
      const templateRowItem = $(".collection-item-row-template").clone();
      templateRowItem.removeClass("collection-item-row-template");
      templateRowItem.attr("data-slug", user.fieldData.slug);
      templateRowItem.attr("data-user-id", user.id);
      templateRowItem.find(".user-name").text(user.fieldData.name || "");
      templateRowItem.find(".user-number").text(user.fieldData.phone || "");
      templateRowItem.find(".user-email").text(user.fieldData.email || "");
      templateRowItem.find(".item-view-btn").attr("href", `https://www.realproducersmagazine.com/user/${user.fieldData.slug}` || "");

      if (user.fieldData["profile-picture"]?.url) {
        templateRowItem
          .find(".user-pic")
          .attr("src", user.fieldData["profile-picture"]?.url || "")
          .removeAttr("srcset");
      }

      const $showOrHideCheckbox = templateRowItem.find(".show-hide-switch .switch input");
      if (user.fieldData["show-user"] === true) {
        $showOrHideCheckbox.prop("checked", true);
      } else {
        $showOrHideCheckbox.prop("checked", false);
      }

      $("#collection-list").append(templateRowItem);
    },
  },
  partnersPage: {
    state: {
      uploads: {
        profilePic: null,
        logo: null,
        adImage: null,
      },
      partnerCategories: [],
      modalContentTemplateHTML: null,
    },
    init: function () {
      // Load list of partner categories first so it's available to populate the dropdown in the edit modal
      rpLib.api.fetchAllPartnerCategories(function (categories) {
        // Save categories to state for later use
        rpLib.partnersPage.state.partnerCategories = categories;

        // Initialize city selection and fetch partners
        rpLib.utils.initCitySelection(function (brandId) {
          // On city selected
          rpLib.api.fetchPartnersAndRender(brandId);

          // Set View All link
          const citySlug = $("#city-select option:selected").attr("data-slug");
          $("a#view-all").attr("href", `http://www.realproducersmagazine.com/partners/${citySlug}`);

          // Show elements that are hidden by default until a city is selected
          $("#view-all").removeClass("hidden");
          $(".lib-create-item-btn").removeClass("hidden");
          $(".grid-header-row").removeClass("hidden");
        });
      });

      this.bindEventListeners();
    },
    bindEventListeners: function () {
      this.state.modalContentTemplateHTML = $(".collection-item-modal-content")[0].outerHTML;

      this.bindCreatePartnerEvents();
      this.bindEditPartnerEvents();
      this.bindDeletePartnerEvents();
      this.bindShowHideEvents();
      this.bindModalEvents();
    },
    bindCreatePartnerEvents: function () {
      // On create new partner click
      $("body").on("click", ".lib-create-item-btn", function (event) {
        rpLib.partnersPage.resetPartnersModalContent(function () {
          $("#partner-categories").multiselect("reload");
          $(".collection-item-modal").removeClass("hidden");
        });
      });
    },
    bindEditPartnerEvents: function () {
      // On edit button click open modal
      $("body").on("click", ".item-edit-btn", function (event) {
        const partnerId = $(this).closest(".collection-item").attr("data-partner-id");
        const slug = $(this).closest(".collection-item").attr("data-slug");

        rpLib.partnersPage.resetPartnersModalContent(function () {
          $(".collection-item-modal").attr("data-partner-id", partnerId);

          rpLib.api.fetchPartnerDetailsAndOpenModal(slug);
        });
      });
    },
    bindDeletePartnerEvents: function () {
      // On delete button click
      $("body").on("click", ".item-delete-btn", function (event) {
        const partnerId = $(this).closest(".collection-item").attr("data-partner-id");
        const partnerName = $(this).closest(".collection-item").find(".partner-name").text();

        if (confirm(`Are you sure you want to delete partner "${partnerName}"?`)) {
          rpLib.api.archiveItem(PARTNERS_COLLECTION_ID, partnerId, "Partner", function () {
            // Refresh the list after successful archive
            rpLib.api.fetchPartnersAndRender($("#city-select").val());
          });
        }
      });
    },
    bindShowHideEvents: function () {
      $("body").on("change", ".show-hide-switch .switch input", function () {
        const partnerId = $(this).closest(".collection-item").attr("data-partner-id");
        const showPartner = $(this).is(":checked");

        rpLib.api.updatePartnerShowHide(partnerId, showPartner);
      });
    },
    bindModalEvents: function () {
      // Event listener on url inputs to add "http://" to website URL if not present
      $(document).on("blur", '.collection-item-modal input[type="url"]', function () {
        const url = $(this).val().trim();

        const urlWithProtocol = rpLib.utils.formatUrlWithProtocol(url);
        $(this).val(urlWithProtocol);
      });
    },
    resetPartnersModalContent: function (afterResetCallback) {
      rpLib.partnersPage.state.uploads = {
        profilePic: null,
        logo: null,
        adImage: null,
      };

      cleanModalContentTemplate = $(this.state.modalContentTemplateHTML);
      $(".collection-item-modal").removeAttr("data-partner-id");
      $(".collection-item-modal").empty();
      $(".collection-item-modal").append(cleanModalContentTemplate);

      // Re/init partner categories
      $("#partner-categories").empty(); // Clear existing options
      $("#partner-categories").multiselect({
        maxHeight: 200,
      });
      rpLib.partnersPage.state.partnerCategories.forEach(function (category) {
        $("#partner-categories").append(
          $("<option>", {
            value: category.id,
            text: category.fieldData.name || "Unnamed Category",
          })
        );
      });

      // Re/Init rich text editor for partner description
      rpLib.utils.initRichTextEditor("partner-description", "Share partner bio or info here...");

      if (typeof afterResetCallback === "function") {
        afterResetCallback();
      }

      // On modal save click
      $("#save-partner").on("click", function () {
        rpLib.partnersPage.handleSavePartnerClick(
          rpLib.partnersPage.state.uploads.profilePic,
          rpLib.partnersPage.state.uploads.logo,
          rpLib.partnersPage.state.uploads.adImage
        );
      });

      // On modal close
      $("#close-modal").on("click", function () {
        // Ask for confirmation before closing the modal
        if (confirm("Are you sure you want to close the modal? Any unsaved changes will be lost.")) {
          $(".collection-item-modal").addClass("hidden");
        }
      });

      // On image preview replacement click, open file dialog
      rpLib.utils.setupSingleImgPreviewReplacement("profile-pic-preview", function (newFile) {
        // Update the status text after selecting a new image
        $("#profile-pic-upload-status").text("Image selected (will upload when saved)");

        // Update the state/variable to indicate a new file was selected
        rpLib.partnersPage.state.uploads.profilePic = newFile;
      });
      rpLib.utils.setupSingleImgPreviewReplacement("logo-preview", function (newFile) {
        $("#logo-upload-status").text("Image selected (will upload when saved)");
        rpLib.partnersPage.state.uploads.logo = newFile;
      });
      rpLib.utils.setupSingleImgPreviewReplacement("ad-image-preview", function (newFile) {
        $("#ad-image-upload-status").text("Image selected (will upload when saved)");
        rpLib.partnersPage.state.uploads.adImage = newFile;
      });
    },
    renderPartner: function (partner) {
      const templateRowItem = $(".collection-item-row-template").clone();
      templateRowItem.removeClass("collection-item-row-template");
      templateRowItem.attr("data-slug", partner.fieldData.slug);
      templateRowItem.attr("data-partner-id", partner.id);

      if (partner.fieldData["profile-pic"]?.url) {
        templateRowItem
          .find(".partner-pic")
          .attr("src", partner.fieldData["profile-pic"]?.url || "")
          .removeAttr("srcset");
      }
      templateRowItem.find(".partner-name").text(partner.fieldData.name || "");
      templateRowItem.find(".partner-number").text(partner.fieldData.phone || "");
      templateRowItem.find(".partner-email").text(partner.fieldData.email || "");
      templateRowItem.find(".item-view-btn").attr("href", `http://www.realproducersmagazine.com/partner/${partner.fieldData.slug}` || "");

      const $showOrHideCheckbox = templateRowItem.find(".show-hide-switch .switch input");
      if (partner.fieldData["show-partner"] === true) {
        $showOrHideCheckbox.prop("checked", true);
      } else {
        $showOrHideCheckbox.prop("checked", false);
      }

      $("#collection-list").append(templateRowItem);
    },
    handleSavePartnerClick: function (profilePicFile, logoFile, adImageFile) {
      const partnerId = $(".collection-item-modal").attr("data-partner-id");
      const isCreatingNewPartner = !partnerId;

      let uploadPromises = [];

      // Show saving status
      $("#save-partner").text("Uploading images...");
      $("#save-partner").prop("disabled", true);
      $("#full-page-loading-overlay").show();

      // Upload profile pic if new file selected
      if (profilePicFile) {
        $("#profile-pic-upload-status").text("Uploading...");
        let profilePicPromise = new Promise((resolve) => {
          rpLib.api.uploadImage(
            profilePicFile,
            function (result) {
              $("#profile-pic-upload-status").text("Upload complete!");
              $("#profile-pic-preview").attr("src", result.url);
              resolve(result);
            },
            function (error) {
              $("#profile-pic-upload-status").text("Upload failed: " + error.statusText);
              resolve();
            }
          );
        });
        uploadPromises.push(profilePicPromise);
      }
      // Upload logo if new file selected
      if (logoFile) {
        $("#logo-upload-status").text("Uploading...");
        let logoPromise = new Promise((resolve) => {
          rpLib.api.uploadImage(
            logoFile,
            function (result) {
              $("#logo-upload-status").text("Upload complete!");
              $("#logo-preview").attr("src", result.url);
              resolve(result);
            },
            function (error) {
              $("#logo-upload-status").text("Upload failed: " + error.statusText);
              resolve();
            }
          );
        });
        uploadPromises.push(logoPromise);
      }
      // Upload ad image if new file selected
      if (adImageFile) {
        $("#ad-image-upload-status").text("Uploading...");
        let adImagePromise = new Promise((resolve) => {
          rpLib.api.uploadImage(
            adImageFile,
            function (result) {
              $("#ad-image-upload-status").text("Upload complete!");
              $("#ad-image-preview").attr("src", result.url);
              resolve(result);
            },
            function (error) {
              $("#ad-image-upload-status").text("Upload failed: " + error.statusText);
              resolve();
            }
          );
        });
        uploadPromises.push(adImagePromise);
      }

      // Wait for all uploads to finish before saving and closing modal
      Promise.all(uploadPromises).then((results) => {
        if (isCreatingNewPartner) {
          const brandId = $("#city-select").val();
          rpLib.api.createPartnerAndRefreshList(brandId, profilePicFile, logoFile, adImageFile, function () {
            // Reset saving status
            $("#save-partner").text("Save");
            $("#save-partner").prop("disabled", false);
            $("#full-page-loading-overlay").hide();
          });
        } else {
          rpLib.api.updatePartnerAndRefreshList(partnerId, profilePicFile, logoFile, adImageFile, function () {
            // Reset saving status
            $("#save-partner").text("Save");
            $("#save-partner").prop("disabled", false);
            $("#full-page-loading-overlay").hide();
          });
        }
      });
    },
  },
  eventsPage: {
    state: {
      uploads: {
        mainImage: null,
        flyerImage: null,
        gallery1: [],
        gallery2: [],
        gallery3: [],
      },
      existingGallery1: [],
      existingGallery2: [],
      existingGallery3: [],
      modalContentTemplateHTML: null,
    },
    init: function () {
      rpLib.utils.initCitySelection(function (brandId) {
        rpLib.api.fetchEventsAndRender(brandId);

        // Set View All link
        const citySlug = $("#city-select option:selected").attr("data-slug");
        $("a#view-all").attr("href", `http://www.realproducersmagazine.com/events/${citySlug}`);

        // Show elements that are hidden by default until a city is selected
        $("#view-all").removeClass("hidden");
        $(".lib-create-item-btn").removeClass("hidden");
        $(".grid-header-row").removeClass("hidden");
      });

      this.bindEventListeners();
    },
    bindEventListeners: function () {
      this.state.modalContentTemplateHTML = $(".collection-item-modal-content")[0].outerHTML;

      this.bindCreateEventEvents();
      this.bindEditEventEvents();
      this.bindDeleteEventEvents();
      this.bindModalEvents();
      this.bindShowHideEvents();
    },
    bindCreateEventEvents: function () {
      // Event listener for create button click
      $("body").on("click", ".lib-create-item-btn", function (event) {
        rpLib.eventsPage.resetEventsModalContent(function () {
          $(".collection-item-modal").removeClass("hidden");
        });
      });
    },
    bindEditEventEvents: function () {
      $("#collection-list").on("click", ".item-edit-btn", function () {
        let eventId = $(this).closest(".collection-item").attr("data-event-id");
        let slug = $(this).closest(".collection-item").attr("data-slug");

        // Reset modal content
        rpLib.eventsPage.resetEventsModalContent(function () {
          $(".collection-item-modal").attr("data-event-id", eventId);

          rpLib.api.fetchEventDetailsAndOpenModal(slug);
        });
      });
    },
    bindDeleteEventEvents: function () {
      // Event listener for delete button click
      $("body").on("click", ".item-delete-btn", function (event) {
        const eventId = $(this).closest(".collection-item").attr("data-event-id");
        const eventName = $(this).closest(".collection-item").find(".event-name").text();

        if (confirm(`Are you sure you want to delete event "${eventName}"?`)) {
          rpLib.api.archiveItem(EVENTS_COLLECTION_ID, eventId, "Event", function () {
            // Refresh the list after successful archive
            rpLib.api.fetchEventsAndRender($("#city-select").val());
          });
        }
      });
    },
    bindShowHideEvents: function () {
      // if the checkbox input (.show-hide-switch .switch input)  is changed, update the event's "show-event" field
      $("body").on("change", ".show-hide-switch .switch input", function () {
        const eventId = $(this).closest(".collection-item").attr("data-event-id");
        const showEvent = $(this).is(":checked");
        // Update the event's "show-event" field
        rpLib.api.updateEventShowHide(eventId, showEvent);
      });
    },
    bindModalEvents: function () {
      // Event listener on url inputs to add "http://" to website URL if not present
      $(document).on("blur", '.collection-item-modal input[type="url"]', function () {
        const url = $(this).val().trim();

        const urlWithProtocol = rpLib.utils.formatUrlWithProtocol(url);
        $(this).val(urlWithProtocol);
      });
    },
    resetEventsModalContent: function (afterResetCallback) {
      rpLib.eventsPage.state.uploads = {
        mainImage: null,
        flyerImage: null,
        gallery1: [],
        gallery2: [],
        gallery3: [],
      };
      rpLib.eventsPage.state.existingGallery1 = [];
      rpLib.eventsPage.state.existingGallery2 = [];
      rpLib.eventsPage.state.existingGallery3 = [];

      cleanModalContentTemplate = $(this.state.modalContentTemplateHTML);
      $(".collection-item-modal").removeAttr("data-event-id");
      $(".collection-item-modal").empty();
      $(".collection-item-modal").append(cleanModalContentTemplate);

      // Reset the gallery previews (but keep the add image button)
      $("#gallery-1-preview, #gallery-2-preview, #gallery-3-preview").children(":not(.add-img-btn)").remove();

      // Re/init rich text editor for event description
      if ($("#event-description").length) {
        // Did gabe remove this?
        rpLib.utils.initRichTextEditor("event-description", "Share event description or info here...");
      }

      if (typeof afterResetCallback === "function") {
        afterResetCallback();
      }

      rpLib.utils.setupSingleImgPreviewReplacement("main-image-preview", function (newFile) {
        // Update the status text after selecting a new image
        $("#main-image-upload-status").text("Image selected (will upload when saved)");

        // Update uploads state to indicate a new file was selected
        rpLib.eventsPage.state.uploads.mainImage = newFile;
      });
      rpLib.utils.setupSingleImgPreviewReplacement("event-flyer-preview", function (newFile) {
        $("#event-flyer-status").text("Image selected (will upload when saved)");
        rpLib.eventsPage.state.uploads.flyerImage = newFile;
      });

      // When an .add-img-btn is clicked, create a new invisible temp file input and trigger the click event
      $(".add-img-btn").on("click", function () {
        // Get id from class name .gallery-1-add-img-btn, .gallery-2-add-img-btn, .gallery-3-add-img-btn with regex (this is hacky :/)
        const galleryId = $(this)
          .attr("class")
          .match(/gallery-(\d+)-add-img-btn/)[1];
        const tempInputElId = `gallery-${galleryId}-upload`;
        const $tempInput = $(`<input type='file' id='${tempInputElId}' accept='image/*' multiple style='display:none;' />`);

        // Update the gallery file count check in resetEventsModalContent
        $tempInput.on("change", function (e) {
          const files = Array.from(e.target.files);
          if (files.length === 0) return;

          // Validate each file size
          const maxSize = 4 * 1024 * 1024; // 4MB per file
          const invalidFiles = [];
          const validFiles = [];
          files.forEach(file => {
            if (file.size > maxSize) {
              const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
              invalidFiles.push(`${file.name} (${sizeMB}MB)`);
            } else {
              validFiles.push(file);
            }
          });
          
          // Show error for invalid files
          if (invalidFiles.length > 0) {
            alert(`The following files are too large (max 4MB each):\n${invalidFiles.join('\n')}\n\nOnly valid files will be added.`);
          }
          
          // If no valid files, exit
          if (validFiles.length === 0) {
            $(this).val(""); // Reset the input
            return;
          }
          
          // Get current images count using containers instead of img elements
          const currentCount = $(`#gallery-${galleryId}-preview .gallery-img-container`).length;
          
          // Check if adding these files would exceed the limit
          if (currentCount + validFiles.length > 25) {
            const remaining = 25 - currentCount;
            alert(`You can only add ${remaining} more image${remaining !== 1 ? "s" : ""}. Please select fewer images.`);
            $(this).val(""); // Reset the input
            return;
          }
          
          // Add valid files to the array
          rpLib.eventsPage.state.uploads[`gallery${galleryId}`] = [
            ...rpLib.eventsPage.state.uploads[`gallery${galleryId}`], 
            ...validFiles
          ];
          
          // Show preview for each valid file
          validFiles.forEach((file, index) => {
            rpLib.utils.addImageToGallery(`gallery-${galleryId}`, file, index);
          });
          
          // Remove temp input after use
          $tempInput.remove();
        });

        $("body").append($tempInput);
        $tempInput.trigger("click");
      });

      // Setup the image replacement for all galleries
      rpLib.utils.setupGalleryImageReplacement("gallery-1-preview");
      rpLib.utils.setupGalleryImageReplacement("gallery-2-preview");
      rpLib.utils.setupGalleryImageReplacement("gallery-3-preview");

      // Save event with image uploads
      $("body #save-event").on("click", function () {
        const eventId = $(".collection-item-modal").attr("data-event-id");
        const isCreatingNewEvent = !eventId; // Check if we're creating a new event

        // IMPORTANT: Clean up gallery state before saving
        rpLib.eventsPage.cleanGalleryStateBeforeSave();

        // Show saving status
        $("#save-event").text("Uploading images...");
        $("#save-event").prop("disabled", true);
        $("#full-page-loading-overlay").show();

        let uploadPromises = [];

        // Upload main image if selected
        if (rpLib.eventsPage.state.uploads.mainImage) {
          $("#main-image-upload-status").text("Uploading...");
          let mainImagePromise = new Promise((resolve) => {
            rpLib.api.uploadImage(
              rpLib.eventsPage.state.uploads.mainImage,
              function (result) {
                $("#main-image-upload-status").text("Upload complete!");
                $("#main-image-preview").attr("src", result.url);
                resolve(result);
              },
              function (error) {
                $("#main-image-upload-status").text("Upload failed: " + error.statusText);
                resolve(); // Resolve even if upload fails
              }
            );
          });
          uploadPromises.push(mainImagePromise);
        }

        // Upload flyer image if selected
        if (rpLib.eventsPage.state.uploads.flyerImage) {
          $("#event-flyer-status").text("Uploading...");
          let flyerImagePromise = new Promise((resolve) => {
            rpLib.api.uploadImage(
              rpLib.eventsPage.state.uploads.flyerImage,
              function (result) {
                $("#event-flyer-status").text("Upload complete!");
                $("#event-flyer-preview").attr("src", result.url);
                resolve(result);
              },
              function (error) {
                $("#event-flyer-status").text("Upload failed: " + error.statusText);
                resolve(); // Resolve even if upload fails
              }
            );
          });
          uploadPromises.push(flyerImagePromise);
        }

        // Handle each gallery upload
        let gallery1Promise = rpLib.utils.handleGalleryUpload("gallery-1", rpLib.eventsPage.state.uploads.gallery1);
        let gallery2Promise = rpLib.utils.handleGalleryUpload("gallery-2", rpLib.eventsPage.state.uploads.gallery2);
        let gallery3Promise = rpLib.utils.handleGalleryUpload("gallery-3", rpLib.eventsPage.state.uploads.gallery3);

        uploadPromises.push(gallery1Promise, gallery2Promise, gallery3Promise);

        // Wait for all uploads to finish before saving
        Promise.all(uploadPromises).then((results) => {
          // Store the uploaded gallery data
          if (results.length >= 4) {
            // Store the uploaded images in the state
            rpLib.eventsPage.state.existingGallery1 = results[1]; // Offset by 1 due to main image
            rpLib.eventsPage.state.existingGallery2 = results[2];
            rpLib.eventsPage.state.existingGallery3 = results[3];
          } else if (results.length >= 3) {
            // Store the uploaded images in the state
            rpLib.eventsPage.state.existingGallery1 = results[0];
            rpLib.eventsPage.state.existingGallery2 = results[1];
            rpLib.eventsPage.state.existingGallery3 = results[2];
          }

          // Once all uploads are complete, call the appropriate function
          if (isCreatingNewEvent) {
            rpLib.api.createEventAndRefreshList($("#city-select").val(), function () {
              // Reset saving status
              $("#save-event").text("Save");
              $("#save-event").prop("disabled", false);
              $("#full-page-loading-overlay").hide();
            });
          } else {
            rpLib.api.updateEventAndRefreshList(eventId, function () {
              // Reset saving status
              $("#save-event").text("Save");
              $("#save-event").prop("disabled", false);
              $("#full-page-loading-overlay").hide();
            });
          }
        });
      });

      $("#close-modal").on("click", function () {
        // Ask for confirmation before closing the modal
        if (confirm("Are you sure you want to close the modal? Any unsaved changes will be lost.")) {
          $(".collection-item-modal").addClass("hidden");
        }
      });
    },
    addExistingImageToGallery: function (galleryId, imageData) {
      if (imageData && imageData.url) {
        const index = $(`#${galleryId}-preview .gallery-img`).length;

        // Create container with image and delete button
        const container = $("<div>")
          .addClass("gallery-img-container")
          .attr("data-index", index)
          .attr("data-image-id", imageData.id)
          .attr("data-existing", true);

        const img = $("<img>").addClass("thumbnail").addClass("gallery-img").attr("src", imageData.url).attr("title", "Click to replace this image");

        const deleteBtn = $("<div>").addClass("delete-image-gallery-btn").attr("title", "Delete this image");

        container.append(img).append(deleteBtn);
        $(`#${galleryId}-preview .add-img-btn`).before(container);

        // Update limits display
        rpLib.utils.updateGalleryLimits(galleryId, index + 1);
      }
    },
    removeImageFromGalleryState: function(galleryId, $container) {
      const galleryNum = galleryId.split("-")[1];
      const fileIndex = parseInt($container.attr("data-file-index"));
      const isExisting = $container.attr("data-existing");
      
      if (isExisting) {
        // Remove from existing gallery arrays
        const imageId = $container.attr("data-image-id");
        if (galleryNum === "1") {
          rpLib.eventsPage.state.existingGallery1 = rpLib.eventsPage.state.existingGallery1.filter(img => img.id !== imageId);
        } else if (galleryNum === "2") {
          rpLib.eventsPage.state.existingGallery2 = rpLib.eventsPage.state.existingGallery2.filter(img => img.id !== imageId);
        } else if (galleryNum === "3") {
          rpLib.eventsPage.state.existingGallery3 = rpLib.eventsPage.state.existingGallery3.filter(img => img.id !== imageId);
        }
      } else if (!isNaN(fileIndex)) {
        // Remove from new uploads array
        const uploads = rpLib.eventsPage.state.uploads[`gallery${galleryNum}`];
        if (uploads && uploads[fileIndex]) {
          uploads.splice(fileIndex, 1);
        }
        
        // Update file indices for remaining containers - THIS IS CRUCIAL
        $(`#gallery-${galleryNum}-preview .gallery-img-container`).each(function(index) {
          const $this = $(this);
          const currentFileIndex = parseInt($this.attr("data-file-index"));
          
          if (!$this.attr("data-existing") && !isNaN(currentFileIndex)) {
            if (currentFileIndex > fileIndex) {
              // Decrease the file index for items that came after the deleted one
              $this.attr("data-file-index", currentFileIndex - 1);
            }
          }
        });
      }
      
      // Also clean up any replacement data stored in jQuery data
      const containerIndex = $container.attr("data-index");
      const $preview = $(`#gallery-${galleryNum}-preview`);
      $preview.removeData(`replaced-${containerIndex}`);
    },
    cleanGalleryStateBeforeSave: function() {
      // This function ensures the upload arrays only contain files that are actually in the DOM
      ['1', '2', '3'].forEach(galleryNum => {
        const $containers = $(`#gallery-${galleryNum}-preview .gallery-img-container`);
        const newUploads = [];
        
        $containers.each(function() {
          const $container = $(this);
          const fileIndex = parseInt($container.attr("data-file-index"));
          const isExisting = $container.attr("data-existing");
          
          if (!isExisting && !isNaN(fileIndex)) {
            const originalFile = rpLib.eventsPage.state.uploads[`gallery${galleryNum}`][fileIndex];
            if (originalFile) {
              // Update the container's file index to match its new position in the array
              $container.attr("data-file-index", newUploads.length);
              newUploads.push(originalFile);
            }
          }
        });
        
        // Replace the upload array with the cleaned version
        rpLib.eventsPage.state.uploads[`gallery${galleryNum}`] = newUploads;
      });
    },
    renderEvent: function (event) {
      const templateRowItem = $(".collection-item-row-template").clone();
      templateRowItem.removeClass("collection-item-row-template");
      templateRowItem.attr("data-slug", event.fieldData.slug);
      templateRowItem.attr("data-event-id", event.id);

      if (event.fieldData["main-image"]?.url) {
        templateRowItem
          .find(".event-pic")
          .attr("src", event.fieldData["main-image"]?.url || "")
          .removeAttr("srcset");
      }
      templateRowItem.find(".event-name").text(event.fieldData.name || "");
      if (event.fieldData.date) {
        templateRowItem.find(".event-date").text(rpLib.utils.formatWfDate(event.fieldData.date));
      } else {
        templateRowItem.find(".event-date").text("");
      }
      templateRowItem.find(".event-location").text(event.fieldData["location-name"] || "");
      templateRowItem.find(".item-view-btn").attr("href", `https://www.realproducersmagazine.com/event/${event.fieldData.slug}` || "");

      const $showOrHideCheckbox = templateRowItem.find(".show-hide-switch .switch input");
      if (event.fieldData["show-event"] === true) {
        $showOrHideCheckbox.prop("checked", true);
      } else {
        $showOrHideCheckbox.prop("checked", false);
      }

      $("#collection-list").append(templateRowItem);
    },
  },
  partnersSearchPage: {
    state: {
      allPartners: [],
      partnerCategories: [],
      mixer: null,
      searchDebounceTimer: null,
      currentCity: null,
      currentCityBrandId: null,
      isLoading: false,
      loadedPartnerSlugs: new Set() // Track which partners are already in DOM
    },

    init: function() {
      const path = window.location.pathname;
      const partnersPageMatch = path.match(/^\/partners\/([^\/]+)$/);
      
      if (!partnersPageMatch) return;
      
      const citySlug = partnersPageMatch[1];
      this.state.currentCity = citySlug;
      
      // Initialize search bar immediately
      this.initializeSearch();
      
      // Wait for MixItUp first, then start loading data
      this.waitForMixItUp(() => {
        // Add attributes to existing elements FIRST - before any searching can happen
        this.addMissingAttributesToExistingElements();
        
        // Load categories first (needed for partner processing)
        this.loadPartnerCategories().then(() => {
          // Start loading partners - they'll be inserted as batches come in
          this.loadPartnersData(citySlug);
        });
      });
    },

    // Add this new function
    loadPartnerCategories: function() {
      return new Promise((resolve) => {
        rpLib.api.fetchAllPartnerCategories((categories) => {
          this.state.partnerCategories = categories;
          console.log(`Loaded ${categories.length} partner categories`);
          resolve();
        });
      });
    },

    waitForMixItUp: function(callback) {
      let intervalCleared = false; // Flag to prevent multiple executions
      
      const checkMixer = setInterval(() => {
        if (intervalCleared) return; // Extra safety check
        
        if (typeof mixitup !== 'undefined' && mixitup.instances) {
          const instanceKeys = Object.keys(mixitup.instances);
          
          if (instanceKeys.length > 0) {
            const instanceKey = instanceKeys[0];
            const mixerInstance = mixitup.instances[instanceKey];
            
            // Clear interval and set flag FIRST
            clearInterval(checkMixer);
            intervalCleared = true;
            
            this.state.mixer = mixerInstance;
            
            console.log('Found existing MixItUp instance:', instanceKey);
            console.log('Mixer targets:', mixerInstance.targets.length);
            
            // Execute callback only once
            callback();
            return;
          }
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        if (!intervalCleared) {
          clearInterval(checkMixer);
          intervalCleared = true;
          console.warn('MixItUp instance not found after 5 seconds');
          callback(); // Continue anyway
        }
      }, 5000);
    },

    // Check if partner ID already exists in mixer targets
    isPartnerInMixer: function(partner) {
      if (!this.state.mixer || !this.state.mixer.targets) {
        return false;
      }
      
      const partnerName = partner.fieldData.name?.trim() || '';
      const partnerCompany = partner.fieldData.company?.trim() || '';
      
      return this.state.mixer.targets.some(target => {
        const element = target.dom.el;
        
        // Get the name from the existing DOM element
        const existingNameEl = element.querySelector('.heading-partner-name');
        if (!existingNameEl) return false;
        
        const existingName = existingNameEl.textContent.trim();
        
        // Check if name matches
        if (existingName !== partnerName) return false;
        
        // Get all .text-partner-title elements
        const existingCompanyEls = element.querySelectorAll('.text-partner-title');
        
        // Check if at least one contains the partner's company
        const hasMatchingCompany = Array.from(existingCompanyEls).some(el => 
          el.textContent.trim() === partnerCompany
        );
        
        return hasMatchingCompany;
      });
    },

    addMissingAttributesToExistingElements: function() {
      if (!this.state.mixer) return;
      
      this.state.mixer.targets.forEach(target => {
        const element = target.dom.el;
        
        // Skip if already has the attribute
        if (element.getAttribute('data-partner-slug')) return;
        
        // Try to extract slug from href
        const linkEl = element.querySelector('a[href*="/partner/"]');
        if (linkEl) {
          const href = linkEl.getAttribute('href');
          const match = href.match(/\/partner\/(.+)$/);
          if (match) {
            element.setAttribute('data-partner-slug', match[1]);
          }
        }
        
        // Also add searchable classes to existing elements
        this.addSearchableClassesToExistingElement(element);
      });
    },

    addSearchableClassesToExistingElement: function(element) {
      // Helper function to add searchable classes for both words and phrases
      const addSearchableText = (text) => {
        if (!text) return;

        const cleanText = text.toLowerCase();

        // Add full phrase (with spaces removed)
        const fullPhrase = cleanText.replace(/[^a-z0-9]/g, '');
        if (fullPhrase.length > 1) {
          element.classList.add(`search-${fullPhrase}`);
        }

        // Add individual words
        const words = cleanText.split(' ');
        words.forEach(word => {
          const cleanWord = word.replace(/[^a-z0-9]/g, '');
          if (cleanWord.length > 1) {
            element.classList.add(`search-${cleanWord}`);
          }
        });
      };

      // --- Apply to different elements ---

      // Apply to name
      const nameEl = element.querySelector('.heading-partner-name');
      if (nameEl) {
        addSearchableText(nameEl.textContent);
      }

      // Apply to company
      const companyEls = element.querySelectorAll('.text-partner-title');
      companyEls.forEach(companyEl => {
        addSearchableText(companyEl.textContent);
      });

      // Apply to categories
      const categoryEls = element.querySelectorAll('.category-link, .filter-category');
      categoryEls.forEach(catEl => {
        addSearchableText(catEl.textContent);
      });
    },

    addMissingPartnersToDOM: function() {
      // This function is now mostly for cleanup since batches are processed in real-time
      // Just ensure we didn't miss anything
      const container = document.querySelector('.collection-list-partners');
      if (!container) {
        console.error('Container .collection-list-partners not found');
        return;
      }
      
      const missingPartners = this.state.allPartners.filter(partner => 
        !this.isPartnerInMixer(partner)
      );
      
      if (missingPartners.length > 0) {
        console.log(`Found ${missingPartners.length} partners missed during batch processing`);
        this.processBatchOfPartners(missingPartners);
      }
      
      this.addMissingAttributesToExistingElements();
    },

    applyCurrentSearch: function() {
      const searchInput = document.getElementById('partners-search-input');
      if (!searchInput) return;
      
      const currentTerm = searchInput.value.trim();
      if (!currentTerm) return;
      
      // Apply search without debouncing since this is called after element insertion
      this.performSearchImmediate(currentTerm);
    },

    performSearchImmediate: function(searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      
      if (!term) {
        if (this.state.mixer) {
          this.state.mixer.filter('all');
        }
        return;
      }
      
      if (!this.state.mixer) return;
      
      // Handle both phrases and individual words
      const cleanTerm = term.replace(/[^a-z0-9]/g, ''); // Remove spaces/special chars
      
      // Try to match the full phrase first, then fall back to individual words
      let selector = `[class*="search-${cleanTerm}"]`;
      
      this.state.mixer.filter(selector);
    },

    elementMatchesSearch: function(element, term) {
      const nameEl = element.querySelector('.heading-partner-name');
      const companyEls = element.querySelectorAll('.text-partner-title');
      const categoryEls = element.querySelectorAll('.category-link, .filter-category');
      const previewEl = element.querySelector('.preview-text-partner-card');
      
      if (!nameEl) return false;
      
      const name = nameEl.textContent.toLowerCase();
      
      // Check company fields
      const companies = Array.from(companyEls).map(el => el.textContent.toLowerCase());
      const companyMatch = companies.some(company => company.includes(term));
      
      // Check categories
      const categories = Array.from(categoryEls).map(el => el.textContent.toLowerCase());
      const categoryMatch = categories.some(category => category.includes(term));
      
      // Check preview text
      const previewText = previewEl ? previewEl.textContent.toLowerCase() : '';
      
      return name.includes(term) || 
            companyMatch || 
            categoryMatch ||
            previewText.includes(term);
    },

    initializeSearch: function() {
      $('#partners-search-container').show(); // Use this webflow designed element
      
      // Bind search events
      const searchInput = document.getElementById('partners-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.handleSearch(e.target.value);
        });
        
        // Also listen for search clear
        searchInput.addEventListener('search', (e) => {
          if (e.target.value === '') {
            this.clearSearch();
          }
        });
      }
      
      // Bind clear button
      const clearBtn = document.getElementById('clear-search');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.clearSearch();
        });
      }
    },

    loadPartnersData: async function(citySlug) {
      // Show loading state
      this.showLoadingState(true);
      
      try {
        // First, get the brand ID from the city slug
        const brandId = await this.getBrandIdFromSlug(citySlug);
        
        if (!brandId) {
          console.error('Could not find brand ID for city:', citySlug);
          this.showLoadingState(false);
          return;
        }
        
        this.state.currentCityBrandId = brandId;
        
        // Fetch all partners for this brand
        await this.fetchAllPartners(brandId);
        
        console.log(`Loaded ${this.state.allPartners.length} partners for ${citySlug}`);
        
      } catch (error) {
        console.error('Error loading partners data:', error);
      } finally {
        this.showLoadingState(false);
      }
    },

    getBrandIdFromSlug: async function(citySlug) {
      return new Promise((resolve) => {
        $.ajax({
          url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${BRANDS_COLLECTION_ID}/items/live?slug=${citySlug}`,
          method: 'GET',
          success: function(response) {
            if (response.items && response.items.length > 0) {
              resolve(response.items[0].id);
            } else {
              resolve(null);
            }
          },
          error: function(error) {
            console.error('Error fetching brand ID:', error);
            resolve(null);
          }
        });
      });
    },

    fetchAllPartners: function(brandId) {
      return new Promise((resolve) => {
        const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNERS_COLLECTION_ID}/items/live?sortBy=name&sortOrder=desc`;
        
        this.state.allPartners = [];
        
        rpLib.api.fetchAllPaginated(
          url,
          (items) => {
            // Filter partners for this brand
            const brandPartners = items.filter(partner => 
              !partner.isArchived && 
              partner.fieldData.city && 
              partner.fieldData.city.includes(brandId) &&
              partner.fieldData['show-partner'] === true
            );
            
            // Add to our complete list
            this.state.allPartners.push(...brandPartners);
            
            // Process this batch immediately
            this.processBatchOfPartners(brandPartners);
          },
          0,
          () => {
            console.log(`Finished loading all ${this.state.allPartners.length} partners`);
            resolve();
          }
        );
      });
    },

    processBatchOfPartners: function(partnerBatch) {
      if (!this.state.mixer || partnerBatch.length === 0) {
        return;
      }
      
      // Filter out partners that already exist in mixer
      const newPartners = partnerBatch.filter(partner => 
        !this.isPartnerInMixer(partner)
      );
      
      if (newPartners.length === 0) {
        console.log('No new partners in this batch');
        return;
      }
      
      console.log(`Processing batch: ${newPartners.length} new partners`);
      
      // Get the last element currently in the mixer to use as reference
      const currentState = this.state.mixer.getState();
      const lastElement = currentState.show[currentState.show.length - 1];
      
      // Create elements for new partners
      const elementsToInsert = [];
      
      newPartners.forEach(partner => {
        const cardElement = this.createPartnerCardElement(partner);
        this.processPartnerElement(cardElement, partner);
        this.state.loadedPartnerSlugs.add(partner.fieldData.slug);
        elementsToInsert.push(cardElement);
      });
      
      // Insert elements one by one after the last element
      let insertPromise = Promise.resolve();
      let referenceElement = lastElement;
      
      elementsToInsert.forEach(element => {
        insertPromise = insertPromise.then(() => {
          return this.state.mixer.insertAfter(element, referenceElement);
        }).then(() => {
          // Update reference element for next insertion
          referenceElement = element;
        });
      });
      
      insertPromise.then(() => {
        console.log(`Inserted ${elementsToInsert.length} partners from batch at end`);
      }).catch((error) => {
        console.warn('MixItUp insertAfter failed:', error);
      });
    },

    handleSearch: function(searchTerm) {
      // Clear previous timer
      if (this.state.searchDebounceTimer) {
        clearTimeout(this.state.searchDebounceTimer);
      }
      
      // Show/hide clear button
      const clearBtn = document.getElementById('clear-search');
      if (clearBtn) {
        clearBtn.classList.toggle('hidden', !searchTerm);
      }
      
      // Debounce the search
      this.state.searchDebounceTimer = setTimeout(() => {
        this.performSearch(searchTerm);
      }, 300);
    },

    performSearch: function(searchTerm) {
      this.performSearchImmediate(searchTerm);
      console.log(`Searching for: "${searchTerm}"`);

      window.scrollTo(0, 0); 
    },

    createPartnerCardElement: function(partner) {
      const data = partner.fieldData;
      const backgroundImage = 'https://cdn.prod.website-files.com/658f30a87b1a52ef8ad0b746/6747e52f75e4d2272610c598_659c8f9d187e6da25be61ca6_bg-stripes-wide-real-producers.jpeg';

      const defaultProfilePicClass = 'image-partner-pic';
      const logoReplacementProfilePicClass = 'image-placeholder-logo';
      let profilePicClass = defaultProfilePicClass;
      let profilePic = data['profile-pic']?.url || '';
      let logo = data.logo?.url || '';
      if (!profilePic) {
        profilePic = data.logo?.url || '';
        logo = '';
        profilePicClass = logoReplacementProfilePicClass;
      }
      
      // Format date
      const date = new Date(partner.lastPublished);
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      // Build partner categories HTML
      const categoriesHTML = this.buildPartnerCategoriesHTML(data['partner-categories']);
      
      // Create the element
      const div = document.createElement('div');
      div.setAttribute('role', 'listitem');
      div.className = 'mix w-dyn-item partner-dynamic';
      div.setAttribute('data-date', formattedDate);
      div.setAttribute('data-partner-slug', data.slug);
      div.setAttribute('data-partner-id', partner.id);
      
      div.innerHTML = `
        <div class="collection-list-wrapper-partner-categories w-dyn-list">
            ${categoriesHTML}
          </div>
        </div>
        <a style="background-image:url('${backgroundImage}')" 
          href="/partner/${data.slug}" 
          target="_blank" 
          class="grid-partner-wrapper w-inline-block">
          <img alt="${data.name}" loading="lazy" src="${profilePic}" class="${profilePicClass}">
          <div class="w-layout-grid grid-partner-info">
            <div class="w-layout-grid grid-partner-name-logo">
              ${logo ? `<div style="background-image:url('${logo}')" class="link-partner-logo"></div>` : ''}
              <h3 class="heading-partner-name">${data.name || ''}</h3>
              <div class="text-partner-title">${data.company || ''}</div>
              <div class="text-partner-title">${data['company-type'] || ''}</div>
            </div>
            <div class="preview-text-partner-card">${data['preview-text'] || ''}</div>
            <div class="button-partner-contact">Connect With Me</div>
          </div>
          <div class="w-layout-grid grid-partner-category-date">
            <div class="div-partner-category-date">
              <div class="date sort-category">${formattedDate}</div>
            </div>
          </div>
        </a>
      `;
      
      return div;
    },

    buildPartnerCategoriesHTML: function(partnerCategoryIds) {
      if (!partnerCategoryIds || !Array.isArray(partnerCategoryIds) || partnerCategoryIds.length === 0) {
        return '<div role="list" class="collection-list-partner-categories w-dyn-items"></div>';
      }
      
      if (!this.state.partnerCategories || this.state.partnerCategories.length === 0) {
        return '<div role="list" class="collection-list-partner-categories w-dyn-items"></div>';
      }
      
      // Find matching categories
      const matchingCategories = partnerCategoryIds
        .map(categoryId => {
          return this.state.partnerCategories.find(cat => cat.id === categoryId);
        })
        .filter(category => category); // Remove any undefined results
      
      // Generate individual category items
      const categoryItems = matchingCategories
        .map(category => {
          const categoryClass = this.cleanStringForClass(category.fieldData.name);
          return `<div role="listitem" class="collection-item-partner-profile-category w-dyn-item">
            <div class="category-link filter-category ${categoryClass}">${category.fieldData.name}</div>
          </div>`;
        })
        .join('');
      
      // Return single w-dyn-items container with all categories inside
      return `<div role="list" class="collection-list-partner-categories w-dyn-items">
        ${categoryItems}
      </div>`;
    },

    processPartnerElement: function(element, partner) {
      const data = partner.fieldData;
      
      // Helper function to add searchable classes for both words and phrases
      const addSearchableText = (text) => {
        if (!text) return;
        
        const cleanText = text.toLowerCase();
        
        // Add full phrase (with spaces removed)
        const fullPhrase = cleanText.replace(/[^a-z0-9]/g, '');
        if (fullPhrase.length > 1) {
          element.classList.add(`search-${fullPhrase}`);
        }
        
        // Add individual words
        const words = cleanText.split(' ');
        words.forEach(word => {
          const cleanWord = word.replace(/[^a-z0-9]/g, '');
          if (cleanWord.length > 1) {
            element.classList.add(`search-${cleanWord}`);
          }
        });
      };
      
      // Apply to name
      addSearchableText(data.name);
      
      // Apply to company
      addSearchableText(data.company);
      
      // Apply to company type
      addSearchableText(data['company-type']);
      
      // Apply to categories
      if (data['partner-categories'] && Array.isArray(data['partner-categories'])) {
        data['partner-categories'].forEach(categoryId => {
          const category = this.state.partnerCategories.find(cat => cat.id === categoryId);
          if (category) {
            addSearchableText(category.fieldData.name);
          }
        });
      }
    },

    cleanStringForClass: function(str) {
      if (!str) return '';
      return str.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')
                .replace(/ /g, "-")
                .toLowerCase()
                .trim();
    },

    clearSearch: function() {
      const searchInput = document.getElementById('partners-search-input');
      if (searchInput) {
        searchInput.value = '';
      }
      
      // Reset filter to show all elements
      if (this.state.mixer) {
        this.state.mixer.filter('all');
      }
      
      // Hide clear button
      const clearBtn = document.getElementById('clear-search');
      if (clearBtn) {
        clearBtn.classList.add('hidden');
      }
    },

    showLoadingState: function(isLoading) {
      this.state.isLoading = isLoading;
      const loadingEl = document.getElementById('search-loading');
      if (isLoading) {
        $(loadingEl).show();
      } else {
        $(loadingEl).hide();
      }
    },

    // Debug function to see what's in the mixer
    debugMixerPartners: function() {
      if (!this.state.mixer) {
        console.log('No mixer available');
        return;
      }
      
      console.log(`Mixer contains ${this.state.mixer.targets.length} partners:`);
      
      const partnerIds = this.state.mixer.targets.map(target => {
        const element = target.dom.el;
        return element.getAttribute('data-partner-id');
      }).filter(id => id); // Remove nulls
      
      console.log('Partner IDs in mixer:', partnerIds);
      return partnerIds;
    },
  },

  utils: {
    injectDependencies: function () {
      // SparkMD5
      const scriptTagForSparkMD5 = '<script src="https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js"></script>';
      $("head").append(scriptTagForSparkMD5);

      // @nobleclem/jquery-multiselect
      const scriptTagForMultiselect =
        '<script src="https://cdn.jsdelivr.net/npm/@nobleclem/jquery-multiselect@2.4.24/jquery.multiselect.min.js"></script>';
      const cssLinkForMultiselect =
        '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nobleclem/jquery-multiselect@2.4.24/jquery.multiselect.min.css">';
      $("head").append(scriptTagForMultiselect);
      $("head").append(cssLinkForMultiselect);

      // Quill rich text editor
      const quillCssLink = '<link href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css" rel="stylesheet">';
      const quillJsScript = '<script src="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.js"></script>';
      $("head").append(quillCssLink);
      $("head").append(quillJsScript);

      // MixItUp 3 (only load on partners pages)
      if (window.location.pathname.startsWith("/partners/")) {
        const mixitupScript = '<script src="https://cdnjs.cloudflare.com/ajax/libs/mixitup/3.3.1/mixitup.min.js"></script>';
        $("head").append(mixitupScript);
      }
    },
    injectCSS: function () {
      $("head").append(`
            <style>
              .collection-item-row-template {
                  display: none;
              }

              .collection-item-modal-content .grid-modal-form {
                  display: inherit !important;
              }

              .collection-item-modal-content .w-form-done {
                  display: none !important;
              }

              body .ms-options-wrap > button, body .ms-options-wrap>button:focus {
                  color: black !important;
                  font-size: 16px;
                  font-family: "Museosans 300", sans-serif;
                  border-radius: 10px;
                  padding: 8px 12px;
                  border: 1px solid #ccc;
              }

              ${additionalCSS}
            </style>
        `);
    },
    updateImageGallery: function (eventData, field, container) {
      let images = eventData?.fieldData?.[field] || [];
      let previewContainer = $(container);
      previewContainer.empty(); // Clear previous previews

      images.forEach((image) => {
        let imgElement = `<div class="image-preview">
              <img src="${image.url}" class="gallery-img" />
          </div>`;
        previewContainer.append(imgElement);
      });
    },
    addImageToGallery: function (galleryId, file, fileIndex) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const index = $(`#${galleryId}-preview .gallery-img`).length;

        // Create container with image and delete button
        const container = $("<div>").addClass("gallery-img-container").attr("data-index", index).attr("data-file-index", fileIndex);

        const img = $("<img>")
          .addClass("thumbnail")
          .addClass("gallery-img")
          .attr("src", e.target.result)
          .attr("title", "Click to replace this image");

        const deleteBtn = $("<div>").addClass("delete-image-gallery-btn").attr("title", "Delete this image");

        container.append(img).append(deleteBtn);
        $(`#${galleryId}-preview .add-img-btn`).before(container);

        // Update limits display
        rpLib.utils.updateGalleryLimits(galleryId, index + 1);
      };
      reader.readAsDataURL(file);
    },
    handleGalleryUpload: function (galleryId, galleryFiles) {
      return new Promise((resolve) => {
        const $preview = $(`#${galleryId}-preview`);
        const $status = $(`#${galleryId}-upload-status`);
        const existingContainers = $preview.find(".gallery-img-container");

        // If there are no images to upload
        if (existingContainers.length === 0 && galleryFiles.length === 0) {
          resolve([]);
          return;
        }

        // Collect current state based on what's actually in the preview
        let finalResults = [];
        let filesToUpload = [];
        let uploadMap = {}; // Maps upload array index to final result index

        // Process each container in the preview area to maintain order
        existingContainers.each(function (finalIndex) {
          const $container = $(this);
          const $img = $container.find('.gallery-img');
          const isReplaced = $img.hasClass("replaced");
          const isExisting = $container.attr("data-existing");
          const fileIndex = parseInt($container.attr("data-file-index"));

          if (isReplaced) {
            // This image was replaced, get the replacement file
            const containerIndex = $container.attr("data-index");
            const replacementFile = $preview.data(`replaced-${containerIndex}`);
            if (replacementFile) {
              uploadMap[filesToUpload.length] = finalIndex;
              filesToUpload.push(replacementFile);
              finalResults[finalIndex] = null; // Placeholder for upload result
            }
          } else if (isExisting) {
            // This is an existing image that wasn't changed
            finalResults[finalIndex] = {
              id: $container.attr("data-image-id"),
              url: $img.attr("src")
            };
          } else if (!isNaN(fileIndex) && galleryFiles[fileIndex]) {
            // This is a new image that hasn't been uploaded yet
            uploadMap[filesToUpload.length] = finalIndex;
            filesToUpload.push(galleryFiles[fileIndex]);
            finalResults[finalIndex] = null; // Placeholder for upload result
          }
        });

        // If there are no files to upload, return existing data
        if (filesToUpload.length === 0) {
          const cleanResults = finalResults.filter(item => item !== null);
          $status.text("No new images to upload");
          resolve(cleanResults);
          return;
        }

        // Upload the files
        $status.text("Uploading...");
        rpLib.api.uploadMultipleImages(
          filesToUpload,
          function (progress, total) {
            $status.text(`Uploading ${progress}/${total}...`);
          },
          function (uploadResults) {
            // Place upload results in their correct positions
            uploadResults.forEach((result, uploadIndex) => {
              const finalIndex = uploadMap[uploadIndex];
              if (finalIndex !== undefined) {
                finalResults[finalIndex] = result;
              }
            });

            // Filter out any null values and return clean array
            const cleanResults = finalResults.filter(item => item !== null);
            $status.text("Upload complete!");
            resolve(cleanResults);
          },
          function (error) {
            $status.text("Upload failed: " + error.statusText);
            resolve([]); // Resolve with empty array on failure
          }
        );
      });
    },
    // Helper function to check gallery size and update UI
    updateGalleryLimits: function (galleryId, count) {
      const maxImages = 25;
      const $uploadBtn = $(`#${galleryId}-add-img-btn`);
      const $statusEl = $(`#${galleryId}-upload-status`);

      if (count >= maxImages) {
        $uploadBtn.addClass("hidden");
        $statusEl.text(`Maximum limit of ${maxImages} images reached`);
        $statusEl.css("color", "red");
      } else if (count === 0) {
        $uploadBtn.removeClass("hidden");
        $statusEl.text("Add Up To 25 Images");
        $statusEl.css("color", "rgb(37, 165, 222)");
      } else {
        $uploadBtn.removeClass("hidden");
        $statusEl.text(`${count} images (${maxImages - count} more allowed)`);
        $statusEl.css("color", "rgb(37, 165, 222)");
      }
    },
    initCitySelection: function (callback) {
      // Fetch all brands for city selection dropdown and populate the dropdown
      rpLib.api.fetchUserBrands(() => {
        const lastSelectedCity = sessionStorage.getItem("selectedCity");

        if ($("#city-select option").length === 1) {
          // If there are no cities, do nothing
        } else if ($("#city-select option").length === 2) {
          // If there is only one city, select it by default
          $("#city-select option:last").prop("selected", true).trigger("change");
        } else if (lastSelectedCity) {
          // Select the last selected city if available
          $("#city-select").val(lastSelectedCity).trigger("change");
        }

        // If no city is selected (ie. first default option is selected) then show the notification that no city is selected
        if ($("#city-select").val() === "") {
          $("#select-city-notification").removeClass("hidden");
        }
      });

      // Fetch all users after city selection
      $("#city-select").on("change", function () {
        $("#select-city-notification").addClass("hidden");
        let brandId = $(this).val();
        if (brandId) {
          // Store the selected city in sessionStorage
          sessionStorage.setItem("selectedCity", brandId);

          if (typeof callback === "function") {
            callback(brandId);
          }
        }
      });
    },
    setupSingleImgPreviewReplacement: function (imgPreviewId, afterImgSelectedCallback) {
      // Set up deletion first
      rpLib.utils.setupSingleImageDeletion(imgPreviewId, function(isDeleted) {
        // This callback will be triggered when delete happens
        if (afterImgSelectedCallback) {
          afterImgSelectedCallback('DELETED');
        }
      });

      $(`#${imgPreviewId}`).on("click", function (e) {
        // Create a temporary file input for replacing the image
        const $tempInput = $('<input type="file" accept="image/*" style="display:none">');
        $("body").append($tempInput);

        // Trigger click on the temporary input
        $tempInput.trigger("click");

        // Handle file selection
        $tempInput.on("change", function (e) {
          if (!e.target.files || !e.target.files[0]) {
            $tempInput.remove();
            return;
          }

          const newFile = e.target.files[0];

          // Validate file size
          const maxSize = 4 * 1024 * 1024; // 4MB in bytes
          if (newFile.size > maxSize) {
            const sizeMB = (newFile.size / (1024 * 1024)).toFixed(2);
            alert(`File too large: ${sizeMB}MB. Maximum allowed size is 4MB. Please select a smaller image.`);
            $tempInput.remove();
            return;
          }

          const reader = new FileReader();

          reader.onload = function (e) {
            // Update the preview
            $(`#${imgPreviewId}`).attr("src", e.target.result);

            // Remove srcset if it exists (it prevents src from showing)
            $(`#${imgPreviewId}`).removeAttr("srcset");
            
            // Remove deleted state if it was deleted
            $(`#${imgPreviewId}`).removeClass('single-image-deleted').removeAttr('data-deleted');
            
            // Re-setup deletion for the new image
            rpLib.utils.setupSingleImageDeletion(imgPreviewId, function(isDeleted) {
              if (afterImgSelectedCallback) {
                afterImgSelectedCallback('DELETED');
              }
            });
          };

          reader.readAsDataURL(newFile);
          $tempInput.remove();

          // Callback after selecting image
          if (afterImgSelectedCallback) afterImgSelectedCallback(newFile);
        });
      });
    },

    setupSingleImageDeletion: function(imageId, onDeleteCallback) {
      const $image = $(`#${imageId}`);
      
      if ($image.length === 0) return;
      
      // Wrap the image in a container if it's not already wrapped
      if (!$image.parent().hasClass('single-image-container')) {
        $image.wrap('<div class="single-image-container"></div>');
      }
      
      const $container = $image.parent('.single-image-container');
      
      // Remove any existing delete button
      $container.find('.single-image-delete-btn').remove();
      
      // Add delete button
      const $deleteBtn = $('<div class="single-image-delete-btn" title="Delete this image"></div>');
      $container.append($deleteBtn);
      
      // Handle delete click
      $deleteBtn.on('click', function(e) {
        e.stopPropagation();
        
        if (confirm('Are you sure you want to delete this image?')) {
          // Mark image as deleted
          $image.addClass('single-image-deleted');
          $image.attr('data-deleted', 'true');
          
          // Hide the delete button since image is now deleted
          $deleteBtn.hide();
          
          if (typeof onDeleteCallback === 'function') {
            onDeleteCallback(true); // true = deleted
          }
        }
      });
    },

    formatWfDate: function (utcDatetimeStr) {
      let date = new Date(utcDatetimeStr);

      // turn date to pst as this is what realproducers on webflow uses
      const options = { timeZone: "America/Los_Angeles" };
      date = new Date(date.toLocaleString("en-US", options));

      const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      const month = monthsShort[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
      const period = hours >= 12 ? "pm" : "am";
      const hourFormatted = hours % 12 === 0 ? 12 : hours % 12;

      return `${month}, ${day}${rpLib.utils.getOrdinalSuffix(day)} ${year} ${hourFormatted}:${minutesFormatted}${period}`;
    },
    getOrdinalSuffix: function (day) {
      if (day >= 11 && day <= 13) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },

    formatWfDateForInputEl: function (utcDatetimeStr) {
      return new Date(utcDatetimeStr).toISOString().slice(0, 16);
    },
    turnUtcDateToPstForInputEl: function (utcDatetimeStr) {
      // Create a date object from the UTC string
      const dateObj = new Date(utcDatetimeStr);

      // Format the date in PST timezone to get proper components
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Get formatted parts
      const parts = formatter.formatToParts(dateObj);

      // Extract values from parts
      const values = {};
      for (const part of parts) {
        if (part.type !== "literal") {
          values[part.type] = part.value;
        }
      }

      // Construct the datetime-local string (YYYY-MM-DDTHH:MM)
      return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
    },
    turnPstDateToUtcForInputEl: function (pstDatetimeStr) {
      // Create a date object in the local timezone
      const localDate = new Date(pstDatetimeStr);

      // Get the timezone offset for America/Los_Angeles at this specific date
      const pstOptions = { timeZone: "America/Los_Angeles", timeZoneName: "short" };
      const pstFormatter = new Intl.DateTimeFormat("en-US", pstOptions);

      // Format the date to get time zone name (PDT or PST)
      const formattedDate = pstFormatter.format(localDate);
      const isDST = formattedDate.includes("PDT");

      // Calculate UTC time by adding the appropriate offset (7 hours for PDT, 8 for PST)
      const offset = isDST ? 7 : 8;

      // Create a new date with the correct UTC time
      const year = localDate.getFullYear();
      const month = localDate.getMonth();
      const day = localDate.getDate();
      const hour = localDate.getHours();
      const minute = localDate.getMinutes();

      // Create a UTC date and add the offset
      const utcDate = new Date(Date.UTC(year, month, day, hour + offset, minute));

      // Return ISO format for datetime-local input
      return utcDate.toISOString();
    },
    localeDatetimeStrToUtcStr: function (localeDatetimeStr) {
      return new Date(localeDatetimeStr).toISOString();
    },
    setupGalleryImageReplacement: function (galleryPreviewId) {
      $(`#${galleryPreviewId}`).on("click", ".gallery-img", function () {
        // Store the container (parent of the clicked image)
        const $container = $(this).closest(".gallery-img-container");
        const clickedIndex = $container.attr("data-index");

        // Create a temporary file input for replacing this specific image
        const $tempInput = $('<input type="file" accept="image/*" style="display:none">');
        $("body").append($tempInput);

        // Trigger click on the temporary input
        $tempInput.trigger("click");

        // Handle file selection
        $tempInput.on("change", function (e) {
          if (!e.target.files || !e.target.files[0]) {
            $tempInput.remove();
            return;
          }

          const newFile = e.target.files[0];

          // Validate file size
          const maxSize = 4 * 1024 * 1024; // 4MB in bytes
          if (newFile.size > maxSize) {
            const sizeMB = (newFile.size / (1024 * 1024)).toFixed(2);
            alert(`File too large: ${sizeMB}MB. Maximum allowed size is 4MB. Please select a smaller image.`);
            $tempInput.remove();
            return;
          }

          const reader = new FileReader();

          reader.onload = function (e) {
            // Update the preview image within the container
            $container.find('.gallery-img').attr("src", e.target.result).addClass("replaced");

            // Add to a special mapping for replaced images
            $(`#${galleryPreviewId}`).data(`replaced-${clickedIndex}`, newFile);
          };

          reader.readAsDataURL(newFile);
          $tempInput.remove();
        });
      });

      // Add delete functionality with improved state management
      $(`#${galleryPreviewId}`).on("click", ".delete-image-gallery-btn", function (e) {
        e.stopPropagation(); // Prevent triggering image replacement
        
        const $container = $(this).closest(".gallery-img-container");
        const galleryId = galleryPreviewId.replace('-preview', '');
        
        if (confirm("Are you sure you want to delete this image?")) {
          // Remove from state BEFORE removing from DOM
          rpLib.eventsPage.removeImageFromGalleryState(galleryId, $container);
          
          // Remove the container from DOM
          $container.remove();
          
          // Reindex remaining containers sequentially
          $(`#${galleryPreviewId} .gallery-img-container`).each(function(newIndex) {
            $(this).attr("data-index", newIndex);
          });
          
          // Update limits display
          const newCount = $(`#${galleryPreviewId} .gallery-img-container`).length;
          rpLib.utils.updateGalleryLimits(galleryId, newCount);
        }
      });
    },
    initRichTextEditor: function (editorId, placeholderContent = "", existingContent = "") {
      // Reset editor elements
      $(`#${editorId}`).prev(".ql-toolbar").remove();
      $(`#${editorId}`).replaceWith(`<div id="${editorId}">${existingContent}</div>`);

      const quill = new Quill(`#${editorId}`, {
        modules: {
          toolbar: [["bold", "italic", "underline"]],
        },
        placeholder: placeholderContent,
        theme: "snow", // or 'bubble'
      });
    },
    cleanQuillInnerHTMLToWf: function (innerHTML) {
      // Remove the cursor span elements from Quill editor innerHTML
      let cleanedHTML = innerHTML.replace(/<span class="ql-cursor">.*?<\/span>/g, "");
      return cleanedHTML;
    },
    formatUrlWithProtocol: function (url) {
      if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
        return "http://" + url;
      }
      return url;
    },
    getUserSlug: function () {
      return $("[data-ms-member='wf-users-slug']").text();
    },
  },

  api: {
    fetchAllPaginated: function (url, processData, offset = 0, callback = null) {
      // Disable the dropdown when pagination starts (only for the first call)
      if (offset === 0) {
        $("#city-select").attr("disabled", true);
        // Add a <progress></progress> element to indicate loading. TODO: replace with a component made in webflow
        $("#city-select")
          .closest("#wf-form-city-select-form")
          .after('<progress style="background-attachment: revert !important; position: absolute; margin-top: -18px;"></progress>');
      }

      $.ajax({
        url: `${url}&offset=${offset}`,
        method: "GET",
        success: function (response) {
          const items = response.items || [];

          // Process data immediately
          processData(items);

          if (offset + response.pagination.limit < response.pagination.total) {
            rpLib.api.fetchAllPaginated(url, processData, offset + response.pagination.limit, callback);
          } else {
            // All pages fetched, re-enable dropdown
            $("#city-select").attr("disabled", false);
            // Remove the loading/progress element
            $("#city-select").closest("#wf-form-city-select-form").next("progress").remove();

            // Invoke the callback if provided
            if (typeof callback === "function") {
              callback();
            }
          }
        },
        error: function (error) {
          console.error("Error fetching paginated data:", error);

          // Re-enable dropdown in case of an error
          $("#city-select").attr("disabled", false);
          $("#city-select").closest("#wf-form-city-select-form").next("progress").remove();

          // Invoke the callback even on error
          if (typeof callback === "function") {
            callback();
          }
        },
      });
    },

    fetchUserBrands: function (callback) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/live?slug=${rpLib.utils.getUserSlug()}&sortBy=lastPublished&sortOrder=desc`;

      if (rpLib.utils.getUserSlug().trim() === "") {
        if (callback) callback();
        return;
      }

      rpLib.api.fetchAllPaginated(url, (items) => {
        if (items.length > 0) {
          let brands = items[0].fieldData["brand-s"];
          let fetchBrandPromises = brands.map((brandId) => rpLib.api.fetchBrandDetailsAndPopulateDropdown(brandId));

          Promise.all(fetchBrandPromises).then(() => {
            if (callback) callback();
          });
        } else {
          if (callback) callback();
        }
      });
    },
    fetchBrandDetailsAndPopulateDropdown: function (brandId) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${BRANDS_COLLECTION_ID}/items/${brandId}/live`,
          method: "GET",
          success: function (response) {
            $("#city-select").append(`<option value="${response.id}" data-slug="${response.fieldData.slug}">${response.fieldData.name}</option>`);
            resolve();
          },
          error: function (error) {
            console.error("Error fetching brand details:", error);
            reject(error);
          },
        });
      });
    },
    fetchBrandUsersAndRender: function (brandId) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/live?sortBy=lastPublished&sortOrder=desc`;

      // Clear existing user list
      $("#collection-list .collection-item").not(".collection-item-row-template").remove();

      // Fetch all users using the paginated fetch function
      rpLib.api.fetchAllPaginated(
        url,
        (items) => {
          items.forEach((user) => {
            // Check if the user has brands and if the specified brandId exists in the user's brand-s array
            if (
              user.isArchived === false &&
              user.fieldData["brand-s"] &&
              user.fieldData["brand-s"].length > 0 &&
              user.fieldData["brand-s"].includes(brandId)
            ) {
              rpLib.usersPage.renderUser(user);
            }

            $(".no-collection-items-noti").addClass("hidden");
          });
        },
        0,
        function () {
          if ($(".collection-item").not(".collection-item-row-template").length === 0) {
            $(".no-collection-items-noti").removeClass("hidden");
          }
        }
      );
    },
    fetchPartnersAndRender: function (brandId) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNERS_COLLECTION_ID}/items/live?sortBy=lastPublished&sortOrder=desc`;

      // Clear existing providers in list
      $("#collection-list .collection-item").not(".collection-item-row-template").remove();

      $("select option:first").attr("disabled", "disabled");

      rpLib.api.fetchAllPaginated(
        url,
        (items) => {
          const filteredItems = items.filter((item) => item.isArchived === false).filter((item) => item.fieldData.city.includes(brandId));

          filteredItems.forEach((partner) => {
            rpLib.partnersPage.renderPartner(partner);
            $(".no-collection-items-noti").addClass("hidden");
          });
        },
        0,
        function () {
          if ($(".collection-item").not(".collection-item-row-template").length === 0) {
            $(".no-collection-items-noti").removeClass("hidden");
          }
        }
      ); // this is an ugly function call, the 0 represents the offset which should be 0 here cause it's the start of the recursion
    },
    fetchPartnerDetailsAndOpenModal: function (slug) {
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNERS_COLLECTION_ID}/items/live?slug=${slug}&sortBy=lastPublished&sortOrder=desc`,
        method: "GET",
        success: function (response) {
          if (response.items.length > 0) {
            let partner = response.items[0];

            // Populate all form fields
            $("#partner-name").val(partner.fieldData.name);
            $("#partner-company").val(partner.fieldData.company);
            $("#partner-title").val(partner.fieldData["company-type"]);
            $("#partner-phone").val(partner.fieldData.phone);
            $("#partner-email").val(partner.fieldData.email);
            $("#partner-website").val(partner.fieldData.website);
            $("#partner-license").val(partner.fieldData["license-number"]);
            $("#partner-facebook").val(partner.fieldData["url-facebook"]);
            $("#partner-instagram").val(partner.fieldData["url-instagram"]);
            $("#partner-x").val(partner.fieldData["url-x"]);
            $("#partner-youtube").val(partner.fieldData["url-youtube"]);
            $("#partner-linkedin").val(partner.fieldData["url-linkedin"]);
            $("#partner-tiktok").val(partner.fieldData["url-tiktok"]);
            $("#partner-description").val(partner.fieldData["description"]);
            $("#partner-preview-text").val(partner.fieldData["preview-text"]);
            $("#partner-address").val(partner.fieldData["address"]);
            $("#partner-city").val(partner.fieldData["city-state-zip"]);
            $("#partner-show").prop("checked", partner.fieldData["show-partner"]);
            $("#youtube-video-id").val(partner.fieldData["youtube-video-id"] || "");
            if (partner.fieldData["profile-pic"]?.url) {
              $("#profile-pic-preview").attr("src", partner.fieldData["profile-pic"].url);
              $("#profile-pic-preview").removeAttr("srcset");
            }
            if (partner.fieldData["logo"]?.url) {
              $("#logo-preview").attr("src", partner.fieldData["logo"]?.url);
              $("#logo-preview").removeAttr("srcset");
            }
            if (partner.fieldData["advertisement"]?.url) {
              $("#ad-image-preview").attr("src", partner.fieldData["advertisement"]?.url);
              $("#ad-image-preview").removeAttr("srcset");
            }

            // Populate multi-reference fields (dropdown with multiple selections)
            if (partner.fieldData["partner-categories"] && Array.isArray(partner.fieldData["partner-categories"])) {
              $("#partner-categories").val(partner.fieldData["partner-categories"]);
            } else {
              $("#partner-categories").val([]);
            }
            $("#partner-categories").multiselect("reload");

            // Init rich text editor for partner description
            rpLib.utils.initRichTextEditor("partner-description", "Share partner bio or info here...", partner.fieldData["description"] || "");

            // Show the modal
            $(".collection-item-modal").removeClass("hidden");
          }
        },
        error: function (error) {
          console.error("Error fetching partner details:", error);
        },
      });
    },
    updatePartnerAndRefreshList: function (partnerId, newProfilePicFile, newLogoFile, newAdImageFile, callback) {
      let updatedData = {
        fieldData: {
          name: $("#partner-name").val(),
          company: $("#partner-company").val(),
          "company-type": $("#partner-title").val(),
          phone: $("#partner-phone").val(),
          email: $("#partner-email").val(),
          website: $("#partner-website").val(),
          "license-number": $("#partner-license").val(),
          "url-facebook": $("#partner-facebook").val(),
          "url-instagram": $("#partner-instagram").val(),
          "url-x": $("#partner-x").val(),
          "url-youtube": $("#partner-youtube").val(),
          "url-linkedin": $("#partner-linkedin").val(),
          "url-tiktok": $("#partner-tiktok").val(),
          "preview-text": $("#partner-preview-text").val(),
          address: $("#partner-address").val(),
          "city-state-zip": $("#partner-city").val(),
          "youtube-video-id": $("#youtube-video-id").val(),
          "partner-categories": $("#partner-categories").val(), // Multi-reference
        },
      };

      // Construct youtube video URL if that exists
      if (updatedData.fieldData["youtube-video-id"]) {
        updatedData.fieldData["video"] = `https://youtu.be/${updatedData.fieldData["youtube-video-id"]}`;
      } else {
        updatedData.fieldData["video"] = "";
      }

      // get description from quill editor
      updatedData.fieldData["description"] = rpLib.utils.cleanQuillInnerHTMLToWf(document.querySelector("#partner-description .ql-editor").innerHTML);

      // add preview-text with textContent of ql-editor
      updatedData.fieldData["preview-text"] = document.querySelector("#partner-description .ql-editor").textContent.trim();

      // Add profile picture if available
      if (newProfilePicFile) {
        const newImgUrl = $("#profile-pic-preview").attr("src");
        updatedData.fieldData["profile-pic"] = { url: newImgUrl };
      }

      // Add logo if available
      if (newLogoFile) {
        const newImgUrl = $("#logo-preview").attr("src");
        updatedData.fieldData["logo"] = { url: newImgUrl };
      }

      // Add advertisement image if available
      if (newAdImageFile) {
        const newAdImage = $("#ad-image-preview").attr("src");
        updatedData.fieldData["advertisement"] = { url: newAdImage };
      }

      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNERS_COLLECTION_ID}/items/${partnerId}/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        data: JSON.stringify(updatedData),
        success: function () {
          alert("Success! Partner profile updated. \n\n Click the eyeball icon to view your updates.");
          $(".collection-item-modal").addClass("hidden");
          rpLib.api.fetchPartnersAndRender($("#city-select").val()); // Refresh list
        },
        error: function (errorRes) {
          console.error("Error updating partner:", errorRes);

          // Handle Validation Error and list the fields that failed validation in the alert
          if (errorRes.responseJSON && errorRes.responseJSON?.code === "validation_error" && errorRes.responseJSON?.details.length > 0) {
            let failedFields = errorRes.responseJSON.details.map((detail) => `${detail.param}—${detail.description}`);
            alert("Error updating partner. Please try again. Failed fields: " + failedFields.join(", "));
          } else {
            alert("Error updating partner. Please try again. Error status:" + errorRes.status);
          }
        },
        complete: function () {
          if (typeof callback === "function") {
            callback();
          }
        },
      });
    },
    updatePartnerShowHide: function (partnerId, showPartner) {
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNERS_COLLECTION_ID}/items/${partnerId}/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        data: JSON.stringify({
          fieldData: {
            "show-partner": showPartner,
          },
        }),
        success: function () {
          alert("Success! Partner profile updated. \n\n Click the eyeball icon to view your updates.");
        },
        error: function (errorRes) {
          console.error("Error updating partner:", errorRes);

          // Handle Validation Error and list the fields that failed validation in the alert
          if (errorRes.responseJSON && errorRes.responseJSON?.code === "validation_error" && errorRes.responseJSON?.details.length > 0) {
            let failedFields = errorRes.responseJSON.details.map((detail) => `${detail.param}—${detail.description}`);
            alert("Error updating partner. Please try again. Failed fields: " + failedFields.join(", "));
          } else {
            alert("Error updating partner. Please try again. Error status:" + errorRes.status);
            rpLib.api.fetchPartnersAndRender($("#city-select").val()); // Refresh list
          }
        },
      });
    },
    updateEventShowHide: function (eventId, showEvent) {
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/${eventId}/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        data: JSON.stringify({
          fieldData: {
            "show-event": showEvent,
          },
        }),
        success: function () {
          alert("Success! Event profile updated. \n\n Click the eyeball icon to view your updates.");
        },
        error: function (errorRes) {
          console.error("Error updating event:", errorRes);
          // Handle Validation Error and list the fields that failed validation in the alert
          if (errorRes.responseJSON && errorRes.responseJSON?.code === "validation_error" && errorRes.responseJSON?.details.length > 0) {
            let failedFields = errorRes.responseJSON.details.map((detail) => `${detail.param}—${detail.description}`);
            alert("Error updating event. Please try again. Failed fields: " + failedFields.join(", "));
          } else {
            alert("Error updating event. Please try again. Error status:" + errorRes.status);
          }
        },
      });
    },
    fetchEventsAndRender: function (brandId) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/live?sortBy=lastPublished&sortOrder=desc`;

      // Clear existing events in list
      $("#collection-list .collection-item").not(".collection-item-row-template").remove();

      rpLib.api.fetchAllPaginated(
        url,
        (items) => {
          const filteredItems = items.filter((item) => item.isArchived === false).filter((item) => item.fieldData.brand === brandId);

          filteredItems.forEach((event) => {
            rpLib.eventsPage.renderEvent(event);
            $(".no-collection-items-noti").addClass("hidden");
          });
        },
        0,
        function () {
          if ($(".collection-item").not(".collection-item-row-template").length === 0) {
            $(".no-collection-items-noti").removeClass("hidden");
          }
        }
      );
    },
    fetchEventDetailsAndOpenModal: function (slug) {
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/live?slug=${slug}`,
        method: "GET",
        success: function (response) {
          if (response.items.length > 0) {
            let event = response.items[0];

            // Populate form fields with event data
            $("#event-name").val(event.fieldData.name || "");
            if (event.fieldData.date) {
              const localDatetime = rpLib.utils.turnUtcDateToPstForInputEl(event.fieldData.date);
              $("#event-date").val(localDatetime);
            } else {
              $("#event-date").val("");
            }
            $("#event-location-name").val(event.fieldData["location-name"] || "");
            $("#event-location-address").val(event.fieldData["location-address"] || "");
            $("#button-url").val(event.fieldData["button-url"] || "");
            $("#button-text").val(event.fieldData["button-text"] || "");
            $("#youtube-video-id").val(event.fieldData["youtube-video-id"] || "");
            $("#youtube-video-id-2").val(event.fieldData["youtube-video-id-2"] || "");
            $("#event-description").val(event.fieldData.description || "");
            $("#sponsor-event-button-url").val(event.fieldData["sponsor-event-button-url"] || "");
            $("#sponsor-event-button-text").val(event.fieldData["sponsor-event-button-text"] || "");
            $("#show-future-event-checkbox").prop("checked", event.fieldData["show-future-event"] || false);

            // Populate main image
            if (event.fieldData["main-image"]?.url) {
              $("#event-main-image").val(event.fieldData["main-image"]?.url || "");
              $("#main-image-preview").attr("src", event.fieldData["main-image"]?.url).removeAttr("srcset");
            }

            // Populate flyer image
            if (event.fieldData["event-flyer"]?.url) {
              $("#event-flyer").val(event.fieldData["event-flyer"]?.url || "");
              $("#event-flyer-preview").attr("src", event.fieldData["event-flyer"]?.url).removeAttr("srcset");
            }

            // Store existing galleries in state to handle partial updates
            const existingGallery1 = event.fieldData["image-gallery"] || [];
            const existingGallery2 = event.fieldData["image-gallery-2"] || [];
            const existingGallery3 = event.fieldData["image-gallery-3"] || [];
            rpLib.eventsPage.state.existingGallery1 = existingGallery1;
            rpLib.eventsPage.state.existingGallery2 = existingGallery2;
            rpLib.eventsPage.state.existingGallery3 = existingGallery3;

            // Reset the gallery previews (but keep the add image button)
            $("#gallery-1-preview, #gallery-2-preview, #gallery-3-preview").children(":not(.add-img-btn)").remove();

            // Reset the file arrays for new uploads
            rpLib.eventsPage.state.uploads.gallery1 = [];
            rpLib.eventsPage.state.uploads.gallery2 = [];
            rpLib.eventsPage.state.uploads.gallery3 = [];

            // Display existing gallery 1 images
            if (existingGallery1.length > 0) {
              existingGallery1.forEach((img) => {
                rpLib.eventsPage.addExistingImageToGallery("gallery-1", img);
              });
            } else {
              rpLib.utils.updateGalleryLimits("gallery-1", 0);
            }

            // Display existing gallery 2 images
            if (existingGallery2.length > 0) {
              existingGallery2.forEach((img) => {
                rpLib.eventsPage.addExistingImageToGallery("gallery-2", img);
              });
            } else {
              rpLib.utils.updateGalleryLimits("gallery-2", 0);
            }

            // Display existing gallery 3 images
            if (existingGallery3.length > 0) {
              existingGallery3.forEach((img) => {
                rpLib.eventsPage.addExistingImageToGallery("gallery-3", img);
              });
            } else {
              rpLib.utils.updateGalleryLimits("gallery-3", 0);
            }

            // Show the modal
            $(".collection-item-modal").removeClass("hidden");
          }
        },
        error: function (error) {
          console.error("Error fetching event details:", error);
        },
      });
    },
    updateEventAndRefreshList: function (eventId, callback) {
      const eventDate = $("#event-date").val();
      if (!eventDate || !eventDate.includes('T') || eventDate.split('T')[1].split(':').length < 2) {
        alert("Please enter a complete date and time (YYYY-MM-DD HH:MM)");
        $("#save-event").text("Save");
        $("#save-event").prop("disabled", false);
        $("#full-page-loading-overlay").hide();
        if (typeof callback === "function") {
          callback();
        }
        return;
      }

      const eventData = {
        fieldData: {
          name: $("#event-name").val(),
          date: rpLib.utils.turnPstDateToUtcForInputEl(eventDate),
          "location-name": $("#event-location-name").val(),
          "location-address": $("#event-location-address").val(),
          "button-url": $("#button-url").val(),
          "button-text": $("#button-text").val(),
          "event-flyer": $("#event-flyer").val(),
          "youtube-video-id": $("#youtube-video-id").val(),
          "youtube-video-id-2": $("#youtube-video-id-2").val(),
          description: $("#event-description").val(),
          "sponsor-event-button-url": $("#sponsor-event-button-url").val(),
          "sponsor-event-button-text": $("#sponsor-event-button-text").val(),
          "show-future-event": $("#show-future-event-checkbox").is(":checked"),
        },
      };

      // Construct youtube video URLs if that exists
      if (eventData.fieldData["youtube-video-id"]) {
        eventData.fieldData["video"] = `https://youtu.be/${eventData.fieldData["youtube-video-id"]}`;
      }
      if (eventData.fieldData["youtube-video-id-2"]) {
        eventData.fieldData["video-2"] = `https://youtu.be/${eventData.fieldData["youtube-video-id-2"]}`;
      }

      // Add main image if there's one uploaded
      if (rpLib.eventsPage.state.uploads.mainImage) {
        const newMainImage = $("#main-image-preview").attr("src");
        eventData.fieldData["main-image"] = { url: newMainImage };
      }

      // Add flyer image if there's one uploaded
      if (rpLib.eventsPage.state.uploads.flyerImage) {
        const newFlyerImage = $("#event-flyer-preview").attr("src");
        eventData.fieldData["event-flyer"] = { url: newFlyerImage };
      }

      // Get the gallery data that was uploaded and processed
      const gallery1Images = rpLib.eventsPage.state.existingGallery1;
      const gallery2Images = rpLib.eventsPage.state.existingGallery2;
      const gallery3Images = rpLib.eventsPage.state.existingGallery3;

      // Add galleries to the event data if they have images
      if (gallery1Images && gallery1Images.length > 0) {
        eventData.fieldData["image-gallery"] = gallery1Images;
      } else {
        eventData.fieldData["image-gallery"] = [];
      }
      if (gallery2Images && gallery2Images.length > 0) {
        eventData.fieldData["image-gallery-2"] = gallery2Images;
      } else {
        eventData.fieldData["image-gallery-2"] = [];
      }
      if (gallery3Images && gallery3Images.length > 0) {
        eventData.fieldData["image-gallery-3"] = gallery3Images;
      } else {
        eventData.fieldData["image-gallery-3"] = [];
      }

      // Save the event data through the API
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/${eventId}/live`,
        method: "PATCH",
        data: JSON.stringify(eventData),
        contentType: "application/json",
        success: function () {
          // Close modal
          $(".collection-item-modal").addClass("hidden");

          // Reset button text and re-enable
          $("#save-event").text("Save");
          $("#save-event").prop("disabled", false);

          // Refresh the event list
          rpLib.api.fetchEventsAndRender($("#city-select").val());

          // Show success message
          alert("Success! Event updated. \n\n Click the eyeball icon to view your updates.");
        },
        error: function (error) {
          console.error("Error updating event:", error);

          alert("Failed to create event. Please try again.");
        },
        complete: function () {
          if (typeof callback === "function") {
            callback();
          }
        },
      });
    },
    fetchUserDetailsAndOpenModal: function (slug) {
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/live?slug=${slug}`,
        method: "GET",
        success: function (response) {
          if (response.items.length > 0) {
            let user = response.items[0];

            $("#user-first-name").val(user.fieldData["first-name"] || "");
            $("#user-last-name").val(user.fieldData["last-name"] || "");
            $("#user-title").val(user.fieldData.title || "");
            $("#user-profile-pic").val(user.fieldData["profile-picture"]?.url || "");
            $("#full-pic-preview").attr("src", user.fieldData["full-picture"]?.url || "");
            $("#user-email").val(user.fieldData.email || "");
            $("#user-phone").val(user.fieldData.phone || "");
            $("#user-url-facebook").val(user.fieldData["url-facebook"] || "");
            $("#user-url-instagram").val(user.fieldData["url-instagram"] || "");
            $("#user-url-x").val(user.fieldData["url-x"] || "");
            $("#user-url-youtube").val(user.fieldData["url-youtube"] || "");
            $("#user-url-linkedin").val(user.fieldData["url-linkedin"] || "");
            $("#user-url-tiktok").val(user.fieldData["url-tiktok"] || "");
            $("#user-order").val(user.fieldData["order"] || "");
            if (user.fieldData["profile-picture"]?.url) {
              $("#profile-pic-preview").attr("src", user.fieldData["profile-picture"]?.url);
              $("#profile-pic-preview").removeAttr("srcset");
            }
            if (user.fieldData["full-picture"]?.url) {
              $("#full-pic-preview").attr("src", user.fieldData["full-picture"]?.url);
              $("#full-pic-preview").removeAttr("srcset");
            }

            // Init rich text editor for user bio
            rpLib.utils.initRichTextEditor("user-bio", "Share user bio or info here...", user.fieldData.bio || "");

            // Show the modal
            $(".collection-item-modal").removeClass("hidden");
          }
        },
        error: function (error) {
          console.error("Error fetching user details:", error);
        },
      });
    },

    updateUserAndRefreshList: function (userId, newProfilePicFile, newFullPicFile, callback) {
      let updatedData = {
        fieldData: {
          "first-name": $("#user-first-name").val(),
          "last-name": $("#user-last-name").val(),
          title: $("#user-title").val(),
          email: $("#user-email").val(),
          phone: $("#user-phone").val(),
          "url-facebook": $("#user-url-facebook").val(),
          "url-instagram": $("#user-url-instagram").val(),
          "url-x": $("#user-url-x").val(),
          "url-youtube": $("#user-url-youtube").val(),
          "url-linkedin": $("#user-url-linkedin").val(),
          "url-tiktok": $("#user-url-tiktok").val(),
          order: $("#user-order").val() || "",
        },
      };

      // get bio from quill editor
      updatedData.fieldData["bio"] = rpLib.utils.cleanQuillInnerHTMLToWf(document.querySelector("#user-bio .ql-editor").innerHTML);

      // Handle profile picture - check for deletion first
      if (rpLib.usersPage.state.deletions.profilePic) {
        updatedData.fieldData["profile-picture"] = null; // This will remove the image
      } else if (newProfilePicFile) {
        const newImgUrl = $("#profile-pic-preview").attr("src");
        updatedData.fieldData["profile-picture"] = { url: newImgUrl };
      }

      // Handle full picture - check for deletion first
      if (rpLib.usersPage.state.deletions.fullPic) {
        updatedData.fieldData["full-picture"] = null; // This will remove the image
      } else if (newFullPicFile) {
        const newImgUrl = $("#full-pic-preview").attr("src");
        updatedData.fieldData["full-picture"] = { url: newImgUrl };
      }

      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/${userId}/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        data: JSON.stringify(updatedData),
        success: function () {
          alert("Success! User updated. \n\n Click the eyeball icon to view your updates.");
          $(".collection-item-modal").addClass("hidden");
          rpLib.api.fetchBrandUsersAndRender($("#city-select").val()); // Refresh list
        },
        error: function (error) {
          console.error("Error updating user:", error);

          // Handle Validation Error and list the fields that failed validation in the alert
          if (error.responseJSON && error.responseJSON?.code === "validation_error" && error.responseJSON?.details.length > 0) {
            let failedFields = error.responseJSON.details.map((detail) => `${detail.param}—${detail.description}`);
            alert("Error updating user. Please try again. Failed fields: " + failedFields.join(", "));
          } else {
            alert("Error updating user. Please try again. Error status:" + error.status);
          }
        },
        complete: function () {
          if (typeof callback === "function") {
            callback();
          }
        },
      });
    },

    updateUserShowHide: function (userId, showUser) {
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/${userId}/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        data: JSON.stringify({
          fieldData: {
            "show-user": showUser,
          },
        }),
        success: function () {
          alert("Success! User profile updated. \n\n Click the eyeball icon to view your updates.");
        },
        error: function (errorRes) {
          console.error("Error updating user:", errorRes);
          // Handle Validation Error and list the fields that failed validation in the alert
          if (errorRes.responseJSON && errorRes.responseJSON?.code === "validation_error" && errorRes.responseJSON?.details.length > 0) {
            let failedFields = errorRes.responseJSON.details.map((detail) => `${detail.param}—${detail.description}`);
            alert("Error updating user. Please try again. Failed fields: " + failedFields.join(", "));
          } else {
            alert("Error updating user. Please try again. Error status:" + errorRes.status);
          }
        },
      });
    },
    uploadImage: function (file, onSuccess, onError) {
      const generateMD5Hash = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onload = function () {
            const md5Hash = SparkMD5.hashBinary(reader.result);
            resolve(md5Hash);
          };
          reader.onerror = (error) => reject(error);
        });
      };

      generateMD5Hash(file)
        .then((md5Hash) => {
          $.ajax({
            url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/sites/${SITE_ID}/assets`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              fileHash: md5Hash,
              fileName: file.name,
              contentType: file.type,
              parentFolder: "6875801278171d338b074b82", // This is the folder ID for the "Backend Uploads" folder in Webflow
            }),
            success: function (response) {
              const formData = new FormData();

              // Add all the upload details from Webflow to the form
              Object.keys(response.uploadDetails).forEach((key) => {
                formData.append(key, response.uploadDetails[key]);
              });

              // Append the actual file
              formData.append("file", file);

              // Upload to S3
              $.ajax({
                url: response.uploadUrl,
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                  // Return the asset details from the original response
                  onSuccess({
                    id: response.id,
                    url: response.assetUrl || response.hostedUrl,
                  });
                },
                error: function (error) {
                  console.error("Error uploading to S3:", error);
                  if (onError) onError(error);
                },
              });
            },
            error: function (error) {
              console.error("Error getting upload details:", error);
              if (onError) onError(error);
            },
          });
        })
        .catch((error) => {
          console.error("Error generating file hash:", error);
          if (onError) onError(error);
        });
    },

    uploadMultipleImages: function (files, onProgress, onComplete, onError) {
      const totalFiles = files.length;
      let uploadedCount = 0;
      const results = [];

      // Function to upload a single file and manage the queue
      function uploadNext(index) {
        if (index >= totalFiles) {
          // All files uploaded
          onComplete(results);
          return;
        }

        rpLib.api.uploadImage(
          files[index],
          function (result) {
            // Success for this file
            results.push(result);
            uploadedCount++;

            // Report progress
            if (onProgress) {
              onProgress(uploadedCount, totalFiles);
            }

            // Upload next file
            uploadNext(index + 1);
          },
          function (error) {
            console.error(`Error uploading file ${files[index].name}:`, error);
            if (onError) {
              onError(error, files[index], index);
            }
            // Continue with next file despite error
            uploadNext(index + 1);
          }
        );
      }

      // Start the upload process
      uploadNext(0);
    },
    archiveItem: function (collectionId, itemId, itemType, successCallback) {
      const archiveData = {
        isArchived: true,
      };

      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${collectionId}/items/${itemId}/live`,
        method: "PATCH",
        data: JSON.stringify(archiveData),
        contentType: "application/json",
        success: function () {
          alert(`${itemType} deleted successfully!`);
          if (typeof successCallback === "function") {
            successCallback();
          }
        },
        error: function (error) {
          console.error(`Error archiving ${itemType}:`, error);
          alert(`Failed to archive ${itemType}. Please try again.`);
        },
      });
    },
    createUserAndRefreshList: function (brandId, newProfilePic, newFullPic, callback) {
      // The first and last name are used to create the full name
      const firstName = $("#user-first-name").val();
      const lastName = $("#user-last-name").val();

      let newUserData = {
        fieldData: {
          name: `${firstName} ${lastName}`.trim(),
          "first-name": firstName,
          "last-name": lastName,
          title: $("#user-title").val(),
          email: $("#user-email").val(),
          phone: $("#user-phone").val(),
          "url-facebook": $("#user-url-facebook").val(),
          "url-instagram": $("#user-url-instagram").val(),
          "url-x": $("#user-url-x").val(),
          "url-youtube": $("#user-url-youtube").val(),
          "url-linkedin": $("#user-url-linkedin").val(),
          "url-tiktok": $("#user-url-tiktok").val(),
          order: $("#user-order").val(),
          "show-user": true,
          "brand-s": [brandId], // Sets the brand relationship
        },
      };

      // get bio from quill editor
      newUserData.fieldData["bio"] = rpLib.utils.cleanQuillInnerHTMLToWf(document.querySelector("#user-bio .ql-editor").innerHTML);

      // Add profile picture if available
      if (newProfilePic) {
        const newImgUrl = $("#profile-pic-preview").attr("src");
        newUserData.fieldData["profile-picture"] = { url: newImgUrl };
      }

      // Add full picture if available
      if (newFullPic) {
        const newImgUrl = $("#full-pic-preview").attr("src");
        newUserData.fieldData["full-picture"] = { url: newImgUrl };
      }

      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        data: JSON.stringify(newUserData),
        success: function (response) {
          alert("Success! User created. \n\n Click the eyeball icon to view your updates.");
          $(".collection-item-modal").addClass("hidden");
          // Refresh list
          rpLib.api.fetchBrandUsersAndRender(brandId);
        },
        error: function (error) {
          console.error("Error creating user:", error);
          alert("Failed to create user. Please check the console for details.");
          // Re-enable the save button even on error
          $("#save-user").text("Save");
          $("#save-user").prop("disabled", false);
        },
        complete: function () {
          if (typeof callback === "function") {
            callback();
          }
        },
      });
    },
    createPartnerAndRefreshList: function (brandId, newProfilePicFile, newLogoFile, newAdImageFile, callback) {
      let newPartnerData = {
        fieldData: {
          name: $("#partner-name").val(),
          company: $("#partner-company").val(),
          "company-type": $("#partner-title").val(),
          phone: $("#partner-phone").val(),
          email: $("#partner-email").val(),
          website: $("#partner-website").val(),
          "license-number": $("#partner-license").val(),
          "url-facebook": $("#partner-facebook").val(),
          "url-instagram": $("#partner-instagram").val(),
          "url-x": $("#partner-x").val(),
          "url-youtube": $("#partner-youtube").val(),
          "url-linkedin": $("#partner-linkedin").val(),
          "url-tiktok": $("#partner-tiktok").val(),
          "preview-text": $("#partner-preview-text").val(),
          address: $("#partner-address").val(),
          "city-state-zip": $("#partner-city").val(),
          "show-partner": true,
          "youtube-video-id": $("#youtube-video-id").val(),
          "partner-categories": $("#partner-categories").val(), // Multi-reference
          // Set the brand relationship
          brand: brandId,
          city: [brandId],
        },
      };

      // Construct youtube video URL if that exists
      if (newPartnerData.fieldData["youtube-video-id"]) {
        newPartnerData.fieldData["video"] = `https://youtu.be/${$("#youtube-video-id").val()}`;
      }

      // get description from quill editor
      newPartnerData.fieldData["description"] = rpLib.utils.cleanQuillInnerHTMLToWf(
        document.querySelector("#partner-description .ql-editor").innerHTML
      );

      // add preview-text with textContent of ql-editor
      newPartnerData.fieldData["preview-text"] = document.querySelector("#partner-description .ql-editor").textContent.trim();

      // Add profile picture if available
      if (newProfilePicFile) {
        const newImgUrl = $("#profile-pic-preview").attr("src");
        newPartnerData.fieldData["profile-pic"] = { url: newImgUrl };
      }

      // Add logo if available
      if (newLogoFile) {
        const newImgUrl = $("#logo-preview").attr("src");
        newPartnerData.fieldData["logo"] = { url: newImgUrl };
      }

      // Add advertisement image if available
      if (newAdImageFile) {
        const newAdImage = $("#ad-image-preview").attr("src");
        newPartnerData.fieldData["advertisement"] = { url: newAdImage };
      }

      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNERS_COLLECTION_ID}/items/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        data: JSON.stringify(newPartnerData),
        success: function (response) {
          alert("Success! Partner profile created. \n\n Click the eyeball icon to view your updates.");
          $(".collection-item-modal").addClass("hidden");
          // Refresh list
          rpLib.api.fetchPartnersAndRender(brandId);
        },
        error: function (errorRes) {
          // Handle Validation Error and list the fields that failed validation in the alert
          if (errorRes.responseJSON && errorRes.responseJSON?.code === "validation_error" && errorRes.responseJSON?.details.length > 0) {
            let failedFields = errorRes.responseJSON.details.map((detail) => `${detail.param}—${detail.description}`);
            alert("Error creating partner. Please try again. Failed fields: " + failedFields.join(", "));
          } else {
            console.error("Error creating partner:", errorRes);
            alert("Failed to create partner. Please try again. " + errorRes.responseJSON?.message);
          }
        },
        complete: function () {
          if (typeof callback === "function") {
            callback();
          }
        },
      });
    },
    createEventAndRefreshList: function (brandId, callback) {
      // Quick fix for imcomplete datetime-local input values, needs rework on next iteration
      const eventDate = $("#event-date").val();
      if (!eventDate || !eventDate.includes('T') || eventDate.split('T')[1].split(':').length < 2) {
        alert("Please enter a complete date and time (YYYY-MM-DD HH:MM)");
          $("#save-event").text("Save");
          $("#save-event").prop("disabled", false);
          $("#full-page-loading-overlay").hide();
        return;
      }

      let newEventData = {
        fieldData: {
          name: $("#event-name").val(),
          date: rpLib.utils.turnPstDateToUtcForInputEl(eventDate),
          "location-name": $("#event-location-name").val(),
          "location-address": $("#event-location-address").val(),
          "button-url": $("#button-url").val(),
          "button-text": $("#button-text").val(),
          "event-flyer": $("#event-flyer").val(),
          "youtube-video-id": $("#youtube-video-id").val(),
          "youtube-video-id-2": $("#youtube-video-id-2").val(),
          description: $("#event-description").val(),
          "sponsor-event-button-url": $("#sponsor-event-button-url").val(),
          "sponsor-event-button-text": $("#sponsor-event-button-text").val(),
          "show-event": true,
          "show-future-event": $("#show-future-event-checkbox").is(":checked"),
          // Set the brand relationship
          brand: brandId,
        },
      };

      // Construct youtube video URLs if that exists
      if (newEventData.fieldData["youtube-video-id"]) {
        newEventData.fieldData["video"] = `https://youtu.be/${$("#youtube-video-id").val()}`;
      }
      if (newEventData.fieldData["youtube-video-id-2"]) {
        newEventData.fieldData["video-2"] = `https://youtu.be/${$("#youtube-video-id-2").val()}`;
      }

      // Add main image if there's one uploaded
      if (rpLib.eventsPage.state.uploads.mainImage) {
        const newMainImage = $("#main-image-preview").attr("src");
        newEventData.fieldData["main-image"] = { url: newMainImage };
      }

      // Add flyer image if there's one uploaded
      if (rpLib.eventsPage.state.uploads.flyerImage) {
        const newFlyerImage = $("#event-flyer-preview").attr("src");
        newEventData.fieldData["event-flyer"] = { url: newFlyerImage };
      }

      // Get the gallery data that was uploaded and processed
      const gallery1Images = rpLib.eventsPage.state.existingGallery1;
      const gallery2Images = rpLib.eventsPage.state.existingGallery2;
      const gallery3Images = rpLib.eventsPage.state.existingGallery3;
      // Add galleries to the event data if they have images
      if (gallery1Images && gallery1Images.length > 0) {
        newEventData.fieldData["image-gallery"] = gallery1Images;
      }
      if (gallery2Images && gallery2Images.length > 0) {
        newEventData.fieldData["image-gallery-2"] = gallery2Images;
      }
      if (gallery3Images && gallery3Images.length > 0) {
        newEventData.fieldData["image-gallery-3"] = gallery3Images;
      }

      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        data: JSON.stringify(newEventData),
        success: function (response) {
          $(".collection-item-modal").addClass("hidden");
          // Refresh list
          rpLib.api.fetchEventsAndRender(brandId);

          // Show success message
          alert("Success! Event created. \n\n Click the eyeball icon to view your updates.");
        },
        error: function (error) {
          console.error("Error creating event:", error);

          alert("Failed to create event. Please try again.");
        },
        complete: function () {
          if (typeof callback === "function") {
            callback();
          }
        },
      });
    },
    fetchAllPartnerCategories: function (callback) {
      const allCategories = [];

      // URL for the categories endpoint
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNER_CATEGORIES_COLLECTION_ID}/items?limit=100&sortBy=name&sortOrder=asc`;

      // Process function to collect all categories
      const processCategories = function (items) {
        allCategories.push(...items);

        // If this is the last batch, sort and call the callback
        if (items.length < 100 || !callback) {
          // Sort categories alphabetically by name
          allCategories.sort((a, b) => {
            const nameA = (a.fieldData.name || "").toLowerCase();
            const nameB = (b.fieldData.name || "").toLowerCase();
            return nameA.localeCompare(nameB);
          });

          if (typeof callback === "function") {
            callback(allCategories);
          }
        }
      };

      // Use the existing fetchAllPaginated function
      rpLib.api.fetchAllPaginated(url, processCategories);
    },
  },
};