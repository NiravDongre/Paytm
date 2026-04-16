const { z } = require("zod")

const ProtectedSignup = z.object({
    FirstName: z
    .string()
    .trim()
    .max(20)
    .min(3),

    LastName: z
    .string()
    .trim()
    .max(20)
    .min(3),

    Password: z
    .string()
    .trim()
    .max(15)
    .min(6)
})


const ProtectedSignin = z.object({

    FirstName: z
    .string()
    .trim()
    .max(20)
    .min(3),

    Password: z
    .string()
    .trim()
    .max(15)
    .min(6)

})

module.exports =  { ProtectedSignup , ProtectedSignin }