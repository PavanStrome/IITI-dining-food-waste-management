import { Router } from 'express';
import { WasteLog } from '../models/WasteLog.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { MESS_OPTIONS } from '../utils/constants.js';

const router = Router();

// Create waste log (staff/admin)
router.post('/', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  try {
    const { date, meal, itemName, quantityPreparedKg, wasteKg, dryWasteKg, wetWasteKg, mess: bodyMess } = req.body;
    if (!date || !meal || !itemName) return res.status(400).json({ message: 'Missing fields' });

    const mess = req.user.role === 'staff' ? req.user.mess : (bodyMess || req.user.mess || MESS_OPTIONS[0]);
    if (!mess || !MESS_OPTIONS.includes(mess)) {
      return res.status(400).json({ message: 'Valid mess assignment or option required' });
    }

    const log = await WasteLog.create({
      date: new Date(date),
      meal,
      itemName,
      quantityPreparedKg,
      wasteKg,
      dryWasteKg: dryWasteKg || 0,
      wetWasteKg: wetWasteKg || 0,
      mess,
      createdBy: req.user.id
    });
    return res.status(201).json(log);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create waste log' });
  }
});

// List waste logs (staff/admin)
router.get('/', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  try {
    const { from, to, meal, mess } = req.query;
    const query = {};
    if (from || to) {
      query.date = {};
      if (from) {
        const f = new Date(from);
        f.setHours(0, 0, 0, 0);
        query.date.$gte = f;
      }
      if (to) {
        const t = new Date(to);
        t.setHours(23, 59, 59, 999);
        query.date.$lte = t;
      }
    }
    if (meal) query.meal = meal;

    if (req.user.role === 'staff') {
      if (!req.user.mess) return res.status(400).json({ message: 'Staff mess assignment missing' });
      query.mess = req.user.mess;
    } else if (mess && MESS_OPTIONS.includes(mess)) {
      query.mess = mess;
    }

    const logs = await WasteLog.find(query).sort({ date: -1, createdAt: -1 }).lean();
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch waste logs' });
  }
});

// Update a waste log (staff/admin)
router.patch('/:id', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  try {
    const update = {};
    const { date, meal, itemName, quantityPreparedKg, wasteKg, dryWasteKg, wetWasteKg, mess } = req.body;
    if (date) update.date = new Date(date);
    if (meal) update.meal = meal;
    if (itemName) update.itemName = itemName;
    if (quantityPreparedKg !== undefined) update.quantityPreparedKg = quantityPreparedKg;
    if (wasteKg !== undefined) update.wasteKg = wasteKg;
    if (dryWasteKg !== undefined) update.dryWasteKg = dryWasteKg;
    if (wetWasteKg !== undefined) update.wetWasteKg = wetWasteKg;
    if (mess && MESS_OPTIONS.includes(mess) && req.user.role === 'admin') update.mess = mess;

    const filter = { _id: req.params.id };
    if (req.user.role === 'staff') {
      if (!req.user.mess) return res.status(400).json({ message: 'Staff mess assignment missing' });
      filter.mess = req.user.mess;
    }

    const doc = await WasteLog.findOneAndUpdate(filter, { $set: update }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update waste log' });
  }
});

// Delete a waste log (staff/admin)
router.delete('/:id', requireAuth, requireRole('staff', 'admin'), async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role === 'staff') {
      if (!req.user.mess) return res.status(400).json({ message: 'Staff mess assignment missing' });
      filter.mess = req.user.mess;
    }

    const result = await WasteLog.findOneAndDelete(filter);
    if (!result) return res.status(404).json({ message: 'Not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete waste log' });
  }
});

export default router;



