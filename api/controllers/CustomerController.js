const db = require("../Models/index");
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const customer = require("../Models/customer");

dotenv.config();
const Customer = db.customers;



 const  signUp = async (req, res)=>{

     const {first_name, last_name, phone_number, password, birthdate} = req.body;        

     if (!password) {
        return res.status(400).send({msg: " password is required"})
     }

     if (!req.file) {
        return res.status(400).send({msg : " img is required"})
     }
     const picture = req.file.path;

    Customer.create({
        first_name,
        last_name,
        phone_number,
        password: await bcrypt.hash(password, 10),
        birthdate,
        picture }).then((data)=>{

       res.send({data});

    }).catch(({errors})=>{
      
       return res.status(400).send({msg : errors[0].message});
    }); 

}


const  login = async (req, res)=>{

   const {phone_number, password} = req.body;        

   if (!password || !phone_number) {

      return res.status(400).send({msg: " please enter your credentials"})

   }

   try {
    

      const customer = await Customer.findOne({ where:{phone_number} });
     

      if (customer == null) {


         throw new Error("wrong credentials");
         
      }
      else{

         const check = await bcrypt.compare(password, customer.password);
         if (!check) {
            
            throw new Error("wrong credentials");
         }
         else{
            const {customer_id, first_name} = customer;


            const token = jwt.sign({customer_id, first_name}, process.env.SECRET, { expiresIn: '3d' });
            res.status(200).send({msg: "logged in", token});

         }



      }

   } catch (error) {

      
      return res.status(401).send({msg: error.message})
   }

}


const deleteCustomer = async (req, res)=>{


   const token = req.headers.authorization;
   if(!token)
   {
      return res.status(401).send({msg:"not authorized"})

   }


   try {

      
   const decodedToken = jwt.verify(token, process.env.SECRET);

   const customer_id = decodedToken.customer_id;
      
      const customer = await Customer.findByPk(customer_id);

      if (!customer) 
      {
          throw new Error("customer not found");
      }
      else{
         customer.destroy();
         res.status(202).send({msg: "customer has been deleted successfully"});

      }


   } catch (error) {

     return res.status(401).send({msg: error.message});
      
   }



}

const update = async (req, res)=>
{
   const token = req.headers.authorization;
   if(!token)
   {
      return res.status(401).send({msg:"not authorized"})

   }


   const {first_name, last_name, phone_number, birthdate} = req.body; 
       

   const file = req.file;
   var picture;
   if (file) {
      picture = file.path;
   }

      try {
         const decodedToken = jwt.verify(token, process.env.SECRET);

         const customer_id = decodedToken.customer_id;
            
            const customer = await Customer.findByPk(customer_id);
            if (!customer) 
            {
                throw new Error("customer not found");
            }
            else{

               if (first_name) {
               customer.first_name = first_name;
                }
               if (last_name) {
                  customer.last_name = last_name;
                     }
                     if (phone_number) {
                        const existingCustomer = await Customer.findOne({ where: { phone_number } });
                          if (existingCustomer && existingCustomer.customer_id !== customer.customer_id) {
                                   return res.status(400).json({ error: 'phone number is already taken' });
                        }
                        else{
                           customer.phone_number = phone_number;

                        }
                     }
                        if (birthdate) {
                           customer.birthdate = birthdate;
                           }
                           if (picture) {
                              customer.picture = picture;
                              }


                          }

                           await customer.save();
                           res.status(200).send({msg: "customer has been updated", customer});

                        }
       catch (error) {
        return res.status(401).send({msg: error.message});

      }
}

// reset password





// forget password, should we add email?, whatsapp api?, telegram api?





module.exports = {signUp, login, deleteCustomer, update};