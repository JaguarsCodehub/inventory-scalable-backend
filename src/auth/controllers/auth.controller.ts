import { Request, Response } from "express";
import db from "../../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signupSchema } from "../../models/auth.schema";


export const signUpUser = async (req: Request, res: Response): Promise<void> => {

    const validateData = signupSchema.parse(req.body)


    const { email, password, role } = validateData

    try {
        const existingUser = await db.user.findUnique({ where: { email } })

        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                role
            }
        })

        res.status(201).json({ message: "User created successfully", userId: newUser.id })

    } catch (error) {

    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await db.user.findUnique({ where: { email } })

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" })

        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}