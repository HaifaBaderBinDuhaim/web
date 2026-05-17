function generateResponse() {

const question =
document.getElementById("studentQuestion")
.value
.toLowerCase()
.trim();

const responseBox =
document.getElementById("aiResponse");

let response="";

if(question===""){

response=
"Please type your question first.";

}

else if(
question.includes("exam") ||
question.includes("quiz") ||
question.includes("test")
){

response=
"Focus on important topics, review summaries, and solve practice questions.";

}

else if(
question.includes("deadline") ||
question.includes("assignment") ||
question.includes("project") ||
question.includes("homework")
){

response=
"Break the task into smaller steps and start with the hardest part.";

}

else if(
question.includes("stress") ||
question.includes("tired") ||
question.includes("lost") ||
question.includes("anxious") ||
question.includes("panic")
){

response=
"Take a short break and start with a small 25-minute study session.";

}

else if(
question.includes("time") ||
question.includes("schedule")
){

response=
"Create a simple study plan and divide your time into short sessions.";

}

else{

response=
"Sorry, I couldn't understand your question. Try words like exam, stress, project, or deadline.";

}

responseBox.textContent=response;

}
function goBack() {
  window.location.href = "dashboard.html";
}
