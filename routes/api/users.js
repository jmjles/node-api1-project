const Express = require("express");
const UserRoute = Express.Router();
const db = require("../../data/db");

const getUsers = () => db.find();

const getUser = id => db.findById(id);

const addUser = user => db.insert(user);

const deleteUser = id => db.remove(id);

const updateUser = (id, user) => db.update(id, user);

UserRoute.get("/", async (req, res) => {
  try {
    res.status(200).json(await getUsers());
  } catch {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  }
});

UserRoute.post("/", async (req, res) => {
  try {
    if (!req.body.name || !req.body.bio)
      throw new Error(
        res
          .status(400)
          .json({ errorMessage: "Please provide name and bio for the user." })
      );
    const user = {
      name: req.body.name,
      bio: req.body.bio
    };
    addUser(user);
    res.status(201).json(await getUsers());
  } catch {
    res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
  }
});

UserRoute.get("/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (user === undefined)
      throw new Error(
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." })
      );
    res.status(200).json(user);
  } catch {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be retrieved." });
  }
});

UserRoute.delete("/:id", async (req, res) => {
  try {
    const deletions = await deleteUser(req.params.id);
    console.log(deletions)
    if (deletions === 0)
      throw new Error(res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." }));
    res.status(201).json(await getUsers());
  } catch {
    res.status(500).json({ errorMessage: "The user could not be removed" });
  }
});

UserRoute.put("/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    const changeUser = req.body;
    if (!user)
      throw new Error(
        res
          .status(400)
          .json({ message: "The user with the specified ID does not exist." })
      );
    else if (!changeUser.name || !changeUser.bio)
      throw new Error(
        res
          .status(400)
          .json({ errorMessage: "Please provide name and bio for the user." })
      );
    await updateUser(req.params.id,changeUser)
    res.status(200).json(await getUsers());
  } catch {
    throw new Error (res
      .status(500)
      .json({ errorMessage: "The user information could not be modified." }));
  }
});
module.exports = UserRoute;
