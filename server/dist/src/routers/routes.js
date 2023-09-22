"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dbconnect_1 = __importDefault(require("../../dbconnect"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.get('/', (req, res) => res.send('hello from BE'));
let otp, zenNo;
router.post('/user/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password, confirm_password } = req.body;
    try {
        if (!firstname || !lastname || !email || !password || !confirm_password) {
            res.json({ success: false, message: "Fill all the fields" });
        }
        else {
            const emailExists = yield dbconnect_1.default.query('SELECT email from Users WHERE email=$1', [email]);
            if (emailExists.rows.length > 0) {
                res.json({ success: false, message: "Email already regsitered" });
            }
            else {
                if (password === confirm_password) {
                    const salt = Number(bcrypt_1.default.genSalt(10));
                    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
                    if (hashedPassword) {
                        const generatedOtp = Number(`${Math.random() * 9}${Math.random() * 9}${Math.random() * 9}${Math.random() * 9}`);
                        otp = generatedOtp;
                        const transporter = nodemailer_1.default.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL_USER,
                                pass: process.env.EMAIL_PASS
                            }
                        });
                        const email_message = {
                            from: process.env.EMAIL_USER,
                            to: email,
                            subject: 'Please Verify your Zen Account',
                            text: `Your verification code for zen is ${otp}`
                        };
                        const zenNoGen = () => zenNo = Number(`${Math.random() * 9}${Math.random() * 9}${Math.random() * 9}${Math.random() * 9}${Math.random() * 9}${Math.random() * 9}${Math.random() * 9}${Math.random() * 9}`);
                        transporter.sendMail(email_message).then(() => __awaiter(void 0, void 0, void 0, function* () {
                            const id = (0, uuid_1.v4)();
                            zenNoGen();
                            const zenNoExists = yield dbconnect_1.default.query('SELECT zenno from Users WHERE zenno=$1', [zenNo]);
                            if (zenNoExists.rows.length > 0) {
                                zenNoGen();
                            }
                            else {
                                const userReg = yield dbconnect_1.default.query('INSERT INTO Users(id,firstname,lastname,email,user_password,zen_no,account_verified) VALUES($1,$2,$3,$4,$5,$6,$7)', [id, firstname, lastname, email, hashedPassword, zenNo, false]);
                                if (userReg.rows.length > 0) {
                                    res.json({ success: true, message: "Zen account created." });
                                }
                                else {
                                    res.json({ success: false, message: "Account cannot be created" });
                                }
                            }
                        })).catch((error) => console.log(error));
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}));
module.exports = router;
