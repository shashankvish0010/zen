import express  from "express"
import bodyParser from "body-parser"
import pool from  "../../dbconnect"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { v4 as uuidv4 } from "uuid";
const router = express.Router()

router.use(bodyParser.json())
router.get('/', (req,res)=> res.send('hello from BE'))
let otp, zenNo: number
router.post('/user/register',async (req,res) => {
    const { firstname, lastname, email, password, confirm_password } = req.body;
    try {
        if( !firstname || !lastname || !email || !password || !confirm_password ){
            res.json({success : false, message : "Fill all the fields"})
        }else{
            const emailExists = await pool.query('SELECT email from Users WHERE email=$1', [email])
            if(emailExists.rows.length > 0){
                res.json({success : false, message : "Email already regsitered"})   
            }else{
                if(password === confirm_password){
                    const salt = Number(bcrypt.genSalt(10))
                    const hashedPassword = await bcrypt.hash(password, salt)
                    if(hashedPassword){
                    const generatedOtp = Number(`${Math.random()*9}${Math.random()*9}${Math.random()*9}${Math.random()*9}`)
                    otp = generatedOtp
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS
                        }
                    })

                    const email_message = {
                        from : process.env.EMAIL_USER,
                        to : email,
                        subject: 'Please Verify your Zen Account',
                        text: `Your verification code for zen is ${otp}`
                    }

                    const zenNoGen = () => zenNo = Number(`${Math.random()*9}${Math.random()*9}${Math.random()*9}${Math.random()*9}${Math.random()*9}${Math.random()*9}${Math.random()*9}${Math.random()*9}`)

                    transporter.sendMail(email_message).then(async () => {
                        const id = uuidv4();
                        zenNoGen()
                        const zenNoExists = await pool.query('SELECT zenno from Users WHERE zenno=$1', [zenNo])
                        if(zenNoExists.rows.length > 0){
                            zenNoGen()
                        }else{
                            const userReg = await pool.query('INSERT INTO Users(id,firstname,lastname,email,user_password,zen_no,account_verified) VALUES($1,$2,$3,$4,$5,$6,$7)',[id,firstname,lastname,email,hashedPassword,zenNo,false])
                            if(userReg.rows.length > 0){
                                res.json({success : true, message : "Zen account created."})   
                            }else{
                                res.json({success : false, message : "Account cannot be created"})   
                            }
                        }
                    }).catch((error)=>console.log(error))
                }
            }
            }
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router