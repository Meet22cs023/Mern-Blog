// import jwt from 'jsonwebtoken'
// export const onlyadmin = async (req, res, next) => {
//     try {
//         const token = req.cookies.access_token
//         if (!token) {
//             return res.status(403).json({ message: 'Unauthorized' })
//         }
//         const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
//         console.log('Decoded Token:', decodeToken) // Add this line for debugging
//         if (decodeToken.role === 'admin') {
//             req.user = decodeToken
//             next()
//         } else {
//             return res.status(403).json({ message: 'Unauthorized' })
//         }
//     } catch (error) {
//         console.error('Admin middleware error:', error) // Add this line
//         next(500, error.message)
//     }
// }

// import jwt from 'jsonwebtoken'
// import User from '../models/user.model.js'  // Add this import

// export const onlyadmin = async (req, res, next) => {
//     try {
//         const token = req.cookies.access_token
//         if (!token) {
//             return res.status(403).json({ message: 'Unauthorized' })
//         }
        
//         const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await User.findById(decodeToken._id)
        
//         if (user && user.role === 'admin') {
//             req.user = user
//             next()
//         } else {
//             return res.status(403).json({ message: 'Admin access required' })
//         }
//     } catch (error) {
//         console.error('Admin middleware error:', error)
//         return res.status(500).json({ message: 'Server error' })
//     }
// }

// In onlyadmin.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// export const onlyadmin = async (req, res, next) => {
//     try {
//         const token = req.cookies.access_token;
//         console.log('Token from cookie:', token); // Debug log
        
//         if (!token) {
//             console.log('No token found');
//             return res.status(403).json({ message: 'Unauthorized - No token' });
//         }

//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded token:', decodedToken); // Debug log

//         const user = await User.findById(decodedToken._id);
//         console.log('User from DB:', user); // Debug log

//         if (user && user.role === 'admin') {
//             req.user = user;
//             console.log('Admin access granted'); // Debug log
//             return next();
//         }

//         console.log('Admin access denied'); // Debug log
//         return res.status(403).json({ message: 'Admin access required' });

//     } catch (error) {
//         console.error('Admin middleware error:', error);
//         return res.status(500).json({ message: 'Server error' });
//     }
// };

// TEMPORARY: For testing only - remove this in production
export const onlyadmin = async (req, res, next) => {
    try {
        // Temporarily allow all requests
        // console.log('Admin check bypassed for testing');
        next();
        return;
        
        // Original code (kept for reference)
        const token = req.cookies.access_token;
        if (!token) return res.status(403).json({ message: 'Unauthorized' });
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken._id);
        
        if (user && user.role === 'admin') {
            req.user = user;
            return next();
        }
        
        return res.status(403).json({ message: 'Admin access required' });
    } catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};