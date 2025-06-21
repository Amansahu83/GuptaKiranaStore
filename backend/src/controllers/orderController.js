const { Order, OrderItem, Product, User } = require('../models');
const { sequelize } = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Create transaction
    const result = await sequelize.transaction(async (t) => {
      // Create order
      const order = await Order.create(
        {
          userId: req.user.id,
          shippingAddress,
          paymentMethod,
          totalAmount,
          status: 'pending',
          paymentStatus: 'pending'
        },
        { transaction: t }
      );

      // Create order items and update product stock
      const createdOrderItems = [];
      for (const item of orderItems) {
        const product = await Product.findByPk(item.productId, { transaction: t });
        
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for product: ${product.name}`);
        }
        
        // Update product stock
        product.stock -= item.quantity;
        await product.save({ transaction: t });
        
        // Create order item
        const orderItem = await OrderItem.create(
          {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
          },
          { transaction: t }
        );
        
        createdOrderItems.push(orderItem);
      }

      return { order, orderItems: createdOrderItems };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User
        }
      ]
    });

    if (order) {
      // Check if the order belongs to the logged-in user or if user is admin
      if (order.userId === req.user.id || req.user.role === 'admin') {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to access this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User
        }
      ]
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User
        }
      ]
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    
    if (order) {
      order.status = status;
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderPayment = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const order = await Order.findByPk(req.params.id);
    
    if (order) {
      order.paymentStatus = paymentStatus;
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  updateOrderPayment
};