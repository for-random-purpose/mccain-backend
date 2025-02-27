const cloudinary = require('../config/cloudinary');
const ClientRepository = require('../repositories/clientRepository');

const clientController = {

    getClientsLocally: async (req, res) => {
        try {
            
            return await ClientRepository.getAllClients();
        } catch (error) {
            return error;        }
    },

    renderRegister: async (req, res) => {
        try {
            res.render('user/register', { isAuthenticated })
        } catch(e) {
            res.json({msg: "err"})
            // statements
            console.log(e);
        }
    },

    renderApproved: async(req, res) => {
        try {
            
            const clients = await ClientRepository.getAllClients();
            res.render('user/approvedUsers', { users: clients, isAuthenticated: req.session.isAuthenticated })
        } catch(e) {
            res.json({err: "err"})
            console.log(e);
        }
    },

    addClient: async (req, res) => {
      

        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'mccain_optimized_images',
                transformation: [
                  { width: 250, crop: "scale" },
                  { quality: "auto" },
                  { fetch_format: "auto" }
              ]});
            
            const newClient = {
                name: req.body.name.toUpperCase(),
                age: req.body.age,
                phone: req.body.phone,
                passportNumber: req.body.passportNumber,
                photo: result.secure_url,
                publicId: result.public_id,
                status: req.body.status,
            };
            const client = await ClientRepository.createClient(newClient);
            res.json({data: client});
        } catch (error) {
          console.log(error)
            res.status(500).json({ message: 'Error adding client', error });
        }
    },

    getClients: async (req, res) => {
        try {
            const clients = await ClientRepository.getAllClients();
            // res.render('index', { clients, isAuthenticated: req.session.isAuthenticated });
            res.json({ data: clients });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching clients', error });
        }
    },

    updateClient: async (req, res) => {
        try {
          
            const client = await ClientRepository.getClientById(req.params.id);
            await cloudinary.uploader.destroy(client.publicId);  // Assuming photo is the public_id
           console.log(req.file)
            const result = await cloudinary.uploader.upload(req.file.path);
            const newClient = {
                name: req.body.name.toUpperCase(),
                age: req.body.age,
                phone: req.body.phone,
                passportNumber: req.body.passportNumber,
                publicId: result.public_id,
                photo: result.secure_url,
                status: req.body.status
            };
            const updatedClient = await ClientRepository.updateClient(req.params.id, newClient);
            const clients = await ClientRepository.getAllClients();
            res.json({ data: clients });
        } catch (error) {
          console.log(error)
            res.status(500).json({ message: 'Error updating client', error });
        }
    },

    deleteClient: async (req, res) => {
        try {
            const client = await ClientRepository.getClientById(req.params.id);
            await cloudinary.uploader.destroy(client.publicId);  // Assuming photo is the public_id
            await ClientRepository.deleteClient(req.params.id);
            res.status(200).json({ message: 'Client deleted successfully', isDeleted: true });
        } catch (error) {
          console.log(error)
            res.status(500).json({ message: 'Error deleting client', error, isDeleted: false });
        }
    }
};

module.exports = clientController;
