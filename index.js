
const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config({Bucket: true})
const port = process.env.PORT  || 5000 ;

app.use(cors({
 origin: ['http://localhost:5173'],
}))

app.use(express.json())
const username = process.env.USER_NAME;  // Fixed variable name
const password = process.env.USER_PASSWORD;  // Fixed variable name
console.log(username, password);


const uri = `mongodb+srv://${username}:${password}@cluster0.raemxbz.mongodb.net/?retryWrites=true&w=majority`;  // Fixed interpolation
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    
    const database = client.db("taskMangement");
    const userTaskCollection = database.collection("Usersalltask");

// user Task get  find
app.get('/userTaskGet',async(req,res)=>{
  const result = await userTaskCollection.find().toArray()
  res.send(result)
})


 // user Task insert
 app.post('/userTaskAdd', async (req, res) => {
  const taskInfos = req.body;

  // Check if there are tasks to insert
  if (taskInfos && taskInfos.length > 0) {
    const flattenedTasks = taskInfos.map(taskInfo => ({
      id: taskInfo.id,
      name: taskInfo.name,
      limit: taskInfo.limit,
      color: taskInfo.color,
      taskIds: taskInfo.taskIds
    }));

    const options = { ordered: true };

    try {
      const result = await userTaskCollection.insertMany(flattenedTasks, options);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    // Handle the case where there are no tasks to insert
    res.status(400).send("No tasks provided for insertion");
  }
});


  // update Data user 
  app.put('/userTaskUpdate/:id', async (req, res) => {
    const taskId = req.params.id;
    const filter = { _id: new ObjectId(taskId) };  // Filter by the ObjectId
    // Assuming req.body contains the update information, modify as needed
    const update = { $set: req.body };  // Use $set to specify the fields to update
  
    try {
      const result = await userTaskCollection.updateOne(filter, update);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensure to close the connection when done
    // await client.close();
  }
}

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

run().catch(console.dir);

