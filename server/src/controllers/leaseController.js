import { PDFDocument, rgb } from 'pdf-lib';
import AppError from '../utils/AppError.js';
import Tenant from '../models/Tenant.js';
import Property from '../models/Property.js';

export const generateLeasePDF = async (req, res, next) => {
  try {
    const { tenantId } = req.body;
    
    const tenant = await Tenant.findById(tenantId).populate('property');
    if (!tenant) {
      return next(new AppError('Tenant not found', 404));
    }

    // In a real app, you would load a standard PDF template here
    // For this MVP, we generate a simple PDF from scratch
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    
    page.drawText('ESTATEOS - DIGITAL LEASE AGREEMENT', { x: 50, y: 750, size: 20 });
    
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: 700, size: 12 });
    page.drawText(`Property: ${tenant.property?.title || 'Unknown Property'}`, { x: 50, y: 680, size: 12 });
    page.drawText(`Tenant: ${tenant.firstName} ${tenant.lastName}`, { x: 50, y: 660, size: 12 });
    page.drawText(`Monthly Rent: INR ${tenant.rentAmount}`, { x: 50, y: 640, size: 12 });
    
    page.drawText('This document serves as a legally binding agreement between the landlord and tenant.', { x: 50, y: 600, size: 12 });
    page.drawText('By signing below, the tenant agrees to all terms and conditions.', { x: 50, y: 580, size: 12 });

    // Placeholder for signature
    page.drawText('Tenant Signature:', { x: 50, y: 400, size: 12 });
    page.drawLine({ start: { x: 150, y: 400 }, end: { x: 350, y: 400 }, thickness: 1 });

    const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });

    res.status(200).json({
      success: true,
      data: pdfBytes
    });
  } catch (error) {
    next(error);
  }
};

export const signLease = async (req, res, next) => {
  try {
    const { tenantId, signatureImageBase64 } = req.body;
    
    // Process the signature and update the PDF...
    // In MVP, we just mark the tenant's lease as active/signed
    
    const tenant = await Tenant.findByIdAndUpdate(tenantId, {
      status: 'active'
    }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Lease signed successfully',
      data: tenant
    });
  } catch (error) {
    next(error);
  }
};
