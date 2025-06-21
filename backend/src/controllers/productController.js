const { Product } = require('../models');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;

    // Generate a default image URL if none is provided
    const defaultImageUrl = `https://via.placeholder.com/500?text=${encodeURIComponent(name)}`;
    
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : (imageUrl || defaultImageUrl),
      isAvailable: true
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl, isAvailable } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (product) {
      // Generate a default image URL if none is provided
      const defaultImageUrl = `https://via.placeholder.com/500?text=${encodeURIComponent(name || product.name)}`;
      
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stock = stock !== undefined ? stock : product.stock;
      product.category = category || product.category;
      product.imageUrl = req.file ? `/uploads/${req.file.filename}` : (imageUrl || product.imageUrl || defaultImageUrl);
      product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      await product.destroy();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};