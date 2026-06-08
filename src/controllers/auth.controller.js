import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";


export async function register(req, res) {
    const { username, email, password } = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (isAlreadyRegistered) {
        res.status(409).json({
            message: "Username or email already exists"
        })
    }
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })
    //TOKENs CREATED Refresh and Access Tokens
    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
    //Session created everytime a refreshtoken is created
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })
    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //Javasript being run on client side will never be able to read cookies
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7days
    })
    res.status(201).json({
        message: "user is registered successfully",
        user: {
            username: user.username,
            email: user.email,
        },
        accessToken
    })

}

export async function login(req,res){
    const {email,password} = req.body;
    const user = await userModel.findone({email})
    if(!user){
        res.status(401).json({
            message: "Invalid credentials"
        })
    }
    const hashedPassword = crypto.createHash("sha256").update("password").digest("hex");
    const isPasswordValid = hashedPassword == user.password;
    if(!isPasswordValid){
        res.status(401).json({
            message: "Invalid password"
        })
    }
    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })
    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //Javasript being run on client side will never be able to read cookies
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7days
    })
    res.status(201).json({
        message: "Logged in successfully",
        user: {
            username: user.username,
            email: user.email,
        },
        accessToken
    })
}

export async function getMe(req, res) {
    /** Two logic over here
     * How does server identifies which user is making the request
     * 
     */

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            "message": "token not found"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await userModel.findById(decoded.id)
    res.status(200).json({
        "message": "user fetched successfully",
        user: {
            username: user.username,
            email: user.email
        }

    })
}

export async function refreshToken(req, res) {
    const refreshToken = req.cookie.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            "message": "Refresh token not found"
        })
    }
    /**if refresh token is found then we generate a new access token */
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
    /** if session is logged out then we can't directly generate the access token from this refreshhashtoken */
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await sessionModel.findOne({
        refreshToken: refreshHashToken,
        revoked: false
    })
    if (!session) {
        return res.status(401).json({
            message: "Invalid refresh token"
        })
    }
    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )
    /** Just for an additional layer of security we create a new refresh token if the new access token is hit */
    const newrefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
    const newRefreshTokenHash = crypto.createHash("sha256").update(newrefreshToken).digest("hex");
    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();
    res.cookie("newrefreshToken", newrefreshToken, {
        httpOnly: true, //Javasript being run on client side will never be able to read cookies
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7days
    })

    res.status(200).json({
        "message": "Access token is refreshed successfully",
        accessToken
    })
}

export async function logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({
            "message": "Refresh token not found"
        })
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })
    if (!session) {
        return res.status(400).json({
            "message": "Invalid refresh Token"
        })
    }
    session.revoked = true;
    await session.save();
    res.clearCookie("refreshToken")
    res.status(200).json({
        "message": "logged-out successfully"
    })
}

export async function logoutAll(req, res) {
    const refreshHashToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh Token not found"
        })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)
    /** Search for all sessions of user and change revoked to true so as to Logout */
    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, {
        revoked: true
    })
    res.clearCookie("refreshToken")
    res.status(200).json({
        message: "logged out from all devices successfully"
    })
}