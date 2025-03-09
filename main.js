EVENTS_COLLECTION_ID = "658f30a87b1a52ef8ad0b8e4";
USERS_COLLECTION_ID = "658f30a87b1a52ef8ad0b74b";
BRANDS_COLLECTION_ID = "658f30a87b1a52ef8ad0b77b";
PARTNERS_COLLECTION_ID = "65e7ff7b313c5cd8cd924886";
SITE_ID = "658f30a87b1a52ef8ad0b732";

$(document).ready(function () {
  rpLib.utils.injectCSS();
  rpLib.utils.injectDependencies();
  //
  // Run the scripts on relevant pages
  //
  if (window.location.pathname === "/account/partners") rpLib.partnersPage.init();
  if (window.location.pathname === "/account/events") rpLib.eventsPage.init();
  if (window.location.pathname === "/account/users") rpLib.usersPage.init();
});

var rpLib = {
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
                        <input type="text" id="user-profile-pic" placeholder="Image URL">
                        <div class="upload-section">
                            <input type="file" id="profile-pic-upload" accept="image/*">
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
                        <input type="text" id="user-full-pic" placeholder="Image URL">
                        <div class="upload-section">
                            <input type="file" id="full-pic-upload" accept="image/*">
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

      // Fetch all brands for city selection
      rpLib.api.fetchUserBrands();

      // Fetch all users after city selection
      $("#city-select").on("change", function () {
        let brandId = $(this).val();
        if (brandId) rpLib.api.fetchBrandUsersAndRender(brandId);
      });

      // Event listener for edit button click and open modal
      $("body").on("click", ".item-edit-btn", function (event) {
        let userId = $(this).closest(".collection-item").data("user-id");
        let slug = $(this).closest(".collection-item").data("slug");
        $("#collection-item-modal").attr("data-user-id", userId);
        rpLib.api.fetchUserDetailsAndOpenModal(slug);
      });

      // Close modal
      $("#close-modal").on("click", function () {
        $("#collection-item-modal").addClass("hidden");
      });

    // Store file references
    let profilePicFile = null;
    let fullPicFile = null;
    
    // Handler for profile picture selection (just preview, don't upload yet)
    $('#profile-pic-upload').on('change', function(e) {
        profilePicFile = e.target.files[0];
        if (!profilePicFile) return;
        
        // Show preview without uploading
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#profile-pic-preview').attr('src', e.target.result);
            $('#profile-pic-upload-status').text('Image selected (will upload when saved)');
        }
        reader.readAsDataURL(profilePicFile);
    });
    
    // Handler for full picture selection (just preview, don't upload yet)
    $('#full-pic-upload').on('change', function(e) {
        fullPicFile = e.target.files[0];
        if (!fullPicFile) return;
        
        // Show preview without uploading
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#full-pic-preview').attr('src', e.target.result);
            $('#full-pic-upload-status').text('Image selected (will upload when saved)');
        }
        reader.readAsDataURL(fullPicFile);

    });

    // Update preview when URL is manually entered
        $('#user-profile-pic').on('change input', function() {
          if ($(this).val()) {
              $('#profile-pic-preview').attr('src', $(this).val());
              // If URL is entered manually, clear the file selection
              profilePicFile = null;
              $('#profile-pic-upload').val('');
          }
      });
      
      $('#user-full-pic').on('change input', function() {
          if ($(this).val()) {
              $('#full-pic-preview').attr('src', $(this).val());
              // If URL is entered manually, clear the file selection
              fullPicFile = null;
              $('#full-pic-upload').val('');
          }
      });


      // Save user details
      $("#save-user").on("click", function () {
        const userId = $("#collection-item-modal").data("user-id");

        let filesToUpload = 0;
        if (profilePicFile) filesToUpload++;
        if (fullPicFile) filesToUpload++;
        
        // If no files to upload, just save the user data
        if (filesToUpload === 0) {
            rpLib.api.updateUserAndRefreshList(userId);
            return;
        }
        
        // Show saving status
        $('#save-user').text('Uploading images...');
        $('#save-user').prop('disabled', true);
        
        // Upload profile pic if needed
        let profilePicUploaded = !profilePicFile;
        let fullPicUploaded = !fullPicFile;
        
        if (profilePicFile) {
            $('#profile-pic-upload-status').text('Uploading...');
            
            rpLib.api.uploadImage(profilePicFile, 
                function(result) {
                    $('#profile-pic-upload-status').text('Upload complete!');
                    $('#user-profile-pic').val(result.url);
                    profilePicUploaded = true;
                    
                    // Check if all uploads are done
                    if (profilePicUploaded && fullPicUploaded) {
                        rpLib.api.updateUserAndRefreshList(userId);
                    }
                },
                function(error) {
                    $('#profile-pic-upload-status').text('Upload failed: ' + error.statusText);
                    profilePicUploaded = true;
                    
                    // Continue with save even if upload fails
                    if (profilePicUploaded && fullPicUploaded) {
                        rpLib.api.updateUserAndRefreshList(userId);
                    }
                }
            );
        }
        
        if (fullPicFile) {
            $('#full-pic-upload-status').text('Uploading...');
            
            rpLib.api.uploadImage(fullPicFile, 
                function(result) {
                    $('#full-pic-upload-status').text('Upload complete!');
                    $('#user-full-pic').val(result.url);
                    fullPicUploaded = true;
                    
                    // Check if all uploads are done
                    if (profilePicUploaded && fullPicUploaded) {
                        rpLib.api.updateUserAndRefreshList(userId);
                    }
                },
                function(error) {
                    $('#full-pic-upload-status').text('Upload failed: ' + error.statusText);
                    fullPicUploaded = true;
                    
                    // Continue with save even if upload fails
                    if (profilePicUploaded && fullPicUploaded) {
                        rpLib.api.updateUserAndRefreshList(userId);
                    }
                }
            );
          }
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
      templateRowItem.find(".item-view-btn").attr("href", user.id || "");

      $("#collection-list").append(templateRowItem);
    },
  },
  partnersPage: {
    init: function () {
      // Append modal dynamically for now until frontend components are available
      $("body").append(`
            <div id="collection-item-modal" class="hidden collection-item-modal">
                <div class="collection-item-modal-content">
                <h3>Edit Partner</h3>
                <label>Name:</label><input type="text" id="partner-name">
                <label>Company:</label><input type="text" id="partner-company">
                <label>Title:</label><input type="text" id="partner-title">
                <label>Phone:</label><input type="text" id="partner-phone">
                <label>Email:</label><input type="email" id="partner-email">
                <label>Website:</label><input type="text" id="partner-website">
                <label>License Number:</label><input type="text" id="partner-license">
                <label>Facebook:</label><input type="text" id="partner-facebook">
                <label>Instagram:</label><input type="text" id="partner-instagram">
                <label>X (Twitter):</label><input type="text" id="partner-x">
                <label>YouTube:</label><input type="text" id="partner-youtube">
                <label>LinkedIn:</label><input type="text" id="partner-linkedin">
                <label>TikTok:</label><input type="text" id="partner-tiktok">
                <label>Description:</label><textarea id="partner-description"></textarea>
                <label>Preview Text:</label><input type="text" id="partner-preview-text">
                <label>Address:</label><input type="text" id="partner-address">
                <label>City, State Zip:</label><input type="text" id="partner-city">
                <label>Partner Categories:</label>
                <select id="partner-categories" multiple>
                    <option value="65e96b6acdfd2898d9dc2be8">Category 1</option>
                    <option value="some-other-id">Category 2</option>
                </select>
                <button id="save-partner">Save</button>
                <button id="close-modal">Close</button>
                </div>
            </div>
        `);

      rpLib.api.fetchUserBrands();
      $("#city-select").on("change", function () {
        let brandId = $(this).val();
        if (brandId) rpLib.api.fetchPartnersAndRender(brandId);
      });

      $("body").on("click", ".item-edit-btn", function (event) {
        let partnerId = $(this).closest(".collection-item").data("partner-id");
        let slug = $(this).closest(".collection-item").data("slug");
        $("#collection-item-modal").attr("data-event-id", partnerId);
        rpLib.api.fetchPartnerDetailsAndOpenModal(slug);
      });

      $("#save-partner").on("click", function () {
        rpLib.api.updatePartnerAndRefreshList($("#collection-item-modal").data("partner-id"));
      });
      $("#close-modal").on("click", function () {
        $("#collection-item-modal").addClass("hidden");
      });
    },
    renderPartner: function (partner) {
      const templateRowItem = $(".collection-item-row-template").clone();
      templateRowItem.removeClass("collection-item-row-template");
      templateRowItem.attr("data-slug", partner.fieldData.slug);
      templateRowItem.attr("data-partner-id", partner.id);

      templateRowItem.find(".partner-pic").attr("src", partner.fieldData.logo?.url || "");
      templateRowItem.find(".parner-name").text(partner.fieldData.name || "");
      templateRowItem.find(".partner-number").text(partner.fieldData.phone || "");
      templateRowItem.find(".partner-email").text(partner.fieldData.email || "");
      templateRowItem.find(".item-view-btn").attr("href", partner.id || "");

      $("#collection-list").append(templateRowItem);
    },
  },
  eventsPage: {
    init: function () {
      // Append modal dynamically for now until frontend components are available
      $("body").append(`
            <div id="collection-item-modal" class="hidden collection-item-modal" data-event-id="">
                <div class="collection-item-modal-content">
                    <h3>Edit Event</h3>
                    <label>Name:</label><input type="text" id="event-name">
                    <label>Date:</label><input type="date" id="event-date">
                    <label>Location Name:</label><input type="text" id="event-location-name">
                    <label>Location Address:</label><input type="text" id="event-location-address">
                    <label>Button URL:</label><input type="text" id="button-url">
                    <label>Button Text:</label><input type="text" id="button-text">
                    <label>Event Flyer URL:</label><input type="text" id="event-flyer">

                    <!-- Main Image -->
                    <label>Main Image:</label>
                    <img id="main-image-preview" class="preview-img" />
                    <input type="file" id="main-image" accept="image/*">

                    <!-- Image Gallery 1 -->
                    <label>Image Gallery 1:</label>
                    <div id="image-gallery-preview" class="gallery-preview"></div>
                    <input type="file" id="image-gallery" accept="image/*" multiple>

                    <!-- Image Gallery 2 -->
                    <label>Image Gallery 2:</label>
                    <div id="image-gallery-2-preview" class="gallery-preview"></div>
                    <input type="file" id="image-gallery-2" accept="image/*" multiple>

                    <!-- Image Gallery 3 -->
                    <label>Image Gallery 3:</label>
                    <div id="image-gallery-3-preview" class="gallery-preview"></div>
                    <input type="file" id="image-gallery-3" accept="image/*" multiple>

                    <label>YouTube Video ID:</label><input type="text" id="youtube-video-id">
                    <label>YouTube Video ID 2:</label><input type="text" id="youtube-video-id-2">
                    <label>Description:</label><textarea id="event-description"></textarea>
                    <label>Sponsor Event Button URL:</label><input type="text" id="sponsor-button-url">
                    <label>Sponsor Event Button Text:</label><input type="text" id="sponsor-button-text">
                    <button id="save-event">Save</button>
                    <button id="close-modal">Close</button>
                </div>
            </div>
        `);

      rpLib.api.fetchUserBrands();
      $("#city-select").on("change", function () {
        rpLib.api.fetchEventsAndRender($(this).val());
      });
      $("#collection-list").on("click", ".item-edit-btn", function () {
        let eventId = $(this).closest(".collection-item").data("event-id");
        let slug = $(this).closest(".collection-item").data("slug");
        $("#collection-item-modal").attr("data-event-id", eventId);
        rpLib.api.fetchEventDetailsAndOpenModal(slug);
      });
      $("#save-event").on("click", function () {
        rpLib.api.updateEventAndRefreshList($("#collection-item-modal").data("event-id"));
      });
      $("#close-modal").on("click", function () {
        $("#collection-item-modal").addClass("hidden");
      });
    },
    renderEvent: function (event) {
      const templateRowItem = $(".collection-item-row-template").clone();
      templateRowItem.removeClass("collection-item-row-template");
      templateRowItem.attr("data-slug", event.fieldData.slug);
      templateRowItem.attr("data-event-id", event.id);

      templateRowItem.find(".event-pic").attr("src", event.fieldData["main-image"]?.url || "");
      templateRowItem.find(".event-name").text(event.fieldData.name || "");
      templateRowItem.find(".event-date").text(event.fieldData.date || "");
      templateRowItem.find(".event-location").text(event.fieldData["location-name"] || "");
      templateRowItem.find(".item-view-btn").attr("href", event.id || "");

      $("#collection-list").append(templateRowItem);
    },
  },

  utils: {
    injectDependencies: function () {
      // SparkMD5
      const scriptTagForSparkMD5 = '<script src="https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js"></script>'
      $("head").append(scriptTagForSparkMD5);
    },
    injectCSS: function () {
      $("head").append(`
            <style>
              .collection-item-row-template {
                  display: none;
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
  },

  api: {
    fetchAllPaginated: function (url, processData, offset = 0) {
      $.ajax({
        url: `${url}&offset=${offset}`,
        method: "GET",
        success: function (response) {
          const items = response.items || [];

          // Process data immediately
          processData(items);

          if (offset + response.pagination.limit < response.pagination.total) {
            rpLib.api.fetchAllPaginated(url, processData, offset + response.pagination.limit);
          }
        },
        error: function (error) {
          console.error("Error fetching paginated data:", error);
        },
      });
    },
    fetchUserBrands: function () {
      const USER_SLUG = $("div").find(`[data-ms-member='wf-users-slug']`).text();
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/live?slug=${USER_SLUG}&sortBy=lastPublished&sortOrder=desc`;

      rpLib.api.fetchAllPaginated(url, (items) => {
        if (items.length > 0) {
          let brands = items[0].fieldData["brand-s"];
          brands.forEach((brandId) => rpLib.api.fetchBrandDetailsAndPopulateDropdown(brandId));
        }
      });
    },
    fetchBrandDetailsAndPopulateDropdown: function (brandId) {
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${BRANDS_COLLECTION_ID}/items/${brandId}/live`,
        method: "GET",
        success: function (response) {
          $("#city-select").append(`<option value="${response.id}">${response.fieldData.name}</option>`);
        },
        error: function (error) {
          console.error("Error fetching brand details:", error);
        },
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
          if (user.fieldData["brand-s"] && user.fieldData["brand-s"].length > 0 && user.fieldData["brand-s"].includes(brandId)) {
            rpLib.usersPage.renderUser(user);
          }
        });
      });
    },
    fetchPartnersAndRender: function (brandId) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNERS_COLLECTION_ID}/items/live?sortBy=lastPublished&sortOrder=desc`;

      // Clear existing providers in list
      $("#collection-list .collection-item").not(".collection-item-row-template").remove();

      rpLib.api.fetchAllPaginated(url, (items) => {
        items
          .filter((item) => item.fieldData.city.includes(brandId))
          .forEach((partner) => {
            rpLib.partnersPage.renderPartner(partner);
          });
      });
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

            // Populate multi-reference fields (dropdown with multiple selections)
            $("#partner-categories").val(partner.fieldData["partner-categories"]);

            $("#collection-item-modal").removeClass("hidden");
          }
        },
        error: function (error) {
          console.error("Error fetching partner details:", error);
        },
      });
    },
    updatePartnerAndRefreshList: function (partnerId) {
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
          "partner-categories": $("#partner-categories").val(), // Multi-reference
        },
      };
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNERS_COLLECTION_ID}/items/${partnerId}/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        data: JSON.stringify(updatedData),
        success: function () {
          alert("Partner updated!");
          $("#collection-item-modal").addClass("hidden");
          rpLib.api.fetchPartnersAndRender($("#city-select").val()); // Refresh list
        },
        error: function (error) {
          console.error("Error updating partner:", error);
        },
      });
    },
    fetchEventsAndRender: function (brandId) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/live?sortBy=lastPublished&sortOrder=desc`;

      // Clear existing events in list
      $("#collection-list .collection-item").not(".collection-item-row-template").remove();

      rpLib.api.fetchAllPaginated(url, (items) => {
        items
          .filter((item) => item.fieldData.brand === brandId)
          .forEach((event) => {
            rpLib.eventsPage.renderEvent(event);
          });
      });
    },
    fetchEventDetailsAndOpenModal: function (slug) {
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/live?slug=${slug}&sortBy=lastPublished&sortOrder=desc`,
        method: "GET",
        success: function (response) {
          if (response.items.length > 0) {
            let event = response.items[0];
            selectedEventId = event.id;

            // Populate text fields
            $("#event-name").val(event.fieldData?.name || "");
            $("#event-date").val(event.fieldData?.date || "");
            $("#event-time").val(event.fieldData?.time || "");
            $("#event-location").val(event.fieldData?.location || "");
            $("#event-description").val(event.fieldData?.description || "");
            $("#button-url").val(event.fieldData?.["button-url"] || "");
            $("#button-text").val(event.fieldData?.["button-text"] || "");
            $("#youtube-video-id").val(event.fieldData?.["youtube-video-id"] || "");
            $("#youtube-video-id-2").val(event.fieldData?.["youtube-video-id-2"] || "");
            $("#sponsor-button-url").val(event.fieldData?.["sponsor-event-button-url"] || "");
            $("#sponsor-button-text").val(event.fieldData?.["sponsor-event-button-text"] || "");

            // Handle main image
            $("#main-image-preview").attr("src", event.fieldData?.["main-image"]?.url || "");
            $("#main-image").val(""); // Clear existing input to allow re-selection

            // Populate image galleries
            rpLib.utils.updateImageGallery(event, "image-gallery", "#image-gallery-preview");
            rpLib.utils.updateImageGallery(event, "image-gallery-2", "#image-gallery-2-preview");
            rpLib.utils.updateImageGallery(event, "image-gallery-3", "#image-gallery-3-preview");

            // Clear existing file inputs to allow new selections
            $("#image-gallery").val("");
            $("#image-gallery-2").val("");
            $("#image-gallery-3").val("");

            $("#collection-item-modal").removeClass("hidden");
          }
        },
        error: function (error) {
          console.error("Error fetching event details:", error);
        },
      });
    },
    updateEventAndRefreshList: function (eventId) {
      let updatedData = {
        fieldData: {
          name: $("#event-name").val(),
          date: $("#event-date").val(),
          "location-name": $("#event-location-name").val(),
          "location-address": $("#event-location-address").val(),
          "button-url": $("#button-url").val(),
          "button-text": $("#button-text").val(),
          "main-image": $("#main-image").val(),
          "image-gallery": $("#image-gallery").val().split(", ").slice(0, 25),
          "image-gallery-2": $("#image-gallery-2").val().split(", ").slice(0, 25),
          "image-gallery-3": $("#image-gallery-3").val().split(", ").slice(0, 25),
          "youtube-video-id": $("#youtube-video-id").val(),
          "youtube-video-id-2": $("#youtube-video-id-2").val(),
          description: $("#event-description").val(),
          "sponsor-event-button-url": $("#sponsor-button-url").val(),
          "sponsor-event-button-text": $("#sponsor-button-text").val(),
        },
      };

      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/${eventId}/live`,
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        data: JSON.stringify(updatedData),
        success: function () {
          alert("Event updated!");
          $("#collection-item-modal").addClass("hidden");
          rpLib.api.fetchEventsAndRender($("#city-select").val());
        },
        error: function (error) {
          console.error("Error updating event:", error);
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
            $("#user-full-pic").val(user.fieldData["full-picture"]?.url || "");
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

            $("#collection-item-modal").removeClass("hidden");
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
          "profile-picture": {
            url: $("#user-profile-pic").val(),
          },
          "full-picture": {
            url: $("#user-full-pic").val(),
          },
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
      $.ajax({
        url: `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${USERS_COLLECTION_ID}/items/${userId}/live`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        data: JSON.stringify(updatedData),
        success: function () {
          alert("User updated!");
          $("#collection-item-modal").addClass("hidden");
          rpLib.api.fetchBrandUsersAndRender($("#city-select").val()); // Refresh list
        },
        error: function (error) {
          console.error("Error updating user:", error);
        },
      });
    },
    uploadImage: function(file, onSuccess, onError) {
      const generateMD5Hash = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onload = function() {
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
              "Content-Type": "application/json"
            },
            data: JSON.stringify({
              fileHash: md5Hash,
              fileName: file.name,
              contentType: file.type
            }),
            success: function(response) {
              // Step 2: Upload to S3 using the details provided
              const formData = new FormData();
    
              // Add all the upload details from Webflow to the form
              Object.keys(response.uploadDetails).forEach(key => {
                formData.append(key, response.uploadDetails[key]);
              });
    
              // Append the actual file
              formData.append('file', file);
    
              // Upload to S3
              $.ajax({
                url: response.uploadUrl,
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function() {
                  // Return the asset details from the original response
                  onSuccess({
                    id: response.id,
                    url: response.assetUrl || response.hostedUrl
                  });
                },
                error: function(error) {
                  console.error("Error uploading to S3:", error);
                  if (onError) onError(error);
                }
              });
            },
            error: function(error) {
              console.error("Error getting upload details:", error);
              if (onError) onError(error);
            }
          });
        })
        .catch((error) => {
          console.error("Error generating file hash:", error);
          if (onError) onError(error);
        });
    },
    
    uploadMultipleImages: function(files, onProgress, onComplete, onError) {
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
        
        rpLib.api.uploadImage(files[index], 
          function(result) {
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
          function(error) {
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
  },
};
