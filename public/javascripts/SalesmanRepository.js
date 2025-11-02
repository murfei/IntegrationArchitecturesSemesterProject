// repositories/SalesmanRepository.js

const { MongoClient } = require('mongodb');
const SalesMan = require('../models/SalesMan');
const SocialPerformanceRecord = require('../models/SocialPerformanceRecord');

class SalesmanRepository {
    constructor() {
        this.uri = "mongodb+srv://murfei_db_user:k3U2RJi3lUNf93Uo@smarthooverltd.tw0ettl.mongodb.net/";
        this.client = new MongoClient(this.uri);
        this.db = this.client.db("SmartHooverDB");
        this.collection = this.db.collection("data");
    }

    async connect() {
        if (!this.client.isConnected?.()) {
            await this.client.connect();
        }
    }

    // --- CRUD for SalesMan ---
    async createSalesMan(salesman) {
        await this.connect();

        const performanceRecords = salesman.getPerformanceRecords().map(r => this.convertPerformanceRecord(r));

        const doc = {
            firstName: salesman.firstName,
            lastName: salesman.lastName,
            nationality: salesman.nationality,
            address: salesman.address,
            employee_id: salesman.employeeId,
            gender: salesman.gender,
            dateOfBirth: salesman.dateOfBirth,
            performanceRecords
        };

        await this.collection.insertOne(doc);
        return doc;
    }

    async readSalesMan(employeeId) {
        await this.connect();

        const doc = await this.collection.findOne({ employee_id: employeeId });
        if (!doc) return null;

        return this.getSalesManFromDoc(doc);
    }

    async readAllSalesMen() {
        await this.connect();

        const docs = await this.collection.find().toArray();
        return docs.map(doc => this.getSalesManFromDoc(doc));
    }

    async deleteSalesMan(employeeId) {
        await this.connect();
        await this.collection.deleteOne({ employee_id: employeeId });
    }

    // --- CRUD for SocialPerformanceRecord ---
    async addSocialPerformanceRecord(employeeId, record) {
        await this.connect();

        const salesmanDoc = await this.collection.findOne({ employee_id: employeeId });
        if (!salesmanDoc) throw new Error("Salesman not found");

        // Check if year already exists
        const exists = salesmanDoc.performanceRecords.some(r => r.year === record.year);
        if (exists) throw new Error(`Performance record for year ${record.year} already exists`);

        const recordDoc = this.convertPerformanceRecord(record);
        await this.collection.updateOne(
            { employee_id: employeeId },
            { $push: { performanceRecords: recordDoc } }
        );
    }

    async readSocialPerformanceRecords(employeeId) {
        const salesman = await this.readSalesMan(employeeId);
        return salesman ? salesman.getPerformanceRecords() : null;
    }

    async deleteSocialPerformanceRecord(employeeId, year) {
        await this.connect();
        await this.collection.updateOne(
            { employee_id: employeeId },
            { $pull: { performanceRecords: { year } } }
        );
    }

    // --- Helper methods ---
    convertPerformanceRecord(record) {
        const recordDoc = { year: record.year, totalBonus: record.getTotalBonus() };
        const perfRecords = record.getPerformanceRecords();

        for (const [category, scores] of Object.entries(perfRecords)) {
            recordDoc[category] = { ...scores }; // clone supervisor/peer/bonus
        }
        return recordDoc;
    }

    getSalesManFromDoc(doc) {
        const salesman = new SalesMan(
            doc.firstName,
            doc.lastName,
            doc.nationality,
            doc.address,
            doc.employee_id,
            doc.gender,
            doc.dateOfBirth
        );

        const categories = ["Leadership Competence", "Openness to Employees","Social Behaviour to Employees",
            "Attitude towards Clients", "Communication Skills", "Integrity to Company"];

        (doc.performanceRecords || []).forEach(r => {
            const scores = [];
            categories.forEach(cat => {
                scores.push(r[cat].Supervisor);
                scores.push(r[cat].Peer);
            });

            const record = new SocialPerformanceRecord(r.year, scores);
            categories.forEach(cat => {
                record.setBonus(cat, r[cat].Bonus);
            });

            salesman.addPerformanceRecord(record);
        });

        return salesman;
    }
}

module.exports = SalesmanRepository;
