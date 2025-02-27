const Admin = require('../models/agent');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();


const jwt = require("jsonwebtoken")

const authController = {
    login: async (req, res) => {
        const { username, password } = req.body;
          console.log(username, password)
        try {
            // Find the agent by username
            const agent = await Admin.findOne({ username });
            if (!agent) {
                req.flash('error_msg', 'username not found');
              // return res.status(401).redirect('/approved');
              return res.status(401).json({ message: 'username not found'});
            }

            // Validate the password
            const isMatch = await agent.comparePassword(password);
            if (!isMatch) {
              console.log("Beyene")
              req.flash('error_msg', 'Invalid username or password');
              return res.status(401).json({ message: 'Invalid username or password'});
                //return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: agent._id, username: agent._id }, process.env.JWT_SECRET, { expiresIn: '6969h' })
            const user = { id: agent._id }
            res.status(200).json({ token, user })

        } catch (error) {
          console.log(error)
            res.status(500).json({ error: 'server error'});
        }
    },

    logout: (req, res) => {
      req.session.destroy()
        res.status(200).redirect('/approved');
    },

    createAgent: async (req, res) => {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            console.log("error in validate")
            req.flash('error_msg', 'All fields are required');
            return res.status(400).json({msg: '/create-agent'});
        }

        try {
            // Check if the username already exists
            const existingAgent = await Admin.findOne({ username });
            if (existingAgent) {
              console.log('user exists')
                req.flash('error_msg', 'Username already exists');
                return res.status(400).redirect('/create-agent');
            }
            
            // Create and save the new agent
            const newAgent = new Admin({ username, password });
            await newAgent.save();
              console.log('user created')

            req.flash('success_msg', 'Agent created successfully');
            res.status(201).json({msg: 'created'});
        } catch (error) {
            console.error(error);
            req.flash('error_msg', 'Failed to create agent');
            res.status(500).json({msg: 'err createing agent'});
        }
    }
};

module.exports = authController;
