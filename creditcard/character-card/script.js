const character = {
      name: "Snortleblat",
      class: "Swamp Beast Diplomat",
      level: 5,
      health: 100,
      image: 'https://andejuli.github.io/img/snortleblat.png',
      attacked: function() {
            if (this.health >= 20) {
                this.health -= 20;
                console.log("Attacked!");
            } else {
                alert('Character Died');
            }
        },
      levelUp: function() {
            this.level += 1;
            this.health += 20;
        }
    };

document.querySelector(".name").textContent = character.name;
document.querySelector("#class").textContent = character.class;
document.querySelector("#level").textContent = character.level;
document.querySelector("#health").textContent = character.health;

document.querySelector(".image").src = character.image;

let attack_button = document.getElementById("attacked");
let levelup_button = document.getElementById("levelup");

attack_button.addEventListener('click', function(){
    console.log("Health: ", character.health);
    character.attacked();
    document.querySelector("#health").textContent = character.health;
    if (character.health == 0){
        document.querySelector("#health").textContent = character.health;
        alert("Character died!");
    }
});

levelup_button.addEventListener('click', function(){
    console.log("Level: ", character.level);
    character.levelUp();
    document.querySelector("#level").textContent = character.level;
    document.querySelector("#health").textContent = character.health;
});
