const button = document.getElementById("openWidget");
const box = document.getElementById("widgetBox");

button.onclick = () => {

if(box.style.display === "block"){
box.style.display = "none";
}else{
box.style.display = "block";
}

};

document.getElementById("ticketForm").addEventListener("submit", async (e)=>{

e.preventDefault();

const formData = new FormData(e.target);

const res = await fetch("/api/ticket",{
method:"POST",
body:formData
});

const data = await res.json();

if(data.success){

alert("Ticket created!");

}else{

alert("Error creating ticket");

}

});