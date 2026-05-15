import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  telegramLink: {
    type: String,
    required: true,
    default: "https://t.me/enzosrs"
  }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

export default Settings;
