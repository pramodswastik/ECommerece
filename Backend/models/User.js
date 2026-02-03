const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// User Schema with role-based access
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['customer', 'business', 'admin'],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    profile: {
      phone: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      profileImage: {
        type: String,
      },
    },
    businessProfile: {
      businessName: String,
      businessEmail: String,
      businessPhone: String,
      businessAddress: String,
      businessWebsite: String,
      registrationNumber: String,
      taxId: String,
      approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      approvalDate: Date,
      rejectionReason: String,
      documents: [
        {
          documentType: String, // e.g., 'tax_certificate', 'business_license'
          documentUrl: String,
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to get public user data (without sensitive info)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
