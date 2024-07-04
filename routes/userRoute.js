//Les biblio necessaires
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('../middleware/auth');

//Creation express router
const route = express.Router();
//Importation du Model
const userModel = require('../models/userModel');

//Creation la route d enregistrement nouvel utilisateur
route.post("/register", async (req, res) => {

    try {
        const { name, email, password } = req.body;
        //verification donnes utilisateur obligatoires
        if (!name || !email || !password) {
            return res.json({ message: 'Merci de renseigner tout le detail' })
        }

        //verifie si  user  existe deja ou pas
        const userExist = await userModel.findOne({ email: req.body.email });
        if (userExist) {
            return res.json({ message: 'Utilisateur deja existant' })
        }
        //cryptage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;
        const user = new userModel(req.body);
        await user.save();

        ////////////////////////////

        const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        res.cookie('token',token,{httpOnly:true,
            samSite:"None",secure:false, 
            maxAge:48 * 60 * 60 *1000,});
        return res.json({ success: true, message: 'User enregistré avec succès', data: user });    
    
    } catch (error) {
        return res.json({ error: error });
    }

})
//Creatiom de la route login 
route.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        //Check emptyness of the incoming data
        if (!email || !password) {
            return res.json({ message: 'Merci de renseigner tout le detail' })
        }
        //Check if the user already exist or not
        const userExist = await userModel.findOne({email:req.body.email});
        if(!userExist){
            return res.json({message:'email N`existe pas'})
        }
        //verification mot de passe
        const isPasswordMatched = await bcrypt.compare(password,userExist.password);
        if(!isPasswordMatched){
            return res.json({message:'mot de passe errone'});
        }
        const token = await jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        return res.cookie({"token":token}).json({token:token,success:true,message:'connexion reussi'})
    } catch (error) {
        return res.json({ error: error });
    }

})

//Creation routes user pour lister tous les utilisateurs 
route.get('/users', isAuthenticated, async (req, res) => {
    try {
        const user = await userModel.find();
        if (!user) {
            return res.json({ message: 'utilisateur introuvable' })
        }
        return res.json({ user: user })
    } catch (error) {
        return res.json({ error: error });
    }
})

module.exports = route;