import { Request, Response } from 'express';

// Simulating fetching users from the database
export const getAllUsers = (req: Request, res: Response) => {
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
  ];
  res.status(200).json(users);
};
