import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

/** middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        const { username } = ((req.method == "GET") || (req.method == "DELETE")) ? req.query : req.body;

        // check the user existence
        const exist = await UserModel.findOne({ email: username });
        if (!exist)
            return res.status(404).send({ error: "Username not Found" });
        next();
    } catch (error) {
        return res.status(404).send({ error: "Authentication Failed" });
    }
}

/** POST: http://localhost:4040/api/register
 * @param : {
  "name": "user01",
  "email": "user01@gmail.com",
  "password": "user01@abc",
  "confirmPassword": "user01@abc"
  }
*/
export async function register(req, res) {
    
    const { role, password, email, contact, nic } = req.body;

    
    try {
        // check for existing email
        const existEmail = await UserModel.findOne({ email });
        const existNIC = await UserModel.findOne({ nic });
        const existContact = await UserModel.findOne({ contact });
        let error = {};
        if (existEmail) {error.email = "Please use unique Email";}
        if (existNIC) {error.nic = "Please use unique NIC";}
        if (existContact) {error.contact = "Please use unique Contact Number";}
        if (!(Object.keys(error).length === 0 && error.constructor === Object)) {
            return res.status(500).send({ error });
        } else {
            if (password) {
                bcrypt
                .hash(password, 8)
                .then((hashedPassword) => {
                    let user;
                    if (role === "GN") {
                        const {
                            name,
                            address,
                            gsDivision,
                            divisionNumber,
                        } = req.body;
                        user = new UserModel({
                            name,
                            address,
                            nic,
                            contact,
                            email,
                            role,
                            gsDivision,
                            divisionNumber,
                            password: hashedPassword,
                        });
                    } else if (role === "ORG") {
                        const {
                            name,
                            gsDivision,
                            divisionNumber,
                            boardName,
                            boardAddress,
                            boardPhone,
                            boardEmail,
                        } = req.body;
                        user = new UserModel({
                            name,
                            email,
                            gsDivision,
                            divisionNumber,
                            contact,
                            boardName,
                            boardAddress,
                            nic,
                            boardPhone,
                            boardEmail,
                            role,
                            password: hashedPassword,
                        });
                    } else if (role === "PHI") {
                        const {
                            name,
                            address,
                            gsDivisions,
                        } = req.body;
                        user = new UserModel({
                            name,
                            email,
                            contact,
                            nic,
                            address,
                            gsDivisions,
                            role,
                            password: hashedPassword,
                        });
                    } else if (role === "ORG") {
                        const {
                            name,
                            gsDivision,
                            divisionNumber,
                            boardName,
                            boardAddress,
                            boardPhone,
                            boardEmail,
                        } = req.body;
                        user = new UserModel({
                          name,
                          email,
                          gsDivision,
                          divisionNumber,
                          contact,
                          boardName,
                          boardAddress,
                          nic,
                          boardPhone,
                          boardEmail,
                          role,
                          password: hashedPassword,
                        });
                    } else if (role === "PHI") {
                        const {
                            name,
                            address,
                            gsDivisions,
                        } = req.body;
                        user = new UserModel({
                            name,
                            email,
                            contact,
                            nic,
                            address,
                            gsDivisions,
                            role,
                            password: hashedPassword,
                        });
                    } else if (role === "DR") {
                        
                        const {
                            registrationNumber,
                            name,
                            wardNo,
                            divisionNumber,
                        } = req.body;
                        user = new UserModel({
                            registrationNumber,
                            name,
                            email,
                            contact,
                            wardNo,
                            role,
                            nic,
                            divisionNumber,
                            password: hashedPassword,
                        });
                    } else if (role === "NR") {
                        
                        const {
                            registrationNumber,
                            name,
                            
                        } = req.body;
                        user = new UserModel({
                            registrationNumber,
                            name,
                            email,
                            contact,
                            role,
                            nic,
                            password: hashedPassword,
                        });
                    }


                    // return res.status(500).send(user);
                        

                        // return save result as a response
                        user.save()
                            .then((result) =>
                                res
                                    .status(201)
                                    .send({ msg: "Register Successfully" })
                            )
                            .catch((error) =>
                                res.status(500).send({ error:"vcfggy" })
                            );
                    })
                    .catch((error) => {
                        return res.status(500).send({
                            error: "Enable to hashed password",
                        });
                    });
            }
        }
            
    } catch (error) {
        return res.status(500).send(error);
    }
}

/** POST: http://localhost:4040/api/login
 * @param : {
  "username": "user01@gmail.com",
  "password": "user01@abc"
  }
*/
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        await UserModel.findOne({ email: username })
            .then((user) => {
                bcrypt
                    .compare(password, user.password)
                    .then((passwordCheck) => {
                        if (!passwordCheck)
                            return res
                                .status(404)
                                .send({ error: "Password does not match" });

                        // create JWT token
                        const token = jwt.sign(
                            {
                                userId: user._id,
                                name: user.name,
                                username: user.email,
                                role: user.role,
                            },
                            ENV.JWT_SECRET,
                            { expiresIn: "24h" }
                        );

                        return res.status(200).send({
                            msg: "Login Successfully...!",
                            username: user.email,
                            role: user.role,
                            token,
                        });
                    })
                    .catch((error) => {
                        return res
                            .status(404)
                            .send({ error: "Password does not match" });
                    });
            })
            .catch((error) => {
                return res.status(404).send({ error: "Username not Found" });
            });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/** GET: http://localhost:4040/api/user/:id */
/** GET: http://localhost:4040/api/getUser/:username */
export async function getUser(req, res) {
    let _id = "";
    let email = "";
    req.params.id ? (_id = req.params.id) : (email = req.params.username);

    try {
        if (!_id && !email) return res.status(404).send({ error: "Invalid userID or username" });

        try {
            let user = "";
            if (_id) {
                user = await UserModel.findOne({ _id });
            } else {
                user = await UserModel.findOne({ email });
            }

            if (!user)
                return res.status(501).send({ error: "Cannot find user data" });

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        } catch (error) {
            return res.status(500).send({ error });
        }
    } catch (error) {
        return res.status(501).send({ error: "Cannot find user data" });
    }
}

/** GET: http://localhost:4040/api/getUsers/:role */
export async function getUsers(req, res) {
    let userRole = req.params.role;
    try {
        if (!userRole) return res.status(404).send({ error: "Invalid URL" });
        
        try {
            let users = await UserModel.find({ role: userRole });;
            // return res.status(201).send(users);

            if (!users)
                return res.status(501).send({ error: "Cannot find users data" });

            /** remove password from users */
            // mongoose return unnecessary data with object so convert it into json
            let data = [];
            users.forEach(user => {
                const { password, ...rest } = Object.assign({}, user.toJSON());
                data.push(rest);
            });

            return res.status(201).send(data);
        } catch (error) {
            return res.status(500).send({ error });
        }
    } catch (error) {
        return res.status(501).send({ error: "Cannot find users data" });
    }
}

/** PUT: http://localhost:4040/api/updateuser */
export async function updateUser(req, res) {
    try {
        const { userId } = req.user;
        if (userId) {
            const body = req.body;
            try {
                const updateOk = await UserModel.findByIdAndUpdate( { _id: userId }, body, { new: true } );
                if (!updateOk) {
                    return res.status(501).send({ error: "Cannot update user data" });
                }
                return res.status(201).send({ msg: "Update Successfully" });
            } catch (error) {
                return res.status(500).send({ error });
            }
        } else {
            return res.status(401).send({ error: "User not found" });
        }
    } catch (error) {
        return res.status(401).send({ error });
    }
}

/** DELETE: http://localhost:4040/api/deletedata/:id */
export async function deleteData(req, res) {
    let id = req.params.id;
    try {
        const deleteOk = await UserModel.findByIdAndDelete(id);
        if (!deleteOk) {
            return res
                .status(501)
                .send({ error: "Cannot delete user data" });
        }
        return res.status(201).send({ msg: "Delete Successfully" });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/** GET: http://localhost:4040/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:4040/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;  // reset the OTP value
        req.app.locals.resetSession = true;  // start session for reset password
        return res.status(201).send({ msg: "Verify Successfully!" });
    }
    return res.status(400).send({ error: "Invalid OTP" });
}

// Successfully redirect user when OTP is valid
/** GET: http://localhost:4040/api/createResetSession */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession });
    }
    return res.status(440).send({ error: "Session expired!" });
}

// update the password when we have valid session
/** PUT: http://localhost:4040/api/resetPassword */
export async function resetPassword(req, res) {
    try {

        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });

        const { username, password } = req.body;
        
        const user = await UserModel.findOne({ email: username });
        if (user && password) {
            const hashedPassword = await bcrypt.hash(password, 8);
            if (!hashedPassword) {
                return res.status(500).send({ error: "Enable to hashed password" });
            }
            const resetOk = await UserModel.updateOne({ email: user.email }, { password: hashedPassword });
            if (!resetOk) {
                return res.status(500).send({ error: "Enable to reset password" });
            }
            req.app.locals.resetSession = false;
            return res.status(201).send({msg: "Password reset successfully!"});
        }
        return res.status(404).send({ error: "Username or password not found" });
        
    } catch (error) {
        return res.status(401).send({ error });
    }
}
