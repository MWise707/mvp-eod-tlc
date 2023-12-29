$(document).ready(() => {
  console.log("JS is loaded.");

  // Call bootsrap dropdown
  $(".dropdown-toggle").dropdown();

  // ====== Declare Elements
  const body = $("body");
  const dashboard = $("#dashboard"); // Container for all results
  const platoons = $("#platoons");
  const addTechBtn = $("#add-tech");
  const removeTechBtn = $("#delete-tech");
  const newTechForm = $("#new-tech-form").addClass("hidden");
  const newTechSubmit = $("#submitNewTechForm");
  const deleteTechBtn = $("#deleteTechBtn");
  const selectTechForm = $("#selectTechForm").addClass("hidden");

  let newTech = {
    rank: "SGT",
    first_name: null,
    last_name: null,
    position: "Unassigned",
    is_tlc_complete: false,
    percent_complete: 0.25,
    platoon_id: null,
    team_id: null,
    is_officer: false,
    badge_level: "BASIC",
  };

  function createTechEditForm(tech) {
    let techEditForm = $(
      `<form id="edit-${tech.tech_id}">${tech.rank} ${tech.last_name}</form>`
    ).appendTo(body);
    for (const field in tech) {
      if (tech.hasOwnProperty(field)) {
        let formCheckDiv = $("<div></div>")
          .addClass("form-check")
          .appendTo(techEditForm);
        let checkBoxInput = $(
          `<input type="checkbox" class="form-check-input" id="check-${field}">`
        ).appendTo(formCheckDiv);
        let checkBoxLabel = $(
          `<label class="form-check-label" for="check-${field}">${field}: ${tech[field]}</label>`
        ).appendTo(formCheckDiv);
      }
    }
    //<button type="submit" class="btn btn-primary" id="editTechBtn">Edit Tech</button>
    let editTechFieldsBtn = $(
      `<button type="submit" class="btn btn-primary" id="edit-${tech.tech_id}selection">Edit Selected Fields</button>`
    ).appendTo(techEditForm);
  }

  function showAllTechs() {
    return new Promise((resolve, reject) => {
      $.get("/techs", (data) => {
        console.log("All techs data", data);
        resolve(data);
      }).fail((error) => {
        console.error("Error fetching all techs:", error);
        reject(error);
      });
    });
  }

  function showPlatoon(platoon_id) {
    let platoonCont = $(`<div id="platoon-${platoon_id}"></div>`)
      .addClass("all-platoons")
      .appendTo(platoons);
    $.get(`/techs/${platoon_id}`, (data) => {
      const pltLabel = getPlatoonTitle(platoon_id);
      const platoonTitle = $(`<h1 id=${platoon_id}PLT>${pltLabel}</h1>`)
        .addClass("platoon-title")
        .appendTo(`#platoon-${platoon_id}`);
      for (let i = 0; i < data.length; i++) {
        let badgeLink = getBadgePic(data[i].badge_level);
        let shortTitle = getPostionTitle(data[i].position);
        let techDetails = $("<div></div>")
          .addClass("tech-details")
          .appendTo(`#platoon-${platoon_id}`);
        if (data[i].platoon_id === 4 || data[i].platoon_id === 5) {
          let techTitle = $(`<h2>${shortTitle}:</h2>`).appendTo(techDetails);
        } else {
          techTitle = $(
            `<h2>${data[i].platoon_id}-${data[i].team_id} ${shortTitle}:</h2>`
          ).appendTo(techDetails);
        }
        let tlcContainer = $("<div></div>")
          .addClass("tlc-container")
          .appendTo(techDetails);
        showTLC(data[i]).appendTo(tlcContainer);
        let techContainer = $("<div></div>")
          .addClass("tech-container")
          .appendTo(`#platoon-${platoon_id}`);
        let rankName = $(
          `<h2>${data[i].rank} ${data[i].last_name}</h2>`
        ).appendTo(techContainer);
        let badgeCont = $("<div></div>")
          .addClass("badge-container")
          .appendTo(techContainer);
        let badgeImg = $(`<img src="${badgeLink}"/>`).appendTo(badgeCont);
        createTechEditForm(data[i]);
      }
    });
  }

  showPlatoon("1");
  showPlatoon("2");
  showPlatoon("3");
  showPlatoon("4");
  showPlatoon("5");

  function addTech(techObj) {
    $.post({
      url: "/techs",
      contentType: "application/json",
      data: JSON.stringify(techObj),
      success: function (data) {
        showPlatoon(newTech.platoon_id);
        dashboard.removeClass("hidden");
        $(`#platoon-${newTech.platoon_id}`).removeClass("hidden");
      },
      error: function (error) {
        console.error("Error adding tech:", error);
      },
    });
  }

  function deleteTech(techId) {
    $.ajax({
      url: `/techs/${techId}`,
      type: "DELETE",
      success: () => {
        selectTechForm.addClass("hidden");
        dashboard.removeClass("hidden");
        console.log("Succss deleting tech");
      },
      error: (error) => {
        console.error("Error deleting tech", error);
      },
    });
  }

  function getPlatoonTitle(platoon_id) {
    if (platoon_id === "1") return "1st Platoon";
    if (platoon_id === "2") return "2nd Platoon";
    if (platoon_id === "3") return "3rd Platoon";
    if (platoon_id === "4") return "HQ Platoon";
    if (platoon_id === null || platoon_id === "5") return "UNASSIGNED";
  }

  function getPlatoonId(pltTitle) {
    if (pltTitle === "1st Platoon") return 1;
    if (pltTitle === "2nd Platoon") return 2;
    if (pltTitle === "3rd Platoon") return 3;
    if (pltTitle === "HQ Platoon") return 4;
    if (pltTitle === "UNASSIGNED") return 5;
  }

  function getTeamId(teamSelected) {
    if (teamSelected === "1 (1-1, 2-1, or 3-1)") return 1;
    if (teamSelected === "2 (1-2, 2-2, or 3-2)") return 2;
    if (teamSelected === "3 (1-3, 2-3, or 3-3)") return 3;
    if (teamSelected === "Not on a team") return null;
  }

  function getRank(rankSelected) {
    return rankSelected.slice(-3);
  }

  function getPostionTitle(position) {
    if (position === "Team Leader") return "TL";
    if (position === "Senior Team Member") return "TM";
    if (position === "Team Member") return "TM";
    if (position === "Platoon Leader") return "PL";
    if (position === "Platoon Sergeant") return "PSG";
    if (position === "Operations NCO") return "OPS NCO";
    if (position === "Company Commander") return "CDR";
    if (position === "First Sergeant") return "1SG";
    if (position === "Unassigned") return "Unassigned";
  }

  function getBadgePic(badge_level) {
    if (badge_level === "MASTER") return "/media/master-eod.png";
    if (badge_level === "SENIOR") return "/media/senior-eod.png";
    if (badge_level === "BASIC") return "/media/basic-eod.png";
  }

  function showTLC(tech) {
    if (tech.is_tlc_complete) {
      let checkMark = $("<img src='/media/check-mark.png'/>").addClass(
        "checkMark"
      );
      return checkMark;
    } else {
      let wholePercent = Math.floor(tech.percent_complete * 100);
      let tlcProgress = $(`<h2>${wholePercent}%</h2>`);
      return tlcProgress;
    }
  }

  function processNewTechForm() {
    newTech.rank = getRank($("#rankSelected option:selected").text());
    newTech.first_name = $("#inputFirstName").val();
    newTech.last_name = $("#inputLastName").val();
    newTech.position = $("#positionSelected option:selected").text();
    $("#tlcCheck").is(":checked")
      ? (newTech.is_tlc_complete = true)
      : (newTech.is_tlc_complete = false);
    newTech.is_tlc_complete
      ? (newTech.percent_complete = 1)
      : (newTech.percent_complete = Number($("#inputTLCpercent").val()));
    newTech.platoon_id = getPlatoonId(
      $("#platoon-selected option:selected").text()
    );
    newTech.team_id = getTeamId($("#team-selected option:selected").text());
    newTech.is_officer =
      newTech.rank === "2LT" ||
      newTech.rank === "1LT" ||
      newTech.rank === "CPT";
    newTech.badge_level = $("#badge-selected option:selected").text();
  }

  function populateTechSelection() {
    showAllTechs()
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          let techOption = $(
            `<option id="${data[i].tech_id}">${data[i].rank} ${
              data[i].first_name
            } ${data[i].last_name}: ${getPlatoonTitle(
              String(data[i].platoon_id)
            )}</option>`
          ).appendTo("#tech-selected");
        }
      })
      .catch((error) => {
        console.error("Error populating tech selection:", error);
      });
  }
  populateTechSelection();

  addTechBtn.on("click", () => {
    // $("#platoon-1").addClass("hidden");
    // $("#platoon-2").addClass("hidden");
    // $("#platoon-3").addClass("hidden");
    // $("#platoon-4").addClass("hidden");
    // $("#platoon-5").addClass("hidden");
    dashboard.addClass("hidden");
    newTechForm.removeClass("hidden");
  });

  removeTechBtn.on("click", () => {
    console.log("Delete tech btn clicked");
    // $("#platoon-1").addClass("hidden");
    // $("#platoon-2").addClass("hidden");
    // $("#platoon-3").addClass("hidden");
    // $("#platoon-4").addClass("hidden");
    // $("#platoon-5").addClass("hidden");
    dashboard.addClass("hidden");
    selectTechForm.removeClass("hidden");
  });

  newTechSubmit.on("click", (e) => {
    e.preventDefault();
    processNewTechForm();
    console.log(newTech);
    newTechForm.addClass("hidden");
    addTech(newTech);
  });

  deleteTechBtn.on("click", (e) => {
    // e.preventDefault();
    const techId = $("#tech-selected option:selected").attr("id");
    console.log("Selected Tech ID:", techId);
    deleteTech(techId);
  });
});
