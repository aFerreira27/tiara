import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sku } = req.query;

  if (!sku || typeof sku !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid SKU parameter.' });
  }

  const url = `https://krowne.com/${sku}`;

  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    // Existing selectors:
    const name = $('body > div.main-wrapper > section:nth-child(7) > div > div > div.col-lg-6.order-lg-1.order-12 > h3 > strong').text().trim();
    const price = $('body > div.main-wrapper > section:nth-child(7) > div > div > div.col-lg-6.order-lg-1.order-12 > div:nth-child(3) > span').text().trim();
    // Add this line for the image (replace SELECTOR with the correct one):
    const imageDiv = $('.mainProductImage').attr('style') || '';
    let image = '';
    const match = imageDiv.match(/url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
      image = match[1].startsWith('http') ? match[1] : `https://krowne.com${match[1]}`;
    }

    const features: string[] = [];
    $('body > div.main-wrapper > section:nth-child(7) > div > div > div.col-lg-6.order-lg-1.order-12 > ul:nth-child(5) li').each((_, el) => {
      features.push($(el).text().trim());
    });

    const specifications: { label: string, value: string }[] = [];
    $('#product-detail-main > table > tbody > tr').each((_, row) => {
      const cells = $(row).find('td');
      specifications.push({
        label: $(cells[0]).text().trim(),
        value: $(cells[1]).text().trim(),
      });
    });

    const specLabels = [
      "Mounting Style",
      "Centers",
      "Spout Style",
      "Spout Size",
      "Outlet Type",
      "Handles",
      "Inlet",
      "Valves"
    ];

    const keySpecs: { [key: string]: string } = {};
    for (const label of specLabels) {
      const found = specifications.find(spec => spec.label.toLowerCase().includes(label.toLowerCase()));
      if (found) keySpecs[label] = found.value;
    }

    res.status(200).json({ name, price, image, features, specifications, keySpecs });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}