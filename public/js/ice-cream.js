document.getElementById("order-form").onsubmit = () => {

    clearErrors();


    let isValid = true;

    let name = document.getElementById("order-name").value.trim();
    let email = document.getElementById("order-email").value.trim();
    let flavor = document.getElementById("flavor");
    let cone = document.getElementsByName("cone-option");

    //Validate first name

    if (!name){
        document.getElementById("err-name").style.display = "block";
        isValid = false;
    }


    //Validate email
    if (!email)
    {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
}
    //Validate flavor
    if (flavor.value == "none"){
        document.getElementById("err-flavor").style.display = "block";
        isValid = false;
    }
    //Validate cone
    let count = 0;
    for (let i=0; i<cone.length; i++){
        if (cone[i].checked){
            count++;
        }
    }
    if (count == 0){
        document.getElementById("err-cone").style.display = "block";
        isValid = false;
    }

    return isValid;

}

function clearErrors(){
    let errors = document.getElementsByClassName("err");
    for (let i=0; i<errors.length; i++){
        errors[i].style.display = "none";
    }
}