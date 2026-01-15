const { DataTypes } = require('sequelize');
const db = require('../config/database'); // Adjust path to your database config

const BusinessPermit = db.define('BusinessPermit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    applicantType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    modeOfPayment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dateOfApplication: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    dtiSecCdaRegistrationNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dtiSecCdaRegistrationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    tinNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    typeOfBusiness: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amendmentFrom: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amendmentTo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    taxIncentiveFromGovEntity: {
        type: DataTypes.STRING, // 'yes' or 'no'
        defaultValue: 'no',
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    businessName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tradeNameFranchise: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    businessRegion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    businessProvince: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    businessMunicipality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    businessBarangay: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    businessStreetAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    telephoneNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mobileNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerStreetAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerBarangay: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerMunicipality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerRegion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerPostalCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerEmailAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerTelephoneNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerMobileNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emergencyContactPerson: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emergencyContactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emergencyContactEmail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    businessArea: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    totalEmployees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    employeesResidingWithLgli: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    lessorFullName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lessorAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lessorContactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lessorEmail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    monthlyRental: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
    },
    lineOfBusiness: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numberOfUnits: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    capitalization: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
    },
    grossSales: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
    },
    // Add other fields or relation keys if necessary
}, {
    tableName: 'business_permits', // Optional: specify table name explicitly
    timestamps: true,
});

module.exports = BusinessPermit;
