$(document).ready(function () {
  //
  // Run the scripts on relevant pages
  //
  if (window.location.pathname === "/account/partners") rpLib.partnersPage.init();
  if (window.location.pathname === "/account/events") rpLib.eventsPage.init();
  if (window.location.pathname === "/account/users") rpLib.usersPage.init();
});

EVENTS_COLLECTION_ID = "658f30a87b1a52ef8ad0b8e4";
USERS_COLLECTION_ID = "658f30a87b1a52ef8ad0b74b";
BRANDS_COLLECTION_ID = "658f30a87b1a52ef8ad0b77b";
PARTNERS_COLLECTION_ID = "65e7ff7b313c5cd8cd924886";








var rpLib = {
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
        if (brandId) rpLib.api.fetchPartners(brandId);
      });

      $("#collection-list").on("click", ".edit-item", function () {
        let partnerId = $(this).closest("li").data("partner-id");
        $("#collection-item-modal").attr("data-event-id", partnerId);

        let slug = $(this).closest("li").data("slug");
        rpLib.api.fetchPartnerDetails(slug);
      });

      $("#save-partner").on("click", function () {
        rpLib.api.updatePartner($("#collection-item-modal").data("partner-id"));
      });
      $("#close-modal").on("click", function () {
        $("#collection-item-modal").addClass("hidden");
      });
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
        rpLib.api.fetchEvents($(this).val());
      });
      $("#collection-list").on("click", ".edit-event", function () {
        let eventId = $(this).closest("li").data("event-id");
        $("#collection-item-modal").attr("data-event-id", eventId);

        let slug = $(this).closest("li").data("slug");
        rpLib.api.fetchEventDetails(slug);
      });
      $("#save-event").on("click", function () {
        rpLib.api.updateEvent($("#collection-item-modal").data("event-id"));
      });
      $("#close-modal").on("click", function () {
        $("#collection-item-modal").addClass("hidden");
      });
    },
  },

  utils: {
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
          brands.forEach((brandId) => rpLib.api.fetchBrandDetails(brandId));
        }
      });
    },
    fetchBrandDetails: function (brandId) {
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
    fetchPartners: function (brandId) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${PARTNERS_COLLECTION_ID}/items/live?sortBy=lastPublished&sortOrder=desc`;

      rpLib.api.fetchAllPaginated(url, (items) => {
        $("#collection-list").empty();
        items
          .filter((item) => item.fieldData.city.includes(brandId))
          .forEach((partner) => {
            $("#collection-list").append(
              `<li class="collection-item" data-partner-id="${partner.id}" data-slug="${partner.fieldData.slug}">
                          ${partner.fieldData.name} <button class="edit-item">Edit</button>
                      </li>`
            );
          });
      });
    },
    fetchPartnerDetails: function (slug) {
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
    updatePartner: function (partnerId) {
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
          rpLib.api.fetchPartners($("#city-select").val()); // Refresh list
        },
        error: function (error) {
          console.error("Error updating partner:", error);
        },
      });
    },
    fetchEvents: function (brandId) {
      const url = `https://vhpb1dr9je.execute-api.us-east-1.amazonaws.com/dev/https://api.webflow.com/v2/collections/${EVENTS_COLLECTION_ID}/items/live?sortBy=lastPublished&sortOrder=desc`;

      rpLib.api.fetchAllPaginated(url, (items) => {
        $("#collection-list").empty();
        items
          .filter((item) => item.fieldData.brand === brandId)
          .forEach((event) => {
            $("#collection-list").append(
              `<li class="event-item" data-event-id="${event.id}" data-slug="${event.fieldData.slug}">
                          ${event.fieldData.name} <button class="edit-event">Edit</button>
                      </li>`
            );
          });
      });
    },
    fetchEventDetails: function (slug) {
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
    updateEvent: function (eventId) {
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
          rpLib.api.fetchEvents($("#city-select").val());
        },
        error: function (error) {
          console.error("Error updating event:", error);
        },
      });
    },
  },
};









