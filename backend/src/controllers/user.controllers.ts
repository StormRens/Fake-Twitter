import { Request, Response } from "express";

// get request controller
// basically just a bunch of functions that do things related to users
export async function userExample(req: Request, res: Response)
{   
    // const userId = req.params.id
    console.log("Example user controller");
}