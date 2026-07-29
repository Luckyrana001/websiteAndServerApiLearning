require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDatabase = require("./config/database");
const User = require("./models/User");
const Quiz = require("./models/Quiz");
const Reward = require("./models/Reward");
const Mission = require("./models/Mission");

async function seed() {
  await connectDatabase();

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const admin = await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: "Platform Admin",
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      role: "admin",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const quizzes = [
    {
      title: "JavaScript Basics",
      description: "Test your knowledge of everyday JavaScript concepts.",
      status: "active",
      createdBy: admin._id,
      questions: [
        { text: "Which keyword declares a block-scoped variable?", allowMultiple: false, options: [
          { text: "var", isCorrect: false }, { text: "let", isCorrect: true }, { text: "define", isCorrect: false },
        ] },
        { text: "Which are JavaScript primitive types?", allowMultiple: true, options: [
          { text: "string", isCorrect: true }, { text: "number", isCorrect: true }, { text: "class", isCorrect: false },
        ] },
      ],
    },
    {
      title: "Healthy Habits Challenge",
      description: "A quick image-ready quiz about healthy daily habits.",
      status: "active",
      createdBy: admin._id,
      questions: [
        { text: "Which habits support daily wellbeing?", allowMultiple: true, options: [
          { text: "Regular movement", isCorrect: true }, { text: "Adequate sleep", isCorrect: true }, { text: "Skipping every meal", isCorrect: false },
        ] },
      ],
    },
  ];

  for (const quiz of quizzes) {
    await Quiz.findOneAndUpdate({ title: quiz.title }, quiz, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  await Reward.findOneAndUpdate({ name: "Coffee voucher" }, { name: "Coffee voucher", description: "A small reward for your points.", pointsCost: 100 }, { upsert: true, new: true, setDefaultsOnInsert: true });
  await Mission.findOneAndUpdate({ title: "Complete your first quiz" }, { title: "Complete your first quiz", description: "Finish one active quiz.", target: 1, rewardPoints: 25 }, { upsert: true, new: true, setDefaultsOnInsert: true });

  console.log(`Seed complete. Admin login: ${adminEmail} / ${adminPassword}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
