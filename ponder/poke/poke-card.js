const ditto = {
id: 132,
name: "ditto",
type: "normal",
abilities: ["limber", "imposter"],
base_experience: 101,
height: 3,
weight: 40,
stats: {
hp: 48,
attack: 48,
defense: 48,
special_attack: 48,
special_defense: 48,
speed: 48
},
sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
transform: function(){
return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/132.png"
}
};

document.querySelector("#name").textContent = ditto.name;
document.querySelector("#ability").textContent = ditto.abilities[1];

let ditto_img = document.querySelector("#ditto");
ditto_img.src = ditto.sprite;

ditto_img.addEventListener('click', function(){
    ditto_img.src = ditto.transform();
})