import { Router } from 'express';
import QRCode from 'qrcode';
import { env } from '../env';
import { logger } from '@starform/logger';

const router = Router();

router.get('/:slug/qrcode', async (req, res) => {
  try {
    const { slug } = req.params;
    const formUrl = `${env.BASE_URL}/${slug}`;

    const qrBuffer = await QRCode.toBuffer(formUrl, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#faf9f5',
      },
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename="starform-${slug}.png"`);
    res.send(qrBuffer);
  } catch (err: unknown) {
    logger.error(`Error generating QR code: ${err instanceof Error ? err.message : String(err)}`);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

export { router as qrcodeRouter };
