"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_controller_1 = require("../controllers/invoice.controller");
const router = (0, express_1.Router)();
router.post('/invoices', invoice_controller_1.createInvoice);
router.get('/invoices', invoice_controller_1.getInvoices);
exports.default = router;
