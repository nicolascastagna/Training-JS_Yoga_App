const main = document.querySelector("main");
const basicArray = [
  { pic: 0, min: 1 },
  { pic: 1, min: 1 },
  { pic: 2, min: 1 },
  { pic: 3, min: 1 },
  { pic: 4, min: 1 },
  { pic: 5, min: 1 },
  { pic: 6, min: 1 },
  { pic: 7, min: 1 },
  { pic: 8, min: 1 },
  { pic: 9, min: 1 },
];

let exerciceArray = [];

// Local Storage

(() => {
  if (localStorage.exercices) {
    // Json Parse pour convertir les données JSON au bon format JS, en objet
    exerciceArray = JSON.parse(localStorage.exercices);
  } else {
    exerciceArray = basicArray;
  }
})();

// Cette class va servir de lancement pour le minutage, et quand c'est la fin du chronomètre nouvelle exercice
class Exercice {
  constructor() {
    this.index = 0;
    this.minutes = exerciceArray[this.index].min;
    this.seconds = 0;
  }

  updateCountdown() {
    // Ajoute un 0 au secondes, l'impression chronomètre
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;

    // Si le chronomètre arrive à 0, alors index +1, (image suivante)
    setTimeout(() => {
      if (this.minutes === 0 && this.seconds === "00") {
        this.index++;
        this.ring();
        if (this.index < exerciceArray.length) {
          this.minutes = exerciceArray[this.index].min;
          this.seconds = 0;
          this.updateCountdown();
        } else {
          return page.finish();
        }
      } else if (this.seconds === "00") {
        this.minutes--;
        this.seconds = 59;
        this.updateCountdown();

        // Va permettre le chrono -1sec
      } else {
        this.seconds--;
        this.updateCountdown();
      }
    }, 1000);

    return (main.innerHTML = `
        <div class="exercice-container">
        <p>${this.minutes}:${this.seconds}</p>
        <img src="./img/${exerciceArray[this.index].pic}.png" />
        <div>${this.index + 1}/${exerciceArray.length}</div>
        </div>
        `);
  }

  ring() {
    const audio = new Audio();
    audio.src = "ring.mp3";
    audio.play();
  }
}

const utils = {
  pageContent: function (title, content, btn) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  handleEventMinutes: function () {
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        // Une map pour cibler la valeur de la photo, avec e.target.id
        exerciceArray.map((exo) => {
          if (exo.pic == e.target.id) {
            exo.min = parseInt(e.target.value);
            this.store();
          }
        });
      });
    });
  },

  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        let position = 0;
        exerciceArray.map((exo) => {
          // ajouté une sécurité, où quand ça arrive à 1 il ne faut pas "décaler"
          if (exo.pic == e.target.dataset.pic && position !== 0) {
            // pour intervertir 2 éléments dans un tableau
            [exerciceArray[position], exerciceArray[position - 1]] = [
              exerciceArray[position - 1],
              exerciceArray[position],
            ];
            page.lobby();
            this.store();
          } else {
            position++;
          }
        });
      });
    });
  },

  deleteItem: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let newArr = [];
        exerciceArray.map((exo) => {
          if (exo.pic != e.target.dataset.pic) {
            newArr.push(exo);
          }
        });
        exerciceArray = newArr;
        page.lobby();
        this.store();
      });
    });
  },

  reboot: function () {
    exerciceArray = basicArray;
    page.lobby();
    this.store();
  },

  // function pour stocker et JSON stringify pour convertir les objects en JSON
  store: function () {
    localStorage.exercices = JSON.stringify(exerciceArray);
  },
};

const page = {
  lobby: function () {
    let mapArray = exerciceArray.map((exo) => {
      return `
        <li>
            <div class="card-header">
                <input type="number" id=${exo.pic} min="1" max="10" value=${exo.min}>
                <span>min</span>
            </div>
            <img src="./img/${exo.pic}.png" />
            <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
            <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
            </li>
        `;
    });

    utils.pageContent(
      "Paramétrage <i id='reboot'class='fas fa-undo'></i>",
      "<ul>" + mapArray + "</ul>",
      "<button id='start'>Commencer<i class='far fa-play-circle'></i></button>"
    );

    utils.handleEventMinutes();
    utils.handleEventArrow();
    utils.deleteItem();
    reboot.addEventListener("click", () => utils.reboot());
    start.addEventListener("click", () => this.routine());
  },
  routine: function () {
    const exercice = new Exercice();
    utils.pageContent("Routine", exercice.updateCountdown(), null);
  },

  finish: function () {
    utils.pageContent(
      "C'est terminé!",
      "<button id='start'>Recommencer</button>",
      "<button id='reboot' class='btn-reboot'>Réinistialiser <i class='fas fa-times-circle'></i></button>"
    );

    start.addEventListener("click", () => this.routine());
    reboot.addEventListener("click", () => utils.reboot());
  },
};
page.lobby();
