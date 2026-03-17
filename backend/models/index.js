const mongoose = require('mongoose');

// 1. User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'vao', 'surveyor', 'tahsildar', 'admin'], default: 'citizen' },
  village: { type: String },
  phone: { type: String }
}, { timestamps: true });

// 2. Application Model
const applicationSchema = new mongoose.Schema({
  citizen_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  survey_number: { type: String, required: true },
  land_area: { type: Number, required: true }, // in acres
  village: { type: String, required: true },
  document_url: { type: String },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'rejected'], default: 'pending' },
  current_step: { type: String, default: 'VA_Verification' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// 3. Execution Log Model
const executionLogSchema = new mongoose.Schema({
  application_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  step_name: { type: String },
  officer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String }, // 'Approved', 'Rejected', 'Commented'
  rule_evaluated: { type: String },
  next_step: { type: String },
  comment: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// 4. Workflow Rules Configuration (Static or Dynamic)
const ruleSchema = new mongoose.Schema({
  step_id: { type: String },
  condition: { type: String }, // e.g. "land_area > 5"
  next_step: { type: String },
  priority: { type: Number }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Application: mongoose.model('Application', applicationSchema),
  ExecutionLog: mongoose.model('ExecutionLog', executionLogSchema),
  Rule: mongoose.model('Rule', ruleSchema)
};
