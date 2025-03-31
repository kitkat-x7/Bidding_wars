import { z } from "zod";

export const UserSchema=z.object({
    email:z.string({ message: "Email must be a string" })
        .min(3,{ message: "Email must be at least 3 char longs" })
        .max(100,{ message: "Email must be at atmost 100 char longs" })
        .email({ message: "Must be an email." }),
    password:z.string({ message: "Password must be a string" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password must be at most 100 characters long" })
        .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, {
        message: "Password must contain at least one uppercase letter, one number, and one special character."
    }),
    name:z.string({message:"Name should be a string"})
        .min(9,{ message: "Name must be at least 9 char longs" })
        .max(100,{ message: "Name must be at atmost 100 char longs" }),
    phone_number:z.string({message:"Number should be a string"})
    .min(10,{ message: "Name must be at least 10 char longs" })
    .max(10,{ message: "Name must be at atmost 10 char longs" }),
});

export const UpdatedUserSchema=z.object({
    name:z.string({message:"Name should be a string"})
        .min(9,{ message: "Name must be at least 9 char longs" })
        .max(100,{ message: "Name must be at atmost 100 char longs" }),
    phone_number:z.string({message:"Number should be a string"})
    .min(10,{ message: "Name must be at least 10 char longs" })
    .max(10,{ message: "Name must be at atmost 10 char longs" }),
});

export const LoginSchema=z.object({
    email:z.string({ message: "Email must be a string" })
        .min(3,{ message: "Email must be at least 3 char longs" })
        .max(100,{ message: "Email must be at atmost 100 char longs" })
        .email({ message: "Must be an email." }),
    password:z.string({ message: "Password must be a string" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password must be at most 100 characters long" })
        .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, {
        message: "Password must contain at least one uppercase letter, one number, and one special character."
    })
});

export const WalletSchema=z.object({
    ballence:z.number({
        message:"type must be a number"
    })
});

export const TransactionSchema=z.object({
    sum:z.number({
        message:"type must be a number"
    })
});