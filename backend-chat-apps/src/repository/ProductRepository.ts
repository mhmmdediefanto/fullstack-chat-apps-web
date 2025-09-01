import prisma from "../plugins/db";

export async function findAllProduct() {
  const products = await prisma.products.findMany();
  return products;
}

export async function insertProduct(params: any) {
  const product = await prisma.products.create({
    data: {
      name: params.name,
      slug: params.slug,
      price: params.price,
      stock: params.stock,
      createdAt: new Date(),
    },
  });
  return product;
}

export async function getBySlug(params: string) {
  const product = await prisma.products.findUnique({
    where: {
      slug: params,
    },
  });

  return product;
}

export async function deleteProduct(id: number) {
  const product = await prisma.products.delete({
    where: {
      id: id,
    },
  });
  return product;
}


export async function getById(id:number) {
    const product = await prisma.products.findUnique({
      where: {
        id: id,
      },
    })

    return product
}