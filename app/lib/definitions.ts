// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export type Question = {
  id: number;
  text: string;
  code: string;
  options: [
    { id: number; text: string },
    { id: number; text: string },
    { id: number; text: string },
    { id: number; text: string },
  ];
  correctOption: number;
  explanation: string;
}
