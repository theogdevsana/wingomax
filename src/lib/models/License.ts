import mongoose, { Schema, Document } from 'mongoose';

export interface ILicense extends Document {
  key: string;
  deviceId: string | null;
  expiresAt: Date;
  status: 'active' | 'expired' | 'banned';
  createdAt: Date;
}

const LicenseSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  deviceId: { type: String, default: null }, // Null means not used yet
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'banned'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.License || mongoose.model<ILicense>('License', LicenseSchema);
