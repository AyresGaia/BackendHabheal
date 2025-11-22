const connectDB = require("./db");

const foodData = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    description: "Creamy tomato-based curry made with soft paneer cubes.",
    image: "https://example.com/images/paneer-butter-masala.jpg",
    isVegetarian: true,
    tags: ["Indian", "Curry", "Creamy", "Dinner"]
  },
  {
    id: 2,
    name: "Chicken Biryani",
    description: "Aromatic basmati rice cooked with marinated chicken and spices.",
    image: "https://example.com/images/chicken-biryani.jpg",
    isVegetarian: false,
    tags: ["Indian", "Rice", "Spicy", "Lunch"]
  },
  {
    id: 3,
    name: "Veg Momos",
    description: "Steamed dumplings filled with seasoned vegetables.",
    image: "https://example.com/images/veg-momos.jpg",
    isVegetarian: true,
    tags: ["Snacks", "Tibetan", "Street Food"]
  },
  {
    id: 4,
    name: "Masala Dosa",
    description: "Crispy dosa stuffed with spiced potato filling.",
    image: "https://example.com/images/masala-dosa.jpg",
    isVegetarian: true,
    tags: ["South Indian", "Breakfast", "Crispy"]
  },
  {
    id: 5,
    name: "Beef Steak",
    description: "Juicy grilled steak seasoned with herbs and pepper.",
    image: "https://example.com/images/beef-steak.jpg",
    isVegetarian: false,
    tags: ["Grill", "Dinner", "Protein Rich"]
  },
  {
    id: 6,
    name: "Pav Bhaji",
    description: "Spicy mashed vegetable curry served with buttered pav.",
    image: "https://example.com/images/pav-bhaji.jpg",
    isVegetarian: true,
    tags: ["Indian", "Street Food", "Spicy"]
  },
  {
    id: 7,
    name: "Sushi Platter",
    description: "Assorted sushi rolls made with fresh fish and rice.",
    image: "https://example.com/images/sushi.jpg",
    isVegetarian: false,
    tags: ["Japanese", "Seafood", "Rice"]
  },
  {
    id: 8,
    name: "Caesar Salad",
    description: "Fresh lettuce salad with croutons, parmesan, and Caesar dressing.",
    image: "https://example.com/images/caesar-salad.jpg",
    isVegetarian: true,
    tags: ["Healthy", "Salad", "Light Food"]
  },
  {
    id: 9,
    name: "Butter Naan",
    description: "Soft, fluffy naan bread brushed with butter.",
    image: "https://example.com/images/butter-naan.jpg",
    isVegetarian: true,
    tags: ["Indian", "Bread", "Dinner"]
  },
  {
    id: 10,
    name: "Tandoori Chicken",
    description: "Chicken marinated in yogurt and spices, roasted in a tandoor.",
    image: "https://example.com/images/tandoori-chicken.jpg",
    isVegetarian: false,
    tags: ["Indian", "Grill", "High Protein"]
  }
];

async function seedFood() {
  try {
    const db = await connectDB();
    const collection = db.collection("foods");

    await collection.deleteMany({});
    await collection.insertMany(foodData);

    console.log("🍽️ Food seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding food:", error);
  }
}

seedFood();
