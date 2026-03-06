const openBtn = document.getElementById("openWidget");
const closeBtn = document.getElementById("closeWidget");
const widget = document.getElementById("widgetBox");
const form = document.getElementById("ticketForm");
const success = document.getElementById("successMessage");
const submitBtn = document.getElementById("submitBtn");

openBtn.onclick = () => {
widget.style.display = "block";
};

closeBtn.onclick = () => {
widget.style.display = "none";
};

form.addEventListener("submit", async (e)=>{

e.preventDefault();

submitBtn.innerText = "Sending...";
submitBtn.disabled = true;

const formData = new FormData(form);

try{

const res = await fetch("/api/ticket",{
method:"POST",
body:formData
});

const data = await res.json();

if(data.success){

form.style.display="none";
success.style.display="block";

}

}catch(err){

alert("Server error");

}

submitBtn.innerText="Submit Ticket";
submitBtn.disabled=false;

});