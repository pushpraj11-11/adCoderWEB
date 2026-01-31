import { PrismaClient, Role, Category } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

const main = async () => {
  const passwordHash = await hashPassword("password123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@adcoderweb.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@adcoderweb.com",
      passwordHash,
      role: Role.ADMIN
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@adcoderweb.com" },
    update: {},
    create: {
      name: "Alex Customer",
      email: "customer@adcoderweb.com",
      passwordHash
    }
  });

  const categories = await prisma.category.createMany({
    data: [
      {
        name: "Audio",
        slug: "audio",
        description: "Premium sound experiences.",
        imageUrl:
          "https://images.unsplash.com/photo-1518441985338-64ba229e8d03?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Wearables",
        slug: "wearables",
        description: "Smart, elegant everyday tech.",
        imageUrl:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Home",
        slug: "home",
        description: "Minimalist essentials for modern living.",
        imageUrl:
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
      }
    ],
    skipDuplicates: true
  });

  const categoryList = await prisma.category.findMany();
  const audio = categoryList.find((cat: Category) => cat.slug === "audio")!;
  const wearables = categoryList.find((cat: Category) => cat.slug === "wearables")!;
  const home = categoryList.find((cat: Category) => cat.slug === "home")!;

  const products = await prisma.product.createMany({
    data: [
      {
        name: "Aurora Noise Cancelling Headphones",
        slug: "aurora-noise-cancelling-headphones",
        description:
          "Studio-grade clarity with adaptive noise cancellation and 40-hour battery life.",
        price: 299,
        compareAtPrice: 349,
        categoryId: audio.id,
        isFeatured: true,
        isBestSeller: true
      },
      {
        name: "Pulse Smartwatch",
        slug: "pulse-smartwatch",
        description:
          "Sleek titanium body with health insights, GPS, and 7-day battery.",
        price: 249,
        compareAtPrice: 299,
        categoryId: wearables.id,
        isFeatured: true,
        isBestSeller: false
      },
      {
        name: "Nimbus Aroma Diffuser",
        slug: "nimbus-aroma-diffuser",
        description:
          "Ultrasonic mist with ambient lighting and whisper-quiet performance.",
        price: 89,
        compareAtPrice: 99,
        categoryId: home.id,
        isFeatured: false,
        isBestSeller: true
      }
    ],
    skipDuplicates: true
  });

  const productList = await prisma.product.findMany();

  for (const product of productList) {
    await prisma.productImage.createMany({
      data: [
        {
          productId: product.id,
          url: "https://images.unsplash.com/photo-1518441985338-64ba229e8d03?auto=format&fit=crop&w=800&q=80",
          alt: `${product.name} hero`
        },
        {
          productId: product.id,
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
          alt: `${product.name} side`
        }
      ],
      skipDuplicates: true
    });

    await prisma.variant.createMany({
      data: [
        {
          productId: product.id,
          name: "Color",
          value: "Midnight",
          sku: `${product.slug}-midnight`,
          stock: 12
        },
        {
          productId: product.id,
          name: "Color",
          value: "Silver",
          sku: `${product.slug}-silver`,
          stock: 8
        }
      ],
      skipDuplicates: true
    });
  }

  await prisma.review.create({
    data: {
      productId: productList[0].id,
      userId: customer.id,
      rating: 5,
      title: "Exceeded expectations",
      body: "Comfortable fit and stunning audio. The build quality is top tier."
    }
  });

  console.log({ admin, customer, categories, products });
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
