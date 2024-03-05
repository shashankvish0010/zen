import express from "express"
import bodyParser from "body-parser"
import pool from "../../dbconnect"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken"
import { Redis } from "ioredis"
import { socketId } from "../app"
const redisClient = new Redis('rediss://red-cn74mricn0vc738smbl0:NkKo1Cj90zuRDn7KgQb6FB2faBtc7GER@oregon-redis.render.com:6379')
const router = express.Router()

router.use(bodyParser.json())
router.get('/', (req, res) => res.send('hello from BE'))
let actualotp: number
let zenNo: number
router.post('/user/register', async (req, res) => {
    const { firstname, lastname, email, password, confirm_password } = req.body;
    try {
        if (!firstname || !lastname || !email || !password || !confirm_password) {
            res.json({ success: false, message: "Fill all the fields" })
        } else {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (emailPattern.test(email)) {
                const emailExists = await pool.query('SELECT email from Users WHERE email=$1', [email])
                if (emailExists.rows.length > 0) {
                    res.json({ success: false, message: "Email already registered" })
                } else {
                    if (password === confirm_password) {
                        const salt = Number(bcrypt.genSalt(10))
                        const hashedPassword = await bcrypt.hash(password, salt)
                        if (hashedPassword) {
                            const generatedOtp = Number(`${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`)
                            actualotp = generatedOtp

                            const transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.EMAIL_USER,
                                    pass: process.env.EMAIL_PASS
                                }
                            })

                            const email_message = {
                                from: process.env.EMAIL_USER,
                                to: email,
                                subject: 'Please Verify your Zen Account',
                                text: `Your verification code for zen is ${actualotp}`
                            }

                            const zenNoGen = () => { zenNo = Number(`${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`) }

                            transporter.sendMail(email_message).then(async () => {
                                const id = uuidv4();
                                zenNoGen()

                                const zenNoExists = await pool.query('SELECT zen_no from Users WHERE zen_no=$1', [zenNo])
                                if (zenNoExists.rows.length > 0) {
                                    zenNoGen()
                                } else {
                                    const userReg = await pool.query('INSERT INTO Users(id,firstname,lastname,email,user_password,zen_no,account_verified,active) VALUES($1,$2,$3,$4,$5,$6,$7,$8)', [id, firstname, lastname, email, hashedPassword, zenNo, false, false])
                                    if (userReg) {
                                        res.json({ success: true, message: "Zen account created.", id })
                                    } else {
                                        res.json({ success: false, message: "Account cannot be created" })
                                    }
                                }

                            }).catch((error) => console.log(error))

                        }
                    }
                    else {
                        res.json({ success: false, message: "Password does not match" })
                    }
                }
            } else {
                res.json({ success: false, message: "Email pattern is invalid" })
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/otp/verification/:id', async (req, res) => {
    const { id } = req.params
    const { otp } = req.body
    if (id) {
        const user = await pool.query('SELECT * FROM Users WHERE id=$1', [id])
        console.log(user);

        if (user.rows.length > 0) {
            if (actualotp === otp) {
                const accountVerified = await pool.query('UPDATE Users SET account_verified=$1 WHERE id=$2', [true, id])
                if (accountVerified) {
                    res.json({ success: true, message: "OTP Verified Successfully." })
                } else {
                    res.json({ success: false, message: "OTP Verification failed." })
                }
            } else {
                res.json({ success: false, message: "Invalid OTP" })
            }
        }
    }
})

router.get('/resend/otp/:id', async (req, res) => {
    const { id } = req.params
    const user = await pool.query('SELECT * FROM Users WHERE id=$1', [id])
    if (user.rows.length > 0) {
        const reGeneratedOtp = Number(`${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`)
        actualotp = reGeneratedOtp

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const email_message = {
            from: process.env.EMAIL_USER,
            to: user.rows[0].email,
            subject: 'New Zen Verfication Code',
            text: `Your zen account verifaction code is ${actualotp}`
        }

        transporter.sendMail(email_message).then(async () => {
            res.json({ success: true, message: "OTP Resend Successfully." })
        }).catch((err) => console.log(err))
    }
})

router.post('/user/login', async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            res.json({ success: false, message: "Fill both fields" })
        } else {
            const user = await pool.query('SELECT * FROM Users WHERE email=$1', [email])
            if (user.rowCount === 0) {
                res.json({ success: false, message: "Email does not exists" })
            }
            else {
                if (email == user.rows[0].email) {
                    if (socketId) {
                        const isMatch = await bcrypt.compare(password, user.rows[0].user_password)
                        if (isMatch) {
                            if (user.rows[0].account_verified === false) {
                                res.json({ success: false, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Please Verify Your Account" })
                            } else {
                                const token = jwt.sign(user.rows[0].id, `${process.env.USERS_SECRET_KEY}`);
                                const update = await pool.query('UPDATE Users SET active=$2 WHERE email=$1', [email, true]);
                                if (update) {
                                    const allactiveUsers = await pool.query('SELECT zen_no from Users WHERE active=true');
                                    if (allactiveUsers.rowCount > 0) {
                                        console.log(allactiveUsers.rows);
                                        await redisClient.expire("ActiveUsers", 1000).then(async () => {
                                            const userArray: any = allactiveUsers.rows;
                                            await redisClient.set("ActiveUsers", JSON.stringify(userArray)).then(() => {
                                                res.json({ success: true, userdata: user.rows[0], id: user.rows[0].id, token, verified: user.rows[0].account_verified, message: "Login Successfully" })
                                            }).catch((error => console.log(error)))
                                        }).catch((error => console.log(error)))
                                    }
                                } else {
                                    res.json({ success: false, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Active status not updated" })
                                }
                            }
                        } else {
                            res.json({ success: false, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Incorrect Password" })
                        }
                    }
                    else {
                        res.json({ success: false, message: "Socket Id does not exists" })
                    }
                } else {
                    res.json({ success: false, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Email already exists" })
                }
            }
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

router.get('/user/logout/:id', async (req, res) => {
    const { id } = req.params
    if (id) {
        try {
            const updateActiveUser = await pool.query('UPDATE Users SET active=false WHERE id=$1', [id]);
            await redisClient.expire("ActiveUsers", 1000)
            if (updateActiveUser) {
                const allactiveUsers = await pool.query('SELECT zen_no from Users WHERE active=true');
                const userArray: any = allactiveUsers.rows;
                await redisClient.set("ActiveUsers", JSON.stringify(userArray)).then(() => {
                    res.json({ success: true, message: "Logout Successfully" })
                }).catch((error => console.log(error)))
            }
        } catch (error) {
            console.log(error);
        }
    }
})

router.get('/get/zenlist/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (id) {
            const result = await pool.query('SELECT zen_list FROM Users WHERE id=$1', [id]);
            if (result.rowCount > 0) {
                const userContactList = result.rows[0].zen_list
                const data = await redisClient.get("ActiveUsers")

                if (data && userContactList) {
                    const result = await JSON.parse(data)
                    console.log("result", result)
                    const updatedContactList = await userContactList.map((user: any) => {
                        console.log(user);
                        user.active = false
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].zen_no == user.zen_no) {
                                user.active = true
                            }
                        }
                        return user
                    })
                    res.json({ success: true, contactList: updatedContactList, message: "Cant get the User ID" })
                } else {
                    console.log("No user found in zen list")
                }
            } else {
                console.log("No user found in zen list")
            }
        } else {
            res.json({ success: false, message: "Cant get the User ID" })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/add/tozenlist/:id', async (req, res) => {
    const { id } = req.params;
    const { zenNo } = req.body;
    try {
        if (zenNo) {
            const IszenNoValid = await pool.query('SELECT zen_no from Users WHERE zen_no=$1', [zenNo]);
            if (IszenNoValid.rows.length > 0) {
                const userData = await pool.query('SELECT firstname from Users WHERE zen_no=$1', [zenNo])
                const result = await pool.query('UPDATE Users SET zen_list=ARRAY_APPEND(zen_list, $1) WHERE id=$2', [
                    {
                        firstname: userData.rows[0].firstname,
                        zen_no: zenNo,
                        active: null
                    }, id])
                if (result) {
                    res.json({ success: true, message: 'Added Successfully' })
                } else {
                    res.json({ success: false, message: 'Not Added' })
                }
            } else {
                res.json({ success: false, message: 'Invalid Zen No.' })
            }
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router