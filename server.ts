/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { createServer as createViteServer } from "vite";
import { Car, Inquiry } from "./src/types";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || "simatei-motorworld-secret-key-2026";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_RAW = process.env.ADMIN_PASSWORD || "admin123";

// Paths for persistent data
const DATA_DIR = path.join(process.cwd(), "data");
const CARS_JSON = path.join(DATA_DIR, "cars.json");
const INQUIRIES_JSON = path.join(DATA_DIR, "inquiries.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use("/uploads", express.static(UPLOADS_DIR));

// Seed default cars if empty
const seedCars: Car[] = [
  {
    id: "1",
    make: "Mercedes-Benz",
    model: "C-Class C200 AMG Line",
    year: 2020,
    price: 5400000,
    mileage: 42000,
    fuelType: "Petrol",
    transmission: "Automatic",
    engine: "1.5L Dynamic Turbo",
    color: "Selenite Grey",
    features: ["Sunroof", "Leather Seats", "LED Headlights", "Ambient Lighting", "Burmester Sound", "Reverse Camera", "Apple CarPlay"],
    images: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200"
    ],
    status: "Available",
    description: "Immaculate Mercedes-Benz C200 AMG Line finished in Selenite Grey. Single owner, dealer maintained since day one. Powered by an efficient yet punchy 1.5L turbocharged engine with mild-hybrid assistance. Pristine cabin trimmed in premium Artico leather, high-definition digital dashboard, and immersive Burmester surround system. Extremely smooth drive, perfect for Nairobi roads.",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    make: "Toyota",
    model: "Land Cruiser Prado TX-L",
    year: 2019,
    price: 7800000,
    mileage: 65000,
    fuelType: "Diesel",
    transmission: "Automatic",
    engine: "2.8L D-4D Turbo Diesel",
    color: "Pearl White",
    features: ["4WD", "7 Seats", "Sunroof", "Ventilated Seats", "Cruise Control", "Roof Rails", "Coolbox", "Steering Controls"],
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200"
    ],
    status: "Available",
    description: "Highly sought-after Land Cruiser Prado TX-L. Exceptional off-road capabilities coupled with supreme passenger comfort. Full premium black leather interior with 7 seats configuration, panoramic sunroof, active cruise control, and cooling box. Powered by the incredibly robust 2.8-liter D-4D diesel unit. Fully serviced and ready for your adventure.",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    make: "BMW",
    model: "X5 xDrive40i M-Sport",
    year: 2021,
    price: 11500000,
    mileage: 28000,
    fuelType: "Petrol",
    transmission: "Automatic",
    engine: "3.0L TwinPower Turbo I6",
    color: "Mineral Black",
    features: ["M-Sport Pack", "Panoramic Sky Lounge", "Harman Kardon Audio", "Head-Up Display", "Air Suspension", "Gesture Control"],
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200"
    ],
    status: "Available",
    description: "Ultimate luxury and performance crossover. This BMW X5 boasts the renowned inline-6 cylinder TwinPower engine pumping out 335 HP. Finished in Mineral Black metallic with black vernasca leather sport cabins. Features 21-inch M-Sport alloy wheels, adaptive air suspension, HUD, gesture control, and premium laser headlights.",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    make: "Subaru",
    model: "Forester 2.0i-S EyeSight",
    year: 2018,
    price: 2950000,
    mileage: 72000,
    fuelType: "Petrol",
    transmission: "Automatic",
    engine: "2.0L Boxer Engine",
    color: "Dark Blue Metallic",
    features: ["Symmetrical AWD", "EyeSight Safety Driver Assist", "X-Mode", "Heated Seats", "Electric Tailgate", "Lane Departure Warning"],
    images: [
      "https://images.unsplash.com/photo-1562591188-107b973c689d?auto=format&fit=crop&q=80&w=1200"
    ],
    status: "Sold",
    description: "Outstanding versatility in this premium Forester 2.0i-S. Fully equipped with Subaru's award-winning EyeSight driver assistance technology, standard symmetrical all-wheel-drive with dual-function X-Mode for rugged terrains. Very economical daily driver with top-tier roominess and safety.",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    make: "Ford",
    model: "Ranger Raptor Double Cab",
    year: 2020,
    price: 6400000,
    mileage: 51000,
    fuelType: "Diesel",
    transmission: "Automatic",
    engine: "2.0L Bi-Turbo Diesel",
    color: "Conquer Grey",
    features: ["Fox Racing Shocks", "Terrain Management System", "Heavy Duty Side Steps", "Sports Leather Seats", "Paddle Shifters", "Tow Bar"],
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200"
    ],
    status: "Available",
    description: "The ultimate off-road racing utility pickup. Features factory-fitted high-performance Fox Racing shocks, high-strength chassis frame, and dual-turbo diesel engine with a quick-shifting 10-speed transmission. Aggressive Raptor body styling, premium sports leather-padded cabin, and incredible durability.",
    createdAt: new Date().toISOString()
  }
];

// Read/write helpers
function readCars(): Car[] {
  try {
    if (!fs.existsSync(CARS_JSON)) {
      fs.writeFileSync(CARS_JSON, JSON.stringify(seedCars, null, 2));
      return seedCars;
    }
    const data = fs.readFileSync(CARS_JSON, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading cars data, resetting to seed:", err);
    return seedCars;
  }
}

function writeCars(cars: Car[]) {
  fs.writeFileSync(CARS_JSON, JSON.stringify(cars, null, 2));
}

function readInquiries(): Inquiry[] {
  try {
    if (!fs.existsSync(INQUIRIES_JSON)) {
      fs.writeFileSync(INQUIRIES_JSON, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(INQUIRIES_JSON, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading inquiries data:", err);
    return [];
  }
}

function writeInquiries(inquiries: Inquiry[]) {
  fs.writeFileSync(INQUIRIES_JSON, JSON.stringify(inquiries, null, 2));
}

// REST API Routes

// Authentication middleware
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    if (decoded.username === ADMIN_USERNAME) {
      next();
    } else {
      res.status(403).json({ message: "Access forbidden" });
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired session token" });
  }
}

// 🔐 Auth Routes
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Allow fallback admin verification
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD_RAW) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });
    return res.json({
      token,
      user: {
        id: "admin-id-1",
        username: ADMIN_USERNAME,
        name: "Simatei Administrator"
      }
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

app.get("/api/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ loggedIn: false });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    if (decoded.username === ADMIN_USERNAME) {
      return res.json({
        loggedIn: true,
        user: {
          id: "admin-id-1",
          username: ADMIN_USERNAME,
          name: "Simatei Administrator"
        }
      });
    }
    return res.status(401).json({ loggedIn: false });
  } catch (err) {
    return res.status(401).json({ loggedIn: false });
  }
});

// 🚗 Cars Routes
app.get("/api/cars", (req, res) => {
  const cars = readCars();
  res.json(cars);
});

app.get("/api/cars/:id", (req, res) => {
  const cars = readCars();
  const car = cars.find((c) => c.id === req.params.id);
  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }
  res.json(car);
});

app.post("/api/cars", authenticateAdmin, (req, res) => {
  const { 
    make, model, year, price, mileage, fuelType, transmission, engine, color, 
    features, images, description, status,
    interiorColor, driveType, dutyStatus, importStatus, bodyType, location, conditionGrade
  } = req.body;
  
  if (!make || !model || !year || !price || !mileage || !fuelType || !transmission || !engine || !color || !description) {
    return res.status(400).json({ message: "All basic car fields are required" });
  }

  const cars = readCars();
  const newCar: Car = {
    id: Date.now().toString(),
    make,
    model,
    year: Number(year),
    price: Number(price),
    mileage: Number(mileage),
    fuelType,
    transmission,
    engine,
    color,
    interiorColor: interiorColor || "Black Leather",
    driveType: driveType || "AWD",
    dutyStatus: dutyStatus || "Duty Paid",
    importStatus: importStatus || "Foreign Used",
    bodyType: bodyType || "SUV",
    location: location || "Nairobi",
    conditionGrade: conditionGrade || "Grade 4.5",
    features: Array.isArray(features) ? features : [],
    images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800"],
    status: status || "Available",
    description,
    createdAt: new Date().toISOString()
  };

  cars.unshift(newCar);
  writeCars(cars);
  res.status(201).json(newCar);
});

app.put("/api/cars/:id", authenticateAdmin, (req, res) => {
  const cars = readCars();
  const index = cars.findIndex((c) => c.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: "Car not found" });
  }

  const existingCar = cars[index];
  const { 
    make, model, year, price, mileage, fuelType, transmission, engine, color, 
    features, images, description, status,
    interiorColor, driveType, dutyStatus, importStatus, bodyType, location, conditionGrade
  } = req.body;

  cars[index] = {
    ...existingCar,
    make: make !== undefined ? make : existingCar.make,
    model: model !== undefined ? model : existingCar.model,
    year: year !== undefined ? Number(year) : existingCar.year,
    price: price !== undefined ? Number(price) : existingCar.price,
    mileage: mileage !== undefined ? Number(mileage) : existingCar.mileage,
    fuelType: fuelType !== undefined ? fuelType : existingCar.fuelType,
    transmission: transmission !== undefined ? transmission : existingCar.transmission,
    engine: engine !== undefined ? engine : existingCar.engine,
    color: color !== undefined ? color : existingCar.color,
    features: features !== undefined ? features : existingCar.features,
    images: images !== undefined ? images : existingCar.images,
    description: description !== undefined ? description : existingCar.description,
    status: status !== undefined ? status : existingCar.status,
    interiorColor: interiorColor !== undefined ? interiorColor : existingCar.interiorColor,
    driveType: driveType !== undefined ? driveType : existingCar.driveType,
    dutyStatus: dutyStatus !== undefined ? dutyStatus : existingCar.dutyStatus,
    importStatus: importStatus !== undefined ? importStatus : existingCar.importStatus,
    bodyType: bodyType !== undefined ? bodyType : existingCar.bodyType,
    location: location !== undefined ? location : existingCar.location,
    conditionGrade: conditionGrade !== undefined ? conditionGrade : existingCar.conditionGrade
  };

  writeCars(cars);
  res.json(cars[index]);
});

app.delete("/api/cars/:id", authenticateAdmin, (req, res) => {
  const cars = readCars();
  const filtered = cars.filter((c) => c.id !== req.params.id);
  if (cars.length === filtered.length) {
    return res.status(404).json({ message: "Car not found" });
  }
  writeCars(filtered);
  res.json({ success: true, message: "Car listing deleted" });
});

// 📁 Image Upload to Local static uploads (accepts Base64 JSON and converts to file)
app.post("/api/upload", authenticateAdmin, (req, res) => {
  const { image } = req.body; // Base64 string e.g. "data:image/png;base64,iVBORw0KGgo..."
  if (!image || !image.startsWith("data:")) {
    return res.status(400).json({ message: "No valid base64 image data provided" });
  }

  try {
    const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
    const dataBuffer = Buffer.from(matches[2], "base64");
    const filename = `uploaded-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filepath, dataBuffer);
    const relativeUrl = `/uploads/${filename}`;
    
    res.json({ url: relativeUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to process image upload" });
  }
});

// 📬 Inquiries & Contact Routes
app.post("/api/contact", (req, res) => {
  const { name, email, message, carId, carName } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }

  const inquiries = readInquiries();
  const newInquiry: Inquiry = {
    id: Date.now().toString(),
    carId,
    carName,
    name,
    email,
    message,
    status: "Unread",
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  writeInquiries(inquiries);
  res.status(201).json({ success: true, message: "Inquiry submitted successfully!" });
});

app.get("/api/admin/inquiries", authenticateAdmin, (req, res) => {
  const inquiries = readInquiries();
  res.json(inquiries);
});

app.put("/api/admin/inquiries/:id", authenticateAdmin, (req, res) => {
  const inquiries = readInquiries();
  const index = inquiries.findIndex((i) => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Inquiry not found" });
  }
  const { status } = req.body;
  inquiries[index].status = status || inquiries[index].status;
  writeInquiries(inquiries);
  res.json(inquiries[index]);
});

app.delete("/api/admin/inquiries/:id", authenticateAdmin, (req, res) => {
  const inquiries = readInquiries();
  const filtered = inquiries.filter((i) => i.id !== req.params.id);
  if (inquiries.length === filtered.length) {
    return res.status(404).json({ message: "Inquiry not found" });
  }
  writeInquiries(filtered);
  res.json({ success: true, message: "Inquiry deleted" });
});

// Seed inquiries if none exist
const mockInquiries = readInquiries();
if (mockInquiries.length === 0) {
  const seedInquiries: Inquiry[] = [
    {
      id: "inq-1",
      name: "Kevin Kipyegon",
      email: "kevinkipyegon111@gmail.com",
      message: "Is the Mercedes-Benz C-Class still available? I would love to schedule a view and test drive this weekend in Nairobi.",
      carId: "1",
      carName: "Mercedes-Benz C-Class C200 AMG Line",
      status: "Unread",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: "inq-2",
      name: "Silvia Chepkoech",
      email: "silvia.chep@demo.com",
      message: "Can you provide financing options for the Land Cruiser Prado? Let's discuss via WhatsApp.",
      carId: "2",
      carName: "Toyota Land Cruiser Prado TX-L",
      status: "Unread",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];
  writeInquiries(seedInquiries);
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
