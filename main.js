const USER_SLUG = $("[data-ms-member='wf-users-slug']").text();
const EVENTS_COLLECTION_ID = "658f30a87b1a52ef8ad0b8e4";
const USERS_COLLECTION_ID = "658f30a87b1a52ef8ad0b74b";
const BRANDS_COLLECTION_ID = "658f30a87b1a52ef8ad0b77b";
const PARTNERS_COLLECTION_ID = "65e7ff7b313c5cd8cd924886";
const PARTNER_CATEGORIES_COLLECTION_ID = "65e7fc8199c534cfe2cba083";
const SITE_ID = "658f30a87b1a52ef8ad0b732";
const profilePicPlaceholderImg = "https://cdn.prod.website-files.com/658f30a87b1a52ef8ad0b732/66a4a5fa00aa346e11374944_user-profile-place-holder.jpg";
const logoPlaceholderImg = "https://cdn.prod.website-files.com/658f30a87b1a52ef8ad0b732/67d3e49e496d302f371805d7_logo-placeholder.jpg";
const adPlaceholderImg = "https://cdn.prod.website-files.com/658f30a87b1a52ef8ad0b732/67d3e6f9e85351033700473f_ad-image-placeholder.jpg";
const eventMainPlaceholderImg = "https://cdn.prod.website-files.com/658f30a87b1a52ef8ad0b732/67dfcd6c686c0fa648b21c00_icon-event.png";



$(document).ready(function () {
  rpLib.utils.injectCSS();
  rpLib.utils.injectDependencies();

  // Run the scripts on relevant pages
  if (window.location.pathname === "/account/get-started") rpLib.getStartedPage.init();
  if (window.location.pathname === "/account/dashboard") rpLib.dashboardPage.init();
  if (window.location.pathname === "/account/partners") rpLib.partnersPage.init();
  if (window.location.pathname === "/account/events") rpLib.eventsPage.init();
  if (window.location.pathname === "/account/users") rpLib.usersPage.init();
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

      rpLib.utils.initCitySelection( // On city selected by user
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
              const basePageUrl = 'https://www.realproducersmagazine.com'

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

              // Update the text in the .domains-and-pages list
              $(".domains-and-pages a.text-link-dashboard").each(function () {
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
    },
    init: function () {
      rpLib.utils.initCitySelection( function(brandId) { // On city selected
        rpLib.api.fetchBrandUsersAndRender(brandId);

        // Set View All link
        const citySlug = $("#city-select option:selected").attr("data-slug");
        $('a#view-all').attr('href', `http://www.realproducersmagazine.com/users/${citySlug}`);

        // Show elements that are hidden by default until a city is selected
        $("#view-all").removeClass("hidden");
        $(".lib-create-item-btn").removeClass("hidden");
        $(".grid-header-row").removeClass("hidden");
      });

      this.bindEventListeners();
    },
    bindEventListeners: function () {
      this.bindCreateUserEvents();
      this.bindEditUserEvents();
      this.bindDeleteUserEvents();
      this.bindModalEvents();
    },
    bindCreateUserEvents: function () {
      // Event listener for create button click
      $("body").on("click", ".lib-create-item-btn", function (event) {
        // Clear modal data attribute to indicate this is a new item
        $(".collection-item-modal").removeAttr("data-user-id");

        // Update modal title for creation
        $(".collection-item-modal").find("h3").text("Create New User");

        // Clear all form fields
        $("#user-first-name").val("");
        $("#user-last-name").val("");
        $("#user-title").val("");
        $("#user-profile-pic").val("");
        $("#user-full-pic").val("");
        $("#user-email").val("");
        $("#user-phone").val("");
        $("#user-bio").val("");
        $("#user-url-facebook").val("");
        $("#user-url-instagram").val("");
        $("#user-url-x").val("");
        $("#user-url-youtube").val("");
        $("#user-url-linkedin").val("");
        $("#user-url-tiktok").val("");

        // Clear image previews
        $("#profile-pic-preview").attr("src", profilePicPlaceholderImg);
        $("#full-pic-preview").attr("src", profilePicPlaceholderImg);
        $("#profile-pic-upload-status").text("");
        $("#full-pic-upload-status").text("");

        // Init/Reset rich text editor for user bio
        rpLib.utils.initRichTextEditor(
          "user-bio",
          "Share user bio or info here..."
        );

        // Show the modal
        $(".collection-item-modal").removeClass("hidden");
      });
    },
    bindEditUserEvents: function () {
      // Event listener for edit button click and open modal
      $("body").on("click", ".item-edit-btn", function (event) {
        let userId = $(this).closest(".collection-item").attr('data-user-id');
        let slug = $(this).closest(".collection-item").attr("data-slug");

        // Update modal title for editing
        $(".collection-item-modal").find("h3").text("Edit User");

        // Set the user ID for editing
        $(".collection-item-modal").attr("data-user-id", userId);

        // Fetch and populate user details
        rpLib.api.fetchUserDetailsAndOpenModal(slug);
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
    bindModalEvents: function () {
      // Event listener on url inputs to add "http://" to website URL if not present
      $(document).on('blur', '.collection-item-modal input[type="url"]', function() {
        const url = $(this).val().trim();
    
        const urlWithProtocol = rpLib.utils.formatUrlWithProtocol(url);
        $(this).val(urlWithProtocol);
      });

      // On save button click
      $("#save-user").on("click", function () {
        rpLib.usersPage.handleSaveUserClick(
          rpLib.usersPage.state.uploads.profilePic,
          rpLib.usersPage.state.uploads.fullPic
        );
      });


      // Close modal
      $("#close-modal").on("click", function () {
        // Ask for confirmation before closing the modal
        if (confirm("Are you sure you want to close the modal? Any unsaved changes will be lost.")) {
          $(".collection-item-modal").addClass("hidden");
        }
      });


      // On profile pic preview replacement click, open file dialog
      rpLib.utils.setupSingleImgPreviewReplacement("profile-pic-preview", function(newFile) {
        $("#profile-pic-upload-status").text("Image selected (will upload when saved)");
        rpLib.usersPage.state.uploads.profilePic = newFile;
      });

      // On full pic preview replacement click, open file dialog
      rpLib.utils.setupSingleImgPreviewReplacement("full-pic-preview", function(newFile) {
        $("#full-pic-upload-status").text("Image selected (will upload when saved)");
        rpLib.usersPage.state.uploads.fullPic = newFile;
      });
    },
    handleSaveUserClick: function (profilePicFile, fullPicFile) {
      const userId = $(".collection-item-modal").attr("data-user-id");
      const isCreatingNewUser = !userId; // Check if we're creating a new user

      let uploadPromises = [];

      // Show saving status
      $("#save-user").text("Uploading images...");
      $("#save-user").prop("disabled", true);

      // Upload profile pic if needed
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
          rpLib.api.createUserAndRefreshList(brandId, profilePicFile, fullPicFile);
        } else {
          rpLib.api.updateUserAndRefreshList(userId, profilePicFile, fullPicFile);
        }

        // Reset button text and re-enable it
        $("#save-user").text("Save");
        $("#save-user").prop("disabled", false);
      });
    },
    renderUser: function (user) {
      const templateRowItem = $(".collection-item-row-template").clone();
      templateRowItem.removeClass("collection-item-row-template");
      templateRowItem.attr("data-slug", user.fieldData.slug);
      templateRowItem.attr("data-user-id", user.id);

      templateRowItem.find(".user-pic").attr("src", user.fieldData["profile-picture"]?.url || "");
      templateRowItem.find(".user-name").text(user.fieldData.name || "");
      templateRowItem.find(".user-number").text(user.fieldData.phone || "");
      templateRowItem.find(".user-email").text(user.fieldData.email || "");
      templateRowItem.find(".item-view-btn").attr("href", `https://www.realproducersmagazine.com/user/${user.fieldData.slug}` || "");


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
      }
    },
    init: function () {
      // Load list of partner categories first so it's available to populate the dropdown in the edit modal
      rpLib.api.fetchAllPartnerCategories(function(categories) {
        $("#partner-categories").empty(); // Clear existing options
        $("#partner-categories").multiselect({
          maxHeight: 200,
        });
        
        // Add options for all categories
        categories.forEach(function(category) {
          $("#partner-categories").append(
            $("<option>", {
              value: category.id,
              text: category.fieldData.name || "Unnamed Category"
            })
          );
          $("#partner-categories").multiselect('reload');
        });

        // Initialize city selection and fetch partners
        rpLib.utils.initCitySelection(function (brandId) {
          // On city selected
          rpLib.api.fetchPartnersAndRender(brandId);

          // Set View All link
          const citySlug = $("#city-select option:selected").attr("data-slug");
          $('a#view-all').attr('href', `http://www.realproducersmagazine.com/partners/${citySlug}`);

          // Show elements that are hidden by default until a city is selected
          $("#view-all").removeClass("hidden");
          $(".lib-create-item-btn").removeClass("hidden");
          $(".grid-header-row").removeClass("hidden");
        });
      });

      this.bindEventListeners();

    },
    bindEventListeners: function () {
      this.bindCreatePartnerEvents();
      this.bindEditPartnerEvents();
      this.bindDeletePartnerEvents();
      this.bindShowHideEvents();
      this.bindModalEvents();
    },
    bindCreatePartnerEvents: function () {
      // On create new partner click
      $("body").on("click", ".lib-create-item-btn", function (event) {
        rpLib.partnersPage.state.uploads = {
          profilePic: null,
          logo: null,
          adImage: null,
        }

        rpLib.partnersPage.handleCreatePartnerClick();
      });
    },
    bindEditPartnerEvents: function () {
      // On edit button click open modal
      $("body").on("click", ".item-edit-btn", function (event) {
        // Reset image file references
        rpLib.partnersPage.state.uploads = {
          profilePic: null,
          logo: null,
          adImage: null,
        }

        const partnerId = $(this).closest(".collection-item").attr("data-partner-id");
        const slug = $(this).closest(".collection-item").attr("data-slug");

        // Set the modal partner ID for editing
        $(".collection-item-modal").attr("data-partner-id", partnerId);

        rpLib.api.fetchPartnerDetailsAndOpenModal(slug);
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
      // if the checkbox input (.show-hide-switch .switch input)  is changed, update the partner's "show-partner" field
      $("body").on("change", ".show-hide-switch .switch input", function () {
        const partnerId = $(this).closest(".collection-item").attr("data-partner-id");
        const showPartner = $(this).is(":checked");

        // Update the partner's "show-partner" field
        rpLib.api.updatePartnerShowHide(partnerId, showPartner);
      });
    },
    bindModalEvents: function () {
      // Event listener on url inputs to add "http://" to website URL if not present
      $(document).on('blur', '.collection-item-modal input[type="url"]', function() {
        const url = $(this).val().trim();
    
        const urlWithProtocol = rpLib.utils.formatUrlWithProtocol(url);
        $(this).val(urlWithProtocol);
      });

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
      rpLib.utils.setupSingleImgPreviewReplacement("profile-pic-preview", function(newFile) {
        // Update the status text after selecting a new image
        $("#profile-pic-upload-status").text("Image selected (will upload when saved)");

        // Update the state/variable to indicate a new file was selected
        rpLib.partnersPage.state.uploads.profilePic = newFile;
      });
      rpLib.utils.setupSingleImgPreviewReplacement("logo-preview", function(newFile) {
        $("#logo-upload-status").text("Image selected (will upload when saved)");
        rpLib.partnersPage.state.uploads.logo = newFile;
      });
      rpLib.utils.setupSingleImgPreviewReplacement("ad-image-preview", function(newFile) {
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
        templateRowItem.find(".partner-pic").attr("src", partner.fieldData["profile-pic"]?.url || "").removeAttr("srcset");
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
          rpLib.api.createPartnerAndRefreshList(brandId, profilePicFile, logoFile, adImageFile);
        } else {
          rpLib.api.updatePartnerAndRefreshList(partnerId, profilePicFile, logoFile, adImageFile);
        }

        // Reset button text and re-enable it
        $("#save-partner").text("Save");
        $("#save-partner").prop("disabled", false);
      });
    },

    handleCreatePartnerClick: function () {
      // Clear modal data attribute to indicate this is a new item
      $(".collection-item-modal").removeAttr("data-partner-id");

      // Update modal title for creation
      $(".collection-item-modal").find("h3").text("Create New Partner");

      // Clear all form fields
      $("#profile-pic-preview").attr("src", profilePicPlaceholderImg);
      $("#logo-preview").attr("src", logoPlaceholderImg);
      $("#ad-image-preview").attr("src", adPlaceholderImg);

      $("#partner-name").val("");
      $("#partner-company").val("");
      $("#partner-title").val("");
      $("#partner-phone").val("");
      $("#partner-email").val("");
      $("#partner-website").val("");
      $("#partner-license").val("");
      $("#partner-facebook").val("");
      $("#partner-instagram").val("");
      $("#partner-x").val("");
      $("#partner-youtube").val("");
      $("#partner-linkedin").val("");
      $("#partner-tiktok").val("");

      // Init/Reset rich text editor for partner description
      rpLib.utils.initRichTextEditor(
        "partner-description",
        "Share partner bio or info here..."
      );

      $("#partner-preview-text").val("");
      $("#partner-address").val("");
      $("#partner-city").val("");
      $("#partner-categories").val([]);
      // Reset the multiselect
      $("#partner-categories").multiselect('reload');

      // Show the modal
      $(".collection-item-modal").removeClass("hidden");
    }
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
    },
    init: function () {
      rpLib.utils.initCitySelection(function (brandId) {
        rpLib.api.fetchEventsAndRender(brandId);

        // Set View All link
        const citySlug = $("#city-select option:selected").attr("data-slug");
        $('a#view-all').attr('href', `http://www.realproducersmagazine.com/events/${citySlug}`);

        // Show elements that are hidden by default until a city is selected
        $("#view-all").removeClass("hidden");
        $(".lib-create-item-btn").removeClass("hidden");
        $(".grid-header-row").removeClass("hidden");
      });

      this.bindEventListeners();
    },
    bindEventListeners: function () {
      this.bindCreateEventEvents();
      this.bindEditEventEvents();
      this.bindDeleteEventEvents();
      this.bindModalEvents();
      this.bindShowHideEvents();
    },
    bindCreateEventEvents: function () {
      // Event listener for create button click
      $("body").on("click", ".lib-create-item-btn", function (event) {
        // Clear modal data attribute to indicate this is a new item
        $(".collection-item-modal").removeAttr("data-event-id");

        // Update modal title for creation
        $(".collection-item-modal").find("h3").text("Create New Event");

        // Clear all form fields
        $("#event-name").val("");
        $("#event-date").val("");
        $("#event-location-name").val("");
        $("#event-location-address").val("");
        $("#button-url").val("");
        $("#button-text").val("");
        $("#event-show").prop("checked", false);
        $("#youtube-video-id").val("");
        $("#youtube-video-id-2").val("");
        $("#event-description").val("");
        $("#sponsor-event-button-url").val("");
        $("#sponsor-event-button-text").val("");

        // Clear image previews
        $("#main-image-preview").attr("src", eventMainPlaceholderImg);
        $("#main-image-upload-status").text("");

        $("#event-flyer-preview").attr("src", logoPlaceholderImg);
        $("#event-flyer-status").text("");

        $("#gallery-1-preview, #gallery-2-preview, #gallery-3-preview").children(':not(.add-img-btn)').remove();
        rpLib.utils.updateGalleryLimits("gallery-1", 0);
        rpLib.utils.updateGalleryLimits("gallery-2", 0);
        rpLib.utils.updateGalleryLimits("gallery-3", 0);

        // Reset file variables
        rpLib.eventsPage.state.uploads = {
          mainImage: null,
          gallery1: [],
          gallery2: [],
          gallery3: [],
        }

        // Reset existing gallery data
        rpLib.eventsPage.state.existingGallery1 = [];
        rpLib.eventsPage.state.existingGallery2 = [];
        rpLib.eventsPage.state.existingGallery3 = [];

        // Enable upload inputs
        $('.add-img-btn').removeClass('hidden');

        // Show the modal
        $(".collection-item-modal").removeClass("hidden");
      });
    },
    bindEditEventEvents: function () {
      $("#collection-list").on("click", ".item-edit-btn", function () {
        let eventId = $(this).closest(".collection-item").attr("data-event-id");
        let slug = $(this).closest(".collection-item").attr("data-slug");

        // Update modal title for editing
        $(".collection-item-modal").find("h3").text("Edit Event");

        // Set the event ID for editing
        $(".collection-item-modal").attr("data-event-id", eventId);

        rpLib.api.fetchEventDetailsAndOpenModal(slug);
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
      $(document).on('blur', '.collection-item-modal input[type="url"]', function() {
        const url = $(this).val().trim();
    
        const urlWithProtocol = rpLib.utils.formatUrlWithProtocol(url);
        $(this).val(urlWithProtocol);
      });

      rpLib.utils.setupSingleImgPreviewReplacement("main-image-preview", function(newFile) {
        // Update the status text after selecting a new image
        $("#main-image-upload-status").text("Image selected (will upload when saved)");

        // Update uploads state to indicate a new file was selected
        rpLib.eventsPage.state.uploads.mainImage = newFile;
      });
      rpLib.utils.setupSingleImgPreviewReplacement("event-flyer-preview", function(newFile) {
        $("#event-flyer-status").text("Image selected (will upload when saved)");
        rpLib.eventsPage.state.uploads.flyerImage = newFile;
      });

      // When an .add-img-btn is clicked, create a new invisible temp file input and trigger the click event
      $(".add-img-btn").on("click", function () {
        // Get id from class name .gallery-1-add-img-btn, .gallery-2-add-img-btn, .gallery-3-add-img-btn with regex (this is hacky :/) 
        const galleryId = $(this).attr("class").match(/gallery-(\d+)-add-img-btn/)[1];
        const tempInputElId = `gallery-${galleryId}-upload`;
        const $tempInput = $(`<input type='file' id='${tempInputElId}' accept='image/*' multiple style='display:none;' />`);
        
        // Attach the change event handler before appending to body
        $tempInput.on("change", function (e) {
          const files = Array.from(e.target.files);
          if (files.length === 0) return;
          
          // Get current images count (both existing and newly added)
          const currentCount = $(`#gallery-${galleryId}-preview .gallery-img`).length;
          
          // Check if adding these files would exceed the limit
          if (currentCount + files.length > 25) {
            const remaining = 25 - currentCount;
            alert(`You can only add ${remaining} more image${remaining !== 1 ? "s" : ""}. Please select fewer images.`);
            $(this).val(""); // Reset the input
            return;
          }
          
          // Add new files to the array
          rpLib.eventsPage.state.uploads[`gallery${galleryId}`] = [
            ...rpLib.eventsPage.state.uploads[`gallery${galleryId}`], 
            ...files
          ];
          
          // Show preview for each file
          files.forEach((file, index) => {
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

        // Show saving status
        $("#save-event").text("Uploading images...");
        $("#save-event").prop("disabled", true);

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
            rpLib.api.createEventAndRefreshList($("#city-select").val());
          } else {
            rpLib.api.updateEventAndRefreshList(eventId);
          }

          // Reset button text and re-enable it
          $("#save-event").text("Save");
          $("#save-event").prop("disabled", false);
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
        const img = $("<img>")
          .addClass("thumbnail")
          .addClass("gallery-img")
          .attr("src", imageData.url)
          .attr("data-index", index)
          .attr("data-image-id", imageData.id)
          .attr("data-existing", true)
          .attr("title", "Click to replace this image");
        $(`#${galleryId}-preview .add-img-btn`).before(img);
        // Update limits display
        rpLib.utils.updateGalleryLimits(galleryId, index + 1);
      }
    },
    renderEvent: function (event) {
      const templateRowItem = $(".collection-item-row-template").clone();
      templateRowItem.removeClass("collection-item-row-template");
      templateRowItem.attr("data-slug", event.fieldData.slug);
      templateRowItem.attr("data-event-id", event.id);

      if (event.fieldData["main-image"]?.url) {
        templateRowItem.find(".event-pic").attr("src", event.fieldData["main-image"]?.url || "").removeAttr("srcset");
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

  utils: {
    injectDependencies: function () {
      // SparkMD5
      const scriptTagForSparkMD5 = '<script src="https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js"></script>';
      $("head").append(scriptTagForSparkMD5);

      // @nobleclem/jquery-multiselect
      const scriptTagForMultiselect = '<script src="https://cdn.jsdelivr.net/npm/@nobleclem/jquery-multiselect@2.4.24/jquery.multiselect.min.js"></script>';
      const cssLinkForMultiselect = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nobleclem/jquery-multiselect@2.4.24/jquery.multiselect.min.css">';
      $("head").append(scriptTagForMultiselect);
      $("head").append(cssLinkForMultiselect);

      // Quill rich text editor
      const quillCssLink = '<link href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css" rel="stylesheet">';
      const quillJsScript = '<script src="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.js"></script>';
      $("head").append(quillCssLink);
      $("head").append(quillJsScript);
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
        const img = $("<img>")
          .addClass("thumbnail")
          .addClass("gallery-img")
          .attr("src", e.target.result)
          .attr("data-index", index)
          .attr("data-file-index", fileIndex)
          .attr("title", "Click to replace this image");
        $(`#${galleryId}-preview .add-img-btn`).before(img);

        // Update limits display
        rpLib.utils.updateGalleryLimits(galleryId, index + 1);
      };
      reader.readAsDataURL(file);
    },
    handleGalleryUpload: function (galleryId, galleryFiles) {
      return new Promise((resolve) => {
        const $preview = $(`#${galleryId}-preview`);
        const $status = $(`#${galleryId}-upload-status`);
        const existingImages = $preview.find("img");

        // If there are no images to upload
        if (existingImages.length === 0 && galleryFiles.length === 0) {
          resolve([]);
          return;
        }

        // If we only have existing images that weren't changed
        if (galleryFiles.length === 0 && !$preview.find(".replaced").length) {
          // Just use the existing gallery data
          const galleryNum = galleryId.split("-")[1]; // eg. #gallery-1-preview
          if (galleryNum === "1") resolve(rpLib.eventsPage.state.existingGallery1);
          else if (galleryNum === "2") resolve(rpLib.eventsPage.state.existingGallery2);
          else if (galleryNum === "3") resolve(rpLib.eventsPage.state.existingGallery3);
          return;
        }

        // We need to upload images
        $status.text("Preparing upload...");

        // Collect all images that need uploading (new or replaced)
        let filesToUpload = [];
        let imageMap = []; // To maintain order

        // Process each image in the preview area to maintain order
        existingImages.each(function () {
          const $img = $(this);
          const index = $img.attr("data-index");
          const isReplaced = $img.hasClass("replaced");

          if (isReplaced) {
            // This image was replaced, get the replacement file
            const replacementFile = $preview.data(`replaced-${index}`);
            if (replacementFile) {
              filesToUpload.push(replacementFile);
              imageMap.push({
                originalIndex: index,
                uploadIndex: filesToUpload.length - 1,
                isNew: true,
              });
            }
          } else if ($img.attr("data-existing")) {
            // This is an existing image that wasn't changed
            imageMap.push({
              originalIndex: index,
              existingId: $img.attr("data-image-id"),
              existingUrl: $img.attr("src"),
              isNew: false,
            });
          } else {
            // This is a completely new image
            const fileIndex = $img.attr("data-file-index");
            if (typeof fileIndex !== "undefined" && galleryFiles[fileIndex]) {
              filesToUpload.push(galleryFiles[fileIndex]);
              imageMap.push({
                originalIndex: index,
                uploadIndex: filesToUpload.length - 1,
                isNew: true,
              });
            }
          }
        });

        // If there are no files to upload, just use the existing data
        if (filesToUpload.length === 0) {
          const galleryResults = imageMap
            .map((item) => {
              if (!item.isNew) {
                return { id: item.existingId, url: item.existingUrl };
              }
              return null;
            })
            .filter(Boolean);

          $status.text("No new images to upload");
          resolve(galleryResults);
          return;
        }

        // Upload the files
        $status.text("Uploading...");
        rpLib.api.uploadMultipleImages(
          filesToUpload,
          function (progress, total) {
            $status.text(`Uploading ${progress}/${total}...`);
          },
          function (results) {
            // Now rebuild the gallery in the correct order
            const galleryResults = imageMap.map((item) => {
              if (item.isNew) {
                // Use the uploaded file result
                return results[item.uploadIndex];
              } else {
                // Use the existing image data
                return { id: item.existingId, url: item.existingUrl };
              }
            });

            $status.text("Upload complete!");
            resolve(galleryResults);
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
          $('#select-city-notification').removeClass("hidden");
        }
      });

      // Fetch all users after city selection
      $("#city-select").on("change", function () {
        $('#select-city-notification').addClass("hidden");
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
          const reader = new FileReader();

          reader.onload = function (e) {
            // Update the preview
            $(`#${imgPreviewId}`).attr("src", e.target.result);

            // Remove srcset if it exists (it prevents src from showing)
            $(`#${imgPreviewId}`).removeAttr("srcset");
          };

          reader.readAsDataURL(newFile);
          $tempInput.remove();

          // Callback after selecting image
          if (afterImgSelectedCallback) afterImgSelectedCallback(newFile);
        });

      });
    },
    formatWfDate: function (utcDatetimeStr) {
      date = new Date(utcDatetimeStr);

      const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
      const month = monthsShort[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = date.getHours();
      const period = hours >= 12 ? "pm" : "am";
      const hourFormatted = hours % 12 === 0 ? 12 : hours % 12;
      
      return `${month}, ${day}${rpLib.utils.getOrdinalSuffix(day)} ${year} ${hourFormatted}${period}`;
    },
    getOrdinalSuffix: function (day) {
      if (day >= 11 && day <= 13) return "th";
      switch (day % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
      }
    },

    formatWfDateForInputEl: function (utcDatetimeStr) {
      return new Date(utcDatetimeStr).toISOString().slice(0, 16);
    },
    localeDatetimeStrToUtcStr: function (localeDatetimeStr) {
      return new Date(localeDatetimeStr).toISOString();
    },
    setupGalleryImageReplacement: function (galleryPreviewId) {
      $(`#${galleryPreviewId}`).on("click", ".gallery-img", function () {
        // Store the index of the clicked image
        const clickedIndex = $(this).attr("data-index");

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
          const reader = new FileReader();

          reader.onload = function (e) {
            // Update the preview
            $(`#${galleryPreviewId} .thumbnail[data-index="${clickedIndex}"]`).attr("src", e.target.result).addClass("replaced");

            // Add to a special mapping for replaced images
            $(`#${galleryPreviewId}`).data(`replaced-${clickedIndex}`, newFile);
          };

          reader.readAsDataURL(newFile);
          $tempInput.remove();
        });
      });
    },
    initRichTextEditor: function (editorId, placeholderContent = "", existingContent = "") {
      // Reset editor elements
      $(`#${editorId}`).prev('.ql-toolbar').remove();
      $(`#${editorId}`).replaceWith(`<div id="${editorId}">${existingContent}</div>`);

      const quill = new Quill(`#${editorId}`, {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
          ],
        },
        placeholder: placeholderContent,
        theme: 'snow', // or 'bubble'
      });
    },
    cleanQuillInnerHTMLToWf: function (innerHTML) {
      // Remove the cursor span elements from Quill editor innerHTML
      let cleanedHTML = innerHTML.replace(/<span class="ql-cursor">.*?<\/span>/g, '');
      return cleanedHTML;
    },
    formatUrlWithProtocol: function (url) {
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        return 'http://' + url;
      }
      return url; 
    }
  },

  api: {
    fetchAllPaginated: function (url, processData, offset = 0, callback = null) {
      // Disable the dropdown when pagination starts (only for the first call)
      if (offset === 0) {
        $("#city-select").attr("disabled", true);
        // Add a <progress></progress> element to indicate loading
        $("#city-select").closest('#wf-form-city-select-form').after('<progress style="background-attachment: revert !important; position: absolute; margin-top: -18px;"></progress>');
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
            $("#city-select").closest('#wf-form-city-select-form').next('progress').remove();

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
          $("#city-select").closest('#wf-form-city-select-form').next('progress').remove();

          // Invoke the callback even on error
          if (typeof callback === "function") {
            callback();
          }
        },
      });
    },

    fetchUserBrands: function (callback) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/live?slug=${USER_SLUG}&sortBy=lastPublished&sortOrder=desc`;

      if (USER_SLUG.trim() === "") {
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
      rpLib.api.fetchAllPaginated(url, (items) => {
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

          $('.no-collection-items-noti').addClass('hidden');
        });
      },
      0, 
      function () {
        if ($('.collection-item').not('.collection-item-row-template').length === 0) {
          $('.no-collection-items-noti').removeClass('hidden');
        }
      });
    },
    fetchPartnersAndRender: function (brandId) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNERS_COLLECTION_ID}/items/live?sortBy=lastPublished&sortOrder=desc`;

      // Clear existing providers in list
      $("#collection-list .collection-item").not(".collection-item-row-template").remove();

      $("select option:first").attr("disabled", "disabled");

      rpLib.api.fetchAllPaginated(url, (items) => {
        const filteredItems = items
          .filter((item) => item.isArchived === false)
          .filter((item) => item.fieldData.city.includes(brandId));

        filteredItems.forEach((partner) => {
          rpLib.partnersPage.renderPartner(partner);
          $('.no-collection-items-noti').addClass('hidden');
        });
      },
      0,
      function () {
        if ($('.collection-item').not('.collection-item-row-template').length === 0) {
          $('.no-collection-items-noti').removeClass('hidden');
        }
      }); // this is an ugly function call, the 0 represents the offset which should be 0 here cause it's the start of the recursion
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
            if (partner.fieldData["profile-pic"]?.url) {
              $("#profile-pic-preview").attr("src", partner.fieldData["profile-pic"].url);
              $("#profile-pic-preview").removeAttr("srcset");
            } else {
              $("#profile-pic-preview").attr("src", profilePicPlaceholderImg);
            }
            if (partner.fieldData["logo"]?.url) {
              $("#logo-preview").attr("src", partner.fieldData["logo"]?.url);
              $("#logo-preview").removeAttr("srcset");
            } else {
              $("#logo-preview").attr("src", logoPlaceholderImg);
            }
            if (partner.fieldData["advertisement"]?.url) {
              $("#ad-image-preview").attr("src", partner.fieldData["advertisement"]?.url);
              $("#ad-image-preview").removeAttr("srcset");
            } else {
              $("#ad-image-preview").attr("src", adPlaceholderImg);
            }

            // Populate multi-reference fields (dropdown with multiple selections)
            if (partner.fieldData["partner-categories"] && 
                Array.isArray(partner.fieldData["partner-categories"])) {
              $("#partner-categories").val(partner.fieldData["partner-categories"]);
            } else {
              $("#partner-categories").val([]);
            }
            $("#partner-categories").multiselect('reload');

            // Init rich text editor for partner description
            rpLib.utils.initRichTextEditor(
              "partner-description",
              "Share partner bio or info here...",
              partner.fieldData["description"] || ""
            );

            // Show the modal
            $(".collection-item-modal").removeClass("hidden");
          }
        },
        error: function (error) {
          console.error("Error fetching partner details:", error);
        },
      });
    },
    updatePartnerAndRefreshList: function (partnerId, newProfilePicFile, newLogoFile, newAdImageFile) {
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
          "partner-categories": $("#partner-categories").val(), // Multi-reference
        },
      };

      // get description from quill editor
      updatedData.fieldData["description"] = rpLib.utils.cleanQuillInnerHTMLToWf(
        document.querySelector("#partner-description .ql-editor").innerHTML
      );

      // Add profile picture if available
      if (newProfilePicFile) {
        const newImgUrl = $("#profile-pic-preview").attr('src');
        updatedData.fieldData["profile-pic"] = { url: newImgUrl };
      }
      
      // Add logo if available
      if (newLogoFile) {
        const newImgUrl = $("#logo-preview").attr('src');
        updatedData.fieldData["logo"] = { url: newImgUrl };
      }

      // Add advertisement image if available
      if (newAdImageFile) {
        const newAdImage = $("#ad-image-preview").attr('src');
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
            let failedFields = errorRes.responseJSON.details.map((detail) => (
              `${detail.param}—${detail.description}`
            ));
            alert("Error updating partner. Please try again. Failed fields: " + failedFields.join(", "));
          }
          else {
            alert("Error updating partner. Please try again. Error status:" + errorRes.status);
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
            let failedFields = errorRes.responseJSON.details.map((detail) => (
              `${detail.param}—${detail.description}`
            ));
            alert("Error updating partner. Please try again. Failed fields: " + failedFields.join(", "));
          }
          else {
            alert("Error updating partner. Please try again. Error status:" + errorRes.status);
            rpLib.api.fetchPartnersAndRender($("#city-select").val()); // Refresh list
          }
        },
      });
    },
    updateEventShowHide: function (eventId, showEvent) {
      debugger;
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
            let failedFields = errorRes.responseJSON.details.map((detail) => (
              `${detail.param}—${detail.description}`
            ));
            alert("Error updating event. Please try again. Failed fields: " + failedFields.join(", "));
          }
          else {
            alert("Error updating event. Please try again. Error status:" + errorRes.status);
          }
        },
      });
    },
    fetchEventsAndRender: function (brandId) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/live?sortBy=lastPublished&sortOrder=desc`;

      // Clear existing events in list
      $("#collection-list .collection-item").not(".collection-item-row-template").remove();

      rpLib.api.fetchAllPaginated(url, (items) => {
        const filteredItems = items
          .filter((item) => item.isArchived === false)
          .filter((item) => item.fieldData.brand === brandId)

        filteredItems.forEach((event) => {
          rpLib.eventsPage.renderEvent(event);
          $('.no-collection-items-noti').addClass('hidden');
        });
      },
      0, 
      function () {
        if ($('.collection-item').not('.collection-item-row-template').length === 0) {
          $('.no-collection-items-noti').removeClass('hidden');
        }
      });
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
              const localDatetime = rpLib.utils.formatWfDateForInputEl(event.fieldData.date);
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

            // Populate main image
            if (event.fieldData["main-image"]?.url) {
              $("#event-main-image").val(event.fieldData["main-image"]?.url || "");
              $("#main-image-preview").attr("src", event.fieldData["main-image"]?.url).removeAttr("srcset");
            } else {
              $("#main-image-preview").attr("src", eventMainPlaceholderImg);
            }

            // Populate flyer image
            if (event.fieldData["event-flyer"]?.url) {
              $("#event-flyer").val(event.fieldData["event-flyer"]?.url || "");
              $("#event-flyer-preview").attr("src", event.fieldData["event-flyer"]?.url).removeAttr("srcset");
            } else {
              $("#event-flyer-preview").attr("src", logoPlaceholderImg);
            }

            // Store existing galleries in state to handle partial updates
            const existingGallery1 = event.fieldData["image-gallery"] || [];
            const existingGallery2 = event.fieldData["image-gallery-2"] || [];
            const existingGallery3 = event.fieldData["image-gallery-3"] || [];
            rpLib.eventsPage.state.existingGallery1 = existingGallery1;
            rpLib.eventsPage.state.existingGallery2 = existingGallery2;
            rpLib.eventsPage.state.existingGallery3 = existingGallery3;

            // Reset the gallery previews (but keep the add image button)
            $("#gallery-1-preview, #gallery-2-preview, #gallery-3-preview").children(':not(.add-img-btn)').remove();

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
    updateEventAndRefreshList: function (eventId) {
      const eventData = {
        fieldData: {
          name: $("#event-name").val(),
          date: $("#event-date").val(),
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
        },
      };

      // Construct youtube video URLs if that exists
      if (eventData.fieldData["youtube-video-id"]) {
        eventData.fieldData["video"] = {"url": `https://www.youtube.com/watch?v=${eventData.fieldData["youtube-video-id"]}`};
      }      
      if (eventData.fieldData["youtube-video-id-2"]) {
        eventData.fieldData["video-2"] = {"url": `https://www.youtube.com/watch?v=${eventData.fieldData["youtube-video-id-2"]}`};
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
      }
      if (gallery2Images && gallery2Images.length > 0) {
        eventData.fieldData["image-gallery-2"] = gallery2Images;
      }
      if (gallery3Images && gallery3Images.length > 0) {
        eventData.fieldData["image-gallery-3"] = gallery3Images;
      }

      // Save the event data through the API
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/${eventId}/live`,
        method: "PATCH",
        data: JSON.stringify(eventData),
        contentType: "application/json",
        success: function () {
          alert("Success! Event updated. \n\n Click the eyeball icon to view your updates.");

          // Close modal
          $(".collection-item-modal").addClass("hidden");

          // Reset button text and re-enable
          $("#save-event").text("Save");
          $("#save-event").prop("disabled", false);

          // Refresh the event list
          rpLib.api.fetchEventsAndRender($("#city-select").val());
        },
        error: function (error) {
          console.error("Error updating event:", error);
          $("#save-event").text("Save");
          $("#save-event").prop("disabled", false);
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
            if (user.fieldData["profile-picture"]?.url) {
              $("#profile-pic-preview").attr("src", user.fieldData["profile-picture"]?.url);
              $("#profile-pic-preview").removeAttr("srcset");
            } else {
              $("#profile-pic-preview").attr("src", profilePicPlaceholderImg);
            }
            if (user.fieldData["full-picture"]?.url) {
              $("#full-pic-preview").attr("src", user.fieldData["full-picture"]?.url);
              $("#full-pic-preview").removeAttr("srcset");
            } else {
              $("#full-pic-preview").attr("src", profilePicPlaceholderImg);
            }

            // Init rich text editor for user bio
            rpLib.utils.initRichTextEditor(
              "user-bio",
              "Share user bio or info here...",
              user.fieldData.bio || ""
            );

            // Show the modal
            $(".collection-item-modal").removeClass("hidden");
          }
        },
        error: function (error) {
          console.error("Error fetching user details:", error);
        },
      });
    },

    updateUserAndRefreshList: function (userId, newProfilePicFile, newFullPicFile) {
      let updatedData = {
        fieldData: {
          "first-name": $("#user-first-name").val(),
          "last-name": $("#user-last-name").val(),
          title: $("#user-title").val(),
          // get profile picture from data attribute in preview
          "profile-picture": $("#profile-pic-preview").attr("uploaded-image"),
          "full-picture": $("#full-pic-preview").attr("uploaded-image"),
          email: $("#user-email").val(),
          phone: $("#user-phone").val(),
          "url-facebook": $("#user-url-facebook").val(),
          "url-instagram": $("#user-url-instagram").val(),
          "url-x": $("#user-url-x").val(),
          "url-youtube": $("#user-url-youtube").val(),
          "url-linkedin": $("#user-url-linkedin").val(),
          "url-tiktok": $("#user-url-tiktok").val(),
        },
      };

      // get bio from quill editor
      updatedData.fieldData["bio"] = rpLib.utils.cleanQuillInnerHTMLToWf(
        document.querySelector("#user-bio .ql-editor").innerHTML
      );

      // Add profile picture if available
      if (newProfilePicFile) {
        const newImgUrl = $("#profile-pic-preview").attr('src');
        updatedData.fieldData["profile-picture"] = { url: newImgUrl };
      }

      // Add full picture if available
      if (newFullPicFile) {
        const newImgUrl = $("#full-pic-preview").attr('src');
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
    createUserAndRefreshList: function (brandId) {
      // The first and last name are used to create the full name
      const firstName = $("#user-first-name").val();
      const lastName = $("#user-last-name").val();

      let newUserData = {
        fieldData: {
          name: `${firstName} ${lastName}`.trim(), // Combine first and last name
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
          "show-user": true,
          "brand-s": [brandId], // Set the brand relationship
        },
      };

      // get bio from quill editor
      newUserData.fieldData["bio"] = rpLib.utils.cleanQuillInnerHTMLToWf(
        document.querySelector("#user-bio .ql-editor").innerHTML
      );

      // Add profile picture if available
      if (newProfilePic) {
        const newImgUrl = $("#profile-pic-preview").attr('src');
        newUserData.fieldData["profile-picture"] = { url: newImgUrl };
      }

      // Add full picture if available
      if (newFullPic) {
        const newImgUrl = $("#full-pic-preview").attr('src');
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
      });
    },
    createPartnerAndRefreshList: function (brandId, newProfilePicFile, newLogoFile, newAdImageFile) {
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
          "partner-categories": $("#partner-categories").val(), // Multi-reference
          // Set the brand relationship
          brand: brandId,
          city: [brandId],
        },
      };

      // get description from quill editor
      newPartnerData.fieldData["description"] = rpLib.utils.cleanQuillInnerHTMLToWf(
        document.querySelector("#partner-description .ql-editor").innerHTML
      );

      // Add profile picture if available
      if (newProfilePicFile) {
        const newImgUrl = $("#profile-pic-preview").attr('src');
        newPartnerData.fieldData["profile-pic"] = { url: newImgUrl };
      }
      
      // Add logo if available
      if (newLogoFile) {
        const newImgUrl = $("#logo-preview").attr('src');
        newPartnerData.fieldData["logo"] = { url: newImgUrl };
      }

      // Add advertisement image if available
      if (newAdImageFile) {
        const newAdImage = $("#ad-image-preview").attr('src');
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
            let failedFields = errorRes.responseJSON.details.map((detail) => (
              `${detail.param}—${detail.description}`
            ));
            alert("Error creating partner. Please try again. Failed fields: " + failedFields.join(", "));
          }
          else {
            console.error("Error creating partner:", errorRes);
            alert("Failed to create partner. Please try again. " + errorRes.responseJSON?.message);
          }
        },
      });
    },
    createEventAndRefreshList: function (brandId) {
      let newEventData = {
        fieldData: {
          name: $("#event-name").val(),
          date: $("#event-date").val(),
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
          // Set the brand relationship
          brand: brandId,
        },
      };

      // Construct youtube video URLs if that exists
      if (newEventData.fieldData["youtube-video-id"]) {
        newEeventData.fieldData["video"] = {"url": `https://www.youtube.com/watch?v=${eventData.fieldData["youtube-video-id"]}`};
      }
      if (newEventData.fieldData["youtube-video-id-2"]) {
        newEventData.fieldData["video-2"] = {"url": `https://www.youtube.com/watch?v=${eventData.fieldData["youtube-video-id-2"]}`};
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
          alert("Success! Event created. \n\n Click the eyeball icon to view your updates.");
          $(".collection-item-modal").addClass("hidden");
          // Refresh list
          rpLib.api.fetchEventsAndRender(brandId);
        },
        error: function (error) {
          console.error("Error creating event:", error);
          alert("Failed to create event. Please check the console for details.");
        },
      });
    },
    fetchAllPartnerCategories: function (callback) {
      const allCategories = [];
      
      // URL for the categories endpoint
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNER_CATEGORIES_COLLECTION_ID}/items?limit=100&sortBy=name&sortOrder=asc`;
      
      // Process function to collect all categories
      const processCategories = function(items) {
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
