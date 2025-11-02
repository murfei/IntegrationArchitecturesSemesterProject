
class SocialPerformanceRecord {
    /**
     * @param {number} year - The year this performance record applies to
     * @param {number[]} scores - An array of 12 integers: [sup1, peer1, sup2, peer2, ... sup6, peer6]
     */
    constructor(year, scores) {
        this.year = year;
        this.totalBonus = 0;
        this.performanceRecords = {};

        const categories = [
            "Leadership Competence",
            "Openness to Employees",
            "Social Behaviour to Employees",
            "Attitude towards Clients",
            "Communication Skills",
            "Integrity to Company",
            "Average"
        ];

        let sumSup = 0;
        let sumPeer = 0;

        // Validate input
        if (!Array.isArray(scores) || scores.length !== 12) {
            throw new Error("Scores must be an array of 12 integers (6 categories × 2 ratings).");
        }

        // Create records for 6 categories
        for (let i = 0; i < 12; i += 2) {
            const category = categories[i / 2];
            const supervisor = scores[i];
            const peer = scores[i + 1];

            this.performanceRecords[category] = {
                Supervisor: supervisor,
                Peer: peer,
                Bonus: 0
            };

            sumSup += supervisor;
            sumPeer += peer;
        }

        // Compute averages
        const avgSupervisor = Math.round(sumSup / 6);
        const avgPeer = Math.round(sumPeer / 6);
        this.performanceRecords["Average"] = {
            Supervisor: avgSupervisor,
            Peer: avgPeer
        };
    }

    /**
     * Set a bonus for a specific category
     * @param {string} category
     * @param {number} bonus
     */
    setBonus(category, bonus) {
        if (!this.performanceRecords[category]) {
            throw new Error(`Category '${category}' not found.`);
        }

        const currentBonus = this.performanceRecords[category].Bonus || 0;
        this.totalBonus -= currentBonus;
        this.performanceRecords[category].Bonus = bonus;
        this.totalBonus += bonus;
    }

    /**
     * Get the total bonus across all categories
     * @returns {number}
     */
    getTotalBonus() {
        return this.totalBonus;
    }

    /**
     * Get the map of performance records
     * @returns {object}
     */
    getPerformanceRecords() {
        return this.performanceRecords;
    }

    /**
     * Get the year of this record
     * @returns {number}
     */
    getYear() {
        return this.year;
    }

    /**
     * Convert to plain object (for JSON responses or MongoDB saving)
     */
    toJSON() {
        return {
            year: this.year,
            totalBonus: this.totalBonus,
            performanceRecords: this.performanceRecords
        };
    }
}

module.exports = SocialPerformanceRecord;
