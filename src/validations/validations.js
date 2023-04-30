const isValidEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const passwordVal = function (password) {
    var strongRegex = new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,15}$/
    );
    /*at least 1 lowercase, at least 1 uppercase,contain at least 1 numeric character,
        at least one special character, range between 8-15*/
    return strongRegex.test(password);
};

const isValidName = function (name) {
    const nameRegex = /^[a-z A-Z_]{3,20}$/;
    return nameRegex.test(name);
};

const isValidNo = function (number) {
    const validnumber = /^[6789]\d{9}$/
    return validnumber.test(number);
};

const isValidQuestion = function(question){
    const questionRegex = /^[a-z A-Z_]{10,1000}$/;
    return questionRegex.test(question);
}

const isValidAnswer = function(answer){
    const answerRegex = /^[a-z A-Z_]{3,30}$/;
    return answerRegex.test(answer);
}


module.exports = { isValidEmail, passwordVal, isValidName, isValidNo, isValidQuestion, isValidAnswer };