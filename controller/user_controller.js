const { createClient } = require('@supabase/supabase-js');
var bcrypt = require('bcrypt');

// Create a single supabase client for interacting with your database
const supabase = createClient('https://glgstqzzgsphcuiroyzd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsZ3N0cXp6Z3NwaGN1aXJveXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0NjQwMDYsImV4cCI6MjAzMjA0MDAwNn0.b1Yq43LmjknZig-1N7Zdi1WZonBFQIONUMlNWKSyhGk')



const insertUser = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    const { data, error1 } = await supabase.schema("public").from("users").select("*").eq("user_name", user_name);
    if (error1)
      res.json({ "statuscode": 400, "message": "Something went wrong" });

    if (data.length === 0) {
      bcrypt.genSalt(10, async function (err, salt) {
        if (err)
          res.json({ "statuscode": 400, "message": "Password hashing failed" });

        bcrypt.hash(password, salt, async function (err, hash) {
          if (err) {
            res.json({ "statuscode": 400, "message": "Password hashing failed" });
          } else {
            const { data, error } = await supabase.schema("public").from("users").insert(
              {
                "user_name": user_name,
                "password": hash
              }
            );
            if (error) {
              res.json({ "statuscode": 500, "message": "Something went wrong" });
            } else {
              res.json({
                "statuscode": 200,
                "message": "User added successfully"
              });
            }
          }
        });
      });
    } else {
      res.json({
        "statuscode": 400,
        "message": "User already exist"
      });
    }

  } catch (error) {
    console.log("error", error);
    res.status(500).send("Internal Server Error");
  }
};

const getTodoList = async (req, res) => {
  try {
    if (!req.body.userid) {
      res.status(500).json({
        "statuscode": 500,
        "message": "userid is requied"
      });
    } else {
      const { userid } = req.body;
      const { data, error1 } = await supabase.schema("public").from("todo").select("*").eq("userId", userid);
      if (error1) {
        res.json({ "statuscode": 500, "message": "Something went wrong" });
      } else {
        if (data.length === 0) {
          res.status(404).json({
            "statuscode": 404,
            "message": "Todo Not Found",
            "data": []
          });
        } else {
          res.status(200).json({
            "statuscode": 200,
            "message": "Todo fetched successfully",
            "data": data
          });
        }
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Internal Server Error");
  }
}

const deleteTodo = async (req, res) => {
  try {
    if (!req.body.id && !(req.body.id === 0)) {
      res.status(500).json({
        "statuscode": 500,
        "message": "id is requied"
      });
    } else {
      const { id } = req.body;
      const { error1 } = await supabase.schema("public").from("todo").delete().eq("id", id);
      if (error1) {
        res.json({ "statuscode": 500, "message": "Something went wrong" });
      } else {

        res.status(200).json({
          "statuscode": 200,
          "message": "Todo deleted successfully"
        });

      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Internal Server Error");
  }
}

const insertTodoList = async (req, res) => {
  try {
    if (!req.body.userid) {
      res.status(500).json({
        "statuscode": 500,
        "message": "userid is requied"
      });
    }
    else if (!req.body.task) {
      res.status(500).json({
        "statuscode": 500,
        "message": "task is requied"
      });
    }
    else {
      const { userid, task } = req.body;
      const { data, error1 } = await supabase.schema("public").from("todo").insert({
        "task": task,
        "userId": userid
      });
      if (error1) {
        res.json({ "statuscode": 500, "message": "Something went wrong" });
      } else {

        res.status(200).json({
          "statuscode": 200,
          "message": "Todo added successfully",
        });

      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Internal Server Error");
  }
}

const updateTodo = async (req, res) => {
  try {
    if (!req.body.isDone && !(req.body.isDone === false)) {
      res.status(500).json({
        "statuscode": 500,
        "message": "isDone is requied"
      });
    }
    else if (!req.body.task) {
      res.status(500).json({
        "statuscode": 500,
        "message": "task is requied"
      });
    } else if (!req.body.id) {
      res.status(500).json({
        "statuscode": 500,
        "message": "id is requied"
      });
    }
    else {
      const { id, task, isDone } = req.body;
      const { data, error1 } = await supabase.schema("public").from("todo").update({
        "task": task,
        "isDone": isDone
      }).eq("id", id);
      if (error1) {
        res.json({ "statuscode": 500, "message": "Something went wrong" });
      } else {

        res.status(200).json({
          "statuscode": 200,
          "message": "Todo updated successfully",
        });

      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Internal Server Error");
  }
}


const loginUser = async (req, res) => {
  try {

    if (!req.body.user_name && !req.body.password) {
      res.status(500).json({
        "statuscode": 500,
        "message": "user_name & password are requied"
      });
    } else if (!req.body.user_name) {
      res.status(500).json({
        "statuscode": 500,
        "message": "user_name is requied"
      });
    } else if (!req.body.password) {
      res.status(500).json({
        "statuscode": 500,
        "message": "password is requied"
      });
    } else {
      const { user_name, password } = req.body;
      const { data, error1 } = await supabase.schema("public").from("users").select("*").eq("user_name", user_name);
      if (error1) {
        res.json({ "statuscode": 500, "message": "Something went wrong" });
      } else {
        if (data.length === 0) {
          res.status(404).json({
            "statuscode": 404,
            "message": "User Not Found"
          });
        } else {
          bcrypt.compare(password, data[0]["password"], (err, result) => {
            if (err) {
              res.status(500).json({ "statuscode": 500, "message": "Comparing Password failed" });
            }

            if (result) {
              res.json({
                "statuscode": 200,
                "data": {
                  "id": data[0]["id"],
                  "created_at": data[0]["created_at"],
                  "user_name": data[0]["user_name"]
                },
                "message": "User fetched successfully"
              });
            } else {
              res.status(400).json({
                "statuscode": 400,
                "message": "Incorrent Password"
              });
            }
          });
        }
      }
    }

  } catch (error) {
    console.log("error", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { insertUser, loginUser, getTodoList, insertTodoList, updateTodo, deleteTodo }; 