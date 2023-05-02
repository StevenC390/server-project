const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");

const register = (req, res) =>{
    const {firstname, lastname, email, password} = req.body;

    if (!email) res.status(400).send({msg:"Email required"});
    if (!password) res.status(400).send({msg:"Password required"});

    const user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        role: "user",
        active: false,
    });

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;

    user.save((error, userStorage) => {
        if (error) {
            res.status(400).send({msg:"Error creating user"});
        }else {
            res.status(200).send(userStorage);
        }
    });
};
const login = (req, res) => {
    const { email, password } = req.body;
    if (!email) res.status(400).send({msg:"Email required"});
    if (!password) res.status(400).send({msg:"Password required"});
    const emailLowerCase = email.toLowerCase();
    User.findOne({ email:emailLowerCase}, (error, userStore) =>{
        if(error){
            res.status(500).send({msg: "Server error"});
        }else{
            bcrypt.compare(password, userStore.password, (bcryptError, check) => {
                if(bcryptError){
                    res.status(500).send({msg: "Server error"});
                }else if (!check){
                    res.status(400).send({msg:"Wrong password"});
                }else if (!userStore.active){
                    res.status(401).send({msg:"Permission denied / User inactive"});
                }else{
                    res.status(200).send({
                        access: jwt.createAccessToken(userStore),
                        refresh: jwt.createRefreshToken(userStore),
                    });
                }
            });
        }
    });
};

//Falta hacer mas xd saquelos del discord