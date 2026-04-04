import Cart from '../models/Cart.js';

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        res.json(cart);
    } else {
        res.json({ cartItems: [] });
    }
};

// @desc    Add items to cart / update cart
// @route   POST /api/cart
// @access  Private
export const updateCart = async (req, res) => {
    const { cartItems } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.cartItems = cartItems;
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } else {
        const newCart = new Cart({
            user: req.user._id,
            cartItems,
        });
        const createdCart = await newCart.save();
        res.status(201).json(createdCart);
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const deleteCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        await Cart.deleteOne({ _id: cart._id });
        res.json({ message: 'Cart cleared' });
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
};
