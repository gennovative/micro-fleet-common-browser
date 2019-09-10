"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ex = require("./models/Exceptions");
class Guard {
    /**
     * Makes sure the specified `target` is not null or undefined.
     * @param name {string} Name to include in error message if assertion fails.
     * @param target {any} Argument to check.
     * @param message {string} Optional error message.
     * @throws {InvalidArgumentException} If assertion fails.
     */
    static assertArgDefined(name, target, message) {
        if (target === null || target === undefined) {
            throw new ex.InvalidArgumentException(name, message || 'Must not be null or undefined!');
        }
    }
    /**
     * Makes sure the specified `target` is a function.
     * @param name {string} Name to include in error message if assertion fails.
     * @param target {any} Argument to check.
     * @param message {string} Optional error message.
     * @throws {InvalidArgumentException} If assertion fails.
     */
    static assertArgFunction(name, target, message) {
        if (typeof target !== 'function') {
            throw new ex.InvalidArgumentException(name, message || 'Must be a function!');
        }
    }
    /**
     * Makes sure the specified `target` matches Regular Expression `rule`.
     * @param name {string} Name to include in error message if assertion fails.
     * @param target {any} Argument to check.
     * @param message {string} Optional error message.
     * @throws {InvalidArgumentException} If assertion fails.
     */
    static assertArgMatch(name, rule, target, message) {
        if (!rule.test(target)) {
            throw new ex.InvalidArgumentException(name, message || 'Does not match specified rule!');
        }
    }
    /**
     * Makes sure the specified `target` is not null or undefined.
     * @param target {any} Argument to check.
     * @param message {string} Optional error message.
     * @param isCritical {boolean} If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
     * @throws {CriticalException} If assertion fails and `isCritical` is true.
     * @throws {MinorException} If assertion fails and `isCritical` is false.
     */
    static assertIsDefined(target, message, isCritical = true) {
        Guard.assertIsFalsey(target === null || target === undefined, message, isCritical);
    }
    /**
     * Makes sure the specified `target` is a function.
     * @param target {any} Argument to check.
     * @param message {string} Optional error message.
     * @param isCritical {boolean} If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
     * @throws {CriticalException} If assertion fails and `isCritical` is true.
     * @throws {MinorException} If assertion fails and `isCritical` is false.
     */
    static assertIsFunction(target, message, isCritical = true) {
        Guard.assertIsTruthy(typeof target === 'function', message, isCritical);
    }
    /**
     * Makes sure the specified `target` matches Regular Expression `rule`.
     * @param target {any} Argument to check.
     * @param message {string} Optional error message.
     * @param isCritical {boolean} If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
     * @throws {CriticalException} If assertion fails and `isCritical` is true.
     * @throws {MinorException} If assertion fails and `isCritical` is false.
     */
    static assertIsMatch(rule, target, message, isCritical = true) {
        Guard.assertIsTruthy(rule.test(target), message, isCritical);
    }
    /**
     * Makes sure the specified `target` is considered "truthy" based on JavaScript rule.
     * @param target {any} Argument to check.
     * @param message {string} Error message.
     * @param isCritical {boolean} If true, throws CriticalException. Otherwise, throws MinorException when assertion fails.
     * @throws {CriticalException} If assertion fails and `isCritical` is true.
     * @throws {MinorException} If assertion fails and `isCritical` is false.
     */
    static assertIsTruthy(target, message, isCritical = true) {
        if (!target) {
            if (isCritical) {
                throw new ex.CriticalException(message);
            }
            throw new ex.MinorException(message);
        }
    }
    /**
     * Makes sure the specified `target` is considered "falsey" based on JavaScript rule.
     * @param target {any} Argument to check.
     * @param message {string} Error message.
     * @throws {InvalidArgumentException} If assertion fails.
     */
    static assertIsFalsey(target, message, isCritical = true) {
        if (target) {
            if (isCritical) {
                throw new ex.CriticalException(message);
            }
            throw new ex.MinorException(message);
        }
    }
}
exports.Guard = Guard;
//# sourceMappingURL=Guard.js.map