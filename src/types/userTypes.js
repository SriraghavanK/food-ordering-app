// userTypes.js
// Note: In JavaScript, we don't have interfaces, so we'll use JSDoc comments for type information

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} [address]
 * @property {string} [phone]
 * @property {boolean} [isAdmin]
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - User can be null if not authenticated
 * @property {Function} logout
 */

// We don't need to export anything in JavaScript, as these are just type definitions