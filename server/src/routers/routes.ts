import express from "express"
import bodyParser from "body-parser"
import pool from "../../dbconnect"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken"
import { log } from "console"
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
                    res.json({ success: false, message: "Email already regsitered" })
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
                                    const userReg = await pool.query('INSERT INTO Users(id,firstname,lastname,email,user_password,zen_no,account_verified) VALUES($1,$2,$3,$4,$5,$6,$7)', [id, firstname, lastname, email, hashedPassword, zenNo, false])
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

router.post('/user/login/:socketId', async (req, res) => {
    const { email, password } = req.body
    const { socketId } = req.params
    if (!email || !password) {
        res.json({ success: false, message: "Fill both fields" })
    } else {
        const user = await pool.query('SELECT * FROM Users WHERE email=$1', [email])
        console.log(user);
        
        if (user.rows.length > 0) {
            if (email == user.rows[0].email) {
                if (socketId) {
                    const result = await pool.query('UPDATE Users SET socketid=$1 WHERE email=$2', [socketId, email])
                    if (result) {
                        const isMatch = await bcrypt.compare(password, user.rows[0].user_password)
                        if (isMatch) {
                            if (user.rows[0].account_verified === false) {
                                res.json({ success: true, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Login Successfully" })
                            } else {
                                const token = jwt.sign(user.rows[0].id, `${process.env.USERS_SECRET_KEY}`)
                                res.json({ success: true, userdata: user.rows[0], id: user.rows[0].id, token, verified: user.rows[0].account_verified, message: "Login Successfully" })
                            }
                        } else {
                            res.json({ success: false, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Incorrect Password" })
                        }
                    }
                }
            } else {
                res.json({ success: false, id: user.rows[0].id, verified: user.rows[0].account_verified, message: "Email does not exists" })
            }
        }
    }
})

router.get('/get/zenlist/:id', async (req, res) => {
    // const {id, socketid} = req.params;   
    // try {
    //     if(socketid){
    //         const user = await pool.query('UPDATE Users SET socketid = $2 WHERE id=$1', [id, socketid])
    //     }else{
    //         res.json({success: false, message : "Cant get the User ID"})
    //     }
    //     const allUsers = await pool.query('SELECT * FROM Users WHERE id <> $1', [id]);        
    //     if(allUsers){
    //         res.json({success: true, data: allUsers.rows.map(i => i)})
    //     }else{
    //         res.json({success: false, message: 'No User Found'})
    //     }        
    // } catch (error) {
    //     console.log(error);
    // }
    const { id } = req.params;
    try {
        if (id) {
            const userContactList = await pool.query('SELECT zen_list FROM Users WHERE id=$1', [id]);
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
            const userData = await pool.query('SELECT zen_list from Users WHERE id=$!', [id])            
            if (IszenNoValid.rows.length > 0 && userData.rows.length) {
                // const listArray: string[] = userData.rows[0].zen_list
                // const users = await pool.query('UPDATE Users SET zen_list=$2 WHERE id=$1', [id, `{"${zenNo}"}`])
                const result = await pool.query('UPDATE Users SET zen_list=ARRAY_APPEND(zen_list, $1)', [`{"${zenNo}"}`]) 
                if (result) {
                    res.json({ success: true, message: 'Added Successfully' })
                }else{
                    res.json({ success: false, message: 'Not Added' })
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})


module.exports = router