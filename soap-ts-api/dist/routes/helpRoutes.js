"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const mongoconnect_1 = require("../config/mongoconnect");
const help_1 = require("soap-models/dist/help");
const soap_models_1 = require("soap-models");
const authorization_middleware_1 = require("../middleware/authorization.middleware");
const router = (0, express_1.Router)();
router.get('/help', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const helpCol = mongoconnect_1.collections.help;
    if (helpCol) {
        let level = 0;
        const cursor = yield helpCol.find({});
        const pages = yield cursor.toArray();
        const list = [];
        pages.forEach(p => {
            const page = new help_1.Page(p);
            if ((level === 0 && !page.hasPermission(soap_models_1.Permissions.site)
                && !page.hasPermission(soap_models_1.Permissions.team)
                && !page.hasPermission(soap_models_1.Permissions.admin))
                || (level === 1 && !page.hasPermission(soap_models_1.Permissions.team)
                    && !page.hasPermission(soap_models_1.Permissions.admin))
                || (level === 2 && !page.hasPermission(soap_models_1.Permissions.admin))
                || level === 4) {
                list.push(page);
            }
        });
        list.sort((a, b) => a.compareTo(b));
        return res.status(200).json(list);
    }
    else {
        return res.status(404).send('No Help Collection');
    }
}));
router.get('/help/:level', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const helpCol = mongoconnect_1.collections.help;
    if (helpCol) {
        let lvl = req.params['level'];
        let level = 0;
        if (lvl) {
            level = Number(lvl);
        }
        const cursor = yield helpCol.find({});
        const pages = yield cursor.toArray();
        const list = [];
        pages.forEach(p => {
            const page = new help_1.Page(p);
            if ((level === 0 && !page.hasPermission(soap_models_1.Permissions.site)
                && !page.hasPermission(soap_models_1.Permissions.team)
                && !page.hasPermission(soap_models_1.Permissions.admin))
                || (level === 1 && !page.hasPermission(soap_models_1.Permissions.team)
                    && !page.hasPermission(soap_models_1.Permissions.admin))
                || (level === 2 && !page.hasPermission(soap_models_1.Permissions.admin))
                || level === 4) {
                list.push(page);
            }
        });
        list.sort((a, b) => a.compareTo(b));
        return res.status(200).json(list);
    }
    else {
        return res.status(404).send('No Help Collection');
    }
}));
router.post('/help', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const helpCol = mongoconnect_1.collections.help;
    if (helpCol) {
        const cursor = yield helpCol.find({});
        const pages = yield cursor.toArray();
        // get the highest page number and create a new page with no title or 
        // any other data, with a page number one higher than last.
        let max = 0;
        pages.forEach(p => {
            if (p.page > max) {
                max = p.page;
            }
        });
        const newpage = new help_1.Page({
            page: max + 1,
            header: '',
            subheader: '',
            paragraphs: []
        });
        const add = yield helpCol.insertOne(newpage);
        newpage.id = add.insertedId.toString();
        return res.status(201).json(newpage);
    }
    else {
        return res.status(404).send('No Help Collection');
    }
}));
router.post('/help/graphic', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const helpCol = mongoconnect_1.collections.help;
    if (helpCol) {
        const update = req.body;
        const query = { _id: new mongodb_1.ObjectId(update.pageid) };
        const ipage = yield helpCol.findOne(query);
        let page = new help_1.Page();
        if (ipage) {
            ipage.paragraphs.forEach(para => {
                if (para.id === update.paragraphid) {
                    let max = 0;
                    if (para.graphics && para.graphics.length) {
                        para.graphics.forEach(image => {
                            if (image.id > max) {
                                max = image.id;
                            }
                        });
                    }
                    if (!para.graphics) {
                        para.graphics = [];
                    }
                    para.graphics.push(new help_1.Graphic({
                        id: max + 1,
                        mimetype: update.value,
                        caption: update.field,
                        filedata: update.filedata
                    }));
                }
            });
            page = new help_1.Page(ipage);
        }
        yield helpCol.replaceOne(query, page);
        return res.status(200).json(page);
    }
    else {
        return res.status(404).send('No Help Collection');
    }
}));
router.put('/help', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const helpCol = mongoconnect_1.collections.help;
    if (helpCol) {
        const update = req.body;
        const query = { _id: new mongodb_1.ObjectId(update.pageid) };
        const ipage = yield helpCol.findOne(query);
        let page = new help_1.Page();
        if (ipage) {
            if (update.paragraphid) {
                let pfound = -1;
                ipage.paragraphs.forEach((para, p) => {
                    if (para.id === update.paragraphid) {
                        if (update.bulletid) {
                            if (para.bullets) {
                                let found = -1;
                                para.bullets.forEach((bullet, b) => {
                                    if (bullet.id === update.bulletid) {
                                        if (update.field.toLowerCase() === 'delete') {
                                            found = b;
                                        }
                                        else {
                                            bullet.text = update.value;
                                            para.bullets[b] = bullet;
                                        }
                                    }
                                });
                                if (found >= 0) {
                                    para.bullets.splice(found, 1);
                                }
                            }
                        }
                        else if (update.graphicid) {
                            if (para.graphics) {
                                let found = -1;
                                para.graphics.forEach((graph, g) => {
                                    if (graph.id === update.graphicid) {
                                        if (update.field.toLowerCase() === 'delete') {
                                            found = g;
                                        }
                                        else {
                                            graph.caption = update.value;
                                            para.graphics[g] = graph;
                                        }
                                    }
                                });
                                if (found >= 0) {
                                    para.graphics.splice(found, 1);
                                }
                            }
                        }
                        else {
                            switch (update.field.toLowerCase()) {
                                case "title":
                                    para.title = update.value;
                                    break;
                                case "text":
                                    const textArray = [];
                                    let start = 0;
                                    while (start < update.value.length) {
                                        const s = update.value.substring(start, start + 80);
                                        textArray.push(s);
                                        start += 80;
                                    }
                                    para.text = textArray;
                                    break;
                                case "addbullet":
                                    if (!para.bullets) {
                                        para.bullets = [];
                                    }
                                    let max = 0;
                                    para.bullets.forEach(bullet => {
                                        if (bullet.id > max) {
                                            max = bullet.id;
                                        }
                                    });
                                    para.bullets.push(new help_1.Bullet({
                                        id: max + 1,
                                        text: update.value
                                    }));
                                    break;
                                case "delete":
                                    pfound = p;
                            }
                        }
                        ipage.paragraphs[p] = para;
                    }
                });
                if (pfound >= 0) {
                    if (ipage.paragraphs && ipage.paragraphs.length > 0) {
                        ipage.paragraphs.splice(pfound, 1);
                    }
                }
            }
            else {
                switch (update.field.toLowerCase()) {
                    case "page":
                        ipage.page = Number(update.value);
                        break;
                    case "header":
                        ipage.header = update.value;
                        break;
                    case "subheader":
                        ipage.subheader = update.value;
                        break;
                    case "permission":
                    case "admin":
                        ipage.permission = Number(update.value);
                        break;
                    case "add":
                    case "addparagraph":
                        let max = 0;
                        if (ipage.paragraphs && ipage.paragraphs.length > 0) {
                            ipage.paragraphs.forEach(para => {
                                if (para.id > max) {
                                    max = para.id;
                                }
                            });
                        }
                        else if (!ipage.paragraphs) {
                            ipage.paragraphs = [];
                        }
                        ipage.paragraphs.push(new help_1.Paragraph({
                            id: max + 1,
                            title: '',
                            text: []
                        }));
                        break;
                }
            }
            page = new help_1.Page(ipage);
        }
        yield helpCol.replaceOne(query, page);
        return res.status(200).json(page);
    }
    else {
        return res.status(404).send('No Help Collection');
    }
}));
router.delete('/help/:id', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const helpCol = mongoconnect_1.collections.help;
    if (helpCol) {
        const id = new mongodb_1.ObjectId(req.params.id);
        const query = { _id: id };
        yield helpCol.deleteOne(query);
        return res.status(200).json('{"message": "Deleted"}');
    }
    else {
        return res.status(404).send('No Help Collection');
    }
}));
exports.default = router;
