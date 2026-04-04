import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/SuperAdmin
export const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'super_admin') {
            res.status(400);
            throw new Error('Cannot delete super admin');
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/SuperAdmin
export const updateUserRole = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user status (Active/Inactive) - Ban/Unban
// @route   PUT /api/users/:id/status
// @access  Private/SuperAdmin
export const updateUserStatus = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'super_admin') {
            res.status(400);
            throw new Error('Cannot deactivate super admin');
        }
        user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            isActive: updatedUser.isActive,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};
