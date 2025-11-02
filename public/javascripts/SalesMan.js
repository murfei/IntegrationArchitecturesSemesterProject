
class SalesMan {
    /**
     * Minimal constructor (firstName, lastName, employeeId)
     * @param {string} firstName
     * @param {string} lastName
     * @param {number} employeeId
     * @param {string} nationality
     * @param {string} address
     * @param {string} gender
     * @param {string} dateOfBirth
     */
    constructor(firstName, lastName, nationality, address, employeeId, gender, dateOfBirth ) {
        this.firstName = firstName || null;
        this.lastName = lastName || null;
        this.employeeId = employeeId || null;
        this.nationality = nationality || null;
        this.address = address || null;
        this.gender = gender || null;
        this.dateOfBirth = dateOfBirth || null;
        this.performanceRecords = []; // array of SocialPerformanceRecord instances / objects
    }

    // Add a performance record (object / instance)
    addPerformanceRecord(record) {
        this.performanceRecords.push(record);
    }

    // Get all performance records
    getPerformanceRecords() {
        return this.performanceRecords;
    }

    // Getters / setters (optional; you can also access fields directly)
    getFirstName() { return this.firstName; }
    setFirstName(firstName) { this.firstName = firstName; }

    getLastName() { return this.lastName; }
    setLastName(lastName) { this.lastName = lastName; }

    getNationality() { return this.nationality; }
    setNationality(nationality) { this.nationality = nationality; }

    getAddress() { return this.address; }
    setAddress(address) { this.address = address; }

    getEmployeeId() { return this.employeeId; }
    setEmployeeId(employeeId) { this.employeeId = employeeId; }

    getGender() { return this.gender; }
    setGender(gender) { this.gender = gender; }

    getDateOfBirth() { return this.dateOfBirth; }
    setDateOfBirth(dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    // Serialize for JSON responses
    toJSON() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            nationality: this.nationality,
            address: this.address,
            employeeId: this.employeeId,
            gender: this.gender,
            dateOfBirth: this.dateOfBirth,
            performanceRecords: this.performanceRecords
        };
    }
}

module.exports = SalesMan;
