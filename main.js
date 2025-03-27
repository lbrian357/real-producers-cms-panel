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
      rpLib.utils.initCitySelection();
    },
  },
  usersPage: {
    init: function () {
      // Append modal dynamically for editing user details until frontend components are available
      $("body").append(`
        <div id="collection-item-modal" class="hidden collection-item-modal">
            <div class="collection-item-modal-content">
                <h3>Edit User</h3>
                <label>First Name:</label><input type="text" id="user-first-name">
                <label>Last Name:</label><input type="text" id="user-last-name">
                <label>Title:</label><input type="text" id="user-title">
                
                <div>
                    <label>Profile Picture:</label>
                    <div class="image-upload-container">
                        <div class="upload-section">
                            <span id="profile-pic-upload-status"></span>
                        </div>
                        <div class="image-preview">
                            <img id="profile-pic-preview" src="" alt="Profile Picture Preview">
                        </div>
                    </div>
                </div>
                
                <div>
                    <label>Full Picture:</label>
                    <div class="image-upload-container">
                        <div class="upload-section">
                            <span id="full-pic-upload-status"></span>
                        </div>
                        <div class="image-preview">
                            <img id="full-pic-preview" src="" alt="Full Picture Preview">
                        </div>
                    </div>
                </div>
                
                <label>Email:</label><input type="email" id="user-email">
                <label>Phone:</label><input type="text" id="user-phone">
                <label>Bio:</label><textarea id="user-bio"></textarea>
                <label>URL Facebook:</label><input type="text" id="user-url-facebook">
                <label>URL Instagram:</label><input type="text" id="user-url-instagram">
                <label>URL X:</label><input type="text" id="user-url-x">
                <label>URL YouTube:</label><input type="text" id="user-url-youtube">
                <label>URL LinkedIn:</label><input type="text" id="user-url-linkedin">
                <label>URL TikTok:</label><input type="text" id="user-url-tiktok">
                <label>Facebook Pixel ID:</label><input type="text" id="user-facebook-pixel-id">
                <label>Google Analytics ID:</label><input type="text" id="user-google-analytics-id">
                <button id="save-user">Save</button>
                <button id="close-modal">Close</button>
            </div>
        </div>
      `);
      // Add CSS for the image upload components until frontend components are available
      $("head").append(`
      <style>
        .image-upload-container {
            margin-bottom: 15px;
        }
        .upload-section {
            margin: 10px 0;
            display: flex;
            align-items: center;
        }
        .upload-section span {
            margin-left: 10px;
            font-size: 0.85em;
            color: #666;
        }
        .image-preview {
            margin-top: 10px;
        }
        .image-preview img {
            max-width: 150px;
            max-height: 150px;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 3px;
        }
      </style>
      `);

      rpLib.utils.initCitySelection( function(brandId) {
          rpLib.api.fetchBrandUsersAndRender(brandId);

          // Set View All link
          const citySlug = $("#city-select option:selected").attr("data-slug");
          $('a#view-all').attr('href', `http://www.realproducersmagazine.com/users/${citySlug}`);
      });

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
        $("#user-facebook-pixel-id").val("");
        $("#user-google-analytics-id").val("");

        // Clear image previews
        $("#profile-pic-preview").attr("src", "");
        $("#full-pic-preview").attr("src", "");
        $("#profile-pic-upload-status").text("");
        $("#full-pic-upload-status").text("");

        // Show the modal
        $(".collection-item-modal").removeClass("hidden");
      });

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

      // Close modal
      $("#close-modal").on("click", function () {
        $(".collection-item-modal").addClass("hidden");
      });

      // Store file references
      let profilePicFile = null;
      let fullPicFile = null;

      // On profile pic preview replacement click, open file dialog
      rpLib.utils.setupSingleImgPreviewReplacement("profile-pic-preview", function(newFile) {
        $("#profile-pic-upload-status").text("Image selected (will upload when saved)");
        profilePicFile = newFile;
      });

      // On full pic preview replacement click, open file dialog
      rpLib.utils.setupSingleImgPreviewReplacement("full-pic-preview", function(newFile) {
        $("#full-pic-upload-status").text("Image selected (will upload when saved)");
        fullPicFile = newFile;
      });

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

      // Save user details
      $("#save-user").on("click", function () {
        const userId = $(".collection-item-modal").attr("data-user-id");
        const isCreatingNewUser = !userId; // Check if we're creating a new user

        let uploadPromises = [];

        // Show saving status
        $("#save-user").text("Uploading images...");
        $("#save-user").prop("disabled", true);

        // Upload profile pic if needed
        if (profilePicFile) {
          $("#profile-pic-upload-status").text("Uploading...");
          let profilePicPromise = new Promise((resolve) => {
            rpLib.api.uploadImage(
              profilePicFile,
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

        // Upload full pic if needed
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
          // Store the uploaded image URLs in the preview fields data attribute
          if (profilePicFile) {
            $("#profile-pic-preview").attr("data-uploaded-image", results[0]);
          }
          if (fullPicFile) {
            $("#full-pic-preview").attr("data-uploaded-image", results[1]);
          }

          if (isCreatingNewUser) {
            rpLib.api.createUserAndRefreshList($("#city-select").val());
          } else {
            rpLib.api.updateUserAndRefreshList(userId);
          }

          // Reset button text and re-enable it
          $("#save-user").text("Save");
          $("#save-user").prop("disabled", false);

          // Close the modal
          $(".collection-item-modal").addClass("hidden");
        });
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

      $("#collection-list").append(templateRowItem);
    },
  },
  partnersPage: {
    init: function () {
      // // Append modal dynamically for now until frontend components are available
      // $("body").append(`
      //     <div id="collection-item-modal" class="hidden collection-item-modal">
      //         <div class="collection-item-modal-content">
      //             <h3>Edit Partner</h3>
      //             <label>Name:</label><input type="text" id="partner-name">
      //             <label>Company:</label><input type="text" id="partner-company">

      //             <!-- Profile Picture -->
      //             <div>
      //                 <label>Profile Picture:</label>
      //                 <div class="image-upload-container">
      //                     <div class="upload-section">
      //                         <span id="profile-pic-upload-status"></span>
      //                     </div>
      //                     <div class="image-preview">
      //                         <img id="profile-pic-preview" src="" alt="Profile Picture Preview">
      //                     </div>
      //                 </div>
      //             </div>

      //             <!-- Logo -->
      //             <div>
      //                 <label>Logo:</label>
      //                 <div class="image-upload-container">
      //                     <div class="upload-section">
      //                         <span id="logo-upload-status"></span>
      //                     </div>
      //                     <div class="image-preview">
      //                         <img id="logo-preview" src="" alt="Logo Preview">
      //                     </div>
      //                 </div>
      //             </div>

      //             <!-- Advertisement Image -->
      //             <div>
      //                 <label>Advertisement Image:</label>
      //                 <div class="image-upload-container">
      //                     <div class="upload-section">
      //                         <span id="ad-image-upload-status"></span>
      //                     </div>
      //                     <div class="image-preview">
      //                         <img id="ad-image-preview" src="" alt="Advertisement Image Preview">
      //                     </div>
      //                 </div>
      //             </div>

      //             <label>Title:</label><input type="text" id="partner-title">
      //             <label>Phone:</label><input type="text" id="partner-phone">
      //             <label>Email:</label><input type="email" id="partner-email">
      //             <label>Website:</label><input type="text" id="partner-website">
      //             <label>License Number:</label><input type="text" id="partner-license">
      //             <label>Facebook:</label><input type="text" id="partner-facebook">
      //             <label>Instagram:</label><input type="text" id="partner-instagram">
      //             <label>X (Twitter):</label><input type="text" id="partner-x">
      //             <label>YouTube:</label><input type="text" id="partner-youtube">
      //             <label>LinkedIn:</label><input type="text" id="partner-linkedin">
      //             <label>TikTok:</label><input type="text" id="partner-tiktok">
      //             <label>Description:</label><textarea id="partner-description"></textarea>
      //             <label>Preview Text:</label><input type="text" id="partner-preview-text">
      //             <label>Address:</label><input type="text" id="partner-address">
      //             <label>City, State Zip:</label><input type="text" id="partner-city">
      //             <label>Show on Website:</label><input type="checkbox" id="partner-show">
      //             <label>Partner Categories:</label>
      //             <select id="partner-categories" multiple>
      //                 <option value="65e96b6acdfd2898d9dc2be8">Category 1</option>
      //                 <option value="some-other-id">Category 2</option>
      //             </select>
      //             <button id="save-partner">Save</button>
      //             <button id="close-modal">Close</button>
      //         </div>
      //     </div>
      // `);



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
          rpLib.api.fetchPartnersAndRender(brandId);

          // Set View All link
          const citySlug = $("#city-select option:selected").attr("data-slug");
          $('a#view-all').attr('href', `http://www.realproducersmagazine.com/partners/${citySlug}`);
        });
      });

      // Store file references for image uploads
      let profilePicFile = null;
      let logoFile = null;
      let adImageFile = null;

      // On image preview replacement click, open file dialog
      rpLib.utils.setupSingleImgPreviewReplacement("profile-pic-preview", function(newFile) {
        // Update the status text after selecting a new image
        $("#profile-pic-upload-status").text("Image selected (will upload when saved)");

        // Update the state/variable to indicate a new file was selected
        profilePicFile = newFile;
      });
      rpLib.utils.setupSingleImgPreviewReplacement("logo-preview", function(newFile) {
        $("#logo-upload-status").text("Image selected (will upload when saved)");
        logoFile = newFile;
      });
      rpLib.utils.setupSingleImgPreviewReplacement("ad-image-preview", function(newFile) {
        $("#ad-image-upload-status").text("Image selected (will upload when saved)");
        adImageFile = newFile;
      });

      // On create new partner click
      $("body").on("click", ".lib-create-item-btn", function (event) {
        // Reset image file references
        profilePicFile = null;
        logoFile = null;
        adImageFile = null;

        rpLib.partnersPage.handleCreatePartnerClick(profilePicFile, logoFile, adImageFile);
      });

      // On edit button click open modal
      $("body").on("click", ".item-edit-btn", function (event) {
        // Reset image file references
        profilePicFile = null;
        logoFile = null;
        adImageFile = null;

        const partnerId = $(this).closest(".collection-item").attr("data-partner-id");
        const slug = $(this).closest(".collection-item").attr("data-slug");

        // Set the modal partner ID for editing
        $(".collection-item-modal").attr("data-partner-id", partnerId);

        rpLib.api.fetchPartnerDetailsAndOpenModal(slug);
      });

      // Event listener on url inputs to add "http://" to website URL if not present
      $(document).on('blur', '.collection-item-modal input[type="url"]', function() {
        let url = $(this).val().trim();
    
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            $(this).val('http://' + url);
        }
      });

      // On modal save click
      $("#save-partner").on("click", function () {
        rpLib.partnersPage.handleSavePartnerClick(profilePicFile, logoFile, adImageFile);
      });

      // On close modal
      $("#close-modal").on("click", function () {
        // Ask for confirmation before closing the modal
        if (confirm("Are you sure you want to close the modal? Any unsaved changes will be lost.")) {
          $(".collection-item-modal").addClass("hidden");
        }
      });

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

    handleCreatePartnerClick: function (profilePicFile, logoFile, adImageFile) {
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
    init: function () {
      // Append modal dynamically for now until frontend components are available
      $("body").append(`
        <div id="collection-item-modal" class="hidden collection-item-modal" data-event-id="">
          <div class="collection-item-modal-content">
              <h3>Edit Event</h3>
              <label>Name:</label><input type="text" id="event-name">
              <label>Date:</label><input type="datetime-local" id="event-date">
              <label>Location Name:</label><input type="text" id="event-location-name">
              <label>Location Address:</label><input type="text" id="event-location-address">
              <label>Button URL:</label><input type="text" id="button-url">
              <label>Button Text:</label><input type="text" id="button-text">
              <label>Show on Website:</label><input type="checkbox" id="event-show">
              
              <!-- Main Image -->
              <div>
                  <label>Main Image:</label>
                  <div class="image-upload-container">
                      <div class="upload-section">
                          <span id="main-image-upload-status"></span>
                      </div>
                      <div class="image-preview">
                          <img id="main-image-preview" src="" alt="Main Image Preview">
                      </div>
                  </div>
              </div>
              
              <!-- Image Gallery 1 -->
              <div>
                  <label>Image Gallery 1:</label>
                  <div class="image-upload-container">
                      <div class="upload-section">
                          <input type="file" id="gallery-1-upload" accept="image/*" multiple>
                          <span id="gallery-1-upload-status"></span>
                      </div>
                      <div class="gallery-preview" id="gallery-1-preview">
                          <!-- Preview thumbnails will be inserted here -->
                      </div>
                  </div>
              </div>
              
              <!-- Image Gallery 2 -->
              <div>
                  <label>Image Gallery 2:</label>
                  <div class="image-upload-container">
                      <div class="upload-section">
                          <input type="file" id="gallery-2-upload" accept="image/*" multiple>
                          <span id="gallery-2-upload-status"></span>
                      </div>
                      <div class="gallery-preview" id="gallery-2-preview">
                          <!-- Preview thumbnails will be inserted here -->
                      </div>
                  </div>
              </div>
              
              <!-- Image Gallery 3 -->
              <div>
                  <label>Image Gallery 3:</label>
                  <div class="image-upload-container">
                      <div class="upload-section">
                          <input type="file" id="gallery-3-upload" accept="image/*" multiple>
                          <span id="gallery-3-upload-status"></span>
                      </div>
                      <div class="gallery-preview" id="gallery-3-preview">
                          <!-- Preview thumbnails will be inserted here -->
                      </div>
                  </div>
              </div>
              
              <label>Event Flyer URL:</label><input type="text" id="event-flyer">
              <label>YouTube Video ID:</label><input type="text" id="youtube-video-id">
              <label>YouTube Video ID 2:</label><input type="text" id="youtube-video-id-2">
              <label>Description:</label><textarea id="event-description"></textarea>
              <label>Sponsor Event Button URL:</label><input type="text" id="sponsor-event-button-url">
              <label>Sponsor Event Button Text:</label><input type="text" id="sponsor-event-button-text">
              <button id="save-event">Save</button>
              <button id="close-modal">Close</button>
          </div>
        </div>
      `);

      // Add CSS for the image upload components
      $("head").append(`
        <style>
          .image-upload-container {
              margin-bottom: 15px;
          }
          .upload-section {
              margin: 10px 0;
              display: flex;
              align-items: center;
          }
          .upload-section span {
              margin-left: 10px;
              font-size: 0.85em;
              color: #666;
          }
          .image-preview {
              margin-top: 10px;
          }
          .image-preview img {
              max-width: 150px;
              max-height: 150px;
              border: 1px solid #ddd;
              border-radius: 4px;
              padding: 3px;
          }
          .gallery-preview {
              display: flex;
              flex-wrap: wrap;
              gap: 5px;
              margin-top: 10px;
          }
          .gallery-preview .thumbnail {
              width: 80px;
              height: 80px;
              object-fit: cover;
              border: 1px solid #ddd;
              border-radius: 4px;
          }
          .gallery-counter {
              display: block;
              margin: 5px 0;
              font-size: 0.8em;
              color: #666;
          }
        </style>
      `);

      // Initialize file storage
      let mainImageFile = null;
      let gallery1Files = [];
      let gallery2Files = [];
      let gallery3Files = [];

      // Existing event data storage
      let existingGallery1 = [];
      let existingGallery2 = [];
      let existingGallery3 = [];

      // On main image preview replacement click, open file dialog
      rpLib.utils.setupSingleImgPreviewReplacement("main-image-preview", function(newFile) {
        // Update the status text after selecting a new image
        $("#main-image-upload-status").text("Image selected (will upload when saved)");

        // Update the variable to indicate a new file was selected
        mainImageFile = newFile;
      });

      // Gallery 1 Preview Handler
      $("#gallery-1-upload").on("change", function (e) {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        // Get current images count (both existing and newly added)
        const currentCount = $("#gallery-1-preview img").length;

        // Check if adding these files would exceed the limit
        if (currentCount + files.length > 25) {
          const remaining = 25 - currentCount;
          alert(`You can only add ${remaining} more image${remaining !== 1 ? "s" : ""}. Please select fewer images.`);
          $(this).val(""); // Reset the input
          return;
        }

        // Add new files to the array
        gallery1Files = [...gallery1Files, ...files];

        // Show preview for each file
        files.forEach((file, index) => {
          rpLib.utils.addImageToGallery("gallery-1", file, index);
        });
      });

      // Gallery 2 Preview Handler
      $("#gallery-2-upload").on("change", function (e) {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        // Get current images count
        const currentCount = $("#gallery-2-preview img").length;

        // Check if adding these files would exceed the limit
        if (currentCount + files.length > 25) {
          const remaining = 25 - currentCount;
          alert(`You can only add ${remaining} more image${remaining !== 1 ? "s" : ""}. Please select fewer images.`);
          $(this).val(""); // Reset the input
          return;
        }

        // Add new files to the array
        gallery2Files = [...gallery2Files, ...files];

        // Show preview for each file
        files.forEach((file, index) => {
          rpLib.utils.addImageToGallery("gallery-2", file, index);
        });
      });

      // Gallery 3 Preview Handler
      $("#gallery-3-upload").on("change", function (e) {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        // Get current images count
        const currentCount = $("#gallery-3-preview img").length;

        // Check if adding these files would exceed the limit
        if (currentCount + files.length > 25) {
          const remaining = 25 - currentCount;
          alert(`You can only add ${remaining} more image${remaining !== 1 ? "s" : ""}. Please select fewer images.`);
          $(this).val(""); // Reset the input
          return;
        }

        // Add new files to the array
        gallery3Files = [...gallery3Files, ...files];

        // Show preview for each file
        files.forEach((file, index) => {
          rpLib.utils.addImageToGallery("gallery-3", file, index);
        });
      });

      // Setup the image replacement for all galleries
      rpLib.utils.setupGalleryImageReplacement("gallery-1-preview");
      rpLib.utils.setupGalleryImageReplacement("gallery-2-preview");
      rpLib.utils.setupGalleryImageReplacement("gallery-3-preview");

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
        $("#event-flyer").val("");
        $("#youtube-video-id").val("");
        $("#youtube-video-id-2").val("");
        $("#event-description").val("");
        $("#sponsor-event-button-url").val("");
        $("#sponsor-event-button-text").val("");

        // Clear image previews
        $("#main-image-preview").attr("src", "");
        $("#main-image-upload-status").text("");
        $("#gallery-1-preview").empty();
        $("#gallery-1-upload-status").text("");
        $("#gallery-2-preview").empty();
        $("#gallery-2-upload-status").text("");
        $("#gallery-3-preview").empty();
        $("#gallery-3-upload-status").text("");

        // Reset file variables
        mainImageFile = null;
        gallery1Files = [];
        gallery2Files = [];
        gallery3Files = [];

        // Reset existing gallery data
        existingGallery1 = [];
        existingGallery2 = [];
        existingGallery3 = [];

        // Enable upload inputs
        $("#gallery-1-upload").prop("disabled", false);
        $("#gallery-2-upload").prop("disabled", false);
        $("#gallery-3-upload").prop("disabled", false);

        // Show the modal
        $(".collection-item-modal").removeClass("hidden");
      });

      // Save event with image uploads
      $("body #save-event").on("click", function () {
        const eventId = $(".collection-item-modal").attr("data-event-id");
        const isCreatingNewEvent = !eventId; // Check if we're creating a new event

        // Show saving status
        $("#save-event").text("Uploading images...");
        $("#save-event").prop("disabled", true);

        let uploadPromises = [];

        // Upload main image if selected
        if (mainImageFile) {
          $("#main-image-upload-status").text("Uploading...");
          let mainImagePromise = new Promise((resolve) => {
            rpLib.api.uploadImage(
              mainImageFile,
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

        // Handle each gallery upload
        let gallery1Promise = rpLib.utils.handleGalleryUpload("gallery-1", gallery1Files);
        let gallery2Promise = rpLib.utils.handleGalleryUpload("gallery-2", gallery2Files);
        let gallery3Promise = rpLib.utils.handleGalleryUpload("gallery-3", gallery3Files);

        uploadPromises.push(gallery1Promise, gallery2Promise, gallery3Promise);

        // Wait for all uploads to finish before saving
        Promise.all(uploadPromises).then((results) => {
          // Store the uploaded gallery data
          if (results.length >= 4) {
            // There are 4 promises now (main image + 3 galleries)
            $("#main-image-preview").data("uploaded-image", results[0]);
            $("#gallery-1-preview").data("uploaded-images", results[1]); // Offset by 1 due to main image
            $("#gallery-2-preview").data("uploaded-images", results[2]);
            $("#gallery-3-preview").data("uploaded-images", results[3]);
          } else if (results.length >= 3) {
            $("#gallery-1-preview").data("uploaded-images", results[0]);
            $("#gallery-2-preview").data("uploaded-images", results[1]);
            $("#gallery-3-preview").data("uploaded-images", results[2]);
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

          // Close the modal
          $(".collection-item-modal").addClass("hidden");
        });
      });

      rpLib.utils.initCitySelection(function (brandId) {
        rpLib.api.fetchEventsAndRender(brandId);

          // Set View All link
          const citySlug = $("#city-select option:selected").attr("data-slug");
          $('a#view-all').attr('href', `http://www.realproducersmagazine.com/events/${citySlug}`);
      });

      $("#collection-list").on("click", ".item-edit-btn", function () {
        let eventId = $(this).closest(".collection-item").attr("data-event-id");
        let slug = $(this).closest(".collection-item").attr("data-slug");

        // Update modal title for editing
        $(".collection-item-modal").find("h3").text("Edit Event");

        // Set the event ID for editing
        $(".collection-item-modal").attr("data-event-id", eventId);

        rpLib.api.fetchEventDetailsAndOpenModal(slug);
      });
      $("body #close-modal").on("click", function () {
        $(".collection-item-modal").addClass("hidden");
      });

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
        const index = $(`#${galleryId}-preview img`).length;
        const img = $("<img>")
          .addClass("thumbnail")
          .attr("src", e.target.result)
          .attr("data-index", index)
          .attr("data-file-index", fileIndex)
          .attr("title", "Click to replace this image");
        $(`#${galleryId}-preview`).append(img);

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
          const galleryNum = galleryId.split("-")[1];
          if (galleryNum === "1") resolve(existingGallery1);
          else if (galleryNum === "2") resolve(existingGallery2);
          else if (galleryNum === "3") resolve(existingGallery3);
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
            const replacementFile = $preview.attr(`data-replaced-${index}`);
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
      const $uploadInput = $(`#${galleryId}-upload`);
      const $statusEl = $(`#${galleryId}-upload-status`);

      if (count >= maxImages) {
        $uploadInput.prop("disabled", true);
        $statusEl.text(`Maximum limit of ${maxImages} images reached`);
        $statusEl.css("color", "red");
      } else {
        $uploadInput.prop("disabled", false);
        $statusEl.text(`${count} images (${maxImages - count} more allowed)`);
        $statusEl.css("color", "#666");
      }
    },
    initCitySelection: function (callback) {
      // Fetch all brands for city selection dropdown and populate the dropdown
      rpLib.api.fetchUserBrands(() => {
        // Set the last selected city if available
        const lastSelectedCity = sessionStorage.getItem("selectedCity");

        if (lastSelectedCity) {
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
      $(`#${galleryPreviewId}`).on("click", ".thumbnail", function () {
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
            $(`#${galleryPreviewId}`).attr(`data-replaced-${clickedIndex}`, newFile);
          };

          reader.readAsDataURL(newFile);
          $tempInput.remove();
        });
      });
    },
    initRichTextEditor: function (editorId, placeholderContent = "", existingContent = "") {
      // Reset editor elements
      $(`#${editorId}`).prev('.ql-toolbar').remove();
      $("#partner-description").replaceWith(`<div id="partner-description">${existingContent}</div>`);

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
      const USER_SLUG = $("[data-ms-member='wf-users-slug']").text();
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/live?slug=${USER_SLUG}&sortBy=lastPublished&sortOrder=desc`;

      rpLib.api.fetchAllPaginated(url, (items) => {
        if (items.length > 0) {
          let brands = items[0].fieldData["brand-s"];
          let fetchBrandPromises = brands.map((brandId) => rpLib.api.fetchBrandDetailsAndPopulateDropdown(brandId));
    
          // Wait for all brand details to be fetched and dropdown to be populated
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
              partner.fieldData["description"]
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
          description: $("#partner-description").val(),
          "preview-text": $("#partner-preview-text").val(),
          address: $("#partner-address").val(),
          "city-state-zip": $("#partner-city").val(),
          "show-partner": $("#partner-show").prop("checked"),
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
          alert("Partner updated!");
          $(".collection-item-modal").addClass("hidden");
          rpLib.api.fetchPartnersAndRender($("#city-select").val()); // Refresh list
        },
        error: function (errorRes) {
          console.error("Error updating partner:", errorRes);

          // Handle Validation Error and list the fields that failed validation in the alert
          if (errorRes.responseJSON && errorRes.responseJSON?.code === "validation_error" && errorRes.responseJSON.details ) {
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
            $("#event-flyer").val(event.fieldData["event-flyer"] || "");
            $("#youtube-video-id").val(event.fieldData["youtube-video-id"] || "");
            $("#youtube-video-id-2").val(event.fieldData["youtube-video-id-2"] || "");
            $("#event-description").val(event.fieldData.description || "");
            $("#sponsor-event-button-url").val(event.fieldData["sponsor-event-button-url"] || "");
            $("#sponsor-event-button-text").val(event.fieldData["sponsor-event-button-text"] || "");
            $("#event-show").prop("checked", event.fieldData["show-event"]);

            // Populate main image
            $("#event-main-image").val(event.fieldData["main-image"]?.url || "");
            $("#main-image-preview").attr("src", event.fieldData["main-image"]?.url || "");

            // Store existing galleries to handle partial updates
            existingGallery1 = event.fieldData["image-gallery"] || [];
            existingGallery2 = event.fieldData["image-gallery-2"] || [];
            existingGallery3 = event.fieldData["image-gallery-3"] || [];

            // Reset the gallery previews
            $("#gallery-1-preview").empty();
            $("#gallery-2-preview").empty();
            $("#gallery-3-preview").empty();

            // Reset the file arrays for new uploads
            gallery1Files = [];
            gallery2Files = [];
            gallery3Files = [];

            // Display existing gallery 1 images
            if (existingGallery1.length > 0) {
              existingGallery1.forEach((img, index) => {
                if (img && img.url) {
                  const imgEl = $("<img>")
                    .addClass("thumbnail")
                    .attr("src", img.url)
                    .attr("data-index", index)
                    .attr("data-image-id", img.id)
                    .attr("data-existing", true)
                    .attr("title", "Click to replace this image");
                  $("#gallery-1-preview").append(imgEl);
                }
              });

              // Update limits display
              rpLib.utils.updateGalleryLimits("gallery-1", existingGallery1.length);
            }

            // Display existing gallery 2 images
            if (existingGallery2.length > 0) {
              existingGallery2.forEach((img, index) => {
                if (img && img.url) {
                  const imgEl = $("<img>")
                    .addClass("thumbnail")
                    .attr("src", img.url)
                    .attr("data-index", index)
                    .attr("data-image-id", img.id)
                    .attr("data-existing", true)
                    .attr("title", "Click to replace this image");
                  $("#gallery-2-preview").append(imgEl);
                }
              });

              // Update limits display
              rpLib.utils.updateGalleryLimits("gallery-2", existingGallery2.length);
            }

            // Display existing gallery 3 images
            if (existingGallery3.length > 0) {
              existingGallery3.forEach((img, index) => {
                if (img && img.url) {
                  const imgEl = $("<img>")
                    .addClass("thumbnail")
                    .attr("src", img.url)
                    .attr("data-index", index)
                    .attr("data-image-id", img.id)
                    .attr("data-existing", true)
                    .attr("title", "Click to replace this image");
                  $("#gallery-3-preview").append(imgEl);
                }
              });

              // Update limits display
              rpLib.utils.updateGalleryLimits("gallery-3", existingGallery3.length);
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
          "show-event": $("#event-show").is(":checked"),
        },
      };

      // Construct youtube video URLs if that exists
      if (eventData.fieldData["youtube-video-id"]) {
        eventData.fieldData["video"] = {"url": `https://youtu.be/${eventData.fieldData["youtube-video-id"]}`};
      }
      if (eventData.fieldData["youtube-video-id-2"]) {
        eventData.fieldData["video-2"] = {"url": `https://youtu.be/${eventData.fieldData["youtube-video-id-2"]}`};
      }

      // Add main image if there's one uploaded
      const newMainImage = $("#main-image-preview").attr("data-uploaded-image");
      if (newMainImage && newMainImage.url) {
        eventData.fieldData["main-image"] = newMainImage;
      }

      // Get the gallery data that was uploaded and processed
      const newGallery1Images = $("#gallery-1-preview").data("uploaded-images");
      const newGallery2Images = $("#gallery-2-preview").data("uploaded-images");
      const newGallery3Images = $("#gallery-3-preview").data("uploaded-images");

      // Add galleries to the event data if they have images
      if (newGallery1Images && newGallery1Images.length > 0) {
        eventData.fieldData["image-gallery"] = newGallery1Images;
      }

      if (newGallery2Images && newGallery2Images.length > 0) {
        eventData.fieldData["image-gallery-2"] = newGallery2Images;
      }

      if (newGallery3Images && newGallery3Images.length > 0) {
        eventData.fieldData["image-gallery-3"] = newGallery3Images;
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
            $("#profile-pic-preview").attr("src", user.fieldData["profile-picture"]?.url || "");
            $("#user-full-pic").val(user.fieldData["full-picture"]?.url || "");
            $("#full-pic-preview").attr("src", user.fieldData["full-picture"]?.url || "");
            $("#user-email").val(user.fieldData.email || "");
            $("#user-phone").val(user.fieldData.phone || "");
            $("#user-bio").val(user.fieldData.bio || "");
            $("#user-url-facebook").val(user.fieldData["url-facebook"] || "");
            $("#user-url-instagram").val(user.fieldData["url-instagram"] || "");
            $("#user-url-x").val(user.fieldData["url-x"] || "");
            $("#user-url-youtube").val(user.fieldData["url-youtube"] || "");
            $("#user-url-linkedin").val(user.fieldData["url-linkedin"] || "");
            $("#user-url-tiktok").val(user.fieldData["url-tiktok"] || "");
            $("#user-facebook-pixel-id").val(user.fieldData["facebook-pixel-id"] || "");
            $("#user-google-analytics-id").val(user.fieldData["google-analytics-id"] || "");

            $(".collection-item-modal").removeClass("hidden");
          }
        },
        error: function (error) {
          console.error("Error fetching user details:", error);
        },
      });
    },

    updateUserAndRefreshList: function (userId) {
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
          bio: $("#user-bio").val(),
          "url-facebook": $("#user-url-facebook").val(),
          "url-instagram": $("#user-url-instagram").val(),
          "url-x": $("#user-url-x").val(),
          "url-youtube": $("#user-url-youtube").val(),
          "url-linkedin": $("#user-url-linkedin").val(),
          "url-tiktok": $("#user-url-tiktok").val(),
          "facebook-pixel-id": $("#user-facebook-pixel-id").val(),
          "google-analytics-id": $("#user-google-analytics-id").val(),
        },
      };

      // Add profile picture if available
      let newProfilePic = $("#profile-pic-preview").attr("data-uploaded-image");
      if (newProfilePic && newProfilePic.url) {
        updatedData.fieldData["profile-picture"] = newProfilePic;
      }

      // Add full picture if available
      let newFullPic = $("#full-pic-preview").attr("data-uploaded-image");
      if (newFullPic && newFullPic.url) {
        updatedData.fieldData["full-picture"] = newFullPic;
      }

      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/${userId}/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        data: JSON.stringify(updatedData),
        success: function () {
          alert("User updated!");
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
          bio: $("#user-bio").val(),
          "url-facebook": $("#user-url-facebook").val(),
          "url-instagram": $("#user-url-instagram").val(),
          "url-x": $("#user-url-x").val(),
          "url-youtube": $("#user-url-youtube").val(),
          "url-linkedin": $("#user-url-linkedin").val(),
          "url-tiktok": $("#user-url-tiktok").val(),
          "facebook-pixel-id": $("#user-facebook-pixel-id").val(),
          "google-analytics-id": $("#user-google-analytics-id").val(),
          // Set the brand relationship
          "brand-s": [brandId],
        },
      };

      // Add profile picture if available
      let newProfilePic = $("#profile-pic-preview").attr("data-uploaded-image");
      if (newProfilePic && newProfilePic.url) {
        newUserData.fieldData["profile-picture"] = newProfilePic;
      }

      // Add full picture if available
      let newFullPic = $("#full-pic-preview").attr("data-uploaded-image");
      if (newFullPic && newFullPic.url) {
        newUserData.fieldData["full-picture"] = newFullPic;
      }

      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        data: JSON.stringify(newUserData),
        success: function (response) {
          alert("New user created successfully!");
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
          description: $("#partner-description").val(),
          "preview-text": $("#partner-preview-text").val(),
          address: $("#partner-address").val(),
          "city-state-zip": $("#partner-city").val(),
          "show-partner": $("#partner-show").prop("checked"),
          "partner-categories": $("#partner-categories").val(), // Multi-reference
          // Set the brand relationship
          brand: brandId,
          city: [brandId],
        },
      };

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
          alert("New partner created successfully!");
          $(".collection-item-modal").addClass("hidden");
          // Refresh list
          rpLib.api.fetchPartnersAndRender(brandId);
        },
        error: function (errorRes) {
          // Handle Validation Error and list the fields that failed validation in the alert
          if (errorRes.responseJSON && errorRes.responseJSON?.code === "validation_error" && errorRes.responseJSON.details ) {
            let failedFields = errorRes.responseJSON.details.map((detail) => (
              `${detail.param}—${detail.description}`
            ));
            alert("Error creating partner. Please try again. Failed fields: " + failedFields.join(", "));
          }
          else {
            console.error("Error creating partner:", errorRes);
            alert("Failed to create partner. Please check the console for details.");
          }
        },
      });
    },
    createEventAndRefreshList: function (brandId) {
      // Gather gallery image data
      let gallery1Images = $("#gallery-1-preview").attr("data-uploaded-images") || [];
      let gallery2Images = $("#gallery-2-preview").attr("data-uploaded-images") || [];
      let gallery3Images = $("#gallery-3-preview").attr("data-uploaded-images") || [];

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
          // Set the brand relationship
          brand: brandId,
        },
      };

      // Add main image if available
      let mainImage = $("#main-image-preview").attr("data-uploaded-image");
      if (mainImage && mainImage.url) {
        newEventData.fieldData["main-image"] = mainImage;
      }

      // Add gallery images
      if (gallery1Images.length > 0) {
        newEventData.fieldData["image-gallery-1"] = gallery1Images;
      }

      if (gallery2Images.length > 0) {
        newEventData.fieldData["image-gallery-2"] = gallery2Images;
      }

      if (gallery3Images.length > 0) {
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
          alert("New event created successfully!");
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
