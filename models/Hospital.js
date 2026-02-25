const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    // --- ข้อมูลผู้ให้บริการ (Provider Info) ---
    name: {
        type: String,
        required: [true, 'Please add a provider name'],
        // *** สำคัญ: เอา unique: true ออก *** // เพื่อให้ชื่อบริษัทเดิม สามารถลงทะเบียนรถคันที่ 2, 3 ได้
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postal code']
    },
    region: {
        type: String,
        required: [true, 'Please add a region']
    },
    tel: {
        type: String,
        required: [true, 'Please add telephone number']
    },

    // --- ข้อมูลรถ (Car Info) ---
    model: {
        type: String,
        trim: true,
        required: [true, 'Please add car model']
    },
    brand: {
        type: String,
        required: [true, 'Please add car brand']
    },
    licensePlate: {
        type: String,
        required: [true, 'Please add car licensePlate'],
        //unique: true // ทะเบียนรถห้ามซ้ำกันในระบบ
    },
    priceperday: {
        type: Number,
        required: [true, 'Please add Priceperday']
    }
}, {
    
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('car_provider', providerSchema);