const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const app = express();

// ================= DATABASE =================
mongoose
  .connect("mongodb://127.0.0.1:27017/schoolDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ================= MIDDLEWARE =================
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "school_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // development
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ================= SCHEMAS =================

// USERS
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "deputy_manager",
    },
  })
);

// TRADES
const Trade = mongoose.model(
  "Trade",
  new mongoose.Schema({
    tradeId: {
      type: String,
      required: true,
      unique: true,
    },
    tradeName: {
      type: String,
      required: true,
    },
  })
);

// MODULES
const Module = mongoose.model(
  "Module",
  new mongoose.Schema({
    moduleId: {
      type: String,
      required: true,
      unique: true,
    },
    moduleName: {
      type: String,
      required: true,
    },
    moduleCode: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    tradeId: {
      type: String,
      required: true,
    },
  })
);

// TRAINEES
const Trainee = mongoose.model(
  "Trainee",
  new mongoose.Schema({
    traineeId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  })
);

// MARKS
const Mark = mongoose.model(
  "Mark",
  new mongoose.Schema({
    traineeId: {
      type: String,
      required: true,
    },
    moduleId: {
      type: String,
      required: true,
    },
    formativeAssessment: {
      type: Number,
      required: true,
    },
    summativeAssessment: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
  })
);

// ================= AUTH MIDDLEWARE =================
function auth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
}

// ================= AUTH =================

// REGISTER USER
app.post("/users", async (req, res) => {
  try {
    const { userId, username, password } = req.body;

    const exists = await User.findOne({
      $or: [{ username }, { userId }],
    });

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      userId,
      username,
      password,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
      password,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    res.json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// VERIFY LOGIN
app.get("/verify", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      authenticated: false,
    });
  }

  res.json({
    authenticated: true,
    user: req.session.user,
  });
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");

    res.json({
      message: "Logged out successfully",
    });
  });
});

// ================= TRADES CRUD =================

// CREATE
app.post("/trades", auth, async (req, res) => {
  try {
    const trade = await Trade.create(req.body);
    res.status(201).json(trade);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// READ
app.get("/trades", auth, async (req, res) => {
  try {
    const trades = await Trade.find();
    res.json(trades);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE
app.put("/trades/:id", auth, async (req, res) => {
  try {
    const trade = await Trade.findOneAndUpdate(
      { tradeId: req.params.id },
      req.body,
      { new: true }
    );

    res.json(trade);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE
app.delete("/trades/:id", auth, async (req, res) => {
  try {
    await Trade.deleteOne({
      tradeId: req.params.id,
    });

    res.json({
      message: "Trade deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================= TRAINEES CRUD =================

// CREATE
app.post("/trainees", auth, async (req, res) => {
  try {
    const trainee = await Trainee.create(req.body);
    res.status(201).json(trainee);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// READ
app.get("/trainees", auth, async (req, res) => {
  try {
    const trainees = await Trainee.find();
    res.json(trainees);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE
app.put("/trainees/:id", auth, async (req, res) => {
  try {
    const trainee = await Trainee.findOneAndUpdate(
      { traineeId: req.params.id },
      req.body,
      { new: true }
    );

    res.json(trainee);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE
app.delete("/trainees/:id", auth, async (req, res) => {
  try {
    await Trainee.deleteOne({
      traineeId: req.params.id,
    });

    res.json({
      message: "Trainee deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================= MODULES CRUD =================

// CREATE
app.post("/modules", auth, async (req, res) => {
  try {
    const module = await Module.create(req.body);
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// READ
app.get("/modules", auth, async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE
app.put("/modules/:id", auth, async (req, res) => {
  try {
    const module = await Module.findOneAndUpdate(
      { moduleId: req.params.id },
      req.body,
      { new: true }
    );

    res.json(module);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE
app.delete("/modules/:id", auth, async (req, res) => {
  try {
    await Module.deleteOne({
      moduleId: req.params.id,
    });

    res.json({
      message: "Module deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================= MARKS CRUD =================

// CREATE
app.post("/marks", auth, async (req, res) => {
  try {
    const {
      traineeId,
      moduleId,
      formativeAssessment,
      summativeAssessment,
    } = req.body;

    const totalMarks =
      Number(formativeAssessment) +
      Number(summativeAssessment);

    const mark = await Mark.create({
      traineeId,
      moduleId,
      formativeAssessment,
      summativeAssessment,
      totalMarks,
    });

    res.status(201).json(mark);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// READ
app.get("/marks", auth, async (req, res) => {
  try {
    const marks = await Mark.find();
    res.json(marks);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE
app.put("/marks/:id", auth, async (req, res) => {
  try {
    const totalMarks =
      Number(req.body.formativeAssessment) +
      Number(req.body.summativeAssessment);

    const updated = await Mark.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        totalMarks,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE
app.delete("/marks/:id", auth, async (req, res) => {
  try {
    await Mark.findByIdAndDelete(req.params.id);

    res.json({
      message: "Mark deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================= REPORTS =================
app.get("/reports", auth, async (req, res) => {
  try {
    const marks = await Mark.find();

    const reports = marks.map((mark) => ({
      traineeId: mark.traineeId,
      moduleId: mark.moduleId,
      totalMarks: mark.totalMarks,
      status:
        mark.totalMarks >= 70
          ? "Competent"
          : "Not Yet Competent",
    }));

    res.json(reports);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});





app.get("/reports", auth, async (req, res) => {
  try {
    const marks = await Mark.find();

    const report = marks.map((m) => ({
      traineeId: m.traineeId,
      totalMarks: m.totalMarks,
      status:
        m.totalMarks >= 70
          ? "Competent"
          : "Not Yet Competent"
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});








// ================= DASHBOARD STATS =================
app.get("/dashboard-stats", auth, async (req, res) => {
  try {
    const trades = await Trade.countDocuments();
    const trainees = await Trainee.countDocuments();
    const modules = await Module.countDocuments();

    const competent = await Mark.countDocuments({
      totalMarks: { $gte: 70 },
    });

    const notCompetent = await Mark.countDocuments({
      totalMarks: { $lt: 70 },
    });

    res.json({
      trades,
      trainees,
      modules,
      competent,
      notCompetent,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});