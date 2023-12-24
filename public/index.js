$(document).ready(() => {
  console.log("JS is loaded.");

  // ====== Declare Elements
  const body = $("body");
  const dashboard = $("#dashboard"); // Container for all results
  const platoons = $("#platoons");

  $.get("/techs", (data) => {
    console.log("All Techs Data", data);
  });

  function showPlatoon(platoon_id) {
    let platoonCont = $(`<div id="platoon-${platoon_id}"></div>`)
      .addClass("all-platoons")
      .appendTo(platoons);
    $.get(`/techs/${platoon_id}`, (data) => {
      console.log(`Data from ${platoon_id} platoon`, data);
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
        let techTitle = $(
          `<h2>${data[i].platoon_id}-${data[i].team_id} ${shortTitle}:</h2>`
        ).appendTo(techDetails);
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
      }
    });
  }

  showPlatoon("1");

  function getPlatoonTitle(platoon_id) {
    if (platoon_id === "1") return "1st Platoon";
    if (platoon_id === "2") return "2nd Platoon";
    if (platoon_id === "3") return "3rd Platoon";
    if (platoon_id === "HQ") return "HQ Platoon";
    if (platoon_id === null) return "UNASSIGNED";
  }

  function getPostionTitle(position) {
    if (position === "Team Leader") return "TL";
    if (position === "Senior Team Member") return "TM";
    if (position === "Team Member") return "TM";
  }

  function getBadgePic(badge_level) {
    if (badge_level === "MASTER") return "/media/master-eod.png";
    if (badge_level === "SENIOR") return "/media/senior-eod.png";
    if (badge_level === "BASIC") return "/media/basic-eod.png";
  }

  // TODO
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

  // ==============
});
