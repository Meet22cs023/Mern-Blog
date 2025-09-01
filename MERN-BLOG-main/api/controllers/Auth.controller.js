import { handleError } from "../helpers/handleError.js"
import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const Register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const checkuser = await User.findOne({ email });

        if (checkuser) {
            return next(handleError(409, 'User already registered.'));
        }

        const hashedPassword = bcryptjs.hashSync(password);
        const isAdmin = email === 'admin@gmail.com'; // Set admin based on email

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: isAdmin ? 'admin' : 'user' // Set role based on email
        });

        await user.save();
        res.status(200).json({ success: true, message: 'Registration successful.' });
    } catch (error) {
        next(handleError(500, error.message));
    }
};


export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(handleError(404, 'Invalid login credentials.'));
        }

        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) {
            return next(handleError(404, 'Invalid login credentials.'));
        }

        // Generate token with role
        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role  // Include role in token
        }, process.env.JWT_SECRET);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        const { password: _, ...userWithoutPassword } = user._doc;
        res.status(200).json({
            success: true,
            user: userWithoutPassword,
            message: 'Login successful.'
        });

    } catch (error) {
        next(handleError(500, error.message));
    }
};


export const GoogleLogin = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            const password = Math.random().toString();
            const hashedPassword = bcryptjs.hashSync(password);
            const isAdmin = email === 'admin@gmail.com'; // Check for admin email

            user = new User({
                name,
                email,
                password: hashedPassword,
                avatar,
                role: isAdmin ? 'admin' : 'user' // Set role based on email
            });
            await user.save();
        }

        // Generate token with role
        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role  // Include role in token
        }, process.env.JWT_SECRET);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        const { password: _, ...userWithoutPassword } = user._doc;
        res.status(200).json({
            success: true,
            user: userWithoutPassword,
            message: 'Login successful.'
        });

    } catch (error) {
        next(handleError(500, error.message));
    }
};



export const Logout = async (req, res, next) => {
    try {

        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/'
        })

        res.status(200).json({
            success: true,
            message: 'Logout successful.'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

// In Auth.controller.js, update the Login function
