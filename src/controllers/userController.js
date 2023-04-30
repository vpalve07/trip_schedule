const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { isValidName, isValidEmail, passwordVal, isValidNo, isValidQuestion, isValidAnswer } = require("../validations/validations");

const user = async (req,res) => {
    try {
        let data = req.body
        if (!data.name) return res.status(400).send({ status: false, message: "name is mandatory" })
        if (!data.email) return res.status(400).send({ status: false, message: "email is mandatory" })
        if (!data.phone) return res.status(400).send({ status: false, message: "phone is mandatory" })
        if (!data.password) return res.status(400).send({ status: false, message: "password is mandatory" })

        if (!isValidName(data.name)) return res.status(400).send({ status: false, message: "name is Invalid" });
        data.name = data.name.trim()

        if (!isValidEmail(data.email)) return res.status(400).send({ status: false, message: "email is Invalid" });
        data.email = data.email.trim()

        if (!isValidNo(data.phone)) return res.status(400).send({ status: false, message: "email is Invalid" });
        data.phone = data.phone.trim()

        if (!passwordVal(data.password)) return res.status(400).send({ status: false, message: "Password must be at least 1 lowercase, at least 1 uppercase,contain at least 1 numeric character , at least one special character, range between 8-15" });
        data.password = data.password.trim()

        if (!isValidQuestion(data.secretQuestion.question)) return res.status(400).send({ status: false, message: "secret question is Invalid and can only contain 1000 characters without numerical values" });
        if (!isValidAnswer(data.secretQuestion.answer)) return res.status(400).send({ status: false, message: "secret answer is Invalid and can only contain 30 characters without numerical values" });

        let findEmail = await userModel.findOne({ email: data.email })
        if (findEmail) return res.status(403).send({ status: false, message: "Email Id is already exist" })

        const saltRounds = data.password.length
        let hash = await bcrypt.hash(data.password, saltRounds)
        data.password = hash

        let hashAnswer = await bcrypt.hash(data.secretQuestion.answer, (data.secretQuestion.answer).length)
        data.secretQuestion.answer = hashAnswer

        let createUser = await userModel.create(data)

        return res.status(201).send({ status: true, message: "Sign Up successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const login = async function (req, res) {
    try {
        let data = req.body
        let { email, password } = data
        if (!email) return res.status(400).send({ status: false, message: "email id is required for login" })
        if (!password) return res.status(400).send({ status: false, message: "password is required for login" })

        if (!isValidEmail(data.email)) return res.status(400).send({ status: false, message: "email format is Invalid" });

        if (!passwordVal(data.password)) return res.status(400).send({ status: false, message: "Password must be at least 1 lowercase, at least 1 uppercase,contain at least 1 numeric character , at least one special character, range between 8-15"});

        let userData = await userModel.findOne({ email: email })
        if(!userData) return res.status(404).send({ status: false, message: "no user found with this email" })
        bcrypt.compare(password, userData.password, (err, pass) => {
            if (err) throw err
            if (pass) {
                let token = jwt.sign({ userId: userData._id.toString(), emailId: userData.email , type:userData.type},process.env.secret_key)    //, {expiresIn:'1m'}
                res.setHeader("x-api-key", token)
                return res.status(200).send({ status: true, message: "User Logged in successfully",token:token})
            }else{
                return res.status(400).send({ status: false, message: "Password is wrong" })
              }
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const forgotPass = async function(req,res){
    try {
        let data = req.body
        if(!data.email) return res.status(400).send({ status: false, message: "email is mandatory" })
        if (!isValidEmail(data.email)) return res.status(400).send({ status: false, message: "email format is Invalid" });
        let findUser = await userModel.findOne({email:data.email})
        if(!findUser) return res.status(400).send({status:false,message:"User not found with provided email Id"})
        data.secretQuestion = findUser.secretQuestion.question
        return res.status(200).send({status:true,data:data})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const resetPass = async function(req,res){
    try {
        let data = req.body
    
        if(!data.email) return res.status(400).send({ status: false, message: "email is mandatory" })
        if(!data.secretQuestion) return res.status(400).send({ status: false, message: "secret Question is mandatory" })
        if(!data.answer) return res.status(400).send({ status: false, message: "answer for secret Question is mandatory" })
    
        let findUser = await userModel.findOne({email:data.email})
        if(!findUser) return res.status(400).send({status:false,message:"User not found with provided email Id"})
        
        if(data.secretQuestion!=findUser.secretQuestion.question) return res.status(400).send({status:false,message:"Given Question is wrong"})
    
        let answer = await bcrypt.compare(data.answer,findUser.secretQuestion.answer)
        if(!answer) return res.status(400).send({status:false,message:"Given Answer is wrong"})
        
        if(!data.newPassword) return res.status(400).send({ status: false, message: "newPassword is mandatory" })
    
        if (!passwordVal(data.newPassword)) return res.status(400).send({ status: false, message: "Password must be at least 1 lowercase, at least 1 uppercase,contain at least 1 numeric character , at least one special character, range between 8-15"});
        data.newPassword = data.newPassword.trim()
    
        const saltRounds = data.newPassword.length
        let hash = await bcrypt.hash(data.newPassword, saltRounds)
        data.newPassword = hash
    
        let updatePass = await userModel.findOneAndUpdate({email:data.email},{password:data.newPassword},{new:true})
        return res.status(200).send({status:true,message:"Password Changed Successfully"})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { user, login, forgotPass, resetPass }