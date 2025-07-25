"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const translationRoutes_1 = __importDefault(require("./routes/translationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
if (process.env.MONGO_URI === undefined) {
    dotenv_1.default.config();
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/api", bookRoutes_1.default);
app.use("/api", translationRoutes_1.default);
app.use("/api", userRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
