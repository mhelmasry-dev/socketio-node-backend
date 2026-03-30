import { authModel } from "../../../../db/model/auth.model.js";
import { asyncHandler } from "../../../../src/utils/errorhandling.js";
import sendEmail from "../../../utils/email.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
export const signup = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
        return next(new Error("Missing required fields", { cause: 400 }));
    }
    const user = await authModel.findOne({ email: email.toLowerCase() });
    if (user) {
        return next(new Error("Email already exists", { cause: 409 }));
    }
    const hashpassword = bcrypt.hashSync(password, 8);
    const newuser = await authModel.create({
        username,
        email,
        password: hashpassword,
    })
    return res.status(201).json({ message: "User created successfully", newuser });

})


export const Login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await authModel.findOne({ email: email.toLowerCase() })
    if (!user) {
        return next(new Error("user not registered"));
    }
    const decodepassword = await bcrypt.compare(password, user.password);
    if (!decodepassword) {
        return next(new Error("In-valid Login data"));
    }
    user.status = "Online";
    await user.save();

    const accessToken = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username
    },
        "Hamo",
        { expiresIn: 60 * 60 });


    const refreshToken = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username
    },
        "hamo",
        { expiresIn: '1y' });
    const html = `<h1>hello ${user.email}</h1>`
    return res
        .status(200)
        .json({ message: "done", accessToken, refreshToken });
});


export const sendCode = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const randomCode = Math.floor(1000 + Math.random() * 9000);

    const user = await authModel.findOne({ email });
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }
    await authModel.updateOne(
        { email: email },
        {
            $set: {
                forgetcode: randomCode
            }
        }
    );
    const html = `<h1>forget code is ${randomCode}</h1>`
    await sendEmail({ to: email, html, subject: "Your Forget Code" })

    return res.status(200).json({ message: "Code sent successfully" });
})


export const verifyForgetCode = asyncHandler(async (req, res, next) => {
    const { email, forgetcode, password } = req.body
    const user = await authModel.findOne({
        email,
        forgetcode
    })
    if (!user) {
        return next(new Error("Invalid email or forget code", { cause: 400 }));
    }
    const newPassword = bcrypt.hashSync(password, 8);
    user.password = newPassword;
    user.forgetcode = null;
    await user.save()
    return res.status(200).json({ message: "Password updated successfully" });
})