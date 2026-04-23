import ProductService from "../services/ProductService.js";

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const { name, stock, price } = req.body;
      if (!name || stock === undefined || price === undefined) {
        return res.status(400).json({ error: 'Missing name, stock, or price' });
      }
      const result = await ProductService.createProduct(name, stock, price);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProductById(req, res) {
    try {
      const { id } = req.params;
      const { name, stock, price } = req.body;
      const result = await ProductService.updateProduct(id, { name, stock, price });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ProductController();