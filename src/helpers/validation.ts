import * as Joi from 'joi';

const email = Joi.string().email().required();
const password = Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{10,30}$'))
    .required();

export const userSchema = Joi.object({
    firstName: Joi.string().alphanum().min(2).max(30).required(),
    lastName: Joi.string().alphanum().min(2).max(30).required(),
    password,
    email,
});

export const authSchema = Joi.object({
    password,
    email,
});
