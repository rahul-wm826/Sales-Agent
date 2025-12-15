import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export default function parse(zodSchema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = zodSchema.parse(req.body);
            req.body = validated;
            next();
        }
        catch (error) {
            console.log(error);
            res.status(400).json({
                error: "Invalid request body",
                details: error
            });
        }
    };
}