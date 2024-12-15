const express = require('express');
const clientController = require('../controllers/clientController');
const multer = require('multer');
const upload = require('../middleware/multer.js');
const verifyToken = require('../middleware/verifyToken.js'); // Import session middleware

const router = express.Router();

// Protect routes with isAuthenticated
router.get('/', clientController.getClients);
router.get('/register', clientController.renderRegister);
router.get('/approved', clientController.renderApproved);

router.post('/clients', verifyToken, upload.single('photo'), clientController.addClient);
router.put('/clients/:id', verifyToken, upload.single('photo'), clientController.updateClient);
router.delete('/clients/:id', verifyToken, clientController.deleteClient);

module.exports = router;