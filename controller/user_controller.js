const { createClient } = require('@supabase/supabase-js');
var bcrypt = require('bcrypt');

// Create a single supabase client for interacting with your database
const supabase = createClient('https://glgstqzzgsphcuiroyzd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsZ3N0cXp6Z3NwaGN1aXJveXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NjQwMDYsImV4cCI6MjAzMjA0MDAwNn0.b1Yq43LmjknZig-1N7Zdi1WZonBFQIONUMlNWKSyhGk')


// async function getAllUser(res) {
//     const { data, error } = await supabase.from("users").select('*');
    
//     if (error) {
//       console.error('Error fetching data:', error);
//       return;
//     }
//     res.send(data);
//     console.log('Fetched data:', data);
//   }

  const   getAllUser = async (req, res) => {
    try {
        const { data, error1 } = await supabase.schema("public").from("users").select("*");
      if (error1) {
        res.json({"status":500 });
      } else {
        res.json({
          "statuscode":200,
          "data":data,
          "message":"All User fetched successfully"
        });
      }
    } catch (error) {
        console.log("error" ,error );
      res.status(500).send("Internal Server Error");
    }
  };


  const   insertUser = async (req, res) => {
    try {
     const {user_name,password}= req.body;
     const { data, error1 } = await supabase.schema("public").from("users").select("*").eq("user_name",user_name);
     if (error1) 
      res.json({"statuscode":400,"message":"Something went wrong"});

    if (data.length===0) {
      bcrypt.genSalt(10,async function(err, salt) {
        if (err) 
          res.json({"statuscode":400,"message":"Password hashing failed"});
    
        bcrypt.hash(password, salt,async function(err, hash) {
           if (err) {
            res.json({"statuscode":400,"message":"Password hashing failed"});
           } else {
           const { data, error } = await supabase.schema("public").from("users").insert(
            {
              "user_name":user_name,
              "password":hash
            }
          );
        if (error) {
          res.json({"statuscode":500,"message":"Something went wrong" });
        } else {
          res.json({
            "statuscode":200,
            "message": "User added successfully"});
        }
           }
        });
      });
    }else{
      res.json({
        "statuscode":400,
        "message": "User already exist"});
    }
        
    } catch (error) {
        console.log("error" ,error );
      res.status(500).send("Internal Server Error");
    }
  };


  const   loginUser = async (req, res) => {
    try {
      const {user_name,password} = req.body;
        const { data, error1 } = await supabase.schema("public").from("users").select("*").eq("user_name",user_name);
      if (error1) {
        res.json({"statuscode":500,"message":"Something went wrong"});
      } else {
        if (data.length===0) {
          res.json({
            "statuscode":404,
            "message":"User Not Found"
          });
        } else {
          bcrypt.compare(password, data[0]["password"], (err, result) => {
            if (err) {
              res.json({"statuscode":500,"message":"Comparing Password failed"});
            }

            if (result) {
              res.json({
                "statuscode":200,
                "data":data[0],
                "message":"User fetched successfully"
              });
            } else {
              res.json({
                "statuscode":400,
                "message":"Incorrent Password"
              });
            }
        });
        }
      }
    } catch (error) {
        console.log("error" ,error );
      res.status(500).send("Internal Server Error");
    }
  };

  module.exports = { getAllUser,insertUser,loginUser}; 