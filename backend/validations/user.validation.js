const { z } = require("zod")

const ProtectedSignup = z.object({
    UserName: z
    .string()
    .trim()
    .max(40)
    .min(3),

    Email: z
    .email()
    .trim(),

    Password: z
    .string()
    .trim()
    .max(15)
    .min(6)
})


const ProtectedSignin = z.object({

    UserName: z
    .string()
    .trim()
    .max(40)
    .min(3),

    Password: z
    .string()
    .trim()
    .max(15)
    .min(6)

})

module.exports =  { ProtectedSignup , ProtectedSignin }