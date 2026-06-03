import Replicate from 'replicate';
import AppError from '../utils/AppError.js';
import { env } from '../config/env.js';

const replicate = env.REPLICATE_API_TOKEN
  ? new Replicate({
      auth: env.REPLICATE_API_TOKEN,
    })
  : null;

// @desc    Generate AI Virtual Staging for an empty room
// @route   POST /api/v1/staging/generate
// @access  Private (Admin, Landlord)
export const generateVirtualStaging = async (req, res, next) => {
  try {
    const { propertyId, imageUrl, style = 'modern luxury' } = req.body;

    if (!imageUrl) {
      return next(new AppError('Please provide an image URL to stage', 400));
    }

    if (!replicate) {
      return next(new AppError('Replicate is not configured. Please set REPLICATE_API_TOKEN.', 503));
    }

    // We'll use a ControlNet model on Replicate which is excellent for architecture
    // Model: jagilley/controlnet-mlsd
    // This model detects straight lines (architecture) and generates a new image respecting the room structure.
    
    const output = await replicate.run(
      "jagilley/controlnet-mlsd:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
      {
        input: {
          image: imageUrl,
          prompt: `A beautiful empty room staged with ${style} furniture, high quality, architectural photography, 8k, photorealistic, interior design`,
          a_prompt: 'best quality, extremely detailed',
          n_prompt: 'longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality',
          num_samples: "1",
          image_resolution: "512",
          ddim_steps: 20,
          scale: 9,
          seed: Math.floor(Math.random() * 1000000),
          eta: 0,
          value_threshold: 0.1,
          distance_threshold: 0.1
        }
      }
    );

    // Output is typically an array with the generated image(s)
    const stagedImageUrl = Array.isArray(output) ? output[1] || output[0] : output;

    res.status(200).json({
      success: true,
      data: {
        original: imageUrl,
        staged: stagedImageUrl
      }
    });
  } catch (error) {
    console.error('Replicate API Error:', error);
    next(new AppError('Failed to generate virtual staging. Check API key or image format.', 500));
  }
};
