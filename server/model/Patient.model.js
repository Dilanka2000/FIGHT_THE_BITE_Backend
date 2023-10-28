import mongoose from "mongoose";

export const PatientSchema = new mongoose.Schema({
    name : {
        type : String,
        requied : true,
    },
    address : {
        type : String,
        requied : true,
    },
    wardId : {
        type : String,
        required : true
    },
    phase : {
        type : Number,
        required : true
    },
    userId : {
        type : String,
        required : true
    },
    affectedStatus : {
        type : Number,
        required : true,
    },
    confirmDoctor : {
        type : String,
        required : true
    },
    affectivityConfirmDate : {
        type : String,
        required : true
    },
    createdAt : {
        type : String,
        required : true
    },
    updatedAt : {
        type : String,
        required : true
    },
    houseHoldNo : {
        type : String,
        requied : true
    },
    divisionNumber : {
        type : String,
        required : true
    },
    phicomment : {
        type : String
    }
});

export default mongoose.model.patients || mongoose.model("patients",PatientSchema);