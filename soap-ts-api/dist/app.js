"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const translationRoutes_1 = __importDefault(require("./routes/translationRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const plansRoutes_1 = __importDefault(require("./routes/plansRoutes"));
const booksRoutes_1 = __importDefault(require("./routes/booksRoutes"));
const entriesRoutes_1 = __importDefault(require("./routes/entriesRoutes"));
const helpRoutes_1 = __importDefault(require("./routes/helpRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_middleware_1 = require("./middleware/index.middleware");
const mongoconnect_1 = require("./config/mongoconnect");
(0, mongoconnect_1.connectToDB)();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['https://www.soapjournal.org', 'https://soapjournal.org', 'http://localhost:4200', 'https://docker'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    exposedHeaders: ['Content-Type', 'Authorization', 'refreshToken', 'X-Custom-Header']
}));
app.use(express_1.default.json());
app.use("/api", helpRoutes_1.default);
app.use('/api', translationRoutes_1.default);
app.use('/api', plansRoutes_1.default);
app.use('/api', userRoutes_1.default);
app.use('/api', entriesRoutes_1.default);
app.use('/api', booksRoutes_1.default);
app.use(index_middleware_1.notFound);
app.use(index_middleware_1.errorHandler);
exports.default = app;
