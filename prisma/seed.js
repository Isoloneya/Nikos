const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const kyiv = await prisma.restaurant.create({
    data: {
      name: "Niko's Хрещатик",
      city: "Київ",
      address: "вул. Хрещатик, 1",
      phone: "+380445555555",
      workingHours: "10:00 - 22:00",
      bookingEmail: "kyiv@nikos.ua",
    },
  });

  const lviv = await prisma.restaurant.create({
    data: {
      name: "Niko's Ринок",
      city: "Львів",
      address: "пл. Ринок, 5",
      phone: "+380325555555",
      workingHours: "10:00 - 22:00",
      bookingEmail: "lviv@nikos.ua",
    },
  });

  const categoryNames = ["Роли", "Рамен", "Дамплінги", "Стріт-фуд", "Напої"];

  const categories = await Promise.all(
    categoryNames.map((name, i) =>
      prisma.category.create({ data: { name, order: i } })
    )
  );

  const [rolls, ramen, dumplings, streetFood, drinks] = categories;

  const dishes = [
    { name: "Спайсі Тона Макі", description: "Тунець, гострий майонез, огірок, кунжут", priceCents: 28900, categoryId: rolls.id, photoUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80", isSpicy: true, restaurants: [kyiv, lviv] },
    { name: "Філадельфія Рол", description: "Лосось, сир чізу, авокадо", priceCents: 34900, categoryId: rolls.id, photoUrl: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80", restaurants: [kyiv, lviv] },
    { name: "Каліфорнія Рол", description: "Краб, авокадо, огірок, ікра тобіко", priceCents: 27900, categoryId: rolls.id, photoUrl: "https://images.unsplash.com/photo-1564489563601-c53cfc451e93?auto=format&fit=crop&w=600&q=80", restaurants: [kyiv, lviv] },
    { name: "Драконячий Рол", description: "Вугор, авокадо, соус унагі", priceCents: 38900, categoryId: rolls.id, photoUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80", restaurants: [kyiv] },
    { name: "Темпура Рол", description: "Креветка темпура, сир чізу, соус спайсі", priceCents: 32900, categoryId: rolls.id, photoUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=600&q=80", isSpicy: true, restaurants: [kyiv, lviv] },
    { name: "Веган Рол", description: "Авокадо, огірок, тофу, кунжут", priceCents: 22900, categoryId: rolls.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Vegan_sushi_roll_picture.jpg", isVegan: true, restaurants: [kyiv, lviv] },
    { name: "Лосось Рол класичний", description: "Свіжий лосось, рис, норі", priceCents: 26900, categoryId: rolls.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Salmon_sushi.jpg", restaurants: [kyiv, lviv] },
    { name: "Унагі Рол", description: "Вугор гриль, огірок, соус унагі", priceCents: 34900, categoryId: rolls.id, photoUrl: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=600&q=80", restaurants: [lviv] },

    { name: "Тонкоцу Рамен", description: "Свинячий бульйон 18 год, чашу, яйце онсен", priceCents: 31900, categoryId: ramen.id, photoUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80", restaurants: [kyiv] },
    { name: "Кімчі Рамен", description: "Гострий бульйон кімчі, свинина чашу", priceCents: 32900, categoryId: ramen.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Kimchi_ramen_Paris.jpg", isSpicy: true, restaurants: [kyiv, lviv] },
    { name: "Місо Рамен", description: "Бульйон місо, кукурудза, яйце, водорості", priceCents: 29900, categoryId: ramen.id, photoUrl: "https://images.unsplash.com/photo-1614563637806-1d0e645e0940?auto=format&fit=crop&w=600&q=80", restaurants: [kyiv, lviv] },
    { name: "Шою Рамен", description: "Соєвий бульйон, курка, зелена цибуля", priceCents: 27900, categoryId: ramen.id, photoUrl: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=600&q=80", restaurants: [kyiv, lviv] },
    { name: "Веган Рамен овочевий", description: "Овочевий бульйон, тофу, гриби шиітаке", priceCents: 25900, categoryId: ramen.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/Vegan_ramen_at_T%27s_Tan_Tan_in_Tokyo_Station_.jpg", isVegan: true, restaurants: [kyiv, lviv] },
    { name: "Спайсі Тантанмен", description: "Кунжутний бульйон, фарш свинини, чилі-олія", priceCents: 31900, categoryId: ramen.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Tantanmen_%40_Yatta_%21_Ramen_%2851928277558%29.jpg", isSpicy: true, restaurants: [kyiv] },
    { name: "Карі Рамен", description: "Бульйон карі, курка кацу, рис", priceCents: 33900, categoryId: ramen.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/Curry_Ramen_%40_Bunsuke_%40_Asakusa_%2812638144773%29.jpg", restaurants: [lviv] },

    { name: "Овочеві Гьоза", description: "Домашні дамплінги, соєво-імбирний соус", priceCents: 17500, categoryId: dumplings.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Gyoza.jpg", isVegan: true, restaurants: [kyiv, lviv] },
    { name: "Тофу Дамплінги", description: "Пара, тофу, шпинат, соус на вибір", priceCents: 16500, categoryId: dumplings.id, photoUrl: "https://komeko.de/cdn/shop/files/rezept_bild_gyoza.webp?v=1751461033&width=1000", isVegan: true, restaurants: [kyiv, lviv] },
    { name: "Свинячі Баоцзи", description: "Парові булочки з начинкою зі свинини", priceCents: 19900, categoryId: dumplings.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Steamed_pork_buns_%283009967106%29.jpg", restaurants: [kyiv, lviv] },
    { name: "Креветкові Дамплінги", description: "Дамплінги з креветкою та імбиром", priceCents: 21900, categoryId: dumplings.id, photoUrl: "https://static.1000.menu/img/content-v2/11/8e/93686/damplingi-s-krevetkami_1734293115_14_xdjhhqv_max.jpg", restaurants: [kyiv] },
    { name: "Хар Гау", description: "Прозорі дамплінги з креветкою дим-сам", priceCents: 20900, categoryId: dumplings.id, photoUrl: "https://casuallypeckish.com/wp-content/uploads/2021/11/Har-gow-1.jpg", restaurants: [kyiv, lviv] },
    { name: "Курячі Гьоза з кунжутом", description: "Дамплінги з куркою, кунжутна олія", priceCents: 18900, categoryId: dumplings.id, photoUrl: "https://snapcalorie-webflow-website.s3.us-east-2.amazonaws.com/media/food_pics_v2/chicken_gyoza.jpg", restaurants: [lviv] },

    { name: "Курка Карааге", description: "Хрустка курка по-японськи з майонезом", priceCents: 24900, categoryId: streetFood.id, photoUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80", restaurants: [kyiv, lviv] },
    { name: "Якіторі Шашлики", description: "Курячі шашлики на грилі, соус таре", priceCents: 21900, categoryId: streetFood.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Yakitori_%28Teriyaki_Chicken_Skewers%29.jpg", restaurants: [kyiv, lviv] },
    { name: "Пад Тай з креветками", description: "Тайська локшина, креветки, арахіс", priceCents: 28900, categoryId: streetFood.id, photoUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=600&q=80", restaurants: [kyiv] },
    { name: "Бао Бургер з яловичиною", description: "Парова булочка бао, яловичина, овочі", priceCents: 26900, categoryId: streetFood.id, photoUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80", restaurants: [kyiv, lviv] },
    { name: "Теріякі Курка Боул", description: "Рис, курка теріякі, овочі гриль", priceCents: 27900, categoryId: streetFood.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Teriyaki_Chicken_Rice_Bowl_from_Botejyu_%282024-12-21%29.jpg", restaurants: [kyiv, lviv] },
    { name: "Спайсі Кальмари", description: "Хрусткі кальмари в гострій паніровці", priceCents: 25900, categoryId: streetFood.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/34/Fried_calamari.jpg", isSpicy: true, restaurants: [kyiv] },
    { name: "Овочева Темпура", description: "Асорті овочів у хрусткому кляру", priceCents: 19900, categoryId: streetFood.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Vegetable_tempura_.jpg", isVegan: true, restaurants: [kyiv, lviv] },
    { name: "Корейські Тако з яловичиною", description: "Тако з маринованою яловичиною, кімчі", priceCents: 23900, categoryId: streetFood.id, photoUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80", isSpicy: true, restaurants: [lviv] },

    { name: "Матча Латте", description: "Японський зелений чай матча з молоком", priceCents: 12900, categoryId: drinks.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Matcha_latte.jpg", isVegan: true, restaurants: [kyiv, lviv] },
    { name: "Тайський Чай з молоком", description: "Чорний чай, спеції, згущене молоко", priceCents: 9900, categoryId: drinks.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Thai_milk_tea_-_Thai_Pad_Thai_2025-07-09.jpg", restaurants: [kyiv, lviv] },
    { name: "Юзу Лимонад", description: "Японський цитрус юзу, содова", priceCents: 8900, categoryId: drinks.id, photoUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", isVegan: true, restaurants: [kyiv, lviv] },
    { name: "Імбирний Ель домашній", description: "Свіжий імбир, лимон, содова", priceCents: 7900, categoryId: drinks.id, photoUrl: "https://images.unsplash.com/photo-1631029098074-be99eb2b425c?fit=max&fm=jpg&w=1200&q=85", isVegan: true, restaurants: [kyiv, lviv] },
    { name: "Холодний Улун", description: "Витриманий улун з льодом", priceCents: 9900, categoryId: drinks.id, photoUrl: "https://toptiertea.com.tw/cdn/shop/files/0005_06144945.jpg?v=1726208724&width=600", restaurants: [kyiv] },
    { name: "Кокосова Вода", description: "Натуральна кокосова вода без цукру", priceCents: 8900, categoryId: drinks.id, photoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Coconut_drink.jpg", isVegan: true, restaurants: [kyiv, lviv] },
  ];

  for (const d of dishes) {
    await prisma.menuItem.create({
      data: {
        name: d.name,
        description: d.description,
        priceCents: d.priceCents,
        photoUrl: d.photoUrl,
        isSpicy: !!d.isSpicy,
        isVegan: !!d.isVegan,
        categoryId: d.categoryId,
        restaurants: { connect: d.restaurants.map((r) => ({ id: r.id })) },
      },
    });

    console.log(`✔ ${d.name}`);
  }

  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.create({
    data: {
      email: "admin@nikos.ua",
      passwordHash,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

