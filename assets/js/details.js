import { getDetailsTeams, getSaveMyTeamById } from "./footballAPI.js";
import { registerServiceWorker } from "./swRegister.js";

registerServiceWorker();

var urlParams = new URLSearchParams(window.location.search);
var isFromFavTeam = urlParams.get("favTeam");

var tmbloSave = document.getElementById("save");
var tmblDelete = document.getElementById("delete");
// let item;
if (isFromFavTeam) {
  console.log(isFromFavTeam);
  // tombol delete ditampilkan
  document.getElementById("delete").style.display = "block";

  // ambil detail team dan tampilkan
  getSaveMyTeamById();
} else {
  getDetailsTeams();
}

// Memuat save
tmbloSave.addEventListener("click", () => {
  getDetailsTeams().then((detail) => {
    saveTeam(detail);
  });
});

// Memuat hapus
tmblDelete.addEventListener("click", () => {
  getSaveMyTeamById()
    .then((detail) => {
      getDelateMyTeam(detail);
    })
    .then(() => {
      M.toast({ html: `Team details has be delete!` });
    });
});
