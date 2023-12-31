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
  const showEditOptions = $("#editTechBtn");

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
  let editTechObj = {};

  function createTechEditForm(tech) {
    let selectedFields = [];
    let techEditForm = $(
      `<form id="edit-${tech.tech_id}">Choose Fields to Change</form>`
    )
      .appendTo(body)
      .addClass("hidden");
    for (const field in tech) {
      if (tech.hasOwnProperty(field) && field !== "tech_id") {
        let formCheckDiv = $("<div></div>")
          .addClass("form-check")
          .appendTo(techEditForm);
        let checkBoxInput = $(
          `<input type="checkbox" class="form-check-input" id="check-${field}">`
        ).appendTo(formCheckDiv);
        checkBoxInput.on("change", function () {
          if (this.checked) {
            selectedFields.push(field);
          } else {
            selectedFields = selectedFields.filter((item) => item !== field);
          }
          console.log("Selected Fields:", selectedFields);
        });
        let checkBoxLabel = $(
          `<label class="form-check-label" for="check-${field}">${field}: ${tech[field]}</label>`
        ).appendTo(formCheckDiv);
      }
    }
    let editTechFieldsBtn = $(
      `<button type="submit" class="btn btn-primary" id="edit-${tech.tech_id}selection">Edit Selected Fields</button>`
    ).appendTo(techEditForm);
    editTechFieldsBtn.on("click", (e) => {
      e.preventDefault();
      techEditForm.addClass("hidden");
      let techEditor = $(
        `<form id="edit-selections-${tech.tech_id}">${tech.rank} ${tech.last_name}</form>`
      ).appendTo(body);
      for (let i = 0; i < selectedFields.length; i++) {
        let fieldName = selectedFields[i];
        if (fieldName === "rank") {
          let rankDiv = $('<div class="form-group"></div>').appendTo(
            techEditor
          );
          let divlabel = $(
            '<label for="changeRank">Change Rank</label>'
          ).appendTo(rankDiv);
          let selectRank = $(
            '<select class="form-control" id="changeRank"></select>'
          ).appendTo(rankDiv);
          let pfcOpt = $("<option>E-3 / PFC</option>").appendTo(selectRank);
          let spcOpt = $("<option>E-4 / SPC</option>").appendTo(selectRank);
          let sgtOpt = $("<option>E-5 / SGT</option>").appendTo(selectRank);
          let ssgOpt = $("<option>E-6 / SSG</option>").appendTo(selectRank);
          let sfcOpt = $("<option>E-7 / SFC</option>").appendTo(selectRank);
          let msgOpt = $("<option>E-8 / 1SG</option>").appendTo(selectRank);
          let lt2Opt = $("<option>O-1 / 2LT</option>").appendTo(selectRank);
          let lt1Opt = $("<option>O-2 / 1LT</option>").appendTo(selectRank);
          let cptOpt = $("<option>O-3 / CPT</option>").appendTo(selectRank);
        }
        if (fieldName === "first_name") {
          let nameDiv = $('<div class="form-group"></div>').appendTo(
            techEditor
          );
          let firstNameLabel = $(
            '<label for="changeFirstName">Change First Name</label>'
          ).appendTo(nameDiv);
          let firstNameInput = $(
            `<input type="text" class="form-control" id="changeFirstName" placeholder="${tech.first_name}"/>`
          ).appendTo(nameDiv);
        }
        if (fieldName === "last_name") {
          let lastNameDiv = $('<div class="form-group"></div>').appendTo(
            techEditor
          );
          let lastNameLabel = $(
            '<label for="changeLastName">Change First Name</label>'
          ).appendTo(lastNameDiv);
          let lastNameInput = $(
            `<input type="text" class="form-control" id="changeLastName" placeholder="${tech.last_name}"/>`
          ).appendTo(lastNameDiv);
        }
        if (fieldName === "position") {
          let positionDiv = $('<div class="form-group"></div>').appendTo(
            techEditor
          );
          let positionLabel = $(
            '<label for="changePosition">Change Position</label>'
          ).appendTo(positionDiv);
          let selectPosition = $(
            '<select class="form-control" id="changePosition"></select>'
          ).appendTo(positionDiv);
          let optTL = $("<option>Team Leader</option>").appendTo(
            selectPosition
          );
          let optTM = $("<option>Senior Team Member</option>").appendTo(
            selectPosition
          );
          let optSenTM = $("<option>Team Member</option>").appendTo(
            selectPosition
          );
          let optPL = $("<option>Platoon Leader</option>").appendTo(
            selectPosition
          );
          let optPSG = $("<option>Platoon Sergeant</option>").appendTo(
            selectPosition
          );
          let optOpsNCO = $("<option>Operations NCO</option>").appendTo(
            selectPosition
          );
          let optCDR = $("<option>Company Commander</option>").appendTo(
            selectPosition
          );
          let optMSG = $("<option>First Sergeant</option>").appendTo(
            selectPosition
          );
          let optUnk = $("<option>Unassigned</option>").appendTo(
            selectPosition
          );
        }
        if (fieldName === "is_tlc_complete") {
          let tlcDiv = $('<div class="form-group"></div>').appendTo(techEditor);
          let tlcCheckDiv = $('<div class="form-check"></div>').appendTo(
            tlcDiv
          );
          let tlcCheckbox = $(
            `<input class="form-check-input" type="checkbox" id="tlcCheckbox"/>`
          ).appendTo(tlcCheckDiv);
          let tlcLabel = $(
            `<label class="form-check-label" for="tlcCheckbox">Team Leader Certified</label>`
          ).appendTo(tlcCheckDiv);
        }
        if (fieldName === "percent_complete") {
          let percentDiv = $('<div class="form-group"></div>').appendTo(
            techEditor
          );
          let percentLabel = $(
            '<label for="changeTLCpercent">TLC % Complete</label>'
          ).appendTo(percentDiv);
          let percentInput = $(
            '<input type="number" class="form-control" id="changeTLCpercent" placeholder="Format: 0.25"/>'
          ).appendTo(percentDiv);
        }
        if (selectedFields[i] === "platoon_id") {
          let platoonDiv = $('<div class="form-group"></div>').appendTo(
            techEditor
          );
          let pltLabel = $(
            '<label for="changePlatoon">Change Platoon</label>'
          ).appendTo(platoonDiv);
          let selectPlatoon = $(
            '<select class="form-control" id="changePlatoon"></select>'
          ).appendTo(platoonDiv);
          let opt1st = $("<option>1st Platoon</option>").appendTo(
            selectPlatoon
          );
          let opt2nd = $("<option>2nd Platoon</option>").appendTo(
            selectPlatoon
          );
          let opt3rd = $("<option>3rd Platoon</option>").appendTo(
            selectPlatoon
          );
          let optHq = $("<option>HQ Platoon</option>").appendTo(selectPlatoon);
          let optNoPlt = $("<option>UNASSIGNED</option>").appendTo(
            selectPlatoon
          );
        }
        if (fieldName === "team_id") {
          let teamDiv = $('<div class="form-group"></div>').appendTo(
            techEditor
          );
          let teamLabel = $(
            '<label for="changeTeam">Change Team</label>'
          ).appendTo(teamDiv);
          let selectTeam = $(
            '<select class="form-control" id="changeTeam"></select>'
          ).appendTo(teamDiv);
          let optTM1 = $("<option>1 (1-1, 2-1, or 3-1)</option>").appendTo(
            selectTeam
          );
          let optTM2 = $("<option>2 (1-2, 2-2, or 3-2)</option>").appendTo(
            selectTeam
          );
          let optTM3 = $("<option>3 (1-3, 2-3, or 3-3)</option>").appendTo(
            selectTeam
          );
          let optNoTM = $("<option>Not on a team</option>").appendTo(
            selectTeam
          );
        }
        if (fieldName === "badge_level") {
          let badgeDiv = $('<div class="form-group"></div>').appendTo(
            techEditor
          );
          let badgeLabel = $(
            '<label for="changeBadge">Change Badge</label>'
          ).appendTo(badgeDiv);
          let selectBadge = $(
            '<select class="form-control" id="changeBadge"></select>'
          ).appendTo(badgeDiv);
          let optBasic = $("<option>BASIC</option>").appendTo(selectBadge);
          let optSenior = $("<option>SENIOR</option>").appendTo(selectBadge);
          let optMaster = $("<option>MASTER</option>").appendTo(selectBadge);
        }
      }
      let submitTechEditsBtn = $(
        '<button type="submit" class="btn btn-primary" id="submitTechEdits">Submit Changes</button>'
      ).appendTo(techEditor);
      submitTechEditsBtn.on("click", (e) => {
        for (let i = 0; i < selectedFields.length; i++) {
          let editKey = selectedFields[i];

          switch (editKey) {
            case "rank":
              editTechObj[editKey] = $("#changeRank option:selected")
                .text()
                .slice(-3);
              editTechObj.is_officer =
                editTechObj[editKey] === "2LT" ||
                editTechObj[editKey] === "CPT" ||
                editTechObj[editKey] === "1LT";
              break;

            case "first_name":
              editTechObj[editKey] = $("#changeFirstName").val();
              break;

            case "last_name":
              editTechObj[editKey] = $("#changeLastName").val();
              break;

            case "position":
              editTechObj[editKey] = $(
                "#changePosition option:selected"
              ).text();
              break;

            case "is_tlc_complete":
              $("#tlcCheckbox").is(":checked")
                ? (editTechObj[editKey] = true)
                : (editTechObj[editKey] = false);
              break;

            case "percent_complete":
              editTechObj[editKey] = Number($("#changeTLCpercent").val());
              break;

            case "platoon_id":
              editTechObj[editKey] = $("#changePlatoon option:selected").text();
              break;

            case "team_id":
              editTechObj[editKey] = getTeamId(
                $("#changeTeam option:selected").text()
              );
              break;

            case "badge_level":
              editTechObj[editKey] = $("#changeBadge option:selected").text();
              break;

            default:
              console.log("No changes made");
              break;
          }
          console.log(editTechObj);
          editTech(tech.tech_id, editTechObj);
        }
      });
    });
  }

  function resetEditTechObj() {
    editTechObj = {};
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

  function editTech(techId, editObj) {
    $.ajax({
      url: `/techs/${techId}`,
      data: JSON.stringify(editObj),
      type: "PATCH",
      contentType: "application/json",
      success: () => {
        techEditForm.addClass("hidden");
        dashboard.removeClass("hidden");
        console.log("Success editing tech");
      },
      error: (error) => {
        console.error("Error editing tech", error);
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

  // TODO finish event listener
  showEditOptions.on("click", (e) => {
    const techId = $("#tech-selected option:selected").attr("id");
    e.preventDefault();
    selectTechForm.addClass("hidden");
    $(`#edit-${techId}`).removeClass("hidden");
  });
});
