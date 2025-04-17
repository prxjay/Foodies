// Local cart storage using localStorage
const CART_STORAGE_KEY = 'foodies_cart';

export const addToCart = async (foodId, token) => {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}');
        cart[foodId] = (cart[foodId] || 0) + 1;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        return cart;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

export const removeQtyFromCart = async (foodId, token) => {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}');
        if (cart[foodId] > 0) {
            cart[foodId] -= 1;
            if (cart[foodId] === 0) {
                delete cart[foodId];
            }
        }
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        return cart;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};

export const getCartData = async (token) => {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}');
        return cart;
    } catch (error) {
        console.error('Error while fetching the cart data:', error);
        return {};
    }
};

export const clearCartItems = async (token) => {
    try {
        localStorage.removeItem(CART_STORAGE_KEY);
        return {};
    } catch (error) {
        console.error('Error while clearing the cart', error);
        throw error;
    }
};

