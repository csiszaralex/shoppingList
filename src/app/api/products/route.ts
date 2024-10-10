import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function PUT(request: Request) {
  const { id, quantity } = await request.json();
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { quantity, inCart: false },
  });

  return NextResponse.json(updatedProduct);
}

export async function POST(request: Request) {
  const { name, quantity } = await request.json();
  const product = await prisma.product.create({ data: { name, quantity, inCart: false } });

  return NextResponse.json(product);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const product = await prisma.product.findUnique({ where: { id } });
  if(!product) {
    return NextResponse.error();
  }
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { inCart: false, quantity: product.quantity - 1 },
  });

  return NextResponse.json(updatedProduct);
}
