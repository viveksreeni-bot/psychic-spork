import { search as mock, id as mockId } from "../integrations/retailers/adapters/mock.js";

export default async function handler(req, res) {
  const q = (req.query.q || "diapers").toString();
  const stores = (req.query.stores || "mock").toString().split(",").map(s => s.trim()).filter(Boolean);

  const adapters = new Map([[mockId, mock]]);
  const tasks = stores.map(s => adapters.get(s)?.(q).catch(() => []) || []);
  const lists = await Promise.all(tasks);
  const results = lists.flat();
  res.status(200).json({ query: q, stores, count: results.length, results });
}
