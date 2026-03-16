const mongoose = require("mongoose");
const OTPModel = require("../models/Otp");
const UserModel = require("../models/User");
const AdminModel = require("../models/Admin");
const { sendOTPEmail } = require("../services/mail");
const { sendMessage } = require("../services/twilio");

const generateOTP = async (type, subjectId, subject = "user") => {
    console.log(type, subjectId, subject);
    const otp = Math.floor(100000 + Math.random() * 900000);

    if (subject === "admin") {
        const Admin = await AdminModel.findById(subjectId);
        if (!Admin) throw new Error("Admin Not Exist");

        const Exist = await OTPModel.findOne({ adminId: subjectId });
        if (Exist) await OTPModel.findByIdAndDelete(Exist._id);

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        await OTPModel.create({ adminId: subjectId, otp: String(otp), expiresAt });

        const message = `Your Verifcation OTP is : ${otp}`;

        if (type === "mobile") {
            if (!Admin.mobile) throw new Error("Admin mobile is missing");
            await sendMessage(Admin.mobile, message);
            return { type: "mobile", expiresAt, adminId: subjectId };
        }

        if (type === "email") {
            if (!Admin.email) throw new Error("Admin email is missing");
            await sendOTPEmail(Admin.email, message);
            return { type: "email", expiresAt, adminId: subjectId };
        }

        throw new Error("Invalid OTP type");
    }

    const User = await UserModel.findById(subjectId);
    if (!User) throw new Error("User Not Exist");

    const Exist = await OTPModel.findOne({ userId: subjectId });
    if (Exist) {
        await OTPModel.findByIdAndDelete(Exist._id)
    }
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    await OTPModel.create({ userId: subjectId, otp: String(otp), expiresAt });

    const message = `Your Verifcation OTP is : ${otp}`;

    if(type=="mobile"){
        await sendMessage(User.mobile,message);
    }

      if(type=="email"){
        await sendOTPEmail(User.email,message);
    }
  
     return {type, expiresAt, userId: subjectId} 
}

const verifyOTP = async (subjectId, otp, subject = "user") => {
    console.log(`Checking OTP in DB for ${subject} ${subjectId}: ${otp}`);
    
    // For testing purposes, allow 000000
    if (otp === "000000") {
        console.log("Using test bypass OTP");
        return true;
    }

    const idField = subject === "admin" ? "adminId" : "userId";
    const record = await OTPModel.findOne({
        [idField]: mongoose.Types.ObjectId.isValid(subjectId) ? subjectId : subjectId,
        otp: String(otp).trim()
    });
    
    if (!record) {
        console.log(`No record found for ${subject} ${subjectId} with OTP ${otp}. Searching for any OTP for this subject...`);
        const anyOTP = await OTPModel.findOne({ [idField]: subjectId });
        if (anyOTP) {
            console.log(`Found a different OTP for this subject: ${anyOTP.otp}`);
        }
        throw new Error("Invalid OTP");
    }
    
    const now = new Date();
    if (record.expiresAt < now) {
        console.log(`OTP expired for ${subject} ${subjectId}. Expired at: ${record.expiresAt}, Now: ${now}`);
        await OTPModel.findByIdAndDelete(record._id);
        throw new Error("OTP expired");
    }
    
    await OTPModel.findByIdAndDelete(record._id);
    console.log(`OTP verified successfully for ${subject} ${subjectId}`);
    return true;
}

module.exports = {generateOTP, verifyOTP}
