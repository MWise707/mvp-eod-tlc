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
  const viewAllPlatoons = $("#view-all-platoons");
  const view1stPlatoon = $("#view-1st-Plt");
  const view2ndPlatoon = $("#view-2nd-Plt");
  const view3rdPlatoon = $("#view-3rd-Plt");
  const viewHqPlatoon = $("#view-HQ-Plt");
  const viewUnassigned = $("#view-unassigned");

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
  let positionList = {
    "Team Leader": "TL",
    "Senior Team Member": "TM",
    "Team Member": "TM",
    "Platoon Leader": "PL",
    "Platoon Sergeant": "PSG",
    "Operations NCO": "Ops NCO",
    "Company Commander": "CDR",
    "First Sergeant": "1SG",
    Unassigned: "Unassigned",
  };
  let rankList = {
    "E-3 / PFC": "PFC",
    "E-4 / SPC": "SPC",
    "E-5 / SGT": "SGT",
    "E-6 / SSG": "SSG",
    "E-7 / SFC": "SFC",
    "E-8 / 1SG": "1SG",
    "O-1 / 2LT": "2LT",
    "O-2 / 1LT": "1LT",
    "O-3 / CPT": "CPT",
  };

  let platoonList = {
    "1st Platoon": "1",
    "2nd Platoon": "2",
    "3rd Platoon": "3",
    "HQ Platoon": "4",
    UNASSIGNED: "5",
  };

  let teamList = {
    "1 (1-1, 2-1, or 3-1)": "1",
    "2 (1-2, 2-2, or 3-2)": "2",
    "3 (1-3, 2-3, or 3-3)": "3",
    "Not on a team": null,
  };

  let badgeList = {
    BASIC: "/media/basic-eod.png",
    SENIOR: "/media/senior-eod.png",
    MASTER: "/media/master-eod.png",
  };

  function createTechEditForm(tech) {
    let selectedFields = [];
    let techEditForm = $(
      `<form id="edit-${tech.tech_id}" class="custom-edit-form">Choose Fields to Change</form>`
    )
      .appendTo(body)
      .addClass("hidden");
    for (const field in tech) {
      if (
        tech.hasOwnProperty(field) &&
        field !== "tech_id" &&
        field !== "is_officer"
      ) {
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
        `<form id="edit-selections-${tech.tech_id}" class="custom-edit-form">${tech.rank} ${tech.last_name}</form>`
      ).appendTo(body);
      for (let i = 0; i < selectedFields.length; i++) {
        let fieldName = selectedFields[i];
        if (fieldName === "rank") {
          createDynamicFormElement(
            fieldName,
            "optionDropdown",
            techEditor,
            rankList
          );
        }
        if (fieldName === "first_name") {
          createDynamicFormElement(fieldName, "textInput", techEditor);
        }
        if (fieldName === "last_name") {
          createDynamicFormElement(fieldName, "textInput", techEditor);
        }
        if (fieldName === "position") {
          createDynamicFormElement(
            fieldName,
            "optionDropdown",
            techEditor,
            positionList
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
        if (fieldName === "platoon_id") {
          createDynamicFormElement(
            fieldName,
            "optionDropdown",
            techEditor,
            platoonList
          );
        }
        if (fieldName === "team_id") {
          createDynamicFormElement(
            fieldName,
            "optionDropdown",
            techEditor,
            teamList
          );
        }
        if (fieldName === "badge_level") {
          createDynamicFormElement(
            fieldName,
            "optionDropdown",
            techEditor,
            badgeList
          );
        }
      }
      let submitTechEditsBtn = $(
        '<button type="submit" class="btn btn-primary" id="submitTechEdits">Submit Changes</button>'
      ).appendTo(techEditor);
      submitTechEditsBtn.on("click", (e) => {
        console.log("Submit Tech Edits button clicked");
        for (let i = 0; i < selectedFields.length; i++) {
          let editKey = selectedFields[i];

          switch (editKey) {
            case "rank":
              editTechObj[editKey] = $("#change-rank option:selected")
                .text()
                .slice(-3);
              editTechObj.is_officer =
                editTechObj[editKey] === "2LT" ||
                editTechObj[editKey] === "CPT" ||
                editTechObj[editKey] === "1LT";
              break;

            case "first_name":
              console.log($("#changeFirstName").val());
              editTechObj[editKey] = $("#change-first_name").val();
              break;

            case "last_name":
              editTechObj[editKey] = $("#change-last_name").val();
              break;

            case "position":
              editTechObj[editKey] = $(
                "#change-position option:selected"
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
              editTechObj[editKey] = getPlatoonId(
                $("#change-platoon_id option:selected").text()
              );
              break;

            case "team_id":
              editTechObj[editKey] = getTeamId(
                $("#change-team_id option:selected").text()
              );
              break;

            case "badge_level":
              editTechObj[editKey] = $(
                "#change-badge_level option:selected"
              ).text();
              break;

            default:
              console.log("No changes made");
              break;
          }
          console.log(editTechObj);
          editTech(tech.tech_id, editTechObj)
            .then(() => {
              showAllPlatoons();
            })
            .catch((error) => {
              console.error("Error running eidtTech function:", error);
            });
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

  // Get Platoon Info populates the platoon div
  function getPlatoonInfo(platoon_id) {
    let platoonCont = $(`<div id="platoon-${platoon_id}"></div>`)
      .addClass("all-platoons hidden")
      .appendTo(platoons);
    $.get(`/techs/${platoon_id}`, (data) => {
      const pltLabel = getPlatoonTitle(platoon_id);
      const platoonTitle = $(`<h1 id=${platoon_id}PLT>${pltLabel}</h1>`)
        .addClass("platoon-title")
        .appendTo(`#platoon-${platoon_id}`);
      for (let i = 0; i < data.length; i++) {
        let badgeLink = badgeList[data[i].badge_level];
        let shortTitle = positionList[data[i].position];
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

  const showAllPlatoons = function () {
    emptyContainer(platoons);
    getPlatoonInfo("1");
    getPlatoonInfo("2");
    getPlatoonInfo("3");
    getPlatoonInfo("4");
    getPlatoonInfo("5");
  };

  showAllPlatoons();

  // API Calls to server
  function addTech(techObj) {
    $.post({
      url: "/techs",
      contentType: "application/json",
      data: JSON.stringify(techObj),
      success: function (data) {
        emptyContainer($(`#platoon-${newTech.platoon_id}`));
        getPlatoonInfo(newTech.platoon_id);
        $(".all-platoons").toggle();
        dashboard.removeClass("hidden");
        $(`#platoon-${newTech.platoon_id}`).toggle();
        console.log("Success adding tech");
      },
      error: function (error) {
        console.error("Error adding tech:", error);
      },
    });
  }

  function deleteTech(techId, platoonId) {
    $.ajax({
      url: `/techs/${techId}`,
      type: "DELETE",
      success: () => {
        emptyContainer($(`#platoon-${platoonId}`));
        getPlatoonInfo(platoonId);
        $(".all-platoons").toggle();
        dashboard.removeClass("hidden");
        $(`#platoon-${platoonId}`).toggle();
        console.log("Success deleting tech");
      },
      error: (error) => {
        console.error("Error deleting tech", error);
      },
    });
  }

  function editTech(techId, editObj) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/techs/${techId}`,
        data: JSON.stringify(editObj),
        type: "PATCH",
        contentType: "application/json",
        success: () => {
          techEditForm.addClass("hidden");
          dashboard.removeClass("hidden");
          console.log("Success editing tech");
          resolve();
        },
        error: (error) => {
          console.error("Error editing tech", error);
          reject(error);
        },
      });
    });
  }

  // ========== HELPER FUNCTIONS ===============
  createDynamicFormElement = function (
    field,
    fieldType,
    parentForm,
    referenceObj
  ) {
    let dynamicDiv = $('<div class="form-group"></div>')
      .appendTo(parentForm)
      .append($(`<label for="change-${field}">Change ${field}</label>`));

    if (fieldType === "textInput") {
      dynamicDiv.append(
        $(
          `<input type="text" class="form-control" id="change-${field}" placeholder="Enter ${field} here"/>`
        )
      );
    } else if (fieldType === "optionDropdown") {
      let selectDiv = $(
        `<select class="form-control" id="change-${field}"/>`
      ).appendTo(dynamicDiv);
      console.log(referenceObj);
      for (const dynamicOpt in referenceObj) {
        let option = $(`<option>${dynamicOpt}</option>`).appendTo(selectDiv);
        console.log("Created dynamic dropdown option", dynamicOpt);
      }
    }
  };

  function getPlatoonTitle(platoon_id) {
    for (const [key, value] of Object.entries(platoonList)) {
      if (value === platoon_id) {
        return key;
      }
    }
  }

  function getPlatoonId(pltTitle) {
    return platoonList[pltTitle];
  }

  function getTeamId(teamSelected) {
    return teamList[teamSelected];
  }

  function getRank(rankSelected) {
    return rankSelected.slice(-3);
  }

  function isVisible(element) {
    return !element.hasClass("hidden");
  }

  function emptyContainer(container) {
    if (container) {
      container.empty();
    }
  }

  // Displays check mark or tlc percentage
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

  // This allows for user to see all techs in dropdown menu
  function populateTechSelection() {
    showAllTechs()
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          let techOption = $(
            `<option id="${data[i].tech_id}:${data[i].platoon_id}">${
              data[i].rank
            } ${data[i].first_name} ${data[i].last_name}: ${getPlatoonTitle(
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

  // =========== EVENT LISTENERS ================

  addTechBtn.on("click", () => {
    dashboard.addClass("hidden");
    newTechForm.removeClass("hidden");
  });

  // This is the Remove/Edit Tech button
  removeTechBtn.on("click", () => {
    console.log("Delete tech btn clicked");
    dashboard.add(newTechForm).addClass("hidden");
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
    e.preventDefault();
    const selectedOption = $("#tech-selected option:selected");
    const techId = selectedOption.attr("id").split(":")[0];
    const platoonId = selectedOption.attr("id").split(":")[1];
    console.log("Selected Tech ID:", techId);
    deleteTech(techId, platoonId);
    selectTechForm.addClass("hidden");
  });

  showEditOptions.on("click", (e) => {
    e.preventDefault();
    console.log("Show edit options clicked");
    const selectedOption = $("#tech-selected option:selected");
    const techId = selectedOption.attr("id").split(":")[0];
    selectTechForm.addClass("hidden");
    $(`#edit-${techId}`).removeClass("hidden");
  });

  // TODO finish logic for viewing all platoons
  viewAllPlatoons.on("click", () => {
    console.log("View All Platoons clicked");
    showAllPlatoons();
    dashboard.removeClass("hidden");
    $("form").addClass("hidden");
  });

  view1stPlatoon.on("click", () => {
    console.log("View1stPlatoon button clicked");
    emptyContainer(platoons);
    getPlatoonInfo("1");
    dashboard.removeClass("hidden");
    $("form").addClass("hidden");
  });

  view2ndPlatoon.on("click", () => {
    console.log("View2ndPlatoon button clicked");
    emptyContainer(platoons);
    getPlatoonInfo("2");
    dashboard.removeClass("hidden");
    $("form").addClass("hidden");
  });

  view3rdPlatoon.on("click", () => {
    console.log("View3rdPlatoon button clicked");
    emptyContainer(platoons);
    getPlatoonInfo("3");
    dashboard.removeClass("hidden");
    $("form").addClass("hidden");
  });

  viewHqPlatoon.on("click", () => {
    console.log("ViewHQPlatoon button clicked");
    emptyContainer(platoons);
    getPlatoonInfo("4");
    dashboard.removeClass("hidden");
    $("form").addClass("hidden");
  });

  viewUnassigned.on("click", () => {
    console.log("ViewUnassignedPlatoon button clicked");
    emptyContainer(platoons);
    getPlatoonInfo("5");
    dashboard.removeClass("hidden");
    $("form").addClass("hidden");
  });
});
