import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from './app.js';
import { menu } from './data/menu.js';
describe('menu API', () => {
  it('returns all 41 source menu items', async () => { const response = await request(app).get('/api/menu'); expect(response.status).toBe(200); expect(response.body.count).toBe(41); expect(response.body.source).toBe('supplied-pdf'); });
  it('filters categories and search', async () => { const response = await request(app).get('/api/menu?category=Salads&q=quinoa'); expect(response.status).toBe(200); expect(response.body.items.map((p: { id: string }) => p.id)).toEqual(['salad-quinoa']); });
  it('keeps unresolved prices explicitly null', () => { expect(menu.filter((item) => item.price === null).map((item) => item.id)).toHaveLength(4); });
  it('protects order creation and admin data routes', async () => {
    expect((await request(app).post('/api/orders').send({ fulfilmentMethod: 'pickup', items: [] })).status).toBe(401);
    expect((await request(app).get('/api/admin/overview')).status).toBe(401);
  });
});
